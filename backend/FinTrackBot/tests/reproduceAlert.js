
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { User } from '../models/schema.js';
import { detectOverspending } from '../services/overspending.service.js';

dotenv.config();

async function reproduceDoubleAlert() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        const userId = 7079462435;

        // 1. Fetch User (Simulate handleaddexpenses start)
        let user = await User.findOne({ telegramid: userId });
        if (!user) { console.log("User not found"); return; }

        console.log("--- Simulation Start ---");

        // 2. Add Expense 1 (Simulate 10000 Loan)
        console.log("Adding Expense 1: 10000");
        user.expenses.push({ amount: 10000, category: "Test1", date: new Date() });
        // Simulating the passed object state
        let result1 = await detectOverspending(userId, "monthly", user);
        console.log("Result 1 Alert:", result1?.isOverspending);

        // 3. Add Expense 2 (Simulate 500 Food)
        console.log("Adding Expense 2: 500");
        user.expenses.push({ amount: 500, category: "Test2", date: new Date() });

        // CRITICAL: In handleaddexpenses, we reuse the SAME user object variable?
        // Yes, 'let user = ...'.

        let result2 = await detectOverspending(userId, "monthly", user);
        console.log("Result 2 Alert:", result2?.isOverspending);

        if (result1?.isOverspending && !result2?.isOverspending) {
            console.log("❌ REPRODUCTION SUCCESS: Second alert failed!");
        } else if (result1?.isOverspending && result2?.isOverspending) {
            console.log("✅ Both alerts triggered. Logic is sound.");
        }

    } catch (e) {
        console.error(e);
    } finally {
        await mongoose.disconnect();
    }
}
reproduceDoubleAlert();
