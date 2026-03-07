import React from 'react';

const AccountAggregatorEcosystem = () => {
  return (
    <div className="bg-gray-100 py-12">
      <h2 className="text-3xl font-semibold text-gray-800 text-center mb-12">
        How Account Aggregator Ecosystem Works
      </h2>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {/* Financial Information Providers */}
          <div className="md:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-semibold text-gray-700 mb-4">
                Financial Information Providers
              </h3>
              <ul className="space-y-3">
                <li className="flex items-center text-gray-600">
                  <svg
                    className="w-6 h-6 mr-2 text-blue-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0l2-2m-2 2v9a1 1 0 01-1 1h-3m3-17v12m9-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-3-1l2-2m-2 2v9a1 1 0 01-1 1h-3"
                    />
                  </svg>
                  Banks/NBFCs
                </li>
                <li className="flex items-center text-gray-600">
                  <svg
                    className="w-6 h-6 mr-2 text-green-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0-8c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  Mutual Fund House
                </li>
                <li className="flex items-center text-gray-600">
                  <svg
                    className="w-6 h-6 mr-2 text-red-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"
                    />
                  </svg>
                  Insurance Provider
                </li>
                <li className="flex items-center text-gray-600">
                  <svg
                    className="w-6 h-6 mr-2 text-yellow-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 17h6m-4-7v7m4-7v7m-9 10h.01M12 15h.01M15 13h.01M12 11h.01M9 9h.01M3 17a2 2 0 104 0h14a2 2 0 10-4 0H3z"
                    />
                  </svg>
                  Invoice/Tax Platform
                </li>
              </ul>
            </div>
          </div>

          {/* Account Aggregators (Center) */}
          <div className="md:col-span-1 flex flex-col items-center justify-center">
            <div className="bg-gray-800 text-white rounded-full shadow-lg p-8 w-40 h-40 flex items-center justify-center text-center">
              <h3 className="font-semibold">
                Account <br /> Aggregators
              </h3>
            </div>
            <div className="mt-4 text-sm text-gray-600 text-center">
              <p>
                <span className="font-semibold">2</span> Data requested through open APIs
              </p>
            </div>
            <div className="flex justify-between w-full mt-4">
              <svg
                className="w-6 h-6 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
              <svg
                className="w-6 h-6 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </div>
            <div className="mt-4 text-sm text-gray-600 text-center">
                <p><span className="font-semibold">3</span> Data shared in an end-to-end encrypted manner</p>
            </div>
            <svg className="w-6 h-6 mx-auto mt-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7 7m0 0l7-7m-7 7V3" />
            </svg>
            <div className="mt-4 text-sm text-gray-600 text-center">
                <p><span className="font-semibold">1</span> Provides consent to share data</p>
            </div>
            <div className="bg-white rounded-full shadow-md p-6 w-24 h-24 flex items-center justify-center mt-4">
                <svg className="w-10 h-10 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-700 mt-2">User</h3>

          </div>

          {/* Financial Information Users */}
          <div className="md:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-semibold text-gray-700 mb-4">
                Financial Information Users
              </h3>
              <ul className="space-y-3">
                <li className="flex items-center text-gray-600">
                  <svg
                    className="w-6 h-6 mr-2 text-blue-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6h12m0 0l-4 4m4-4l-4-4"
                    />
                  </svg>
                  Cash flow-based lending (Bank/NBFC)
                </li>
                <li className="flex items-center text-gray-600">
                  <svg
                    className="w-6 h-6 mr-2 text-green-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 4.354l-2 2m0 0l-2-2m2 2L9.854 8.354m0 0l1.692 1.692m-1.692-1.692L12 11.646m-1.692-1.692l-2-2m2 2L7.854 6.354m0 0l1.692-1.692m-1.692 1.692L12 4.354m0 0l2 2m0 0l2-2m-2 2L14.146 8.354m0 0l-1.692 1.692m1.692-1.692L12 11.646m1.692-1.692l2 2m-2-2L16.146 6.354m0 0l-1.692-1.692m1.692 1.692L12 4.354"
                    />
                  </svg>
                  Personal Finance Management
                </li>
                <li className="flex items-center text-gray-600">
                  <svg
                    className="w-6 h-6 mr-2 text-purple-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V8a2 2 0 012-2h9a2 2 0 012 2v8a2 2 0 01-2 2zm-2-8V4h4v4h-4z"
                    />
                  </svg>
                  Wealth Management
                </li>
                <li className="flex items-center text-gray-600">
                  <svg
                    className="w-6 h-6 mr-2 text-teal-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    />
                  </svg>
                  Robo Advisors
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Download App Section */}
        <div className="mt-12 text-center">
          <div className="inline-flex items-center">
            <img src="your-qr-code.png" alt="QR Code" className="w-16 h-16 mr-4" />
            <div>
              <p className="text-gray-700 mb-2">Available on the</p>
              <div className="flex items-center justify-center">
                <a href="#" className="mr-2">
                  <img src="app-store-badge.png" alt="App Store" className="h-10" />
                </a>
                <a href="#">
                  <img src="google-play-badge.png" alt="Google Play" className="h-10" />
                </a>
              </div>
            </div>
          </div>
          <p className="text-green-500 font-semibold mt-4">Download app to get started</p>
        </div>
      </div>
    </div>
  );
};

export default AccountAggregatorEcosystem;