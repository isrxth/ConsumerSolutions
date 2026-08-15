'use client';

import React, { useState, useEffect } from 'react';
import { useAppStore } from '../app/store';
import { HelpCircle, ChevronRight, ChevronLeft, X, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const STEPS = [
  {
    title: "1. Note Explorer",
    description: "Browse note files grouped by subdirectories or search notes by keywords. This sidebar helps you explore the filesystem.",
    targetId: "sidebar-explorer",
    position: "left-[300px] top-[180px]",
    arrowClass: "left-[-8px] top-1/2 -translate-y-1/2 border-y-8 border-y-transparent border-r-8 border-r-zinc-900"
  },
  {
    title: "2. Interactive Knowledge Graph",
    description: "Nodes represent files and links show connections. Drag nodes to interact, hover to highlight connections, and click a node to open it.",
    targetId: "", // Full canvas, no spotlight
    position: "left-1/2 top-1/3 -translate-x-1/2",
    arrowClass: "hidden"
  },
  {
    title: "3. View Toggle (Pill Switch)",
    description: "Use this floating switch at the bottom to toggle between the interactive Graph view and the focused Note View reader.",
    targetId: "pill-view-toggle",
    position: "left-1/2 bottom-24 -translate-x-1/2",
    arrowClass: "left-1/2 bottom-[-8px] -translate-x-1/2 border-x-8 border-x-transparent border-t-8 border-t-zinc-900"
  },
  {
    title: "4. History Stack Navigation",
    description: "When reading notes, use the browser-style back/forward arrow buttons (← / →) in the note header to navigate through notes you've visited.",
    targetId: "history-navigation-controls",
    position: "left-1/2 top-1/4 -translate-x-1/2",
    arrowClass: "hidden"
  },
  {
    title: "5. Suggest Edit / Feedback",
    description: "Notice an error or want to suggest updates? Click the emerald 'Suggest Edit' button in the note header to submit feedback.",
    targetId: "suggest-edit-btn",
    position: "right-6 top-20",
    arrowClass: "right-16 top-[-8px] border-x-8 border-x-transparent border-b-8 border-b-zinc-900"
  }
];

export function TutorialTour() {
  const { nodesList, activeNote, setActiveNote, setTab } = useAppStore();
  const [step, setStep] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [highlightStyle, setHighlightStyle] = useState<React.CSSProperties | null>(null);

  useEffect(() => {
    const checkTourStatus = () => {
      const disclaimerAccepted = localStorage.getItem('disclaimerAccepted') === 'true';
      const tourCompleted = localStorage.getItem('tourCompleted') === 'true';

      // Open tour only if disclaimer is accepted and tour is not yet completed
      if (disclaimerAccepted && !tourCompleted) {
        setIsOpen(true);
      } else {
        setIsOpen(false);
      }
    };

    checkTourStatus();

    // Check frequently in case disclaimer is accepted dynamically
    const interval = setInterval(checkTourStatus, 500);
    return () => clearInterval(interval);
  }, []);

  // Automate tab switching and note loading for steps 4 & 5
  useEffect(() => {
    if (isOpen) {
      if (step === 3 || step === 4) {
        // Switch tab to 'note' to make the note reader visible
        setTab('note');

        // If no note is open, automatically open the first note so the elements exist in the DOM
        if (!activeNote && nodesList.length > 0) {
          setActiveNote(nodesList[0].path);
        }
      } else {
        // Switch tab back to 'graph' for the graph canvas steps
        setTab('graph');
      }
    }
  }, [step, isOpen, nodesList, activeNote, setActiveNote, setTab]);

  // Compute spotlight style based on step element
  useEffect(() => {
    if (!isOpen) {
      setHighlightStyle(null);
      return;
    }

    const targetId = STEPS[step].targetId;
    if (!targetId) {
      setHighlightStyle(null);
      return;
    }

    // Give DOM a small layout paint delay
    const timer = setTimeout(() => {
      const el = document.getElementById(targetId);
      if (el) {
        const updatePosition = () => {
          const rect = el.getBoundingClientRect();
          setHighlightStyle({
            position: 'fixed',
            top: rect.top - 4,
            left: rect.left - 4,
            width: rect.width + 8,
            height: rect.height + 8,
            borderRadius: targetId === 'suggest-edit-btn' || targetId === 'history-navigation-controls' ? '8px' : '16px',
          });
        };
        updatePosition();
        window.addEventListener('resize', updatePosition);
        window.addEventListener('scroll', updatePosition);
        return () => {
          window.removeEventListener('resize', updatePosition);
          window.removeEventListener('scroll', updatePosition);
        };
      } else {
        setHighlightStyle(null);
      }
    }, 150);

    return () => clearTimeout(timer);
  }, [step, isOpen, activeNote]);

  const handleNext = () => {
    if (step < STEPS.length - 1) {
      setStep(step + 1);
    } else {
      localStorage.setItem('tourCompleted', 'true');
      setIsOpen(false);
    }
  };

  const handlePrev = () => {
    if (step > 0) {
      setStep(step - 1);
    }
  };

  const handleSkip = () => {
    localStorage.setItem('tourCompleted', 'true');
    setIsOpen(false);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-40 pointer-events-none">
          {/* Dark transparent background to emphasize spotlight items */}
          <div className="absolute inset-0 bg-black/50 pointer-events-auto" />

          {/* Spotlight Aura Element */}
          {highlightStyle && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={highlightStyle}
              className="fixed border-2 border-emerald-500/80 shadow-[0_0_15px_rgba(16,185,129,0.4)] bg-emerald-500/5 animate-pulse z-40 pointer-events-none"
            />
          )}

          {/* Tour Card */}
          <motion.div
            key={step}
            initial={{ scale: 0.95, opacity: 0, y: 10 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 350 }}
            className={`absolute ${STEPS[step].position} pointer-events-auto w-80 bg-zinc-900 border border-zinc-800/80 rounded-xl shadow-2xl p-4 z-50`}
          >
            {/* Arrow helper pointing to item */}
            <div className={`absolute w-0 h-0 ${STEPS[step].arrowClass}`} />

            {/* Header */}
            <div className="flex items-center justify-between pb-2 mb-2 border-b border-zinc-800/60">
              <div className="flex items-center gap-2 text-emerald-400">
                <HelpCircle className="w-4 h-4" />
                <span className="text-xs font-bold text-zinc-200">{STEPS[step].title}</span>
              </div>
              <button
                onClick={handleSkip}
                className="text-zinc-500 hover:text-zinc-300 transition-colors pointer-events-auto"
                title="Skip Tour"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Content */}
            <p className="text-xs text-zinc-400 leading-relaxed mb-4">
              {STEPS[step].description}
            </p>

            {/* Footer Action buttons */}
            <div className="flex items-center justify-between">
              {/* Pagination indicators */}
              <div className="flex gap-1.5">
                {STEPS.map((_, i) => (
                  <div
                    key={i}
                    className={`w-1.5 h-1.5 rounded-full transition-colors ${i === step ? 'bg-emerald-500' : 'bg-zinc-800'
                      }`}
                  />
                ))}
              </div>

              {/* Navigation buttons */}
              <div className="flex gap-1.5">
                {step > 0 && (
                  <button
                    onClick={handlePrev}
                    className="flex items-center justify-center p-1.5 bg-zinc-800 text-zinc-300 rounded-lg hover:bg-zinc-700 transition-colors pointer-events-auto cursor-pointer"
                  >
                    <ChevronLeft className="w-3.5 h-3.5" />
                  </button>
                )}
                <button
                  onClick={handleNext}
                  className="flex items-center gap-1 py-1.5 px-3 bg-emerald-500 hover:bg-emerald-400 text-zinc-950 text-[11px] font-bold rounded-lg transition-colors pointer-events-auto cursor-pointer"
                >
                  <span>{step === STEPS.length - 1 ? 'Finish' : 'Next'}</span>
                  {step === STEPS.length - 1 ? <Check className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
export default TutorialTour;
