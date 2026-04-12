const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    maDocGia: { type: Number, unique: true },
    hoLot: { type: String, required: true, trim: true },
    ten: { type: String, required: true, trim: true },
    ngaySinh: {
      type: Date,
      set: function (value) {
        if (typeof value === "string" && value.includes("/")) {
          const [day, month, year] = value.split("/");
          return new Date(`${year}-${month}-${day}`);
        }
        return value;
      },
    },
    phai: { type: String, enum: ["Nam", "Nữ", "Khác"], default: "Khác" },
    diaChi: String,
    dienThoai: { type: String,unique: true, required: true, match: /^[0-9]{10}$/ },
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

userSchema.pre("save", async function () {
  if (!this.maDocGia) {
    const lastUser = await mongoose
      .model("User")
      .findOne()
      .sort({ maDocGia: -1 });
    this.maDocGia = lastUser ? lastUser.maDocGia + 1 : 1;
  }
});

module.exports = mongoose.model("User", userSchema);
