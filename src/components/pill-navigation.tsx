'use client';

import React from 'react';
import { useAppStore } from '../app/store';
import { Network, BookOpen, GraduationCap } from 'lucide-react';
import { motion } from 'framer-motion';

export function PillNavigation() {
  const { currentTab, setTab } = useAppStore();

  return (
    <div className="absolute top-3 left-3 sm:top-auto sm:bottom-6 sm:left-1/2 sm:-translate-x-1/2 z-30">
      <div id="pill-view-toggle" className="relative flex items-center p-1 bg-zinc-900/60 border border-zinc-800/80 backdrop-blur-md rounded-full shadow-lg gap-1">
        {/* Graph Tab */}
        <button
          onClick={() => setTab('graph')}
          className={`relative z-10 flex items-center gap-1 sm:gap-2 px-2.5 sm:px-4 py-1.5 sm:py-2 text-[11px] sm:text-xs font-semibold rounded-full transition-colors duration-200 select-none ${
            currentTab === 'graph' ? 'text-emerald-400' : 'text-zinc-500 hover:text-zinc-300'
          }`}
        >
          <Network className="w-3.5 h-3.5" />
          <span>Graph</span>
          {currentTab === 'graph' && (
            <motion.div
              layoutId="active-pill"
              className="absolute inset-0 bg-emerald-950/40 border border-emerald-500/20 rounded-full -z-10"
              transition={{ type: 'spring', stiffness: 380, damping: 30 }}
            />
          )}
        </button>

        {/* Note View Tab */}
        <button
          onClick={() => setTab('note')}
          className={`relative z-10 flex items-center gap-1 sm:gap-2 px-2.5 sm:px-4 py-1.5 sm:py-2 text-[11px] sm:text-xs font-semibold rounded-full transition-colors duration-200 select-none ${
            currentTab === 'note' ? 'text-emerald-400' : 'text-zinc-500 hover:text-zinc-300'
          }`}
        >
          <BookOpen className="w-3.5 h-3.5" />
          <span>Note View</span>
          {currentTab === 'note' && (
            <motion.div
              layoutId="active-pill"
              className="absolute inset-0 bg-emerald-950/40 border border-emerald-500/20 rounded-full -z-10"
              transition={{ type: 'spring', stiffness: 380, damping: 30 }}
            />
          )}
        </button>

        {/* Quiz Tab */}
        <button
          onClick={() => setTab('quiz')}
          className={`relative z-10 flex items-center gap-1 sm:gap-2 px-2.5 sm:px-4 py-1.5 sm:py-2 text-[11px] sm:text-xs font-semibold rounded-full transition-colors duration-200 select-none ${
            currentTab === 'quiz' ? 'text-emerald-400' : 'text-zinc-500 hover:text-zinc-300'
          }`}
        >
          <GraduationCap className="w-3.5 h-3.5" />
          <span>Quiz</span>
          {currentTab === 'quiz' && (
            <motion.div
              layoutId="active-pill"
              className="absolute inset-0 bg-emerald-950/40 border border-emerald-500/20 rounded-full -z-10"
              transition={{ type: 'spring', stiffness: 380, damping: 30 }}
            />
          )}
        </button>
      </div>
    </div>
  );
}
export default PillNavigation;
