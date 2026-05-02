import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Loader2 } from 'lucide-react';
import { useChat } from '../api/hooks/useChat';
import { useAppStore } from '../store/appStore';
import clsx from 'clsx';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export const ChatWidget: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: 'Hi! I am your AI HR Assistant. You can ask me questions about the screened candidates, such as "Who has the most React experience?" or "Summarise candidate #1".' }
  ]);
  const [input, setInput] = useState('');
  const { jdId } = useAppStore();
  const chatMutation = useChat();
  const scrollRef = useRef<DivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = () => {
    if (!input.trim() || !jdId) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);

    chatMutation.mutate(
      { message: userMessage, jdId },
      {
        onSuccess: (data) => {
          setMessages(prev => [...prev, { role: 'assistant', content: data.reply }]);
        },
        onError: () => {
          setMessages(prev => [...prev, { role: 'assistant', content: 'Sorry, I encountered an error communicating with the backend.' }]);
        }
      }
    );
  };

  return (
    <div className="flex flex-col h-[600px] bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
      <div className="p-4 bg-slate-900 text-white flex items-center gap-3">
        <div className="bg-brand-500 p-2 rounded-lg">
          <Bot size={20} />
        </div>
        <div>
          <h3 className="font-bold tracking-tight">HR Assistant</h3>
          <p className="text-xs text-slate-400">Powered by LLM</p>
        </div>
      </div>

      <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-slate-50" ref={scrollRef}>
        {messages.map((msg, idx) => (
          <div key={idx} className={clsx("flex gap-3", msg.role === 'user' ? "flex-row-reverse" : "")}>
            <div className={clsx(
              "w-8 h-8 rounded-full flex items-center justify-center shrink-0",
              msg.role === 'user' ? "bg-brand-100 text-brand-600" : "bg-slate-800 text-white"
            )}>
              {msg.role === 'user' ? <User size={16} /> : <Bot size={16} />}
            </div>
            
            <div className={clsx(
              "max-w-[80%] rounded-2xl p-4 shadow-sm",
              msg.role === 'user' 
                ? "bg-brand-500 text-white rounded-tr-none" 
                : "bg-white border border-slate-200 text-slate-700 rounded-tl-none whitespace-pre-wrap text-sm leading-relaxed"
            )}>
              {msg.content}
            </div>
          </div>
        ))}
        {chatMutation.isPending && (
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-full bg-slate-800 text-white flex items-center justify-center shrink-0">
              <Bot size={16} />
            </div>
            <div className="bg-white border border-slate-200 rounded-2xl rounded-tl-none p-4 flex items-center gap-2 text-slate-500 shadow-sm">
              <Loader2 size={16} className="animate-spin" />
              Thinking...
            </div>
          </div>
        )}
      </div>

      <div className="p-4 bg-white border-t border-slate-200">
        <div className="flex items-center gap-2">
          <input
            type="text"
            className="flex-1 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition-all"
            placeholder="Ask about candidates..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            disabled={!jdId || chatMutation.isPending}
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || !jdId || chatMutation.isPending}
            className="p-3 bg-brand-500 text-white rounded-xl hover:bg-brand-600 disabled:opacity-50 disabled:hover:bg-brand-500 transition-colors shadow-sm"
          >
            <Send size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};
