const Staff = require("../models/staffModel");
const Account = require("../models/accountModel");
const bcrypt = require("bcryptjs");

exports.createAdmin = async (req, res) => {
  const { email, password, hoTenNV, chucVu, diaChi, soDienThoai } = req.body;
  try {
    const accountExists = await Account.findOne({ email });
    if (accountExists)
      return res.status(400).json({ message: "Email already in use" });

    const newStaff = new Staff({ hoTenNV, chucVu, diaChi, soDienThoai });
    await newStaff.save();

    const hashedPassword = await bcrypt.hash(password, 10);
    const newAccount = new Account({
      email,
      password: hashedPassword,
      role: "admin",
      refId: newStaff.msnv,
      refModel: "Staff",
    });
    await newAccount.save();

    res.status(201).json({ staff: newStaff, account: newAccount });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error creating new admin", error: error.message });
  }
};

exports.updateStaff = async (req, res) => {
  try {
    const staff = await Staff.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!staff)
      return res.status(404).json({ message: "Staff member not found" });
    res.status(200).json(staff);
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: "Unable to update staff member" });
  }
};

// Soft delete nhân viên và tài khoản admin của họ
exports.deleteStaff = async (req, res) => {
  try {
    const staffId = req.params.id;
    const staff = await Staff.findById(staffId);
    if (!staff)
      return res.status(404).json({ message: "Staff member not found" });
    if (staff.isDeleted === true)
      return res.status(400).json({ message: "Staff is already deleted" });

    // Soft delete: chỉ đánh dấu là đã xóa, KHÔNG xóa thật database
    staff.isDeleted = true;
    await staff.save();

    // Cả tài khoản admin liên kết cũng được vô hiệu hóa
    const account = await Account.findOne({
      refId: staff.msnv,
      refModel: "Staff",
    });
    if (account) {
      account.isDeleted = true;
      await account.save();
    }

    res.status(200).json({ message: "Staff member deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error deleting staff member" });
  }
};

exports.getAllStaff = async (req, res) => {
  try {
    // Lấy nhân viên chưa bị xóa (bao gồm cả dữ liệu cũ)
    const staffList = await Staff.find({ isDeleted: { $ne: true } });
    res.status(200).json(staffList);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error retrieving staff list" });
  }
};

exports.getStaffByMsnv = async (req, res) => {
  try {
    // Lấy nhân viên chưa bị xóa (bao gồm cả dữ liệu cũ)
    const staff = await Staff.findOne({
      msnv: Number(req.params.msnv),
      isDeleted: { $ne: true },
    });
    if (!staff) {
      return res.status(404).json({ message: "Staff member not found" });
    }
    res.status(200).json(staff);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error retrieving staff member" });
  }
};
