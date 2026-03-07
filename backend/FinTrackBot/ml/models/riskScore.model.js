/**
 * Investment Risk Model
 * Calculates risk profile and investment recommendations
 */

/**
 * Calculate risk score (0-100) based on financial health
 * @param {Object} financials - User's financial data
 * @param {number} financials.monthlyIncome - Monthly income
 * @param {number} financials.monthlyExpenses - Monthly expenses
 * @param {number} financials.savings - Current savings amount
 * @param {number} financials.debt - Current debt amount
 * @param {number} financials.age - User's age
 * @returns {number} Risk score (0-100)
 */
export function calculateRiskScore({ monthlyIncome, monthlyExpenses, savings, debt, age }) {
  // Calculate basic financial ratios
  const savingsRate = (monthlyIncome - monthlyExpenses) / monthlyIncome;
  const emergencyFundMonths = savings / monthlyExpenses;
  const debtToIncome = monthlyExpenses > 0 ? debt / monthlyIncome : 0;
  
  // Calculate score components (0-100 each)
  const savingsRateScore = Math.min(100, Math.max(0, savingsRate * 200)); // 0-100
  const emergencyFundScore = Math.min(100, emergencyFundMonths * 10); // 10 months = 100
  const debtScore = Math.max(0, 100 - (debtToIncome * 50)); // Lower debt = higher score
  const ageScore = Math.min(100, (65 - age) * 2); // Younger = more risk capacity
  
  // Weighted average of components
  const score = (
    (savingsRateScore * 0.3) +
    (emergencyFundScore * 0.3) +
    (debtScore * 0.25) +
    (ageScore * 0.15)
  );
  
  return Math.round(Math.min(100, Math.max(0, score)));
}

/**
 * Get investment profile based on risk score
 * @param {number} score - Risk score (0-100)
 * @returns {Object} Profile with name and asset allocation
 */
export function getRiskProfile(score) {
  if (score >= 80) return { 
    name: 'Aggressive',
    allocation: { stocks: 80, bonds: 15, cash: 5 },
    description: 'High growth potential, higher risk',
    timeHorizon: '10+ years'
  };
  if (score >= 65) return { 
    name: 'Growth',
    allocation: { stocks: 65, bonds: 30, cash: 5 },
    description: 'Balanced growth and income',
    timeHorizon: '7-10 years'
  };
  if (score >= 45) return { 
    name: 'Balanced',
    allocation: { stocks: 50, bonds: 40, cash: 10 },
    description: 'Moderate growth with income',
    timeHorizon: '5-7 years'
  };
  if (score >= 25) return { 
    name: 'Conservative',
    allocation: { stocks: 30, bonds: 60, cash: 10 },
    description: 'Lower risk, stable income',
    timeHorizon: '3-5 years'
  };
  return { 
    name: 'Very Conservative',
    allocation: { stocks: 10, bonds: 80, cash: 10 },
    description: 'Very low risk, stable income',
    timeHorizon: 'Less than 3 years'
  };
}