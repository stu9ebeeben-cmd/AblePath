import React, { useState } from 'react';
import { ObstacleReport } from '../types';
import { playChime, speakText } from '../utils/audio';

interface ReportObstacleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (obstacle: ObstacleReport) => void;
}

export const ReportObstacleModal: React.FC<ReportObstacleModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
}) => {
  const [category, setCategory] = useState<ObstacleReport['category']>('Broken Elevator');
  const [title, setTitle] = useState('');
  const [location, setLocation] = useState('Near Pine St & 8th St Crossing');
  const [severity, setSeverity] = useState<ObstacleReport['severity']>('High');
  const [photoSnapped, setPhotoSnapped] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    playChime('success');

    const newReport: ObstacleReport = {
      id: `obs-${Date.now()}`,
      title: title || `${category} reported at ${location}`,
      category,
      location,
      timeAgo: 'Just now',
      reportedBy: 'Arthur (You) & Community',
      status: 'Active Warning',
      severity,
      upvotes: 1,
      image: photoSnapped
        ? 'https://lh3.googleusercontent.com/aida-public/AB6AXuBT6zZV7jyE5Qqo6RBXtgTyo9N-qZQY7mmp_CLwvTcTSH2GfXa51JD-01TG3bmpuK_9pKBgOtqooPZsXuh5yQHilA4xlSos-e11MG5AkLMA3H76oHN-ulQMEgPZM8coP9F9mnOUdP8S2va5xj3eS6MXbjccJy31v3eL5KjBUvr-1wLMFJ_GhEnXfnHLDtZxyyQ-vrJ9QKwuDqXl94mH4DqFAxg8qo5DbzS9nxsE0RNN'
        : undefined,
    };

    speakText('Thank you Arthur! Your obstacle alert is now live for all neighbors.');

    setTimeout(() => {
      onSubmit(newReport);
      setIsSubmitting(false);
      onClose();
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-lg bg-[#162032] border-2 border-slate-700 rounded-3xl p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          aria-label="Close dialog"
          className="absolute top-4 right-4 min-w-[44px] min-h-[44px] rounded-full bg-slate-800 text-slate-300 hover:text-white flex items-center justify-center border border-slate-700 active:scale-95"
        >
          <span className="material-symbols-outlined text-[24px]">close</span>
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-400/30 flex items-center justify-center">
            <span className="material-symbols-outlined text-[28px]">add_a_photo</span>
          </div>
          <div>
            <h3 className="text-xl font-extrabold text-white">Spot an Obstacle?</h3>
            <p className="text-xs text-slate-400">Warn neighbors and keep routes safe</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Snap Photo Action */}
          <div>
            <label className="block text-xs font-bold uppercase text-slate-300 mb-2">
              Photo of Hazard:
            </label>
            <div
              onClick={() => {
                playChime('tap');
                setPhotoSnapped(!photoSnapped);
              }}
              className={`w-full h-32 rounded-2xl border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-all ${
                photoSnapped
                  ? 'border-emerald-400 bg-emerald-950/20 text-emerald-300'
                  : 'border-slate-600 bg-slate-800/60 text-slate-400 hover:border-sky-400'
              }`}
            >
              {photoSnapped ? (
                <div className="flex flex-col items-center gap-1">
                  <span className="material-symbols-outlined text-[36px] text-emerald-400">
                    check_circle
                  </span>
                  <span className="text-xs font-bold text-white">Photo Captured! Tap to retake</span>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-1">
                  <span className="material-symbols-outlined text-[36px]">photo_camera</span>
                  <span className="text-xs font-bold text-slate-300">Tap to Snap Photo with Camera</span>
                  <span className="text-[11px] text-slate-500">Fast 1-tap capture</span>
                </div>
              )}
            </div>
          </div>

          {/* Obstacle Type */}
          <div>
            <label className="block text-xs font-bold uppercase text-slate-300 mb-2">
              Obstacle Category:
            </label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { type: 'Broken Elevator', icon: 'elevator' },
                { type: 'Blocked Ramp', icon: 'accessible_forward' },
                { type: 'Steep Curb', icon: 'stairs' },
                { type: 'Construction', icon: 'construction' },
              ].map((item) => (
                <button
                  key={item.type}
                  type="button"
                  onClick={() => {
                    playChime('tap');
                    setCategory(item.type as any);
                  }}
                  className={`min-h-[48px] p-2 rounded-xl text-xs font-bold flex items-center gap-2 border transition-all ${
                    category === item.type
                      ? 'bg-sky-500 text-slate-950 border-sky-400 font-extrabold shadow'
                      : 'bg-slate-800 text-slate-300 border-slate-700 hover:text-white'
                  }`}
                >
                  <span className="material-symbols-outlined text-[20px]">{item.icon}</span>
                  <span className="truncate">{item.type}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Location field */}
          <div>
            <label className="block text-xs font-bold uppercase text-slate-300 mb-1">
              Location / Intersection:
            </label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full h-12 bg-slate-800 rounded-xl px-4 text-white text-sm font-semibold border border-slate-700 focus:outline-none focus:border-sky-400"
              placeholder="e.g. 8th St & Pine St Corner"
              required
            />
          </div>

          {/* Severity */}
          <div>
            <label className="block text-xs font-bold uppercase text-slate-300 mb-1">
              Impact on Wheelchairs & Walkers:
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { level: 'High', desc: 'Completely Blocked', color: 'border-rose-500 text-rose-300' },
                { level: 'Medium', desc: 'Use Caution', color: 'border-amber-500 text-amber-300' },
                { level: 'Low', desc: 'Minor Bump', color: 'border-emerald-500 text-emerald-300' },
              ].map((s) => (
                <button
                  key={s.level}
                  type="button"
                  onClick={() => setSeverity(s.level as any)}
                  className={`p-2 rounded-xl border text-center transition-all ${
                    severity === s.level
                      ? 'bg-slate-700 font-extrabold ring-2 ring-sky-400'
                      : 'bg-slate-800/80 hover:bg-slate-800'
                  }`}
                >
                  <span className={`block text-xs font-extrabold ${s.color}`}>{s.level}</span>
                  <span className="text-[10px] text-slate-400">{s.desc}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Submit CTA */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full min-h-[54px] mt-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-base rounded-2xl flex items-center justify-center gap-2 shadow-lg active:scale-98"
          >
            <span className="material-symbols-outlined text-[24px]">send</span>
            <span>{isSubmitting ? 'Posting Alert...' : 'Share Alert with Neighbors'}</span>
          </button>
        </form>
      </div>
    </div>
  );
};
