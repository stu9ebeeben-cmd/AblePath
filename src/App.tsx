import React, { useState, useEffect } from 'react';
import { TabType, TextSizeMode, Place, Helper, ObstacleReport } from './types';
import { INITIAL_PLACES, INITIAL_HELPERS, USER_PROFILE } from './data/mockData';
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { ExploreScreen } from './components/ExploreScreen';
import { RoutesScreen } from './components/RoutesScreen';
import { FriendsScreen } from './components/FriendsScreen';
import { HelpSOSScreen } from './components/HelpSOSScreen';
import { VoiceAssistantModal } from './components/VoiceAssistantModal';
import { CallHelperModal } from './components/CallHelperModal';
import { ReportObstacleModal } from './components/ReportObstacleModal';
import { NavigationModal } from './components/NavigationModal';
import { playChime, speakText } from './utils/audio';

export default function App() {
  const [activeTab, setActiveTab] = useState<TabType>('explore');
  const [textSizeMode, setTextSizeMode] = useState<TextSizeMode>('normal');
  const [places, setPlaces] = useState<Place[]>(INITIAL_PLACES);
  const [helpers, setHelpers] = useState<Helper[]>(INITIAL_HELPERS);

  // Modals state
  const [callingHelper, setCallingHelper] = useState<Helper | null>(null);
  const [isVoiceOpen, setIsVoiceOpen] = useState(false);
  const [isReportOpen, setIsReportOpen] = useState(false);
  const [navigatingPlace, setNavigatingPlace] = useState<Place | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Sync text size classes to document body
  useEffect(() => {
    document.body.classList.remove('text-[17px]', 'text-[20px]', 'text-[23px]');
    if (textSizeMode === 'normal') {
      document.body.classList.add('text-[17px]');
    } else if (textSizeMode === 'big') {
      document.body.classList.add('text-[20px]');
    } else {
      document.body.classList.add('text-[23px]');
    }
  }, [textSizeMode]);

  const toggleTextSize = () => {
    if (textSizeMode === 'normal') {
      setTextSizeMode('big');
      speakText('Big text mode turned on.');
    } else if (textSizeMode === 'big') {
      setTextSizeMode('extra-big');
      speakText('Extra large accessible text mode turned on.');
    } else {
      setTextSizeMode('normal');
      speakText('Standard text mode turned on.');
    }
  };

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  const handleShareGPS = () => {
    playChime('success');
    const msg = `Shared your live GPS: ${USER_PROFILE.currentLocation} with Mom and Dad!`;
    showToast(msg);
    speakText('Your live GPS location was sent to Mom and Dad.');
  };

  const handleAddHelper = (newHelper: Helper) => {
    setHelpers((prev) => [newHelper, ...prev]);
  };

  const handleAddObstacleReport = (report: ObstacleReport) => {
    showToast(`Obstacle reported: ${report.title}`);
  };

  const handleVoiceCommand = (command: string, category?: string) => {
    if (category === 'helper') {
      setCallingHelper(helpers[0]);
    } else if (category === 'ramps' || category === 'quiet' || category === 'elevators' || category === 'restrooms') {
      setActiveTab('explore');
    } else if (command.toLowerCase().includes('route') || command.toLowerCase().includes('walk')) {
      setActiveTab('routes');
    }
  };

  // Generate dynamic screen narration for the Header's audio button
  const getScreenSummary = (): string => {
    if (activeTab === 'explore') {
      return `AblePath Explore screen for Arthur. Travel alert: 8th Street elevator is resting today; please use the smooth Pine Street ramp instead. Easy places near you include Central Botanical Library, zero steps, 3 minute walk. Sunrise Cafe and Treats, zero step entrance, 5 minute walk.`;
    }
    if (activeTab === 'routes') {
      return `Safe walking routes screen. Route from Civic Garden to Central Botanical Library has zero stairs, gentle 2.1 percent incline, and four rest benches.`;
    }
    if (activeTab === 'friends') {
      return `Friends and helpers screen. Mom and Dad are in your trusted care network. You can send an instant GPS ping or safe arrival message with one tap.`;
    }
    if (activeTab === 'sos') {
      return `Emergency help and SOS screen. Press the big SOS button to alert family and helpers, sound a loud siren, or dial 911.`;
    }
    return 'AblePath accessible explorer.';
  };

  return (
    <div className="bg-[#0B0F17] min-h-screen text-slate-100 flex flex-col font-sans select-none overflow-x-hidden">
      {/* Friendly Top Header */}
      <Header
        textSizeMode={textSizeMode}
        onToggleTextSize={toggleTextSize}
        currentScreenSummary={getScreenSummary()}
      />

      {/* Global Toast Alert */}
      {toastMessage && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-50 bg-emerald-500 text-slate-950 font-extrabold text-sm px-4 py-2.5 rounded-2xl shadow-2xl border-2 border-emerald-300 flex items-center gap-2 max-w-md w-[92%] animate-in fade-in slide-in-from-top-4">
          <span className="material-symbols-outlined text-[20px] font-bold">check_circle</span>
          <span className="truncate">{toastMessage}</span>
        </div>
      )}

      {/* Main Tab Screens */}
      <main className="flex-1 flex flex-col relative w-full">
        {activeTab === 'explore' && (
          <ExploreScreen
            places={places}
            helpers={helpers}
            onOpenVoice={() => setIsVoiceOpen(true)}
            onOpenSOS={() => setActiveTab('sos')}
            onCallHelper={(helper) => setCallingHelper(helper)}
            onShareGPS={handleShareGPS}
            onSnapObstacle={() => setIsReportOpen(true)}
            onStartRoute={(place) => setNavigatingPlace(place)}
            onShowRampDetour={() => setActiveTab('routes')}
            onManageHelpers={() => setActiveTab('friends')}
          />
        )}

        {activeTab === 'routes' && (
          <RoutesScreen
            places={places}
            onStartRoute={(place) => setNavigatingPlace(place)}
            onSnapObstacle={() => setIsReportOpen(true)}
          />
        )}

        {activeTab === 'friends' && (
          <FriendsScreen
            helpers={helpers}
            onCallHelper={(helper) => setCallingHelper(helper)}
            onShareGPS={handleShareGPS}
            onAddHelper={handleAddHelper}
          />
        )}

        {activeTab === 'sos' && (
          <HelpSOSScreen
            helpers={helpers}
            onCallHelper={(helper) => setCallingHelper(helper)}
          />
        )}
      </main>

      {/* Fixed Bottom Navigation Bar */}
      <BottomNav activeTab={activeTab} onSelectTab={(tab) => setActiveTab(tab)} />

      {/* Modals & Dialogs */}
      <VoiceAssistantModal
        isOpen={isVoiceOpen}
        onClose={() => setIsVoiceOpen(false)}
        onCommand={handleVoiceCommand}
      />

      <CallHelperModal
        helper={callingHelper}
        onClose={() => setCallingHelper(null)}
      />

      <ReportObstacleModal
        isOpen={isReportOpen}
        onClose={() => setIsReportOpen(false)}
        onSubmit={handleAddObstacleReport}
      />

      <NavigationModal
        isOpen={navigatingPlace !== null}
        destination={navigatingPlace}
        onClose={() => setNavigatingPlace(null)}
      />
    </div>
  );
}
