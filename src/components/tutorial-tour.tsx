'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useAppStore } from '../app/store';
import { HelpCircle, ChevronRight, ChevronLeft, X, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const CARD_WIDTH = 320; // px — fixed card width on desktop
const CARD_HEIGHT_ESTIMATE = 200; // px — rough card height for boundary check
const GAP = 16; // px gap between spotlight and card

const STEPS = [
  {
    title: "1. Note Explorer",
    description: "Browse note files grouped by subdirectories or search notes by keywords. This sidebar helps you explore the filesystem.",
    targetId: "sidebar-explorer",
    // preferred placement relative to element
    placement: "right" as const,
  },
  {
    title: "2. Interactive Knowledge Graph",
    description: "Nodes represent files and links show connections. Drag nodes to interact, hover to highlight connections, and click a node to open it.",
    targetId: "",
    placement: "center" as const,
  },
  {
    title: "3. View Toggle (Pill Switch)",
    description: "Use this floating switch at the bottom to toggle between the interactive Graph view and the focused Note View reader.",
    targetId: "pill-view-toggle",
    placement: "above" as const,
  },
  {
    title: "4. History Stack Navigation",
    description: "When reading notes, use the browser-style back/forward arrows (← / →) in the note header to navigate through notes you've visited.",
    targetId: "history-navigation-controls",
    placement: "below" as const,
  },
  {
    title: "5. Suggest Edit / Feedback",
    description: "Notice an error or want to suggest updates? Click the emerald 'Suggest Edit' button in the note header to submit feedback.",
    targetId: "suggest-edit-btn",
    placement: "below-left" as const,
  },
];

type Placement = 'right' | 'center' | 'above' | 'below' | 'below-left';

/** Compute the card's top/left in fixed viewport coordinates given a target rect and preferred placement. */
function computeCardStyle(
  rect: DOMRect | null,
  placement: Placement,
  vw: number,
  vh: number
): React.CSSProperties {
  const w = CARD_WIDTH;

  if (!rect || placement === 'center') {
    // Center in viewport, avoiding the sidebar (assume 288px wide)
    const left = Math.max(288 + GAP, (vw - w) / 2);
    return { left, top: Math.round(vh * 0.25), width: w };
  }

  let top: number;
  let left: number;

  if (placement === 'right') {
    top = rect.top + (rect.height / 2) - (CARD_HEIGHT_ESTIMATE / 2);
    left = rect.right + GAP;
  } else if (placement === 'above') {
    top = rect.top - CARD_HEIGHT_ESTIMATE - GAP;
    left = rect.left + rect.width / 2 - w / 2;
  } else if (placement === 'below') {
    top = rect.bottom + GAP;
    left = rect.left + rect.width / 2 - w / 2;
  } else if (placement === 'below-left') {
    top = rect.bottom + GAP;
    left = rect.right - w;
  } else {
    top = rect.bottom + GAP;
    left = rect.left;
  }

  // Clamp so card stays within viewport with a margin
  const margin = 8;
  left = Math.max(margin, Math.min(left, vw - w - margin));
  top = Math.max(margin, Math.min(top, vh - CARD_HEIGHT_ESTIMATE - margin));

  return { left: Math.round(left), top: Math.round(top), width: w };
}

export function TutorialTour() {
  const { nodesList, activeNote, setActiveNote, setTab } = useAppStore();
  const [step, setStep] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [highlightStyle, setHighlightStyle] = useState<React.CSSProperties | null>(null);
  const [cardStyle, setCardStyle] = useState<React.CSSProperties>({});

  // Track mobile breakpoint
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 640);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  // Open/close tour based on localStorage flags
  useEffect(() => {
    const checkTourStatus = () => {
      const disclaimerAccepted = localStorage.getItem('disclaimerAccepted') === 'true';
      const tourCompleted = localStorage.getItem('tourCompleted') === 'true';
      setIsOpen(disclaimerAccepted && !tourCompleted);
    };
    checkTourStatus();
    const interval = setInterval(checkTourStatus, 500);
    return () => clearInterval(interval);
  }, []);

  // Automate tab switching and note loading for steps 4 & 5
  useEffect(() => {
    if (!isOpen) return;
    if (step === 3 || step === 4) {
      setTab('note');
      if (!activeNote && nodesList.length > 0) {
        setActiveNote(nodesList[0].path);
      }
    } else {
      setTab('graph');
    }
  }, [step, isOpen, nodesList, activeNote, setActiveNote, setTab]);

  // Compute spotlight + card positions from the target element
  const updatePositions = useCallback(() => {
    if (!isOpen) {
      setHighlightStyle(null);
      setCardStyle({});
      return;
    }

    const { targetId, placement } = STEPS[step];
    const vw = window.innerWidth;
    const vh = window.innerHeight;

    if (!targetId) {
      setHighlightStyle(null);
      setCardStyle(computeCardStyle(null, placement, vw, vh));
      return;
    }

    const el = document.getElementById(targetId);
    if (!el) {
      setHighlightStyle(null);
      setCardStyle(computeCardStyle(null, placement, vw, vh));
      return;
    }

    const rect = el.getBoundingClientRect();

    setHighlightStyle({
      position: 'fixed',
      top: rect.top - 4,
      left: rect.left - 4,
      width: rect.width + 8,
      height: rect.height + 8,
      borderRadius:
        targetId === 'suggest-edit-btn' || targetId === 'history-navigation-controls'
          ? '8px'
          : '16px',
    });

    if (!isMobile) {
      setCardStyle(computeCardStyle(rect, placement, vw, vh));
    }
  }, [isOpen, step, isMobile]);

  // Run position calculation after DOM paint
  useEffect(() => {
    const timer = setTimeout(updatePositions, 150);
    window.addEventListener('resize', updatePositions);
    window.addEventListener('scroll', updatePositions);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', updatePositions);
      window.removeEventListener('scroll', updatePositions);
    };
  }, [updatePositions]);

  const handleNext = () => {
    if (step < STEPS.length - 1) {
      setStep(step + 1);
    } else {
      localStorage.setItem('tourCompleted', 'true');
      setIsOpen(false);
    }
  };

  const handlePrev = () => { if (step > 0) setStep(step - 1); };

  const handleSkip = () => {
    localStorage.setItem('tourCompleted', 'true');
    setIsOpen(false);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[60] pointer-events-none">
          {/* Dark overlay */}
          <div className="absolute inset-0 bg-black/50 pointer-events-auto" />

          {/* Spotlight aura */}
          {highlightStyle && (
            <motion.div
              key={`spotlight-${step}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={highlightStyle}
              className="fixed border-2 border-emerald-500/80 shadow-[0_0_15px_rgba(16,185,129,0.4)] bg-emerald-500/5 animate-pulse z-[61] pointer-events-none"
            />
          )}

          {/* Tour Card */}
          <motion.div
            key={`card-${step}`}
            initial={{ opacity: 0, y: isMobile ? 40 : 8, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: isMobile ? 40 : 8, scale: 0.97 }}
            transition={{ type: 'spring', damping: 26, stiffness: 360 }}
            style={isMobile ? {} : { position: 'fixed', ...cardStyle }}
            className={
              isMobile
                ? // Mobile: bottom sheet
                  'fixed bottom-0 left-0 right-0 pointer-events-auto bg-zinc-900 border-t border-zinc-800/80 rounded-t-2xl shadow-2xl p-5 z-[62]'
                : // Desktop: inline-style positioned card
                  'pointer-events-auto bg-zinc-900 border border-zinc-800/80 rounded-xl shadow-2xl p-4 z-[62]'
            }
          >
            {/* Header */}
            <div className="flex items-center justify-between pb-2 mb-2 border-b border-zinc-800/60">
              <div className="flex items-center gap-2 text-emerald-400">
                <HelpCircle className="w-4 h-4" />
                <span className="text-xs font-bold text-zinc-200">{STEPS[step].title}</span>
              </div>
              <button
                onClick={handleSkip}
                className="text-zinc-500 hover:text-zinc-300 transition-colors pointer-events-auto cursor-pointer"
                title="Skip Tour"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Content */}
            <p className="text-xs text-zinc-400 leading-relaxed mb-4">
              {STEPS[step].description}
            </p>

            {/* Footer */}
            <div className="flex items-center justify-between">
              {/* Dots */}
              <div className="flex gap-1.5">
                {STEPS.map((_, i) => (
                  <div
                    key={i}
                    className={`w-1.5 h-1.5 rounded-full transition-colors ${
                      i === step ? 'bg-emerald-500' : 'bg-zinc-800'
                    }`}
                  />
                ))}
              </div>

              {/* Buttons */}
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
