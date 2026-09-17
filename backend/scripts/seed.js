import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import connectDB from '../config/db.js';

import User from '../models/User.js';
import MaintenanceTask from '../models/MaintenanceTask.js';
import Corridor from '../models/Corridor.js';
import TrainSchedule from '../models/TrainSchedule.js';
import BlockRequest from '../models/BlockRequest.js';
import OptimizedBlock from '../models/OptimizedBlock.js';
import Conflict from '../models/Conflict.js';
import Department from '../models/Department.js';
import Asset from '../models/Asset.js';
import { calculateFallbackPriority } from '../services/priorityEngine.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

export const runSeedScript = async () => {
  console.log('[Seed] Starting database seeding process...');

  const conn = await connectDB();
  if (!conn || mongoose.connection.readyState !== 1) {
    console.log('[Seed Notice]: Database server offline or IP not whitelisted in MongoDB Atlas. Skipping MongoDB collection wipe and using active In-Memory store.');
    return;
  }

  // Clear existing collections
  await Promise.all([
    User.deleteMany({}),
    MaintenanceTask.deleteMany({}),
    Corridor.deleteMany({}),
    TrainSchedule.deleteMany({}),
    BlockRequest.deleteMany({}),
    OptimizedBlock.deleteMany({}),
    Conflict.deleteMany({}),
    Department.deleteMany({}),
    Asset.deleteMany({})
  ]);

  console.log('[Seed] Cleared existing collections.');

  // 1. Seed Users
  await User.insertMany([
    {
      fullName: 'Chief Planning Engineer (Admin)',
      username: 'admin',
      email: 'admin@railopt.demo',
      password: 'admin123_hashed',
      phone: '+91 98480 12345',
      employeeId: 'EMP-9001',
      department: 'Operations Planning',
      designation: 'Chief Planning Engineer',
      baseCity: 'Vijayawada',
      railwayDivision: 'Vijayawada Division',
      assignedZone: 'Vijayawada Area',
      assignedCorridor: 'VJA-GNT',
      role: 'ADMIN'
    },
    {
      fullName: 'Ravi Kumar',
      username: 'ravikumar',
      email: 'user@railopt.demo',
      password: 'user123_hashed',
      phone: '+91 94401 56789',
      employeeId: 'EMP-1042',
      department: 'Engineering',
      designation: 'Senior Section Engineer',
      baseCity: 'Vijayawada',
      railwayDivision: 'Vijayawada Division',
      assignedZone: 'Vijayawada Area',
      assignedCorridor: 'VJA-GNT',
      role: 'USER'
    }
  ]);

  // 2. Seed Departments
  await Department.insertMany([
    { deptId: 'ENG', name: 'Engineering', code: 'ENG', description: 'Track, Switches, Bridges & Civil Infrastructure' },
    { deptId: 'TRD', name: 'Traction Distribution', code: 'TRD', description: 'Overhead Equipment (OHE), Sub-stations & Power Distribution' },
    { deptId: 'SNT', name: 'Signal & Telecommunication', code: 'SNT', description: 'Interlocking, Point Machines, Axle Counters & Telecommunication' }
  ]);

  // 3. Corridors
  const corridorsList = [
    { corridorId: 'VJA-GNT', from: 'Vijayawada', to: 'Guntur', count: 8, division: 'Vijayawada Division', zone: 'Vijayawada Area', section: 'VJA-GDL' },
    { corridorId: 'NDL-GNT', from: 'Nandyal', to: 'Guntur', count: 6, division: 'Guntur Division', zone: 'Nandyal Zone', section: 'NDL-GNT-02' },
    { corridorId: 'BZA-RU', from: 'Vijayawada', to: 'Renigunta', count: 12, division: 'Vijayawada Division', zone: 'South Coast Corridor', section: 'BZA-RU-01' },
    { corridorId: 'SC-KZJ', from: 'Secunderabad', to: 'Kazipet', count: 14, division: 'Secunderabad Division', zone: 'Secunderabad Area', section: 'SC-KZJ-03' },
    { corridorId: 'VSKP-BZA', from: 'Visakhapatnam', to: 'Vijayawada', count: 10, division: 'Waltair Division', zone: 'Coastal Zone', section: 'VSKP-BZA-05' }
  ];

  const corridorsToSave = [];
  const dates = ['2026-09-15', '2026-09-16', '2026-09-17', '2026-09-18', '2026-09-19'];

  corridorsList.forEach((c) => {
    dates.forEach((d) => {
      corridorsToSave.push({
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

  await Corridor.insertMany(corridorsToSave);

  // 4. Tasks
  const depts = ['Engineering', 'Traction Distribution', 'Signal & Telecommunication'];
  const sources = ['TMS', 'TDMS', 'SMMS'];
  const mTypes = {
    'Engineering': ['Rail Defect Repair', 'Sleeper Replacement', 'Switch Point Grinding'],
    'Traction Distribution': ['OHE Wire Tensioning', 'Insulator Cleaning', 'Cantilever Alignment'],
    'Signal & Telecommunication': ['Point Machine Calibration', 'Axle Counter Testing', 'Signal Relay Inspection']
  };

  const tasksToSave = [];
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

    tasksToSave.push({
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

  await MaintenanceTask.insertMany(tasksToSave);

  // 5. Trains
  const trainsToSave = [];
  const trainTypesList = ['Express', 'Superfast', 'Passenger', 'Freight'];
  const trainNamesList = ['Guntur Express', 'Simhadri Express', 'Shatabdi Express', 'Garib Rath', 'Pinakini Express'];
  let trainCounter = 12700;

  for (let i = 0; i < 510; i++) {
    const corridor = corridorsList[i % corridorsList.length].corridorId;
    const date = dates[i % dates.length];
    const tType = trainTypesList[i % 4];

    const hour = Math.floor(Math.random() * 12) + 7;
    const min = Math.floor(Math.random() * 50);

    trainsToSave.push({
      trainNumber: String(trainCounter++),
      trainName: `${trainNamesList[i % trainNamesList.length]} ${i + 1}`,
      corridorId: corridor,
      date,
      arrivalTime: `${String(hour).padStart(2, '0')}:${String(min).padStart(2, '0')}`,
      departureTime: `${String(hour).padStart(2, '0')}:${String(min + 12).padStart(2, '0')}`,
      trainType: tType,
      priority: tType === 'Express' || tType === 'Superfast' ? 'High' : 'Medium'
    });
  }

  await TrainSchedule.insertMany(trainsToSave);

  console.log('[Seed] Database seeding into MongoDB Atlas completed successfully.');
};

if (import.meta.url === `file://${process.argv[1]}`) {
  runSeedScript()
    .then(() => process.exit(0))
    .catch((err) => {
      console.error('[Seed Error]:', err);
      process.exit(1);
    });
}
