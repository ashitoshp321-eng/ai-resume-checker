import React from 'react';
import { NavLink } from 'react-router-dom';
import { FileText, Upload, Users, MessageSquare } from 'lucide-react';
import clsx from 'clsx';
import { useAppStore } from '../../store/appStore';

export const Sidebar: React.FC = () => {
  const { jdId, resumeIds } = useAppStore();

  const links = [
    { to: '/', icon: FileText, label: '1. Job Description' },
    { to: '/upload', icon: Upload, label: '2. Upload Resumes', disabled: !jdId },
    { to: '/results', icon: Users, label: '3. Results', disabled: resumeIds.length === 0 },
    { to: '/chat', icon: MessageSquare, label: '4. HR Assistant', disabled: !jdId },
  ];

  return (
    <div className="w-64 bg-slate-900 text-white min-h-screen flex flex-col hidden md:flex">
      <div className="p-6">
        <h1 className="text-2xl font-bold text-brand-400 tracking-tight flex items-center gap-2">
          <span className="bg-brand-500 text-white p-1.5 rounded-lg">
            <Users size={20} />
          </span>
          AI Screener
        </h1>
      </div>
      
      <nav className="flex-1 px-4 space-y-2 mt-4">
        {links.map((link) => (
          link.disabled ? (
            <div
              key={link.to}
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-500 cursor-not-allowed"
              title="Complete previous steps first"
            >
              <link.icon size={20} />
              <span className="font-medium">{link.label}</span>
            </div>
          ) : (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                clsx(
                  "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200",
                  isActive
                    ? "bg-brand-500 text-white shadow-lg shadow-brand-500/30"
                    : "text-slate-300 hover:bg-slate-800 hover:text-white"
                )
              }
            >
              <link.icon size={20} />
              <span className="font-medium">{link.label}</span>
            </NavLink>
          )
        ))}
      </nav>

      <div className="p-6">
        <div className="bg-slate-800 rounded-xl p-4 border border-slate-700">
          <p className="text-xs text-slate-400 font-medium uppercase tracking-wider mb-2">Status</p>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-slate-300">JD Set</span>
              <span className={jdId ? "text-green-400" : "text-slate-500"}>{jdId ? '✓ Yes' : 'No'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-300">Resumes</span>
              <span className="text-brand-400 font-medium">{resumeIds.length}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
