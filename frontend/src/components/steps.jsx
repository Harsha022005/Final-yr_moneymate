import React from 'react';

const StepsHorizontal = () => {
  const steps = [
    {
      icon: 'download-icon.png', // Replace with your icon path
      title: 'Download',
      description: 'Get the app',
    },
    {
      icon: 'launch-icon.png', // Replace with your icon path
      title: 'Open App',
      description: 'Launch Finance Tracker',
    },
    {
      icon: 'verify-icon.png', // Replace with your icon path
      title: 'Verify Number',
      description: 'Enter your mobile',
    },
    {
      icon: 'link-icon.png', // Replace with your icon path
      title: 'Link Accounts',
      description: 'Connect your banks',
    },
  ];

  return (
    <div className="flex items-center justify-around p-8 overflow-x-auto whitespace-nowrap">
      {steps.map((step, index) => (
        <div
          key={index}
          className={`flex flex-col items-center text-center p-4 rounded-md transition-transform min-w-[150px] hover:-translate-y-1 ${
            index === 0 ? 'bg-blue-100' : ''
          }`}
        >
          <div className="mb-2">
            <img src={step.icon} alt={`${step.title} Icon`} className="w-12 h-12" />
          </div>
          <div className="flex flex-col">
            <strong className="font-semibold mb-1">{step.title}</strong>
            <p className="text-gray-600 text-sm">{step.description}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default StepsHorizontal;