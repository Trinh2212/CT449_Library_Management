const express = require("express");
const router = express.Router();
const {
  getAllBooks,
  getBookByMaSach,
  createBook,
  updateBook,
  deleteBook,
  getOutOfStockBooks,
} = require("../controllers/book.controller");

router.get("/", getAllBooks);
router.get("/out-of-stock", getOutOfStockBooks);
router.get("/masach/:maSach", getBookByMaSach);
router.post("/", createBook);
router.put("/:id", updateBook);
router.delete("/:id", deleteBook);

module.exports = router;
