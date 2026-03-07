import { useState, useEffect } from 'react';
import { 
  BarChart, Bar, PieChart, Pie, LineChart, Line, XAxis, YAxis, 
  CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell
} from 'recharts';
import { Moon, Sun, RefreshCw } from 'lucide-react';

// Sample data - replace with API fetch in production
const mockExpenseData = {
  summary: {
    total: 4250.75,
    monthlyAverage: 1416.92,
    monthlyChange: 12.5
  },
  monthlyExpenses: [
    { month: 'Jan', amount: 1250.50 },
    { month: 'Feb', amount: 1325.75 },
    { month: 'Mar', amount: 1674.50 }
  ],
  categorySpending: [
    { name: 'Food', value: 850.25, color: '#FF6384' },
    { name: 'Travel', value: 1240.50, color: '#36A2EB' },
    { name: 'Bills', value: 1450.00, color: '#FFCE56' },
    { name: 'Shopping', value: 520.75, color: '#4BC0C0' },
    { name: 'Entertainment', value: 189.25, color: '#9966FF' }
  ],
  expenseOverTime: [
    { date: '2025-01-01', amount: 425.50 },
    { date: '2025-01-08', amount: 350.25 },
    { date: '2025-01-15', amount: 475.75 },
    { date: '2025-02-01', amount: 525.25 },
    { date: '2025-02-08', amount: 375.00 },
    { date: '2025-02-15', amount: 425.50 },
    { date: '2025-03-01', amount: 625.75 },
    { date: '2025-03-08', amount: 512.25 },
    { date: '2025-03-15', amount: 536.50 }
  ],
  recentTransactions: [
    { id: 1, date: '2025-03-15', category: 'Food', amount: 65.50, description: 'Grocery shopping' },
    { id: 2, date: '2025-03-14', category: 'Bills', amount: 120.00, description: 'Electricity bill' },
    { id: 3, date: '2025-03-12', category: 'Travel', amount: 45.75, description: 'Uber ride' },
    { id: 4, date: '2025-03-10', category: 'Shopping', amount: 89.99, description: 'New headphones' },
    { id: 5, date: '2025-03-08', category: 'Entertainment', amount: 35.00, description: 'Movie tickets' },
    { id: 6, date: '2025-03-05', category: 'Food', amount: 52.25, description: 'Restaurant dinner' },
    { id: 7, date: '2025-03-03', category: 'Bills', amount: 85.00, description: 'Internet bill' }
  ]
};

// API fetching function (simulated)
const fetchExpenseData = async (filters) => {
  // In a real app, fetch from your API with filters
  console.log('Fetching data with filters:', filters);
  
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  return mockExpenseData;
};

export default function ExpenseDashboard() {
  const [darkMode, setDarkMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);
  const [filters, setFilters] = useState({
    dateRange: 'last3Months',
    category: 'all',
    user: 'current'
  });
  
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const expenseData = await fetchExpenseData(filters);
        setData(expenseData);
      } catch (error) {
        console.error('Error fetching expense data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
    
    // Set up interval for "real-time" updates (every 30 seconds)
    const interval = setInterval(loadData, 30000);
    
    return () => clearInterval(interval);
  }, [filters]);
  
  const handleFilterChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value
    });
  };
  
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };
  
  const refreshData = async () => {
    setLoading(true);
    try {
      const expenseData = await fetchExpenseData(filters);
      setData(expenseData);
    } catch (error) {
      console.error('Error refreshing expense data:', error);
    } finally {
      setLoading(false);
    }
  };
  
  // Format currency
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(value);
  };
  
  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };
  
  if (loading && !data) {
    return (
      <div className={`flex items-center justify-center h-screen ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-800'}`}>
        <div className="text-center">
          <RefreshCw className="animate-spin mx-auto h-10 w-10 mb-4" />
          <p className="text-lg">Loading dashboard data...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className={`min-h-screen transition-colors duration-200 ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-800'}`}>
      {/* Header */}
      <header className={`p-4 flex justify-between items-center ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-md`}>
        <h1 className="text-2xl font-bold">Expense Dashboard</h1>
        <div className="flex items-center gap-4">
          <button 
            onClick={refreshData} 
            className={`p-2 rounded-full ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-200'}`}
            title="Refresh data"
          >
            <RefreshCw className={`h-5 w-5 ${loading ? 'animate-spin' : ''}`} />
          </button>
          <button 
            onClick={toggleDarkMode} 
            className={`p-2 rounded-full ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-200'}`}
            title={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </button>
        </div>
      </header>

      {/* Filters */}
      <div className={`p-4 ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-sm mb-4`}>
        <div className="flex flex-wrap gap-4">
          <div className="w-full md:w-auto">
            <label className="block text-sm font-medium mb-1">Date Range</label>
            <select 
              name="dateRange" 
              value={filters.dateRange} 
              onChange={handleFilterChange}
              className={`w-full rounded-md px-3 py-2 ${darkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-white text-gray-800 border-gray-300'} border`}
            >
              <option value="last30Days">Last 30 Days</option>
              <option value="last3Months">Last 3 Months</option>
              <option value="lastYear">Last Year</option>
              <option value="all">All Time</option>
            </select>
          </div>
          <div className="w-full md:w-auto">
            <label className="block text-sm font-medium mb-1">Category</label>
            <select 
              name="category" 
              value={filters.category} 
              onChange={handleFilterChange}
              className={`w-full rounded-md px-3 py-2 ${darkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-white text-gray-800 border-gray-300'} border`}
            >
              <option value="all">All Categories</option>
              <option value="food">Food</option>
              <option value="travel">Travel</option>
              <option value="bills">Bills</option>
              <option value="shopping">Shopping</option>
              <option value="entertainment">Entertainment</option>
            </select>
          </div>
          <div className="w-full md:w-auto">
            <label className="block text-sm font-medium mb-1">User</label>
            <select 
              name="user" 
              value={filters.user} 
              onChange={handleFilterChange}
              className={`w-full rounded-md px-3 py-2 ${darkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-white text-gray-800 border-gray-300'} border`}
            >
              <option value="current">Current User</option>
              <option value="all">All Users</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Dashboard Content */}
      <main className="p-4">
        {/* Summary Section */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className={`rounded-lg shadow-md p-4 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <h3 className="text-lg font-medium mb-2">Total Expenses</h3>
            <p className="text-3xl font-bold">{formatCurrency(data?.summary.total)}</p>
          </div>
          <div className={`rounded-lg shadow-md p-4 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <h3 className="text-lg font-medium mb-2">Monthly Average</h3>
            <p className="text-3xl font-bold">{formatCurrency(data?.summary.monthlyAverage)}</p>
          </div>
          <div className={`rounded-lg shadow-md p-4 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <h3 className="text-lg font-medium mb-2">Monthly Change</h3>
            <p className={`text-3xl font-bold ${data?.summary.monthlyChange >= 0 ? 'text-green-500' : 'text-red-500'}`}>
              {data?.summary.monthlyChange >= 0 ? '+' : ''}{data?.summary.monthlyChange}%
            </p>
          </div>
        </section>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Monthly Expenses Bar Chart */}
          <div className={`rounded-lg shadow-md p-4 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <h3 className="text-lg font-medium mb-4">Monthly Expenses</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data?.monthlyExpenses} margin={{ top: 10, right: 10, left: 10, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? '#444' : '#eee'} />
                  <XAxis dataKey="month" stroke={darkMode ? '#aaa' : '#666'} />
                  <YAxis stroke={darkMode ? '#aaa' : '#666'} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: darkMode ? '#333' : '#fff', borderColor: darkMode ? '#555' : '#ddd' }}
                    formatter={(value) => [formatCurrency(value), 'Amount']}
                  />
                  <Bar dataKey="amount" fill="#4F46E5" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Category Spending Pie Chart */}
          <div className={`rounded-lg shadow-md p-4 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <h3 className="text-lg font-medium mb-4">Category Spending</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data?.categorySpending}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={2}
                    dataKey="value"
                    label={({name, percent}) => `${name} (${(percent * 100).toFixed(0)}%)`}
                    labelLine={false}
                  >
                    {data?.categorySpending.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value) => formatCurrency(value)}
                    contentStyle={{ backgroundColor: darkMode ? '#333' : '#fff', borderColor: darkMode ? '#555' : '#ddd' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Expenses Over Time Line Chart */}
          <div className={`rounded-lg shadow-md p-4 col-span-1 lg:col-span-2 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <h3 className="text-lg font-medium mb-4">Expenses Over Time</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data?.expenseOverTime} margin={{ top: 10, right: 10, left: 10, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? '#444' : '#eee'} />
                  <XAxis 
                    dataKey="date" 
                    stroke={darkMode ? '#aaa' : '#666'} 
                    tickFormatter={(date) => new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  />
                  <YAxis stroke={darkMode ? '#aaa' : '#666'} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: darkMode ? '#333' : '#fff', borderColor: darkMode ? '#555' : '#ddd' }}
                    formatter={(value) => [formatCurrency(value), 'Amount']}
                    labelFormatter={(date) => formatDate(date)}
                  />
                  <Line type="monotone" dataKey="amount" stroke="#4F46E5" strokeWidth={2} dot={{ r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Recent Transactions Table */}
        <section className={`rounded-lg shadow-md p-4 mb-6 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
          <h3 className="text-lg font-medium mb-4">Recent Transactions</h3>
          <div className="overflow-x-auto">
            <table className={`min-w-full ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
              <thead className={`${darkMode ? 'bg-gray-700' : 'bg-gray-100'} text-left`}>
                <tr>
                  <th className="px-6 py-3 text-sm font-medium uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-sm font-medium uppercase tracking-wider">Category</th>
                  <th className="px-6 py-3 text-sm font-medium uppercase tracking-wider">Amount</th>
                  <th className="px-6 py-3 text-sm font-medium uppercase tracking-wider">Description</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {data?.recentTransactions.map((transaction) => (
                  <tr key={transaction.id} className={`hover:${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                    <td className="px-6 py-4 whitespace-nowrap">{formatDate(transaction.date)}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{transaction.category}</td>
                    <td className="px-6 py-4 whitespace-nowrap font-medium">{formatCurrency(transaction.amount)}</td>
                    <td className="px-6 py-4">{transaction.description}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className={`p-4 ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-inner text-center`}>
        <p className="text-sm">
          Expense Dashboard © {new Date().getFullYear()} • Last updated: {new Date().toLocaleString()}
        </p>
      </footer>
    </div>
  );
} 
