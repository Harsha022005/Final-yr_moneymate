import mongoose from 'mongoose';
import { User } from './models/schema.js';
import dotenv from 'dotenv';
dotenv.config();

async function checkUser() {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/Moneymate');
    const targetId = process.env.TEST_USER_ID || 7079462435; // Fallback for local testing
    const user = await User.findOne({ telegramid: targetId });
    if (user) {
        console.log('User found:');
        const now = new Date();
        const monthlyIncomes = (user.incomes || []).filter(inc => {
            const d = new Date(inc.date);
            return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
        });
        const currentMonthlyIncome = monthlyIncomes.reduce((total, inc) => total + (inc.amount || 0), 0);
        console.log('Current Monthly Income:', currentMonthlyIncome);
        console.log('Expenses Count:', user.expenses.length);
        console.log('Recurring Expenses Count:', user.recurringexpenses?.length || 0);
        if (user.recurringexpenses?.length > 0) {
            console.log('Recurring Details:', user.recurringexpenses.map(r => `${r.category}: ₹${r.amount} (${r.frequency})`));
        }
        const totalExpenses = user.expenses.reduce((sum, exp) => sum + exp.amount, 0);
        console.log('Total Expenses:', totalExpenses);

        // Calculate average monthly expenses (last 3 months)
        const threeMonthsAgo = new Date();
        threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);

        const monthlyExpenses = {};
        user.expenses.forEach(exp => {
            const expDate = new Date(exp.date);
            if (expDate >= threeMonthsAgo) {
                const monthKey = `${expDate.getFullYear()}-${expDate.getMonth()}`;
                monthlyExpenses[monthKey] = (monthlyExpenses[monthKey] || 0) + exp.amount;
            }
        });

        const avgMonthlySpend = Object.values(monthlyExpenses).length > 0
            ? Object.values(monthlyExpenses).reduce((a, b) => a + b, 0) / Object.keys(monthlyExpenses).length
            : currentMonthExpenses;
        console.log('Avg Monthly Spend:', avgMonthlySpend);
        console.log('Monthly Expenses counts:', Object.keys(monthlyExpenses).length);
        console.log('Surplus:', currentMonthlyIncome - avgMonthlySpend);
    } else {
        console.log('User not found');
    }
    await mongoose.disconnect();
}

checkUser();
