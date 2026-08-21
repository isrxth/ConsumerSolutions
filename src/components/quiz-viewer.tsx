'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { QUIZ_QUESTIONS, QuizQuestion } from '../data/quizData';
import { 
  GraduationCap, 
  CheckCircle2, 
  XCircle, 
  RotateCcw, 
  ChevronLeft, 
  ChevronRight, 
  HelpCircle, 
  Award, 
  Sparkles,
  BookOpen,
  Filter,
  Zap,
  Clock,
  Eye,
  ArrowLeft,
  Check,
  X,
  AlertCircle,
  CornerDownRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

type QuizMode = 'practice' | 'exam';
type ReviewFilter = 'all' | 'incorrect' | 'correct';

export function QuizViewer() {
  const [selectedUnit, setSelectedUnit] = useState<number | 'all'>('all');
  const [mode, setMode] = useState<QuizMode>('practice');
  const [currentIndex, setCurrentIndex] = useState(0);
  
  // Store user answers: questionId -> 'A' | 'B' | 'C' | 'D'
  const [userAnswers, setUserAnswers] = useState<Record<number, 'A' | 'B' | 'C' | 'D'>>({});
  // Track revealed questions in practice mode
  const [revealedQuestions, setRevealedQuestions] = useState<Record<number, boolean>>({});
  
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isReviewing, setIsReviewing] = useState(false);
  const [reviewFilter, setReviewFilter] = useState<ReviewFilter>('all');
  const [warningToast, setWarningToast] = useState<string | null>(null);
  const [highScore, setHighScore] = useState<number>(0);

  // Load high score from localStorage
  useEffect(() => {
    const savedHighScore = localStorage.getItem('consumer_solution_quiz_highscore');
    if (savedHighScore) {
      setHighScore(parseInt(savedHighScore, 10));
    }
  }, []);

  // Filter questions based on selected unit
  const filteredQuestions = useMemo(() => {
    if (selectedUnit === 'all') return QUIZ_QUESTIONS;
    return QUIZ_QUESTIONS.filter((q) => q.unit === selectedUnit);
  }, [selectedUnit]);

  // Reset index when filter changes
  useEffect(() => {
    setCurrentIndex(0);
  }, [selectedUnit]);

  const currentQuestion: QuizQuestion | undefined = filteredQuestions[currentIndex];

  // Calculate unanswered questions in current active set
  const unansweredQuestions = useMemo(() => {
    return filteredQuestions.filter((q) => userAnswers[q.id] === undefined);
  }, [filteredQuestions, userAnswers]);

  // Jump / cycle directly to the next unanswered question
  const goToNextUnanswered = () => {
    if (unansweredQuestions.length === 0) return;
    const nextUnanswered = unansweredQuestions.find((q) => {
      const qIdx = filteredQuestions.findIndex((fq) => fq.id === q.id);
      return qIdx > currentIndex;
    }) || unansweredQuestions[0];

    if (nextUnanswered) {
      const newIdx = filteredQuestions.findIndex((fq) => fq.id === nextUnanswered.id);
      if (newIdx !== -1) {
        setCurrentIndex(newIdx);
      }
    }
  };

  const handleSelectOption = (optionKey: 'A' | 'B' | 'C' | 'D') => {
    if (isSubmitted) return;
    if (!currentQuestion) return;

    setUserAnswers((prev) => ({
      ...prev,
      [currentQuestion.id]: optionKey
    }));

    if (mode === 'practice') {
      setRevealedQuestions((prev) => ({
        ...prev,
        [currentQuestion.id]: true
      }));
    }
  };

  const handleResetQuiz = () => {
    setUserAnswers({});
    setRevealedQuestions({});
    setCurrentIndex(0);
    setIsSubmitted(false);
    setIsReviewing(false);
    setWarningToast(null);
  };

  const handleSubmitExam = () => {
    // GUARD: Cannot submit until ALL questions in the active set are answered!
    if (unansweredQuestions.length > 0) {
      setWarningToast(`Cannot submit! Please answer all ${unansweredQuestions.length} remaining question${unansweredQuestions.length > 1 ? 's' : ''}.`);
      setTimeout(() => setWarningToast(null), 4500);
      goToNextUnanswered();
      return;
    }

    setIsSubmitted(true);
    
    // Calculate total score for all questions answered
    let correctCount = 0;
    filteredQuestions.forEach((q) => {
      if (userAnswers[q.id] === q.correctAnswer) {
        correctCount++;
      }
    });

    if (correctCount > highScore) {
      setHighScore(correctCount);
      localStorage.setItem('consumer_solution_quiz_highscore', correctCount.toString());
    }
  };

  // Calculate scores
  const score = useMemo(() => {
    let count = 0;
    filteredQuestions.forEach((q) => {
      if (userAnswers[q.id] === q.correctAnswer) count++;
    });
    return count;
  }, [filteredQuestions, userAnswers]);

  const unitBreakdown = useMemo(() => {
    const units = [1, 2, 3, 4];
    return units.map((u) => {
      const uQuestions = QUIZ_QUESTIONS.filter((q) => q.unit === u);
      const uCorrect = uQuestions.filter((q) => userAnswers[q.id] === q.correctAnswer).length;
      return {
        unit: u,
        title: `Unit ${u}`,
        correct: uCorrect,
        total: uQuestions.length,
        percentage: Math.round((uCorrect / uQuestions.length) * 100)
      };
    });
  }, [userAnswers]);

  // Questions for Review Mode
  const reviewQuestions = useMemo(() => {
    return filteredQuestions.filter((q) => {
      const userAnswer = userAnswers[q.id];
      const isCorrect = userAnswer === q.correctAnswer;
      if (reviewFilter === 'correct') return isCorrect;
      if (reviewFilter === 'incorrect') return !isCorrect && userAnswer !== undefined;
      return true;
    });
  }, [filteredQuestions, userAnswers, reviewFilter]);

  const answeredCount = Object.keys(userAnswers).length;

  return (
    <div className="h-full flex flex-col bg-[#1e1e1e] overflow-y-auto px-4 sm:px-8 py-6 text-zinc-100 relative">
      {/* Toast Warning for Unanswered Questions */}
      <AnimatePresence>
        {warningToast && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="fixed top-6 right-6 z-50 flex items-center gap-3 bg-amber-950/90 border border-amber-500/50 text-amber-200 px-4 py-3 rounded-xl shadow-2xl backdrop-blur-md text-xs font-semibold"
          >
            <AlertCircle className="w-5 h-5 text-amber-400 shrink-0" />
            <span>{warningToast}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Quiz Top Header Bar */}
      <div className="max-w-4xl w-full mx-auto mb-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-zinc-800/80">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-lg sm:text-xl font-bold text-zinc-100 tracking-tight flex items-center gap-2">
                Knowledge Mastery Quiz
              </h1>
              <p className="text-xs text-zinc-400">
                30 MCQs across Units 1–4 • Behavioral Science & Solution Architecture
              </p>
            </div>
          </div>

          {/* Mode & Reset Controls */}
          <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
            {/* Review Button if answers exist */}
            {(isSubmitted || answeredCount > 0) && (
              <button
                onClick={() => setIsReviewing(!isReviewing)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-semibold transition-colors cursor-pointer ${
                  isReviewing
                    ? 'bg-emerald-500 text-zinc-950 border-emerald-400 font-bold'
                    : 'bg-zinc-900 border-zinc-800 text-zinc-300 hover:text-zinc-100 hover:bg-zinc-800'
                }`}
              >
                <Eye className="w-3.5 h-3.5" />
                <span>{isReviewing ? 'Exit Review' : 'Review Mode'}</span>
              </button>
            )}

            {/* Mode Switcher */}
            <div className="flex items-center p-1 bg-zinc-900 border border-zinc-800 rounded-lg text-xs">
              <button
                onClick={() => { setMode('practice'); handleResetQuiz(); }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-semibold transition-colors ${
                  mode === 'practice' && !isReviewing
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                <Zap className="w-3.5 h-3.5" />
                <span>Practice</span>
              </button>
              <button
                onClick={() => { setMode('exam'); handleResetQuiz(); }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-semibold transition-colors ${
                  mode === 'exam' && !isReviewing
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                <Clock className="w-3.5 h-3.5" />
                <span>Exam</span>
              </button>
            </div>

            {/* Reset Button */}
            <button
              onClick={handleResetQuiz}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 text-xs font-semibold transition-colors cursor-pointer"
              title="Reset Quiz"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          </div>
        </div>

        {/* Unit Filter Tabs */}
        {!isReviewing && (
          <div className="flex items-center justify-between pt-4 gap-2">
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
              <span className="text-xs font-bold text-zinc-500 uppercase tracking-wider flex items-center gap-1 mr-1 shrink-0">
                <Filter className="w-3 h-3" /> Filter:
              </span>
              <button
                onClick={() => setSelectedUnit('all')}
                className={`px-3 py-1 rounded-full text-xs font-semibold transition-all shrink-0 cursor-pointer ${
                  selectedUnit === 'all'
                    ? 'bg-emerald-500 text-zinc-950 font-bold shadow-md shadow-emerald-500/20'
                    : 'bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-zinc-200'
                }`}
              >
                All 30 Questions
              </button>
              {[1, 2, 3, 4].map((u) => (
                <button
                  key={u}
                  onClick={() => setSelectedUnit(u)}
                  className={`px-3 py-1 rounded-full text-xs font-semibold transition-all shrink-0 cursor-pointer ${
                    selectedUnit === u
                      ? 'bg-emerald-500 text-zinc-950 font-bold shadow-md shadow-emerald-500/20'
                      : 'bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  Unit {u}
                </button>
              ))}
            </div>

            {/* Unanswered Status Badge */}
            {!isSubmitted && (
              <div className="hidden sm:flex items-center gap-1.5 text-xs font-medium shrink-0">
                {unansweredQuestions.length > 0 ? (
                  <span className="px-2.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 font-semibold">
                    {unansweredQuestions.length} Remaining
                  </span>
                ) : (
                  <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-semibold flex items-center gap-1">
                    <Check className="w-3 h-3" /> All Answered
                  </span>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Main Quiz Content */}
      <div className="max-w-4xl w-full mx-auto flex-1 flex flex-col">
        {isReviewing ? (
          /* --- REVIEW MODE SCREEN --- */
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* Review Header Controls */}
            <div className="bg-zinc-900 border border-zinc-800/80 rounded-2xl p-5 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setIsReviewing(false)}
                  className="p-2 rounded-xl bg-zinc-950 border border-zinc-800 text-zinc-400 hover:text-zinc-200 transition-colors cursor-pointer"
                  title="Back to Quiz / Results"
                >
                  <ArrowLeft className="w-4 h-4" />
                </button>
                <div>
                  <h2 className="text-base font-bold text-zinc-100 flex items-center gap-2">
                    <Eye className="w-4 h-4 text-emerald-400" /> Review Answers & Explanations
                  </h2>
                  <p className="text-xs text-zinc-400">
                    Showing {reviewQuestions.length} of {filteredQuestions.length} questions
                  </p>
                </div>
              </div>

              {/* Review Filters */}
              <div className="flex items-center gap-1.5 bg-zinc-950 p-1 rounded-xl border border-zinc-800 text-xs">
                <button
                  onClick={() => setReviewFilter('all')}
                  className={`px-3 py-1 rounded-lg font-semibold transition-colors cursor-pointer ${
                    reviewFilter === 'all'
                      ? 'bg-zinc-800 text-zinc-100 font-bold'
                      : 'text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  All ({filteredQuestions.length})
                </button>
                <button
                  onClick={() => setReviewFilter('incorrect')}
                  className={`px-3 py-1 rounded-lg font-semibold transition-colors cursor-pointer ${
                    reviewFilter === 'incorrect'
                      ? 'bg-rose-950/60 border border-rose-500/30 text-rose-300 font-bold'
                      : 'text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  Incorrect ({filteredQuestions.length - score})
                </button>
                <button
                  onClick={() => setReviewFilter('correct')}
                  className={`px-3 py-1 rounded-lg font-semibold transition-colors cursor-pointer ${
                    reviewFilter === 'correct'
                      ? 'bg-emerald-950/60 border border-emerald-500/30 text-emerald-300 font-bold'
                      : 'text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  Correct ({score})
                </button>
              </div>
            </div>

            {/* Questions Review List */}
            <div className="space-y-4">
              {reviewQuestions.length === 0 ? (
                <div className="p-8 text-center bg-zinc-900 border border-zinc-800/80 rounded-2xl text-zinc-500 text-xs">
                  No questions match the current review filter.
                </div>
              ) : (
                reviewQuestions.map((q) => {
                  const userAnswer = userAnswers[q.id];
                  const isUserCorrect = userAnswer === q.correctAnswer;

                  return (
                    <div
                      key={q.id}
                      className="bg-zinc-900 border border-zinc-800/80 rounded-2xl p-5 sm:p-6 shadow-xl space-y-4"
                    >
                      {/* Header */}
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span className="px-2.5 py-0.5 rounded-md bg-zinc-950 border border-zinc-800 text-[11px] font-bold text-zinc-400">
                            Q{q.id} • {q.unitTitle}
                          </span>
                        </div>
                        {userAnswer ? (
                          isUserCorrect ? (
                            <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/20">
                              <Check className="w-3.5 h-3.5" /> Correct
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-xs font-bold text-rose-400 bg-rose-500/10 px-2.5 py-1 rounded-lg border border-rose-500/20">
                              <X className="w-3.5 h-3.5" /> Incorrect
                            </span>
                          )
                        ) : (
                          <span className="text-xs text-zinc-500 italic">Unanswered</span>
                        )}
                      </div>

                      {/* Question Text */}
                      <h3 className="text-sm sm:text-base font-bold text-zinc-100 leading-relaxed">
                        {q.question}
                      </h3>

                      {/* Options List */}
                      <div className="space-y-2">
                        {q.options.map((opt) => {
                          const isOptionCorrect = opt.key === q.correctAnswer;
                          const isOptionUserSelected = userAnswer === opt.key;

                          let optionStyle = "bg-zinc-950/60 border-zinc-800/60 text-zinc-400";

                          if (isOptionCorrect) {
                            optionStyle = "bg-emerald-950/50 border-emerald-500 text-emerald-200 font-semibold";
                          } else if (isOptionUserSelected && !isOptionCorrect) {
                            optionStyle = "bg-rose-950/50 border-rose-500 text-rose-200 font-semibold";
                          }

                          return (
                            <div
                              key={opt.key}
                              className={`p-3 rounded-xl border flex items-start gap-3 text-xs leading-relaxed ${optionStyle}`}
                            >
                              <span className={`w-5 h-5 rounded border flex items-center justify-center shrink-0 font-bold text-[11px] ${
                                isOptionCorrect
                                  ? 'bg-emerald-500 text-zinc-950 border-emerald-400'
                                  : isOptionUserSelected && !isOptionCorrect
                                  ? 'bg-rose-500 text-white border-rose-400'
                                  : 'bg-zinc-900 border-zinc-800 text-zinc-500'
                              }`}>
                                {opt.key}
                              </span>
                              <span className="flex-1 pt-0.5">{opt.text}</span>
                              {isOptionCorrect && <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />}
                              {isOptionUserSelected && !isOptionCorrect && <XCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />}
                            </div>
                          );
                        })}
                      </div>

                      {/* Explanation */}
                      <div className="p-3.5 rounded-xl bg-zinc-950 border border-emerald-500/20 text-xs leading-relaxed space-y-1.5">
                        <div className="flex items-center gap-1.5 text-emerald-400 font-bold">
                          <Sparkles className="w-3.5 h-3.5" />
                          <span>Study Explanation</span>
                        </div>
                        <p className="text-zinc-300 leading-relaxed">{q.explanation}</p>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </motion.div>
        ) : isSubmitted ? (
          /* --- EXAM RESULT SUMMARY SCREEN --- */
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-zinc-900 border border-zinc-800/80 rounded-2xl p-6 sm:p-8 shadow-2xl space-y-6"
          >
            <div className="text-center space-y-3 pb-6 border-b border-zinc-800/60">
              <div className="inline-flex p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                <Award className="w-10 h-10" />
              </div>
              <h2 className="text-2xl font-bold text-zinc-100">Quiz Completed!</h2>
              <p className="text-sm text-zinc-400">Here is your performance breakdown across units.</p>
              
              <div className="pt-3 flex items-center justify-center gap-4">
                <div className="px-5 py-3 rounded-xl bg-zinc-950 border border-zinc-800 text-center">
                  <span className="text-3xl font-extrabold text-emerald-400">{score}</span>
                  <span className="text-sm text-zinc-500 font-bold"> / {filteredQuestions.length}</span>
                  <span className="block text-[10px] uppercase tracking-wider text-zinc-400 font-semibold mt-0.5">Score</span>
                </div>
                <div className="px-5 py-3 rounded-xl bg-zinc-950 border border-zinc-800 text-center">
                  <span className="text-3xl font-extrabold text-zinc-100">
                    {Math.round((score / filteredQuestions.length) * 100)}%
                  </span>
                  <span className="block text-[10px] uppercase tracking-wider text-zinc-400 font-semibold mt-0.5">Accuracy</span>
                </div>
              </div>
            </div>

            {/* Performance per Unit Breakdown */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400">Unit Performance Breakdown</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {unitBreakdown.map((ub) => (
                  <div key={ub.unit} className="p-3.5 rounded-xl bg-zinc-950 border border-zinc-800/80 flex items-center justify-between">
                    <div>
                      <span className="text-xs font-bold text-zinc-200 block">{ub.title}</span>
                      <span className="text-[11px] text-zinc-500">{ub.correct} of {ub.total} correct</span>
                    </div>
                    <div className="text-right">
                      <span className={`text-sm font-bold ${
                        ub.percentage >= 80 ? 'text-emerald-400' : ub.percentage >= 50 ? 'text-amber-400' : 'text-rose-400'
                      }`}>
                        {ub.percentage}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="pt-4 flex flex-col sm:flex-row gap-3 justify-end border-t border-zinc-800/60">
              <button
                onClick={() => setIsReviewing(true)}
                className="px-5 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-100 font-bold text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer border border-zinc-700"
              >
                <Eye className="w-4 h-4 text-emerald-400" />
                <span>Review Answers</span>
              </button>
              <button
                onClick={handleResetQuiz}
                className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-emerald-500/10"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Retake Quiz</span>
              </button>
            </div>
          </motion.div>
        ) : (
          /* --- QUESTION CARD SCREEN --- */
          <div className="bg-zinc-900 border border-zinc-800/80 rounded-2xl p-5 sm:p-7 shadow-2xl flex-1 flex flex-col justify-between">
            {/* Top Info Bar */}
            <div>
              <div className="flex items-center justify-between gap-2 mb-3">
                <span className="px-2.5 py-1 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[11px] font-bold">
                  {currentQuestion?.unitTitle}
                </span>
                <div className="flex items-center gap-2 text-xs font-semibold text-zinc-400">
                  {unansweredQuestions.length > 0 && (
                    <button
                      onClick={goToNextUnanswered}
                      className="px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/20 text-amber-400 text-[11px] font-bold hover:bg-amber-500/20 transition-colors flex items-center gap-1 cursor-pointer"
                      title="Jump to Next Unanswered Question"
                    >
                      <CornerDownRight className="w-3 h-3" />
                      <span>Next Unanswered ({unansweredQuestions.length})</span>
                    </button>
                  )}
                  <span>
                    Question <span className="text-zinc-100 font-bold">{currentIndex + 1}</span> of {filteredQuestions.length}
                  </span>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-zinc-950 rounded-full h-1.5 mb-6 overflow-hidden border border-zinc-800/40">
                <motion.div
                  className="bg-emerald-500 h-full rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${((currentIndex + 1) / filteredQuestions.length) * 100}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>

              {/* Question Text */}
              {currentQuestion && (
                <h2 className="text-base sm:text-lg font-bold text-zinc-100 leading-relaxed mb-6">
                  {currentQuestion.question}
                </h2>
              )}

              {/* Options Stack */}
              <div className="space-y-3 mb-6">
                {currentQuestion?.options.map((opt) => {
                  const isSelected = userAnswers[currentQuestion.id] === opt.key;
                  const isCorrect = opt.key === currentQuestion.correctAnswer;
                  const isRevealed = mode === 'practice' && revealedQuestions[currentQuestion.id];

                  let btnStyle = "bg-zinc-950/80 border-zinc-800/80 text-zinc-300 hover:border-zinc-700 hover:bg-zinc-850";

                  if (isRevealed) {
                    if (isCorrect) {
                      btnStyle = "bg-emerald-950/50 border-emerald-500 text-emerald-200 font-semibold shadow-md shadow-emerald-500/10";
                    } else if (isSelected && !isCorrect) {
                      btnStyle = "bg-rose-950/50 border-rose-500 text-rose-200 font-semibold";
                    }
                  } else if (isSelected) {
                    btnStyle = "bg-emerald-950/40 border-emerald-500 text-emerald-300 font-semibold";
                  }

                  return (
                    <button
                      key={opt.key}
                      onClick={() => handleSelectOption(opt.key)}
                      className={`w-full text-left p-3.5 sm:p-4 rounded-xl border transition-all duration-200 flex items-start gap-3 cursor-pointer text-xs sm:text-sm ${btnStyle}`}
                    >
                      <span className={`w-6 h-6 rounded-lg border flex items-center justify-center shrink-0 font-bold text-xs ${
                        isRevealed && isCorrect
                          ? 'bg-emerald-500 text-zinc-950 border-emerald-400'
                          : isRevealed && isSelected && !isCorrect
                          ? 'bg-rose-500 text-white border-rose-400'
                          : isSelected
                          ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
                          : 'bg-zinc-900 border-zinc-800 text-zinc-400'
                      }`}>
                        {opt.key}
                      </span>
                      <span className="flex-1 pt-0.5 leading-relaxed">{opt.text}</span>
                      {isRevealed && isCorrect && <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />}
                      {isRevealed && isSelected && !isCorrect && <XCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />}
                    </button>
                  );
                })}
              </div>

              {/* Practice Explanation Box */}
              <AnimatePresence>
                {mode === 'practice' && currentQuestion && revealedQuestions[currentQuestion.id] && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="p-4 rounded-xl bg-zinc-950 border border-emerald-500/20 text-xs leading-relaxed space-y-2 mb-6"
                  >
                    <div className="flex items-center gap-1.5 text-emerald-400 font-bold">
                      <Sparkles className="w-4 h-4" />
                      <span>Study Note Explanation</span>
                    </div>
                    <p className="text-zinc-300 leading-relaxed">{currentQuestion.explanation}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Bottom Card Navigation Bar */}
            <div className="flex items-center justify-between pt-4 border-t border-zinc-800/60">
              <button
                onClick={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
                disabled={currentIndex === 0}
                className={`flex items-center gap-1 px-3.5 py-2 rounded-xl text-xs font-semibold transition-colors ${
                  currentIndex === 0
                    ? 'text-zinc-700 cursor-not-allowed'
                    : 'text-zinc-300 hover:text-zinc-100 bg-zinc-800/60 hover:bg-zinc-800 cursor-pointer'
                }`}
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Previous</span>
              </button>

              {/* Next / Submit / Cycle Button */}
              {currentIndex === filteredQuestions.length - 1 ? (
                unansweredQuestions.length > 0 ? (
                  <button
                    onClick={goToNextUnanswered}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-500/20 border border-amber-500/30 hover:bg-amber-500/30 text-amber-300 font-bold text-xs transition-colors cursor-pointer"
                  >
                    <CornerDownRight className="w-4 h-4" />
                    <span>Cycle Unanswered ({unansweredQuestions.length})</span>
                  </button>
                ) : (
                  <button
                    onClick={handleSubmitExam}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold text-xs transition-colors cursor-pointer shadow-lg shadow-emerald-500/10"
                  >
                    <Award className="w-4 h-4" />
                    <span>Submit Exam</span>
                  </button>
                )
              ) : (
                <button
                  onClick={() => setCurrentIndex((prev) => Math.min(filteredQuestions.length - 1, prev + 1))}
                  className="flex items-center gap-1 px-4 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 hover:bg-emerald-500/20 text-emerald-400 font-bold text-xs transition-colors cursor-pointer"
                >
                  <span>Next</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default QuizViewer;
