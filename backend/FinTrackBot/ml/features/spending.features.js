// ml/features/spending.features.js
export function extractMonthlyTotals(expenses) {
    if (!Array.isArray(expenses) || expenses.length === 0) {
        return [];
    }

    const monthlyMap = new Map();

    expenses.forEach(expense => {
        try {
            const date = new Date(expense.date);
            if (isNaN(date)) return;

            const year = date.getFullYear();
            const month = date.getMonth();
            const key = `${year}-${month}`;

            const amount = parseFloat(expense.amount);
            if (isNaN(amount) || amount < 0) return;

            monthlyMap.set(key, (monthlyMap.get(key) || 0) + amount);
        } catch (e) {
            console.warn('Invalid expense record:', expense, e);
        }
    });

    // Convert to array of values, sorted by date
    return Array.from(monthlyMap.entries())
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([_, amount]) => amount);
}

export function buildRegressionFeatures(monthlyTotals, lookback = 3) {
    const X = [];
    const y = [];
    const n = monthlyTotals.length;

    if (n <= lookback) {
        return { X, y };
    }

    // Calculate statistics for scaling
    const mean = monthlyTotals.reduce((a, b) => a + b, 0) / n;
    const std = Math.sqrt(monthlyTotals.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / n);
    const scale = std > 0 ? std : 1;

    for (let i = lookback; i < n; i++) {
        // Features: [time_index, rolling_mean, rolling_std, previous_value]
        const window = monthlyTotals.slice(i - lookback, i);
        const windowMean = window.reduce((a, b) => a + b, 0) / lookback;
        const windowStd = Math.sqrt(
            window.reduce((a, b) => a + Math.pow(b - windowMean, 2), 0) / lookback
        ) || 1;

        // Feature 3: Momentum (t-1) - (t-2)
        // Represents the rate of change or trend direction
        let momentum = 0;
        if (i >= 2) {
            momentum = monthlyTotals[i - 1] - monthlyTotals[i - 2];
        }

        X.push([
            i / 100,                            // Time index (scaled)
            (windowMean - mean) / scale,        // Normalized rolling mean
            windowStd / scale,                  // Normalized rolling std
            momentum / scale                    // Momentum (normalized)
        ]);

        // Target (next month's expense, normalized)
        y.push((monthlyTotals[i] - mean) / scale);
    }

    return {
        X,
        y,
        scaler: { mean, scale } // Store scaling parameters
    };
}