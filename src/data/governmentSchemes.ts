export interface GovernmentScheme {
  id: string;
  name: Record<string, string>;
  authority: Record<string, string>;
  level: 'Central' | 'State';
  state?: string;
  purpose: Record<string, string>;
  eligibility: Record<string, string>;
  benefits: Record<string, string>;
  documents: Record<string, string>;
  officialPortalUrl: string;
  sourceUrl: string;
  lastVerified: string;
  isActive: boolean;
  website: string; // Backward compatibility alias to officialPortalUrl
  nearestOffice?: Record<string, string>;
}

export const CENTRALIZED_GOVERNMENT_SCHEMES: GovernmentScheme[] = [
  {
    id: "pmmvy",
    name: {
      en: "Pradhan Mantri Matru Vandana Yojana (PMMVY)",
      kn: "ಪ್ರಧಾನ ಮಂತ್ರಿ ಮಾತೃ ವಂದನಾ ಯೋಜನೆ (PMMVY)",
      hi: "प्रधानमंत्री मातृ वंदना योजना (PMMVY)",
      ta: "பிரதம மந்திரி மாத்ரு வந்தனா யோஜனா (PMMVY)",
      te: "ప్రధాన మంత్రి మాతృ వందన యోజన (PMMVY)"
    },
    authority: {
      en: "Central Government (Ministry of Women and Child Development - MWCD)",
      kn: "ಕೇಂದ್ರ ಸರ್ಕಾರ (ಮಹಿಳಾ ಮತ್ತು ಮಕ್ಕಳ ಅಭಿವೃದ್ಧಿ ಸಚಿವಾಲಯ - MWCD)",
      hi: "केंद्र सरकार (महिला एवं बाल विकास मंत्रालय - MWCD)",
      ta: "மத்திய அரசு (மகளிர் மற்றும் குழந்தைகள் மேம்பாட்டு அமைச்சகம் - MWCD)",
      te: "కేంద్ర ప్రభుత్వం (మహిళా మరియు శిశు అభివృద్ధి మంత్రిత్వ శాఖ - MWCD)"
    },
    level: "Central",
    purpose: {
      en: "Provides financial compensation for wage loss during pregnancy and childbirth to encourage adequate rest, prenatal nutrition, and timely clinical care.",
      kn: "ಗರ್ಭಾವಸ್ಥೆಯಲ್ಲಿ ಸೂಕ್ತ ವಿಶ್ರಾಂತಿ, ಪೌಷ್ಟಿಕಾಂಶ ಹಾಗೂ ಹೆರಿಗೆಯ ಸಮಯದಲ್ಲಿ ವೇತನ ನಷ್ಟ ಪರಿಹಾರವಾಗಿ ಆರ್ಥಿಕ ಧನಸಹಾಯ ನೀಡುತ್ತದೆ.",
      hi: "गर्भावस्था के दौरान प्रसव पूर्व पोषण, स्वास्थ्य देखभाल और मजदूरी के नुकसान की भरपाई के लिए वित्तीय सहायता प्रदान करना।",
      ta: "கர்ப்ப காலத்தில் ஊட்டச்சத்து, ஆரோக்கியமான பராமரிப்பு மற்றும் ஊதிய இழப்பீட்டுக்காக நிதி உதவி வழங்குகிறது.",
      te: "గర్భధారణ సమయంలో తగిన విశ్రాంతి, పోషకాహారం మరియు వేతన నష్టాన్ని భర్తీ చేయడానికి ఆర్థిక సహాయం అందించడం."
    },
    eligibility: {
      en: "Pregnant women & lactating mothers belonging to socially & economically disadvantaged sections (e.g. SC/ST, disability ≥40%, BPL/e-Shram/MGNREGA cardholders, PM-JAY beneficiaries, or family income < ₹8 Lakh/yr). Excludes central/state govt and PSU employees. Covers 1st child and 2nd child (if a girl child).",
      kn: "ಸಾಮಾಜಿಕ ಮತ್ತು ಆರ್ಥಿಕವಾಗಿ ಹಿಂದುಳಿದ ವರ್ಗಗಳ ಗರ್ಭಿಣಿಯರು (SC/ST, ವಿಕಲಚೇತನರು, BPL/ಇ-ಶ್ರಮ್/ಉದ್ಯೋಗ ಖಾತ್ರಿ ಕಾರ್ಡ್, ಅಥವಾ ವಾರ್ಷಿಕ ಆದಾಯ ₹8 ಲಕ್ಷಕ್ಕಿಂತ ಕಡಿಮೆ). ಸರ್ಕಾರಿ ನೌಕರರಿಗೆ ಅನ್ವಯಿಸುವುದಿಲ್ಲ. 1ನೇ ಮಗುವಿಗೆ ಹಾಗೂ 2ನೇ ಮಗು ಹೆಣ್ಣಾಗಿದ್ದರೆ ಅನ್ವಯ.",
      hi: "सामाजिक और आर्थिक रूप से कमजोर वर्गों की गर्भवती महिलाएं (SC/ST, BPL/ई-श्रम/मनरेगा कार्डधारक, या ₹8 लाख/वर्ष से कम आय)। सरकारी कर्मचारियों को छोड़कर। पहली संतान और दूसरी संतान (यदि बालिका हो)।",
      ta: "பொருளாதார ரீதியாக பின்தங்கிய பெண்கள் (SC/ST, BPL, e-Shram கார்டு). அரசு ஊழியர்கள் தவிர்த்து. முதல் குழந்தை மற்றும் 2வது குழந்தை (பெண் குழந்தையாக இருந்தால் மட்டும்).",
      te: "సామాజికంగా, ఆర్థికంగా వెనుకబడిన గర్భిణీలు (SC/ST, BPL, e-Shram కార్డుదారులు). ప్రభుత్వ ఉద్యోగులు మినహా. మొదటి బిడ్డకు మరియు రెండవ బిడ్డ ఆడపిల్ల అయితే."
    },
    benefits: {
      en: "₹5,000 for 1st child in 2 instalments (₹3,000 on ANC registration/1st trimester + ₹2,000 on childbirth registration & 1st cycle vaccines) via Direct Benefit Transfer. ₹6,000 in a single instalment for 2nd child if a girl child.",
      kn: "1ನೇ ಮಗುವಿಗೆ ₹5,000 (2 ಕಂತುಗಳಲ್ಲಿ: ₹3,000 ನೋಂದಣಿಯ ನಂತರ, ₹2,000 ಜನನ ನೋಂದಣಿ ನಂತರ). 2ನೇ ಮಗು ಹೆಣ್ಣಾಗಿದ್ದರೆ ಒಟ್ಟಾರೆಯಾಗಿ ₹6,000 ನೇರ ಬ್ಯಾಂಕ್ ಜಮೆ.",
      hi: "पहली संतान के लिए ₹5,000 (2 किस्तों में: ₹3,000 पंजीकरण पर + ₹2,000 जन्म पंजीकरण पर)। दूसरी संतान बालिका होने पर ₹6,000 की सहायता सीधे बैंक खाते में।",
      ta: "முதல் குழந்தைக்கு ₹5,000 (2 தவணைகளில்). 2வது குழந்தை பெண் குழந்தையாக இருந்தால் ஒரே தவணையில் ₹6,000 வங்கி கணக்கில்.",
      te: "మొదటి బిడ్డకు ₹5,000 (2 విడతల్లో). రెండవ బిడ్డ ఆడపిల్ల అయితే ₹6,000 నేరుగా బ్యాంక్ ఖాతాలో."
    },
    documents: {
      en: "Mother and Child Protection (MCP) Card, Aadhaar Card of Self, Aadhaar-seeded Bank Account Passbook, Proof of Eligibility Category (BPL Card / e-Shram Card / SC-ST Certificate / MGNREGA Job Card / Income Certificate).",
      kn: "ತಾಯಿ ಕಾರ್ಡ್ (MCP Card), ಆಧಾರ್ ಕಾರ್ಡ್, ಆಧಾರ್ ಲಿಂಕ್ ಆದ ಬ್ಯಾಂಕ್ ಪಾಸ್‌ಬುಕ್, ಅರ್ಹತಾ ಪ್ರಮಾಣ ಪತ್ರ (BPL/e-Shram/SC-ST ಪತ್ರ).",
      hi: "माता-शिशु संरक्षण (MCP) कार्ड, आधार कार्ड, आधार-लिंक बैंक पासबुक, पात्रता प्रमाण पत्र (BPL/ई-श्रम/मनरेगा/आय प्रमाण पत्र)।",
      ta: "MCP அட்டை, ஆதார் அட்டை, வங்கி கணக்கு புத்தகம், தகுதி சான்றிதழ் (BPL/e-Shram).",
      te: "MCP కార్డు, ఆధార్ కార్డు, బ్యాంక్ పాస్ బుక్, అర్హత ధృవీకరణ పత్రం (BPL/e-Shram/రైస్ కార్డు)."
    },
    officialPortalUrl: "https://pmmvy.wcd.gov.in",
    website: "https://pmmvy.wcd.gov.in",
    sourceUrl: "https://pmmvy.wcd.gov.in",
    lastVerified: "2026-08-12",
    isActive: true
  },
  {
    id: "jsy",
    name: {
      en: "Janani Suraksha Yojana (JSY)",
      kn: "ಜನನಿ ಸುರಕ್ಷಾ ಯೋಜನೆ (JSY)",
      hi: "जननी सुरक्षा योजना (JSY)",
      ta: "ஜனனி சுரக்ஷா யோயனா (JSY)",
      te: "జనని సురక్ష యోజన (JSY)"
    },
    authority: {
      en: "Central Government (National Health Mission - Ministry of Health & Family Welfare)",
      kn: "ಕೇಂದ್ರ ಸರ್ಕಾರ (ರಾಷ್ಟ್ರೀಯ ಆರೋಗ್ಯ ಮಿಷನ್ - ಸಾಮಿ ಆರೋಗ್ಯ ಮತ್ತು ಕುಟುಂಬ ಕಲ್ಯಾಣ ಸಚಿವಾಲಯ)",
      hi: "केंद्र सरकार (राष्ट्रीय स्वास्थ्य मिशन - स्वास्थ्य एवं परिवार कल्याण मंत्रालय)",
      ta: "மத்திய அரசு (தேசிய சுகாதார இயக்கம் - சுகாதார அமைச்சகம்)",
      te: "కేంద్ర ప్రభుత్వం (జాతీయ ఆరోగ్య మిషన్ - కేంద్ర ఆరోగ్య శాఖ)"
    },
    level: "Central",
    purpose: {
      en: "A safe motherhood intervention under the National Health Mission (NHM) promoting institutional deliveries to reduce maternal and neonatal mortality.",
      kn: "ರಾಷ್ಟ್ರೀಯ ಆರೋಗ್ಯ ಮಿಷನ್ ಅಡಿಯಲ್ಲಿ ಸರ್ಕಾರಿ ಆಸ್ಪತ್ರೆಗಳಲ್ಲಿ ಸುರಕ್ಷಿತ ಹೆರಿಗೆ ಉತ್ತೇಜಿಸಿ ತಾಯಿ-ಮಗುವಿನ ಮರಣ ಪ್ರಮಾಣ ತಗ್ಗಿಸುವುದು.",
      hi: "संस्थागत प्रसव को बढ़ावा देकर मातृ एवं नवजात मृत्यु दर को कम करने के लिए राष्ट्रीय स्वास्थ्य मिशन के तहत योजना।",
      ta: "அரசு மருத்துவமனைகளில் பிரசவம் செய்து கொள்வதை ஊக்குவித்து தாய்-சேய் இறப்பு விகிதத்தை குறைப்பது.",
      te: "ఆసుపత్రులలో సురక్షిత ప్రసవాలను ప్రోత్సహించడం ద్వారా తల్లి మరియు శిశు మరణాల రేటును తగ్గించడం."
    },
    eligibility: {
      en: "In Low Performing States (LPS): All pregnant women delivering in government / accredited health centers regardless of age or parity. In High Performing States (HPS): BPL and SC/ST pregnant women aged 19+ delivering in government hospitals.",
      kn: "ವಿಶೇಷವಾಗಿ BPL ಕುಟುಂಬಗಳು, SC/ST ಗರ್ಭಿಣಿಯರು ಹಾಗೂ ಸರ್ಕಾರಿ ಆರೋಗ್ಯ ಕೇಂದ್ರಗಳಲ್ಲಿ ಹೆರಿಗೆ ಮಾಡಿಸುವ ಮಹಿಳೆಯರು.",
      hi: "विशेष रूप से गरीबी रेखा से नीचे (BPL) और अनुसूचित जाति/जनजाति की गर्भवती महिलाएं जो सरकारी स्वास्थ्य केंद्रों में प्रसव कराती हैं।",
      ta: "வறுமை கோட்டிற்கு கீழ் உள்ள BPL மற்றும் SC/ST கர்ப்பிணி பெண்கள் அரசு மருத்துவமனைகளில் பிரசவம் செய்து கொள்ளும்போது.",
      te: "దారిద్య్రరేఖకు దిగువన ఉన్న BPL మరియు ఎస్సీ/ఎస్టీ గర్భిణీలు ప్రభుత్వ ఆసుపత్రులలో ప్రసవించినప్పుడు."
    },
    benefits: {
      en: "Cash assistance post-delivery: Rural areas ₹1,400 to mother (plus ASHA incentive); Urban areas ₹1,000 to mother (plus ASHA incentive), paid directly upon institutional delivery.",
      kn: "ಹೆರಿಗೆಯ ನಂತರ ಗ್ರಾಮೀಣ ಪ್ರದೇಶದಲ್ಲಿ ₹1,400 ಹಾಗೂ ನಗರ ಪ್ರದೇಶದಲ್ಲಿ ₹1,000 ನೇರ ನಗದು ಸಹಾಯ ಮತ್ತು ಉಚಿತ ಸಾರಿಗೆ ಅನುಕೂಲ.",
      hi: "प्रसव के बाद माँ को ₹1,400 (ग्रामीण क्षेत्रों में) और ₹1,000 (शहरी क्षेत्रों में) की सीधी नकद सहायता।",
      ta: "பிரசவத்திற்கு பின் கிராமப்புறங்களில் ₹1,400 மற்றும் நகர்ப்புறங்களில் ₹1,000 நிதியுதவி.",
      te: "ప్రసవానంతరం గ్రామీణ ప్రాంతాల్లో ₹1,400, పట్టణ ప్రాంతాల్లో ₹1,000 ఆర్థిక సహాయం."
    },
    documents: {
      en: "MCP Card, BPL Card / SC-ST Certificate, Government Hospital Delivery Discharge Slip, Aadhaar Card, Bank Passbook.",
      kn: "ತಾಯಿ ಕಾರ್ಡ್ (MCP), BPL ಕಾರ್ಡ್ / SC-ST ಪತ್ರ, ಸರ್ಕಾರಿ ಆಸ್ಪತ್ರೆಯ ಡಿಸ್ಚಾರ್ಜ್ ಚೀಟಿ, ಆಧಾರ್ ಕಾರ್ಡ್, ಬ್ಯಾಂಕ್ ಪಾಸ್‌ಬುಕ್.",
      hi: "MCP कार्ड, BPL कार्ड / SC-ST प्रमाण पत्र, सरकारी अस्पताल का डिस्चार्ज प्रमाणपत्र, आधार कार्ड, बैंक पासबुक।",
      ta: "MCP அட்டை, BPL அட்டை, அரசு மருத்துவமனை விடுப்பு சான்றிதழ், ஆதார் அட்டை.",
      te: "MCP కార్డు, BPL కార్డు, ఆసుపత్రి డిశ్చార్జ్ పత్రం, ఆధಾರ್ కార్డు."
    },
    officialPortalUrl: "https://nhm.gov.in/index1.php?lang=1&level=3&sublinkid=841&lid=309",
    website: "https://nhm.gov.in/index1.php?lang=1&level=3&sublinkid=841&lid=309",
    sourceUrl: "https://nhm.gov.in",
    lastVerified: "2026-08-12",
    isActive: true
  },
  {
    id: "poshan",
    name: {
      en: "POSHAN Abhiyaan (National Nutrition Mission)",
      kn: "ಪೋಷಣ್ ಅಭಿಯಾನ (ರಾಷ್ಟ್ರೀಯ ಪೌಷ್ಟಿಕಾಂಶ ಮಿಷನ್)",
      hi: "पोषण अभियान (राष्ट्रीय पोषण मिशन)",
      ta: "போஷன் அபியான் (தேசிய ஊட்டச்சத்து திட்டம்)",
      te: "పోషణ్ అభియాన్ (జాతీయ పోషకాహార మిషన్)"
    },
    authority: {
      en: "Central Government (Ministry of Women and Child Development - MWCD)",
      kn: "ಕೇಂದ್ರ ಸರ್ಕಾರ (ಮಹಿಳಾ ಮತ್ತು ಮಕ್ಕಳ ಅಭಿವೃದ್ಧಿ ಸಚಿವಾಲಯ - MWCD)",
      hi: "केंद्र सरकार (महिला एवं बाल विकास मंत्रालय - MWCD)",
      ta: "மத்திய அரசு (மகளிர் மற்றும் குழந்தைகள் மேம்பாட்டு அமைச்சகம் - MWCD)",
      te: "కేంద్ర ప్రభుత్వం (మహిళా మరియు శిశు అభివృద్ధి మంత్రిత్వ శాఖ - MWCD)"
    },
    level: "Central",
    purpose: {
      en: "Flagship national nutrition mission to prevent stunting, under-nutrition, anemia, and low birth weight through Anganwadi centers across India.",
      kn: "ಗರ್ಭಿಣಿಯರು, ಬಾಣಂತಿಯರು ಮತ್ತು ಮಕ್ಕಳಲ್ಲಿ ಅಪೌಷ್ಟಿಕತೆ, ರಕ್ತಹೀನತೆ ಹಾಗೂ ಕಡಿಮೆ ತೂಕದ ಸಮಸ್ಯೆಯನ್ನು ತಡೆಯಲು ರಾಷ್ಟ್ರೀಯ ಯೋಜನೆ.",
      hi: "गर्भवती महिलाओं, माताओं और बच्चों में कुपोषण, एनीमिया और कम वजन की समस्या को रोकने के लिए राष्ट्रीय मिशन।",
      ta: "கர்ப்பிணிகள் மற்றும் குழந்தைகளின் ஊட்டச்சத்து குறைபாட்டை போக்க கொண்டு வரப்பட்ட தேசிய திட்டம்.",
      te: "గర్భిణీలు, తల్లులు మరియు పిల్లలలో పోషకాహార సిద్ధిని మెరుగుపరచడం ఈ పథకం యొక్క లక్ష్యం."
    },
    eligibility: {
      en: "All pregnant women, lactating mothers, and children under 6 years registered at local Anganwadi Centers (AWCs) nationwide.",
      kn: "ಎಲ್ಲಾ ಅಂಗನವಾಡಿ ಕೇಂದ್ರಗಳಲ್ಲಿ ನೋಂದಾಯಿತ ಗರ್ಭಿಣಿಯರು, ಬಾಣಂತಿಯರು ಮತ್ತು 6 ವರ್ಷದೊಳಗಿನ ಮಕ್ಕಳು.",
      hi: "आंगनवाड़ियों से जुड़ी सभी गर्भवती महिलाएं, स्तनपान कराने वाली माताएं और 6 वर्ष से कम उम्र के बच्चे।",
      ta: "அனைத்து கர்ப்பிணி பெண்கள், பாலூட்டும் தாய்மார்கள் மற்றும் 6 வயதுக்குட்பட்ட குழந்தைகள்.",
      te: "అంగన్‌వాడీ పరిధిలోని గర్భిణీలు, బాలింతలు మరియు 6 సంవత్సరాల లోపు పిల్లలు."
    },
    benefits: {
      en: "Supplementary nutrition rations (Take-Home Ration - THR), growth and weight monitoring, Iron-Folic Acid counseling, and Poshan Tracker digital health monitoring.",
      kn: "ಅಂಗನವಾಡಿಗಳ ಮೂಲಕ ಪೌಷ್ಟಿಕ ಆಹಾರ ಧಾನ್ಯಗಳು (THR), ಬೆಳವಣಿಗೆಯ ಮೇಲ್ವಿಚಾರಣೆ ಹಾಗೂ ಉಚಿತ ಪೌಷ್ಟಿಕಾಂಶ ಸಲಹೆ.",
      hi: "पूरक पोषण आहार (घर ले जाने वाला राशन - THR), वजन की निगरानी, और पोषण संबंधी मुफ्त परामर्श।",
      ta: "சத்துணவு பொருட்கள் (Take Home Ration), வளர்ச்சி கண்காணிப்பு மற்றும் இலவச ஊட்டச்சத்து ஆலோசனை.",
      te: "అదనపు పోషకాహార రేషన్ (THR), ఎదుగుదల పర్యవేక్షణ మరియు ఉచిత పోషకాహార సలహాలు."
    },
    documents: {
      en: "Anganwadi Center Registration / Poshan Tracker ID, Aadhaar Card of Mother, Mobile Number.",
      kn: "ಅಂಗನವಾಡಿ ನೋಂದಣಿ ವಿವರ, ಆಧಾರ್ ಕಾರ್ಡ್, ಮೊಬೈಲ್ ಸಂಖ್ಯೆ.",
      hi: "आंगनवाड़ी पंजीकरण संख्या, आधार कार्ड, मोबाइल नंबर।",
      ta: "அங்கன்வாடி பதிவு எண், ஆதார் அட்டை, மொபைல் எண்.",
      te: "అంగన్‌వాడీ రిజిస్ట్రేషన్ సంఖ్య, ఆధಾರ್ కార్డు, మొబైಲ್ సంఖ్య."
    },
    officialPortalUrl: "https://poshanabhiyaan.gov.in",
    website: "https://poshanabhiyaan.gov.in",
    sourceUrl: "https://poshanabhiyaan.gov.in",
    lastVerified: "2026-08-12",
    isActive: true
  },
  {
    id: "mathru_poorna",
    name: {
      en: "Mathru Poorna Scheme",
      kn: "ಮಾತೃ ಪೂರ್ಣ ಯೋಜನೆ",
      hi: "मातृ पूर्ण योजना (कर्नाटक)",
      ta: "மாத்ரு பூர்ணா திட்டம் (கர்நாடகா)",
      te: "మాతృ పూర్ణ పథకం (కర్ణాటక)"
    },
    authority: {
      en: "State Government (Department of Women and Child Development, Karnataka)",
      kn: "ರಾಜ್ಯ ಸರ್ಕಾರ (ಮಹಿಳಾ ಮತ್ತು ಮಕ್ಕಳ ಅಭಿವೃದ್ಧಿ ಇಲಾಖೆ, ಕರ್ನಾಟಕ)",
      hi: "राज्य सरकार (महिला एवं बाल विकास विभाग, कर्नाटक)",
      ta: "மாநில அரசு (மகளிர் மற்றும் குழந்தைகள் மேம்பாட்டுத் துறை, கர்நாடகா)",
      te: "రాష్ట్ర ప్రభుత్వం (మహిళా మరియు శిశు అభివృద్ధి శాఖ, కర్ణాటక)"
    },
    level: "State",
    state: "Karnataka",
    purpose: {
      en: "Provides a hot cooked nutritious meal daily at Anganwadis to pregnant and lactating women in Karnataka to meet daily macro and micronutrient requirements.",
      kn: "ಗರ್ಭಿಣಿಯರು ಮತ್ತು ಬಾಣಂತಿಯರಿಗೆ ಅಗತ್ಯವಿರುವ ಪೌಷ್ಟಿಕಾಂಶ ಪೂರೈಸಲು ಪ್ರತಿ ದಿನ ಅಂಗನವಾಡಿಯಲ್ಲಿ ಬಿಸಿ ಬೇಯಿಸಿದ ಪೌಷ್ಟಿಕ ಊಟ ನೀಡುವ ಯೋಜನೆ.",
      hi: "गर्भवती महिलाओं और स्तनपान कराने वाली माताओं को दैनिक पोषण आवश्यकताओं को पूरा करने के लिए गर्म पका हुआ भोजन प्रदान करना।",
      ta: "கர்ப்பிணிகள் மற்றும் பாலூட்டும் தாய்மார்களுக்கு சத்துக்கள் நிறைந்த சமைத்த சூடான உணவை வழங்குதல்.",
      te: "గర్భిణీలు మరియు పాలిచ్చే తల్లులకు పోషకాలు నిండిన వేడి వండిన భోజనాన్ని అందించడం."
    },
    eligibility: {
      en: "All pregnant women and lactating mothers residing in Karnataka registered at local Anganwadi Centers.",
      kn: "ಕರ್ನಾಟಕದಲ್ಲಿ ವಾಸಿಸುತ್ತಿರುವ ಮತ್ತು ಅಂಗನವಾಡಿ ಕೇಂದ್ರಗಳಲ್ಲಿ ನೋಂದಾಯಿಸಿಕೊಂಡಿರುವ ಎಲ್ಲಾ ಗರ್ಭಿಣಿಯರು ಹಾಗೂ ಬಾಣಂತಿಯರು.",
      hi: "कर्नाटक में रहने वाली सभी गर्भवती महिलाएं और स्तनपान कराने वाली माताएं जो आंगनवाड़ियों में पंजीकृत हैं।",
      ta: "கர்நாடகாவில் உள்ள அனைத்து அங்கன்வாடி பகுதிகளைச் சேர்ந்த கர்ப்பிணி மற்றும் பாலூட்டும் தாய்மார்கள்.",
      te: "కర్ణాటకలోని అంగన్‌వాడీ పరిధిలోని గర్భిణీలు మరియు పాలిచ్చే తల్లులందరూ."
    },
    benefits: {
      en: "Hot cooked lunch at Anganwadi daily including rice, dal, green leafy vegetables, milk (200ml), boiled egg or sprouted pulses, and IFA tablets.",
      kn: "ಪ್ರತಿದಿನ ಅಂಗನವಾಡಿಯಲ್ಲಿ ಹಾಲು, ಮೊಟ್ಟೆ / ಮೊಳಕೆ ಹೆಸರುಕಾಳು ಹಾಗೂ ಐರನ್ ಮಾತ್ರೆಗಳನ್ನೊಳಗೊಂಡ ಪೌಷ್ಟಿಕ ಬಿಸಿ ಊಟ.",
      hi: "आंगनवाड़ी में दूध, अंडा/अंकुरित अनाज और आयरन की गोलियों के साथ दैनिक गर्म पौष्टिक भोजन।",
      ta: "தினமும் அங்கன்வாடியில் பால், முட்டை, முளைகட்டிய பயிறு மற்றும் இரும்புச்சத்து மாத்திரைகளுடன் கூடிய சூடான சத்துணவு.",
      te: "రోజూ అంగన్‌వాడీలో పాలు, గుడ్డు/మొలకెత్తిన పప్పులు మరియు ఐరన్ మాత్రలతో కూడిన వేడి భోజనం."
    },
    documents: {
      en: "Aadhaar Card, Thayi (MCP) Card, Local Residency Certificate, Anganwadi Center Registration.",
      kn: "ಆಧಾರ್ ಕಾರ್ಡ್, ತಾಯಿ ಕಾರ್ಡ್ (MCP Card), ಸ್ಥಳೀಯ ನಿವಾಸಿ ಧೃಢೀಕರಣ ಪತ್ರ.",
      hi: "आधार कार्ड, थाई (MCP) कार्ड, स्थानीय निवास प्रमाण पत्र।",
      ta: "ஆதார் அட்டை, தாய் அட்டை (MCP), உள்ளூர் குடியிருப்பு சான்றிதழ்.",
      te: "ఆధಾರ್ కార్డు, తల్లి కార్డు (MCP), స్థానిక నివాస ధృవీకరణ పత్రం."
    },
    officialPortalUrl: "https://dwcd.karnataka.gov.in",
    website: "https://dwcd.karnataka.gov.in",
    sourceUrl: "https://dwcd.karnataka.gov.in",
    lastVerified: "2026-08-12",
    isActive: true
  },
  {
    id: "muthulakshmi_reddy",
    name: {
      en: "Dr. Muthulakshmi Reddy Maternity Benefit Scheme",
      kn: "ಡಾ. ಮುತ್ತುಲಕ್ಷ್ಮಿ ರೆಡ್ಡಿ ಹೆರಿಗೆ ನೆರವು ಯೋಜನೆ",
      hi: "डॉ. मुथुलक्ष्मी रेड्डी मातृत्व लाभ योजना (तमिलनाडु)",
      ta: "டாக்டர் முத்துலட்சுமி ரெட்டி மகப்பேறு நிதியுதவி திட்டம்",
      te: "డాక్టర్ ముత్తులక్ష్మి రెడ్డి మాతృత్వ సహాయ పథకం"
    },
    authority: {
      en: "State Government (Department of Public Health and Preventive Medicine, Tamil Nadu)",
      kn: "ರಾಜ್ಯ ಸರ್ಕಾರ (ಸಾರ್ವಜನಿಕ ಆರೋಗ್ಯ ಮತ್ತು ತಡೆಗಟ್ಟುವ ವೈದ್ಯಕೀಯ ಇಲಾಖೆ, ತಮಿಳುನಾಡು)",
      hi: "राज्य सरकार (जनस्वास्थ्य एवं रोकथाम चिकित्सा विभाग, तमिलनाडु)",
      ta: "மாநில அரசு (பொதுச் சுகாதாரம் மற்றும் நோய் தடுப்பு மருந்துத் துறை, தமிழ்நாடு)",
      te: "రాష్ట్ర ప్రభుత్వం (ప్రజా ఆరోగ్య శాఖ, తమిళనాడు)"
    },
    level: "State",
    state: "Tamil Nadu",
    purpose: {
      en: "Provides financial assistance and nutrition kits to poor pregnant mothers in Tamil Nadu to compensate wage loss and ensure healthy birth outcomes.",
      kn: "ತಮಿಳುನಾಡಿನ ಬಡ ಗರ್ಭಿಣಿಯರಿಗೆ ಹೆರಿಗೆ ಸಮಯದಲ್ಲಿ ವೇತನ ನಷ್ಟ ಪರಿಹಾರ ಹಾಗೂ ಪೌಷ್ಟಿಕ ಕಿಟ್ ಒದಗಿಸುವ ಬೃಹತ್ ರಾಜ್ಯ ಯೋಜನೆ.",
      hi: "तमिलनाडु की गरीब गर्भवती माताओं को मजदूरी के नुकसान की भरपाई और पोषण सहायता प्रदान करने की योजना।",
      ta: "ஏழை கர்ப்பிணிப் பெண்களுக்கு ஊதிய இழப்பை ஈடுசெய்யவும், பாதுகாப்பான பிரசவத்தை உறுதி செய்யவும் நிதியுதவி வழங்குதல்.",
      te: "పేద గర్భిణీలకు వేతన నష్టాన్ని భర్తీ చేయడానికి మరియు సురಕ್ಷిత ప్రసవం కోసం ఆర్థిక సహాయం."
    },
    eligibility: {
      en: "Pregnant women in Tamil Nadu aged 19+ delivering in government hospitals (first two pregnancies). Early registration under PICME (within 12 weeks) is mandatory.",
      kn: "ತಮಿಳುನಾಡಿನ ಸರ್ಕಾರಿ ಆಸ್ಪತ್ರೆಯಲ್ಲಿ ಹೆರಿಗೆ ಮಾಡಿಸುವ 19 ವರ್ಷ ಮೇಲ್ಪಟ್ಟ ಬಡ ಗರ್ಭಿಣಿಯರು (ಗರಿಷ್ಠ 2 ಹೆರಿಗೆಗೆ), PICME ನೋಂದಣಿ ಕಡ್ಡಾಯ.",
      hi: "तमिलनाडु की 19 वर्ष से अधिक आयु की गरीब गर्भवती महिलाएं जो सरकारी अस्पताल में प्रसव कराती हैं। PICME पंजीकरण अनिवार्य।",
      ta: "அரசு மருத்துவமனைகளில் பிரசவம் செய்து கொள்ளும் 19 வயதிற்கு மேற்பட்ட கர்ப்பிணிகள். PICME பதிவு கட்டாயம்.",
      te: "ప్రభుత్వ ఆసుపత్రులలో ప్రసవించే 19 ఏళ్లు పైబడిన గర్భిణీలు. PICME రిజిస్ట్రేషన్ తప్పనిసరి."
    },
    benefits: {
      en: "₹18,000 total benefit: ₹14,000 direct cash in 5 instalments + 2 Nutrition Kits (valued at ₹4,000) containing health mix, iron tonic, dates, and ghee.",
      kn: "ಒಟ್ಟು ₹18,000 ಮೌಲ್ಯದ ನೆರವು: ₹14,000 ನಗದು ಕಂತುಗಳಲ್ಲಿ ಮತ್ತು ₹4,000 ಮೌಲ್ಯದ 2 ಪೌಷ್ಟಿಕಾಂಶ ಕಿಟ್‌ಗಳು.",
      hi: "कुल ₹18,000 का लाभ: 5 किस्तों में ₹14,000 नकद + ₹4,000 मूल्य के 2 पोषण किट (हेल्थ मिक्स, आयरन टॉनिक, खजूर, घी)।",
      ta: "₹18,000 மொத்த நிதியுதவி: 5 தவணைகளில் ₹14,000 பணம் + 2 சத்துணவு பெட்டகங்கள் (Nutrition Kits).",
      te: "మొత్తం ₹18,000 లబ్ధి: 5 విడతల్లో ₹14,000 నగదు + 2 పోషకాహార కిట్లు."
    },
    documents: {
      en: "Aadhaar Card, Aadhaar-seeded Bank Passbook, RCH ID / PICME Registration Number, Income Certificate or Smart Ration Card.",
      kn: "ಆಧಾರ್ ಕಾರ್ಡ್, ಬ್ಯಾಂಕ್ ಪಾಸ್‌ಬುಕ್, PICME ನೋಂದಣಿ ಸಂಖ್ಯೆ, ಆದಾಯ ಪ್ರಮಾಣ ಪತ್ರ ಅಥವಾ ರೇಷನ್ ಕಾರ್ಡ್.",
      hi: "आधार कार्ड, बैंक पासबुक प्रति, PICME पंजीकरण संख्या, आय प्रमाण पत्र या राशन कार्ड।",
      ta: "ஆதார் அட்டை, வங்கி கணக்கு புத்தகம், PICME பதிவு எண், வருமான சான்றிதழ்.",
      te: "ఆధార్ కార్డు, బ్యాంక్ పాస్ బుక్, PICME రిజిస్ట్రేషన్ సంఖ్య, ఆదాయ ధృవీకరణ పత్రం."
    },
    officialPortalUrl: "https://picme.tn.gov.in",
    website: "https://picme.tn.gov.in",
    sourceUrl: "https://picme.tn.gov.in",
    lastVerified: "2026-08-12",
    isActive: true
  },
  {
    id: "maternal_kerala",
    name: {
      en: "Kerala State Maternal and Child Support Scheme",
      kn: "ಕೇರಳ ರಾಜ್ಯ ತಾಯಿ ಮತ್ತು ಮಗು ಬೆಂಬಲ ಯೋಜನೆ",
      hi: "केरल राज्य मातृ एवं शिशु सहायता योजना",
      ta: "கேரளா மாநில தாய்-சேய் நல ஆதரவு திட்டம்",
      te: "కేరళ రాష్ట్ర మాతృ & శిశు సంరక్షణ పథకం"
    },
    authority: {
      en: "State Government (Department of Health and Family Welfare, Kerala)",
      kn: "ರಾಜ್ಯ ಸರ್ಕಾರ (ಆರೋಗ್ಯ ಮತ್ತು ಕುಟುಂಬ ಕಲ್ಯಾಣ ಇಲಾಖೆ, ಕೇರಳ)",
      hi: "राज्य सरकार (स्वास्थ्य एवं परिवार कल्याण विभाग, केरल)",
      ta: "மாநில அரசு (சுகாதாரத் துறை, கேரளா)",
      te: "రాష్ట్ర ప్రభుత్వం (ఆరోగ్య శాఖ, కేరళ)"
    },
    level: "State",
    state: "Kerala",
    purpose: {
      en: "Ensures free institutional prenatal diagnostic care, specialized clinical screening, micronutrient supplements, and safe delivery support across Kerala.",
      kn: "ಕೇರಳದಲ್ಲಿ ಉಚಿತ ಗರ್ಭಿಣಿ ತಪಾಸಣೆ, ಉಚಿತ ಸ್ಕ್ಯಾನಿಂಗ್, ಪೌಷ್ಟಿಕಾಂಶ ಮಾತ್ರೆಗಳು ಮತ್ತು ಸುರಕ್ಷಿತ ಹೆರಿಗೆ ಸೌಲಭ್ಯ ಒದಗಿಸುವುದು.",
      hi: "केरल भर में मुफ्त प्रसव पूर्व जांच, अल्ट्रासाउंड स्कैन, पोषण पूरक और सुरक्षित प्रसव सहायता प्रदान करना।",
      ta: "கர்ப்பிணிப் பெண்களுக்கு விரிவான இலவச மருத்துவப் பராமரிப்பு, பரிசோதனைகள் மற்றும் பிரசவ உதவி வழங்குதல்.",
      te: "గర్భిణీలకు ఉచిత వైద్య పరీక్షలు, స్కానింగ్, పోషకాహార సప్లిమెంట్లు మరియు సురక్షిత ప్రసవ సేవలు."
    },
    eligibility: {
      en: "All pregnant residents of Kerala registered with local Primary Health Centres (PHC/FHC) or the Kerala e-Health network.",
      kn: "ಕೇರಳದ ಸ್ಥಳೀಯ ಪ್ರಾಥಮಿಕ ಆರೋಗ್ಯ ಕೇಂದ್ರ ಅಥವಾ ಇ-ಹೆಲ್ತ್ ನೆಟ್‌ವರ್ಕ್‌ನಲ್ಲಿ ನೋಂದಾಯಿಸಿಕೊಳ್ಳುವ ಎಲ್ಲಾ ಗರ್ಭಿಣಿಯರು.",
      hi: "केरल की सभी निवासी गर्भवती महिलाएं जो स्थानीय ई-स्वास्थ्य नेटवर्क या पीएचसी में पंजीकृत हैं।",
      ta: "கேரளாவின் உள்ளூர் இ-ஹெல்த் நெட்வொர்க்கில் அல்லது ஆரம்ப சுகாதார நிலையத்தில் பதிவு செய்யும் அனைத்து கர்ப்பிணிகள்.",
      te: "కేరళ ఇ-హెల్త్ నెట్‌వర్క్‌లో లేదా పీహెచ్‌సీలో నమోదైన గర్భిణీలు అందరూ."
    },
    benefits: {
      en: "Free routine ultrasound scans, lab diagnostics, weekly health supplements, free emergency ambulance transport, and cashless delivery at government hospitals.",
      kn: "ಉಚಿತ ಅಲ್ಟ್ರಾಸೌಂಡ್ ಸ್ಕ್ಯಾನಿಂಗ್, ಲ್ಯಾಬ್ ಪರೀಕ್ಷೆಗಳು, ಪೌಷ್ಟಿಕಾಂಶ ಮಾತ್ರೆಗಳು ಮತ್ತು ಉಚಿತ ಆಂಬ್ಯುಲೆನ್ಸ್ ಸಾರಿಗೆ.",
      hi: "मुफ्त अल्ट्रासाउंड स्कैन, लैब टेस्ट, साप्ताहिक पूरक आहार और आपातकालीन एम्बुलेंस परिवहन।",
      ta: "இலவச அல்ட்ராசவுண்ட் ஸ்கேன், ஆய்வக பரிசோதனைகள், வாராந்திர சத்து மாவு மற்றும் இலவச ஆம்புலன்ஸ்.",
      te: "ఉచిత అల్ట్రాసౌండ్ స్కాన్, ల్యాబ్ రిపోర్టులు, పోషకాహారం మరియు ఉచిత అంబులెన్స్ సేవ."
    },
    documents: {
      en: "Kerala e-Health ID / Registration Card, Aadhaar Card, Local Residence Certificate, MCP Card.",
      kn: "ಇ-ಹೆಲ್ತ್ ಗುರುತಿನ ಚೀಟಿ, ಆಧಾರ್ ಕಾರ್ಡ್, ವಾಸಸ್ಥಳ ಪ್ರಮಾಣ ಪತ್ರ, ತಾಯಿ ಕಾರ್ಡ್.",
      hi: "ई-स्वास्थ्य आईडी कार्ड, आधार कार्ड, स्थानीय निवास प्रमाण पत्र, एमसीपी कार्ड।",
      ta: "இ-ஹெல்த் அடையாள அட்டை, ஆதார் அட்டை, உள்ளூர் குடியிருப்பு சான்றிதழ்.",
      te: "ఇ-హెల్త్ ఐడీ కార్డు, ఆధಾರ್ కార్డు, నివాస ధృవీకరణ పత్రం."
    },
    officialPortalUrl: "https://health.kerala.gov.in",
    website: "https://health.kerala.gov.in",
    sourceUrl: "https://health.kerala.gov.in",
    lastVerified: "2026-08-12",
    isActive: true
  },
  {
    id: "ysr_amma_vodi",
    name: {
      en: "YSR Amma Vodi & Aarogyasri Maternal Scheme",
      kn: "YSR ಅಮ್ಮ ಒಡಿ ಮತ್ತು ಆರೋಗ್ಯಶ್ರೀ ಹೆರಿಗೆ ಯೋಜನೆ",
      hi: "वाईएसआर अम्मा वोडी एवं आरोग्यश्री मातृ योजना (आंध्र प्रदेश)",
      ta: "ஒய்.எஸ்.ஆர் அம்மா வோடி மகப்பேறு திட்டம்",
      te: "వైఎస్సార్ అమ్మ ఒడి & ఆరోగ్యశ్రీ మాతృత్వ పథకం"
    },
    authority: {
      en: "State Government (Department of Health, Medical & Family Welfare / GSWS, Andhra Pradesh)",
      kn: "ರಾಜ್ಯ ಸರ್ಕಾರ (ಆರೋಗ್ಯ ಮತ್ತು ಕುಟುಂಬ ಕಲ್ಯಾಣ ಇಲಾಖೆ / ಗ್ರಾಮ ಸಚಿವಾಲಯ, ಆಂಧ್ರ ಪ್ರದೇಶ)",
      hi: "राज्य सरकार (स्वास्थ्य एवं परिवार कल्याण विभाग / ग्राम सचिवालय, आंध्र प्रदेश)",
      ta: "மாநில அரசு (சுகாதாரத் துறை / கிராம செயலகம், ஆந்திரப் பிரதேசம்)",
      te: "రాష్ట్ర ప్రభుత్వం (ఆరోగ్య శాఖ / గ్రామ-వార్డు సచివాలయం, ఆంధ్రప్రదేశ్)"
    },
    level: "State",
    state: "Andhra Pradesh",
    purpose: {
      en: "Provides direct financial support for child healthcare/education and cashless maternal health surgeries under Aarogyasri in Andhra Pradesh.",
      kn: "ಆಂಧ್ರಪ್ರದೇಶದಲ್ಲಿ ತಾಯಿ ಮತ್ತು ಮಗುವಿನ ಆರೋಗ್ಯ ಸುಧಾರಿಸಲು ನೇರ ಆರ್ಥಿಕ ನೆರವು ಹಾಗೂ ಉಚಿತ ವೈದ್ಯಕೀಯ ಚಿಕಿತ್ಸೆ.",
      hi: "आंध्र प्रदेश में मां और बच्चे के स्वास्थ्य और शिक्षा के लिए प्रत्यक्ष वित्तीय सहायता और कैशलेस इलाज प्रदान करना।",
      ta: "ஆந்திராவில் தாய் மற்றும் குழந்தையின் ஆரோக்கியத்திற்காக நிதி உதவியுடன் கூடிய இலவச மருத்துவ சிகிச்சை.",
      te: "ఆంధ్రప్రదేశ్‌లో తల్లి మరియు శిశు సంరక్షణ, విద్య మరియు ఉచిత కార్పొరేట్ వైద్యం కోసం ఆర్థిక సహాయం."
    },
    eligibility: {
      en: "Mothers belonging to BPL households / Rice Card holders in Andhra Pradesh registered at Grama/Ward Sachivalayam.",
      kn: "ಆಂಧ್ರಪ್ರದೇಶದ ಬಿಪಿಎಲ್ ರೇಷನ್ ಕಾರ್ಡ್ (Rice Card) ಹೊಂದಿರುವ ಮತ್ತು ಗ್ರಾಮ ಸಚಿವಾಲಯದಲ್ಲಿ ನೋಂದಾಯಿತ ಗರ್ಭಿಣಿಯರು.",
      hi: "आंध्र प्रदेश की बीपीएल राशन कार्ड (राइस कार्ड) धारक महिलाएं जो ग्राम/वार्ड सचिवालय में पंजीकृत हैं।",
      ta: "ஆந்திர பிரதேசத்தின் BPL அரிசி அட்டை வைத்திருக்கும் தாய்மார்கள்.",
      te: "ఆంధ్రప్రదేశ్ బిపిఎల్ రైస్ కార్డు కలిగిన గర్భిణీలు మరియు తల్లులు."
    },
    benefits: {
      en: "Cashless delivery & surgical care under Dr. YSR Aarogyasri, free Thalli Bidda Express transport, and annual direct financial transfer of ₹15,000 for child welfare.",
      kn: "ಆರೋಗ್ಯಶ್ರೀ ಅಡಿಯಲ್ಲಿ ಉಚಿತ ಹೆರಿಗೆ ಚಿಕಿತ್ಸೆ, ಉಚಿತ ತಲ್ಲಿ ಬಿಡ್ಡ ಎಕ್ಸ್‌ಪ್ರೆಸ್ ವಾಹನ ಮತ್ತು ₹15,000 ನೇರ ಆರ್ಥಿಕ ನೆರವು.",
      hi: "आरोग्यश्री के तहत मुफ्त प्रसव और सर्जरी, थल्ली बिड्डा एक्सप्रेस वाहन और ₹15,000 की वार्षिक नकद सहायता।",
      ta: "ஆரோக்கியஸ்ரீ மூலம் இலவச பிரசவம், தள்ளி பிட்டா எக்ஸ்பிரஸ் வாகனம் மற்றும் ₹15,000 நிதியுதவி.",
      te: "ఆరోగ్యశ్రీ ద్వారా ఉచిత ప్రసవ శస్త్రచికిత్సలు, తల్లి బిడ్డ ఎక్స్‌ప్రెస్ రవాణా మరియు ₹15,000 ఆర్థిక సాయం."
    },
    documents: {
      en: "Aadhaar Card, AP Rice Card (BPL Ration Card), YSR Aarogyasri Health Card, Bank Account Details.",
      kn: "ಆಧಾರ್ ಕಾರ್ಡ್, ರೈಸ್ ಕಾರ್ಡ್ (ಬಿಪಿಎಲ್), ಆರೋಗ್ಯಶ್ರೀ ಹೆಲ್ತ್ ಕಾರ್ಡ್, ಬ್ಯಾಂಕ್ ಖಾತೆ ವಿವರ.",
      hi: "आधार कार्ड, राइस कार्ड (बीपीएल), आरोग्यश्री कार्ड, बैंक विवरण।",
      ta: "ஆதார் அட்டை, அரிசி அட்டை (BPL), ஆரோக்கியஸ்ரீ அடையாள அட்டை, வங்கி கணக்கு விவரம்.",
      te: "ఆధార్ కార్డు, రైస్ కార్డు, ఆరోగ్యశ్రీ కార్డు, బ్యాంక్ ఖాతా వివరాలు."
    },
    officialPortalUrl: "https://gramawardsachivalayam.ap.gov.in",
    website: "https://gramawardsachivalayam.ap.gov.in",
    sourceUrl: "https://aarogyasri.ap.gov.in",
    lastVerified: "2026-08-12",
    isActive: true
  },
  {
    id: "kcr_kit",
    name: {
      en: "KCR Kit & Arogya Lakshmi Scheme",
      kn: "KCR ಕಿಟ್ ಮತ್ತು ಆರೋಗ್ಯ ಲಕ್ಷ್ಮಿ ಯೋಜನೆ",
      hi: "केसीआर किट एवं आरोग्य लक्ष्मी योजना (तेलंगाना)",
      ta: "கே.சி.ஆர் கிட் மற்றும் ஆரோக்கிய லட்சுமி திட்டம்",
      te: "కేసీఆర్ కిట్ & ఆరోగ్య లక్ష్మి పథకం"
    },
    authority: {
      en: "State Government (Department of Health, Medical & Family Welfare / WDCW, Telangana)",
      kn: "ರಾಜ್ಯ ಸರ್ಕಾರ (ಆರೋಗ್ಯ ಮತ್ತು ಕುಟುಂಬ ಕಲ್ಯಾಣ ಇಲಾಖೆ, ತೆಲಂಗಾಣ)",
      hi: "राज्य सरकार (स्वास्थ्य एवं परिवार कल्याण विभाग, तेलंगाना)",
      ta: "மாநில அரசு (சுகாதாரத் துறை, தெலுங்கானா)",
      te: "రాష్ట్ర ప్రభుత్వం (ఆరోగ్య మరియు మహిళా అభివృద్ధి శాఖ, తెలంగాణ)"
    },
    level: "State",
    state: "Telangana",
    purpose: {
      en: "Aims to reduce infant mortality, promote institutional deliveries in government hospitals, and provide nutritious meals and essential newborn care items in Telangana.",
      kn: "ತೆಲಂಗಾಣದಲ್ಲಿ ಸರ್ಕಾರಿ ಆಸ್ಪತ್ರೆಗಳಲ್ಲಿ ಹೆರಿಗೆ ಪ್ರೋತ್ಸಾಹಿಸಲು, ನವಜಾತ ಶಿಶು ಬೆಂಬಲಕ್ಕೆ ಕೆಸಿಆರ್ ಕಿಟ್ ಮತ್ತು ಆರ್ಥಿಕ ಸಹಾಯ ಒದಗಿಸುವುದು.",
      hi: "तेलंगाना के सरकारी अस्पतालों में प्रसव को बढ़ावा देने, शिशु देखभाल के लिए केसीआर किट और नकद सहायता प्रदान करने की योजना।",
      ta: "அரசு மருத்துவமனைகளில் பிரசவத்தை ஊக்குவிக்கவும், குழந்தை பராமரிப்பிற்காக கே.சி.ஆர் கிட் மற்றும் நிதி உதவி வழங்கவும் திட்டம்.",
      te: "తెలంగాణలోని ప్రభుత్వ ఆసుపత్రులలో ప్రసవాలను ప్రోత్సహించడం, కేసీఆర్ కిట్ మరియు ఆర్థిక సహాయం అందించడం."
    },
    eligibility: {
      en: "Pregnant women in Telangana delivering in government health facilities (up to two deliveries).",
      kn: "ತೆಲಂಗಾಣದ ಸರ್ಕಾರಿ ಆಸ್ಪತ್ರೆಗಳಲ್ಲಿ ಹೆರಿಗೆ ಮಾಡಿಸುವ ಗರ್ಭಿಣಿಯರು (ಗರಿಷ್ಠ 2 ಹೆರಿಗೆಗಳಿಗೆ ಮಾತ್ರ).",
      hi: "तेलंगाना के सरकारी अस्पतालों में प्रसव कराने वाली गर्भवती महिलाएं (अधिकतम दो बच्चों तक)।",
      ta: "தெலுங்கானாவில் அரசு மருத்துவமனைகளில் பிரசவம் செய்து கொள்ளும் கர்ப்பிணிகள் (அதிகபட்சம் இரண்டு பிரசவங்கள்).",
      te: "తెలంగాణ ప్రభుత్వ ఆసుపత్రులలో ప్రసవించే గర్భిణీలు (గరిష్టంగా రెండు ప్రసవాల వరకు)."
    },
    benefits: {
      en: "Financial aid of ₹12,000 for a boy child / ₹13,000 for a girl child in 4 instalments, plus a 16-item 'KCR Kit' for newborn care and daily hot meals at Anganwadis.",
      kn: "₹12,000 ಆರ್ಥಿಕ ಸಹಾಯ (ಹೆಣ್ಣು ಮಗುವಾದರೆ ₹13,000) ಹಾಗೂ ನವಜಾತ ಶಿಶುವಿಗೆ 16 ವಸ್ತುಗಳ ಉಚಿತ ಬೇಬಿ ಕಿಟ್.",
      hi: "₹12,000 (बालिका होने पर ₹13,000) की वित्तीय सहायता और 16 आवश्यक वस्तुओं से युक्त 'केसीआर किट'।",
      ta: "₹12,000 நிதியுதவி (பெண் குழந்தைக்கு ₹13,000) மற்றும் 16 அத்தியாவசிய பொருட்கள் அடங்கிய கே.சி.ஆர் கிட்.",
      te: "₹12,000 ఆర్థిక సహాయం (ఆడపిల్ల పుడితే ₹13,000) మరియు 16 వస్తువులతో కూడిన కేసీఆర్ కిట్."
    },
    documents: {
      en: "Aadhaar Card, Bank Passbook, Mother Registration ID (RCH / MCTS ID), Government Hospital Delivery Certificate.",
      kn: "ಆಧಾರ್ ಕಾರ್ಡ್, ಬ್ಯಾಂಕ್ ಪಾಸ್‌ಬುಕ್, ತಾಯಿ ನೋಂದಣಿ ID, ಸರ್ಕಾರಿ ಆಸ್ಪತ್ರೆಯ ಹೆರಿಗೆ ಪ್ರಮಾಣ ಪತ್ರ.",
      hi: "आधार कार्ड, बैंक पासबुक, मातृ पंजीकरण आईडी, सरकारी अस्पताल का प्रसव प्रमाण पत्र।",
      ta: "ஆதார் அட்டை, வங்கி கணக்கு புத்தகம், தாய் பதிவு ஐடி, அரசு மருத்துவமனை பிரசவ சான்றிதழ்.",
      te: "ఆధಾರ್ కార్డు, బ్యాంక్ పాస్ బుక్, తల్లి రిజిస్ట్రేషన్ సంఖ్య, ప్రభుత్వ ఆసుపత్రి ప్రసవ ధృవీకరణ పత్రం."
    },
    officialPortalUrl: "https://kcrkit.telangana.gov.in",
    website: "https://kcrkit.telangana.gov.in",
    sourceUrl: "https://kcrkit.telangana.gov.in",
    lastVerified: "2026-08-12",
    isActive: true
  },
  {
    id: "puducherry_maternity",
    name: {
      en: "Puducherry State Maternity Benefit Scheme",
      kn: "ಪುದುಚೇರಿ ರಾಜ್ಯ ಹೆರಿಗೆ ನೆರವು ಯೋಜನೆ",
      hi: "पुदुचेरी राज्य मातृत्व लाभ योजना",
      ta: "புதுச்சேரி மாநில மகப்பேறு நிதியுதவி திட்டம்",
      te: "పుదుచ్చేరి రాష్ట్ర మాతృత్వ సహాయ పథకం"
    },
    authority: {
      en: "State Government / UT (Department of Women and Child Development, Puducherry)",
      kn: "ಕೇಂದ್ರಾಡಳಿತ ಪ್ರದೇಶ ಸರ್ಕಾರ (ಮಹಿಳಾ ಮತ್ತು ಮಕ್ಕಳ ಅಭಿವೃದ್ಧಿ ಇಲಾಖೆ, ಪುದುಚೇರಿ)",
      hi: "केंद्र शासित प्रदेश सरकार (महिला एवं बाल विकास विभाग, पुदुचेरी)",
      ta: "புதுச்சேரி அரசு (மகளிர் மற்றும் குழந்தைகள் மேம்பாட்டுத் துறை)",
      te: "కేంద్రపాలిత ప్రాంత ప్రభుత్వం (మహిళా మరియు శిశు అభివృద్ధి శాఖ, పుదుచ్చేరి)"
    },
    level: "State",
    state: "Puducherry",
    purpose: {
      en: "Provides local financial grants for nutrition and medical checkups to low-income pregnant mothers across Puducherry, Karaikal, Mahe, and Yanam.",
      kn: "ಪುದುಚೇರಿ ಪ್ರದೇಶದ ಬಡ ಗರ್ಭಿಣಿಯರಿಗೆ ಪೌಷ್ಟಿಕ ಆಹಾರ ಮತ್ತು ಹೆರಿಗೆ ತಪಾಸಣೆಗಾಗಿ ರಾಜ್ಯ ಮಟ್ಟದ ಆರ್ಥಿಕ ನೆರವು.",
      hi: "पुदुचेरी क्षेत्र की पात्र कम आय वाली गर्भवती माताओं को पोषण और चिकित्सा जांच के लिए वित्तीय मुआवजा प्रदान करना।",
      ta: "புதுச்சேரியைச் சேர்ந்த குறைந்த வருமானம் கொண்ட கர்ப்பிணித் தாய்மார்களுக்கு ஊட்டச்சத்து நிதியுதவி வழங்குதல்.",
      te: "పుదుచ్చేరిలోని అಲ್పాదాయ వర్గాల గర్భిణీలకు పోషకాహారం మరియు వైద్య పరీక్షల కోసం ఆర్థిక సహాయం."
    },
    eligibility: {
      en: "Resident pregnant women of Puducherry UT with valid family ration card (Red/BPL card) or below state income threshold.",
      kn: "ಪುದುಚೇರಿ ಕೇಂದ್ರಾಡಳಿತ ಪ್ರದೇಶದ ನಿವಾಸಿ ಗರ್ಭಿಣಿಯರು (ರೇಷನ್ ಕಾರ್ಡ್ ಹೊಂದಿರುವವರು).",
      hi: "पुदुचेरी के निवासी गर्भवती महिलाएं जिनके पास बीपीएल राशन कार्ड हो।",
      ta: "புதுச்சேரி மாநிலத்தைச் சேர்ந்த தகுதியான BPL குடும்ப அட்டை கொண்ட கர்ப்பிணிகள்.",
      te: "పుదుచ్చేరి ప్రాంత బిపిఎల్ రేషన్ కార్డు కలిగిన గర్భిణీలు."
    },
    benefits: {
      en: "Direct financial grant of ₹6,000 for prenatal nutrition, supplements, and clinical travel expenses.",
      kn: "ಪೂರ್ವ ಹೆರಿಗೆ ಪೌಷ್ಟಿಕ ಆಹಾರ ಮತ್ತು ಪ್ರಯಾಣ ಭತ್ಯೆಗಾಗಿ ಒಟ್ಟು ₹6,000 ನಗದು ನೆರವು.",
      hi: "प्रसव पूर्व पोषण और यात्रा खर्च के लिए ₹6,000 का सीधा वित्तीय अनुदान।",
      ta: "பிரசவ முன்பரிசோதனை ஊட்டச்சத்து உதவிக்காக ₹6,000 நேரடி நிதியுதவி.",
      te: "గర్భధారణ పోషకాహారం మరియు ప్రయాణ ఖర్చుల కోసం ₹6,000 ఆర్థిక సహాయం."
    },
    documents: {
      en: "Ration Card (Red / BPL Card), Aadhaar Card, Local Residence Proof, MCP Card, Bank Passbook.",
      kn: "ರೇಷನ್ ಕಾರ್ಡ್ (ಬಿಪಿಎಲ್), ಆಧಾರ್ ಕಾರ್ಡ್, ವಾಸಸ್ಥಳ ದೃಢೀಕರಣ ಪತ್ರ, ತಾಯಿ ಕಾರ್ಡ್, ಬ್ಯಾಂಕ್ ಪಾಸ್‌ಬುಕ್.",
      hi: "राशन कार्ड (बीपीएल), आधार कार्ड, निवास प्रमाण पत्र, एमसीपी कार्ड, बैंक पासबुक।",
      ta: "குடும்ப அட்டை (BPL), ஆதார் அட்டை, உள்ளூர் குடியிருப்பு சான்றிதழ், MCP அட்டை, வங்கி புத்தகம்.",
      te: "రేషన్ కార్డు, ఆధಾರ್ కార్డు, నివాస ధృవీಕರಣ పత్రం, MCP కార్డు, బ్యాంಕ್ పాస్ బుక్."
    },
    officialPortalUrl: "https://wcd.py.gov.in",
    website: "https://wcd.py.gov.in",
    sourceUrl: "https://wcd.py.gov.in",
    lastVerified: "2026-08-12",
    isActive: true
  }
];

/**
 * Single source of truth helper to retrieve active schemes for a user's location.
 */
export function getCentralizedSchemes(stateName: string, cityName: string = 'Local', districtName: string = 'District'): GovernmentScheme[] {
  const cleanState = stateName || 'Karnataka';
  const finalCity = cityName || 'Local';
  const finalDistrict = districtName || 'District';

  return CENTRALIZED_GOVERNMENT_SCHEMES.filter(sch => {
    if (!sch.isActive) return false;
    if (sch.level === 'Central') return true;
    return sch.state === cleanState;
  }).map(sch => {
    // Add dynamic nearest office info if applicable
    let officeObj: Record<string, string> = {};
    if (sch.id === 'pmmvy' || sch.id === 'poshan' || sch.id === 'mathru_poorna') {
      officeObj = {
        en: `Anganwadi Integrated Nutrition Centre, Ward No. 5, ${finalCity}, ${finalDistrict} District`,
        kn: `ಅಂಗನವಾಡಿ ಸಮಗ್ರ ಪೌಷ್ಟಿಕ ಕೇಂದ್ರ, ವಾರ್ಡ್ ನಂ. 5, ${finalCity}, ${finalDistrict} ಜಿಲ್ಲೆ`,
        hi: `आंगनवाड़ी एकीकृत पोषण केंद्र, वार्ड नंबर 5, ${finalCity}, ${finalDistrict} जिला`,
        ta: `அங்கன்வாடி ஒருங்கிணைந்த மையம், வார்டு எண் 5, ${finalCity}, ${finalDistrict} மாவட்டம்`,
        te: `అంగన్‌వాడీ పోషకాహార కేంద్రం, వార్డు నంబరు 5, ${finalCity}, ${finalDistrict} జిల్లా`
      };
    } else if (sch.id === 'jsy' || sch.id === 'muthulakshmi_reddy' || sch.id === 'maternal_kerala' || sch.id === 'kcr_kit') {
      officeObj = {
        en: `Primary Health Centre (PHC), ${finalCity}, ${finalDistrict} District`,
        kn: `ಪ್ರಾಥಮಿಕ ಆರೋಗ್ಯ ಕೇಂದ್ರ (PHC), ${finalCity}, ${finalDistrict} ಜಿಲ್ಲೆ`,
        hi: `प्राथमिक स्वास्थ्य केंद्र (PHC), ${finalCity}, ${finalDistrict} जिला`,
        ta: `ஆரம்ப சுகாதார நிலையம் (PHC), ${finalCity}, ${finalDistrict} மாவட்டம்`,
        te: `ప్రాథమిక ఆరోగ్య కేంద్రం (PHC), ${finalCity}, ${finalDistrict} జిల్లా`
      };
    } else if (sch.id === 'ysr_amma_vodi') {
      officeObj = {
        en: `Grama / Ward Sachivalayam (Village Secretariat), ${finalCity}, ${finalDistrict}`,
        kn: `ಗ್ರಾಮ ಸಚಿವಾಲಯ / ವಾರ್ಡ್ ಆಫೀಸ್, ${finalCity}, ${finalDistrict} ಜಿಲ್ಲೆ`,
        hi: `ग्राम/वार्ड सचिवालय (Village Secretariat), ${finalCity}, ${finalDistrict}`,
        ta: `கிராம செயலகம் (Village Secretariat), ${finalCity}, ${finalDistrict}`,
        te: `గ్రామ/వార్డు సచివాలయం, ${finalCity}, ${finalDistrict}`
      };
    } else if (sch.id === 'puducherry_maternity') {
      officeObj = {
        en: `Directorate of Social Welfare & WCD Department, ${finalCity}`,
        kn: `ಸಮಾಜ ಕಲ್ಯಾಣ ಮತ್ತು ಮಹಿಳಾ ಮತ್ತು ಮಕ್ಕಳ ಅಭಿವೃದ್ಧಿ ಇಲಾಖೆ ಕಚೇರಿ, ${finalCity}`,
        hi: `महिला एवं बाल विकास विभाग कार्यालय, ${finalCity}`,
        ta: `சமூக நலன் மற்றும் மகளிர் மேம்பாட்டுத் துறை அலுவலகம், ${finalCity}`,
        te: `మహిళా & శిశు అభివృద్ధి శాఖ కార్యాలయం, ${finalCity}`
      };
    }

    return {
      ...sch,
      nearestOffice: officeObj
    };
  });
}
