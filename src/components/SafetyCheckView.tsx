import React, { useState, useMemo } from 'react';
import { 
  Search, 
  ShieldCheck, 
  AlertTriangle, 
  XCircle, 
  Info, 
  CheckCircle2, 
  ExternalLink,
  HelpCircle,
  Sparkles
} from 'lucide-react';
import { VerifiedFoodImage } from './VerifiedFoodImage';
import { FOOD_DATABASE_ITEMS } from '../foods_db';

interface SafetyCheckViewProps {
  onSelectFoodItem?: (item: any) => void;
}

type SafetyFilter = 'ALL' | 'Safe' | 'Safe in Moderation' | 'Avoid';

export const SafetyCheckView: React.FC<SafetyCheckViewProps> = () => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedFilter, setSelectedFilter] = useState<SafetyFilter>('ALL');

  // Search and filter logic
  const filteredItems = useMemo(() => {
    return FOOD_DATABASE_ITEMS.filter((item) => {
      // Filter status
      if (selectedFilter !== 'ALL') {
        if (selectedFilter === 'Safe' && item.safetyLevel !== 'Safe') return false;
        if (selectedFilter === 'Safe in Moderation' && item.safetyLevel !== 'Safe in Moderation' && item.safetyLevel !== 'Consult Doctor') return false;
        if (selectedFilter === 'Avoid' && item.safetyLevel !== 'Avoid') return false;
      }

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const enName = (item.name?.en || '').toLowerCase();
        const category = (item.category || '').toLowerCase();
        const explanation = (item.explanation?.en || '').toLowerCase();
        const risks = (item.risks?.en || '').toLowerCase();
        return enName.includes(q) || category.includes(q) || explanation.includes(q) || risks.includes(q);
      }

      return true;
    });
  }, [searchQuery, selectedFilter]);

  // Helper for safety status badges & borders
  const getSafetyConfig = (level: string) => {
    if (level === 'Safe') {
      return {
        label: 'SAFE',
        bgColor: 'bg-[#22C55E]/10',
        textColor: 'text-[#22C55E]',
        borderColor: 'border-[#22C55E]/30',
        badgeBg: 'bg-[#22C55E]',
        icon: CheckCircle2
      };
    } else if (level === 'Avoid') {
      return {
        label: 'AVOID',
        bgColor: 'bg-[#EF4444]/10',
        textColor: 'text-[#EF4444]',
        borderColor: 'border-[#EF4444]/30',
        badgeBg: 'bg-[#EF4444]',
        icon: XCircle
      };
    } else {
      return {
        label: 'MODERATE',
        bgColor: 'bg-[#F59E0B]/10',
        textColor: 'text-[#F59E0B]',
        borderColor: 'border-[#F59E0B]/30',
        badgeBg: 'bg-[#F59E0B]',
        icon: AlertTriangle
      };
    }
  };

  return (
    <div className="space-y-6 pb-12">
      
      {/* 1. Header & Search */}
      <section className="bg-[#E8D9CD] rounded-3xl p-6 sm:p-8 border border-[#959D90] shadow-xs space-y-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#223030] tracking-tight">
            Food Safety & Medical Guidance
          </h1>
          <p className="text-sm text-[#523D35] mt-1 max-w-2xl font-medium">
            Search Indian ingredients and traditional dishes to check pregnancy safety status, verified medical contraindications, and clinical cautions.
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="w-5 h-5 text-[#523D35] absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search food item (e.g. Raw Papaya, Pineapple, Jaggery, Tulsi, Fennel...)"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3.5 rounded-2xl border border-[#959D90] bg-[#EFEFE9] text-sm text-[#223030] placeholder-[#959D90] focus:outline-none focus:border-[#523D35] focus:ring-2 focus:ring-[#523D35]/20 transition-colors"
          />
        </div>

        {/* Status Filters */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-[#959D90]/30">
          <span className="text-xs font-bold text-[#523D35] uppercase tracking-wider mr-2">Filter Status:</span>
          
          <button
            onClick={() => setSelectedFilter('ALL')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              selectedFilter === 'ALL'
                ? 'bg-[#223030] text-[#EFEFE9] shadow-xs'
                : 'bg-[#EFEFE9] border border-[#959D90]/40 text-[#523D35] hover:text-[#223030]'
            }`}
          >
            All Foods ({FOOD_DATABASE_ITEMS.length})
          </button>

          <button
            onClick={() => setSelectedFilter('Safe')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              selectedFilter === 'Safe'
                ? 'bg-[#523D35] text-[#E8D9CD] shadow-xs'
                : 'bg-[#EFEFE9] border border-[#959D90]/40 text-[#523D35] hover:bg-[#523D35]/10'
            }`}
          >
            SAFE
          </button>

          <button
            onClick={() => setSelectedFilter('Safe in Moderation')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              selectedFilter === 'Safe in Moderation'
                ? 'bg-[#BBA58F] text-[#223030] shadow-xs font-black'
                : 'bg-[#EFEFE9] border border-[#959D90]/40 text-[#523D35] hover:bg-[#BBA58F]/20'
            }`}
          >
            MODERATE
          </button>

          <button
            onClick={() => setSelectedFilter('Avoid')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              selectedFilter === 'Avoid'
                ? 'bg-[#223030] text-[#E8D9CD] shadow-xs border border-[#959D90]'
                : 'bg-[#EFEFE9] border border-[#959D90]/40 text-[#523D35] hover:bg-[#223030]/10'
            }`}
          >
            AVOID
          </button>
        </div>
      </section>

      {/* 2. Food Safety List Results */}
      <section className="space-y-4">
        <div className="text-xs text-[#523D35] font-medium px-1">
          Showing <strong className="text-[#223030]">{filteredItems.length}</strong> items
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredItems.map((item) => {
            const config = getSafetyConfig(item.safetyLevel);
            const StatusIcon = config.icon;

            return (
              <div
                key={item.id}
                className="bg-[#E8D9CD] rounded-3xl border border-[#959D90] p-5 sm:p-6 shadow-xs space-y-4 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  {/* Top Status & Name */}
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <span className="text-[11px] font-semibold text-[#523D35] uppercase tracking-wider">
                        {item.category}
                      </span>
                      <h3 className="text-lg font-bold text-[#223030] mt-0.5">
                        {item.name?.en}
                      </h3>
                    </div>

                    <span className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider text-[#E8D9CD] bg-[#523D35] flex items-center gap-1 shadow-xs shrink-0 border border-[#BBA58F]/30`}>
                      <StatusIcon className="w-3.5 h-3.5 text-[#BBA58F]" />
                      <span>{config.label}</span>
                    </span>
                  </div>

                  {/* Clinical Reason & Explanation */}
                  <div className="p-3.5 rounded-2xl bg-[#EFEFE9] border border-[#959D90]/40 space-y-1.5">
                    <div className="text-xs font-bold text-[#523D35] flex items-center gap-1.5">
                      <Info className="w-3.5 h-3.5 shrink-0 text-[#523D35]" />
                      <span>Medical Reason & Clinical Caution</span>
                    </div>
                    <p className="text-xs text-[#223030] leading-relaxed font-medium">
                      {item.explanation?.en || item.risks?.en || 'Safe for maternal consumption in standard portions.'}
                    </p>
                  </div>

                  {/* Trimester & Serving Advice */}
                  <div className="grid grid-cols-2 gap-2 text-xs pt-1">
                    <div className="bg-[#EFEFE9] p-2.5 rounded-xl border border-[#959D90]/30">
                      <span className="text-[10px] text-[#523D35] block">Recommended Trimester</span>
                      <span className="font-bold text-[#223030] mt-0.5 block">{item.trimester || 'All Trimesters'}</span>
                    </div>
                    <div className="bg-[#EFEFE9] p-2.5 rounded-xl border border-[#959D90]/30">
                      <span className="text-[10px] text-[#523D35] block">Serving Quantity</span>
                      <span className="font-bold text-[#223030] mt-0.5 block">{item.recommendedQuantity || 'Standard Portion'}</span>
                    </div>
                  </div>
                </div>

                {/* Benefits / Alternatives */}
                {item.benefits?.en && (
                  <div className="pt-3 border-t border-[#959D90]/30 text-xs text-[#523D35]">
                    <span className="font-bold text-[#223030]">Health Benefit: </span>
                    <span>{item.benefits.en}</span>
                  </div>
                )}
                {item.alternatives && item.safetyLevel === 'Avoid' && (
                  <div className="pt-3 border-t border-[#959D90]/30 text-xs text-[#523D35]">
                    <span className="font-bold text-[#523D35]">Safe Alternative: </span>
                    <span>{item.alternatives}</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

    </div>
  );
};
