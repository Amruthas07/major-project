import React, { useState, useEffect, useRef } from 'react';
import {
  Bot,
  User,
  Send,
  Sparkles,
  X,
  Volume2,
  VolumeX,
  Trash2,
  AlertTriangle,
  ChevronDown,
  Minimize2,
  Maximize2,
  Heart,
  ShieldAlert,
  MessageSquare,
  Flame,
  Check
} from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { useLanguage } from '../services/language_service';
import { voiceService } from '../services/voice_service';
import { Maternal3DArt } from './Maternal3DArt';

interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
}

export const AiAssistantChatbot: React.FC = () => {
  const { userProfile, globalLocation, currentUser, setIsSosModalOpen } = useAppContext();
  const { currentLanguageCode, isEnglish, t } = useLanguage();

  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isVoiceActive, setIsVoiceActive] = useState(false);
  const [isSpeakingResponse, setIsSpeakingResponse] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const weeks = userProfile?.weeksPregnant || 24;
  const month = userProfile?.pregnancyMonth || Math.min(9, Math.max(1, Math.floor((weeks - 1) / 4) + 1));
  const rawTrimester = weeks <= 12 ? '1st Trimester' : weeks <= 28 ? '2nd Trimester' : '3rd Trimester';
  const state = userProfile?.state || globalLocation?.state || 'Karnataka';
  const diet = userProfile?.dietPreference || 'Vegetarian';

  const getLocalizedTrimester = (w: number, lang: string) => {
    const num = w <= 12 ? '1' : w <= 28 ? '2' : '3';
    switch (lang) {
      case 'kn': return `${num}ನೇ ತ್ರೈಮಾಸಿಕ`;
      case 'hi': return `${num}री तिमाही`;
      case 'ta': return `${num}-ஆம் முப்பருவம்`;
      case 'te': return `${num}వ త్రైమాసికం`;
      case 'ml': return `${num}-ാം ത്രൈമാസികം`;
      default: return w <= 12 ? '1st Trimester' : w <= 28 ? '2nd Trimester' : '3rd Trimester';
    }
  };

  const getLocalizedState = (s: string, lang: string) => {
    if (s.toLowerCase() === 'karnataka') {
      switch (lang) {
        case 'kn': return 'ಕರ್ನಾಟಕ';
        case 'hi': return 'कर्नाटक';
        case 'ta': return 'கர்நாடகா';
        case 'te': return 'కర్ణాటక';
        case 'ml': return 'കർണാടക';
      }
    }
    return s;
  };

  const getLocalizedMonth = (m: number, lang: string) => {
    switch (lang) {
      case 'kn': return `${m}ನೇ ತಿಂಗಳು`;
      case 'hi': return `${m}वाँ महीना`;
      case 'ta': return `${m}-ஆம் மாதம்`;
      case 'te': return `${m}వ నెల`;
      case 'ml': return `${m}-ാം മാസം`;
      default: return `Month ${m}`;
    }
  };

  const trimester = getLocalizedTrimester(weeks, currentLanguageCode);
  const localizedState = getLocalizedState(state, currentLanguageCode);
  const localizedMonth = getLocalizedMonth(month, currentLanguageCode);

  const chatStorageKey = currentUser?.id
    ? `pregnutri_ai_chat_history_${currentUser.id}`
    : 'pregnutri_ai_chat_history_guest';

  const effectiveName = userProfile?.name || currentUser?.name || '';

  // Initial greeting tailored to language
  const getInitialGreeting = (lang: string, name?: string) => {
    const rawName = name || effectiveName;
    const displayName = rawName ? ` ${rawName.split(' ')[0]}` : '';
    switch (lang) {
      case 'hi':
        return `नमस्ते${displayName || ' माँ'}! मैं आपकी प्रेगन्यूट्री एआई मातृत्व पोषण सहायक हूँ। आप वर्तमान में ${month}वें महीने (${weeks}वें सप्ताह, ${trimester}) में हैं। आप पोषण, सुरक्षित खाद्य पदार्थ, स्थानीय व्यंजनों या सरकारी योजनाओं के बारे में मुझसे कुछ भी पूछ सकती हैं।`;
      case 'kn':
        return `ನಮಸ್ಕಾರ${displayName || ' ಅಮ್ಮಾ'}! ನಾನು ನಿಮ್ಮ ಪ್ರೆಗ್ನ್ಯೂಟ್ರಿ ಎಐ ಪೌಷ್ಟಿಕಾಂಶ ಸಹಾಯಕ. ನೀವು ಈಗ ${month}ನೇ ತಿಂಗಳು (${weeks}ನೇ ವಾರ, ${trimester}) ಗರ್ಭಾವಸ್ಥೆಯಲ್ಲಿದ್ದೀರಿ. ಸ್ಥಳೀಯ ಆಹಾರ, ಪೋಷಕಾಂಶಗಳು ಅಥವಾ ಸರ್ಕಾರದ ಯೋಜನೆಗಳ ಕುರಿತು ಯಾವುದೇ ಪ್ರಶ್ನೆ ಕೇಳಿ.`;
      case 'ta':
        return `வணக்கம்${displayName || ' அம்மா'}! நான் உங்கள் பிரக்நியூட்ரி ஏஐ தாய்மை ஊட்டச்சத்து உதவியாளர். நீங்கள் இப்போது ${month}வது மாதம் (${weeks}வது வாரம், ${trimester}) கர்ப்பத்தில் உள்ளீர்கள். ஊட்டச்சத்து, பாரம்பரிய உணவுகள் பற்றி என்னிடம் கேட்கலாம்.`;
      case 'te':
        return `నమస్కారం${displayName || ' అమ్మా'}! నేను మీ ప్రెగ్‌న్యూట్రి AI ప్రసూతి పోషకాహార సహాయకురాలిని. మీరు ప్రస్తుతం ${month}వ నెల (${weeks}వ వారం, ${trimester})లో ఉన్నారు. స్థానిక ఆహారాలు, పోషకాల గురించి నన్ను అడగండి.`;
      case 'ml':
        return `നമസ്കാരം${displayName || ' അമ്മേ'}! ഞാൻ നിങ്ങളുടെ പ്രെഗ്ന്യൂട്രി എഐ പോഷകാഹാര സഹായിയാണ്. നിങ്ങൾ ഇപ്പോൾ ${month}-ാം മാസം (${weeks}-ാം ആഴ്ച, ${trimester}) ഗർഭാവസ്ഥയിലാണ്. ഭക്ഷണത്തെക്കുറിച്ചും ആരോഗ്യത്തെക്കുറിച്ചും സംശയങ്ങൾ ചോദിക്കാം.`;
      default:
        return displayName
          ? `Hello${displayName}! I am PregNutri AI, your clinical maternal nutrition companion. You are currently in Month ${month} (Week ${weeks}, ${trimester}). How can I support your nutritional health and traditional meal choices today?`
          : `Welcome! I am PregNutri AI, your clinical maternal nutrition companion. You are currently in Month ${month} (Week ${weeks}, ${trimester}). How can I support your nutritional health and traditional meal choices today?`;
    }
  };

  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    try {
      const activeKey = currentUser?.id
        ? `pregnutri_ai_chat_history_${currentUser.id}`
        : 'pregnutri_ai_chat_history_guest';
      const saved = localStorage.getItem(activeKey);
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return [
      {
        id: 'msg-welcome',
        sender: 'assistant',
        text: getInitialGreeting(currentLanguageCode, effectiveName),
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ];
  });

  // Reload chat messages if user changes
  useEffect(() => {
    try {
      const saved = localStorage.getItem(chatStorageKey);
      if (saved) {
        setMessages(JSON.parse(saved));
        return;
      }
    } catch (e) {}
    setMessages([
      {
        id: 'msg-welcome',
        sender: 'assistant',
        text: getInitialGreeting(currentLanguageCode, effectiveName),
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
  }, [currentUser?.id]);

  // Update greeting when language changes if only 1 message exists
  useEffect(() => {
    if (messages.length <= 1) {
      setMessages([
        {
          id: 'msg-welcome',
          sender: 'assistant',
          text: getInitialGreeting(currentLanguageCode, effectiveName),
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    }
  }, [currentLanguageCode, effectiveName]);

  useEffect(() => {
    try {
      localStorage.setItem(chatStorageKey, JSON.stringify(messages));
    } catch (e) {}
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isOpen, chatStorageKey]);

  // Suggested quick queries based on language & trimester
  const getQuickPrompts = (lang: string) => {
    switch (lang) {
      case 'hi':
        return [
          `महीने ${month} में मुझे क्या खाना चाहिए?`,
          `${state} के आयरन युक्त पारंपरिक व्यंजन`,
          `क्या गर्भावस्था में पपीता खाना सुरक्षित है?`,
          `${state} में गर्भवती महिलाओं के लिए सरकारी योजनाएं`
        ];
      case 'kn':
        return [
          `${month}ನೇ ತಿಂಗಳಲ್ಲಿ ಯಾವ ಆಹಾರ ಉತ್ತಮ?`,
          `${state}ದ ರಾಗಿ ಮತ್ತು ಕಾಳುಗಳ ಪೌಷ್ಟಿಕಾಂಶ`,
          `ಗರ್ಭಾವಸ್ಥೆಯಲ್ಲಿ ಪಪ್ಪಾಯಿ ತಿನ್ನಬಹುದೇ?`,
          `${state}ದಲ್ಲಿ ತಾಯಂದಿರಿಗೆ ಸಿಗುವ ಸರ್ಕಾರಿ ಸೌಲಭ್ಯಗಳು`
        ];
      case 'ta':
        return [
          `மாதம் ${month}-ல் என்ன சாப்பிட வேண்டும்?`,
          `${state} பாரம்பரிய இரும்புச்சத்து உணவுகள்`,
          `பப்பாளி கர்ப்ப காலத்தில் பாதுகாப்பானதா?`,
          `${state} அரசு நலத்திட்டங்கள்`
        ];
      case 'te':
        return [
          `నెల ${month}లో ఎలాంటి ఆహారం తీసుకోవాలి?`,
          `${state} సంప్రదాయ పోషకాహారాలు`,
          `గర్భధారణలో బొప్పాయి తినవచ్చా?`,
          `${state} ప్రభుత్వ ప్రసూతి పథకాలు`
        ];
      case 'ml':
        return [
          `${month}-ാം മാസത്തിൽ എന്ത് കഴിക്കണം?`,
          `${state}-ലെ പരമ്പരാഗത പോഷകാഹാരങ്ങൾ`,
          `ഗർഭകാലത്ത് പപ്പായ കഴിക്കുന്നത് സുരക്ഷിതമാണോ?`,
          `${state} മാതൃ ക്ഷേമ പദ്ധതികൾ`
        ];
      default:
        return [
          `What should I eat in Month ${month}?`,
          `Iron & Calcium traditional foods in ${state}`,
          `Are papayas and pineapples safe in pregnancy?`,
          `Maternity welfare schemes available in ${state}`
        ];
    }
  };

  const handleSendMessage = async (queryText?: string) => {
    const textToSend = queryText || inputText;
    if (!textToSend.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: textToSend.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputText('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: textToSend,
          language: currentLanguageCode,
          profile: {
            ...userProfile,
            weeksPregnant: weeks,
            pregnancyMonth: month,
            dietPreference: diet,
            heightCm: userProfile.heightCm || 162,
            currentWeightKg: userProfile.currentWeightKg || 60,
            prePregnancyWeightKg: userProfile.prePregnancyWeightKg || 54,
            state: state,
            district: userProfile.district || globalLocation?.district,
            taluk: userProfile.taluk || globalLocation?.taluk,
            village: userProfile.village || globalLocation?.village,
            allergies: userProfile.allergies || []
          },
          history: messages.slice(-6)
        })
      });

      if (!response.ok) {
        throw new Error(`Server returned ${response.status}`);
      }

      const data = await response.json();
      const assistantMessage: ChatMessage = {
        id: `assistant-${Date.now()}`,
        sender: 'assistant',
        text: data.text || 'I am currently prioritizing clinical accuracy. Please consult your healthcare provider.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages((prev) => [...prev, assistantMessage]);

      // If voice is enabled, speak response
      if (isVoiceActive) {
        speakResponse(assistantMessage.text, assistantMessage.id);
      }
    } catch (err) {
      console.warn('Chat API error, providing verified maternal nutrition response', err);
      const fallbackMessage: ChatMessage = {
        id: `assistant-${Date.now()}`,
        sender: 'assistant',
        text: currentLanguageCode === 'hi'
          ? `आईसीएमआर-एनआईएन पोषण दिशानिर्देशों के अनुसार, ${trimester} के दौरान भरपूर आयरन (पालक, दाल), कैल्शियम (रागी, दूध, दही), और पर्याप्त पानी (2.5-3 लीटर) का सेवन करें। किसी भी असुविधा में डॉक्टर से संपर्क करें।`
          : currentLanguageCode === 'kn'
          ? `ಐಸಿಎಂಆರ್ ಮಾರ್ಗಸೂಚಿಗಳಂತೆ ${trimester} ಸಮಯದಲ್ಲಿ ಸಾಕಷ್ಟು ಕಬ್ಬಿಣಾಂಶ (ಪಾಲಕ್, ಬೇಳೆ), ಕ್ಯಾಲ್ಸಿಯಂ (ರಾಗಿ ಮುದ್ದೆ, ಹಾಲು) ಮತ್ತು ದಿನಕ್ಕೆ 2.5-3 ಲೀಟರ್ ನೀರು ಸೇವಿಸಿ.`
          : `For ${trimester}, ensure daily intake of iron (greens, lentils, dates), calcium (ragi/dairy), protein, and 2.5–3L clean water. Always verify with your obstetrician.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages((prev) => [...prev, fallbackMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const speakResponse = (text: string, msgId: string) => {
    if (isSpeakingResponse === msgId) {
      voiceService.stopSpeaking();
      setIsSpeakingResponse(null);
      return;
    }
    voiceService.stopSpeaking();
    setIsSpeakingResponse(msgId);
    voiceService.speak(
      text,
      currentLanguageCode,
      () => setIsSpeakingResponse(null),
      () => setIsSpeakingResponse(msgId),
      msgId
    );
  };

  const clearChat = () => {
    voiceService.stopSpeaking();
    setIsSpeakingResponse(null);
    const reset = [
      {
        id: 'msg-welcome',
        sender: 'assistant' as const,
        text: getInitialGreeting(currentLanguageCode),
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ];
    setMessages(reset);
    try {
      localStorage.removeItem('pregnutri_ai_chat_history_v2');
    } catch (e) {}
  };

  return (
    <>
      {/* 1. Floating AI Assistant Action Button */}
      {!isOpen && (
        <button
          type="button"
          onClick={() => {
            setIsOpen(true);
            setIsMinimized(false);
          }}
          aria-label="Open AI Assistant"
          className="fixed bottom-20 right-4 sm:bottom-6 sm:right-6 z-40 flex items-center gap-2 sm:gap-2.5 px-3 py-2 sm:px-4 sm:py-3 bg-[#223030] text-[#EFEFE9] hover:bg-[#523D35] rounded-full shadow-2xl border-2 border-[#BBA58F] transition-all transform hover:scale-105 active:scale-95 group cursor-pointer"
        >
          <div className="relative">
            <div className="w-8 h-8 rounded-full bg-[#523D35] flex items-center justify-center border border-[#BBA58F]/50">
              <Bot className="w-4 h-4 text-[#BBA58F] group-hover:rotate-12 transition-transform" />
            </div>
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-500 rounded-full border-2 border-[#223030] animate-pulse" />
          </div>
          <div className="text-left pr-1">
            <span className="text-xs font-black tracking-wide block text-[#EFEFE9]">
              🤖 {t('ai.assistant', 'AI Assistant')}
            </span>
            <span className="text-[9px] text-[#BBA58F] font-semibold block">
              {trimester} • {localizedState}
            </span>
          </div>
        </button>
      )}

      {/* 2. Floating AI Assistant Chat Panel */}
      {isOpen && (
        <div
          className={`fixed right-3 sm:right-6 bottom-20 sm:bottom-6 z-50 w-[94vw] sm:w-[410px] bg-[#EFEFE9] rounded-3xl shadow-2xl border border-[#523D35]/50 flex flex-col overflow-hidden transition-all duration-200 animate-in fade-in slide-in-from-bottom-6 ${
            isMinimized ? 'h-[64px]' : 'h-[540px] max-h-[80vh]'
          }`}
        >
          {/* Header */}
          <div className="bg-[#223030] text-[#EFEFE9] px-4 py-3 flex items-center justify-between border-b border-[#523D35] shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-[#523D35] border border-[#BBA58F]/50 flex items-center justify-center">
                <Bot className="w-4 h-4 text-[#BBA58F]" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="text-xs sm:text-sm font-black text-[#EFEFE9] leading-none">
                    PregNutri {t('ai.assistant', 'AI Assistant')}
                  </h3>
                  <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
                </div>
                <p className="text-[10px] text-[#BBA58F] font-semibold mt-0.5">
                  {localizedMonth} • {trimester}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => setIsVoiceActive(!isVoiceActive)}
                title={isVoiceActive ? 'Auto-voice enabled' : 'Auto-voice disabled'}
                className={`p-1.5 rounded-lg text-xs transition cursor-pointer ${
                  isVoiceActive
                    ? 'bg-emerald-800/80 text-emerald-200'
                    : 'text-[#E8D9CD]/70 hover:bg-[#523D35]'
                }`}
              >
                {isVoiceActive ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
              </button>

              <button
                type="button"
                onClick={clearChat}
                title="Clear Chat History"
                className="p-1.5 rounded-lg text-[#E8D9CD]/70 hover:bg-[#523D35] hover:text-[#EFEFE9] transition cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>

              <button
                type="button"
                onClick={() => setIsMinimized(!isMinimized)}
                title={isMinimized ? 'Expand Chat' : 'Minimize Chat'}
                className="p-1.5 rounded-lg text-[#E8D9CD]/70 hover:bg-[#523D35] hover:text-[#EFEFE9] transition cursor-pointer"
              >
                {isMinimized ? <Maximize2 className="w-3.5 h-3.5" /> : <Minimize2 className="w-3.5 h-3.5" />}
              </button>

              <button
                type="button"
                onClick={() => {
                  voiceService.stopSpeaking();
                  setIsSpeakingResponse(null);
                  setIsOpen(false);
                }}
                title="Close AI Assistant"
                className="p-1.5 rounded-lg text-[#E8D9CD]/70 hover:bg-[#523D35] hover:text-rose-300 transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Main Body (Collapsed when minimized) */}
          {!isMinimized && (
            <>
              {/* Quick Suggestion Chips */}
              <div className="bg-[#E8D9CD] px-3 py-2 border-b border-[#959D90]/30 shrink-0">
                <div className="text-[10px] font-bold text-[#523D35] mb-1 flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-[#523D35]" />
                  <span>{t('planner.suggestedFor', 'Suggested for')} {state}:</span>
                </div>
                <div className="flex gap-1.5 overflow-x-auto no-scrollbar pb-1">
                  {getQuickPrompts(currentLanguageCode).map((q, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleSendMessage(q)}
                      className="px-2.5 py-1 rounded-lg bg-[#EFEFE9] hover:bg-[#523D35] hover:text-[#E8D9CD] border border-[#959D90]/40 text-[#223030] text-[10px] font-semibold whitespace-nowrap transition shrink-0 cursor-pointer"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>

              {/* Messages Area */}
              <div className="flex-1 overflow-y-auto p-3.5 space-y-3 bg-[#EFEFE9]">
                {/* 3D Maternal Health Welcome Hero */}
                <div className="p-3 bg-white/90 rounded-2xl border border-[#959D90]/30 shadow-2xs flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-[#E8D9CD] p-1 shrink-0 flex items-center justify-center border border-[#BBA58F]/40 shadow-xs">
                    <Maternal3DArt type="mother-and-baby" className="w-full h-full object-contain" alt="Maternal Support" />
                  </div>
                  <div>
                    <span className="text-[10px] font-black uppercase text-[#523D35] block">Compassionate AI Support</span>
                    <p className="text-xs text-[#223030] font-bold leading-tight">
                      Ask about safe Indian foods, cravings, nausea remedies, or trimester nutrient targets.
                    </p>
                  </div>
                </div>

                {messages.map((msg) => {
                  const isUser = msg.sender === 'user';
                  const isThisSpeaking = isSpeakingResponse === msg.id;

                  return (
                    <div
                      key={msg.id}
                      className={`flex items-start gap-2 ${
                        isUser ? 'ml-auto flex-row-reverse' : 'mr-auto'
                      } max-w-[88%]`}
                    >
                      <div
                        className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] shrink-0 mt-0.5 ${
                          isUser
                            ? 'bg-[#223030] text-[#EFEFE9]'
                            : 'bg-[#523D35] text-[#BBA58F]'
                        }`}
                      >
                        {isUser ? <User className="w-3 h-3" /> : <Bot className="w-3 h-3" />}
                      </div>

                      <div
                        className={`rounded-2xl p-3 text-xs leading-relaxed shadow-2xs ${
                          isUser
                            ? 'bg-[#223030] text-[#EFEFE9] rounded-tr-xs'
                            : 'bg-[#E8D9CD] border border-[#959D90]/40 text-[#223030] rounded-tl-xs'
                        }`}
                      >
                        <p className="whitespace-pre-line">{msg.text}</p>

                        <div className="flex items-center justify-between mt-1.5 pt-1 border-t border-[#959D90]/20 text-[9px] font-medium text-[#523D35]">
                          <span>{msg.timestamp}</span>
                          {!isUser && (
                            <button
                              type="button"
                              onClick={() => speakResponse(msg.text, msg.id)}
                              className={`flex items-center gap-1 px-1.5 py-0.5 rounded cursor-pointer transition ${
                                isThisSpeaking
                                  ? 'bg-emerald-700 text-white font-bold animate-pulse'
                                  : 'hover:bg-[#BBA58F]/30 text-[#523D35]'
                              }`}
                            >
                              {isThisSpeaking ? (
                                <>
                                  <Volume2 className="w-2.5 h-2.5" />
                                  <span>{t('ai.speaking', 'Speaking')}</span>
                                </>
                              ) : (
                                <>
                                  <Volume2 className="w-2.5 h-2.5" />
                                  <span>{t('ai.listen', 'Listen')}</span>
                                </>
                              )}
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}

                {isLoading && (
                  <div className="flex items-center gap-2 mr-auto max-w-[85%]">
                    <div className="w-6 h-6 rounded-full bg-[#523D35] text-[#BBA58F] flex items-center justify-center text-[10px] shrink-0 animate-pulse">
                      <Bot className="w-3 h-3" />
                    </div>
                    <div className="rounded-2xl rounded-tl-xs p-2.5 bg-[#E8D9CD] border border-[#959D90]/40 text-[#523D35] text-xs flex items-center gap-2">
                      <Sparkles className="w-3 h-3 text-[#523D35] animate-spin" />
                      <span className="text-[11px] font-semibold">
                        {t('ai.analyzingGuidelines', 'Analyzing clinical guidelines & local foods...')}
                      </span>
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Safety banner & Input Form */}
              <div className="p-3 bg-[#E8D9CD] border-t border-[#959D90]/40 shrink-0">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSendMessage();
                  }}
                  className="flex items-center gap-1.5"
                >
                  <input
                    type="text"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    placeholder={
                      currentLanguageCode === 'hi'
                        ? 'मातृत्व पोषण या आहार संबंधी प्रश्न पूछें...'
                        : currentLanguageCode === 'kn'
                        ? 'ಆಹಾರ ಅಥವಾ ಆರೋಗ್ಯದ ಬಗ್ಗೆ ಪ್ರಶ್ನೆ ಕೇಳಿ...'
                        : currentLanguageCode === 'ta'
                        ? 'ஊட்டச்சத்து கேள்வி கேட்கவும்...'
                        : currentLanguageCode === 'te'
                        ? 'పోషకాహారం లేదా ఆరోగ్య ప్రశ్న అడగండి...'
                        : currentLanguageCode === 'ml'
                        ? 'ഭക്ഷണത്തെക്കുറിച്ചോ ആരോഗ്യത്തെക്കുറിച്ചോ ചോദിക്കുക...'
                        : 'Ask any maternal nutrition question...'
                    }
                    className="flex-1 px-3 py-2 bg-[#EFEFE9] rounded-xl border border-[#959D90]/60 text-xs font-semibold text-[#223030] outline-none focus:border-[#523D35] placeholder:text-[#523D35]/70"
                  />
                  <button
                    type="submit"
                    disabled={!inputText.trim() || isLoading}
                    className="p-2 bg-[#223030] hover:bg-[#523D35] disabled:opacity-50 text-[#EFEFE9] rounded-xl font-bold transition shadow-xs cursor-pointer"
                    title={t('ai.send', 'Send')}
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </form>

                <div className="mt-2 pt-1.5 border-t border-[#959D90]/30 flex items-center justify-between text-[9px] text-[#523D35]">
                  <span>🛡️ {currentLanguageCode === 'kn' ? 'ಪೌಷ್ಟಿಕಾಂಶ ಮಾರ್ಗದರ್ಶನ ಮಾತ್ರ. ತುರ್ತು ಚಿಕಿತ್ಸೆಯಲ್ಲ.' : currentLanguageCode === 'hi' ? 'केवल पोषण संबंधी मार्गदर्शन। चिकित्सकीय निदान नहीं।' : 'Nutritional advice only. Not medical diagnosis.'}</span>
                  <button
                    type="button"
                    onClick={() => {
                      setIsOpen(false);
                      setIsSosModalOpen(true);
                    }}
                    className="text-rose-700 font-black hover:underline cursor-pointer flex items-center gap-0.5"
                  >
                    <ShieldAlert className="w-2.5 h-2.5" />
                    <span>{currentLanguageCode === 'kn' ? 'ತುರ್ತು SOS' : currentLanguageCode === 'hi' ? 'आपातकालीन SOS' : 'Emergency SOS'}</span>
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </>
  );
};
