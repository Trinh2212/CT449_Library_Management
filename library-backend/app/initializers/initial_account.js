const Account = require("../models/accountModel");
const Staff = require("../models/staffModel");
const bcrypt = require("bcryptjs");

async function createDefaultAdmin() {
  try {
    const existingAccount = await Account.findOne({ email: "admin123@library.com" });
    if (existingAccount) return;
  
    
    const adminStaff = new Staff({
      hoTenNV: "System Administrator",
      chucVu: "Thủ thư",
      diaChi: "Main Library Office",
      soDienThoai: "0974378809",
    });
    const passwordHash = await bcrypt.hash("admin123", 10);
  
    await adminStaff.save();
  
    const adminAccount = new Account({
      email: "admin123@library.com",
      password: passwordHash,
      role: "admin",
      refId: adminStaff.msnv,
      refModel: "Staff",
    });
  
    await adminAccount.save();
    console.log("✓ Default admin account initialized");
  } catch (error){
    console.error('X error creating default admin account:', error);
  }
}

module.exports = createDefaultAdmin;
