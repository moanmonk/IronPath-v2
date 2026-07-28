import React from 'react';
import { useIronPathStore } from './store/useIronPathStore';
import { AppLayout } from './layouts/AppLayout';
import { TrainView } from './features/train/TrainView';
import { ProgramsView } from './features/programs/ProgramsView';
import { ExercisesView } from './features/exercises/ExercisesView';
import { ProgressView } from './features/progress/ProgressView';
import { SettingsView } from './features/settings/SettingsView';
import { OnboardingFlow } from './features/onboarding/OnboardingFlow';

export default function App() {
  const activeTab = useIronPathStore((s) => s.activeTab);
  const userProfile = useIronPathStore((s) => s.userProfile);
  const isOnboardingOpen = useIronPathStore((s) => s.isOnboardingOpen);

  if (!userProfile.hasCompletedOnboarding || isOnboardingOpen) {
    return <OnboardingFlow />;
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case 'train':
        return <TrainView />;
      case 'programs':
        return <ProgramsView />;
      case 'exercises':
        return <ExercisesView />;
      case 'progress':
        return <ProgressView />;
      case 'settings':
        return <SettingsView />;
      default:
        return <TrainView />;
    }
  };

  return <AppLayout>{renderTabContent()}</AppLayout>;
}

