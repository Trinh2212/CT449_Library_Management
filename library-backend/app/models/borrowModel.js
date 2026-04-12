const mongoose = require("mongoose");

const borrowSchema = new mongoose.Schema(
  {
    borrowerId: {
      type: Number,
      required: true,
      refPath: "onModel", 
    },
    onModel: {
      type: String,
      required: true,
      enum: ["User", "Staff"],
    },
    bookId: {
      type: Number,
      ref: "Book", // tham chiếu cố định
      required: true,
    },
    ngayMuon: { type: Date, default: Date.now },
    hanTra: { type: Date },
    ngayTra: { type: Date },
    status: {
      type: String,
      enum: ["Chờ duyệt", "Đang mượn", "Đã trả", "Từ chối"],
      default: "Chờ duyệt",
    },
    isDeleted: { type: Boolean, default: false },
  },
  {
    timestamps: true,
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

module.exports = mongoose.model("Borrow", borrowSchema);
