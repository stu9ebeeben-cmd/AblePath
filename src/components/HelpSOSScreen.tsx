import React, { useState, useEffect } from 'react';
import { Helper } from '../types';
import { USER_PROFILE } from '../data/mockData';
import {
  playChime,
  speakText,
  startEmergencySiren,
  stopEmergencySiren,
} from '../utils/audio';

interface HelpSOSScreenProps {
  helpers: Helper[];
  onCallHelper: (helper: Helper) => void;
}

export const HelpSOSScreen: React.FC<HelpSOSScreenProps> = ({ helpers, onCallHelper }) => {
  const [sirenActive, setSirenActive] = useState(false);
  const [strobeActive, setStrobeActive] = useState(false);
  const [copiedCoords, setCopiedCoords] = useState(false);
  const [sosCountdown, setSosCountdown] = useState<number | null>(null);
  const [sosTriggered, setSosTriggered] = useState(false);

  // Handle countdown for SOS button
  useEffect(() => {
    let timer: ReturnType<typeof setInterval> | null = null;
    if (sosCountdown !== null && sosCountdown > 0) {
      timer = setInterval(() => {
        setSosCountdown((c) => (c !== null ? c - 1 : null));
      }, 1000);
    } else if (sosCountdown === 0) {
      setSosTriggered(true);
      setSosCountdown(null);
      triggerEmergencyAlert();
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [sosCountdown]);

  // Clean up siren on unmount
  useEffect(() => {
    return () => {
      stopEmergencySiren();
    };
  }, []);

  const triggerEmergencyAlert = () => {
    playChime('alert');
    startEmergencySiren();
    setSirenActive(true);
    setStrobeActive(true);
    speakText(
      'Emergency SOS active! Sending high priority coordinates to Mom, Dad, and emergency contacts.'
    );
  };

  const handleCancelSOS = () => {
    setSosCountdown(null);
    setSosTriggered(false);
    setSirenActive(false);
    setStrobeActive(false);
    stopEmergencySiren();
    playChime('tap');
    speakText('Emergency alarm deactivated. You are safe.');
  };

  const toggleSiren = () => {
    if (sirenActive) {
      stopEmergencySiren();
      setSirenActive(false);
      speakText('Siren stopped.');
    } else {
      startEmergencySiren();
      setSirenActive(true);
      speakText('Emergency loud siren sounding.');
    }
  };

  const handleCopyCoordinates = () => {
    playChime('success');
    navigator.clipboard.writeText(
      `Arthur Emergency Location: ${USER_PROFILE.coordinates} (${USER_PROFILE.currentLocation})`
    );
    setCopiedCoords(true);
    speakText('Location coordinates copied to clipboard.');
    setTimeout(() => setCopiedCoords(false), 3000);
  };

  const emergencyContacts = helpers.filter((h) => h.isEmergencyContact);

  return (
    <div
      className={`flex-1 flex flex-col relative w-full pt-24 pb-28 px-4 max-w-xl mx-auto transition-colors duration-200 ${
        strobeActive ? 'animate-pulse bg-red-950/20' : ''
      }`}
    >
      {/* Screen Title */}
      <div className="mb-4">
        <span className="text-xs font-bold uppercase tracking-wider text-rose-400">
          Emergency Support
        </span>
        <h2 className="text-2xl font-extrabold text-white">Help &amp; Emergency SOS</h2>
        <p className="text-sm text-slate-400 mt-0.5">
          One tap alerts family, plays loud attention audio, and gives first responders your info.
        </p>
      </div>

      {/* Primary SOS Action Container */}
      <div className="bg-[#2a1317] border-2 border-rose-500/60 rounded-3xl p-6 text-center shadow-2xl shadow-rose-950/40 mb-5 relative overflow-hidden">
        {sosTriggered ? (
          <div>
            <div className="w-16 h-16 rounded-full bg-rose-600 text-white flex items-center justify-center mx-auto mb-3 animate-ping">
              <span className="material-symbols-outlined text-[36px]">emergency</span>
            </div>
            <h3 className="text-2xl font-extrabold text-white">SOS ALERT SENT!</h3>
            <p className="text-sm font-semibold text-rose-200 mt-1">
              Your exact GPS coordinates were broadcasted to Mom, Dad, and local caregivers.
            </p>
            <button
              type="button"
              onClick={handleCancelSOS}
              className="mt-4 min-h-[50px] px-6 rounded-2xl bg-white text-slate-950 font-extrabold text-sm active:scale-95 shadow"
            >
              Cancel / I Am Safe Now
            </button>
          </div>
        ) : sosCountdown !== null ? (
          <div>
            <span className="text-5xl font-black text-rose-400 block mb-2">{sosCountdown}</span>
            <h3 className="text-xl font-extrabold text-white">Sending Alert in {sosCountdown}s...</h3>
            <p className="text-xs text-rose-200 mt-1">Tap below if pressed by accident</p>
            <button
              type="button"
              onClick={handleCancelSOS}
              className="mt-4 min-h-[48px] px-6 rounded-2xl bg-slate-800 text-white font-extrabold text-sm border border-slate-600 active:scale-95"
            >
              Cancel Alert
            </button>
          </div>
        ) : (
          <div>
            <button
              type="button"
              onClick={() => {
                playChime('alert');
                setSosCountdown(3);
              }}
              className="w-28 h-28 rounded-full bg-gradient-to-br from-rose-500 to-red-700 text-white flex flex-col items-center justify-center mx-auto shadow-2xl shadow-rose-950 ring-8 ring-rose-500/20 active:scale-95 transition-transform"
            >
              <span
                className="material-symbols-outlined text-[48px]"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                emergency
              </span>
              <span className="text-xs font-black tracking-widest uppercase">SOS</span>
            </button>
            <h3 className="text-lg font-extrabold text-white mt-4">Tap to Alert Family</h3>
            <span className="text-xs text-rose-300 block mt-0.5">
              Has 3-second safety cancel countdown
            </span>
          </div>
        )}
      </div>

      {/* Safety Tools: Loud Siren & Flashing Screen */}
      <div className="grid grid-cols-2 gap-3 mb-5">
        {/* Siren Sound */}
        <button
          type="button"
          onClick={toggleSiren}
          className={`min-h-[70px] p-3.5 rounded-2xl border flex items-center gap-3 transition-all ${
            sirenActive
              ? 'bg-rose-600 text-white border-rose-400 animate-pulse font-extrabold'
              : 'bg-[#162032] text-slate-200 border-slate-700 hover:border-slate-600'
          }`}
        >
          <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-[24px]">
              {sirenActive ? 'volume_up' : 'campaign'}
            </span>
          </div>
          <div className="text-left min-w-0">
            <span className="block text-xs font-extrabold">
              {sirenActive ? 'Stop Siren' : 'Loud Siren Alarm'}
            </span>
            <span className="text-[11px] text-slate-400 block truncate">
              {sirenActive ? 'Sounding now' : 'Attract bystander'}
            </span>
          </div>
        </button>

        {/* High Flash / Strobe */}
        <button
          type="button"
          onClick={() => {
            playChime('tap');
            setStrobeActive(!strobeActive);
          }}
          className={`min-h-[70px] p-3.5 rounded-2xl border flex items-center gap-3 transition-all ${
            strobeActive
              ? 'bg-amber-400 text-slate-950 border-amber-300 font-extrabold'
              : 'bg-[#162032] text-slate-200 border-slate-700 hover:border-slate-600'
          }`}
        >
          <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-[24px]">flash_on</span>
          </div>
          <div className="text-left min-w-0">
            <span className="block text-xs font-extrabold">
              {strobeActive ? 'Stop Flashing' : 'Screen Flasher'}
            </span>
            <span className="text-[11px] text-slate-400 block truncate">
              {strobeActive ? 'Flashing active' : 'Night visual beacon'}
            </span>
          </div>
        </button>
      </div>

      {/* Immediate Call Row: 911 Emergency & Family */}
      <div className="space-y-2.5 mb-5">
        <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
          One-Tap Direct Dial:
        </span>

        {/* 911 Services */}
        <button
          type="button"
          onClick={() => {
            playChime('alert');
            speakText('Opening phone dialer for Emergency Services 911.');
          }}
          className="w-full min-h-[56px] p-3.5 rounded-2xl bg-gradient-to-r from-red-700 to-rose-700 text-white font-extrabold text-sm flex items-center justify-between shadow-md active:scale-98"
        >
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-[26px]">call</span>
            <div className="text-left">
              <span className="block text-sm font-extrabold leading-tight">
                Call 911 / Emergency Services
              </span>
              <span className="text-[11px] text-rose-200 font-normal">
                Police • Paramedics • Fire Dispatch
              </span>
            </div>
          </div>
          <span className="text-xs bg-white/20 px-3 py-1 rounded-xl font-extrabold">Dial 911</span>
        </button>

        {/* Quick Dial Emergency Contacts */}
        {emergencyContacts.map((contact) => (
          <button
            key={contact.id}
            type="button"
            onClick={() => onCallHelper(contact)}
            className="w-full min-h-[54px] p-3.5 rounded-2xl bg-[#162032] border border-slate-700 text-white font-bold text-sm flex items-center justify-between hover:border-slate-600 active:scale-98"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-emerald-600 flex items-center justify-center text-xs font-extrabold">
                {contact.avatarLetter}
              </div>
              <div className="text-left">
                <span className="block text-sm font-extrabold leading-tight">{contact.name}</span>
                <span className="text-[11px] text-emerald-400">{contact.phone}</span>
              </div>
            </div>
            <span className="text-xs text-sky-400 font-extrabold flex items-center gap-1">
              <span className="material-symbols-outlined text-[16px]">call</span> Call Now
            </span>
          </button>
        ))}
      </div>

      {/* Live Coordinates Card */}
      <div className="bg-[#162032] border border-slate-800 rounded-3xl p-4 mb-5">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-bold uppercase text-sky-400 flex items-center gap-1">
            <span className="material-symbols-outlined text-[16px]">location_on</span>
            Current GPS Coordinates
          </span>
          <button
            type="button"
            onClick={handleCopyCoordinates}
            className="text-xs font-bold text-sky-400 hover:underline min-h-[32px] flex items-center gap-1"
          >
            <span className="material-symbols-outlined text-[15px]">content_copy</span>
            <span>{copiedCoords ? 'Copied!' : 'Copy'}</span>
          </button>
        </div>

        <p className="text-sm font-bold text-white">{USER_PROFILE.currentLocation}</p>
        <p className="text-xs font-mono text-slate-400 mt-0.5">{USER_PROFILE.coordinates}</p>
      </div>

      {/* Emergency Health & Accessibility Card */}
      <div className="bg-[#162032] border border-slate-800 rounded-3xl p-4">
        <div className="flex items-center gap-2 mb-3">
          <span className="material-symbols-outlined text-rose-400 text-[20px]">badge</span>
          <h3 className="font-extrabold text-base text-white">Arthur's Medical &amp; Access ID</h3>
        </div>

        <div className="space-y-2 text-xs">
          <div className="flex justify-between py-1 border-b border-slate-800">
            <span className="text-slate-400">Mobility Need:</span>
            <span className="font-bold text-white">{USER_PROFILE.emergencyCard.mobility}</span>
          </div>

          <div className="flex justify-between py-1 border-b border-slate-800">
            <span className="text-slate-400">Medical Alert:</span>
            <span className="font-bold text-amber-300">
              {USER_PROFILE.emergencyCard.medicalAlert}
            </span>
          </div>

          <div className="flex justify-between py-1 border-b border-slate-800">
            <span className="text-slate-400">Blood Type:</span>
            <span className="font-bold text-white">{USER_PROFILE.emergencyCard.bloodType}</span>
          </div>

          <div className="flex justify-between py-1 border-b border-slate-800">
            <span className="text-slate-400">Doctor on Call:</span>
            <span className="font-bold text-sky-300">
              {USER_PROFILE.emergencyCard.primaryPhysician}
            </span>
          </div>

          <div className="flex justify-between py-1">
            <span className="text-slate-400">Closest ER:</span>
            <span className="font-bold text-white">
              {USER_PROFILE.emergencyCard.preferredHospital}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
