import React, { useState, useRef, useEffect } from 'react';
import { UserProfile, ChatMessage, GlobalLocationState } from '../types';
import {
  Bot,
  Send,
  Sparkles,
  ShieldCheck,
  AlertTriangle,
  Heart,
  HelpCircle,
  RotateCcw,
  User,
  MapPin,
  Volume2,
  VolumeX
} from 'lucide-react';
import { useLanguage } from '../services/language_service';
import { voiceService } from '../services/voice_service';

interface AskAiViewProps {
  profile: UserProfile;
  globalLocation?: GlobalLocationState;
}

export const AskAiView: React.FC<AskAiViewProps> = ({ profile, globalLocation }) => {
  const { currentLanguageCode } = useLanguage();
  const activeState = globalLocation?.state || profile.state || 'Karnataka';
  const activeCity = globalLocation?.city || profile.city || 'Bengaluru';
  const activeRegion = globalLocation?.region || 'South India';

  const [speakingMessageId, setSpeakingMessageId] = useState<string | null>(null);

  const getWelcomeText = () => {
    switch (currentLanguageCode) {
      case 'hi':
        return `नमस्ते! मैं प्रेगन्यूट्री एआई मातृत्व पोषण सहायक हूँ। आपका स्वागत है। मैं आपकी गर्भावस्था (सप्ताह ${profile.weeksPregnant}) और ${activeState} के स्थानीय आहार के अनुसार सहायता के लिए तैयार हूँ।`;
      case 'kn':
        return `ನಮಸ್ಕಾರ! ನಾನು ಪ್ರೆಗ್ನ್ಯೂಟ್ರಿ ಎಐ ಪೌಷ್ಟಿಕಾಂಶ ಸಹಾಯಕ. ನಿಮ್ಮ ${activeState} ಪ್ರದೇಶ ಮತ್ತು ${profile.weeksPregnant}ನೇ ವಾರದ ಗರ್ಭಾವಸ್ಥೆಗೆ ಸೂಕ್ತವಾದ ಆಹಾರ ಸಲಹೆಗಳನ್ನು ಕೇಳಿ.`;
      case 'ta':
        return `வணக்கம்! நான் உங்கள் தாய்மை ஊட்டச்சத்து உதவியாளர். ${activeState} பாரம்பரிய உணவுகள் மற்றும் உங்கள் கர்ப்ப கால ஊட்டச்சத்து பற்றிய கேள்விகளைக் கேட்கலாம்.`;
      case 'te':
        return `నమస్కారం! నేను మీ ప్రెగ్‌న్యూట్రి AI సహాయకురాలిని. ${activeState} స్థానిక ఆహారాలు మరియు ప్రసూతి పోషకాలపై సందేహాలను అడగండి.`;
      case 'ml':
        return `നമസ്കാരം! ഞാൻ നിങ്ങളുടെ പ്രെഗ്ന്യൂട്രി എഐ സഹായിയാണ്. ${activeState}-ലെ പരമ്പരാഗത ഭക്ഷണങ്ങളെക്കുറിച്ചും ഗർഭകാല ആരോഗ്യത്തെക്കുറിച്ചും ചോദിക്കാം.`;
      default:
        return `Hello mother! I am PregNutri AI, your clinical maternal nutrition companion. I am currently tailored for your location in **${activeCity}, ${activeState}** (${activeRegion}). Ask me any pregnancy nutrition, local food safety, or regional meal questions!`;
    }
  };

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'init-1',
      sender: 'assistant',
      text: getWelcomeText(),
      timestamp: 'Just now'
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (messages.length <= 1) {
      setMessages([
        {
          id: 'init-1',
          sender: 'assistant',
          text: getWelcomeText(),
          timestamp: 'Just now'
        }
      ]);
    }
  }, [currentLanguageCode]);

  const quickQuestions = currentLanguageCode === 'hi' ? [
    `${activeState} के आयरन युक्त स्थानीय खाद्य पदार्थ`,
    'क्या पका पपीता गर्भावस्था में सुरक्षित है?',
    'केसर का उपयोग कितना सुरक्षित है?',
    `${activeState} के लिए पारंपरिक नाश्ता`,
    'मॉर्निंग सिकनेस के उपाय',
    'कैल्शियम से भरपूर बाजरा और रागी'
  ] : currentLanguageCode === 'kn' ? [
    `${activeState}ದ ಕಬ್ಬಿಣಾಂಶದ ಆಹಾರಗಳು`,
    'ಮಾಗಿದ ಪಪ್ಪಾಯಿ ಸುರಕ್ಷಿತವೇ?',
    'ಕೇಸರಿ ಬಳಕೆ ಎಷ್ಟು ಸುರಕ್ಷಿತ?',
    `${activeState}ದ ಪೌಷ್ಟಿಕ ಬೆಳಗಿನ ಉಪಾಹಾರ`,
    'ವಾಂತಿ ಮತ್ತು ಆಯಾಸಕ್ಕೆ ಪರಿಹಾರ',
    'ಕ್ಯಾಲ್ಸಿಯಂ ಭರಿತ ರಾಗಿ ಮತ್ತು ಸಿರಿಧಾನ್ಯಗಳು'
  ] : [
    `Local iron foods in ${activeState}`,
    'Is ripe papaya safe?',
    'How safe is saffron?',
    `Regional breakfast for ${activeState}`,
    'Morning sickness remedy',
    'Calcium-rich regional millets'
  ];

  // Auto-scroll to bottom of conversation
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  // Clinical Rule-Based Response Generator for instant offline answers with Location Context
  const generateClinicalRuleResponse = (query: string): string => {
    const q = query.toLowerCase();

    if (q.includes('unripe') && q.includes('papaya')) {
      return `⚠️ **Clinical Alert: Unripe / Semi-Ripe Green Papaya is STRICTLY CONTRAINDICATED in Pregnancy.**
      
• **Reason:** Unripe and semi-ripe green papaya contains concentrated white latex and high amounts of the enzyme *papain*. 
• **Medical Risk:** Latex acts like prostaglandins and oxytocin, which can trigger uterine contractions, membrane rupture, and early labor complications.
• **Safe Alternative:** Completely yellow, fully ripe papaya contains virtually no latex and is safe in small, moderate portions, but when in doubt, choose oranges, apples, and bananas instead.`;
    }

    if (q.includes('ripe papaya')) {
      return `✅ **Fully Ripe Papaya (Yellow Skin) is Generally Safe in Small Moderation.**

• **Clinical Evidence:** Unlike green unripe papaya, fully ripe papaya skin turns golden-orange/yellow, during which the dangerous latex enzyme degrades completely.
• **Benefits:** Ripe papaya is rich in Vitamin C, Beta-Carotene, Folate, and gentle dietary fiber which relieves pregnancy constipation.
• **Recommendation:** Consume 1-2 small fresh slices occasionally. Avoid store-bought packaged raw salads where unripe green papaya may be mixed.`;
    }

    if (q.includes('saffron') || q.includes('kesar')) {
      return `🌿 **Pure Saffron (Kesar) Safety in Pregnancy:**

• **Safe Period:** Safe **only after the 5th month (20+ weeks)** in small culinary amounts.
• **Recommended Dosage:** 1 to 2 fine strands infused in a cup of warm milk before bedtime.
• **Benefits:** Safranal and crocin antioxidants help relax pelvic muscles, improve mood, and aid restful maternal sleep.
• **Warning:** Strict warning against consuming large medicinal doses (more than 5-10 strands) or consuming in the 1st trimester, as excess saffron stimulates uterine tone.`;
    }

    if (q.includes('iron') || q.includes('hemoglobin') || q.includes('anemia')) {
      const isSouth = activeRegion.includes('South') || activeState.includes('Tamil') || activeState.includes('Karnataka') || activeState.includes('Kerala') || activeState.includes('Andhra') || activeState.includes('Telangana');
      const regionalItems = isSouth
        ? `1. **Murungai Keerai (Moringa/Drumstick leaves)** & Soppu (Amaranth/Palak) — Steam lightly to retain folate and iron.\n2. **Finger Millet (Ragi)** — 3.9mg iron & 344mg calcium per 100g.\n3. **Black Sesame Chikki (Ellu)** & Medjool Dates with soaked almonds.\n4. **Sundal / Sprouted Moong Usli** — Paired with fresh lemon juice.`
        : `1. **Bathua, Sarson & Palak Saag** — Rich in plant-based bioavailable iron and folates.\n2. **Sprouted Kala Chana (Black Chickpeas)** & Rajma (Kidney beans).\n3. **Til Jaggery Laddus & Dates** with walnuts.\n4. **Bajra & Jowar Rotis** tempered with pure desi cow ghee.`;

      return `🩸 **Maternal Iron Optimization for ${activeState} (${activeRegion}):**

${regionalItems}

• **Bioavailability Rule:** Non-heme iron from plant sources requires an acidic gastric environment for optimal assimilation.
• **The Golden Rule:** Always squeeze fresh lemon juice (Vitamin C) over your dal or greens.
• **Critical Inhibitors:** **Never drink tea, coffee, or milk** within 1 to 2 hours of iron-rich meals, as polyphenols, tannins, and calcium bind with iron and block up to 70% of absorption.`;
    }

    if (q.includes('folate') || q.includes('folic acid')) {
      return `🥦 **Top Folate-Rich Local Traditional Foods in ${activeState}:**

Folate (Vitamin B9) is vital for neural tube defect prevention and red blood cell synthesis:

1. **Cooked Dark Greens:** Palak (Spinach), Methi (Fenugreek), Moringa leaves (Drumstick leaves).
2. **Legumes & Lentils:** Yellow Moong Dal, Kabuli Chana (Chickpeas), Rajma (Kidney Beans), Toor Dal.
3. **Millets & Seeds:** Sprouted Ragi, Foxtail Millet, Roasted Sesame seeds (Til), Peanuts (if not allergic).
4. **Citrus & Fruits:** Oranges, Sweet Limes (Mosambi), Guavas, and Pomegranates.

💡 *Clinical Tip: Steam or lightly sauté greens rather than boiling in excess water to prevent heat-sensitive folate leaching.*`;
    }

    if (q.includes('morning sickness') || q.includes('nausea')) {
      return `🍋 **Evidence-Based Remedies for Pregnancy Morning Sickness:**

1. **Ginger & Lemon Water:** Freshly crushed ginger infused in warm water with a squeeze of fresh lemon reduces gastric dysrhythmia.
2. **Vitamin B6 Rich Snacks:** Robusta/Yelakki bananas, roasted makhana, and dry whole-grain crackers by the bedside before rising.
3. **Frequent Small Meals:** Eat 5-6 small mini-meals throughout the day. An empty stomach exacerbates nausea.
4. **Hydration Strategy:** Sip Tender Coconut Water or cold water between meals, rather than drinking large quantities with meals.`;
    }

    if (q.includes('breakfast') || q.includes('regional')) {
      return `🌅 **Nutritious Pregnancy Breakfast Recommendations for ${activeState}:**

• **Recommended Local Dishes:**
  - Freshly steamed whole grain/millet base (e.g. Steamed Idli with Drumstick Sambar, Akki Roti with carrot & dill, or Missi Roti with curd).
  - High protein component: 1 cup yellow moong dal / sambar or 1 boiled egg.
  - Hydration: 1 glass fresh tender coconut water or buttermilk (majjige/chaas).

• **Why It Works:** Provides sustained complex carbohydrates with low glycemic surge, steady protein for fetal tissue synthesis, and natural electrolytes.`;
    }

    return `Thank you for your question regarding **"${query}"**.

During your **Week ${profile.weeksPregnant} (Trimester ${profile.weeksPregnant <= 12 ? 1 : profile.weeksPregnant <= 28 ? 2 : 3})** in **${activeState}**, your body prioritizes rapid fetal skeletal development and blood volume expansion.

• **Local Guidance for ${activeState}:** Maintain a nutrient-dense diet emphasizing ${profile.dietPreference.toLowerCase()} proteins (such as Paneer, Moong Dal, Eggs, Sundal), high-calcium local grains (Ragi, Jowar, Whole Wheat), and plenty of fresh hydration (2.5L daily).
• **Safety Check:** Always ensure all dairy products are pasteurized, vegetables are thoroughly washed, and eggs/meats are fully cooked.

Would you like specific recipe ideas or food safety checks for any particular dish in ${activeState}?`;
  };

  const handleSendMessage = async (textToSend?: string) => {
    const query = (textToSend || inputText).trim();
    if (!query || isLoading) return;

    const userMessage: ChatMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputText('');
    setIsLoading(true);

    try {
      // Attempt backend Gemini call with fallback
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: query,
          language: currentLanguageCode,
          profile: {
            name: profile.name,
            weeksPregnant: profile.weeksPregnant,
            pregnancyMonth: profile.pregnancyMonth,
            heightCm: profile.heightCm || 162,
            currentWeightKg: profile.currentWeightKg || 60,
            prePregnancyWeightKg: profile.prePregnancyWeightKg || 54,
            diet: profile.dietPreference,
            dietPreference: profile.dietPreference,
            state: activeState,
            city: activeCity,
            district: profile.district || activeCity,
            taluk: profile.taluk,
            village: profile.village,
            region: activeRegion,
            deficiencies: profile.medicalConditions,
            allergies: profile.allergies
          },
          history: messages.slice(-4)
        })
      });

      if (response.ok) {
        const data = await response.json();
        if (data.text) {
          const aiMessage: ChatMessage = {
            id: `ai-${Date.now()}`,
            sender: 'assistant',
            text: data.text,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          };
          setMessages((prev) => [...prev, aiMessage]);
          setIsLoading(false);
          return;
        }
      }
      throw new Error('Fallback to clinical rule engine');
    } catch (err) {
      // Offline / Clinical Rule Engine Fallback
      setTimeout(() => {
        const ruleText = generateClinicalRuleResponse(query);
        const aiMessage: ChatMessage = {
          id: `ai-${Date.now()}`,
          sender: 'assistant',
          text: ruleText,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        setMessages((prev) => [...prev, aiMessage]);
        setIsLoading(false);
      }, 500);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header Banner */}
      <div className="bg-[#E8D9CD] rounded-3xl p-6 sm:p-8 border border-[#959D90] shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-[#523D35] text-[#E8D9CD] border border-[#BBA58F]/30 text-xs font-bold uppercase tracking-wider">
                <Bot className="w-3.5 h-3.5 text-[#BBA58F]" />
                <span>Rule-Based &amp; Gemini AI Advisor</span>
              </div>
              <div className="inline-flex items-center space-x-1 px-3 py-1 rounded-full bg-[#223030] text-[#EFEFE9] border border-[#959D90]/30 text-xs font-semibold">
                <MapPin className="w-3 h-3 text-[#BBA58F]" />
                <span>Active Location: {activeCity}, {activeState}</span>
              </div>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#223030] tracking-tight flex items-center gap-2">
              💬 Ask PregNutri AI
            </h1>
            <p className="text-xs sm:text-sm text-[#523D35] mt-0.5 font-medium">
              Maternal nutrition adviser aware of your local foods in {activeState} • Grounded in ICMR-NIN 2020 Clinical Standards
            </p>
          </div>

          <button
            type="button"
            onClick={() =>
              setMessages([
                {
                  id: 'init-1',
                  sender: 'assistant',
                  text: `Hello mother! I am PregNutri AI. I am tuned for your location in **${activeCity}, ${activeState}**. Ask me any pregnancy nutrition or local food safety question!`,
                  timestamp: 'Just now'
                }
              ])
            }
            className="px-3.5 py-1.5 rounded-xl bg-[#EFEFE9] hover:bg-[#BBA58F]/30 text-[#223030] border border-[#959D90]/40 text-xs font-semibold flex items-center gap-1.5 transition self-start cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5 text-[#523D35]" />
            <span>Clear Chat</span>
          </button>
        </div>

        {/* Quick Question Chips */}
        <div className="space-y-1.5 pt-2 border-t border-[#959D90]/30">
          <span className="text-[11px] font-bold text-[#523D35] uppercase tracking-wider block">
            Suggested Queries for {activeState}:
          </span>
          <div className="flex items-center space-x-2 overflow-x-auto no-scrollbar py-1">
            {quickQuestions.map((q) => (
              <button
                key={q}
                type="button"
                onClick={() => handleSendMessage(q)}
                className="px-3.5 py-1.5 rounded-xl bg-[#EFEFE9] hover:bg-[#523D35] hover:text-[#E8D9CD] border border-[#959D90]/50 text-[#223030] text-xs font-medium whitespace-nowrap transition cursor-pointer"
              >
                💬 {q}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Chat Box */}
      <div className="bg-[#E8D9CD] rounded-3xl border border-[#959D90] shadow-xs flex flex-col h-[520px] overflow-hidden">
        {/* Messages Scroll Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 bg-[#EFEFE9]">
          {messages.map((msg) => {
            const isUser = msg.sender === 'user';
            return (
              <div
                key={msg.id}
                className={`flex items-start space-x-2.5 max-w-2xl ${
                  isUser ? 'ml-auto flex-row-reverse space-x-reverse' : 'mr-auto'
                }`}
              >
                {/* Avatar */}
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                    isUser
                      ? 'bg-[#223030] text-[#EFEFE9] shadow-2xs'
                      : 'bg-[#523D35] text-[#E8D9CD] shadow-2xs'
                  }`}
                >
                  {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4 text-[#BBA58F]" />}
                </div>

                {/* Message Bubble */}
                <div
                  className={`rounded-2xl px-4 py-3 text-xs sm:text-sm leading-relaxed ${
                    isUser
                      ? 'bg-[#223030] text-[#EFEFE9] rounded-tr-xs'
                      : 'bg-[#E8D9CD] border border-[#959D90]/40 text-[#223030] rounded-tl-xs shadow-2xs'
                  }`}
                >
                  <div className="whitespace-pre-line">{msg.text}</div>
                  <div className="flex items-center justify-between mt-2 pt-1 border-t border-[#959D90]/20 text-[10px]">
                    <span className={isUser ? 'text-[#959D90]' : 'text-[#523D35]'}>
                      {msg.timestamp}
                    </span>
                    {!isUser && (
                      <button
                        type="button"
                        onClick={() => {
                          if (speakingMessageId === msg.id) {
                            voiceService.stopSpeaking();
                            setSpeakingMessageId(null);
                          } else {
                            voiceService.stopSpeaking();
                            setSpeakingMessageId(msg.id);
                            voiceService.speak(
                              msg.text,
                              currentLanguageCode,
                              () => setSpeakingMessageId(msg.id),
                              () => setSpeakingMessageId(null),
                              () => setSpeakingMessageId(null)
                            );
                          }
                        }}
                        className={`flex items-center space-x-1 px-2 py-0.5 rounded cursor-pointer transition ${
                          speakingMessageId === msg.id
                            ? 'bg-emerald-700 text-white font-bold'
                            : 'hover:bg-[#BBA58F]/30 text-[#523D35]'
                        }`}
                      >
                        {speakingMessageId === msg.id ? (
                          <>
                            <VolumeX className="w-3 h-3" />
                            <span>Stop</span>
                          </>
                        ) : (
                          <>
                            <Volume2 className="w-3 h-3" />
                            <span>Listen</span>
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
            <div className="flex items-center space-x-2.5 max-w-md mr-auto">
              <div className="w-8 h-8 rounded-full bg-[#523D35] text-[#E8D9CD] flex items-center justify-center text-xs font-bold shrink-0 animate-pulse">
                <Bot className="w-4 h-4 text-[#BBA58F]" />
              </div>
              <div className="rounded-2xl rounded-tl-xs px-4 py-3 bg-[#E8D9CD] border border-[#959D90]/40 text-[#523D35] text-xs shadow-2xs flex items-center space-x-2">
                <Sparkles className="w-3.5 h-3.5 text-[#523D35] animate-spin" />
                <span>PregNutri AI is analyzing clinical database &amp; {activeState} food sources...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Form */}
        <div className="p-4 bg-[#E8D9CD] border-t border-[#959D90]/30">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center space-x-2"
          >
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={`Ask any maternal nutrition or local food question in ${activeState}...`}
              className="flex-1 px-4 py-3 rounded-2xl bg-[#EFEFE9] focus:bg-white border border-[#959D90] focus:border-[#523D35] focus:ring-4 focus:ring-[#523D35]/10 outline-none text-xs sm:text-sm text-[#223030] transition font-medium placeholder:text-[#959D90]"
            />
            <button
              type="submit"
              disabled={!inputText.trim() || isLoading}
              className="px-5 py-3 rounded-2xl bg-[#223030] hover:bg-[#523D35] disabled:opacity-50 text-[#EFEFE9] font-bold text-xs flex items-center space-x-1.5 shadow-xs transition shrink-0 cursor-pointer"
            >
              <span>Send</span>
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
          {/* Mandatory Medical Safety Disclaimer */}
          <div className="mt-2.5 text-[10px] text-[#523D35] text-center leading-normal">
            🛡️ <strong className="text-[#223030]">Clinical Safety Notice:</strong> PregNutri AI provides general educational guidance and does not replace professional medical advice. Consult a qualified healthcare professional for medical concerns or emergencies.
          </div>
        </div>
      </div>
    </div>
  );
};
