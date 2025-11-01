import React from 'react';

interface StatusBadgeProps {
  status: 'pending' | 'in-progress' | 'completed' | 'incomplete';
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const styles = {
    pending: 'bg-yellow-900 bg-opacity-30 text-yellow-400 border-yellow-600',
    'in-progress': 'bg-blue-900 bg-opacity-30 text-alphacloud-cyan border-alphacloud-cyan',
    completed: 'bg-green-900 bg-opacity-30 text-green-400 border-green-600',
    incomplete: 'bg-gray-700 text-alphacloud-text-secondary border-gray-600',
  };

  const labels = {
    pending: 'Pending',
    'in-progress': 'In Progress',
    completed: 'Completed',
    incomplete: 'Incomplete',
  };

  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${styles[status]}`}>
      {labels[status]}
    </span>
  );
};

export default StatusBadge;
