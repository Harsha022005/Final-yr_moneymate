export function buildTrainingData(monthlyTotals) {
    const data = [];

    for (let i = 1; i < monthlyTotals.length; i++) {
        const prev = monthlyTotals[i - 1];
        const avg3 =
            monthlyTotals
                .slice(Math.max(0, i - 3), i)
                .reduce((a, b) => a + b, 0) /
            Math.min(3, i);

        data.push({
            features: [i, avg3],
            label: monthlyTotals[i]
        });
    }

    return data;
}
