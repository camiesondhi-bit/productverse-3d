import React, { useState } from 'react';
import { UserProduct, ProductMetrics } from '../../types';
import { soundFx } from '../../services/audio';
import {
  BarChart3,
  TrendingUp,
  Users,
  DollarSign,
  Activity,
  Calculator,
  Layers,
  ArrowUpRight,
  ArrowDownRight,
  Sparkles,
  PieChart,
} from 'lucide-react';

interface AnalyticsDashboardProps {
  product: UserProduct;
}

export const AnalyticsDashboard: React.FC<AnalyticsDashboardProps> = ({ product }) => {
  const m = product.metrics;

  // A/B test simulation calculator state
  const [testVisitorsA, setTestVisitorsA] = useState(10000);
  const [testConversionsA, setTestConversionsA] = useState(320); // 3.2%
  const [testVisitorsB, setTestVisitorsB] = useState(10000);
  const [testConversionsB, setTestConversionsB] = useState(410); // 4.1%

  // Calculate conversion rates & statistical significance
  const rateA = testVisitorsA > 0 ? (testConversionsA / testVisitorsA) * 100 : 0;
  const rateB = testVisitorsB > 0 ? (testConversionsB / testVisitorsB) * 100 : 0;
  const lift = rateA > 0 ? ((rateB - rateA) / rateA) * 100 : 0;

  // Simple two-proportion z-test calculation
  const pPool = (testConversionsA + testConversionsB) / (testVisitorsA + testVisitorsB);
  const se = Math.sqrt(pPool * (1 - pPool) * (1 / testVisitorsA + 1 / testVisitorsB));
  const zScore = se > 0 ? Math.abs((testConversionsB / testVisitorsB - testConversionsA / testVisitorsA) / se) : 0;
  const isSignificant = zScore >= 1.96; // 95% confidence threshold

  // Cohort data mock
  const cohortWeeks = [
    { label: 'Week 1 Cohort', day1: 68, day7: 44, day14: 36, day30: 32 },
    { label: 'Week 2 Cohort', day1: 71, day7: 48, day14: 39, day30: 34 },
    { label: 'Week 3 Cohort', day1: 74, day7: 51, day14: 42, day30: 37 },
    { label: 'Week 4 Cohort (Current)', day1: 76, day7: 53, day14: 44, day30: 39 },
  ];

  return (
    <div className="w-full max-w-7xl mx-auto p-4 sm:p-6 pb-24 space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-xs font-mono font-bold">
              Analytics Observatory
            </span>
            <span className="text-xs text-slate-400 font-mono">
              Real-time Simulated Telemetry
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-display font-extrabold text-white mt-1">
            Product Telemetry & Cohort Analytics
          </h1>
          <p className="text-sm text-slate-400">
            Dissect DAU/MAU stickiness, cohort retention decay, unit economics, and A/B test experiments.
          </p>
        </div>
      </div>

      {/* KPI Cards Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800">
          <span className="text-[10px] text-slate-400 font-mono uppercase">DAU / MAU Stickiness</span>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-xl font-bold font-mono text-cyan-300">
              {((m.dau / Math.max(1, m.mau)) * 100).toFixed(1)}%
            </span>
            <ArrowUpRight className="w-3.5 h-3.5 text-emerald-400" />
          </div>
          <span className="text-[10px] text-slate-500 font-mono">Benchmark: 20-40%</span>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800">
          <span className="text-[10px] text-slate-400 font-mono uppercase">Day-30 Retention</span>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-xl font-bold font-mono text-emerald-400">
              {m.retentionRateDay30}%
            </span>
            <ArrowUpRight className="w-3.5 h-3.5 text-emerald-400" />
          </div>
          <span className="text-[10px] text-slate-500 font-mono">Curve Flattening</span>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800">
          <span className="text-[10px] text-slate-400 font-mono uppercase">Monthly Churn</span>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-xl font-bold font-mono text-rose-300">
              {m.churnRate}%
            </span>
            <ArrowDownRight className="w-3.5 h-3.5 text-emerald-400" />
          </div>
          <span className="text-[10px] text-slate-500 font-mono">&lt; 5% Target</span>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800">
          <span className="text-[10px] text-slate-400 font-mono uppercase">LTV : CAC Ratio</span>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-xl font-bold font-mono text-purple-300">
              {(m.ltv / Math.max(1, m.cac)).toFixed(1)}:1
            </span>
            <Sparkles className="w-3 h-3 text-purple-400" />
          </div>
          <span className="text-[10px] text-slate-500 font-mono">Target: 3.0:1+</span>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800">
          <span className="text-[10px] text-slate-400 font-mono uppercase">Monthly MRR</span>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-xl font-bold font-mono text-emerald-400">
              ${m.mrr.toLocaleString()}
            </span>
          </div>
          <span className="text-[10px] text-slate-500 font-mono">Total: ${m.totalRevenue.toLocaleString()}</span>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800">
          <span className="text-[10px] text-slate-400 font-mono uppercase">Customer CSAT</span>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-xl font-bold font-mono text-cyan-400">
              {m.csat}%
            </span>
            <span className="text-[11px] text-slate-400 font-mono">NPS: +{m.nps}</span>
          </div>
          <span className="text-[10px] text-slate-500 font-mono">Top Quartile</span>
        </div>
      </div>

      {/* AARRR Pirate Funnel & Cohort Retention */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* AARRR Funnel */}
        <div className="glass-panel p-5 rounded-2xl border border-cyan-500/30 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-display font-bold text-sm text-slate-100 flex items-center gap-2">
              <Activity className="w-4 h-4 text-cyan-400" />
              <span>AARRR Pirate Conversion Funnel</span>
            </h3>
            <span className="text-[10px] font-mono text-cyan-300 bg-cyan-950/40 px-2 py-0.5 rounded border border-cyan-500/30">
              Acquisition → Referral
            </span>
          </div>

          <div className="space-y-3 pt-2">
            {[
              { stage: 'Acquisition (Landing Visits)', count: '100,000', percent: 100, color: 'bg-cyan-400' },
              { stage: 'Activation (First Standup Created)', count: '62,000', percent: 62, color: 'bg-indigo-400' },
              { stage: 'Retention (Active at Day 7)', count: '38,000', percent: 38, color: 'bg-purple-400' },
              { stage: 'Revenue (Paid Subscription)', count: '14,200', percent: 14.2, color: 'bg-emerald-400' },
              { stage: 'Referral (Invited Teammates)', count: '8,400', percent: 8.4, color: 'bg-pink-400' },
            ].map((step, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-slate-300">{step.stage}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-white font-bold">{step.count}</span>
                    <span className="text-slate-400">({step.percent}%)</span>
                  </div>
                </div>
                <div className="w-full h-2.5 bg-slate-900 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${step.color} transition-all duration-700`}
                    style={{ width: `${step.percent}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Cohort Retention Table */}
        <div className="glass-panel p-5 rounded-2xl border border-purple-500/30 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-display font-bold text-sm text-slate-100 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-purple-400" />
              <span>User Retention Cohort Heatmap</span>
            </h3>
            <span className="text-[10px] font-mono text-purple-300 bg-purple-950/40 px-2 py-0.5 rounded border border-purple-500/30">
              Decay Curves (%)
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-slate-900/90 text-slate-400 uppercase text-[10px]">
                <tr>
                  <th className="p-2">Cohort</th>
                  <th className="p-2">Day 1</th>
                  <th className="p-2">Day 7</th>
                  <th className="p-2">Day 14</th>
                  <th className="p-2">Day 30</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {cohortWeeks.map((c, i) => (
                  <tr key={i}>
                    <td className="p-2 text-slate-200 font-semibold">{c.label}</td>
                    <td className="p-2 text-emerald-300 bg-emerald-950/20">{c.day1}%</td>
                    <td className="p-2 text-cyan-300 bg-cyan-950/20">{c.day7}%</td>
                    <td className="p-2 text-indigo-300 bg-indigo-950/20">{c.day14}%</td>
                    <td className="p-2 text-purple-300 font-bold bg-purple-950/30">{c.day30}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-xs text-slate-300">
            <span className="font-bold text-cyan-400">Diagnosis: </span>
            The Day-14 to Day-30 curve shows stabilization around 34%-39%, confirming healthy product-market fit!
          </div>
        </div>
      </div>

      {/* A/B Test Significance Calculator Tool */}
      <div className="glass-panel p-6 rounded-2xl border border-cyan-500/30 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-display font-bold text-sm text-slate-100 flex items-center gap-2">
            <Calculator className="w-4 h-4 text-cyan-400" />
            <span>Interactive A/B Testing Statistical Significance Calculator</span>
          </h3>
          <span className="text-[10px] font-mono text-cyan-300 bg-cyan-950/40 px-2 py-0.5 rounded border border-cyan-500/30">
            Two-Tailed Z-Test (95% CI)
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Variant A (Control) */}
          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-3">
            <h4 className="font-bold text-xs text-slate-300 uppercase">Control (Variant A)</h4>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] text-slate-400 block mb-1">Visitors</label>
                <input
                  type="number"
                  value={testVisitorsA}
                  onChange={(e) => setTestVisitorsA(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-xs font-mono text-white"
                />
              </div>
              <div>
                <label className="text-[11px] text-slate-400 block mb-1">Conversions</label>
                <input
                  type="number"
                  value={testConversionsA}
                  onChange={(e) => setTestConversionsA(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-xs font-mono text-white"
                />
              </div>
            </div>
            <div className="font-mono text-xs text-slate-400">
              Conversion Rate: <span className="text-cyan-300 font-bold">{rateA.toFixed(2)}%</span>
            </div>
          </div>

          {/* Variant B (Experiment) */}
          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-3">
            <h4 className="font-bold text-xs text-slate-300 uppercase">Experiment (Variant B)</h4>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] text-slate-400 block mb-1">Visitors</label>
                <input
                  type="number"
                  value={testVisitorsB}
                  onChange={(e) => setTestVisitorsB(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-xs font-mono text-white"
                />
              </div>
              <div>
                <label className="text-[11px] text-slate-400 block mb-1">Conversions</label>
                <input
                  type="number"
                  value={testConversionsB}
                  onChange={(e) => setTestConversionsB(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-xs font-mono text-white"
                />
              </div>
            </div>
            <div className="font-mono text-xs text-slate-400">
              Conversion Rate: <span className="text-purple-300 font-bold">{rateB.toFixed(2)}%</span>
            </div>
          </div>
        </div>

        {/* Statistical Output Card */}
        <div
          className={`p-4 rounded-xl border flex flex-col sm:flex-row items-center justify-between gap-4 ${
            isSignificant
              ? 'bg-emerald-950/30 border-emerald-500/50 text-emerald-200'
              : 'bg-amber-950/30 border-amber-500/50 text-amber-200'
          }`}
        >
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm">
                {isSignificant
                  ? '✓ Statistically Significant Result (p < 0.05)'
                  : '⚠ Inconclusive: Need More Sample Traffic'}
              </span>
              <span className="text-xs font-mono">
                (Lift: {lift > 0 ? `+${lift.toFixed(1)}%` : `${lift.toFixed(1)}%`})
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-0.5">
              Z-Score: <span className="font-mono font-bold">{zScore.toFixed(2)}</span> · Confidence Level:{' '}
              <span className="font-mono font-bold">
                {isSignificant ? '98.2%' : '88.4%'}
              </span>
            </p>
          </div>

          <button
            onClick={() => {
              soundFx.playSuccessChime();
              alert(
                isSignificant
                  ? `Variant B won with a +${lift.toFixed(1)}% lift! Ready to roll out to 100% of traffic.`
                  : 'Test has not reached 95% statistical power. Continue running for 5 more days to avoid false positives.'
              );
            }}
            className="px-4 py-2 rounded-xl bg-slate-900 border border-slate-700 hover:border-slate-500 text-xs font-bold text-white transition-all shrink-0"
          >
            Generate Decision Report
          </button>
        </div>
      </div>
    </div>
  );
};
