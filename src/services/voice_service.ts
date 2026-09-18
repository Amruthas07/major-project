import { KaggleFoodItem } from '../types';
import { getFoodLocalizedSubtitle } from './food_translations';

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
  periodLabel: string;
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
    speakerKey?: string
  ) {
    if (!this.isSpeechSynthesisSupported() || !text || !text.trim()) {
      onEnd?.();
      return;
    }

    // Stop any ongoing utterance
    this.stopSpeaking();

    const cleanLangCode = (languageCode || 'en').toLowerCase().trim();
    const langTag = VOICE_LANGUAGE_TAGS[cleanLangCode] || 'en-IN';

    const utterance = new SpeechSynthesisUtterance(text.trim());
    utterance.lang = langTag;
    utterance.rate = 0.92; // Clear, comfortable maternal pace
    utterance.pitch = 1.0;

    // Pick best matching voice
    try {
      const voices = window.speechSynthesis.getVoices();
      if (voices && voices.length > 0) {
        const exactMatch = voices.find((v) => v.lang.toLowerCase() === langTag.toLowerCase());
        const langPrefixMatch = voices.find(
          (v) =>
            v.lang.toLowerCase().replace('_', '-').startsWith(cleanLangCode) ||
            v.name.toLowerCase().includes(cleanLangCode)
        );
        if (exactMatch) {
          utterance.voice = exactMatch;
        } else if (langPrefixMatch) {
          utterance.voice = langPrefixMatch;
        }
      }
    } catch (e) {
      console.warn('Error fetching speech synthesis voices:', e);
    }

    const itemKey = speakerKey || null;

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
      onEnd?.();
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
    const subtitle = getFoodLocalizedSubtitle(foodName, undefined, languageCode);
    const textToSpeak = subtitle ? `${subtitle}` : foodName;
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
    const subtitle = getFoodLocalizedSubtitle(food.name, food.regionalName, lang);
    const spokenName = subtitle || baseName;

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
          ? 'ఈ ఆహారం గర్భధారణ సమయంలో ఎంతో సురక్షితమైనది మరియు పోషకభరితమైనది.'
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
