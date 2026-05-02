export const getScoreColor = (score: number): string => {
  if (score >= 75) return 'bg-green-100 text-green-800 border-green-200';
  if (score >= 50) return 'bg-amber-100 text-amber-800 border-amber-200';
  return 'bg-red-100 text-red-800 border-red-200';
};

export const getScoreColorHex = (score: number): string => {
  if (score >= 75) return '#166534'; // green-800
  if (score >= 50) return '#92400e'; // amber-800
  return '#991b1b'; // red-800
};
