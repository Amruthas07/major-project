import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { MealReminderSettings, DoctorReminderSettings } from '../types';
import {
  Bell,
  Droplets,
  Utensils,
  Calendar,
  Check,
  X,
  Clock,
  ShieldCheck,
  Sparkles
} from 'lucide-react';

interface SmartReminderModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SmartReminderModal: React.FC<SmartReminderModalProps> = ({ isOpen, onClose }) => {
  const {
    userProfile,
    updateUserProfile,
    waterReminderSettings,
    updateWaterReminder,
    updateDoctorVisit
  } = useAppContext();

  // 1. Water Reminder local state initialized from centralized profile/settings
  const [waterEnabled, setWaterEnabled] = useState(waterReminderSettings?.enabled ?? true);
  const [waterSchedule, setWaterSchedule] = useState<'1hour' | '2hours' | 'custom'>(
    (userProfile.waterReminderSettings?.scheduleType as any) ||
      (waterReminderSettings?.intervalMinutes === 120 ? '2hours' : '1hour')
  );
  const [waterCustomMinutes, setWaterCustomMinutes] = useState(
    waterReminderSettings?.intervalMinutes || 60
  );

  // 2. Meal Reminders local state
  const defaultMealSettings: MealReminderSettings = {
    enabled: true,
    breakfast: { enabled: true, time: '08:00' },
    morningSnack: { enabled: true, time: '10:30' },
    lunch: { enabled: true, time: '13:00' },
    eveningSnack: { enabled: true, time: '17:00' },
    dinner: { enabled: true, time: '20:00' }
  };

  const [mealSettings, setMealSettings] = useState<MealReminderSettings>(
    userProfile.mealReminderSettings || defaultMealSettings
  );

  // 3. Doctor Visit Reminder local state
  const defaultDoctorSettings: DoctorReminderSettings = {
    enabled: true,
    advanceNotice: '24hours'
  };

  const [doctorSettings, setDoctorSettings] = useState<DoctorReminderSettings>(
    userProfile.doctorReminderSettings || defaultDoctorSettings
  );

  const [doctorVisitDate, setDoctorVisitDate] = useState<string>(
    userProfile.nextDoctorVisit?.date || userProfile.doctorDetails?.nextAppointmentDate || ''
  );
  const [doctorVisitTime, setDoctorVisitTime] = useState<string>(
    userProfile.nextDoctorVisit?.time || userProfile.doctorDetails?.nextAppointmentTime || ''
  );
  const [doctorName, setDoctorName] = useState<string>(
    userProfile.nextDoctorVisit?.doctorName || userProfile.doctorDetails?.name || ''
  );
  const [hospitalName, setHospitalName] = useState<string>(
    userProfile.nextDoctorVisit?.hospitalName || userProfile.doctorDetails?.hospital || ''
  );
  const [doctorNotes, setDoctorNotes] = useState<string>(
    userProfile.nextDoctorVisit?.notes || ''
  );

  const [isSavedNotice, setIsSavedNotice] = useState(false);

  if (!isOpen) return null;

  const handleSave = () => {
    // Determine interval minutes
    let interval = 60;
    if (waterSchedule === '2hours') interval = 120;
    if (waterSchedule === 'custom') interval = Math.max(15, waterCustomMinutes);

    // Save Water reminder
    updateWaterReminder({
      enabled: waterEnabled,
      intervalMinutes: interval
    });

    // Save to userProfile (central persistent storage)
    updateUserProfile({
      waterReminderSettings: {
        enabled: waterEnabled,
        intervalMinutes: interval,
        scheduleType: waterSchedule
      },
      mealReminderSettings: mealSettings,
      doctorReminderSettings: doctorSettings
    });

    updateDoctorVisit({
      date: doctorVisitDate,
      time: doctorVisitTime,
      doctorName: doctorName,
      hospitalName: hospitalName,
      notes: doctorNotes,
      reminderEnabled: doctorSettings.enabled
    });

    setIsSavedNotice(true);
    setTimeout(() => {
      setIsSavedNotice(false);
      onClose();
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#223030]/75 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-[#EFEFE9] border border-[#959D90] rounded-3xl max-w-xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 shadow-2xl space-y-6 animate-in fade-in">
        {/* Modal Header */}
        <div className="flex items-start justify-between gap-4 border-b border-[#959D90]/30 pb-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#523D35] text-[#E8D9CD] text-xs font-bold uppercase tracking-wider mb-2">
              <Bell className="w-3.5 h-3.5 text-[#BBA58F]" />
              <span>Smart Maternal Reminders</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-[#223030] tracking-tight">
              Reminder Preferences
            </h2>
            <p className="text-xs text-[#523D35] mt-1">
              Configure water, 5-interval meal alerts, and prenatal doctor visit notifications. Preferences are saved to your profile.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#E8D9CD] hover:bg-[#BBA58F]/40 text-[#223030] flex items-center justify-center transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* SECTION 1: WATER REMINDERS */}
        <div className="bg-[#E8D9CD] rounded-2xl p-5 border border-[#959D90]/50 space-y-3.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-[#223030] text-[#EFEFE9] flex items-center justify-center font-bold">
                <Droplets className="w-4 h-4 text-[#BBA58F]" />
              </div>
              <div>
                <h3 className="text-sm font-black text-[#223030]">💧 Hydration Reminders</h3>
                <p className="text-[11px] text-[#523D35]">Keeps amniotic fluid levels safe and prevents dehydration headaches.</p>
              </div>
            </div>

            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={waterEnabled}
                onChange={(e) => setWaterEnabled(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-[#959D90] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#223030]"></div>
            </label>
          </div>

          {waterEnabled && (
            <div className="space-y-2 pt-2 border-t border-[#959D90]/30">
              <span className="text-xs font-bold text-[#223030] block">Schedule Frequency:</span>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setWaterSchedule('1hour')}
                  className={`py-2 px-3 rounded-xl text-xs font-bold transition cursor-pointer ${
                    waterSchedule === '1hour'
                      ? 'bg-[#223030] text-[#EFEFE9] shadow-xs'
                      : 'bg-[#EFEFE9] text-[#523D35] hover:bg-[#BBA58F]/30'
                  }`}
                >
                  Every 1 Hour
                </button>
                <button
                  type="button"
                  onClick={() => setWaterSchedule('2hours')}
                  className={`py-2 px-3 rounded-xl text-xs font-bold transition cursor-pointer ${
                    waterSchedule === '2hours'
                      ? 'bg-[#223030] text-[#EFEFE9] shadow-xs'
                      : 'bg-[#EFEFE9] text-[#523D35] hover:bg-[#BBA58F]/30'
                  }`}
                >
                  Every 2 Hours
                </button>
                <button
                  type="button"
                  onClick={() => setWaterSchedule('custom')}
                  className={`py-2 px-3 rounded-xl text-xs font-bold transition cursor-pointer ${
                    waterSchedule === 'custom'
                      ? 'bg-[#223030] text-[#EFEFE9] shadow-xs'
                      : 'bg-[#EFEFE9] text-[#523D35] hover:bg-[#BBA58F]/30'
                  }`}
                >
                  Custom Schedule
                </button>
              </div>

              {waterSchedule === 'custom' && (
                <div className="pt-2 flex items-center gap-2 text-xs">
                  <span className="text-[#523D35] font-semibold">Notify every:</span>
                  <input
                    type="number"
                    min="15"
                    max="240"
                    step="15"
                    value={waterCustomMinutes}
                    onChange={(e) => setWaterCustomMinutes(Number(e.target.value))}
                    className="w-20 px-2.5 py-1.5 rounded-lg border border-[#959D90] bg-[#EFEFE9] text-[#223030] font-bold text-center"
                  />
                  <span className="text-[#523D35]">minutes</span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* SECTION 2: MEAL REMINDERS */}
        <div className="bg-[#E8D9CD] rounded-2xl p-5 border border-[#959D90]/50 space-y-3.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-[#223030] text-[#EFEFE9] flex items-center justify-center font-bold">
                <Utensils className="w-4 h-4 text-[#BBA58F]" />
              </div>
              <div>
                <h3 className="text-sm font-black text-[#223030]">🍽️ 5 Maternal Meal Reminders</h3>
                <p className="text-[11px] text-[#523D35]">Alerts for all 5 intervals to prevent blood sugar drops.</p>
              </div>
            </div>

            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={mealSettings.enabled}
                onChange={(e) =>
                  setMealSettings((prev) => ({ ...prev, enabled: e.target.checked }))
                }
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-[#959D90] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#223030]"></div>
            </label>
          </div>

          {mealSettings.enabled && (
            <div className="space-y-2 pt-2 border-t border-[#959D90]/30 text-xs">
              {(
                [
                  { key: 'breakfast', label: '🌅 Breakfast' },
                  { key: 'morningSnack', label: '🍎 Morning Snack' },
                  { key: 'lunch', label: '🍛 Lunch' },
                  { key: 'eveningSnack', label: '☕ Evening Snack' },
                  { key: 'dinner', label: '🌙 Dinner' }
                ] as const
              ).map(({ key, label }) => {
                const item = mealSettings[key];
                return (
                  <div
                    key={key}
                    className="flex items-center justify-between p-2 rounded-xl bg-[#EFEFE9] border border-[#959D90]/30"
                  >
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={item.enabled}
                        onChange={(e) =>
                          setMealSettings((prev) => ({
                            ...prev,
                            [key]: { ...prev[key], enabled: e.target.checked }
                          }))
                        }
                        className="rounded border-[#959D90] text-[#223030] focus:ring-0"
                      />
                      <span className="font-bold text-[#223030]">{label}</span>
                    </div>

                    <input
                      type="time"
                      value={item.time}
                      disabled={!item.enabled}
                      onChange={(e) =>
                        setMealSettings((prev) => ({
                          ...prev,
                          [key]: { ...prev[key], time: e.target.value }
                        }))
                      }
                      className="px-2.5 py-1 rounded-lg border border-[#959D90] bg-white text-[#223030] font-bold text-xs disabled:opacity-50"
                    />
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* SECTION 3: DOCTOR VISIT REMINDERS */}
        <div className="bg-[#E8D9CD] rounded-2xl p-5 border border-[#959D90]/50 space-y-3.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-[#223030] text-[#EFEFE9] flex items-center justify-center font-bold">
                <Calendar className="w-4 h-4 text-[#BBA58F]" />
              </div>
              <div>
                <h3 className="text-sm font-black text-[#223030]">📅 Doctor Visit Reminders</h3>
                <p className="text-[11px] text-[#523D35]">Advance notification before your scheduled antenatal appointment.</p>
              </div>
            </div>

            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={doctorSettings.enabled}
                onChange={(e) =>
                  setDoctorSettings((prev) => ({ ...prev, enabled: e.target.checked }))
                }
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-[#959D90] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#223030]"></div>
            </label>
          </div>

          {doctorSettings.enabled && (
            <div className="space-y-3 pt-2 border-t border-[#959D90]/30 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-[#223030] block mb-1">Appointment Date</label>
                  <input
                    type="date"
                    value={doctorVisitDate}
                    onChange={(e) => setDoctorVisitDate(e.target.value)}
                    className="w-full px-3 py-1.5 rounded-xl border border-[#959D90] bg-[#EFEFE9] text-[#223030] font-bold text-xs"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-[#223030] block mb-1">Appointment Time</label>
                  <input
                    type="time"
                    value={doctorVisitTime}
                    onChange={(e) => setDoctorVisitTime(e.target.value)}
                    className="w-full px-3 py-1.5 rounded-xl border border-[#959D90] bg-[#EFEFE9] text-[#223030] font-bold text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-[#223030] block mb-1">Doctor Name</label>
                  <input
                    type="text"
                    placeholder="Enter doctor or clinic name"
                    value={doctorName}
                    onChange={(e) => setDoctorName(e.target.value)}
                    className="w-full px-3 py-1.5 rounded-xl border border-[#959D90] bg-[#EFEFE9] text-[#223030] font-bold text-xs"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-[#223030] block mb-1">Hospital / Clinic Name</label>
                  <input
                    type="text"
                    placeholder="e.g. District Maternity Hospital"
                    value={hospitalName}
                    onChange={(e) => setHospitalName(e.target.value)}
                    className="w-full px-3 py-1.5 rounded-xl border border-[#959D90] bg-[#EFEFE9] text-[#223030] font-bold text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold text-[#223030] block mb-1">Appointment Notes / Reminders</label>
                <input
                  type="text"
                  placeholder="e.g. Bring anomaly scan report & fasting blood sugar test"
                  value={doctorNotes}
                  onChange={(e) => setDoctorNotes(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-xl border border-[#959D90] bg-[#EFEFE9] text-[#223030] font-medium text-xs"
                />
              </div>

              <div className="pt-1">
                <span className="text-[11px] font-bold text-[#223030] block mb-1">Alert Notice Before Visit:</span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    { id: '2hours', label: '2 Hours Before' },
                    { id: '24hours', label: '1 Day (24h) Before' },
                    { id: '48hours', label: '2 Days (48h) Before' },
                    { id: '1week', label: '1 Week Before' }
                  ].map((opt) => (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() =>
                        setDoctorSettings((prev) => ({
                          ...prev,
                          advanceNotice: opt.id as any
                        }))
                      }
                      className={`py-2 px-2 rounded-xl text-center font-bold transition cursor-pointer text-[11px] ${
                        doctorSettings.advanceNotice === opt.id
                          ? 'bg-[#223030] text-[#EFEFE9] shadow-xs'
                          : 'bg-[#EFEFE9] text-[#523D35] hover:bg-[#BBA58F]/30'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-[#959D90]/30">
          <span className="text-xs text-[#523D35]">
            {isSavedNotice && <span className="font-bold text-[#223030]">✓ Preferences saved!</span>}
          </span>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-bold text-[#523D35] hover:bg-[#E8D9CD] transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="px-5 py-2.5 rounded-xl text-xs font-black bg-[#223030] hover:bg-[#523D35] text-[#EFEFE9] shadow-md flex items-center gap-1.5 transition cursor-pointer"
            >
              <Check className="w-4 h-4 text-[#BBA58F]" />
              <span>Save Reminder Preferences</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
