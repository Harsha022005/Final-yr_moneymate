// import { useState, useEffect } from "react";
// import axios from 'axios';
// import {
//   BarChart,
//   Bar,
//   PieChart,
//   Pie,
//   LineChart,
//   Line,
//   XAxis,
//   YAxis,
//   CartesianGrid, 
//   Tooltip,
//   Legend,
//   ResponsiveContainer,
//   Cell,
// } from "recharts";

// import { Moon, Sun, RefreshCw, Star, AlertCircle } from "lucide-react";
// import "./style.css";
// import UnauthenticatedNavbar from "../components/unauthnavbar";
// import OverspendingDisplay from "../components/OverspendingDisplay";    
// const mockExpenseData = {
//   // Overspending alert data
//   overspending: {
//     isOverspending: true,
//     actualSpend: 23002.00,
//     expectedSpend: 18000.00, // 60% of 30,000
//     monthlyIncome: 30000.00,
//     deviationPercent: 27.8,
//     usingBudgetRule: true
//   },
  
//   summary: { 
//     total: 5678.90, 
//     monthlyAverage: 4250.75, 
//     monthlyChange: 12.5 
//   },
//   monthlyExpenses: [
//     { month: "Jan", amount: 1250.5 },
//     { month: "Feb", amount: 1325.75 },
//     { month: "Mar", amount: 1674.5 },
//   ],
//   categorySpending: [
//     { name: "Food", value: 850.25, color: "#FF6384" },
//     { name: "Travel", value: 1240.5, color: "#36A2EB" },
//     { name: "Bills", value: 1450.0, color: "#FFCE56" },
//     { name: "Shopping", value: 520.75, color: "#4BC0C0" },
//     { name: "Entertainment", value: 189.25, color: "#9966FF" },
//   ],
//   expenseOverTime: [
//     { date: "2025-01-01", amount: 425.5 },
//     { date: "2025-01-08", amount: 350.25 },
//     { date: "2025-01-15", amount: 475.75 },
//     { date: "2025-02-01", amount: 525.25 },
//     { date: "2025-02-08", amount: 375.0 },
//     { date: "2025-02-15", amount: 425.5 },
//     { date: "2025-03-01", amount: 625.75 },
//     { date: "2025-03-08", amount: 512.25 },
//     { date: "2025-03-15", amount: 536.5 },
//   ],
//   recentTransactions: [
//     {
//       id: 1,
//       date: "2025-03-15",
//       category: "Food",
//       amount: 65.5,
//       description: "Grocery shopping",
//     },
//     {
//       id: 2,
//       date: "2025-03-14",
//       category: "Bills",
//       amount: 120.0,
//       description: "Electricity bill",
//     },
//     {
//       id: 3,
//       date: "2025-03-12",
//       category: "Travel",
//       amount: 45.75,
//       description: "Uber ride",
//     },
//     {
//       id: 4,
//       date: "2025-03-10",
//       category: "Shopping",
//       amount: 89.99,
//       description: "New headphones",
//     },
//     {
//       id: 5,
//       date: "2025-03-08",
//       category: "Entertainment",
//       amount: 35.0,
//       description: "Movie tickets",
//     },
//     {
//       id: 6,
//       date: "2025-03-05",
//       category: "Food",
//       amount: 52.25,
//       description: "Restaurant dinner",
//     },
//     {
//       id: 7,
//       date: "2025-03-03",
//       category: "Bills",
//       amount: 85.0,
//       description: "Internet bill",
//     },
//   ],
//   goals: { current: 75, target: 100 }, 
//   badges: [
//     { id: 1, name: "Frugal Foodie", earned: true },
//     { id: 2, name: "Savings Star", earned: false },
//   ],
// };

// // API fetching function (unchanged)
// const fetchExpenseData = async (filters) => {
//   await new Promise((resolve) => setTimeout(resolve, 800));
//   return mockExpenseData;
// };

// export default function ExpenseDashboard() {
//   const [darkMode, setDarkMode] = useState(false);
//   const [loading, setLoading] = useState(true);
//   const [data, setData] = useState(null);
//   const [filters, setFilters] = useState({
//     dateRange: "last3Months",
//     category: "all",
//     user: "current",
//   });
//   const [showCoin, setShowCoin] = useState(false); // For coin animation
//   const [botid, setbotid] = useState(localStorage.getItem("telegramId") || "");
//   const [expensesdata, setexpensesdata]=useState(null);
//   const [error,seterror]=useState(null);

//    const handlesubmitbotid=async()=>{
//     if(botid.trim()===''){
//       alert("Please enter a valid bot ID");
//       return;
//     }
//     try{
//       const backendURL = process.env.REACT_APP_URL;

//       const response= await axios.get(`${backendURL}/userdash/getexpenses?botid=${botid}`)
//       console.log("Response from backend:", response.data);
//       if (response.data.success){
//         setexpensesdata(response.data.expenses);
//       }
//     }
//     catch(error){
//       console.error("Error fetching expenses:", error);
//       seterror("Failed to fetch expenses. Please try again.");
//     }
    
//    }

//   useEffect(() => {
//     const loadData = async () => {
//       setLoading(true);
//       try {
//         const expenseData = await fetchExpenseData(filters);
//         setData(expenseData);
//         // Trigger coin animation on data load
//         setShowCoin(true);
//         setTimeout(() => setShowCoin(false), 1000);
//       } catch (error) {
//         console.error("Error fetching expense data:", error);
//       } finally {
//         setLoading(false);
//       }
//     };
//     loadData();
//     const interval = setInterval(loadData, 30000);
//     return () => clearInterval(interval);
//   }, [filters]);

//   const handleFilterChange = (e) => {
//     setFilters({ ...filters, [e.target.name]: e.target.value });
//   };

//   const toggleDarkMode = () => {
//     setDarkMode(!darkMode);
//   };

//   const refreshData = async () => {
//     setLoading(true);
//     try {
//       const expenseData = await fetchExpenseData(filters);
//       setData(expenseData);
//       setShowCoin(true);
//       setTimeout(() => setShowCoin(false), 1000);
//     } catch (error) {
//       console.error("Error refreshing expense data:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const formatCurrency = (value) => {
//     return new Intl.NumberFormat("en-US", {
//       style: "currency",
//       currency: "USD",
//     }).format(value);
//   };

//   const formatDate = (dateString) => {
//     return new Date(dateString).toLocaleDateString("en-US", {
//       year: "numeric",
//       month: "short",
//       day: "numeric",
//     });
//   };

//   // Calculate goal progress for the circle
//   const goalProgress = data?.goals
//     ? (data.goals.current / data.goals.target) * 100
//     : 0;
//   const circumference = 2 * Math.PI * 45; // Radius 45 for SVG circle
//   const strokeDasharray = `${
//     (goalProgress / 100) * circumference
//   } ${circumference}`;

//   if (loading && !data) {
//     return (
//       <div
//         className={`flex items-center justify-center h-screen ${
//           darkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-800"
//         }`}
//       >
//         <div className="text-center">
//           <RefreshCw className="animate-spin mx-auto h-10 w-10 mb-4" />
//           <p className="text-lg">Loading your financial adventure...</p>
//         </div>
//       </div>
//     );
//   }
// return (
//   <div
//     className={`m-[10px] min-h-screen transition-colors duration-200 ${
//       darkMode
//         ? "bg-gray-900 text-white"
//         : "bg-gradient-to-br from-indigo-50 to-blue-100 text-gray-800"
//     }`}
//   >
//     <div className="min-h-screen bg-gray-50">
//       <UnauthenticatedNavbar />
//       <div className="container mx-auto px-4 py-8">
//         <h1 className="text-3xl font-bold text-gray-800 mb-8">Expense Dashboard</h1>
        
//         {/* Overspending Card */}
//         <div className="mb-8">
//           <OverspendingCard data={mockExpenseData.overspending} />
//         </div>
        
//         {/* Overspending Alert */}
//         <div className="mb-8">
//           <OverspendingAlert 
//             isOverspending={true} 
//             metrics={{
//               actualSpend: 5678.90,
//               averageSpend: 4250.75,
//               deviationPercent: 33.6
//             }}  
//           />
//         </div>
//         <div className="flex items-center gap-4 mx-auto">
//           <img
//             src="/avatar.png"
//             alt="User Avatar"
//             className="w-10 h-10 rounded-full border-2 border-indigo-500"
//           />
//           <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-purple-600">
//             Your Expense Adventure
//           </h1>
//         </div>
//         <div className="flex items-center gap-4">
//           <button
//             onClick={refreshData}
//             className={`p-2 rounded-full gamified-button ${
//               darkMode ? "hover:bg-gray-700" : "hover:bg-indigo-100"
//             } relative`}
//             title="Refresh data"
//           >
//             <RefreshCw className={`h-5 w-5 ${loading ? "animate-spin" : ""}`} />
//             {showCoin && <div className="coin-animation" />}
//           </button>
//           <button
//             onClick={toggleDarkMode}
//             className={`p-2 rounded-full gamified-button ${
//               darkMode ? "hover:bg-gray-700" : "hover:bg-indigo-100"
//             }`}
//             title={darkMode ? "Switch to light mode" : "Switch to dark mode"}
//           >
//             {darkMode ? (
//               <Sun className="h-5 w-5 text-yellow-400" />
//             ) : (
//               <Moon className="h-5 w-5 text-indigo-600" />
//             )}
//           </button>
//         </div>
//       </header>
//       <div className="p-4 mx-auto max-w-3xl">
//         <p >To fetch your expenses paste your telegrram bot-id </p>
//         <input type="text" name="botid" id="botid"
//         value={botid}
//         onChange={(e)=>setbotid(e.target.value)}
//         className="w-full p-2 border rounded-md mb-4 dark:bg-gray-700 dark:text-white dark:border-gray-600"
//         />
//         <button onClick={handlesubmitbotid} className="cursor-pointer">Submit</button>
//       </div>
//       {/* Shw expenses */}
//        {expensesdata && (
//   <div className="mt-4 p-[] border dark:border-gray-700 rounded-md bg-white dark:bg-gray-800">
//     <h2 className="text-lg text-white font-bold mb-2">Expenses:</h2>
//     <ul>
//       {expensesdata.map((expense, index) => (
//         <li key={index} className="mb-1  text-white dark:text-gray-300">
//           ₹{expense.amount} — {expense.category} ({new Date(expense.date).toLocaleDateString()})
//         </li>
//       ))}
//     </ul>
//   </div>
// )}
// {error && (
//   <div className="text-red-500 mt-4">{error}</div>
// )}


//       {/* Goals Widget */}
//       <section
//         className={`p-4 mx-auto mt-4 rounded-xl shadow-lg ${
//           darkMode ? "bg-gray-800" : "bg-white"
//         } mb-6 max-w-3xl`}
//       >
//         <h2 className="text-xl font-semibold mb-4 text-center">Your Savings Goal</h2>
//         <div className="flex items-center justify-center gap-6">
//           <div className="progress-circle">
//             <svg width="100" height="100">
//               <circle className="circle-bg" cx="50" cy="50" r="45" />
//               <circle
//                 className="circle-fg"
//                 cx="50"
//                 cy="50"
//                 r="45"
//                 strokeDasharray={strokeDasharray}
//               />
//             </svg>
//             <div className="circle-text">{Math.round(goalProgress)}%</div>
//           </div>
//           <div className="text-center">
//             <p className="text-lg font-medium">
//               {formatCurrency(data?.goals.current)} /{" "}
//               {formatCurrency(data?.goals.target)}
//             </p>
//             <p className="text-sm text-gray-500 dark:text-gray-400">
//               Keep it up to earn a Savings Star badge!
//             </p>
//           </div>
//         </div>
//       </section>

//       {/* Filters */}
//       <div
//         className={`p-4 mx-auto rounded-xl ${
//           darkMode ? "bg-gray-800" : "bg-white"
//         } shadow-lg mb-6 max-w-3xl`}
//       >
//         <div className="flex flex-wrap gap-4 justify-center">
//           {["dateRange", "category", "user"].map((filter) => (
//             <div key={filter} className="w-full md:w-auto">
//               <label className="block text-sm font-medium mb-1 capitalize text-center">
//                 {filter}
//               </label>
//               <select
//                 name={filter}
//                 value={filters[filter]}
//                 onChange={handleFilterChange}
//                 className={`w-full rounded-md px-3 py-2 gamified-button ${
//                   darkMode
//                     ? "bg-gray-700 text-white border-gray-600 hover:bg-gray-600"
//                     : "bg-indigo-50 text-gray-800 border-indigo-300 hover:bg-indigo-100"
//                 } border transition-colors duration-200`}
//               >
//                 {filter === "dateRange" && (
//                   <>
//                     <option value="last30Days">Last 30 Days</option>
//                     <option value="last3Months">Last 3 Months</option>
//                     <option value="lastYear">Last Year</option>
//                     <option value="all">All Time</option>
//                   </>
//                 )}
//                 {filter === "category" && (
//                   <>
//                     <option value="all">All Categories</option>
//                     <option value="food">Food</option>
//                     <option value="travel">Travel</option>
//                     <option value="bills">Bills</option>
//                     <option value="shopping">Shopping</option>
//                     <option value="entertainment">Entertainment</option>
//                   </>
//                 )}
//                 {filter === "user" && (
//                   <>
//                     <option value="current">Current User</option>
//                     <option value="all">All Users</option>
//                   </>
//                 )}
//               </select>
//             </div>
//           ))}
//         </div>
//       </div>

//       {/* Main Dashboard Content */}
//       <main className="p-4">
//         {/* Summary Section */}
//         <section className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 max-w-5xl mx-auto">
//           {[
//             { title: "Total Expenses", value: data?.summary.total },
//             { title: "Monthly Average", value: data?.summary.monthlyAverage },
//             {
//               title: "Monthly Change",
//               value: data?.summary.monthlyChange,
//               isPercent: true,
//             },
//           ].map((item, index) => (
//             <div
//               key={index}
//               className={`rounded-xl shadow-lg p-6 ${
//                 darkMode ? "bg-gray-800" : "bg-white"
//               } chart-container text-center`}
//             >
//               <h3 className="text-lg font-medium mb-2">{item.title}</h3>
//               <p
//                 className={`text-3xl font-bold ${
//                   item.isPercent
//                     ? item.value >= 0
//                       ? "text-green-500"
//                       : "text-red-500"
//                     : "bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-purple-600"
//                 }`}
//               >
//                 {item.isPercent
//                   ? `${item.value >= 0 ? "+" : ""}${item.value}%`
//                   : formatCurrency(item.value)}
//               </p>
//             </div>
//           ))}
//         </section>

//         <div className="mb-6 max-w-5xl mx-auto">
//           <OverspendingDisplay userId={botid} /> 
//         </div>

//         {/* Badges Section */}
//         <section
//           className={`rounded-xl shadow-lg p-4 mb-6 ${
//             darkMode ? "bg-gray-800" : "bg-white"
//           } max-w-3xl mx-auto`} 
//         >
//           <h3 className="text-lg font-semibold mb-4 text-center">Your Achievements</h3>
//           <div className="flex flex-wrap gap-4 justify-center">
//             {data?.badges.map((badge) => (
//               <div
//                 key={badge.id}
//                 className={`badge ${!badge.earned ? "opacity-50" : ""}`}
//                 title={badge.earned ? `Earned: ${badge.name}` : "Locked"}
//               >
//                 <Star className="h-4 w-4" />
//                 {badge.name}
//               </div>
//             ))}
//           </div>
//         </section>

//         {/* Charts Section */}
//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6 max-w-5xl mx-auto">
//           {/* Monthly Expenses Bar Chart */}
//           <div
//             className={`rounded-xl shadow-lg p-4 ${
//               darkMode ? "bg-gray-800" : "bg-white"
//             } chart-container`}
//           >
//             <h3 className="text-lg font-semibold mb-4 text-center">Monthly Expenses</h3>
//             <div className="h-64">
//               <ResponsiveContainer width="100%" height="100%">
//                 <BarChart
//                   data={data?.monthlyExpenses}
//                   margin={{ top: 10, right: 10, left: 10, bottom: 20 }}
//                 >
//                   <CartesianGrid
//                     strokeDasharray="3 3"
//                     stroke={darkMode ? "#444" : "#eee"}
//                   />
//                   <XAxis dataKey="month" stroke={darkMode ? "#aaa" : "#666"} />
//                   <YAxis stroke={darkMode ? "#aaa" : "#666"} />
//                   <Tooltip
//                     contentStyle={{
//                       backgroundColor: darkMode ? "#333" : "#fff",
//                       borderColor: darkMode ? "#555" : "#ddd",
//                     }}
//                     formatter={(value) => [formatCurrency(value), "Amount"]}
//                   />
//                   <Bar dataKey="amount" fill="#4F46E5" radius={[4, 4, 0, 0]} />
//                 </BarChart>
//               </ResponsiveContainer>
//             </div>
//           </div>

//           {/* Category Spending Pie Chart */}
//           <div
//             className={`rounded-xl shadow-lg p-4 ${
//               darkMode ? "bg-gray-800" : "bg-white"
//             } chart-container`}
//           >
//             <h3 className="text-lg font-semibold mb-4 text-center">Category Spending</h3>
//             <div className="h-64">
//               <ResponsiveContainer width="100%" height="100%">
//                 <PieChart>
//                   <Pie
//                     data={data?.categorySpending}
//                     cx="50%"
//                     cy="50%"
//                     innerRadius={60}
//                     outerRadius={80}
//                     paddingAngle={2}
//                     dataKey="value"
//                     label={({ name, percent }) =>
//                       `${name} (${(percent * 100).toFixed(0)}%)`
//                     }
//                     labelLine={false}
//                   >
//                     {data?.categorySpending.map((entry, index) => (
//                       <Cell key={`cell-${index}`} fill={entry.color} />
//                     ))}
//                   </Pie>
//                   <Tooltip
//                     formatter={(value) => formatCurrency(value)}
//                     contentStyle={{
//                       backgroundColor: darkMode ? "#333" : "#fff",
//                       borderColor: darkMode ? "#555" : "#ddd",
//                     }}
//                   />
//                 </PieChart>
//               </ResponsiveContainer>
//             </div>
//           </div>

//           {/* Expenses Over Time Line Chart */}
//           <div
//             className={`rounded-xl shadow-lg p-4 col-span-1 lg:col-span-2 ${
//               darkMode ? "bg-gray-800" : "bg-white"
//             } chart-container`}
//           >
//             <h3 className="text-lg font-semibold mb-4 text-center">Expenses Over Time</h3>
//             <div className="h-64">
//               <ResponsiveContainer width="100%" height="100%">
//                 <LineChart
//                   data={data?.expenseOverTime}
//                   margin={{ top: 10, right: 10, left: 10, bottom: 20 }}
//                 >
//                   <CartesianGrid
//                     strokeDasharray="3 3"
//                     stroke={darkMode ? "#444" : "#eee"}
//                   />
//                   <XAxis
//                     dataKey="date"
//                     stroke={darkMode ? "#aaa" : "#666"}
//                     tickFormatter={(date) =>
//                       new Date(date).toLocaleDateString("en-US", {
//                         month: "short",
//                         day: "numeric",
//                       })
//                     }
//                   />
//                   <YAxis stroke={darkMode ? "#aaa" : "#666"} />
//                   <Tooltip
//                     contentStyle={{
//                       backgroundColor: darkMode ? "#333" : "#fff",
//                       borderColor: darkMode ? "#555" : "#ddd",
//                     }}
//                     formatter={(value) => [formatCurrency(value), "Amount"]}
//                     labelFormatter={(date) => formatDate(date)}
//                   />
//                   <Line
//                     type="monotone"
//                     dataKey="amount"
//                     stroke="#4F46E5"
//                     strokeWidth={2}
//                     dot={{ r: 4 }}
//                   />
//                 </LineChart>
//               </ResponsiveContainer>
//             </div>
//           </div>
//         </div>

//         {/* Recent Transactions Table */}
//         <section
//           className={`rounded-xl shadow-lg p-4 mb-6 ${
//             darkMode ? "bg-gray-800" : "bg-white"
//           } max-w-5xl mx-auto`}
//         >
//           <h3 className="text-lg font-semibold mb-4 text-center">Recent Transactions</h3>
//           <div className="overflow-x-auto">
//             <table
//               className={`min-w-full ${
//                 darkMode ? "text-gray-200" : "text-gray-700"
//               }`}
//             >
//               <thead
//                 className={`${
//                   darkMode ? "bg-gray-700" : "bg-indigo-50"
//                 } text-left`}
//               >
//                 <tr>
//                   <th className="px-6 py-3 text-sm font-medium uppercase tracking-wider">
//                     Date
//                   </th>
//                   <th className="px-6 py-3 text-sm font-medium uppercase tracking-wider">
//                     Category
//                   </th>
//                   <th className="px-6 py-3 text-sm font-medium uppercase tracking-wider">
//                     Amount
//                   </th>
//                   <th className="px-6 py-3 text-sm font-medium uppercase tracking-wider">
//                     Description
//                   </th>
//                 </tr>
//               </thead>
//               <tbody className="divide-y divide-gray-200">
//                 {data?.recentTransactions.map((transaction) => (
//                   <tr key={transaction.id} className="transaction-row">
//                     <td className="px-6 py-4 whitespace-nowrap">
//                       {formatDate(transaction.date)}
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap">
//                       <span
//                         className={`category-tag ${
//                           transaction.category === "Food"
//                             ? "bg-red-100 text-red-800"
//                             : transaction.category === "Bills"
//                             ? "bg-yellow-100 text-yellow-800"
//                             : transaction.category === "Travel"
//                             ? "bg-blue-100 text-blue-800"
//                             : transaction.category === "Shopping"
//                             ? "bg-green-100 text-green-800"
//                             : "bg-purple-100 text-purple-800"
//                         }`}
//                       >
//                         {transaction.category}
//                       </span>
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap font-medium">
//                       {formatCurrency(transaction.amount)}
//                     </td>
//                     <td className="px-6 py-4">{transaction.description}</td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         </section>
//       </main>

//       {/* Footer */}
//       <footer
//         className={`p-4 ${
//           darkMode ? "bg-gray-800" : "bg-white"
//         } shadow-inner text-center rounded-t-xl`}
//       >
//         <p className="text-sm flex items-center justify-center gap-2">
//           <Star className="h-4 w-4 text-yellow-400" />
//           Expense Adventure © {new Date().getFullYear()} • Level up your
//           savings!
//         </p>
//       </footer>
//     </div>
//   </div>
// );
 
// }
