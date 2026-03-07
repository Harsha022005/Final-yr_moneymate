import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  AlertTriangle,
  CheckCircle2,
  BarChart3,
  Lightbulb,
} from 'lucide-react';

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';

function cn(...classes) {
  return classes.filter(Boolean).join(' ');
}

const OverspendingDisplay = ({ userId }) => {
  const [budgetData, setBudgetData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;
    const loadData = async () => {
      if (!userId) return;
      setLoading(true);
      try {
        const backendURL = process.env.REACT_APP_URL || "http://localhost:5000";
        const token = localStorage.getItem("token");
        const response = await axios.get(`${backendURL}/api/overspending/${userId}`, {
          timeout: 10000,
          headers: { "Authorization": `Bearer ${token}` }
        });
        if (isMounted) {
          setBudgetData(response.data);
        }
      } catch (err) {
        if (isMounted) setError(err.response?.data?.message || 'Failed to load data');
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    loadData();
    return () => { isMounted = false; };
  }, [userId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[360px]">
        <div className="text-center space-y-3">
          <div className="animate-spin h-10 w-10 border-4 border-indigo-500 border-t-transparent rounded-full mx-auto" />
          <p className="text-gray-500 font-medium">Loading your financial snapshot...</p>
        </div>
      </div>
    );
  }

  if (error || !budgetData) {
    return (
      <div className="bg-gradient-to-br from-red-50 to-rose-50 rounded-2xl p-6 shadow-lg border border-red-100/60">
        <div className="flex items-center gap-4 text-red-800">
          <AlertTriangle size={28} />
          <p className="font-medium">{error || 'No data available yet'}</p>
        </div>
      </div>
    );
  }

  const isOver = budgetData.actualSpend > budgetData.expectedSpend;
  const deviation = Number(budgetData.deviationPercent || 0).toFixed(1);

  const comparisonData = [
    { name: 'Target (60%)', value: budgetData.expectedSpend, color: '#10b981' },
    { name: 'Actual', value: budgetData.actualSpend, color: isOver ? '#ef4444' : '#10b981' },
  ];

  return (
    <div
      className={cn(
        'rounded-3xl overflow-hidden shadow-2xl backdrop-blur-sm border border-white/20 transition-all duration-300 hover:shadow-[0_20px_50px_-12px_rgba(0,0,0,0.12)]',
        isOver
          ? 'bg-gradient-to-br from-rose-50/90 via-red-50/80 to-orange-50/70'
          : 'bg-gradient-to-br from-emerald-50/90 via-teal-50/80 to-cyan-50/70'
      )}
    >
      {/* Glass-like header bar */}
      <div className="bg-white/40 backdrop-blur-md border-b border-white/30 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {isOver ? (
            <div className="p-2.5 bg-red-100/80 rounded-xl">
              <AlertTriangle size={24} className="text-red-600" />
            </div>
          ) : (
            <div className="p-2.5 bg-emerald-100/80 rounded-xl">
              <CheckCircle2 size={24} className="text-emerald-600" />
            </div>
          )}
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight">
              {isOver ? 'Budget Overrun' : 'You’re on Track'}
            </h2>
            <p className="text-sm text-gray-700 mt-0.5 font-medium">
              {budgetData.reason || `Deviation: ${deviation}%`}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="px-3.5 py-1.5 text-xs font-semibold bg-white/70 rounded-full shadow-sm border border-white/40">
            {budgetData.usingBudgetRule ? '60/20/20' : 'Forecast'}
          </span>
        </div>
      </div>

      <div className="p-5 sm:p-6 lg:p-7 space-y-6 sm:space-y-7">

        {/* Spending vs Target – cleaner, more elegant chart */}
        <div className="bg-white/50 backdrop-blur-md rounded-2xl p-5 sm:p-6 border border-white/40 shadow-inner">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <BarChart3 size={22} className="text-indigo-600" />
              <h3 className="text-lg font-semibold text-gray-900">Spending vs Target</h3>
            </div>
            <p className="text-sm text-gray-600">
              Income <span className="font-bold text-indigo-700">₹{Number(budgetData.monthlyIncome).toLocaleString('en-IN')}</span>
            </p>
          </div>

          <div className="h-56 sm:h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={comparisonData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="name" stroke="#64748b" fontSize={13} tickLine={false} axisLine={false} />
                <YAxis
                  stroke="#64748b"
                  fontSize={13}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={v => `₹${(v / 1000).toFixed(0)}k`}
                />
                <Tooltip
                  cursor={{ fill: 'rgba(99,102,241,0.08)' }}
                  contentStyle={{
                    background: 'rgba(255,255,255,0.95)',
                    border: 'none',
                    borderRadius: '12px',
                    boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
                    padding: '10px 14px',
                    fontSize: '13px'
                  }}
                  formatter={(v) => [`₹${Number(v).toLocaleString('en-IN')}`, '']}
                />
                <Bar
                  dataKey="value"
                  radius={[10, 10, 0, 0]}
                  barSize={48}
                  fillOpacity={0.9}
                >
                  {comparisonData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Compact stats */}
          <div className="mt-5 grid grid-cols-2 sm:grid-cols-4 gap-3 text-center text-sm">
            <div className="bg-white/60 rounded-lg p-3 border border-white/50">
              <p className="text-gray-500">Deviation</p>
              <p className={cn("font-bold text-lg", isOver ? "text-red-600" : "text-emerald-600")}>
                {deviation}%
              </p>
            </div>
            <div className="bg-white/60 rounded-lg p-3 border border-white/50">
              <p className="text-gray-500">Actual</p>
              <p className="font-bold text-lg">₹{Number(budgetData.actualSpend).toLocaleString('en-IN')}</p>
            </div>
            <div className="bg-white/60 rounded-lg p-3 border border-white/50">
              <p className="text-gray-500">Target</p>
              <p className="font-bold text-lg">₹{Number(budgetData.expectedSpend).toLocaleString('en-IN')}</p>
            </div>
            <div className="bg-white/60 rounded-lg p-3 border border-white/50">
              <p className="text-gray-500">Income</p>
              <p className="font-bold text-indigo-600 text-lg">₹{Number(budgetData.monthlyIncome).toLocaleString('en-IN')}</p>
            </div>
          </div>
        </div>

        {/* Tips – slim & motivational */}
        {isOver && (
          <div className="bg-gradient-to-r from-amber-50/80 to-yellow-50/70 rounded-2xl p-5 border border-amber-200/60 backdrop-blur-sm">
            <div className="flex gap-4">
              <div className="p-2.5 bg-amber-100/70 rounded-xl flex-shrink-0">
                <Lightbulb size={22} className="text-amber-700" />
              </div>
              <div className="space-y-2 text-sm">
                <h4 className="font-semibold text-amber-900">Quick Recovery Tips</h4>
                <ul className="space-y-1.5 text-amber-800">
                  <li>• Review top spending categories this week</li>
                  <li>• Cut non-essentials by 20–30% for now</li>
                  <li>• Redirect ₹{Math.round(budgetData.monthlyIncome * 0.1).toLocaleString('en-IN')} to savings today</li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OverspendingDisplay;