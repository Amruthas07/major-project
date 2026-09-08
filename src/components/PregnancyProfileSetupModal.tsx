import React, { useState, useEffect } from 'react';
import {
  Baby,
  Heart,
  Calendar,
  Scale,
  Ruler,
  MapPin,
  Compass,
  AlertTriangle,
  Plus,
  X,
  Check,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Building,
  Home
} from 'lucide-react';
import { UserProfile, GlobalLocationState, PregnancyTrimester, IndianRegion } from '../types';
import { GlobalLocationService } from '../services/global_location_service';
import { StateData, DistrictData, TalukData, VillageTownData } from '../data/india_geographic_hierarchy';

interface PregnancyProfileSetupModalProps {
  isOpen: boolean;
  initialName?: string;
  initialEmailOrPhone?: string;
  initialProfile?: UserProfile;
  onSaveProfile: (profile: UserProfile, location: GlobalLocationState) => void;
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

export const PregnancyProfileSetupModal: React.FC<PregnancyProfileSetupModalProps> = ({
  isOpen,
  initialName = '',
  initialEmailOrPhone = '',
  initialProfile,
  onSaveProfile
}) => {
  // Step indicator: 1 = Personal & Pregnancy, 2 = Location & Health
  const [currentStep, setCurrentStep] = useState<1 | 2>(1);

  // 1. Personal Details
  const [fullName, setFullName] = useState(initialName || 'Amrutha');
  const [age, setAge] = useState<number>(27);
  const [mobileOrEmail, setMobileOrEmail] = useState(initialEmailOrPhone || '');

  // 2. Pregnancy Details
  const [pregnancyMonth, setPregnancyMonth] = useState<number>(6);
  const [heightCm, setHeightCm] = useState<number>(162);
  const [currentWeightKg, setCurrentWeightKg] = useState<number>(60.0);
  const [prePregnancyWeightKg, setPrePregnancyWeightKg] = useState<number>(54.0);
  const [dueDate, setDueDate] = useState<string>(() => {
    // Default calculated due date (~(9 - month) * 30 days from now)
    const d = new Date();
    d.setDate(d.getDate() + 90);
    return d.toISOString().split('T')[0];
  });

  // Calculate Trimester from Month
  const currentTrimester: PregnancyTrimester =
    pregnancyMonth <= 3
      ? '1st Trimester'
      : pregnancyMonth <= 6
      ? '2nd Trimester'
      : '3rd Trimester';

  const weeksPregnant = Math.min(40, Math.max(2, (pregnancyMonth - 1) * 4 + 2));

  // Update Due Date dynamically when Month changes
  const handleMonthChange = (month: number) => {
    setPregnancyMonth(month);
    const remainingMonths = 9 - month;
    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + Math.max(14, remainingMonths * 30));
    setDueDate(targetDate.toISOString().split('T')[0]);
  };

  // 3. Location Details (GPS or Manual Cascading with Village / Custom support)
  const allStates: StateData[] = GlobalLocationService.getInstance().getAllStates();
  const [selectedState, setSelectedState] = useState<string>('Karnataka');
  const [districtsList, setDistrictsList] = useState<DistrictData[]>([]);
  const [selectedDistrict, setSelectedDistrict] = useState<string>('Mysuru');
  const [taluksList, setTaluksList] = useState<TalukData[]>([]);
  const [selectedTaluk, setSelectedTaluk] = useState<string>('Nanjangud');
  const [villagesList, setVillagesList] = useState<VillageTownData[]>([]);
  const [selectedVillageOrTown, setSelectedVillageOrTown] = useState<string>('Hullahalli');
  const [customVillageInput, setCustomVillageInput] = useState<string>('');
  const [isUsingCustomVillage, setIsUsingCustomVillage] = useState<boolean>(false);
  const [pincode, setPincode] = useState<string>('571301');

  // GPS Detection State
  const [isDetectingGps, setIsDetectingGps] = useState(false);
  const [gpsSuccessNotice, setGpsSuccessNotice] = useState<string | null>(null);

  // Update districts when state changes
  useEffect(() => {
    const dists = GlobalLocationService.getInstance().getDistrictsForState(selectedState);
    setDistrictsList(dists);
    if (dists.length > 0) {
      const match = dists.find((d) => d.name.toLowerCase() === selectedDistrict.toLowerCase());
      setSelectedDistrict(match ? match.name : dists[0].name);
    }
  }, [selectedState]);

  // Update taluks when district changes
  useEffect(() => {
    if (selectedState && selectedDistrict) {
      const taluks = GlobalLocationService.getInstance().getTaluksForDistrict(
        selectedState,
        selectedDistrict
      );
      setTaluksList(taluks);
      if (taluks.length > 0) {
        setSelectedTaluk(taluks[0].name);
      } else {
        setSelectedTaluk('');
      }
    }
  }, [selectedState, selectedDistrict]);

  // Update villages when taluk changes
  useEffect(() => {
    if (selectedState && selectedDistrict && selectedTaluk) {
      const vills = GlobalLocationService.getInstance().getVillagesForTaluk(
        selectedState,
        selectedDistrict,
        selectedTaluk
      );
      setVillagesList(vills);
      if (vills.length > 0) {
        setSelectedVillageOrTown(vills[0].name);
        if (vills[0].pincode) setPincode(vills[0].pincode);
      }
    }
  }, [selectedState, selectedDistrict, selectedTaluk]);

  // Handle GPS detection
  const handleDetectGps = async () => {
    setIsDetectingGps(true);
    setGpsSuccessNotice(null);
    try {
      if ('geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition(
          async (pos) => {
            try {
              const detected = await GlobalLocationService.getInstance().resolveGpsCoordinates(
                pos.coords.latitude,
                pos.coords.longitude
              );
              if (detected) {
                setSelectedState(detected.state || 'Karnataka');
                setSelectedDistrict(detected.district || 'Mysuru');
                if (detected.taluk) setSelectedTaluk(detected.taluk);
                if (detected.village) {
                  setSelectedVillageOrTown(detected.village);
                  setIsUsingCustomVillage(false);
                }
                if (detected.pincode) setPincode(detected.pincode);
                setGpsSuccessNotice(
                  `Detected: ${detected.village || detected.city}, ${detected.district}, ${detected.state}`
                );
              }
            } catch (e) {
              console.warn('Error resolving coordinates', e);
            } finally {
              setIsDetectingGps(false);
            }
          },
          (err) => {
            console.warn('Geolocation permission denied or error', err);
            setIsDetectingGps(false);
          },
          { timeout: 8000, maximumAge: 60000 }
        );
      } else {
        setIsDetectingGps(false);
      }
    } catch (e) {
      console.warn('GPS detection fallback', e);
      setIsDetectingGps(false);
    }
  };

  // 4. Health Details: Allergies
  const [selectedAllergies, setSelectedAllergies] = useState<string[]>([]);
  const [customAllergyInput, setCustomAllergyInput] = useState<string>('');

  const toggleAllergy = (allergy: string) => {
    if (selectedAllergies.includes(allergy)) {
      setSelectedAllergies(selectedAllergies.filter((a) => a !== allergy));
    } else {
      setSelectedAllergies([...selectedAllergies, allergy]);
    }
  };

  const addCustomAllergy = () => {
    const trimmed = customAllergyInput.trim();
    if (trimmed && !selectedAllergies.includes(trimmed)) {
      setSelectedAllergies([...selectedAllergies, trimmed]);
      setCustomAllergyInput('');
    }
  };

  const removeAllergy = (allergy: string) => {
    setSelectedAllergies(selectedAllergies.filter((a) => a !== allergy));
  };

  // Submission handler
  const handleSaveComplete = (e: React.FormEvent) => {
    e.preventDefault();

    const activeVillage = isUsingCustomVillage
      ? customVillageInput.trim() || selectedVillageOrTown
      : selectedVillageOrTown;

    // Build Global Location
    const locationState: GlobalLocationState = {
      country: 'India',
      state: selectedState,
      district: selectedDistrict,
      taluk: selectedTaluk,
      village: activeVillage,
      city: selectedDistrict || activeVillage,
      pincode: pincode,
      latitude: 12.0167,
      longitude: 76.6833,
      region: (selectedState === 'Karnataka' || selectedState === 'Tamil Nadu' || selectedState === 'Kerala' || selectedState === 'Andhra Pradesh' || selectedState === 'Telangana')
        ? 'South India'
        : 'National',
      cuisineRegion: selectedState,
      locationType: 'village',
      formattedAddress: `${activeVillage}, ${selectedTaluk ? `${selectedTaluk} Taluk, ` : ''}${selectedDistrict}, ${selectedState} - ${pincode}`
    };

    // Build central User Profile
    const finalProfile: UserProfile = {
      name: fullName.trim() || 'Expectant Mother',
      age: Number(age) || 27,
      weeksPregnant,
      pregnancyMonth,
      dueDate,
      prePregnancyWeightKg: Number(prePregnancyWeightKg) || 54.0,
      currentWeightKg: Number(currentWeightKg) || 60.0,
      heightCm: Number(heightCm) || 162,
      bloodGroup: 'B Positive (B+)',
      dietPreference: 'Vegetarian',
      state: selectedState,
      city: selectedDistrict || activeVillage,
      district: selectedDistrict,
      taluk: selectedTaluk,
      village: activeVillage,
      email: mobileOrEmail.includes('@') ? mobileOrEmail : undefined,
      mobileNumber: !mobileOrEmail.includes('@') ? mobileOrEmail : undefined,
      allergies: selectedAllergies.length > 0 ? selectedAllergies : [],
      medicalConditions: initialProfile?.medicalConditions || [],
      emergencyContact: initialProfile?.emergencyContact || '',
      emergencyContactName: initialProfile?.emergencyContactName || '',
      emergencyContactPhone: initialProfile?.emergencyContactPhone || '',
      doctorDetails: initialProfile?.doctorDetails || {
        name: '',
        hospital: '',
        phone: '',
        nextAppointmentDate: '',
        nextAppointmentTime: ''
      },
      nextDoctorVisit: initialProfile?.nextDoctorVisit,
      savedHealthcareFacility: initialProfile?.savedHealthcareFacility,
      waterIntakeGoalMl: 2500,
      waterReminderSettings: {
        enabled: true,
        intervalMinutes: 60
      },
      healthChecklist: [
        { id: 'chk-1', text: 'Daily Prenatal Folic Acid & Iron supplement', completed: true },
        { id: 'chk-2', text: 'Drink 2.5 Liters of pure water', completed: false },
        { id: 'chk-3', text: '30-minute gentle maternal walk', completed: false },
        { id: 'chk-4', text: 'Calcium rich snack (Curd / Ragi / Paneer)', completed: false }
      ]
    };

    onSaveProfile(finalProfile, locationState);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-[#223030]/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-[#EFEFE9] rounded-3xl max-w-2xl w-full shadow-2xl border border-[#523D35]/40 overflow-hidden text-[#223030] my-6 animate-in fade-in zoom-in-95">
        {/* Modal Header */}
        <div className="bg-[#223030] text-[#EFEFE9] p-6 sm:p-7 relative border-b border-[#523D35]">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-11 h-11 rounded-2xl bg-[#523D35] border border-[#BBA58F]/40 flex items-center justify-center font-bold text-xl text-[#BBA58F]">
                <Baby className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl font-black tracking-tight text-[#EFEFE9]">
                  Pregnancy Profile Setup
                </h2>
                <p className="text-xs text-[#E8D9CD]">
                  Step {currentStep} of 2 • Customized ICMR Maternal Nutrition &amp; Local Heritage Recommendations
                </p>
              </div>
            </div>

            {/* Step Pills */}
            <div className="flex items-center gap-1.5 bg-[#523D35] px-3 py-1.5 rounded-xl border border-[#BBA58F]/30 text-xs font-bold text-[#E8D9CD]">
              <span className={currentStep === 1 ? 'text-[#BBA58F]' : 'opacity-60'}>Step 1</span>
              <span>•</span>
              <span className={currentStep === 2 ? 'text-[#BBA58F]' : 'opacity-60'}>Step 2</span>
            </div>
          </div>
        </div>

        <form onSubmit={handleSaveComplete} className="p-6 sm:p-7 space-y-6">
          {/* STEP 1: PERSONAL & PREGNANCY DETAILS */}
          {currentStep === 1 && (
            <div className="space-y-5 animate-in fade-in">
              <div className="border-b border-[#959D90]/30 pb-3">
                <h3 className="text-sm font-extrabold text-[#223030] flex items-center gap-2">
                  <Heart className="w-4 h-4 text-[#523D35]" />
                  <span>Personal &amp; Maternal Vitals</span>
                </h3>
                <p className="text-xs text-[#523D35]">
                  Basic details used for clinical nutrition targets and due date tracking.
                </p>
              </div>

              {/* Personal Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-bold text-[#223030] mb-1">
                    Full Name <span className="text-rose-600">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Amrutha Sharma"
                    className="w-full px-3.5 py-2.5 bg-white rounded-xl border border-[#959D90]/50 text-xs text-[#223030] font-semibold focus:border-[#523D35] focus:outline-none shadow-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#223030] mb-1">
                    Age (Years) <span className="text-rose-600">*</span>
                  </label>
                  <input
                    type="number"
                    min="16"
                    max="55"
                    required
                    value={age}
                    onChange={(e) => setAge(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 bg-white rounded-xl border border-[#959D90]/50 text-xs text-[#223030] font-semibold focus:border-[#523D35] focus:outline-none shadow-xs"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-[#223030] mb-1">
                    Mobile Number or Email
                  </label>
                  <input
                    type="text"
                    value={mobileOrEmail}
                    onChange={(e) => setMobileOrEmail(e.target.value)}
                    placeholder="e.g. 9876543210 or yourname@gmail.com"
                    className="w-full px-3.5 py-2.5 bg-white rounded-xl border border-[#959D90]/50 text-xs text-[#223030] font-semibold focus:border-[#523D35] focus:outline-none shadow-xs"
                  />
                </div>
              </div>

              {/* Pregnancy Month & Trimester Selector */}
              <div className="space-y-2.5 pt-2">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold text-[#223030]">
                    Current Pregnancy Month <span className="text-rose-600">*</span>
                  </label>
                  <span className="px-2.5 py-0.5 rounded-full bg-[#223030] text-[#E8D9CD] text-xs font-bold">
                    Month {pregnancyMonth} • {currentTrimester} (Week {weeksPregnant})
                  </span>
                </div>

                <div className="grid grid-cols-3 sm:grid-cols-9 gap-1.5">
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((m) => {
                    const isSelected = pregnancyMonth === m;
                    const triLabel = m <= 3 ? 'T1' : m <= 6 ? 'T2' : 'T3';
                    return (
                      <button
                        key={m}
                        type="button"
                        onClick={() => handleMonthChange(m)}
                        className={`p-2 rounded-xl text-center border transition flex flex-col items-center justify-center gap-0.5 cursor-pointer ${
                          isSelected
                            ? 'bg-[#223030] border-[#523D35] text-[#EFEFE9] font-black shadow-md'
                            : 'bg-[#E8D9CD] border-[#959D90]/40 text-[#223030] hover:bg-[#BBA58F]/40'
                        }`}
                      >
                        <span className="text-xs font-extrabold">Mo {m}</span>
                        <span className={`text-[9px] px-1 rounded-sm ${isSelected ? 'bg-[#523D35] text-[#E8D9CD]' : 'text-[#523D35]'}`}>
                          {triLabel}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Vitals: Weight, Height, Due Date */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 pt-2">
                <div>
                  <label className="block text-xs font-bold text-[#223030] mb-1">
                    Current Weight (kg) <span className="text-rose-600">*</span>
                  </label>
                  <div className="relative">
                    <Scale className="w-4 h-4 text-[#523D35] absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="number"
                      step="0.1"
                      min="35"
                      max="150"
                      required
                      value={currentWeightKg}
                      onChange={(e) => setCurrentWeightKg(Number(e.target.value))}
                      className="w-full pl-9 pr-3 py-2 bg-white rounded-xl border border-[#959D90]/50 text-xs font-bold text-[#223030] shadow-xs"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#223030] mb-1">
                    Height (cm) <span className="text-rose-600">*</span>
                  </label>
                  <div className="relative">
                    <Ruler className="w-4 h-4 text-[#523D35] absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="number"
                      min="120"
                      max="210"
                      required
                      value={heightCm}
                      onChange={(e) => setHeightCm(Number(e.target.value))}
                      className="w-full pl-9 pr-3 py-2 bg-white rounded-xl border border-[#959D90]/50 text-xs font-bold text-[#223030] shadow-xs"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#223030] mb-1">
                    Expected Delivery Date <span className="text-rose-600">*</span>
                  </label>
                  <div className="relative">
                    <Calendar className="w-4 h-4 text-[#523D35] absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="date"
                      required
                      value={dueDate}
                      onChange={(e) => setDueDate(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 bg-white rounded-xl border border-[#959D90]/50 text-xs font-bold text-[#223030] shadow-xs"
                    />
                  </div>
                </div>
              </div>

              {/* Proceed to Step 2 */}
              <div className="pt-4 flex justify-end">
                <button
                  type="button"
                  onClick={() => setCurrentStep(2)}
                  className="px-6 py-2.5 bg-[#223030] hover:bg-[#523D35] text-[#EFEFE9] font-bold text-xs rounded-xl shadow-md transition flex items-center gap-2 cursor-pointer"
                >
                  <span>Next: Location &amp; Allergies</span>
                  <ArrowRight className="w-3.5 h-3.5 text-[#BBA58F]" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: LOCATION & HEALTH ALLERGIES */}
          {currentStep === 2 && (
            <div className="space-y-5 animate-in fade-in">
              <div className="border-b border-[#959D90]/30 pb-3 flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-extrabold text-[#223030] flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-[#523D35]" />
                    <span>Location &amp; Allergies</span>
                  </h3>
                  <p className="text-xs text-[#523D35]">
                    Enables authentic regional recipes, food safety checks, and local healthcare facilities.
                  </p>
                </div>

                {/* GPS Auto-Detect Button */}
                <button
                  type="button"
                  onClick={handleDetectGps}
                  disabled={isDetectingGps}
                  className="px-3 py-1.5 bg-[#523D35] hover:bg-[#523D35]/80 text-[#E8D9CD] font-bold text-xs rounded-xl border border-[#BBA58F]/40 shadow-xs flex items-center gap-1.5 transition cursor-pointer"
                >
                  <Compass className={`w-3.5 h-3.5 text-[#BBA58F] ${isDetectingGps ? 'animate-spin' : ''}`} />
                  <span>{isDetectingGps ? 'Detecting...' : 'Detect Current Location'}</span>
                </button>
              </div>

              {gpsSuccessNotice && (
                <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{gpsSuccessNotice}</span>
                </div>
              )}

              {/* Comprehensive Geographic Selection */}
              <div className="p-4 bg-[#E8D9CD]/70 rounded-2xl border border-[#959D90]/40 space-y-3">
                <div className="text-xs font-bold text-[#223030] flex items-center justify-between">
                  <span>Geographic Location (Villages, Towns, Taluks, Districts, States)</span>
                  <span className="text-[10px] text-[#523D35]">Fully customizable</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  {/* State */}
                  <div>
                    <label className="block text-[11px] font-bold text-[#523D35] mb-1">State</label>
                    <select
                      value={selectedState}
                      onChange={(e) => setSelectedState(e.target.value)}
                      className="w-full px-3 py-2 bg-white rounded-xl border border-[#959D90]/50 text-xs text-[#223030] font-semibold"
                    >
                      {allStates.map((s) => (
                        <option key={s.state} value={s.state}>
                          {s.state} ({s.region})
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* District */}
                  <div>
                    <label className="block text-[11px] font-bold text-[#523D35] mb-1">District</label>
                    <select
                      value={selectedDistrict}
                      onChange={(e) => setSelectedDistrict(e.target.value)}
                      className="w-full px-3 py-2 bg-white rounded-xl border border-[#959D90]/50 text-xs text-[#223030] font-semibold"
                    >
                      {districtsList.map((d) => (
                        <option key={d.name} value={d.name}>
                          {d.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Taluk / Tehsil */}
                  <div>
                    <label className="block text-[11px] font-bold text-[#523D35] mb-1">Taluk / Tehsil / Sub-district</label>
                    <select
                      value={selectedTaluk}
                      onChange={(e) => setSelectedTaluk(e.target.value)}
                      className="w-full px-3 py-2 bg-white rounded-xl border border-[#959D90]/50 text-xs text-[#223030] font-semibold"
                    >
                      {taluksList.map((t) => (
                        <option key={t.id} value={t.name}>
                          {t.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Village / Town / Gram Panchayat */}
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="block text-[11px] font-bold text-[#523D35]">
                        Village / Town / City
                      </label>
                      <button
                        type="button"
                        onClick={() => setIsUsingCustomVillage(!isUsingCustomVillage)}
                        className="text-[10px] text-[#523D35] underline font-bold"
                      >
                        {isUsingCustomVillage ? 'Choose from list' : 'Type custom village'}
                      </button>
                    </div>

                    {isUsingCustomVillage ? (
                      <input
                        type="text"
                        placeholder="Enter your village or town name"
                        value={customVillageInput}
                        onChange={(e) => setCustomVillageInput(e.target.value)}
                        className="w-full px-3 py-2 bg-white rounded-xl border border-[#959D90]/50 text-xs text-[#223030] font-semibold"
                      />
                    ) : (
                      <select
                        value={selectedVillageOrTown}
                        onChange={(e) => setSelectedVillageOrTown(e.target.value)}
                        className="w-full px-3 py-2 bg-white rounded-xl border border-[#959D90]/50 text-xs text-[#223030] font-semibold"
                      >
                        {villagesList.map((v) => (
                          <option key={v.id} value={v.name}>
                            {v.name} {v.type ? `(${v.type})` : ''}
                          </option>
                        ))}
                      </select>
                    )}
                  </div>
                </div>
              </div>

              {/* Health Allergies Section */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-bold text-[#223030] flex items-center gap-1.5">
                      <AlertTriangle className="w-3.5 h-3.5 text-[#523D35]" />
                      <span>Food Allergies &amp; Intolerances</span>
                    </h4>
                    <p className="text-[11px] text-[#523D35]">
                      Select common allergens or add custom food items to safely filter meal plans.
                    </p>
                  </div>
                  <span className="text-xs font-bold text-[#523D35]">
                    {selectedAllergies.length} Selected
                  </span>
                </div>

                {/* Common Allergies Chips */}
                <div className="flex flex-wrap gap-1.5">
                  {COMMON_ALLERGIES.map((allergy) => {
                    const isSelected = selectedAllergies.includes(allergy);
                    return (
                      <button
                        key={allergy}
                        type="button"
                        onClick={() => toggleAllergy(allergy)}
                        className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition cursor-pointer flex items-center gap-1.5 ${
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

                {/* Custom Allergy Input */}
                <div className="flex items-center gap-2 pt-1">
                  <input
                    type="text"
                    placeholder="Add custom allergy (e.g. Brinjal, Mushrooms, Crab)"
                    value={customAllergyInput}
                    onChange={(e) => setCustomAllergyInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        addCustomAllergy();
                      }
                    }}
                    className="flex-1 px-3.5 py-2 bg-white rounded-xl border border-[#959D90]/50 text-xs text-[#223030] placeholder-[#959D90] focus:border-[#523D35] focus:outline-none shadow-xs"
                  />
                  <button
                    type="button"
                    onClick={addCustomAllergy}
                    className="px-4 py-2 bg-[#523D35] hover:bg-[#523D35]/80 text-[#EFEFE9] font-bold text-xs rounded-xl shadow-xs transition flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add</span>
                  </button>
                </div>

                {/* Active Selected Allergies Badges */}
                {selectedAllergies.length > 0 && (
                  <div className="p-3 bg-[#E8D9CD] rounded-2xl border border-[#959D90]/30 space-y-1.5">
                    <span className="text-[11px] font-bold text-[#523D35] block">
                      Active Allergy Safety Filter:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {selectedAllergies.map((a) => (
                        <span
                          key={a}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#223030] text-[#EFEFE9] text-[11px] font-semibold"
                        >
                          <span>{a}</span>
                          <button
                            type="button"
                            onClick={() => removeAllergy(a)}
                            className="hover:text-rose-400"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Back / Save Profile Buttons */}
              <div className="pt-4 border-t border-[#959D90]/30 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setCurrentStep(1)}
                  className="px-4 py-2.5 rounded-xl text-xs font-bold text-[#523D35] hover:bg-[#E8D9CD] transition cursor-pointer"
                >
                  ← Back to Step 1
                </button>

                <button
                  type="submit"
                  className="px-6 py-2.5 bg-[#223030] hover:bg-[#523D35] text-[#EFEFE9] font-bold text-xs rounded-xl shadow-md transition flex items-center gap-2 cursor-pointer"
                >
                  <CheckCircle2 className="w-4 h-4 text-[#BBA58F]" />
                  <span>Save Profile &amp; Go to Dashboard</span>
                </button>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};
