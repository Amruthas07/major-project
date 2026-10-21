import React, { useEffect } from 'react';
import { Bell, Droplets, Plus, X, Volume2, VolumeX } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { useLanguage, DualText } from '../services/language_service';

export const WaterReminderAlertNotification: React.FC = () => {
  const {
    activeWaterAlert,
    dismissWaterAlert,
    waterReminderSettings,
    waterIntakeMl,
    updateWaterIntake
  } = useAppContext();

  const { currentLanguage } = useLanguage();

  // Auto-dismiss notification after 18 seconds if untouched
  useEffect(() => {
    if (!activeWaterAlert?.visible) return;

    const timer = setTimeout(() => {
      dismissWaterAlert();
    }, 18000);

    return () => clearTimeout(timer);
  }, [activeWaterAlert?.visible, activeWaterAlert?.timestamp, dismissWaterAlert]);

  if (!activeWaterAlert?.visible) return null;

  const handleDrinkGlass = () => {
    updateWaterIntake(waterIntakeMl + 250);
    dismissWaterAlert();
  };

  return (
    <div
      role="alert"
      aria-live="assertive"
      className="fixed bottom-6 right-4 sm:right-6 z-50 max-w-md w-[calc(100vw-2rem)] sm:w-auto bg-[#223030] text-[#EFEFE9] rounded-2xl shadow-2xl border border-[#BBA58F]/50 p-4 animate-in slide-in-from-bottom-5 duration-300 backdrop-blur-md"
    >
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-xl bg-[#523D35] text-[#EFEFE9] flex items-center justify-center shrink-0 shadow-xs ring-2 ring-[#BBA58F]/30 animate-bounce">
          <Droplets className="w-5 h-5 text-[#BBA58F]" />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-1.5">
              <Bell className="w-3.5 h-3.5 text-[#BBA58F]" />
              <h4 className="text-sm font-black text-[#EFEFE9] tracking-tight">
                <DualText
                  textKey="water.reminders"
                  fallback="Water Intake Reminder"
                  className="font-bold text-[#EFEFE9]"
                  miniClassName="text-[#BBA58F] text-[10px]"
                />
              </h4>
            </div>

            <button
              type="button"
              onClick={dismissWaterAlert}
              className="text-[#959D90] hover:text-[#EFEFE9] p-1 rounded-lg hover:bg-white/10 transition cursor-pointer"
              aria-label="Close notification"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="text-xs text-[#E8D9CD] mt-1 font-medium italic">
            “<DualText textKey="water.reminderMessage" fallback="Time to drink some water." className="text-xs" inline />”
          </div>

          <div className="flex items-center gap-2 mt-1 text-[11px] text-[#BBA58F]">
            {waterReminderSettings?.soundEnabled ? (
              <span className="inline-flex items-center gap-1">
                <Volume2 className="w-3 h-3" />
                <span>Sound Alert ON</span>
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 text-[#959D90]">
                <VolumeX className="w-3 h-3" />
                <span>Sound Alert OFF</span>
              </span>
            )}
            <span>•</span>
            <span>Stay well hydrated for baby &amp; mother</span>
          </div>

          {/* Quick Response Actions */}
          <div className="flex items-center gap-2 mt-3 pt-2.5 border-t border-white/10">
            <button
              type="button"
              onClick={handleDrinkGlass}
              className="flex-1 py-1.5 px-3 rounded-xl bg-[#BBA58F] hover:bg-[#E8D9CD] text-[#223030] text-xs font-black flex items-center justify-center gap-1.5 transition shadow-xs cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>250 ml (Drank 1 Glass)</span>
            </button>

            <button
              type="button"
              onClick={dismissWaterAlert}
              className="py-1.5 px-3 rounded-xl bg-white/10 hover:bg-white/15 text-[#E8D9CD] text-xs font-semibold transition cursor-pointer"
            >
              Dismiss
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
