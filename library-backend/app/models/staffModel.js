const mongoose = require("mongoose");

const staffSchema = new mongoose.Schema(
  {
    msnv: { type: Number, unique: true },
    hoTenNV: {
      type: String,
      required: [true, "Họ tên nhân viên không được trống"],
      trim: true,
    },
    chucVu: String,
    diaChi: String,
    soDienThoai: { type: String, unique: true ,required: true, match: /^[0-9]{10}$/ },
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

staffSchema.pre("save", async function () {
  if (!this.msnv) {
    const lastStaff = await mongoose
      .model("Staff")
      .findOne()
      .sort({ msnv: -1 });
    this.msnv = lastStaff ? lastStaff.msnv + 1 : 1;
  }
});

module.exports = mongoose.model("Staff", staffSchema);
