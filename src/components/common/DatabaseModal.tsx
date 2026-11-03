import React, { useState } from 'react';
import {
  getSupabaseConfig,
  saveSupabaseConfig,
  testSupabaseConnection,
  SupabaseConfig,
} from '../../services/supabase';
import { soundFx } from '../../services/audio';
import {
  Database,
  X,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  HardDrive,
  Cloud,
} from 'lucide-react';

interface DatabaseModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DatabaseModal: React.FC<DatabaseModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [config, setConfig] = useState<SupabaseConfig>(getSupabaseConfig());
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);

  if (!isOpen) return null;

  const handleTestAndSave = async (e: React.FormEvent) => {
    e.preventDefault();
    soundFx.playCyberClick();
    setTesting(true);
    setTestResult(null);

    if (!config.url || !config.anonKey) {
      // Just save local offline mode
      saveSupabaseConfig({ ...config, isEnabled: false });
      setTestResult({
        success: true,
        message: 'Saved in Local Offline-First Mode! All data persists in browser LocalStorage.',
      });
      setTesting(false);
      return;
    }

    const res = await testSupabaseConnection(config.url, config.anonKey);
    setTesting(false);
    setTestResult(res);

    if (res.success) {
      soundFx.playSuccessChime();
      saveSupabaseConfig({
        ...config,
        isEnabled: true,
        lastSyncedAt: new Date().toISOString(),
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-lg bg-[#090e24] border border-indigo-500/40 rounded-3xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-4 bg-gradient-to-r from-[#0d1436] via-[#12193b] to-[#0d1436] border-b border-indigo-500/30 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Database className="w-5 h-5 text-indigo-400" />
            <h3 className="font-display font-bold text-sm text-white">
              Data Storage & Cloud Sync Settings
            </h3>
          </div>
          <button
            onClick={() => {
              soundFx.playCyberClick();
              onClose();
            }}
            className="p-1.5 rounded-lg bg-slate-900 border border-slate-700 text-slate-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleTestAndSave} className="p-5 space-y-4">
          <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-2 text-xs text-slate-300">
            <div className="flex items-center gap-2 text-emerald-400 font-bold">
              <HardDrive className="w-4 h-4" />
              <span>Offline-First Storage Active</span>
            </div>
            <p className="leading-relaxed text-[11px] text-slate-400">
              ProductVerse 3D persists your user personas, features, RICE scores, simulations, and career XP automatically in local storage. Optional Supabase integration enables real-time cloud sync across browsers.
            </p>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1">
              Supabase Project URL (Optional)
            </label>
            <input
              type="text"
              placeholder="https://xyzcompany.supabase.co"
              value={config.url}
              onChange={(e) => setConfig({ ...config, url: e.target.value })}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-indigo-400"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1">
              Supabase Anon Public API Key (Optional)
            </label>
            <input
              type="password"
              placeholder="eyJhbGciOiJIUzI1NiIsIn..."
              value={config.anonKey}
              onChange={(e) => setConfig({ ...config, anonKey: e.target.value })}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-indigo-400"
            />
          </div>

          {testResult && (
            <div
              className={`p-3 rounded-xl border text-xs flex items-center gap-2 ${
                testResult.success
                  ? 'bg-emerald-950/40 border-emerald-500 text-emerald-300'
                  : 'bg-rose-950/40 border-rose-500 text-rose-300'
              }`}
            >
              {testResult.success ? (
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
              ) : (
                <AlertTriangle className="w-4 h-4 shrink-0 text-rose-400" />
              )}
              <span>{testResult.message}</span>
            </div>
          )}

          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
            >
              Close
            </button>
            <button
              type="submit"
              disabled={testing}
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-400 hover:to-purple-500 disabled:opacity-50 text-white font-bold text-xs flex items-center gap-1.5 shadow-neon-purple transition-all"
            >
              {testing ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Testing Connection...</span>
                </>
              ) : (
                <>
                  <Cloud className="w-3.5 h-3.5" />
                  <span>Save Configuration</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
