import mongoose from 'mongoose';

const trainScheduleSchema = new mongoose.Schema({
  trainNumber: { type: String, required: true, index: true },
  trainName: { type: String, required: true },
  corridorId: { type: String, required: true, index: true },
  date: { type: String, required: true, index: true }, // YYYY-MM-DD
  arrivalTime: { type: String, required: true }, // HH:mm
  departureTime: { type: String, required: true }, // HH:mm
  trainType: { type: String, enum: ['Express', 'Superfast', 'Passenger', 'Freight'], default: 'Express' },
  priority: { type: String, enum: ['High', 'Medium', 'Low'], default: 'High' }
}, { timestamps: true });

const TrainSchedule = mongoose.model('TrainSchedule', trainScheduleSchema);
export default TrainSchedule;
