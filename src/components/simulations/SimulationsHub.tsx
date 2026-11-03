import React, { useState } from 'react';
import {
  SimulationScenario,
  SimulationOption,
  StudentProfile,
  ProductMetrics,
} from '../../types';
import { SIMULATION_SCENARIOS } from '../../data/simulationsData';
import { soundFx } from '../../services/audio';
import confetti from 'canvas-confetti';
import {
  Gamepad2,
  TrendingUp,
  DollarSign,
  AlertTriangle,
  Users,
  CheckCircle2,
  ArrowRight,
  RotateCcw,
  Award,
  Sparkles,
  ShieldAlert,
  Bot,
} from 'lucide-react';

interface SimulationsHubProps {
  profile: StudentProfile;
  onUpdateProfile: (profile: StudentProfile) => void;
  onOpenNovaWithPrompt?: (prompt: string) => void;
}

export const SimulationsHub: React.FC<SimulationsHubProps> = ({
  profile,
  onUpdateProfile,
  onOpenNovaWithPrompt,
}) => {
  const [selectedScenario, setSelectedScenario] = useState<SimulationScenario | null>(null);
  const [currentStageIdx, setCurrentStageIdx] = useState(0);
  const [currentMetrics, setCurrentMetrics] = useState<Partial<ProductMetrics>>({});
  const [remainingBudget, setRemainingBudget] = useState(0);
  const [selectedOptionHistory, setSelectedOptionHistory] = useState<SimulationOption[]>([]);
  const [lastConsequence, setLastConsequence] = useState<SimulationOption['consequences'] | null>(null);
  const [isCompleted, setIsCompleted] = useState(false);
  const [totalScore, setTotalScore] = useState(0);

  const startScenario = (scenario: SimulationScenario) => {
    soundFx.playSelectBuilding();
    setSelectedScenario(scenario);
    setCurrentStageIdx(0);
    setCurrentMetrics(scenario.initialMetrics);
    setRemainingBudget(scenario.budgetLimit);
    setSelectedOptionHistory([]);
    setLastConsequence(null);
    setIsCompleted(false);
    setTotalScore(0);
  };

  const handleChooseOption = (option: SimulationOption) => {
    if (!selectedScenario) return;

    soundFx.playSimulationTick();
    const newBudget = remainingBudget - option.cost;
    const newMetrics = { ...currentMetrics, ...option.consequences.metricsDelta };
    const newScore = totalScore + option.consequences.scoreDelta;

    setRemainingBudget(newBudget);
    setCurrentMetrics(newMetrics);
    setSelectedOptionHistory((prev) => [...prev, option]);
    setLastConsequence(option.consequences);
    setTotalScore(newScore);

    const nextIdx = currentStageIdx + 1;
    if (nextIdx < selectedScenario.stages.length) {
      setCurrentStageIdx(nextIdx);
    } else {
      // Completed all stages!
      setIsCompleted(true);
      soundFx.playLevelUp();
      confetti({
        particleCount: 100,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#00f7ff', '#a855f7', '#f59e0b', '#10b981'],
      });

      // Update student profile
      const earnedXp = Math.max(150, 250 + newScore);
      const updatedProfile: StudentProfile = {
        ...profile,
        xp: profile.xp + earnedXp,
        completedSimulationIds: Array.from(
          new Set([...profile.completedSimulationIds, selectedScenario.id])
        ),
      };
      onUpdateProfile(updatedProfile);
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto p-4 sm:p-6 pb-24">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30 text-xs font-mono font-bold">
              Product Simulation Lab
            </span>
            <span className="text-xs text-slate-400 font-mono">
              7 Realistic Scenarios · Branching Consequences
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-display font-extrabold text-white mt-1">
            Executive Product Simulations
          </h1>
          <p className="text-sm text-slate-400">
            Make high-stakes decisions under budget constraints, competitor aggression, and market volatility.
          </p>
        </div>

        {selectedScenario && (
          <button
            onClick={() => setSelectedScenario(null)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-all"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Select Another Simulation</span>
          </button>
        )}
      </div>

      {/* Scenario Selection Grid (When not in an active scenario) */}
      {!selectedScenario && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
          {SIMULATION_SCENARIOS.map((scen, idx) => {
            const isFinished = profile.completedSimulationIds.includes(scen.id);
            return (
              <div
                key={scen.id}
                onClick={() => startScenario(scen)}
                className="group relative p-5 rounded-2xl bg-[#0d132b]/80 hover:bg-[#12193b]/90 border border-slate-800 hover:border-purple-400/60 shadow-glass cursor-pointer transition-all duration-300 hover:scale-[1.01] flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[10px] font-mono font-bold px-2.5 py-0.5 rounded bg-slate-800 text-slate-300">
                      Challenge #{idx + 1}
                    </span>
                    <span
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded border ${
                        scen.difficulty === 'Beginner'
                          ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                          : scen.difficulty === 'Intermediate'
                          ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40'
                          : 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                      }`}
                    >
                      {scen.difficulty}
                    </span>
                  </div>

                  <h3 className="font-display font-bold text-base text-slate-100 group-hover:text-purple-300 transition-colors">
                    {scen.title}
                  </h3>
                  <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                    {scen.subtitle}
                  </p>

                  <div className="mt-4 p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 text-[11px] text-slate-300 leading-relaxed">
                    {scen.context}
                  </div>
                </div>

                <div className="mt-5 pt-3 border-t border-slate-800/80 flex items-center justify-between">
                  <div className="flex items-center gap-1 font-mono text-xs text-amber-400">
                    <DollarSign className="w-3.5 h-3.5" />
                    <span>Budget: ${scen.budgetLimit.toLocaleString()}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    {isFinished && (
                      <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-500/30">
                        ✓ Passed
                      </span>
                    )}
                    <span className="text-xs font-bold text-cyan-400 group-hover:translate-x-1 transition-transform flex items-center gap-1">
                      Start <ArrowRight className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ACTIVE SCENARIO SIMULATION ROOM */}
      {selectedScenario && (
        <div className="space-y-6 animate-fade-in">
          {/* Simulation Header HUD */}
          <div className="glass-panel p-5 rounded-2xl border border-purple-500/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm text-purple-300">
                  {selectedScenario.title}
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-400 font-mono">
                  Stage {Math.min(selectedScenario.stages.length, currentStageIdx + 1)} of{' '}
                  {selectedScenario.stages.length}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1 max-w-xl">
                {selectedScenario.context}
              </p>
            </div>

            {/* Live Metrics Telemetry Strip */}
            <div className="flex items-center gap-3 overflow-x-auto w-full md:w-auto">
              <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-center min-w-[90px]">
                <span className="text-[10px] text-slate-400 uppercase font-mono">Budget</span>
                <p
                  className={`font-mono font-bold text-xs mt-0.5 ${
                    remainingBudget < 10000 ? 'text-rose-400 animate-pulse' : 'text-emerald-400'
                  }`}
                >
                  ${remainingBudget.toLocaleString()}
                </p>
              </div>

              {currentMetrics.dau !== undefined && (
                <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-center min-w-[90px]">
                  <span className="text-[10px] text-slate-400 uppercase font-mono">DAU</span>
                  <p className="font-mono font-bold text-xs text-cyan-300 mt-0.5">
                    {currentMetrics.dau.toLocaleString()}
                  </p>
                </div>
              )}

              {currentMetrics.csat !== undefined && (
                <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-center min-w-[90px]">
                  <span className="text-[10px] text-slate-400 uppercase font-mono">CSAT</span>
                  <p className="font-mono font-bold text-xs text-purple-300 mt-0.5">
                    {currentMetrics.csat}%
                  </p>
                </div>
              )}

              {currentMetrics.churnRate !== undefined && (
                <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-center min-w-[90px]">
                  <span className="text-[10px] text-slate-400 uppercase font-mono">Churn</span>
                  <p className="font-mono font-bold text-xs text-rose-300 mt-0.5">
                    {currentMetrics.churnRate}%
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* If NOT completed: Current Stage Choices */}
          {!isCompleted && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Situation & Decision Choices (Left 2 cols) */}
              <div className="lg:col-span-2 space-y-4">
                <div className="p-5 rounded-2xl bg-[#0c1229] border border-cyan-500/30 space-y-3">
                  <h3 className="font-display font-bold text-base text-cyan-300 flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-amber-400" />
                    <span>{selectedScenario.stages[currentStageIdx].title}</span>
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
                    {selectedScenario.stages[currentStageIdx].situation}
                  </p>
                </div>

                <div className="space-y-3">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                    Evaluate Strategic Interventions:
                  </h4>

                  {selectedScenario.stages[currentStageIdx].options.map((option) => {
                    const canAfford = remainingBudget >= option.cost;
                    return (
                      <div
                        key={option.id}
                        className={`p-4 rounded-xl border transition-all ${
                          canAfford
                            ? 'bg-[#0e1533]/80 hover:bg-[#131b40] border-slate-800 hover:border-cyan-400/60'
                            : 'bg-slate-950/40 border-slate-900 opacity-50'
                        }`}
                      >
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mb-2">
                          <h5 className="font-bold text-slate-100 text-sm">
                            {option.text}
                          </h5>
                          <div className="flex items-center gap-2 font-mono text-xs">
                            <span className="text-emerald-400 font-bold">
                              -${option.cost.toLocaleString()}
                            </span>
                            <span className="text-slate-400">
                              · {option.timeCostWeeks} wks
                            </span>
                          </div>
                        </div>

                        <p className="text-xs text-slate-300 mb-4 leading-relaxed">
                          {option.description}
                        </p>

                        <div className="flex items-center justify-between pt-2 border-t border-slate-800/80">
                          <button
                            type="button"
                            onClick={() =>
                              onOpenNovaWithPrompt?.(
                                `In the simulation "${selectedScenario.title}", should I choose "${option.text}"? Analyze the pros and cons.`
                              )
                            }
                            className="flex items-center gap-1 text-[11px] font-semibold text-purple-400 hover:text-purple-300"
                          >
                            <Bot className="w-3.5 h-3.5" />
                            <span>NOVA Assessment</span>
                          </button>

                          <button
                            disabled={!canAfford}
                            onClick={() => handleChooseOption(option)}
                            className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-400 to-indigo-600 hover:from-cyan-300 hover:to-indigo-500 disabled:opacity-40 text-slate-950 font-bold text-xs tracking-wider shadow-neon-cyan flex items-center gap-1.5 transition-all"
                          >
                            <span>Execute Decision</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Real-time Market Reaction Stream (Right col) */}
              <div className="space-y-4">
                <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-4">
                  <h4 className="font-display font-bold text-xs text-slate-200 uppercase tracking-wider flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-cyan-400" />
                    <span>Market & Competitor Radar</span>
                  </h4>

                  {lastConsequence ? (
                    <div className="space-y-3 animate-fade-in text-xs">
                      <div className="p-3 rounded-xl bg-cyan-950/20 border border-cyan-500/30 space-y-1">
                        <span className="font-bold text-cyan-300 text-[11px] uppercase">
                          Market Consequence:
                        </span>
                        <p className="text-slate-200">{lastConsequence.marketReaction}</p>
                      </div>

                      <div className="p-3 rounded-xl bg-rose-950/20 border border-rose-500/30 space-y-1">
                        <span className="font-bold text-rose-300 text-[11px] uppercase flex items-center gap-1">
                          <ShieldAlert className="w-3.5 h-3.5" />
                          <span>Competitor Countermove:</span>
                        </span>
                        <p className="text-slate-200">{lastConsequence.competitorMove}</p>
                      </div>

                      <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                        <span className="font-bold text-purple-300 text-[11px] uppercase">
                          Simulated Customer Review:
                        </span>
                        <p className="text-slate-300 italic">
                          {lastConsequence.customerFeedbackSample}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="p-8 text-center text-xs text-slate-400 font-mono">
                      Telemetry waiting for Stage 1 decision execution...
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* SIMULATION COMPLETED: POST-MORTEM REPORT */}
          {isCompleted && (
            <div className="glass-panel p-6 sm:p-8 rounded-2xl border border-emerald-500/40 space-y-6 animate-fade-in">
              <div className="text-center space-y-2">
                <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto border border-emerald-500/40">
                  <Award className="w-8 h-8" />
                </div>
                <h2 className="text-2xl font-display font-extrabold text-white">
                  Simulation Concluded: Post-Mortem Assessment
                </h2>
                <p className="text-xs text-slate-300 max-w-lg mx-auto">
                  You successfully guided the product through critical inflection points. Total Performance Score:{' '}
                  <span className="text-emerald-400 font-mono font-bold">+{totalScore} pts</span>.
                </p>
              </div>

              {/* Best Practices & Key Takeaways */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-800">
                <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
                  <h3 className="font-bold text-xs uppercase tracking-wider text-cyan-300">
                    Executive Best Practices
                  </h3>
                  <ul className="text-xs text-slate-200 space-y-2 list-disc list-inside leading-relaxed">
                    {selectedScenario.postMortemReport.bestPractices.map((bp, i) => (
                      <li key={i}>{bp}</li>
                    ))}
                  </ul>
                </div>

                <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
                  <h3 className="font-bold text-xs uppercase tracking-wider text-purple-300">
                    Product Management Takeaways
                  </h3>
                  <ul className="text-xs text-slate-200 space-y-2 list-disc list-inside leading-relaxed">
                    {selectedScenario.postMortemReport.pmTakeaways.map((pt, i) => (
                      <li key={i}>{pt}</li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                <button
                  onClick={() => startScenario(selectedScenario)}
                  className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold"
                >
                  Replay Simulation
                </button>
                <button
                  onClick={() => setSelectedScenario(null)}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-400 to-cyan-500 text-slate-950 font-extrabold text-xs tracking-wider shadow-neon-cyan"
                >
                  Return to Simulations Catalog
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
