import express from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../models/schema.js';
import { sendtext } from './Telegramhandler.js';

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
    console.error("FATAL ERROR: JWT_SECRET is not defined.");
    process.exit(1);
}

// Request OTP
router.post('/request-otp', async (req, res) => {
    const { telegramId } = req.body;

    if (!telegramId) {
        return res.status(400).json({ success: false, message: "Telegram ID is required" });
    }

    try {
        let user = await User.findOne({ telegramid: telegramId });

        if (!user) {
            return res.status(404).json({ success: false, message: "User not found. Please start the bot first." });
        }

        // Generate 6-digit OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const expires = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes expiry

        user.authCode = otp;
        user.authExpires = expires;
        await user.save();

        // Send OTP via Telegram
        await sendtext(telegramId, `🔐 *Your Moneymate Verification Code*\n\nYour code is: \`${otp}\`\n\nValid for 5 minutes. Do not share this code with anyone.`);

        res.json({ success: true, message: "OTP sent successfully" });
    } catch (error) {
        console.error("Error requesting OTP:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
});

// Verify OTP
router.post('/verify-otp', async (req, res) => {
    const { telegramId, otp } = req.body;

    if (!telegramId || !otp) {
        return res.status(400).json({ success: false, message: "Telegram ID and OTP are required" });
    }

    try {
        const user = await User.findOne({ telegramid: telegramId });

        if (!user || !user.authCode || user.authCode !== otp || new Date() > user.authExpires) {
            return res.status(401).json({ success: false, message: "Invalid or expired OTP" });
        }

        // Clear OTP after successful verification
        user.authCode = undefined;
        user.authExpires = undefined;
        await user.save();

        // Generate JWT
        const token = jwt.sign(
            { telegramid: user.telegramid, name: user.name },
            JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.json({
            success: true,
            token,
            user: {
                telegramid: user.telegramid,
                name: user.name
            }
        });
    } catch (error) {
        console.error("Error verifying OTP:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
});

export default router;
