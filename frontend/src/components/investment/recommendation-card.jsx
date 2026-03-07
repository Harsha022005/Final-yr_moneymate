import React from 'react';

/**
 * InvestmentRecommendation Component
 * Displays AI-generated investment suggestions
 */
export function InvestmentRecommendation({ recommendation, compact = false }) {
  if (!recommendation) return null;

  const getRiskVariant = (profile) => {
    const p = profile?.toLowerCase() || '';
    if (p.includes('aggressive')) return 'bg-red-100 text-red-700 dark:bg-red-900/10 dark:text-red-400 border-red-200/50';
    if (p.includes('growth')) return 'bg-orange-100 text-orange-700 dark:bg-orange-900/10 dark:text-orange-400 border-orange-200/50';
    if (p.includes('balanced')) return 'bg-blue-100 text-blue-700 dark:bg-blue-900/10 dark:text-blue-400 border-blue-200/50';
    return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/10 dark:text-emerald-400 border-emerald-200/50';
  };

  // Safe numeric parsing
  const amount = Number(recommendation.amount || 0);
  const confidence = Number(recommendation.confidence || 0);

  if (compact) {
    return (
      <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md rounded-2xl shadow-xl border border-gray-200/60 dark:border-gray-700/60 p-6 flex flex-col justify-center min-h-[160px] relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-3">
          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${getRiskVariant(recommendation.riskProfile)}`}>
            {recommendation.riskProfile || 'Balanced'}
          </span>
        </div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
          <span>🚀</span> Investment Advice
        </h3>
        <div>
          <p className="text-3xl font-extrabold text-indigo-600 dark:text-indigo-400">
            ₹{amount.toLocaleString('en-IN')}
          </p>
          <div className="flex items-center gap-2 mt-1">
            <div className="flex-1 h-1.5 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-indigo-500 transition-all duration-1000"
                style={{ width: `${confidence * 100}%` }}
              />
            </div>
            <span className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase">
              {Math.round(confidence * 100)}% Match
            </span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md rounded-2xl shadow-xl border border-gray-200/60 dark:border-gray-700/60 overflow-hidden transition-all hover:shadow-2xl">
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Investment Suggestion</h3>
              <span className="px-2 py-0.5 text-[10px] font-bold bg-indigo-500 text-white rounded-full uppercase tracking-wider animate-pulse">
                AI Powered
              </span>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Based on your financial patterns
            </p>
          </div>
          <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getRiskVariant(recommendation.riskProfile)}`}>
            {recommendation.riskProfile}
          </span>
        </div>

        <div className="space-y-6">
          <div className="flex justify-between items-end">
            <div>
              <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Suggested Investment</span>
              <p className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">
                ₹{amount.toLocaleString('en-IN')}
              </p>
            </div>
            <div className="text-right">
              <p className="text-xs text-muted-foreground mb-1">Confidence Score</p>
              <div className="w-24 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-indigo-500 transition-all duration-1000"
                  style={{ width: `${confidence * 100}%` }}
                />
              </div>
              <p className="text-[10px] text-gray-500 mt-1">
                {Math.round(confidence * 100)}% reliability
              </p>
            </div>
          </div>

          <div className="bg-indigo-50/50 dark:bg-indigo-950/20 rounded-xl p-4 border border-indigo-100/50 dark:border-indigo-900/30">
            <p className="text-sm text-gray-700 dark:text-gray-300 italic leading-relaxed">
              "{recommendation.explanation}"
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * InvestmentDetails Component
 * Displays a full breakdown of the investment logic and financial snapshot
 */
export function InvestmentDetails({ recommendation }) {
  if (!recommendation || !recommendation.financialSnapshot) return null;

  const { financialSnapshot, modelMetrics } = recommendation;
  const amount = Number(recommendation.amount || 0);
  const safeAmount = Number(recommendation.safeAmount || 0);

  return (
    <div className="bg-white dark:bg-slate-800 rounded-[2.5rem] shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
      <div className="px-10 py-8 border-b border-slate-100 dark:border-slate-700 flex items-center justify-between bg-slate-50/30 dark:bg-slate-900/20">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700">
            <span className="text-2xl">🧠</span>
          </div>
          <div>
            <h2 className="text-xl font-black tracking-tight text-slate-900 dark:text-white">AI Investment Strategy</h2>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Deconstructing the Recommendation</p>
          </div>
        </div>
        <div className="text-right hidden sm:block">
          <span className="px-4 py-1.5 bg-indigo-500 text-white rounded-xl text-[10px] font-black uppercase tracking-widest">
            v1.0.0-ML Model
          </span>
        </div>
      </div>

      <div className="p-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Left Side: Logic & Metrics */}
          <div className="space-y-8">
            <div>
              <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-4">The Strategic Breakdown</h3>
              <div className="grid grid-cols-1 gap-4">
                <div className="bg-emerald-50/50 dark:bg-emerald-900/10 p-6 rounded-3xl border border-emerald-100 dark:border-emerald-800/50">
                  <div className="flex justify-between items-center mb-2">
                    <p className="text-[10px] font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-widest">🛡️ Safe Option</p>
                    <p className="text-xl font-black text-emerald-600 dark:text-emerald-400">₹{safeAmount.toLocaleString('en-IN')}</p>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-medium italic">Minimal impact on liquidity, focus on stability.</p>
                </div>

                <div className="bg-indigo-50/50 dark:bg-indigo-900/10 p-6 rounded-3xl border border-indigo-100 dark:border-indigo-800/50">
                  <div className="flex justify-between items-center mb-2">
                    <p className="text-[10px] font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-widest">🚀 Target Option</p>
                    <p className="text-xl font-black text-indigo-600 dark:text-indigo-400">₹{amount.toLocaleString('en-IN')}</p>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-medium italic">Optimized for faster wealth building based on surplus.</p>
                </div>
              </div>
            </div>

            {/* Model Performance metrics */}
            {modelMetrics && (
              <div>
                <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Model Health & Precision</h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {[
                    { label: "F1 Score", value: modelMetrics.f1Score, color: "text-indigo-500" },
                    { label: "Precision", value: modelMetrics.precision, color: "text-blue-500" },
                    { label: "Recall", value: modelMetrics.recall, color: "text-purple-500" },
                    { label: "R² Score", value: modelMetrics.r2Score, color: "text-emerald-500" }
                  ].map((m, idx) => (
                    <div key={idx} className="bg-slate-50 dark:bg-slate-900/30 p-3 rounded-xl border border-slate-100 dark:border-slate-800 text-center">
                      <p className="text-[8px] font-black text-slate-400 uppercase tracking-tighter mb-1">{m.label}</p>
                      <p className={`text-sm font-black ${m.color}`}>{m.value}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="bg-slate-50 dark:bg-slate-900/40 p-6 rounded-2xl border border-slate-100 dark:border-slate-800">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">AI Logic Context</p>
              <p className="text-sm font-medium text-slate-700 dark:text-slate-300 leading-relaxed italic">
                "{recommendation.explanation}"
              </p>
            </div>
          </div>

          {/* Right Side: Financial Snapshot */}
          <div>
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-6">Financial Snapshot</h3>
            <div className="space-y-4">
              {[
                { label: "Monthly Income", value: financialSnapshot.monthlyIncome, icon: "💰", color: "text-emerald-500" },
                { label: "Avg. Monthly Spend", value: financialSnapshot.avgMonthlySpend, icon: "📉", color: "text-rose-500" },
                { label: "Current Month Spend", value: financialSnapshot.currentMonthSpend, icon: "📅", color: "text-amber-500" },
                { label: "Calculated Savings Rate", value: `${financialSnapshot.savingsRate}%`, icon: "📈", color: "text-indigo-500" }
              ].map((item, idx) => (
                <div key={idx} className="flex items-center justify-between p-4 bg-white dark:bg-slate-800 border b border-slate-100 dark:border-slate-700 rounded-2xl">
                  <div className="flex items-center gap-4">
                    <span className="text-xl">{item.icon}</span>
                    <span className="text-sm font-bold text-slate-600 dark:text-slate-400">{item.label}</span>
                  </div>
                  <span className={`text-lg font-black ${item.color}`}>
                    {typeof item.value === 'number' ? `₹${item.value.toLocaleString('en-IN')}` : item.value}
                  </span>
                </div>
              ))}
            </div>

            <div className="mt-8 p-6 bg-slate-900 dark:bg-slate-950 rounded-[2rem] text-center border border-slate-800">
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mb-4">Prediction Confidence</p>
              <div className="flex items-center gap-6 justify-center">
                <div className="flex-1 max-w-[200px] h-3 bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-emerald-500 transition-all duration-1000"
                    style={{ width: `${recommendation.confidence * 100}%` }}
                  />
                </div>
                <span className="text-2xl font-black text-white">{Math.round(recommendation.confidence * 100)}%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

