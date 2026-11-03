import React from 'react';
import { BuildingInfo } from '../../types';
import { BUILDINGS_DATA } from '../../data/buildings';
import { soundFx } from '../../services/audio';
import {
  Lightbulb,
  Users,
  Compass,
  PenTool,
  Code,
  BarChart3,
  Rocket,
  TrendingUp,
  ArrowRight,
  Sparkles,
} from 'lucide-react';

interface IsometricCityProps {
  selectedBuilding: BuildingInfo | null;
  onSelectBuilding: (building: BuildingInfo) => void;
  onEnterBuilding: (building: BuildingInfo) => void;
}

const iconMap: Record<string, React.ReactNode> = {
  Lightbulb: <Lightbulb className="w-5 h-5" />,
  Users: <Users className="w-5 h-5" />,
  Compass: <Compass className="w-5 h-5" />,
  PenTool: <PenTool className="w-5 h-5" />,
  Code: <Code className="w-5 h-5" />,
  BarChart3: <BarChart3 className="w-5 h-5" />,
  Rocket: <Rocket className="w-5 h-5" />,
  TrendingUp: <TrendingUp className="w-5 h-5" />,
};

export const IsometricCity: React.FC<IsometricCityProps> = ({
  selectedBuilding,
  onSelectBuilding,
  onEnterBuilding,
}) => {
  return (
    <div className="w-full h-full min-h-[550px] p-4 sm:p-6 flex flex-col justify-between cyber-grid relative overflow-hidden bg-gradient-to-b from-[#070913] via-[#0a0f26] to-[#060814]">
      {/* Background ambient neon glow circles */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header bar within city view */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 z-10">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse" />
            <h2 className="text-xl font-display font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-white to-purple-300">
              VIRTUAL PRODUCT METROPOLIS
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Select an innovation district to enter its curriculum, simulations, and real-time labs.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400 font-mono bg-slate-900/80 px-2.5 py-1 rounded-lg border border-slate-700/60">
            8 Innovation Districts Active
          </span>
        </div>
      </div>

      {/* Buildings Interactive Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 my-6 z-10 max-w-6xl mx-auto w-full">
        {BUILDINGS_DATA.map((building) => {
          const isSelected = selectedBuilding?.id === building.id;
          return (
            <div
              key={building.id}
              onClick={() => {
                soundFx.playSelectBuilding();
                onSelectBuilding(building);
              }}
              className={`group relative rounded-2xl p-4 transition-all duration-300 cursor-pointer border ${
                isSelected
                  ? 'bg-[#101838]/90 border-cyan-400 shadow-[0_0_25px_rgba(0,247,255,0.25)] scale-[1.02]'
                  : 'bg-[#0d1329]/70 border-slate-800/80 hover:border-purple-400/60 hover:bg-[#12193b]/80 hover:scale-[1.01]'
              }`}
            >
              {/* Glow indicator */}
              <div
                className="absolute top-0 left-0 right-0 h-1 rounded-t-2xl transition-all"
                style={{ backgroundColor: building.color }}
              />

              <div className="flex items-start justify-between mb-3">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center transition-all group-hover:scale-110"
                  style={{
                    backgroundColor: `${building.color}15`,
                    color: building.color,
                    border: `1px solid ${building.color}40`,
                  }}
                >
                  {iconMap[building.iconName] || <Sparkles className="w-5 h-5" />}
                </div>

                <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full bg-slate-800/80 text-cyan-300 border border-slate-700">
                  +{building.xpReward} XP
                </span>
              </div>

              <h3 className="font-display font-bold text-sm text-slate-100 group-hover:text-cyan-300 transition-colors">
                {building.name}
              </h3>
              <p className="text-[11px] text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                {building.tagline}
              </p>

              <div className="mt-4 pt-3 border-t border-slate-800/60 flex items-center justify-between">
                <span className="text-[10px] font-mono text-purple-300 uppercase tracking-wider">
                  {building.category}
                </span>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    soundFx.playSuccessChime();
                    onEnterBuilding(building);
                  }}
                  className="flex items-center gap-1 text-xs font-semibold text-cyan-400 hover:text-cyan-300 group-hover:translate-x-0.5 transition-all"
                >
                  <span>Enter</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected Building Quick Banner */}
      {selectedBuilding && (
        <div className="glass-panel p-4 rounded-xl border border-cyan-500/30 flex flex-col sm:flex-row items-center justify-between gap-4 z-10 max-w-4xl mx-auto w-full animate-fade-in">
          <div className="flex items-center gap-3">
            <div
              className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
              style={{
                backgroundColor: `${selectedBuilding.color}20`,
                color: selectedBuilding.color,
                border: `1px solid ${selectedBuilding.color}50`,
              }}
            >
              {iconMap[selectedBuilding.iconName] || <Sparkles className="w-6 h-6" />}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-display font-bold text-base text-slate-100">
                  {selectedBuilding.name}
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/40">
                  {selectedBuilding.category}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                {selectedBuilding.description}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={() => {
                soundFx.playSuccessChime();
                onEnterBuilding(selectedBuilding);
              }}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-slate-950 font-bold text-xs tracking-wide shadow-neon-cyan flex items-center justify-center gap-2 transition-all"
            >
              <span>ENTER ENVIRONMENT</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
