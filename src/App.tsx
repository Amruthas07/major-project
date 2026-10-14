import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { MainNavigation, NavTabId } from './components/MainNavigation';
import { DashboardView } from './components/DashboardView';
import { FoodScannerView } from './components/FoodScannerView';
import { FoodDatabaseView } from './components/FoodDatabaseView';
import { RecipesView } from './components/RecipesView';
import { MealPlannerView } from './components/MealPlannerView';
import { WelfareSchemesView } from './components/WelfareSchemesView';
import { HealthFacilitiesView } from './components/HealthFacilitiesView';
import { AskAiView } from './components/AskAiView';
import { OrderDeliveryView } from './components/OrderDeliveryView';
import { ClinicalReportView } from './components/ClinicalReportView';
import { UserReportsView } from './components/UserReportsView';
import { ResearchPaperView } from './components/ResearchPaperView';
import { UserProfileModal } from './components/UserProfileModal';
import { AddToPlanModal } from './components/AddToPlanModal';
import { AuthModal } from './components/AuthModal';
import { PregnancyProfileSetupModal } from './components/PregnancyProfileSetupModal';
import { SmartReminderModal } from './components/SmartReminderModal';
import { EmergencySosModal } from './components/EmergencySosModal';
import { WaterReminderAlertNotification } from './components/WaterReminderAlertNotification';
import { AiAssistantChatbot } from './components/AiAssistantChatbot';
import { useAppContext } from './context/AppContext';
import { voiceService } from './services/voice_service';

import {
  INITIAL_WELFARE_SCHEMES,
  INITIAL_HEALTH_FACILITIES,
  INITIAL_ORDER_PRODUCTS
} from './data/mockData';

export default function App() {
  const {
    activeTab,
    setActiveTab,
    globalLocation,
    setGlobalLocation,
    userProfile,
    setUserProfile,
    loggedMeals,
    addLoggedMeal,
    deleteLoggedMeal,
    weightRecords,
    addWeightRecord,
    clinicalReports,
    addClinicalReport,
    medications,
    addMedication,
    toggleMedicationTaken,
    resetAllData,
    currentUser,
    isAuthChecking,
    isAuthModalOpen,
    setIsAuthModalOpen,
    isProfileSetupModalOpen,
    setIsProfileSetupModalOpen,
    handleAuthSuccess,
    saveInitialProfileSetup,
    logout,
    isSmartReminderModalOpen,
    setIsSmartReminderModalOpen,
    isSosModalOpen,
    setIsSosModalOpen
  } = useAppContext();

  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  // Automatically cancel all active voice speech whenever user switches navigation tabs or closes dialogs
  useEffect(() => {
    voiceService.stopSpeaking();
  }, [activeTab, isProfileModalOpen, isAuthModalOpen, isProfileSetupModalOpen, isSmartReminderModalOpen, isSosModalOpen]);

  // Initial Auth Verification Loading Screen (Requirement 5: Show a loading screen while checking authentication status)
  if (isAuthChecking) {
    return (
      <div className="min-h-screen bg-[#223030] flex flex-col items-center justify-center p-4 text-[#EFEFE9]">
        <div className="w-16 h-16 rounded-3xl bg-[#523D35] border-2 border-[#BBA58F]/40 flex items-center justify-center font-black text-2xl text-[#EFEFE9] mb-4 shadow-xl animate-pulse">
          P
        </div>
        <h2 className="text-xl font-bold tracking-tight text-[#EFEFE9]">
          PregNutri <span className="text-[#BBA58F]">AI</span>
        </h2>
        <p className="text-xs text-[#E8D9CD] mt-2 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
          <span>Verifying secure maternal session...</span>
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#EFEFE9] text-[#223030] antialiased font-sans">
      {/* 1. Dark Earthy Clinical Header with Location Selector, Language Selector & Week Status */}
      <Header
        profile={userProfile}
        globalLocation={globalLocation}
        onUpdateLocation={setGlobalLocation}
        onOpenProfile={() => setIsProfileModalOpen(true)}
        onResetData={resetAllData}
        currentUser={currentUser}
        onOpenAuth={() => setIsAuthModalOpen(true)}
        onLogout={logout}
        onOpenSos={() => setIsSosModalOpen(true)}
      />

      {/* 2. Top Horizontal 8-Tab Navigation Bar */}
      <MainNavigation activeTab={activeTab} onSelectTab={(tab) => setActiveTab(tab)} />

      {/* 3. Primary Module Layout Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {activeTab === 'dashboard' && (
          <DashboardView
            onNavigateTab={(tab) => setActiveTab(tab)}
            onOpenProfile={() => setIsProfileModalOpen(true)}
          />
        )}

        {activeTab === 'food-scanner' && (
          <FoodScannerView
            profile={userProfile}
            loggedMeals={loggedMeals}
            globalLocation={globalLocation}
            onSaveMeal={addLoggedMeal}
            onDeleteMeal={deleteLoggedMeal}
            onNavigateTab={(tab) => setActiveTab(tab as NavTabId)}
          />
        )}

        {(activeTab === 'food-database' || activeTab === 'recipes') && (
          <FoodDatabaseView />
        )}

        {activeTab === 'meal-planner' && (
          <MealPlannerView />
        )}

        {activeTab === 'welfare-schemes' && (
          <WelfareSchemesView
            schemes={INITIAL_WELFARE_SCHEMES}
            globalLocation={globalLocation}
          />
        )}

        {activeTab === 'health-facilities' && (
          <HealthFacilitiesView
            facilities={INITIAL_HEALTH_FACILITIES}
            globalLocation={globalLocation}
            onUpdateLocation={setGlobalLocation}
          />
        )}

        {activeTab === 'ask-ai' && (
          <AskAiView
            profile={userProfile}
            globalLocation={globalLocation}
          />
        )}

        {activeTab === 'order-delivery' && (
          <OrderDeliveryView
            products={INITIAL_ORDER_PRODUCTS}
            globalLocation={globalLocation}
          />
        )}

        {activeTab === 'reports' && (
          <UserReportsView
            onNavigateTab={(tab) => setActiveTab(tab)}
          />
        )}

        {activeTab === 'clinical-report' && (
          <ClinicalReportView
            profile={userProfile}
            weightRecords={weightRecords}
            clinicalReports={clinicalReports}
            medications={medications}
            onAddWeightRecord={addWeightRecord}
            onAddClinicalReport={addClinicalReport}
            onToggleMedicationTaken={toggleMedicationTaken}
            onAddMedication={addMedication}
          />
        )}

        {activeTab === 'research-paper' && (
          <ResearchPaperView />
        )}
      </main>

      {/* 4. Professional Clinical Footer in Deep Charcoal Green */}
      <footer className="border-t border-[#523D35]/30 bg-[#223030] py-8 text-center text-xs text-[#E8D9CD]">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-2">
            <span className="font-extrabold text-[#EFEFE9] tracking-tight text-sm">PregNutri AI</span>
            <span className="text-[#BBA58F]">•</span>
            <span className="text-[#BBA58F] font-semibold">
              Clinical Maternal Nutrition &amp; Smart Logs Companion
            </span>
          </div>
          <p className="text-[11px] text-[#E8D9CD]/80 max-w-xl text-center sm:text-right leading-relaxed">
            Medical nutrition standards aligned with ICMR-NIN 2020 Maternal Guidelines &amp; NHM Digital Health Stack. Always consult your attending obstetrician for personalized clinical care.
          </p>
        </div>
      </footer>

      {/* 5. User Profile Editing Modal */}
      <UserProfileModal
        profile={userProfile}
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        onSave={setUserProfile}
      />

      {/* 6. Global Add to Plan Modal */}
      <AddToPlanModal />

      {/* 7. Authentication Modal (Login / Sign Up / Forgot Password) */}
      <AuthModal
        isOpen={isAuthModalOpen || !currentUser}
        onClose={() => currentUser && setIsAuthModalOpen(false)}
        onAuthSuccess={handleAuthSuccess}
        canDismiss={!!currentUser}
      />

      {/* 8. Initial Pregnancy Profile Setup Modal */}
      <PregnancyProfileSetupModal
        isOpen={isProfileSetupModalOpen}
        onClose={() => setIsProfileSetupModalOpen(false)}
        onSaveProfile={saveInitialProfileSetup}
        initialName={currentUser?.name || userProfile.name}
        initialEmailOrPhone={currentUser?.emailOrPhone || userProfile.mobileNumber || userProfile.email}
        initialProfile={userProfile}
      />

      {/* 9. Smart Maternal Reminders Modal (Water, Meals, Doctor Visits) */}
      <SmartReminderModal
        isOpen={isSmartReminderModalOpen}
        onClose={() => setIsSmartReminderModalOpen(false)}
      />

      {/* 10. Emergency SOS Modal */}
      <EmergencySosModal
        isOpen={isSosModalOpen}
        onClose={() => setIsSosModalOpen(false)}
        onOpenProfile={() => setIsProfileModalOpen(true)}
        onNavigateFacilities={() => setActiveTab('health-facilities')}
      />

      {/* 11. Scheduled Water Intake Alert Notification Banner */}
      <WaterReminderAlertNotification />

      {/* 12. Floating AI Assistant Chatbot Panel & Persistent Launcher */}
      <AiAssistantChatbot />
    </div>
  );
}
