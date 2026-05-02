import React from 'react';
import { Download } from 'lucide-react';
import { exportToCsv } from '../utils/exportCsv';
import type { Candidate } from '../types';

interface ExportButtonProps {
  candidates: Candidate[];
}

export const ExportButton: React.FC<ExportButtonProps> = ({ candidates }) => {
  return (
    <button
      onClick={() => exportToCsv(candidates)}
      disabled={candidates.length === 0}
      className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-xl hover:bg-slate-50 hover:text-brand-600 font-medium transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
    >
      <Download size={18} />
      Export CSV
    </button>
  );
};
