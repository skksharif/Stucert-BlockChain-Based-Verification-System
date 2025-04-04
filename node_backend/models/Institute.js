const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const instituteSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  instituteId: { type: String, required: true, unique: true },
  createdAt: { type: Date, default: Date.now }
});

// Hash password before saving
instituteSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Method to compare passwords
instituteSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('Institute', instituteSchema);