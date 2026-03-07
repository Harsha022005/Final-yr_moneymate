
export function detectOverspendingML(history, currentSpend) {
  if (!history || history.length < 3) {
    return {
      isOverspending: false,
      reason: "INSUFFICIENT_DATA"
    };
  }

  // Welford's Online Algorithm for O(1) updates
  let mean = 0;
  let M2 = 0;

  for (let i = 0; i < history.length; i++) {
    const x = history[i];
    const delta = x - mean;
    mean += delta / (i + 1);
    const delta2 = x - mean;
    M2 += delta * delta2;
  }

  const variance = M2 / history.length;
  const stdDev = Math.sqrt(variance);

  if (stdDev === 0) {
    return {
      isOverspending: false,
      reason: "NO_VARIANCE"
    };
  }

  const zScore = (currentSpend - mean) / stdDev;
  const isOverspending = zScore >= 1.5;

  // Enhanced F1-score calculation with real data
  const threshold = 1.5;
  let truePositives = 0;
  let falsePositives = 0;
  let falseNegatives = 0;

  // Use a sliding window approach for more robust evaluation
  const minWindowSize = 3; // Minimum months needed for a valid prediction
  for (let i = minWindowSize; i < history.length; i++) {
    const window = history.slice(0, i);
    const current = history[i];
    const windowMean = window.reduce((a, b) => a + b, 0) / window.length;
    const windowVariance = window.reduce((s, v) => s + Math.pow(v - windowMean, 2), 0) / window.length;
    const windowStdDev = Math.sqrt(windowVariance);

    if (windowStdDev > 0) {
      const currentZScore = (current - windowMean) / windowStdDev;
      const predictedOverspending = currentZScore >= threshold;

      // Define actual overspending as spending more than 1.2x the historical mean
      const actualOverspending = current > (windowMean * 1.2);

      if (predictedOverspending && actualOverspending) truePositives++;
      else if (predictedOverspending && !actualOverspending) falsePositives++;
      else if (!predictedOverspending && actualOverspending) falseNegatives++;
    }
  }

  // Calculate metrics with Laplace smoothing to avoid division by zero
  const alpha = 1; // Laplace smoothing factor
  const precision = (truePositives + alpha) / (truePositives + falsePositives + alpha);
  const recall = (truePositives + alpha) / (truePositives + falseNegatives + alpha);
  const f1Score = 2 * (precision * recall) / (precision + recall) || 0;

  return {
    isOverspending,
    zScore,
    expectedSpend: Math.round(mean),
    actualSpend: Math.round(currentSpend),
    deviationPercent: ((currentSpend - mean) / mean) * 100,
    metrics: {
      precision: parseFloat(precision.toFixed(2)),
      recall: parseFloat(recall.toFixed(2)),
      f1Score: parseFloat(f1Score.toFixed(2)),
      truePositives,
      falsePositives,
      falseNegatives,
      totalPredictions: truePositives + falsePositives + falseNegatives
    }
  };
}