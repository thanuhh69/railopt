import axios from 'axios';

/**
 * Calculates priority score & level using deterministic formula as fallback or primary engine.
 */
export const calculateFallbackPriority = (task) => {
  const criticalityScore = (task.criticality || 50) * 0.30;
  const urgencyScore = (task.urgency || 50) * 0.20;
  const assetImpactScore = (task.assetImpact || 50) * 0.20;
  const trainImpactScore = (task.trainImpact || 50) * 0.15;
  const safetyImpactScore = (task.safetyImpact || 50) * 0.15;

  const overdueBonus = Math.min((task.overdueDays || 0) * 1.5, 10);
  const failureBonus = Math.min((task.failureHistory || 0) * 2, 8);

  let totalScore = Math.round(criticalityScore + urgencyScore + assetImpactScore + trainImpactScore + safetyImpactScore + overdueBonus + failureBonus);
  totalScore = Math.min(Math.max(totalScore, 0), 100);

  let priorityLevel = 'LOW';
  if (totalScore >= 90) priorityLevel = 'CRITICAL';
  else if (totalScore >= 75) priorityLevel = 'HIGH';
  else if (totalScore >= 50) priorityLevel = 'MEDIUM';

  const reasoning = [];
  if (task.criticality >= 80) reasoning.push('High asset criticality score');
  if (task.overdueDays > 0) reasoning.push(`Maintenance is overdue by ${task.overdueDays} days`);
  if (task.safetyImpact >= 75) reasoning.push('Elevated safety impact requirement');
  if (task.trainImpact >= 75) reasoning.push('Substantial train operational impact');
  if (reasoning.length === 0) reasoning.push('Standard routine maintenance priority score');

  return {
    taskId: task.taskId,
    priorityScore: totalScore,
    priorityLevel,
    reasoning
  };
};

/**
 * Evaluates priority via Grok API with structured JSON output, falling back to deterministic calculation on failure.
 */
export const evaluateTaskPriorityWithGrok = async (task) => {
  const apiKey = process.env.GROK_API_KEY;

  if (!apiKey || apiKey.trim() === '' || apiKey.includes('your_grok_api_key_here')) {
    console.log(`[Priority Engine] Grok API key not configured. Using deterministic fallback for task ${task.taskId}`);
    return calculateFallbackPriority(task);
  }

  try {
    const prompt = `You are an expert railway maintenance prioritization engine for RAILOPT.
Analyze the following maintenance task and produce a structured JSON object containing task priority.

TASK DETAILS:
- Task ID: ${task.taskId}
- Department: ${task.department}
- Maintenance Type: ${task.maintenanceType}
- Issue Description: ${task.issueDescription}
- Criticality (0-100): ${task.criticality}
- Urgency (0-100): ${task.urgency}
- Asset Impact (0-100): ${task.assetImpact}
- Train Impact (0-100): ${task.trainImpact}
- Safety Impact (0-100): ${task.safetyImpact}
- Overdue Days: ${task.overdueDays}
- Failure History Count: ${task.failureHistory}

REQUIREMENTS:
1. Return ONLY valid JSON (no markdown block wrapper if possible, or plain JSON).
2. Calculate priorityScore from 0 to 100 based on safety impact, criticality, urgency, overdue days, and train impact.
3. Priority level mapping:
   - 90-100: "CRITICAL"
   - 75-89: "HIGH"
   - 50-74: "MEDIUM"
   - 0-49: "LOW"
4. Include 2 to 4 concise reasoning bullet strings.

JSON Format:
{
  "taskId": "${task.taskId}",
  "priorityScore": 92,
  "priorityLevel": "CRITICAL",
  "reasoning": [
    "High safety impact defect on track line",
    "Maintenance task is overdue by 5 days",
    "High impact on express passenger train timetables"
  ]
}`;

    const response = await axios.post(
      'https://api.x.ai/v1/chat/completions',
      {
        model: process.env.GROK_MODEL || 'grok-2-latest',
        messages: [
          { role: 'system', content: 'You are a precise JSON-only railway optimization assistant. Do not return markdown wrappers or prose.' },
          { role: 'user', content: prompt }
        ],
        temperature: 0.1
      },
      {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        },
        timeout: 8000
      }
    );

    let content = response.data?.choices?.[0]?.message?.content || '';
    content = content.replace(/```json/gi, '').replace(/```/g, '').trim();
    const parsed = JSON.parse(content);

    if (parsed && typeof parsed.priorityScore === 'number' && parsed.priorityLevel) {
      return {
        taskId: task.taskId,
        priorityScore: Math.min(Math.max(parsed.priorityScore, 0), 100),
        priorityLevel: parsed.priorityLevel.toUpperCase(),
        reasoning: Array.isArray(parsed.reasoning) ? parsed.reasoning : ['Evaluated by Grok AI Engine']
      };
    } else {
      throw new Error('Invalid JSON structure from Grok API response');
    }
  } catch (error) {
    console.warn(`[Grok API Evaluation Failed for ${task.taskId}]: ${error.message}. Falling back to deterministic calculation.`);
    return calculateFallbackPriority(task);
  }
};
