import Expense from '../models/expense.model.js';

/**
 * Get monthly expense totals for a user
 * @param {string} userId - The ID of the user
 * @param {number} months - Number of months of data to retrieve (default: 6)
 * @returns {Promise<Array<number>>} Array of monthly expense totals
 */
export async function getMonthlyExpenseTotals(userId, months = 6) {
    try {
        const endDate = new Date();
        const startDate = new Date();
        startDate.setMonth(endDate.getMonth() - months);
        
        // Query expenses for the user within the date range
        const expenses = await Expense.find({
            userId: parseInt(userId),
            date: { $gte: startDate, $lte: endDate }
        });

        // Group expenses by month and calculate totals
        const monthlyTotals = new Array(months).fill(0);
        const currentMonth = endDate.getMonth();
        
        expenses.forEach(expense => {
            const expenseMonth = expense.date.getMonth();
            const monthDiff = (currentMonth - expenseMonth + 12) % 12;
            
            if (monthDiff < months) {
                monthlyTotals[monthDiff] += expense.amount;
            }
        });

        // Return totals in chronological order (oldest first)
        return monthlyTotals.reverse();
    } catch (error) {
        console.error('Error fetching monthly expense totals:', error);
        throw new Error('Failed to fetch expense data');
    }
}

/**
 * Get total expenses for a user in the current month
 * @param {string} userId - The ID of the user
 * @returns {Promise<number>} Total expenses for the current month
 */
export async function getCurrentMonthExpense(userId) {
    try {
        const now = new Date();
        const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
        
        const result = await Expense.aggregate([
            {
                $match: {
                    userId: parseInt(userId),
                    date: { $gte: firstDay, $lte: now }
                }
            },
            {
                $group: {
                    _id: null,
                    total: { $sum: '$amount' }
                }
            }
        ]);
        
        return result.length > 0 ? result[0].total : 0;
    } catch (error) {
        console.error('Error fetching current month expense:', error);
        throw new Error('Failed to fetch current month expense');
    }
}
