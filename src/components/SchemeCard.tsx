import React from 'react';
import { WelfareScheme } from '../types';
import { useLanguage } from '../services/language_service';

export interface SchemeCardProps {
  scheme: WelfareScheme | {
    id?: string;
    scheme_id?: string;
    title: string;
    state?: string;
    badge_label?: string;
    badgeText?: string;
    badge_icon?: string;
    benefit_tag?: string;
    cashAssistance?: string;
    cashAmountHighlight?: string;
    benefit_summary?: string;
    official_portal_url?: string;
    officialPortalUrl?: string;
    portalUrl?: string;
    small_thumbnail_url?: string;
    thumbnail_url?: string;
    imageUrl?: string;
    image_url?: string;
    objective?: string;
    description?: string;
    eligibility_summary?: string;
    eligibility?: string;
    main_benefit?: string;
    mainBenefit?: string;
    benefits?: string;
    required_documents?: string[];
    requiredDocuments?: string[];
    documentsNeeded?: string[];
    category?: string;
    level?: string;
  };
}

export const getBenefitsIllustration = (scheme: any): string => {
  const idLower = (scheme.scheme_id || scheme.id || '').toLowerCase();
  const titleLower = (scheme.title || '').toLowerCase();

  // Cash / Financial Assistance (Gruha Lakshmi, PMMVY, JSY)
  if (
    idLower.includes('gruha') ||
    idLower.includes('lakshmi') ||
    idLower.includes('pmmvy') ||
    idLower.includes('jsy') ||
    titleLower.includes('lakshmi') ||
    titleLower.includes('vandana') ||
    titleLower.includes('dbt') ||
    titleLower.includes('cash')
  ) {
    return '/assets/schemes/benefits_cash.png';
  }

  // Nutrition / Meal Schemes (Mathru Poorna, Poshan)
  if (
    idLower.includes('mathru') ||
    idLower.includes('poorna') ||
    idLower.includes('poshan') ||
    idLower.includes('meal') ||
    titleLower.includes('poorna') ||
    titleLower.includes('nutrition') ||
    titleLower.includes('thali')
  ) {
    return '/assets/icons/hot_meal.png';
  }

  // Health / Medical / Safe Delivery (JSSK, PMSMA, Prasuti Araike)
  return '/assets/schemes/benefits_health.png';
};

export const SchemeCard: React.FC<SchemeCardProps> = ({ scheme }) => {
  const { t } = useLanguage();
  const isCentral = (scheme as any).category === 'Central Government' || (scheme as any).level === 'Central';
  
  const badgeLabel = (scheme as any).badge_label || (scheme as any).badgeText || (
    isCentral
      ? t('schemes.centralStateBadge', 'CENTRAL / STATE HEALTH SCHEME')
      : `${((scheme as any).state || 'KARNATAKA').toUpperCase()} ${t('schemes.stateSchemeBadge', 'STATE SCHEME')}`
  );

  const benefitTag = 
    (scheme as any).benefit_tag || 
    (scheme as any).cashAmountHighlight || 
    (scheme as any).cashAssistance || 
    (scheme as any).benefit_summary ||
    (scheme as any).mainBenefit ||
    'Maternal Health Benefit';

  const title = (scheme as any).title || 'Government Welfare Scheme';
  const state = (scheme as any).state || 'Karnataka';
  const officialPortalUrl = (scheme as any).official_portal_url || (scheme as any).officialPortalUrl || (scheme as any).portalUrl || '#';
  const benefitsIllustration = getBenefitsIllustration(scheme);
  const objective = (scheme as any).objective || (scheme as any).description || 'Ensure free and accessible maternal and newborn healthcare for every family.';
  const eligibilitySummary = (scheme as any).eligibility_summary || (scheme as any).eligibility || 'All pregnant women and sick newborns receiving care at government health facilities across India and Karnataka.';
  const mainBenefit = (scheme as any).main_benefit || (scheme as any).mainBenefit || (scheme as any).benefits || 'Free delivery and C-section, medicines, diagnostics, blood, diet, and transport support as per scheme guidelines.';
  const requiredDocuments: string[] = 
    (scheme as any).required_documents || 
    (scheme as any).requiredDocuments || 
    (scheme as any).documentsNeeded || 
    [
      'MCP (Mother and Child Protection) Card',
      'Any valid government photo ID, if available.'
    ];

  return (
    <div className="rounded-2xl bg-[#FDFBF7] border border-[#EBE3D8] p-5 sm:p-6 max-w-5xl shadow-sm font-sans my-4">
      
      {/* Top Meta Header Bar */}
      <div className="flex flex-wrap justify-between items-center gap-2 mb-4">
        <div className="flex flex-wrap items-center gap-2">
          <span className="bg-[#423329] text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
            📍 {badgeLabel}
          </span>
          <span className="bg-[#F2EAE1] text-[#3B2D24] text-xs font-semibold px-3 py-1 rounded-full border border-[#E2D6CB]">
            ✨ {benefitTag}
          </span>
          <span className="bg-[#2C4A3E] text-white text-xs font-semibold px-3 py-1 rounded-full">
            {state}
          </span>
        </div>
        
        {/* Direct Working Portal Link */}
        <a 
          href={officialPortalUrl} 
          target="_blank" 
          rel="noopener noreferrer"
          className="bg-[#423329] hover:bg-[#2C211A] text-white text-xs font-semibold px-4 py-2 rounded-full flex items-center gap-1.5 transition shadow-xs"
        >
          {t('schemes.officialPortal', 'Official Portal')} ↗
        </a>
      </div>

      {/* Scheme Title */}
      <div className="mb-4">
        <h2 className="text-lg md:text-xl font-extrabold text-[#2C211A] uppercase tracking-wide leading-snug">
          {title}
        </h2>
      </div>

      {/* Objective Banner with Reference-Style Maternity & Healthcare Illustrations */}
      <div className="bg-[#FAF3E8] p-4 sm:p-5 rounded-2xl border border-[#EDE3D5] mb-5 shadow-xs flex items-center justify-between gap-3 sm:gap-4 overflow-hidden relative">
        {/* Left Maternity Illustration */}
        <img 
          src="/assets/schemes/objective_mother.png" 
          alt="Pregnant mother" 
          className="w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 object-contain shrink-0 drop-shadow-xs"
          loading="lazy"
        />

        {/* Center Objective Text */}
        <div className="flex-1 px-1 sm:px-2">
          <h3 className="text-sm sm:text-base md:text-lg font-black text-[#2C211A] tracking-tight mb-1">
            {t('schemes.objective', 'Objective')}:
          </h3>
          <p className="text-xs sm:text-sm text-[#423329] leading-relaxed font-medium">
            {objective}
          </p>
        </div>

        {/* Right Mother & Newborn Healthcare Illustration */}
        <img 
          src="/assets/schemes/objective_hospital.png" 
          alt="Mother, baby and clinic" 
          className="w-20 sm:w-28 md:w-40 h-auto object-contain shrink-0 drop-shadow-xs hidden sm:block"
          loading="lazy"
        />
      </div>

      {/* 3 Structured Cards Grid with Side-by-Side Reference Visuals */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        {/* 1. ELIGIBILITY CARD (Soft Pink) */}
        <div className="bg-[#FDF1EE] p-4 sm:p-5 rounded-2xl border border-[#F7DAD5] shadow-xs flex flex-col justify-between">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#E2665B]/15 text-[#923527] border border-[#E2665B]/25 w-fit mb-3">
              <span className="w-5 h-5 rounded-full bg-[#E2665B] text-white flex items-center justify-center text-[10px] font-bold shadow-xs">
                👥
              </span>
              <span className="text-[11px] font-black uppercase tracking-wider">
                {t('schemes.eligibility', 'ELIGIBILITY')}
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between gap-2.5 mt-1">
            <p className="text-xs text-[#5C322B] leading-relaxed font-medium flex-1">
              {eligibilitySummary}
            </p>
            <img 
              src="/assets/schemes/eligibility_mother.png" 
              alt="Eligibility pregnant mother" 
              className="w-14 sm:w-16 md:w-20 h-auto object-contain shrink-0 drop-shadow-xs"
              loading="lazy"
            />
          </div>
        </div>

        {/* 2. KEY BENEFITS CARD (Soft Mint Green) */}
        <div className="bg-[#F1F8F3] p-4 sm:p-5 rounded-2xl border border-[#D7EBDB] shadow-xs flex flex-col justify-between">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#3E8E56]/15 text-[#215E34] border border-[#3E8E56]/25 w-fit mb-3">
              <span className="w-5 h-5 rounded-full bg-[#3E8E56] text-white flex items-center justify-center text-[10px] font-bold shadow-xs">
                💰
              </span>
              <span className="text-[11px] font-black uppercase tracking-wider">
                {t('schemes.keyBenefits', 'KEY BENEFITS')}
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between gap-2.5 mt-1">
            <p className="text-xs text-[#2B4A31] leading-relaxed font-medium flex-1">
              {mainBenefit}
            </p>
            <img 
              src={benefitsIllustration} 
              alt="Key benefits" 
              className="w-14 sm:w-16 md:w-20 h-auto object-contain shrink-0 drop-shadow-xs"
              loading="lazy"
            />
          </div>
        </div>

        {/* 3. REQUIRED DOCUMENTS CARD (Soft Ice Blue) */}
        <div className="bg-[#EFF5FC] p-4 sm:p-5 rounded-2xl border border-[#D5E5F6] shadow-xs flex flex-col justify-between">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#3483DC]/15 text-[#1C4E86] border border-[#3483DC]/25 w-fit mb-3">
              <span className="w-5 h-5 rounded-full bg-[#3483DC] text-white flex items-center justify-center text-[10px] font-bold shadow-xs">
                📄
              </span>
              <span className="text-[11px] font-black uppercase tracking-wider">
                {t('schemes.requiredDocuments', 'REQUIRED DOCUMENTS')}
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between gap-2 mt-1">
            <ul className="text-xs text-[#2A4461] space-y-2 flex-1">
              {requiredDocuments.map((doc, idx) => (
                <li key={idx} className="flex items-start gap-1.5">
                  <span className="w-4 h-4 rounded-full bg-[#3483DC] text-white text-[10px] flex items-center justify-center shrink-0 mt-0.5 font-bold shadow-2xs">
                    ✓
                  </span>
                  <span className="font-medium">{doc}</span>
                </li>
              ))}
            </ul>
            <img 
              src="/assets/schemes/documents_mcp_aadhaar.png" 
              alt="MCP Card and Aadhaar" 
              className="w-16 sm:w-20 md:w-24 h-auto object-contain shrink-0 drop-shadow-xs"
              loading="lazy"
            />
          </div>
        </div>

      </div>
    </div>
  );
};

export default SchemeCard;
