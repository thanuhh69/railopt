/**
 * In-Memory Fallback Store for RAILOPT
 * Used automatically if a local MongoDB server is not running, ensuring the prototype never crashes.
 */
import { calculateFallbackPriority } from '../services/priorityEngine.js';

export const memoryDb = {
  users: [
    { id: 'usr-admin-01', email: 'admin@railopt.demo', name: 'Chief Planning Engineer (Admin)', role: 'admin', department: 'Operations Planning' },
    { id: 'usr-field-02', email: 'user@railopt.demo', name: 'Senior Section Engineer (User)', role: 'user', department: 'Engineering Maintenance' }
  ],
  tasks: [],
  corridors: [],
  trains: [],
  blockRequests: [],
  optimizedBlocks: [],
  conflicts: [],
  planningRuns: []
};

// Seed initial in-memory data
export const seedInMemoryStore = () => {
  console.log('[InMemoryStore] Initializing in-memory fallback dataset...');
  memoryDb.tasks = [];
  memoryDb.corridors = [];
  memoryDb.trains = [];
  memoryDb.blockRequests = [];
  memoryDb.optimizedBlocks = [];
  memoryDb.conflicts = [];

  const corridorsList = [
    { corridorId: 'VJA-GNT', from: 'Vijayawada', to: 'Guntur', count: 8 },
    { corridorId: 'NDL-GNT', from: 'Nandyal', to: 'Guntur', count: 6 },
    { corridorId: 'BZA-RU', from: 'Vijayawada', to: 'Renigunta', count: 12 },
    { corridorId: 'SC-KZJ', from: 'Secunderabad', to: 'Kazipet', count: 14 },
    { corridorId: 'VSKP-BZA', from: 'Visakhapatnam', to: 'Vijayawada', count: 10 }
  ];

  const dates = ['2026-09-15', '2026-09-16', '2026-09-17', '2026-09-18', '2026-09-19'];

  corridorsList.forEach((c) => {
    dates.forEach((d) => {
      memoryDb.corridors.push({
        corridorId: c.corridorId,
        fromLocation: c.from,
        toLocation: c.to,
        date: d,
        availableStart: '09:30',
        availableEnd: '16:30',
        trainCount: c.count,
        trafficLevel: c.count > 10 ? 'High' : 'Medium',
        availabilityStatus: 'Available'
      });
    });
  });

  const depts = ['Engineering', 'Traction Distribution', 'Signal & Telecommunication'];
  const sources = ['TMS', 'TDMS', 'SMMS'];
  const mTypes = {
    'Engineering': ['Rail Defect Repair', 'Sleeper Replacement', 'Switch Point Grinding'],
    'Traction Distribution': ['OHE Wire Tensioning', 'Insulator Cleaning', 'Cantilever Alignment'],
    'Signal & Telecommunication': ['Point Machine Calibration', 'Axle Counter Testing', 'Signal Relay Inspection']
  };

  let taskCounter = 1001;

  for (let i = 0; i < 520; i++) {
    const dept = depts[i % 3];
    const source = sources[i % 3];
    const corridor = corridorsList[i % corridorsList.length].corridorId;
    const types = mTypes[dept];
    const mType = types[i % types.length];
    const date = dates[i % dates.length];

    const criticality = Math.floor(Math.random() * 50) + 50;
    const urgency = Math.floor(Math.random() * 50) + 50;
    const assetImpact = Math.floor(Math.random() * 45) + 45;
    const trainImpact = Math.floor(Math.random() * 45) + 45;
    const safetyImpact = Math.floor(Math.random() * 45) + 50;
    const overdueDays = i % 5 === 0 ? Math.floor(Math.random() * 6) + 1 : 0;
    const failureHistory = Math.floor(Math.random() * 3);
    const estDuration = [45, 60, 90, 120][i % 4];

    const prefix = dept === 'Engineering' ? 'ENG' : (dept === 'Traction Distribution' ? 'TR' : 'ST');
    const taskId = `${prefix}-${taskCounter++}`;

    const prio = calculateFallbackPriority({
      criticality, urgency, assetImpact, trainImpact, safetyImpact, overdueDays, failureHistory
    });

    memoryDb.tasks.push({
      taskId,
      department: dept,
      sourceSystem: source,
      assetId: `ASSET-${Math.floor(Math.random() * 800) + 100}`,
      assetName: `${mType} Unit ${i + 1}`,
      corridorId: corridor,
      maintenanceType: mType,
      issueDescription: `Scheduled defect maintenance for ${mType} along corridor line ${corridor}.`,
      criticality,
      urgency,
      assetImpact,
      trainImpact,
      safetyImpact,
      overdueDays,
      failureHistory,
      estimatedDuration: estDuration,
      dueDate: date,
      status: 'Prioritized',
      priorityScore: prio.priorityScore,
      priorityLevel: prio.priorityLevel,
      reasoning: prio.reasoning
    });
  }

  const trainTypes = ['Express', 'Superfast', 'Passenger', 'Freight'];
  const trainNames = ['Guntur Express', 'Simhadri Express', 'Shatabdi Express', 'Garib Rath', 'Pinakini Express'];
  let trainCounter = 12700;

  for (let i = 0; i < 510; i++) {
    const corridor = corridorsList[i % corridorsList.length].corridorId;
    const date = dates[i % dates.length];
    const tType = trainTypes[i % 4];

    const hour = Math.floor(Math.random() * 12) + 7;
    const min = Math.floor(Math.random() * 50);

    memoryDb.trains.push({
      trainNumber: String(trainCounter++),
      trainName: `${trainNames[i % trainNames.length]} ${i + 1}`,
      corridorId: corridor,
      date,
      arrivalTime: `${String(hour).padStart(2, '0')}:${String(min).padStart(2, '0')}`,
      departureTime: `${String(hour).padStart(2, '0')}:${String(min + 12).padStart(2, '0')}`,
      trainType: tType,
      priority: tType === 'Express' || tType === 'Superfast' ? 'High' : 'Medium'
    });
  }

  let reqCounter = 801;
  for (let i = 0; i < 120; i++) {
    const dept = depts[i % 3];
    const corridor = corridorsList[i % corridorsList.length].corridorId;
    const date = dates[i % dates.length];

    memoryDb.blockRequests.push({
      requestId: `REQ-${reqCounter++}`,
      department: dept,
      corridorId: corridor,
      requestedDate: date,
      startTime: '10:00',
      endTime: '12:00',
      duration: 120,
      reason: `Departmental disconnection request for ${dept}`,
      priority: i % 4 === 0 ? 'Critical' : 'High',
      status: 'Pending'
    });
  }

  memoryDb.optimizedBlocks = [
    {
      blockId: 'BLK-2026-001',
      date: '2026-09-15',
      corridorId: 'VJA-GNT',
      startTime: '11:30',
      endTime: '13:00',
      totalDuration: 90,
      departments: ['Engineering', 'Signal & Telecommunication', 'Traction Distribution'],
      tasks: ['ENG-1042', 'ST-3021', 'TR-5012'],
      priorityLevel: 'Critical',
      status: 'Proposed',
      trainConflictsCount: 0,
      corridorConflictsCount: 0,
      deadlineConflictsCount: 0,
      beforeOccupationHours: 3.0,
      afterOccupationHours: 1.5
    }
  ];

  memoryDb.conflicts = [
    {
      conflictId: 'CONF-001',
      corridorId: 'VJA-GNT',
      date: '2026-09-15',
      requestedBlockTime: '10:00–12:00',
      trainId: '12705 (Guntur Express)',
      conflictType: 'Train Conflict',
      description: 'Requested Engineering block (10:00–12:00) overlaps with Express 12705 passage at 10:45.',
      recommendedWindow: '11:30–13:00',
      reasoning: 'Lower train traffic window after Train 12705 departure. Enables multi-department coordination.',
      status: 'Open'
    }
  ];

  console.log('[InMemoryStore] Seeded 520 tasks, 50 corridors, 510 trains, 120 block requests.');
};

seedInMemoryStore();
