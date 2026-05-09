"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = exports.register = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_model_1 = __importDefault(require("../models/User.model"));
const generateAccountNumber = () => {
    let num = '';
    for (let i = 0; i < 12; i++)
        num += Math.floor(Math.random() * 10).toString();
    return num;
};
const register = async (req, res, next) => {
    try {
        const { fullName, email, password, confirmPassword } = req.body;
        if (!fullName || !email || !password || !confirmPassword) {
            res.status(400).json({ success: false, message: 'All fields are required' });
            return;
        }
        if (password !== confirmPassword) {
            res.status(400).json({ success: false, message: 'Passwords do not match' });
            return;
        }
        const existing = await User_model_1.default.findOne({ email });
        if (existing) {
            res.status(409).json({ success: false, message: 'Email already registered' });
            return;
        }
        // Generate unique 12-digit account number
        let accountNumber = generateAccountNumber();
        while (await User_model_1.default.findOne({ accountNumber })) {
            accountNumber = generateAccountNumber();
        }
        const user = await User_model_1.default.create({ fullName, email, password, accountNumber });
        res.status(201).json({
            success: true,
            message: 'Account created successfully',
            user: { fullName: user.fullName, email: user.email, accountNumber: user.accountNumber },
        });
    }
    catch (error) {
        next(error);
    }
};
exports.register = register;
const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            res.status(400).json({ success: false, message: 'Email and password are required' });
            return;
        }
        const user = await User_model_1.default.findOne({ email });
        if (!user) {
            res.status(401).json({ success: false, message: 'Invalid email or password' });
            return;
        }
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            res.status(401).json({ success: false, message: 'Invalid email or password' });
            return;
        }
        user.lastLogin = new Date();
        await user.save();
        const token = jsonwebtoken_1.default.sign({ userId: user._id.toString() }, process.env.JWT_SECRET, { expiresIn: '7d' });
        res.status(200).json({
            success: true,
            token,
            user: {
                id: user._id,
                fullName: user.fullName,
                email: user.email,
                accountNumber: user.accountNumber,
                balance: user.balance,
                accountType: user.accountType,
                memberSince: user.memberSince,
                lastLogin: user.lastLogin,
            },
        });
    }
    catch (error) {
        next(error);
    }
};
exports.login = login;
