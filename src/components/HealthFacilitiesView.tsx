import React, { useState, useEffect, useCallback } from 'react';
import { HealthFacility, GlobalLocationState } from '../types';
import { HealthFacilityService, NearbyFacilitiesResult } from '../services/health_facility_service';
import { InteractiveFacilityMap } from './InteractiveFacilityMap';
import { useLanguage, DualText } from '../services/language_service';
import {
  Hospital,
  MapPin,
  Phone,
  Navigation,
  Star,
  ShieldAlert,
  ShieldCheck,
  Building,
  Loader2,
  CheckCircle2,
  HeartHandshake,
  Baby,
  Activity,
  Sparkles,
  Info,
  ExternalLink
} from 'lucide-react';

interface HealthFacilitiesViewProps {
  facilities?: HealthFacility[];
  globalLocation?: GlobalLocationState;
  onUpdateLocation?: (location: Partial<GlobalLocationState>) => void;
}

export const HealthFacilitiesView: React.FC<HealthFacilitiesViewProps> = ({
  globalLocation
}) => {
  // Coordinates taken strictly from the application's main location selector
  const userCoords = {
    latitude: globalLocation?.latitude || 12.0621,
    longitude: globalLocation?.longitude || 76.5412
  };

  const currentCityName =
    globalLocation?.village || globalLocation?.townOrVillage || globalLocation?.city || 'Hullahalli';
  const currentStateName = globalLocation?.state || 'Karnataka';
  const currentDistrictName = globalLocation?.district || 'Mysuru';
  const currentTalukName = globalLocation?.taluk || 'Nanjangud';

  // Category filter and active facility state
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [activeFacility, setActiveFacility] = useState<HealthFacility | null>(null);

  // Async Facility States
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [liveFacilities, setLiveFacilities] = useState<HealthFacility[]>([]);
  const [totalFound, setTotalFound] = useState<number>(0);
  const [isAutoExpanded, setIsAutoExpanded] = useState<boolean>(false);
  const [autoExpandedMessage, setAutoExpandedMessage] = useState<string | undefined>(undefined);

  // Load facilities automatically around current coordinates
  const fetchFacilities = useCallback(async () => {
    setIsLoading(true);
    try {
      const result: NearbyFacilitiesResult = await HealthFacilityService.getNearbyFacilities({
        latitude: userCoords.latitude,
        longitude: userCoords.longitude,
        category: selectedCategory,
        selectedCity: currentCityName,
        selectedState: currentStateName,
        includeLiveOsm: true
      });

      setLiveFacilities(result.facilities);
      setTotalFound(result.totalFound);
      setIsAutoExpanded(result.isAutoExpanded);
      setAutoExpandedMessage(result.autoExpandedMessage);

      // Default select the nearest facility (index 0) if none or previous is not in list
      if (result.facilities.length > 0) {
        if (!activeFacility || !result.facilities.some((f) => f.id === activeFacility.id)) {
          setActiveFacility(result.facilities[0]);
        }
      } else {
        setActiveFacility(null);
      }
    } catch (err) {
      console.error('Failed to load facilities:', err);
    } finally {
      setIsLoading(false);
    }
  }, [userCoords.latitude, userCoords.longitude, selectedCategory, currentCityName, currentStateName]);

  useEffect(() => {
    setLiveFacilities([]); // Clear previous results immediately on location or category change
    setActiveFacility(null);
    fetchFacilities();
  }, [fetchFacilities]);

  const categories = [
    { id: 'All', label: 'All Facilities', icon: Hospital },
    { id: 'Government General Hospital', label: 'Govt Hospitals', icon: Building },
    { id: 'Primary Health Centre (PHC)', label: 'PHCs & Sub-Centres', icon: Activity },
    { id: 'Community Health Centre (CHC)', label: 'CHCs & Taluk', icon: HeartHandshake },
    { id: 'Maternity Hospital', label: 'Maternity Hubs', icon: Baby },
    { id: 'Medical College Hospital', label: 'Medical Colleges', icon: ShieldCheck },
    { id: 'District Hospital', label: 'District Hospitals', icon: Building },
    { id: 'Private Hospital', label: 'Private Hospitals', icon: Star }
  ];

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-300">
      {/* Top Header Card - Clean and Simple */}
      <div className="bg-[#E8D9CD] rounded-3xl p-5 sm:p-7 border border-[#959D90] shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="space-y-1.5">
            <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-[#523D35] text-[#E8D9CD] border border-[#BBA58F]/30 text-xs font-bold uppercase tracking-wider mb-1">
              <Hospital className="w-3.5 h-3.5 text-[#BBA58F]" />
              <span>National Maternal &amp; Obstetric Care Network</span>
            </div>

            {/* Formatted Selected Location Display: e.g., 📍 Hullahalli, Mysuru, Karnataka */}
            <div className="flex items-center gap-2 text-sm sm:text-base font-extrabold text-[#223030]">
              <span className="text-[#523D35] text-lg">📍</span>
              <span className="bg-[#EFEFE9] hover:bg-[#BBA58F]/30 text-[#223030] px-3 py-1 rounded-xl border border-[#959D90]/50 transition">
                {currentCityName}
                {currentTalukName && currentTalukName !== currentCityName ? ` (${currentTalukName})` : ''}
                {currentDistrictName && currentDistrictName !== currentCityName ? `, ${currentDistrictName}` : ''}
                {currentStateName ? `, ${currentStateName}` : ''}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#223030] tracking-tight flex items-center gap-2">
              <DualText textKey="nav.healthFacilities" fallback="Nearby Health Facilities" className="text-2xl sm:text-3xl font-extrabold text-[#223030]" />
            </h1>
            <p className="text-xs sm:text-sm text-[#523D35] font-medium">
              Automatically discovered nearest healthcare &amp; maternity facilities • Sorted by geographic distance from your location
            </p>
          </div>

          {/* Quick Facility Total Badge */}
          <div className="flex items-center gap-2 self-start sm:self-center">
            <div className="px-4 py-2.5 rounded-2xl bg-[#523D35] border border-[#BBA58F]/30 text-[#E8D9CD] text-xs font-bold flex items-center gap-2 shadow-2xs">
              <span className="w-2 h-2 rounded-full bg-[#BBA58F] animate-pulse"></span>
              <span>{totalFound} Nearby Facilities</span>
            </div>
          </div>
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center space-x-2 overflow-x-auto no-scrollbar pt-2 border-t border-[#959D90]/30">
          {categories.map((cat) => {
            const Icon = cat.icon;
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3.5 py-2 rounded-2xl text-xs font-bold whitespace-nowrap transition flex items-center gap-1.5 cursor-pointer ${
                  isSelected
                    ? 'bg-[#223030] text-[#EFEFE9] shadow-xs'
                    : 'bg-[#EFEFE9] hover:bg-[#BBA58F]/30 text-[#523D35] border border-[#959D90]/40'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isSelected ? 'text-[#BBA58F]' : 'text-[#523D35]'}`} />
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Auto-Expansion Notice for Rural Regions */}
      {isAutoExpanded && autoExpandedMessage && (
        <div className="p-3.5 rounded-2xl bg-[#E8D9CD] border border-[#959D90] text-[#223030] text-xs font-medium flex items-center justify-between gap-3 animate-in fade-in">
          <div className="flex items-center gap-2">
            <Info className="w-4 h-4 text-[#523D35] shrink-0" />
            <span>{autoExpandedMessage}</span>
          </div>
          <span className="px-2.5 py-0.5 rounded-full bg-[#523D35] text-[#E8D9CD] text-[11px] font-bold shrink-0">
            Auto-expanded range
          </span>
        </div>
      )}

      {/* Main Two-Column Layout: Left (Scrollable List) & Right (Interactive Real Map) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* ========================================================= */}
        {/* LEFT COLUMN: Scrollable Hospital Cards (5 Cols on Desktop) */}
        {/* ========================================================= */}
        <div className="lg:col-span-5 space-y-3.5 order-2 lg:order-1">
          <div className="flex items-center justify-between px-1">
            <div className="text-xs font-bold text-[#223030] flex items-center gap-1.5">
              <span>Nearby Health Facilities</span>
              <span className="px-2 py-0.5 rounded-full bg-[#E8D9CD] text-[#523D35] text-[11px] border border-[#959D90]/40 font-bold">
                {totalFound} Found
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-xs font-extrabold text-[#523D35] bg-[#E8D9CD] border border-[#959D90] px-2.5 py-0.5 rounded-full">
              <span>Nearest First</span>
            </div>
          </div>

          {isLoading ? (
            <div className="bg-[#E8D9CD] rounded-3xl p-12 text-center border border-[#959D90] shadow-xs space-y-3">
              <Loader2 className="w-8 h-8 text-[#523D35] animate-spin mx-auto" />
              <p className="text-xs font-bold text-[#223030]">
                Finding nearest healthcare facilities for {currentCityName}…
              </p>
              <p className="text-[11px] text-[#523D35]">
                Calculating exact geographic distances from your coordinates ({userCoords.latitude.toFixed(4)}°, {userCoords.longitude.toFixed(4)}°)
              </p>
            </div>
          ) : liveFacilities.length === 0 ? (
            <div className="bg-[#E8D9CD] rounded-3xl p-10 text-center border border-[#959D90] shadow-xs space-y-3">
              <Hospital className="w-10 h-10 text-[#959D90] mx-auto" />
              <p className="text-sm font-bold text-[#223030]">
                No health facilities found nearby
              </p>
              <p className="text-xs text-[#523D35] max-w-xs mx-auto">
                No matching facilities for the selected category in this area.
              </p>
              <div className="flex items-center justify-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedCategory('All')}
                  className="px-3.5 py-1.5 rounded-xl bg-[#223030] text-[#EFEFE9] text-xs font-bold hover:bg-[#523D35] transition cursor-pointer"
                >
                  Show All Categories
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-3 max-h-[720px] overflow-y-auto pr-1">
              {liveFacilities.map((fac, index) => {
                const isSelected = activeFacility?.id === fac.id;
                const isGovt =
                  !fac.category.includes('Private') &&
                  (fac.category.includes('Government') ||
                    fac.category.includes('PHC') ||
                    fac.category.includes('CHC') ||
                    fac.category.includes('District') ||
                    fac.category.includes('Medical College'));

                return (
                  <div
                    key={fac.id}
                    onClick={() => setActiveFacility(fac)}
                    className={`bg-[#E8D9CD] rounded-3xl p-4 sm:p-5 border transition-all duration-200 cursor-pointer shadow-xs ${
                      isSelected
                        ? 'border-[#223030] ring-3 ring-[#223030]/20 bg-[#EFEFE9] shadow-md'
                        : 'border-[#959D90] hover:border-[#523D35] hover:shadow-sm'
                    }`}
                  >
                    {/* Header Badges: [Rank #] [Facility Type Badge] [Government/Private Badge] [Distance] */}
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex flex-wrap items-center gap-1.5">
                        {/* Numerical Rank Badge */}
                        <span className="w-5 h-5 rounded-full bg-[#223030] text-[#EFEFE9] text-[10px] font-black flex items-center justify-center shrink-0">
                          {index + 1}
                        </span>

                        {/* Facility Type Badge */}
                        <span className="px-2.5 py-0.5 rounded-full bg-[#EFEFE9] text-[#223030] text-[10px] font-bold uppercase tracking-wider border border-[#959D90]/30">
                          {fac.category}
                        </span>

                        {/* Government/Private Badge */}
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold flex items-center gap-1 ${
                            isGovt
                              ? 'bg-[#523D35] text-[#E8D9CD] border border-[#BBA58F]/30'
                              : 'bg-[#223030] text-[#EFEFE9] border border-[#959D90]/30'
                          }`}
                        >
                          {isGovt ? '🏛️ Govt' : '🏢 Private'}
                        </span>

                        {/* Maternity Badge */}
                        {fac.hasMaternityWard && (
                          <span className="px-2 py-0.5 rounded-full bg-[#BBA58F]/40 text-[#223030] text-[10px] font-bold flex items-center gap-0.5">
                            <Baby className="w-2.5 h-2.5" />
                            Maternity
                          </span>
                        )}
                      </div>

                      {/* Calculated Distance Pill (Bold & Prominent) */}
                      <span className="px-2.5 py-1 rounded-xl bg-[#523D35] text-[#E8D9CD] border border-[#BBA58F]/30 text-xs font-black shrink-0 flex items-center gap-1">
                        <Navigation className="w-3 h-3 text-[#BBA58F]" />
                        {fac.distanceKm} km
                      </span>
                    </div>

                    {/* Hospital Name */}
                    <h3 className="text-sm sm:text-base font-bold text-[#223030] mt-2.5 leading-snug">
                      {fac.name}
                    </h3>

                    {/* Address with 📍 Icon */}
                    <p className="text-xs text-[#523D35] mt-1.5 flex items-start gap-1.5 leading-relaxed">
                      <MapPin className="w-3.5 h-3.5 text-[#523D35] shrink-0 mt-0.5" />
                      <span>{fac.address}</span>
                    </p>

                    {/* Doctor / CMO & Timing Grid */}
                    <div className="grid grid-cols-2 gap-2 my-3 p-2.5 bg-[#EFEFE9] rounded-2xl border border-[#959D90]/40 text-[11px] text-[#223030]">
                      <div>
                        <span className="text-[10px] text-[#959D90] block font-semibold">Doctor / MOIC:</span>
                        <span className="font-bold text-[#223030] truncate block">
                          {fac.doctorInCharge || (isGovt ? 'Medical Officer In-Charge' : 'Chief Medical Officer')}
                        </span>
                      </div>
                      <div>
                        <span className="text-[10px] text-[#959D90] block font-semibold">Emergency / Timings:</span>
                        <span className="font-medium text-[#523D35] truncate block">
                          {fac.timing || '24/7 Obstetric Emergency'}
                        </span>
                      </div>
                    </div>

                    {/* Maternal Services / Features Preview */}
                    {fac.maternalServices && fac.maternalServices.length > 0 && (
                      <div className="mb-3 space-y-1">
                        <span className="text-[10px] font-bold text-[#959D90] uppercase tracking-wider block">
                          Available Services:
                        </span>
                        <div className="flex flex-wrap gap-1">
                          {fac.maternalServices.slice(0, 2).map((srv, idx) => (
                            <span
                              key={idx}
                              className="text-[10px] bg-[#EFEFE9] text-[#223030] font-medium px-2 py-0.5 rounded-lg border border-[#959D90]/40"
                            >
                              ✓ {srv}
                            </span>
                          ))}
                          {fac.hasCashlessSchemes && (
                            <span className="text-[10px] bg-[#523D35] text-[#E8D9CD] font-semibold px-2 py-0.5 rounded-lg border border-[#BBA58F]/30">
                              ✓ Free JSSK Deliveries
                            </span>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Card Actions: [ 📞 Call ] [ ➤ Directions ] */}
                    <div className="flex items-center space-x-2 pt-1">
                      <a
                        href={`tel:${fac.phone ? fac.phone.replace(/[^0-9+]/g, '') : '108'}`}
                        onClick={(e) => e.stopPropagation()}
                        className="flex-1 py-2 rounded-xl bg-[#523D35] hover:bg-[#223030] text-[#E8D9CD] text-xs font-bold flex items-center justify-center gap-1.5 transition shadow-2xs cursor-pointer"
                      >
                        <Phone className="w-3.5 h-3.5" />
                        <DualText textKey="action.callHospital" fallback="Call" className="text-[#E8D9CD] font-bold" miniClassName="text-[10px] text-[#BBA58F]" />
                      </a>
                      <a
                        href={`https://www.google.com/maps/dir/?api=1&origin=${userCoords.latitude},${userCoords.longitude}&destination=${fac.lat},${fac.lng}`}
                        target="_blank"
                        rel="noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="flex-1 py-2 rounded-xl bg-[#223030] hover:bg-[#523D35] text-[#EFEFE9] text-xs font-bold flex items-center justify-center gap-1.5 transition cursor-pointer"
                      >
                        <Navigation className="w-3.5 h-3.5 text-[#BBA58F]" />
                        <DualText textKey="action.getDirections" fallback="Directions" className="text-[#EFEFE9] font-bold" miniClassName="text-[10px] text-[#BBA58F]" />
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* ========================================================= */}
        {/* RIGHT COLUMN: Interactive Real Map (7 Cols on Desktop)     */}
        {/* ========================================================= */}
        <div className="lg:col-span-7 space-y-4 order-1 lg:order-2 sticky top-20">
          <div className="bg-[#E8D9CD] rounded-3xl p-4 sm:p-5 border border-[#959D90] shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-[#223030] flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#523D35]" />
                <span>Live Interactive Hospital Finder Map</span>
              </h3>
              <div className="flex items-center gap-1.5 text-xs text-[#523D35] font-medium">
                <span className="w-2 h-2 rounded-full bg-[#523D35] animate-pulse"></span>
                <span>OpenStreetMap Active</span>
              </div>
            </div>

            {/* Interactive Leaflet Map Visualizer */}
            <div className="h-[380px] sm:h-[460px] w-full rounded-2xl overflow-hidden border border-[#959D90]/50">
              <InteractiveFacilityMap
                userLocation={userCoords}
                userCityName={currentCityName}
                facilities={liveFacilities}
                activeFacility={activeFacility}
                onSelectFacility={(fac) => setActiveFacility(fac)}
                onRecenter={() => {
                  if (liveFacilities.length > 0) {
                    setActiveFacility(liveFacilities[0]);
                  }
                }}
              />
            </div>

            {/* Direct 24/7 Maternal Emergency Helplines Bar */}
            <div className="bg-[#EFEFE9] border border-[#959D90] rounded-2xl p-3.5 space-y-2">
              <div className="flex items-center justify-between text-[#223030] font-bold text-xs">
                <div className="flex items-center space-x-1.5">
                  <ShieldAlert className="w-4 h-4 text-[#523D35]" />
                  <span>24/7 Free Maternal Emergency Hotlines (India)</span>
                </div>
                <span className="text-[10px] text-[#E8D9CD] bg-[#523D35] px-2 py-0.5 rounded-full font-bold">
                  Toll-Free
                </span>
              </div>
              <div className="grid grid-cols-3 gap-2 pt-1">
                <a
                  href="tel:102"
                  className="p-2 rounded-xl bg-[#523D35] hover:bg-[#223030] text-[#E8D9CD] text-xs font-extrabold text-center transition flex flex-col items-center justify-center shadow-2xs cursor-pointer"
                >
                  <span className="text-sm">🚑 102</span>
                  <span className="text-[10px] font-normal opacity-90">Maternal Ambulance</span>
                </a>
                <a
                  href="tel:108"
                  className="p-2 rounded-xl bg-[#223030] hover:bg-[#523D35] text-[#EFEFE9] text-xs font-extrabold text-center transition flex flex-col items-center justify-center cursor-pointer"
                >
                  <span className="text-sm">🚨 108</span>
                  <span className="text-[10px] font-normal opacity-90">Disaster &amp; EMS</span>
                </a>
                <a
                  href="tel:104"
                  className="p-2 rounded-xl bg-[#523D35] hover:bg-[#223030] text-[#E8D9CD] text-xs font-extrabold text-center transition flex flex-col items-center justify-center cursor-pointer"
                >
                  <span className="text-sm">📞 104</span>
                  <span className="text-[10px] font-normal opacity-90">Medical Helpline</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================= */}
      {/* BOTTOM SELECTED FACILITY INFORMATION PANEL                */}
      {/* ========================================================= */}
      {activeFacility && (
        <div className="bg-[#E8D9CD] rounded-3xl p-6 sm:p-8 border-2 border-[#523D35] shadow-md space-y-6 animate-in slide-in-from-bottom-4 duration-300">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-3 py-1 rounded-full bg-[#EFEFE9] text-[#223030] text-xs font-bold border border-[#959D90]/40">
                  {activeFacility.category}
                </span>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-bold ${
                    !activeFacility.category.includes('Private')
                      ? 'bg-[#523D35] text-[#E8D9CD] border border-[#BBA58F]/30'
                      : 'bg-[#223030] text-[#EFEFE9] border border-[#959D90]/30'
                  }`}
                >
                  {!activeFacility.category.includes('Private') ? '🏛️ Government Facility' : '🏢 Private Facility'}
                </span>
                <span className="px-3 py-1 rounded-full bg-[#EFEFE9] text-[#223030] text-xs font-extrabold flex items-center gap-1 border border-[#959D90]/40">
                  <Navigation className="w-3.5 h-3.5 text-[#523D35]" />
                  {activeFacility.distanceKm} km from your location
                </span>
                <span className="px-3 py-1 rounded-full bg-[#EFEFE9] text-[#223030] text-xs font-bold flex items-center gap-1 border border-[#959D90]/40">
                  <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                  {activeFacility.rating} Rating
                </span>
              </div>

              <h2 className="text-xl sm:text-2xl font-extrabold text-[#223030] tracking-tight">
                {activeFacility.name}
              </h2>

              <p className="text-sm text-[#523D35] flex items-start gap-2 max-w-3xl">
                <MapPin className="w-4 h-4 text-[#523D35] shrink-0 mt-0.5" />
                <span>{activeFacility.address}</span>
              </p>
            </div>

            {/* Quick Action Direct Buttons */}
            <div className="flex items-center gap-3 self-start shrink-0">
              <a
                href={`tel:${activeFacility.phone ? activeFacility.phone.replace(/[^0-9+]/g, '') : '108'}`}
                className="px-5 py-3 rounded-2xl bg-[#523D35] hover:bg-[#223030] text-[#E8D9CD] text-xs sm:text-sm font-bold flex items-center gap-2 transition shadow-xs cursor-pointer"
              >
                <Phone className="w-4 h-4" />
                <span>Direct Call</span>
              </a>
              <a
                href={`https://www.google.com/maps/dir/?api=1&origin=${userCoords.latitude},${userCoords.longitude}&destination=${activeFacility.lat},${activeFacility.lng}`}
                target="_blank"
                rel="noreferrer"
                className="px-5 py-3 rounded-2xl bg-[#223030] hover:bg-[#523D35] text-[#EFEFE9] text-xs sm:text-sm font-bold flex items-center gap-2 transition shadow-xs cursor-pointer"
              >
                <Navigation className="w-4 h-4 text-[#BBA58F]" />
                <span>Get GPS Directions</span>
                <ExternalLink className="w-3.5 h-3.5 opacity-70" />
              </a>
            </div>
          </div>

          {/* Clinical Features & Maternal Services Breakdown */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Delivery Services */}
            <div className="p-4 rounded-2xl bg-[#EFEFE9] border border-[#959D90]/50 space-y-1.5">
              <div className="flex items-center space-x-2 text-[#523D35] font-bold text-xs">
                <Baby className="w-4 h-4" />
                <span>Delivery &amp; Labor</span>
              </div>
              <p className="text-xs text-[#223030] font-medium">
                {activeFacility.hasDeliveryRoom
                  ? '24/7 Normal & C-Section Delivery Theaters Available'
                  : 'Basic Antenatal Support & Referral'}
              </p>
            </div>

            {/* Maternal ICU / HDU */}
            <div className="p-4 rounded-2xl bg-[#EFEFE9] border border-[#959D90]/50 space-y-1.5">
              <div className="flex items-center space-x-2 text-[#523D35] font-bold text-xs">
                <Activity className="w-4 h-4" />
                <span>Obstetric HDU / ICU</span>
              </div>
              <p className="text-xs text-[#223030] font-medium">
                {activeFacility.hasMaternalIcu
                  ? 'Equipped with High-Dependency Critical Maternal Care'
                  : 'Equipped for Standard Obstetric Monitoring'}
              </p>
            </div>

            {/* Newborn & NICU Care */}
            <div className="p-4 rounded-2xl bg-[#EFEFE9] border border-[#959D90]/50 space-y-1.5">
              <div className="flex items-center space-x-2 text-[#523D35] font-bold text-xs">
                <ShieldCheck className="w-4 h-4" />
                <span>Neonatal &amp; NICU</span>
              </div>
              <p className="text-xs text-[#223030] font-medium">
                {activeFacility.hasNicu
                  ? 'Level III NICU / Special Newborn Care Unit (SNCU)'
                  : 'Newborn Stabilization & Pediatric Support'}
              </p>
            </div>

            {/* Cashless Entitlements */}
            <div className="p-4 rounded-2xl bg-[#EFEFE9] border border-[#959D90]/50 space-y-1.5">
              <div className="flex items-center space-x-2 text-[#523D35] font-bold text-xs">
                <HeartHandshake className="w-4 h-4" />
                <span>Cashless Entitlements</span>
              </div>
              <p className="text-xs text-[#223030] font-medium">
                {activeFacility.hasCashlessSchemes
                  ? '100% Free Deliveries & Food under JSSK & PM-JAY'
                  : 'Standard Healthcare Tariffs & Insurance Accepted'}
              </p>
            </div>
          </div>

          {/* Maternal Services Detailed Checklist */}
          {activeFacility.maternalServices && activeFacility.maternalServices.length > 0 && (
            <div className="p-4 sm:p-5 rounded-2xl bg-[#EFEFE9] border border-[#959D90] space-y-2.5">
              <h4 className="text-xs font-bold text-[#223030] flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5 text-[#523D35]" />
                <span>Maternal Services &amp; Clinical Facilities Available:</span>
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 pt-1">
                {activeFacility.maternalServices.map((service, idx) => (
                  <div
                    key={idx}
                    className="flex items-center space-x-2 text-xs text-[#223030] bg-[#E8D9CD] p-2.5 rounded-xl border border-[#959D90]/40 shadow-2xs font-medium"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#523D35] shrink-0" />
                    <span>{service}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Contact Details & In-Charge Footer */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 border-t border-[#959D90]/30 text-xs">
            <div>
              <span className="text-[11px] text-[#959D90] font-semibold block">Doctor / Superintendent:</span>
              <span className="font-bold text-[#223030]">{activeFacility.doctorInCharge || 'Medical Superintendent'}</span>
            </div>
            <div>
              <span className="text-[11px] text-[#959D90] font-semibold block">Official Telephone:</span>
              <span className="font-bold text-[#223030]">{activeFacility.phone}</span>
            </div>
            <div>
              <span className="text-[11px] text-[#959D90] font-semibold block">Emergency Hotline:</span>
              <span className="font-bold text-[#523D35]">{activeFacility.emergencyPhone || '108 / 102'}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
