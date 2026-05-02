import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useJobDescription } from '../api/hooks/useJobDescription';
import { useAppStore } from '../store/appStore';
import { Header } from '../components/Layout/Header';
import { Loader2, ArrowRight } from 'lucide-react';

export const JobDescriptionPage: React.FC = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const navigate = useNavigate();
  const jdMutation = useJobDescription();
  const setJdId = useAppStore(state => state.setJdId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    jdMutation.mutate(
      { title, content },
      {
        onSuccess: (data) => {
          setJdId(data.id);
          navigate('/upload');
        },
      }
    );
  };

  const loadSample = () => {
    setTitle('Senior Software Engineer (Python/React)');
    setContent(`We are looking for a Senior Software Engineer to join our team.

Responsibilities:
- Build and maintain scalable backend services using Python and FastAPI
- Develop responsive frontend interfaces with React, TypeScript, and TailwindCSS
- Design and optimise PostgreSQL databases
- Deploy using Docker and CI/CD pipelines

Requirements:
- 5+ years of experience in software engineering
- Strong proficiency in Python, React, and SQL
- Experience with cloud platforms (AWS/GCP)
- Excellent communication skills
- Bachelor's degree in Computer Science or related field`);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <Header 
        title="1. Job Description" 
        description="Enter the job title and description to benchmark candidates against." 
      />

      <form onSubmit={handleSubmit} className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm">
        <div className="mb-6">
          <div className="flex justify-between items-end mb-2">
            <label className="block text-sm font-semibold text-slate-700">Job Title</label>
            <button 
              type="button" 
              onClick={loadSample}
              className="text-xs text-brand-600 hover:text-brand-700 font-medium bg-brand-50 px-3 py-1.5 rounded-lg"
            >
              Load Sample JD
            </button>
          </div>
          <input
            type="text"
            required
            className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition-all bg-slate-50 focus:bg-white"
            placeholder="e.g. Senior Frontend Engineer"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        <div className="mb-8">
          <label className="block text-sm font-semibold text-slate-700 mb-2">Job Description</label>
          <textarea
            required
            rows={12}
            className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition-all bg-slate-50 focus:bg-white"
            placeholder="Paste the full job description here..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={!title.trim() || !content.trim() || jdMutation.isPending}
            className="flex items-center gap-2 bg-brand-500 text-white px-8 py-3.5 rounded-xl font-bold hover:bg-brand-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-brand-500/30"
          >
            {jdMutation.isPending ? (
              <>
                <Loader2 size={20} className="animate-spin" /> Saving...
              </>
            ) : (
              <>
                Continue to Uploads <ArrowRight size={20} />
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
