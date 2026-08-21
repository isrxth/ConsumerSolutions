'use client';

import React, { useEffect } from 'react';
import { useAppStore } from './store';
import Sidebar from '../components/sidebar';
import KnowledgeGraph from '../components/knowledge-graph';
import MarkdownViewer from '../components/markdown-viewer';
import QuizViewer from '../components/quiz-viewer';
import PillNavigation from '../components/pill-navigation';
import Disclaimer from '../components/disclaimer';
import TutorialTour from '../components/tutorial-tour';
import { AnimatePresence, motion } from 'framer-motion';

export default function DigitalGardenPage() {
  const { 
    currentTab, 
    activeNote, 
    isOverlayOpen, 
    closeOverlay, 
    setGraphData 
  } = useAppStore();

  // Fetch and populate store on load
  useEffect(() => {
    const loadData = async () => {
      try {
        const res = await fetch('/graph.json');
        if (res.ok) {
          const data = await res.json();
          setGraphData(data);
        }
      } catch (e) {
        console.error("Failed to load graph nodes in page mount:", e);
      }
    };
    loadData();
  }, [setGraphData]);

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#181818] text-zinc-100 select-none">
      {/* Disclaimer Overlay Popup */}
      <Disclaimer />

      {/* Tutorial Interactive Tour */}
      <TutorialTour />

      {/* Left Sidebar */}
      <Sidebar />

      {/* Main Canvas Viewport */}

      <main className="flex-1 relative h-full flex flex-col overflow-hidden bg-[#181818]">
        {currentTab === 'graph' ? (
          // Tab 1: Interactive 2D Graph
          <div className="w-full h-full relative">
            <KnowledgeGraph />
            
            {/* Sliding note viewer overlay */}
            <AnimatePresence>
              {activeNote && isOverlayOpen && (
                <motion.div
                  initial={{ x: '100%' }}
                  animate={{ x: 0 }}
                  exit={{ x: '100%' }}
                  transition={{ type: 'spring', damping: 25, stiffness: 220 }}
                  className="absolute top-0 right-0 h-full w-full sm:w-[480px] md:w-[600px] border-l border-zinc-800/60 bg-[#1e1e1e] shadow-2xl z-20"
                >
                  <MarkdownViewer onClose={closeOverlay} />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ) : currentTab === 'note' ? (
          // Tab 2: Focused Note Viewer
          <div className="w-full h-full relative bg-[#1e1e1e]">
            <MarkdownViewer />
          </div>
        ) : (
          // Tab 3: Knowledge Mastery Quiz
          <div className="w-full h-full relative bg-[#1e1e1e]">
            <QuizViewer />
          </div>
        )}

        {/* Pill Navigation Centered Floating Toggle */}
        <PillNavigation />
      </main>
    </div>
  );
}

