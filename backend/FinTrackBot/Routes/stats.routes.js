import express from 'express';
const router = express.Router();
import { User } from '../models/schema.js';

router.get('/monthly-comparison/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        const user = await User.findOne({ telegramid: userId });

        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        const statsMap = {};

        // Process Incomes
        if (user.incomes) {
            user.incomes.forEach(inc => {
                const date = new Date(inc.date);
                const monthName = date.toLocaleString('default', { month: 'short' });
                const year = date.getFullYear();
                const key = `${monthName} ${year}`;

                if (!statsMap[key]) {
                    statsMap[key] = { month: key, income: 0, expenses: 0, sortKey: date.getTime() };
                }
                statsMap[key].income += inc.amount;
            });
        }

        // Process Expenses
        if (user.expenses) {
            user.expenses.forEach(exp => {
                const date = new Date(exp.date);
                const monthName = date.toLocaleString('default', { month: 'short' });
                const year = date.getFullYear();
                const key = `${monthName} ${year}`;

                if (!statsMap[key]) {
                    statsMap[key] = { month: key, income: 0, expenses: 0, sortKey: date.getTime() };
                }
                statsMap[key].expenses += exp.amount;
            });
        }

        // Convert to array and sort by date
        const result = Object.values(statsMap)
            .sort((a, b) => a.sortKey - b.sortKey)
            .map(({ sortKey, ...item }) => item);

        // Limit to last 12 months if needed, or just return all
        const limitedResult = result.length > 12 ? result.slice(-12) : result;

        res.json({ success: true, data: limitedResult });
    } catch (err) {
        console.error('Error fetching monthly stats:', err);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

export default router;
