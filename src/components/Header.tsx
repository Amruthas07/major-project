import React, { useState, useMemo, useRef, useEffect } from 'react';
import { UserProfile, GlobalLocationState, AuthUser } from '../types';
import { Sparkles, Globe, User, LogOut, ChevronDown, Heart, ShieldCheck, MapPin, Search, Check, LogIn, Bell, X, Phone } from 'lucide-react';
import { useLanguage, ALL_INDIAN_LANGUAGES, DualText } from '../services/language_service';
import { useAppContext } from '../context/AppContext';
import { firestoreService, hasRealFirebase, serverTimestamp } from '../firebase';

interface HeaderProps {
  profile: UserProfile;
  globalLocation: GlobalLocationState;
  onUpdateLocation: (location: GlobalLocationState) => void;
  onOpenProfile: () => void;
  onResetData: () => void;
  currentUser?: AuthUser | null;
  onOpenAuth?: () => void;
  onLogout?: () => void;
  onOpenSos?: () => void;
}

const HEADER_LOCATION_NAMES: Record<string, Record<string, string>> = {
  'Hullahalli': { kn: 'ಹುಲ್ಲಹಳ್ಳಿ', hi: 'हुल्लाहल्ली', ta: 'ஹுல்லஹள்ளி', te: 'హుల్లహళ్ళి', ml: 'ഹുല്ലഹള്ളി' },
  'Nanjangud': { kn: 'ನಂಜನಗೂಡು', hi: 'नंजनगुड़', ta: 'நஞ்சன்கூடு', te: 'నంజనగూడు', ml: 'നഞ്ചൻഗുഡ്' },
  'Mysuru': { kn: 'ಮೈಸೂರು', hi: 'मैसूरु', ta: 'மைசூரு', te: 'మైసూరు', ml: 'മൈസൂരു' },
  'Mysore': { kn: 'ಮೈಸೂರು', hi: 'मैसूर', ta: 'மைசூர்', te: 'మైసూర్', ml: 'മൈసూర్' },
  'Karnataka': { kn: 'ಕರ್ನಾಟಕ', hi: 'कर्नाटक', ta: 'கர்நாடகா', te: 'కర్ణాటక', ml: 'കർണാടക' },
  'Bengaluru': { kn: 'ಬೆಂಗಳೂರು', hi: 'बेंगलुरु', ta: 'பெங்களூரு', te: 'బెంగళూరు', ml: 'ബെംഗളൂരു' },
  'Bangalore': { kn: 'ಬೆಂಗಳೂರು', hi: 'बेंगलुरु', ta: 'பெங்களூரு', te: 'బెంగళూరు', ml: 'ബെംഗളൂരു' },
  'Mandya': { kn: 'ಮಂಡ್ಯ', hi: 'मंड्या', ta: 'மண்டியா', te: 'ಮಂಡ್ಯ', ml: 'മാണ്ഡ്യ' },
  'Hassan': { kn: 'ಹಾಸನ', hi: 'हासन', ta: 'ஹாசன்', te: 'హాసన్', ml: 'ഹാಸನ್' },
  'Hunsur': { kn: 'ಹುಣಸೂರು', hi: 'हुणसूर', ta: 'ஹுன்சூர்', te: 'హున్సూర్', ml: 'ഹുൻസൂർ' },
  'Debur': { kn: 'ದೇಬೂರು', hi: 'देबूर', ta: 'தேபூர்', te: 'దేబూరు', ml: 'ദേബൂർ' },
  'Hadinaru': { kn: 'ಹದಿನಾರು', hi: 'हदीनारू', ta: 'ஹதினாரு', te: 'హదినారు', ml: 'ഹദിനാറു' },
  'Kadakola': { kn: 'ಕಡಕೋಳ', hi: 'कडकोला', ta: 'கடகோலா', te: 'కడకోల', ml: 'കടകോള' },
  'Bilikere': { kn: 'ಬಿಳಿಕೆರೆ', hi: 'बिलीकेरे', ta: 'பிலிகெரே', te: 'బిలికెరె', ml: 'ബിലികെരെ' },
  'Tamil Nadu': { kn: 'ತಮಿಳುನಾಡು', hi: 'तमिलनाडु', ta: 'தமிழ்நாடு', te: 'తమిళనాడు', ml: 'തಮಿഴ്ನಾട്' },
  'Kerala': { kn: 'ಕೇರಳ', hi: 'केरल', ta: 'கேரளா', te: 'കേരള', ml: 'കേരളം' },
  'Andhra Pradesh': { kn: 'ಆಂಧ್ರಪ್ರದೇಶ', hi: 'आंध्र प्रदेश', ta: 'ஆந்திரப் பிரதேசம்', te: 'ఆంధ్రప్రదేశ్', ml: 'ആന്ധ്രാಪ್ರದೇಶ್' },
  'Telangana': { kn: 'ತೆಲಂಗಾಣ', hi: 'तेलंगाना', ta: 'தெலுங்கானா', te: 'తెలంగాణ', ml: 'തെലങ്കാന' },
  'Maharashtra': { kn: 'ಮಹಾರಾಷ್ಟ್ರ', hi: 'महाराष्ट्र', ta: 'மகாராஷ்டிரா', te: 'మహారాష్ట్ర', ml: 'മഹാരാഷ്ട്ര' }
};

const localizeLocationName = (name: string | undefined, lang: string): string => {
  if (!name) return '';
  return HEADER_LOCATION_NAMES[name]?.[lang] || name;
};

export const Header: React.FC<HeaderProps> = ({
  profile,
  globalLocation,
  onUpdateLocation,
  onOpenProfile,
  onResetData,
  currentUser,
  onOpenAuth,
  onLogout,
  onOpenSos
}) => {
  const { currentLanguage, setLanguage, isEnglish, t } = useLanguage();
  const locLang = currentLanguage.code;
  const primaryLoc = localizeLocationName(profile.village || globalLocation.village || profile.taluk || globalLocation.taluk || profile.district || globalLocation.district || profile.city || globalLocation.city, locLang);
  const districtLoc = localizeLocationName(profile.district || globalLocation.district, locLang);
  const stateLoc = localizeLocationName(profile.state || globalLocation.state || 'Karnataka', locLang);
  const { setIsSosModalOpen } = useAppContext();
  const [showLangMenu, setShowLangMenu] = useState(false);
  const [langSearch, setLangSearch] = useState('');
  const [showConfirmReset, setShowConfirmReset] = useState(false);
  const langDropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click or Escape key press
  useEffect(() => {
    if (!showLangMenu) return;

    const handleClickOutside = (e: MouseEvent | TouchEvent) => {
      if (langDropdownRef.current && !langDropdownRef.current.contains(e.target as Node)) {
        setShowLangMenu(false);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setShowLangMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [showLangMenu]);

  const filteredLanguages = useMemo(() => {
    if (!langSearch.trim()) return ALL_INDIAN_LANGUAGES;
    const q = langSearch.toLowerCase().trim();
    return ALL_INDIAN_LANGUAGES.filter(
      (l) =>
        l.name.toLowerCase().includes(q) ||
        l.native.toLowerCase().includes(q) ||
        (l.region && l.region.toLowerCase().includes(q))
    );
  }, [langSearch]);

  const trimesterNumber = profile.weeksPregnant <= 12 ? 1 : profile.weeksPregnant <= 28 ? 2 : 3;

  return (
    <header className="bg-[#223030] text-[#EFEFE9] border-b border-[#523D35]/60 sticky top-0 z-40 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between min-h-20 py-2.5 flex-wrap gap-y-2">
          {/* Left Side: Brand Logo & Title */}
          <div className="flex items-center space-x-3.5">
            <div className="w-11 h-11 rounded-2xl bg-[#523D35] border border-[#BBA58F]/40 flex items-center justify-center shadow-md text-[#EFEFE9] font-extrabold text-2xl tracking-tighter shrink-0">
              P
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-extrabold text-xl sm:text-2xl tracking-tight text-[#EFEFE9] flex items-center gap-1.5">
                  PregNutri <span className="text-[#BBA58F]">AI</span>
                </span>
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase bg-[#523D35] text-[#E8D9CD] border border-[#BBA58F]/40">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#BBA58F] mr-1"></span>
                  {t('header.preview', 'PREVIEW')}
                </span>
              </div>
              <div className="text-[11px] sm:text-xs text-amber-100 tracking-normal font-semibold mt-0.5 leading-tight block">
                <DualText textKey="app.tagline" fallback="Clinical Maternal Nutrition & Smart Logs Companion" className="text-[11px] sm:text-xs text-amber-100 font-semibold" />
              </div>
            </div>
          </div>

          {/* Right Side: Location Pill, Language, Profile, Week Info, Logout */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {/* Profile Location Indicator (Single Source of Truth in Edit Profile) */}
            <button
              type="button"
              onClick={onOpenProfile}
              className="flex items-center space-x-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg bg-[#523D35]/70 hover:bg-[#523D35] text-[#EFEFE9] text-xs font-bold border border-[#BBA58F]/40 transition shadow-xs max-w-[180px] sm:max-w-[280px] cursor-pointer"
              title={`Profile Location: ${profile.village || globalLocation.village ? `${profile.village || globalLocation.village}, ` : ''}${profile.taluk || globalLocation.taluk ? `${profile.taluk || globalLocation.taluk}, ` : ''}${profile.district || globalLocation.district || ''}, ${profile.state || globalLocation.state || 'Karnataka'}. Click to manage in Edit Profile.`}
            >
              <MapPin className="w-3.5 h-3.5 text-[#BBA58F] shrink-0" />
              <span className="truncate hidden sm:inline text-[#EFEFE9]">
                {primaryLoc}
                {districtLoc && primaryLoc !== districtLoc ? `, ${districtLoc}` : ''}
                {`, ${stateLoc}`}
              </span>
              <span className="truncate sm:hidden text-[#EFEFE9]">
                {primaryLoc || localizeLocationName('Mysuru', locLang)}
              </span>
            </button>

            {/* Language Selector Dropdown / Modal */}
            <div className="relative" ref={langDropdownRef}>
              <button
                type="button"
                id="language-selector-button"
                aria-expanded={showLangMenu}
                aria-haspopup="listbox"
                onClick={() => {
                  setShowLangMenu(!showLangMenu);
                  setLangSearch('');
                }}
                className="flex items-center space-x-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg bg-[#523D35]/70 hover:bg-[#523D35] text-[#EFEFE9] text-xs font-semibold border border-[#BBA58F]/40 transition cursor-pointer shadow-xs"
              >
                <Globe className="w-3.5 h-3.5 text-[#BBA58F] shrink-0" />
                <div className="flex items-center text-left">
                  <span className="truncate max-w-[90px] sm:max-w-[120px] font-bold text-[#EFEFE9]">
                    {currentLanguage.native}
                  </span>
                </div>
                <ChevronDown className={`w-3 h-3 text-[#BBA58F] shrink-0 ml-0.5 transition-transform duration-150 ${showLangMenu ? 'rotate-180' : ''}`} />
              </button>

              {showLangMenu && (
                <div
                  id="language-dropdown-menu"
                  role="listbox"
                  className="absolute right-0 top-full mt-2 w-[320px] sm:w-[350px] max-w-[calc(100vw-24px)] bg-[#223030] border border-[#523D35] rounded-2xl shadow-2xl py-2 z-50 animate-in fade-in slide-in-from-top-2 max-h-[380px] flex flex-col text-[#EFEFE9]"
                >
                  <div className="px-3.5 py-2 border-b border-[#523D35] shrink-0">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold text-[#EFEFE9] flex items-center gap-1.5">
                        <Globe className="w-3.5 h-3.5 text-[#BBA58F]" />
                        <span><DualText textKey="header.selectLanguage" fallback="Select Language" className="text-[#EFEFE9] font-bold" /></span>
                      </span>
                      <span className="text-[10px] text-[#223030] font-bold bg-[#BBA58F] px-2 py-0.5 rounded-full">
                        {ALL_INDIAN_LANGUAGES.length} Languages
                      </span>
                    </div>
                    <div className="relative">
                      <Search className="w-3.5 h-3.5 text-[#959D90] absolute left-2.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        value={langSearch}
                        onChange={(e) => setLangSearch(e.target.value)}
                        placeholder="Search language / भाषा खोजें..."
                        className="w-full bg-[#523D35]/50 text-[#EFEFE9] text-xs pl-8 pr-7 py-1.5 rounded-xl border border-[#959D90]/50 focus:border-[#BBA58F] outline-none placeholder-[#959D90]"
                        autoFocus
                      />
                      {langSearch && (
                        <button
                          type="button"
                          onClick={() => setLangSearch('')}
                          className="absolute right-2 top-1/2 -translate-y-1/2 text-[#959D90] hover:text-[#EFEFE9] p-0.5 cursor-pointer"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="overflow-y-auto max-h-[220px] sm:max-h-[240px] divide-y divide-[#523D35]/40 p-1.5 scrollbar-thin">
                    {filteredLanguages.map((lang) => {
                      const isSelected = currentLanguage.code === lang.code;
                      return (
                        <button
                          key={lang.code}
                          type="button"
                          role="option"
                          aria-selected={isSelected}
                          onClick={() => {
                            setLanguage(lang.code);
                            setShowLangMenu(false);
                            if (currentUser?.id && hasRealFirebase) {
                              firestoreService.updateDoc('users', currentUser.id, {
                                preferredLanguage: lang.code,
                                language: lang.code,
                                updatedAt: serverTimestamp()
                              }).catch((e: any) => console.warn('Language preference Firestore sync notice', e));
                            }
                          }}
                          className={`w-full text-left px-3 py-2 rounded-xl text-xs flex items-center justify-between transition cursor-pointer ${
                            isSelected
                              ? 'bg-[#523D35] text-[#EFEFE9] font-bold border border-[#BBA58F]/50 shadow-xs'
                              : 'text-[#E8D9CD] hover:bg-[#523D35]/60 hover:text-[#EFEFE9]'
                          }`}
                        >
                          <div className="flex items-center gap-2 min-w-0 pr-2">
                            <div className="flex flex-col min-w-0">
                              <span className={`text-xs truncate ${isSelected ? 'text-[#EFEFE9] font-bold' : 'text-[#E8D9CD]'}`}>
                                {lang.name} — {lang.native}
                              </span>
                              {lang.region && (
                                <span className="text-[10px] text-[#BBA58F] truncate">
                                  {lang.region} • {lang.script}
                                </span>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center gap-1.5 shrink-0">
                            {isSelected && (
                              <Check className="w-4 h-4 text-[#BBA58F]" />
                            )}
                          </div>
                        </button>
                      );
                    })}
                    {filteredLanguages.length === 0 && (
                      <div className="text-center py-6 text-xs text-[#E8D9CD]">
                        No matching language found
                      </div>
                    )}
                  </div>

                  <div className="px-3.5 py-2 border-t border-[#523D35] text-[10px] text-[#E8D9CD] bg-[#223030] rounded-b-2xl shrink-0 font-medium">
                    {currentLanguage.native}
                  </div>
                </div>
              )}
            </div>

            {/* Pregnancy Week Pill */}
            <div className="hidden lg:flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-[#523D35]/50 border border-[#523D35] text-xs">
              <Heart className="w-3.5 h-3.5 text-[#BBA58F] fill-[#BBA58F]/20" />
              <div className="flex flex-col">
                <span className="text-[#EFEFE9] font-semibold text-xs leading-tight flex items-center gap-1">
                  <DualText textKey="common.week" fallback="Week" className="text-[#EFEFE9] font-semibold" /> {profile.weeksPregnant}
                </span>
                <span className="text-[#E8D9CD] text-[10px] leading-none flex items-center gap-1">
                  <DualText textKey="common.trimester" fallback="Trimester" className="text-[#E8D9CD]" /> {trimesterNumber}
                </span>
              </div>
            </div>

            {/* User Profile / Auth Button */}
            {currentUser ? (
              <button
                type="button"
                onClick={onOpenProfile}
                className="flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-[#523D35] hover:bg-[#523D35]/80 text-[#EFEFE9] text-xs font-semibold border border-[#BBA58F]/40 transition cursor-pointer shadow-xs"
                title="View & Edit Mother's Clinical Profile"
              >
                <div className="w-6 h-6 rounded-full bg-[#BBA58F] flex items-center justify-center text-[#223030] text-xs font-bold">
                  {(profile.name || currentUser.name || 'M').charAt(0).toUpperCase()}
                </div>
                <span className="hidden sm:inline text-[#EFEFE9]">
                  {(profile.name || currentUser.name || 'Mother').split(' ')[0]}
                </span>
              </button>
            ) : (
              <button
                type="button"
                onClick={onOpenAuth}
                className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-[#BBA58F] hover:bg-[#E8D9CD] text-[#223030] text-xs font-bold transition cursor-pointer shadow-xs"
                title="Sign In or Register"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>{t('auth.signIn', 'Sign In')}</span>
              </button>
            )}

            {/* Clearly visible SOS Emergency Button at TOP-RIGHT CORNER with subtle breathing pulse */}
            <button
              type="button"
              id="header-top-right-sos-button"
              onClick={() => {
                if (onOpenSos) {
                  onOpenSos();
                } else {
                  setIsSosModalOpen(true);
                }
              }}
              className="flex items-center space-x-1.5 px-2.5 sm:px-3.5 py-1.5 rounded-lg bg-red-600 hover:bg-red-700 active:bg-red-800 text-white text-xs font-black transition-all cursor-pointer border border-red-500 shrink-0 animate-sos-breathe"
              title="Emergency / SOS (112 & 108)"
              aria-label="Open Emergency SOS Panel"
            >
              <span className="relative flex h-2 w-2 mr-0.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
              </span>
              <Phone className="w-3.5 h-3.5 fill-current" />
              <span className="tracking-wide">SOS</span>
            </button>

            {/* Logout / Reset Icon Button */}
            <button
              type="button"
              onClick={() => setShowConfirmReset(true)}
              className="p-2 rounded-lg bg-[#523D35]/60 hover:bg-[#523D35] text-[#E8D9CD] hover:text-[#EFEFE9] border border-[#523D35] transition cursor-pointer"
              title={currentUser ? "Account & Reset Options" : "Reset Sample Data"}
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Confirmation Modal for Logout / Reset */}
      {showConfirmReset && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#223030] border border-[#523D35] rounded-2xl p-6 max-w-sm w-full shadow-2xl text-left text-[#EFEFE9]">
            <h3 className="text-base font-bold text-[#EFEFE9] mb-2">
              {currentUser ? `User Session: ${currentUser.name}` : 'Reset Application State?'}
            </h3>
            <p className="text-xs text-[#E8D9CD] mb-5 leading-relaxed">
              {currentUser
                ? 'You can log out of your session, or reset sample data back to standard ICMR defaults.'
                : 'This will restore all default ICMR nutrition targets, meal plans, clinical records, and weight logs back to factory defaults.'}
            </p>
            <div className="flex items-center justify-end space-x-2">
              <button
                type="button"
                onClick={() => setShowConfirmReset(false)}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold text-[#E8D9CD] hover:bg-[#523D35] transition cursor-pointer"
              >
                {t('action.cancel', 'Cancel')}
              </button>
              {currentUser && onLogout && (
                <button
                  type="button"
                  onClick={() => {
                    onLogout();
                    setShowConfirmReset(false);
                  }}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-rose-900/80 hover:bg-rose-800 text-white border border-rose-700 shadow transition cursor-pointer"
                >
                  {t('auth.logout', 'Log Out')}
                </button>
              )}
              <button
                type="button"
                onClick={() => {
                  onResetData();
                  setShowConfirmReset(false);
                }}
                className="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-[#523D35] hover:bg-[#523D35]/80 text-[#EFEFE9] border border-[#BBA58F]/40 shadow transition cursor-pointer"
              >
                {t('common.resetData', 'Reset Data')}
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

