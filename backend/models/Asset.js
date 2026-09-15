import mongoose from 'mongoose';

const assetSchema = new mongoose.Schema({
  assetId: { type: String, required: true, unique: true },
  assetName: { type: String, required: true },
  department: { type: String, required: true },
  corridorId: { type: String, required: true },
  location: { type: String, required: true },
  status: { type: String, enum: ['OPERATIONAL', 'DEFECTIVE', 'UNDER_MAINTENANCE'], default: 'OPERATIONAL' }
}, { timestamps: true });

const Asset = mongoose.model('Asset', assetSchema);
export default Asset;
