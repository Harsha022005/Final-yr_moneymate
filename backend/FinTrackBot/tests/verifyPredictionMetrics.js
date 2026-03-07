
import { predictNextMonth } from '../services/futurePrediction.service.js';

// Mock some expense data (Monthly totals: 10k, 12k, 11k, 13k, 14k)
const mockExpenses = [
    { amount: 10000, date: new Date('2025-08-15') },
    { amount: 12000, date: new Date('2025-09-15') },
    { amount: 11000, date: new Date('2025-10-15') },
    { amount: 13000, date: new Date('2025-11-15') },
    { amount: 14000, date: new Date('2025-12-15') }
];

async function verifyPrediction() {
    console.log("--- Verifying Future Prediction Metrics ---");

    const result = predictNextMonth(mockExpenses);

    console.log('\n--- Prediction Result ---');
    console.log(`Prediction: ₹${result.prediction}`);
    console.log(`Confidence: ${result.confidence}`);
    console.log(`Method: ${result.method}`);

    console.log('\n--- Model Metrics (Visible in Postman) ---');
    console.dir(result.modelMetrics);

    if (result.modelMetrics && result.modelMetrics.f1Score) {
        console.log('\n✅ Verification Passed: F1-score and metrics found.');
    } else {
        console.log('\n❌ Verification Failed: Missing modelMetrics.');
    }
}

verifyPrediction().catch(console.error);
