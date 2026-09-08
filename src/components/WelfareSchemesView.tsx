import React, { useState } from 'react';
import { WelfareScheme, GlobalLocationState } from '../types';
import { DualText, useLanguage } from '../services/language_service';
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
  const activeState = globalLocation?.state || 'Karnataka';
  const activeCity = globalLocation?.city || 'Bengaluru';

  const [selectedScheme, setSelectedScheme] = useState<WelfareScheme | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>('All');

  const categories = ['All', 'Central Government', 'State Government'];

  // Prioritize schemes matching current state
  const sortedSchemes = [...schemes].sort((a, b) => {
    const aMatches = a.title.toLowerCase().includes(activeState.toLowerCase()) || a.eligibility.toLowerCase().includes(activeState.toLowerCase());
    const bMatches = b.title.toLowerCase().includes(activeState.toLowerCase()) || b.eligibility.toLowerCase().includes(activeState.toLowerCase());
    if (aMatches && !bMatches) return -1;
    if (!aMatches && bMatches) return 1;
    return 0;
  });

  const filteredSchemes = sortedSchemes.filter(
    (s) => activeCategory === 'All' || s.category === activeCategory
  );

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-300">
      {/* Header Banner */}
      <div className="bg-[#E8D9CD] rounded-3xl p-6 sm:p-8 border border-[#959D90] shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-[#523D35] text-[#E8D9CD] border border-[#BBA58F]/30 text-xs font-bold uppercase tracking-wider">
                <Award className="w-3.5 h-3.5 text-[#BBA58F]" />
                <span>Ministry of Women &amp; Child Development (MoWCD) &amp; NHM</span>
              </div>
              <div className="inline-flex items-center space-x-1 px-3 py-1 rounded-full bg-[#223030] text-[#EFEFE9] text-xs font-semibold">
                <MapPin className="w-3 h-3 text-[#BBA58F]" />
                <span>State: {activeState} ({activeCity})</span>
              </div>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#223030] tracking-tight flex items-center gap-2">
              <span className="text-2xl">📋</span>
              <DualText textKey="nav.welfareSchemes" fallback="Indian Maternal Government Welfare Schemes" className="text-2xl sm:text-3xl font-extrabold text-[#223030]" />
            </h1>
            <p className="text-sm text-[#523D35] mt-1 max-w-2xl">
              Official central and state financial compensation schemes, nutrition kits, and institutional delivery cash incentives tailored for expecting mothers in {activeState} and across India.
            </p>
          </div>

          <div className="flex items-center space-x-2">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setActiveCategory(cat)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                  activeCategory === cat
                    ? 'bg-[#223030] text-[#EFEFE9] shadow-xs'
                    : 'bg-[#EFEFE9] hover:bg-[#BBA58F]/30 text-[#523D35] border border-[#959D90]/40'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 3-Column Structured Scheme Cards */}
      <div className="space-y-6">
        {filteredSchemes.map((scheme) => (
          <div
            key={scheme.id}
            className="bg-[#E8D9CD] rounded-3xl border border-[#959D90] shadow-xs overflow-hidden hover:border-[#523D35] transition-all duration-200"
          >
            {/* Scheme Top Bar */}
            <div className="bg-[#223030] text-[#EFEFE9] px-6 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-[#959D90]/30">
              <div className="space-y-0.5">
                <div className="flex items-center space-x-2">
                  <span className="px-2 py-0.5 rounded-md bg-[#523D35] text-[#BBA58F] border border-[#BBA58F]/30 text-[10px] font-bold uppercase tracking-wider">
                    {scheme.category}
                  </span>
                  <h3 className="text-base sm:text-lg font-extrabold tracking-tight text-[#EFEFE9]">
                    {scheme.title}
                  </h3>
                </div>
                <p className="text-xs text-[#BBA58F]">{scheme.shortName}</p>
              </div>

              <a
                href={scheme.portalUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl bg-[#523D35] hover:bg-[#BBA58F] hover:text-[#223030] text-[#E8D9CD] text-xs font-bold transition shadow-xs self-start sm:self-center cursor-pointer"
              >
                <FileText className="w-3.5 h-3.5" />
                <span>📄 Apply on Official Portal ↗</span>
              </a>
            </div>

            {/* Scheme Description Note */}
            <div className="px-6 py-3.5 bg-[#EFEFE9] border-b border-[#959D90]/30 text-xs text-[#523D35] font-medium leading-relaxed">
              <strong className="text-[#223030] font-bold">Objective: </strong>
              {scheme.description}
            </div>

            {/* 3 Columns Section */}
            <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6 divide-y md:divide-y-0 md:divide-x divide-[#959D90]/30">
              {/* Column 1: Eligibility */}
              <div className="space-y-2.5 pt-4 md:pt-0 md:pr-4">
                <div className="flex items-center space-x-2 text-xs font-extrabold uppercase tracking-wider text-[#223030]">
                  <Shield className="w-4 h-4 text-[#523D35]" />
                  <span>COLUMN 1: ELIGIBILITY</span>
                </div>
                <p className="text-xs text-[#523D35] leading-relaxed font-medium">
                  {scheme.eligibility}
                </p>
              </div>

              {/* Column 2: Welfare Cash / Benefits */}
              <div className="space-y-2.5 pt-4 md:pt-0 md:px-4">
                <div className="flex items-center space-x-2 text-xs font-extrabold uppercase tracking-wider text-[#223030]">
                  <CreditCard className="w-4 h-4 text-[#523D35]" />
                  <span>COLUMN 2: WELFARE CASH / BENEFITS</span>
                </div>
                <p className="text-xs text-[#523D35] leading-relaxed font-medium">
                  {scheme.benefits}
                </p>
                {scheme.cashAmountHighlight && (
                  <div className="inline-block px-3 py-1.5 rounded-xl bg-[#523D35] text-[#E8D9CD] border border-[#BBA58F]/30 text-xs font-extrabold shadow-2xs">
                    💰 {scheme.cashAmountHighlight}
                  </div>
                )}
              </div>

              {/* Column 3: Documents Needed */}
              <div className="space-y-2.5 pt-4 md:pt-0 md:pl-4">
                <div className="flex items-center space-x-2 text-xs font-extrabold uppercase tracking-wider text-[#223030]">
                  <FileText className="w-4 h-4 text-[#523D35]" />
                  <span>COLUMN 3: DOCUMENTS NEEDED</span>
                </div>
                <ul className="space-y-1.5">
                  {scheme.documentsNeeded.map((doc, idx) => (
                    <li key={idx} className="flex items-start space-x-2 text-xs text-[#523D35]">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#223030] mt-0.5 shrink-0" />
                      <span>{doc}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ASHA & Anganwadi Support Card */}
      <div className="bg-[#223030] border border-[#959D90] rounded-3xl p-6 sm:p-8 text-[#EFEFE9] shadow-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
        <div className="space-y-2 max-w-xl">
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-[#523D35] text-[#E8D9CD] text-xs font-bold border border-[#BBA58F]/30">
            <Sparkles className="w-3.5 h-3.5 text-[#BBA58F]" />
            <span>Community ASHA &amp; Anganwadi Assistance</span>
          </div>
          <h3 className="text-lg sm:text-xl font-extrabold text-[#EFEFE9]">
            Need assistance filling out your MCP Registration or PMMVY Form?
          </h3>
          <p className="text-xs text-[#BBA58F] leading-relaxed">
            Your local Anganwadi Worker (AWW) and Accredited Social Health Activist (ASHA) are designated to help you register for zero processing fees. Contact your nearest Anganwadi Center or Primary Health Centre (PHC).
          </p>
          <div className="text-[11px] text-[#959D90] italic">
            Local ASHA/ANM direct contact not provided. Service availability may vary by state.
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 shrink-0">
          <a
            href="tel:108"
            className="px-4 py-2.5 rounded-xl bg-[#523D35] hover:bg-[#BBA58F] hover:text-[#223030] text-[#E8D9CD] font-bold text-xs transition text-center cursor-pointer"
          >
            🚑 108 Ambulance
          </a>
          <a
            href="tel:102"
            className="px-4 py-2.5 rounded-xl bg-[#523D35] hover:bg-[#BBA58F] hover:text-[#223030] text-[#E8D9CD] font-bold text-xs transition text-center cursor-pointer"
            title="Service availability may vary by state"
          >
            🚐 102 Patient Transport
          </a>
        </div>
      </div>
    </div>
  );
};
