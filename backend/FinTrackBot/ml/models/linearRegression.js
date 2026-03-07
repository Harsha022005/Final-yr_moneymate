// ml/models/linearRegression.js
export class LinearRegression {
    constructor(numFeatures, options = {}) {
        this.weights = new Array(numFeatures).fill(0);
        this.bias = 0;
        this.learningRate = options.learningRate || 0.01;
        this.epochs = options.epochs || 1000;
        this.tolerance = options.tolerance || 1e-6;
        this.momentum = options.momentum || 0.9;
        this.velocityW = new Array(numFeatures).fill(0);
        this.velocityB = 0;
    }

    // Predict using current model parameters
    predict(features) {
        if (!Array.isArray(features) || features.length !== this.weights.length) {
            throw new Error('Invalid features array');
        }

        return features.reduce(
            (sum, val, i) => sum + val * this.weights[i],
            this.bias
        );
    }

    // Train the model using batch gradient descent with momentum
    train(X, y) {
        if (X.length === 0 || X.length !== y.length) {
            throw new Error('Invalid training data');
        }

        let prevCost = Infinity;
        const m = X.length;

        for (let epoch = 0; epoch < this.epochs; epoch++) {
            let dW = new Array(this.weights.length).fill(0);
            let dB = 0;
            let cost = 0;

            // Forward pass and gradient calculation
            for (let i = 0; i < m; i++) {
                const prediction = this.predict(X[i]);
                const error = prediction - y[i];
                cost += error * error;

                // Accumulate gradients
                for (let j = 0; j < this.weights.length; j++) {
                    dW[j] += error * X[i][j];
                }
                dB += error;
            }

            // Calculate cost
            cost = cost / (2 * m);

            // Check for convergence
            if (Math.abs(prevCost - cost) < this.tolerance) {
                console.log(`Converged after ${epoch} epochs`);
                break;
            }
            prevCost = cost;

            // Update parameters with momentum
            for (let j = 0; j < this.weights.length; j++) {
                this.velocityW[j] = this.momentum * this.velocityW[j] + (1 - this.momentum) * (dW[j] / m);
                this.weights[j] -= this.learningRate * this.velocityW[j];
            }
            
            this.velocityB = this.momentum * this.velocityB + (1 - this.momentum) * (dB / m);
            this.bias -= this.learningRate * this.velocityB;
        }
    }

    // Calculate R² score for model evaluation
    score(X, y) {
    if (X.length === 0 || X.length !== y.length) return 0;
    const yMean = y.reduce((a, b) => a + b, 0) / y.length;
    let ssTotal = 0;
    let ssResidual = 0;
    for (let i = 0; i < X.length; i++) {
        const prediction = this.predict(X[i]);
        ssTotal += Math.pow(y[i] - yMean, 2);
        ssResidual += Math.pow(y[i] - prediction, 2);
    }
    // Handle case where ssTotal is 0 (constant y)
    if (ssTotal === 0) {
        // If the model perfectly predicts the constant value, return 1
        // Otherwise return 0
        return ssResidual === 0 ? 1 : 0;
    }
    const r2 = 1 - (ssResidual / ssTotal);
    return Math.max(-1, Math.min(1, r2)); // Ensure result is between -1 and 1
}
}