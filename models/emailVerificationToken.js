const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const emailVerificationTokenSchema = new mongoose.Schema({
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
  token: {
    type: String,
    required: true,
  },
  createAt: {
    type: Date,
    expires: 3600,
    default: Date.now,
  },
});

emailVerificationTokenSchema.pre("save", async function (next) {
  if (this.isModified("token")) {
    this.token = await bcrypt.hash(this.token, 10);
  }
  next();
});

emailVerificationTokenSchema.methods.compaireToken = async function (token) {
  return await bcrypt.compare(token, this.token);
};

module.exports = mongoose.model(
  "EmailVerificationToken",
  emailVerificationTokenSchema
);
