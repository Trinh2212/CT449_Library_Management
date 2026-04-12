const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema(
  {
    maSach: { type: Number, unique: true },
    tenSach: {
      type: String,
      required: [true, "Tên sách không được trống"],
      trim: true,
    },
    tacGia: { type: String, required: [true, "Tác giả không được trống"] },
    donGia: Number,
    soQuyen: { type: Number, default: 1 },
    namXuatBan: Number,
    maNXB: { type: Number, ref: "Publisher", required: true },
    hinhAnh: { type: String, default: "" },
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
// chay truoc khi doc duoc luu vao database
bookSchema.pre("save", async function () {
  if (!this.maSach) {
    // neu chua co ma sach
    const lastBook = await mongoose
      .model("Book")
      .findOne()
      .sort({ maSach: -1 });
    this.maSach = lastBook ? lastBook.maSach + 1 : 1;
  }
});

module.exports = mongoose.model("Book", bookSchema);
