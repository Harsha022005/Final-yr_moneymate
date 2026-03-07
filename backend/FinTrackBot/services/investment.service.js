
import { User } from "../models/schema.js";
import { calculateRiskScore, getRiskProfile } from '../ml/models/riskScore.model.js';
import { investmentML } from '../ml/models/investmentRecommender.js';

/**
 * Generate investment recommendation based on user's financial data using ML
 * @param {Object} userId - Telegram ID of the user
 * @returns {Object} Investment recommendation
 */
export async function getInvestmentRecommendation(userId) {
    try {
        // Fetch user data from database
        const user = await User.findOne({ telegramid: userId });
        if (!user) {
            throw new Error('User not found');
        }

        // Process user data into financial metrics
        const now = new Date();
        const currentMonth = now.getMonth();
        const currentYear = now.getFullYear();

        // Calculate current month's expenses
        const currentMonthExpenses = user.expenses
            .filter(exp => {
                const expDate = new Date(exp.date);
                return expDate.getMonth() === currentMonth &&
                    expDate.getFullYear() === currentYear;
            })
            .reduce((sum, exp) => sum + exp.amount, 0);

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

        // Calculate monthly income from history (current month)
        const monthlyIncomes = (user.incomes || []).filter(inc => {
            const d = new Date(inc.date);
            return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
        });
        const monthlyIncome = monthlyIncomes.reduce((total, inc) => total + (inc.amount || 0), 0);

        // Use ML Model for recommendation
        const recommendedAmount = investmentML.recommend(monthlyIncome, avgMonthlySpend);

        // Calculate risk score based on available data (simplified for current schema)
        const age = 30; // Default since not in schema
        const savings = (monthlyIncome * 3) || 0; // Estimate 3 months income as savings since not in schema
        const debt = 0; // Default since not in schema

        const riskScoreValue = calculateRiskScore({
            monthlyIncome,
            monthlyExpenses: avgMonthlySpend,
            savings,
            debt,
            age
        });

        const profileInfo = getRiskProfile(riskScoreValue);

        // ML Model Evaluation (F1-score requested by user)
        const metrics = investmentML.evaluate();
        console.log(`\n📊 ML Model Evaluation:`);
        console.log(`- F1-Score: ${metrics.f1Score}`);
        console.log(`- R² Score: ${metrics.r2Score}`);
        console.log(`- Precision: ${metrics.precision}`);
        console.log(`- Recall: ${metrics.recall}\n`);

        // Calculate confidence (0 to 1)
        let confidence = 0;
        if (monthlyIncome > 0) confidence += 0.4;
        if (user.expenses.length > 5) confidence += 0.4;
        if (Object.keys(monthlyExpenses).length >= 2) confidence += 0.2;

        const surplus = monthlyIncome - avgMonthlySpend;
        const incomePercent = monthlyIncome > 0 ? (recommendedAmount / monthlyIncome * 100).toFixed(0) : 0;

        // Calculate a "Safe" recommendation (approx 10% of income or 30% of surplus, whichever is lower)
        const safeAmount = Math.min(monthlyIncome * 0.1, surplus * 0.3, recommendedAmount * 0.5);

        // Prepare response aligned with frontend recommendation-card.jsx
        return {
            amount: Math.round(recommendedAmount),
            safeAmount: Math.round(safeAmount),
            riskProfile: profileInfo.name,
            confidence: confidence,
            modelMetrics: metrics, // Added for Postman review
            explanation: `You have a monthly surplus of ₹${Math.round(surplus).toLocaleString('en-IN')}.\n\n` +
                `The 50/30/20 rule suggests putting 20% of income (₹${Math.round(monthlyIncome * 0.2).toLocaleString('en-IN')}) into savings/investments. ` +
                `However, in the real world, this depends on your actual surplus.\n\n` +
                `Our AI suggests two options:\n` +
                `🛡️ **Safe**: ₹${Math.round(safeAmount).toLocaleString('en-IN')} (Minimal impact on liquidity)\n` +
                `🚀 **Target**: ₹${Math.round(recommendedAmount).toLocaleString('en-IN')} (Faster wealth building)`,
            financialSnapshot: {
                monthlyIncome: Math.round(monthlyIncome),
                avgMonthlySpend: Math.round(avgMonthlySpend),
                currentMonthSpend: Math.round(currentMonthExpenses),
                savingsRate: monthlyIncome > 0 ? Math.round(((monthlyIncome - avgMonthlySpend) / monthlyIncome) * 100) : 0
            }
        };

    } catch (error) {
        console.error('Error in getInvestmentRecommendation:', error);
        throw error;
    }
}
