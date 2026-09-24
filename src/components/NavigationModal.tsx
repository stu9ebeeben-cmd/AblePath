import React, { useState, useEffect } from 'react';
import { Place, RouteStep } from '../types';
import { LIBRARY_ROUTE_STEPS } from '../data/mockData';
import { speakText, stopSpeaking, playChime } from '../utils/audio';

interface NavigationModalProps {
  isOpen: boolean;
  destination: Place | null;
  onClose: () => void;
}

export const NavigationModal: React.FC<NavigationModalProps> = ({
  isOpen,
  destination,
  onClose,
}) => {
  const [currentStepIdx, setCurrentStepIdx] = useState(0);
  const [isSpeakingStep, setIsSpeakingStep] = useState(false);
  const steps: RouteStep[] = LIBRARY_ROUTE_STEPS;

  const currentStep = steps[currentStepIdx] || steps[0];
  const isFinalStep = currentStepIdx === steps.length - 1;

  useEffect(() => {
    if (isOpen && destination) {
      setCurrentStepIdx(0);
      playChime('voice_start');
      announceCurrentStep(0);
    } else {
      stopSpeaking();
    }
  }, [isOpen, destination]);

  const announceCurrentStep = (idx: number) => {
    const step = steps[idx];
    if (!step) return;
    setIsSpeakingStep(true);
    const speech = `Step ${idx + 1}. ${step.instruction}. ${step.detail}. Safety note: ${step.safeFeature}.`;
    speakText(speech, () => {
      setIsSpeakingStep(false);
    });
  };

  const handleNextStep = () => {
    if (isFinalStep) {
      playChime('success');
      speakText(`Hooray Arthur, you have safely arrived at ${destination?.name || 'your destination'}!`);
      setTimeout(() => {
        onClose();
      }, 1500);
      return;
    }
    const nextIdx = currentStepIdx + 1;
    setCurrentStepIdx(nextIdx);
    playChime('tap');
    announceCurrentStep(nextIdx);
  };

  const handlePrevStep = () => {
    if (currentStepIdx > 0) {
      const prevIdx = currentStepIdx - 1;
      setCurrentStepIdx(prevIdx);
      playChime('tap');
      announceCurrentStep(prevIdx);
    }
  };

  if (!isOpen || !destination) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-lg bg-[#162032] border-2 border-sky-400 rounded-3xl p-6 shadow-2xl relative flex flex-col max-h-[92vh] overflow-y-auto">
        {/* Header bar */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-emerald-400 animate-ping"></span>
            <span className="text-xs font-extrabold uppercase tracking-wider text-emerald-400">
              Live Safe Guidance
            </span>
          </div>
          <button
            onClick={onClose}
            aria-label="Exit guidance"
            className="min-w-[40px] min-h-[40px] rounded-full bg-slate-800 text-slate-300 hover:text-white flex items-center justify-center border border-slate-700"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Destination preview */}
        <div className="mt-3 flex items-center gap-3 bg-[#1E293B] p-3 rounded-2xl border border-slate-700">
          <img
            src={destination.image}
            alt={destination.name}
            className="w-14 h-14 rounded-xl object-cover shrink-0 border border-slate-600"
            referrerPolicy="no-referrer"
          />
          <div className="min-w-0">
            <h4 className="text-base font-extrabold text-white truncate">{destination.name}</h4>
            <p className="text-xs font-semibold text-emerald-400 flex items-center gap-1">
              <span className="material-symbols-outlined text-[15px]">accessible_forward</span>
              Zero-step route • 3 min walk (0.3 mi)
            </p>
          </div>
        </div>

        {/* Big Turn Prompt Card */}
        <div className="my-5 bg-gradient-to-br from-sky-950/60 to-slate-900 border-2 border-sky-500/50 rounded-3xl p-6 flex flex-col items-center text-center shadow-lg relative">
          <div className="w-20 h-20 rounded-3xl bg-sky-500 text-slate-950 flex items-center justify-center shadow-xl shadow-sky-500/30 mb-3">
            <span className="material-symbols-outlined text-[44px] font-bold">
              {currentStep.icon}
            </span>
          </div>

          <span className="text-xs font-extrabold bg-sky-500/20 text-sky-300 px-3 py-1 rounded-full border border-sky-400/30 mb-2">
            Step {currentStepIdx + 1} of {steps.length} • In {currentStep.distance}
          </span>

          <h3 className="text-xl font-extrabold text-white leading-tight">
            {currentStep.instruction}
          </h3>

          <p className="text-sm font-semibold text-slate-300 mt-2 leading-relaxed">
            {currentStep.detail}
          </p>

          {/* Safety highlight pill */}
          <div className="mt-4 bg-emerald-950/70 border border-emerald-400/40 text-emerald-300 px-3.5 py-2 rounded-xl text-xs font-extrabold flex items-center gap-2">
            <span className="material-symbols-outlined text-[18px]">verified_user</span>
            <span>{currentStep.safeFeature}</span>
          </div>

          {/* Repeat speech button */}
          <button
            type="button"
            onClick={() => announceCurrentStep(currentStepIdx)}
            aria-label="Repeat audio prompt"
            className="mt-4 text-xs font-bold text-sky-400 flex items-center gap-1.5 hover:underline"
          >
            <span className="material-symbols-outlined text-[18px]">
              {isSpeakingStep ? 'volume_up' : 'volume_up'}
            </span>
            <span>{isSpeakingStep ? 'Speaking...' : 'Listen to Step Again'}</span>
          </button>
        </div>

        {/* Progress Dots */}
        <div className="flex items-center justify-center gap-2 mb-5">
          {steps.map((_, i) => (
            <div
              key={i}
              className={`h-2 rounded-full transition-all ${
                i === currentStepIdx
                  ? 'w-8 bg-sky-400'
                  : i < currentStepIdx
                  ? 'w-2 bg-emerald-400'
                  : 'w-2 bg-slate-700'
              }`}
            />
          ))}
        </div>

        {/* Action Controls */}
        <div className="flex gap-3">
          {currentStepIdx > 0 && (
            <button
              type="button"
              onClick={handlePrevStep}
              className="min-h-[54px] px-4 rounded-2xl bg-slate-800 text-slate-200 border border-slate-700 font-extrabold text-sm active:scale-95"
            >
              Previous
            </button>
          )}

          <button
            type="button"
            onClick={handleNextStep}
            className="flex-1 min-h-[54px] bg-sky-500 hover:bg-sky-400 text-slate-950 font-extrabold text-base rounded-2xl flex items-center justify-center gap-2 shadow-lg active:scale-98 transition-transform"
          >
            <span>{isFinalStep ? 'Complete Journey 🎉' : 'Next Step'}</span>
            <span className="material-symbols-outlined text-[22px]">arrow_forward</span>
          </button>
        </div>
      </div>
    </div>
  );
};
