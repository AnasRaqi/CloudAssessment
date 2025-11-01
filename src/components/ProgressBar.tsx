import React from 'react';

interface ProgressBarProps {
  current: number;
  total: number;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ current, total }) => {
  const percentage = Math.round((current / total) * 100);

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm font-medium text-alphacloud-text-primary">Progress</span>
        <span className="text-sm font-medium text-alphacloud-cyan">{percentage}%</span>
      </div>
      <div className="w-full bg-gray-700 rounded-full h-3">
        <div
          className="bg-alphacloud-cyan h-3 rounded-full transition-all duration-500"
          style={{ width: `${percentage}%` }}
        />
      </div>
      <div className="text-xs text-alphacloud-text-secondary mt-1">
        {current} of {total} sections completed
      </div>
    </div>
  );
};

export default ProgressBar;
