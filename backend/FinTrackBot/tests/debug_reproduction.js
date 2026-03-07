
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { User } from '../models/schema.js';
import { detectOverspending } from '../services/overspending.service.js';

dotenv.config();

async function traceOverspending() {
    try {
        console.log("Connecting...");
        await mongoose.connect(process.env.MONGODB_URI);

        const userId = 7079462435;
        let user = await User.findOne({ telegramid: userId });

        console.log("\n--- USER STATE ---");
        console.log(`Incomes Count: ${user.incomes.length}`);
        // console.log(`Incomes: ${JSON.stringify(user.incomes)}`);

        console.log("\n--- TEST 1: ADD 500 ---");
        user.expenses.push({
            amount: 500,
            category: "DebugFood",
            date: new Date()
        });

        console.log("Calling detectOverspending with user object...");
        let result1 = await detectOverspending(userId, "monthly", user);

        console.log("\n--- RESULT 1 ---");
        console.log(`Overspending? ${result1?.isOverspending}`);
        console.log(`Actual: ${result1?.actualSpend}`);
        console.log(`Threshold: ${result1?.expectedSpend}`);
        console.log(`Deviation: ${result1?.deviationPercent}%`);

        console.log("\n--- TEST 2: ADD 100 MORE ---");
        user.expenses.push({
            amount: 100,
            category: "DebugCoffee",
            date: new Date()
        });

        let result2 = await detectOverspending(userId, "monthly", user);

        console.log("\n--- RESULT 2 ---");
        console.log(`Overspending? ${result2?.isOverspending}`);
        console.log(`Actual: ${result2?.actualSpend}`);

        if (result1?.isOverspending && result2?.isOverspending) {
            console.log("\n✅ LOGIC VALID: Alerts triggered consecutively.");
        } else {
            console.log("\n❌ LOGIC FAILURE: Alerts missed.");
        }

    } catch (e) {
        console.error("FATAL:", e);
    } finally {
        await mongoose.disconnect();
    }
}

traceOverspending();
