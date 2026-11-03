import {
  StudentProfile,
  UserProduct,
  WeeklyMission,
  AchievementBadge,
  CareerLevel,
  TeamMember,
  TeamMessage,
} from '../types';
import {
  INITIAL_STUDENT_PROFILE,
  INITIAL_DEFAULT_PRODUCT,
  INITIAL_WEEKLY_MISSIONS,
  INITIAL_ACHIEVEMENT_BADGES,
  INITIAL_TEAM_MEMBERS,
  INITIAL_TEAM_MESSAGES,
} from '../data/defaultState';

const STORAGE_KEYS = {
  PROFILE: 'productverse_profile_v1',
  PRODUCTS: 'productverse_products_v1',
  ACTIVE_PRODUCT_ID: 'productverse_active_product_v1',
  MISSIONS: 'productverse_missions_v1',
  BADGES: 'productverse_badges_v1',
  TEAM_MEMBERS: 'productverse_team_members_v1',
  TEAM_MESSAGES: 'productverse_team_messages_v1',
  AUDIO_MUTED: 'productverse_audio_muted_v1',
};

export function calculateCareerLevel(xp: number): CareerLevel {
  if (xp >= 10000) return 'Chief Product Officer';
  if (xp >= 6500) return 'Product Lead';
  if (xp >= 3500) return 'Senior Product Manager';
  if (xp >= 1500) return 'Product Manager';
  if (xp >= 500) return 'Associate Product Manager';
  return 'Product Intern';
}

export function getStoredProfile(): StudentProfile {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.PROFILE);
    if (raw) {
      const parsed = JSON.parse(raw);
      // Recalculate level just in case
      parsed.careerLevel = calculateCareerLevel(parsed.xp);
      return parsed;
    }
  } catch {
    // Fallback to initial
  }
  return INITIAL_STUDENT_PROFILE;
}

export function saveStoredProfile(profile: StudentProfile): void {
  try {
    profile.careerLevel = calculateCareerLevel(profile.xp);
    localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(profile));
  } catch (e) {
    console.error('Failed to save profile to localStorage', e);
  }
}

export function getStoredProducts(): UserProduct[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch {
    // Fallback
  }
  return [INITIAL_DEFAULT_PRODUCT];
}

export function saveStoredProducts(products: UserProduct[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
  } catch (e) {
    console.error('Failed to save products to localStorage', e);
  }
}

export function getStoredActiveProductId(): string {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.ACTIVE_PRODUCT_ID);
    if (raw) return raw;
  } catch {
    // Fallback
  }
  return INITIAL_DEFAULT_PRODUCT.id;
}

export function saveStoredActiveProductId(id: string): void {
  try {
    localStorage.setItem(STORAGE_KEYS.ACTIVE_PRODUCT_ID, id);
  } catch (e) {
    console.error('Failed to save active product id', e);
  }
}

export function getStoredMissions(): WeeklyMission[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.MISSIONS);
    if (raw) return JSON.parse(raw);
  } catch {
    // Fallback
  }
  return INITIAL_WEEKLY_MISSIONS;
}

export function saveStoredMissions(missions: WeeklyMission[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.MISSIONS, JSON.stringify(missions));
  } catch (e) {
    console.error('Failed to save missions', e);
  }
}

export function getStoredBadges(): AchievementBadge[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.BADGES);
    if (raw) return JSON.parse(raw);
  } catch {
    // Fallback
  }
  return INITIAL_ACHIEVEMENT_BADGES;
}

export function saveStoredBadges(badges: AchievementBadge[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.BADGES, JSON.stringify(badges));
  } catch (e) {
    console.error('Failed to save badges', e);
  }
}

export function getStoredTeamMembers(): TeamMember[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.TEAM_MEMBERS);
    if (raw) return JSON.parse(raw);
  } catch {
    // Fallback
  }
  return INITIAL_TEAM_MEMBERS;
}

export function saveStoredTeamMembers(members: TeamMember[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.TEAM_MEMBERS, JSON.stringify(members));
  } catch (e) {
    console.error('Failed to save team members', e);
  }
}

export function getStoredTeamMessages(): TeamMessage[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.TEAM_MESSAGES);
    if (raw) return JSON.parse(raw);
  } catch {
    // Fallback
  }
  return INITIAL_TEAM_MESSAGES;
}

export function saveStoredTeamMessages(messages: TeamMessage[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.TEAM_MESSAGES, JSON.stringify(messages));
  } catch (e) {
    console.error('Failed to save team messages', e);
  }
}

export function exportProductVerseStateAsJSON(): string {
  const payload = {
    version: '1.0.0',
    exportedAt: new Date().toISOString(),
    profile: getStoredProfile(),
    products: getStoredProducts(),
    missions: getStoredMissions(),
    badges: getStoredBadges(),
    teamMembers: getStoredTeamMembers(),
    teamMessages: getStoredTeamMessages(),
  };
  return JSON.stringify(payload, null, 2);
}

export function importProductVerseStateFromJSON(jsonString: string): boolean {
  try {
    const data = JSON.parse(jsonString);
    if (data.profile) saveStoredProfile(data.profile);
    if (data.products) saveStoredProducts(data.products);
    if (data.missions) saveStoredMissions(data.missions);
    if (data.badges) saveStoredBadges(data.badges);
    if (data.teamMembers) saveStoredTeamMembers(data.teamMembers);
    if (data.teamMessages) saveStoredTeamMessages(data.teamMessages);
    return true;
  } catch (e) {
    console.error('Import failed', e);
    return false;
  }
}

export function resetAllToDefaults(): void {
  localStorage.clear();
}
