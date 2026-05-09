"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const mongoose_1 = __importDefault(require("mongoose"));
const User_model_1 = __importDefault(require("./models/User.model"));
const Transaction_model_1 = __importDefault(require("./models/Transaction.model"));
const seed = async () => {
    await mongoose_1.default.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');
    // Clear existing data
    await User_model_1.default.deleteMany({ email: 'gagana.r@email.com' });
    // Create user (password NOT pre-hashed — model's pre-save hook will hash it)
    const user = await User_model_1.default.create({
        fullName: 'Gagana R',
        email: 'gagana.r@email.com',
        password: 'password123',
        accountNumber: '123456789012',
        accountType: 'Savings Account',
        balance: 75250.50,
        phone: '+91 98765 43210',
        dateOfBirth: '15 August 1998',
        address: '123, 4th Cross Street, Bangalore, Karnataka - 560001',
        panNumber: 'ABCDE1234F',
        memberSince: new Date('2024-03-12'),
        lastLogin: new Date('2025-05-16T10:45:00'),
    });
    console.log(`Created user: ${user.email} (${user._id})`);
    // Clear old transactions for this user
    await Transaction_model_1.default.deleteMany({ userId: user._id });
    const uid = user._id;
    const transactions = [
        // 1. Deposit 20000 — 16 May 10:30
        {
            userId: uid, type: 'credit', category: 'deposit',
            description: 'Deposit from Self', amount: 20000, balanceAfter: 80250.50,
            createdAt: new Date('2025-05-16T10:30:00'),
        },
        // 2. Transfer out to Arun Sharma 5000 — 16 May 10:45
        {
            userId: uid, type: 'debit', category: 'transfer_out',
            description: 'Transfer to Arun Sharma', amount: 5000, balanceAfter: 75250.50,
            beneficiaryName: 'Arun Sharma', beneficiaryBank: 'HDFC Bank',
            beneficiaryAccount: '987654321012',
            createdAt: new Date('2025-05-16T10:45:00'),
        },
        // 3. ATM Withdrawal 3000 — 15 May 13:15
        {
            userId: uid, type: 'debit', category: 'atm',
            description: 'ATM Withdrawal', amount: 3000, balanceAfter: 60250.50,
            createdAt: new Date('2025-05-15T13:15:00'),
        },
        // 4. Transfer out to Priya Kapoor 2500 — 15 May 14:30
        {
            userId: uid, type: 'debit', category: 'transfer_out',
            description: 'Transfer to Priya Kapoor', amount: 2500, balanceAfter: 62750.50,
            beneficiaryName: 'Priya Kapoor', beneficiaryBank: 'ICICI Bank',
            beneficiaryAccount: '567812345678',
            createdAt: new Date('2025-05-15T14:30:00'),
        },
        // 5. Deposit 15000 — 14 May 11:00
        {
            userId: uid, type: 'credit', category: 'deposit',
            description: 'Deposit from Self', amount: 15000, balanceAfter: 62750.50,
            createdAt: new Date('2025-05-14T11:00:00'),
        },
        // 6. Transfer in from Rohan Kumar 3000 — 14 May 11:20
        {
            userId: uid, type: 'credit', category: 'transfer_in',
            description: 'Transfer from Rohan Kumar', amount: 3000, balanceAfter: 47750.50,
            beneficiaryName: 'Rohan Kumar',
            createdAt: new Date('2025-05-14T11:20:00'),
        },
        // 7. Transfer out to Rohan Kumar 3000 — 13 May 09:15
        {
            userId: uid, type: 'debit', category: 'transfer_out',
            description: 'Transfer to Rohan Kumar', amount: 3000, balanceAfter: 47750.50,
            beneficiaryName: 'Rohan Kumar', beneficiaryBank: 'SBI Bank',
            beneficiaryAccount: '901290129012',
            createdAt: new Date('2025-05-13T09:15:00'),
        },
        // 8. Deposit 10000 — 12 May 16:45
        {
            userId: uid, type: 'credit', category: 'deposit',
            description: 'Deposit from Self', amount: 10000, balanceAfter: 50750.50,
            createdAt: new Date('2025-05-12T16:45:00'),
        },
    ];
    await Transaction_model_1.default.insertMany(transactions);
    console.log(`Created ${transactions.length} transactions`);
    console.log('\n✅ Seed complete!');
    console.log('   Email:    gagana.r@email.com');
    console.log('   Password: password123');
    console.log('   Account:  123456789012');
    await mongoose_1.default.disconnect();
    process.exit(0);
};
seed().catch((err) => {
    console.error('Seed failed:', err);
    process.exit(1);
});
