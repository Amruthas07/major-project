import React, { useState, useEffect, useRef } from 'react';
import { GlobalLocationState, IndianRegion } from '../types';
import {
  GlobalLocationService,
  POPULAR_INDIAN_LOCATIONS,
  ALL_INDIAN_STATES_REGIONS
} from '../services/global_location_service';
import {
  StateData,
  DistrictData,
  TalukData,
  VillageTownData
} from '../data/india_geographic_hierarchy';
import {
  MapPin,
  Search,
  Navigation,
  Check,
  X,
  Sparkles,
  Compass,
  AlertCircle,
  Building,
  Home,
  ChevronRight,
  RefreshCw,
  Edit3,
  CheckCircle2,
  TreePine,
  Layers,
  ArrowRight,
  HelpCircle,
  CheckCheck
} from 'lucide-react';

interface LocationSwitcherModalProps {
  currentLocation: GlobalLocationState;
  onClose: () => void;
  onLocationSelected: (loc: GlobalLocationState) => void;
}

type TabMode = 'gps' | 'manual';

export const LocationSwitcherModal: React.FC<LocationSwitcherModalProps> = ({
  currentLocation,
  onClose,
  onLocationSelected
}) => {
  const [activeTab, setActiveTab] = useState<TabMode>('gps');

  // Option 1: GPS Detection State
  const [isDetectingGps, setIsDetectingGps] = useState(false);
  const [detectedGpsLocation, setDetectedGpsLocation] = useState<GlobalLocationState | null>(null);
  const [gpsError, setGpsError] = useState<string | null>(null);

  // Option 2: Search & PIN Code State
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<GlobalLocationState[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [pinLookupMessage, setPinLookupMessage] = useState<string | null>(null);

  // Option 2: Cascading Dropdowns State
  const allStates: StateData[] = GlobalLocationService.getInstance().getAllStates();
  const [selectedState, setSelectedState] = useState<string>(currentLocation.state || 'Karnataka');
  const [districtsList, setDistrictsList] = useState<DistrictData[]>([]);
  const [selectedDistrict, setSelectedDistrict] = useState<string>(currentLocation.district || 'Mysuru');
  const [taluksList, setTaluksList] = useState<TalukData[]>([]);
  const [selectedTaluk, setSelectedTaluk] = useState<string>(currentLocation.taluk || 'Nanjangud');
  const [villagesList, setVillagesList] = useState<VillageTownData[]>([]);
  const [selectedVillageOrTown, setSelectedVillageOrTown] = useState<string>(
    currentLocation.village || currentLocation.townOrVillage || 'Hullahalli'
  );
  const [customVillageInput, setCustomVillageInput] = useState<string>('');
  const [isUsingCustomVillage, setIsUsingCustomVillage] = useState(false);
  const [customPincode, setCustomPincode] = useState<string>(currentLocation.pincode || '');

  // Step 1: Update districts list when State changes
  useEffect(() => {
    const districts = GlobalLocationService.getInstance().getDistrictsForState(selectedState);
    setDistrictsList(districts);
    if (districts.length > 0) {
      const match = districts.find((d) => d.name.toLowerCase() === selectedDistrict.toLowerCase());
      if (match) {
        setSelectedDistrict(match.name);
      } else {
        setSelectedDistrict(districts[0].name);
      }
    } else {
      setSelectedDistrict('');
    }
  }, [selectedState]);

  // Step 2: Update taluks list when District changes
  useEffect(() => {
    if (selectedState && selectedDistrict) {
      const taluks = GlobalLocationService.getInstance().getTaluksForDistrict(
        selectedState,
        selectedDistrict
      );
      setTaluksList(taluks);
      if (taluks.length > 0) {
        const match = taluks.find((t) => t.name.toLowerCase() === selectedTaluk.toLowerCase());
        if (match) {
          setSelectedTaluk(match.name);
        } else {
          setSelectedTaluk(taluks[0].name);
        }
      } else {
        setSelectedTaluk('');
      }
    } else {
      setTaluksList([]);
      setSelectedTaluk('');
    }
  }, [selectedState, selectedDistrict]);

  // Step 3: Update villages list when Taluk changes
  useEffect(() => {
    if (selectedState && selectedDistrict && selectedTaluk) {
      const villages = GlobalLocationService.getInstance().getVillagesForTaluk(
        selectedState,
        selectedDistrict,
        selectedTaluk
      );
      setVillagesList(villages);
      if (villages.length > 0) {
        const match = villages.find(
          (v) => v.name.toLowerCase() === selectedVillageOrTown.toLowerCase()
        );
        if (match) {
          setSelectedVillageOrTown(match.name);
          if (match.pincode) setCustomPincode(match.pincode);
        } else {
          setSelectedVillageOrTown(villages[0].name);
          if (villages[0].pincode) setCustomPincode(villages[0].pincode);
        }
      } else {
        setSelectedVillageOrTown('');
      }
    } else {
      setVillagesList([]);
      setSelectedVillageOrTown('');
    }
  }, [selectedState, selectedDistrict, selectedTaluk]);

  // Handle Search Input with debounce
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  useEffect(() => {
    if (!searchQuery.trim() || searchQuery.trim().length < 2) {
      setSearchResults([]);
      setPinLookupMessage(null);
      return;
    }

    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    setIsSearching(true);
    searchTimeoutRef.current = setTimeout(async () => {
      const cleanQ = searchQuery.trim();
      const results = await GlobalLocationService.getInstance().searchUniversal(cleanQ);
      setSearchResults(results);
      setIsSearching(false);

      if (/^\d{6}$/.test(cleanQ)) {
        if (results.length > 0) {
          setPinLookupMessage(`✅ Found location for PIN Code ${cleanQ}`);
        } else {
          setPinLookupMessage(`⚠️ No specific postal office found for PIN ${cleanQ}`);
        }
      } else {
        setPinLookupMessage(null);
      }
    }, 350);

    return () => {
      if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
    };
  }, [searchQuery]);

  // OPTION 1: GPS Live Detection Handler
  const handleDetectGps = () => {
    setIsDetectingGps(true);
    setGpsError(null);
    setDetectedGpsLocation(null);

    if (!navigator.geolocation) {
      setGpsError('Geolocation is not supported by your browser.');
      setIsDetectingGps(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const lat = pos.coords.latitude;
          const lng = pos.coords.longitude;
          const detected = await GlobalLocationService.getInstance().resolveGpsCoordinates(lat, lng);
          setDetectedGpsLocation(detected);
          setIsDetectingGps(false);
        } catch (e) {
          setIsDetectingGps(false);
          setGpsError('Could not resolve rural location details. Please choose manually below.');
        }
      },
      (err) => {
        setIsDetectingGps(false);
        if (err.code === 1) {
          setGpsError('Location permission was denied. Please allow location access or select manually.');
        } else {
          setGpsError('GPS signal timed out. Please select your State & Taluk manually below.');
        }
      },
      { enableHighAccuracy: true, timeout: 12000, maximumAge: 30000 }
    );
  };

  // Confirm GPS Location
  const handleApplyGpsLocation = () => {
    if (!detectedGpsLocation) return;
    const applied = GlobalLocationService.setLocation(detectedGpsLocation);
    onLocationSelected(applied);
    onClose();
  };

  // Apply Search Suggestion
  const handleSelectSearchResult = (res: GlobalLocationState) => {
    const applied = GlobalLocationService.setLocation(res);
    onLocationSelected(applied);
    onClose();
  };

  // Apply Cascading Manual Selection
  const handleApplyManualSelection = () => {
    const finalVillage = isUsingCustomVillage && customVillageInput.trim()
      ? customVillageInput.trim()
      : selectedVillageOrTown || selectedTaluk || selectedDistrict;

    // Find taluk coordinates or default
    const talukObj = taluksList.find((t) => t.name === selectedTaluk);
    const distObj = districtsList.find((d) => d.name === selectedDistrict);

    const lat = talukObj?.latitude || distObj?.latitude || 12.9716;
    const lng = talukObj?.longitude || distObj?.longitude || 77.5946;
    const region = GlobalLocationService.getRegionForState(selectedState);

    const updated = GlobalLocationService.setLocation({
      country: 'India',
      state: selectedState,
      district: selectedDistrict,
      taluk: selectedTaluk || undefined,
      village: finalVillage,
      townOrVillage: finalVillage,
      city: finalVillage,
      pincode: customPincode.trim() || talukObj?.pincodes?.[0],
      latitude: lat,
      longitude: lng,
      region,
      locationType: isUsingCustomVillage || selectedVillageOrTown ? 'village' : 'taluk',
      isGpsDetected: false
    });

    onLocationSelected(updated);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-2xl w-full p-5 sm:p-7 shadow-2xl text-white space-y-6 animate-in fade-in zoom-in-95 my-auto max-h-[92vh] flex flex-col">
        {/* Modal Header */}
        <div className="flex items-start justify-between gap-4 border-b border-slate-800 pb-4 shrink-0">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 uppercase tracking-wider flex items-center gap-1">
                <TreePine className="w-3 h-3 text-emerald-400" />
                Rural &amp; Urban India Location Hub
              </span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2.5">
              <MapPin className="w-5 h-5 text-emerald-400 shrink-0" />
              <span>Select Your Location</span>
            </h3>
            <p className="text-xs text-slate-300 mt-1 leading-relaxed">
              Supports every Village, Gram Panchayat, Taluk/Tehsil, District, and PIN code across India.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher: 1. Use My Current Location (GPS) vs 2. Select Location Manually */}
        <div className="grid grid-cols-2 gap-2 p-1 bg-slate-800/90 rounded-2xl border border-slate-700/80 shrink-0">
          <button
            type="button"
            onClick={() => setActiveTab('gps')}
            className={`py-2.5 px-3 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition ${
              activeTab === 'gps'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-900/40'
                : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
            }`}
          >
            <Navigation className="w-4 h-4 text-emerald-300" />
            <span>1. 📍 Use My Current Location</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('manual')}
            className={`py-2.5 px-3 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition ${
              activeTab === 'manual'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-900/40'
                : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
            }`}
          >
            <Home className="w-4 h-4 text-teal-300" />
            <span>2. 🏠 Select Manually</span>
          </button>
        </div>

        {/* TAB 1: USE MY CURRENT LOCATION (GPS) */}
        {activeTab === 'gps' && (
          <div className="space-y-4 overflow-y-auto pr-1">
            <div className="bg-slate-800/60 border border-slate-700/80 rounded-2xl p-4 sm:p-5 text-center space-y-4">
              <div className="w-14 h-14 mx-auto rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                <Navigation className={`w-7 h-7 ${isDetectingGps ? 'animate-spin text-emerald-300' : ''}`} />
              </div>

              <div>
                <h4 className="text-base font-bold text-white">Live GPS Detection (Rural-Aware)</h4>
                <p className="text-xs text-slate-300 mt-1 max-w-md mx-auto">
                  PregNutri AI queries real high-precision geocoding data to detect your exact Village, Gram Panchayat, Taluk, District, and PIN code without substituting with distant cities.
                </p>
              </div>

              <button
                type="button"
                onClick={handleDetectGps}
                disabled={isDetectingGps}
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs sm:text-sm shadow-lg shadow-emerald-900/40 transition disabled:opacity-50 inline-flex items-center justify-center gap-2"
              >
                <Navigation className={`w-4 h-4 ${isDetectingGps ? 'animate-spin' : ''}`} />
                <span>{isDetectingGps ? 'Detecting Precise Rural Location...' : 'Detect My Exact Location'}</span>
              </button>

              {gpsError && (
                <div className="p-3 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-200 text-xs flex items-start gap-2 text-left">
                  <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <div className="font-semibold">Location Detection Alert</div>
                    <div className="text-[11px] text-amber-300/90">{gpsError}</div>
                  </div>
                </div>
              )}
            </div>

            {/* Display Detected Location Breakdown */}
            {detectedGpsLocation && (
              <div className="bg-emerald-950/40 border border-emerald-500/40 rounded-2xl p-4 sm:p-5 space-y-4 animate-in fade-in slide-in-from-top-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
                    <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                      Detected Location Hierarchy
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-400">
                    Lat: {detectedGpsLocation.latitude}, Lng: {detectedGpsLocation.longitude}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
                  <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800">
                    <span className="text-[10px] text-slate-400 uppercase font-semibold block">Village / Locality</span>
                    <span className="text-sm font-bold text-emerald-300">
                      {detectedGpsLocation.village || detectedGpsLocation.townOrVillage || 'Recognized Locality'}
                    </span>
                  </div>

                  <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800">
                    <span className="text-[10px] text-slate-400 uppercase font-semibold block">Taluk / Tehsil / Sub-district</span>
                    <span className="text-sm font-bold text-white">
                      {detectedGpsLocation.taluk || detectedGpsLocation.district || '—'}
                    </span>
                  </div>

                  <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800">
                    <span className="text-[10px] text-slate-400 uppercase font-semibold block">District</span>
                    <span className="text-sm font-bold text-white">
                      {detectedGpsLocation.district || '—'}
                    </span>
                  </div>

                  <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800">
                    <span className="text-[10px] text-slate-400 uppercase font-semibold block">State / Region</span>
                    <span className="text-sm font-bold text-white">
                      {detectedGpsLocation.state} ({detectedGpsLocation.region})
                    </span>
                  </div>

                  <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 sm:col-span-2">
                    <span className="text-[10px] text-slate-400 uppercase font-semibold block">PIN Code</span>
                    <span className="text-sm font-bold text-teal-300">
                      {detectedGpsLocation.pincode || 'Postal code auto-linked'}
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleApplyGpsLocation}
                  className="w-full py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-950 transition"
                >
                  <CheckCheck className="w-4 h-4 text-slate-950" />
                  <span>Confirm &amp; Sync Entire Application</span>
                </button>
              </div>
            )}

            {/* Current Active Location Card */}
            <div className="p-3.5 rounded-xl bg-slate-800/40 border border-slate-700/60 flex items-center justify-between text-xs">
              <div>
                <span className="text-[10px] text-slate-400 uppercase block font-semibold">Currently Active Location</span>
                <span className="font-bold text-slate-200">{currentLocation.formattedAddress || `${currentLocation.city}, ${currentLocation.state}`}</span>
              </div>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-700 text-slate-300">
                {currentLocation.region}
              </span>
            </div>
          </div>
        )}

        {/* TAB 2: SELECT LOCATION MANUALLY & SEARCH */}
        {activeTab === 'manual' && (
          <div className="space-y-4 overflow-y-auto pr-1">
            {/* Universal Search & PIN Code Field */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
                Quick Search by Village, Town, Taluk, District or 6-Digit PIN Code
              </label>
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search village (e.g. Hullahalli, Kadakola), Taluk (Nanjangud), or PIN (571301)..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-3 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-400 focus:outline-none focus:border-emerald-400"
                />
                {isSearching && (
                  <RefreshCw className="w-3.5 h-3.5 text-emerald-400 animate-spin absolute right-3.5 top-1/2 -translate-y-1/2" />
                )}
              </div>

              {pinLookupMessage && (
                <div className="text-[11px] text-emerald-300 font-medium px-1">
                  {pinLookupMessage}
                </div>
              )}

              {/* Search Suggestions Dropdown */}
              {searchResults.length > 0 && (
                <div className="max-h-48 overflow-y-auto rounded-xl bg-slate-800 border border-slate-700 divide-y divide-slate-750 shadow-xl">
                  {searchResults.map((res, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => handleSelectSearchResult(res)}
                      className="w-full p-2.5 text-left hover:bg-slate-700/60 transition flex items-center justify-between text-xs group"
                    >
                      <div>
                        <div className="font-bold text-white group-hover:text-emerald-300 flex items-center gap-1.5">
                          <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                          <span>{res.formattedAddress || `${res.village || res.city}, ${res.taluk ? `${res.taluk}, ` : ''}${res.district}, ${res.state}`}</span>
                        </div>
                        <div className="text-[10px] text-slate-400 mt-0.5 flex items-center gap-2">
                          <span>{res.state}</span>
                          <span>•</span>
                          <span>{res.region}</span>
                          {res.pincode && <span>• PIN: {res.pincode}</span>}
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-emerald-400" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* 4-Step Cascading Dropdowns */}
            <div className="bg-slate-800/60 border border-slate-700/80 rounded-2xl p-4 sm:p-5 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-700 pb-2">
                <span className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-emerald-400" />
                  Cascading Selection Hierarchy
                </span>
                <span className="text-[10px] text-slate-400">Step 1 to Step 4</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {/* Step 1: State */}
                <div>
                  <label className="text-[11px] font-bold text-slate-300 block mb-1">
                    Step 1: State / UT
                  </label>
                  <select
                    value={selectedState}
                    onChange={(e) => setSelectedState(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs font-medium text-white focus:border-emerald-400 outline-none"
                  >
                    {allStates.map((st) => (
                      <option key={st.state} value={st.state}>
                        {st.state} ({st.region})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Step 2: District */}
                <div>
                  <label className="text-[11px] font-bold text-slate-300 block mb-1">
                    Step 2: District
                  </label>
                  <select
                    value={selectedDistrict}
                    onChange={(e) => setSelectedDistrict(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs font-medium text-white focus:border-emerald-400 outline-none"
                  >
                    {districtsList.map((d) => (
                      <option key={d.name} value={d.name}>
                        {d.name} District
                      </option>
                    ))}
                  </select>
                </div>

                {/* Step 3: Taluk / Tehsil / Sub-District */}
                <div>
                  <label className="text-[11px] font-bold text-slate-300 block mb-1">
                    Step 3: Taluk / Tehsil / Sub-district
                  </label>
                  <select
                    value={selectedTaluk}
                    onChange={(e) => setSelectedTaluk(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs font-medium text-white focus:border-emerald-400 outline-none"
                  >
                    {taluksList.map((t) => (
                      <option key={t.name} value={t.name}>
                        {t.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Step 4: Village / Town Selection */}
                <div>
                  <label className="text-[11px] font-bold text-slate-300 block mb-1">
                    Step 4: Village / Town / Gram Panchayat
                  </label>
                  <select
                    disabled={isUsingCustomVillage}
                    value={selectedVillageOrTown}
                    onChange={(e) => {
                      setSelectedVillageOrTown(e.target.value);
                      const vt = villagesList.find((v) => v.name === e.target.value);
                      if (vt?.pincode) setCustomPincode(vt.pincode);
                    }}
                    className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs font-medium text-white focus:border-emerald-400 outline-none disabled:opacity-40"
                  >
                    {villagesList.map((v) => (
                      <option key={v.name} value={v.name}>
                        {v.name} ({v.type === 'village' ? 'Village' : v.type === 'gram_panchayat' ? 'Gram Panchayat' : 'Town'})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Custom Village Name Fallback / Manual Preservation */}
              <div className="pt-2 border-t border-slate-700/80 space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-[11px] font-semibold text-slate-300 flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isUsingCustomVillage}
                      onChange={(e) => setIsUsingCustomVillage(e.target.checked)}
                      className="rounded border-slate-700 text-emerald-500 focus:ring-emerald-400 bg-slate-900"
                    />
                    <span>Can&apos;t find your specific Village? Type Village Name manually</span>
                  </label>
                </div>

                {isUsingCustomVillage && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1 animate-in fade-in">
                    <div>
                      <input
                        type="text"
                        placeholder="Enter your Village / Gram Panchayat name..."
                        value={customVillageInput}
                        onChange={(e) => setCustomVillageInput(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-emerald-500/50 text-xs text-white placeholder-slate-500 outline-none focus:border-emerald-400"
                      />
                    </div>
                    <div>
                      <input
                        type="text"
                        placeholder="6-digit PIN code (optional)..."
                        maxLength={6}
                        value={customPincode}
                        onChange={(e) => setCustomPincode(e.target.value.replace(/\D/g, ''))}
                        className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white placeholder-slate-500 outline-none focus:border-emerald-400"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Quick Regional Shortcuts */}
            <div className="space-y-1.5">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Quick Regional Rural/Town Presets
              </span>
              <div className="flex flex-wrap gap-1.5">
                {POPULAR_INDIAN_LOCATIONS.map((loc) => (
                  <button
                    key={`${loc.city}-${loc.state}`}
                    type="button"
                    onClick={() => {
                      const updated = GlobalLocationService.setLocation({
                        country: 'India',
                        state: loc.state,
                        district: loc.district,
                        taluk: loc.taluk,
                        village: loc.village,
                        townOrVillage: loc.village || loc.city,
                        city: loc.city,
                        pincode: loc.pincode,
                        region: loc.region,
                        latitude: loc.latitude,
                        longitude: loc.longitude,
                        isGpsDetected: false
                      });
                      onLocationSelected(updated);
                      onClose();
                    }}
                    className="px-2.5 py-1 rounded-lg bg-slate-800/80 hover:bg-emerald-600/30 hover:border-emerald-500/50 border border-slate-700 text-[11px] text-slate-300 hover:text-white transition"
                  >
                    {loc.village ? `${loc.village} (${loc.taluk})` : loc.taluk ? `${loc.taluk}, ${loc.district}` : `${loc.city}, ${loc.state}`}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Modal Footer */}
        <div className="flex items-center justify-between pt-3 border-t border-slate-800 shrink-0">
          <div className="text-[11px] text-slate-400 hidden sm:block">
            {activeTab === 'manual'
              ? `Selected: ${isUsingCustomVillage && customVillageInput ? customVillageInput : selectedVillageOrTown || selectedTaluk}, ${selectedDistrict}, ${selectedState}`
              : 'GPS detection synchronizes local PHCs & State food recipes'}
          </div>

          <div className="flex items-center gap-2.5 ml-auto">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-bold text-slate-300 hover:bg-slate-800 transition"
            >
              Cancel
            </button>

            {activeTab === 'manual' && (
              <button
                type="button"
                onClick={handleApplyManualSelection}
                className="px-5 py-2.5 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white shadow-md shadow-emerald-900/30 transition flex items-center gap-1.5"
              >
                <Check className="w-4 h-4" />
                <span>Apply Location</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
