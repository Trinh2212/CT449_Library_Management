const Account = require('../models/accountModel');
const User = require('../models/userModel');
const Staff = require('../models/staffModel');
const jwt = require('jsonwebtoken');

const bcrypt = require('bcryptjs');

exports.register = async (req, res) => {
    try{
        const {email, password, role, refId, refModel} = req.body;

        if (!password || password.trim().length < 8) 
            return res.status(400).json({ message: 'mật khẩu phải có ít nhất 8 ký tự'})
        
        const accountExits = await Account.findOne({ email})
        if (accountExits) return res.status(400).json({message: 'email đã tồn tại'})

        const hashedPass = await bcrypt.hash(password, 10);
        const newAccount = new Account({email, password: hashedPass, role, refId, refModel});

        await newAccount.save();
        res.status(201).json(newAccount);
    }
    catch(error) {
        res.status(400).json({ message: "không thể đăng ký tài khoản" });
        console.error(error);
    }
}

exports.login = async (req, res) => {
    try {
        const {email, password} = req.body;

        const account = await Account.findOne({ email});
        if (!account) return res.status(404).json({ message: "Tài khoản không tồn tại" });

        const isMatch = await bcrypt.compare(password, account.password);
        if (!isMatch) return res.status(401).json({ message: "Mật khẩu không đúng" });

        let userInfo = {};

        if (account.refModel === 'User') {
            const user = await User.findById(account.refId);
            if (user) userInfo = {
                userId: account.refId,
                maDocGia: user.maDocGia,
                fullName: `${user.hoLot} ${user.ten}`,
                email: account.email,
                role: account.role,
            }
        } else if (account.refModel === 'Staff'){
            const staff = await Staff.findById(account.refId);
            if (staff) userInfo = {
                userId: account.refId,
                msnv: staff.msnv,
                hoTenNV: staff.hoTenNV,
                chucVu: staff.chucVu,
                role: account.role,
            }   
        }
        const token = jwt.sign(
            { id: account.id,
                role: account.role,
            },
            process.env.JWT_SECRET || 'your_secret_key',
            { expiresIn: '4h' }
        );
        res.status(200).json({ 
            message: "Đăng nhập thành công",
            token, 
            role: account.role,
            userInfo });
    } catch (error){
        res.status(500).json({ message: "Đăng nhập thất bại" });
        console.error(error);
    }
}

exports.getCurrentAccount = async(req, res) => {
    try{
        const {email} = req.params;
        const account = await Account.findOne({ email});
        if (!account) return res.status(404).json({ message: "Tài khoản không tồn tại" });

        res.status(200).json(account);
    }catch(error){
        res.status(500).json({ message: "Lỗi khi lấy thông tin tài khoản" });
        console.error(error);
    }
}
