import { useMutation, useQuery } from '@tanstack/react-query';
import { apiClient } from '../client';
import type { ScreenResponse, Candidate } from '../../types';

export const useScreenResumes = () => {
  return useMutation({
    mutationFn: async ({ jdId, resumeIds }: { jdId: number; resumeIds: number[] }) => {
      const response = await apiClient.post<ScreenResponse>('/screen', {
        jd_id: jdId,
        resume_ids: resumeIds,
      });
      return response.data;
    },
  });
};

export const useCandidates = (jdId: number | null) => {
  return useQuery({
    queryKey: ['candidates', jdId],
    queryFn: async () => {
      const response = await apiClient.get<{ candidates: Candidate[] }>('/candidates', {
        params: { jd_id: jdId },
      });
      return response.data.candidates;
    },
    enabled: !!jdId,
  });
};
