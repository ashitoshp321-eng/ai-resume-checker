import { useMutation } from '@tanstack/react-query';
import { apiClient } from '../client';
import type { UploadResponse } from '../../types';

export const useUploadResumes = () => {
  return useMutation({
    mutationFn: async (files: File[]) => {
      const formData = new FormData();
      files.forEach(file => {
        formData.append('files', file);
      });

      const response = await apiClient.post<UploadResponse>('/upload-resumes', formData);
      return response.data;
    },
  });
};
