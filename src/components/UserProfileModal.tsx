import React, { useState } from 'react';
import { UserProfile } from '../types';
import { User, Heart, X, Check, Save, Shield, MapPin, AlertTriangle, Plus, Calendar, Scale, Ruler } from 'lucide-react';

interface UserProfileModalProps {
  profile: UserProfile;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updated: UserProfile) => void;
}

const COMMON_ALLERGIES = [
  'Nuts (Peanuts / Tree Nuts)',
  'Milk & Dairy (Lactose)',
  'Eggs',
  'Seafood & Shellfish',
  'Gluten & Wheat',
  'Soy & Soybeans',
  'Mustard Seeds',
  'Sesame (Til)'
];

export const UserProfileModal: React.FC<UserProfileModalProps> = ({
  profile,
  isOpen,
  onClose,
  onSave
}) => {
  const [formData, setFormData] = useState<UserProfile>({
    ...profile,
    pregnancyMonth: profile.pregnancyMonth || Math.min(9, Math.max(1, Math.floor((profile.weeksPregnant - 1) / 4) + 1)),
    allergies: profile.allergies || []
  });

  const [customAllergy, setCustomAllergy] = useState('');

  if (!isOpen) return null;

  const handleMonthChange = (month: number) => {
    const weeks = Math.min(40, Math.max(2, (month - 1) * 4 + 2));
    setFormData((prev) => ({
      ...prev,
      pregnancyMonth: month,
      weeksPregnant: weeks
    }));
  };

  const toggleAllergy = (allergy: string) => {
    const current = formData.allergies || [];
    if (current.includes(allergy)) {
      setFormData({
        ...formData,
        allergies: current.filter((a) => a !== allergy)
      });
    } else {
      setFormData({
        ...formData,
        allergies: [...current, allergy]
      });
    }
  };

  const addCustomAllergy = () => {
    const trimmed = customAllergy.trim();
    if (trimmed && !(formData.allergies || []).includes(trimmed)) {
      setFormData({
        ...formData,
        allergies: [...(formData.allergies || []), trimmed]
      });
      setCustomAllergy('');
    }
  };

  const removeAllergy = (allergy: string) => {
    setFormData({
      ...formData,
      allergies: (formData.allergies || []).filter((a) => a !== allergy)
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#223030]/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-[#EFEFE9] rounded-3xl max-w-xl w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-[#523D35]/40 animate-in fade-in zoom-in-95 text-[#223030]">
        {/* Header */}
        <div className="p-6 bg-[#223030] text-[#EFEFE9] border-b border-[#523D35] flex items-center justify-between sticky top-0 z-10">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-[#523D35] border border-[#BBA58F]/40 text-[#BBA58F] flex items-center justify-center font-bold">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-[#EFEFE9]">Pregnancy &amp; Clinical Profile</h3>
              <p className="text-xs text-[#E8D9CD]">Update pregnancy month, weight, location, allergies, and doctor visit</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl bg-[#523D35]/50 hover:bg-[#523D35] text-[#E8D9CD] hover:text-[#EFEFE9] cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5 text-xs">
          {/* Section 1: Basic Personal Info */}
          <div>
            <h4 className="font-extrabold text-[#223030] text-xs uppercase tracking-wider mb-2.5 pb-1 border-b border-[#959D90]/30 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-[#523D35]" />
              <span>Personal Information</span>
            </h4>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-bold text-[#523D35] block mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-white border border-[#959D90]/50 text-[#223030] font-semibold outline-none focus:border-[#523D35]"
                />
              </div>
              <div>
                <label className="font-bold text-[#523D35] block mb-1">Age (Years)</label>
                <input
                  type="number"
                  required
                  min="16"
                  max="55"
                  value={formData.age}
                  onChange={(e) => setFormData({ ...formData, age: Number(e.target.value) })}
                  className="w-full px-3 py-2 rounded-xl bg-white border border-[#959D90]/50 text-[#223030] font-semibold outline-none focus:border-[#523D35]"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Pregnancy Month & Trimester */}
          <div>
            <div className="flex items-center justify-between mb-2.5 pb-1 border-b border-[#959D90]/30">
              <h4 className="font-extrabold text-[#223030] text-xs uppercase tracking-wider flex items-center gap-1.5">
                <Heart className="w-3.5 h-3.5 text-[#523D35]" />
                <span>Pregnancy Month &amp; Gestation</span>
              </h4>
              <span className="font-bold text-[#223030] bg-[#E8D9CD] px-2.5 py-0.5 rounded-full text-[11px]">
                Month {formData.pregnancyMonth || 6} • Week {formData.weeksPregnant}
              </span>
            </div>

            <div className="grid grid-cols-3 sm:grid-cols-9 gap-1.5 mb-3">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((m) => {
                const isSelected = (formData.pregnancyMonth || 6) === m;
                const tri = m <= 3 ? '1st Tri' : m <= 6 ? '2nd Tri' : '3rd Tri';
                return (
                  <button
                    key={m}
                    type="button"
                    onClick={() => handleMonthChange(m)}
                    className={`py-2 px-1 rounded-xl text-center border transition flex flex-col items-center justify-center cursor-pointer ${
                      isSelected
                        ? 'bg-[#223030] border-[#523D35] text-[#EFEFE9] font-black shadow-xs'
                        : 'bg-[#E8D9CD] border-[#959D90]/40 text-[#223030] hover:bg-[#BBA58F]/40'
                    }`}
                  >
                    <span className="text-xs font-black">Mo {m}</span>
                    <span className={`text-[8px] ${isSelected ? 'text-[#BBA58F]' : 'text-[#523D35]'}`}>
                      {tri}
                    </span>
                  </button>
                );
              })}
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="font-bold text-[#523D35] block mb-1">Weeks Pregnant</label>
                <input
                  type="number"
                  min="1"
                  max="40"
                  required
                  value={formData.weeksPregnant}
                  onChange={(e) => {
                    const w = Number(e.target.value);
                    const m = Math.min(9, Math.max(1, Math.floor((w - 1) / 4) + 1));
                    setFormData({ ...formData, weeksPregnant: w, pregnancyMonth: m });
                  }}
                  className="w-full px-3 py-2 rounded-xl bg-white border border-[#959D90]/50 text-[#223030] font-bold outline-none"
                />
              </div>

              <div>
                <label className="font-bold text-[#523D35] block mb-1">Blood Group</label>
                <input
                  type="text"
                  value={formData.bloodGroup}
                  onChange={(e) => setFormData({ ...formData, bloodGroup: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-white border border-[#959D90]/50 text-[#223030] font-semibold outline-none"
                />
              </div>

              <div>
                <label className="font-bold text-[#523D35] block mb-1">Estimated Due Date</label>
                <input
                  type="date"
                  value={formData.dueDate}
                  onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-white border border-[#959D90]/50 text-[#223030] font-semibold outline-none"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Vitals (Height & Weight) */}
          <div>
            <h4 className="font-extrabold text-[#223030] text-xs uppercase tracking-wider mb-2.5 pb-1 border-b border-[#959D90]/30 flex items-center gap-1.5">
              <Scale className="w-3.5 h-3.5 text-[#523D35]" />
              <span>Weight &amp; Physical Vitals</span>
            </h4>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="font-bold text-[#523D35] block mb-1">Height (cm)</label>
                <input
                  type="number"
                  value={formData.heightCm}
                  onChange={(e) => setFormData({ ...formData, heightCm: Number(e.target.value) })}
                  className="w-full px-3 py-2 rounded-xl bg-white border border-[#959D90]/50 text-[#223030] font-bold outline-none"
                />
              </div>
              <div>
                <label className="font-bold text-[#523D35] block mb-1">Current Weight (kg)</label>
                <input
                  type="number"
                  step="0.1"
                  value={formData.currentWeightKg}
                  onChange={(e) => setFormData({ ...formData, currentWeightKg: Number(e.target.value) })}
                  className="w-full px-3 py-2 rounded-xl bg-white border border-[#959D90]/50 text-[#223030] font-bold outline-none"
                />
              </div>
              <div>
                <label className="font-bold text-[#523D35] block mb-1">Pre-Pregnancy Wt (kg)</label>
                <input
                  type="number"
                  step="0.1"
                  value={formData.prePregnancyWeightKg}
                  onChange={(e) => setFormData({ ...formData, prePregnancyWeightKg: Number(e.target.value) })}
                  className="w-full px-3 py-2 rounded-xl bg-white border border-[#959D90]/50 text-[#223030] font-bold outline-none"
                />
              </div>
            </div>
          </div>

          {/* Section 4: Location */}
          <div>
            <h4 className="font-extrabold text-[#223030] text-xs uppercase tracking-wider mb-2.5 pb-1 border-b border-[#959D90]/30 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-[#523D35]" />
              <span>Location (Village, Taluk, District, State)</span>
            </h4>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-bold text-[#523D35] block mb-1">State</label>
                <input
                  type="text"
                  value={formData.state}
                  onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-white border border-[#959D90]/50 text-[#223030] font-semibold outline-none"
                />
              </div>
              <div>
                <label className="font-bold text-[#523D35] block mb-1">District / City</label>
                <input
                  type="text"
                  value={formData.district || formData.city}
                  onChange={(e) => setFormData({ ...formData, district: e.target.value, city: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-white border border-[#959D90]/50 text-[#223030] font-semibold outline-none"
                />
              </div>
              <div>
                <label className="font-bold text-[#523D35] block mb-1">Taluk / Tehsil</label>
                <input
                  type="text"
                  value={formData.taluk || ''}
                  placeholder="e.g. Nanjangud"
                  onChange={(e) => setFormData({ ...formData, taluk: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-white border border-[#959D90]/50 text-[#223030] font-semibold outline-none"
                />
              </div>
              <div>
                <label className="font-bold text-[#523D35] block mb-1">Village / Town</label>
                <input
                  type="text"
                  value={formData.village || ''}
                  placeholder="e.g. Hullahalli"
                  onChange={(e) => setFormData({ ...formData, village: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-white border border-[#959D90]/50 text-[#223030] font-semibold outline-none"
                />
              </div>
            </div>
          </div>

          {/* Section 5: Allergies */}
          <div>
            <h4 className="font-extrabold text-[#223030] text-xs uppercase tracking-wider mb-2.5 pb-1 border-b border-[#959D90]/30 flex items-center gap-1.5">
              <AlertTriangle className="w-3.5 h-3.5 text-[#523D35]" />
              <span>Food Allergies &amp; Intolerances</span>
            </h4>

            <div className="flex flex-wrap gap-1.5 mb-2.5">
              {COMMON_ALLERGIES.map((allergy) => {
                const isSelected = (formData.allergies || []).includes(allergy);
                return (
                  <button
                    key={allergy}
                    type="button"
                    onClick={() => toggleAllergy(allergy)}
                    className={`px-2.5 py-1 rounded-full text-xs font-semibold border transition cursor-pointer flex items-center gap-1 ${
                      isSelected
                        ? 'bg-[#223030] text-[#EFEFE9] border-[#223030]'
                        : 'bg-white text-[#223030] border-[#959D90]/40 hover:bg-[#E8D9CD]'
                    }`}
                  >
                    <span>{allergy}</span>
                    {isSelected && <Check className="w-3 h-3 text-[#BBA58F]" />}
                  </button>
                );
              })}
            </div>

            <div className="flex items-center gap-2">
              <input
                type="text"
                placeholder="Add custom allergy..."
                value={customAllergy}
                onChange={(e) => setCustomAllergy(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addCustomAllergy();
                  }
                }}
                className="flex-1 px-3 py-1.5 rounded-xl bg-white border border-[#959D90]/50 text-xs text-[#223030] outline-none"
              />
              <button
                type="button"
                onClick={addCustomAllergy}
                className="px-3 py-1.5 bg-[#523D35] hover:bg-[#523D35]/80 text-[#EFEFE9] font-bold text-xs rounded-xl transition cursor-pointer"
              >
                Add
              </button>
            </div>

            {(formData.allergies || []).length > 0 && (
              <div className="flex flex-wrap gap-1.5 pt-2">
                {(formData.allergies || []).map((a) => (
                  <span
                    key={a}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#223030] text-[#EFEFE9] text-[11px] font-semibold"
                  >
                    <span>{a}</span>
                    <button
                      type="button"
                      onClick={() => removeAllergy(a)}
                      className="hover:text-rose-400 cursor-pointer"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Section 6: Next Doctor Visit & Emergency */}
          <div>
            <h4 className="font-extrabold text-[#223030] text-xs uppercase tracking-wider mb-2.5 pb-1 border-b border-[#959D90]/30 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-[#523D35]" />
              <span>Doctor Visit &amp; Emergency Contacts</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="font-bold text-[#523D35] block mb-1">Emergency Contact Name (Spouse / Family)</label>
                <input
                  type="text"
                  placeholder="e.g. Ramesh"
                  value={formData.emergencyContactName || ''}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      emergencyContactName: e.target.value
                    })
                  }
                  className="w-full px-3 py-2 rounded-xl bg-white border border-[#959D90]/50 text-[#223030] font-semibold outline-none"
                />
              </div>
              <div>
                <label className="font-bold text-[#523D35] block mb-1">Emergency Contact Phone</label>
                <input
                  type="text"
                  placeholder="e.g. 9876543210"
                  value={formData.emergencyContactPhone || formData.emergencyContact || ''}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      emergencyContact: e.target.value,
                      emergencyContactPhone: e.target.value
                    })
                  }
                  className="w-full px-3 py-2 rounded-xl bg-white border border-[#959D90]/50 text-[#223030] font-semibold outline-none"
                />
              </div>
              <div>
                <label className="font-bold text-[#523D35] block mb-1">Attending Doctor Name</label>
                <input
                  type="text"
                  placeholder="e.g. Dr. Kavitha"
                  value={formData.doctorDetails?.name || ''}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      doctorDetails: { ...formData.doctorDetails, name: e.target.value }
                    })
                  }
                  className="w-full px-3 py-2 rounded-xl bg-white border border-[#959D90]/50 text-[#223030] font-semibold outline-none"
                />
              </div>
              <div>
                <label className="font-bold text-[#523D35] block mb-1">Doctor Direct Phone Number</label>
                <input
                  type="text"
                  placeholder="e.g. 9880011223"
                  value={formData.doctorDetails?.phone || ''}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      doctorDetails: { ...formData.doctorDetails, phone: e.target.value }
                    })
                  }
                  className="w-full px-3 py-2 rounded-xl bg-white border border-[#959D90]/50 text-[#223030] font-semibold outline-none"
                />
              </div>
              <div>
                <label className="font-bold text-[#523D35] block mb-1">Hospital / Clinic</label>
                <input
                  type="text"
                  placeholder="e.g. Community Health Center"
                  value={formData.doctorDetails?.hospital || ''}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      doctorDetails: { ...formData.doctorDetails, hospital: e.target.value }
                    })
                  }
                  className="w-full px-3 py-2 rounded-xl bg-white border border-[#959D90]/50 text-[#223030] font-semibold outline-none"
                />
              </div>
              <div>
                <label className="font-bold text-[#523D35] block mb-1">Next Doctor Visit Date</label>
                <input
                  type="date"
                  value={formData.nextDoctorVisit?.date || formData.doctorDetails?.nextAppointmentDate || ''}
                  onChange={(e) => {
                    const d = e.target.value;
                    setFormData({
                      ...formData,
                      doctorDetails: { ...formData.doctorDetails, nextAppointmentDate: d },
                      nextDoctorVisit: {
                        date: d,
                        time: formData.nextDoctorVisit?.time || formData.doctorDetails?.nextAppointmentTime || '10:30 AM',
                        doctorName: formData.doctorDetails?.name || '',
                        hospitalName: formData.doctorDetails?.hospital || ''
                      }
                    });
                  }}
                  className="w-full px-3 py-2 rounded-xl bg-white border border-[#959D90]/50 text-[#223030] font-semibold outline-none"
                />
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-4 flex items-center justify-end space-x-2 border-t border-[#959D90]/30 sticky bottom-0 bg-[#EFEFE9] py-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-[#523D35] hover:bg-[#E8D9CD] font-bold cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-[#223030] hover:bg-[#523D35] text-[#EFEFE9] font-bold shadow-md transition flex items-center gap-1.5 cursor-pointer"
            >
              <Save className="w-4 h-4 text-[#BBA58F]" />
              <span>Save &amp; Update Central Profile</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
