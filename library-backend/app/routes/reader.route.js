const express = require("express");
const router = express.Router();
const {
  createUser,
  getAllUsers,
  getUserByMaDocGia,
  updateUser,
  deleteUser,
} = require("../controllers/reader.controller");

router.post("/", createUser);
router.get("/", getAllUsers);
router.get("/code/:maDocGia", getUserByMaDocGia);
router.put("/:id", updateUser);
router.delete("/:id", deleteUser);

module.exports = router;

