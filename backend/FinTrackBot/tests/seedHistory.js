
import mongoose from 'mongoose';
import { User } from '../models/schema.js';
import dotenv from 'dotenv';
dotenv.config();

async function seedHistory() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        const userId = 7079462435; // Your ID from context

        console.log(`Seeding history for user: ${userId}`);

        // Generate dates for last 4 months
        const months = [];
        for (let i = 1; i <= 4; i++) {
            const d = new Date();
            d.setMonth(d.getMonth() - i);
            months.push(d);
        }

        const fakeExpenses = [];

        // Add realistic varied expenses for each month
        // Month 1 (4 months ago): High spend (Learnable pattern)
        fakeExpenses.push({ amount: 15000, category: "Rent", date: months[3] });
        fakeExpenses.push({ amount: 5000, category: "Food", date: months[3] });

        // Month 2 (3 months ago): Normal
        fakeExpenses.push({ amount: 15000, category: "Rent", date: months[2] });
        fakeExpenses.push({ amount: 4500, category: "Food", date: months[2] });

        // Month 3 (2 months ago): Low
        fakeExpenses.push({ amount: 15000, category: "Rent", date: months[1] });
        fakeExpenses.push({ amount: 3000, category: "Food", date: months[1] });

        // Month 4 (Last month): Normal
        fakeExpenses.push({ amount: 15000, category: "Rent", date: months[0] });
        fakeExpenses.push({ amount: 5500, category: "Food", date: months[0] });

        // Update user
        const result = await User.updateOne(
            { telegramid: userId },
            { $push: { expenses: { $each: fakeExpenses } } }
        );

        console.log(`✅ Seeded ${fakeExpenses.length} past expenses.`);
        console.log("History depth is now sufficient to trigger ML Mode.");
        console.log("\nTry /overspending command in bot now - it should say 'Using ML Model' or similar based on logs.");

    } catch (e) {
        console.error(e);
    } finally {
        await mongoose.disconnect();
    }
}

seedHistory();
