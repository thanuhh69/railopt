/**
 * In-Memory Fallback Store for RAILOPT
 * Used automatically if a local MongoDB server is not running, ensuring the prototype never crashes.
 */
import { calculateFallbackPriority } from '../services/priorityEngine.js';

export const memoryDb = {
  users: [
    {
      id: 'usr-admin-01',
      email: 'admin@railopt.demo',
      name: 'Chief Planning Engineer (Admin)',
      fullName: 'Chief Planning Engineer (Admin)',
      role: 'ADMIN',
      department: 'Operations Planning',
      employeeId: 'EMP-9001',
      designation: 'Chief Planning Engineer',
      phone: '+91 98480 12345',
      baseCity: 'Vijayawada',
      railwayDivision: 'Vijayawada Division',
      assignedZone: 'Vijayawada Area',
      assignedCorridor: 'VJA-GNT'
    },
    {
      id: 'usr-field-02',
      email: 'user@railopt.demo',
      name: 'Ravi Kumar (SSE)',
      fullName: 'Ravi Kumar',
      role: 'USER',
      department: 'Engineering',
      employeeId: 'EMP-1042',
      designation: 'Senior Section Engineer',
      phone: '+91 94401 56789',
      baseCity: 'Vijayawada',
      railwayDivision: 'Vijayawada Division',
      assignedZone: 'Vijayawada Area',
      assignedCorridor: 'VJA-GNT'
    }
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
    { corridorId: 'VJA-GNT', from: 'Vijayawada', to: 'Guntur', count: 8, division: 'Vijayawada Division', zone: 'Vijayawada Area', section: 'VJA-GDL' },
    { corridorId: 'NDL-GNT', from: 'Nandyal', to: 'Guntur', count: 6, division: 'Guntur Division', zone: 'Nandyal Zone', section: 'NDL-GNT-02' },
    { corridorId: 'BZA-RU', from: 'Vijayawada', to: 'Renigunta', count: 12, division: 'Vijayawada Division', zone: 'South Coast Corridor', section: 'BZA-RU-01' },
    { corridorId: 'SC-KZJ', from: 'Secunderabad', to: 'Kazipet', count: 14, division: 'Secunderabad Division', zone: 'Secunderabad Area', section: 'SC-KZJ-03' },
    { corridorId: 'VSKP-BZA', from: 'Visakhapatnam', to: 'Vijayawada', count: 10, division: 'Waltair Division', zone: 'Coastal Zone', section: 'VSKP-BZA-05' }
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
    const corrObj = corridorsList[i % corridorsList.length];
    const corridor = corrObj.corridorId;
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

    const statusList = ['ASSIGNED', 'IN_PROGRESS', 'VERIFICATION_PENDING', 'COMPLETED'];
    const assignedStatus = statusList[i % 4];

    memoryDb.tasks.push({
      taskId,
      title: `${mType} - Section A-${(i % 30) + 1}`,
      department: dept,
      sourceSystem: source,
      assetId: `TRK-${corrObj.from.slice(0, 3).toUpperCase()}-A${(i % 30) + 1}`,
      assetName: `${mType} Unit ${i + 1}`,
      assetType: dept === 'Engineering' ? 'Rail Track & Sleepers' : (dept === 'Traction Distribution' ? 'OHE Catenary Wire' : 'Turnout Signaling Relay'),
      assetCondition: criticality > 80 ? 'Critical Defect - Action Needed' : 'Routine Maintenance Due',
      baseCity: corrObj.from,
      railwayDivision: corrObj.division,
      zone: corrObj.zone,
      corridorId: corridor,
      section: corrObj.section,
      maintenanceLocation: `Track Section A-${(i % 30) + 1}`,
      location: `Track Section A-${(i % 30) + 1}`,
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
      startTime: '10:00',
      endTime: '12:00',
      blockId: `BLK-2026-${String((i % 20) + 1).padStart(3, '0')}`,
      status: assignedStatus,
      priorityScore: prio.priorityScore,
      priorityLevel: prio.priorityLevel,
      assignedUserEmail: 'user@railopt.demo',
      assignedUserName: 'Ravi Kumar (SSE)',
      workInstructions: `Perform step-by-step ${mType}, torque mechanical fasteners, check line gauge alignment, and record post-repair tolerance measurements.`,
      safetyInstructions: 'Ensure catenary overhead power disconnection, apply track circuit shunt flags, and deploy look-out protection before entering section.',
      specialInstructions: 'Perform post-repair ultrasound test on weld joint and log ultrasonic defect readings.',
      rejectionReason: '',
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
      date: '2026-09-17',
      requestedBlockTime: '10:00–12:00',
      trainId: '12705 (Guntur Intercity Express)',
      conflictType: 'Train Conflict',
      severity: 'HIGH',
      description: 'Engineering track block (10:00–12:00) overlaps with Express 12705 passage at 10:45 on VJA-GNT track line 1.',
      recommendedWindow: '11:30–13:00',
      reasoning: 'Shift block by 90 mins to allow Train 12705 passage, then combine Engineering & Signal teams in single window.',
      status: 'Open'
    },
    {
      conflictId: 'CONF-002',
      corridorId: 'VJA-GNT',
      date: '2026-09-17',
      requestedBlockTime: '12:00–13:00',
      trainId: '17226 (Amaravati Express)',
      conflictType: 'Train Conflict',
      severity: 'HIGH',
      description: 'Signal relay testing (12:00–13:00) conflicts with Amaravati Express arrival at Vijayawada Outer at 12:15.',
      recommendedWindow: '13:30–14:30',
      reasoning: 'Reschedule signal disconnection to post-lunch low-density corridor window.',
      status: 'Open'
    },
    {
      conflictId: 'CONF-003',
      corridorId: 'BZA-RU',
      date: '2026-09-17',
      requestedBlockTime: '09:30–11:30',
      trainId: '12711 (Pinakini Express)',
      conflictType: 'Corridor Conflict',
      severity: 'HIGH',
      description: 'Simultaneous single-line maintenance requested by TRD and Engineering on South Coast Corridor.',
      recommendedWindow: '10:30–12:30',
      reasoning: 'Combine TRD catenary repair with track sleeper replacement into unified shadow block.',
      status: 'Open'
    },
    {
      conflictId: 'CONF-004',
      corridorId: 'SC-KZJ',
      date: '2026-09-18',
      requestedBlockTime: '13:00–15:00',
      trainId: '12701 (Garib Rath Express)',
      conflictType: 'Department Conflict',
      severity: 'MEDIUM',
      description: 'Engineering turnout grinding overlaps with S&T switch point calibration at Secunderabad junction.',
      recommendedWindow: '13:00–15:00',
      reasoning: 'Co-ordinate both teams under single 120-min inter-departmental block permission.',
      status: 'Open'
    },
    {
      conflictId: 'CONF-005',
      corridorId: 'NDL-GNT',
      date: '2026-09-18',
      requestedBlockTime: '14:00–16:00',
      trainId: '57305 (Guntur Passenger)',
      conflictType: 'Asset Conflict',
      severity: 'CRITICAL',
      description: 'Bridge 44 girder inspection requires complete isolation of dual track circuit sensors.',
      recommendedWindow: '15:00–17:00',
      reasoning: 'Reroute passenger train via Loop line 2 to grant 120 min exclusive bridge block.',
      status: 'Open'
    },
    {
      conflictId: 'CONF-006',
      corridorId: 'VSKP-BZA',
      date: '2026-09-18',
      requestedBlockTime: '10:00–11:30',
      trainId: '12805 (Jan Shatabdi)',
      conflictType: 'Time Conflict',
      severity: 'HIGH',
      description: 'OHE overhead line washing requested window exceeds available corridor gap between express trains.',
      recommendedWindow: '11:00–12:00',
      reasoning: 'Compress work duration using high-speed OHE maintenance tower car.',
      status: 'Open'
    },
    {
      conflictId: 'CONF-007',
      corridorId: 'VJA-GNT',
      date: '2026-09-19',
      requestedBlockTime: '15:00–16:30',
      trainId: 'Container Freight 6012',
      conflictType: 'Resource Conflict',
      severity: 'MEDIUM',
      description: 'Ballast tamping machine allocated to VJA-GNT simultaneously requested at Guntur yard.',
      recommendedWindow: '16:00–17:30',
      reasoning: 'Stagger tamping machine deployment timetable by 60 minutes.',
      status: 'Open'
    },
    {
      conflictId: 'CONF-008',
      corridorId: 'BZA-RU',
      date: '2026-09-19',
      requestedBlockTime: '08:00–09:00',
      trainId: '12839 (Howrah Mail)',
      conflictType: 'Train Conflict',
      severity: 'HIGH',
      description: 'Track circuit voltage check overlaps with Howrah Mail scheduled 80 km/h section run.',
      recommendedWindow: '09:15–10:15',
      reasoning: 'Delay track circuit test until Howrah Mail clears section block boundary.',
      status: 'Open'
    },
    {
      conflictId: 'CONF-009',
      corridorId: 'SC-KZJ',
      date: '2026-09-19',
      requestedBlockTime: '12:30–13:30',
      trainId: 'Freight Container 9044',
      conflictType: 'Asset Conflict',
      severity: 'LOW',
      description: 'Substation transformer isolation conflicts with heavy freight electric locomotive draw.',
      recommendedWindow: '13:30–14:30',
      reasoning: 'Regulate freight train speed to reduce power draw during transformer inspection.',
      status: 'Open'
    },
    {
      conflictId: 'CONF-010',
      corridorId: 'NDL-GNT',
      date: '2026-09-16',
      requestedBlockTime: '11:00–12:00',
      trainId: '17255 (Narsapur Express)',
      conflictType: 'Time Conflict',
      severity: 'MEDIUM',
      description: 'Axle counter testing duration exceeds safe headway interval for Narsapur Express.',
      recommendedWindow: '12:00–13:00',
      reasoning: 'Grant 60 min block post Narsapur Express crossing at Nandyal station.',
      status: 'Resolved'
    },
    {
      conflictId: 'CONF-011',
      corridorId: 'VSKP-BZA',
      date: '2026-09-16',
      requestedBlockTime: '14:00–15:00',
      trainId: '12842 (Coromandel Express)',
      conflictType: 'Train Conflict',
      severity: 'CRITICAL',
      description: 'Level crossing gate interlocking testing overlaps with high-speed Coromandel Express.',
      recommendedWindow: '15:15–16:15',
      reasoning: 'Mandatory clearance required for superfast passenger corridor.',
      status: 'Resolved'
    },
    {
      conflictId: 'CONF-012',
      corridorId: 'VJA-GNT',
      date: '2026-09-16',
      requestedBlockTime: '16:00–17:00',
      trainId: 'Coal Freight 4011',
      conflictType: 'Corridor Conflict',
      severity: 'LOW',
      description: 'Ultrasonic flaw detector run conflicts with coal freight rake passing Mangalagiri.',
      recommendedWindow: '17:00–18:00',
      reasoning: 'Pass freight rake first to maintain power plant supply timeline.',
      status: 'Resolved'
    }
  ];

  console.log('[InMemoryStore] Seeded 520 tasks, 50 corridors, 510 trains, 120 block requests.');
};

seedInMemoryStore();
