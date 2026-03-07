
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { User } from '../models/schema.js';
import { detectOverspending } from '../services/overspending.service.js';
import { sendTelegramAlert } from '../services/telegram.service.js';

dotenv.config();

async function testOverspendingAlert() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        // Target user ID for testing
        const targetUserId = 7079462435; // Replace with dynamic ID if needed, but using user's ID from context

        console.log(`Checking overspending for user: ${targetUserId}`);
        const result = await detectOverspending(targetUserId, "monthly");

        if (result && result.isOverspending) {
            console.log('\n🚨 Overspending Detected!');
            console.log(`Expected: ₹${result.expectedSpend}`);
            console.log(`Actual: ₹${result.actualSpend}`);
            console.log(`Deviation: ${result.deviationPercent}%`);

            const message = `
🚨 Overspending Alert (TEST TRIGGER)

Expected: ₹${result.expectedSpend}
Actual: ₹${result.actualSpend}
Deviation: ${result.deviationPercent.toFixed(1)}%
Confidence: ${(result.confidence ? result.confidence * 100 : 90).toFixed(0)}%
            `;

            console.log('Sending Telegram Alert...');
            await sendTelegramAlert(targetUserId, message);
            console.log('✅ Alert sent successfully!');
        } else {
            console.log('\n✅ No overspending detected for this user.');
            console.log(`Actual Spend: ₹${result ? result.actualSpend : 'N/A'}`);
            console.log(`Threshold: ₹${result ? result.expectedSpend : 'N/A'}`);
        }

    } catch (error) {
        console.error('Test error:', error);
    } finally {
        await mongoose.disconnect();
    }
}

testOverspendingAlert();
