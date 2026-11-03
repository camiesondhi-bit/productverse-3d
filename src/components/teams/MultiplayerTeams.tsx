import React, { useState } from 'react';
import {
  TeamMember,
  TeamMessage,
  StudentProfile,
  UserProduct,
} from '../../types';
import { soundFx } from '../../services/audio';
import {
  Users2,
  Send,
  MessageSquare,
  Award,
  Kanban,
  CheckCircle2,
  Sparkles,
  Bot,
  Zap,
} from 'lucide-react';

interface MultiplayerTeamsProps {
  teamMembers: TeamMember[];
  teamMessages: TeamMessage[];
  profile: StudentProfile;
  product: UserProduct;
  onSendMessage: (msg: TeamMessage) => void;
  onUpdateTeamMemberTask: (memberId: string, newTask: string) => void;
}

export const MultiplayerTeams: React.FC<MultiplayerTeamsProps> = ({
  teamMembers,
  teamMessages,
  profile,
  product,
  onSendMessage,
  onUpdateTeamMemberTask,
}) => {
  const [selectedRole, setSelectedRole] = useState<TeamMember['role']>('Product Manager');
  const [inputMessage, setInputMessage] = useState('');

  const handlePostMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    soundFx.playCyberClick();
    const newMsg: TeamMessage = {
      id: `msg-${Date.now()}`,
      authorId: profile.id,
      authorName: `${profile.name} (${selectedRole})`,
      authorRole: selectedRole,
      content: inputMessage,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    onSendMessage(newMsg);
    setInputMessage('');
    soundFx.playSuccessChime();
  };

  const roleDescriptions: Record<TeamMember['role'], { focus: string; superpowers: string[] }> = {
    'Product Manager': {
      focus: 'Product vision, customer problem discovery, RICE prioritization & roadmap alignment.',
      superpowers: ['Prioritization veto', 'PRD authoring', 'Stakeholder consensus'],
    },
    'UI/UX Designer': {
      focus: 'User empathy, Figma prototypes, interaction heuristics & usability friction elimination.',
      superpowers: ['Wireframe drafting', 'Design system tokens', 'Usability testing'],
    },
    'Developer': {
      focus: 'System architecture, API contracts, database schema design, and clean sprint delivery.',
      superpowers: ['Technical feasibility sizing', 'Zero-downtime deploys', 'Test automation'],
    },
    'Business Analyst': {
      focus: 'Data pipelines, cohort analysis, metric telemetry, TAM market sizing & financial models.',
      superpowers: ['SQL & Mixpanel queries', 'LTV:CAC modeling', 'Funnel drop-off diagnosis'],
    },
    'Product Marketing Manager': {
      focus: 'Positioning, launch messaging, Product Hunt playbooks, pricing fences & viral acquisition.',
      superpowers: ['April Dunford positioning', 'Campaign orchestration', 'Customer advocacy'],
    },
  };

  return (
    <div className="w-full max-w-7xl mx-auto p-4 sm:p-6 pb-24 space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-400/30 text-xs font-mono font-bold">
              Multiplayer Product Squad
            </span>
            <span className="text-xs text-slate-400 font-mono">
              Squad Alpha · 5 Active Team Disciplines
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-display font-extrabold text-white mt-1">
            Collaborative Product Teams
          </h1>
          <p className="text-sm text-slate-400">
            Switch perspectives between PM, Design, Engineering, Analytics, and PMM to experience true cross-functional alignment.
          </p>
        </div>
      </div>

      {/* Role Switcher Toolbar */}
      <div className="glass-panel p-4 rounded-2xl border border-cyan-500/30 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">
            Switch Your Active Squad Role:
          </span>
          <span className="text-xs font-mono text-cyan-400">
            Playing as: <strong className="text-white">{selectedRole}</strong>
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
          {(
            [
              'Product Manager',
              'UI/UX Designer',
              'Developer',
              'Business Analyst',
              'Product Marketing Manager',
            ] as const
          ).map((role) => {
            const isSelected = selectedRole === role;
            return (
              <button
                key={role}
                onClick={() => {
                  soundFx.playCyberClick();
                  setSelectedRole(role);
                }}
                className={`p-3 rounded-xl border text-left transition-all ${
                  isSelected
                    ? 'bg-gradient-to-r from-cyan-500/20 to-purple-500/20 border-cyan-400 text-cyan-300 shadow-neon-cyan'
                    : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:border-slate-700'
                }`}
              >
                <p className="font-bold text-xs truncate">{role}</p>
                <p className="text-[10px] text-slate-400 line-clamp-1 mt-0.5">
                  {roleDescriptions[role].superpowers[0]}
                </p>
              </button>
            );
          })}
        </div>

        <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 text-xs text-slate-300 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
          <div>
            <span className="font-bold text-cyan-400">{selectedRole} Focus: </span>
            {roleDescriptions[selectedRole].focus}
          </div>
          <div className="flex items-center gap-1.5 shrink-0">
            {roleDescriptions[selectedRole].superpowers.map((sp, idx) => (
              <span
                key={idx}
                className="px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30 text-[10px] font-mono"
              >
                ★ {sp}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Main Squad Area: Roster on left, Live Chat on right */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Team Roster & Contribution */}
        <div className="space-y-4">
          <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-4">
            <h3 className="font-display font-bold text-sm text-slate-100 flex items-center justify-between">
              <span>Squad Members</span>
              <span className="text-xs font-mono text-emerald-400">Team Velocity: 92%</span>
            </h3>

            <div className="space-y-3">
              {teamMembers.map((member) => (
                <div
                  key={member.id}
                  className="p-3 rounded-xl bg-slate-900/80 border border-slate-800/80 space-y-2 hover:border-cyan-500/40 transition-all"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <img
                        src={member.avatar}
                        alt={member.name}
                        className="w-9 h-9 rounded-full object-cover border border-slate-700"
                      />
                      <div>
                        <h4 className="font-bold text-xs text-slate-100">{member.name}</h4>
                        <p className="text-[10px] text-cyan-300 font-medium">{member.role}</p>
                      </div>
                    </div>
                    <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-500/30">
                      {member.status}
                    </span>
                  </div>

                  <p className="text-[11px] text-slate-300 bg-slate-950 p-2 rounded-lg leading-relaxed">
                    🎯 <span className="font-semibold text-slate-400">Current Task:</span>{' '}
                    {member.currentTask}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Live Team Discussion & Backlog Coordination (Right 2 cols) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="glass-panel p-5 rounded-2xl border border-slate-800 flex flex-col h-[520px]">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-cyan-400" />
                <h3 className="font-display font-bold text-sm text-slate-100">
                  #sprint-alignment-room
                </h3>
              </div>
              <span className="text-[10px] font-mono text-slate-400">
                Connected to {product.name}
              </span>
            </div>

            {/* Message Stream */}
            <div className="flex-1 overflow-y-auto p-3 space-y-3">
              {teamMessages.map((msg) => (
                <div key={msg.id} className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-xs space-y-1">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-100">{msg.authorName}</span>
                      <span className="text-[10px] px-1.5 py-0.2 rounded bg-purple-500/20 text-purple-300 font-mono">
                        {msg.authorRole}
                      </span>
                    </div>
                    <span className="text-[10px] text-slate-500 font-mono">{msg.timestamp}</span>
                  </div>
                  <p className="text-slate-300 leading-relaxed">{msg.content}</p>
                </div>
              ))}
            </div>

            {/* Send Message Form */}
            <form onSubmit={handlePostMessage} className="pt-3 border-t border-slate-800 flex items-center gap-2">
              <input
                type="text"
                placeholder={`Post as ${selectedRole}... e.g. "Let's review the RICE scores before sprint cutoff!"`}
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                className="flex-1 bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-400"
              />
              <button
                type="submit"
                className="px-4 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-neon-cyan transition-all"
              >
                <span>Post</span>
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
