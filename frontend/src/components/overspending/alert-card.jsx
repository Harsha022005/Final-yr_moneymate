import { AlertCircle, TrendingDown, TrendingUp, ArrowRight } from 'lucide-react';

export function OverspendingAlert({ isOverspending, metrics }) {
  console.log('OverspendingAlert props:', { isOverspending, metrics });
  
  if (!isOverspending) {
    console.log('Not showing alert: isOverspending is false');
    return null;
  }

  const isOverspendingSignificant = metrics.deviationPercent >= 20;
  const averageSpend = metrics.averageSpend || metrics.actualSpend / (1 + metrics.deviationPercent / 100);
  const overspentAmount = metrics.actualSpend - averageSpend;

  return (
    <div className="relative bg-gradient-to-r from-red-50 to-red-100 rounded-xl shadow-sm overflow-hidden mb-6 border border-red-100">
      {/* Decorative elements */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute -right-10 -top-10 w-40 h-40 bg-red-300 rounded-full mix-blend-multiply filter blur-xl opacity-20"></div>
        <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-red-400 rounded-full mix-blend-multiply filter blur-xl opacity-20"></div>
      </div>
      
      <div className="relative p-6">
        <div className="flex items-start">
          <div className="flex-shrink-0 p-3 rounded-full bg-red-100 text-red-600">
            <AlertCircle className="h-6 w-6" />
          </div>
          <div className="ml-4 flex-1">
            <h3 className="text-lg font-semibold text-red-900">
              {isOverspendingSignificant ? 'Significant Overspending Detected!' : 'Overspending Alert'}
            </h3>
            
            <div className="mt-2 text-red-800">
              <p className="text-sm">
                You've spent <span className="font-semibold">₹{metrics.actualSpend.toLocaleString()}</span> this month.
              </p>
              <div className="mt-2 flex items-center text-sm">
                {metrics.deviationPercent > 0 ? (
                  <TrendingUp className="h-4 w-4 text-red-600 mr-1" />
                ) : (
                  <TrendingDown className="h-4 w-4 text-green-600 mr-1" />
                )}
                <span>
                  {Math.abs(metrics.deviationPercent)}% {metrics.deviationPercent > 0 ? 'above' : 'below'} your monthly average
                  {averageSpend && ` (₹${averageSpend.toLocaleString()})`}
                </span>
              </div>
              
              {overspentAmount > 0 && (
                <div className="mt-3 p-3 bg-white bg-opacity-50 rounded-lg border border-red-100">
                  <p className="text-sm font-medium">You've overspent by ₹{overspentAmount.toFixed(2)} this month.</p>
                  <p className="text-xs mt-1 text-red-700">
                    Consider reviewing your spending in the <a href="#expenses" className="font-medium hover:underline">expenses section</a>.
                  </p>
                </div>
              )}
              
              <div className="mt-4 flex items-center text-xs font-medium text-red-700">
                <a href="#savings-tips" className="inline-flex items-center hover:underline">
                  View money-saving tips <ArrowRight className="ml-1 h-3 w-3" />
                </a>
              </div>
            </div>
          </div>
          
          <div className="ml-4">
            <div className={`px-3 py-1 rounded-full text-xs font-semibold ${
              isOverspendingSignificant 
                ? 'bg-red-100 text-red-800' 
                : 'bg-amber-100 text-amber-800'
            }`}>
              {isOverspendingSignificant ? 'High Alert' : 'Warning'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}