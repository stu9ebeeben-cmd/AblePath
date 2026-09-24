import React from 'react';
import { TabType } from '../types';
import { playChime } from '../utils/audio';

interface BottomNavProps {
  activeTab: TabType;
  onSelectTab: (tab: TabType) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ activeTab, onSelectTab }) => {
  const handleTabClick = (tab: TabType) => {
    playChime('tap');
    onSelectTab(tab);
  };

  return (
    <nav
      aria-label="Main Navigation"
      className="fixed bottom-0 w-full z-50 pb-safe bg-[#0B0F17]/95 backdrop-blur-xl border-t border-slate-800 shadow-[0_-4px_24px_rgba(0,0,0,0.6)]"
    >
      <div className="h-20 px-3 flex items-center justify-around max-w-xl mx-auto">
        {/* Tab 1: Explore */}
        <button
          type="button"
          onClick={() => handleTabClick('explore')}
          aria-label="Explore places"
          aria-current={activeTab === 'explore' ? 'page' : undefined}
          className={`flex flex-col items-center justify-center min-w-[72px] min-h-[56px] py-1 px-2 rounded-2xl transition-all ${
            activeTab === 'explore'
              ? 'bg-sky-500 text-slate-950 font-extrabold shadow-md shadow-sky-500/25 scale-[1.02]'
              : 'text-slate-400 hover:text-white font-bold active:scale-95'
          }`}
        >
          <span
            className="material-symbols-outlined text-[28px]"
            style={{ fontVariationSettings: activeTab === 'explore' ? "'FILL' 1" : "'FILL' 0" }}
          >
            explore
          </span>
          <span className="text-xs tracking-tight">Explore</span>
        </button>

        {/* Tab 2: Routes */}
        <button
          type="button"
          onClick={() => handleTabClick('routes')}
          aria-label="Safe walking routes"
          aria-current={activeTab === 'routes' ? 'page' : undefined}
          className={`flex flex-col items-center justify-center min-w-[72px] min-h-[56px] py-1 px-2 rounded-2xl transition-all ${
            activeTab === 'routes'
              ? 'bg-sky-500 text-slate-950 font-extrabold shadow-md shadow-sky-500/25 scale-[1.02]'
              : 'text-slate-400 hover:text-white font-bold active:scale-95'
          }`}
        >
          <span
            className="material-symbols-outlined text-[28px]"
            style={{ fontVariationSettings: activeTab === 'routes' ? "'FILL' 1" : "'FILL' 0" }}
          >
            directions_walk
          </span>
          <span className="text-xs tracking-tight">Routes</span>
        </button>

        {/* Tab 3: Friends */}
        <button
          type="button"
          onClick={() => handleTabClick('friends')}
          aria-label="Friends and trusted helpers"
          aria-current={activeTab === 'friends' ? 'page' : undefined}
          className={`flex flex-col items-center justify-center min-w-[72px] min-h-[56px] py-1 px-2 rounded-2xl transition-all ${
            activeTab === 'friends'
              ? 'bg-sky-500 text-slate-950 font-extrabold shadow-md shadow-sky-500/25 scale-[1.02]'
              : 'text-slate-400 hover:text-white font-bold active:scale-95'
          }`}
        >
          <span
            className="material-symbols-outlined text-[28px]"
            style={{ fontVariationSettings: activeTab === 'friends' ? "'FILL' 1" : "'FILL' 0" }}
          >
            favorite
          </span>
          <span className="text-xs tracking-tight">Friends</span>
        </button>

        {/* Tab 4: Help / SOS */}
        <button
          type="button"
          onClick={() => handleTabClick('sos')}
          aria-label="Emergency Help and SOS"
          aria-current={activeTab === 'sos' ? 'page' : undefined}
          className={`flex flex-col items-center justify-center min-w-[72px] min-h-[56px] py-1 px-2 rounded-2xl transition-all ${
            activeTab === 'sos'
              ? 'bg-rose-500 text-slate-950 font-extrabold shadow-md shadow-rose-500/30 scale-[1.02]'
              : 'text-rose-400 hover:text-rose-300 font-extrabold active:scale-95 hover:bg-rose-950/30'
          }`}
        >
          <span
            className="material-symbols-outlined text-[28px]"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            health_and_safety
          </span>
          <span className="text-xs tracking-tight">Help / SOS</span>
        </button>
      </div>
    </nav>
  );
};
