"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateProfile = exports.getProfile = void 0;
const User_model_1 = __importDefault(require("../models/User.model"));
const getProfile = async (req, res, next) => {
    try {
        const user = await User_model_1.default.findById(req.user.userId).select('-password');
        if (!user) {
            res.status(404).json({ success: false, message: 'User not found' });
            return;
        }
        res.status(200).json({ success: true, user });
    }
    catch (error) {
        next(error);
    }
};
exports.getProfile = getProfile;
const updateProfile = async (req, res, next) => {
    try {
        const { fullName, phone, dateOfBirth, address, panNumber } = req.body;
        const user = await User_model_1.default.findByIdAndUpdate(req.user.userId, { fullName, phone, dateOfBirth, address, panNumber }, { new: true, runValidators: true, select: '-password' });
        if (!user) {
            res.status(404).json({ success: false, message: 'User not found' });
            return;
        }
        res.status(200).json({ success: true, user });
    }
    catch (error) {
        next(error);
    }
};
exports.updateProfile = updateProfile;
