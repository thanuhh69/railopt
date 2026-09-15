/**
 * Converts HH:mm time string to minutes from midnight
 */
const timeToMinutes = (timeStr) => {
  if (!timeStr) return 0;
  const [h, m] = timeStr.split(':').map(Number);
  return h * 60 + m;
};

/**
 * Converts minutes from midnight to HH:mm time string
 */
const minutesToTime = (totalMinutes) => {
  const h = Math.floor(totalMinutes / 60) % 24;
  const m = totalMinutes % 60;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
};

/**
 * Scans tasks, corridors, train schedules, and block requests for operational conflicts.
 */
export const detectConflicts = (blockRequests, trainSchedules, corridors, maintenanceTasks = []) => {
  const conflicts = [];
  let conflictCounter = 1;

  blockRequests.forEach((req) => {
    const reqStart = timeToMinutes(req.startTime);
    const reqEnd = timeToMinutes(req.endTime);

    // 1. Availability Conflict (Corridor Window Check)
    const corridor = corridors.find(c => c.corridorId === req.corridorId && c.date === req.requestedDate);
    if (corridor) {
      const availStart = timeToMinutes(corridor.availableStart);
      const availEnd = timeToMinutes(corridor.availableEnd);

      if (reqStart < availStart || reqEnd > availEnd) {
        conflicts.push({
          conflictId: `CONF-${String(conflictCounter++).padStart(3, '0')}`,
          corridorId: req.corridorId,
          date: req.requestedDate,
          requestedBlockTime: `${req.startTime}–${req.endTime}`,
          conflictType: 'Availability Conflict',
          description: `Requested block (${req.startTime}–${req.endTime}) exceeds corridor availability window (${corridor.availableStart}–${corridor.availableEnd}).`,
          recommendedWindow: `${corridor.availableStart}–${minutesToTime(availStart + req.duration)}`,
          reasoning: 'Aligns request with official corridor maintenance window.',
          status: 'Open'
        });
      }
    }

    // 2. Train Conflict (Overlapping Train Movement)
    const matchingTrains = trainSchedules.filter(t => t.corridorId === req.corridorId && t.date === req.requestedDate);
    matchingTrains.forEach((train) => {
      const trainArr = timeToMinutes(train.arrivalTime);
      const trainDep = timeToMinutes(train.departureTime);

      // Buffer of 10 minutes around train movement
      const trainStartBuf = trainArr - 10;
      const trainEndBuf = trainDep + 10;

      if (reqStart < trainEndBuf && reqEnd > trainStartBuf) {
        // Recommend window after train departure
        const recStart = trainEndBuf + 5;
        const recEnd = recStart + req.duration;

        conflicts.push({
          conflictId: `CONF-${String(conflictCounter++).padStart(3, '0')}`,
          corridorId: req.corridorId,
          date: req.requestedDate,
          requestedBlockTime: `${req.startTime}–${req.endTime}`,
          trainId: `${train.trainNumber} (${train.trainName})`,
          conflictType: 'Train Conflict',
          description: `Maintenance block conflicts with scheduled ${train.trainType} Train ${train.trainNumber} movement between ${train.arrivalTime} and ${train.departureTime}.`,
          recommendedWindow: `${minutesToTime(recStart)}–${minutesToTime(recEnd)}`,
          reasoning: `Lower traffic window following passage of Train ${train.trainNumber} ${train.trainName}.`,
          status: 'Open'
        });
      }
    });

    // 3. Corridor Conflict (Overlapping block requests from different departments)
    const otherReqs = blockRequests.filter(r => r.requestId !== req.requestId && r.corridorId === req.corridorId && r.requestedDate === req.requestedDate);
    otherReqs.forEach((other) => {
      const oStart = timeToMinutes(other.startTime);
      const oEnd = timeToMinutes(other.endTime);

      if (reqStart < oEnd && reqEnd > oStart && req.department !== other.department) {
        conflicts.push({
          conflictId: `CONF-${String(conflictCounter++).padStart(3, '0')}`,
          corridorId: req.corridorId,
          date: req.requestedDate,
          requestedBlockTime: `${req.startTime}–${req.endTime}`,
          conflictType: 'Corridor Conflict',
          description: `Uncoordinated block requests between ${req.department} (${req.startTime}–${req.endTime}) and ${other.department} (${other.startTime}–${other.endTime}).`,
          recommendedWindow: `${minutesToTime(Math.min(reqStart, oStart))}–${minutesToTime(Math.max(reqEnd, oEnd))}`,
          reasoning: 'Combine requests into a single unified multi-department maintenance block.',
          status: 'Open'
        });
      }
    });
  });

  // 4. Deadline Conflict
  maintenanceTasks.forEach((task) => {
    if (task.dueDate && task.status === 'Pending') {
      const today = new Date().toISOString().split('T')[0];
      if (task.dueDate < today) {
        conflicts.push({
          conflictId: `CONF-${String(conflictCounter++).padStart(3, '0')}`,
          corridorId: task.corridorId,
          date: task.dueDate,
          requestedBlockTime: 'Overdue',
          conflictType: 'Deadline Conflict',
          description: `Task ${task.taskId} (${task.department} - ${task.maintenanceType}) is overdue past target date ${task.dueDate}.`,
          recommendedWindow: 'Immediate Block Slot',
          reasoning: 'Critical defect overdue for maintenance attention.',
          status: 'Open'
        });
      }
    }
  });

  return conflicts;
};
