import { LinearRegression } from './linearRegression.js';

/**
 * InvestmentRecommender
 * Uses Linear Regression to predict optimal investment amounts
 * based on income, expenses, and savings rate.
 */
export class InvestmentRecommender {
    constructor() {
        // Features: [monthlyIncome, avgMonthlySpend, savingsRate]
        this.model = new LinearRegression(3, {
            learningRate: 0.1, // Increased for normalized features
            epochs: 5000,
            tolerance: 1e-8,
            momentum: 0.95
        });
        this.isTrained = false;
    }

    /**
     * Generate synthetic training data
     * Follows balanced financial principles (e.g., 20% savings rule)
     */
    generateTrainingData() {
        const X = [];
        const y = [];

        for (let i = 0; i < 300; i++) {
            const income = 15000 + Math.random() * 285000; // 15k to 300k
            const spendRatio = 0.3 + Math.random() * 0.6; // 30% to 90% spend
            const spend = income * spendRatio;
            const surplus = income - spend;
            const savingsRate = surplus / income;

            // Balanced Goal: 
            // Mix of 15% of income and 30% of surplus
            let investmentAmount = (income * 0.15 + surplus * 0.3) / 2;

            // Hard caps to keep it realistic
            investmentAmount = Math.min(investmentAmount, surplus * 0.5); // Never > 50% of surplus
            investmentAmount = Math.min(investmentAmount, income * 0.25);  // Never > 25% of total income

            X.push([income, spend, savingsRate]);
            y.push(Math.max(0, investmentAmount));
        }

        return { X, y };
    }

    /**
     * Train the model
     */
    train() {
        const { X, y } = this.generateTrainingData();
        const normalizedX = this.normalize(X);

        // Scale labels (y) to be in a smaller range for faster convergence
        const scaledY = y.map(val => val / 100000); // Scale by 100k

        this.model.train(normalizedX, scaledY);
        this.isTrained = true;
        console.log('InvestmentRecommender ML Model trained successfully.');
    }

    /**
     * Normalization: Income and Spend are scaled by 300k, Rate is already 0-1
     */
    normalize(X) {
        return X.map(features => [
            features[0] / 300000,
            features[1] / 300000,
            features[2]
        ]);
    }

    /**
     * Predict investment amount
     */
    /**
     * Calculate Risk Score (0-100)
     * Formula: Base(50) + AgeFactor + DebtFactor + EmergencyFundFactor
     */
    calculateRiskScore(age, debtToIncome, emergencyFundMonths) {
        let score = 50;

        // 1. Age Factor: Younger = Higher Risk
        score += (40 - age);

        // 2. Debt Factor: High Debt = Lower Risk
        // DTI of 0.2 (20%) -> 0 adjustment. Higher debt penalizes.
        score += (20 - (debtToIncome * 100));

        // 3. Emergency Fund: More savings = Higher Risk Capacity
        // Baseline is 3 months. Each extra month adds 5 points.
        score += (emergencyFundMonths - 3) * 5;

        return Math.max(0, Math.min(100, Math.round(score)));
    }

    /**
     * Predict investment amount with Risk Adjustment
     */
    recommend(income, spend, userProfile = {}) {
        if (!this.isTrained) {
            this.train();
        }

        const surplus = income - spend;
        if (surplus <= 0) return { amount: 0, riskScore: 0, strategy: 'Debt Repayment' };

        const savingsRate = surplus / income;
        const normalizedInput = this.normalize([[income, spend, savingsRate]])[0];

        // 1. Base Prediction from Linear Regression
        const predictedScaled = this.model.predict(normalizedInput);
        let baseAmount = predictedScaled * 100000;

        // 2. Calculate Risk Score
        const age = userProfile.age || 30; // Default
        const dti = userProfile.debtToIncome || 0;
        const funds = userProfile.emergencyFundMonths || 3;

        const riskScore = this.calculateRiskScore(age, dti, funds);

        // 3. Modulate Investment based on Risk Score
        // High Risk (>70): Invest more aggressively (up to 110% of base)
        // Low Risk (<40): Invest conservatively (only 80% of base)
        let riskMultiplier = 0.8 + (riskScore / 100) * 0.4; // Range: 0.8x to 1.2x
        let finalAmount = baseAmount * riskMultiplier;

        // 4. Apply Hard Safety Caps
        const maxByIncome = income * 0.25;
        const maxBySurplus = surplus * 0.5;
        finalAmount = Math.max(0, Math.min(finalAmount, maxByIncome, maxBySurplus));

        let strategy = 'Balanced';
        if (riskScore > 70) strategy = 'Growth/Aggressive';
        else if (riskScore < 40) strategy = 'Conservative/Preservation';

        return {
            amount: Math.round(finalAmount),
            riskScore,
            strategy,
            details: {
                basePrediction: Math.round(baseAmount),
                riskModifier: riskMultiplier.toFixed(2)
            }
        };
    }

    /**
     * Evaluate the model and return metrics including a pseudo-F1 score
     * This treats predictions within a 10% error margin as 'correct' (Positive Class)
     */
    evaluate() {
        if (!this.isTrained) this.train();

        const { X, y } = this.generateTrainingData(); // Generate 300 test samples
        const normalizedX = this.normalize(X);
        const predictions = normalizedX.map(x => this.model.predict(x) * 100000);

        let tp = 0, fp = 0, fn = 0;
        const tolerance = 0.10; // 10% margin for 'correctness'

        for (let i = 0; i < y.length; i++) {
            const error = Math.abs(predictions[i] - y[i]) / (y[i] || 1);
            if (error <= tolerance) {
                tp++;
            } else {
                // For a regression-to-classification mapping:
                // If it's outside tolerance, it's both a False Positive (predicted wrong value)
                // and a False Negative (missed the 'correct' value range)
                fp++;
                fn++;
            }
        }

        const precision = tp / (tp + fp) || 0;
        const recall = tp / (tp + fn) || 0;
        const f1 = (2 * precision * recall) / (precision + recall) || 0;

        return {
            precision: precision.toFixed(4),
            recall: recall.toFixed(4),
            f1Score: f1.toFixed(4),
            r2Score: this.model.score(normalizedX, y.map(val => val / 100000)).toFixed(4)
        };
    }
}


// Singleton instance
export const investmentML = new InvestmentRecommender();
