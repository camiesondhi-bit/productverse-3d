import React, { useState } from 'react';
import {
  StudentProfile,
  CareerLevel,
} from '../../types';
import {
  Sparkles,
  Award,
  Zap,
  Volume2,
  VolumeX,
  Bot,
  User,
  GraduationCap,
  Layers,
  BarChart3,
  Users2,
  Gamepad2,
  Boxes,
  Database,
  ShieldCheck,
  Flame,
} from 'lucide-react';
import { soundFx } from '../../services/audio';

export type ActiveNavTab =
  | 'city'
  | 'simulator'
  | 'lms'
  | 'simulations'
  | 'analytics'
  | 'teams'
  | 'instructor';

interface HeaderProps {
  profile: StudentProfile;
  activeTab: ActiveNavTab;
  onTabChange: (tab: ActiveNavTab) => void;
  onOpenProfile: () => void;
  onOpenNova: () => void;
  onOpenCloudSync: () => void;
  activeBuildingName?: string | null;
}

export const Header: React.FC<HeaderProps> = ({
  profile,
  activeTab,
  onTabChange,
  onOpenProfile,
  onOpenNova,
  onOpenCloudSync,
}) => {
  const [isMuted, setIsMuted] = useState(soundFx.getMuted());

  const handleToggleSound = () => {
    const newState = soundFx.toggleMute();
    setIsMuted(newState);
    if (!newState) {
      soundFx.playCyberClick();
    }
  };

  const navItems: { id: ActiveNavTab; label: string; icon: React.ReactNode }[] = [
    { id: 'city', label: '3D City', icon: <Boxes className="w-4 h-4" /> },
    { id: 'simulator', label: 'Product Builder', icon: <Layers className="w-4 h-4" /> },
    { id: 'lms', label: 'PM Academy', icon: <GraduationCap className="w-4 h-4" /> },
    { id: 'simulations', label: 'Simulations', icon: <Gamepad2 className="w-4 h-4" /> },
    { id: 'analytics', label: 'Analytics', icon: <BarChart3 className="w-4 h-4" /> },
    { id: 'teams', label: 'Teams', icon: <Users2 className="w-4 h-4" /> },
    { id: 'instructor', label: 'Instructor', icon: <ShieldCheck className="w-4 h-4" /> },
  ];

  // Level thresholds
  const levelThresholds: Record<CareerLevel, { min: number; max: number; next: string }> = {
    'Product Intern': { min: 0, max: 500, next: 'Associate Product Manager' },
    'Associate Product Manager': { min: 500, max: 1500, next: 'Product Manager' },
    'Product Manager': { min: 1500, max: 3500, next: 'Senior Product Manager' },
    'Senior Product Manager': { min: 3500, max: 6500, next: 'Product Lead' },
    'Product Lead': { min: 6500, max: 10000, next: 'Chief Product Officer' },
    'Chief Product Officer': { min: 10000, max: 20000, next: 'Legend' },
  };

  const currentLevelConfig = levelThresholds[profile.careerLevel] || levelThresholds['Product Intern'];
  const progressPercent = Math.min(
    100,
    Math.max(
      0,
      ((profile.xp - currentLevelConfig.min) / (currentLevelConfig.max - currentLevelConfig.min)) * 100
    )
  );

  return (
    <header className="sticky top-0 z-40 w-full bg-[#070913]/90 backdrop-blur-md border-b border-cyan-500/20 px-3 py-2.5 transition-all">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Brand & Tagline */}
        <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-start">
          <div
            onClick={() => {
              soundFx.playSelectBuilding();
              onTabChange('city');
            }}
            className="flex items-center gap-2.5 cursor-pointer group select-none"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-500 via-indigo-600 to-purple-600 p-[1.5px] shadow-neon-cyan">
              <div className="w-full h-full bg-[#070913] rounded-[10px] flex items-center justify-center group-hover:bg-opacity-80 transition-all">
                <Sparkles className="w-5 h-5 text-cyan-400 group-hover:rotate-12 transition-transform" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-display font-extrabold text-base tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-indigo-300 to-purple-400">
                  PRODUCTVERSE
                </span>
                <span className="px-1.5 py-0.2 text-[10px] font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-400/30 rounded">
                  3D
                </span>
              </div>
              <p className="text-[10px] text-slate-400 hidden sm:block tracking-tight font-medium">
                Think Like a PM. Build Like a Founder.
              </p>
            </div>
          </div>

          {/* Quick HUD Metrics (Mobile/Desktop) */}
          <div className="flex items-center gap-2">
            {/* Streak */}
            <div
              title={`${profile.streakDays} Day Learning Streak`}
              className="flex items-center gap-1 px-2 py-1 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold"
            >
              <Flame className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
              <span>{profile.streakDays}d</span>
            </div>

            {/* Virtual Budget */}
            <div
              title="Virtual Product Development Budget"
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold font-mono"
            >
              <Zap className="w-3.5 h-3.5 text-emerald-400" />
              <span>${profile.budgetCredits.toLocaleString()}</span>
            </div>

            {/* XP and Level */}
            <div
              onClick={() => {
                soundFx.playCyberClick();
                onOpenProfile();
              }}
              title={`Click to view Career Progress. ${Math.round(currentLevelConfig.max - profile.xp)} XP to ${currentLevelConfig.next}`}
              className="hidden lg:flex items-center gap-2 px-3 py-1 rounded-lg bg-indigo-950/40 border border-purple-500/30 text-slate-200 text-xs cursor-pointer hover:border-purple-400 transition-all"
            >
              <Award className="w-4 h-4 text-purple-400" />
              <div className="flex flex-col text-left">
                <div className="flex items-center gap-1 font-semibold text-[11px] text-purple-300">
                  <span>{profile.careerLevel}</span>
                  <span className="text-[10px] text-slate-400 font-mono">({profile.xp} XP)</span>
                </div>
                <div className="w-24 h-1.5 bg-slate-800 rounded-full overflow-hidden mt-0.5">
                  <div
                    className="h-full bg-gradient-to-r from-cyan-400 to-purple-500 transition-all duration-500"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex items-center gap-1 overflow-x-auto w-full md:w-auto py-1 scrollbar-none justify-start md:justify-center">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  soundFx.playCyberClick();
                  onTabChange(item.id);
                }}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-gradient-to-r from-cyan-500/20 to-purple-500/20 text-cyan-300 border border-cyan-400/40 shadow-[0_0_12px_rgba(0,247,255,0.2)]'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 border border-transparent'
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Right Action Tools: Nova AI, Sound, Profile, Cloud Sync */}
        <div className="flex items-center gap-2 self-end md:self-auto">
          {/* AI Mentor Button */}
          <button
            onClick={() => {
              soundFx.playSelectBuilding();
              onOpenNova();
            }}
            title="NOVA AI Product Mentor"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-purple-600/30 to-pink-600/30 hover:from-purple-600/50 hover:to-pink-600/50 border border-purple-500/40 text-purple-200 text-xs font-semibold shadow-neon-purple transition-all"
          >
            <Bot className="w-4 h-4 text-pink-400 animate-pulse" />
            <span className="hidden sm:inline">NOVA AI</span>
          </button>

          {/* Sound FX Toggle */}
          <button
            onClick={handleToggleSound}
            title={isMuted ? 'Unmute Audio SFX' : 'Mute Audio SFX'}
            className="p-1.5 rounded-lg bg-slate-900 border border-slate-700 hover:border-cyan-400 text-slate-300 hover:text-cyan-400 transition-all"
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>

          {/* Cloud Sync Status */}
          <button
            onClick={() => {
              soundFx.playCyberClick();
              onOpenCloudSync();
            }}
            title="Database & Cloud Sync Settings"
            className="p-1.5 rounded-lg bg-slate-900 border border-slate-700 hover:border-indigo-400 text-slate-300 hover:text-indigo-400 transition-all"
          >
            <Database className="w-4 h-4" />
          </button>

          {/* Student Profile Avatar */}
          <button
            onClick={() => {
              soundFx.playCyberClick();
              onOpenProfile();
            }}
            title="Student Profile & Achievements"
            className="flex items-center gap-1.5 p-1 rounded-lg bg-slate-900 border border-cyan-500/30 hover:border-cyan-400 transition-all text-xs"
          >
            <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-cyan-400 to-indigo-600 flex items-center justify-center font-bold text-[10px] text-white">
              {profile.name.substring(0, 2).toUpperCase()}
            </div>
            <User className="w-3.5 h-3.5 text-slate-400 hidden sm:block" />
          </button>
        </div>
      </div>
    </header>
  );
};
