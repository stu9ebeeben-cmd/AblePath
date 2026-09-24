import React, { useState, useEffect } from 'react';
import { TextSizeMode } from '../types';
import { speakText, stopSpeaking, isSpeaking, playChime } from '../utils/audio';

interface HeaderProps {
  textSizeMode: TextSizeMode;
  onToggleTextSize: () => void;
  currentScreenSummary: string;
}

export const Header: React.FC<HeaderProps> = ({
  textSizeMode,
  onToggleTextSize,
  currentScreenSummary,
}) => {
  const [audioActive, setAudioActive] = useState(false);

  // Monitor speaking state
  useEffect(() => {
    const interval = setInterval(() => {
      setAudioActive(isSpeaking());
    }, 250);
    return () => clearInterval(interval);
  }, []);

  const handleAudioReader = () => {
    if (audioActive) {
      stopSpeaking();
      setAudioActive(false);
    } else {
      playChime('tap');
      setAudioActive(true);
      speakText(currentScreenSummary, () => {
        setAudioActive(false);
      });
    }
  };

  const isBig = textSizeMode !== 'normal';

  return (
    <header className="fixed top-0 w-full z-50 pt-safe bg-[#0B0F17]/95 backdrop-blur-md border-b border-slate-800 shadow-lg">
      <div className="h-20 px-4 flex items-center justify-between gap-2 max-w-xl mx-auto">
        {/* Logo & Personal Greeting */}
        <div className="flex items-center gap-3">
          <div className="relative">
            <img
              alt="Arthur"
              className="w-12 h-12 rounded-full object-cover border-2 border-sky-400 shadow-md ring-2 ring-sky-500/20"
              src="https://lh3.googleusercontent.com/aida/AEtjO1UXeENrlIKkJmjK4iT_QDJrlRMjtTa24-FkbR0sj6CZtS-lIS3DS_dipQQmRs5I6ndScvCYdyJX9U_pmtUaeuY1BILeki_6ziWJY_sGO_AJTkmlL08A-w92DCV8EFeQz9nYzQ7VLCJus2h45j7XSAaTNCSSETD1REH2XKEqdow8aziN_cD_zkeuPNFF90NU9TJcL_py4Z4z6J5WRb66OyVBjbizJuoAElnupBiCIyT41A"
              referrerPolicy="no-referrer"
            />
            <span
              className="absolute bottom-0 right-0 w-4 h-4 bg-emerald-400 border-2 border-[#0B0F17] rounded-full shadow-sm"
              title="Online & GPS active"
            />
          </div>
          <div>
            <span className="block text-xs font-bold uppercase tracking-wider text-emerald-400">
              AblePath • Hello
            </span>
            <h1 className="text-xl font-extrabold text-white flex items-center gap-1 leading-tight">
              Hi, Arthur! <span className="text-lg">👋</span>
            </h1>
          </div>
        </div>

        {/* Universal Accessibility / Big Text & Voice Toggle */}
        <div className="flex items-center gap-2">
          {/* Big Text Switcher */}
          <button
            type="button"
            onClick={() => {
              playChime('tap');
              onToggleTextSize();
            }}
            aria-label={`Toggle Big Text mode. Current: ${textSizeMode}`}
            className={`min-h-[52px] px-3.5 py-2 rounded-2xl font-bold text-sm flex items-center gap-2 border-2 shadow-md active:scale-95 transition-all ${
              isBig
                ? 'bg-sky-500 text-slate-950 border-sky-300 ring-2 ring-sky-400/40 shadow-sky-500/20'
                : 'bg-[#1E293B] text-sky-300 border-sky-500/30 hover:bg-slate-800'
            }`}
          >
            <span
              className={`material-symbols-outlined text-[24px] font-bold ${
                isBig ? 'text-slate-950' : 'text-sky-400'
              }`}
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              format_size
            </span>
            <div className="text-left hidden xs:block">
              <span
                className={`block text-[10px] uppercase tracking-wide leading-none ${
                  isBig ? 'text-slate-900 font-extrabold' : 'text-slate-400'
                }`}
              >
                View
              </span>
              <span
                className={`font-extrabold leading-tight text-xs ${
                  isBig ? 'text-slate-950' : 'text-white'
                }`}
              >
                {textSizeMode === 'extra-big' ? 'AAA Text' : 'Big Text'}
              </span>
            </div>
          </button>

          {/* Audio Reader Button */}
          <button
            type="button"
            onClick={handleAudioReader}
            aria-label={audioActive ? 'Stop audio narrator' : 'Listen to screen summary'}
            className={`min-w-[52px] min-h-[52px] w-[52px] h-[52px] rounded-2xl border-2 flex items-center justify-center shadow-md active:scale-95 transition-all ${
              audioActive
                ? 'bg-emerald-500 text-slate-950 border-emerald-300 animate-pulse ring-2 ring-emerald-400/50'
                : 'bg-[#1E293B] border-slate-700 text-sky-300 hover:text-white hover:border-slate-600'
            }`}
            title="Read screen aloud"
          >
            <span className="material-symbols-outlined text-[26px]">
              {audioActive ? 'volume_up' : 'volume_up'}
            </span>
          </button>
        </div>
      </div>
    </header>
  );
};
