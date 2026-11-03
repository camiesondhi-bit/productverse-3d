export interface FrameworkDoc {
  name: string;
  tagline: string;
  category: string;
  formulaOrFormat?: string;
  explanation: string;
  example: string;
  proTips: string[];
}

export const PM_FRAMEWORKS: { [key: string]: FrameworkDoc } = {
  rice: {
    name: 'RICE Prioritization Framework',
    tagline: 'Quantify roadmap value vs engineering cost',
    category: 'Prioritization',
    formulaOrFormat: 'Score = (Reach × Impact × Confidence) / Effort',
    explanation: 'Created by Intercom to minimize bias in product decision making. Reach measures target customers over a period; Impact measures qualitative lift (0.25 to 3); Confidence measures certainty (50% to 100%); Effort measures person-weeks or story points.',
    example: 'Feature: One-click Checkout. Reach = 5,000 users/mo. Impact = 2 (High). Confidence = 80% (0.8). Effort = 2 weeks. RICE = (5000 × 2 × 0.8) / 2 = 4,000.',
    proTips: [
      'Use the same timeframe (e.g. 1 quarter) for Reach across all scored features.',
      'Discount confidence to 50% if you lack direct user interviews or prototype data.',
    ],
  },
  jtbd: {
    name: 'Jobs To Be Done (JTBD)',
    tagline: 'Understand the underlying causal driver of user behavior',
    category: 'Discovery',
    formulaOrFormat: 'When [Situation], I want to [Motivation/Action], so I can [Expected Outcome].',
    explanation: 'Popularized by Harvard Professor Clayton Christensen. People do not simply buy products; they hire them to make progress in specific circumstances.',
    example: 'When I am commuting on a crowded subway, I want to listen to bite-sized 5-minute audio summaries of PM books, so I can learn productively without holding a physical book.',
    proTips: [
      'Separate the functional job (save time) from emotional (feel competent) and social jobs (look smart to peers).',
      'The biggest competitor is often customer inertia or "doing nothing".',
    ],
  },
  aarrr: {
    name: 'Pirate Metrics (AARRR)',
    tagline: 'The full-funnel behavioral lifecycle',
    category: 'Analytics',
    formulaOrFormat: 'Acquisition → Activation → Retention → Revenue → Referral',
    explanation: 'Formulated by Dave McClure. Guides PMs through user progression from initial landing to word-of-mouth advocacy.',
    example: 'Activation = User successfully launches their first simulated product within 10 minutes of signup.',
    proTips: [
      'Define an unambiguous "Aha! Moment" for Activation.',
      'Retention is the foundation; never pour budget into Acquisition if Retention is leaking.',
    ],
  },
  moscow: {
    name: 'MoSCoW Prioritization',
    tagline: 'Scope management for sprint and MVP releases',
    category: 'Agile',
    formulaOrFormat: 'Must Have | Should Have | Could Have | Won\'t Have (this time)',
    explanation: 'Used to negotiate sprint or MVP boundaries with stakeholders when time or budget is capped.',
    example: 'Must Have: Credit card processing. Should Have: Apple Pay. Could Have: Crypto payment. Won\'t Have: In-person cash collection.',
    proTips: [
      'If Must Haves exceed 60% of total team capacity, your sprint has zero buffer and high risk of delay.',
      'Clarify that "Won\'t Have" means "not in this release", not "never in the future".',
    ],
  },
  gherkin: {
    name: 'Gherkin Acceptance Criteria',
    tagline: 'Behavior-Driven Development (BDD) specification',
    category: 'Engineering',
    formulaOrFormat: 'Given [Initial Context], When [Action Triggered], Then [Observable Outcome]',
    explanation: 'A structured natural language syntax that eliminates ambiguity between product managers, QA testers, and software engineers.',
    example: 'Scenario: Insufficient funds in virtual budget.\nGiven the user has $10,000 remaining in their development budget,\nWhen the user tries to initiate a feature costing $15,000,\nThen the "Start Sprint" button is disabled and a warning banner states "Insufficient Budget: Requires $5,000 more".',
    proTips: [
      'Write at least one happy path and at least two edge/error state scenarios per user story.',
      'Avoid technical implementation details; describe observable system behavior.',
    ],
  },
  ltv_cac: {
    name: 'LTV : CAC Unit Economics',
    tagline: 'Measure product monetization viability and commercial scale',
    category: 'Finance & Strategy',
    formulaOrFormat: 'LTV = (ARPU × Gross Margin) / Churn Rate | Ratio = LTV / CAC',
    explanation: 'Customer Lifetime Value (LTV) relative to Customer Acquisition Cost (CAC) tells you if your product engine generates more money from a customer than it costs to acquire them.',
    example: 'ARPU = $50/mo, Gross Margin = 80% ($40 profit). Churn = 5%/mo. LTV = $40 / 0.05 = $800. If CAC = $200, LTV:CAC = 4:1.',
    proTips: [
      'Aim for a 3:1 to 4:1 ratio for sustainable growth.',
      'Ensure Payback Period (CAC / Monthly Gross Profit) is under 12 months for healthy cash flow.',
    ],
  },
};
