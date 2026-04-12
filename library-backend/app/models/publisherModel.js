const mongoose = require("mongoose");

const publisherSchema = new mongoose.Schema(
    {
        maNXB: {type: Number, unique: true},
        tenNXB: {type: String, required: [true, "Tên nhà xuất bản không được trống"], trim: true},
        diaChi: String,
        isDeleted: {type: Boolean, default: false}
    },
    {
        toJSON: {
            transform: function (doc, ret) {
                ret.id = ret._id;
                delete ret._id;
                delete ret.__v;
                return ret
            }
        }
    }
)

publisherSchema.pre("save", async function() {
    if (!this.maNXB) {
        const lastPublisher = await mongoose
         .model("Publisher")
         .findOne()
         .sort({maNXB: -1});
        this.maNXB = lastPublisher ? lastPublisher.maNXB + 1 : 1;
    }
} )

module.exports = mongoose.model("Publisher", publisherSchema);