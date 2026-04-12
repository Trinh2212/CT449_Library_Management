const Publisher = require("../models/publisherModel");
const Book = require("../models/bookModel");

exports.createPublisher = async (req, res) => {
  try {
    const newPublisher = new Publisher(req.body);
    await newPublisher.save();
    res.status(201).json(newPublisher);
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: "Unable to create publisher" });
  }
};

exports.getAllPublishers = async (req, res) => {
  try {
    // Lấy NXB chưa bị xóa (bao gồm cả dữ liệu cũ)
    const publishers = await Publisher.find({ isDeleted: { $ne: true } });
    res.status(200).json(publishers);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error retrieving publishers list" });
  }
};

exports.updatePublisher = async (req, res) => {
  try {
    const publisher = await Publisher.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true },
    );
    if (!publisher) {
      return res.status(404).json({ message: "Publisher not found" });
    }
    res.status(200).json(publisher);
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: "Unable to update publisher" });
  }
};

exports.deletePublisher = async (req, res) => {
  try {
    const publisher = await Publisher.findById(req.params.id);
    if (!publisher)
      return res.status(404).json({ message: "Publisher not found" });
    if (publisher.isDeleted === true)
      return res.status(400).json({ message: "Publisher is already deleted" });

    const booksWithPublisher = await Book.find({
      maNXB: publisher.maNXB,
      isDeleted: { $ne: true },
    });
    if (booksWithPublisher.length > 0) {
      return res.status(400).json({
        message: "Cannot delete this publisher as it has associated books.",
      });
    }

    // Soft delete: chỉ đánh dấu là đã xóa, KHÔNG xóa thật database
    publisher.isDeleted = true;
    await publisher.save();
    res.status(200).json({ message: "Publisher deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error deleting publisher" });
  }
};
