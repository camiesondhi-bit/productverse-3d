import { CourseModule } from '../types';

export const COURSE_MODULES: CourseModule[] = [
  {
    id: 'mod-innovation',
    buildingId: 'innovation-lab',
    title: 'Foundations of Product Discovery & Design Thinking',
    description: 'Master how world-class PMs uncover painful, unaddressed customer problems before writing a single line of code.',
    estimatedMinutes: 45,
    xpReward: 350,
    topics: [
      'The 5 Stages of Design Thinking (Empathize, Define, Ideate, Prototype, Test)',
      'Structuring High-Impact Problem Statements',
      'The "How Might We" (HMW) Opportunity Framing Technique',
      'Jobs To Be Done (JTBD) Theory: Functional, Emotional & Social Jobs',
      'Avoiding the "Feature Trap" & Validating Problem-Solution Fit',
    ],
    resources: [
      {
        id: 'res-dt-video',
        title: 'Masterclass: Unpacking Customer Pain into Billion-Dollar Hypotheses',
        type: 'video',
        durationOrPages: '18 min video',
        content: `### Video Summary & Key Moments
**00:00 - Introduction to Problem-Led Innovation**
Why 90% of tech startups fail not because they couldn't build the product, but because nobody needed what they built.

**04:30 - The Double Diamond Model in Product Management**
- **Discover**: Divergent research to identify broad customer pains.
- **Define**: Convergent synthesis into one crisp problem statement.
- **Develop**: Divergent ideation of potential solutions.
- **Deliver**: Convergent prototyping and testing of the MVP.

**11:15 - How Might We (HMW) Framing Formula**
Format: "How might we [action] for [target user] in order to [desired outcome] without [primary constraint]?"
Example: "How might we automate tax filings for freelance designers in order to eliminate filing stress without requiring bookkeeping expertise?"`,
        keyTakeaways: [
          'Fall in love with the problem, not your solution.',
          'A problem well-stated is a problem half-solved.',
          'Customers buy products to get a specific "job" done in their lives.',
        ],
      },
      {
        id: 'res-dt-template',
        title: 'Problem Framing & How Might We Canvas (Cheatsheet)',
        type: 'template',
        durationOrPages: 'PDF Cheatsheet',
        content: `### Problem Statement Blueprint
1. **Target User**: Specifically who suffers from this? (E.g., Independent freelance contractors with multiple income streams)
2. **Context**: When and where does the problem arise? (Quarterly estimated tax deadlines)
3. **Core Pain**: What is the root friction? (Unclear tax deductions, fear of IRS audits, expensive CPAs)
4. **Current Alternative**: How do they solve it today? (Clunky Excel spreadsheets, paper receipts, panic-googling)
5. **Cost of Inaction**: What happens if unsolved? (Fines, lost income, severe anxiety)`,
        keyTakeaways: [
          'Never mention your proposed feature inside the problem statement.',
          'Quantify the cost of the problem in time, money, or stress.',
        ],
      },
    ],
    quiz: [
      {
        id: 'q1-1',
        question: 'Which of the following represents a true outcome-focused problem statement rather than a disguised feature request?',
        options: [
          'Users need a generative AI chatbot in our mobile banking app.',
          'First-time retail investors abandon portfolio diversification because calculating asset risk takes over 3 hours and lacks clear benchmarks.',
          'We must redesign our settings page with purple gradient buttons to increase engagement.',
          'Customers are asking for dark mode on the web application.',
        ],
        correctOptionIndex: 1,
        explanation: 'Option 2 articulates the target user (first-time retail investors), the friction (takes >3 hrs and lacks benchmarks), and the failure outcome (abandon portfolio diversification) without prescribing a pre-baked solution.',
      },
      {
        id: 'q1-2',
        question: 'According to Clayton Christensen’s "Jobs To Be Done" framework, why do people buy a 1/4-inch drill bit?',
        options: [
          'Because they admire titanium power tools.',
          'Because they want a 1/4-inch hole in their wall to hang a family portrait.',
          'To show their neighbors they are handy homeowners.',
          'Because the hardware store offered a discount.',
        ],
        correctOptionIndex: 1,
        explanation: 'The JTBD is never the physical tool itself; the customer is hiring the drill bit to create a hole so they can hang a photo and experience a warm home environment.',
      },
      {
        id: 'q1-3',
        question: 'What is the primary danger of skipping the "Empathize & Define" stages in product development?',
        options: [
          'The code quality will be slightly lower.',
          'The team risks building an engineering masterpiece that nobody actually wants or pays for (the Feature Factory trap).',
          'The Scrum Master will cancel the sprint retro.',
          'Figma files will become disorganized.',
        ],
        correctOptionIndex: 1,
        explanation: 'Skipping discovery results in building solutions to unvalidated problems—the single leading cause of startup death.',
      },
    ],
    practicalAssignment: {
      id: 'assign-disc-1',
      title: 'Craft a Real-World Problem Statement & 3 HMWs',
      prompt: 'Select a broken digital experience you encounter frequently (e.g. food delivery during peak rain, split-bill tracking with friends, apartment hunting). Write a formal 4-sentence Problem Statement and formulate 3 distinct "How Might We" statements targeting different dimensions of the problem.',
      rubric: [
        'Clearly specifies target audience and their current workaround',
        'Quantifies friction without mentioning software solutions',
        '3 HMW statements explore functional, emotional, and social angles',
      ],
      sampleAnswer: 'Problem Statement: Urban remote workers who dine with flatmates spend on average 25 minutes per week manually reconciling grocery receipts across disparate payment apps, resulting in awkward roommate disputes and delayed reimbursements. HMW 1: How might we make itemized split calculations effortless immediately after grocery checkout? HMW 2: How might we eliminate interpersonal awkwardness when requesting owed payments from close friends? HMW 3: How might we automate recurring utility allocations without requiring manual photo uploads?',
    },
  },
  {
    id: 'mod-strategy',
    buildingId: 'strategy-tower',
    title: 'Product Strategy, Market Sizing (TAM/SAM/SOM) & Roadmapping',
    description: 'Learn how to construct defensible competitive moats, size commercial markets, and align executive stakeholders with outcome-driven roadmaps.',
    estimatedMinutes: 60,
    xpReward: 500,
    topics: [
      'Crafting an Inspiring Product Vision & Elevator Pitch',
      'The Value Proposition Canvas: Pains, Gains & Jobs vs Value Map',
      'Calculating TAM, SAM, and SOM: Top-Down vs Bottom-Up Methodologies',
      'SWOT & Competitor Matrix Positioning',
      'Building Now-Next-Later Outcome Roadmaps vs Feature Timelines',
      'Product-Market Fit (PMF) Signals & The Sean Ellis 40% Test',
    ],
    resources: [
      {
        id: 'res-tam-video',
        title: 'Masterclass: Bottom-Up Market Sizing & The PMF Engine',
        type: 'video',
        durationOrPages: '22 min video',
        content: `### Video Summary & Calculation Walkthrough
**00:00 - Why Investors Dislike Top-Down Market Sizing**
"If we only capture 1% of China's population" is a classic fallacy. Professional PMs size markets using rigorous bottom-up calculations:

**08:20 - Bottom-Up TAM Formula**
TAM = (Total potential customer accounts globally) × (Annual Contract Value or ARPU)
SAM = The segment of TAM targeted by your current geography, language, and business model
SOM = The realistic portion of SAM your sales/product engine can win within 2-3 years

**16:00 - The Sean Ellis PMF Question**
"How would you feel if you could no longer use this product tomorrow?"
- Very disappointed
- Somewhat disappointed
- Not disappointed
If > 40% answer "Very disappointed", you have achieved initial Product-Market Fit!`,
        keyTakeaways: [
          'Bottom-up TAM is based on actual unit economics, pricing, and countable customer segments.',
          'Roadmaps should be organized by user problems and business outcomes, not arbitrary calendar deadlines.',
          'Defensible moats come from network effects, data flywheels, high switching costs, or brand trust.',
        ],
      },
      {
        id: 'res-strategy-canvas',
        title: 'Lean Canvas & Product Strategy Framework Guide',
        type: 'template',
        durationOrPages: 'PDF Cheatsheet',
        content: `### The Strategy Stack
1. **Vision**: The world 5-10 years from now once you succeed.
2. **Strategy**: The sequential choices you make to win in your selected market segment.
3. **Roadmap**: Strategic themes categorized as NOW (in active development), NEXT (validated, queued), and LATER (exploratory hypotheses).
4. **OKRs**: Objectives (qualitative goals) and Key Results (quantifiable metrics).`,
        keyTakeaways: [
          'Strategy is as much about deciding what NOT to build as what to build.',
          'Never commit to fixed feature delivery dates 12 months out.',
        ],
      },
    ],
    quiz: [
      {
        id: 'q2-1',
        question: 'A B2B SaaS startup targets 50,000 mid-sized dental clinics in the US. Their software costs $200/month ($2,400/year). What is their US TAM using bottom-up sizing?',
        options: [
          '$10,000,000',
          '$120,000,000',
          '$1,200,000,000',
          '$50,000,000',
        ],
        correctOptionIndex: 1,
        explanation: 'TAM = 50,000 dental clinics × $2,400 annual subscription = $120,000,000 ($120M).',
      },
      {
        id: 'q2-2',
        question: 'Why are modern high-growth tech companies shifting from Gantt chart roadmaps to Now-Next-Later roadmaps?',
        options: [
          'Because Gantt charts are too colorful.',
          'Gantt charts create false certainty around long-term delivery dates and focus on output rather than user value and strategic outcomes.',
          'Because developers do not like looking at calendars.',
          'Now-Next-Later roadmaps require less work to produce in PowerPoint.',
        ],
        correctOptionIndex: 1,
        explanation: 'Output-based timelines ignore discovery learnings. Now-Next-Later acknowledges uncertainty while communicating strategic intent and priority.',
      },
      {
        id: 'q2-3',
        question: 'What percentage of surveyed users answering "Very disappointed" to the product disappearance question signifies Product-Market Fit?',
        options: ['10%', '25%', '40% or higher', '90%'],
        correctOptionIndex: 2,
        explanation: 'Sean Ellis discovered through benchmarking Slack, Dropbox, and Superhuman that products exceeding 40% "Very disappointed" demonstrate hyper-retention and sustainable PMF.',
      },
    ],
    practicalAssignment: {
      id: 'assign-strat-1',
      title: 'Calculate TAM/SAM/SOM & Map a Now-Next-Later Roadmap',
      prompt: 'Choose a hypothetical product: An AI copilot for freelance copywriters that generates SEO content briefs. Define pricing ($30/mo), estimate target market sizes with bottom-up rationale, and construct a 3-tier Now-Next-Later roadmap with 2 outcome-based themes per column.',
      rubric: [
        'Accurately calculates TAM, SAM, and SOM using bottom-up numbers',
        'Themes in the roadmap are framed as problems to solve, not technical tasks',
        'Includes explicit metrics to track success for the NOW items',
      ],
      sampleAnswer: 'TAM: 5M global freelance copywriters × $360/yr = $1.8B. SAM: 1.2M English-fluent digital agency copywriters = $432M. SOM: 35,000 users won in 24 months = $12.6M ARR. NOW: 1. Instant SERP competitor analysis (Metric: Time to generate brief reduced from 45m to 2m). 2. WordPress direct sync (Metric: Publishing conversion > 65%). NEXT: Tone-of-voice personalization engine, automated client feedback analyzer. LATER: Multilingual semantic localization, automated inbound lead pitch deck generator.',
    },
  },
  {
    id: 'mod-dev',
    buildingId: 'development-hub',
    title: 'Agile Product Management: Scrum, User Stories & Acceptance Criteria',
    description: 'Transform high-level product strategy into unambiguous engineering backlogs, sprint ceremonies, and bulletproof Gherkin acceptance criteria.',
    estimatedMinutes: 50,
    xpReward: 550,
    topics: [
      'Scrum Roles & Ceremonies (Sprint Planning, Daily Standup, Backlog Refinement, Sprint Demo, Retrospective)',
      'Writing World-Class User Stories: Role-Feature-Benefit Syntax',
      'The INVEST Mnemonic for High-Quality User Stories',
      'Gherkin Syntax (Given-When-Then) for Concrete Acceptance Criteria',
      'Story Points & Relative Estimation using Fibonacci Sequences',
      'Defining the Minimum Viable Product (MVP) vs Minimum Lovable Product (MLP)',
    ],
    resources: [
      {
        id: 'res-scrum-video',
        title: 'Masterclass: Writing User Stories Developers Love',
        type: 'video',
        durationOrPages: '20 min video',
        content: `### Video Summary & Practical Demonstration
**00:00 - The Bridge Between Business and Engineering**
A Product Manager does not tell engineers *how* to code. A PM defines *who*, *what*, and *why*, along with unambiguous edge cases and acceptance boundaries.

**06:40 - The INVEST Criteria**
- **I**ndependent: Can be developed in any order without blocking chains.
- **N**egotiable: Open to architectural discussion with developers.
- **V**aluable: Delivers observable value to end users or business.
- **E**stimable: Well-enough understood that engineers can size it.
- **S**mall: Fits comfortably within a single 2-week sprint.
- **T**estable: Clear acceptance tests confirm when it is DONE.

**13:10 - Gherkin Acceptance Criteria Walkthrough**
Scenario: User applies expired discount promo code
- **Given** a customer has items totaling $50 in their shopping cart
- **When** the customer enters promo code "SUMMER2022" and clicks Apply
- **Then** the cart subtotal should remain $50
- **And** an error message "This discount code expired on Aug 31, 2022" should display in red below the input box.`,
        keyTakeaways: [
          'Never accept a user story that lacks clear acceptance criteria.',
          'Story points represent complexity, uncertainty, and effort—not pure hours.',
          'A true MVP tests a core value hypothesis with the smallest investment possible.',
        ],
      },
      {
        id: 'res-gherkin-cheat',
        title: 'Gherkin Syntax & User Story Cheatsheet',
        type: 'template',
        durationOrPages: 'PDF Cheatsheet',
        content: `### User Story Standard Template
**Title**: [Verb + Object] e.g., Filter Products by Price Range
**As a** [specific user type or persona]
**I want to** [perform an action]
**So that** [I achieve a specific benefit or goal]

### Acceptance Criteria Checklist
- Happy Path scenario (standard expected flow)
- Edge Cases (empty states, max characters, slow network)
- Error states (invalid inputs, failed API calls)
- Permissions & Security (logged out, unauthorized)`,
        keyTakeaways: [
          'Given = Initial context / preconditions',
          'When = Action taken by the user or system',
          'Then = Expected outcome or state change',
        ],
      },
    ],
    quiz: [
      {
        id: 'q3-1',
        question: 'Which of the following is written according to the proper user story standard format?',
        options: [
          'Build a PostgreSQL database schema for the user accounts table.',
          'As a busy parent preparing dinner, I want to filter recipes by "under 20 minutes" so that I can feed my family quickly on weeknights.',
          'The mobile app should be fast and load in 2 seconds.',
          'Make sure the checkout button works on Safari.',
        ],
        correctOptionIndex: 1,
        explanation: 'Option 2 properly specifies the user context ("busy parent"), the concrete action ("filter recipes under 20 mins"), and the underlying value ("feed family quickly on weeknights").',
      },
      {
        id: 'q3-2',
        question: 'In Agile estimation, why do teams use Fibonacci numbers (1, 2, 3, 5, 8, 13) instead of exact linear hours?',
        options: [
          'Because Leonardo Fibonacci was an early software engineer.',
          'Because as tasks get larger, human uncertainty and variance increase exponentially; relative sizing prevents false precision.',
          'Because Scrum guidelines prohibit the use of numbers higher than 13.',
          'Because developers always work in increments of 8 hours.',
        ],
        correctOptionIndex: 1,
        explanation: 'Debating whether a large task is 17 hours vs 18 hours is wasteful. Fibonacci numbers force teams into relative tiers of uncertainty.',
      },
      {
        id: 'q3-3',
        question: 'During Sprint Planning, the engineering team points out that a story assigned 13 points cannot be completed in the sprint. What should the Product Manager do?',
        options: [
          'Tell the engineers to work overtime over the weekend.',
          'Split the user story into smaller, independently deliverable vertical slices that fit the sprint.',
          'Cancel the entire sprint immediately.',
          'Remove acceptance criteria until the story looks smaller.',
        ],
        correctOptionIndex: 1,
        explanation: 'Large 13-point stories should be sliced vertically into smaller functional chunks (e.g. happy path first, advanced filters in the next sprint).',
      },
    ],
    practicalAssignment: {
      id: 'assign-agile-1',
      title: 'Write 2 User Stories with Given-When-Then Acceptance Criteria',
      prompt: 'For an e-commerce checkout flow, write 2 comprehensive user stories: Story 1 for "Saved Credit Card One-Click Payment", and Story 2 for "Out of Stock Notification during Checkout". Each story must contain at least 2 distinct Gherkin scenarios (Happy path and Edge case/Error).',
      rubric: [
        'Uses standard As a... I want to... So that... syntax',
        'Covers happy path and negative/edge cases in Gherkin syntax',
        'Assigns realistic Fibonacci story points with rationale',
      ],
      sampleAnswer: 'Story 1: As a returning shopper, I want to select a saved credit card during checkout so that I can purchase in under 5 seconds without re-entering card numbers. Scenario 1 (Happy Path): Given I am logged in with a saved Visa card ending in 4242, When I click "Pay with Saved Card", Then my payment is authorized and I am redirected to Order Confirmation. Scenario 2 (Expired Card): Given my saved card has expired, When I view checkout, Then the card shows a warning badge and the "Pay" button is disabled until I update the expiry date.',
    },
  },
  {
    id: 'mod-analytics',
    buildingId: 'analytics-centre',
    title: 'Product Analytics: Pirate Metrics (AARRR), Cohorts & A/B Testing',
    description: 'Deconstruct data pipelines to calculate DAU/MAU stickiness, analyze retention cohort decay curves, and calculate statistically significant A/B test lift.',
    estimatedMinutes: 55,
    xpReward: 500,
    topics: [
      'The AARRR Pirate Metrics Funnel: Acquisition, Activation, Retention, Revenue, Referral',
      'The "Aha! Moment" and Defining Meaningful Activation Milestones',
      'Calculating DAU, WAU, and MAU Stickiness Ratios (DAU/MAU)',
      'Cohort Analysis & Reading Retention Curves (Flattening vs Churning to Zero)',
      'Unit Economics: Customer Acquisition Cost (CAC) vs Lifetime Value (LTV)',
      'A/B Testing Methodology, Sample Size Power & p-value Statistical Significance',
    ],
    resources: [
      {
        id: 'res-analytics-video',
        title: 'Masterclass: The Mathematical Anatomy of Product Retention',
        type: 'video',
        durationOrPages: '24 min video',
        content: `### Video Summary & Formula Breakdown
**00:00 - Why Retention is King**
Acquisition without retention is pouring water into a leaky bucket. If retention doesn't flatten, growth will eventually crash into a wall.

**07:45 - The DAU/MAU Stickiness Ratio**
DAU/MAU measures how many of your monthly users visit on any given day.
- 10-20% = Standard SaaS
- 20-40% = Good consumer web app
- 50%+ = World-class habit-forming product (e.g. WhatsApp, Slack)

**15:30 - The Golden Rule of Unit Economics: LTV:CAC Ratio**
- LTV < CAC (e.g. 0.8:1) = Burning cash on every user acquired; unsustainable.
- LTV : CAC = 3:1 = The ideal sweet spot for healthy venture-backed SaaS.
- LTV : CAC > 5:1 = You are under-investing in marketing; scale customer acquisition!
- Payback Period = CAC / (Monthly ARPU × Gross Margin) should be < 12 months.`,
        keyTakeaways: [
          'A flat retention curve is the single truest indicator of sustainable product-market fit.',
          'Optimize Activation before spending budget on Acquisition.',
          'Never end an A/B test early just because day 2 reached p < 0.05 (beware false positives).',
        ],
      },
      {
        id: 'res-aarrr-cheat',
        title: 'Pirate Metrics & A/B Testing Formula Sheet',
        type: 'template',
        durationOrPages: 'PDF Cheatsheet',
        content: `### Key Formulas
- **Churn Rate** = (Lost Customers in Period) / (Total Customers at Start of Period)
- **LTV** = (Average Revenue Per User × Gross Margin) / Churn Rate
- **Conversion Rate** = (Conversions) / (Total Visitors) × 100%
- **Z-Score for A/B Test** = (p_B - p_A) / sqrt( p_pool * (1 - p_pool) * (1/n_A + 1/n_B) )
Where p-value < 0.05 indicates 95% statistical confidence.`,
        keyTakeaways: [
          'Always establish your minimum detectable effect (MDE) before running an experiment.',
          'Segment cohort data by acquisition channel to uncover hidden super-users.',
        ],
      },
    ],
    quiz: [
      {
        id: 'q4-1',
        question: 'If a SaaS product has 30,000 Daily Active Users (DAU) and 100,000 Monthly Active Users (MAU), what is its stickiness ratio?',
        options: ['3.3%', '30%', '300%', '70%'],
        correctOptionIndex: 1,
        explanation: 'Stickiness = DAU / MAU = 30,000 / 100,000 = 0.30 or 30%. This indicates users return on average ~9 days out of every month.',
      },
      {
        id: 'q4-2',
        question: 'A subscription service spends $120 to acquire a new subscriber. The customer pays $20/month with an 80% gross margin, and the monthly churn rate is 5%. What is the LTV:CAC ratio?',
        options: ['1:1', '2.67:1', '4:1', '0.5:1'],
        correctOptionIndex: 1,
        explanation: 'Monthly Gross Profit per user = $20 × 0.80 = $16. LTV = $16 / 0.05 churn = $320. LTV:CAC ratio = $320 / $120 = 2.67 : 1 (healthy SaaS unit economics).',
      },
      {
        id: 'q4-3',
        question: 'When looking at a cohort retention graph over 12 weeks, what pattern proves that a product has found true retention?',
        options: [
          'The curve drops continuously until it reaches 0% at week 12.',
          'The curve spikes straight up at week 12.',
          'The curve drops initially during onboarding but then flattens into a horizontal parallel line across subsequent weeks.',
          'The line oscillates wildly in a zig-zag pattern.',
        ],
        correctOptionIndex: 2,
        explanation: 'A flattening retention curve means a loyal core cohort of users continues to derive ongoing value week after week.',
      },
    ],
    practicalAssignment: {
      id: 'assign-metric-1',
      title: 'Diagnose a Leaky Product Funnel & Design an A/B Test',
      prompt: 'Scenario: An e-learning mobile app sees 10,000 signups/week. 8,000 complete onboarding (80%). 3,200 start a free course trial (40%). Only 320 convert to paid subscription (10%). Identify the primary bottleneck, formulate an A/B test hypothesis to fix it, and outline Control vs Variant.',
      rubric: [
        'Correctly analyzes funnel drop-off percentages and pinpoint the bottleneck',
        'Formulates a testable hypothesis linking UX change to behavioral metric',
        'Defines primary metric, secondary guardrail metrics, and minimum runtime',
      ],
      sampleAnswer: 'Bottleneck: The trial-to-paid conversion (10%) and onboarding-to-trial initiation (40%) represent massive loss. The steepest drop is from trial to paid (only 3.2% of total signups pay). Hypothesis: Users abandon the trial because they fail to complete their first lesson within 48 hours. If we implement interactive progress nudges and unlock a certificate preview after lesson 1, trial-to-paid conversion will increase from 10% to 16%. Control: Standard catalog display. Variant: Interactive personalized 3-day challenge with celebration confetti after module 1. Guardrail Metric: App uninstall rate must not increase.',
    },
  },
  {
    id: 'mod-launch',
    buildingId: 'launch-arena',
    title: 'Go-To-Market (GTM) Strategy, Pricing & Launch Execution',
    description: 'Design multi-channel launch playbooks, select optimal monetization models (Freemium vs Paid Trials), and drive high-converting product momentum.',
    estimatedMinutes: 45,
    xpReward: 600,
    topics: [
      'The 4 GTM Motions: Product-Led Growth (PLG), Sales-Led, Marketing-Led, Community-Led',
      'Choosing Monetization Models: Freemium, Reverse Trials, Tiered Feature Packaging, Usage Pricing',
      'Value-Based Pricing vs Cost-Plus Pricing',
      'The Anatomy of a Top-Ranked Product Hunt & Press Launch',
      'Creating High-Converting Positioning Statements (April Dunford Method)',
      'Post-Launch Crisis Management & Rapid Feedback Response Playbooks',
    ],
    resources: [
      {
        id: 'res-gtm-video',
        title: 'Masterclass: Product-Led Growth (PLG) & The Art of Pricing',
        type: 'video',
        durationOrPages: '21 min video',
        content: `### Video Summary & Frameworks
**00:00 - The Paradigm Shift to Product-Led Growth**
In PLG, the product itself drives customer acquisition, retention, and expansion. The end-user tries the product before anyone talks to an enterprise salesperson.

**08:30 - Freemium vs Free Trial vs Reverse Trial**
- **Freemium**: Free forever with restricted feature tier (e.g. Spotify, Notion). Best when TAM is massive and marginal server cost per user is near zero.
- **Time-Limited Free Trial**: 14 or 30 days full access (e.g. Shopify). Best when product requires time to set up and demonstrate value.
- **Reverse Trial**: User starts with 14 days of all Premium features for free, then automatically downgrades to clean Freemium tier unless they upgrade.

**15:00 - April Dunford\'s Positioning Framework**
1. Competitive alternatives (what would customers do if you didn\'t exist?)
2. Unique capabilities (what can you do that alternatives cannot?)
3. Value (what benefit do those capabilities unlock?)
4. Target customer segment (who cares intensely about that value?)
5. Market category (the context that makes your value obvious).`,
        keyTakeaways: [
          'Price is a signal of value, not an apology for costs.',
          'Your value metric must scale in direct correlation with the customer\'s success.',
          'Launch is an event, but go-to-market is an ongoing organizational discipline.',
        ],
      },
      {
        id: 'res-gtm-playbook',
        title: 'Complete GTM Launch Checklist & Template',
        type: 'template',
        durationOrPages: 'PDF Cheatsheet',
        content: `### 4-Week Pre-Launch Checklist
- [ ] Define positioning statement and one-sentence elevator hook
- [ ] Set up tracking events and analytics dashboards (Mixpanel / PostHog)
- [ ] Draft Product Hunt maker comment, GIFs, and demo video
- [ ] Prepare customer support macros and FAQs for expected launch spikes
- [ ] Establish server auto-scaling rules and database failover`,
        keyTakeaways: [
          'Coordinate launch amplification across social, newsletter, and user communities simultaneously.',
          'Acknowledge customer feedback in public release notes within 48 hours of launch.',
        ],
      },
    ],
    quiz: [
      {
        id: 'q5-1',
        question: 'Under what condition is a Freemium business model generally superior to a strict 14-day Free Trial?',
        options: [
          'When your product costs $100,000/year and requires 6 months of custom enterprise integration.',
          'When marginal cost per free user is near zero, your TAM is vast, and network effects or viral loops encourage free users to invite colleagues.',
          'When the startup is running out of money and needs immediate cash today.',
          'When competitors don\'t have a website.',
        ],
        correctOptionIndex: 1,
        explanation: 'Freemium acts as a top-of-funnel marketing flywheel when marginal hosting costs are low and users bring in their peers (e.g. Figma, Slack, Dropbox).',
      },
      {
        id: 'q5-2',
        question: 'What is a "Value Metric" in SaaS pricing design?',
        options: [
          'The number of employees working at your company.',
          'The unit of measurement by which the customer pays more as they consume or benefit more (e.g., active contacts in Mailchimp, GB of cloud storage in AWS).',
          'The stock market price of your company.',
          'The salary of the Chief Financial Officer.',
        ],
        correctOptionIndex: 1,
        explanation: 'An ideal value metric aligns price with user value—customers pay more only as their own business grows.',
      },
      {
        id: 'q5-3',
        question: 'Following a high-profile public launch, customer reviews complain that the onboarding tutorial is confusing and blocking access to the dashboard. What is the PM\'s best course of action?',
        options: [
          'Delete negative reviews from social media.',
          'Immediately push a hotfix that allows users to skip the tutorial and adds a "Help" modal, while tracking skip-rate analytics.',
          'Wait 3 months until the next quarterly release cycle.',
          'Blame the marketing team for acquiring the wrong users.',
        ],
        correctOptionIndex: 1,
        explanation: 'Fast iteration based on real user launch friction preserves user goodwill and prevents a permanent conversion crash.',
      },
    ],
    practicalAssignment: {
      id: 'assign-gtm-1',
      title: 'Design a Complete Go-To-Market Playbook & Pricing Matrix',
      prompt: 'You are launching a B2B AI Meeting Assistant that summarizes Zoom calls and extracts action items into Jira. Create a 3-tier pricing table (Free, Pro, Enterprise), designate your value metric, and outline a 3-channel launch campaign strategy.',
      rubric: [
        'Outlines 3 clear pricing tiers with distinct feature fences and target personas',
        'Selects a scalable value metric (e.g. transcribed meeting hours / seats)',
        'Defines tactical launch actions across 3 acquisition channels',
      ],
      sampleAnswer: 'Value Metric: Transcribed meeting hours per month per seat. Tier 1 (Free): 5 meeting hours/month, basic summaries, individual use. Tier 2 (Pro - $18/seat/month): Unlimited meeting hours, custom vocabulary, Jira/Notion sync, automated speaker attribution. Tier 3 (Enterprise - $45/seat/month): SOC-2 compliance, SSO/SAML, CRM integrations, dedicated customer success. Launch Channels: 1. Zoom App Marketplace featured partnership. 2. Product Hunt launch with video showing 60-second summary creation. 3. LinkedIn thought leadership campaign showing "How much time PMs waste writing meeting minutes".',
    },
  },
];
