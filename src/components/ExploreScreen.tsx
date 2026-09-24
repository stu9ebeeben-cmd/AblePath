import React, { useState } from 'react';
import { Place, Helper } from '../types';
import { playChime, speakText } from '../utils/audio';

interface ExploreScreenProps {
  places: Place[];
  helpers: Helper[];
  onOpenVoice: () => void;
  onOpenSOS: () => void;
  onCallHelper: (helper: Helper) => void;
  onShareGPS: () => void;
  onSnapObstacle: () => void;
  onStartRoute: (place: Place) => void;
  onShowRampDetour: () => void;
  onManageHelpers: () => void;
}

export const ExploreScreen: React.FC<ExploreScreenProps> = ({
  places,
  helpers,
  onOpenVoice,
  onOpenSOS,
  onCallHelper,
  onShareGPS,
  onSnapObstacle,
  onStartRoute,
  onShowRampDetour,
  onManageHelpers,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<'all' | 'ramps' | 'quiet' | 'elevators' | 'restrooms'>('all');
  const [showAllPlaces, setShowAllPlaces] = useState(false);
  const [mapZoomed, setMapZoomed] = useState(false);

  // Filter places based on search query and active accessibility tag
  const filteredPlaces = places.filter((place) => {
    const matchesSearch =
      place.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      place.subtitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      place.description.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    if (activeFilter === 'ramps') return place.hasRamp || place.isFlat;
    if (activeFilter === 'quiet') return place.isQuiet;
    if (activeFilter === 'elevators') return place.hasElevator;
    if (activeFilter === 'restrooms') return place.hasAccessibleRestroom;

    return true;
  });

  const displayedPlaces = showAllPlaces ? filteredPlaces : filteredPlaces.slice(0, 3);

  const toggleFilter = (filterKey: 'ramps' | 'quiet' | 'elevators' | 'restrooms') => {
    playChime('tap');
    if (activeFilter === filterKey) {
      setActiveFilter('all');
      speakText('Showing all accessible places');
    } else {
      setActiveFilter(filterKey);
      speakText(`Filtering by ${filterKey}`);
    }
  };

  const handleLocateMe = () => {
    playChime('tap');
    setMapZoomed(true);
    speakText('Centered on your current location at Civic Garden Plaza.');
    setTimeout(() => setMapZoomed(false), 2000);
  };

  // Find Civic Garden place for "Guide Me" on map
  const civicGarden = places.find((p) => p.id === 'civic-garden') || places[0];

  return (
    <div className="flex-1 flex flex-col relative w-full pt-24 pb-28 px-4 max-w-xl mx-auto">
      {/* Universal Big Quick Actions (Voice & SOS) */}
      <section className="grid grid-cols-2 gap-3 pt-2 pb-4">
        {/* Talk to AblePath (Kid & Senior Friendly Large Speech Input) */}
        <button
          type="button"
          onClick={() => {
            playChime('tap');
            onOpenVoice();
          }}
          aria-label="Talk to Voice Assistant"
          className="min-h-[96px] p-4 rounded-3xl bg-gradient-to-br from-sky-600 to-indigo-800 text-white flex flex-col justify-between shadow-lg shadow-sky-950/40 border border-sky-400/30 active:scale-95 transition-all text-left group hover:border-sky-300"
        >
          <div className="flex items-center justify-between w-full">
            <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center backdrop-blur-sm group-hover:bg-white/30 transition-colors">
              <span className="material-symbols-outlined text-[30px] text-white animate-pulse">
                mic
              </span>
            </div>
            <span className="text-xs bg-white/20 px-2.5 py-1 rounded-full font-bold uppercase tracking-wider text-sky-100">
              Tap &amp; Speak
            </span>
          </div>
          <div>
            <span className="font-extrabold text-lg block leading-tight text-white">
              Talk to Me
            </span>
            <span className="text-xs text-sky-200">Say "Find quiet park"</span>
          </div>
        </button>

        {/* Instant SOS / Quick Help button */}
        <button
          type="button"
          onClick={() => {
            playChime('alert');
            onOpenSOS();
          }}
          aria-label="Emergency Help and SOS"
          className="min-h-[96px] p-4 rounded-3xl bg-gradient-to-br from-rose-600 to-red-800 text-white flex flex-col justify-between shadow-lg shadow-red-950/40 border border-red-400/30 active:scale-95 transition-all text-left hover:border-red-300"
        >
          <div className="flex items-center justify-between w-full">
            <div className="w-12 h-12 rounded-2xl bg-white/25 flex items-center justify-center backdrop-blur-sm">
              <span
                className="material-symbols-outlined text-[30px] text-white"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                emergency
              </span>
            </div>
            <span className="text-xs bg-white/25 px-2.5 py-1 rounded-full font-extrabold tracking-wider text-white">
              SOS
            </span>
          </div>
          <div>
            <span className="font-extrabold text-lg block leading-tight text-white">
              Help &amp; SOS
            </span>
            <span className="text-xs text-rose-100">Alert family or helper</span>
          </div>
        </button>
      </section>

      {/* Super Simple Search Bar with Extra Large Touch Target */}
      <section className="pb-4">
        <div className="relative flex items-center">
          <div className="absolute left-4 text-sky-400 flex items-center pointer-events-none">
            <span className="material-symbols-outlined text-[28px]">search</span>
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            aria-label="Search accessible places"
            className="w-full h-16 bg-[#1E293B] text-white font-semibold text-lg pl-14 pr-16 rounded-2xl border-2 border-slate-700 shadow-md focus:outline-none focus:border-sky-400 placeholder:text-slate-400"
            placeholder="Where do you want to go?"
          />
          {searchQuery ? (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              aria-label="Clear search"
              className="absolute right-3 min-h-[44px] min-w-[44px] text-slate-400 hover:text-white flex items-center justify-center"
            >
              <span className="material-symbols-outlined text-[22px]">close</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={() => {
                playChime('tap');
                onOpenVoice();
              }}
              aria-label="Speak search query"
              className="absolute right-2.5 min-h-[48px] min-w-[48px] rounded-xl bg-sky-500/20 text-sky-400 border border-sky-400/30 flex items-center justify-center active:scale-95 transition-transform hover:bg-sky-500/30"
            >
              <span className="material-symbols-outlined text-[24px]">keyboard_voice</span>
            </button>
          )}
        </div>
      </section>

      {/* One-Tap Quick Categories (Generous Touch Targets & Clear Icons) */}
      <section className="pb-5">
        <div className="flex items-center justify-between mb-2.5">
          <h2 className="text-lg font-extrabold text-white">Simple Filters</h2>
          <span className="text-xs font-bold text-sky-400 uppercase tracking-wide">
            {activeFilter === 'all' ? 'Select your need' : `Active: ${activeFilter}`}
          </span>
        </div>
        <div className="grid grid-cols-4 gap-2">
          {/* Ramps & Smooth */}
          <button
            type="button"
            onClick={() => toggleFilter('ramps')}
            aria-pressed={activeFilter === 'ramps'}
            className={`min-h-[76px] p-2.5 rounded-2xl flex flex-col items-center justify-center text-center shadow-md active:scale-95 transition-all border-2 ${
              activeFilter === 'ramps'
                ? 'bg-emerald-500 text-slate-950 border-emerald-300 ring-2 ring-emerald-400/40'
                : 'bg-[#1E293B] border-slate-700 hover:border-slate-600 text-white'
            }`}
          >
            <div
              className={`w-9 h-9 rounded-full flex items-center justify-center mb-1 ${
                activeFilter === 'ramps'
                  ? 'bg-slate-950/20 text-slate-950 font-bold'
                  : 'bg-emerald-500/20 text-emerald-400'
              }`}
            >
              <span
                className="material-symbols-outlined text-[22px]"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                accessible_forward
              </span>
            </div>
            <span
              className={`text-xs font-extrabold leading-tight ${
                activeFilter === 'ramps' ? 'text-slate-950' : 'text-white'
              }`}
            >
              Ramps
            </span>
          </button>

          {/* Low Noise / Quiet */}
          <button
            type="button"
            onClick={() => toggleFilter('quiet')}
            aria-pressed={activeFilter === 'quiet'}
            className={`min-h-[76px] p-2.5 rounded-2xl flex flex-col items-center justify-center text-center shadow-md active:scale-95 transition-all border-2 ${
              activeFilter === 'quiet'
                ? 'bg-sky-500 text-slate-950 border-sky-300 ring-2 ring-sky-400/40'
                : 'bg-[#1E293B] border-slate-700 hover:border-slate-600 text-white'
            }`}
          >
            <div
              className={`w-9 h-9 rounded-full flex items-center justify-center mb-1 ${
                activeFilter === 'quiet'
                  ? 'bg-slate-950/20 text-slate-950 font-bold'
                  : 'bg-slate-800 text-sky-300'
              }`}
            >
              <span className="material-symbols-outlined text-[22px]">volume_off</span>
            </div>
            <span
              className={`text-xs font-bold leading-tight ${
                activeFilter === 'quiet' ? 'text-slate-950 font-extrabold' : 'text-slate-200'
              }`}
            >
              Quiet
            </span>
          </button>

          {/* Easy Transit / Elevators */}
          <button
            type="button"
            onClick={() => toggleFilter('elevators')}
            aria-pressed={activeFilter === 'elevators'}
            className={`min-h-[76px] p-2.5 rounded-2xl flex flex-col items-center justify-center text-center shadow-md active:scale-95 transition-all border-2 ${
              activeFilter === 'elevators'
                ? 'bg-sky-500 text-slate-950 border-sky-300 ring-2 ring-sky-400/40'
                : 'bg-[#1E293B] border-slate-700 hover:border-slate-600 text-white'
            }`}
          >
            <div
              className={`w-9 h-9 rounded-full flex items-center justify-center mb-1 ${
                activeFilter === 'elevators'
                  ? 'bg-slate-950/20 text-slate-950 font-bold'
                  : 'bg-slate-800 text-sky-300'
              }`}
            >
              <span className="material-symbols-outlined text-[22px]">elevator</span>
            </div>
            <span
              className={`text-xs font-bold leading-tight ${
                activeFilter === 'elevators' ? 'text-slate-950 font-extrabold' : 'text-slate-200'
              }`}
            >
              Elevators
            </span>
          </button>

          {/* Restrooms */}
          <button
            type="button"
            onClick={() => toggleFilter('restrooms')}
            aria-pressed={activeFilter === 'restrooms'}
            className={`min-h-[76px] p-2.5 rounded-2xl flex flex-col items-center justify-center text-center shadow-md active:scale-95 transition-all border-2 ${
              activeFilter === 'restrooms'
                ? 'bg-amber-400 text-slate-950 border-amber-300 ring-2 ring-amber-400/40'
                : 'bg-[#1E293B] border-slate-700 hover:border-slate-600 text-white'
            }`}
          >
            <div
              className={`w-9 h-9 rounded-full flex items-center justify-center mb-1 ${
                activeFilter === 'restrooms'
                  ? 'bg-slate-950/20 text-slate-950 font-bold'
                  : 'bg-slate-800 text-sky-300'
              }`}
            >
              <span className="material-symbols-outlined text-[22px]">wc</span>
            </div>
            <span
              className={`text-xs font-bold leading-tight ${
                activeFilter === 'restrooms' ? 'text-slate-950 font-extrabold' : 'text-slate-200'
              }`}
            >
              Restrooms
            </span>
          </button>
        </div>
      </section>

      {/* My Trusted Helpers (Great for Kids, Teens, and Seniors) */}
      <section className="pb-5">
        <div className="bg-[#162032] border border-slate-800 rounded-3xl p-4 shadow-md">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-emerald-400 text-[22px]">contacts</span>
              <h3 className="font-extrabold text-base text-white">My Trusted Helpers</h3>
            </div>
            <button
              type="button"
              onClick={onManageHelpers}
              className="text-xs font-bold text-sky-400 hover:underline min-h-[36px] flex items-center"
            >
              Manage
            </button>
          </div>
          <div className="grid grid-cols-3 gap-2.5">
            {/* Helper 1: Mom / Caregiver */}
            {helpers[0] && (
              <button
                type="button"
                onClick={() => onCallHelper(helpers[0])}
                aria-label={`Call ${helpers[0].name}`}
                className="min-h-[60px] p-2.5 rounded-2xl bg-[#1E293B] border border-emerald-500/30 flex items-center gap-2.5 active:scale-95 transition-transform text-left hover:border-emerald-400"
              >
                <div className="w-10 h-10 rounded-full bg-emerald-600 text-white font-bold text-sm flex items-center justify-center shrink-0 shadow">
                  M
                </div>
                <div className="min-w-0">
                  <span className="block text-xs font-extrabold text-white truncate">
                    {helpers[0].shortName || 'Mom'}
                  </span>
                  <span className="flex items-center gap-0.5 text-[11px] font-bold text-emerald-400">
                    <span className="material-symbols-outlined text-[14px]">call</span> Call
                  </span>
                </div>
              </button>
            )}

            {/* Helper 2: Dad */}
            {helpers[1] && (
              <button
                type="button"
                onClick={() => onCallHelper(helpers[1])}
                aria-label={`Call ${helpers[1].name}`}
                className="min-h-[60px] p-2.5 rounded-2xl bg-[#1E293B] border border-sky-500/30 flex items-center gap-2.5 active:scale-95 transition-transform text-left hover:border-sky-400"
              >
                <div className="w-10 h-10 rounded-full bg-sky-700 text-white font-bold text-sm flex items-center justify-center shrink-0 shadow">
                  D
                </div>
                <div className="min-w-0">
                  <span className="block text-xs font-extrabold text-white truncate">
                    {helpers[1].shortName || 'Dad'}
                  </span>
                  <span className="flex items-center gap-0.5 text-[11px] font-bold text-sky-400">
                    <span className="material-symbols-outlined text-[14px]">call</span> Call
                  </span>
                </div>
              </button>
            )}

            {/* Helper 3: Share Spot GPS */}
            <button
              type="button"
              onClick={onShareGPS}
              aria-label="Send I am here location message"
              className="min-h-[60px] p-2.5 rounded-2xl bg-[#1E293B] border border-amber-500/30 flex items-center gap-2.5 active:scale-95 transition-transform text-left hover:border-amber-400"
            >
              <div className="w-10 h-10 rounded-full bg-amber-600 text-white font-bold text-sm flex items-center justify-center shrink-0 shadow">
                <span className="material-symbols-outlined text-[18px]">share_location</span>
              </div>
              <div className="min-w-0">
                <span className="block text-xs font-extrabold text-amber-300 truncate">Share Spot</span>
                <span className="text-[11px] font-bold text-amber-400">1-Tap GPS</span>
              </div>
            </button>
          </div>
        </div>
      </section>

      {/* Clear, Friendly Live Notice */}
      <section className="pb-5">
        <div className="bg-[#241a0b] border-2 border-amber-500/50 rounded-3xl p-4 flex items-start gap-3.5 shadow-md">
          <div className="w-11 h-11 rounded-2xl bg-amber-500/20 border border-amber-400/40 text-amber-300 flex items-center justify-center shrink-0 mt-0.5">
            <span className="material-symbols-outlined text-[26px]">notification_important</span>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold text-amber-300 uppercase tracking-wider">
                Helpful Travel Tip
              </span>
              <span className="text-xs font-bold text-amber-400/80">Just now</span>
            </div>
            <p className="font-bold text-base text-amber-100 mt-1 leading-snug">
              8th St Elevator is resting today.
            </p>
            <p className="text-sm font-medium text-amber-200/90 mt-0.5">
              Use the smooth Pine St Ramp instead! It's gentle and wide.
            </p>
            <button
              type="button"
              onClick={onShowRampDetour}
              className="mt-2.5 min-h-[48px] px-4 bg-amber-500 hover:bg-amber-400 text-stone-950 rounded-xl font-extrabold text-sm flex items-center gap-1.5 active:scale-95 transition-transform shadow-md"
            >
              <span className="material-symbols-outlined text-[18px]">turn_right</span>
              <span>Show Easy Ramp Route</span>
            </button>
          </div>
        </div>
      </section>

      {/* Interactive Map: Big, Punchy, & Visual */}
      <section className="pb-6">
        <div className="bg-[#162032] border border-slate-800 rounded-3xl overflow-hidden shadow-md">
          {/* Visual Map Canvas Area */}
          <div className="relative w-full h-56 bg-slate-900 overflow-hidden">
            <div
              className={`w-full h-full bg-cover bg-center transition-transform duration-500 ${
                mapZoomed ? 'scale-110' : 'scale-100'
              }`}
              style={{
                backgroundImage:
                  "url('https://lh3.googleusercontent.com/aida-public/AB6AXuBq2BaypwShpaZDfbGgXEADfZH20I1293BrofSfXDtAdV8J7qZ09AIKFV-FNtruSEVwKeQTAnLHf2nmH28c6XG2CQRODQ9bioJwDzUTeD3tO7EgP8rq-QsW2od6WQL9zfZhFgcJNzrKbAdE6MUjKkVOgwvUdKyrouMgXIkTpZ25jWzOourVak0AIeoCfNBhR2LUlqCcPaPsAIl1oywKKKH7tWYRoefgQiH-ybiIXiaX')",
              }}
            />
            {/* Overlay for subtle dark mood blend */}
            <div className="absolute inset-0 bg-slate-950/20 pointer-events-none" />

            {/* Large High-Contrast Tag */}
            <div className="absolute top-3 left-3 bg-[#0B0F17]/90 backdrop-blur-sm border border-emerald-500/40 text-emerald-300 px-3 py-1.5 rounded-xl text-xs font-extrabold flex items-center gap-1.5 shadow-lg">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
              <span>Safe Path Nearby</span>
            </div>

            {/* Big Touch Action on Map */}
            <div className="absolute bottom-3 right-3 flex gap-2">
              <button
                type="button"
                onClick={handleLocateMe}
                aria-label="Zoom to my location"
                className="min-w-[54px] min-h-[54px] w-[54px] h-[54px] bg-[#1E293B] text-sky-400 rounded-2xl flex items-center justify-center shadow-xl border-2 border-slate-700 active:scale-90 transition-transform hover:text-white"
              >
                <span className="material-symbols-outlined text-[28px] font-bold">my_location</span>
              </button>
            </div>

            {/* Friendly Map Marker Callout */}
            <div className="absolute top-1/2 left-1/3 -translate-y-1/2 bg-[#0B0F17]/95 text-white px-3 py-1.5 rounded-2xl shadow-xl flex items-center gap-2 border-2 border-emerald-400 font-bold text-xs backdrop-blur-sm">
              <span className="material-symbols-outlined text-emerald-400 text-[18px]">
                sentiment_satisfied
              </span>
              <span>Zero steps here!</span>
            </div>
          </div>

          {/* Under Map Simple Details */}
          <div className="p-4 flex items-center justify-between bg-[#162032]">
            <div>
              <h3 className="font-extrabold text-base text-white">Civic Garden &amp; Plaza</h3>
              <p className="text-sm font-semibold text-emerald-400 flex items-center gap-1">
                <span className="material-symbols-outlined text-[16px]">check_circle</span> 100% Flat
                &amp; Paved Walkways
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                playChime('tap');
                onStartRoute(civicGarden);
              }}
              className="min-h-[52px] px-4 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-extrabold text-sm flex items-center gap-1.5 active:scale-95 transition-transform shadow-md"
            >
              <span>Guide Me</span>
              <span className="material-symbols-outlined text-[20px]">near_me</span>
            </button>
          </div>
        </div>
      </section>

      {/* Places Near You (Clean, Big Cards with Simplified Language) */}
      <section className="pb-6">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h2 className="text-xl font-extrabold text-white">Easy Places Near You</h2>
            <p className="text-xs font-bold text-slate-400">
              Simple steps, quiet areas, checked by locals
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              playChime('tap');
              setShowAllPlaces(!showAllPlaces);
            }}
            className="min-h-[48px] px-2 text-sky-400 font-extrabold text-sm hover:underline"
          >
            {showAllPlaces ? 'Show Less' : 'See All'}
          </button>
        </div>

        {displayedPlaces.length === 0 ? (
          <div className="bg-[#162032] border border-slate-800 rounded-3xl p-6 text-center">
            <span className="material-symbols-outlined text-[40px] text-slate-500 mb-2">search_off</span>
            <p className="text-white font-bold text-base">No places found matching your filter</p>
            <p className="text-slate-400 text-xs mt-1">Try tapping another filter or clearing the search</p>
            <button
              type="button"
              onClick={() => {
                setActiveFilter('all');
                setSearchQuery('');
              }}
              className="mt-3 px-4 py-2 bg-sky-500 text-slate-950 font-bold text-xs rounded-xl"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {displayedPlaces.map((place) => (
              <article
                key={place.id}
                className="bg-[#162032] border-2 border-slate-800 rounded-3xl overflow-hidden shadow-md hover:border-sky-500/50 transition-colors"
              >
                <div className="relative h-44 w-full bg-slate-800">
                  <img
                    alt={place.name}
                    className="w-full h-full object-cover"
                    src={place.image}
                    referrerPolicy="no-referrer"
                  />
                  {/* Badge */}
                  <div
                    className={`absolute top-3 right-3 backdrop-blur-sm font-extrabold text-xs px-3 py-1.5 rounded-xl shadow-md border flex items-center gap-1 ${
                      place.highlightBadge.color === 'emerald'
                        ? 'bg-emerald-600/90 text-white border-emerald-400/40'
                        : place.highlightBadge.color === 'amber'
                        ? 'bg-amber-500/90 text-stone-950 border-amber-300/40'
                        : 'bg-sky-600/90 text-white border-sky-400/40'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[16px]">
                      {place.highlightBadge.icon}
                    </span>
                    <span>{place.highlightBadge.text}</span>
                  </div>

                  {/* Walk time badge */}
                  <div className="absolute bottom-3 left-3 bg-[#0B0F17]/90 backdrop-blur-sm text-sky-300 font-bold text-xs px-3 py-1 rounded-xl shadow border border-slate-700 flex items-center gap-1.5">
                    <span>🚶 {place.walkMinutes} min walk ({place.distance})</span>
                  </div>
                </div>

                <div className="p-4">
                  <h3 className="text-lg font-extrabold text-white leading-tight">{place.name}</h3>
                  <p className="text-sm font-semibold text-slate-400 mt-0.5">{place.subtitle}</p>

                  {/* Multi-generation Friendly Badges */}
                  <div className="flex flex-wrap gap-2 mt-3 mb-4">
                    {place.tags.map((tag, idx) => (
                      <span
                        key={idx}
                        className={`px-3 py-1.5 rounded-xl text-xs font-extrabold flex items-center gap-1.5 border ${
                          tag.variant === 'emerald'
                            ? 'bg-emerald-950/70 border-emerald-500/40 text-emerald-300'
                            : 'bg-[#1E293B] border-slate-700 text-sky-200'
                        }`}
                      >
                        <span className="material-symbols-outlined text-[16px]">{tag.icon}</span>
                        <span>{tag.text}</span>
                      </span>
                    ))}
                  </div>

                  {/* Big Primary Action Button */}
                  <button
                    type="button"
                    onClick={() => {
                      playChime('tap');
                      onStartRoute(place);
                    }}
                    className="w-full min-h-[54px] bg-sky-500 hover:bg-sky-400 text-slate-950 font-extrabold text-base rounded-2xl flex items-center justify-center gap-2 active:scale-[0.98] transition-transform shadow-lg shadow-sky-950/50"
                  >
                    <span className="material-symbols-outlined text-[22px]">navigation</span>
                    <span>Go There (Safe Route)</span>
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      {/* Super Simple Community Help Card (Delight & Micro-Action) */}
      <section className="pb-4">
        <div className="bg-gradient-to-r from-[#162032] to-[#1E293B] text-white rounded-3xl p-5 shadow-lg border border-slate-700 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-sky-500/20 border border-sky-400/30 text-sky-300 flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-[28px]">add_a_photo</span>
            </div>
            <div>
              <h4 className="font-extrabold text-base leading-tight text-white">Spot an Obstacle?</h4>
              <p className="text-xs text-slate-400 mt-0.5">Take a quick photo to warn neighbors.</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => {
              playChime('tap');
              onSnapObstacle();
            }}
            className="min-h-[50px] px-4 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-sm rounded-xl shadow active:scale-95 transition-transform shrink-0"
          >
            Snap Photo
          </button>
        </div>
      </section>
    </div>
  );
};
