/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface FoodItem {
  id: string;
  name: Record<string, string>;
  category: string;
  calories: number;
  protein: number; // in grams
  carbohydrates: number; // in grams
  fat: number; // in grams
  fiber: number; // in grams
  iron: number; // in mg
  calcium: number; // in mg
  folate: number; // in mcg
  vitaminA: number; // in mcg
  vitaminB6: number; // in mg
  vitaminB12: number; // in mcg
  vitaminC: number; // in mg
  vitaminD: number; // in mcg
  vitaminE: number; // in mg
  vitaminK: number; // in mcg
  magnesium: number; // in mg
  potassium: number; // in mg
  zinc: number; // in mg
  sodium: number; // in mg
  sugar: number; // in grams
  servingSize: string;
  recommendedQuantity: string;
  safetyLevel: 'Safe' | 'Safe in Moderation' | 'Consult Doctor' | 'Avoid';
  explanation: Record<string, string>;
  trimester: string;
  bestTime: string;
  benefits: Record<string, string>;
  risks: Record<string, string>;
  alternatives: string;
  states: string[]; // ['Karnataka', 'Tamil Nadu', 'Kerala', 'Andhra Pradesh', 'Telangana', 'Puducherry']
  isVegetarian: boolean;
  imageUrl?: string;
}

import { FOOD_DATABASE_ITEMS } from "./foods_db";
import { GovernmentScheme, CENTRALIZED_GOVERNMENT_SCHEMES } from "./data/governmentSchemes";

export const FOOD_DATABASE: FoodItem[] = FOOD_DATABASE_ITEMS;

export type { GovernmentScheme };
export const GOVERNMENT_SCHEMES: GovernmentScheme[] = CENTRALIZED_GOVERNMENT_SCHEMES;

const _DEPRECATED_OLD_SCHEMES = [
  {
    id: "pmmvy",
    name: {
      en: "Pradhan Mantri Matru Vandana Yojana (PMMVY)",
      kn: "ಪ್ರಧಾನ ಮಂತ್ರಿ ಮಾತೃ ವಂದನಾ ಯೋಜನೆ (PMMVY)",
      hi: "प्रधानमंत्री मातृ वंदना योजना (PMMVY)",
      ta: "பிரதம மந்திரி மாத்ரு வந்தனா யோஜனா (PMMVY)",
      te: "ప్రధాన మంత్రి మాతృ వందన యోజన (PMMVY)"
    },
    purpose: {
      en: "Provides financial compensation for wage loss during pregnancy to promote adequate rest and institutional deliveries.",
      kn: "ಗರ್ಭಾವಸ್ಥೆಯಲ್ಲಿ ವಿಶ್ರಾಂತಿ ಪಡೆಯಲು ಮತ್ತು ಸೂಕ್ತ ಹೆರಿಗೆ ಸೌಲಭ್ಯ ಪ್ರೋತ್ಸಾಹಿಸಲು ಆರ್ಥಿಕ ನೆರವು ಒದಗಿಸುತ್ತದೆ.",
      hi: "गर्भावस्था के दौरान मजदूरी के नुकसान की भरपाई और प्रसव पूर्व आराम व पोषण को बढ़ावा देने के लिए वित्तीय सहायता।",
      ta: "கர்ப்ப காலத்தில் ஓய்வெடுக்கவும் ஆரோக்கியமான பிரசவத்திற்காகவும் நிதியுதவி வழங்குகிறது.",
      te: "గర్భధారణ సమయంలో తగిన విశ్రాంతి మరియు సురక్షిత ప్రసవం కోసం ఆర్థిక సహాయం అందిస్తుంది."
    },
    eligibility: {
      en: "All Pregnant Women and Lactating Mothers (excluding those in regular government employment).",
      kn: "ಎಲ್ಲಾ ಗರ್ಭಿಣಿಯರು ಮತ್ತು ಬಾಣಂತಿಯರು (ಸರ್ಕಾರಿ ನೌಕರರನ್ನು ಹೊರತುಪಡಿಸಿ).",
      hi: "सभी गर्भवती महिलाएं और स्तनपान कराने वाली माताएं (नियमित सरकारी नौकरी वालो को छोड़कर)।",
      ta: "அனைத்து கர்ப்பிணி பெண்கள் மற்றும் பாலூட்டும் தாய்மார்கள் (அரசு ஊழியர்கள் தவிர).",
      te: "గర్భిణీలు మరియు పాలిచ్చే తల్లులందరూ (ప్రభుత్వ ఉద్యోగులు మినహా)."
    },
    benefits: {
      en: "Direct cash transfer of ₹5,000 in installments directly to Aadhaar-seeded bank accounts.",
      kn: "ನೇರ ನಗದು ವರ್ಗಾವಣೆ ಮೂಲಕ ಆಧಾರ್ ಲಿಂಕ್ ಆದ ಬ್ಯಾಂಕ್ ಖಾತೆಗೆ ₹೫,೦೦೦ ಜಮೆಯಾಗುತ್ತದೆ.",
      hi: "किस्तों में ₹5,000 की नकद राशि सीधे आधार-लिंक बैंक खाते में जमा की जाती है।",
      ta: "நேரடி பணமாக ₹5,000 தவணைகளில் ஆதார் இணைக்கப்பட்ட வங்கி கணக்கில் செலுத்தப்படும்.",
      te: "₹5,000 లబ్ధిదారుల ఆధార్ అనుసంధాన బ్యాంక్ ఖాతాకు నేరుగా బదిలీ చేయబడుతుంది."
    },
    documents: {
      en: "Mother and Child Protection (MCP) card, Aadhaar Card, Bank Passbook, Husband's Aadhaar.",
      kn: "ತಾಯಿ ಕಾರ್ಡ್ (MCP Card), ಆಧಾರ್ ಕಾರ್ಡ್, ಬ್ಯಾಂಕ್ ಪಾಸ್‌ಬುಕ್, ಪತಿಯ ಆಧಾರ್ ಕಾರ್ಡ್.",
      hi: "माता-शिशु संरक्षण (MCP) कार्ड, आधार कार्ड, बैंक पासबुक, पति का आधार कार्ड।",
      ta: "தாய்-சேய் பாதுகாப்பு (MCP) அட்டை, ஆதார் அட்டை, வங்கி கணக்கு புத்தகம்.",
      te: "తల్లి మరియు శిశు సంరక్షణ (MCP) కార్డు, ఆధార్ కార్డు, బ్యాంక్ పాస్ బుక్."
    },
    website: "https://wcd.nic.in/schemes/pradhan-mantri-matru-vandana-yojana"
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
    purpose: {
      en: "Safe motherhood intervention to reduce maternal and neonatal mortality by promoting institutional deliveries.",
      kn: "ಆಸ್ಪತ್ರೆಗಳಲ್ಲಿ ಸುರಕ್ಷಿತ ಹೆರಿಗೆ ಪ್ರೋತ್ಸಾಹಿಸುವ ಮೂಲಕ ತಾಯಿ ಮತ್ತು ಮಗುವಿನ ಮರಣ ಪ್ರಮಾಣವನ್ನು ಕಡಿಮೆ ಮಾಡುವುದು.",
      hi: "अस्पतालों में सुरक्षित प्रसव को बढ़ावा देकर मातृ और शिशु मृत्यु दर को कम करने के लिए राष्ट्रीय स्वास्थ्य मिशन के तहत योजना।",
      ta: "அரசு மருத்துவமனைகளில் பிரசவம் செய்து கொள்வதை ஊக்குவித்து தாய்-சேய் இறப்பு விகிதத்தை குறைப்பது.",
      te: "ఆసుపత్రులలో సురక్షిత ప్రసవాలను ప్రోత్సహించడం ద్వారా తల్లి మరియు శిశు మరణాల రేటును తగ్గించడం."
    },
    eligibility: {
      en: "Focus on BPL (Below Poverty Line) families, SC/ST pregnant women delivering in government health facilities.",
      kn: "ಬಡತನ ರೇಖೆಗಿಂತ ಕೆಳಗಿರುವ (BPL) ಕುಟುಂಬಗಳು ಮತ್ತು ಪರಿಶಿಷ್ಟ ಜಾತಿ / ಪಂಗಡದ ಗರ್ಭಿಣಿಯರು.",
      hi: "गरीबी रेखा से नीचे (BPL) वाले परिवार और अनुसूचित जाति/जनजाति की गर्भवती महिलाएं जो सरकारी अस्पताल में प्रसव करवाती हैं।",
      ta: "வறுமை கோட்டிற்கு கீழ் உள்ள குடும்பங்கள் மற்றும் பழங்குடியின கர்ப்பிணி பெண்கள்.",
      te: "దారిద్య్రరేఖకు దిగువన ఉన్న కుటుంబాలు, ఎస్సీ/ఎస్టీ గర్భిణీ స్త్రీలు."
    },
    benefits: {
      en: "Cash assistance of ₹1,400 (Rural areas) and ₹1,000 (Urban areas) to the mother post-delivery.",
      kn: "ಹೆರಿಗೆಯ ನಂತರ ಗ್ರಾಮೀಣ ಪ್ರದೇಶದಲ್ಲಿ ₹೧,೪೦೦ ಮತ್ತು ನಗರ ಪ್ರದೇಶದಲ್ಲಿ ₹೧,೦೦೦ ಹಣದ ಸಹಾಯ.",
      hi: "प्रसव के बाद माँ को ₹1,400 (ग्रामीण क्षेत्रों में) और ₹1,000 (शहरी क्षेत्रों में) की वित्तीय सहायता।",
      ta: "பிரசவத்திற்கு பின் கிராமப்புறங்களுக்கு ₹1,400, நகர்ப்புறங்களுக்கு ₹1,000 நிதியுதவி.",
      te: "ప్రసవానంతరం గ్రామీణ ప్రాంతాల్లో ₹1,400, పట్టణ ప్రాంతాల్లో ₹1,000 ఆర్థిక సహాయం."
    },
    documents: {
      en: "MCP Card, JSY Card, BPL Card, Discharge Summary from Government Hospital, Aadhaar Card.",
      kn: "ತಾಯಿ ಕಾರ್ಡ್ (MCP), JSY ಕಾರ್ಡ್, ಬಿಪಿಎಲ್ ಕಾರ್ಡ್, ಆಸ್ಪತ್ರೆಯ ಡಿಸ್ಚಾರ್ಜ್ ಕಾರ್ಡ್.",
      hi: "MCP कार्ड, JSY कार्ड, बीपीएल कार्ड, सरकारी अस्पताल का डिस्चार्ज प्रमाणपत्र, आधार।",
      ta: "MCP அட்டை, JSY அட்டை, BPL அட்டை, அரசு மருத்துவமனை விடுப்பு சான்றிதழ்.",
      te: "MCP కార్డు, JSY కార్డు, బీపీఎల్ కార్డు, ఆసుపత్రి డిశ్చార్జ్ పత్రం."
    },
    website: "https://nhm.gov.in/index1.php?lang=1&level=3&sublinkid=841&lid=309"
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
    purpose: {
      en: "Multi-ministerial convergence mission to improve nutritional outcomes for pregnant women, mothers, and children.",
      kn: "ಗರ್ಭಿಣಿಯರು, ಬಾಣಂತಿಯರು ಮತ್ತು ಮಕ್ಕಳ ಪೌಷ್ಟಿಕಾಂಶ ಮಟ್ಟವನ್ನು ಸುಧಾರಿಸುವ ರಾಷ್ಟ್ರೀಯ ಮಿಷನ್.",
      hi: "गर्भवती महिलाओं, स्तनपान कराने वाली माताओं और बच्चों के पोषण स्तर में सुधार करने के लिए एक बहु-मंत्रालयी मिशन।",
      ta: "கர்ப்பிணிகள் மற்றும் குழந்தைகளின் ஊட்டச்சத்து குறைபாட்டை போக்க கொண்டு வரப்பட்ட தேசிய திட்டம்.",
      te: "గర్భిణీలు, తల్లులు మరియు పిల్లలలో పోషకాహార సిద్ధిని మెరుగుపరచడం ఈ పథకం యొక్క లక్ష్యం."
    },
    eligibility: {
      en: "All pregnant women, lactating mothers, and children under 6 years mapped under Anganwadis.",
      kn: "ಎಲ್ಲಾ ಅಂಗನವಾಡಿ ವ್ಯಾಪ್ತಿಗೆ ಒಳಪಡುವ ಗರ್ಭಿಣಿಯರು, ಬಾಣಂತಿಯರು ಮತ್ತು ೬ ವರ್ಷದೊಳಗಿನ ಮಕ್ಕಳು.",
      hi: "आंगनवाड़ियों से जुड़ी सभी गर्भवती महिलाएं, स्तनपान कराने वाली माताएं और 6 वर्ष से कम उम्र के बच्चे।",
      ta: "அனைத்து கர்ப்பிணி பெண்கள், பாலூட்டும் தாய்மார்கள் மற்றும் 6 வயதுக்குட்பட்ட குழந்தைகள்.",
      te: "అంగన్‌వాడీ పరిధిలోని గర్భిణీలు, బాలింతలు మరియు 6 సంవత్సరాల లోపు పిల్లలు."
    },
    benefits: {
      en: "Supplementary nutrition rations (Take Home Ration - THR), growth monitoring, and nutritional counseling at Anganwadi centers.",
      kn: "ಪೌಷ್ಟಿಕ ಆಹಾರ ಪದಾರ್ಥಗಳು (Take Home Ration - THR), ಅಂಗನವಾಡಿಗಳಲ್ಲಿ ಬೆಳವಣಿಗೆಯ ಮೇಲ್ವಿಚಾರಣೆ ಮತ್ತು ಸಲಹೆ.",
      hi: "पूरक पोषण आहार (घर ले जाने वाला राशन - THR), वजन की निगरानी, और आंगनवाड़ी केंद्रों पर मुफ्त परामर्श।",
      ta: "சத்துணவு பொருட்கள் (Take Home Ration), வளர்ச்சி கண்காணிப்பு மற்றும் இலவச ஊட்டச்சத்து ஆலோசனை.",
      te: "అదనపు పోషకాహార రేషన్ (THR), ఎదుగుదల పర్యవేక్షణ మరియు ఉచిత పోషకాహార సలహాలు."
    },
    documents: {
      en: "Anganwadi Registration Number, Aadhaar Card, Mobile Number.",
      kn: "ಅಂಗನವಾಡಿ ನೋಂದಣಿ ಸಂಖ್ಯೆ, ಆಧಾರ್ ಕಾರ್ಡ್, ಮೊಬೈಲ್ ಸಂಖ್ಯೆ.",
      hi: "आंगनवाड़ी पंजीकरण संख्या, आधार कार्ड, मोबाइल नंबर।",
      ta: "அங்கன்வாடி பதிவு எண், ஆதார் அட்டை, மொபைல் எண்.",
      te: "అంగన్‌వాడీ రిజిస్ట్రేషన్ సంఖ్య, ఆధార్ కార్డు, మొబైల్ సంఖ్య."
    },
    website: "https://www.poshanabhiyaan.gov.in"
  }
];
void _DEPRECATED_OLD_SCHEMES;

export interface HealthFacility {
  id: string;
  name: Record<string, string>;
  type: 'PHC' | 'CHC' | 'Anganwadi' | 'Hospital';
  distance: number; // in km
  address: Record<string, string>;
  phone: string;
  services: Record<string, string[]>;
  coords: { x: number; y: number }; // custom percentage coordinates for local SVG map 0-100
}

export const HEALTH_FACILITIES: HealthFacility[] = [
  {
    id: "anganwadi_1",
    name: {
      en: "Anganwadi Nutrition Centre - Sector 2",
      kn: "ಅಂಗನವಾಡಿ ಪೌಷ್ಟಿಕ ಕೇಂದ್ರ - ಸೆಕ್ಟರ್ ೨",
      hi: "आंगनवाड़ी पोषण केंद्र - सेक्टर 2",
      ta: "அங்கன்வாடி ஊட்டச்சத்து மையம் - செக்டார் 2",
      te: "అంగన్‌వాడీ పోషకాహార కేంద్రం - సెక్టార్ 2"
    },
    type: "Anganwadi",
    distance: 0.4,
    address: {
      en: "Near Government School Ground, Ward No. 12",
      kn: "ಸರ್ಕಾರಿ ಶಾಲೆಯ ಮೈದಾನದ ಹತ್ತಿರ, ವಾರ್ಡ್ ಸಂಖ್ಯೆ ೧೨",
      hi: "सरकारी स्कूल मैदान के पास, वार्ड नंबर 12",
      ta: "அரசு பள்ளி மைதானம் அருகில், வார்டு எண் 12",
      te: "ప్రభుత్వ పాఠశాల మైదానం సమీపంలో, వార్డు నంబరు 12"
    },
    phone: "+91 94481 00234",
    services: {
      en: ["Supplementary Nutrition (THR)", "Weight Monitoring", "Vaccination Coordination", "POSHAN counseling"],
      kn: ["ಪೂರಕ ಪೌಷ್ಟಿಕ ಆಹಾರ", "ಮಗುವಿನ ತೂಕದ ತಪಾಸಣೆ", "ಲಸಿಕೆ ಸಮನ್ವಯ", "ಪೌಷ್ಟಿಕಾಂಶ ಸಲಹೆ"],
      hi: ["पूरक पोषण आहार राशन", "शिशु वजन निगरानी", "टीकाकरण समन्वय", "पोषण संबंधी परामर्श"],
      ta: ["சத்துணவு பொருட்கள்", "எடை கண்காணிப்பு", "தடுப்பூசி ஒருங்கிணைப்பு", "ஊட்டச்சத்து ஆலோசனை"],
      te: ["అదనపు పోషకాహారం (THR)", "బరువు పర్యవేక్షణ", "టీకాల సమన్వయం", "పోషకాహార సలహాలు"]
    },
    coords: { x: 30, y: 40 }
  },
  {
    id: "phc_ward_4",
    name: {
      en: "Primary Health Centre (PHC) - Ward 4",
      kn: "ಪ್ರಾಥಮಿಕ ಆರೋಗ್ಯ ಕೇಂದ್ರ (PHC) - ವಾರ್ಡ್ ೪",
      hi: "प्राथमिक स्वास्थ्य केंद्र (PHC) - वार्ड 4",
      ta: "ஆரம்ப சுகாதார நிலையம் (PHC) - வார்டு 4",
      te: "ప్రాథమిక ఆరోగ్య కేంద్రం (PHC) - వార్డు 4"
    },
    type: "PHC",
    distance: 0.8,
    address: {
      en: "Bus Stand Road, Opp. Panchayat Office",
      kn: "ಬಸ್ ನಿಲ್ದಾಣ ರಸ್ತೆ, ಪಂಚಾಯತ್ ಕಚೇರಿ ಎದುರು",
      hi: "बस स्टैंड रोड, पंचायत कार्यालय के सामने",
      ta: "பస్ நிலைய சாலை, பஞ்சாயத்து அலுவலகம் எதிரில்",
      te: "బస్టాండ్ రోడ్డు, పంచాయతీ కార్యాలయం ఎదురుగా"
    },
    phone: "+91 80234 56789",
    services: {
      en: ["Free Antenatal Checkups", "Iron Folic Acid Supplementation", "Tetanus Toxoid Injection", "Basic Laboratory Diagnostics"],
      kn: ["ಉಚಿತ ಗರ್ಭಿಣಿ ತಪಾಸಣೆ", "ಐರನ್ ಮತ್ತು ಫೋಲಿಕ್ ಆಸಿಡ್ ಮಾತ್ರೆಗಳು", "ಧನುರ್ವಾಯು ಚುಚ್ಚುಮದ್ದು", "ಮೂಲ ರಕ್ತ ಪರೀಕ್ಷೆಗಳು"],
      hi: ["मुफ्त प्रसव पूर्व जांच (ANC)", "आयरन फोलिक एसिड वितरण", "टिटनेस इंजेक्शन", "प्राथमिक प्रयोगशाला जांच"],
      ta: ["இலவச பிரசவ முன்பரிசோதனை", "இரும்புச்சத்து மாத்திரைகள்", "டெட்டனஸ் ஊசி", "அடிப்படை இரத்த பரிசோதனைகள்"],
      te: ["ఉచిత ప్రసవ పూర్వ పరీక్షలు", "ఐరన్ ఫోలిక్ యాసిడ్ పంపిణీ", "ధనుర్వాతం ఇంజెక్షన్", "ప్రాథమిక రక్త పరీక్షలు"]
    },
    coords: { x: 55, y: 25 }
  },
  {
    id: "district_hospital",
    name: {
      en: "District General Maternity Hospital",
      kn: "ಜಿಲ್ಲಾ ಸಾರ್ವಜನಿಕ ಹೆರಿಗೆ ಆಸ್ಪತ್ರೆ",
      hi: "जिला सामान्य प्रसूति अस्पताल",
      ta: "மாவட்ட பொது பிரசவ மருத்துவமனை",
      te: "జిల్లా ప్రభుత్వ ప్రసూతి ఆసుపత్రి"
    },
    type: "Hospital",
    distance: 1.2,
    address: {
      en: "Hospital Road, Civil Lines District HQ",
      kn: "ಆಸ್ಪತ್ರೆ ರಸ್ತೆ, ಜಿಲ್ಲಾ ಕೇಂದ್ರ ಕಚೇರಿ ಹತ್ತಿರ",
      hi: "अस्पताल मार्ग, सिविल लाइंस, जिला मुख्यालय",
      ta: "மருத்துவமனை சாலை, மாவட்ட தலைமையகம் அருகில்",
      te: "ఆసుపత్రి రోడ్డు, సివిల్ లైన్స్, జిల్లా కేంద్రం"
    },
    phone: "+91 80987 65432",
    services: {
      en: ["24/7 Caesarean and Normal Deliveries", "Specialized Neonatal ICU (SNCU)", "Blood Bank", "High-Risk Pregnancy Management", "Free Ambulance Service (102/108)"],
      kn: ["೨೪/೭ ಸಿಜೇರಿಯನ್ ಮತ್ತು ಸಾಮಾನ್ಯ ಹೆರಿಗೆ", "ನವಜಾತ ಶಿಶು ತೀವ್ರ ನಿಗಾ ಘಟಕ (NICU)", "ರಕ್ತ ನಿಧಿ", "ಹೆಚ್ಚಿನ ಅಪಾಯದ ಗರ್ಭಧಾರಣೆ ನಿರ್ವಹಣೆ", "ಉಚಿತ ಆಂಬ್ಯುಲೆನ್ಸ್ (102/108)"],
      hi: ["24 घंटे सिजेरियन व सामान्य प्रसव", "विशेष नवजात गहन चिकित्सा इकाई (NICU)", "ब्लड बैंक", "जटिल गर्भावस्था देखभाल", "मुफ्त एम्बुलेंस सेवा (102/108)"],
      ta: ["24 மணிநேர அறுவை சிகிச்சை மற்றும் சுகப்பிரசவம்", "குழந்தைகள் தீவிர சிகிச்சை பிரிவு (NICU)", "இரத்த வங்கி", "உயிர்காக்கும் ஆம்புலன்ஸ் சேவை"],
      te: ["24/7 సిజేరియన్ మరియు సాధారణ ప్రసవాలు", "నవజాత శిశువుల ఐసీయూ (NICU)", "రక్త నిధి", "అత్యవసర అంబులెన్స్ సేవ (102/108)"]
    },
    coords: { x: 75, y: 65 }
  },
  {
    id: "chc_regional",
    name: {
      en: "Community Health Centre (CHC) - Regional",
      kn: "ಸಮುದಾಯ ಆರೋಗ್ಯ ಕೇಂದ್ರ (CHC) - ಪ್ರಾದೇಶಿಕ",
      hi: "सामुदायिक स्वास्थ्य केंद्र (CHC) - क्षेत्रीय",
      ta: "சமூக சுகாதார நிலையம் (CHC)",
      te: "సామాజిక ఆరోగ్య కేంద్రం (CHC) - ప్రాంతీయ"
    },
    type: "CHC",
    distance: 3.8,
    address: {
      en: "National Highway Crossing, Regional HQ",
      kn: "ರಾಷ್ಟ್ರೀಯ ಹೆದ್ದಾರಿ ಜಂಕ್ಷನ್, ಪ್ರಾದೇಶಿಕ ಕೇಂದ್ರ",
      hi: "राष्ट्रीय राजमार्ग क्रॉसिंग, क्षेत्रीय मुख्यालय",
      ta: "தேசிய நெடுஞ்சாலை சந்திப்பு அருகில்",
      te: "జాతీయ రహదారి కూడలి సమీపంలో"
    },
    phone: "+91 80345 67890",
    services: {
      en: ["Emergency Obstetrics", "Specialist Pediatrician Consultation", "Ultrasound Scanning Facilities", "Free Institutional Delivery diet"],
      kn: ["ತುರ್ತು ಹೆರಿಗೆ ಸೇವೆಗಳು", "ಮಕ್ಕಳ ತಜ್ಞರ ಸಮಾಲೋಚನೆ", "ಅಲ್ಟ್ರಾಸೌಂಡ್ ಸ್ಕ್ಯಾನಿಂಗ್ ಸೌಲಭ್ಯ", "ಉಚಿತ ಹೆರಿಗೆ ಪೌಷ್ಟಿಕ ಆಹಾರ"],
      hi: ["आपातकालीन प्रसूति सेवा", "विशेषज्ञ बाल रोग विशेषज्ञ परामर्श", "अल्ट्रासाउंड स्कैनिंग सुविधा", "संस्थागत प्रसव आहार"],
      ta: ["அவசரகால பிரசவ சேவைகள்", "குழந்தை நல மருத்துவர் ஆலோசனை", "ஸ்கேனிங் வசதிகள்", "இலவச சத்துணவு"],
      te: ["అత్యవసర ప్రసూతి సేవలు", "పిల్లల వైద్య నిపుణుల సంప్రదింపులు", "అల్ట్రాసౌండ్ స్కానింగ్", "ఉచిత పోషకాహారం"]
    },
    coords: { x: 20, y: 75 }
  }
];

export const TRANSLATIONS: Record<string, Record<string, string>> = {
  en: {
    title: "PregNutri AI",
    subtitle: "Clinical Maternal Nutrition & Smart Logs Companion",
    dashboard: "Dashboard",
    foodDb: "Food Database",
    mealPlanner: "Meal Planner",
    schemes: "Government Schemes",
    hospitals: "Nearby Health Services",
    assistant: "Ask PregNutri AI",
    reports: "Reports & Logs",
    expectedDelivery: "Expected Delivery",
    weeksPregnant: "Weeks Pregnant",
    trimester: "Trimester",
    todayScore: "Today's Nutrition Score",
    calories: "Calories",
    iron: "Iron",
    protein: "Protein",
    calcium: "Calcium",
    folate: "Folate",
    water: "Water Intake",
    weight: "Weight Tracker",
    bmi: "Pre-pregnancy BMI",
    logFood: "Log Food Intake",
    ruleTip: "Rule-Based Nutrition Tip",
    safetySearch: "Food Safety Search",
    disclaimer: "Disclaimer: This companion provides rule-based nutritional guidelines. It does NOT replace professional medical advice. Always consult your doctor.",
    safe: "Safe",
    safeMod: "Safe in Moderation",
    consult: "Consult Doctor",
    avoid: "Avoid",
    searchPlaceholder: "Check 'Papaya', 'Ragi', 'Egg'...",
    logAction: "➕ Log Food",
    govTitle: "Welfare Schemes",
    nearbyTitle: "Nearby Health Facilities",
    emergencySos: "🚨 Emergency SOS",
    pregnancyWeekText: "Weeks Pregnant",
    babySizeText: "Baby is the size of an Eggplant",
    babyFactText: "Developing taste buds and hair follicles this week.",
    nextMealSuggestion: "Next Meal Suggestion",
    suggestedDish: "Steamed Spinach & Dal Khichdi",
    morningSickness: "Morning Sickness",
    anemiaWarning: "Anemia Support Needed",
    gdmWarning: "Gestational Diabetes Precaution",
    hypertensionCaution: "Hypertension Warning",
    shoppingList: "Smart Shopping List",
    generateMeal: "Generate Nutritional Weekly Plan",
    saveSuccess: "Saved Successfully!",
    clearLogs: "Reset Daily Intake",
    weightTrend: "Gestational Weight Trend",
    printCard: "Export Pregnancy Card",
    addWeightLog: "Log Today's Weight",
    sosCountdown: "SOS Sending in 5 seconds...",
    sosActive: "🚨 Emergency SOS Alert Dispatched!",
    sosDesc: "Simulated distress signals and exact GPS coordinates broadcasted to Maternal Helpline (102), local PHC, and primary emergency contacts.",
    cancel: "Cancel",
    bookmarked: "Bookmarked",
    allCategories: "All Categories",
    recommendedQuantity: "Recommended Quantity",
    bestTimeEat: "Best Time to Eat",
    healthBenefits: "Health Benefits",
    possibleRisks: "Possible Risks",
    safeAlternatives: "Safe Alternatives"
  },
  kn: {
    title: "ಪ್ರೆಗ್‌ನೂಟ್ರಿ AI",
    subtitle: "ಗರ್ಭಿಣಿಯರ ಕ್ಲಿನಿಕಲ್ ಪೌಷ್ಟಿಕಾಂಶ ಮತ್ತು ಸ್ಮಾರ್ಟ್ ಲಾಗ್ಸ್ ಒಡನಾಡಿ",
    dashboard: "ಡ್ಯಾಶ್‌ಬೋರ್ಡ್",
    foodDb: "ಆಹಾರ ಮಾಹಿತಿ",
    mealPlanner: "ಊಟದ ಯೋಜನೆ",
    schemes: "ಸರ್ಕಾರಿ ಯೋಜನೆಗಳು",
    hospitals: "ಹತ್ತಿರದ ಆಸ್ಪತ್ರೆಗಳು",
    assistant: "ಪ್ರೆಗ್‌ನೂಟ್ರಿ AI ಪ್ರಶ್ನಿಸಿ",
    reports: "ವರದಿಗಳು ಮತ್ತು ಲಾಗ್‌ಗಳು",
    expectedDelivery: "ನಿರೀಕ್ಷಿತ ಹೆರಿಗೆ ದಿನಾಂಕ",
    weeksPregnant: "ಗರ್ಭಧಾರಣೆಯ ವಾರಗಳು",
    trimester: "ತ್ರೈಮಾಸಿಕ",
    todayScore: "ಇಂದಿನ ಪೌಷ್ಟಿಕಾಂಶದ ಸ್ಕೋರ್",
    calories: "ಕ್ಯಾಲೋರಿಗಳು",
    iron: "ಕಕಬ್ಬಿಣಾಂಶ",
    protein: "ಪ್ರೋಟೀನ್",
    calcium: "ಕ್ಯಾಲ್ಸಿಯಂ",
    folate: "ಫೋಲೇಟ್",
    water: "ನೀರಿನ ಸೇವನೆ",
    weight: "ತೂಕದ ಟ್ರ್ಯಾಕರ್",
    bmi: "ಗರ್ಭಾವಸ್ಥೆಯ ಪೂರ್ವ BMI",
    logFood: "ಆಹಾರ ಲಾಗ್ ಮಾಡಿ",
    ruleTip: "ನಿಯಮಾಧಾರಿತ ಪೌಷ್ಟಿಕಾಂಶದ ಸಲಹೆ",
    safetySearch: "ಆಹಾರ ಸುರಕ್ಷತೆಯ ಹುಡುಕಾಟ",
    disclaimer: "ಹಕ್ಕುತ್ಯಾಗ: ಈ ಮೊಬೈಲ್ ಅಪ್ಲಿಕೇಶನ್ ಕೇವಲ ನಿಯಮಾವಳಿ ಪೌಷ್ಟಿಕಾಂಶ ಮಾಹಿತಿ ನೀಡುತ್ತದೆ. ವೈದ್ಯಕೀಯ ಚಿಕಿತ್ಸೆಗೆ ಬದಲಿಯಲ್ಲ. ನಿಮ್ಮ ವೈದ್ಯರನ್ನು ಸಂಪರ್ಕಿಸಿ.",
    safe: "ಸುರಕ್ಷಿತ",
    safeMod: "ಮಿತವಾಗಿ ಬಳಸಿ",
    consult: "ವೈದ್ಯರನ್ನು ಸಂಪರ್ಕಿಸಿ",
    avoid: "ಖಂಡಿತ ಬೇಡ",
    searchPlaceholder: "ಪಪ್ಪಾಯಿ, ರಾಗಿ, ಮೊಟ್ಟೆ ಎಂದು ಹುಡುಕಿ...",
    logAction: "➕ ಆಹಾರ ಲಾಗ್",
    govTitle: "ಸರ್ಕಾರಿ ಕಲ್ಯಾಣ ಯೋಜನೆಗಳು",
    nearbyTitle: "ಹತ್ತಿರದ ಆರೋಗ್ಯ ಕೇಂದ್ರಗಳು",
    emergencySos: "🚨 ತುರ್ತು ನೆರವು (SOS)",
    pregnancyWeekText: "ವಾರಗಳು ಕಳೆದಿವೆ",
    babySizeText: "ಮಗು ಈಗ ಬದನೆಕಾಯಿ ಗಾತ್ರದಲ್ಲಿದೆ",
    babyFactText: "ಈ ವಾರದಲ್ಲಿ ಮಗುವಿನ ನಾಲಿಗೆಯಲ್ಲಿ ರುಚಿ ಮೊಗ್ಗುಗಳು ಬೆಳೆಯುತ್ತವೆ.",
    nextMealSuggestion: "ಮುಂದಿನ ಊಟದ ಸಲಹೆ",
    suggestedDish: "ಪಾಲಕ್ ಮತ್ತು ದಾಲ್ ಖಿಚಡಿ",
    morningSickness: "ಮುಂಜಾನೆ ವಾಕರಿಕೆ",
    anemiaWarning: "ರಕ್ತಹೀನತೆ ಬೆಂಬಲ ಬೇಕು",
    gdmWarning: "ಗರ್ಭಾವಸ್ಥೆಯ ಮಧುಮೇಹ ಎಚ್ಚರಿಕೆ",
    hypertensionCaution: "ರಕ್ತದೊತ್ತಡ ಎಚ್ಚರಿಕೆ",
    shoppingList: "ಸ್ಮಾರ್ಟ್ ಶಾಪಿಂಗ್ ಪಟ್ಟಿ",
    generateMeal: "ವಾರದ ಪೌಷ್ಟಿಕ ಊಟದ ಯೋಜನೆ ರಚಿಸಿ",
    saveSuccess: "ಯಶಸ್ವಿಯಾಗಿ ಉಳಿಸಲಾಗಿದೆ!",
    clearLogs: "ದೈನಂದಿನ ಇಂಟೇಕ್ ರೀಸೆಟ್",
    weightTrend: "ಗರ್ಭಾವಸ್ಥೆಯ ತೂಕದ ಟ್ರೆಂಡ್",
    printCard: "ತಾಯಿ ಮತ್ತು ಮಗುವಿನ ಪೌಷ್ಟಿಕ ಕಾರ್ಡ್ ಡೌನ್‌ಲೋಡ್",
    addWeightLog: "ಇಂದಿನ ತೂಕ ನಮೂದಿಸಿ",
    sosCountdown: "SOS ೫ ಸೆಕೆಂಡುಗಳಲ್ಲಿ ಕಳುಹಿಸಲಾಗುತ್ತದೆ...",
    sosActive: "🚨 ತುರ್ತು SOS ಎಚ್ಚರಿಕೆಯನ್ನು ಕಳುಹಿಸಲಾಗಿದೆ!",
    sosDesc: "ಸ್ಥಳೀಯ ಆಸ್ಪತ್ರೆ (PHC), ಹೆರಿಗೆ ಸಹಾಯವಾಣಿ (102) ಮತ್ತು ಕುಟುಂಬಕ್ಕೆ ನಿಮ್ಮ ಜಿಪಿಎಸ್ ಸ್ಥಳ ಮತ್ತು ಎಚ್ಚರಿಕೆಯನ್ನು ಯಶಸ್ವಿಯಾಗಿ ಕಳುಹಿಸಲಾಗಿದೆ.",
    cancel: "ರದ್ದುಮಾಡಿ",
    bookmarked: "ಬುಕ್‌ಮಾರ್ಕ್ ಮಾಡಲಾಗಿದೆ",
    allCategories: "ಎಲ್ಲಾ ವರ್ಗಗಳು",
    recommendedQuantity: "ಶಿಫಾರಸು ಮಾಡಿದ ಪ್ರಮಾಣ",
    bestTimeEat: "ತಿನ್ನಲು ಉತ್ತಮ ಸಮಯ",
    healthBenefits: "ಆರೋಗ್ಯ ಪ್ರಯೋಜನಗಳು",
    possibleRisks: "ಸಾಧ್ಯವಿರುವ ಅಪಾಯಗಳು",
    safeAlternatives: "ಸುರಕ್ಷಿತ ಪರ್ಯಾಯಗಳು"
  },
  hi: {
    title: "प्रेग्न्यूट्री AI",
    subtitle: "मातृ नैदानिक पोषण और स्मार्ट लॉग साथी",
    dashboard: "डैशबोर्ड",
    foodDb: "खाद्य डेटाबेस",
    mealPlanner: "भोजन योजना",
    schemes: "सरकारी योजनाएं",
    hospitals: "निकटतम स्वास्थ्य केंद्र",
    assistant: "प्रेग्न्यूट्री AI से पूछें",
    reports: "रिपोर्ट और लॉग",
    expectedDelivery: "संभावित प्रसव",
    weeksPregnant: "गर्भावस्था सप्ताह",
    trimester: "तिमाही",
    todayScore: "आज का पोषण स्कोर",
    calories: "कैलोरी",
    iron: "आयरन",
    protein: "प्रोटीन",
    calcium: "कैल्शियम",
    folate: "फोलेट",
    water: "पानी का सेवन",
    weight: "वजन ट्रैकर",
    bmi: "गर्भावस्था पूर्व बीएमआई",
    logFood: "भोजन दर्ज करें",
    ruleTip: "पोषण संबंधी सलाह",
    safetySearch: "खाद्य सुरक्षा जांच",
    disclaimer: "अस्वीकरण: यह ऐप नियम-आधारित पोषण संबंधी दिशानिर्देश प्रदान करता है। यह डॉक्टर की सलाह का विकल्प नहीं है। हमेशा डॉक्टर से संपर्क करें।",
    safe: "सुरक्षित",
    safeMod: "संतुलित मात्रा",
    consult: "डॉक्टर से पूछें",
    avoid: "परहेज करें",
    searchPlaceholder: "पपीता, रागी, अंडा खोजें...",
    logAction: "➕ भोजन जोड़ें",
    govTitle: "कल्याणकारी योजनाएं",
    nearbyTitle: "निकटतम स्वास्थ्य सुविधाएं",
    emergencySos: "🚨 आपातकालीन SOS",
    pregnancyWeekText: "सप्ताह की गर्भवती",
    babySizeText: "शिशु अभी एक बैंगन के आकार का है",
    babyFactText: "शिशु की स्वाद कलिकाएं (टेस्ट बड्स) और बालों के रोम इस सप्ताह विकसित हो रहे हैं।",
    nextMealSuggestion: "अगले भोजन का सुझाव",
    suggestedDish: "पालक दाल और खिचड़ी",
    morningSickness: "सुबह की घबराहट",
    anemiaWarning: "आयरन की कमी / एनीमिया सहायता",
    gdmWarning: "गर्भावधि मधुमेह सावधानी",
    hypertensionCaution: "उच्च रक्तचाप चेतावनी",
    shoppingList: "स्मार्ट खरीदारी सूची",
    generateMeal: "सप्ताहिक पोषण भोजन योजना बनाएं",
    saveSuccess: "सफलतापूर्वक सुरक्षित किया गया!",
    clearLogs: "दैनिक लॉग रीसेट करें",
    weightTrend: "गर्भावस्था वजन प्रवृत्ति",
    printCard: "गर्भावस्था न्यूट्रिशन कार्ड प्रिंट करें",
    addWeightLog: "आज का वजन दर्ज करें",
    sosCountdown: "5 सेकंड में एसओएस भेजा जा रहा है...",
    sosActive: "🚨 आपातकालीन एसओएस अलर्ट भेज दिया गया है!",
    sosDesc: "सम्बन्धित प्राथमिक स्वास्थ्य केंद्र, आपातकालीन एम्बुलेंस (102/108) और आपके आपातकालीन संपर्कों को जीपीएस स्थान के साथ संकट संदेश भेज दिया गया है।",
    cancel: "रद्द करें",
    bookmarked: "बुकमार्क किया गया",
    allCategories: "सभी श्रेणियां",
    recommendedQuantity: "अनुशंसित मात्रा",
    bestTimeEat: "खाने का सबसे अच्छा समय",
    healthBenefits: "स्वास्थ्य लाभ",
    possibleRisks: "संभावित जोखिम",
    safeAlternatives: "सुरक्षित विकल्प"
  },
  ta: {
    title: "பிரெக்நியூட்ரி AI",
    subtitle: "கர்ப்பகால மருத்துவ ஊட்டச்சத்து & ஸ்மார்ட் பதிவுகள் துணைவன்",
    dashboard: "டாஷ்போர்டு",
    foodDb: "உணவு வழிகாட்டி",
    mealPlanner: "உணவு திட்டம்",
    schemes: "அரசு திட்டங்கள்",
    hospitals: "அருகிலுள்ள மருத்துவமனைகள்",
    assistant: "பிரெக்நியூட்ரி AI கேளுங்கள்",
    reports: "அறிக்கைகள் & பதிவுகள்",
    expectedDelivery: "பிரசவ தேதி",
    weeksPregnant: "கர்ப்ப வாரங்கள்",
    trimester: "முப்பருவம்",
    todayScore: "இன்றைய சத்து மதிப்பெண்",
    calories: "கலோரிகள்",
    iron: "இரும்புச்சத்து",
    protein: "புரதச்சத்து",
    calcium: "கால்சியம்",
    folate: "ஃபோலேட்",
    water: "தண்ணீர் அளவு",
    weight: "எடை கண்காணிப்பு",
    bmi: "முன்பு இருந்த பிஎம்ஐ",
    logFood: "உணவை சேர்க்க",
    ruleTip: "உனவு ஊட்டச்சத்து ஆலோசனை",
    safetySearch: "உணவு பாதுகாப்பு சோதனை",
    disclaimer: "பொறுப்புத் துறப்பு: இது ஒரு வழிகாட்டுதல் மட்டுமே. மருத்துவ சிகிச்சைக்கு மாற்றாகாது. உங்கள் மருத்துவரை அணுகவும்.",
    safe: "பாதுகாப்பானது",
    safeMod: "அளவோடு உண்ணலாம்",
    consult: "மருத்துவரை கேட்கவும்",
    avoid: "தவிர்க்கவும்",
    searchPlaceholder: "பப்பாளி, ராகி, முட்டை என தேடுக...",
    logAction: "➕ உணவை சேர்",
    govTitle: "அரசு நலத்திட்டங்கள்",
    nearbyTitle: "அருகிலுள்ள மருத்துவமனைகள்",
    emergencySos: "🚨 அவசர SOS",
    pregnancyWeekText: "வாரங்கள்",
    babySizeText: "குழந்தை இப்போது கத்தரிக்காய் அளவு உள்ளது",
    babyFactText: "இந்த வாரத்தில் குழந்தையின் சுவை அரும்புகள் வளரத் துவங்கும்.",
    nextMealSuggestion: "அடுத்த உணவு ஆலோசனை",
    suggestedDish: "பசலைக்கீரை & பருப்பு கிச்சடி",
    morningSickness: "காலை சோர்வு",
    anemiaWarning: "இரத்த சோகை எச்சரிக்கை",
    gdmWarning: "கர்ப்பகால சர்க்கரை நோய் எச்சரிக்கை",
    hypertensionCaution: "இரத்த அழுத்தம் எச்சரிக்கை",
    shoppingList: "ஷாப்பிங் பட்டியல்",
    generateMeal: "வாராந்திர சத்துமிக்க உணவு பட்டியல்",
    saveSuccess: "வெற்றிகரமாக சேமிக்கப்பட்டது!",
    clearLogs: "இன்றைய பதிவை அழி",
    weightTrend: "கர்ப்பகால எடை உயர்வு விபரம்",
    printCard: "கர்ப்பகால சத்து அட்டை பதிவிறக்கம்",
    addWeightLog: "இன்றைய எடையை பதிவிடுக",
    sosCountdown: "5 நொடிகளில் SOS அனுப்பப்படும்...",
    sosActive: "🚨 அவசரகால SOS அனுப்பப்பட்டது!",
    sosDesc: "உங்கள் இருப்பிட விபரங்கள் மற்றும் அவசர செய்தி 102 ஆம்புலன்ஸ், அருகிலுள்ள சுகாதார நிலையம் மற்றும் குடும்பத்தினருக்கு அனுப்பப்பட்டது.",
    cancel: "ரது செய்",
    bookmarked: "சேமிக்கப்பட்டது",
    allCategories: "அனைத்து பிரிவுகள்",
    recommendedQuantity: "பரிந்துரைக்கப்பட்ட அளவு",
    bestTimeEat: "சாப்பிட சிறந்த நேரம்",
    healthBenefits: "ஆரோக்கிய நன்மைகள்",
    possibleRisks: "சாத்தியமான ஆபத்துகள்",
    safeAlternatives: "பாதுகாப்பான மாற்று உணவுகள்"
  },
  te: {
    title: "ప్రెగ్న్యూట్రి AI",
    subtitle: "గర్భధారణ క్లినికల్ పోషకాహారం & స్మార్ట్ లాగ్స్ సహాయకారి",
    dashboard: "డాష్‌బోర్డ్",
    foodDb: "ఆహార సమాచారం",
    mealPlanner: "భోజన ప్రణాళిక",
    schemes: "ప్రభుత్వ పథకాలు",
    hospitals: "సమీప ఆరోగ్య కేంద్రాలు",
    assistant: "ప్రెగ్న్యూట్రి AI ని అడగండి",
    reports: "నివేదికలు & లాగ్స్",
    expectedDelivery: "ప్రసవించబోవు తేదీ",
    weeksPregnant: "గర్భధారణ వారాలు",
    trimester: "త్రైమాసికం",
    todayScore: "నేటి పోషకాహార స్కోరు",
    calories: "క్యాలరీలు",
    iron: "ఐరన్ (ఇనుము)",
    protein: "ప్రోటీన్",
    calcium: "కాల్షియం",
    folate: "ఫోలేట్",
    water: "నీటి వినియోగం",
    weight: "బరువు ట్రాకర్",
    bmi: "గర్భధారణ పూర్వ BMI",
    logFood: "ఆహారం నమోదు చేయండి",
    ruleTip: "పోషకాహార చిట్కా",
    safetySearch: "ఆహార భద్రత శోధన",
    disclaimer: "నిరాకరణ: ఈ యాప్ కేవలం నియమ-ఆధారిత పోషకాహార సూచనలను అందిస్తుంది. ఇది వైద్యుడి సలహాకు ప్రత్యామ్నాయం కాదు.",
    safe: "సురక్షితం",
    safeMod: "పరిమితంగా వాడాలి",
    consult: "వైద్యుడిని సంప్రదించండి",
    avoid: "నివారించండి",
    searchPlaceholder: "బొప్పాయి, రాగి, గుడ్డు అని వెతకండి...",
    logAction: "➕ ఆహారం నమోదు",
    govTitle: "ప్రభుత్వ సంక్షేమ పథకాలు",
    nearbyTitle: "సమీప ఆరోగ్య సేవలు",
    emergencySos: "🚨 అత్యవసర SOS",
    pregnancyWeekText: "వారాల గర్భవతి",
    babySizeText: "శిశువు ప్రస్తుతం వంకాయ పరిమాణంలో ఉంది",
    babyFactText: "ఈ వారంలో శిశువుకు రుచి మొగ్గలు మరియు వెంట్రుకల రంధ్రాలు ఏర్పడతాయి.",
    nextMealSuggestion: "తదుపరి ఆహార సూచన",
    suggestedDish: "పాలకూర & పప్పు కిచిడీ",
    morningSickness: "ఉదయపు వికారం",
    anemiaWarning: "రక్తహీనత మద్దతు అవసరం",
    gdmWarning: "గర్భధారణ మధుమేహం జాగ్రత్త",
    hypertensionCaution: "అధిక రక్తపోటు హెచ్చరిక",
    shoppingList: "స్మార్ట్ షాపింగ్ లిస్ట్",
    generateMeal: "వారపు పోషకాహార ప్రణాళికను సృష్టించండి",
    saveSuccess: "విజయవంతంగా సేవ్ చేయబడింది!",
    clearLogs: "రోజువారీ లాగ్స్ రీసెట్",
    weightTrend: "గర్భధారణ బరువు పెరుగుదల ట్రెండ్",
    printCard: "గర్భధారణ న్యూట్రిషన్ కార్డు ప్రింట్",
    addWeightLog: "నేటి బరువు నమోదు చేయండి",
    sosCountdown: "5 సెకన్లలో ఎస్ఓఎస్ పంపబడుతుంది...",
    sosActive: "🚨 అత్యవసర SOS అలర్ట్ పంపబడింది!",
    sosDesc: "సమీప ప్రభుత్వ ఆరోగ్య కేంద్రం (PHC), అంబులెన్స్ (102/108) మరియు మీ అత్యవసర సంప్రదింపు నంబర్లకు మీ జీపీఎస్ స్థానంతో కూడిన సందేశం వెళ్ళింది.",
    cancel: "రద్దు చేయి",
    bookmarked: "బుక్‌మార్క్ చేయబడింది",
    allCategories: "అన్ని విభాగాలు",
    recommendedQuantity: "సిఫార్సు చేయబడిన పరిమాణం",
    bestTimeEat: "తినడానికి ఉత్తమ సమయం",
    healthBenefits: "ఆరోగ్య ప్రయోజనాలు",
    possibleRisks: "సాధ్యమయ్యే ప్రమాదాలు",
    safeAlternatives: "సురక్షిత ప్రత్యామ్నాయాలు"
  }
};
