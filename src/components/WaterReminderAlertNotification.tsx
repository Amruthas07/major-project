import React, { useEffect, useState } from 'react';
import { Bell, Droplets, Utensils, Calendar, Plus, X, Volume2, VolumeX, ShieldCheck } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { notificationService } from '../services/notification_service';

export const WaterReminderAlertNotification: React.FC = () => {
  const {
    activeReminderAlert,
    activeWaterAlert,
    dismissReminderAlert,
    dismissWaterAlert,
    waterReminderSettings,
    waterIntakeMl,
    updateWaterIntake
  } = useAppContext();

  const [notificationPermission, setNotificationPermission] = useState<NotificationPermission>(() =>
    notificationService.getPermission()
  );

  const activeAlert = activeReminderAlert || (activeWaterAlert?.visible ? {
    type: 'water' as const,
    title: 'Water Intake Reminder',
    message: 'Time to drink a fresh glass of water. Stay hydrated for baby & mother.',
    subtext: 'Recommended: 250 ml (1 full glass)',
    timestamp: activeWaterAlert.timestamp
  } : null);

  const handleDismiss = () => {
    dismissReminderAlert();
    dismissWaterAlert();
  };

  // Auto-dismiss notification after 18 seconds if untouched
  useEffect(() => {
    if (!activeAlert) return;

    const timer = setTimeout(() => {
      handleDismiss();
    }, 18000);

    return () => clearTimeout(timer);
  }, [activeAlert?.timestamp]);

  if (!activeAlert) return null;

  const handleDrinkGlass = () => {
    updateWaterIntake(waterIntakeMl + 250);
    handleDismiss();
  };

  const handleRequestBrowserPermission = async () => {
    const perm = await notificationService.requestPermission();
    setNotificationPermission(perm);
  };

  const isWater = activeAlert.type === 'water';
  const isMeal = activeAlert.type === 'meal';
  const isDoctor = activeAlert.type === 'doctor';

  return (
    <div
      role="alert"
      aria-live="assertive"
      className="fixed bottom-6 right-4 sm:right-6 z-50 max-w-md w-[calc(100vw-2rem)] sm:w-auto bg-[#223030] text-[#EFEFE9] rounded-2xl shadow-2xl border border-[#BBA58F]/50 p-4 animate-in slide-in-from-bottom-5 duration-300 backdrop-blur-md"
    >
      <div className="flex items-start gap-3">
        {/* Dynamic Icon */}
        <div className="w-10 h-10 rounded-xl bg-[#523D35] text-[#EFEFE9] flex items-center justify-center shrink-0 shadow-xs ring-2 ring-[#BBA58F]/30 animate-bounce">
          {isWater && <Droplets className="w-5 h-5 text-[#BBA58F]" />}
          {isMeal && <Utensils className="w-5 h-5 text-[#BBA58F]" />}
          {isDoctor && <Calendar className="w-5 h-5 text-[#BBA58F]" />}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-1.5">
              <Bell className="w-3.5 h-3.5 text-[#BBA58F]" />
              <h4 className="text-sm font-black text-[#EFEFE9] tracking-tight">
                {activeAlert.title}
              </h4>
            </div>

            <button
              type="button"
              onClick={handleDismiss}
              className="text-[#959D90] hover:text-[#EFEFE9] p-1 rounded-lg hover:bg-white/10 transition cursor-pointer"
              aria-label="Close notification"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <p className="text-xs text-[#E8D9CD] mt-1 font-medium leading-relaxed">
            {activeAlert.message}
          </p>

          {activeAlert.subtext && (
            <p className="text-[11px] text-[#BBA58F] font-semibold mt-0.5">
              {activeAlert.subtext}
            </p>
          )}

          {/* Sound & Notification Status */}
          <div className="flex items-center gap-2 mt-1.5 text-[10px] text-[#BBA58F]">
            {waterReminderSettings?.soundEnabled ? (
              <span className="inline-flex items-center gap-1 text-emerald-400">
                <Volume2 className="w-3 h-3" />
                <span>Audio Alert Active</span>
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 text-[#959D90]">
                <VolumeX className="w-3 h-3" />
                <span>Audio Muted</span>
              </span>
            )}
            <span>•</span>
            {notificationPermission === 'granted' ? (
              <span className="text-emerald-400">Browser alerts enabled</span>
            ) : notificationPermission === 'default' ? (
              <button
                type="button"
                onClick={handleRequestBrowserPermission}
                className="underline hover:text-white cursor-pointer"
              >
                Enable background alerts
              </button>
            ) : (
              <span className="text-[#959D90]">Browser alerts blocked</span>
            )}
          </div>

          {/* Quick Actions */}
          <div className="flex items-center gap-2 mt-3 pt-2.5 border-t border-white/10">
            {isWater && (
              <button
                type="button"
                onClick={handleDrinkGlass}
                className="flex-1 py-1.5 px-3 rounded-xl bg-[#BBA58F] hover:bg-[#E8D9CD] text-[#223030] text-xs font-black flex items-center justify-center gap-1.5 transition shadow-xs cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>250 ml (Drank 1 Glass)</span>
              </button>
            )}

            <button
              type="button"
              onClick={handleDismiss}
              className={`py-1.5 px-3 rounded-xl bg-white/10 hover:bg-white/15 text-[#E8D9CD] text-xs font-semibold transition cursor-pointer ${
                !isWater ? 'flex-1 text-center font-bold' : ''
              }`}
            >
              {isWater ? 'Dismiss' : 'Got it / Dismiss'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
