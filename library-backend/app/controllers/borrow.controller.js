const Borrow = require("../models/borrowModel");
const Book = require("../models/bookModel");

const createBorrow = async (req, res) => {
  try {
    const { borrowerId, onModel, bookId } = req.body;

    const book = await Book.findOne({
      maSach: bookId,
      isDeleted: { $ne: true },
    });

    if (!book || book.soQuyen <= 0) {
      return res
        .status(400)
        .json({ message: "Sách đã hết hoặc không tồn tại." });
    }
    const currentBorrows = await Borrow.find({
      borrowerId: borrowerId,
      status: { $in: ["Đang mượn", "Chờ duyệt"] },
      onModel: onModel,
      isDeleted: { $ne: true },
    });

    if (currentBorrows.length >= 3) {
      return res.status(400).json({
        message:
          "Bạn đã đạt giới hạn 3 cuốn sách (bao gồm cả các yêu cầu đang chờ duyệt).",
      });
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const hasOverdueBook = currentBorrows.some((borrow) => {
      if (borrow.status !== "Đang mượn" || !borrow.hanTra) return false;

      const hanTraDate = new Date(borrow.hanTra);
      hanTraDate.setHours(0, 0, 0, 0);

      return today > hanTraDate;
    });

    if (hasOverdueBook) {
      return res.status(400).json({
        message:
          "Bạn đang có sách mượn quá hạn chưa trả. Vui lòng hoàn trả trước khi mượn thêm sách mới.",
      });
    }
    
    const newBorrow = new Borrow({
      borrowerId,
      onModel,
      bookId,
      status: "Chờ duyệt",
    });
    await newBorrow.save();
    book.soQuyen = book.soQuyen - 1;
    await book.save();

    res.status(201).json(newBorrow);
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: "Không thể tạo yêu cầu mượn sách" });
  }
};

const approveBorrow = async (req, res) => {
  try {
    const { id } = req.params;

    const borrow = await Borrow.findById(id);
    if (!borrow)
      return res.status(404).json({ message: "Không tìm thấy phiếu mượn" });

    if (borrow.status !== "Chờ duyệt") {
      return res.status(400).json({ message: "Phiếu này đã được xử lý rồi" });
    }
    const ngayMuon = new Date();
    const hanTra = new Date();
    hanTra.setDate(ngayMuon.getDate() + 7);

    borrow.status = "Đang mượn";
    borrow.ngayMuon = ngayMuon;
    borrow.hanTra = hanTra;

    await borrow.save();

    res.status(200).json({ message: "Duyệt mượn thành công!", data: borrow });
  } catch (error) {
    res.status(500).json({ message: "Lỗi khi duyệt phiếu" });
  }
};

const rejectBorrow = async (req, res) => {
  try {
    const { id } = req.params;

    const borrow = await Borrow.findById(id);
    if (!borrow)
      return res.status(404).json({ message: "Không tìm thấy phiếu" });

    if (borrow.status !== "Chờ duyệt") {
      return res
        .status(400)
        .json({ message: "Chỉ có thể từ chối phiếu đang chờ duyệt" });
    }

    borrow.status = "Từ chối";
    await borrow.save();

    const book = await Book.findOne({ maSach: borrow.bookId });
    if (book) {
      book.soQuyen += 1;
      await book.save();
    }

    res
      .status(200)
      .json({ message: "Đã từ chối yêu cầu và hoàn trả sách vào kho" });
  } catch (error) {
    res.status(500).json({ message: "Lỗi khi từ chối phiếu" });
  }
};

const getBorrowHistoryByUser = async (req, res) => {
  try {
    const borrows = await Borrow.find({
      borrowerId: Number(req.params.userId),
      isDeleted: { $ne: true },
    });
    const User = require("../models/userModel");
    const Staff = require("../models/staffModel");

    const borrowsWithDetails = await Promise.all(
      borrows.map(async (borrow) => {
        const book = await Book.findOne({
          maSach: borrow.bookId,
          // isDeleted: { $ne: true },
        });

        let borrower = null;
        if (borrow.onModel === "User") {
          borrower = await User.findOne({
            maDocGia: borrow.borrowerId,
            // isDeleted: { $ne: true },
          });
        } else if (borrow.onModel === "Staff") {
          borrower = await Staff.findOne({
            msnv: borrow.borrowerId,
            // isDeleted: { $ne: true },
          });
        }

        return {
          ...borrow.toObject(),
          bookId: book,
          borrowerId: borrower,
        };
      }),
    );

    res.status(200).json(borrowsWithDetails);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error retrieving user loan history" });
  }
};

const getAllBorrows = async (req, res) => {
  try {
    const borrows = await Borrow.find({ isDeleted: { $ne: true } });
    const User = require("../models/userModel");
    const Staff = require("../models/staffModel");

    const borrowsWithDetails = await Promise.all(
      borrows.map(async (borrow) => {
        const book = await Book.findOne({
          maSach: borrow.bookId,
          // isDeleted: { $ne: true },
        });

        // Populate borrower based on onModel
        let borrower = null;
        if (borrow.onModel === "User") {
          borrower = await User.findOne({
            maDocGia: borrow.borrowerId,
            // isDeleted: { $ne: true },
          });
        } else if (borrow.onModel === "Staff") {
          borrower = await Staff.findOne({
            msnv: borrow.borrowerId,
            // isDeleted: { $ne: true },
          });
        }

        return {
          ...borrow.toObject(),
          bookId: book,
          borrowerId: borrower,
        };
      }),
    );

    res.status(200).json(borrowsWithDetails);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error retrieving loan records" });
  }
};

const markAsReturned = async (req, res) => {
  try {
    const borrowId = req.params.id;

    const borrow = await Borrow.findById(borrowId);
    if (!borrow) {
      return res.status(404).json({ message: "Loan record not found" });
    }

    borrow.status = "Đã trả";
    borrow.ngayTra = new Date();
    await borrow.save();

    const book = await Book.findOne({
      maSach: borrow.bookId,
      isDeleted: { $ne: true },
    });
    if (book) {
      book.soQuyen = book.soQuyen + 1;
      await book.save();
    }

    res
      .status(200)
      .json({ message: "Book returned successfully", data: borrow });
  } catch (error) {
    console.error("Return error:", error.message);
    res
      .status(500)
      .json({ message: "Error updating loan status", error: error.message });
  }
};

const deleteBorrow = async (req, res) => {
  try {
    const borrow = await Borrow.findById(req.params.id);
    if (!borrow) {
      return res.status(404).json({ message: "Loan record not found" });
    }
    if (borrow.isDeleted === true) {
      return res
        .status(400)
        .json({ message: "Loan record is already deleted" });
    }

    // Soft delete: chỉ đánh dấu là đã xóa, KHÔNG xóa thật database
    borrow.isDeleted = true;
    await borrow.save();
    res.status(200).json({ message: "Loan record deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting loan record" });
  }
};

module.exports = {
  createBorrow,
  getBorrowHistoryByUser,
  getAllBorrows,
  markAsReturned,
  deleteBorrow,
  approveBorrow,
  rejectBorrow,
};
