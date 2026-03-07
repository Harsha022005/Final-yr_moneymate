
import { getInvestmentRecommendation } from '../services/investment.service.js';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { User } from '../models/schema.js';

dotenv.config();

async function verify() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        // Find a user with some data
        const user = await User.findOne({ income: { $gt: 0 } });
        if (!user) {
            console.log('No user found with income. Please set income first.');
            process.exit(0);
        }

        console.log(`Verifying recommendation for user: ${user.telegramid}`);
        const result = await getInvestmentRecommendation(user.telegramid);

        console.log('\n--- AI Investment Suggestion ---');
        console.log(`Risk Profile: ${result.riskProfile}`);
        console.log(`Safe Amount: ₹${result.safeAmount}`);
        console.log(`Target Amount: ₹${result.amount}`);
        console.log(`\nExplanation:\n${result.explanation}`);
        console.log('\n--- Model Metrics (Visible in Postman) ---');
        console.dir(result.modelMetrics);
        console.log('\n--- Snapshot ---');
        console.dir(result.financialSnapshot);

        if (result.safeAmount !== undefined && result.explanation.includes('🛡️')) {
            console.log('\n✅ Verification Passed: Dual suggestions and emojis found.');
        } else {
            console.log('\n❌ Verification Failed: Missing expected fields.');
        }

    } catch (error) {
        console.error('Verification error:', error);
    } finally {
        await mongoose.disconnect();
    }
}

verify();
