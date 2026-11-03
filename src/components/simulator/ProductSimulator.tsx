import React, { useState } from 'react';
import {
  UserProduct,
  StudentProfile,
  ProductFeature,
  UserStory,
  UserPersona,
  PrototypeScreen,
} from '../../types';
import { soundFx } from '../../services/audio';
import confetti from 'canvas-confetti';
import {
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Layers,
  Users,
  Compass,
  SlidersHorizontal,
  FileCode,
  Kanban,
  Smartphone,
  Eye,
  Rocket,
  BarChart3,
  Plus,
  Trash2,
  DollarSign,
  TrendingUp,
  MessageSquare,
  ArrowRight,
  ArrowLeft,
  Bot,
  Zap,
} from 'lucide-react';

interface ProductSimulatorProps {
  product: UserProduct;
  profile: StudentProfile;
  onUpdateProduct: (product: UserProduct) => void;
  onUpdateProfile: (profile: StudentProfile) => void;
  onOpenNovaWithPrompt?: (prompt: string) => void;
}

const STEPS = [
  { id: 1, title: 'Problem Discovery', icon: <Compass className="w-4 h-4" /> },
  { id: 2, title: 'User Personas', icon: <Users className="w-4 h-4" /> },
  { id: 3, title: 'Value Proposition', icon: <Sparkles className="w-4 h-4" /> },
  { id: 4, title: 'RICE Prioritization', icon: <SlidersHorizontal className="w-4 h-4" /> },
  { id: 5, title: 'User Stories & Gherkin', icon: <FileCode className="w-4 h-4" /> },
  { id: 6, title: 'Sprint Planning', icon: <Kanban className="w-4 h-4" /> },
  { id: 7, title: 'Interactive Prototype', icon: <Smartphone className="w-4 h-4" /> },
  { id: 8, title: 'Usability Testing', icon: <Eye className="w-4 h-4" /> },
  { id: 9, title: 'Market Launch (GTM)', icon: <Rocket className="w-4 h-4" /> },
  { id: 10, title: 'Analytics & Feedback', icon: <BarChart3 className="w-4 h-4" /> },
];

export const ProductSimulator: React.FC<ProductSimulatorProps> = ({
  product,
  profile,
  onUpdateProduct,
  onUpdateProfile,
  onOpenNovaWithPrompt,
}) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // New Feature Form State
  const [newFeatureTitle, setNewFeatureTitle] = useState('');
  const [newFeatureCategory, setNewFeatureCategory] = useState<'Core' | 'Growth' | 'Delight' | 'Infrastructure'>('Core');
  const [newFeatureReach, setNewFeatureReach] = useState(5000);
  const [newFeatureImpact, setNewFeatureImpact] = useState(2);
  const [newFeatureConfidence, setNewFeatureConfidence] = useState(0.8);
  const [newFeatureEffort, setNewFeatureEffort] = useState(3);
  const [newFeatureMoscow, setNewFeatureMoscow] = useState<'Must Have' | 'Should Have' | 'Could Have' | "Won't Have">('Must Have');
  const [newFeatureCost, setNewFeatureCost] = useState(10000);

  // New Story Form State
  const [newStoryRole, setNewStoryRole] = useState('Remote Team Lead');
  const [newStoryGoal, setNewStoryGoal] = useState('filter team updates by blocker urgency');
  const [newStoryBenefit, setNewStoryBenefit] = useState('I can clear engineering blockers first');
  const [newStoryPoints, setNewStoryPoints] = useState(5);
  const [newStoryCriteria, setNewStoryCriteria] = useState('Given I open the feed, When I select "Critical Blockers Only", Then only red-tagged updates appear.');

  const triggerConfetti = () => {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#00f7ff', '#a855f7', '#ec4899', '#ffffff'],
    });
  };

  const notifySuccess = (msg: string) => {
    setSuccessMessage(msg);
    setTimeout(() => setSuccessMessage(null), 3500);
  };

  // Helper to award XP
  const awardXp = (amount: number, reason: string) => {
    const updated = {
      ...profile,
      xp: profile.xp + amount,
    };
    onUpdateProfile(updated);
    soundFx.playSuccessChime();
    notifySuccess(`+${amount} XP: ${reason}!`);
  };

  // Step 1: Save Problem & Audience
  const handleSaveProblem = (e: React.FormEvent) => {
    e.preventDefault();
    soundFx.playCyberClick();
    awardXp(100, 'Validated Problem Hypothesis');
    setCurrentStep(2);
  };

  // Step 4: Add New Feature
  const handleAddFeature = () => {
    if (!newFeatureTitle.trim()) return;
    const riceScore = Math.round((newFeatureReach * newFeatureImpact * newFeatureConfidence) / Math.max(1, newFeatureEffort));
    const newFeature: ProductFeature = {
      id: `feat-${Date.now()}`,
      title: newFeatureTitle,
      description: `Feature designed for target segment with RICE score ${riceScore}.`,
      category: newFeatureCategory,
      reach: newFeatureReach,
      impact: newFeatureImpact,
      confidence: newFeatureConfidence,
      effort: newFeatureEffort,
      riceScore,
      moscow: newFeatureMoscow,
      cost: newFeatureCost,
      status: 'Backlog',
    };

    const updated = {
      ...product,
      features: [...product.features, newFeature],
    };
    onUpdateProduct(updated);
    setNewFeatureTitle('');
    soundFx.playSuccessChime();
    notifySuccess(`Added Feature with RICE score ${riceScore}!`);
  };

  // Step 4: Delete Feature
  const handleDeleteFeature = (id: string) => {
    const updated = {
      ...product,
      features: product.features.filter((f) => f.id !== id),
    };
    onUpdateProduct(updated);
    soundFx.playCyberClick();
  };

  // Step 5: Add User Story
  const handleAddUserStory = () => {
    if (!newStoryRole || !newStoryGoal) return;
    const newStory: UserStory = {
      id: `us-${Date.now()}`,
      role: newStoryRole,
      goal: newStoryGoal,
      benefit: newStoryBenefit,
      acceptanceCriteria: [newStoryCriteria],
      storyPoints: newStoryPoints,
      priority: 'High',
      status: 'To Do',
    };

    const updated = {
      ...product,
      userStories: [...product.userStories, newStory],
    };
    onUpdateProduct(updated);
    soundFx.playSuccessChime();
    awardXp(80, 'Created Gherkin User Story');
  };

  // Step 6: Move User Story status in Sprint
  const handleUpdateStoryStatus = (id: string, newStatus: 'To Do' | 'In Progress' | 'Review' | 'Done') => {
    const updated = {
      ...product,
      userStories: product.userStories.map((s) => (s.id === id ? { ...s, status: newStatus } : s)),
    };
    onUpdateProduct(updated);
    soundFx.playCyberClick();
  };

  // Step 9: Launch MVP
  const handleLaunchProduct = () => {
    soundFx.playLevelUp();
    triggerConfetti();

    // Deduct cost and update product state
    const totalFeatureCost = product.features.reduce((acc, f) => acc + (f.status === 'Built' ? f.cost : 0), 15000);
    const updatedProduct: UserProduct = {
      ...product,
      isLaunched: true,
      budgetSpent: product.budgetSpent + totalFeatureCost,
      metrics: {
        ...product.metrics,
        dau: product.metrics.dau + 4200,
        mau: product.metrics.mau + 12500,
        retentionRateDay7: 42,
        retentionRateDay30: 31,
        totalRevenue: product.metrics.totalRevenue + 34000,
        mrr: product.metrics.mrr + 12000,
      },
    };

    const updatedProfile: StudentProfile = {
      ...profile,
      xp: profile.xp + 500,
      budgetCredits: Math.max(0, profile.budgetCredits - totalFeatureCost),
      unlockedBadgeIds: Array.from(new Set([...profile.unlockedBadgeIds, 'badge-mvp-launch', 'badge-sprint-commander'])),
    };

    onUpdateProduct(updatedProduct);
    onUpdateProfile(updatedProfile);
    notifySuccess('🚀 PRODUCT MVP LAUNCHED INTO SIMULATED MARKET! +500 XP');
    setCurrentStep(10);
  };

  // Step 10: Customer Feedback Response
  const handleRespondFeedback = (id: string) => {
    const updated = {
      ...product,
      feedback: product.feedback.map((f) => (f.id === id ? { ...f, responded: true } : f)),
      metrics: {
        ...product.metrics,
        csat: Math.min(100, product.metrics.csat + 3),
        nps: Math.min(100, product.metrics.nps + 4),
      },
    };
    onUpdateProduct(updated);
    soundFx.playSuccessChime();
    awardXp(50, 'Resolved Customer Feedback Issue');
  };

  return (
    <div className="w-full max-w-7xl mx-auto p-4 sm:p-6 pb-24">
      {/* Top Banner & Title */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-400/30 text-xs font-mono font-bold">
              10-Step PM Lifecycle
            </span>
            <span className="text-xs text-slate-400 font-mono">
              Virtual Budget: ${profile.budgetCredits.toLocaleString()}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-display font-extrabold text-white mt-1">
            Product Creation Simulator
          </h1>
          <p className="text-sm text-slate-400">
            Current Project:{' '}
            <span className="text-cyan-300 font-semibold">{product.name}</span> –{' '}
            <span className="italic">{product.tagline}</span>
          </p>
        </div>

        {/* Step Navigation Pill Indicator */}
        <div className="flex items-center gap-2 bg-[#0d142c] p-1.5 rounded-xl border border-slate-800">
          <button
            disabled={currentStep === 1}
            onClick={() => {
              soundFx.playCyberClick();
              setCurrentStep((p) => Math.max(1, p - 1));
            }}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white disabled:opacity-30 disabled:hover:text-slate-400 transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <span className="text-xs font-mono text-cyan-300 px-2 font-semibold">
            Step {currentStep} of {STEPS.length}
          </span>
          <button
            disabled={currentStep === STEPS.length}
            onClick={() => {
              soundFx.playCyberClick();
              setCurrentStep((p) => Math.min(STEPS.length, p + 1));
            }}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white disabled:opacity-30 disabled:hover:text-slate-400 transition-all"
          >
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Toast alert */}
      {successMessage && (
        <div className="mb-6 p-3 rounded-xl bg-cyan-950/80 border border-cyan-400 text-cyan-200 text-xs font-semibold flex items-center gap-2 shadow-neon-cyan animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {/* Steps Horizontal Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-6 scrollbar-none">
        {STEPS.map((s) => {
          const isDone = currentStep > s.id;
          const isCurrent = currentStep === s.id;
          return (
            <button
              key={s.id}
              onClick={() => {
                soundFx.playCyberClick();
                setCurrentStep(s.id);
              }}
              className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all border ${
                isCurrent
                  ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300 shadow-neon-cyan'
                  : isDone
                  ? 'bg-slate-900/80 border-emerald-500/40 text-emerald-300'
                  : 'bg-slate-900/40 border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              <span
                className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                  isCurrent
                    ? 'bg-cyan-400 text-slate-950'
                    : isDone
                    ? 'bg-emerald-500 text-slate-950'
                    : 'bg-slate-800 text-slate-400'
                }`}
              >
                {isDone ? '✓' : s.id}
              </span>
              <span>{s.title}</span>
            </button>
          );
        })}
      </div>

      {/* STEP 1: PROBLEM DISCOVERY */}
      {currentStep === 1 && (
        <div className="glass-panel p-6 rounded-2xl border border-cyan-500/30 space-y-6 animate-fade-in">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
            <div>
              <h2 className="text-xl font-display font-bold text-white flex items-center gap-2">
                <Compass className="w-5 h-5 text-cyan-400" />
                <span>Step 1: Problem Discovery & Definition</span>
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                A problem well-stated is a problem half-solved. Frame the core pain point before building solutions.
              </p>
            </div>
            <button
              type="button"
              onClick={() => onOpenNovaWithPrompt?.('How do I validate if a customer problem is severe enough to build a B2B SaaS around?')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-purple-500/20 text-purple-300 border border-purple-500/40 text-xs font-semibold hover:bg-purple-500/30 transition-all"
            >
              <Bot className="w-4 h-4 text-pink-400" />
              <span>Ask NOVA Mentor</span>
            </button>
          </div>

          <form onSubmit={handleSaveProblem} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Product Name
                </label>
                <input
                  type="text"
                  value={product.name}
                  onChange={(e) => onUpdateProduct({ ...product, name: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-cyan-400"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Tagline / One-Liner
                </label>
                <input
                  type="text"
                  value={product.tagline}
                  onChange={(e) => onUpdateProduct({ ...product, tagline: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-cyan-400"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Target Audience / Specific User Segment
              </label>
              <input
                type="text"
                value={product.targetAudience}
                onChange={(e) => onUpdateProduct({ ...product, targetAudience: e.target.value })}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-cyan-400"
                placeholder="e.g. Distributed engineering teams across 4+ timezones"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Problem Statement (Target user + Context + Friction + Cost of Inaction)
              </label>
              <textarea
                rows={3}
                value={product.problemStatement}
                onChange={(e) => onUpdateProduct({ ...product, problemStatement: e.target.value })}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-sm text-slate-100 focus:outline-none focus:border-cyan-400"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                "How Might We" (HMW) Opportunity Statement
              </label>
              <input
                type="text"
                value={product.howMightWe}
                onChange={(e) => onUpdateProduct({ ...product, howMightWe: e.target.value })}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-cyan-400"
                required
              />
            </div>

            <div className="flex justify-end pt-4">
              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-400 to-indigo-600 hover:from-cyan-300 hover:to-indigo-500 text-slate-950 font-bold text-xs tracking-wider shadow-neon-cyan flex items-center gap-2 transition-all"
              >
                <span>VALIDATE & PROCEED TO PERSONAS</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>
        </div>
      )}

      {/* STEP 2: USER PERSONAS */}
      {currentStep === 2 && (
        <div className="glass-panel p-6 rounded-2xl border border-pink-500/30 space-y-6 animate-fade-in">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
            <div>
              <h2 className="text-xl font-display font-bold text-white flex items-center gap-2">
                <Users className="w-5 h-5 text-pink-400" />
                <span>Step 2: User Personas & Empathy Mapping</span>
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Ground every feature in real human psychology, daily habits, and pain points.
              </p>
            </div>
            <span className="text-xs font-mono text-pink-300 bg-pink-950/40 border border-pink-500/30 px-3 py-1 rounded-lg">
              {product.personas.length} Active Personas
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {product.personas.map((persona) => (
              <div
                key={persona.id}
                className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-pink-500/40 transition-all space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-pink-500/20 text-pink-400 flex items-center justify-center font-bold text-sm border border-pink-500/30">
                      {persona.name.substring(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-100 text-sm">{persona.name}</h3>
                      <p className="text-xs text-pink-300 font-medium">{persona.role}</p>
                    </div>
                  </div>
                  <span className="text-[11px] font-mono text-slate-400 bg-slate-800 px-2 py-0.5 rounded">
                    {persona.demographics.location} · {persona.demographics.age} yo
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 text-xs italic text-slate-300">
                  {persona.quote}
                </div>

                <div>
                  <h4 className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
                    Goals
                  </h4>
                  <ul className="text-xs text-slate-200 space-y-1 list-disc list-inside">
                    {persona.goals.map((g, idx) => (
                      <li key={idx}>{g}</li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="text-[11px] font-semibold text-rose-400 uppercase tracking-wider mb-1">
                    Core Pain Points
                  </h4>
                  <ul className="text-xs text-slate-300 space-y-1 list-disc list-inside">
                    {persona.painPoints.map((p, idx) => (
                      <li key={idx}>{p}</li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-between items-center pt-4">
            <button
              onClick={() => setCurrentStep(1)}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
            >
              Back
            </button>
            <button
              onClick={() => {
                awardXp(80, 'Synthesized Empathy Personas');
                setCurrentStep(3);
              }}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-400 hover:to-purple-500 text-white font-bold text-xs tracking-wider shadow-neon-pink flex items-center gap-2 transition-all"
            >
              <span>PROCEED TO VALUE PROPOSITION</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: VALUE PROPOSITION CANVAS & MARKET SIZING */}
      {currentStep === 3 && (
        <div className="glass-panel p-6 rounded-2xl border border-purple-500/30 space-y-6 animate-fade-in">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
            <div>
              <h2 className="text-xl font-display font-bold text-white flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-purple-400" />
                <span>Step 3: Value Proposition Canvas & Market Sizing</span>
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Map customer jobs, pains, and gains against your product pain relievers and gain creators.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-purple-300 bg-purple-950/40 border border-purple-500/30 px-3 py-1 rounded-lg">
                TAM: ${(product.tam / 1e9).toFixed(1)}B
              </span>
            </div>
          </div>

          {/* Value Prop Columns */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Customer Profile */}
            <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-4">
              <h3 className="font-display font-bold text-sm text-cyan-300 flex items-center gap-1.5">
                <Users className="w-4 h-4" />
                <span>1. Customer Profile (Jobs, Pains, Gains)</span>
              </h3>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-300">Customer Jobs:</label>
                {product.valueProposition.customerJobs.map((job, idx) => (
                  <div key={idx} className="p-2 rounded-lg bg-slate-950 text-xs text-slate-200 border border-slate-800">
                    • {job}
                  </div>
                ))}
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-rose-300">Customer Pains:</label>
                {product.valueProposition.pains.map((pain, idx) => (
                  <div key={idx} className="p-2 rounded-lg bg-rose-950/20 text-xs text-rose-200 border border-rose-900/30">
                    ✕ {pain}
                  </div>
                ))}
              </div>
            </div>

            {/* Value Map */}
            <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-4">
              <h3 className="font-display font-bold text-sm text-purple-300 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4" />
                <span>2. Value Map (Products, Relievers, Creators)</span>
              </h3>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-300">Products & Services:</label>
                {product.valueProposition.productsAndServices.map((prod, idx) => (
                  <div key={idx} className="p-2 rounded-lg bg-slate-950 text-xs text-slate-200 border border-slate-800">
                    ✓ {prod}
                  </div>
                ))}
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-emerald-300">Pain Relievers:</label>
                {product.valueProposition.painRelievers.map((rel, idx) => (
                  <div key={idx} className="p-2 rounded-lg bg-emerald-950/20 text-xs text-emerald-200 border border-emerald-900/30">
                    🛡️ {rel}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="flex justify-between items-center pt-4">
            <button
              onClick={() => setCurrentStep(2)}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
            >
              Back
            </button>
            <button
              onClick={() => {
                awardXp(90, 'Built Value Proposition Canvas');
                setCurrentStep(4);
              }}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-400 hover:to-indigo-500 text-white font-bold text-xs tracking-wider shadow-neon-purple flex items-center gap-2 transition-all"
            >
              <span>PROCEED TO RICE PRIORITIZATION</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 4: RICE PRIORITIZATION & MOSCOW */}
      {currentStep === 4 && (
        <div className="glass-panel p-6 rounded-2xl border border-cyan-500/30 space-y-6 animate-fade-in">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
            <div>
              <h2 className="text-xl font-display font-bold text-white flex items-center gap-2">
                <SlidersHorizontal className="w-5 h-5 text-cyan-400" />
                <span>Step 4: RICE Feature Prioritization Matrix</span>
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Score: <span className="font-mono text-cyan-300">(Reach × Impact × Confidence) / Effort</span>. Objectively rank your feature backlog.
              </p>
            </div>
            <button
              onClick={() => onOpenNovaWithPrompt?.('Explain how to calibrate Confidence percentages in RICE scoring when we only have 5 customer interviews.')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-purple-500/20 text-purple-300 border border-purple-500/40 text-xs font-semibold hover:bg-purple-500/30 transition-all"
            >
              <Bot className="w-4 h-4 text-pink-400" />
              <span>RICE Advice</span>
            </button>
          </div>

          {/* Add Feature Tool */}
          <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-4">
            <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
              <Plus className="w-4 h-4 text-cyan-400" />
              <span>Add & Score New Candidate Feature</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              <div className="sm:col-span-2">
                <label className="text-[11px] font-semibold text-slate-400">Feature Title</label>
                <input
                  type="text"
                  placeholder="e.g. Automated Slack Digest Notification Bot"
                  value={newFeatureTitle}
                  onChange={(e) => setNewFeatureTitle(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-400">Category</label>
                <select
                  value={newFeatureCategory}
                  onChange={(e) => setNewFeatureCategory(e.target.value as unknown as 'Core' | 'Growth' | 'Delight' | 'Infrastructure')}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white"
                >
                  <option value="Core">Core Value</option>
                  <option value="Growth">Growth / Viral</option>
                  <option value="Delight">User Delight</option>
                  <option value="Infrastructure">Infrastructure / Tech</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-400">MoSCoW</label>
                <select
                  value={newFeatureMoscow}
                  onChange={(e) => setNewFeatureMoscow(e.target.value as unknown as 'Must Have' | 'Should Have' | 'Could Have' | "Won't Have")}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white"
                >
                  <option value="Must Have">Must Have (MVP)</option>
                  <option value="Should Have">Should Have</option>
                  <option value="Could Have">Could Have</option>
                  <option value="Won't Have">Won't Have (v1)</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-400">Reach (Users/mo)</label>
                <input
                  type="number"
                  value={newFeatureReach}
                  onChange={(e) => setNewFeatureReach(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-400">Impact (0.25 - 3.0)</label>
                <input
                  type="number"
                  step="0.25"
                  value={newFeatureImpact}
                  onChange={(e) => setNewFeatureImpact(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-400">Confidence (0.5 - 1.0)</label>
                <input
                  type="number"
                  step="0.05"
                  value={newFeatureConfidence}
                  onChange={(e) => setNewFeatureConfidence(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-400">Effort (Weeks / Pts)</label>
                <input
                  type="number"
                  value={newFeatureEffort}
                  onChange={(e) => setNewFeatureEffort(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white"
                />
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <div className="text-xs font-mono text-cyan-300">
                Calculated RICE:{' '}
                <span className="font-bold text-sm">
                  {Math.round((newFeatureReach * newFeatureImpact * newFeatureConfidence) / Math.max(1, newFeatureEffort))}
                </span>
              </div>
              <button
                type="button"
                onClick={handleAddFeature}
                className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs"
              >
                Add Feature to Matrix
              </button>
            </div>
          </div>

          {/* Features Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border border-slate-800 rounded-xl overflow-hidden">
              <thead className="bg-slate-900/90 text-slate-400 uppercase font-mono text-[10px]">
                <tr>
                  <th className="p-3">Feature</th>
                  <th className="p-3">Category</th>
                  <th className="p-3">Reach</th>
                  <th className="p-3">Impact</th>
                  <th className="p-3">Confidence</th>
                  <th className="p-3">Effort</th>
                  <th className="p-3 font-bold text-cyan-400">RICE Score</th>
                  <th className="p-3">MoSCoW</th>
                  <th className="p-3">Cost ($)</th>
                  <th className="p-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 bg-slate-950/40">
                {product.features
                  .sort((a, b) => b.riceScore - a.riceScore)
                  .map((feat) => (
                    <tr key={feat.id} className="hover:bg-slate-900/50 transition-colors">
                      <td className="p-3 font-semibold text-slate-100">{feat.title}</td>
                      <td className="p-3">
                        <span className="px-2 py-0.5 rounded text-[10px] bg-slate-800 text-slate-300">
                          {feat.category}
                        </span>
                      </td>
                      <td className="p-3 font-mono">{feat.reach.toLocaleString()}</td>
                      <td className="p-3 font-mono">{feat.impact}x</td>
                      <td className="p-3 font-mono">{Math.round(feat.confidence * 100)}%</td>
                      <td className="p-3 font-mono">{feat.effort}w</td>
                      <td className="p-3 font-mono font-bold text-cyan-300 text-sm">{feat.riceScore}</td>
                      <td className="p-3">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                            feat.moscow === 'Must Have'
                              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                              : feat.moscow === 'Should Have'
                              ? 'bg-blue-500/20 text-blue-300 border border-blue-500/40'
                              : 'bg-slate-800 text-slate-400'
                          }`}
                        >
                          {feat.moscow}
                        </span>
                      </td>
                      <td className="p-3 font-mono text-emerald-400">${feat.cost.toLocaleString()}</td>
                      <td className="p-3 text-right">
                        <button
                          onClick={() => handleDeleteFeature(feat.id)}
                          className="p-1 text-slate-500 hover:text-rose-400 transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>

          <div className="flex justify-between items-center pt-4">
            <button
              onClick={() => setCurrentStep(3)}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
            >
              Back
            </button>
            <button
              onClick={() => {
                awardXp(120, 'Ranked Features with RICE');
                setCurrentStep(5);
              }}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-400 to-indigo-600 hover:from-cyan-300 hover:to-indigo-500 text-slate-950 font-bold text-xs tracking-wider shadow-neon-cyan flex items-center gap-2 transition-all"
            >
              <span>PROCEED TO USER STORIES</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 5: USER STORIES & GHERKIN */}
      {currentStep === 5 && (
        <div className="glass-panel p-6 rounded-2xl border border-emerald-500/30 space-y-6 animate-fade-in">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
            <div>
              <h2 className="text-xl font-display font-bold text-white flex items-center gap-2">
                <FileCode className="w-5 h-5 text-emerald-400" />
                <span>Step 5: User Stories & Acceptance Criteria (Gherkin)</span>
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Translate high-level product intent into unambiguous engineering contracts with Given-When-Then syntax.
              </p>
            </div>
            <button
              onClick={() => onOpenNovaWithPrompt?.('Check my Gherkin syntax and suggest edge cases for error states.')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs font-semibold hover:bg-emerald-500/30 transition-all"
            >
              <Bot className="w-4 h-4 text-emerald-400" />
              <span>Verify with NOVA</span>
            </button>
          </div>

          {/* Add Story Tool */}
          <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-3">
            <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
              <Plus className="w-4 h-4 text-emerald-400" />
              <span>Draft New User Story</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="text-[11px] font-semibold text-slate-400">As a (Persona/Role)</label>
                <input
                  type="text"
                  value={newStoryRole}
                  onChange={(e) => setNewStoryRole(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white"
                />
              </div>
              <div>
                <label className="text-[11px] font-semibold text-slate-400">I want to (Action/Goal)</label>
                <input
                  type="text"
                  value={newStoryGoal}
                  onChange={(e) => setNewStoryGoal(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white"
                />
              </div>
              <div>
                <label className="text-[11px] font-semibold text-slate-400">So that (Underlying Value)</label>
                <input
                  type="text"
                  value={newStoryBenefit}
                  onChange={(e) => setNewStoryBenefit(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white"
                />
              </div>
            </div>

            <div>
              <label className="text-[11px] font-semibold text-slate-400">
                Gherkin Acceptance Criteria (Given... When... Then...)
              </label>
              <textarea
                rows={2}
                value={newStoryCriteria}
                onChange={(e) => setNewStoryCriteria(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-xs text-white font-mono"
              />
            </div>

            <div className="flex items-center justify-between pt-1">
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400">Story Points (Fibonacci):</span>
                {[1, 2, 3, 5, 8, 13].map((pts) => (
                  <button
                    key={pts}
                    type="button"
                    onClick={() => setNewStoryPoints(pts)}
                    className={`w-7 h-7 rounded-lg text-xs font-mono font-bold transition-all ${
                      newStoryPoints === pts
                        ? 'bg-emerald-500 text-slate-950'
                        : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                    }`}
                  >
                    {pts}
                  </button>
                ))}
              </div>

              <button
                type="button"
                onClick={handleAddUserStory}
                className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs"
              >
                Save User Story
              </button>
            </div>
          </div>

          {/* Existing Stories List */}
          <div className="space-y-3">
            {product.userStories.map((story) => (
              <div
                key={story.id}
                className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2 hover:border-emerald-500/40 transition-all"
              >
                <div className="flex items-center justify-between">
                  <div className="text-xs text-slate-100 font-medium">
                    <span className="text-emerald-400 font-bold">As a</span> {story.role},{' '}
                    <span className="text-emerald-400 font-bold">I want to</span> {story.goal},{' '}
                    <span className="text-emerald-400 font-bold">So that</span> {story.benefit}.
                  </div>
                  <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono text-[10px] font-bold border border-emerald-500/30">
                    {story.storyPoints} Story Points
                  </span>
                </div>

                <div className="p-2.5 rounded-lg bg-slate-950/70 border border-slate-800/80 font-mono text-[11px] text-slate-300 space-y-1">
                  {story.acceptanceCriteria.map((c, i) => (
                    <div key={i}>• {c}</div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-between items-center pt-4">
            <button
              onClick={() => setCurrentStep(4)}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
            >
              Back
            </button>
            <button
              onClick={() => {
                awardXp(100, 'Structured Engineering User Stories');
                setCurrentStep(6);
              }}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-bold text-xs tracking-wider shadow-[0_0_20px_rgba(16,185,129,0.3)] flex items-center gap-2 transition-all"
            >
              <span>PROCEED TO SPRINT PLANNING</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 6: SPRINT PLANNING & KANBAN */}
      {currentStep === 6 && (
        <div className="glass-panel p-6 rounded-2xl border border-teal-500/30 space-y-6 animate-fade-in">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
            <div>
              <h2 className="text-xl font-display font-bold text-white flex items-center gap-2">
                <Kanban className="w-5 h-5 text-teal-400" />
                <span>Step 6: Sprint Planning & Agile Kanban Board</span>
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Move user stories across sprint columns. Track team velocity and budget burn rate.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs font-mono text-teal-300 bg-teal-950/40 border border-teal-500/30 px-3 py-1 rounded-lg">
                Sprint 1 Capacity: 25 Points
              </span>
            </div>
          </div>

          {/* Kanban Columns */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {(['To Do', 'In Progress', 'Review', 'Done'] as const).map((col) => {
              const storiesInCol = product.userStories.filter((s) => s.status === col);
              return (
                <div key={col} className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 space-y-3 min-h-[220px]">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                    <span className="text-xs font-bold text-slate-200">{col}</span>
                    <span className="text-[10px] font-mono text-slate-400 bg-slate-800 px-1.5 py-0.5 rounded">
                      {storiesInCol.length}
                    </span>
                  </div>

                  <div className="space-y-2">
                    {storiesInCol.map((s) => (
                      <div
                        key={s.id}
                        className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-xs space-y-2 hover:border-cyan-500/40 transition-all"
                      >
                        <p className="text-slate-200 font-medium line-clamp-2">
                          {s.goal}
                        </p>
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-mono text-cyan-400">
                            {s.storyPoints} pts
                          </span>
                          <div className="flex items-center gap-1">
                            {col !== 'Done' && (
                              <button
                                onClick={() => {
                                  const nextCol =
                                    col === 'To Do'
                                      ? 'In Progress'
                                      : col === 'In Progress'
                                      ? 'Review'
                                      : 'Done';
                                  handleUpdateStoryStatus(s.id, nextCol);
                                }}
                                className="text-[10px] px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-cyan-300"
                              >
                                Advance →
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex justify-between items-center pt-4">
            <button
              onClick={() => setCurrentStep(5)}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
            >
              Back
            </button>
            <button
              onClick={() => {
                awardXp(100, 'Orchestrated Agile Sprint');
                setCurrentStep(7);
              }}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-teal-500 to-cyan-600 hover:from-teal-400 hover:to-cyan-500 text-slate-950 font-bold text-xs tracking-wider shadow-neon-cyan flex items-center gap-2 transition-all"
            >
              <span>PROCEED TO INTERACTIVE PROTOTYPE</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 7: INTERACTIVE PROTOTYPE BUILDER */}
      {currentStep === 7 && (
        <div className="glass-panel p-6 rounded-2xl border border-sky-500/30 space-y-6 animate-fade-in">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
            <div>
              <h2 className="text-xl font-display font-bold text-white flex items-center gap-2">
                <Smartphone className="w-5 h-5 text-sky-400" />
                <span>Step 7: Interactive Prototype Simulator</span>
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Experience the live interactive mobile/web prototype crafted from your user stories.
              </p>
            </div>
            <span className="text-xs font-mono text-sky-300 bg-sky-950/40 border border-sky-500/30 px-3 py-1 rounded-lg">
              Low-Fi / Hi-Fi Simulation Active
            </span>
          </div>

          {/* Interactive Smartphone Shell */}
          <div className="max-w-md mx-auto p-4 rounded-3xl bg-slate-950 border-4 border-slate-700 shadow-2xl space-y-4">
            {/* Phone Speaker Notch */}
            <div className="w-24 h-4 bg-slate-800 rounded-full mx-auto" />

            {/* Simulated App Screen */}
            <div className="min-h-[380px] bg-[#0c1226] rounded-2xl p-4 border border-cyan-500/30 space-y-3 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <span className="font-display font-bold text-xs text-cyan-300">{product.name}</span>
                  <span className="text-[10px] text-slate-400 font-mono">9:41 AM</span>
                </div>

                <div className="mt-4 p-3 rounded-xl bg-gradient-to-r from-cyan-500/10 to-indigo-500/10 border border-cyan-500/30">
                  <p className="text-xs font-semibold text-slate-100">☀️ Team Standup Summary</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">3 updates submitted · 1 critical blocker detected</p>
                </div>

                <div className="mt-3 space-y-2">
                  <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 text-xs flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-slate-200">Elena (Berlin)</p>
                      <p className="text-[10px] text-slate-400">Shipped Auth V2 API</p>
                    </div>
                    <span className="text-[10px] text-emerald-400 font-mono">42s video</span>
                  </div>

                  <div className="p-2.5 rounded-lg bg-rose-950/20 border border-rose-900/40 text-xs flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-rose-300">⚠️ Devon (Toronto)</p>
                      <p className="text-[10px] text-rose-200">Blocked on database replica latency</p>
                    </div>
                    <span className="text-[10px] text-rose-400 font-mono">ALERT</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => {
                  soundFx.playSuccessChime();
                  notifySuccess('Simulated Action: Opened 60-Second Video Recorder!');
                }}
                className="w-full py-2.5 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-bold text-xs tracking-wider shadow-neon-cyan transition-all"
              >
                + RECORD 60-SECOND UPDATE
              </button>
            </div>
          </div>

          <div className="flex justify-between items-center pt-4">
            <button
              onClick={() => setCurrentStep(6)}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
            >
              Back
            </button>
            <button
              onClick={() => {
                awardXp(110, 'Designed Interactive Prototype');
                setCurrentStep(8);
              }}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-sky-400 to-indigo-600 hover:from-sky-300 hover:to-indigo-500 text-slate-950 font-bold text-xs tracking-wider shadow-neon-cyan flex items-center gap-2 transition-all"
            >
              <span>PROCEED TO USABILITY TESTING</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 8: USABILITY TESTING SIMULATOR */}
      {currentStep === 8 && (
        <div className="glass-panel p-6 rounded-2xl border border-indigo-500/30 space-y-6 animate-fade-in">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
            <div>
              <h2 className="text-xl font-display font-bold text-white flex items-center gap-2">
                <Eye className="w-5 h-5 text-indigo-400" />
                <span>Step 8: Usability Testing & Friction Analytics</span>
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Virtual usability cohort of 50 test users ran tasks against the prototype.
              </p>
            </div>
            <span className="text-xs font-mono text-indigo-300 bg-indigo-950/40 border border-indigo-500/30 px-3 py-1 rounded-lg">
              Avg Task Success: 91%
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {product.usabilityTests.map((t, idx) => (
              <div key={idx} className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-slate-100 text-xs">{t.taskName}</h3>
                  <span className="font-mono text-emerald-400 text-xs font-bold">
                    {t.completionRate}% Pass
                  </span>
                </div>

                <div className="flex items-center gap-4 text-xs font-mono text-slate-400">
                  <div>Avg Time: <span className="text-slate-200 font-bold">{t.averageTimeSeconds}s</span></div>
                  <div>CSAT: <span className="text-cyan-300 font-bold">{t.userSatisfactionScore} / 5.0</span></div>
                </div>

                <div className="space-y-1.5 pt-2 border-t border-slate-800">
                  <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                    User Observations:
                  </p>
                  {t.feedbackQuotes.map((q, qIdx) => (
                    <p key={qIdx} className="text-xs text-slate-300 italic bg-slate-950 p-2 rounded-lg">
                      {q}
                    </p>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-between items-center pt-4">
            <button
              onClick={() => setCurrentStep(7)}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
            >
              Back
            </button>
            <button
              onClick={() => {
                awardXp(120, 'Completed Usability Testing');
                setCurrentStep(9);
              }}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-400 hover:to-purple-500 text-white font-bold text-xs tracking-wider shadow-neon-purple flex items-center gap-2 transition-all"
            >
              <span>PROCEED TO MARKET LAUNCH</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 9: GO-TO-MARKET & LAUNCH ARENA */}
      {currentStep === 9 && (
        <div className="glass-panel p-6 rounded-2xl border border-amber-500/30 space-y-6 animate-fade-in">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
            <div>
              <h2 className="text-xl font-display font-bold text-white flex items-center gap-2">
                <Rocket className="w-5 h-5 text-amber-400" />
                <span>Step 9: Launch Arena – Go-To-Market & Pricing</span>
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Configure your monetization pricing model, select distribution channels, and launch into the live market.
              </p>
            </div>
            <div className="flex items-center gap-2 font-mono text-xs text-emerald-400 bg-emerald-950/40 px-3 py-1 rounded-lg border border-emerald-500/30">
              <DollarSign className="w-4 h-4" />
              <span>Available Budget: ${profile.budgetCredits.toLocaleString()}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-4">
              <h3 className="font-bold text-slate-200 text-xs uppercase tracking-wider">
                1. Monetization Strategy
              </h3>
              <div>
                <label className="text-xs text-slate-400 block mb-1">Pricing Model</label>
                <select
                  value={product.pricingModel}
                  onChange={(e) =>
                    onUpdateProduct({
                      ...product,
                      pricingModel: e.target.value as 'Freemium' | 'Subscription' | 'Usage-based' | 'One-time',
                    })
                  }
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white"
                >
                  <option value="Subscription">Monthly Subscription (SaaS)</option>
                  <option value="Freemium">Freemium with Pro Tier</option>
                  <option value="Usage-based">Usage-based (per API call/seat)</option>
                  <option value="One-time">One-time Lifetime License</option>
                </select>
              </div>

              <div>
                <label className="text-xs text-slate-400 block mb-1">Price Point ($ USD)</label>
                <input
                  type="number"
                  value={product.pricingPrice}
                  onChange={(e) => onUpdateProduct({ ...product, pricingPrice: Number(e.target.value) })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white font-mono"
                />
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-4">
              <h3 className="font-bold text-slate-200 text-xs uppercase tracking-wider">
                2. GTM Distribution Channels
              </h3>
              <div className="space-y-2">
                {product.launchChannels.map((ch, idx) => (
                  <div key={idx} className="flex items-center gap-2 p-2 rounded-lg bg-slate-950 text-xs text-slate-300 border border-slate-800">
                    <Rocket className="w-3.5 h-3.5 text-amber-400" />
                    <span>{ch}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-gradient-to-r from-amber-500/10 via-purple-500/10 to-cyan-500/10 border border-amber-500/40 text-center space-y-4">
            <h3 className="text-lg font-display font-extrabold text-white">
              Ready to Launch {product.name} to the Simulated Market?
            </h3>
            <p className="text-xs text-slate-300 max-w-lg mx-auto">
              Launching initiates real-time active user telemetry, customer feedback reviews, and revenue calculations.
            </p>

            <button
              onClick={handleLaunchProduct}
              className="px-8 py-3 rounded-2xl bg-gradient-to-r from-amber-400 via-orange-500 to-rose-600 hover:brightness-110 text-slate-950 font-extrabold text-sm tracking-wider shadow-lg flex items-center justify-center gap-2 mx-auto transition-all"
            >
              <Rocket className="w-5 h-5 text-slate-950" />
              <span>LAUNCH SIMULATED MVP NOW (+500 XP)</span>
            </button>
          </div>

          <div className="flex justify-between items-center pt-4">
            <button
              onClick={() => setCurrentStep(8)}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
            >
              Back
            </button>
          </div>
        </div>
      )}

      {/* STEP 10: REAL-TIME ANALYTICS & ITERATION */}
      {currentStep === 10 && (
        <div className="glass-panel p-6 rounded-2xl border border-cyan-500/30 space-y-6 animate-fade-in">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
            <div>
              <h2 className="text-xl font-display font-bold text-white flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-cyan-400" />
                <span>Step 10: Live Post-Launch Analytics & Iteration Loop</span>
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Monitor real-time simulated user telemetry, respond to customer feedback, and iterate your product.
              </p>
            </div>
            <span className="text-xs font-mono text-emerald-400 bg-emerald-950/40 border border-emerald-500/30 px-3 py-1 rounded-lg">
              Live Telemetry Streaming
            </span>
          </div>

          {/* Metric KPI cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
              <span className="text-[10px] text-slate-400 uppercase font-mono">Daily Active (DAU)</span>
              <p className="text-lg font-bold text-cyan-300 font-mono mt-0.5">
                {product.metrics.dau.toLocaleString()}
              </p>
            </div>

            <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
              <span className="text-[10px] text-slate-400 uppercase font-mono">Monthly Active (MAU)</span>
              <p className="text-lg font-bold text-purple-300 font-mono mt-0.5">
                {product.metrics.mau.toLocaleString()}
              </p>
            </div>

            <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
              <span className="text-[10px] text-slate-400 uppercase font-mono">Day-30 Retention</span>
              <p className="text-lg font-bold text-emerald-300 font-mono mt-0.5">
                {product.metrics.retentionRateDay30}%
              </p>
            </div>

            <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
              <span className="text-[10px] text-slate-400 uppercase font-mono">Monthly Churn</span>
              <p className="text-lg font-bold text-rose-300 font-mono mt-0.5">
                {product.metrics.churnRate}%
              </p>
            </div>

            <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
              <span className="text-[10px] text-slate-400 uppercase font-mono">MRR</span>
              <p className="text-lg font-bold text-emerald-400 font-mono mt-0.5">
                ${product.metrics.mrr.toLocaleString()}
              </p>
            </div>

            <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
              <span className="text-[10px] text-slate-400 uppercase font-mono">LTV : CAC</span>
              <p className="text-lg font-bold text-cyan-400 font-mono mt-0.5">
                {(product.metrics.ltv / Math.max(1, product.metrics.cac)).toFixed(1)}:1
              </p>
            </div>
          </div>

          {/* Customer Feedback Stream */}
          <div className="space-y-3">
            <h3 className="font-bold text-sm text-slate-200 flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-cyan-400" />
              <span>Live Customer Feedback Stream</span>
            </h3>

            <div className="space-y-3">
              {product.feedback.map((fb) => (
                <div
                  key={fb.id}
                  className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-xs text-slate-100">{fb.userName}</span>
                      <span className="text-[10px] text-slate-400">· {fb.timestamp}</span>
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded font-mono ${
                          fb.sentiment === 'positive'
                            ? 'bg-emerald-500/20 text-emerald-300'
                            : 'bg-rose-500/20 text-rose-300'
                        }`}
                      >
                        {fb.rating} ★ ({fb.category})
                      </span>
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed">{fb.comment}</p>
                  </div>

                  {fb.responded ? (
                    <span className="text-xs font-mono text-emerald-400 bg-emerald-950/40 px-3 py-1 rounded-lg border border-emerald-500/30 shrink-0">
                      ✓ Responded
                    </span>
                  ) : (
                    <button
                      onClick={() => handleRespondFeedback(fb.id)}
                      className="px-3 py-1.5 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-400/40 text-xs font-semibold shrink-0 transition-all"
                    >
                      Resolve & Respond (+50 XP)
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-between items-center pt-4">
            <button
              onClick={() => setCurrentStep(9)}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
            >
              Back to Launch Arena
            </button>
            <button
              onClick={() => {
                triggerConfetti();
                soundFx.playLevelUp();
                notifySuccess('Journey Milestone Completed! You have mastered the full PM Lifecycle!');
              }}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-400 to-cyan-500 hover:from-emerald-300 hover:to-cyan-400 text-slate-950 font-bold text-xs tracking-wider shadow-neon-cyan flex items-center gap-2 transition-all"
            >
              <Sparkles className="w-4 h-4" />
              <span>COMPLETE LIFECYCLE MILESTONE</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
