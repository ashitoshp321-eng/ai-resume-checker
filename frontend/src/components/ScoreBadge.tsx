import React from 'react';
import clsx from 'clsx';
import { getScoreColor } from '../utils/scoreColor';

export const ScoreBadge: React.FC<{ score: number; className?: string }> = ({ score, className }) => {
  const colorClass = getScoreColor(score);
  
  return (
    <div className={clsx(
      "px-3 py-1.5 rounded-full border flex items-center justify-center font-bold",
      colorClass,
      className
    )}>
      {score}% Match
    </div>
  );
};
