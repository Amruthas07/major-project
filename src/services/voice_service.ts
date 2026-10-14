import { KaggleFoodItem } from '../types';
import { RegionalRecipe } from '../types/recipe';
import { getFoodLocalizedSubtitle } from './food_translations';
import { LanguageService } from './language_service';

// Language to BCP-47 tag mapping for SpeechSynthesis and SpeechRecognition
export const VOICE_LANGUAGE_TAGS: Record<string, string> = {
  en: 'en-IN',
  hi: 'hi-IN',
  kn: 'kn-IN',
  ta: 'ta-IN',
  te: 'te-IN',
  ml: 'ml-IN',
  mr: 'mr-IN',
  bn: 'bn-IN',
  gu: 'gu-IN',
  pa: 'pa-IN',
  or: 'or-IN',
  ur: 'ur-IN',
  as: 'as-IN',
  bho: 'hi-IN',
  kok: 'mr-IN',
  mai: 'hi-IN',
  ne: 'ne-NP',
  sa: 'sa-IN'
};

// Localized labels for Voice Playback Controls
export const VOICE_LABELS: Record<string, { listen: string; stop: string; listening: string }> = {
  en: { listen: 'Listen', stop: 'Stop', listening: 'Listening...' },
  hi: { listen: 'सुनें', stop: 'रोकें', listening: 'सुन रहे हैं...' },
  kn: { listen: 'ಕೇಳಿ', stop: 'ನಿಲ್ಲಿಸಿ', listening: 'ಕೇಳಿಸಿಕೊಳ್ಳುತ್ತಿದ್ದೇವೆ...' },
  ta: { listen: 'கேட்க', stop: 'நிறுத்து', listening: 'கேட்கிறது...' },
  te: { listen: 'వినండి', stop: 'ఆపండి', listening: 'వింటున్నారు...' },
  ml: { listen: 'കേൾക്കൂ', stop: 'നിർത്തൂ', listening: 'കേൾക്കുന്നു...' },
  mr: { listen: 'ऐका', stop: 'थांबवा', listening: 'ऐकत आहे...' },
  bn: { listen: 'শুনুন', stop: 'থামুন', listening: 'শুনছি...' },
  gu: { listen: 'સાંભળો', stop: 'રોકો', listening: 'સાંભળી રહ્યા છીએ...' },
  pa: { listen: 'ਸੁਣੋ', stop: 'ਰੋਕੋ', listening: 'ਸੁਣ ਰਹੇ ਹਾਂ...' },
  or: { listen: 'ଶୁଣନ୍ତୁ', stop: 'ବନ୍ଦ କରନ୍ତୁ', listening: 'ଶୁଣୁଛି...' },
  ur: { listen: 'سنیں', stop: 'روکیں', listening: 'سن رہے ہیں...' },
  as: { listen: 'শুনক', stop: 'থামক', listening: 'শুনি আছো...' }
};

export interface ReportVoiceSummaryData {
  userName: string;
  weeksPregnant: number;
  periodLabel?: string;
  hasActivity: boolean;
  daysCount: number;
  mealsCount: number;
  avgCalories: number;
  avgProtein: number;
  avgWaterL: number;
  topFoods: string[];
}

class VoiceService {
  private static instance: VoiceService;
  private currentUtterance: SpeechSynthesisUtterance | null = null;
  private isCurrentlySpeaking: boolean = false;
  private activeSpeakerKey: string | null = null;
  private activeListeners: Set<(speaking: boolean, activeKey?: string | null) => void> = new Set();
  private voiceUnavailableListeners: Set<(lang: string) => void> = new Set();
  private keepAliveInterval: any = null;

  private constructor() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      // Warm up voices cache
      window.speechSynthesis.onvoiceschanged = () => {
        window.speechSynthesis.getVoices();
      };
    }
  }

  public static getInstance(): VoiceService {
    if (!VoiceService.instance) {
      VoiceService.instance = new VoiceService();
    }
    return VoiceService.instance;
  }

  public subscribeSpeaking(listener: (speaking: boolean, activeKey?: string | null) => void): () => void {
    this.activeListeners.add(listener);
    listener(this.isCurrentlySpeaking, this.activeSpeakerKey);
    return () => this.activeListeners.delete(listener);
  }

  public subscribeVoiceUnavailable(listener: (lang: string) => void): () => void {
    this.voiceUnavailableListeners.add(listener);
    return () => this.voiceUnavailableListeners.delete(listener);
  }

  public notifyVoiceUnavailable(lang: string) {
    this.voiceUnavailableListeners.forEach((l) => l(lang));
  }

  public isSpeaking(): boolean {
    return this.isCurrentlySpeaking;
  }

  public getActiveSpeakerKey(): string | null {
    return this.activeSpeakerKey;
  }

  private notifyListeners(speaking: boolean, activeKey: string | null = null) {
    this.isCurrentlySpeaking = speaking;
    this.activeSpeakerKey = speaking ? activeKey : null;
    this.activeListeners.forEach((l) => l(speaking, this.activeSpeakerKey));
  }

  public isSpeechSynthesisSupported(): boolean {
    return typeof window !== 'undefined' && 'speechSynthesis' in window;
  }

  public isSpeechRecognitionSupported(): boolean {
    if (typeof window === 'undefined') return false;
    return !!((window as any).SpeechRecognition || (window as any).webkitSpeechRecognition);
  }

  /**
   * Formats numeric quantities and units for natural-sounding speech across Indian languages
   */
  public formatSpokenUnits(text: string, langCode: string): string {
    if (!text) return '';
    const lang = (langCode || 'en').toLowerCase().trim();
    const unitsMap: Record<string, { kcal: string; mg: string; g: string; ml: string; kg: string; l: string; pct: string }> = {
      hi: { kcal: ' कैलोरी', mg: ' मिलीग्राम', g: ' ग्राम', ml: ' मिलीलीटर', kg: ' किलोग्राम', l: ' लीटर', pct: ' प्रतिशत' },
      kn: { kcal: ' ಕ್ಯಾಲೋರಿ', mg: ' ಮಿಲಿಗ್ರಾಂ', g: ' ಗ್ರಾಂ', ml: ' ಮಿಲಿಲೀಟರ್', kg: ' ಕಿಲೋಗ್ರಾಂ', l: ' ಲೀಟರ್', pct: ' ಪ್ರತಿಶತ' },
      ta: { kcal: ' கலோரிகள்', mg: ' மில்லிகிராம்', g: ' கிராம்', ml: ' மில்லிலிட்டர்', kg: ' கிலோகிராம்', l: ' லிட்டர்', pct: ' சதவீதம்' },
      te: { kcal: ' కేలరీలు', mg: ' మిల్లీగ్రాములు', g: ' గ్రాములు', ml: ' మిల్లీలీటర్లు', kg: ' కిలోగ్రాములు', l: ' లీటర్లు', pct: ' శాతం' },
      ml: { kcal: ' കലോറി', mg: ' മില്ലിഗ്രാം', g: ' ഗ്രാം', ml: ' മില്ലിലിറ്റർ', kg: ' കിലോഗ്രാം', l: ' ലിറ്റർ', pct: ' ശതമാനം' },
      mr: { kcal: ' कॅलरी', mg: ' मिग्रॅ', g: ' ग्रॅम', ml: ' मिलिलिटर', kg: ' किलोग्रॅम', l: ' लिटर', pct: ' टक्के' },
      bn: { kcal: ' ক্যালোরি', mg: ' মিলিগ্রাম', g: ' গ্রাম', ml: ' মিলিলিটার', kg: ' কিলোগ্রাম', l: ' লিটার', pct: ' শতাংশ' },
      gu: { kcal: ' કેલરી', mg: ' મિલિગ્રામ', g: ' ગ્રામ', ml: ' મિલીલીટર', kg: ' કિલોગ્રામ', l: ' લિટર', pct: ' ટકા' },
      pa: { kcal: ' ਕੈਲੋਰੀ', mg: ' ਮਿਲੀਗ੍ਰਾਮ', g: ' ਗ੍ਰਾਮ', ml: ' ਮਿਲੀਲੀਟਰ', kg: ' ਕਿਲੋਗ੍ਰਾਮ', l: ' ਲੀਟਰ', pct: ' ਪ੍ਰਤੀਸ਼ਤ' },
      or: { kcal: ' କ୍ୟାଲୋରୀ', mg: ' ମିଲିଗ୍ରାମ୍', g: ' ଗ୍ରାମ୍', ml: ' ମିଲିଲିଟର', kg: ' କିଲୋଗ୍ରାମ୍', l: ' ଲିଟର', pct: ' ପ୍ରତିଶତ' },
      ur: { kcal: ' کیلوریز', mg: ' ملی گرام', g: ' گرام', ml: ' ملی لیٹر', kg: ' کلوگرام', l: ' لیٹر', pct: ' فیصد' },
      as: { kcal: ' কেলৰি', mg: ' মিলিগ্রাম', g: ' গ্ৰাম', ml: ' মিলিলিটাৰ', kg: ' কিলোগ্ৰাম', l: ' লিটাৰ', pct: ' শতাংশ' },
      en: { kcal: ' calories', mg: ' milligrams', g: ' grams', ml: ' millilitres', kg: ' kilograms', l: ' litres', pct: ' percent' }
    };
    const u = unitsMap[lang] || unitsMap.en;
    let out = text;
    out = out.replace(/(\d+(?:\.\d+)?)\s*kcal\b/gi, `$1${u.kcal}`);
    out = out.replace(/(\d+(?:\.\d+)?)\s*mg\b/gi, `$1${u.mg}`);
    out = out.replace(/(\d+(?:\.\d+)?)\s*g\b/gi, `$1${u.g}`);
    out = out.replace(/(\d+(?:\.\d+)?)\s*ml\b/gi, `$1${u.ml}`);
    out = out.replace(/(\d+(?:\.\d+)?)\s*kg\b/gi, `$1${u.kg}`);
    out = out.replace(/(\d+(?:\.\d+)?)\s*l\b/gi, `$1${u.l}`);
    out = out.replace(/(\d+(?:\.\d+)?)\s*%/g, `$1${u.pct}`);
    return out;
  }

  /**
   * Checks if an installed speech synthesis voice is available for a language
   */
  public isVoiceAvailableForLanguage(langCode: string): boolean {
    if (!this.isSpeechSynthesisSupported()) return false;
    const cleanLang = (langCode || 'en').toLowerCase().trim();
    if (cleanLang === 'en') return true;
    try {
      const voices = window.speechSynthesis.getVoices();
      if (!voices || voices.length === 0) return true; // Voices might load asynchronously
      const langTag = VOICE_LANGUAGE_TAGS[cleanLang] || cleanLang;
      return voices.some((v) =>
        v.lang.toLowerCase() === langTag.toLowerCase() ||
        v.lang.toLowerCase().replace('_', '-') === langTag.toLowerCase() ||
        v.lang.toLowerCase().startsWith(cleanLang)
      );
    } catch (e) {
      return true;
    }
  }

  /**
   * Immediately stops speech, clears queues, and resets all voice listeners
   */
  public stopSpeaking() {
    if (this.keepAliveInterval) {
      clearInterval(this.keepAliveInterval);
      this.keepAliveInterval = null;
    }

    if (this.currentUtterance) {
      this.currentUtterance.onstart = null;
      this.currentUtterance.onend = null;
      this.currentUtterance.onerror = null;
      this.currentUtterance = null;
    }

    if (this.isSpeechSynthesisSupported()) {
      try {
        window.speechSynthesis.pause();
        window.speechSynthesis.cancel();
      } catch (e) {
        try {
          window.speechSynthesis.cancel();
        } catch (err) {
          console.warn('Error cancelling speech synthesis:', err);
        }
      }
    }

    this.notifyListeners(false, null);
  }

  /**
   * Speak arbitrary text in the selected language with precise voice and pace
   */
  public speak(
    text: string,
    languageCode: string = 'en',
    onEnd?: () => void,
    onStart?: () => void,
    speakerKeyOrError?: string | (() => void),
    explicitSpeakerKey?: string
  ) {
    if (!this.isSpeechSynthesisSupported() || !text || !text.trim()) {
      onEnd?.();
      return;
    }

    // Stop any ongoing utterance
    this.stopSpeaking();

    const cleanLangCode = (languageCode || 'en').toLowerCase().trim();
    const langTag = VOICE_LANGUAGE_TAGS[cleanLangCode] || 'en-IN';

    // Format units naturally for the spoken language
    const spokenFormatted = this.formatSpokenUnits(text.trim(), cleanLangCode);

    const utterance = new SpeechSynthesisUtterance(spokenFormatted);
    utterance.lang = langTag;
    utterance.rate = 0.92; // Clear, comfortable maternal pace
    utterance.pitch = 1.0;

    // Pick best matching voice
    try {
      const voices = window.speechSynthesis.getVoices();
      if (voices && voices.length > 0) {
        const exactMatch = voices.find(
          (v) =>
            v.lang.toLowerCase() === langTag.toLowerCase() ||
            v.lang.toLowerCase().replace('_', '-') === langTag.toLowerCase()
        );
        const langPrefixMatch = voices.find(
          (v) =>
            v.lang.toLowerCase().replace('_', '-').startsWith(cleanLangCode) ||
            v.name.toLowerCase().includes(cleanLangCode)
        );

        const nameKeywords: Record<string, string[]> = {
          kn: ['kannada', 'ಕನ್ನಡ', 'kn-in', 'kn_in'],
          hi: ['hindi', 'हिन्दी', 'हिंदी', 'hi-in', 'hi_in'],
          ta: ['tamil', 'தமிழ்', 'ta-in', 'ta_in'],
          te: ['telugu', 'తెలుగు', 'te-in', 'te_in'],
          ml: ['malayalam', 'മലയാളം', 'ml-in', 'ml_in'],
          mr: ['marathi', 'मराठी', 'mr-in', 'mr_in'],
          bn: ['bengali', 'বাংলা', 'bn-in', 'bn_in'],
          gu: ['gujarati', 'ગુજરાતી', 'gu-in', 'gu_in'],
          pa: ['punjabi', 'ਪੰਜਾਬੀ', 'pa-in', 'pa_in'],
          or: ['odia', 'oriya', 'ଓଡ଼ିଆ', 'or-in', 'or_in'],
          ur: ['urdu', 'اردو', 'ur-in', 'ur_in'],
          as: ['assamese', 'অসমীয়া', 'as-in', 'as_in'],
          en: ['india', 'english', 'en-in']
        };
        const keywords = nameKeywords[cleanLangCode] || [];
        const keywordMatch = voices.find((v) =>
          keywords.some(
            (kw) => v.name.toLowerCase().includes(kw) || v.lang.toLowerCase().includes(kw)
          )
        );

        if (exactMatch) {
          utterance.voice = exactMatch;
        } else if (langPrefixMatch) {
          utterance.voice = langPrefixMatch;
        } else if (keywordMatch) {
          utterance.voice = keywordMatch;
        } else if (cleanLangCode !== 'en') {
          // If browser has voices loaded and NONE match the non-English language
          // Check if any voice matches
          const hasAnyMatchingVoice = voices.some(v => v.lang.toLowerCase().startsWith(cleanLangCode));
          if (!hasAnyMatchingVoice && voices.length > 5) {
            console.warn(`No native voice found for ${cleanLangCode} on this device.`);
            this.notifyVoiceUnavailable(cleanLangCode);
          }
        }
      }
    } catch (e) {
      console.warn('Error fetching speech synthesis voices:', e);
    }

    const itemKey = typeof speakerKeyOrError === 'string'
      ? speakerKeyOrError
      : (explicitSpeakerKey || null);
    const onErrorCallback = typeof speakerKeyOrError === 'function' ? speakerKeyOrError : onEnd;

    utterance.onstart = () => {
      this.notifyListeners(true, itemKey);
      onStart?.();
      // Chrome long-utterance keepalive workaround
      if (this.keepAliveInterval) clearInterval(this.keepAliveInterval);
      this.keepAliveInterval = setInterval(() => {
        if (!window.speechSynthesis.speaking) {
          clearInterval(this.keepAliveInterval);
          this.keepAliveInterval = null;
        } else {
          window.speechSynthesis.pause();
          window.speechSynthesis.resume();
        }
      }, 10000);
    };

    utterance.onend = () => {
      if (this.keepAliveInterval) {
        clearInterval(this.keepAliveInterval);
        this.keepAliveInterval = null;
      }
      this.notifyListeners(false, null);
      this.currentUtterance = null;
      onEnd?.();
    };

    utterance.onerror = (e) => {
      if (this.keepAliveInterval) {
        clearInterval(this.keepAliveInterval);
        this.keepAliveInterval = null;
      }
      console.warn('Speech synthesis playback event:', e);
      this.notifyListeners(false, null);
      this.currentUtterance = null;
      onErrorCallback?.();
    };

    this.currentUtterance = utterance;
    try {
      window.speechSynthesis.speak(utterance);
    } catch (e) {
      console.error('Failed to trigger speechSynthesis.speak:', e);
      this.notifyListeners(false, null);
      onEnd?.();
    }
  }

  /**
   * Pronounces a single food name in the target language
   */
  public speakFoodName(foodName: string, languageCode: string = 'en', onEnd?: () => void) {
    const localized = LanguageService.tFood(foodName).primary;
    const subtitle = getFoodLocalizedSubtitle(foodName, undefined, languageCode);
    const textToSpeak = localized || subtitle || foodName;
    this.speak(textToSpeak, languageCode, onEnd, undefined, 'name-' + foodName);
  }

  /**
   * Generates translated spoken script and speaks comprehensive food overview
   */
  public speakFoodOverview(food: KaggleFoodItem, languageCode: string = 'en', onEnd?: () => void) {
    const lang = (languageCode || 'en').toLowerCase().trim();
    const spokenText = this.buildFoodVoiceOverviewText(food, lang);
    const itemKey = food.id || food.name;
    this.speak(spokenText, lang, onEnd, undefined, itemKey);
  }

  /**
   * Builds high-quality translated spoken text for Food Items across Indian languages
   */
  public buildFoodVoiceOverviewText(food: KaggleFoodItem, lang: string): string {
    const baseName = food.name.split('(')[0].trim();
    const localizedName = LanguageService.tFood(food.name).primary;
    const subtitle = getFoodLocalizedSubtitle(food.name, food.regionalName, lang);
    const spokenName = localizedName || subtitle || baseName;

    const calories = Math.round(food.calories || 0);
    const protein = (food.protein || 0).toFixed(1);
    const iron = (food.iron || 0).toFixed(1);
    const calcium = Math.round(food.calcium || 0);

    const safety = food.safetyLevel || 'Safe';
    const isSafe = safety.toLowerCase() === 'safe';
    const isModeration = safety.toLowerCase().includes('moderation');

    switch (lang) {
      case 'hi': {
        const safetyText = isSafe
          ? 'यह आहार गर्भावस्था में पूरी तरह सुरक्षित और पौष्टिक है।'
          : isModeration
          ? 'यह आहार सीमित मात्रा में और अच्छी तरह पकाकर खाना चाहिए।'
          : 'गर्भावस्था के दौरान इस आहार से परहेज करने की सलाह दी जाती है।';

        return `${spokenName}। ${safetyText} प्रति सर्विंग: ${calories} कैलोरी, ${protein} ग्राम प्रोटीन, ${iron} मिलीग्राम आयरन, और ${calcium} मिलीग्राम कैल्शियम मिलता है। यह मां और गर्भस्थ शिशु के संपूर्ण स्वास्थ्य के लिए अत्यंत गुणकारी है।`;
      }

      case 'kn': {
        const safetyText = isSafe
          ? 'ಈ ಆಹಾರವು ಗರ್ಭಾವಸ್ಥೆಯಲ್ಲಿ ಸಂಪೂರ್ಣವಾಗಿ ಸುರಕ್ಷಿತ ಮತ್ತು ಪೌಷ್ಟಿಕವಾಗಿದೆ.'
          : isModeration
          ? 'ಈ ಆಹಾರವನ್ನು ನಿಯಮಿತ ಪ್ರಮಾಣದಲ್ಲಿ ಮಾತ್ರ ಸೇವಿಸಬೇಕು.'
          : 'ಗರ್ಭಾವಸ್ಥೆಯಲ್ಲಿ ಈ ಆಹಾರವನ್ನು ಸೇವಿಸಬೇಡಿ.';

        return `${spokenName}. ${safetyText} ಪ್ರತಿ ತುತ್ತಿನಲ್ಲಿ: ${calories} ಕ್ಯಾಲೋರಿ, ${protein} ಗ್ರಾಂ ಪ್ರೋಟೀನ್, ${iron} ಮಿಲಿಗ್ರಾಂ ಕಬ್ಬಿಣದಂಶ, ಮತ್ತು ${calcium} ಮಿಲಿಗ್ರಾಂ ಕ್ಯಾಲ್ಸಿಯಂ ದೊರೆಯುತ್ತದೆ. ಇದು ತಾಯಿ ಮತ್ತು ಮಗುವಿನ ಆರೋಗ್ಯಕ್ಕೆ ಅತ್ಯಂತ ಹಿತಕರ.`;
      }

      case 'ta': {
        const safetyText = isSafe
          ? 'இந்த உணவு கர்ப்ப காலத்தில் முற்றிலும் பாதுகாப்பானது மற்றும் சத்தானது.'
          : isModeration
          ? 'இந்த உணவை மிதமான அளவில் மட்டுமே உட்கொள்ள வேண்டும்.'
          : 'கர்ப்ப காலத்தில் இந்த உணவை தவிர்க்க வேண்டும்.';

        return `${spokenName}. ${safetyText} ஒரு பரிமாறலில்: ${calories} கலோரிகள், ${protein} கிராம் புரதம், ${iron} மி.கி இரும்புச்சத்து, மற்றும் ${calcium} மி.கி கால்சியம் நிறைந்துள்ளது. இது தாய் மற்றும் சேயின் ஆரோக்கியத்திற்கு மிகவும் நல்லது.`;
      }

      case 'te': {
        const safetyText = isSafe
          ? 'ఈ ఆహారం గర్భధారణ సమయంలో ఎంతో సురಕ್ಷితమైనది మరియు పోషకభరితమైనది.'
          : isModeration
          ? 'ఈ ఆహారాన్ని మితంగా మాత్రమే తీసుకోవాలి.'
          : 'గర్భధారణ సమయంలో ఈ ఆహారాన్ని నివారించండి.';

        return `${spokenName}. ${safetyText} ఒక్కో సెర్వింగ్‌లో: ${calories} కేలరీలు, ${protein} గ్రాముల ప్రోటీన్, ${iron} మిల్లీగ్రాముల ఐరన్, మరియు ${calcium} మిల్లీగ్రాముల కాల్షియం ఉంటాయి. ఇది తల్లి మరియు బిడ్డ ఆరోగ్యానికి చాలా మంచిది.`;
      }

      case 'ml': {
        const safetyText = isSafe
          ? 'ഈ ഭക്ഷണം ഗർഭകാലത്ത് തികച്ചും സുരക്ഷിതവും പോഷകസമൃദ്ധവുമാണ്.'
          : isModeration
          ? 'ഈ ഭക്ഷണം മിതമായ അളവിൽ മാത്രം കഴിക്കുക.'
          : 'ഗർഭകാലത്ത് ഈ ഭക്ഷണം ഒഴിവാക്കുക.';

        return `${spokenName}. ${safetyText} ഒരു സെർവിംഗിൽ: ${calories} കലോറി, ${protein} ഗ്രാം പ്രോട്ടീൻ, ${iron} മില്ലിഗ്രാം ഇരുമ്പ്, ${calcium} മില്ലിഗ്രാം കാൽസ്യം അടങ്ങിയിരിക്കുന്നു. ഇത് അമ്മയുടെയും കുഞ്ഞിന്റെയും ആരോഗ്യത്തിന് ഉത്തമമാണ്.`;
      }

      case 'mr': {
        const safetyText = isSafe
          ? 'हा आहार गरोदरपणात पूर्णपणे सुरक्षित आणि पौष्टिक आहे.'
          : isModeration
          ? 'हा आहार मर्यादित प्रमाणात घेणे सुरक्षित आहे.'
          : 'गरोदरपणात हा आहार टाळावा.';

        return `${spokenName}. ${safetyText} एका सर्व्हिंगमध्ये: ${calories} कॅलरी, ${protein} ग्रॅम प्रथिने, ${iron} मिग्रॅ लोह, आणि ${calcium} मिग्रॅ कॅल्शियम मिळते.`;
      }

      case 'bn': {
        const safetyText = isSafe
          ? 'এই খাবারটি গর্ভাবস্থায় সম্পূর্ণ নিরাপদ এবং পুষ্টিকর।'
          : isModeration
          ? 'এই খাবারটি পরিমিত পরিমাণে খাওয়া নিরাপদ।'
          : 'গর্ভাবস্থায় এই খাবারটি পরিহার করুন।';

        return `${spokenName}। ${safetyText} প্রতি পরিবেশনে: ${calories} ক্যালোরি, ${protein} গ্রাম প্রোটিন, ${iron} মিলিগ্রাম আয়রন, এবং ${calcium} মিলিগ্রাম ক্যালসিয়াম রয়েছে।`;
      }

      case 'gu': {
        const safetyText = isSafe
          ? 'આ ખોરાક ગર્ભાવસ્થામાં સંપૂર્ણપણે સુરક્ષિત અને પૌષ્ટિક છે.'
          : isModeration
          ? 'આ ખોરાક મર્યાદિત માત્રામાં લેવો સલાહભર્યું છે.'
          : 'ગર્ભાવસ્થામાં આ ખોરાક ટાળવો જોઈએ.';

        return `${spokenName}. ${safetyText} એક સર્વિંગમાં: ${calories} કેલરી, ${protein} ગ્રામ પ્રોટીન, ${iron} મિલિગ્રામ આયર્ન, અને ${calcium} મિલિગ્રામ કેલ્શિયમ મળે છે.`;
      }

      case 'pa': {
        const safetyText = isSafe
          ? 'ਇਹ ਭੋਜਨ ਗਰਭ ਅਵਸਥਾ ਵਿੱਚ ਪੂਰੀ ਤਰ੍ਹਾਂ ਸੁਰੱਖਿਅਤ ਅਤੇ ਪੌਸ਼ਟਿਕ ਹੈ।'
          : isModeration
          ? 'ਇਸ ਭੋਜਨ ਨੂੰ ਸੀਮਤ ਮਾਤਰਾ ਵਿੱਚ ਖਾਓ।'
          : 'ਗਰਭ ਅਵਸਥਾ ਵਿੱਚ ਇਸ ਭੋਜਨ ਤੋਂ ਪਰਹੇਜ਼ ਕਰੋ।';

        return `${spokenName}। ${safetyText} ਪ੍ਰਤੀ ਸਰਵਿੰਗ: ${calories} ਕੈਲੋਰੀ, ${protein} ਗ੍ਰਾਮ ਪ੍ਰੋਟੀਨ, ${iron} ਮਿਲੀਗ੍ਰਾਮ ਆਇਰਨ, ਅਤੇ ${calcium} ਮਿਲੀਗ੍ਰਾਮ ਕੈਲਸ਼ੀਅਮ ਮਿਲਦਾ ਹੈ।`;
      }

      case 'or': {
        const safetyText = isSafe
          ? 'ଏହି ଖାଦ୍ୟ ଗର୍ଭାବସ୍ଥାରେ ସମ୍ପୂର୍ଣ୍ଣ ସୁରକ୍ଷିତ ଏବଂ ପୌଷ୍ଟିକ।'
          : isModeration
          ? 'ଏହି ଖାଦ୍ୟକୁ ସୀମିତ ପରିମାଣରେ ଖାଆନ୍ତୁ।'
          : 'ଗର୍ଭାବସ୍ଥାରେ ଏହି ଖାଦ୍ୟରୁ ଦୂରେଇ ରୁହନ୍ତୁ।';

        return `${spokenName}। ${safetyText} ପ୍ରତି ପରିବେଷଣରେ: ${calories} କ୍ୟାଲୋରୀ, ${protein} ଗ୍ରାମ୍ ପ୍ରୋଟିନ୍, ${iron} ମିଲିଗ୍ରାମ୍ ଲୌହ, ଏବଂ ${calcium} ମିଲିଗ୍ରାମ୍ କ୍ୟାଲସିୟମ୍ ମିଳେ।`;
      }

      case 'ur': {
        const safetyText = isSafe
          ? 'یہ غذا دوران حمل مکمل طور پر محفوظ اور غذائیت سے بھرپور ہے۔'
          : isModeration
          ? 'یہ غذا اعتدال کے ساتھ کھائیں۔'
          : 'دوران حمل اس غذا سے پرہیز کریں۔';

        return `${spokenName}۔ ${safetyText} فی سرونگ: ${calories} کیلوریز، ${protein} گرام پروٹین، ${iron} ملی گرام آئرن، اور ${calcium} ملی گرام کیلشیم حاصل ہوتا ہے۔`;
      }

      case 'as': {
        const safetyText = isSafe
          ? 'এই খাদ্য গৰ্ভাৱস্থাত সম্পূৰ্ণৰূপে সুৰক্ষিত আৰু পুষ্টিকৰ।'
          : isModeration
          ? 'এই খাদ্য সীমিত পৰিমাণত খাব লাগে।'
          : 'গৰ্ভাৱস্থাত এই খাদ্য পৰিহাৰ কৰক।';

        return `${spokenName}। ${safetyText} প্ৰতি পৰিৱেশনত: ${calories} কেলৰি, ${protein} গ্ৰাম প্ৰটিন, ${iron} মিলিগ্রাম আইৰন, আৰু ${calcium} মিলিগ্রাম কেলচিয়াম পোৱা যায়।`;
      }

      default: {
        // English
        const safetyText = isSafe
          ? 'This food is verified pregnancy safe and nutrient-dense.'
          : isModeration
          ? 'Consume in moderation with hygienic preparation.'
          : 'Advised to avoid during pregnancy.';

        return `${spokenName}. ${safetyText} Per serving: ${calories} calories, ${protein} grams of protein, ${iron} milligrams of iron, and ${calcium} milligrams of calcium. Supports healthy fetal growth and maternal wellness.`;
      }
    }
  }

  /**
   * Speaks authentic recipe steps and ingredients in the selected language
   */
  public speakRecipe(recipe: RegionalRecipe, languageCode: string = 'en', onEnd?: () => void) {
    const lang = (languageCode || 'en').toLowerCase().trim();
    const spokenText = this.buildRecipeVoiceText(recipe, lang);
    const itemKey = 'recipe-' + (recipe.recipeId || recipe.foodId);
    this.speak(spokenText, lang, onEnd, undefined, itemKey);
  }

  /**
   * Builds spoken script for recipe instructions and ingredients
   */
  public buildRecipeVoiceText(recipe: RegionalRecipe, lang: string): string {
    const dishName =
      (lang !== 'en' ? recipe.nameLocal : null) ||
      LanguageService.tFood(recipe.nameEnglish || recipe.traditionalName).primary ||
      recipe.traditionalName ||
      recipe.nameEnglish;

    const ingList = (recipe.ingredients || [])
      .map((ing) => {
        const localizedIng = LanguageService.tIngredient(ing.name).primary || ing.name;
        return `${ing.quantity} ${ing.unit} ${localizedIng}`;
      })
      .join(', ');

    const steps = (recipe.preparationSteps || recipe.instructions || []).join('. ');

    switch (lang) {
      case 'hi':
        return `${dishName} की विधि। सामग्री: ${ingList}। बनाने की विधि: ${steps}।`;
      case 'kn':
        return `${dishName} ಮಾಡುವ ವಿಧಾನ. ಪದಾರ್ಥಗಳು: ${ingList}. ತಯಾರಿಸುವ ವಿಧಾನ: ${steps}.`;
      case 'ta':
        return `${dishName} செய்முறை. தேவையான பொருட்கள்: ${ingList}. செய்முறை படிநிலைகள்: ${steps}.`;
      case 'te':
        return `${dishName} తయారీ విధానం. కావలసిన పదార్థాలు: ${ingList}. తయారీ విధానం: ${steps}.`;
      case 'ml':
        return `${dishName} തയ്യാറാക്കുന്ന വിധം. ചേരുവകൾ: ${ingList}. പാചകക്കുറിപ്പ്: ${steps}.`;
      default:
        return `Recipe for ${dishName}. Ingredients: ${ingList}. Preparation steps: ${steps}.`;
    }
  }

  /**
   * Builds high-quality translated spoken text for Maternal Activity Reports
   */
  public buildReportVoiceSummary(data: ReportVoiceSummaryData, lang: string): string {
    const {
      userName,
      weeksPregnant,
      hasActivity,
      daysCount,
      mealsCount,
      avgCalories,
      avgProtein,
      avgWaterL,
      topFoods
    } = data;

    const foodsList = topFoods.length > 0 ? topFoods.slice(0, 3).join(', ') : '';

    if (!hasActivity) {
      switch (lang) {
        case 'hi':
          return `नमस्ते ${userName} जी। प्रेगन्यूट्री एआई में इस अवधि के लिए कोई गतिविधि दर्ज नहीं मिली है। अपना व्यक्तिगत पोषण रिपोर्ट देखने के लिए कृपया भोजन और पानी की प्रविष्टि शुरू करें।`;
        case 'kn':
          return `ನಮಸ್ಕಾರ ${userName}. ಪ್ರೆಗ್ನ್ಯೂಟ್ರಿ ಎಐ ನಲ್ಲಿ ಈ ಅವಧಿಗೆ ಯಾವುದೇ ಚಟುವಟಿಕೆ ದಾಖಲಾಗಿಲ್ಲ. ನಿಮ್ಮ ವೈಯಕ್ತಿಕ ಪೌಷ್ಟಿಕಾಂಶ ವರದಿಗಾಗಿ ದಯವಿಟ್ಟು ಊಟ ಮತ್ತು ನೀರನ್ನು ಲಾಗ್ ಮಾಡಲು ಪ್ರಾರಂಭಿಸಿ.`;
        case 'ta':
          return `வணக்கம் ${userName}. இந்த காலத்திற்கு பிரெக்நியூட்ரி ஏஐயில் எந்த செயல்பாடும் பதிவாகவில்லை. உங்கள் ஊட்டச்சத்து அறிக்கையை உருவாக்க உணவுகளையும் நீரையும் பதிவு செய்யத் தொடங்குங்கள்.`;
        case 'te':
          return `నమస్కారం ${userName}. ఈ వ్యవధికి ప్రెగ్న్యూట్రీ ఏఐలో ఎటువంటి వివరాలు నమోదు కాలేదు. మీ పోషకాహార నివేదిక కోసం భోజనం మరియు నీటి వివరాలు నమోదు చేయడం ప్రారంభించండి.`;
        case 'ml':
          return `നമസ്കാരം ${userName}. ഈ കാലയളവിൽ രേഖപ്പെടുത്തിയ പ്രവർത്തനങ്ങളൊന്നുമില്ല. നിങ്ങളുടെ റിപ്പോർട്ട് കാണാൻ ദയവായി ഭക്ഷണവും വെള്ളവും രേഖപ്പെടുത്താൻ തുടങ്ങുക.`;
        case 'mr':
          return `नमस्कार ${userName}. या कालावधीत कोणतीही नोंद आढळली नाही. आपला पोषण अहवाल पाहण्यासाठी कृपया जेवण आणि पाणी नोंदवणे सुरू करा.`;
        case 'bn':
          return `নমস্কার ${userName}। এই সময়ের জন্য কোনো কার্যকলাপ নথিভুক্ত নেই। আপনার পুষ্টি রিপোর্ট তৈরি করতে খাবার ও জল লগ করা শুরু করুন।`;
        case 'gu':
          return `નમસ્તે ${userName}. આ સમયગાળા માટે કોઈ પ્રવૃત્તિ નોંધાયેલી નથી. તમારો પોષણ અહેવાલ જોવા માટે કૃપા કરીને ભોજન અને પાણી નોંધવાનું શરૂ કરો.`;
        case 'pa':
          return `ਨਮਸਤੇ ${userName}. ਇਸ ਸਮੇਂ ਲਈ ਕੋਈ ਗਤੀਵਿਧੀ ਦਰਜ ਨਹੀਂ ਹੈ। ਆਪਣੀ ਪੋਸ਼ਣ ਰਿਪੋਰਟ ਦੇਖਣ ਲਈ ਕਿਰਪਾ ਕਰਕੇ ਭੋਜਨ ਅਤੇ ਪਾਣੀ ਦਰਜ ਕਰਨਾ ਸ਼ੁਰੂ ਕਰੋ।`;
        case 'or':
          return `ନମସ୍କାର ${userName}। ଏହି ସମୟ ପାଇଁ କୌଣସି କାର୍ଯ୍ୟକଳାପ ରେକର୍ଡ ହୋଇନାହିଁ। ଆପଣଙ୍କ ପୋଷଣ ରିପୋର୍ଟ ଦେଖିବା ପାଇଁ ଦୟାକରି ଖାଦ୍ୟ ଏବଂ ପାଣି ରେକର୍ଡ କରିବା ଆରମ୍ଭ କରନ୍ତୁ।`;
        case 'ur':
          return `سلام ${userName}. اس مدت کے لیے کوئی سرگرمی ریکارڈ نہیں ہوئی۔ اپنی غذائی رپورٹ کے لیے کھانا اور پانی درج کرنا شروع کریں۔`;
        case 'as':
          return `নমস্কাৰ ${userName}। এই সময়ছোৱাত কোনো কাৰ্যকলাপ নথিভুক্ত হোৱা নাই। আপোনাৰ পুষ্টি প্ৰতিবেদন প্ৰস্তুত কৰিবলৈ অনুগ্ৰহ কৰি খাদ্য আৰু পানী যোগ কৰক।`;
        default:
          return `Hello ${userName}. No activity has been recorded yet in PregNutri AI for this period. Start logging your meals and water intake to generate your personal nutrition report.`;
      }
    }

    switch (lang) {
      case 'hi':
        return `नमस्ते ${userName} जी। गर्भावस्था सप्ताह ${weeksPregnant} की प्रेगन्यूट्री एआई पोषण रिपोर्ट। आपने ${daysCount} दिनों में कुल ${mealsCount} भोजन दर्ज किए हैं। आपका दैनिक औसत ${avgCalories} कैलोरी और ${avgProtein} ग्राम प्रोटीन रहा। प्रतिदिन पानी का औसत ${avgWaterL} लीटर दर्ज हुआ। आपके पसंदीदा आहार रहे: ${foodsList}। यह केवल आपके द्वारा दर्ज डेटा पर आधारित पोषण ट्रैकिंग है, कोई चिकित्सकीय निदान नहीं।`;

      case 'kn':
        return `ನಮಸ್ಕಾರ ${userName}. ಗರ್ಭಧಾರಣೆಯ ವಾರ ${weeksPregnant} ರ ಪ್ರೆಗ್ನ್ಯೂಟ್ರಿ ಎಐ ಪೌಷ್ಟಿಕಾಂಶ ವರದಿ. ನೀವು ${daysCount} ದಿನಗಳಲ್ಲಿ ಒಟ್ಟು ${mealsCount} ಊಟಗಳನ್ನು ದಾಖಲಿಸಿದ್ದೀರಿ. ನಿಮ್ಮ ದೈನಂದಿನ ಸರಾಸರಿ ${avgCalories} ಕ್ಯಾಲೋರಿ ಮತ್ತು ${avgProtein} ಗ್ರಾಂ ಪ್ರೋಟೀನ್. ದಿನಕ್ಕೆ ಸರಾಸರಿ ${avgWaterL} ಲೀಟರ್ ನೀರು ಕುಡಿಯಲಾಗಿದೆ. ನಿಮ್ಮ ಪ್ರಮುಖ ಆಹಾರಗಳು: ${foodsList}. ಇದು ನಿಮ್ಮ ಸ್ವಂತ ನಮೂದುಗಳನ್ನು ಆಧರಿಸಿದ ಪೌಷ್ಟಿಕಾಂಶ ಹೋಲಿಕೆ ಮಾತ್ರ, ವೈದ್ಯಕೀಯ ರೋಗನಿರ್ಣಯವಲ್ಲ.`;

      case 'ta':
        return `வணக்கம் ${userName}. கர்ப்ப வாரம் ${weeksPregnant} க்கான பிரெக்நியூட்ரி ஏஐ ஊட்டச்சத்து அறிக்கை. நீங்கள் ${daysCount} நாட்களில் மொத்தம் ${mealsCount} உணவுகளைப் பதிவு செய்துள்ளீர்கள். தினசரி சராசரி ${avgCalories} கலோரிகள் மற்றும் ${avgProtein} கிராம் புரதம். தினசரி தண்ணீர் உட்கொள்ளல் சராசரி ${avgWaterL} லிட்டர். நீங்கள் அதிகம் உட்கொண்ட உணவுகள்: ${foodsList}. இது உங்கள் பதிவுகளை அடிப்படையாகக் கொண்ட ஊட்டச்சத்து தகவல் மட்டுமே, மருத்துவ நோய் கண்டறிதல் அல்ல.`;

      case 'te':
        return `నమస్కారం ${userName}. గర్భధారణ వారం ${weeksPregnant} కోసం ప్రెగ్న్యూట్రీ ఏఐ పోషకాహార నివేదిక. మీరు ${daysCount} రోజుల్లో మొత్తం ${mealsCount} భోజనాలను నమోదు చేశారు. మీ రోజువారీ సగటు ${avgCalories} కేలరీలు మరియు ${avgProtein} గ్రాముల ప్రోటీన్. సగటు నీటి వినియోగం రోజుకు ${avgWaterL} లీటర్లు. మీరు ఎక్కువగా తిన్న ఆహారాలు: ${foodsList}. ఇది మీరు నమోదు చేసిన వివరాల ఆధారంగా పోషకాహార సమాచారం మాత్రమే, వైద్య నిర్ధారణ కాదు.`;

      case 'ml':
        return `നമസ്കാരം ${userName}. ഗർഭകാല ആഴ്ച ${weeksPregnant} ലെ പ്രെഗ്ന്യൂട്രി എഐ പോഷകാഹാര റിപ്പോർട്ട്. ${daysCount} ദിവസങ്ങളിലായി ${mealsCount} ഭക്ഷണങ്ങൾ രേഖപ്പെടുത്തിയിട്ടുണ്ട്. പ്രതിദിന ശരാശരി ${avgCalories} കലോറിയും ${avgProtein} ഗ്രാം പ്രോട്ടീനും. പ്രതിദിനം ശരാശരി ${avgWaterL} ലിറ്റർ വെള്ളം കുടിച്ചു. നിങ്ങൾ കഴിച്ച പ്രധാന ഭക്ഷണങ്ങൾ: ${foodsList}. ഇത് നിങ്ങളുടെ രേഖകളെ അടിസ്ഥാനമാക്കിയുള്ള പോഷക വിവരം മാത്രമാണ്, മെഡിക്കൽ രോഗനിർണ്ണയമല്ല.`;

      case 'mr':
        return `नमस्कार ${userName}. गर्भधारणा आठवडा ${weeksPregnant} चा प्रेगन्यूट्री एआय पोषण अहवाल. आपण ${daysCount} दिवसांत एकूण ${mealsCount} जेवण नोंदवले आहे. सरासरी दररोज ${avgCalories} कॅलरी आणि ${avgProtein} ग्रॅम प्रथिने मिळाली. पाणी दररोज सरासरी ${avgWaterL} लिटर नोंदवले. मुख्य आहार: ${foodsList}. हा केवळ आपल्या नोंदींवर आधारित पोषण अहवाल आहे, वैद्यकीय निदान नाही.`;

      case 'bn':
        return `নমস্কার ${userName}। গর্ভাবস্থার সপ্তাহ ${weeksPregnant}-এর প্রেগনিউত্রি এআই পুষ্টি রিপোর্ট। আপনি ${daysCount} দিনে মোট ${mealsCount} বার খাবার নথিভুক্ত করেছেন। আপনার দৈনিক গড় ছিল ${avgCalories} ক্যালোরি এবং ${avgProtein} গ্রাম প্রোটিন। দৈনিক গড় জল পান ${avgWaterL} লিটার। প্রধান খাবার: ${foodsList}। এটি আপনার নিজস্ব ডেটার উপর ভিত্তি করে পুষ্টি ট্র্যাকিং, কোনো চিকিৎসা নির্ণয় নয়।`;

      case 'gu':
        return `નમસ્તે ${userName}. ગર્ભાવસ્થા સપ્તાહ ${weeksPregnant} માટે પ્રેગન્યૂટ્રી એઆઈ પોષણ રિપોર્ટ. તમે ${daysCount} દિવસોમાં કુલ ${mealsCount} ભોજન નોંધ્યા છે. તમારું દૈનિક સરેરાશ ${avgCalories} કેલરી અને ${avgProtein} ગ્રામ પ્રોટીન રહ્યું છે. દૈનિક પાણીનો વપરાશ સરેરાશ ${avgWaterL} લિટર નોંધાયો. મુખ્ય ખોરાક: ${foodsList}. આ તમારા પોતાના રેકોર્ડ પર આધારિત પોષણ સરખામણી છે, તબીબી નિદાન નથી.`;

      case 'pa':
        return `ਨਮਸਤੇ ${userName}. ਗਰਭ ਅਵਸਥਾ ਹਫ਼ਤਾ ${weeksPregnant} ਲਈ ਪ੍ਰੈਗਨਿਊਟ੍ਰੀ ਏਆਈ ਪੋਸ਼ਣ ਰਿਪੋਰਟ। ਤੁਸੀਂ ${daysCount} ਦਿਨਾਂ ਵਿੱਚ ਕੁੱਲ ${mealsCount} ਭੋਜਨ ਦਰਜ ਕੀਤੇ ਹਨ। ਰੋਜ਼ਾਨਾ ਔਸਤ ${avgCalories} ਕੈਲੋਰੀ ਅਤੇ ${avgProtein} ਗ੍ਰਾਮ ਪ੍ਰੋਟੀਨ ਰਹੀ। ਰੋਜ਼ਾਨਾ ਪਾਣੀ ਦੀ ਔਸਤ ${avgWaterL} ਲੀਟਰ ਰਹੀ। ਮੁੱਖ ਭੋਜਨ: ${foodsList}।`;

      case 'or':
        return `ନମସ୍କାର ${userName}। ଗର୍ଭାବସ୍ଥା ସପ୍ତାହ ${weeksPregnant} ପାଇଁ ପ୍ରେଗନିଉଟ୍ରି ଏଆଇ ପୋଷଣ ରିପୋର୍ଟ। ଆପଣ ${daysCount} ଦିନରେ ମୋଟ ${mealsCount} ଖାଦ୍ୟ ରେକର୍ଡ କରିଛନ୍ତି। ଦୈନିକ ହାରାହାରି ${avgCalories} କ୍ୟାଲୋରୀ ଏବଂ ${avgProtein} ଗ୍ରାମ୍ ପ୍ରୋଟିନ୍। ଦୈନିକ ହାରାହାରି ପାଣି ${avgWaterL} ଲିଟର।`;

      case 'ur':
        return `سلام ${userName}. ہفتہ حمل ${weeksPregnant} کی پریگنیوٹری اے آئی غذائی رپورٹ۔ آپ نے ${daysCount} دنوں میں کل ${mealsCount} کھانے ریکارڈ کیے ہیں۔ یومیہ اوسط ${avgCalories} کیلوریز اور ${avgProtein} گرام پروٹین ہے۔ یومیہ پانی کی اوسط ${avgWaterL} لیٹر رہی۔`;

      case 'as':
        return `নমস্কাৰ ${userName}। গৰ্ভাৱস্থা সপ্তাহ ${weeksPregnant} ৰ প্ৰেগনিউত্ৰি এআই পুষ্টি প্ৰতিবেদন। আপুনি ${daysCount} দিনত মুঠ ${mealsCount} বাৰ খাদ্য নথিভুক্ত কৰিছে। দৈনিক গড় ${avgCalories} কেলৰি আৰু ${avgProtein} গ্ৰাম প্ৰটিন। দৈনিক পানীৰ গড় ${avgWaterL} লিটাৰ।`;

      default:
        return `PregNutri Activity Report for ${userName}, pregnancy week ${weeksPregnant}. You recorded ${mealsCount} meals across ${daysCount} active days. Daily average was ${avgCalories} calories and ${avgProtein} grams of protein. Average water intake was ${avgWaterL} liters per day. Most recorded foods included ${foodsList}. Nutrition tracking comparison only, not a clinical medical diagnosis. Based on your activity recorded in PregNutri AI.`;
    }
  }

  /**
   * Listen to voice input for search in the selected language
   */
  public startVoiceSearch(
    languageCode: string,
    onResult: (transcript: string) => void,
    onError: (message: string) => void,
    onEnd: () => void
  ): () => void {
    if (!this.isSpeechRecognitionSupported()) {
      onError('Voice search is not supported in this browser. Please type to search.');
      onEnd();
      return () => {};
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognition();

    const cleanLangCode = (languageCode || 'en').toLowerCase().trim();
    const langTag = VOICE_LANGUAGE_TAGS[cleanLangCode] || 'en-IN';
    recognition.lang = langTag;
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onresult = (event: any) => {
      if (event.results && event.results.length > 0) {
        const transcript = event.results[0][0].transcript;
        if (transcript) {
          onResult(transcript.trim());
        }
      }
    };

    recognition.onerror = (event: any) => {
      console.warn('Speech recognition error:', event.error);
      if (event.error === 'not-allowed') {
        onError('Microphone permission was denied. Please allow microphone access to use voice search.');
      } else if (event.error === 'no-speech') {
        onError('No speech was detected. Please try again.');
      } else {
        onError('Could not recognize voice. Please try again or type to search.');
      }
      onEnd();
    };

    recognition.onend = () => {
      onEnd();
    };

    try {
      recognition.start();
    } catch (e) {
      onError('Voice search could not be started.');
      onEnd();
    }

    return () => {
      try {
        recognition.stop();
      } catch (e) {}
    };
  }
}

export const voiceService = VoiceService.getInstance();
