import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import UnauthenticatedNavbar from "../components/unauthnavbar";
import { MdDelete } from "react-icons/md";
import axios from "axios";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import OverspendingDisplay from "../components/OverspendingDisplay";
import { InvestmentRecommendation, InvestmentDetails } from "../components/investment/recommendation-card";
import IncomeVsExpensesChart from "../components/IncomeVsExpensesChart";

ChartJS.register(ArcElement, Tooltip, Legend);

export default function DuplicateDashboard() {
  const [botid] = useState(localStorage.getItem("telegramId") || "");
  const [expensesdata, setExpensesdata] = useState([]);
  const [error, setError] = useState(null);
  const [recurringexpenses, setRecurringExpenses] = useState([]);
  const [totalexpenses, setTotalexpenses] = useState(0);
  const [currentMonthExpenses, setCurrentMonthExpenses] = useState(0);
  const [piechartdata, setPiechartdata] = useState({});

  const [prediction, setPrediction] = useState(null);
  const [investmentRec, setInvestmentRec] = useState(null);
  const [monthlyStats, setMonthlyStats] = useState([]);
  const [statsLoading, setStatsLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("theme") === "dark" ||
      (!localStorage.getItem("theme") && window.matchMedia("(prefers-color-scheme: dark)").matches);
  });

  const navigate = useNavigate();
  const limit = 15;

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token || !botid) {
      navigate("/login");
    }

    // Sync dark mode class
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem("theme", "light");
    }
  }, [navigate, botid, darkMode]);

  // Main data loading effect
  useEffect(() => {
    let isMounted = true;

    const loadData = async () => {
      if (!botid || botid.trim() === "") {
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const backendURL = process.env.REACT_APP_URL || "http://localhost:5000";
        const token = localStorage.getItem("token");
        const config = {
          headers: {
            "ngrok-skip-browser-warning": "true",
            "Authorization": `Bearer ${token}`
          }
        };

        const [expensesRes, predictionRes, investmentRes, monthlyRes] = await Promise.all([
          axios.post(`${backendURL}/userdash/getexpenses`, {
            botid,
            offset: 0,
            limit,
          }, config),
          axios.get(`${backendURL}/api/predict/expense/${botid}`, config),
          axios.get(`${backendURL}/api/investments/recommend/${botid}`, config),
          axios.get(`${backendURL}/api/stats/monthly-comparison/${botid}`, config)
        ]);

        if (isMounted) {
          // 1. Transaction Data
          if (expensesRes.data.success) {
            setExpensesdata(expensesRes.data.expenses || []);
            setRecurringExpenses(expensesRes.data.recurringexpenses || []);
            setTotalexpenses(expensesRes.data.totalexpenses || 0);
            setCurrentMonthExpenses(expensesRes.data.currentMonthExpenses || 0);
            setError(null);
          } else {
            setError("User not found or no data available.");
          }

          // 2. AI Prediction Data
          if (predictionRes.data && predictionRes.data.success) {
            setPrediction(predictionRes.data.data);
          } else if (predictionRes.data) {
            // Fallback for flat structure
            setPrediction(predictionRes.data);
          }

          // 3. AI Investment Data (Postman structure is flat)
          if (investmentRes.data) {
            console.log("Investment Data:", investmentRes.data);
            setInvestmentRec(investmentRes.data);
          }

          // 4. Monthly Statistics
          if (isMounted && monthlyRes.data && monthlyRes.data.success) {
            setMonthlyStats(monthlyRes.data.data);
          }
        }
      } catch (err) {
        if (isMounted) {
          console.error("Dashboard critical load error:", err);
          setError("Failed to connect to backend server.");
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    loadData();
    return () => { isMounted = false; };
  }, [botid]);

  const handleDeleteRecurring = async (index) => {
    try {
      const backendURL = process.env.REACT_APP_URL || "http://localhost:5000";
      const token = localStorage.getItem("token");
      const res = await axios.post(`${backendURL}/userdash/getexpenses/deleterecurringexpense`, { botid, index }, {
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (res.data.success) {
        setRecurringExpenses((prev) => prev.filter((_, i) => i !== index));
      }
    } catch (err) {
      console.error("Delete recurring failed:", err);
    }
  };



  useEffect(() => {
    if (expensesdata.length === 0) return;
    const categoryMap = expensesdata.reduce((acc, exp) => {
      acc[exp.category] = (acc[exp.category] || 0) + Number(exp.amount || 0);
      return acc;
    }, {});
    const labels = Object.keys(categoryMap);
    const values = Object.values(categoryMap);
    setPiechartdata({
      labels,
      datasets: [
        {
          label: "Expenses",
          data: values,
          backgroundColor: [
            "rgba(99, 102, 241, 0.7)", "rgba(139, 92, 246, 0.7)", "rgba(236, 72, 153, 0.7)",
            "rgba(244, 63, 94, 0.7)", "rgba(249, 115, 22, 0.7)", "rgba(20, 184, 166, 0.7)",
          ],
          borderColor: "rgba(255,255,255,1)",
          borderWidth: 2,
        },
      ],
    });
  }, [expensesdata]);

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#0F172A] text-slate-900 dark:text-slate-100 transition-all duration-300">
      <UnauthenticatedNavbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        {/* Header Section */}
        <section className="mb-10">
          <div className="bg-white dark:bg-slate-800 rounded-3xl p-8 border border-slate-200 dark:border-slate-700 shadow-sm transition-all hover:shadow-md flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-black tracking-tight text-indigo-600 dark:text-indigo-400">Dashboard Overview</h1>
              <p className="text-slate-400 font-bold text-xs uppercase tracking-widest mt-1">
                Welcome back, {localStorage.getItem("userName") || "User"} (ID: {botid})
              </p>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setDarkMode(!darkMode)}
                className="p-3 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-xl hover:bg-indigo-50 dark:hover:bg-indigo-900/40 transition-all border border-transparent hover:border-indigo-200 dark:hover:border-indigo-800"
                title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
              >
                {darkMode ? <span className="text-xl">☀️</span> : <span className="text-xl">🌙</span>}
              </button>
              <button
                onClick={() => {
                  localStorage.removeItem("token");
                  localStorage.removeItem("telegramId");
                  navigate("/login");
                }}
                className="px-6 py-2 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-xl font-bold uppercase tracking-widest text-xs hover:bg-rose-50 hover:text-rose-500 transition-all"
              >
                Logout
              </button>
            </div>
          </div>
          {error && (
            <div className="mt-6 p-4 bg-rose-50 dark:bg-rose-900/20 border border-rose-100 dark:border-rose-800 rounded-2xl text-rose-700 dark:text-rose-300 text-sm font-bold flex items-center gap-3">
              <span>⚠️</span> {error}
            </div>
          )}
        </section>

        {botid && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* ── Top Row Content ────────────────────────────────────── */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Total Expenses Card */}
              <div className="bg-white dark:bg-slate-800 rounded-3xl p-8 border border-slate-200 dark:border-slate-700 shadow-sm group hover:ring-2 hover:ring-indigo-500/20 transition-all">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest leading-none">Spent This Month</h3>
                  <span className="text-2xl">💳</span>
                </div>
                <p className="text-4xl font-black text-slate-900 dark:text-white mb-1 tracking-tighter">
                  ₹{Number(currentMonthExpenses).toLocaleString("en-IN")}
                </p>
                <div className="flex justify-between items-center mt-1">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">
                    Lifetime: ₹{Number(totalexpenses).toLocaleString("en-IN")}
                  </p>
                </div>
                <div className="w-full h-1 bg-slate-100 dark:bg-slate-700 rounded-full mt-4 overflow-hidden">
                  <div className="h-full bg-indigo-500 w-2/3"></div>
                </div>
              </div>

              {/* Expense Prediction Card */}
              <div className="bg-white dark:bg-slate-800 rounded-3xl p-8 border border-slate-200 dark:border-slate-700 shadow-sm group hover:ring-2 hover:ring-emerald-500/20 transition-all">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest leading-none">Next Month AI</h3>
                  <span className="text-2xl">🔮</span>
                </div>
                {loading ? (
                  <div className="animate-pulse flex flex-col gap-3">
                    <div className="h-10 bg-slate-100 dark:bg-slate-700 rounded-xl w-3/4"></div>
                    <div className="h-4 bg-slate-50 dark:bg-slate-750 rounded-lg w-1/2"></div>
                  </div>
                ) : prediction ? (
                  <div>
                    <p className="text-4xl font-black text-emerald-600 dark:text-emerald-400 mb-1 tracking-tighter">
                      ₹{Number(prediction.predictedAmount).toLocaleString("en-IN")}
                    </p>
                    <p className="text-[10px] font-black text-emerald-600/60 dark:text-emerald-400/60 uppercase tracking-widest font-mono">
                      {prediction.confidence}% Confidence Match
                    </p>
                  </div>
                ) : (
                  <div className="py-2">
                    <p className="text-sm text-slate-400 italic">No prediction available yet</p>
                  </div>
                )}
              </div>

              {/* Investment Recommendation Card */}
              <div className="lg:col-span-1">
                {loading ? (
                  <div className="bg-white dark:bg-slate-800 rounded-3xl p-8 border border-slate-200 dark:border-slate-700 shadow-sm animate-pulse h-full">
                    <div className="h-4 bg-slate-100 dark:bg-slate-700 rounded w-1/3 mb-4"></div>
                    <div className="h-10 bg-slate-100 dark:bg-slate-700 rounded w-1/2"></div>
                  </div>
                ) : investmentRec ? (
                  <InvestmentRecommendation recommendation={investmentRec} compact={true} />
                ) : (
                  <div className="bg-white dark:bg-slate-800 rounded-3xl p-8 border border-slate-200 dark:border-slate-700 shadow-sm flex items-center justify-center min-h-[160px]">
                    <p className="text-sm text-slate-300 dark:text-slate-600 italic">Calculating investment advice...</p>
                  </div>
                )}
              </div>
            </div>

            {/* Income vs Expenses Chart Section */}
            <div className="animate-in fade-in slide-in-from-bottom-6 duration-1000 delay-150">
              <IncomeVsExpensesChart data={monthlyStats} loading={loading} />
            </div>

            {/* ── Main Dashboard Grid ─────────────────────────────────── */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left Column: Recent Activity */}
              <div className="lg:col-span-2 space-y-8">
                <div className="bg-white dark:bg-slate-800 rounded-[2.5rem] shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
                  <div className="px-10 py-8 border-b border-slate-100 dark:border-slate-700 flex items-center justify-between bg-slate-50/30 dark:bg-slate-900/20">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700">
                        <span className="text-2xl">📋</span>
                      </div>
                      <h2 className="text-xl font-black tracking-tight text-slate-900 dark:text-white">Recent Transactions</h2>
                    </div>
                  </div>

                  <div className="overflow-x-auto min-h-[400px]">
                    {expensesdata.length > 0 ? (
                      <table className="w-full text-left">
                        <thead>
                          <tr className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] border-b border-slate-50 dark:border-slate-750">
                            <th className="px-10 py-6">Timeline</th>
                            <th className="px-4 py-6">Category</th>
                            <th className="px-10 py-6 text-right">Investment</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50 dark:divide-slate-750">
                          {expensesdata.map((exp, i) => (
                            <tr key={i} className="group hover:bg-indigo-50/30 dark:hover:bg-indigo-900/10 transition-all duration-300">
                              <td className="px-10 py-6">
                                <p className="text-sm font-bold text-slate-900 dark:text-slate-100 leading-none mb-1">
                                  {new Date(exp.date).toLocaleDateString("en-IN", { day: 'numeric', month: 'short' })}
                                </p>
                                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{new Date(exp.date).getFullYear()}</p>
                              </td>
                              <td className="px-4 py-6">
                                <span className="px-4 py-1.5 bg-slate-100 dark:bg-slate-700/60 text-slate-700 dark:text-slate-300 rounded-xl text-[10px] font-black uppercase tracking-widest border border-slate-200 dark:border-slate-600">
                                  {exp.category}
                                </span>
                              </td>
                              <td className="px-10 py-6 text-right">
                                <p className="text-lg font-black text-slate-900 dark:text-white">₹{Number(exp.amount).toLocaleString("en-IN")}</p>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    ) : (
                      <div className="p-32 text-center">
                        <div className="text-6xl mb-6 opacity-20 filter grayscale">💸</div>
                        <h3 className="text-lg font-black text-slate-300 dark:text-slate-600">No Transactions Captured</h3>
                        <p className="text-sm text-slate-400 dark:text-slate-500 mt-2 font-medium">Use the Telegram bot to record your first expense.</p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="animate-in fade-in zoom-in-95 duration-700">
                  <OverspendingDisplay userId={botid} />
                </div>

                {investmentRec && (
                  <div className="animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-300">
                    <InvestmentDetails recommendation={investmentRec} />
                  </div>
                )}
              </div>

              {/* Right Column: Mini Stats & Chart */}
              <div className="space-y-8">
                {/* Recurring Items Sidebar */}
                <div className="bg-white dark:bg-slate-800 rounded-[2rem] shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
                  <div className="px-8 py-6 border-b border-slate-100 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/20">
                    <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 leading-none">Recurring Expenses</h3>
                  </div>
                  <div className="divide-y divide-slate-100 dark:divide-slate-750">
                    {recurringexpenses.length > 0 ? (
                      recurringexpenses.map((exp, i) => (
                        <div key={`rec-${i}`} className="px-8 py-5 flex items-center justify-between group hover:bg-rose-50/30 dark:hover:bg-rose-900/10 transition-colors">
                          <div>
                            <p className="text-base font-black text-slate-900 dark:text-white mb-0.5">₹{Number(exp.amount).toLocaleString("en-IN")}</p>
                            <p className="text-[10px] text-indigo-500 font-black uppercase tracking-widest leading-none">
                              {exp.category} • {exp.frequency}
                            </p>
                          </div>
                          <button
                            onClick={() => handleDeleteRecurring(i)}
                            className="p-2 text-slate-200 hover:text-rose-500 transition-colors"
                          >
                            <MdDelete size={20} />
                          </button>
                        </div>
                      ))
                    ) : (
                      <div className="px-8 py-12 text-center">
                        <p className="text-sm text-slate-300 dark:text-slate-600 font-bold italic tracking-tight">No active recurring expenses</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Pie Chart Card - Visual Breakdown */}
                {piechartdata.labels?.length > 0 && (
                  <div className="bg-white dark:bg-slate-800 rounded-[2rem] shadow-sm border border-slate-200 dark:border-slate-700 p-8 hover:shadow-lg transition-shadow">
                    <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-8 text-center leading-none">Spending Category Split</h3>
                    <div className="aspect-square">
                      <Pie
                        data={piechartdata}
                        options={{
                          responsive: true,
                          maintainAspectRatio: true,
                          plugins: {
                            legend: {
                              position: "bottom",
                              labels: {
                                padding: 25,
                                usePointStyle: true,
                                pointStyle: 'circle',
                                font: { size: 11, weight: '800' },
                                color: "#94a3b8",
                              },
                            },
                          },
                        }}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}