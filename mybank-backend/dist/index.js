"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const db_1 = __importDefault(require("./config/db"));
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
const account_routes_1 = __importDefault(require("./routes/account.routes"));
const transaction_routes_1 = __importDefault(require("./routes/transaction.routes"));
const profile_routes_1 = __importDefault(require("./routes/profile.routes"));
const errorHandler_1 = require("./middleware/errorHandler");
const app = (0, express_1.default)();
const PORT = process.env.PORT || 5000;
// Middleware
app.use((0, cors_1.default)({ origin: 'http://localhost:5173', credentials: true }));
app.use(express_1.default.json());
// Health check
app.get('/api/health', (_req, res) => {
    res.json({ success: true, message: 'MyBank API is running' });
});
// Routes
app.use('/api/auth', auth_routes_1.default);
app.use('/api/account', account_routes_1.default);
app.use('/api/transactions', transaction_routes_1.default);
app.use('/api/profile', profile_routes_1.default);
// Error handler (must be last)
app.use(errorHandler_1.errorHandler);
// Start server
(0, db_1.default)().then(() => {
    app.listen(PORT, () => {
        console.log(`MyBank API running on port ${PORT}`);
    });
});
