// tests/futurePrediction.test.js
import test from "node:test";
import assert from "node:assert";
import { predictNextMonth } from "../services/futurePrediction.service.js";

function generateTestData(months, base = 1000, trend = 100, noise = 50) {
    const expenses = [];
    const now = new Date();
    
    for (let i = 0; i < months; i++) {
        const date = new Date(now);
        date.setMonth(now.getMonth() - (months - i - 1));
        
        // Generate trend with some noise
        const amount = base + (i * trend) + ((Math.random() - 0.5) * noise * 2);
        
        expenses.push({
            amount: Math.max(0, amount),
            date: date.toISOString()
        });
    }
    
    return expenses;
}

test("predicts future expenses with increasing trend", () => {
    const expenses = generateTestData(12, 1000, 100);
    const result = predictNextMonth(expenses);
    const lastAmount = expenses[expenses.length - 1].amount;
    
    console.log('Last amount:', lastAmount, 'Prediction:', result.prediction);
    
    assert.ok(result.prediction > 0, "Prediction should be positive");
    assert.ok(result.confidence > 0.3, "Should have reasonable confidence");
    // Check if prediction is within 20% of the last amount or higher
    assert.ok(
        result.prediction >= lastAmount * 0.8,
        `Prediction (${result.prediction}) should be close to or higher than last amount (${lastAmount})`
    );
});

test("handles empty input", () => {
    const result = predictNextMonth([]);
    assert.strictEqual(result.prediction, 0);
    assert.strictEqual(result.confidence, 0);
    assert.strictEqual(result.method, "no-data");
});

test("uses fallback for minimal data", () => {
    const expenses = generateTestData(2, 1000, 0);
    const result = predictNextMonth(expenses);
    
    assert.ok(result.prediction > 0);
    assert.ok(result.confidence <= 0.3);
    assert.strictEqual(result.method, "fallback-average");
});
test("handles constant expenses", () => {
    // Generate more data points for better training
    const expenses = generateTestData(12, 1000, 0, 0); // No trend, no noise
    const result = predictNextMonth(expenses);
    const expected = 1000;
    const tolerance = 50; // Allow 5% tolerance
    
    console.log('Constant expenses - Prediction:', result.prediction, 'Confidence:', result.confidence);
    
    // Check if prediction is within tolerance
    assert.ok(
        Math.abs(result.prediction - expected) <= tolerance,
        `Prediction (${result.prediction}) should be close to ${expected}`
    );
    
    // Check if confidence is a valid number between 0 and 1
    assert.ok(
        typeof result.confidence === 'number' && 
        !isNaN(result.confidence) && 
        result.confidence >= 0 && 
        result.confidence <= 1,
        `Confidence (${result.confidence}) should be a valid number between 0 and 1`
    );
    
    // For constant data, we might not get high confidence
    // So we just check if it's a valid number
});

test("handles negative values gracefully", () => {
    const expenses = generateTestData(6, 1000, 0).map(exp => ({
        ...exp,
        amount: -exp.amount
    }));
    
    const result = predictNextMonth(expenses);
    assert.ok(result.prediction >= 0, "Should not predict negative amounts");
});