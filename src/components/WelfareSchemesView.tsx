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
    'Maharashtra': { kn: 'ಮಹಾರಾಷ್ಟ್ರ', hi: 'महाराष्ट्र', ta: 'மகாராஷ்டிரா', te: 'మహారాష్ట్ర', ml: 'മഹാരാഷ്ട്ര' },
    'Kerala': { kn: 'ಕೇರಳ', hi: 'केरल', ta: 'கேரளா', te: 'కేరళ', ml: 'കേരളം' },
    'Andhra Pradesh': { kn: 'ಆಂಧ್ರಪ್ರದೇಶ', hi: 'आंध्र प्रदेश', ta: 'ஆந்திரப் பிரதேசம்', te: 'ఆంధ్రప్రదేశ్', ml: 'ആന്ധ്രാപ്രദേശ്' },
    'Telangana': { kn: 'ತೆಲಂಗಾಣ', hi: 'तेलंगाना', ta: 'தெலுங்கானா', te: 'తెలంగాణ', ml: 'തെലങ്കാന' },
    'Gujarat': { kn: 'ಗುಜರಾತ್', hi: 'गुजरात', ta: 'குஜராத்', te: 'గుజరాత్', ml: 'ഗുജറാത്ത്' },
    'Uttar Pradesh': { kn: 'ಉತ್ತರ ಪ್ರದೇಶ', hi: 'उत्तर प्रदेश', ta: 'உத்தரப் பிரதேசம்', te: 'ఉత్తరప్రదేశ్', ml: 'உത്തർപ്രദേശ്' },
    'West Bengal': { kn: 'ಪಶ್ಚಿಮ ಬಂಗಾಳ', hi: 'पश्चिम बंगाल', ta: 'மேற்கு வங்காளம்', te: 'పశ్చిమ బెంగాల్', ml: 'പശ്ചിമ ബംഗാൾ' }
  };
  const localizedState = STATE_NAMES_LOCALIZED[activeState]?.[activeLang] || activeState;

  const [activeCategory, setActiveCategory] = useState<'all-applicable' | 'central' | 'my-state'>('all-applicable');

  const categories = [
    { id: 'all-applicable' as const, label: t('schemes.allApplicable', 'All Applicable Schemes') },
    { id: 'central' as const, label: t('schemes.centralSchemes', '🇮🇳 Central Schemes') },
    { id: 'my-state' as const, label: `📍 ${localizedState} ${t('schemes.stateSchemes', 'Schemes')}` }
  ];

  const isForCurrentState = (s: WelfareScheme) => {
    if (s.category !== 'State Government') return false;
    const stateLower = activeState.toLowerCase();
    const sState = (s.state || '').toLowerCase();
    if (sState && sState.includes(stateLower)) return true;
    const titleLower = s.title.toLowerCase();
    const eligLower = s.eligibility.toLowerCase();
    const descLower = (s.description || '').toLowerCase();
    const shortLower = (s.shortName || '').toLowerCase();
    return (
      titleLower.includes(stateLower) ||
      eligLower.includes(stateLower) ||
      descLower.includes(stateLower) ||
      shortLower.includes(stateLower)
    );
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
                <span>{t('common.state', 'State')}: {localizedState} ({activeCity})</span>
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

      {/* Simplified, Practical Welfare Scheme Cards */}
      <div className="space-y-5">
        {filteredSchemes.map((rawScheme) => {
          const scheme = getLocalizedWelfareScheme(rawScheme, activeLang);
          const isCentral = rawScheme.category === 'Central Government';
          const badgeText = isCentral
            ? t('schemes.centralGovtBadge', '🇮🇳 Central Government Scheme')
            : `📍 ${localizedState} ${t('schemes.stateGovtBadge', 'State Government Scheme')}`;

          return (
            <div
              key={scheme.id}
              className="bg-[#EFEFE9] rounded-3xl border border-[#959D90]/50 shadow-xs overflow-hidden transition-all duration-200"
            >
              {/* Scheme Header: Name, Badge & Official Link */}
              <div className="bg-[#223030] text-[#EFEFE9] px-6 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-[#959D90]/30">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="px-2.5 py-0.5 rounded-full bg-[#523D35] text-[#E8D9CD] text-[11px] font-bold">
                      {badgeText}
                    </span>
                    {scheme.cashAmountHighlight && (
                      <span className="px-2.5 py-0.5 rounded-full bg-[#BBA58F] text-[#223030] text-[11px] font-extrabold">
                        💰 {scheme.cashAmountHighlight}
                      </span>
                    )}
                  </div>
                  <h3 className="text-base sm:text-lg font-extrabold tracking-tight text-[#EFEFE9]">
                    {scheme.title}
                  </h3>
                </div>

                {scheme.portalUrl && (
                  <a
                    href={scheme.portalUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#523D35] hover:bg-[#BBA58F] hover:text-[#223030] text-[#E8D9CD] text-xs font-bold transition shadow-xs self-start sm:self-center cursor-pointer shrink-0"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>{t('schemes.applyPortal', 'Official Portal ↗')}</span>
                  </a>
                )}
              </div>

              {/* One Short Objective */}
              <div className="px-6 py-3 bg-[#E8D9CD]/50 border-b border-[#959D90]/30 text-xs text-[#523D35] font-medium leading-relaxed">
                <strong className="text-[#223030] font-bold">{t('schemes.objective', 'Objective')}: </strong>
                {scheme.description}
              </div>

              {/* 3-Part Practical Details Grid */}
              <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-5 text-xs">
                {/* 1. Eligibility Summary */}
                <div className="bg-[#E8D9CD] p-4 rounded-2xl border border-[#959D90]/30 space-y-1.5">
                  <span className="font-bold text-[#223030] block uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                    <Shield className="w-3.5 h-3.5 text-[#523D35]" />
                    <span>{t('schemes.eligibility', 'Eligibility Summary')}</span>
                  </span>
                  <p className="text-[#523D35] leading-relaxed">
                    {scheme.eligibility}
                  </p>
                </div>

                {/* 2. Main Benefit */}
                <div className="bg-[#E8D9CD] p-4 rounded-2xl border border-[#959D90]/30 space-y-1.5">
                  <span className="font-bold text-[#223030] block uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                    <CreditCard className="w-3.5 h-3.5 text-[#523D35]" />
                    <span>{t('schemes.benefits', 'Main Benefit')}</span>
                  </span>
                  <p className="text-[#523D35] leading-relaxed">
                    {scheme.benefits}
                  </p>
                </div>

                {/* 3. Required Documents */}
                <div className="bg-[#E8D9CD] p-4 rounded-2xl border border-[#959D90]/30 space-y-1.5">
                  <span className="font-bold text-[#223030] block uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5 text-[#523D35]" />
                    <span>{t('schemes.documents', 'Required Documents')}</span>
                  </span>
                  <ul className="space-y-1 text-[#523D35]">
                    {scheme.documentsNeeded.map((doc, idx) => (
                      <li key={idx} className="flex items-start gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#223030] shrink-0 mt-0.5" />
                        <span>{doc}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
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
