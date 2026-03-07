import { ExpensePredictor } from "../ml/models/expensePredictor.model.js";
import { buildTrainingData } from "../ml/features/expense.features.js";

/**
 * Predicts the expense for the next month using a weighted average approach
 * @param {Array<number>} monthlyTotals - Array of monthly expense totals (last 3-6 months)
 * @returns {number} Predicted amount for the next month
 */
export function predictNextMonth(monthlyTotals) {
    if (!Array.isArray(monthlyTotals) || monthlyTotals.length < 3) {
        throw new Error('At least 3 months of data is required for prediction');
    }

    // Use the last 6 months if available, otherwise use all available
    const recentMonths = monthlyTotals.slice(-6);
    const n = recentMonths.length;
    
    // Calculate weighted average (more recent months have higher weight)
    let weightedSum = 0;
    let weightSum = 0;
    
    recentMonths.forEach((amount, index) => {
        const weight = (index + 1) / n; // Linear weights from 1/n to 1
        weightedSum += amount * weight;
        weightSum += weight;
    });
    
    // Add a small seasonal adjustment (5% increase for the next month)
    const basePrediction = weightedSum / weightSum;
    const seasonalAdjustment = 1.05; // 5% increase
    
    return basePrediction * seasonalAdjustment;
}

// Fallback prediction method if ML model is not available
class SimpleExpensePredictor {
    constructor() {
        this.weights = [0.6, 0.3, 0.1]; // Weights for last 3 months
    }
    
    predict(monthlyTotals) {
        const lastThree = monthlyTotals.slice(-3);
        return lastThree.reduce((sum, val, i) => 
            sum + (val * (this.weights[i] || 0)), 0);
    }
}

// Export the simple predictor as fallback
export { SimpleExpensePredictor };
