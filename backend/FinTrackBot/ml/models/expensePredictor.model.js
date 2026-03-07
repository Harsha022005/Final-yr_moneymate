export class ExpensePredictor {
    constructor(learningRate = 0.000001) {
        this.lr = learningRate;
        this.weights = [0, 0, 0]; // bias, w1, w2
    }

    predict(features) {
        return (
            this.weights[0] +
            this.weights[1] * features[0] +
            this.weights[2] * features[1]
        );
    }

    train(features, actual) {
        const predicted = this.predict(features);
        const error = predicted - actual;

        // Gradient Descent update
        this.weights[0] -= this.lr * error;
        this.weights[1] -= this.lr * error * features[0];
        this.weights[2] -= this.lr * error * features[1];
    }
}
