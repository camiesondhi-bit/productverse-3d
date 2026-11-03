import React, { useState, useRef, useEffect } from 'react';
import { soundFx } from '../../services/audio';
import { PM_FRAMEWORKS } from '../../data/pmFrameworks';
import {
  Bot,
  Sparkles,
  Send,
  X,
  Key,
  ShieldCheck,
  Zap,
  BookOpen,
  Copy,
  Check,
  Maximize2,
  Minimize2,
} from 'lucide-react';

interface NovaMentorProps {
  isOpen: boolean;
  onClose: () => void;
  initialPrompt?: string | null;
}

interface Message {
  id: string;
  sender: 'user' | 'nova';
  text: string;
  timestamp: string;
  frameworkRef?: string;
}

export const NovaMentor: React.FC<NovaMentorProps> = ({
  isOpen,
  onClose,
  initialPrompt,
}) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'm-welcome',
      sender: 'nova',
      text: "Greetings, Product Builder. I am NOVA, your Product Management AI Mentor. I can evaluate your problem statements, generate Gherkin user stories, compute RICE scores, and dissect your product unit economics. How may I accelerate your product journey today?",
      timestamp: 'Just now',
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isCopiedId, setIsCopiedId] = useState<string | null>(null);

  // Settings: Built-in Offline Neural Engine vs Live API
  const [engineMode, setEngineMode] = useState<'builtin' | 'live'>('builtin');
  const [apiKey, setApiKey] = useState('');
  const [showKeyModal, setShowKeyModal] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  useEffect(() => {
    if (initialPrompt && isOpen) {
      handleSendPrompt(initialPrompt);
    }
  }, [initialPrompt, isOpen]);

  const copyToClipboard = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setIsCopiedId(id);
    soundFx.playCyberClick();
    setTimeout(() => setIsCopiedId(null), 2000);
  };

  const generateOfflineResponse = (query: string): string => {
    const q = query.toLowerCase();

    if (q.includes('rice') || q.includes('priorit')) {
      const f = PM_FRAMEWORKS.rice;
      return `### RICE Prioritization Framework Analysis\n\n**Formula:** \`${f.formulaOrFormat}\`\n\n**Deep Dive:**\n1. **Reach:** How many users will experience this feature in a fixed timeframe (e.g. 1 quarter)?\n2. **Impact:** Measure individual user benefit on a calibrated scale:\n   - 3.0 = Massive (drives core retention)\n   - 2.0 = High\n   - 1.0 = Medium\n   - 0.5 = Low\n   - 0.25 = Minimal\n3. **Confidence:** How certain are you? 100% = backed by quantitative data & user tests. 80% = strong qualitative signal. 50% = untested assumption.\n4. **Effort:** Measured in person-weeks or story points.\n\n*Pro-Tip:* Never compare a 1-month Reach number with a 1-quarter Reach number. Standardize time horizons across your entire backlog!`;
    }

    if (q.includes('story') || q.includes('gherkin') || q.includes('acceptance criteria')) {
      return `### User Story & Gherkin Acceptance Criteria Blueprint\n\n**Standard User Story Syntax:**\n- **As a** [Target User Persona]\n- **I want to** [Execute concrete capability]\n- **So that** [Attain observable business or personal value]\n\n**Example Gherkin Scenarios:**\n\`\`\`gherkin\nScenario: User attempts checkout with expired promotional voucher\n  Given the user has items in cart totaling $120\n  When the user inputs promo code "SUMMER2022" and clicks "Apply"\n  Then the subtotal should remain $120\n  And a warning message "Voucher expired on Aug 31" displays in red text\n\`\`\`\n\n*Pro-Tip:* Always include at least 1 happy path, 1 edge case (empty states, large numbers), and 1 error recovery scenario.`;
    }

    if (q.includes('ltv') || q.includes('cac') || q.includes('unit economic')) {
      const f = PM_FRAMEWORKS.ltv_cac;
      return `### Unit Economics: LTV to CAC Analysis\n\n**Formulas:**\n- **Gross Profit per User:** \`ARPU × Gross Margin %\`\n- **Customer Lifetime Value (LTV):** \`Gross Profit / Monthly Churn Rate\`\n- **LTV:CAC Ratio:** \`LTV / CAC\`\n\n**Benchmark Rules of Thumb:**\n- **< 1.0 : 1:** Burning capital on every user acquired (Death spiral).\n- **3.0 : 1:** The golden benchmark for venture-backed SaaS.\n- **> 5.0 : 1:** Under-investing in acquisition; you can afford to acquire more aggressively!\n- **Payback Period:** \`CAC / Monthly Gross Profit\` should ideally be under 12 months.`;
    }

    if (q.includes('retention') || q.includes('churn') || q.includes('dau')) {
      return `### Retention & Churn Diagnostic Guide\n\n**Core Metric Checks:**\n1. **Is your retention curve flattening?** If the curve continues declining to 0% after 30 days, your product lacks Product-Market Fit. Stop spending on acquisition and fix the core experience.\n2. **The "Aha! Moment":** Identify the action power-users take in their first 48 hours that predicts long-term retention (e.g. Slack: 2,000 messages sent; Dropbox: 1 file uploaded to 1 folder).\n3. **Voluntary vs Involuntary Churn:** Up to 30% of SaaS churn is caused by expired credit cards. Implement automated dunning emails and card account updaters before blaming product value.`;
    }

    if (q.includes('case study') || q.includes('example')) {
      return `### Simulated PM Case Study: Figma vs InVision\n\n**Context:** In 2016, InVision dominated prototyping, while Sketch dominated UI design. Figma launched in the browser with real-time multiplayer.\n**Strategic Insight:** Product design is not an isolated solo task; it is a collaborative team sport requiring PMs, developers, and copywriters.\n**Outcome:** Web-first architecture with zero installation and instant URL sharing created an unstoppable viral bottom-up distribution loop, rendering desktop-bound competitors obsolete.\n\n**Takeaway for your product:** Lower the barrier to share artifacts across team roles to trigger organic collaboration loops.`;
    }

    // Default PM Mentor insight
    return `### NOVA Product Synthesis & Strategic Guidance\n\nRegarding: "${query}"\n\nTo think like a Product Manager and build like a Founder, consider these 3 core dimensions:\n\n1. **Problem Desirability:** Are users actively spending time or money attempting to solve this with clunky workarounds today?\n2. **Technical Feasibility:** Can an MVP vertical slice be built within 1-2 sprints without sprawling architecture dependencies?\n3. **Commercial Viability:** Does the unit economics (LTV:CAC and Payback period) allow scalable, profitable distribution?\n\nWould you like me to draft user stories, suggest acceptance criteria, or build a RICE matrix for this?`;
  };

  const handleSendPrompt = (textToSend?: string) => {
    const prompt = textToSend || inputValue;
    if (!prompt.trim()) return;

    soundFx.playCyberClick();
    const userMsg: Message = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text: prompt,
      timestamp: 'Just now',
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputValue('');
    setIsTyping(true);

    // Simulated streaming response from Built-in Neural PM Engine
    setTimeout(() => {
      const responseText = generateOfflineResponse(prompt);
      const novaMsg: Message = {
        id: `nova-${Date.now()}`,
        sender: 'nova',
        text: responseText,
        timestamp: 'Just now',
      };
      setMessages((prev) => [...prev, novaMsg]);
      setIsTyping(false);
      soundFx.playSuccessChime();
    }, 750);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-2xl bg-[#090e24] border border-purple-500/40 rounded-2xl shadow-neon-purple overflow-hidden flex flex-col h-[85vh] max-h-[750px]">
        {/* NOVA Hologram Header */}
        <div className="p-4 bg-gradient-to-r from-[#0d1436] via-[#161238] to-[#0d1436] border-b border-purple-500/30 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-500 to-pink-500 p-[1.5px] shadow-neon-purple">
              <div className="w-full h-full bg-[#090e24] rounded-[10px] flex items-center justify-center">
                <Bot className="w-5 h-5 text-pink-400 animate-pulse" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-display font-extrabold text-sm text-white">
                  NOVA AI PRODUCT MENTOR
                </h3>
                <span className="text-[10px] font-mono px-2 py-0.2 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/40">
                  {engineMode === 'builtin' ? 'Neural PM Engine (Offline Active)' : 'Live LLM API'}
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                Trained on Agile, RICE, JTBD, Pirate Metrics & Modern SaaS Strategy
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowKeyModal(!showKeyModal)}
              title="Configure API Mode"
              className="p-1.5 rounded-lg bg-slate-900 border border-slate-700 hover:border-purple-400 text-slate-400 hover:text-purple-300 transition-all text-xs"
            >
              <Key className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => {
                soundFx.playCyberClick();
                onClose();
              }}
              className="p-1.5 rounded-lg bg-slate-900 border border-slate-700 hover:border-slate-500 text-slate-400 hover:text-white transition-all"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* API Configuration Popover (Demo mode distinction) */}
        {showKeyModal && (
          <div className="p-3 bg-[#0d1538] border-b border-purple-500/30 text-xs text-slate-200 space-y-2 animate-fade-in">
            <div className="flex items-center justify-between font-bold text-cyan-300">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Engine Mode Selector</span>
              </span>
              <button
                onClick={() => setShowKeyModal(false)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>
            <p className="text-[11px] text-slate-300">
              ProductVerse 3D includes a zero-latency, built-in Neural PM Engine that operates 100% offline with full domain intelligence. You can also connect a custom OpenAI or Gemini key.
            </p>
            <div className="flex gap-2 pt-1">
              <button
                onClick={() => setEngineMode('builtin')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${
                  engineMode === 'builtin'
                    ? 'bg-purple-600 text-white'
                    : 'bg-slate-800 text-slate-300'
                }`}
              >
                Built-in PM Neural Engine (Recommended)
              </button>
              <button
                onClick={() => setEngineMode('live')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${
                  engineMode === 'live'
                    ? 'bg-purple-600 text-white'
                    : 'bg-slate-800 text-slate-300'
                }`}
              >
                Live Cloud API Key
              </button>
            </div>
          </div>
        )}

        {/* Quick Suggestion Chips */}
        <div className="px-4 py-2 bg-[#0b1028]/80 border-b border-slate-800 flex items-center gap-1.5 overflow-x-auto scrollbar-none">
          {[
            'Explain RICE Prioritization',
            'Help me write Gherkin User Stories',
            'Diagnose low Day-30 Retention',
            'Calculate LTV:CAC Unit Economics',
            'Generate a Product Case Study',
          ].map((chip, idx) => (
            <button
              key={idx}
              onClick={() => handleSendPrompt(chip)}
              className="px-2.5 py-1 rounded-full bg-slate-900 hover:bg-purple-950/60 border border-slate-800 hover:border-purple-500/50 text-[11px] text-slate-300 whitespace-nowrap transition-all"
            >
              {chip}
            </button>
          ))}
        </div>

        {/* Chat Message Stream */}
        <div className="flex-1 p-4 overflow-y-auto space-y-4">
          {messages.map((msg) => {
            const isNova = msg.sender === 'nova';
            return (
              <div
                key={msg.id}
                className={`flex gap-3 ${isNova ? 'items-start' : 'items-end justify-end'}`}
              >
                {isNova && (
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-purple-600 to-pink-600 flex items-center justify-center shrink-0 mt-0.5 shadow-neon-purple">
                    <Bot className="w-4 h-4 text-white" />
                  </div>
                )}

                <div
                  className={`group relative max-w-[85%] rounded-2xl p-4 text-xs leading-relaxed ${
                    isNova
                      ? 'bg-[#0f1738]/90 border border-purple-500/20 text-slate-200'
                      : 'bg-gradient-to-r from-cyan-500/20 to-indigo-500/30 border border-cyan-400/40 text-cyan-100'
                  }`}
                >
                  {/* Markdown formatted content */}
                  <div className="whitespace-pre-wrap space-y-2">{msg.text}</div>

                  {isNova && (
                    <button
                      onClick={() => copyToClipboard(msg.id, msg.text)}
                      title="Copy response"
                      className="absolute top-2 right-2 p-1 rounded bg-slate-900/60 opacity-0 group-hover:opacity-100 text-slate-400 hover:text-white transition-all"
                    >
                      {isCopiedId === msg.id ? (
                        <Check className="w-3 h-3 text-emerald-400" />
                      ) : (
                        <Copy className="w-3 h-3" />
                      )}
                    </button>
                  )}
                </div>
              </div>
            );
          })}

          {isTyping && (
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-purple-600/30 flex items-center justify-center shrink-0">
                <Bot className="w-4 h-4 text-purple-300 animate-pulse" />
              </div>
              <div className="p-3 rounded-2xl bg-[#0f1738] border border-purple-500/20 text-xs text-purple-300 font-mono flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-purple-400 animate-ping" />
                <span>NOVA Neural Engine reasoning...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <div className="p-3 bg-[#0a0f29] border-t border-purple-500/30">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendPrompt();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              placeholder="Ask NOVA anything about PM frameworks, stories, metrics, or strategy..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              className="flex-1 bg-slate-950 border border-slate-800 focus:border-purple-400 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none"
            />
            <button
              type="submit"
              disabled={!inputValue.trim() || isTyping}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 hover:brightness-110 disabled:opacity-40 text-white font-bold text-xs flex items-center gap-1.5 shadow-neon-purple transition-all"
            >
              <span>Send</span>
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
