'use client';

import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useAppStore } from '../app/store';
import { FileText, ArrowLeft, X, BookOpen, Clock, Tag, ChevronLeft, ChevronRight, MessageSquare, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface MarkdownViewerProps {
  onClose?: () => void;
  showBackBtn?: boolean;
}

export function MarkdownViewer({ onClose, showBackBtn = false }: MarkdownViewerProps) {
  const { 
    activeNote, 
    nodesList, 
    setActiveNote,
    canGoBack,
    canGoForward,
    goBack,
    goForward
  } = useAppStore();

  const [isFeedbackOpen, setIsFeedbackOpen] = React.useState(false);
  const [feedbackType, setFeedbackType] = React.useState('Fact Check / Typo');
  const [feedbackMsg, setFeedbackMsg] = React.useState('');
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [toastMessage, setToastMessage] = React.useState<string | null>(null);

  const handleFeedbackSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedbackMsg.trim()) return;

    setIsSubmitting(true);
    try {
      const response = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          notePath: activeNote?.path,
          feedbackType,
          message: feedbackMsg,
        }),
      });

      if (response.ok) {
        setFeedbackMsg('');
        setIsFeedbackOpen(false);
        setToastMessage('Thank you! Feedback submitted.');
        setTimeout(() => setToastMessage(null), 4000);
      } else {
        const data = await response.json();
        alert(`Failed to send feedback: ${data.error || 'Unknown error'}`);
      }
    } catch (err: any) {
      console.error(err);
      alert(`Error sending feedback: ${err.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Preprocess wikilinks to standard markdown links using a custom schema: #wiki-
  const processedContent = React.useMemo(() => {
    if (!activeNote || !activeNote.content) return '';
    return activeNote.content.replace(/\[\[(.*?)\]\]/g, (match, p1) => {
      const parts = p1.split('|');
      const target = parts[0].trim();
      const label = parts[1] ? parts[1].trim() : target;
      return `[${label}](#wiki-${encodeURIComponent(target)})`;
    });
  }, [activeNote?.content]);

  // Estimate read time
  const readTime = React.useMemo(() => {
    if (!activeNote || !activeNote.content) return 1;
    const words = activeNote.content.trim().split(/\s+/).length;
    return Math.max(1, Math.ceil(words / 200));
  }, [activeNote?.content]);

  if (!activeNote) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-zinc-500 p-8 space-y-4">
        <BookOpen className="w-12 h-12 text-zinc-700 animate-bounce" />
        <p className="text-sm font-medium">Select a note from the sidebar or click a graph node to read.</p>
      </div>
    );
  }

  // Handle wikilink navigation
  const handleWikiLinkClick = (targetId: string) => {
    const decodedTarget = decodeURIComponent(targetId).toLowerCase();
    
    // Find matching note in the registered notes list
    const foundNote = nodesList.find(
      (node) => 
        node.id.toLowerCase() === decodedTarget || 
        node.title.toLowerCase() === decodedTarget
    );

    if (foundNote) {
      setActiveNote(foundNote.path);
    } else {
      console.warn(`Wikilink target not found: ${decodedTarget}`);
    }
  };

  return (
    <>
    <article className="h-full flex flex-col bg-[#1e1e1e] overflow-hidden">
      {/* Note Header / Meta */}
      <div className="flex items-center justify-between px-3 sm:px-6 pr-14 sm:pr-6 py-3 sm:py-4 border-b border-zinc-800/60 bg-[#1e1e1e]/90 sticky top-0 backdrop-blur-md z-10">
        <div className="flex items-center gap-3">
          {/* History Back/Forward Controls */}
          <div id="history-navigation-controls" className="flex items-center bg-zinc-900/40 border border-zinc-800/60 rounded-lg p-0.5 mr-1 shrink-0">
            <button
              onClick={goBack}
              disabled={!canGoBack}
              className={`p-1.5 rounded-md transition-colors ${
                canGoBack
                  ? 'text-zinc-300 hover:bg-zinc-800/80 hover:text-zinc-100 cursor-pointer'
                  : 'text-zinc-700 cursor-not-allowed'
              }`}
              title="Go Back"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={goForward}
              disabled={!canGoForward}
              className={`p-1.5 rounded-md transition-colors ${
                canGoForward
                  ? 'text-zinc-300 hover:bg-zinc-800/80 hover:text-zinc-100 cursor-pointer'
                  : 'text-zinc-700 cursor-not-allowed'
              }`}
              title="Go Forward"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {showBackBtn && (
            <button
              onClick={() => setActiveNote(null)}
              className="p-1.5 rounded-lg hover:bg-zinc-900 text-zinc-400 hover:text-zinc-200 transition-colors mr-1"
              title="Close Note"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
          )}
          <FileText className="w-5 h-5 text-emerald-500" />
          <div>
            <h1 className="font-bold text-zinc-100 text-sm sm:text-base md:text-lg leading-tight truncate max-w-[120px] sm:max-w-[260px] md:max-w-md">
              {activeNote.title}
            </h1>
            <div className="flex items-center gap-2 text-[11px] text-zinc-500 mt-0.5">
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {readTime} min
              </span>
              <span className="hidden sm:flex items-center gap-1 bg-zinc-900/60 text-zinc-400 px-2 py-0.5 rounded-full border border-zinc-800/40">
                <Tag className="w-2.5 h-2.5 text-emerald-500" />
                {activeNote.group}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            id="suggest-edit-btn"
            onClick={() => setIsFeedbackOpen(true)}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all text-[11px] font-semibold cursor-pointer shadow-md shadow-emerald-500/5 select-none"
            title="Suggest Edit / Report Issue"
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Suggest Edit</span>
          </button>
          {onClose && (
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200 transition-colors cursor-pointer"
            >
              <X className="w-4.5 h-4.5" />
            </button>
          )}
        </div>
      </div>

      {/* Note Body */}
      <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-5 sm:py-8">
        <div className="prose prose-invert prose-dark max-w-none">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              // Wrap tables in a scrollable container for mobile
              table: ({ children }) => (
                <div className="overflow-x-auto my-4 rounded-lg border border-zinc-800/60">
                  <table className="min-w-full">{children}</table>
                </div>
              ),
              a: ({ href, children, ...props }) => {
                if (href?.startsWith('#wiki-')) {
                  const targetId = href.replace('#wiki-', '');
                  return (
                    <span
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleWikiLinkClick(targetId);
                      }}
                      className="wiki-link inline-block font-semibold"
                    >
                      {children}
                    </span>
                  );
                }
                return (
                  <a 
                    href={href} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-emerald-400 hover:underline hover:text-emerald-300 font-medium"
                    {...props}
                  >
                    {children}
                  </a>
                );
              }
            }}
          >
            {processedContent}
          </ReactMarkdown>
        </div>
      </div>
    </article>

    {/* Feedback Dialog Modal Overlay */}
    <AnimatePresence>
      {isFeedbackOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm pointer-events-auto">
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="bg-zinc-900 border border-zinc-800/80 rounded-2xl shadow-2xl p-6 max-w-sm w-full"
          >
            <h3 className="font-bold text-zinc-100 text-sm mb-1">Suggest Edit / Report Issue</h3>
            <p className="text-[10px] text-zinc-500 mb-4 truncate">Reporting for: {activeNote?.title}</p>
            
            <form onSubmit={handleFeedbackSubmit} className="space-y-4">
              <div>
                <label className="block text-[11px] font-bold text-zinc-400 uppercase tracking-wider mb-1">
                  Feedback Category
                </label>
                <select
                  value={feedbackType}
                  onChange={(e) => setFeedbackType(e.target.value)}
                  className="w-full text-xs bg-zinc-950 border border-zinc-800 rounded-lg p-2 text-zinc-200 outline-none focus:border-emerald-500/50 cursor-pointer"
                >
                  <option value="Fact Check / Typo">Fact Check / Typo</option>
                  <option value="Missing Content">Missing Content</option>
                  <option value="Formatting issue">Formatting Issue</option>
                  <option value="Other / Request">Other / General Feedback</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-zinc-400 uppercase tracking-wider mb-1">
                  Description
                </label>
                <textarea
                  required
                  placeholder="Tell us what is wrong or needs updating..."
                  value={feedbackMsg}
                  onChange={(e) => setFeedbackMsg(e.target.value)}
                  rows={4}
                  className="w-full text-xs bg-zinc-950 border border-zinc-800 rounded-lg p-2.5 text-zinc-200 placeholder-zinc-650 outline-none focus:border-emerald-500/50 resize-none"
                />
              </div>

              <div className="flex gap-2 justify-end pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsFeedbackOpen(false);
                    setFeedbackMsg('');
                  }}
                  className="px-3 py-1.5 rounded-lg text-[11px] font-semibold text-zinc-400 hover:text-zinc-200 bg-zinc-800 hover:bg-zinc-700 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || !feedbackMsg.trim()}
                  className={`px-3 py-1.5 rounded-lg text-[11px] font-bold text-zinc-950 transition-colors flex items-center gap-1.5 cursor-pointer ${
                    !feedbackMsg.trim() || isSubmitting
                      ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed border border-zinc-800/40'
                      : 'bg-emerald-500 hover:bg-emerald-400 shadow-lg shadow-emerald-500/10'
                  }`}
                >
                  {isSubmitting ? 'Sending...' : 'Submit Feedback'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>

    {/* Floating Success Toast */}
    <AnimatePresence>
      {toastMessage && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          className="fixed bottom-6 right-6 z-50 flex items-center gap-2 bg-zinc-900 border border-zinc-800/80 rounded-xl px-4 py-3 shadow-2xl pointer-events-auto"
        >
          <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
          <span className="text-xs text-zinc-200 font-medium">{toastMessage}</span>
        </motion.div>
      )}
    </AnimatePresence>
    </>
  );
}
export default MarkdownViewer;
