import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { UploadCloud, File, X } from 'lucide-react';

interface FileDropzoneProps {
  onFilesSelected: (files: File[]) => void;
  selectedFiles: File[];
  onRemoveFile: (index: number) => void;
  isLoading: boolean;
}

export const FileDropzone: React.FC<FileDropzoneProps> = ({ 
  onFilesSelected, 
  selectedFiles, 
  onRemoveFile,
  isLoading 
}) => {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    onFilesSelected(acceptedFiles);
  }, [onFilesSelected]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'application/pdf': ['.pdf'] },
    disabled: isLoading,
  });

  return (
    <div className="w-full">
      <div 
        {...getRootProps()} 
        className={`border-2 border-dashed rounded-2xl p-10 text-center cursor-pointer transition-all duration-200
          ${isDragActive ? 'border-brand-500 bg-brand-50' : 'border-slate-300 hover:border-brand-400 hover:bg-slate-50'}
          ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}
        `}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center gap-4">
          <div className={`p-4 rounded-full ${isDragActive ? 'bg-brand-100 text-brand-600' : 'bg-slate-100 text-slate-500'}`}>
            <UploadCloud size={32} />
          </div>
          <div>
            <p className="text-lg font-medium text-slate-700">
              {isDragActive ? 'Drop the PDFs here...' : 'Drag & drop PDFs here'}
            </p>
            <p className="text-slate-500 mt-1">or click to browse files</p>
          </div>
          <p className="text-xs text-slate-400 mt-2">Up to 20 PDFs, max 5MB each</p>
        </div>
      </div>

      {selectedFiles.length > 0 && (
        <div className="mt-8">
          <h4 className="text-sm font-semibold text-slate-600 uppercase tracking-wider mb-4">
            Selected Files ({selectedFiles.length})
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-60 overflow-y-auto pr-2">
            {selectedFiles.map((file, index) => (
              <div key={`${file.name}-${index}`} className="flex items-center justify-between bg-white border border-slate-200 rounded-xl p-3 shadow-sm">
                <div className="flex items-center gap-3 overflow-hidden">
                  <div className="bg-red-50 text-red-500 p-2 rounded-lg shrink-0">
                    <File size={18} />
                  </div>
                  <div className="truncate">
                    <p className="text-sm font-medium text-slate-700 truncate">{file.name}</p>
                    <p className="text-xs text-slate-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                  </div>
                </div>
                {!isLoading && (
                  <button 
                    onClick={(e) => { e.stopPropagation(); onRemoveFile(index); }}
                    className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors shrink-0"
                  >
                    <X size={16} />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
