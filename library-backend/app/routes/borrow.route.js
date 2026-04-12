const express = require("express");
const router = express.Router();
const {
  createBorrow,
  getAllBorrows,
  getBorrowHistoryByUser,
  markAsReturned,
  deleteBorrow,
  approveBorrow,
  rejectBorrow,
} = require("../controllers/borrow.controller");

router.post("/", createBorrow);
router.get("/", getAllBorrows);
router.get("/me/:userId", getBorrowHistoryByUser);
router.patch("/return/:id", markAsReturned);
router.delete("/:id", deleteBorrow);
router.patch("/approve/:id", approveBorrow);
router.patch("/reject/:id", rejectBorrow);
module.exports = router;
