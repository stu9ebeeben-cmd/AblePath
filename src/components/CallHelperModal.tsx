import React, { useState, useEffect } from 'react';
import { Helper } from '../types';
import { playChime, speakText } from '../utils/audio';

interface CallHelperModalProps {
  helper: Helper | null;
  onClose: () => void;
}

export const CallHelperModal: React.FC<CallHelperModalProps> = ({ helper, onClose }) => {
  const [callState, setCallState] = useState<'calling' | 'connected' | 'ended'>('calling');
  const [seconds, setSeconds] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isSpeaker, setIsSpeaker] = useState(true);

  useEffect(() => {
    if (!helper) return;
    setCallState('calling');
    setSeconds(0);
    playChime('tap');

    // Simulate answer after 2.5 seconds
    const timer = setTimeout(() => {
      setCallState('connected');
      playChime('success');
      speakText(`Hi Arthur, this is ${helper.shortName}. Are you doing alright at the Plaza?`);
    }, 2400);

    return () => clearTimeout(timer);
  }, [helper]);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null;
    if (callState === 'connected') {
      interval = setInterval(() => {
        setSeconds((s) => s + 1);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [callState]);

  if (!helper) return null;

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const handleEndCall = () => {
    setCallState('ended');
    playChime('alert');
    setTimeout(() => {
      onClose();
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-sm bg-[#162032] border-2 border-slate-700 rounded-3xl p-6 shadow-2xl flex flex-col items-center text-center">
        {/* Helper Avatar Ring */}
        <div className="relative mt-2 mb-4">
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-emerald-500 to-sky-600 text-white font-extrabold text-3xl flex items-center justify-center shadow-xl border-4 border-slate-800 ring-4 ring-emerald-500/30">
            {helper.avatarLetter}
          </div>
          <span className="absolute bottom-0 right-1 w-5 h-5 bg-emerald-400 border-2 border-[#162032] rounded-full"></span>
        </div>

        <h3 className="text-2xl font-extrabold text-white">{helper.name}</h3>
        <p className="text-sm font-semibold text-emerald-400 mt-0.5">{helper.relation}</p>
        <p className="text-xs text-slate-400 mt-0.5">{helper.phone || 'Cell Phone Network'}</p>

        {/* Call Status Badge */}
        <div className="my-5 px-4 py-1.5 rounded-full bg-slate-800/90 border border-slate-700">
          {callState === 'calling' && (
            <span className="text-sm font-bold text-sky-300 animate-pulse flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px]">ring_volume</span>
              Calling helper...
            </span>
          )}
          {callState === 'connected' && (
            <span className="text-sm font-extrabold text-emerald-300 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
              Connected • {formatTime(seconds)}
            </span>
          )}
          {callState === 'ended' && (
            <span className="text-sm font-bold text-slate-400">Call Ended</span>
          )}
        </div>

        {/* Quick Voice / Text Helper Prompt */}
        <div className="w-full bg-[#1E293B] rounded-2xl p-3 border border-slate-700 mb-6 text-left">
          <span className="text-[11px] font-bold uppercase text-slate-400 block mb-1">
            Arthur's Quick Status:
          </span>
          <p className="text-xs font-semibold text-white">
            "I am at Civic Garden Plaza on safe Pine St route. Battery is 88%."
          </p>
        </div>

        {/* Call Controls */}
        <div className="flex items-center justify-center gap-5 w-full mb-6">
          {/* Mute */}
          <button
            type="button"
            onClick={() => {
              playChime('tap');
              setIsMuted(!isMuted);
            }}
            aria-label={isMuted ? 'Unmute microphone' : 'Mute microphone'}
            className={`w-14 h-14 rounded-2xl flex flex-col items-center justify-center border transition-all ${
              isMuted
                ? 'bg-rose-500/20 border-rose-500 text-rose-300'
                : 'bg-slate-800 border-slate-700 text-slate-300 hover:text-white'
            }`}
          >
            <span className="material-symbols-outlined text-[24px]">
              {isMuted ? 'mic_off' : 'mic'}
            </span>
            <span className="text-[10px] font-bold mt-0.5">{isMuted ? 'Muted' : 'Mute'}</span>
          </button>

          {/* Speakerphone */}
          <button
            type="button"
            onClick={() => {
              playChime('tap');
              setIsSpeaker(!isSpeaker);
            }}
            aria-label={isSpeaker ? 'Speakerphone on' : 'Speakerphone off'}
            className={`w-14 h-14 rounded-2xl flex flex-col items-center justify-center border transition-all ${
              isSpeaker
                ? 'bg-sky-500/20 border-sky-400 text-sky-300'
                : 'bg-slate-800 border-slate-700 text-slate-300 hover:text-white'
            }`}
          >
            <span className="material-symbols-outlined text-[24px]">volume_up</span>
            <span className="text-[10px] font-bold mt-0.5">Speaker</span>
          </button>
        </div>

        {/* End Call Button */}
        <button
          type="button"
          onClick={handleEndCall}
          className="w-full min-h-[56px] rounded-2xl bg-rose-600 hover:bg-rose-500 text-white font-extrabold text-base flex items-center justify-center gap-2 shadow-lg shadow-rose-950/50 active:scale-95 transition-transform"
        >
          <span className="material-symbols-outlined text-[24px]" style={{ fontVariationSettings: "'FILL' 1" }}>
            call_end
          </span>
          <span>End Call</span>
        </button>
      </div>
    </div>
  );
};
