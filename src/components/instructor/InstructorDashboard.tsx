import React, { useState } from 'react';
import {
  StudentProfile,
  CourseModule,
  SimulationScenario,
} from '../../types';
import { soundFx } from '../../services/audio';
import {
  ShieldCheck,
  Users,
  BookOpen,
  DollarSign,
  Plus,
  CheckCircle2,
  Award,
  Sparkles,
  BarChart,
  Edit,
} from 'lucide-react';

interface InstructorDashboardProps {
  profile: StudentProfile;
  onUpdateProfile: (profile: StudentProfile) => void;
}

export const InstructorDashboard: React.FC<InstructorDashboardProps> = ({
  profile,
  onUpdateProfile,
}) => {
  const [activeTab, setActiveTab] = useState<'roster' | 'courses' | 'budget' | 'rubric'>('roster');

  // Budget assigner state
  const [assignedBudget, setAssignedBudget] = useState(profile.budgetCredits);
  const [budgetSuccess, setBudgetSuccess] = useState(false);

  // New course form
  const [newCourseTitle, setNewCourseTitle] = useState('');
  const [newCourseBuilding, setNewCourseBuilding] = useState('innovation-lab');
  const [newCourseMinutes, setNewCourseMinutes] = useState(45);
  const [newCourseReward, setNewCourseReward] = useState(400);

  // Cohort sample roster
  const sampleStudents = [
    {
      id: profile.id,
      name: `${profile.name} (You)`,
      level: profile.careerLevel,
      xp: profile.xp,
      budget: profile.budgetCredits,
      progress: `${profile.completedModuleIds.length} modules completed`,
      status: 'Active',
    },
    {
      id: 'st-02',
      name: 'Sophia Patel',
      level: 'Associate Product Manager',
      xp: 1420,
      budget: 85000,
      progress: '3 modules completed',
      status: 'Active',
    },
    {
      id: 'st-03',
      name: 'Liam Vance',
      level: 'Product Manager',
      xp: 2850,
      budget: 62000,
      progress: '5 modules completed',
      status: 'Active',
    },
    {
      id: 'st-04',
      name: 'Carlos Mendez',
      level: 'Product Intern',
      xp: 380,
      budget: 100000,
      progress: '1 module completed',
      status: 'Needs Review',
    },
  ];

  const handleApplyBudget = () => {
    soundFx.playSuccessChime();
    onUpdateProfile({
      ...profile,
      budgetCredits: assignedBudget,
    });
    setBudgetSuccess(true);
    setTimeout(() => setBudgetSuccess(false), 3000);
  };

  const handleCreateCourse = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCourseTitle.trim()) return;
    soundFx.playSuccessChime();
    alert(`Course "${newCourseTitle}" created and published to Product Management Academy!`);
    setNewCourseTitle('');
  };

  return (
    <div className="w-full max-w-7xl mx-auto p-4 sm:p-6 pb-24 space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-mono font-bold">
              Instructor Portal
            </span>
            <span className="text-xs text-slate-400 font-mono">
              Cohort Management & Assessment Studio
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-display font-extrabold text-white mt-1">
            Faculty Command Centre
          </h1>
          <p className="text-sm text-slate-400">
            Publish course modules, adjust simulation constraints, evaluate user story rubrics, and track student cohort velocity.
          </p>
        </div>
      </div>

      {/* Instructor Metric Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800">
          <span className="text-[10px] text-slate-400 font-mono uppercase">Enrolled Students</span>
          <p className="text-xl font-bold font-mono text-cyan-300 mt-1">142 Learners</p>
          <span className="text-[10px] text-emerald-400 font-mono">94% Active Weekly</span>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800">
          <span className="text-[10px] text-slate-400 font-mono uppercase">Avg Cohort XP</span>
          <p className="text-xl font-bold font-mono text-purple-300 mt-1">2,480 XP</p>
          <span className="text-[10px] text-slate-400 font-mono">Rank: APM Tier</span>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800">
          <span className="text-[10px] text-slate-400 font-mono uppercase">Simulations Cleared</span>
          <p className="text-xl font-bold font-mono text-emerald-400 mt-1">88.5% Pass Rate</p>
          <span className="text-[10px] text-emerald-400 font-mono">+12% vs last term</span>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800">
          <span className="text-[10px] text-slate-400 font-mono uppercase">Assigned Dev Budget</span>
          <p className="text-xl font-bold font-mono text-amber-400 mt-1">
            ${profile.budgetCredits.toLocaleString()}
          </p>
          <span className="text-[10px] text-slate-400 font-mono">Configurable below</span>
        </div>
      </div>

      {/* Tab Switcher */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
        {[
          { id: 'roster', label: 'Cohort Gradebook & Roster', icon: <Users className="w-4 h-4" /> },
          { id: 'budget', label: 'Budget & Constraint Control', icon: <DollarSign className="w-4 h-4" /> },
          { id: 'courses', label: 'Curriculum & Case Creator', icon: <BookOpen className="w-4 h-4" /> },
          { id: 'rubric', label: 'Assignment Rubric Evaluation', icon: <CheckCircle2 className="w-4 h-4" /> },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => {
              soundFx.playCyberClick();
              setActiveTab(tab.id as 'roster' | 'courses' | 'budget' | 'rubric');
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === tab.id
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/50 shadow-[0_0_12px_rgba(16,185,129,0.2)]'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            {tab.icon}
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* TAB 1: COHORT ROSTER */}
      {activeTab === 'roster' && (
        <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4 animate-fade-in">
          <div className="flex items-center justify-between">
            <h3 className="font-display font-bold text-sm text-slate-100">
              Active Student Cohort Roster (Fall 2026)
            </h3>
            <span className="text-xs font-mono text-slate-400">4 Students Selected</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-900/90 text-slate-400 uppercase font-mono text-[10px]">
                <tr>
                  <th className="p-3">Student Name</th>
                  <th className="p-3">Career Level</th>
                  <th className="p-3">XP Points</th>
                  <th className="p-3">Remaining Budget</th>
                  <th className="p-3">LMS Progress</th>
                  <th className="p-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 bg-slate-950/40">
                {sampleStudents.map((st) => (
                  <tr key={st.id} className="hover:bg-slate-900/40">
                    <td className="p-3 font-semibold text-slate-100">{st.name}</td>
                    <td className="p-3 text-cyan-300 font-medium">{st.level}</td>
                    <td className="p-3 font-mono font-bold text-purple-300">{st.xp} XP</td>
                    <td className="p-3 font-mono text-emerald-400">${st.budget.toLocaleString()}</td>
                    <td className="p-3 text-slate-300">{st.progress}</td>
                    <td className="p-3">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                          st.status === 'Active'
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                            : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                        }`}
                      >
                        {st.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: BUDGET & CONSTRAINT CONTROL */}
      {activeTab === 'budget' && (
        <div className="glass-panel p-6 rounded-2xl border border-emerald-500/30 space-y-6 animate-fade-in">
          <div>
            <h3 className="font-display font-bold text-sm text-slate-100">
              Adjust Student Virtual Product Development Budget
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Set real budget ceilings for student teams. When students design features or run simulations, their balance is deducted accordingly.
            </p>
          </div>

          <div className="max-w-md space-y-4">
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                Virtual Development Budget ($ Credits)
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  step="5000"
                  value={assignedBudget}
                  onChange={(e) => setAssignedBudget(Number(e.target.value))}
                  className="flex-1 bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-sm font-mono text-emerald-400 focus:outline-none focus:border-emerald-400"
                />
                <button
                  onClick={handleApplyBudget}
                  className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs tracking-wider shadow-[0_0_15px_rgba(16,185,129,0.3)] transition-all"
                >
                  Apply to Active Student
                </button>
              </div>
            </div>

            {budgetSuccess && (
              <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/50 text-xs text-emerald-300 flex items-center gap-2 animate-fade-in">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Virtual development budget updated to ${assignedBudget.toLocaleString()}!</span>
              </div>
            )}

            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2 text-xs text-slate-300">
              <span className="font-bold text-cyan-400">Educational Objective:</span>
              <p>
                Constrained budgets force students to practice ruthless RICE prioritization rather than attempting to build every feature simultaneously.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: CURRICULUM & CASE CREATOR */}
      {activeTab === 'courses' && (
        <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-6 animate-fade-in">
          <div>
            <h3 className="font-display font-bold text-sm text-slate-100">
              Author & Publish New Course Module
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Add interactive modules that immediately integrate into the 3D City buildings and LMS Academy.
            </p>
          </div>

          <form onSubmit={handleCreateCourse} className="space-y-4 max-w-2xl">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-slate-300 block mb-1">Module Title</label>
                <input
                  type="text"
                  placeholder="e.g. AI-Native Product Strategy & LLM Evaluation"
                  value={newCourseTitle}
                  onChange={(e) => setNewCourseTitle(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-xs text-white"
                  required
                />
              </div>

              <div>
                <label className="text-xs text-slate-300 block mb-1">Host 3D Building</label>
                <select
                  value={newCourseBuilding}
                  onChange={(e) => setNewCourseBuilding(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-xs text-white"
                >
                  <option value="innovation-lab">Innovation Lab</option>
                  <option value="strategy-tower">Product Strategy Tower</option>
                  <option value="development-hub">Development Hub</option>
                  <option value="analytics-centre">Analytics Centre</option>
                  <option value="launch-arena">Launch Arena</option>
                </select>
              </div>

              <div>
                <label className="text-xs text-slate-300 block mb-1">Estimated Runtime (Minutes)</label>
                <input
                  type="number"
                  value={newCourseMinutes}
                  onChange={(e) => setNewCourseMinutes(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-xs text-white"
                />
              </div>

              <div>
                <label className="text-xs text-slate-300 block mb-1">Completion XP Reward</label>
                <input
                  type="number"
                  value={newCourseReward}
                  onChange={(e) => setNewCourseReward(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-xs text-white"
                />
              </div>
            </div>

            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-400 to-indigo-600 hover:from-cyan-300 text-slate-950 font-bold text-xs shadow-neon-cyan transition-all"
            >
              Publish Module to Academy
            </button>
          </form>
        </div>
      )}

      {/* TAB 4: ASSIGNMENT RUBRIC EVALUATION */}
      {activeTab === 'rubric' && (
        <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4 animate-fade-in">
          <div>
            <h3 className="font-display font-bold text-sm text-slate-100">
              Pending Student Assignment Submissions
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Review student user stories, problem statements, and PRDs against structured grading rubrics.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-bold text-xs text-slate-100">
                  Alex Mercer · Problem Framing & 3 HMWs
                </h4>
                <p className="text-[11px] text-slate-400">Submitted 2 hours ago</p>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                100% Score Awarded
              </span>
            </div>

            <p className="text-xs text-slate-300 italic bg-slate-950 p-3 rounded-lg leading-relaxed">
              "Problem Statement: Remote software engineers spend 42 minutes every morning waiting for synchronous standups across timezones... HMW: How might we enable async updates in under 60s without losing connection?"
            </p>

            <div className="flex items-center justify-between pt-2 border-t border-slate-800 text-xs">
              <span className="text-slate-400 font-mono">Rubric Match: 3/3 Criteria Passed</span>
              <button
                onClick={() => {
                  soundFx.playSuccessChime();
                  alert('Grade confirmed! +150 XP confirmed to student transcript.');
                }}
                className="px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-300 font-semibold"
              >
                Endorse Grade
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
