import React from 'react';

export const Header: React.FC<{ title: string; description?: string }> = ({ title, description }) => {
  return (
    <div className="mb-8 border-b border-slate-200 pb-6">
      <h2 className="text-3xl font-bold text-slate-900 tracking-tight">{title}</h2>
      {description && <p className="mt-2 text-slate-500 text-lg">{description}</p>}
    </div>
  );
};
