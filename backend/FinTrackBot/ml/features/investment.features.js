/**
 * Investment Features
 * Handles feature extraction and investment amount calculation
 */

import { getRiskProfile } from '../models/riskScore.model.js';

/**
 * Calculate confidence score based on data completeness
 * @param {Object} data - User's financial data
 * @returns {number} Confidence score (0-100)
 */
function calculateConfidenceScore(data) {
    let score = 0;
    
    // Basic data completeness check
    if (data.income > 0) score += 30;
    if (data.savings >= 0) score += 20;
    if (data.expenses && data.expenses.length > 2) score += 30;
    if (data.debt >= 0) score += 20;
    
    return Math.min(100, score);
}

/**
 * Calculate safe investment amount based on financial metrics
 * @param {Object} financials - User's financial data
 * @param {number} financials.income - Monthly income
 * @param {number} financials.savingsRate - Current savings rate (0-1)
 * @param {number} financials.currentBalance - Current balance
 * @param {number} financials.avgMonthlySpend - Average monthly spend
 * @param {number} riskScore - Calculated risk score (0-100)
 * @returns {Object} Investment recommendation
 */
function calculateInvestmentRecommendation(financials, riskScore) {
    const { income, savingsRate, currentBalance = 0, avgMonthlySpend } = financials;
    
    // Calculate monthly savings
    const monthlySavings = income - avgMonthlySpend;
    
    // Calculate investment amount (30-50% of monthly savings based on risk score)
    const investmentPercentage = 0.3 + (riskScore / 100 * 0.2); // 30-50% range
    let recommendedInvestment = Math.floor(monthlySavings * investmentPercentage);
    
    // Ensure we don't recommend more than available after emergency fund
    const emergencyFund = avgMonthlySpend * 3; // 3 months of expenses
    const maxInvestment = Math.max(0, currentBalance - emergencyFund);
    recommendedInvestment = Math.min(recommendedInvestment, maxInvestment);
    
    // Calculate confidence based on data completeness
    const confidence = calculateConfidenceScore({
        income,
        savings: currentBalance,
        expenses: financials.expenses || [],
        debt: financials.debt || 0
    });
    
    // Get risk profile
    const riskProfile = getRiskProfile(riskScore);
    
    return {
        recommendedInvestment: Math.max(0, recommendedInvestment),
        riskScore,
        riskProfile,
        metrics: { confidence }
    };
}

/**
 * Extract financial features from user data
 * @param {Object} userData - User's financial data
 * @returns {Object} Extracted features
 */
function extractFeatures(userData) {
    const { income, savings = 0, expenses = [], currentBalance = 0 } = userData;
    
    // Calculate average monthly spend
    const monthlyExpenses = expenses.length > 0 
        ? expenses.reduce((sum, exp) => sum + exp.amount, 0) / expenses.length
        : 0;
    
    // Calculate volatility (standard deviation of expenses)
    const expenseAmounts = expenses.map(e => e.amount);
    const expenseMean = monthlyExpenses;
    const variance = expenseAmounts.reduce((sum, amount) => sum + Math.pow(amount - expenseMean, 2), 0) / expenseAmounts.length;
    const volatility = Math.sqrt(variance);
    
    // Calculate savings rate
    const savingsRate = income > 0 ? savings / income : 0;
    
    // Count overspending instances
    const overspendingFrequency = expenses.filter(e => e.amount > expenseMean * 1.5).length;
    
    return {
        income,
        savingsRate,
        currentBalance,
        avgMonthlySpend: monthlyExpenses,
        volatility,
        overspendingFrequency,
        historicalRecommendations: userData.historicalRecommendations || []
    };
}

export { extractFeatures, calculateInvestmentRecommendation };