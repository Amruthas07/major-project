// Comprehensive Multilingual Food Translations & Transliteration Engine for PregNutri AI
// Guarantees that food-card subtitles strictly honor the user's selected language.

export interface FoodTranslationMap {
  [languageCode: string]: string;
}

// 1. Comprehensive Translations for all dishes in PregNutri AI Project Food Dataset & Staples
export const COMPREHENSIVE_FOOD_TRANSLATIONS: Record<string, FoodTranslationMap> = {
  // Chitranna / Lemon Rice
  'Chitranna (Lemon Rice with Peanuts)': {
    en: 'Lemon Rice with Peanuts',
    hi: 'चित्रान्ना (नींबू चावल)',
    kn: 'ಚಿತ್ರಾನ್ನ (ನಿಂಬೆಹಣ್ಣಿನ ಅನ್ನ)',
    ta: 'சித்ரான்னா (எலுமிச்சை சாதம்)',
    te: 'చిత్రాన్న (నిమ్మకాయ అన్నం)',
    ml: 'ചിത്രന്ന (നാരങ്ങാ ചോറ്)',
    mr: 'चित्राण्णा (लिंबू भात)',
    bn: 'চিত্রান্না (লেবু ভাত)',
    gu: 'ચિત્રાન્ના (લીંબુ ભાત)',
    pa: 'ਚਿਤ੍ਰਾਂਨਾ (ਨਿੰਬੂ ਚਾਵਲ)',
    or: 'ଚିତ୍ରାନ୍ନ (ଲେମ୍ବୁ ଭାତ)',
    ur: 'چترانہ (لیمن چاول)',
    as: 'চিত্ৰান্না (নেমু ভাত)',
    bho: 'चित्रान्ना (नींबू भात)',
    mai: 'चित्रान्ना (नींबू भात)',
    kok: 'चित्राण्णा (लिंबाचो भात)',
    ks: 'چترانہ',
    ne: 'चित्रान्ना (कागती भात)',
    sa: 'चित्रान्नम् (जम्बीरान्नम्)',
    sat: 'ᱪᱤᱛᱨᱟᱱᱱᱟ'
  },
  'Chitranna': {
    en: 'Lemon Rice',
    hi: 'चित्रान्ना (नींबू चावल)',
    kn: 'ಚಿತ್ರಾನ್ನ',
    ta: 'சித்ரான்னா',
    te: 'చిత్రాన్న',
    ml: 'ചിത്രന്ന',
    mr: 'चित्राण्णा',
    bn: 'চিত্রান্না',
    gu: 'ચિત્રાન્ના',
    pa: 'ਚਿਤ੍ਰਾਂਨਾ',
    or: 'ଚିତ୍ରାନ୍ନ',
    ur: 'چترانہ',
    as: 'চিত্ৰান্না'
  },

  // Mosaru Anna / Curd Rice
  'Mosaru Anna (Tempered Curd Rice)': {
    en: 'Tempered Curd Rice',
    hi: 'मोसरू अन्ना (तड़का दही चावल)',
    kn: 'ಮೊಸರನ್ನ (ಒಗ್ಗರಣೆ ಮೊಸರನ್ನ)',
    ta: 'தயிர் சாதம் (மொசரு அன்னா)',
    te: 'పెరుగన్నం (మొసరు అన్న)',
    ml: 'തൈര് സാദം (മൊസരു അന്ന)',
    mr: 'दही भात (मोसरू अन्ना)',
    bn: 'দই ভাত (মোসারু আন্না)',
    gu: 'દહીં ભાત (મોસરુ અન્ના)',
    pa: 'ਦਹੀਂ ਚਾਵਲ (ਮੋਸਰੂ ਅੰਨਾ)',
    or: 'ଦହି ଭାତ (ମୋସରୁ ଅନ୍ନା)',
    ur: 'دہی چاول',
    as: 'দৈ ভাত'
  },
  'Mosaru Anna': {
    en: 'Tempered Curd Rice',
    hi: 'मोसरू अन्ना (दही चावल)',
    kn: 'ಮೊಸರನ್ನ',
    ta: 'தயிர் சாதம்',
    te: 'పెరుగన్నం',
    ml: 'തൈര് സാദം',
    mr: 'दही भात',
    bn: 'দই ভাত',
    gu: 'દહીં ભાત',
    pa: 'ਦਹੀਂ ਚਾਵਲ',
    or: 'ଦହି ଭାତ',
    ur: 'دہی چاول',
    as: 'দৈ ভাত'
  },

  // Rava Idli
  'Rava Idli with Coconut Chutney': {
    en: 'Semolina Steamed Cakes with Chutney',
    hi: 'रवा इडली नारियल चटनी के साथ',
    kn: 'ರವ ಇಡ್ಲಿ ಕಾಯಿ ಚಟ್ನಿಯೊಂದಿಗೆ',
    ta: 'ரவா இட்லி தேங்காய் சட்னியுடன்',
    te: 'రవ్వ ఇడ్లీ కొబ్బరి చట్నీతో',
    ml: 'റവ ഇഡ്ഡലി തേങ്ങ ചട്നിക്കൊപ്പം',
    mr: 'रवा इडली नारळ चटणीसह',
    bn: 'সুজির ইডলি নারকেল চাটনি সহ',
    gu: 'રવા ઈડલી નાળિયેર ચટણી સાથે',
    pa: 'ਰਵਾ ਇਡਲੀ ਨਾਰੀਅਲ ਚਟਨੀ ਨਾਲ',
    or: 'ରଭା ଇଡଲି ନଡ଼ିଆ ଚଟଣି ସହିତ',
    ur: 'روا اڈلی ناریل چٹنی کے ساتھ',
    as: 'ৰৱা ইডলী নাৰিকল চাটনিৰ সৈতে'
  },
  'Rava Idli': {
    en: 'Semolina Steamed Cakes',
    hi: 'रवा इडली',
    kn: 'ರವ ಇಡ್ಲಿ',
    ta: 'ரவா இட்லி',
    te: 'రవ్వ ఇడ్లీ',
    ml: 'റവ ഇഡ്ഡലി',
    mr: 'रवा इडली',
    bn: 'সুজির ইডলি',
    gu: 'રવા ઈડલી',
    pa: 'ਰਵਾ ਇਡਲੀ',
    or: 'ରଭା ଇଡଲି',
    ur: 'روا اڈلی',
    as: 'ৰৱা ইডলী'
  },

  // Ragi Mudde
  'Ragi Mudde (Finger Millet Ball)': {
    en: 'Finger Millet Dumpling Ball',
    hi: 'रागी मुड्डे (मडुआ बॉल)',
    kn: 'ರಾಗಿ ಮುದ್ದೆ',
    ta: 'கேழ்வரகு களி (ராகி களி)',
    te: 'రాగి సంగటి (రాగి ముద్ద)',
    ml: 'റാഗി ഉണ്ട (റാഗി മുദ്ദെ)',
    mr: 'नाचणीचे मुड्डे (रागी बॉल)',
    bn: 'রাগি মুদ্দে (ফিঙ্গার মিলেট বল)',
    gu: 'રાગી મુદ્દે (નાગલી બોલ)',
    pa: 'ਰਾਗੀ ਮੁੱਦੇ',
    or: 'ମାଣ୍ଡିଆ ମୁଦ୍ଦେ',
    ur: 'راگی مڈے',
    as: 'ৰাগী মুদ্দে'
  },
  'Ragi Mudde': {
    en: 'Finger Millet Ball',
    hi: 'रागी मुड्डे',
    kn: 'ರಾಗಿ ಮುದ್ದೆ',
    ta: 'ராகி களி',
    te: 'రాగి ముద్ద',
    ml: 'റാഗി മുദ്ദെ',
    mr: 'नाचणीचे मुड्डे',
    bn: 'রাগি মুদ্দে',
    gu: 'રાગી મુદ્દે',
    pa: 'ਰਾਗੀ ਮੁੱਦੇ',
    or: 'ମାଣ୍ଡିଆ ମୁଦ୍ଦେ',
    ur: 'راگی مڈے',
    as: 'ৰাগী মুদ্দে'
  },

  // Ragi Roti
  'Ragi Roti (Finger Millet Flatbread)': {
    en: 'Finger Millet Flatbread',
    hi: 'रागी रोटी (मडुआ की रोटी)',
    kn: 'ರಾಗಿ ರೊಟ್ಟಿ',
    ta: 'ராகி ரொட்டி',
    te: 'రాగి రొట్టె',
    ml: 'റാഗി റൊട്ടി',
    mr: 'नाचणीची भाकरी',
    bn: 'রাগি রুটি',
    gu: 'રાગી રોટલી',
    pa: 'ਰਾਗੀ ਰੋਟੀ',
    or: 'ମାଣ୍ଡିଆ ରୁଟି',
    ur: 'راگی روٹی',
    as: 'ৰাগী ৰুটী'
  },
  'Ragi Roti': {
    en: 'Finger Millet Flatbread',
    hi: 'रागी रोटी',
    kn: 'ರಾಗಿ ರೊಟ್ಟಿ',
    ta: 'ராகி ரொட்டி',
    te: 'రాగి రొట్టె',
    ml: 'റാഗി റൊട്ടി',
    mr: 'नाचणीची भाकरी',
    bn: 'রাগি রুটি',
    gu: 'રાગી રોટલી',
    pa: 'ਰਾਗੀ ਰੋਟੀ',
    or: 'ମାଣ୍ଡିଆ ରୁଟି',
    ur: 'راگی روٹی',
    as: 'ৰাগী ৰুটী'
  },

  // Masala Dosa
  'Masala Dosa (Crisp Crepe with Spiced Potato)': {
    en: 'Crisp Crepe with Spiced Potato',
    hi: 'मसाला डोसा (आलू भरा कुरकुरा डोसा)',
    kn: 'ಮಸಾಲೆ ದೋಸೆ (ಆಲೂಗಡ್ಡೆ ಪಲ್ಯದ ದೋಸೆ)',
    ta: 'மசாலா தோசை',
    te: 'మసాలా దోశ',
    ml: 'മസാല ദോശ',
    mr: 'मसाला डोसा',
    bn: 'মশলা দোসা',
    gu: 'મસાલા ઢોસા',
    pa: 'ਮਸਾਲਾ ਡੋਸਾ',
    or: 'ମସଲା ଦୋସା',
    ur: 'مصالحہ ڈوسا',
    as: 'মচলা দোচা'
  },
  'Masala Dosa': {
    en: 'Crisp Potato Crepe',
    hi: 'मसाला डोसा',
    kn: 'ಮಸಾಲೆ ದೋಸೆ',
    ta: 'மசாலா தோசை',
    te: 'మసాలా దోశ',
    ml: 'മസാല ദോശ',
    mr: 'मसाला डोसा',
    bn: 'মশলা দোসা',
    gu: 'મસાલા ઢોસા',
    pa: 'ਮਸਾਲਾ ਡੋਸਾ',
    or: 'ମସଲା ଦୋସା',
    ur: 'مصالحہ ڈوسا',
    as: 'মচলা দোচা'
  },

  // Green Palak Dosa
  'Green Palak Dosa (Spinach Lentil Crepe)': {
    en: 'Spinach & Lentil Crepe',
    hi: 'पालक डोसा (पालक दाल डोसा)',
    kn: 'ಪಾಲಕ್ ದೋಸೆ (ಪಾಲಕ್ ಸೊಪ್ಪಿನ ದೋಸೆ)',
    ta: 'பாலக் தோசை (பசலைக்கீரை தோசை)',
    te: 'పాలకూర దోశ',
    ml: 'ചീര ദോശ (പാലക് ദോശ)',
    mr: 'पालक डोसा',
    bn: 'পালং দোসা',
    gu: 'પાલક ઢોસા',
    pa: 'ਪਾਲਕ ਡੋਸਾ',
    or: 'ପାଳଙ୍ଗ ଦୋସା',
    ur: 'پالک ڈوسا',
    as: 'পালেং দোচা'
  },
  'Palak Dosa': {
    en: 'Spinach Lentil Crepe',
    hi: 'पालक डोसा',
    kn: 'ಪಾಲಕ್ ದೋಸೆ',
    ta: 'பாலக் தோசை',
    te: 'పాలకూర దోశ',
    ml: 'പാലക് ദോശ',
    mr: 'पालक डोसा',
    bn: 'পালং দোসা',
    gu: 'પાલક ઢોસા',
    pa: 'ਪਾਲਕ ਡੋਸਾ',
    or: 'ପାଳଙ୍ଗ ଦୋସା',
    ur: 'پالک ڈوسا',
    as: 'পালেং দোচা'
  },

  // Kanda Batata Poha / Thick Poha
  'Kanda Batata Poha / Thick Poha': {
    en: 'Flattened Rice with Onions & Potatoes',
    hi: 'कांदा बटाटा पोहा (प्याज़-आलू पोहा)',
    kn: 'ಕಾಂದಾ ಬಟಾಟೆ ಅವಲಕ್ಕಿ (ಈರುಳ್ಳಿ-ಆಲೂಗಡ್ಡೆ ಅವಲಕ್ಕಿ)',
    ta: 'வெங்காய உருளை அவல் (கந்தா பொஹா)',
    te: 'అటుకుల ఉప్మా (కాందా బటాటా పోహా)',
    ml: 'അവൽ ഉപ്പുമാവ് (പോഹ)',
    mr: 'कांदा बटाटा पोहे',
    bn: 'পেঁয়াজ আলুর চিঁড়ে (পোহা)',
    gu: 'કાંદા બટાકા પૌંઆ',
    pa: 'ਕਾਂਦਾ ਬਟਾਟਾ ਪੋਹਾ',
    or: 'ଚୁଡ଼ା ଉପମା (ପୋହା)',
    ur: 'پوہا (پیاز اور آلو والا)',
    as: 'চিৰাৰ পোৱা'
  },
  'Kanda Batata Poha': {
    en: 'Flattened Rice with Onions & Potatoes',
    hi: 'कांदा बटाटा पोहा',
    kn: 'ಕಾಂದಾ ಬಟಾಟೆ ಅವಲಕ್ಕಿ',
    ta: 'கந்தா பொஹா',
    te: 'కాందా బటాటా పోహా',
    ml: 'പോഹ',
    mr: 'कांदा बटाटा पोहे',
    bn: 'পোহা',
    gu: 'કાંદા બટાકા પૌંઆ',
    pa: 'ਕਾਂਦਾ ਬਟਾਟਾ ਪੋਹਾ',
    or: 'ଚୁଡ଼ା ପୋହା',
    ur: 'پوہا',
    as: 'পোৱা'
  },

  // Idli Vada Combo
  'Idli Vada Combo with Chutney & Sambar': {
    en: 'Steamed Rice Cakes & Lentil Fritters',
    hi: 'इडली वड़ा कॉम्बो चटनी और सांभर के साथ',
    kn: 'ಇಡ್ಲಿ ವಡೆ ಕಾಂಬೋ ಚಟ್ನಿ ಮತ್ತು ಸಾಂಬಾರ್ ಜೊತೆ',
    ta: 'இட்லி வடை காம்போ சட்னி சாம்பாருடன்',
    te: 'ఇడ్లీ వడ కాంబో చట్నీ సాంబారుతో',
    ml: 'ഇഡ്ഡലി വട കോമ്പോ ചട്നിയും സാമ്പാറും',
    mr: 'इडली वडा कॉम्बो चटणी आणि सांबारसह',
    bn: 'ইডলি বড়া কম্বো চাটনি ও সাম্বার সহ',
    gu: 'ઈડલી વડા કોમ્બો ચટણી અને સાંભાર સાથે',
    pa: 'ਇਡਲੀ ਵੜਾ ਕਾਂਬੋ ਚਟਨੀ ਅਤੇ ਸਾਂਭਰ ਨਾਲ',
    or: 'ଇଡଲି ବରା କମ୍ବୋ ଚଟଣି ଏବଂ ସାମ୍ବାର ସହିତ',
    ur: 'اڈلی بڑا کومبو چٹنی اور سانبھر کے ساتھ',
    as: 'ইডলী বৰা কম্বো চাটনি আৰু চম্বাৰৰ সৈতে'
  },

  // Kadai Paneer
  'Kadai Paneer (Mild Capsicum Cottage Cheese)': {
    en: 'Cottage Cheese with Bell Peppers',
    hi: 'कड़ाही पनीर (शिमला मिर्च और पनीर)',
    kn: 'ಕಡಾಯಿ ಪನೀರ್ (ಕ್ಯಾಪ್ಸಿಕಂ ಪನೀರ್ ಕರಿ)',
    ta: 'கடாய் பன்னீர் (குடைமிளகாய் பன்னீர்)',
    te: 'కడాయి పన్నీర్',
    ml: 'കടായ് പനീർ',
    mr: 'कढई पनीर',
    bn: 'কড়াই পনির',
    gu: 'કડાઈ પનીર',
    pa: 'ਕੜਾਹੀ ਪਨੀਰ',
    or: 'କଡ଼ାଇ ପନିର',
    ur: 'کڑاہی پنیر',
    as: 'কড়াই পনীৰ'
  },

  // Traditional Yellow Daal Tadka
  'Traditional Yellow Daal Tadka': {
    en: 'Tempered Yellow Lentil Curry',
    hi: 'दाल तड़का (पारंपरिक पीली दाल तड़का)',
    kn: 'ದಾಲ್ ತಡ್ಕಾ (ಒಗ್ಗರಣೆ ಬೇಳೆ ಸಾರು)',
    ta: 'தால் தட்கா (தாளித்த பருப்பு குழம்பு)',
    te: 'దాల్ తడ్కా (పోపు పప్పు)',
    ml: 'പരിപ്പ് കറി (ദാൽ തദ്ക)',
    mr: 'डाळ तडका (फोडणीचे वरण)',
    bn: 'ডাল তড়কা (ফোড়ন ডাল)',
    gu: 'દાળ તડકા (વઘારેલી તુવેર દાળ)',
    pa: 'ਦਾਲ ਤੜਕਾ',
    or: 'ଡାଲି ତଡ଼କା',
    ur: 'دال تڑکا',
    as: 'দাইল তৰকা'
  },

  // Sarson Ka Saag
  'Sarson Ka Saag (Mustard & Spinach Greens)': {
    en: 'Mustard & Spinach Greens Stew',
    hi: 'सरसों का साग (सरसों और पालक का साग)',
    kn: 'ಸಾಸಿವೆ ಸೊಪ್ಪಿನ ಸಾಗು (ಪಾಲಕ್ ಮತ್ತು ಸಾಸಿವೆ ಸೊಪ್ಪು)',
    ta: 'கடுகு கீரை சாக் (சர்சோன் கா சாக்)',
    te: 'ఆవకూర సాగ్ (సర్సోన్ కా సాగ్)',
    ml: 'കടുക് ചീര കറി (സർസോൻ കാ സാഗ്)',
    mr: 'सरसों का साग (मोहरीची पाने आणि पालक)',
    bn: 'সর্ষে শাকের তরকারি (সরসো কা সাগ)',
    gu: 'સરસવનું શાક (સરસોં કા સાગ)',
    pa: 'ਸਰ੍ਹੋਂ ਦਾ ਸਾਗ',
    or: 'ସୋରିଷ ଶାଗ ତରକାରି',
    ur: 'سرسوں کا ساگ',
    as: 'সৰিয়হ শাকৰ আঞ্জা'
  },

  // Gajar Ka Halwa
  'Gajar Ka Halwa / Carrot Halwa': {
    en: 'Warm Spiced Carrot Pudding',
    hi: 'गाजर का हलवा (देशी घी और दूध का हलवा)',
    kn: 'ಕ್ಯಾರೆಟ್ ಹಲ್ವಾ (ತುಪ್ಪ ಮತ್ತು ಹಾಲಿನ ಹಲ್ವಾ)',
    ta: 'கேரட் அல்வா',
    te: 'క్యారెట్ హల్వా',
    ml: 'കാരറ്റ് ഹൽവ',
    mr: 'गाजराचा हलवा',
    bn: 'গাজরের হালুয়া',
    gu: 'ગાજરનો હલવો',
    pa: 'ਗਾਜਰ ਦਾ ਹਲਵਾ',
    or: 'ଗାଜର ହାଲୱା',
    ur: 'گاجر کا حلوہ',
    as: 'গাজৰৰ হালুৱা'
  },

  // Pesarattu
  'Pesarattu (Whole Moong Sprouted Crepe)': {
    en: 'Sprouted Green Moong Crepe',
    hi: 'पेसरट्टू (साबुत मूंग डोसा)',
    kn: 'ಪೆಸರಟ್ಟು (ಹೆಸರುಕಾಳು ದೋಸೆ)',
    ta: 'பெசரட்டு (பாசிப்பயறு தோசை)',
    te: 'పెసరట్టు (ఆంధ్ర పెసరట్టు)',
    ml: 'പെസരട്ടു (ചെറുപയർ ദോശ)',
    mr: 'पेसरट्टू (हिरव्या मुगाचा डोसा)',
    bn: 'পেসারাত্তু (সবুজ মুগ ডালের দোসা)',
    gu: 'પેસરટ્ટુ (આખા મગનો ઢોસો)',
    pa: 'ਪੇਸਰੱਟੂ (ਸਾਬਤ ਮੂੰਗੀ ਦਾ ਡੋਸਾ)',
    or: 'ପେସରଟ୍ଟୁ (ମୁଗ ଦୋସା)',
    ur: 'پیسرٹو (مونگ دال ڈوسا)',
    as: 'পেচৰাট্টু (মগু দাইলৰ দোচা)'
  },

  // Mangalore Buns
  'Mangalore Buns (Banana-Fermented Sweet Puri)': {
    en: 'Banana-Fermented Spiced Puri',
    hi: 'मंगलौर बन्स (केले की मीठी पूरी)',
    kn: 'ಮಂಗಳೂರು ಬನ್ಸ್ (ಬಾಳೆಹಣ್ಣಿನ ಬನ್ಸ್)',
    ta: 'மங்களூர் பன்ஸ் (வாழைப்பழ பூரி)',
    te: 'మంగళూరు బన్స్ (అరటిపండు పూరీ)',
    ml: 'മംഗലാപുരം ബൺസ് (ഏത്തപ്പഴ പൂരി)',
    mr: 'मंगलोर बन्स (केळ्याची गोड पुरी)',
    bn: 'ম্যাঙ্গালোর বানস (কলার মিষ্টি পুরি)',
    gu: 'મેંગલોર બન્સ (કેળાની મીઠી પૂરી)',
    pa: 'ਮੰਗਲੋਰ ਬੰਸ (ਕੇਲੇ ਦੀ ਮਿੱਠੀ ਪੂਰੀ)',
    or: 'ମାଙ୍ଗାଲୋର ବନ୍ସ (କଦଳୀ ପୁରୀ)',
    ur: 'منگلور بنس (کیلے کی میٹھی پوری)',
    as: 'মাংগালোৰ বানচ'
  },

  // Karnataka Traditional Vegetable Palav
  'Karnataka Traditional Vegetable Palav': {
    en: 'Traditional Spiced Vegetable Pilaf',
    hi: 'सब्जियों का पुलाव (कर्नाटक पारंपरिक पुलाव)',
    kn: 'ತರಕಾರಿ ಪಲಾವ್ (ಕರ್ನಾಟಕ ಶೈಲಿಯ ತರಕಾರಿ ಬಾತ್)',
    ta: 'காய்கறி புலாவ் (கர்நாடக வெஜ் புலாவ்)',
    te: 'కూరగాయల పులావ్',
    ml: 'വെജിറ്റബിൾ പുലാവ്',
    mr: 'भाज्यांचा पुलाव (व्हेज पुलाव)',
    bn: 'সবজি পোলাও',
    gu: 'વેજીટેબલ પુલાવ',
    pa: 'ਸਬਜ਼ੀ ਪੁਲਾਓ',
    or: 'ପନିପରିବା ପଲାଉ',
    ur: 'سبزیوں کا پلاؤ',
    as: 'শাক-পাচলিৰ পোলাও'
  },

  // Soya Chunk Pulao
  'Soya Chunk Pulao (High-Protein Pilaf)': {
    en: 'High-Protein Soya Pilaf',
    hi: 'सोया चंक पुलाव (प्रोटीन युक्त पुलाव)',
    kn: 'ಸೋಯಾ ಪುಲಾವ್ (ಪ್ರೋಟೀನ್ ಭರಿತ ಪುಲಾವ್)',
    ta: 'சோயா சங்க் புலாவ்',
    te: 'సోయా చంక్స్ పులావ్',
    ml: 'സോയ ചങ്ക് പുലാവ്',
    mr: 'सोया चंक्स पुलाव',
    bn: 'সয়াবিন চাঙ্ক পোলাও',
    gu: 'સોયા ચંક પુલાવ',
    pa: 'ਸੋਇਆ ਚੰਕ ਪੁਲਾਓ',
    or: 'ସୋୟା ଚଙ୍କ ପଲାଉ',
    ur: 'سویا چنک پلاؤ',
    as: 'চয়া চাংক পোলাও'
  },

  // Spiced Vegetable Tikkis
  'Spiced Vegetable Tikkis (Nutritious Veg Cutlets)': {
    en: 'Spiced Nutrient Vegetable Cutlets',
    hi: 'वेजिटेबल टिक्की (पौष्टिक वेज कटलेट)',
    kn: 'ತರಕಾರಿ ಕಟ್ಲೆಟ್ (ಪೌಷ್ಟಿಕ ತರಕಾರಿ ತಿಕ್ಕಿ)',
    ta: 'காய்கறி கட்லெட்',
    te: 'కూరగాయల కట్లెట్',
    ml: 'വെജിറ്റബിൾ കട്ട്ലറ്റ്',
    mr: 'व्हेज कटलेट (भाज्यांची टिक्की)',
    bn: 'সবজি কাটলেট',
    gu: 'વેજ કટલેટ (શાકભાજી ટીક્કી)',
    pa: 'ਵੈੱਜ ਕਟਲੇਟ (ਸਬਜ਼ੀ ਟਿੱਕੀ)',
    or: 'ପନିପରିବା କଟଲେଟ୍',
    ur: 'سبزیوں کی ٹکیاں',
    as: 'শাক-পাচলিৰ কাটলেট'
  },

  // Whole-Wheat Toasted Vegetable Sandwich
  'Whole-Wheat Toasted Vegetable Sandwich': {
    en: 'Whole-Wheat Toasted Sandwich',
    hi: 'होल व्हीट टोस्टेड वेज सैंडविच',
    kn: 'ಗೋಧಿ ಹಿಟ್ಟಿನ ಟೋಸ್ಟೆಡ್ ವೆಜ್ ಸ್ಯಾಂಡ್‌ವಿಚ್',
    ta: 'கோதுமை டோஸ்ட் வெஜிடபிள் சாண்ட்விச்',
    te: 'గోధుమ వెజ్ శాండ్‌విచ్',
    ml: 'ഹോൾ വീറ്റ് വെജിറ്റബിൾ സാൻഡ്‌വിച്ച്',
    mr: 'गव्हाचा टोस्टेड व्हेजिटेबल सँडविच',
    bn: 'হোল হুইট টোস্টেড ভেজিটেবল স্যান্ডউইচ',
    gu: 'હોલ વ્હીટ ટોસ્ટેડ વેજ સેન્ડવીચ',
    pa: 'ਹੋਲ ਵ੍ਹੀਟ ਟੋਸਟਡ ਵੈੱਜ ਸੈਂਡਵਿਚ',
    or: 'ଗହମ ଟୋଷ୍ଟେଡ୍ ପନିପରିବା ସାଣ୍ଡୱିଚ୍',
    ur: 'ہول وہٹ ٹوسٹڈ سینڈوچ',
    as: 'হোল হুইট টোষ্টেড চেণ্ডউইচ'
  },

  // Kala Chana Sundal
  'Kala Chana Sundal (Black Chickpea Salad)': {
    en: 'Tempered Black Chickpeas with Coconut',
    hi: 'काला चना सुंडल (नारियल लगा चना चाट)',
    kn: 'ಕಡಲೆ ಕಾಳು ಉಸಲಿ (ಕಾಯಿ ತುರಿದ ಕಡಲೆ ಸುಂಡಲ್)',
    ta: 'கொண்டைக்கடலை சுண்டல் (கருப்பு கடலை சுண்டல்)',
    te: 'నల్ల శనగల గుగ్గిళ్ళు (సుండల్)',
    ml: 'കടല സുണ്ടൽ (കറുത്ത കടല)',
    mr: 'काळे चणे उसळ (सुंडल)',
    bn: 'কালো চানা সুন্দল',
    gu: 'કાળા ચણા સુન્ડલ',
    pa: 'ਕਾਲੇ ਛੋਲੇ ਸੁੰਦਲ',
    or: 'କଳା ଚଣା ସୁଣ୍ଡଲ',
    ur: 'کالے چنے سنڈل',
    as: 'কলা বুটৰ সুন্দল'
  },

  // Vankaya Pachadi
  'Vankaya Pachadi (Roasted Brinjal Chutney)': {
    en: 'Fire-Roasted Spiced Brinjal Chutney',
    hi: 'वांकाया पचड़ी (भुने बैंगन की चटनी)',
    kn: 'ಬದನೆಕಾಯಿ ಚಟ್ನಿ (ಸುಟ್ಟ ಬದನೆಕಾಯಿ ಗೊಜ್ಜು)',
    ta: 'கத்தரிக்காய் பச்சடி',
    te: 'వంకాయ పచ్చడి (కాల్చిన వంకాయ పచ్చడి)',
    ml: 'വഴുതനങ്ങ പച്ചടി',
    mr: 'वांग्याचे भरीत चटणी',
    bn: 'বেগুন পোড়া চাটনি (পাচাড়ি)',
    gu: 'રીંગણની ચટણી (વાંકાયા પચડી)',
    pa: 'ਬੈਂਗਣ ਦੀ ਚਟਣੀ (ਪਚੜੀ)',
    or: 'ବାଇଗଣ ଚଟଣି',
    ur: 'بینگن کی چٹنی',
    as: 'বেঙেনাৰ চাটনি'
  },

  // Fresh Maternal Sliced Fruit Platter
  'Fresh Maternal Sliced Fruit Platter': {
    en: 'Assorted Fresh Prenatal Fruits',
    hi: 'ताजा कटे फल (गर्भावस्था पौष्टिक फ्रूट प्लेटर)',
    kn: 'ತಾಜಾ ಹಣ್ಣುಗಳ ತಟ್ಟೆ (ಪೌಷ್ಟಿಕ ಹಣ್ಣುಗಳ ಸಲಾಡ್)',
    ta: 'புதிய நறுக்கிய பழங்கள் தட்டு',
    te: 'తాజా పండ్ల ముక్కలు',
    ml: 'പഴങ്ങളുടെ തട്ട് (ഫ്രഷ് ഫ്രൂട്ട്സ്)',
    mr: 'ताजी फळे (फ्रूट प्लेटर)',
    bn: 'তাজা ফলের থালা',
    gu: 'તાજા ફળોની થાળી',
    pa: 'ਤਾਜ਼ੇ ਫਲਾਂ ਦੀ ਪਲੇਟ',
    or: 'ତାଜା ଫଳ ଥାଳି',
    ur: 'تازہ کٹے ہوئے پھل',
    as: 'সতেজ ফল-মূলৰ থালী'
  },

  // Fresh Avocado Guacamole
  'Fresh Avocado Guacamole / Avocado Mash': {
    en: 'Creamy Avocado Dip with Lime & Herbs',
    hi: 'ताजा एवोकैडो गुआकामोल (एवोकैडो मैश)',
    kn: 'ಆವಕಾಡೊ ಬೆಣ್ಣೆಹಣ್ಣಿನ ಮ್ಯಾಶ್',
    ta: 'அவகேடோ கூழ் (குவாக்கமோல்)',
    te: 'ఆవకాడో మాష్ (గువాకమోల్)',
    ml: 'ആവക്കാഡോ മാഷ്',
    mr: 'अ‍ॅव्होकॅडो गुआकामोल',
    bn: 'অ্যাভোকাডো গুয়াকামোল',
    gu: 'એવોકાડો ગુઆકામોલ',
    pa: 'ਐਵੋਕਾਡੋ ਗੁਆਕਾਮੋਲ',
    or: 'ଆଭୋକାଡୋ ଗୁଆକାମୋଲ',
    ur: 'ایواکاڈو گواکامول',
    as: 'এভোকাডো গুৱাকামোল'
  },

  // Mango Chia Seed Pudding
  'Mango Chia Seed Pudding': {
    en: 'Chilled Chia Pudding with Sweet Mango',
    hi: 'मैंगो चिया सीड पुडिंग (आम और चिया पुडिंग)',
    kn: 'ಮಾವಿನಕಾಯಿ ಚಿಯಾ ಪುಡಿಂಗ್',
    ta: 'மாம்பழ சியா விதை புடிங்',
    te: 'మామిడి చియా సీడ్ పుడ్డింగ్',
    ml: 'മാമ്പഴ ചിയ പുഡ്ഡിംഗ്',
    mr: 'आंबा चिया पुडिंग',
    bn: 'আম চিয়া বীজ পুডিং',
    gu: 'મેંગો ચિયા સીડ પુડિંગ',
    pa: 'ਅੰਬ ਚੀਆ ਪੁਡਿੰਗ',
    or: 'ଆମ୍ବ ଚିଆ ସିଡ୍ ପୁଡିଙ୍ଗ',
    ur: 'مینگو چیا سیڈ پڈنگ',
    as: 'আম চিয়া চিড পুডিং'
  },

  // Mango-Banana Chia Smoothie Bowl
  'Mango-Banana Chia Smoothie Bowl': {
    en: 'Nutrient Mango-Banana Chia Bowl',
    hi: 'मैंगो बनाना चिया स्मूदी बाउल',
    kn: 'ಮಾವಿನ-ಬಾಳೆ ಚಿಯಾ ಸ್ಮೂದಿ ಬೌಲ್',
    ta: 'மாம்பழம் வாழைப்பழம் சியா ஸ்மூதி கிண்ணம்',
    te: 'మామిడి అరటి చియా స్మూతీ బౌల్',
    ml: 'മാമ്പഴ ഏത്തപ്പഴ ചിയ സ്മൂത്തി ബോൾ',
    mr: 'मँगो बनाना चिया स्मूदी बाऊल',
    bn: 'আম কলা চিয়া স্মুদি বাউল',
    gu: 'મેંગો બનાના ચિયા સ્મૂધી બાઉલ',
    pa: 'ਅੰਬ ਕੇਲਾ ਚੀਆ ਸਮੂਦੀ ਬਾਊਲ',
    or: 'ଆମ୍ବ କଦଳୀ ଚିଆ ସ୍ମୁଦି ବାଉଲ',
    ur: 'مینگو بنانا چیا سمودی باؤل',
    as: 'আম কল চিয়া স্মুদী বাউল'
  },

  // Coastal Indian Fish Curry
  'Coastal Indian Fish Curry (Low-Mercury Rohu/Sardine)': {
    en: 'Coastal Fish Curry with Coconut & Tamarind',
    hi: 'मछली करी (तटीय भारतीय फिश करी)',
    kn: 'ಮೀನು ಸಾರು (ಕರಾವಳಿ ಶೈಲಿಯ ಮೀನು ಸಾರು)',
    ta: 'மீன் குழம்பு (கடற்கரை மீன் கறி)',
    te: 'చేపల పులుసు (తీరప్రాంత చేపల కూర)',
    ml: 'മീൻ കറി (തീരദേശ മീൻ കറി)',
    mr: 'कोकणी माशांचे कालवण',
    bn: 'মাছের ঝোল (উপকূলীয় মাছের কারি)',
    gu: 'દરિયાઈ માછલી કરી',
    pa: 'ਮੱਛੀ ਦੀ ਤਰੀ (ਫਿਸ਼ ਕਰੀ)',
    or: 'ମାଛ ତରକାରି (ଝୋଳ)',
    ur: 'مچھلی کا سالن',
    as: 'মাছৰ জোল'
  },

  // Mangalore Kori / Chicken Sukka
  'Mangalore Kori / Chicken Sukka': {
    en: 'Dry Spiced Coconut Chicken',
    hi: 'चिकन सुक्का (मंगलौर कोरी सुक्का)',
    kn: 'ಕೋಳಿ ಸುಕ್ಕ (ಕುಡ್ಲದ ಕೋಳಿ ಅಜಾದಿನ)',
    ta: 'சிக்கன் சுக்கா (மங்களூர் கோழி சுக்கா)',
    te: 'చికెన్ సుక్కా (కొబ్బరి చికెన్ ఫ్రై)',
    ml: 'ചിക്കൻ സുക്ക (കോഴി അജാദിന)',
    mr: 'चिकन सुक्का (मंगलोरी कोरी सुक्का)',
    bn: 'চিকেন সুক্কা (ম্যাঙ্গালোর স্টাইল চিকেন)',
    gu: 'ચિકન સુક્કા (કોકોનટ ચિકન)',
    pa: 'ਚਿਕਨ ਸੁੱਕਾ',
    or: 'ଚିକେନ୍ ସୁକ୍କା',
    ur: 'چکن سکھا',
    as: 'চিকেন চুক্কা'
  },

  // Homestyle Egg Gravy Curry
  'Homestyle Egg Gravy Curry': {
    en: 'Mild Spiced Boiled Egg Curry',
    hi: 'अंडा करी (घरेलू अंडा ग्रेवी करी)',
    kn: 'ಮೊಟ್ಟೆ ಸಾರು (ಮನೆ ಶೈಲಿಯ ಮೊಟ್ಟೆ ಸಾರು)',
    ta: 'முட்டை குழம்பு',
    te: 'కోడిగుడ్డు కూర (గుడ్డు పులుసు)',
    ml: 'മുട്ട കറി',
    mr: 'अंडा रस्सा करी',
    bn: 'ডিমের ডালনা / কারি',
    gu: 'ઈંડાની કરી (એગ કરી)',
    pa: 'ਆਂਡਾ ਕਰੀ',
    or: 'ଅଣ୍ଡା ତରକାରି',
    ur: 'انڈہ سالن',
    as: 'কণীৰ আঞ্জা'
  },

  // Spiced Pulav with Chicken Gravy
  'Spiced Pulav with Chicken Gravy': {
    en: 'Fragrant Rice with Mild Chicken Gravy',
    hi: 'पुलाव चिकन करी के साथ',
    kn: 'ಪುಲಾವ್ ಮತ್ತು ಕೋಳಿ ಸಾರು',
    ta: 'புலாவ் மற்றும் சிக்கன் குழம்பு',
    te: 'పులావ్ మరియు చికెన్ గ్రేవీ',
    ml: 'പുലാവ് ചിക്കൻ കറിയോടൊപ്പം',
    mr: 'पुलाव आणि चिकन रस्सा',
    bn: 'পোলাও ও মুরগির মাংসের ঝোল',
    gu: 'પુલાવ ચિકન ગ્રેવી સાથે',
    pa: 'ਪੁਲਾਓ ਚਿਕਨ ਕਰੀ ਨਾਲ',
    or: 'ପଲାଉ ଚିକେନ୍ ଝୋଳ ସହିତ',
    ur: 'پلاؤ چکن سالن کے ساتھ',
    as: 'পোলাও আৰু চিকেনৰ জোল'
  },

  // Malnad Koli Kajjaya
  'Malnad Koli Kajjaya (Chicken with Steamed Dumplings)': {
    en: 'Malnad Chicken with Steamed Dumplings',
    hi: 'कोली कज्जाय (मलेनाडु चिकन कज्जाय)',
    kn: 'ಮಲೆನಾಡು ಕೋಳಿ ಕಜ್ಜಾಯ',
    ta: 'கோழி கஜ்ஜாயா',
    te: 'కోడి కజ్జాయ',
    ml: 'കോഴി കജ്ജായ',
    mr: 'कोळी कज्जाया',
    bn: 'কোলি কাজ্জায়া',
    gu: 'કોલી કજ્જાયા',
    pa: 'ਕੋਲੀ ਕੱਜਾਇਆ',
    or: 'କୋଲି କଜ୍ଜାୟା',
    ur: 'کولی کجایا',
    as: 'কোলী কাজ্জায়া'
  }
};

// 2. Unicode script base offsets for Brahmic scripts in India
const SCRIPT_BASE_OFFSETS: Record<string, number> = {
  hi: 0x0900, // Devanagari
  mr: 0x0900,
  bho: 0x0900,
  mai: 0x0900,
  sa: 0x0900,
  ne: 0x0900,
  ks: 0x0900,
  kok: 0x0900,
  bn: 0x0980, // Bengali
  as: 0x0980,
  pa: 0x0A00, // Gurmukhi
  gu: 0x0A80, // Gujarati
  or: 0x0B00, // Odia
  ta: 0x0B80, // Tamil
  te: 0x0C00, // Telugu
  kn: 0x0C80, // Kannada
  ml: 0x0D00  // Malayalam
};

/**
 * Transliterates text written in an Indian script (e.g. Kannada "ಚಿತ್ರಾನ್ನ")
 * into the target language's script (e.g. Devanagari "चित्रान्ना" for Hindi/Marathi).
 */
export function transliterateIndianScript(text: string, targetLangCode: string): string {
  if (!text || targetLangCode === 'en') return text;

  const targetBase = SCRIPT_BASE_OFFSETS[targetLangCode] || 0x0900;

  // Check if text already has characters from the target script
  let hasTargetScript = false;
  for (let i = 0; i < text.length; i++) {
    const code = text.charCodeAt(i);
    if (code >= targetBase && code <= targetBase + 0x7F) {
      hasTargetScript = true;
      break;
    }
  }
  if (hasTargetScript) {
    return text;
  }

  // Find source script base
  let sourceBase: number | null = null;
  for (let i = 0; i < text.length; i++) {
    const code = text.charCodeAt(i);
    for (const base of Object.values(SCRIPT_BASE_OFFSETS)) {
      if (code >= base && code <= base + 0x7F) {
        sourceBase = base;
        break;
      }
    }
    if (sourceBase !== null) break;
  }

  if (sourceBase === null || sourceBase === targetBase) {
    return text;
  }

  // Map characters
  return text
    .split('')
    .map((ch) => {
      const code = ch.charCodeAt(0);
      if (code >= sourceBase! && code <= sourceBase! + 0x7F) {
        const offset = code - sourceBase!;
        // Handle special Tamil mappings where certain consonants/vowels are merged
        if (targetBase === 0x0B80) {
          // Tamil has no aspirated stops or voiced stops in standard block
          const mappedCode = targetBase + offset;
          return String.fromCharCode(mappedCode);
        }
        return String.fromCharCode(targetBase + offset);
      }
      return ch;
    })
    .join('');
}

/**
 * Returns true if the text contains characters from a specific Indian script
 */
export function isTextInScript(text: string, langCode: string): boolean {
  if (!text) return false;
  const base = SCRIPT_BASE_OFFSETS[langCode];
  if (!base) return false;
  for (let i = 0; i < text.length; i++) {
    const code = text.charCodeAt(i);
    if (code >= base && code <= base + 0x7F) {
      return true;
    }
  }
  return false;
}

// Common culinary term mappings for Indian dishes across major languages
const CULINARY_DESCRIPTOR_MAP: Record<string, Record<string, string>> = {
  'lemon rice': { hi: 'नींबू चावल', kn: 'ನಿಂಬೆಹಣ್ಣಿನ ಅನ್ನ', ta: 'எலுமிச்சை சாதம்', te: 'నిమ్మకాయ అన్నం', ml: 'നാരങ്ങാ ചോറ്' },
  'curd rice': { hi: 'दही चावल', kn: 'ಮೊಸರನ್ನ', ta: 'தயிர் சாதம்', te: 'పెరుగన్నం', ml: 'തൈര് സാദം' },
  'finger millet': { hi: 'रागी (मंडुआ)', kn: 'ರಾಗಿ', ta: 'கேழ்வரகு (ராகி)', te: 'రాగి', ml: 'റാഗി' },
  'millet ball': { hi: 'रागी मुड्डे (मडुआ बॉल)', kn: 'ರಾಗಿ ಮುದ್ದೆ', ta: 'ராகி களி', te: 'రాగి ముద్ద', ml: 'റാഗി ഉണ്ട' },
  'sorghum': { hi: 'ज्वार', kn: 'ಜೋಳ', ta: 'சோளம்', te: 'జొన్న', ml: 'ചോളം' },
  'flatbread': { hi: 'रोटी / चपाती', kn: 'ರೊಟ್ಟಿ', ta: 'ரொட்டி', te: 'రొట్టె', ml: 'റൊട്ടി' },
  'spinach': { hi: 'पालक', kn: 'ಪಾಲಕ್', ta: 'பசலைக்கீரை', te: 'పాలకూర', ml: 'ചീര' },
  'cottage cheese': { hi: 'पनीर', kn: 'ಪನೀರ್', ta: 'பன்னீர்', te: 'పనీర్', ml: 'പനീർ' },
  'paneer': { hi: 'पनीर', kn: 'ಪನೀರ್', ta: 'பன்னீர்', te: 'పనీర్', ml: 'പനീർ' },
  'lentil': { hi: 'दाल', kn: 'ಬೇಳೆ', ta: 'பருப்பு', te: 'పప్పు', ml: 'പരിപ്പ്' },
  'lentils': { hi: 'दाल', kn: 'ಬೇಳೆ', ta: 'பருப்பு', te: 'పప్పు', ml: 'പരിപ്പ്' },
  'steamed cakes': { hi: 'इडली (भाप से बने केक)', kn: 'ಇಡ್ಲಿ', ta: 'இட்லி', te: 'ఇడ్లీ', ml: 'ഇഡ്ഡലി' },
  'crepe': { hi: 'डोसा', kn: 'ದೋಸೆ', ta: 'தோசை', te: 'దోశ', ml: 'ദോശ' },
  'pancake': { hi: 'डोसा / चीला', kn: 'ದೋಸೆ', ta: 'தோசை', te: 'దోశ', ml: 'ദോശ' },
  'porridge': { hi: 'दलिया / खीर', kn: 'ಗಂಜಿ / ಪಾಯಸ', ta: 'கஞ்சி / பாயாசம்', te: 'జావ / పాయసం', ml: 'കഞ്ഞി' },
  'pudding': { hi: 'खीर / हलवा', kn: 'ಪಾಯಸ', ta: 'பாயாசம்', te: 'పాయసం', ml: 'പായസം' },
  'fenugreek': { hi: 'मेथी', kn: 'ಮೆಂತ್ಯ', ta: 'வெந்தயம்', te: 'మెంతులు', ml: 'ഉലുവ' },
  'peanuts': { hi: 'मूंगफली', kn: 'ಕಡಲೆಕಾಯಿ', ta: 'வேர்க்கடலை', te: 'వేరుశనగ', ml: 'നിലക്കടല' }
};

/**
 * Clean and validate text for the target language.
 * Guarantees that Kannada script NEVER appears when Hindi, Tamil, Telugu, Malayalam, or English is selected.
 */
export function sanitizeScriptForLanguage(text: string, targetLang: string): string {
  if (!text) return '';
  const lang = targetLang || 'en';

  // 1. If target is NOT Kannada, remove ANY Kannada characters (\u0C80-\u0CFF)
  if (lang !== 'kn' && /[\u0C80-\u0CFF]/.test(text)) {
    // If string has a divider e.g. "ಚಿತ್ರಾನ್ನ / Lemon Rice"
    const parts = text.split(/[/|()]/);
    for (const p of parts) {
      const clean = p.trim();
      if (clean && !/[\u0C80-\u0CFF]/.test(clean)) {
        return clean;
      }
    }
    return '';
  }

  // 2. If target is NOT Tamil, remove Tamil characters
  if (lang !== 'ta' && /[\u0B80-\u0BFF]/.test(text)) {
    return '';
  }

  // 3. If target is NOT Telugu, remove Telugu characters
  if (lang !== 'te' && /[\u0C00-\u0C7F]/.test(text)) {
    return '';
  }

  // 4. If target is NOT Malayalam, remove Malayalam characters
  if (lang !== 'ml' && /[\u0D00-\u0D7F]/.test(text)) {
    return '';
  }

  return text.trim();
}

/**
 * Single source of truth for food subtitles.
 * STRICT LAW: The output ALWAYS matches the selected language.
 * When Hindi is selected, it will NEVER display Kannada text like "ಚಿತರನ್ನ",
 * but instead Hindi text like "चित्रान्ना (नींबू चावल)".
 */
export function getFoodLocalizedSubtitle(
  foodName: string,
  fallbackRegionalName?: string,
  currentLanguageCode: string = 'en'
): string {
  const cleanName = (foodName || '').trim();
  const lang = currentLanguageCode || 'en';

  // 1. English Mode:
  if (lang === 'en') {
    // If the food name has parenthetical English subtitle e.g. "Chitranna (Lemon Rice with Peanuts)"
    const parenMatch = cleanName.match(/\(([^)]+)\)/);
    if (parenMatch) {
      return sanitizeScriptForLanguage(parenMatch[1].trim(), 'en');
    }
    // If cleanName has a slash
    if (cleanName.includes('/')) {
      const parts = cleanName.split('/');
      return sanitizeScriptForLanguage(parts[1].trim(), 'en');
    }
    return '';
  }

  // 2. Exact Match in Comprehensive Translations:
  if (COMPREHENSIVE_FOOD_TRANSLATIONS[cleanName]) {
    const entry = COMPREHENSIVE_FOOD_TRANSLATIONS[cleanName];
    if (entry[lang]) return sanitizeScriptForLanguage(entry[lang], lang);
    // Fallbacks for dialects
    const fallbackMap: Record<string, string> = {
      bho: 'hi',
      mai: 'hi',
      kok: 'mr',
      ks: 'hi',
      ne: 'hi',
      sa: 'hi',
      mni: 'bn',
      sat: 'or'
    };
    const fbLang = fallbackMap[lang];
    if (fbLang && entry[fbLang]) return sanitizeScriptForLanguage(entry[fbLang], lang);
    if ((lang === 'hi' || fbLang === 'hi') && entry['hi']) return sanitizeScriptForLanguage(entry['hi'], lang);
  }

  // 3. Normalized / Base Name Match:
  const baseName = cleanName.replace(/\s*\([^)]+\)/g, '').split('/')[0].trim();
  if (baseName && baseName !== cleanName && COMPREHENSIVE_FOOD_TRANSLATIONS[baseName]) {
    const entry = COMPREHENSIVE_FOOD_TRANSLATIONS[baseName];
    if (entry[lang]) return sanitizeScriptForLanguage(entry[lang], lang);
    if (lang === 'hi' && entry['hi']) return sanitizeScriptForLanguage(entry['hi'], lang);
  }

  // 4. Check parenthetical English description in CULINARY_DESCRIPTOR_MAP
  const parenMatch = cleanName.match(/\(([^)]+)\)/);
  if (parenMatch) {
    const descriptor = parenMatch[1].trim().toLowerCase();
    for (const [key, trans] of Object.entries(CULINARY_DESCRIPTOR_MAP)) {
      if (descriptor.includes(key) && trans[lang]) {
        return sanitizeScriptForLanguage(trans[lang], lang);
      }
    }
  }

  // 5. Fuzzy Substring Match in COMPREHENSIVE_FOOD_TRANSLATIONS:
  for (const [key, entry] of Object.entries(COMPREHENSIVE_FOOD_TRANSLATIONS)) {
    if (
      cleanName.toLowerCase().startsWith(key.toLowerCase()) ||
      key.toLowerCase().startsWith(cleanName.toLowerCase()) ||
      (baseName && key.toLowerCase().includes(baseName.toLowerCase()))
    ) {
      if (entry[lang]) return sanitizeScriptForLanguage(entry[lang], lang);
      if (lang === 'hi' && entry['hi']) return sanitizeScriptForLanguage(entry['hi'], lang);
    }
  }

  // 6. Fallback Regional Name check (STRICTLY VALIDATED FOR TARGET SCRIPT):
  if (fallbackRegionalName && fallbackRegionalName.trim()) {
    const cleanReg = fallbackRegionalName.trim();

    // Check if regionalName itself exists as key
    if (COMPREHENSIVE_FOOD_TRANSLATIONS[cleanReg] && COMPREHENSIVE_FOOD_TRANSLATIONS[cleanReg][lang]) {
      return sanitizeScriptForLanguage(COMPREHENSIVE_FOOD_TRANSLATIONS[cleanReg][lang], lang);
    }

    // Only use cleanReg directly if it matches target language script
    if (isTextInScript(cleanReg, lang)) {
      return sanitizeScriptForLanguage(cleanReg, lang);
    }

    // Convert source script to target script ONLY if target is Kannada or source script is known
    // CRITICAL: NEVER output Kannada script when target is NOT Kannada
    if (lang === 'kn') {
      if (/[\u0C80-\u0CFF]/.test(cleanReg)) {
        return cleanReg;
      }
      const transliterated = transliterateIndianScript(cleanReg, 'kn');
      if (transliterated) return transliterated;
    }
  }

  return '';
}
