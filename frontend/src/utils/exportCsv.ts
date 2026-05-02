import type { Candidate } from '../types';

export const exportToCsv = (candidates: Candidate[], filename = 'screened_candidates.csv') => {
  const headers = ['Rank', 'Score', 'Filename', 'Name', 'Email', 'Phone', 'Experience (Yrs)', 'Skills'];
  
  const rows = candidates.map(c => [
    c.rank,
    c.score,
    c.filename,
    c.parsed_json.name || 'N/A',
    c.parsed_json.email || 'N/A',
    c.parsed_json.phone || 'N/A',
    c.parsed_json.experience_years || 'N/A',
    (c.parsed_json.skills || []).join(', ')
  ]);
  
  const csvContent = [
    headers.join(','),
    ...rows.map(e => e.map(item => `"${String(item).replace(/"/g, '""')}"`).join(','))
  ].join('\n');
  
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
