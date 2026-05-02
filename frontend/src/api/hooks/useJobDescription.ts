import { useMutation } from '@tanstack/react-query';
import { apiClient } from '../client';
import type { JobDescription } from '../../types';

interface JdPayload {
  title: string;
  content: string;
}

export const useJobDescription = () => {
  return useMutation({
    mutationFn: async (data: JdPayload) => {
      const response = await apiClient.post<JobDescription>('/job-description', data);
      return response.data;
    },
  });
};
