import React, { useState } from 'react';
import { WelfareScheme, GlobalLocationState } from '../types';
import { useLanguage } from '../services/language_service';
import { getLocalizedWelfareScheme } from '../services/welfare_schemes_localization';
import { useAppContext } from '../context/AppContext';
import {
  Award,
  ExternalLink,
  CheckCircle2,
  FileText,
  CreditCard,
  Building,
  Shield,
  HelpCircle,
  Sparkles,
  Info,
  MapPin
} from 'lucide-react';

import { SchemeCard } from './SchemeCard';
import { isMatchingState } from '../utils/state_food_filter';

interface WelfareSchemesViewProps {
  schemes: WelfareScheme[];
  globalLocation?: GlobalLocationState;
}

export const WelfareSchemesView: React.FC<WelfareSchemesViewProps> = ({ schemes, globalLocation }) => {
  const { userProfile } = useAppContext();
  const { selectedLanguage, currentLanguageCode, t } = useLanguage();
  const activeLang = selectedLanguage || currentLanguageCode || 'en';
  const activeState = userProfile?.state || globalLocation?.state || 'Karnataka';
  const activeCity = userProfile?.district || globalLocation?.city || globalLocation?.district || 'Bengaluru';

  const STATE_NAMES_LOCALIZED: Record<string, Record<string, string>> = {
    'Karnataka': { kn: 'ಕರ್ನಾಟಕ', hi: 'कर्नाटक', ta: 'கர்நாடகா', te: 'కర్ణాటక', ml: 'കർണാടക' },
    'Tamil Nadu': { kn: 'ತಮಿಳುನಾಡು', hi: 'तमिलनाडु', ta: 'தமிழ்நாடு', te: 'తమిళనాడు', ml: 'തമിഴ്നാട്' },
    'Maharashtra': { kn: 'ಮಹಾರಾಷ್ಟ್ರ', hi: 'महाराष्ट्र', ta: 'மகாராஷ்டிரா', te: 'ಮಹಾರಾష్ట్ర', ml: 'മഹാരാഷ്ട്ര' },
    'Kerala': { kn: 'ಕೇರಳ', hi: 'केरल', ta: 'கேரளா', te: 'కేరళ', ml: 'കേരളം' },
    'Andhra Pradesh': { kn: 'ಆಂಧ್ರಪ್ರದೇಶ', hi: 'आंध्र प्रदेश', ta: 'ஆந்திரப் பிரதேசம்', te: 'ఆంధ్రప్రదేశ్', ml: 'ആന്ധ്രാപ്രദേശ്' },
    'Telangana': { kn: 'ತೆಲಂಗಾಣ', hi: 'तेलंगाना', ta: 'தெலுங்கானா', te: 'తెలంగాణ', ml: 'തെലങ്കാന' },
    'Gujarat': { kn: 'ಗುಜರಾತ್', hi: 'गुजरात', ta: 'குஜராத்', te: 'గుజరాత్', ml: 'ഗുജറാത്ത്' },
    'Uttar Pradesh': { kn: 'ಉತ್ತರ ಪ್ರದೇಶ', hi: 'उत्तर प्रदेश', ta: 'உத்தரப் பிரதேசம்', te: 'ఉత్తరప్రదేశ్', ml: 'ഉത്തർപ്രദേശ്' },
    'West Bengal': { kn: 'ಪಶ್ಚಿಮ ಬಂಗಾಳ', hi: 'पश्चिम बंगाल', ta: 'மேற்கு வங்காளம்', te: 'పశ్చిమ బెంగాల్', ml: 'പശ്ചിമ ബംഗാൾ' }
  };
  const CITY_NAMES_LOCALIZED: Record<string, Record<string, string>> = {
    'Mysuru': { kn: 'ಮೈಸೂರು', hi: 'मैसूरु', ta: 'மைசூரு', te: 'మైసూరు', ml: 'മൈസൂരു' },
    'Mysore': { kn: 'ಮೈಸೂರು', hi: 'मैसूर', ta: 'மைசூர்', te: 'మైసూర్', ml: 'മൈസൂർ' },
    'Bengaluru': { kn: 'ಬೆಂಗಳೂರು', hi: 'बेंगलुरु', ta: 'பெங்களூரு', te: 'బెంగళూరు', ml: 'ബെംഗളൂരു' },
    'Bangalore': { kn: 'ಬೆಂಗಳೂರು', hi: 'बेंगलुरु', ta: 'பெங்களூரு', te: 'బెంగళూరు', ml: 'ബെംഗളൂരു' },
    'Hullahalli': { kn: 'ಹುಲ್ಲಹಳ್ಳಿ', hi: 'हुल्लाहल्ली', ta: 'ஹுல்லஹள்ளி', te: 'హుల్లహళ్ళి', ml: 'ഹുല്ലഹള്ളി' },
    'Nanjangud': { kn: 'ನಂಜನಗೂಡು', hi: 'नंजनगुड़', ta: 'நஞ்சன்கூடு', te: 'నంజనగూడు', ml: 'നഞ്ചൻഗുഡ്' },
    'Hunsur': { kn: 'ಹುಣಸೂರು', hi: 'हुणसूर', ta: 'ஹுன்சூர்', te: 'హున్సూర్', ml: 'ഹുൻസൂർ' },
    'Mandya': { kn: 'ಮಂಡ್ಯ', hi: 'मंड्या', ta: 'மண்டியா', te: 'మండ్య', ml: 'മാണ്ഡ്യ' },
    'Hassan': { kn: 'ಹಾಸನ', hi: 'हासन', ta: 'ஹாசன்', te: 'హాసన్', ml: 'ഹാസൻ' },
    'Chennai': { kn: 'ಚೆನ್ನೈ', hi: 'चेन्नई', ta: 'சென்னை', te: 'చెన్నై', ml: 'ചെന്നൈ' },
    'Hyderabad': { kn: 'ಹೈದರಾಬಾದ್', hi: 'हैदराबाद', ta: 'ஹைதராபாத்', te: 'హైదరాబాద్', ml: 'ഹൈദരാബാദ്' },
    'Mumbai': { kn: 'ಮುಂಬೈ', hi: 'मुंबई', ta: 'மும்பை', te: 'ముంబై', ml: 'മുംബൈ' },
    'Thiruvananthapuram': { kn: 'ತಿರುವನಂತಪುರಂ', hi: 'तिरुवनंतपुरम', ta: 'திருவனந்தபுரம்', te: 'తిరువనంతపురం', ml: 'തിരുവനന്തപുരം' },
    'Kochi': { kn: 'ಕೊಚ್ಚಿ', hi: 'कोच्चि', ta: 'கொச்சி', te: 'కొచ్చి', ml: 'കൊച്ചി' }
  };
  const localizedState = STATE_NAMES_LOCALIZED[activeState]?.[activeLang] || activeState;
  const localizedCity = CITY_NAMES_LOCALIZED[activeCity]?.[activeLang] || activeCity;

  const [activeCategory, setActiveCategory] = useState<'all-applicable' | 'central' | 'my-state'>('all-applicable');

  const categories = [
    { id: 'all-applicable' as const, label: t('schemes.allApplicable', 'All Applicable Schemes') },
    { id: 'central' as const, label: t('schemes.centralSchemes', '🇮🇳 Central Schemes') },
    { id: 'my-state' as const, label: `📍 ${localizedState} ${t('schemes.stateSchemes', 'ಯೋಜನೆಗಳು')}` }
  ];

  // Strict state isolation check: only match when scheme.state matches user's active state
  const isForCurrentState = (s: WelfareScheme) => {
    if (s.category !== 'State Government') return false;
    return isMatchingState(s.state, activeState);
  };

  const filteredSchemes = schemes.filter((s) => {
    if (activeCategory === 'central') {
      return s.category === 'Central Government';
    }
    if (activeCategory === 'my-state') {
      return isForCurrentState(s);
    }
    // 'all-applicable': Central government schemes + Current state's schemes ONLY (strictly excludes other states)
    return s.category === 'Central Government' || isForCurrentState(s);
  });

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-300">
      {/* Header Banner */}
      <div className="bg-[#E8D9CD] rounded-3xl p-6 sm:p-8 border border-[#959D90] shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-[#523D35] text-[#E8D9CD] border border-[#BBA58F]/30 text-xs font-bold uppercase tracking-wider">
                <Award className="w-3.5 h-3.5 text-[#BBA58F]" />
                <span>{t('schemes.badgeMinistry', 'Ministry of Women & Child Development (MoWCD) & NHM')}</span>
              </div>
              <div className="inline-flex items-center space-x-1 px-3 py-1 rounded-full bg-[#223030] text-[#EFEFE9] text-xs font-semibold">
                <MapPin className="w-3 h-3 text-[#BBA58F]" />
                <span>{t('common.state', 'State')}: {localizedState} ({localizedCity})</span>
              </div>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#223030] tracking-tight flex items-center gap-2">
              <span className="text-2xl">📋</span>
              <span>{t('schemes.title', 'Indian Maternal Government Welfare Schemes')}</span>
            </h1>
            <p className="text-sm text-[#523D35] mt-1 max-w-2xl">
              {t('schemes.subtitle', `Official central and state financial compensation schemes, nutrition kits, and institutional delivery cash incentives tailored for expecting mothers in ${activeState} and across India.`)}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {categories.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setActiveCategory(cat.id)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                  activeCategory === cat.id
                    ? 'bg-[#223030] text-[#EFEFE9] shadow-xs'
                    : 'bg-[#EFEFE9] hover:bg-[#BBA58F]/30 text-[#523D35] border border-[#959D90]/40'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Welfare Scheme Cards with Verified Image Attachments */}
      <div className="space-y-6">
        {filteredSchemes.map((rawScheme) => {
          const scheme = getLocalizedWelfareScheme(rawScheme, activeLang);
          return (
            <SchemeCard
              key={scheme.id}
              scheme={scheme}
            />
          );
        })}
      </div>

      {/* ASHA & Anganwadi Support Card */}
      <div className="bg-[#223030] border border-[#959D90] rounded-3xl p-6 sm:p-8 text-[#EFEFE9] shadow-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
        <div className="space-y-2 max-w-xl">
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-[#523D35] text-[#E8D9CD] text-xs font-bold border border-[#BBA58F]/30">
            <Sparkles className="w-3.5 h-3.5 text-[#BBA58F]" />
            <span>{t('schemes.ashaBadge', 'Community ASHA & Anganwadi Assistance')}</span>
          </div>
          <h3 className="text-lg sm:text-xl font-extrabold text-[#EFEFE9]">
            {t('schemes.ashaHeading', 'Need assistance filling out your MCP Registration or PMMVY Form?')}
          </h3>
          <p className="text-xs text-[#BBA58F] leading-relaxed">
            {t('schemes.ashaDesc', 'Your local Anganwadi Worker (AWW) and Accredited Social Health Activist (ASHA) are designated to help you register for zero processing fees. Contact your nearest Anganwadi Center or Primary Health Centre (PHC).')}
          </p>
          <div className="text-[11px] text-[#959D90] italic">
            {t('schemes.ashaNotice', 'Local ASHA/ANM direct contact not provided. Service availability may vary by state.')}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 shrink-0">
          <a
            href="tel:108"
            className="px-4 py-2.5 rounded-xl bg-[#523D35] hover:bg-[#BBA58F] hover:text-[#223030] text-[#E8D9CD] font-bold text-xs transition text-center cursor-pointer"
          >
            🚑 {t('schemes.ambulance108', '108 Ambulance')}
          </a>
          <a
            href="tel:102"
            className="px-4 py-2.5 rounded-xl bg-[#523D35] hover:bg-[#BBA58F] hover:text-[#223030] text-[#E8D9CD] font-bold text-xs transition text-center cursor-pointer"
            title="Service availability may vary by state"
          >
            🚐 {t('schemes.transport102', '102 Patient Transport')}
          </a>
        </div>
      </div>
    </div>
  );
};
