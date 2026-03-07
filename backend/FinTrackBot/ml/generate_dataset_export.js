
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// 1. Import ML Modules
import { investmentML } from './models/investmentRecommender.js';
import { detectOverspendingML } from './detectOverspending.ml.js';
import { extractMonthlyTotals, buildRegressionFeatures } from './features/spending.features.js';

// Setup paths
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const EXPORT_TXT = path.join(__dirname, '../../synthetic_training_data_preview.txt');
const EXPORT_JSON = path.join(__dirname, '../../synthetic_training_data.json');

// --- Generators ---

function generateInvestmentData() {
    console.log('Generating Investment Profiles...');
    const { X, y } = investmentML.generateTrainingData();
    // Format: Income, Spend, SavingsRate -> Target
    return X.map((row, i) => ({
        id: i + 1,
        income: Math.round(row[0]),
        spend: Math.round(row[1]),
        savingsRate: (row[2] * 100).toFixed(1) + '%',
        targetInvestment: Math.round(y[i])
    }));
}

function generateOverspendingData() {
    console.log('Generating Overspending History...');
    const history = [];
    let current = 2000;

    // Generate 50 transactions
    for (let i = 0; i < 50; i++) {
        // Random normal variation
        const change = (Math.random() - 0.5) * 0.2;
        let amount = current * (1 + change);

        // Inject Anomaly at index 45
        if (i === 45) {
            amount = current * 3.5; // Huge spike
        }

        history.push(Math.round(amount));
    }

    // Run detection on the sequence
    const analysis = [];
    // Need a sliding window to run detection properly
    for (let i = 10; i < history.length; i++) {
        const window = history.slice(0, i);
        const currentVal = history[i];
        const result = detectOverspendingML(window, currentVal);

        if (!result) {
            console.error('Error: detectOverspendingML returned null/undefined for id:', i);
            continue;
        }

        try {
            analysis.push({
                id: i,
                amount: currentVal,
                isAnomaly: result.isOverspending,
                zScore: (result.metrics && result.metrics.zScore !== undefined) ? Number(result.metrics.zScore).toFixed(2) : 'N/A'
            });
        } catch (e) {
            console.error('Error processing result for id:', i, e);
            console.error('Result object was:', JSON.stringify(result));
        }
    }

    return analysis;
}

function generatePredictionData() {
    console.log('Generating Prediction Features...');
    // Generate 36 months of data
    const expenses = [];
    const now = new Date();
    let amount = 5000;

    for (let i = 0; i < 36; i++) {
        const date = new Date(now);
        date.setMonth(now.getMonth() - (35 - i));

        // Seasonal trend + noise
        const seasonal = Math.sin(i / 6) * 1000;
        const noise = (Math.random() - 0.5) * 500;
        amount = 5000 + seasonal + noise;

        expenses.push({
            amount: Math.abs(amount),
            date: date.toISOString()
        });
    }

    const monthlyTotals = extractMonthlyTotals(expenses);
    const { X, y } = buildRegressionFeatures(monthlyTotals);

    // X format: [timeIndex, mean, std, momentum] (normalized)
    // We want to show the raw feature concepts if possible, but X is normalized.
    // Let's just output the Normalized Features Matrix as the "Training Data"
    return X.map((row, i) => ({
        monthIndex: i,
        norm_mean_t3: row[1].toFixed(4),
        norm_std_t3: row[2].toFixed(4),
        norm_momentum_t1: row[3].toFixed(4),
        target_next_month: y[i].toFixed(4)
    }));
}

// --- Main ---

const investmentData = generateInvestmentData();
const overspendingData = generateOverspendingData();
const predictionData = generatePredictionData();

// 1. Create Human-Readable Text Report
let report = `================================================================================
MONEYMATE SYNTHETIC TRAINING DATA REPORT
Generated: ${new Date().toISOString()}
================================================================================

1. MODULE B: INVESTMENT RECOMMENDATION ENGINE (Sample of 300 Synthetic Profiles)
   - Methodology: 50/30/20 Rule + Gaussian Noise
   - Columns: Income, Spend, Savings Rate -> Optimal Investment Target

ID   | Income  | Spend   | Rate  | Target Inv.
-----|---------|---------|-------|------------
`;

investmentData.slice(0, 20).forEach(row => {
    report += `${row.id.toString().padEnd(5)}| $${row.income.toString().padEnd(6)} | $${row.spend.toString().padEnd(6)} | ${row.savingsRate.padEnd(5)} | $${row.targetInvestment}\n`;
});
report += `... (280 more profiles) ...\n\n`;

report += `================================================================================
2. MODULE A: OVERSPENDING DETECTION (Anomaly Sequence)
   - Methodology: Z-Score > 1.5 triggers anomaly
   - Showing a sequence with an injected spike at ID 45

ID   | Amount  | Z-Score | Status
-----|---------|---------|-------
`;

overspendingData.slice(-15).forEach(row => { // Show last 15
    const status = row.isAnomaly ? '[!!! ANOMALY !!!]' : 'Normal';
    report += `${row.id.toString().padEnd(5)}| $${row.amount.toString().padEnd(6)} | ${row.zScore.padEnd(7)} | ${status}\n`;
});

report += `\n================================================================================
3. MODULE C: FUTURE EXPENSE FORECASTING (Feature Matrix)
   - Methodology: Auto-Regressive Lag Features (Mean, Volatility, Momentum)
   - Data: Normalized values ready for Linear Regression

Idx | Mean(t-3) | Std(t-3) | Mom(t-1) | Target(t)
----|-----------|----------|----------|----------
`;

predictionData.slice(0, 20).forEach(row => {
    report += `${row.monthIndex.toString().padEnd(4)}| ${row.norm_mean_t3.padEnd(9)} | ${row.norm_std_t3.padEnd(8)} | ${row.norm_momentum_t1.padEnd(8)} | ${row.target_next_month}\n`;
});
report += `... (More rows) ...\n`;

report += `\n================================================================================\nEND OF REPORT\n`;

// Write Files
fs.writeFileSync(EXPORT_TXT, report);
fs.writeFileSync(EXPORT_JSON, JSON.stringify({ investmentData, overspendingData, predictionData }, null, 2));

console.log(`\n✅ Data Export Complete!`);
console.log(`   - Text Report: ${EXPORT_TXT}`);
console.log(`   - JSON Data:   ${EXPORT_JSON}\n`);
