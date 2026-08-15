'use client';

import React from 'react';
import { useAppStore } from '../app/store';
import { Network, BookOpen } from 'lucide-react';
import { motion } from 'framer-motion';

export function PillNavigation() {
  const { currentTab, setTab, activeNote } = useAppStore();

  return (
    <div className="absolute bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 z-30">
      <div id="pill-view-toggle" className="relative flex items-center p-1 bg-zinc-900/60 border border-zinc-800/80 backdrop-blur-md rounded-full shadow-lg gap-1">
        {/* Graph Tab */}
        <button
          onClick={() => setTab('graph')}
          className={`relative z-10 flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 text-xs font-semibold rounded-full transition-colors duration-200 select-none ${
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
          onClick={() => {
            // Note: switching to note view works best if there is an active note,
            // but let's allow switching to show the note viewer anyway (will show select note placeholder)
            setTab('note');
          }}
          className={`relative z-10 flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 text-xs font-semibold rounded-full transition-colors duration-200 select-none ${
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
      </div>
    </div>
  );
}
export default PillNavigation;
