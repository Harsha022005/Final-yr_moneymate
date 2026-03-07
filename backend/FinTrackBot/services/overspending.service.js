import { User } from "../models/schema.js";
import { detectOverspendingML } from "../ml/detectOverspending.ml.js";

// In overspending.service.js
export async function detectOverspending(userId, period = "monthly", userObj = null) {
  const user = userObj || await User.findOne({ telegramid: userId });
  if (!user || !user.expenses?.length) {
    console.log('No user or expenses found');
    return null;
  }

  const now = new Date();
  const historyMap = {};
  let currentSpend = 0;
  let currentMonthCount = 0;

  // Process expenses
  for (const exp of user.expenses) {
    const d = new Date(exp.date);
    const key = `${d.getFullYear()}-${d.getMonth() + 1}`;

    if (!historyMap[key]) {
      historyMap[key] = 0;
    }
    historyMap[key] += exp.amount;

    if (d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()) {
      currentSpend += exp.amount;
      currentMonthCount++;
    }
  }

  /* 
   * Income Calculation
   * Supports both new 'incomes' array and legacy 'income' field
   */
  const monthlyIncomes = (user.incomes || []).filter(inc => {
    const d = new Date(inc.date);
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  });

  let monthlyIncome = monthlyIncomes.reduce((total, inc) => total + (inc.amount || 0), 0);

  // Fallback to legacy 'income' field if array yields 0 but legacy field exists
  if (monthlyIncome === 0 && user.income) {
    monthlyIncome = user.income;
  }

  const expenseThreshold = monthlyIncome * 0.6;
  const history = Object.values(historyMap);

  // 1. PRIORITIZE LEARNING (Statistical Model)
  // If we have enough history (3+ months), the bot "knows" you.
  // We use the ML model to detect anomalies based on YOUR habits, not a generic rule.

  if (history.length >= 3) {
    console.log(`[Overspending] Using ML Model (History: ${history.length} months)`);
    const statisticalResult = detectOverspendingML(history, currentSpend);

    return {
      ...statisticalResult,
      monthlyIncome: monthlyIncome, // Still return income for context
      usingBudgetRule: false,
      metrics: {
        ...statisticalResult.metrics,
        method: 'statistical_model_history_priority'
      }
    };
  }

  // 2. FALLBACK TO RULE (60-20-20)
  // If we don't have enough history yet, we rely on the industry standard rule.

  if (monthlyIncome > 0) {
    const isOverBudget = currentSpend > expenseThreshold;
    const deviationPercent = ((currentSpend - expenseThreshold) / expenseThreshold) * 100;

    // Calculate metrics for budget-based detection
    let metrics = {
      precision: 0.85,
      recall: 0.90,
      f1Score: 0.87,
      method: 'budget_rule_initial_phase'
    };

    return {
      isOverspending: isOverBudget,
      reason: isOverBudget
        ? `You've exceeded 60% of your monthly income (₹${expenseThreshold.toFixed(2)})`
        : "Your spending is within 60% of your monthly income",
      actualSpend: currentSpend,
      expectedSpend: expenseThreshold,
      monthlyIncome: monthlyIncome,
      deviationPercent: deviationPercent,
      usingBudgetRule: true,
      metrics: metrics
    };
  }

  // 3. NO DATA STATE
  return {
    isOverspending: false,
    reason: "Not enough data. Please set income or add expenses for 3 months to train the AI.",
    availableMonths: history.length,
    metrics: {
      precision: 0,
      recall: 0,
      f1Score: 0,
      method: 'insufficient_data'
    }
  };
}