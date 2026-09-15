import mongoose from 'mongoose';

const corridorSchema = new mongoose.Schema({
  corridorId: { type: String, required: true, index: true }, // e.g. VJA-GNT
  fromLocation: { type: String, required: true },
  toLocation: { type: String, required: true },
  date: { type: String, required: true, index: true }, // YYYY-MM-DD
  availableStart: { type: String, required: true }, // HH:mm
  availableEnd: { type: String, required: true }, // HH:mm
  trainCount: { type: Number, default: 0 },
  trafficLevel: { type: String, enum: ['High', 'Medium', 'Low'], default: 'Medium' },
  availabilityStatus: { type: String, enum: ['Available', 'Restricted', 'Closed'], default: 'Available' }
}, { timestamps: true });

const Corridor = mongoose.model('Corridor', corridorSchema);
export default Corridor;
