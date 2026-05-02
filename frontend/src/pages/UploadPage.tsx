import React, { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { useUploadResumes } from '../api/hooks/useResumes';
import { useScreenResumes } from '../api/hooks/useScreening';
import { useAppStore } from '../store/appStore';
import { Header } from '../components/Layout/Header';
import { FileDropzone } from '../components/FileDropzone';
import { Loader2, PlayCircle } from 'lucide-react';

export const UploadPage: React.FC = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [error, setError] = useState<string | null>(null);
  
  const navigate = useNavigate();
  const { jdId, addResumeIds } = useAppStore();
  
  const uploadMutation = useUploadResumes();
  const screenMutation = useScreenResumes();

  if (!jdId) {
    return <Navigate to="/" replace />;
  }

  const handleFilesSelected = (newFiles: File[]) => {
    setError(null);
    if (files.length + newFiles.length > 20) {
      setError("Maximum 20 files allowed per batch.");
      return;
    }
    setFiles(prev => [...prev, ...newFiles]);
  };

  const handleRemoveFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleProcess = () => {
    if (files.length === 0) return;
    setError(null);

    // 1. Upload Resumes
    uploadMutation.mutate(files, {
      onSuccess: (uploadData) => {
        const ids = uploadData.uploaded.map(r => r.id);
        addResumeIds(ids);

        // 2. Screen Resumes
        screenMutation.mutate(
          { jdId, resumeIds: ids },
          {
            onSuccess: () => {
              navigate('/results');
            },
            onError: (err: any) => {
              setError(err.response?.data?.detail || "Error screening resumes.");
            }
          }
        );
      },
      onError: (err: any) => {
        setError(err.response?.data?.detail || "Error uploading resumes.");
      }
    });
  };

  const isProcessing = uploadMutation.isPending || screenMutation.isPending;

  return (
    <div className="max-w-4xl mx-auto">
      <Header 
        title="2. Upload Resumes" 
        description="Upload PDF resumes to rank them against your job description." 
      />

      <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm">
        
        {error && (
          <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-xl border border-red-100 font-medium">
            {error}
          </div>
        )}

        <FileDropzone 
          onFilesSelected={handleFilesSelected}
          selectedFiles={files}
          onRemoveFile={handleRemoveFile}
          isLoading={isProcessing}
        />

        <div className="mt-8 pt-8 border-t border-slate-100 flex justify-between items-center">
          <p className="text-slate-500">
            {files.length > 0 ? `${files.length} file(s) ready for processing` : "Select files to begin"}
          </p>
          <button
            onClick={handleProcess}
            disabled={files.length === 0 || isProcessing}
            className="flex items-center gap-2 bg-brand-500 text-white px-8 py-3.5 rounded-xl font-bold hover:bg-brand-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-brand-500/30"
          >
            {isProcessing ? (
              <>
                <Loader2 size={20} className="animate-spin" /> Processing AI Match...
              </>
            ) : (
              <>
                <PlayCircle size={20} /> Run Screening
              </>
            )}
          </button>
        </div>

      </div>
    </div>
  );
};
