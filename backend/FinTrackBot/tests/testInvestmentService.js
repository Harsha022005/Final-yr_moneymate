// tests/testInvestmentService.js
import { getInvestmentRecommendation } from '../services/investment.service.js';

// Test 1: Basic recommendation with no historical data
async function test1() {
  const result = await getInvestmentRecommendation({
    income: 100000,          // Monthly income in INR
    savings: 30000,          // Monthly savings
    expenses: [
      { amount: 50000, category: 'rent' },
      { amount: 20000, category: 'food' }
    ],
    currentBalance: 500000    // Current account balance
  });
  console.log('Test 1 - Basic Recommendation:');
  console.log(JSON.stringify(result, null, 2));
}

// Test 2: With historical recommendations
async function test2() {
  const result = await getInvestmentRecommendation({
    income: 100000,
    savings: 30000,
    expenses: [
      { amount: 50000, category: 'rent' },
      { amount: 20000, category: 'food' }
    ],
    currentBalance: 500000,
    historicalRecommendations: [
      {
        predicted: { riskScore: 0.7, recommendedAmount: 25000 },
        actual: { riskScore: 0.65, suitableAmount: 23000 }
      },
      {
        predicted: { riskScore: 0.5, recommendedAmount: 20000 },
        actual: { riskScore: 0.6, suitableAmount: 18000 }
      }
    ]
  });
  console.log('\nTest 2 - With Historical Data:');
  console.log(JSON.stringify(result, null, 2));
}

// Test 3: With actual investment data
async function test3() {
  const result = await getInvestmentRecommendation({
    income: 100000,
    savings: 30000,
    expenses: [
      { amount: 50000, category: 'rent' },
      { amount: 20000, category: 'food' }
    ],
    currentBalance: 500000,
    actualInvestment: 22000,
    actualRiskScore: 0.68
  });
  console.log('\nTest 3 - With Actual Investment Data:');
  console.log(JSON.stringify(result, null, 2));
}

// Test 4: Edge case - Low income
async function test4() {
  const result = await getInvestmentRecommendation({
    income: 30000,
    savings: 5000,
    expenses: [
      { amount: 20000, category: 'rent' },
      { amount: 5000, category: 'food' }
    ],
    currentBalance: 50000
  });
  console.log('\nTest 4 - Low Income:');
  console.log(JSON.stringify(result, null, 2));
}

// Test 5: Edge case - High spending volatility
async function test5() {
  const result = await getInvestmentRecommendation({
    income: 100000,
    savings: 20000,
    expenses: [
      { amount: 20000, category: 'rent' },
      { amount: 10000, category: 'food' },
      { amount: 50000, category: 'shopping' }  // High volatility
    ],
    currentBalance: 300000
  });
  console.log('\nTest 5 - High Volatility:');
  console.log(JSON.stringify(result, null, 2));
}

// Run all tests
async function runTests() {
  try {
    await test1();
    await test2();
    await test3();
    await test4();
    await test5();
  } catch (error) {
    console.error('Test failed:', error);
  }
}

runTests();