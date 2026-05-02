import { useMutation } from '@tanstack/react-query';
import { apiClient } from '../client';
import type { ChatResponse } from '../../types';

export const useChat = () => {
  return useMutation({
    mutationFn: async ({ message, jdId }: { message: string; jdId: number }) => {
      const response = await apiClient.post<ChatResponse>('/chat', {
        message,
        jd_id: jdId,
      });
      return response.data;
    },
  });
};
