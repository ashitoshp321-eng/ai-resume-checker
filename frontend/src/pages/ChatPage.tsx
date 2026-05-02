import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAppStore } from '../store/appStore';
import { Header } from '../components/Layout/Header';
import { ChatWidget } from '../components/ChatWidget';

export const ChatPage: React.FC = () => {
  const { jdId } = useAppStore();

  if (!jdId) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="max-w-4xl mx-auto">
      <Header 
        title="4. HR Assistant" 
        description="Ask questions about the top ranked candidates for this role." 
      />
      <ChatWidget />
    </div>
  );
};
