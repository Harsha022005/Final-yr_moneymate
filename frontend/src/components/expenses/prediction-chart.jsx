// components/expenses/prediction-chart.jsx
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

export function ExpensePredictionChart({ historicalData, predictedData }) {
  const data = [
    ...historicalData.map((value, index) => ({ 
      name: `Month ${index + 1}`, 
      value,
      type: 'actual' 
    })),
    { 
      name: `Month ${historicalData.length + 1}`, 
      value: predictedData,
      type: 'predicted' 
    }
  ];

  return (
    <div className="h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip 
            formatter={(value) => [`₹${value}`, 'Amount']}
            labelFormatter={(label) => label}
          />
          <Line
            type="monotone"
            dataKey="value"
            stroke="#8884d8"
            strokeWidth={2}
            dot={{ r: 4 }}
            activeDot={{ r: 6 }}
            strokeDasharray={data[data.length - 1].type === 'predicted' ? '5 5' : '0'}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}