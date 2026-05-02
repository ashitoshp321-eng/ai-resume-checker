import React, { useState, useMemo } from 'react';
import { Navigate } from 'react-router-dom';
import { useCandidates } from '../api/hooks/useScreening';
import { useAppStore } from '../store/appStore';
import { Header } from '../components/Layout/Header';
import { CandidateCard } from '../components/CandidateCard';
import { FilterBar } from '../components/FilterBar';
import { ExportButton } from '../components/ExportButton';
import { Loader2 } from 'lucide-react';

export const ResultsPage: React.FC = () => {
  const { jdId, resumeIds } = useAppStore();
  const { data: candidates, isLoading } = useCandidates(jdId);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [minScore, setMinScore] = useState(0);

  const filteredCandidates = useMemo(() => {
    if (!candidates) return [];
    
    return candidates.filter(c => {
      // Filter by score
      if (c.score < minScore) return false;
      
      // Filter by search query (name or skills)
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const nameMatch = (c.parsed_json.name || c.filename).toLowerCase().includes(query);
        const skillMatch = c.parsed_json.skills?.some(s => s.toLowerCase().includes(query));
        
        if (!nameMatch && !skillMatch) return false;
      }
      
      return true;
    });
  }, [candidates, searchQuery, minScore]);

  if (!jdId || resumeIds.length === 0) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="max-w-5xl mx-auto pb-12">
      <div className="flex justify-between items-start mb-8">
        <Header 
          title="3. Ranked Results" 
          description="Candidates scored by semantic similarity to the job description." 
        />
        {candidates && <ExportButton candidates={filteredCandidates} />}
      </div>

      <FilterBar 
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        minScore={minScore}
        setMinScore={setMinScore}
      />

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20 bg-white border border-slate-200 rounded-2xl shadow-sm">
          <Loader2 size={48} className="animate-spin text-brand-500 mb-4" />
          <p className="text-slate-500 font-medium text-lg">Loading candidate rankings...</p>
        </div>
      ) : filteredCandidates.length === 0 ? (
        <div className="text-center py-20 bg-white border border-slate-200 rounded-2xl shadow-sm">
          <p className="text-slate-500 font-medium text-lg">No candidates match your filters.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredCandidates.map(candidate => (
            <CandidateCard key={candidate.resume_id} candidate={candidate} />
          ))}
        </div>
      )}
    </div>
  );
};
