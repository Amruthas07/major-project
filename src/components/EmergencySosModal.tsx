import React, { useState, useEffect } from 'react';
import {
  Phone,
  Ambulance,
  Building2,
  MapPin,
  X,
  ShieldAlert
} from 'lucide-react';
import { useAppContext } from '../context/AppContext';

interface EmergencySosModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenProfile?: () => void;
  onNavigateFacilities?: () => void;
}

export const EmergencySosModal: React.FC<EmergencySosModalProps> = ({
  isOpen,
  onClose,
  onOpenProfile,
  onNavigateFacilities
}) => {
  const { globalLocation } = useAppContext();

  // Call confirmation state to avoid accidental calls without confirmation
  const [confirmCall, setConfirmCall] = useState<{
    number: string;
    title: string;
    subtitle: string;
  } | null>(null);

  const userCity =
    globalLocation?.village || globalLocation?.townOrVillage || globalLocation?.city || 'Hullahalli';
  const userDistrict = globalLocation?.district || 'Mysuru';
  const userState = globalLocation?.state || 'Karnataka';

  useEffect(() => {
    if (!isOpen) {
      setConfirmCall(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleInitiateCall = (number: string, title: string, subtitle: string) => {
    // Show confirmation prompt first
    const sanitizedNumber = number.replace(/[^0-9+]/g, '');
    setConfirmCall({
      number: sanitizedNumber,
      title,
      subtitle
    });
  };

  const handleExecuteConfirmedCall = () => {
    if (!confirmCall) return;
    const dialUrl = `tel:${confirmCall.number}`;
    setConfirmCall(null);
    window.location.href = dialUrl;
  };

  return (
    <div
      id="emergency-sos-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        id="emergency-sos-modal-panel"
        className="w-full max-w-lg bg-[#EFEFE9] rounded-3xl border-2 border-red-600 shadow-2xl overflow-hidden flex flex-col max-h-[92vh] animate-in zoom-in-95 duration-200"
        role="dialog"
        aria-modal="true"
        aria-labelledby="sos-modal-title"
      >
        {/* Header */}
        <div className="bg-red-600 px-5 py-4 text-white flex items-center justify-between shadow-xs">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
              <ShieldAlert className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 id="sos-modal-title" className="text-base sm:text-lg font-black tracking-wide flex items-center gap-1.5">
                <span>SOS / Emergency</span>
              </h2>
              <p className="text-[11px] text-red-100 font-medium">
                Verified Emergency Helplines (24x7)
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-white/20 text-white transition cursor-pointer"
            aria-label="Close Emergency SOS Dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* User Location Bar - strictly connected to user profile / dashboard location */}
        <div className="bg-[#E8D9CD] px-5 py-2.5 border-b border-[#959D90]/40 flex items-center justify-between text-xs text-[#223030]">
          <div className="flex items-center space-x-1.5 truncate">
            <MapPin className="w-3.5 h-3.5 text-[#523D35] shrink-0" />
            <span className="font-semibold text-[#523D35]">Current Location:</span>
            <span className="font-bold truncate">
              {userCity}{userDistrict ? `, ${userDistrict}` : ''}, {userState}
            </span>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-3.5 text-[#223030]">
          {/* Primary Official Emergency Number: 112 */}
          <div className="p-4 rounded-2xl bg-white border-2 border-red-500/80 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded-md bg-red-600 text-white font-black text-xs">
                  Primary
                </span>
                <span className="text-base sm:text-lg font-black text-red-600">
                  Emergency Number: 112
                </span>
              </div>
              <div className="text-xs font-semibold text-[#523D35]">
                India Emergency Response Support System
              </div>
              <div className="text-[11px] text-[#959D90]">
                Single unified emergency line (Police, Medical, Fire) 24x7
              </div>
            </div>
            <button
              type="button"
              id="call-112-button"
              onClick={() =>
                handleInitiateCall(
                  '112',
                  'Emergency Number: 112',
                  'India Emergency Response Support System'
                )
              }
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 active:bg-red-800 text-white text-xs font-black flex items-center justify-center gap-1.5 shadow-xs transition cursor-pointer shrink-0"
            >
              <Phone className="w-3.5 h-3.5 fill-current" />
              <span>Call 112</span>
            </button>
          </div>

          {/* Official Ambulance: 108 */}
          <div className="p-4 rounded-2xl bg-white border border-[#959D90]/50 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <Ambulance className="w-4 h-4 text-red-600" />
                <span className="text-sm sm:text-base font-black text-[#223030]">
                  Ambulance: 108
                </span>
              </div>
              <div className="text-xs font-semibold text-[#523D35]">
                Emergency Medical Services / Ambulance (24x7 Free)
              </div>
              <div className="text-[11px] text-[#959D90]">
                Government medical emergency &amp; life support ambulance
              </div>
            </div>
            <button
              type="button"
              id="call-108-button"
              onClick={() =>
                handleInitiateCall(
                  '108',
                  'Ambulance: 108',
                  'Emergency Medical Services / Ambulance'
                )
              }
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-[#223030] hover:bg-[#523D35] text-white text-xs font-black flex items-center justify-center gap-1.5 shadow-xs transition cursor-pointer shrink-0"
            >
              <Phone className="w-3.5 h-3.5 fill-current" />
              <span>Call 108</span>
            </button>
          </div>

          {/* Official Patient Transport: 102 */}
          <div className="p-4 rounded-2xl bg-white border border-[#959D90]/50 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <Building2 className="w-4 h-4 text-[#523D35]" />
                <span className="text-sm sm:text-base font-black text-[#223030]">
                  Patient Transport: 102
                </span>
              </div>
              <div className="text-xs font-semibold text-[#523D35]">
                Free Transport Service for Pregnant Women &amp; Neonates (JSSK)
              </div>
              <div className="text-[11px] text-[#959D90]">
                Janani Shishu Suraksha Karyakram drop-back and hospital transport
              </div>
            </div>
            <button
              type="button"
              id="call-102-button"
              onClick={() =>
                handleInitiateCall(
                  '102',
                  'Patient Transport: 102',
                  'Free Transport Service for Pregnant Women & Neonates (JSSK)'
                )
              }
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-[#523D35] hover:bg-[#223030] text-[#E8D9CD] text-xs font-black flex items-center justify-center gap-1.5 shadow-xs transition cursor-pointer shrink-0"
            >
              <Phone className="w-3.5 h-3.5 fill-current" />
              <span>Call 102</span>
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-[#E8D9CD] px-5 py-3 border-t border-[#959D90]/30 space-y-2">
          <div className="text-[10px] text-[#523D35] bg-[#EFEFE9] p-2 rounded-xl border border-[#959D90]/40 leading-relaxed">
            <strong>Medical Notice:</strong> This application provides nutritional guidance, not medical diagnosis. Always consult your doctor or primary healthcare center (PHC) for medical decisions. In an emergency, call 112 or 108 immediately.
          </div>
          <div className="flex items-center justify-between">
            <span className="text-[11px] text-[#523D35] font-medium">
              Calls use your phone's dialer upon confirmation.
            </span>
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-1.5 rounded-xl bg-[#223030] hover:bg-[#523D35] text-[#EFEFE9] text-xs font-bold transition cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>

        {/* Confirmation Sub-Modal before placing any call */}
        {confirmCall && (
          <div
            id="call-confirmation-dialog"
            className="absolute inset-0 z-60 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150"
          >
            <div className="w-full max-w-sm bg-white rounded-2xl p-5 border-2 border-red-600 shadow-2xl space-y-4 animate-in zoom-in-95 duration-150 text-center">
              <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto">
                <Phone className="w-6 h-6 fill-current" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-black text-[#223030]">Confirm Call</h3>
                <p className="text-sm font-black text-red-600">
                  {confirmCall.title} ({confirmCall.number})
                </p>
                <p className="text-xs text-[#523D35]">{confirmCall.subtitle}</p>
                <p className="text-[11px] text-[#959D90] pt-1">
                  This will launch the phone dialer on your device. Would you like to proceed?
                </p>
              </div>
              <div className="grid grid-cols-2 gap-2 pt-2">
                <button
                  type="button"
                  id="cancel-call-button"
                  onClick={() => setConfirmCall(null)}
                  className="py-2.5 px-3 rounded-xl border border-[#959D90] text-[#223030] text-xs font-bold hover:bg-[#EFEFE9] transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  id="confirm-dial-button"
                  onClick={handleExecuteConfirmedCall}
                  className="py-2.5 px-3 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-black shadow-xs transition cursor-pointer"
                >
                  Dial Now
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
