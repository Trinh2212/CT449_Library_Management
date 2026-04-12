const Book = require("../models/bookModel");
const Borrow = require("../models/borrowModel");
const Publisher = require("../models/publisherModel");

exports.getAllBooks = async (req, res) => {
  try {
    // lấy all sách chưa bị xóa (isDeleted: false và undefined(dữ liệu cũ))
    const books = await Book.find({ isDeleted: { $ne: true } });
    const publishers = await Publisher.find({ isDeleted: { $ne: true } });

    const booksWithPublisher = books.map((book) => {
      const bookObj = book.toObject();

      bookObj.maNXB = publishers.find((p) => p.maNXB === book.maNXB);

      return bookObj; // da gan nha xuat ban
    });
    // .json chuyển dữ liệu thành Json
    res.status(200).json(booksWithPublisher);
  } catch (error) {
    res.status(500).json({ message: "Server error occurred" });
    console.error(error);
  }
};

exports.getBookByMaSach = async (req, res) => {
  try {
    const book = await Book.findOne({
      maSach: req.params.maSach,
      isDeleted: { $ne: true },
    });

    if (!book) {
      return res.status(404).json({ message: "Book not found by code" });
    }

    const publisher = await Publisher.findOne({
      maNXB: book.maNXB,
      isDeleted: { $ne: true },
    });
    const bookWithPublisher = book.toObject();
    bookWithPublisher.maNXB = publisher;

    res.status(200).json(bookWithPublisher);
  } catch (error) {
    res.status(500).json({ message: "Error fetching book by code" });
    console.error(error);
  }
};

exports.createBook = async (req, res) => {
  try {
    const newBook = new Book(req.body);
    await newBook.save();
    res.status(201).json(newBook);
  } catch (error) {
    res.status(500).json({ message: error.message });
    console.error(error);
  }
};

exports.updateBook = async (req, res) => {
  try {
    const book = await Book.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!book) {
      return res.status(404).json({ message: "Book not found for update" });
    }
    res.status(200).json(book);
  } catch (error) {
    res.status(400).json({ message: "unable to update book" });
    console.error(error);
  }
};

exports.deleteBook = async (req, res) => {
  try {
    const bookId = req.params.id;
    const book = await Book.findById(bookId);

    if (!book)
      return res.status(404).json({ message: "book not found for deletion" });
    if (book.isDeleted === true)
      return res.status(400).json({ message: "Book is already deleted" });

    const activeBorrows = await Borrow.find({
      bookId: book.maSach,
      status: "Đang mượn",
    });
    if (activeBorrows.length > 0) {
      return res
        .status(400)
        .json({
          message: "Cannot delete this book as it is currently borrowed",
        });
    }

    book.isDeleted = true;
    await book.save();
    res.status(200).json({ message: "Book deleted successfully" });
  } catch (error) {
    res.status(400).json({ message: "error deleting book" });
    console.error(error);
  }
};

exports.getOutOfStockBooks = async (req, res) => {
  try {
    const outOfStockBooks = await Book.find({
      soQuyen: 0,
      isDeleted: { $ne: true },
    });
    res.status(200).json(outOfStockBooks);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving out of stock books" });
    console.error(error);
  }
};
