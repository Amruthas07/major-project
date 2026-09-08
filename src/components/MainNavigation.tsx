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
  FileBarChart2
} from 'lucide-react';
import { useLanguage, DualText } from '../services/language_service';

export type NavTabId =
  | 'dashboard'
  | 'food-scanner'
  | 'food-database'
  | 'recipes'
  | 'meal-planner'
  | 'welfare-schemes'
  | 'health-facilities'
  | 'ask-ai'
  | 'order-delivery'
  | 'clinical-report';

interface MainNavigationProps {
  activeTab: NavTabId;
  onSelectTab: (tab: NavTabId) => void;
}

export const MainNavigation: React.FC<MainNavigationProps> = ({ activeTab, onSelectTab }) => {
  const { isEnglish } = useLanguage();

  const tabs = [
    { id: 'dashboard' as NavTabId, textKey: 'nav.dashboard', label: 'Dashboard', icon: '🧘', LucideIcon: LayoutDashboard },
    { id: 'food-database' as NavTabId, textKey: 'nav.foodDatabase', label: 'Food Database', icon: '🥦', LucideIcon: Apple },
    { id: 'recipes' as NavTabId, textKey: 'nav.recipes', label: 'Recipes', icon: '🍲', LucideIcon: ChefHat },
    { id: 'meal-planner' as NavTabId, textKey: 'nav.mealPlanner', label: 'Meal Planner', icon: '🗓️', LucideIcon: CalendarCheck },
    { id: 'food-scanner' as NavTabId, textKey: 'nav.foodScanner', label: 'Food Scanner', icon: '📸', LucideIcon: Camera },
    { id: 'welfare-schemes' as NavTabId, textKey: 'nav.welfareSchemes', label: 'Welfare Schemes', icon: '📋', LucideIcon: Award },
    { id: 'health-facilities' as NavTabId, textKey: 'nav.healthFacilities', label: 'Nearby Health Facilities', icon: '🏥', LucideIcon: Hospital },
    { id: 'ask-ai' as NavTabId, textKey: 'nav.askAi', label: 'Ask PregNutri AI', icon: '💬', LucideIcon: BotMessageSquare },
    { id: 'order-delivery' as NavTabId, textKey: 'nav.orderDelivery', label: 'Order & Delivery', icon: '🛒', LucideIcon: ShoppingBag },
    { id: 'clinical-report' as NavTabId, textKey: 'nav.clinicalReport', label: 'Clinical Report', icon: '📊', LucideIcon: FileBarChart2 }
  ];

  return (
    <nav className="bg-[#EFEFE9] border-b border-[#959D90]/40 sticky top-20 z-30 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center space-x-1 sm:space-x-2 overflow-x-auto no-scrollbar py-2.5">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => onSelectTab(tab.id)}
                className={`relative flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all duration-200 cursor-pointer ${
                  isActive
                    ? 'text-[#223030] bg-[#E8D9CD] font-bold shadow-xs border border-[#BBA58F]/50'
                    : 'text-[#523D35] hover:text-[#223030] hover:bg-[#E8D9CD]/50'
                }`}
              >
                <span className="text-base shrink-0">{tab.icon}</span>
                <DualText
                  textKey={tab.textKey}
                  fallback={tab.label}
                  className={`text-xs sm:text-sm leading-tight ${isActive ? 'text-[#223030] font-bold' : 'text-[#523D35] font-medium'}`}
                  miniClassName="text-[10px] text-[#959D90] font-normal leading-none"
                />

                {isActive && (
                  <span className="absolute bottom-0 left-3 right-3 h-0.5 bg-[#BBA58F] rounded-full animate-in fade-in" />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
};

