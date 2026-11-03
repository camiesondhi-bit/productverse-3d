import React, { useRef } from 'react';
import {
  StudentProfile,
  AchievementBadge,
  WeeklyMission,
  CareerLevel,
} from '../../types';
import { soundFx } from '../../services/audio';
import {
  exportProductVerseStateAsJSON,
  importProductVerseStateFromJSON,
} from '../../services/storage';
import {
  Award,
  X,
  Sparkles,
  Flame,
  CheckCircle2,
  Download,
  Upload,
  RotateCcw,
  Shield,
  Zap,
} from 'lucide-react';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: StudentProfile;
  badges: AchievementBadge[];
  missions: WeeklyMission[];
  onReloadState: () => void;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({
  isOpen,
  onClose,
  profile,
  badges,
  missions,
  onReloadState,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleExportJSON = () => {
    soundFx.playSuccessChime();
    const jsonStr = exportProductVerseStateAsJSON();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `productverse-state-${profile.name.toLowerCase().replace(/\s+/g, '-')}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportJSON = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      const content = evt.target?.result as string;
      if (content) {
        const success = importProductVerseStateFromJSON(content);
        if (success) {
          soundFx.playLevelUp();
          alert('Profile & Product state restored successfully!');
          onReloadState();
          onClose();
        } else {
          alert('Invalid backup JSON format.');
        }
      }
    };
    reader.readAsText(file);
  };

  const careerLevels: { level: CareerLevel; xpReq: number }[] = [
    { level: 'Product Intern', xpReq: 0 },
    { level: 'Associate Product Manager', xpReq: 500 },
    { level: 'Product Manager', xpReq: 1500 },
    { level: 'Senior Product Manager', xpReq: 3500 },
    { level: 'Product Lead', xpReq: 6500 },
    { level: 'Chief Product Officer', xpReq: 10000 },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-3xl bg-[#090e24] border border-cyan-500/40 rounded-3xl shadow-neon-cyan overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-5 bg-gradient-to-r from-[#0d1436] via-[#141b40] to-[#0d1436] border-b border-cyan-500/30 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-cyan-400 to-indigo-600 flex items-center justify-center font-bold text-lg text-white shadow-neon-cyan">
              {profile.name.substring(0, 2).toUpperCase()}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-display font-extrabold text-base text-white">
                  {profile.name}
                </h3>
                <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-400/40">
                  {profile.careerLevel}
                </span>
              </div>
              <p className="text-xs text-slate-400 font-mono">
                {profile.xp} XP Accumulated · {profile.streakDays} Day Streak · ${profile.budgetCredits.toLocaleString()} Budget
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              soundFx.playCyberClick();
              onClose();
            }}
            className="p-2 rounded-xl bg-slate-900 border border-slate-700 hover:border-slate-500 text-slate-400 hover:text-white transition-all"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 p-5 overflow-y-auto space-y-6">
          {/* Career Ladder Progress */}
          <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-3">
            <h4 className="font-bold text-xs uppercase tracking-wider text-slate-300 flex items-center gap-2">
              <Award className="w-4 h-4 text-purple-400" />
              <span>Product Manager Career Progression Hierarchy</span>
            </h4>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 pt-1">
              {careerLevels.map((cl, i) => {
                const isUnlocked = profile.xp >= cl.xpReq;
                const isCurrent = profile.careerLevel === cl.level;
                return (
                  <div
                    key={i}
                    className={`p-2.5 rounded-xl border text-center transition-all ${
                      isCurrent
                        ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300 shadow-neon-cyan'
                        : isUnlocked
                        ? 'bg-purple-950/30 border-purple-500/40 text-purple-200'
                        : 'bg-slate-950 border-slate-800 text-slate-500'
                    }`}
                  >
                    <span className="text-[10px] font-mono block">
                      {cl.xpReq === 0 ? 'START' : `${cl.xpReq} XP`}
                    </span>
                    <p className="font-bold text-[11px] truncate mt-0.5">{cl.level}</p>
                    {isCurrent && (
                      <span className="text-[9px] font-mono font-bold text-cyan-400 uppercase">
                        Current
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Achievement Badges Grid */}
          <div className="space-y-3">
            <h4 className="font-bold text-xs uppercase tracking-wider text-slate-300 flex items-center justify-between">
              <span>Executive Achievement Badges ({badges.length})</span>
              <span className="text-xs font-mono text-cyan-400">
                {profile.unlockedBadgeIds.length} Unlocked
              </span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {badges.map((b) => {
                const isUnlocked = profile.unlockedBadgeIds.includes(b.id);
                return (
                  <div
                    key={b.id}
                    className={`p-3 rounded-xl border flex items-center gap-3 transition-all ${
                      isUnlocked
                        ? 'bg-[#0f1738]/90 border-purple-500/40 text-slate-200 shadow-neon-purple'
                        : 'bg-slate-950/60 border-slate-800/80 text-slate-500 opacity-60'
                    }`}
                  >
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 text-sm font-bold border ${
                        isUnlocked
                          ? 'bg-purple-500/20 text-purple-300 border-purple-500/50'
                          : 'bg-slate-900 text-slate-600 border-slate-800'
                      }`}
                    >
                      <Sparkles className="w-5 h-5" />
                    </div>
                    <div>
                      <h5 className="font-bold text-xs text-slate-100">{b.title}</h5>
                      <p className="text-[11px] text-slate-400 mt-0.5 leading-snug">
                        {b.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Weekly Missions Checklist */}
          <div className="space-y-3">
            <h4 className="font-bold text-xs uppercase tracking-wider text-slate-300 flex items-center gap-2">
              <Flame className="w-4 h-4 text-amber-400" />
              <span>Active Weekly Product Missions</span>
            </h4>

            <div className="space-y-2">
              {missions.map((m) => (
                <div
                  key={m.id}
                  className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between gap-3 text-xs"
                >
                  <div className="space-y-1">
                    <p className="font-semibold text-slate-200">{m.title}</p>
                    <p className="text-[11px] text-slate-400">{m.description}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="font-mono text-cyan-300 font-bold">+{m.xpReward} XP</span>
                    <p className="text-[10px] text-slate-400 font-mono">
                      {m.currentCount} / {m.targetCount} Complete
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Backup, Export & Import Data Section */}
          <div className="pt-4 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <button
                onClick={handleExportJSON}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs font-semibold text-slate-200 transition-all"
              >
                <Download className="w-3.5 h-3.5 text-cyan-400" />
                <span>Export Progress JSON</span>
              </button>

              <button
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs font-semibold text-slate-200 transition-all"
              >
                <Upload className="w-3.5 h-3.5 text-purple-400" />
                <span>Import Backup</span>
              </button>

              <input
                ref={fileInputRef}
                type="file"
                accept=".json"
                className="hidden"
                onChange={handleImportJSON}
              />
            </div>

            <button
              onClick={() => {
                if (confirm('Reset all ProductVerse 3D data to initial factory defaults?')) {
                  localStorage.clear();
                  window.location.reload();
                }
              }}
              className="text-xs text-rose-400 hover:text-rose-300 underline font-mono"
            >
              Reset to Factory State
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
