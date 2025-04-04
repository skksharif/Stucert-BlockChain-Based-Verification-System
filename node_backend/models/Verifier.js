const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const VerifierSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  organization: String,
});

// Hash password before saving
VerifierSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Compare passwords
VerifierSchema.methods.comparePassword = async function (enteredPassword) {
  return bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model("Verifier", VerifierSchema);
