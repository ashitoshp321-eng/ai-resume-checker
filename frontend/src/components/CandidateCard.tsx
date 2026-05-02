import React, { useState } from 'react';
import type { Candidate } from '../types';
import { ScoreBadge } from './ScoreBadge';
import { ProgressBar } from './ProgressBar';
import { ChevronDown, ChevronUp, Mail, Phone, Briefcase, GraduationCap, Award } from 'lucide-react';

export const CandidateCard: React.FC<{ candidate: Candidate }> = ({ candidate }) => {
  const [expanded, setExpanded] = useState(false);
  const { parsed_json, score, rank, filename } = candidate;

  return (
    <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300">
      <div 
        className="p-6 cursor-pointer flex items-center justify-between"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center gap-6">
          <div className="flex flex-col items-center justify-center w-12 h-12 bg-slate-50 text-slate-500 rounded-full font-bold text-lg border border-slate-200">
            #{rank}
          </div>
          
          <div>
            <h3 className="text-xl font-bold text-slate-900">
              {parsed_json.name || filename.replace('.pdf', '')}
            </h3>
            <div className="flex gap-4 mt-2 text-sm text-slate-500">
              {parsed_json.experience_years !== null && (
                <span className="flex items-center gap-1">
                  <Briefcase size={14} /> {parsed_json.experience_years} years exp
                </span>
              )}
              {parsed_json.skills && parsed_json.skills.length > 0 && (
                <span className="flex items-center gap-1">
                  <Award size={14} /> {parsed_json.skills.length} skills found
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="text-right">
            <ScoreBadge score={score} className="text-sm px-4" />
          </div>
          <button className="text-slate-400 hover:text-brand-500 transition-colors">
            {expanded ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
          </button>
        </div>
      </div>

      {expanded && (
        <div className="px-6 pb-6 pt-2 border-t border-slate-100 bg-slate-50/50">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
            
            <div className="space-y-4">
              <h4 className="font-semibold text-slate-900 text-sm uppercase tracking-wider">Contact Info</h4>
              <div className="space-y-2">
                <div className="flex items-center gap-3 text-slate-600">
                  <Mail size={16} className="text-slate-400" />
                  <span>{parsed_json.email || 'Not found'}</span>
                </div>
                <div className="flex items-center gap-3 text-slate-600">
                  <Phone size={16} className="text-slate-400" />
                  <span>{parsed_json.phone || 'Not found'}</span>
                </div>
              </div>

              <h4 className="font-semibold text-slate-900 text-sm uppercase tracking-wider pt-2">Skills Extracted</h4>
              <div className="flex flex-wrap gap-2">
                {parsed_json.skills && parsed_json.skills.length > 0 ? (
                  parsed_json.skills.map((skill, i) => (
                    <span key={i} className="px-2.5 py-1 bg-white border border-slate-200 text-slate-600 rounded-md text-sm font-medium shadow-sm">
                      {skill}
                    </span>
                  ))
                ) : (
                  <span className="text-slate-500 italic text-sm">No standard skills matched</span>
                )}
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-semibold text-slate-900 text-sm uppercase tracking-wider">Scoring Breakdown</h4>
              <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-3 shadow-sm">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-slate-600 font-medium">Semantic Match</span>
                    <span className="font-bold text-slate-900">{score}%</span>
                  </div>
                  <ProgressBar progress={score} score={true} />
                  <p className="text-xs text-slate-500 mt-2">
                    Based on cosine similarity between the resume text and the job description embeddings.
                  </p>
                </div>
              </div>
            </div>
            
          </div>
        </div>
      )}
    </div>
  );
};
