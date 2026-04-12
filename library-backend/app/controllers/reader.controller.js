const User = require("../models/userModel");
const Account = require("../models/accountModel");

const createUser = async (req, res) => {
  try {
    const newUser = new User(req.body);
    await newUser.save();
    res.status(201).json(newUser.toJSON());
  } catch (error) {
    console.error("Error creating reader:", error.message);
    res.status(400).json({ message: "Unable to create reader" });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({ isDeleted: { $ne: true } });
    res.status(200).json(users);
  } catch (error) {
    console.error("Error retrieving readers list:", error.message);
    res.status(500).json({ message: "Unable to retrieve readers list" });
  }
};

const getUserByMaDocGia = async (req, res) => {
  try {
    // Lấy độc giả chưa bị xóa (bao gồm cả dữ liệu cũ)
    const user = await User.findOne({
      maDocGia: Number(req.params.maDocGia),
      isDeleted: { $ne: true },
    });
    if (!user) {
      return res.status(404).json({ message: "Reader not found" });
    }
    res.status(200).json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error retrieving reader" });
  }
};

const updateUser = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!user) {
      return res.status(404).json({ message: "Reader not found for update" });
    }
    res.status(200).json(user);
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: "Unable to update reader" });
  }
};

const deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "Reader not found" });
    if (user.isDeleted === true)
      return res.status(400).json({ message: "Reader is already deleted" });

    // Soft delete: chỉ đánh dấu là đã xóa, KHÔNG xóa thật database
    user.isDeleted = true;
    await user.save();

    // Cả tài khoản liên kết cũng được vô hiệu hóa (nếu có)
    const account = await Account.findOne({
      refId: user.maDocGia,
      refModel: "User",
    });
    if (account) {
      account.isDeleted = true;
      await account.save();
    }

    res.status(200).json({ message: "Reader deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error deleting reader" });
  }
};

module.exports = {
  createUser,
  getAllUsers,
  getUserByMaDocGia,
  updateUser,
  deleteUser,
};
