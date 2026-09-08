/**
 * delivery_data.ts
 * Predefined items and details for the Smart Delivery Store feature.
 */

export interface EssentialItem {
  id: string;
  name: Record<string, string>;
  category: 'grocery' | 'medicine' | 'baby';
  description: Record<string, string>;
  benefits: Record<string, string>;
  imageUrl: string;
  searchQuery: string;
  priceEstimate: string;
}

export const ESSENTIALS_DATABASE: EssentialItem[] = [
  // GROCERIES
  {
    id: "spinach",
    name: {
      en: "Fresh Spinach / Drumstick Leaves",
      kn: "ತಾಜಾ ಪಾಲಕ್ ಸೊಪ್ಪು / ನುಗ್ಗೆ ಸೊಪ್ಪು",
      hi: "ताजा पालक / सहजन के पत्ते",
      ta: "பசலைக்கீரை / முருங்கை கீரை",
      te: "పాలకూర / మునగాకు"
    },
    category: 'grocery',
    description: {
      en: "Organically grown dark green leafy vegetables rich in iron and folate.",
      kn: "ಕಬ್ಬಿಣಾಂಶ ಮತ್ತು ಫೋಲೇಟ್‌ನಿಂದ ಸಮೃದ್ಧವಾಗಿರುವ ಸಾವಯವ ಹಸಿರು ಎಲೆ ತರಕಾರಿಗಳು.",
      hi: "आयरन और फोलेट से भरपूर जैविक रूप से उगाई गई गहरे रंग की पत्तेदार सब्जियां।",
      ta: "இரும்புச்சத்து மற்றும் ஃபோலேட் நிறைந்த இயற்கை முறையில் விளைவிக்கப்பட்ட கீரை.",
      te: "ఐరన్ మరియు ఫోలేట్ అధికంగా ఉండే సేంద్రీయ ఆకుకూరలు."
    },
    benefits: {
      en: "Boosts hemoglobin levels, prevents maternal anemia, and supports baby neural tube growth.",
      kn: "ಹಿಮೋಗ್ಲೋಬಿನ್ ಹೆಚ್ಚಿಸುತ್ತದೆ, ರಕ್ತಹೀನತೆ ತಡೆಗಟ್ಟುತ್ತದೆ ಮತ್ತು ಮಗುವಿನ ನರಮಂಡಲದ ಬೆಳವಣಿಗೆಗೆ ಸಹಾಯ ಮಾಡುತ್ತದೆ.",
      hi: "हीमोग्लोबिन के स्तर को बढ़ाता है, एनीमिया को रोकता है और बच्चे के मस्तिष्क विकास में मदद करता है।",
      ta: "இரத்த சோகையைத் தடுக்கிறது, உடலுக்குத் தேவையான இரும்புச்சத்தை அளிக்கிறது.",
      te: "రక్తహీనతను నివారిస్తుంది, హిమోగ్లోబిన్ శాతాన్ని మెరుగుపరుస్తుంది."
    },
    imageUrl: "https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=300&q=80",
    searchQuery: "Fresh Spinach",
    priceEstimate: "₹30 - ₹50"
  },
  {
    id: "ragi_flour",
    name: {
      en: "Organic Ragi Flour (Finger Millet)",
      kn: "ಸಾವಯವ ರಾಗಿ ಹಿಟ್ಟು",
      hi: "रागी का आटा (फिंगर बाजरा)",
      ta: "கேழ்வரகு மாவு (ராகி)",
      te: "రాగి పిండి"
    },
    category: 'grocery',
    description: {
      en: "100% stone-ground high-calcium finger millet flour, ideal for healthy South Indian cooking.",
      kn: "೧೦೦% ಕಲ್ಲಿನಿಂದ ಬೀಸಿದ ಹೆಚ್ಚಿನ ಕ್ಯಾಲ್ಸಿಯಂ ಹೊಂದಿರುವ ರಾಗಿ ಹಿಟ್ಟು.",
      hi: "उच्च कैल्शियम वाला पारंपरिक रूप से पिसा हुआ रागी का आटा।",
      ta: "அதிக கால்சியம் சத்து கொண்ட பாரம்பரிய கேழ்வரகு மாவு.",
      te: "అధిక క్యాల్షియం కలిగిన సంప్రదాయ రాగి పిండి."
    },
    benefits: {
      en: "Extremely rich in calcium for baby's bone development and fiber to control gestational diabetes.",
      kn: "ಮಗುವಿನ ಮೂಳೆಗಳ ಬೆಳವಣಿಗೆಗೆ ಕ್ಯಾಲ್ಸಿಯಂ ಮತ್ತು ಗರ್ಭಾವಸ್ಥೆಯ ಮಧುಮೇಹ ನಿಯಂತ್ರಣಕ್ಕೆ ನಾರಿನಾಂಶ ನೀಡುತ್ತದೆ.",
      hi: "बच्चे के हड्डियों के विकास के लिए कैल्शियम और मधुमेह नियंत्रित करने के लिए फाइबर प्रदान करता है।",
      ta: "குழந்தையின் எலும்பு வளர்ச்சிக்கு கால்சியம் மற்றும் சர்க்கரையை கட்டுப்படுத்த நார்ச்சத்து அளிக்கிறது.",
      te: "పిండం ఎముకల బలానికి క్యాల్షియం మరియు రక్తంలో చక్కెర నివారణకు పీచు పదార్థం లభిస్తుంది."
    },
    imageUrl: "https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=300&q=80",
    searchQuery: "Ragi Flour 1kg",
    priceEstimate: "₹60 - ₹80"
  },
  {
    id: "curd_milk",
    name: {
      en: "Organic Milk & Fresh Curd",
      kn: "ಸಾವಯವ ಹಾಲು ಮತ್ತು ತಾಜಾ ಮೊಸರು",
      hi: "जैविक दूध और ताजा दही",
      ta: "பசும்பால் மற்றும் புதிய தயிர்",
      te: "సేంద్రీయ పాలు & తాజా పెరుగు"
    },
    category: 'grocery',
    description: {
      en: "Fresh, pasteurized organic dairy products loaded with natural calcium and active probiotics.",
      kn: "ನೈಸರ್ಗಿಕ ಕ್ಯಾಲ್ಸಿಯಂ ಮತ್ತು ಪ್ರೋಬಯಾಟಿಕ್ಸ್ ಹೊಂದಿರುವ ತಾಜಾ ಡೈರಿ ಉತ್ಪನ್ನಗಳು.",
      hi: "प्राकृतिक कैल्शियम और सक्रिय प्रोबायोटिक्स से भरपूर ताजा डेयरी उत्पाद।",
      ta: "இயற்கை கால்சியம் மற்றும் நன்மை தரும் பாக்டீரியாக்கள் நிறைந்த பால் பொருட்கள்.",
      te: "క్యాల్షియం మరియు ప్రోబయోటిక్స్ సమృద్ధిగా ఉండే తాజా పాల ఉత్పత్తులు."
    },
    benefits: {
      en: "Promotes healthy gut microbiome, reduces pregnancy acidity/heartburn, and builds baby's skeleton.",
      kn: "ಜೀರ್ಣಕ್ರಿಯೆ ಸುಧಾರಿಸುತ್ತದೆ, ಎದೆಯುರಿ ಕಡಿಮೆ ಮಾಡುತ್ತದೆ ಮತ್ತು ಮಗುವಿನ ಮೂಳೆಗಳನ್ನು ಬಲಪಡಿಸುತ್ತದೆ.",
      hi: "पाचन में सुधार करता है, एसिडिटी कम करता है और बच्चे के कंकाल का निर्माण करता है।",
      ta: "செரிமானத்தை மேம்படுத்துகிறது, நெஞ்செரிச்சல் மற்றும் அசிடிட்டியைக் குறைக்கிறது.",
      te: "జీర్ణక్రియను మెరుగుపరుస్తుంది, ఎసిడిటీని తగ్గిస్తుంది, పిండం ఎముకలకు మేలు చేస్తుంది."
    },
    imageUrl: "https://images.unsplash.com/photo-1563636619-e9143da7973b?w=300&q=80",
    searchQuery: "Fresh Curd",
    priceEstimate: "₹40 - ₹90"
  },
  {
    id: "paneer",
    name: {
      en: "Fresh Malai Paneer (Cottage Cheese)",
      kn: "ತಾಜಾ ಪನೀರ್",
      hi: "ताजा पनीर",
      ta: "புதிய பன்னீர்",
      te: "తాజా పనీర్"
    },
    category: 'grocery',
    description: {
      en: "Soft, high-quality paneer rich in milk proteins and fat-soluble vitamins.",
      kn: "ಹಾಲಿನ ಪ್ರೋಟೀನ್ ಮತ್ತು ಜೀವಸತ್ವಗಳಿಂದ ಸಮೃದ್ಧವಾಗಿರುವ ಮೃದುವಾದ ಪನೀರ್.",
      hi: "दूध के प्रोटीन और विटामिन से भरपूर मुलायम ताजा पनीर।",
      ta: "உடலுக்குத் தேவையான புரதச்சத்துக்கள் நிறைந்த மென்மையான பன்னீர்.",
      te: "పాల ప్రోటీన్లు అధికంగా ఉండే మృదువైన పనీర్."
    },
    benefits: {
      en: "Supplies premium protein required for rapid fetal maternal cell and tissue growth.",
      kn: "ಮಗುವಿನ ಜೀವಕೋಶಗಳು ಮತ್ತು ಅಂಗಾಂಶಗಳ ಬೆಳವಣಿಗೆಗೆ ಅಗತ್ಯವಾದ ಉತ್ತಮ ಗುಣಮಟ್ಟದ ಪ್ರೋಟೀನ್ ನೀಡುತ್ತದೆ.",
      hi: "शिशु के अंगों और कोशिकाओं के तेजी से विकास के लिए आवश्यक प्रोटीन प्रदान करता है।",
      ta: "குழந்தையின் உடல் திசுக்கள் மற்றும் செல்கள் வளர உதவுகிறது.",
      te: "పిండం కణాల ఎదుగుదలకు అవసరమైన ప్రోటీన్ అందిస్తుంది."
    },
    imageUrl: "https://images.unsplash.com/photo-1618411640018-97109ff60df8?w=300&q=80",
    searchQuery: "Fresh Paneer 200g",
    priceEstimate: "₹100 - ₹140"
  },
  {
    id: "eggs",
    name: {
      en: "Country Brown Eggs (Free Range)",
      kn: "ನಾಟಿ ಕೋಳಿ ಮೊಟ್ಟೆಗಳು",
      hi: "देसी अंडे (ब्राउन)",
      ta: "நாட்டுக்கோழி முட்டை",
      te: "నాటు కోడి గుడ్లు"
    },
    category: 'grocery',
    description: {
      en: "Free-range brown eggs packed with complete protein and essential choline.",
      kn: "ಪ್ರೋಟೀನ್ ಮತ್ತು ಕೋಲೀನ್ ಸತ್ವದಿಂದ ತುಂಬಿರುವ ನಾಟಿ ಕೋಳಿ ಮೊಟ್ಟೆಗಳು.",
      hi: "प्रोटीन और आवश्यक कोलीन से भरपूर देसी भूरे अंडे।",
      ta: "முழுமையான புரதச்சத்து மற்றும் கோலின் சத்துக்கள் கொண்ட நாட்டு முட்டை.",
      te: "ప్రోటీన్ మరియు కోలిన్ పోషకాలు సమృద్ధిగా ఉండే కోడిగుడ్లు."
    },
    benefits: {
      en: "Choline is critical for baby brain development, spinal cord synthesis, and preventing birth defects.",
      kn: "ಮಗುವಿನ ಮೆದುಳಿನ ಬೆಳವಣಿಗೆಗೆ ಮತ್ತು ಜನ್ಮಜಾತ ದೋಷಗಳ ತಡೆಗಟ್ಟುವಿಕೆಗೆ ಕೋಲೀನ್ ಅತ್ಯಂತ ಪ್ರಮುಖವಾಗಿದೆ.",
      hi: "कोलीन बच्चे के मस्तिष्क के विकास और जन्मजात विकारों को रोकने के लिए अत्यंत महत्वपूर्ण है।",
      ta: "குழந்தையின் மூளை வளர்ச்சிக்கும் நரம்பு மண்டல ஆரோக்கியத்திற்கும் சிறந்தது.",
      te: "శిశువు మెదడు అభివృద్ధికి మరియు నరాల ఆరోగ్యానికి ఎంతో అవసరం."
    },
    imageUrl: "https://images.unsplash.com/photo-1506976785307-8732e854ad03?w=300&q=80",
    searchQuery: "Organic Brown Eggs 6pcs",
    priceEstimate: "₹70 - ₹90"
  },
  {
    id: "bananas",
    name: {
      en: "Robusta / Yelakki Bananas",
      kn: "ಏಲಕ್ಕಿ ಬಾಳೆಹಣ್ಣು",
      hi: "इलायची केला / रोबस्टा",
      ta: "ஏலக்கி / செவ்வாழை பழம்",
      te: "ఏలకుల అరటిపండు / రోబస్టా"
    },
    category: 'grocery',
    description: {
      en: "Fresh sweet local bananas rich in potassium and Vitamin B6.",
      kn: "ಪೊಟ್ಯಾಸಿಯಮ್ ಮತ್ತು ಜೀವಸತ್ವ ಬಿ೬ ಹೊಂದಿರುವ ಸಿಹಿ ಬಾಳೆಹಣ್ಣುಗಳು.",
      hi: "पोटेशियम और विटामिन बी6 से भरपूर ताजे मीठे केले।",
      ta: "பொட்டாசியம் மற்றும் வைட்டமின் பி6 நிறைந்த புதிய வாழைப்பழங்கள்.",
      te: "పొటాషియం మరియు విటమిన్ బి6 కలిగిన తీపి అరటిపండ్లు."
    },
    benefits: {
      en: "Vitamin B6 significantly reduces morning sickness, pregnancy nausea, and balances electrolytes.",
      kn: "ವಿಟಮಿನ್ ಬಿ೬ ಗರ್ಭಿಣಿಯರಲ್ಲಿ ವಾಕರಿಕೆ ಮತ್ತು ಬೆಳಗ್ಗಿನ ಸುಸ್ತನ್ನು ಕಡಿಮೆ ಮಾಡುತ್ತದೆ.",
      hi: "विटामिन बी6 सुबह की कमजोरी (मॉर्निंग सिकनेस) और जी मिचलाना कम करता है।",
      ta: "காலை சோர்வு மற்றும் குமட்டலை பெருமளவு குறைக்கிறது.",
      te: "ఉదయపు వికారం మరియు వాంతులను అరికట్టడానికి ఉపయోగపడుతుంది."
    },
    imageUrl: "https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=300&q=80",
    searchQuery: "Yelakki Banana 500g",
    priceEstimate: "₹40 - ₹60"
  },
  {
    id: "dates",
    name: {
      en: "Premium Medjool Dates (Khajur)",
      kn: "ಉತ್ತಮ ಗುಣಮಟ್ಟದ ಖರ್ಜೂರ",
      hi: "प्रीमियम खजूर",
      ta: "பிரீமியம் பேரீச்சம்பழம்",
      te: "ఖర్జూరం"
    },
    category: 'grocery',
    description: {
      en: "Naturally sweet, iron-rich, and soft fiber dates.",
      kn: "ನೈಸರ್ಗಿಕ ಸಿಹಿ, ಕಬ್ಬಿಣಾಂಶ ಮತ್ತು ನಾರಿನಾಂಶ ಹೊಂದಿರುವ ಮೃದು ಖರ್ಜೂರ.",
      hi: "आयरन और फाइबर से भरपूर प्राकृतिक रूप से मीठे खजूर।",
      ta: "இரும்புச்சத்து மற்றும் நார்ச்சத்து நிறைந்த இயற்கை இனிப்பு பேரீச்சை.",
      te: "ఐరన్ మరియు పీచు పదార్థం అధికంగా ఉండే ఖర్జూర పండ్లు."
    },
    benefits: {
      en: "Relieves severe pregnancy constipation, provides instant natural energy, and aids in natural labor preparation.",
      kn: "ಮಲಬದ್ಧತೆ ನಿವಾರಿಸುತ್ತದೆ, ತಕ್ಷಣದ ಶಕ್ತಿ ನೀಡುತ್ತದೆ ಮತ್ತು ಹೆರಿಗೆಯ ಸುಲಭತೆಗೆ ಸಹಾಯ ಮಾಡುತ್ತದೆ.",
      hi: "कब्ज से राहत दिलाता है, तुरंत ऊर्जा देता है और प्रसव को आसान बनाने में मदद करता है।",
      ta: "மலச்சிக்கலை குணமாக்குகிறது, உடலுக்கு உடனடி ஆற்றலை அளிக்கிறது.",
      te: "మలబద్ధకాన్ని నివారిస్తుంది, తక్షణ శక్తిని ఇస్తుంది, సుఖప్రసవానికి దోహదపడుతుంది."
    },
    imageUrl: "https://images.unsplash.com/photo-1505252585461-04db1ebb846a?w=300&q=80",
    searchQuery: "Premium Dates 500g",
    priceEstimate: "₹250 - ₹450"
  },
  {
    id: "sesame_seeds",
    name: {
      en: "Sesame Seeds / Til Chikki",
      kn: "ಎಳ್ಳು ಮತ್ತು ಎಳ್ಳು ಚಿಕ್ಕಿ",
      hi: "तिल / तिल की चिक्की",
      ta: "எள் மற்றும் எள் மிட்டாய்",
      te: "నువ్వులు / నువ్వుల చిక్కీ"
    },
    category: 'grocery',
    description: {
      en: "Premium hulled white/black sesame seeds and jaggery candies.",
      kn: "ಕ್ಯಾಲ್ಸಿಯಂ ಮತ್ತು ಆರೋಗ್ಯಕರ ಕೊಬ್ಬು ಹೊಂದಿರುವ ಎಳ್ಳು ಉಂಡೆ ಅಥವಾ ಚಿಕ್ಕಿ.",
      hi: "कैल्शियम से भरपूर सफेद/काले तिल और गुड़ से बनी चिक्की।",
      ta: "கால்சியம் நிறைந்த எள் மற்றும் வெல்லம் கலந்த மிட்டாய்.",
      te: "క్యాల్షియం అధికంగా ఉండే నువ్వులు మరియు బెల్లం అచ్చులు."
    },
    benefits: {
      en: "Excellent combination of non-dairy calcium and organic iron for pregnancy bone health (avoid in 1st trimester).",
      kn: "ಮೂಳೆಗಳ ಆರೋಗ್ಯಕ್ಕೆ ಅಗತ್ಯವಾದ ಸಸ್ಯಜನ್ಯ ಕ್ಯಾಲ್ಸಿಯಂ ಮತ್ತು ಕಬ್ಬಿಣಾಂಶ ನೀಡುತ್ತದೆ (೧ನೇ ತ್ರೈಮಾಸಿಕದಲ್ಲಿ ಬಳಸಬೇಡಿ).",
      hi: "हड्डियों की मजबूती के लिए कैल्शियम और आयरन का बेहतरीन स्रोत (पहली तिमाही में सेवन से बचें)।",
      ta: "கால்சியம் மற்றும் இரும்புச்சத்தின் சிறந்த கலவை (முதல் மூன்று மாதங்களில் தவிர்க்கவும்).",
      te: "క్యాల్షియం మరియు ఐరన్ సమతుల్యంగా లభిస్తుంది (మొదటి త్రైమాసికంలో నివారించండి)."
    },
    imageUrl: "https://images.unsplash.com/photo-1536630596251-b01b630d07cc?w=300&q=80",
    searchQuery: "Til Chikki Pack",
    priceEstimate: "₹80 - ₹120"
  },

  // MEDICINES & OTC PRODUCTS
  {
    id: "pregnancy_pillow",
    name: {
      en: "Ergonomic C-Shaped Pregnancy Pillow",
      kn: "ಗರ್ಭಿಣಿಯರ ಆರಾಮದಾಯಕ ದಿಂಬು",
      hi: "सी-शेप गर्भावस्था तकिया (Pregnancy Pillow)",
      ta: "கர்ப்பகால சொகுசு தலையணை",
      te: "గర్భధారణ సౌకర్యవంతమైన దిండు"
    },
    category: 'medicine',
    description: {
      en: "Full-body contouring premium microfiber pillow designed for side-sleeping comfort during pregnancy.",
      kn: "ಗರ್ಭಾವಸ್ಥೆಯಲ್ಲಿ ಪಕ್ಕಕ್ಕೆ ಮಲಗಲು ಆರಾಮ ನೀಡುವ ಪೂರ್ಣ ದೇಹದ ದಿಂಬು.",
      hi: "गर्भावस्था में आरामदायक नींद और सपोर्ट के लिए विशेष सी-शेप तकिया।",
      ta: "கர்ப்பிணிகள் பக்கவாட்டில் படுத்து உறங்குவதற்கு வசதியான முழு உடல் தலையணை.",
      te: "గర్భవతులు పక్కకు పడుకోవడానికి వీలుగా రూపొందించిన ప్రత్యేక దిండు."
    },
    benefits: {
      en: "Relieves hip, pelvic, and lower back pain, prevents flat-on-back sleeping, and improves blood flow to placenta.",
      kn: "ನಡುನೋವು, ಸೊಂಟದ ನೋವು ನಿವಾರಿಸುತ್ತದೆ ಮತ್ತು ಗರ್ಭಾಶಯಕ್ಕೆ ರಕ್ತ ಪರಿಚಲನೆ ಉತ್ತಮಗೊಳಿಸುತ್ತದೆ.",
      hi: "पीठ, कूल्हों और पेल्विक दर्द से राहत देता है, और गर्भाशय में रक्त प्रवाह को बढ़ाता है।",
      ta: "இடுப்பு மற்றும் முதுகு வலியை குறைக்கிறது, இரத்த ஓட்டத்தை சீராக்குகிறது.",
      te: "నడుము నొప్పిని తగ్గిస్తుంది, పిండానికి రక్త ప్రసరణను మెరుగుపరుస్తుంది."
    },
    imageUrl: "https://images.unsplash.com/photo-1584132967334-10e028bd69f7?w=300&q=80",
    searchQuery: "Maternity Pregnancy Pillow C Shape",
    priceEstimate: "₹999 - ₹1,499"
  },
  {
    id: "compression_socks",
    name: {
      en: "Maternity Compression Socks (Class 1)",
      kn: "ಗರ್ಭಿಣಿಯರ ಕಂಪ್ರೆಷನ್ ಸಾಕ್ಸ್",
      hi: "मातृत्व संपीड़न मोज़े (Compression Socks)",
      ta: "கர்ப்பகால பிரத்யேக காலுறைகள்",
      te: "గర్భవతుల కంప్రెషన్ సాక్స్"
    },
    category: 'medicine',
    description: {
      en: "Graduated mild pressure class 1 socks that facilitate upward blood circulation from ankles.",
      kn: "ಕಾಲಿನ ಪಾದಗಳಲ್ಲಿ ಮತ್ತು ಹಿಮ್ಮಡಿಯಲ್ಲಿ ರಕ್ತ ಪರಿಚಲನೆ ಸುಧಾರಿಸುವ ಸಾಕ್ಸ್.",
      hi: "पैरों की सूजन कम करने और रक्त संचार सुधारने के लिए संपीड़न मोज़े।",
      ta: "கால்களில் இரத்த ஓட்டத்தை அதிகரித்து வீக்கத்தைக் குறைக்கும் காலுறைகள்.",
      te: "కాళ్ల వాపులను తగ్గించి రక్త ప్రసరణను పెంచే ప్రత్యేక సాక్స్."
    },
    benefits: {
      en: "Improves leg blood circulation, prevents varicose veins, and dramatically reduces painful foot swelling (edema).",
      kn: "ಕಾಲುಗಳ ಊತ (ಎಡಿಮಾ) ಮತ್ತು ಕಾಲು ನೋವನ್ನು ಗಮನಾರ್ಹವಾಗಿ ಕಡಿಮೆ ಮಾಡುತ್ತದೆ.",
      hi: "पैरों की सूजन (एडिमा) और वैरिकोज वेंस को रोकने में अत्यधिक प्रभावी।",
      ta: "கால்களில் ஏற்படும் நீர்வீக்கம் மற்றும் வலிக்கு சிறந்த தீர்வு.",
      te: "కాళ్ల వాపు (ఎడిమా) మరియు నరాల వాపును సమర్థవంతంగా నివారిస్తుంది."
    },
    imageUrl: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=300&q=80",
    searchQuery: "Maternity Compression Stockings",
    priceEstimate: "₹399 - ₹699"
  },
  {
    id: "prenatal_vitamins",
    name: {
      en: "Premium Prenatal Multi-Vitamins (with Folate)",
      kn: "ಗರ್ಭಿಣಿಯರ ಮಲ್ಟಿ-ವಿಟಮಿನ್ ಮಾತ್ರೆಗಳು",
      hi: "प्रीमियम प्रसव पूर्व मल्टीविटामिन (फोलिक एसिड युक्त)",
      ta: "மகப்பேறுக்கு முந்தைய மல்டிவைட்டமின் மாத்திரைகள்",
      te: "గర్భిణీ మల్టీ-విటమిన్ టాబ్లెట్లు"
    },
    category: 'medicine',
    description: {
      en: "Doctor-approved prenatal daily capsules with high bioavailability of Methylfolate and Gentle Iron.",
      kn: "ವೈದ್ಯರಿಂದ ಶಿಫಾರಸು ಮಾಡಲ್ಪಟ್ಟ ಫೋಲಿಕ್ ಆಸಿಡ್ ಮತ್ತು ಕಬ್ಬಿಣಾಂಶದ ದೈನಂದಿನ ಕ್ಯಾಪ್ಸೂಲ್‌ಗಳು.",
      hi: "डॉक्टर द्वारा अनुशंसित दैनिक फोलिक एसिड और आयरन सप्लीमेंट कैप्सूल।",
      ta: "ஃபோலிக் அமிலம் மற்றும் இரும்புச்சத்து அடங்கிய மருத்துவர் பரிந்துரைத்த மாத்திரைகள்.",
      te: "వైద్యులు ధృవీకరించిన ఫోలిక్ యాసిడ్ మరియు ఐరన్ సప్లిమెంట్లు."
    },
    benefits: {
      en: "Prevents neural tube defects (NTDs) in the baby, protects against low birth weight, and supports maternal immune health.",
      kn: "ಮಗುವಿನಲ್ಲಿ ಜನ್ಮಜಾತ ದೋಷಗಳನ್ನು ತಡೆಯುತ್ತದೆ ಮತ್ತು ತಾಯಿಯ ರೋಗನಿರೋಧಕ ಶಕ್ತಿಯನ್ನು ಹೆಚ್ಚಿಸುತ್ತದೆ.",
      hi: "बच्चे के रीढ़ की हड्डी के विकारों को रोकता है और माता की रोग प्रतिरोधक क्षमता को बढ़ाता है।",
      ta: "குழந்தையின் நரம்புக் குழாய் குறைபாடுகளைத் தடுக்கிறது, நோய் எதிர்ப்புச் சக்தியை கூட்டுகிறது.",
      te: "శిశువు పుట్టుక లోపాలను నివారిస్తుంది, గర్భిణీ రోగనిరోధక శక్తిని పెంచుతుంది."
    },
    imageUrl: "https://images.unsplash.com/photo-1584017911766-d451b3d0e843?w=300&q=80",
    searchQuery: "Prenatal Multivitamins with Methylfolate",
    priceEstimate: "₹450 - ₹750"
  },
  {
    id: "digital_thermometer",
    name: {
      en: "High-Precision Digital Body Thermometer",
      kn: "ಡಿಜಿಟಲ್ ದೇಹ ತಾಪಮಾನ ಮಾಪಕ",
      hi: "डिजिटल थर्मामीटर",
      ta: "டிஜிட்டல் வெப்பமானி",
      te: "డిజిటల్ థర్మామీటర్"
    },
    category: 'medicine',
    description: {
      en: "Clinical-grade digital thermometer with quick, 10-second precise body temperature reading.",
      kn: "ತ್ವರಿತ ಮತ್ತು ನಿಖರವಾದ ದೇಹದ ಉಷ್ಣಾಂಶವನ್ನು ಅಳೆಯುವ ಡಿಜಿಟಲ್ ಥರ್ಮಾಮೀಟರ್.",
      hi: "तेज़ और सटीक शारीरिक तापमान मापने वाला डिजिटल थर्मामीटर।",
      ta: "உடல் வெப்பநிலையை துல்லியமாகவும் விரைவாகவும் அளவிடும் டிஜிட்டல் மீட்டர்.",
      te: "శరీర ఉష్ణోగ్రతను ఖచ్చితంగా కొలిచే డిజిటల్ మీటర్."
    },
    benefits: {
      en: "Allows safe home monitoring of fever spikes, protecting the sensitive fetus from prolonged heat exposure.",
      kn: "ಜ್ವರ ಬಂದಾಗ ಮನೆಯಲ್ಲೇ ಜಾಗರೂಕತೆಯಿಂದ ದೇಹದ ಉಷ್ಣತೆಯನ್ನು ಪರೀಕ್ಷಿಸಲು ಅತ್ಯಗತ್ಯ ಸಾಧನ.",
      hi: "घर पर बुखार की सटीक निगरानी में मदद करता है ताकि शिशु को नुकसान न पहुंचे।",
      ta: "காய்ச்சலைக் கண்காணித்து ஆபத்தான வெப்ப அதிகரிப்பை வீட்டில் இருந்தே அறிய உதவுகிறது.",
      te: "ఇంట్లోనే జ్వరాన్ని పర్యవేక్షించడానికి మరియు శిశువు రక్షణకు అవసరమైన పరికరం."
    },
    imageUrl: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=300&q=80",
    searchQuery: "Digital Thermometer Medical Grade",
    priceEstimate: "₹180 - ₹299"
  },
  {
    id: "pregnancy_belt",
    name: {
      en: "Maternity Pelvic Support Belt",
      kn: "ಗರ್ಭಾವಸ್ಥೆಯ ಸೊಂಟದ ಪಟ್ಟಿ (Pregnancy Belt)",
      hi: "मातृत्व पेल्विक सपोर्ट बेल्ट (Pregnancy Belt)",
      ta: "கர்ப்பகால இடுப்பு ஆதரவு பட்டி",
      te: "గర్భధారణ పెల్విక్ సపోర్ట్ బెల్ట్"
    },
    category: 'medicine',
    description: {
      en: "Fully adjustable pelvic and abdominal weight distribution brace with soft elastic fabric.",
      kn: "ಗರ್ಭಿಣಿಯರ ಹೊಟ್ಟೆಯ ತೂಕವನ್ನು ಸಮನಾಗಿ ಹಂಚುವ ಮತ್ತು ಸೊಂಟಕ್ಕೆ ಆಧಾರ ನೀಡುವ ಪಟ್ಟಿ.",
      hi: "गर्भावस्था के दौरान पेट और कमर को सहारा देने वाली समायोज्य बेल्ट।",
      ta: "முதுகு மற்றும் வயிற்றுப் பகுதியைத் தாங்கிப் பிடிக்கும் நெகிழ்வான சப்போர்ட் பெல்ட்.",
      te: "వెన్నునొప్పి మరియు పొత్తికడుపు బరువును సమతుల్యం చేసే సపోర్ట్ బెల్ట్."
    },
    benefits: {
      en: "Reduces pelvic pressure, supports correct posture, and alleviates round ligament pain when walking.",
      kn: "ಹೊಟ್ಟೆಯ ಕೆಳಭಾಗದ ಒತ್ತಡವನ್ನು ಕಡಿಮೆ ಮಾಡುತ್ತದೆ ಮತ್ತು ನಡಿಗೆಯಲ್ಲಿ ಆರಾಮ ನೀಡುತ್ತದೆ.",
      hi: "पेल्विक दबाव को कम करता है, चलने में आराम देता है और दर्द से राहत दिलाता है।",
      ta: "கருப்பை அழுத்தத்தை குறைக்கிறது, கர்ப்பிணிகள் தடையின்றி நடமாட உதவுகிறது.",
      te: "నడుముపై ఒత్తిడిని తగ్గిస్తుంది, గర్భిణీలు సులభంగా నడవడానికి తోడ్పడుతుంది."
    },
    imageUrl: "https://images.unsplash.com/photo-1590156221122-c748c78f8a6b?w=300&q=80",
    searchQuery: "Maternity Support Belt Abdominal Brace",
    priceEstimate: "₹650 - ₹1,200"
  },
  {
    id: "calcium_tablets",
    name: {
      en: "Calcium & Vitamin D3 Tablets",
      kn: "ಕ್ಯಾಲ್ಸಿಯಂ ಮತ್ತು ವಿಟಮಿನ್ ಡಿ೩ ಮಾತ್ರೆಗಳು",
      hi: "कैल्शियम और विटामिन डी3 सप्लीमेंट",
      ta: "கால்சியம் மற்றும் வைட்டமின் டி3 மாத்திரைகள்",
      te: "క్యాల్షియం & విటమిన్ డి3 టాబ్లెట్లు"
    },
    category: 'medicine',
    description: {
      en: "High absorption Calcium Carbonate or Citrate paired with Vitamin D3.",
      kn: "ದೇಹಕ್ಕೆ ಬೇಗನೆ ಹೀರಿಕೊಳ್ಳುವ ಕ್ಯಾಲ್ಸಿಯಂ ಮತ್ತು ವಿಟಮಿನ್ ಡಿ೩ ಮಾತ್ರೆಗಳು.",
      hi: "हड्डियों की मजबूती के लिए उच्च अवशोषण क्षमता वाला कैल्शियम और विटामिन डी3।",
      ta: "உடலில் எளிதில் உறிஞ்சப்படும் கால்சியம் மற்றும் வைட்டமின் டி3 மாத்திரைகள்.",
      te: "ఎముకల బలానికి సులభంగా గ్రహించబడే క్యాల్షియం మరియు విటమిన్ డి3."
    },
    benefits: {
      en: "Ensures baby's teeth and bone mineralization, prevents pregnancy osteoporosis and dental cavities.",
      kn: "ಮಗುವಿನ ಹಲ್ಲು ಮತ್ತು ಮೂಳೆಗಳ ಬೆಳವಣಿಗೆಗೆ ಮುಖ್ಯವಾಗಿದೆ ಮತ್ತು ತಾಯಿಯ ಹಲ್ಲು ನಷ್ಟ ತಪ್ಪಿಸುತ್ತದೆ.",
      hi: "बच्चे के दांतों और हड्डियों को मजबूत बनाता है और माता की हड्डियों को कमजोर होने से रोकता है।",
      ta: "குழந்தையின் எலும்புகளை வலுவாக்குகிறது, தாயின் பல் சொத்தையைத் தடுக்கிறது.",
      te: "శిశువు దంతాలు, ఎముకల ఎదుగుదలకు ఉపయోగపడుతుంది, తల్లి ఎముకల బలాన్ని కాపాడుతుంది."
    },
    imageUrl: "https://images.unsplash.com/photo-1616671285410-449e7bdfb776?w=300&q=80",
    searchQuery: "Calcium with Vitamin D3 Tablets",
    priceEstimate: "₹150 - ₹350"
  },

  // BABY CARE PRODUCTS
  {
    id: "baby_diapers",
    name: {
      en: "Premium Organic Bamboo Baby Diapers",
      kn: "ಸಾವಯವ ಬಿದಿರಿನ ಮೃದು ಬೇಬಿ ಡೈಪರ್ಸ್",
      hi: "प्रीमियम ऑर्गेनिक बैम्बू बेबी डायपर (Bamboo Diapers)",
      ta: "மூங்கில் நாராலான இயற்கை பேபி டைப்பர்ஸ்",
      te: "సేంద్రీయ వెదురు బేబీ డైపర్లు"
    },
    category: 'baby',
    description: {
      en: "Chemical-free, biodegradable, ultra-breathable soft bamboo fiber diapers with high absorption.",
      kn: "ರಾಸಾಯನಿಕ ಮುಕ್ತ, ಪರಿಸರಸ್ನೇಹಿ ಮತ್ತು ಅತಿ ಹೆಚ್ಚು ಹೀರಿಕೊಳ್ಳುವ ಮೃದು ಬೇಬಿ ಡೈಪರ್‌ಗಳು.",
      hi: "केमिकल-मुक्त, प्राकृतिक बांस के रेशों से बने अत्यधिक शोषक मखमली डायपर।",
      ta: "ரசாயனங்கள் இல்லாத, எளிதில் மட்கக்கூடிய, அதிக உறிஞ்சும் தன்மை கொண்ட காதுவட்ட டைப்பர்கள்.",
      te: "రసాయనాలు లేని, పర్యావరణానికి మేలు చేసే అధిక శోషణ కలిగిన డైపర్లు."
    },
    benefits: {
      en: "Completely hypoallergenic, prevents nasty diaper rashes, and keeps newborn skin dry for 12 hours.",
      kn: "ಚರ್ಮದ ಅಲರ್ಜಿ ಮತ್ತು ಡೈಪರ್ ದದ್ದುಗಳನ್ನು ತಡೆಗಟ್ಟುತ್ತದೆ, ಮಗುವಿನ ಚರ್ಮವನ್ನು ಒಣದಾಗಿರಿಸುತ್ತದೆ.",
      hi: "त्वचा को एलर्जी और रैश से बचाता है, बच्चे की नाजुक त्वचा को सूखा और स्वस्थ रखता है।",
      ta: "ஒவ்வாமை மற்றும் அரிப்பைத் தடுக்கிறது, குழந்தையின் மென்மையான தோலை உலர வைக்கிறது.",
      te: "అలర్జీలు రాకుండా కాపాడుతుంది, పసిపాప సున్నితమైన చర్మాన్ని పొడిగా ఉంచుతుంది."
    },
    imageUrl: "https://images.unsplash.com/photo-1522850400380-6018c24fd2bc?w=300&q=80",
    searchQuery: "Organic Bamboo Baby Diapers New Born",
    priceEstimate: "₹450 - ₹799"
  },
  {
    id: "baby_wipes",
    name: {
      en: "99% Pure Water Fragrance-Free Baby Wipes",
      kn: "೯೯% ಶುದ್ಧ ನೀರಿನ ಬೇಬಿ ವೈಪ್ಸ್",
      hi: "99% शुद्ध पानी से बने सुगंध-रहित बेबी वाइप्स",
      ta: "99% தூய நீர் வாசனைற்ற பேபி வைப்ஸ்",
      te: "99% స్వచ్ఛమైన నీటి బేబీ వైప్స్"
    },
    category: 'baby',
    description: {
      en: "Thick, ultra-soft pure water wipes made with zero alcohol, parabens, or chemical fragrance.",
      kn: "ಆಲ್ಕೋಹಾಲ್ ಮತ್ತು ರಾಸಾಯನಿಕ ರಹಿತ, ೯೯% ನೀರಿನಿಂದ ತಯಾರಿಸಿದ ಮೃದು ಒದ್ದೆ ಬಟ್ಟೆಗಳು (Wipes).",
      hi: "अल्कोहल और केमिकल रहित, नाजुक त्वचा के लिए पूरी तरह सुरक्षित गीले वाइप्स।",
      ta: "மதுசாரம் மற்றும் ரசாயனம் இல்லாத மென்மையான ஈரமான துடைப்பான்கள்.",
      te: "ఆల్కహాల్ మరియు రసాయనాలు లేని పసిపాపకు సురక్షితమైన తడి తుడుపులు."
    },
    benefits: {
      en: "Ensures gentle cleaning of baby stools without drying the skin or causing contact dermatitis.",
      kn: "ಮಗುವಿನ ಕೋಮಲ ಚರ್ಮವನ್ನು ಒಣಗಿಸದೆ ನೈಸರ್ಗಿಕವಾಗಿ ಸ್ವಚ್ಛಗೊಳಿಸುತ್ತದೆ.",
      hi: "त्वचा को रूखा किए बिना या रैशेज पैदा किए बिना बच्चे की कोमलता से सफाई करता है।",
      ta: "குழந்தையின் மென்மையான தோலை காயப்படுத்தாமல் சுத்தமாக்க உதவுகிறது.",
      te: "చర్మాన్ని పొడిబారకుండా, అలర్జీ రాకుండా సున్నితంగా శుభ్రం చేస్తుంది."
    },
    imageUrl: "https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19?w=300&q=80",
    searchQuery: "99 Percent Pure Water Baby Wipes Fragrance Free",
    priceEstimate: "₹120 - ₹250"
  },
  {
    id: "baby_soap",
    name: {
      en: "Tear-Free Gentle Baby Body Wash & Soap",
      kn: "ಕಣ್ಣೀರು ತಾರದ ಮೃದು ಮಗುವಿನ ಸೋಪು ಮತ್ತು ಸ್ನಾನದ ದ್ರವ",
      hi: "टियर-फ्री कोमल बेबी सोप और बॉडी वॉश",
      ta: "கண்ணீர் வராத மென்மையான பேபி சோப்",
      te: "కన్నీరు రాని సున్నితమైన బేబీ బాడీ వాష్ & సోప్"
    },
    category: 'baby',
    description: {
      en: "Sulfate-free, pH balanced gentle baby skin cleanser with natural coconut oil extract.",
      kn: "ಕೊಬ್ಬರಿ ಎಣ್ಣೆಯ ಅಂಶ ಹೊಂದಿರುವ, ಮಗುವಿನ ಕಣ್ಣಿಗೆ ಉರಿ ಉಂಟುಮಾಡದ ಮೃದು ಸೋಪು.",
      hi: "सल्फेट-मुक्त, पीएच संतुलित कोमल साबुन जो आंखों में आंसू नहीं लाता।",
      ta: "சல்பேட் இல்லாத, குழந்தையின் கண்களை வலிக்க செய்யாத மென்மையான குளியல் சோப்.",
      te: "సల్ఫేట్లు లేని, కళ్లకు హాని చేయని సున్నితమైన బేబీ సోప్."
    },
    benefits: {
      en: "Cleanses without stripping natural oils, maintaining the skin's acidic mantle protection.",
      kn: "ಮಗುವಿನ ಚರ್ಮದ ನೈಸರ್ಗಿಕ ಮೃದುತ್ವ ಮತ್ತು ಎಣ್ಣೆಯಂಶವನ್ನು ಕಾಪಾಡುತ್ತದೆ.",
      hi: "त्वचा की प्राकृतिक नमी को छीने बिना कोमलता से सफाई करता है।",
      ta: "குழந்தையின் தோலில் உள்ள இயற்கை எண்ணெய்ப் பசையை தக்கவைக்கிறது.",
      te: "పసిపాప చర్మంపై సహజ నూనెలను కాపాడి, సున్నితత్వాన్ని ఉంచుతుంది."
    },
    imageUrl: "https://images.unsplash.com/photo-1607006342456-ba27aae2264f?w=300&q=80",
    searchQuery: "Tear Free Gentle Baby Soap 100g",
    priceEstimate: "₹90 - ₹199"
  },
  {
    id: "baby_lotion",
    name: {
      en: "Deep Nourishing Baby Moisturizing Lotion",
      kn: "ಮಗುವಿನ ಮೃದು ಚರ್ಮದ ಪೋಷಣಾ ಲೋಷನ್",
      hi: "डीप नरिशिंग बेबी मॉइस्चराइजिंग लोशन",
      ta: "ஆழமான ஈரப்பதம் அளிக்கும் பேபி லோஷன்",
      te: "బేబీ మాయిశ్చరైజింగ్ లోషన్"
    },
    category: 'baby',
    description: {
      en: "Fast-absorbing, non-greasy baby lotion with natural colloidal oatmeal and calendula.",
      kn: "ಮಗುವಿನ ಚರ್ಮಕ್ಕೆ ಒಣಗದಂತೆ ರಕ್ಷಣೆ ನೀಡುವ ನೈಸರ್ಗಿಕ ಓಟ್‌ಮೀಲ್ ಮತ್ತು ಕಲೆಡುಲ ಲೋಷನ್.",
      hi: "कोलाइडल दलिया और कैलेंडुला युक्त गैर-चिपचिपा मॉइस्चराइजिंग लोशन।",
      ta: "விரைவாக உறிஞ்சப்படும், பிசுபிசுப்பற்ற ஊட்டச்சத்து மிகுந்த பேபி லோஷன்.",
      te: "జిడ్డు లేని, చర్మానికి పోషణనిచ్చే బేబీ లోషన్."
    },
    benefits: {
      en: "Provides continuous 24-hour skin hydration, curing newborn dry peeling skin and keeping it supple.",
      kn: "ಮಗುವಿನ ಒಣ ಚರ್ಮವನ್ನು ನಿವಾರಿಸಿ, ದಿನವಿಡೀ ಮೃದು ಮತ್ತು ಕಾಂತಿಯುತವಾಗಿರಿಸುತ್ತದೆ.",
      hi: "बच्चे की त्वचा को 24 घंटे नमी प्रदान करता है और सूखापन दूर रखता है।",
      ta: "குழந்தையின் உலர்ந்த தோலுக்கு 24 மணி நேர ஈரப்பதத்தை அளித்து மென்மையாக்குகிறது.",
      te: "చర్మానికి 24 గంటల తేమను అందించి, మృదుత్వాన్ని కాపాడుతుంది."
    },
    imageUrl: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=300&q=80",
    searchQuery: "Nourishing Baby Moisturizing Lotion 200ml",
    priceEstimate: "₹220 - ₹380"
  },
  {
    id: "baby_clothes",
    name: {
      en: "100% Organic Cotton Baby Rompers",
      kn: "೧೦೦% ಸಾವಯವ ಹತ್ತಿ ಬಟ್ಟೆಗಳು (ಬೇಬಿ ರೋಂಪರ್ಸ್)",
      hi: "100% जैविक सूती बेबी रोमपर्स (Rompers)",
      ta: "100% இயற்கை பருத்தி பேபி உடைகள்",
      te: "100% సేంద్రీయ కాటన్ బేబీ దుస్తులు"
    },
    category: 'baby',
    description: {
      en: "Super soft GOTS-certified organic cotton onesies with tagless design and nickel-free snaps.",
      kn: "ಅತ್ಯಂತ ಮೃದುವಾದ ಹತ್ತಿ ಬಟ್ಟೆಗಳು, ಗೀಚದ ವಿನ್ಯಾಸ ಮತ್ತು ಕರುಳಿಗೆ ಹಾನಿ ಮಾಡದ ಗುಂಡಿಗಳು.",
      hi: "बिना टैग के सुपर सॉफ्ट जैविक सूती कपड़ों से बने आरामदायक रोम्पर्स।",
      ta: "மென்மையான, லேபிள்கள் இல்லாத, குழந்தையை உறுத்தாத பருத்தி உடைகள்.",
      te: "లేబుల్స్ లేని, గిచ్చుకోకుండా ఉండే మెత్తటి కాటన్ దుస్తులు."
    },
    benefits: {
      en: "Prevents skin friction and sweat rashes, allows natural temperature regulation, and makes diaper changes easy.",
      kn: "ಮಗುವಿನ ಬೆವರಿನ ದದ್ದುಗಳನ್ನು ತಡೆಯುತ್ತದೆ ಮತ್ತು ಡೈಪರ್ ಬದಲಾಯಿಸಲು ಸುಲಭಗೊಳಿಸುತ್ತದೆ.",
      hi: "घमौरियों और त्वचा के घर्षण को रोकता है, और डायपर बदलने में आसान बनाता है।",
      ta: "வியர்க்குரு மற்றும் தோல் அரிப்பைத் தடுக்கிறது, உடுத்த எளிதானது.",
      te: "చెమట కాయలను నివారిస్తుంది, డైపర్ మార్చడానికి సులువుగా ఉంటుంది."
    },
    imageUrl: "https://images.unsplash.com/photo-1515488042361-404e9250afef?w=300&q=80",
    searchQuery: "Newborn Baby Rompers Organic Cotton",
    priceEstimate: "₹299 - ₹499"
  },
  {
    id: "baby_blanket",
    name: {
      en: "Ultra-Soft Cotton Swaddle Baby Blanket",
      kn: "ಮೃದು ಹತ್ತಿ ಮಗುವಿನ ಹೊದಿಕೆ (ಸ್ವ್ಯಾಡಲ್ ಬ್ಲಾಂಕೆಟ್)",
      hi: "अल्ट्रा-सॉफ्ट कॉटन स्वाडल बेबी कंबल (Blanket)",
      ta: "மென்மையான பருத்தி பேபி ஸ்வாடில் போர்வைகள்",
      te: "మెత్తటి బేబీ స్వ్యాడల్ దుప్పటి"
    },
    category: 'baby',
    description: {
      en: "Premium open-weave breathable lightweight muslin cotton wrapping sheets.",
      kn: "ಹಗುರವಾದ ಮತ್ತು ಗಾಳಿಯಾಡುವ ಮೃದು ಕಾಟನ್ ಮಗುವಿನ ಸುತ್ತುವ ಹೊದಿಕೆ.",
      hi: "हल्के वजन की अत्यधिक सांस लेने योग्य मलमल सूती स्वाडल शीट।",
      ta: "மிகவும் லேசான, காற்றோட்டமான பருத்தி துணியாலான போர்வை.",
      te: "తేలికపాటి, గాలి తగిలే మెత్తటి కాటన్ దుప్పటి."
    },
    benefits: {
      en: "Recreates womb-like secure snugness, reduces startle reflex, and prevents dangerous infant overheating.",
      kn: "ಮಗುವಿಗೆ ತಾಯಿಯ ಗರ್ಭದ ಸುರಕ್ಷಿತ ಅನುಭವ ನೀಡುತ್ತದೆ ಮತ್ತು ಗಾಢ ನಿದ್ದೆಗೆ ಸಹಾಯ ಮಾಡುತ್ತದೆ.",
      hi: "बच्चे को माँ के गर्भ जैसी सुरक्षा का अहसास कराता है और गहरी नींद में मदद करता है।",
      ta: "குழந்தைக்கு தாயின் கருப்பை போன்ற பாதுகாப்பை அளித்து நன்றாக தூங்க வைக்கிறது.",
      te: "శిశువుకు గర్భంలో ఉన్నట్లు సురక్షితమైన అనుభూతిని ఇస్తూ ప్రశాంతంగా పడుకునేలా చేస్తుంది."
    },
    imageUrl: "https://images.unsplash.com/photo-1543269865-cbf427effbad?w=300&q=80",
    searchQuery: "Muslin Swaddle Blankets Cotton Pack of 2",
    priceEstimate: "₹350 - ₹590"
  }
];
