import React from 'react';
import clsx from 'clsx';
import { getScoreColorHex } from '../utils/scoreColor';

export const ProgressBar: React.FC<{ progress: number; score?: boolean }> = ({ progress, score }) => {
  const bgColor = score ? getScoreColorHex(progress) : '#14b8a6'; // brand-500
  
  return (
    <div className="w-full bg-slate-200 rounded-full h-2.5 overflow-hidden">
      <div 
        className="h-2.5 rounded-full transition-all duration-1000 ease-out"
        style={{ width: `${progress}%`, backgroundColor: bgColor }}
      ></div>
    </div>
  );
};
