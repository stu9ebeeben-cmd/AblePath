import React, { useState, useEffect, useRef } from 'react';
import { speakText, stopSpeaking, playChime } from '../utils/audio';

interface VoiceAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCommand: (command: string, category?: string) => void;
}

export const VoiceAssistantModal: React.FC<VoiceAssistantModalProps> = ({
  isOpen,
  onClose,
  onCommand,
}) => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [assistantReply, setAssistantReply] = useState('');
  const [supportSpeech, setSupportSpeech] = useState(false);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        setSupportSpeech(true);
        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = true;
        recognition.lang = 'en-US';

        recognition.onstart = () => {
          setIsListening(true);
          playChime('voice_start');
        };

        recognition.onresult = (event: any) => {
          const current = event.resultIndex;
          const text = event.results[current][0].transcript;
          setTranscript(text);
          if (event.results[current].isFinal) {
            handleProcessCommand(text);
          }
        };

        recognition.onerror = () => {
          setIsListening(false);
        };

        recognition.onend = () => {
          setIsListening(false);
        };

        recognitionRef.current = recognition;
      }
    }
  }, []);

  useEffect(() => {
    if (isOpen) {
      setTranscript('');
      setAssistantReply('Listening for your voice... Tap a suggestion below or speak naturally.');
      if (recognitionRef.current && supportSpeech) {
        try {
          recognitionRef.current.start();
        } catch {
          // Ignored if already started
        }
      }
    } else {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch {
          // Ignored
        }
      }
      stopSpeaking();
    }
  }, [isOpen, supportSpeech]);

  const handleProcessCommand = (text: string) => {
    const lower = text.toLowerCase();
    let reply = '';
    let category = '';

    if (lower.includes('quiet') || lower.includes('park') || lower.includes('sensory')) {
      reply = 'Finding quiet spaces with calm sensory zones and park benches.';
      category = 'quiet';
    } else if (lower.includes('ramp') || lower.includes('step') || lower.includes('wheelchair')) {
      reply = 'Filtering for places with smooth ramps and zero steps.';
      category = 'ramps';
    } else if (lower.includes('elevator') || lower.includes('lift')) {
      reply = 'Checking elevators. Note: 8th St elevator is resting, but Pine St ramp is clear.';
      category = 'elevators';
    } else if (lower.includes('restroom') || lower.includes('bathroom') || lower.includes('toilet') || lower.includes('wc')) {
      reply = 'Showing accessible family and wheelchair-friendly restrooms nearby.';
      category = 'restrooms';
    } else if (lower.includes('mom') || lower.includes('call') || lower.includes('dad') || lower.includes('help')) {
      reply = 'Opening quick call to your trusted helper.';
      category = 'helper';
    } else {
      reply = `Searching for "${text}" with safe, step-free routes.`;
      category = 'search';
    }

    setAssistantReply(reply);
    speakText(reply, () => {
      setTimeout(() => {
        onCommand(text, category);
        onClose();
      }, 800);
    });
  };

  const handlePresetClick = (phrase: string) => {
    playChime('tap');
    setTranscript(phrase);
    handleProcessCommand(phrase);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-lg bg-[#162032] border-2 border-sky-500/50 rounded-3xl p-6 shadow-2xl relative flex flex-col items-center text-center">
        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="Close voice assistant"
          className="absolute top-4 right-4 min-w-[44px] min-h-[44px] rounded-full bg-slate-800 text-slate-300 hover:text-white flex items-center justify-center border border-slate-700 active:scale-95"
        >
          <span className="material-symbols-outlined text-[24px]">close</span>
        </button>

        {/* Header Icon */}
        <div className="relative mb-4 mt-2">
          <div
            className={`w-20 h-20 rounded-3xl bg-gradient-to-br from-sky-500 to-indigo-700 flex items-center justify-center shadow-lg shadow-sky-500/30 ${
              isListening ? 'ring-4 ring-sky-400 ring-offset-4 ring-offset-[#162032] animate-pulse' : ''
            }`}
          >
            <span className="material-symbols-outlined text-[42px] text-white">mic</span>
          </div>
          {isListening && (
            <span className="absolute -bottom-2 bg-emerald-500 text-slate-950 text-[11px] font-extrabold px-2.5 py-0.5 rounded-full shadow">
              Listening
            </span>
          )}
        </div>

        <h3 className="text-2xl font-extrabold text-white">Talk to AblePath</h3>
        <p className="text-sm font-semibold text-slate-300 mt-1 max-w-xs">
          Speak in simple words, or choose one of the quick options below.
        </p>

        {/* Live Audio / Transcript Box */}
        <div className="w-full bg-[#1E293B] border-2 border-slate-700 rounded-2xl p-4 my-5 min-h-[88px] flex flex-col justify-center items-center">
          {transcript ? (
            <p className="text-lg font-bold text-sky-300">"{transcript}"</p>
          ) : (
            <p className="text-sm font-semibold text-slate-400 italic">
              Say something like "Find quiet park" or "Where is the ramp?"
            </p>
          )}
          {assistantReply && (
            <p className="text-xs font-bold text-emerald-400 mt-2 flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[16px]">volume_up</span>
              {assistantReply}
            </p>
          )}
        </div>

        {/* One-Tap Voice Shortcuts */}
        <div className="w-full text-left">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 block">
            Tap to Ask Instantly:
          </span>
          <div className="grid grid-cols-2 gap-2">
            {[
              { label: 'Find quiet park', icon: 'volume_off', color: 'border-emerald-500/40 text-emerald-300' },
              { label: 'Smooth ramps only', icon: 'accessible_forward', color: 'border-sky-500/40 text-sky-300' },
              { label: 'Easy restrooms', icon: 'wc', color: 'border-amber-500/40 text-amber-300' },
              { label: 'Call my helper', icon: 'call', color: 'border-rose-500/40 text-rose-300' },
            ].map((shortcut) => (
              <button
                key={shortcut.label}
                type="button"
                onClick={() => handlePresetClick(shortcut.label)}
                className={`min-h-[50px] p-2.5 rounded-xl bg-[#1E293B] border ${shortcut.color} flex items-center gap-2 hover:bg-slate-800 active:scale-95 text-left text-xs font-extrabold shadow-sm`}
              >
                <span className="material-symbols-outlined text-[20px]">{shortcut.icon}</span>
                <span className="truncate">{shortcut.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Manual Tap-to-Speak Button */}
        <button
          type="button"
          onClick={() => {
            if (recognitionRef.current) {
              try {
                if (isListening) {
                  recognitionRef.current.stop();
                  setIsListening(false);
                } else {
                  recognitionRef.current.start();
                  setIsListening(true);
                }
              } catch {
                setIsListening(false);
              }
            } else {
              handlePresetClick('Find quiet park');
            }
          }}
          className="mt-6 w-full min-h-[52px] bg-sky-500 hover:bg-sky-400 text-slate-950 font-extrabold text-base rounded-2xl flex items-center justify-center gap-2 shadow-lg active:scale-98"
        >
          <span className="material-symbols-outlined text-[22px]">
            {isListening ? 'pause_circle' : 'mic'}
          </span>
          <span>{isListening ? 'Stop Listening' : 'Tap & Speak Now'}</span>
        </button>
      </div>
    </div>
  );
};
