import React, { useState } from 'react';
import { Helper } from '../types';
import { playChime, speakText } from '../utils/audio';

interface FriendsScreenProps {
  helpers: Helper[];
  onCallHelper: (helper: Helper) => void;
  onShareGPS: () => void;
  onAddHelper: (newHelper: Helper) => void;
}

export const FriendsScreen: React.FC<FriendsScreenProps> = ({
  helpers,
  onCallHelper,
  onShareGPS,
  onAddHelper,
}) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [newHelperName, setNewHelperName] = useState('');
  const [newHelperRelation, setNewHelperRelation] = useState('');
  const [newHelperPhone, setNewHelperPhone] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    speakText(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  const handleSendSafeArrival = () => {
    playChime('success');
    showToast('Safe Arrival message sent to Mom and Dad! "Arthur has arrived safely at Central Library."');
  };

  const handleSendNeedHand = () => {
    playChime('alert');
    showToast('Quick helper ping sent! "Arthur would love a quick hand at the entrance."');
  };

  const handleSaveHelper = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newHelperName.trim()) return;

    const created: Helper = {
      id: `helper-${Date.now()}`,
      name: newHelperName,
      shortName: newHelperName.split(' ')[0],
      relation: newHelperRelation || 'Trusted Friend',
      phone: newHelperPhone || '+1 (555) 000-0000',
      avatarLetter: newHelperName[0].toUpperCase(),
      colorScheme: 'sky',
      status: 'Added to your circle',
      lastActive: 'Just now',
      batteryLevel: 95,
      isEmergencyContact: false,
    };

    onAddHelper(created);
    setShowAddModal(false);
    setNewHelperName('');
    setNewHelperRelation('');
    setNewHelperPhone('');
    playChime('success');
    showToast(`Added ${created.name} to your trusted helpers!`);
  };

  return (
    <div className="flex-1 flex flex-col relative w-full pt-24 pb-28 px-4 max-w-xl mx-auto">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-50 bg-emerald-500 text-slate-950 font-extrabold text-sm px-4 py-2.5 rounded-2xl shadow-xl border-2 border-emerald-300 flex items-center gap-2 max-w-md w-[90%] animate-in fade-in slide-in-from-top-3">
          <span className="material-symbols-outlined text-[20px]">check_circle</span>
          <span className="truncate">{toastMessage}</span>
        </div>
      )}

      {/* Title */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
            Care Network
          </span>
          <h2 className="text-2xl font-extrabold text-white">Friends &amp; Helpers</h2>
        </div>
        <button
          type="button"
          onClick={() => {
            playChime('tap');
            setShowAddModal(true);
          }}
          className="min-h-[44px] px-3 bg-[#1E293B] hover:bg-slate-800 text-sky-400 border border-sky-500/40 rounded-xl text-xs font-extrabold flex items-center gap-1.5 active:scale-95"
        >
          <span className="material-symbols-outlined text-[18px]">person_add</span>
          <span>Add Helper</span>
        </button>
      </div>

      {/* Live Check-in Status Card */}
      <div className="bg-gradient-to-br from-[#162032] to-[#1E293B] border-2 border-slate-700 rounded-3xl p-5 shadow-lg mb-5">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-emerald-400 animate-ping"></span>
            <span className="text-xs font-extrabold text-emerald-400 uppercase tracking-wide">
              Live Status Active
            </span>
          </div>
          <span className="text-xs font-bold text-slate-400">Battery 88% • Smooth Path</span>
        </div>

        <p className="text-base font-extrabold text-white leading-snug">
          Arthur is at Civic Garden &amp; Plaza
        </p>
        <p className="text-xs font-medium text-slate-300 mt-1">
          Last checked in 2 minutes ago • Following Pine St zero-step route
        </p>

        {/* 1-Tap Quick Action Row */}
        <div className="grid grid-cols-2 gap-2 mt-4">
          <button
            type="button"
            onClick={onShareGPS}
            className="min-h-[48px] p-2 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 active:scale-95 transition-all"
          >
            <span className="material-symbols-outlined text-[18px]">share_location</span>
            <span>Send 1-Tap GPS</span>
          </button>

          <button
            type="button"
            onClick={handleSendSafeArrival}
            className="min-h-[48px] p-2 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 active:scale-95 transition-all"
          >
            <span className="material-symbols-outlined text-[18px]">where_to_vote</span>
            <span>"I Have Arrived"</span>
          </button>
        </div>
      </div>

      {/* Preset Messages for Fast Assist */}
      <div className="mb-5">
        <span className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 block">
          One-Tap Preset Messages:
        </span>
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={handleSendNeedHand}
            className="p-3 bg-[#162032] border border-slate-800 rounded-2xl text-left hover:border-slate-700 active:scale-95 text-xs font-semibold text-slate-200 flex items-center gap-2"
          >
            <span className="material-symbols-outlined text-[18px] text-amber-400">front_hand</span>
            <span>"Need a hand at entrance"</span>
          </button>

          <button
            type="button"
            onClick={() => {
              playChime('tap');
              showToast('Status sent: "Resting on a park bench for 5 mins."');
            }}
            className="p-3 bg-[#162032] border border-slate-800 rounded-2xl text-left hover:border-slate-700 active:scale-95 text-xs font-semibold text-slate-200 flex items-center gap-2"
          >
            <span className="material-symbols-outlined text-[18px] text-sky-400">chair</span>
            <span>"Resting on a bench"</span>
          </button>
        </div>
      </div>

      {/* Helpers List */}
      <div className="space-y-3">
        <h3 className="text-base font-extrabold text-white flex items-center gap-2">
          <span className="material-symbols-outlined text-emerald-400 text-[20px]">group</span>
          Your Connected Circle ({helpers.length})
        </h3>

        {helpers.map((helper) => (
          <div
            key={helper.id}
            className="bg-[#162032] border border-slate-800 rounded-3xl p-4 flex items-center justify-between gap-3 hover:border-slate-700 transition-colors shadow-sm"
          >
            <div className="flex items-center gap-3 min-w-0">
              <div
                className={`w-12 h-12 rounded-2xl flex items-center justify-center font-extrabold text-base text-white shrink-0 shadow ${
                  helper.colorScheme === 'emerald'
                    ? 'bg-emerald-600'
                    : helper.colorScheme === 'sky'
                    ? 'bg-sky-600'
                    : helper.colorScheme === 'amber'
                    ? 'bg-amber-600'
                    : 'bg-purple-600'
                }`}
              >
                {helper.avatarLetter}
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <h4 className="text-sm font-extrabold text-white truncate">{helper.name}</h4>
                  {helper.isEmergencyContact && (
                    <span className="bg-rose-500/20 text-rose-300 text-[10px] font-extrabold px-1.5 py-0.5 rounded border border-rose-500/30">
                      SOS
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-400 truncate">{helper.relation}</p>
                <span className="text-[11px] font-semibold text-emerald-400 block mt-0.5">
                  {helper.status}
                </span>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={() => onCallHelper(helper)}
                aria-label={`Call ${helper.name}`}
                className="min-w-[48px] min-h-[48px] rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-400/40 flex items-center justify-center active:scale-95 hover:bg-emerald-500/30"
              >
                <span className="material-symbols-outlined text-[20px]">call</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  playChime('tap');
                  showToast(`Opened SMS link to ${helper.name}`);
                }}
                aria-label={`Send text message to ${helper.name}`}
                className="min-w-[48px] min-h-[48px] rounded-xl bg-slate-800 text-slate-300 border border-slate-700 flex items-center justify-center active:scale-95 hover:text-white"
              >
                <span className="material-symbols-outlined text-[20px]">chat</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add Helper Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-md bg-[#162032] border-2 border-slate-700 rounded-3xl p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-extrabold text-white">Add Trusted Helper</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="min-w-[40px] min-h-[40px] rounded-full bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <form onSubmit={handleSaveHelper} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-300 mb-1">
                  Full Name:
                </label>
                <input
                  type="text"
                  value={newHelperName}
                  onChange={(e) => setNewHelperName(e.target.value)}
                  placeholder="e.g. Sister Emma"
                  className="w-full h-12 bg-slate-800 rounded-xl px-4 text-white text-sm font-semibold border border-slate-700 focus:outline-none focus:border-sky-400"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-300 mb-1">
                  Relationship:
                </label>
                <input
                  type="text"
                  value={newHelperRelation}
                  onChange={(e) => setNewHelperRelation(e.target.value)}
                  placeholder="e.g. Sibling, Neighbor, Therapist"
                  className="w-full h-12 bg-slate-800 rounded-xl px-4 text-white text-sm font-semibold border border-slate-700 focus:outline-none focus:border-sky-400"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-300 mb-1">
                  Phone Number:
                </label>
                <input
                  type="tel"
                  value={newHelperPhone}
                  onChange={(e) => setNewHelperPhone(e.target.value)}
                  placeholder="e.g. (555) 234-5678"
                  className="w-full h-12 bg-slate-800 rounded-xl px-4 text-white text-sm font-semibold border border-slate-700 focus:outline-none focus:border-sky-400"
                />
              </div>

              <button
                type="submit"
                className="w-full min-h-[52px] mt-2 bg-sky-500 hover:bg-sky-400 text-slate-950 font-extrabold text-base rounded-2xl flex items-center justify-center gap-2 shadow-lg active:scale-98"
              >
                <span className="material-symbols-outlined text-[22px]">check</span>
                <span>Save Helper</span>
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
