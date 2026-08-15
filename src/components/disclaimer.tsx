'use client';

import React, { useState, useEffect } from 'react';
import { ShieldAlert } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export function Disclaimer() {
  const [isOpen, setIsOpen] = useState(false);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    // Check if user has already accepted the disclaimer
    const accepted = localStorage.getItem('disclaimerAccepted');
    if (!accepted) {
      setIsOpen(true);
    }
  }, []);

  const handleProceed = () => {
    if (checked) {
      localStorage.setItem('disclaimerAccepted', 'true');
      setIsOpen(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop with Blur */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/75 backdrop-blur-md"
          />

          {/* Modal Content */}
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 350 }}
            className="relative bg-zinc-900 border border-zinc-800/80 rounded-2xl shadow-2xl p-6 max-w-md w-full z-10 overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center gap-3 border-b border-zinc-800/60 pb-4 mb-4">
              <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                <ShieldAlert className="w-6 h-6" />
              </div>
              <div>
                <h2 className="font-bold text-zinc-100 text-base">Usage Notice & Disclaimer</h2>
                <p className="text-[10px] text-zinc-500">Consumer Solution Guide</p>
              </div>
            </div>

            {/* Body */}
            <div className="space-y-3 text-sm text-zinc-300 mb-6 leading-relaxed">
              <p>
                The materials presented here are compiled study notes and are <span className="font-semibold text-emerald-400">not exam-ready</span> solutions.
              </p>
              <p>
                You should strictly use these documents as a supplementary resource, reference guide, or to assist yourself in constructing your own study notes.
              </p>
            </div>

            {/* Acceptance */}
            <div className="space-y-4">
              <label className="flex items-start gap-3 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={(e) => setChecked(e.target.checked)}
                  className="mt-1 w-4 h-4 rounded border-zinc-800 bg-zinc-950 text-emerald-500 focus:ring-emerald-500/20 focus:ring-offset-0 focus:ring-2 focus:outline-none transition-colors accent-emerald-500"
                />
                <span className="text-xs text-zinc-400 leading-normal">
                  I understand that these are reference materials only and agree to proceed.
                </span>
              </label>

              <button
                disabled={!checked}
                onClick={handleProceed}
                className={`w-full py-2.5 px-4 rounded-xl text-xs font-semibold tracking-wide transition-all duration-200 ${
                  checked
                    ? 'bg-emerald-500 text-zinc-950 hover:bg-emerald-400 hover:scale-[1.01] cursor-pointer shadow-lg shadow-emerald-500/10'
                    : 'bg-zinc-800 text-zinc-500 cursor-not-allowed border border-zinc-800/40'
                }`}
              >
                I Understand, Proceed
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
export default Disclaimer;
