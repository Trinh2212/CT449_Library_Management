const mongoose = require("mongoose");

const AccountSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      match: /^\S+@\S+\.\S+$/,
    },
    password: { type: String, required: true },
    role: { type: String, enum: ["user", "admin"] },
    refId: { type: Number, required: true },
    refModel: { type: String, enum: ["User", "Staff"], required: true },
    isDeleted: { type: Boolean, default: false },
  },
  {
    toJSON: {
      transform: function (doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
        return ret;
      },
    },
  },
);

module.exports = mongoose.model("Account", AccountSchema);
