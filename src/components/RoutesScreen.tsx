import React, { useState } from 'react';
import { Place } from '../types';
import { LIBRARY_ROUTE_STEPS } from '../data/mockData';
import { playChime, speakText } from '../utils/audio';

interface RoutesScreenProps {
  places: Place[];
  onStartRoute: (place: Place) => void;
  onSnapObstacle: () => void;
}

export const RoutesScreen: React.FC<RoutesScreenProps> = ({
  places,
  onStartRoute,
  onSnapObstacle,
}) => {
  const [selectedRouteType, setSelectedRouteType] = useState<'smooth' | 'quiet' | 'fast'>('smooth');
  const [selectedDestination, setSelectedDestination] = useState<Place>(places[0]);

  const handleRouteSelect = (type: 'smooth' | 'quiet' | 'fast') => {
    playChime('tap');
    setSelectedRouteType(type);
    if (type === 'smooth') speakText('Smooth ramp route selected. Zero stairs guaranteed.');
    if (type === 'quiet') speakText('Quiet sensory trail selected. Calm pathways with rest benches.');
    if (type === 'fast') speakText('Direct paved route selected.');
  };

  return (
    <div className="flex-1 flex flex-col relative w-full pt-24 pb-28 px-4 max-w-xl mx-auto">
      {/* Screen Title */}
      <div className="mb-4">
        <span className="text-xs font-bold uppercase tracking-wider text-sky-400">
          Step-Free Navigation
        </span>
        <h2 className="text-2xl font-extrabold text-white">Safe Walking Routes</h2>
        <p className="text-sm text-slate-400 mt-0.5">
          Curated paths with verified smooth ramps, audible signals, and resting benches.
        </p>
      </div>

      {/* Origin & Destination Card */}
      <div className="bg-[#162032] border-2 border-slate-800 rounded-3xl p-4 shadow-md mb-4">
        {/* Origin */}
        <div className="flex items-center gap-3 pb-3 border-b border-slate-800">
          <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-[18px]">my_location</span>
          </div>
          <div className="min-w-0 flex-1">
            <span className="text-[11px] font-bold uppercase text-emerald-400 block leading-tight">
              Start Point (Your Location)
            </span>
            <span className="text-sm font-extrabold text-white truncate block">
              Civic Garden &amp; Plaza
            </span>
          </div>
        </div>

        {/* Destination Dropdown */}
        <div className="flex items-center gap-3 pt-3">
          <div className="w-8 h-8 rounded-full bg-sky-500/20 text-sky-400 flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-[18px]">pin_drop</span>
          </div>
          <div className="min-w-0 flex-1">
            <span className="text-[11px] font-bold uppercase text-sky-400 block leading-tight">
              Destination
            </span>
            <select
              value={selectedDestination.id}
              onChange={(e) => {
                const found = places.find((p) => p.id === e.target.value);
                if (found) setSelectedDestination(found);
              }}
              className="w-full bg-[#1E293B] text-white font-bold text-sm rounded-xl py-2 px-3 border border-slate-700 mt-1 focus:outline-none focus:border-sky-400"
            >
              {places.map((place) => (
                <option key={place.id} value={place.id}>
                  {place.name} ({place.distance})
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Route Type Tabs */}
      <div className="grid grid-cols-3 gap-2 mb-4">
        <button
          type="button"
          onClick={() => handleRouteSelect('smooth')}
          className={`min-h-[58px] p-2 rounded-2xl border text-center transition-all flex flex-col items-center justify-center ${
            selectedRouteType === 'smooth'
              ? 'bg-sky-500 text-slate-950 border-sky-400 font-extrabold shadow'
              : 'bg-[#1E293B] text-slate-300 border-slate-700 hover:text-white'
          }`}
        >
          <span className="material-symbols-outlined text-[20px]">accessible_forward</span>
          <span className="text-xs font-bold leading-tight mt-0.5">Smooth Ramps</span>
        </button>

        <button
          type="button"
          onClick={() => handleRouteSelect('quiet')}
          className={`min-h-[58px] p-2 rounded-2xl border text-center transition-all flex flex-col items-center justify-center ${
            selectedRouteType === 'quiet'
              ? 'bg-emerald-500 text-slate-950 border-emerald-400 font-extrabold shadow'
              : 'bg-[#1E293B] text-slate-300 border-slate-700 hover:text-white'
          }`}
        >
          <span className="material-symbols-outlined text-[20px]">volume_off</span>
          <span className="text-xs font-bold leading-tight mt-0.5">Quiet Sensory</span>
        </button>

        <button
          type="button"
          onClick={() => handleRouteSelect('fast')}
          className={`min-h-[58px] p-2 rounded-2xl border text-center transition-all flex flex-col items-center justify-center ${
            selectedRouteType === 'fast'
              ? 'bg-amber-400 text-slate-950 border-amber-300 font-extrabold shadow'
              : 'bg-[#1E293B] text-slate-300 border-slate-700 hover:text-white'
          }`}
        >
          <span className="material-symbols-outlined text-[20px]">bolt</span>
          <span className="text-xs font-bold leading-tight mt-0.5">Direct Link</span>
        </button>
      </div>

      {/* Safety Summary Bar */}
      <div className="bg-[#1E293B] border border-slate-700 rounded-3xl p-4 mb-4">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-extrabold uppercase text-emerald-400 flex items-center gap-1">
            <span className="material-symbols-outlined text-[16px]">verified</span>
            100% Verified Safe Route
          </span>
          <span className="text-xs font-bold text-slate-400">Total: 0.3 miles</span>
        </div>

        <div className="grid grid-cols-4 gap-2 text-center">
          <div className="bg-slate-900/60 p-2.5 rounded-2xl border border-slate-800">
            <span className="block text-xl font-extrabold text-white">0</span>
            <span className="text-[10px] font-bold text-slate-400 uppercase">Stairs / Steps</span>
          </div>

          <div className="bg-slate-900/60 p-2.5 rounded-2xl border border-slate-800">
            <span className="block text-xl font-extrabold text-sky-400">2.1%</span>
            <span className="text-[10px] font-bold text-slate-400 uppercase">Max Incline</span>
          </div>

          <div className="bg-slate-900/60 p-2.5 rounded-2xl border border-slate-800">
            <span className="block text-xl font-extrabold text-emerald-400">4</span>
            <span className="text-[10px] font-bold text-slate-400 uppercase">Rest Benches</span>
          </div>

          <div className="bg-slate-900/60 p-2.5 rounded-2xl border border-slate-800">
            <span className="block text-xl font-extrabold text-amber-400">3 min</span>
            <span className="text-[10px] font-bold text-slate-400 uppercase">Walk Pace</span>
          </div>
        </div>
      </div>

      {/* Detour Alert Card */}
      <div className="bg-[#241a0b] border border-amber-500/40 rounded-2xl p-3.5 mb-5 flex items-center gap-3">
        <span className="material-symbols-outlined text-[24px] text-amber-400 shrink-0">
          alt_route
        </span>
        <div className="min-w-0">
          <p className="text-xs font-bold text-amber-200">
            Rerouted past 8th St elevator via smooth Pine St Ramp.
          </p>
          <span className="text-[11px] text-amber-400 font-semibold">
            Bypass adds 0 stairs and only 40 seconds.
          </span>
        </div>
      </div>

      {/* Turn-by-Turn Steps Preview */}
      <div className="space-y-3 mb-6">
        <h3 className="text-base font-extrabold text-white flex items-center gap-2">
          <span className="material-symbols-outlined text-sky-400 text-[20px]">map</span>
          Turn-by-Turn Route Preview
        </h3>

        {LIBRARY_ROUTE_STEPS.map((step, idx) => (
          <div
            key={step.id}
            className="bg-[#162032] border border-slate-800 rounded-2xl p-3.5 flex items-start gap-3"
          >
            <div className="w-8 h-8 rounded-xl bg-sky-500/20 text-sky-300 border border-sky-400/30 flex items-center justify-center shrink-0 font-bold text-xs mt-0.5">
              {idx + 1}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold text-white">{step.instruction}</span>
                <span className="text-[11px] font-bold text-sky-400 shrink-0 ml-2">
                  {step.distance}
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5">{step.detail}</p>
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-400 mt-1">
                <span className="material-symbols-outlined text-[13px]">check_circle</span>
                {step.safeFeature}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Start Live Navigation CTA Button */}
      <button
        type="button"
        onClick={() => {
          playChime('tap');
          onStartRoute(selectedDestination);
        }}
        className="w-full min-h-[56px] bg-sky-500 hover:bg-sky-400 text-slate-950 font-extrabold text-base rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-sky-950/60 active:scale-98 transition-transform"
      >
        <span className="material-symbols-outlined text-[24px]">navigation</span>
        <span>Start Live Guided Walk to {selectedDestination.name}</span>
      </button>

      {/* Report Obstacle on this Route */}
      <button
        type="button"
        onClick={onSnapObstacle}
        className="mt-3 w-full min-h-[46px] rounded-xl bg-[#1E293B] hover:bg-slate-800 text-slate-300 border border-slate-700 text-xs font-bold flex items-center justify-center gap-2 active:scale-98"
      >
        <span className="material-symbols-outlined text-[18px]">add_a_photo</span>
        <span>Notice a new obstacle on this route? Snap photo to update map</span>
      </button>
    </div>
  );
};
