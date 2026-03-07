// services/futurePrediction.service.js
import { extractMonthlyTotals, buildRegressionFeatures } from "../ml/features/spending.features.js";
import { LinearRegression } from "../ml/models/linearRegression.js";

export function predictNextMonth(expenses, options = {}) {
    if (!Array.isArray(expenses) || expenses.length === 0) {
        return {
            prediction: 0,
            confidence: 0,
            method: "no-data",
            message: "No expense data available",
            modelMetrics: { f1Score: "0.0000", r2Score: "0.0000", precision: "0.0000", recall: "0.0000" }
        };
    }

    const monthlyTotals = extractMonthlyTotals(expenses);

    // Fallback for insufficient data
    if (monthlyTotals.length < 4) {
        const fallback = monthlyTotals.length > 0
            ? monthlyTotals.reduce((a, b) => a + b, 0) / monthlyTotals.length
            : 0;

        return {
            prediction: Math.round(fallback),
            confidence: Math.min(monthlyTotals.length / 4 * 0.3, 0.3),
            method: "fallback-average",
            message: "Insufficient data for ML prediction",
            modelMetrics: { f1Score: "0.0000", r2Score: "0.0000", precision: "0.0000", recall: "0.0000", note: "Need more months" }
        };
    }

    try {
        // Prepare features and target
        const { X, y, scaler } = buildRegressionFeatures(monthlyTotals);

        if (X.length === 0) {
            throw new Error("Insufficient data points for training");
        }

        // Initialize and train model
        const model = new LinearRegression(X[0].length, {
            learningRate: options.learningRate || 0.05,
            epochs: options.epochs || 1000,
            momentum: 0.9,
            tolerance: 1e-6
        });

        model.train(X, y);

        // Calculate metrics for evaluation (F1-score logic)
        const predictions = X.map(x => model.predict(x));
        let tp = 0, fp = 0, fn = 0;
        const tolerance = 0.15; // 15% margin for "correct" prediction of history

        for (let i = 0; i < y.length; i++) {
            const actualValue = y[i] * scaler.scale + scaler.mean;
            const predValue = predictions[i] * scaler.scale + scaler.mean;
            const error = Math.abs(predValue - actualValue) / (actualValue || 1);

            if (error <= tolerance) {
                tp++;
            } else {
                fp++;
                fn++;
            }
        }

        const precision = tp / (tp + fp) || 0;
        const recall = tp / (tp + fn) || 0;
        const f1 = (2 * precision * recall) / (precision + recall) || 0;
        const r2 = model.score(X, y);

        const modelMetrics = {
            precision: precision.toFixed(4),
            recall: recall.toFixed(4),
            f1Score: f1.toFixed(4),
            r2Score: r2.toFixed(4)
        };

        console.log(`\n🔮 Expense Prediction Metrics:`);
        console.log(`- F1-Score: ${modelMetrics.f1Score}`);
        console.log(`- R² Score: ${modelMetrics.r2Score}\n`);

        // Prepare input for prediction
        const lastIndex = monthlyTotals.length;
        const lastWindow = monthlyTotals.slice(-3);
        const lastMean = lastWindow.reduce((a, b) => a + b, 0) / lastWindow.length;
        const lastStd = Math.sqrt(
            lastWindow.reduce((a, b) => a + Math.pow(b - lastMean, 2), 0) / lastWindow.length
        ) || 1;

        // Feature: Momentum
        let momentum = 0;
        if (monthlyTotals.length >= 2) {
            momentum = monthlyTotals[monthlyTotals.length - 1] - monthlyTotals[monthlyTotals.length - 2];
        }

        const input = [
            lastIndex / 100,                                // Time index
            (lastMean - scaler.mean) / scaler.scale,       // Normalized mean
            lastStd / scaler.scale,                        // Normalized std
            momentum / scaler.scale                        // Normalized Momentum
        ];

        // Make prediction and denormalize
        let prediction = model.predict(input) * scaler.scale + scaler.mean;

        // Apply safety checks
        if (!Number.isFinite(prediction) || prediction < 0) {
            prediction = lastMean;
        }

        return {
            prediction: Math.round(prediction),
            confidence: r2 > 0 ? Math.min(r2, 0.95) : 0.1,
            method: "linear-regression",
            modelMetrics, // Added for Postman review
            features: {
                timeIndex: lastIndex,
                lastMean: Math.round(lastMean),
                lastValue: monthlyTotals[monthlyTotals.length - 1]
            }
        };

    } catch (error) {
        console.error('Prediction error:', error);
        // Fallback to simple moving average
        const lastValues = monthlyTotals.slice(-3);
        const fallback = lastValues.reduce((a, b) => a + b, 0) / lastValues.length;

        return {
            prediction: Math.round(fallback),
            confidence: 0.2,
            method: "fallback-moving-average",
            error: error.message,
            modelMetrics: { f1Score: "Error", r2Score: "Error" }
        };
    }
}