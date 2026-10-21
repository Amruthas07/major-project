import React from 'react';
import {
  LayoutDashboard,
  Camera,
  Apple,
  ChefHat,
  CalendarCheck,
  Award,
  Hospital,
  BotMessageSquare,
  ShoppingBag,
  FileBarChart2,
  BookOpen
} from 'lucide-react';
import { useLanguage, DualText } from '../services/language_service';

export type NavTabId =
  | 'dashboard'
  | 'food-database'
  | 'meal-planner'
  | 'food-scanner'
  | 'reports'
  | 'welfare-schemes'
  | 'health-facilities'
  | 'recipes'
  | 'ask-ai'
  | 'order-delivery'
  | 'clinical-report'
  | 'research-paper';

interface MainNavigationProps {
  activeTab: NavTabId;
  onSelectTab: (tab: NavTabId) => void;
}

export const MainNavigation: React.FC<MainNavigationProps> = ({ activeTab, onSelectTab }) => {
  const { isEnglish } = useLanguage();

  const tabs = [
    { id: 'dashboard' as NavTabId, textKey: 'nav.dashboard', label: 'Dashboard', icon: '🏠', LucideIcon: LayoutDashboard },
    { id: 'food-database' as NavTabId, textKey: 'nav.foodDatabase', label: 'Food Database', icon: '🥦', LucideIcon: Apple },
    { id: 'meal-planner' as NavTabId, textKey: 'nav.mealPlanner', label: 'Meal Planner', icon: '📅', LucideIcon: CalendarCheck },
    { id: 'food-scanner' as NavTabId, textKey: 'nav.foodScanner', label: 'Food Scanner', icon: '📷', LucideIcon: Camera },
    { id: 'reports' as NavTabId, textKey: 'nav.reports', label: 'Reports', icon: '📊', LucideIcon: FileBarChart2 },
    { id: 'welfare-schemes' as NavTabId, textKey: 'nav.welfareSchemes', label: 'Welfare Schemes', icon: '📋', LucideIcon: Award },
    { id: 'health-facilities' as NavTabId, textKey: 'nav.nearby', label: 'Nearby', icon: '🏥', LucideIcon: Hospital }
  ];

  return (
    <nav className="bg-[#EFEFE9] border-b border-[#959D90]/40 sticky top-20 z-30 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center space-x-1.5 sm:space-x-2 overflow-x-auto no-scrollbar py-2.5 touch-pan-x scroll-smooth">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => onSelectTab(tab.id)}
                className={`relative flex items-center space-x-2 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all duration-200 cursor-pointer shrink-0 ${
                  isActive
                    ? 'text-[#EFEFE9] bg-[#223030] shadow-md border border-[#523D35]'
                    : 'text-[#223030] bg-white/70 hover:bg-[#E8D9CD] hover:text-[#223030] border border-[#959D90]/30'
                }`}
              >
                <span className="text-base shrink-0">{tab.icon}</span>
                <DualText
                  textKey={tab.textKey}
                  fallback={tab.label}
                  className={`text-xs sm:text-sm leading-normal ${isActive ? 'text-[#EFEFE9] font-black' : 'text-[#223030] font-bold'}`}
                  miniClassName="text-[10px] text-[#BBA58F] font-normal leading-none"
                />

                {isActive && (
                  <span className="absolute bottom-0.5 left-3 right-3 h-0.5 bg-[#BBA58F] rounded-full animate-in fade-in" />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
};

