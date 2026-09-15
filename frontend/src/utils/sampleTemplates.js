export const SAMPLE_CSV_TEMPLATES = {
  maintenance: `taskId,department,sourceSystem,assetId,assetName,corridorId,maintenanceType,issueDescription,criticality,urgency,assetImpact,trainImpact,safetyImpact,overdueDays,failureHistory,estimatedDuration,dueDate
ENG-1042,Engineering,TMS,Track-245,Rail Defect Joint,VJA-GNT,Rail Replacement,Severe crack detected on sleeper joint 245,95,88,85,75,90,5,2,90,2026-09-15
ST-3021,Signal & Telecommunication,SMMS,SIG-88,Point Indicator Signal,VJA-GNT,Signal Calibration,Intermittent signaling delay at turnout,78,72,70,80,85,2,1,45,2026-09-15
TR-5012,Traction Distribution,TDMS,OHE-112,Overhead Catenary Wire,VJA-GNT,OHE Inspection,Sagging overhead catenary cable,82,80,75,70,88,4,0,60,2026-09-15`,

  corridor: `corridorId,fromLocation,toLocation,date,availableStart,availableEnd,trainCount,trafficLevel,availabilityStatus
VJA-GNT,Vijayawada,Guntur,2026-09-15,10:00,14:00,4,Medium,Available
NDL-GNT,Nandyal,Guntur,2026-09-15,08:30,12:30,6,High,Available
BZA-RU,Vijayawada,Renigunta,2026-09-15,11:00,15:00,3,Low,Available`,

  trains: `trainNumber,trainName,corridorId,date,arrivalTime,departureTime,trainType,priority
12705,Guntur Intercity,VJA-GNT,2026-09-15,10:35,10:45,Express,High
17239,Simhadri Express,VJA-GNT,2026-09-15,14:15,14:25,Express,High
57305,Guntur Passenger,VJA-GNT,2026-09-15,09:10,09:20,Passenger,Medium`,

  blockRequests: `requestId,department,corridorId,requestedDate,startTime,endTime,duration,reason,priority
REQ-801,Engineering,VJA-GNT,2026-09-15,10:00,12:00,120,Rail Joint Replacement,Critical
REQ-802,Signal & Telecommunication,VJA-GNT,2026-09-15,12:00,13:00,60,Signal Relay Check,Medium
REQ-803,Traction Distribution,VJA-GNT,2026-09-15,14:00,15:00,60,OHE Wire Tensioning,High`
};
