export type BuildingId =
  | 'innovation-lab'
  | 'user-research'
  | 'strategy-tower'
  | 'design-studio'
  | 'development-hub'
  | 'analytics-centre'
  | 'launch-arena'
  | 'growth-centre';

export type CareerLevel =
  | 'Product Intern'
  | 'Associate Product Manager'
  | 'Product Manager'
  | 'Senior Product Manager'
  | 'Product Lead'
  | 'Chief Product Officer';

export interface BuildingInfo {
  id: BuildingId;
  name: string;
  tagline: string;
  category: string;
  description: string;
  color: string;
  accentColor: string;
  iconName: string;
  position: [number, number, number];
  height: number;
  width: number;
  depth: number;
  modulesCount: number;
  xpReward: number;
}

export interface UserPersona {
  id: string;
  name: string;
  role: string;
  demographics: {
    age: number;
    location: string;
    techSavviness: 'Low' | 'Medium' | 'High' | 'Expert';
    incomeBracket: string;
  };
  quote: string;
  goals: string[];
  painPoints: string[];
  motivations: string[];
  avatarUrl?: string;
}

export interface ProductFeature {
  id: string;
  title: string;
  description: string;
  category: 'Core' | 'Growth' | 'Delight' | 'Infrastructure';
  // RICE scoring
  reach: number; // e.g. 100 - 10000 users/month
  impact: number; // 0.25 (minimal), 0.5 (low), 1 (medium), 2 (high), 3 (massive)
  confidence: number; // 50% (0.5), 80% (0.8), 100% (1.0)
  effort: number; // Person-weeks or story points (1 - 10)
  riceScore: number;
  moscow: 'Must Have' | 'Should Have' | 'Could Have' | "Won't Have";
  cost: number; // in $ development budget
  status: 'Backlog' | 'In Sprint' | 'Built' | 'Launched';
}

export interface UserStory {
  id: string;
  featureId?: string;
  role: string; // As a...
  goal: string; // I want to...
  benefit: string; // So that...
  acceptanceCriteria: string[]; // Given, When, Then
  storyPoints: number; // 1, 2, 3, 5, 8, 13
  priority: 'High' | 'Medium' | 'Low';
  status: 'To Do' | 'In Progress' | 'Review' | 'Done';
}

export interface PrototypeScreen {
  id: string;
  title: string;
  type: 'onboarding' | 'dashboard' | 'checkout' | 'feed' | 'settings';
  description: string;
  elements: {
    id: string;
    type: 'button' | 'input' | 'hero' | 'card' | 'navbar' | 'chart';
    label: string;
    variant?: string;
  }[];
  userFlowNext?: string;
}

export interface UsabilityTestResult {
  taskName: string;
  completionRate: number; // %
  averageTimeSeconds: number;
  userSatisfactionScore: number; // 1-5
  feedbackQuotes: string[];
}

export interface FeedbackItem {
  id: string;
  userName: string;
  rating: number; // 1-5
  comment: string;
  sentiment: 'positive' | 'neutral' | 'negative';
  category: 'Usability' | 'Pricing' | 'Performance' | 'Feature Request';
  timestamp: string;
  responded?: boolean;
}

export interface ProductMetrics {
  dau: number;
  mau: number;
  retentionRateDay1: number; // %
  retentionRateDay7: number; // %
  retentionRateDay30: number; // %
  churnRate: number; // %
  conversionRate: number; // %
  cac: number; // $
  ltv: number; // $
  mrr: number; // Monthly Recurring Revenue $
  totalRevenue: number; // $
  csat: number; // 1-100%
  nps: number; // -100 to 100
  featureAdoptionRate: number; // %
}

export interface UserProduct {
  id: string;
  name: string;
  tagline: string;
  targetAudience: string;
  problemStatement: string;
  howMightWe: string;
  tam: number; // Total Addressable Market ($)
  sam: number; // Serviceable Available Market ($)
  som: number; // Serviceable Obtainable Market ($)
  valueProposition: {
    customerJobs: string[];
    pains: string[];
    gains: string[];
    productsAndServices: string[];
    painRelievers: string[];
    gainCreators: string[];
  };
  personas: UserPersona[];
  features: ProductFeature[];
  userStories: UserStory[];
  prototypeScreens: PrototypeScreen[];
  usabilityTests: UsabilityTestResult[];
  launchChannels: string[];
  pricingModel: 'Freemium' | 'Subscription' | 'Usage-based' | 'One-time';
  pricingPrice: number;
  budgetAllocated: number;
  budgetSpent: number;
  isLaunched: boolean;
  metrics: ProductMetrics;
  feedback: FeedbackItem[];
  createdAt: string;
  updatedAt: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctOptionIndex: number;
  explanation: string;
}

export interface LessonResource {
  id: string;
  title: string;
  type: 'video' | 'pdf' | 'template' | 'guide';
  durationOrPages: string;
  content: string;
  downloadUrl?: string;
  keyTakeaways: string[];
}

export interface CourseModule {
  id: string;
  buildingId: BuildingId;
  title: string;
  description: string;
  estimatedMinutes: number;
  xpReward: number;
  topics: string[];
  resources: LessonResource[];
  quiz: QuizQuestion[];
  practicalAssignment: {
    id: string;
    title: string;
    prompt: string;
    rubric: string[];
    sampleAnswer: string;
  };
}

export interface SimulationOption {
  id: string;
  text: string;
  description: string;
  cost: number;
  timeCostWeeks: number;
  consequences: {
    metricsDelta: Partial<ProductMetrics>;
    marketReaction: string;
    competitorMove: string;
    customerFeedbackSample: string;
    scoreDelta: number;
  };
}

export interface SimulationScenario {
  id: string;
  title: string;
  subtitle: string;
  buildingId: BuildingId;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  context: string;
  initialMetrics: Partial<ProductMetrics>;
  budgetLimit: number;
  stages: {
    stageNumber: number;
    title: string;
    situation: string;
    options: SimulationOption[];
  }[];
  postMortemReport: {
    bestPractices: string[];
    pmTakeaways: string[];
  };
}

export interface TeamMember {
  id: string;
  name: string;
  role: 'Product Manager' | 'UI/UX Designer' | 'Developer' | 'Business Analyst' | 'Product Marketing Manager';
  avatar: string;
  status: 'Online' | 'In Sprint' | 'Reviewing';
  currentTask: string;
  contributionScore: number;
}

export interface TeamMessage {
  id: string;
  authorId: string;
  authorName: string;
  authorRole: string;
  content: string;
  timestamp: string;
}

export interface AchievementBadge {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: 'Strategy' | 'Execution' | 'Analytics' | 'Growth' | 'Leadership' | 'Launch';
  unlockedAt?: string;
}

export interface WeeklyMission {
  id: string;
  title: string;
  description: string;
  xpReward: number;
  targetCount: number;
  currentCount: number;
  isCompleted: boolean;
  category: string;
}

export interface StudentProfile {
  id: string;
  name: string;
  email: string;
  title: string;
  careerLevel: CareerLevel;
  xp: number;
  budgetCredits: number; // Virtual development budget e.g. $100,000
  streakDays: number;
  completedModuleIds: string[];
  completedSimulationIds: string[];
  unlockedBadgeIds: string[];
  bookmarkedResourceIds: string[];
  notes: { [key: string]: string };
}
