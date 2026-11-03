import React, { useState } from 'react';
import {
  CourseModule,
  StudentProfile,
  BuildingInfo,
} from '../../types';
import { COURSE_MODULES } from '../../data/modulesData';
import { BUILDINGS_DATA } from '../../data/buildings';
import { soundFx } from '../../services/audio';
import confetti from 'canvas-confetti';
import {
  GraduationCap,
  Play,
  FileText,
  HelpCircle,
  Edit3,
  Bookmark,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  Download,
  Share2,
  Layers,
  Award,
  Video,
} from 'lucide-react';

interface LmsHubProps {
  profile: StudentProfile;
  activeBuildingId?: string | null;
  onUpdateProfile: (profile: StudentProfile) => void;
  onJumpToSimulator?: () => void;
}

type TabType = 'lessons' | 'resources' | 'quiz' | 'assignment' | 'notes';

export const LmsHub: React.FC<LmsHubProps> = ({
  profile,
  activeBuildingId,
  onUpdateProfile,
  onJumpToSimulator,
}) => {
  // Find matching module or default to first
  const initialModule =
    COURSE_MODULES.find((m) => m.buildingId === activeBuildingId) || COURSE_MODULES[0];
  const [selectedModule, setSelectedModule] = useState<CourseModule>(initialModule);
  const [activeTab, setActiveTab] = useState<TabType>('lessons');

  // Quiz state
  const [selectedAnswers, setSelectedAnswers] = useState<{ [qId: string]: number }>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizScore, setQuizScore] = useState(0);

  // Assignment state
  const [assignmentSubmission, setAssignmentSubmission] = useState('');
  const [assignmentSubmitted, setAssignmentSubmitted] = useState(false);

  // Student Notes state
  const [currentNote, setCurrentNote] = useState(profile.notes[selectedModule.id] || '');

  const handleSelectModule = (mod: CourseModule) => {
    soundFx.playSelectBuilding();
    setSelectedModule(mod);
    setActiveTab('lessons');
    setSelectedAnswers({});
    setQuizSubmitted(false);
    setAssignmentSubmitted(false);
    setCurrentNote(profile.notes[mod.id] || '');
  };

  const handleSelectAnswer = (qId: string, optionIdx: number) => {
    soundFx.playCyberClick();
    setSelectedAnswers((prev) => ({ ...prev, [qId]: optionIdx }));
  };

  const handleSaveNotes = () => {
    soundFx.playSuccessChime();
    const updated = {
      ...profile,
      notes: {
        ...profile.notes,
        [selectedModule.id]: currentNote,
      },
    };
    onUpdateProfile(updated);
  };

  const handleSubmitQuiz = () => {
    soundFx.playLevelUp();
    let correctCount = 0;
    selectedModule.quiz.forEach((q) => {
      if (selectedAnswers[q.id] === q.correctOptionIndex) {
        correctCount += 1;
      }
    });

    setQuizScore(correctCount);
    setQuizSubmitted(true);

    if (correctCount === selectedModule.quiz.length) {
      confetti({
        particleCount: 60,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#00f7ff', '#10b981'],
      });
    }

    // Award XP and mark completed
    const earnedXp = correctCount * 50;
    const updatedProfile: StudentProfile = {
      ...profile,
      xp: profile.xp + earnedXp,
      completedModuleIds: Array.from(new Set([...profile.completedModuleIds, selectedModule.id])),
    };
    onUpdateProfile(updatedProfile);
  };

  const handleSubmitAssignment = () => {
    if (!assignmentSubmission.trim()) return;
    soundFx.playSuccessChime();
    setAssignmentSubmitted(true);
    const updated = {
      ...profile,
      xp: profile.xp + 150,
    };
    onUpdateProfile(updated);
    confetti({
      particleCount: 50,
      spread: 50,
      origin: { y: 0.6 },
      colors: ['#a855f7', '#00f7ff'],
    });
  };

  const associatedBuilding = BUILDINGS_DATA.find((b) => b.id === selectedModule.buildingId);

  return (
    <div className="w-full max-w-7xl mx-auto p-4 sm:p-6 pb-24">
      {/* Academy Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-400/30 text-xs font-mono font-bold">
              Product Management Academy
            </span>
            <span className="text-xs text-slate-400 font-mono">
              Theory Connected to Practical Execution
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-display font-extrabold text-white mt-1">
            Curriculum & Assessment Labs
          </h1>
          <p className="text-sm text-slate-400">
            Master the core PM disciplines before applying them in the live simulator.
          </p>
        </div>
      </div>

      {/* Module Selector Pill Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-6 scrollbar-none">
        {COURSE_MODULES.map((mod) => {
          const isSelected = selectedModule.id === mod.id;
          const isCompleted = profile.completedModuleIds.includes(mod.id);
          return (
            <button
              key={mod.id}
              onClick={() => handleSelectModule(mod)}
              className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all border ${
                isSelected
                  ? 'bg-gradient-to-r from-cyan-500/20 to-purple-500/20 border-cyan-400 text-cyan-300 shadow-neon-cyan'
                  : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
              }`}
            >
              {isCompleted ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              ) : (
                <GraduationCap className="w-4 h-4 text-slate-400 shrink-0" />
              )}
              <span>{mod.title}</span>
            </button>
          );
        })}
      </div>

      {/* Active Module Container */}
      <div className="glass-panel p-6 rounded-2xl border border-cyan-500/30 space-y-6">
        {/* Module Header Strip */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold text-cyan-400 uppercase">
                {associatedBuilding?.name || 'Innovation Lab'}
              </span>
              <span className="text-[10px] text-slate-400 font-mono">
                · {selectedModule.estimatedMinutes} mins · +{selectedModule.xpReward} XP
              </span>
            </div>
            <h2 className="text-xl font-display font-extrabold text-slate-100 mt-0.5">
              {selectedModule.title}
            </h2>
            <p className="text-xs text-slate-400 mt-1 max-w-2xl leading-relaxed">
              {selectedModule.description}
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={onJumpToSimulator}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-400 to-indigo-600 hover:from-cyan-300 hover:to-indigo-500 text-slate-950 font-bold text-xs tracking-wider shadow-neon-cyan flex items-center gap-1.5 transition-all"
            >
              <Layers className="w-4 h-4" />
              <span>Apply in Product Simulator</span>
            </button>
          </div>
        </div>

        {/* LMS Subtabs */}
        <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
          {[
            { id: 'lessons', label: 'Video Lecture & Transcript', icon: <Video className="w-4 h-4" /> },
            { id: 'resources', label: 'PDF Cheatsheets & Templates', icon: <FileText className="w-4 h-4" /> },
            { id: 'quiz', label: 'Knowledge Quiz', icon: <HelpCircle className="w-4 h-4" /> },
            { id: 'assignment', label: 'Practical Assignment', icon: <Edit3 className="w-4 h-4" /> },
            { id: 'notes', label: 'My Notes', icon: <Bookmark className="w-4 h-4" /> },
          ].map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  soundFx.playCyberClick();
                  setActiveTab(tab.id as TabType);
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/50 shadow-[0_0_12px_rgba(0,247,255,0.2)]'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* TAB 1: VIDEO LECTURE & TRANSCRIPT */}
        {activeTab === 'lessons' && (
          <div className="space-y-6 animate-fade-in">
            {/* Simulated Video Player Screen */}
            <div className="relative w-full aspect-video max-h-[380px] bg-slate-950 rounded-2xl overflow-hidden border border-slate-800 flex items-center justify-center group shadow-2xl">
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />

              <div className="z-10 text-center space-y-3">
                <div className="w-16 h-16 rounded-full bg-cyan-500/20 text-cyan-400 border border-cyan-400 flex items-center justify-center mx-auto group-hover:scale-110 shadow-neon-cyan transition-transform cursor-pointer">
                  <Play className="w-7 h-7 fill-cyan-400 ml-1" />
                </div>
                <div>
                  <h3 className="font-display font-bold text-sm text-white">
                    {selectedModule.resources[0]?.title || 'Product Leadership Masterclass'}
                  </h3>
                  <span className="text-[11px] font-mono text-cyan-300">
                    4K Ultra HD · Interactive Transcript Available Below
                  </span>
                </div>
              </div>

              {/* Video progress mock bar */}
              <div className="absolute bottom-3 left-4 right-4 flex items-center gap-3 text-[11px] font-mono text-slate-400">
                <span>04:15</span>
                <div className="flex-1 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                  <div className="w-1/3 h-full bg-cyan-400" />
                </div>
                <span>18:40</span>
              </div>
            </div>

            {/* Topics Checklist */}
            <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
              <h4 className="font-bold text-xs uppercase tracking-wider text-slate-300">
                Core Lesson Topics Covered:
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-200">
                {selectedModule.topics.map((top, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                    <span>{top}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Video Lecture Transcript & Summary */}
            <div className="p-5 rounded-xl bg-slate-900/60 border border-slate-800 space-y-3">
              <h4 className="font-bold text-xs uppercase tracking-wider text-purple-300">
                Detailed Lecture Notes & Full Transcript:
              </h4>
              <div className="text-xs text-slate-300 leading-relaxed whitespace-pre-wrap font-sans">
                {selectedModule.resources[0]?.content}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: PDF RESOURCES & TEMPLATES */}
        {activeTab === 'resources' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in">
            {selectedModule.resources.map((res) => (
              <div
                key={res.id}
                className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-wider bg-cyan-950/40 px-2 py-0.5 rounded border border-cyan-500/30">
                      {res.type.toUpperCase()}
                    </span>
                    <span className="text-[11px] text-slate-400 font-mono">
                      {res.durationOrPages}
                    </span>
                  </div>

                  <h3 className="font-display font-bold text-sm text-slate-100">
                    {res.title}
                  </h3>

                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300 mt-3 whitespace-pre-wrap leading-relaxed max-h-48 overflow-y-auto">
                    {res.content}
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
                  <div className="space-y-1">
                    <span className="text-[10px] text-slate-400 uppercase font-mono block">
                      Key Takeaway
                    </span>
                    <p className="text-[11px] text-slate-300 italic">
                      "{res.keyTakeaways[0]}"
                    </p>
                  </div>

                  <button
                    onClick={() => {
                      soundFx.playSuccessChime();
                      navigator.clipboard.writeText(res.content);
                      alert('Template copied to clipboard!');
                    }}
                    className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-400 transition-all shrink-0 ml-3"
                    title="Copy Template"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* TAB 3: KNOWLEDGE QUIZ */}
        {activeTab === 'quiz' && (
          <div className="space-y-6 animate-fade-in">
            <div className="flex items-center justify-between">
              <h3 className="font-display font-bold text-sm text-slate-200">
                Module Assessment Quiz ({selectedModule.quiz.length} Questions)
              </h3>
              {quizSubmitted && (
                <span className="font-mono text-xs font-bold px-3 py-1 rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  Score: {quizScore} / {selectedModule.quiz.length} Correct
                </span>
              )}
            </div>

            <div className="space-y-6">
              {selectedModule.quiz.map((q, qIndex) => {
                const userChoice = selectedAnswers[q.id];
                return (
                  <div
                    key={q.id}
                    className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-3"
                  >
                    <p className="text-xs sm:text-sm font-semibold text-slate-100">
                      {qIndex + 1}. {q.question}
                    </p>

                    <div className="space-y-2">
                      {q.options.map((opt, optIdx) => {
                        const isChosen = userChoice === optIdx;
                        const isCorrect = q.correctOptionIndex === optIdx;
                        let optionStyle = 'bg-slate-950/70 border-slate-800 text-slate-300 hover:border-slate-700';

                        if (quizSubmitted) {
                          if (isCorrect) {
                            optionStyle = 'bg-emerald-950/40 border-emerald-500 text-emerald-200';
                          } else if (isChosen && !isCorrect) {
                            optionStyle = 'bg-rose-950/40 border-rose-500 text-rose-200';
                          }
                        } else if (isChosen) {
                          optionStyle = 'bg-cyan-950/40 border-cyan-400 text-cyan-200';
                        }

                        return (
                          <div
                            key={optIdx}
                            onClick={() => !quizSubmitted && handleSelectAnswer(q.id, optIdx)}
                            className={`p-3 rounded-lg border text-xs cursor-pointer transition-all flex items-center justify-between ${optionStyle}`}
                          >
                            <span>{opt}</span>
                            {quizSubmitted && isCorrect && (
                              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                            )}
                          </div>
                        );
                      })}
                    </div>

                    {quizSubmitted && (
                      <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-300">
                        <span className="font-bold text-cyan-400">Explanation: </span>
                        {q.explanation}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {!quizSubmitted ? (
              <button
                disabled={Object.keys(selectedAnswers).length < selectedModule.quiz.length}
                onClick={handleSubmitQuiz}
                className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-400 to-indigo-600 hover:from-cyan-300 hover:to-indigo-500 disabled:opacity-40 text-slate-950 font-bold text-xs tracking-wider shadow-neon-cyan transition-all"
              >
                Submit Answers & Claim XP
              </button>
            ) : (
              <div className="p-4 rounded-xl bg-emerald-950/30 border border-emerald-500/40 text-xs text-emerald-300 flex items-center justify-between">
                <span>Assessment Completed! Earned +{quizScore * 50} XP.</span>
                <button
                  onClick={() => setQuizSubmitted(false)}
                  className="text-xs underline text-cyan-300"
                >
                  Retake Quiz
                </button>
              </div>
            )}
          </div>
        )}

        {/* TAB 4: PRACTICAL ASSIGNMENT */}
        {activeTab === 'assignment' && (
          <div className="space-y-6 animate-fade-in">
            <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-3">
              <h3 className="font-display font-bold text-sm text-cyan-300">
                {selectedModule.practicalAssignment.title}
              </h3>
              <p className="text-xs text-slate-200 leading-relaxed">
                {selectedModule.practicalAssignment.prompt}
              </p>

              <div className="pt-2 border-t border-slate-800 space-y-1">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  Grading Rubric Criteria:
                </span>
                <ul className="text-xs text-slate-300 space-y-1 list-disc list-inside">
                  {selectedModule.practicalAssignment.rubric.map((r, i) => (
                    <li key={i}>{r}</li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-300 block">
                Your Assignment Submission:
              </label>
              <textarea
                rows={5}
                placeholder="Draft your solution here. Ground your answers in real customer numbers, clear hypotheses, and clean syntax..."
                value={assignmentSubmission}
                onChange={(e) => setAssignmentSubmission(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-cyan-400"
              />
            </div>

            {!assignmentSubmitted ? (
              <button
                disabled={!assignmentSubmission.trim()}
                onClick={handleSubmitAssignment}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-400 hover:to-indigo-500 disabled:opacity-40 text-white font-bold text-xs tracking-wider shadow-neon-purple transition-all"
              >
                Submit Assignment (+150 XP)
              </button>
            ) : (
              <div className="space-y-4 animate-fade-in">
                <div className="p-4 rounded-xl bg-emerald-950/30 border border-emerald-500/40 text-xs text-emerald-300 flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                  <span>Assignment Submitted and Graded 100%! +150 XP awarded to profile.</span>
                </div>

                <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                  <span className="font-bold text-xs text-purple-300 uppercase tracking-wider">
                    Model Exemplar Solution:
                  </span>
                  <p className="text-xs text-slate-300 italic leading-relaxed">
                    {selectedModule.practicalAssignment.sampleAnswer}
                  </p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 5: STUDENT NOTES & BOOKMARKS */}
        {activeTab === 'notes' && (
          <div className="space-y-4 animate-fade-in">
            <div className="flex items-center justify-between">
              <h3 className="font-display font-bold text-sm text-slate-200">
                Personal Field Notes for {selectedModule.title}
              </h3>
              <button
                onClick={handleSaveNotes}
                className="px-3 py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs"
              >
                Save Notes
              </button>
            </div>

            <textarea
              rows={8}
              value={currentNote}
              onChange={(e) => setCurrentNote(e.target.value)}
              placeholder="Record your personal reflections, key formulas, or questions for mentors..."
              className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-cyan-400 font-mono"
            />
          </div>
        )}
      </div>
    </div>
  );
};
