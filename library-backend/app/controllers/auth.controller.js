const Account = require("../models/accountModel");
const User = require("../models/userModel");
const Staff = require("../models/staffModel");
const jwt = require("jsonwebtoken");

const bcrypt = require("bcryptjs");

exports.register = async (req, res) => {
  try {
    const { email, password, maDocGia } = req.body;

    if (!email || !password || maDocGia === undefined)
      return res
        .status(400)
        .json({ message: "Email, mật khẩu, và maDocGia bắt buộc" });

    if (password.trim().length < 8)
      return res
        .status(400)
        .json({ message: "mật khẩu phải có ít nhất 8 ký tự" });

    const accountExists = await Account.findOne({
      email,
      isDeleted: { $ne: true },
    });
    if (accountExists)
      return res
        .status(400)
        .json({ message: "Email này đã tồn tại" });

    // Chỉ cho phép đăng ký với độc giả chưa bị xóa (bao gồm cả dữ liệu cũ)
    const user = await User.findOne({
      maDocGia: Number(maDocGia),
      isDeleted: { $ne: true },
    });
    if (!user)
      return res
        .status(404)
        .json({ message: "Reader not found with this code" });

    const hashedPass = await bcrypt.hash(password, 10);
    const newAccount = new Account({
      email,
      password: hashedPass,
      role: "user",
      refId: user.maDocGia,
      refModel: "User",
    });

    await newAccount.save();
    res.status(201).json({
      message: "Account registered successfully",
      account: newAccount,
    });
  } catch (error) {
    console.error("Register error:", error.message);
    res
      .status(400)
      .json({ message: "Failed to register account", error: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }

    // Chỉ cho phép đăng nhập với account chưa bị xóa (bao gồm cả dữ liệu cũ)
    const account = await Account.findOne({ email, isDeleted: { $ne: true } });
    if (!account) {
      console.log(`Login failed: Account not found for email: ${email}`);
      return res.status(404).json({ message: "Account not found" });
    }

    const match = await bcrypt.compare(password, account.password);
    if (!match) {
      console.log(`Login failed: Invalid password for email: ${email}`);
      return res.status(401).json({ message: "Invalid password" });
    }

    let userInfo = {};

    if (account.refModel === "User") {
      const user = await User.findOne({
        maDocGia: account.refId,
        isDeleted: { $ne: true },
      });
      if (!user) {
        return res
          .status(403)
          .json({ message: "User account has been deleted" });
      }
      userInfo = {
        maDocGia: user.maDocGia,
        fullName: `${user.hoLot} ${user.ten}`,
        email: account.email,
        role: account.role,
        // thêm để hiển thị trang thông tin DT
        dienThoai: user.dienThoai,
        diaChi: user.diaChi,
        ngaySinh: user.ngaySinh,
      };
    } else if (account.refModel === "Staff") {
      const staff = await Staff.findOne({
        msnv: account.refId,
        isDeleted: { $ne: true },
      });
      if (!staff) {
        return res
          .status(403)
          .json({ message: "Staff account has been deleted" });
      }
      userInfo = {
        msnv: staff.msnv,
        hoTenNV: staff.hoTenNV,
        chucVu: staff.chucVu,
        email: account.email,
        role: account.role,
        dienThoai: staff.soDienThoai,
        diaChi: staff.diaChi,
      };
    } else {
      return res.status(400).json({ message: "Invalid account type" });
    }

    const token = jwt.sign(
      { id: account._id, role: account.role },
      process.env.JWT_SECRET || "your_secret_key",
      { expiresIn: "1h" },
    );

    console.log(`✓ Login successful for ${email} with role: ${account.role}`);

    res.status(200).json({
      message: "Login successful",
      token,
      role: account.role,
      userInfo,
    });
  } catch (error) {
    console.error("Login error:", error.message);
    res.status(500).json({ message: "Login failed: " + error.message });
  }
};

exports.getCurrentAccount = async (req, res) => {
  try {
    const { email } = req.params;
    // Lấy account chưa bị xóa (bao gồm cả dữ liệu cũ)
    const account = await Account.findOne({ email, isDeleted: { $ne: true } });
    if (!account) return res.status(404).json({ message: "Account not found" });

    res.status(200).json(account);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error retrieving account information" });
  }
};
