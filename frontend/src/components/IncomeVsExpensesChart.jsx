import React from 'react';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from 'recharts';

const IncomeVsExpensesChart = ({ data, loading }) => {
    if (loading) {
        return (
            <div className="w-full h-80 bg-white dark:bg-slate-800 rounded-[2rem] flex items-center justify-center border border-slate-200 dark:border-slate-700 animate-pulse">
                <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Analyzing financial patterns...</p>
            </div>
        );
    }

    if (!data || data.length === 0) {
        return (
            <div className="w-full h-80 bg-white dark:bg-slate-800 rounded-[2rem] flex flex-col items-center justify-center border border-slate-200 dark:border-slate-700">
                <span className="text-4xl mb-4">📊</span>
                <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">No historical data available</p>
            </div>
        );
    }

    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-700 p-4 rounded-2xl shadow-xl">
                    <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-3 border-b border-slate-50 dark:border-slate-800 pb-2">{label}</p>
                    <div className="space-y-2">
                        <div className="flex items-center gap-3">
                            <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                            <p className="text-sm font-bold text-slate-600 dark:text-slate-300">Income: <span className="text-slate-900 dark:text-white font-black">₹{payload[0].value.toLocaleString()}</span></p>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="w-2 h-2 rounded-full bg-rose-500"></div>
                            <p className="text-sm font-bold text-slate-600 dark:text-slate-300">Expenses: <span className="text-slate-900 dark:text-white font-black">₹{payload[1].value.toLocaleString()}</span></p>
                        </div>
                    </div>
                </div>
            );
        }
        return null;
    };

    return (
        <div className="bg-white dark:bg-slate-800 rounded-[2rem] shadow-sm border border-slate-200 dark:border-slate-700 p-8 hover:shadow-lg transition-all duration-500">
            <div className="flex justify-between items-center mb-10">
                <div>
                    <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 leading-none mb-1">Financial Analysis</h3>
                    <h2 className="text-xl font-black text-slate-900 dark:text-white">Income vs Expenses</h2>
                </div>
                <div className="flex gap-4">
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-emerald-500 shadow-sm shadow-emerald-500/50"></div>
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Income</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-rose-500 shadow-sm shadow-rose-500/50"></div>
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Expenses</span>
                    </div>
                </div>
            </div>

            <div className="h-80 w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                        data={data}
                        margin={{ top: 0, right: 0, left: -20, bottom: 0 }}
                        barGap={8}
                    >
                        <defs>
                            <linearGradient id="incomeGradient" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="#10b981" stopOpacity={1} />
                                <stop offset="100%" stopColor="#059669" stopOpacity={0.8} />
                            </linearGradient>
                            <linearGradient id="expenseGradient" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="#f43f5e" stopOpacity={1} />
                                <stop offset="100%" stopColor="#e11d48" stopOpacity={0.8} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" className="dark:stroke-slate-700/50" />
                        <XAxis
                            dataKey="month"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 800 }}
                            dy={15}
                        />
                        <YAxis
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 800 }}
                            tickFormatter={(value) => `₹${value >= 1000 ? (value / 1000).toFixed(0) + 'k' : value}`}
                        />
                        <Tooltip content={<CustomTooltip />} cursor={{ fill: '#f8fafc', opacity: 0.4 }} />
                        <Bar
                            dataKey="income"
                            fill="url(#incomeGradient)"
                            radius={[6, 6, 0, 0]}
                            barSize={20}
                            animationDuration={1500}
                        />
                        <Bar
                            dataKey="expenses"
                            fill="url(#expenseGradient)"
                            radius={[6, 6, 0, 0]}
                            barSize={20}
                            animationDuration={1500}
                            animationBegin={200}
                        />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default IncomeVsExpensesChart;
