import React from 'react';
import { Home, Compass, BarChart2, HeartHandshake, User, ShieldAlert } from 'lucide-react';

export type MainTab = 'home' | 'explore' | 'analytics' | 'care' | 'profile';

interface NavigationProps {
  activeTab: MainTab;
  setActiveTab: (tab: MainTab) => void;
  userName: string;
  pregnancyWeek: number;
}

export const Navigation: React.FC<NavigationProps> = ({
  activeTab,
  setActiveTab,
  userName,
  pregnancyWeek
}) => {
  const navItems: { id: MainTab; label: string; icon: React.FC<{ className?: string }> }[] = [
    { id: 'home', label: 'Dashboard', icon: Home },
    { id: 'explore', label: 'Food & Recipes', icon: Compass },
    { id: 'analytics', label: 'Analytics & Weight', icon: BarChart2 },
    { id: 'care', label: 'Care & Schemes', icon: HeartHandshake }
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 transition-all shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
        
        {/* Brand Logo & Name */}
        <div 
          onClick={() => setActiveTab('home')}
          className="flex items-center gap-3 cursor-pointer select-none group"
        >
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-pink-600 to-rose-500 flex items-center justify-center text-white shadow-md shadow-pink-200 group-hover:scale-105 transition-transform">
            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </svg>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-xl font-black text-slate-800 tracking-tight">PregNutri</span>
              <span className="text-xl font-black text-pink-600">Care</span>
            </div>
            <p className="text-[11px] text-slate-500 font-medium hidden sm:block">
              Maternal Nutrition & Clinical Care
            </p>
          </div>
        </div>

        {/* 4 Main Desktop Navigation Tabs */}
        <nav className="hidden md:flex items-center gap-1.5 lg:gap-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                id={`desktop-nav-${item.id}`}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer ${
                  isActive
                    ? 'bg-gradient-to-r from-pink-600 to-rose-600 text-white shadow-sm shadow-pink-200'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-500'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Right Action: Mother's Profile Pill */}
        <div 
          id="profile-nav-btn"
          onClick={() => setActiveTab('profile')}
          className="flex items-center gap-3 pl-2 cursor-pointer hover:opacity-90 transition-opacity"
        >
          <div className="hidden sm:flex flex-col text-right">
            <span className="text-xs font-bold text-slate-800 truncate max-w-[120px]">{userName}</span>
            <span className="text-[11px] font-bold text-pink-600">Week {pregnancyWeek}</span>
          </div>
          <div className={`w-9 h-9 rounded-full border flex items-center justify-center font-bold text-sm transition-all ${
            activeTab === 'profile'
              ? 'bg-pink-600 border-pink-700 text-white shadow-xs'
              : 'bg-pink-50 border-pink-200 text-pink-700 hover:bg-pink-100'
          }`}>
            {userName ? userName.charAt(0).toUpperCase() : 'M'}
          </div>
        </div>

      </div>
    </header>
  );
};

export const MobileBottomNavigation: React.FC<NavigationProps> = ({
  activeTab,
  setActiveTab
}) => {
  const navItems: { id: MainTab; label: string; icon: React.FC<{ className?: string }> }[] = [
    { id: 'home', label: 'Dashboard', icon: Home },
    { id: 'explore', label: 'Foods', icon: Compass },
    { id: 'analytics', label: 'Analytics', icon: BarChart2 },
    { id: 'care', label: 'Care & SOS', icon: HeartHandshake },
    { id: 'profile', label: 'Profile', icon: User }
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200/80 px-2 py-1.5 shadow-lg">
      <div className="grid grid-cols-5 gap-1 max-w-md mx-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              id={`mobile-nav-${item.id}`}
              onClick={() => setActiveTab(item.id)}
              className={`flex flex-col items-center justify-center py-1.5 px-0.5 rounded-xl transition-all cursor-pointer ${
                isActive ? 'text-pink-600' : 'text-slate-500'
              }`}
            >
              <div className={`p-1 rounded-lg transition-colors ${isActive ? 'bg-pink-50' : ''}`}>
                <Icon className={`w-4 h-4 ${isActive ? 'text-pink-600' : 'text-slate-500'}`} />
              </div>
              <span className={`text-[9px] tracking-tight mt-0.5 ${isActive ? 'font-bold text-pink-600' : 'font-medium text-slate-500'}`}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export const TopNavigation = Navigation;

