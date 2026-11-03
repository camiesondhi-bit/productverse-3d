import React, { useState, useEffect } from 'react';
import {
  StudentProfile,
  UserProduct,
  WeeklyMission,
  AchievementBadge,
  TeamMember,
  TeamMessage,
  BuildingInfo,
} from './types';
import {
  getStoredProfile,
  saveStoredProfile,
  getStoredProducts,
  saveStoredProducts,
  getStoredActiveProductId,
  saveStoredActiveProductId,
  getStoredMissions,
  saveStoredMissions,
  getStoredBadges,
  saveStoredBadges,
  getStoredTeamMembers,
  saveStoredTeamMembers,
  getStoredTeamMessages,
  saveStoredTeamMessages,
} from './services/storage';
import { soundFx } from './services/audio';

// Components
import { Header, ActiveNavTab } from './components/common/Header';
import { CityScene } from './components/city/CityScene';
import { ProductSimulator } from './components/simulator/ProductSimulator';
import { LmsHub } from './components/lms/LmsHub';
import { SimulationsHub } from './components/simulations/SimulationsHub';
import { AnalyticsDashboard } from './components/analytics/AnalyticsDashboard';
import { MultiplayerTeams } from './components/teams/MultiplayerTeams';
import { InstructorDashboard } from './components/instructor/InstructorDashboard';
import { NovaMentor } from './components/ai/NovaMentor';
import { ProfileModal } from './components/gamification/ProfileModal';
import { DatabaseModal } from './components/common/DatabaseModal';

export default function App() {
  // Primary State
  const [profile, setProfile] = useState<StudentProfile>(getStoredProfile());
  const [products, setProducts] = useState<UserProduct[]>(getStoredProducts());
  const [activeProductId, setActiveProductId] = useState<string>(getStoredActiveProductId());
  const [missions, setMissions] = useState<WeeklyMission[]>(getStoredMissions());
  const [badges, setBadges] = useState<AchievementBadge[]>(getStoredBadges());
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>(getStoredTeamMembers());
  const [teamMessages, setTeamMessages] = useState<TeamMessage[]>(getStoredTeamMessages());

  // Navigation & Building Focus
  const [activeTab, setActiveTab] = useState<ActiveNavTab>('city');
  const [selectedBuilding, setSelectedBuilding] = useState<BuildingInfo | null>(null);

  // Modals
  const [isNovaOpen, setIsNovaOpen] = useState(false);
  const [novaInitialPrompt, setNovaInitialPrompt] = useState<string | null>(null);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isDatabaseOpen, setIsDatabaseOpen] = useState(false);

  // Active product reference
  const currentProduct =
    products.find((p) => p.id === activeProductId) || products[0];

  // Save profile changes
  const handleUpdateProfile = (newProfile: StudentProfile) => {
    setProfile(newProfile);
    saveStoredProfile(newProfile);
  };

  // Save product changes
  const handleUpdateProduct = (updatedProduct: UserProduct) => {
    const updatedList = products.map((p) =>
      p.id === updatedProduct.id ? updatedProduct : p
    );
    setProducts(updatedList);
    saveStoredProducts(updatedList);
  };

  // Add team message
  const handleSendTeamMessage = (newMsg: TeamMessage) => {
    const updated = [...teamMessages, newMsg];
    setTeamMessages(updated);
    saveStoredTeamMessages(updated);
  };

  // Update team member task
  const handleUpdateTeamMemberTask = (memberId: string, newTask: string) => {
    const updated = teamMembers.map((m) =>
      m.id === memberId ? { ...m, currentTask: newTask } : m
    );
    setTeamMembers(updated);
    saveStoredTeamMembers(updated);
  };

  // Open NOVA with preset prompt
  const handleOpenNovaWithPrompt = (prompt: string) => {
    setNovaInitialPrompt(prompt);
    setIsNovaOpen(true);
    soundFx.playSelectBuilding();
  };

  // When a user clicks "ENTER" on a 3D Building
  const handleEnterBuilding = (building: BuildingInfo) => {
    soundFx.playSelectBuilding();
    setSelectedBuilding(building);

    // Map building to appropriate view
    if (building.id === 'innovation-lab' || building.id === 'strategy-tower' || building.id === 'design-studio') {
      setActiveTab('simulator');
    } else if (building.id === 'development-hub') {
      setActiveTab('teams');
    } else if (building.id === 'analytics-centre') {
      setActiveTab('analytics');
    } else if (building.id === 'launch-arena' || building.id === 'growth-centre') {
      setActiveTab('simulations');
    } else {
      setActiveTab('lms');
    }
  };

  // Reload state after JSON import
  const handleReloadState = () => {
    setProfile(getStoredProfile());
    setProducts(getStoredProducts());
    setActiveProductId(getStoredActiveProductId());
    setMissions(getStoredMissions());
    setBadges(getStoredBadges());
    setTeamMembers(getStoredTeamMembers());
    setTeamMessages(getStoredTeamMessages());
  };

  return (
    <div className="min-h-screen bg-[#060814] text-slate-100 flex flex-col font-sans selection:bg-cyan-500 selection:text-black">
      {/* Top Header HUD */}
      <Header
        profile={profile}
        activeTab={activeTab}
        onTabChange={(tab) => {
          setActiveTab(tab);
          if (tab !== 'city') {
            setSelectedBuilding(null);
          }
        }}
        onOpenProfile={() => setIsProfileOpen(true)}
        onOpenNova={() => {
          setNovaInitialPrompt(null);
          setIsNovaOpen(true);
        }}
        onOpenCloudSync={() => setIsDatabaseOpen(true)}
        activeBuildingName={selectedBuilding?.name}
      />

      {/* Main Dynamic Viewport */}
      <main className="flex-1 w-full relative">
        {activeTab === 'city' && (
          <CityScene
            selectedBuilding={selectedBuilding}
            onSelectBuilding={setSelectedBuilding}
            onEnterBuilding={handleEnterBuilding}
          />
        )}

        {activeTab === 'simulator' && (
          <ProductSimulator
            product={currentProduct}
            profile={profile}
            onUpdateProduct={handleUpdateProduct}
            onUpdateProfile={handleUpdateProfile}
            onOpenNovaWithPrompt={handleOpenNovaWithPrompt}
          />
        )}

        {activeTab === 'lms' && (
          <LmsHub
            profile={profile}
            activeBuildingId={selectedBuilding?.id}
            onUpdateProfile={handleUpdateProfile}
            onJumpToSimulator={() => setActiveTab('simulator')}
          />
        )}

        {activeTab === 'simulations' && (
          <SimulationsHub
            profile={profile}
            onUpdateProfile={handleUpdateProfile}
            onOpenNovaWithPrompt={handleOpenNovaWithPrompt}
          />
        )}

        {activeTab === 'analytics' && (
          <AnalyticsDashboard product={currentProduct} />
        )}

        {activeTab === 'teams' && (
          <MultiplayerTeams
            teamMembers={teamMembers}
            teamMessages={teamMessages}
            profile={profile}
            product={currentProduct}
            onSendMessage={handleSendTeamMessage}
            onUpdateTeamMemberTask={handleUpdateTeamMemberTask}
          />
        )}

        {activeTab === 'instructor' && (
          <InstructorDashboard
            profile={profile}
            onUpdateProfile={handleUpdateProfile}
          />
        )}
      </main>

      {/* Persistent Floating AI Launcher Pill (When Nova is closed) */}
      {!isNovaOpen && (
        <button
          onClick={() => {
            soundFx.playSelectBuilding();
            setNovaInitialPrompt(null);
            setIsNovaOpen(true);
          }}
          className="fixed bottom-6 right-6 z-40 group flex items-center gap-2.5 px-4 py-3 rounded-2xl bg-[#0e163b]/90 hover:bg-[#141f4f] border border-purple-500/50 hover:border-purple-400 text-purple-200 text-xs font-bold shadow-neon-purple backdrop-blur-md transition-all hover:scale-105 active:scale-95"
        >
          <div className="w-2 h-2 rounded-full bg-pink-400 animate-ping" />
          <span>Ask NOVA AI Mentor</span>
        </button>
      )}

      {/* NOVA AI Mentor Modal */}
      <NovaMentor
        isOpen={isNovaOpen}
        onClose={() => setIsNovaOpen(false)}
        initialPrompt={novaInitialPrompt}
      />

      {/* Student Profile & Gamification Modal */}
      <ProfileModal
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        profile={profile}
        badges={badges}
        missions={missions}
        onReloadState={handleReloadState}
      />

      {/* Database & Cloud Sync Settings Modal */}
      <DatabaseModal
        isOpen={isDatabaseOpen}
        onClose={() => setIsDatabaseOpen(false)}
      />
    </div>
  );
}
