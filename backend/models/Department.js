import mongoose from 'mongoose';

const departmentSchema = new mongoose.Schema({
  deptId: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  code: { type: String, required: true },
  description: { type: String }
}, { timestamps: true });

const Department = mongoose.model('Department', departmentSchema);
export default Department;
