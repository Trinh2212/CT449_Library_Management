const express = require("express");
const router = express.Router();
const {
  createAdmin,
  getAllStaff,
  getStaffByMsnv,
  updateStaff,
  deleteStaff,
} = require("../controllers/staff.controller");

router.post("/admin", createAdmin);
router.get("/", getAllStaff);
router.get("/code/:msnv", getStaffByMsnv);
router.put("/:id", updateStaff);
router.delete("/:id", deleteStaff);

module.exports = router;

