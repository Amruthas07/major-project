/**
 * location_service.ts
 * Provides dynamically generated, location-aware Government Welfare Schemes and Nearby Health Services.
 * Leverages user profile (State, District, City, Pincode) and real-time/simulated GPS coordinates.
 */

export interface HealthFacility {
  id: string;
  name: Record<string, string>;
  type: 'PHC' | 'CHC' | 'Hospital' | 'DistrictHospital' | 'MedicalCollege' | 'BloodBank' | 'Ambulance' | 'Nutrition' | 'Vaccination' | 'Pharmacy';
  distance: number; // in km
  rating: number;
  address: Record<string, string>;
  phone: string;
  services: Record<string, string[]>;
  coords: { x: number; y: number }; // custom coordinates for local map view (0-100)
}

import { GovernmentScheme, getCentralizedSchemes } from './data/governmentSchemes';
import { VERIFIED_INDIAN_HEALTH_FACILITIES } from './data/health_facilities_catalog';
export type { GovernmentScheme };

// Map of South Indian States and their major districts
export const STATE_DISTRICTS: Record<string, string[]> = {
  'Karnataka': ['Bengaluru Urban', 'Mysuru', 'Dharwad', 'Mangaluru', 'Belagavi', 'Shivamogga', 'Tumakuru'],
  'Tamil Nadu': ['Chennai', 'Coimbatore', 'Madurai', 'Trichy', 'Salem', 'Tirunelveli', 'Vellore'],
  'Kerala': ['Trivandrum', 'Kochi', 'Kozhikode', 'Thrissur', 'Palakkad', 'Alappuzha', 'Kottayam'],
  'Andhra Pradesh': ['Visakhapatnam', 'Vijayawada', 'Guntur', 'Nellore', 'Tirupati', 'Kurnool', 'Kakinada'],
  'Telangana': ['Hyderabad', 'Warangal', 'Nizamabad', 'Khammam', 'Karimnagar', 'Nalgonda', 'Mahabubnagar'],
  'Puducherry': ['Puducherry', 'Karaikal', 'Mahe', 'Yanam']
};

// Simple Haversine distance calculator
export function calculateHaversineDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth's radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return parseFloat((R * c).toFixed(1));
}

/**
 * Retrieves verified health facilities based on State, District, City, Pincode and coordinates.
 * Strictly uses verified real-world Indian health facilities from the catalog.
 */
export function getHealthFacilities(
  state: string,
  district: string,
  city: string,
  pincode: string,
  userLat?: number,
  userLon?: number
): HealthFacility[] {
  const finalCity = city || "Local";
  const finalDistrict = district || "District";
  const finalState = state || "Karnataka";

  // Base coordinates for user if none provided (Bengaluru as default center)
  const baseLat = userLat || 12.9716;
  const baseLon = userLon || 77.5946;

  // 1. Filter verified health facilities from catalog
  const matched = VERIFIED_INDIAN_HEALTH_FACILITIES.filter(f =>
    f.state.toLowerCase() === finalState.toLowerCase()
  );

  // If district matches exist within the state, prioritize them
  const districtMatched = matched.filter(f =>
    f.district.toLowerCase() === finalDistrict.toLowerCase() ||
    (f.city && f.city.toLowerCase() === finalCity.toLowerCase())
  );

  const facilitiesToDisplay = districtMatched.length > 0 ? districtMatched : matched;

  // Map to HealthFacility structure
  const result: HealthFacility[] = facilitiesToDisplay.map((fac, idx) => {
    const computedDistance = fac.lat && fac.lng
      ? calculateHaversineDistance(baseLat, baseLon, fac.lat, fac.lng)
      : (fac.distanceKm || 2.5);

    let mappedType: HealthFacility["type"] = "Hospital";
    const cat = fac.category.toLowerCase();
    if (cat.includes("phc") || cat.includes("primary health")) {
      mappedType = "PHC";
    } else if (cat.includes("chc") || cat.includes("community health")) {
      mappedType = "CHC";
    } else if (cat.includes("district")) {
      mappedType = "DistrictHospital";
    } else if (cat.includes("college")) {
      mappedType = "MedicalCollege";
    }

    const enServices = fac.maternalServices && fac.maternalServices.length > 0
      ? fac.maternalServices
      : (fac.specialties || ["Maternity Care", "Safe Deliveries", "Antenatal Checkups"]);

    return {
      id: fac.id,
      name: {
        en: fac.name,
        kn: fac.name,
        hi: fac.name,
        ta: fac.name,
        te: fac.name
      },
      type: mappedType,
      distance: computedDistance,
      rating: fac.rating || 4.6,
      address: {
        en: fac.address + ", " + (fac.city || fac.district) + ", " + fac.state,
        kn: fac.address + ", " + (fac.city || fac.district) + ", " + fac.state,
        hi: fac.address + ", " + (fac.city || fac.district) + ", " + fac.state,
        ta: fac.address + ", " + (fac.city || fac.district) + ", " + fac.state,
        te: fac.address + ", " + (fac.city || fac.district) + ", " + fac.state
      },
      phone: fac.phone || fac.emergencyPhone || "112 / 108",
      services: {
        en: enServices,
        kn: enServices,
        hi: enServices,
        ta: enServices,
        te: enServices
      },
      coords: { x: 25 + (idx * 15) % 60, y: 20 + (idx * 18) % 65 }
    };
  });

  // Always include verified National Emergency & Patient Transport ambulance service
  const ambulanceService: HealthFacility = {
    id: "national_ambulance_108_102",
    name: {
      en: "108 Ambulance & 102 JSSK Patient Transport",
      kn: "೧೦೮ ಆಂಬ್ಯುಲೆನ್ಸ್ ಮತ್ತು ೧೦೨ ಜೆಎಸ್ಎಸ್ಕೆ ಸಾರಿಗೆ",
      hi: "108 एम्बुलेंस एवं 102 जेएसएसके रोगी परिवहन",
      ta: "108 ஆம்புலன்ஸ் & 102 பிரசவ போக்குவரத்து",
      te: "108 అంబులెన్స్ & 102 ప్రసవ రవాణా"
    },
    type: "Ambulance",
    distance: 1.0,
    rating: 4.9,
    address: {
      en: "National Health Mission Emergency Fleet - " + finalDistrict + ", " + finalState,
      kn: "ರಾಷ್ಟ್ರೀಯ ಆರೋಗ್ಯ ಅಭಿಯಾನ ತುರ್ತು ವಾಹನಗಳು - " + finalDistrict + ", " + finalState,
      hi: "राष्ट्रीय स्वास्थ्य मिशन आपातकालीन सेवा - " + finalDistrict + ", " + finalState,
      ta: "தேசிய சுகாதார இயக்கம் - " + finalDistrict + ", " + finalState,
      te: "జాతీయ ఆరోగ్య మిషన్ అత్యవసర విభాగం - " + finalDistrict + ", " + finalState
    },
    phone: "108 (Ambulance) / 102 (Patient Transport)",
    services: {
      en: [
        "108: Emergency Medical Services / Ambulance (24x7)",
        "102: Free Patient Transport for Pregnant Women & Neonates under JSSK",
        "Life Support on Wheels with Trained EMTs",
        "Direct Transport to Designated First Referral Units (FRU)"
      ],
      kn: [
        "೧೦೮: ತುರ್ತು ವೈದ್ಯಕೀಯ ಸೇವೆಗಳು / ಆಂಬ್ಯುಲೆನ್ಸ್ (೨೪x೭)",
        "೧೦೨: ಜೆಎಸ್ಎಸ್ಕೆ ಅಡಿಯಲ್ಲಿ ಉಚಿತ ಹೆರಿಗೆ ಮತ್ತು ನವಜಾತ ಶಿಶು ಸಾರಿಗೆ"
      ],
      hi: [
        "108: आपातकालीन चिकित्सा सेवाएं / एम्बुलेंस (24x7)",
        "102: जेएसएसके के तहत गर्भवती महिलाओं और नवजात शिशुओं के लिए मुफ्त परिवहन"
      ],
      ta: [
        "108: அவசர மருத்துவ ஆம்புலன்ஸ் (24x7)",
        "102: கர்ப்பிணிப் பெண்களுக்கான இலவச போக்குவரத்து"
      ],
      te: [
        "108: అత్యవసర వైద్య అంబులెన్స్ (24x7)",
        "102: ఉచిత ప్రసవ రవాణా"
      ]
    },
    coords: { x: 50, y: 50 }
  };

  result.unshift(ambulanceService);

  return result.sort((a, b) => a.distance - b.distance);
}

/**
 * Dynamically generates state-specific and national schemes for a given State.
 * Includes website links, eligibility, benefits, required documents, and Nearest Office location.
 */
export function getGovernmentSchemes(state: string, city: string = 'Local', district: string = 'District'): GovernmentScheme[] {
  return getCentralizedSchemes(state, city, district);
}

function _unusedLegacySchemesBuilder(_state: string, _city: string = 'Local', _district: string = 'District'): GovernmentScheme[] {
  return [];
}
const finalCity = 'Local', finalDistrict = 'District', cleanState = 'Karnataka';
const nationalSchemes: any[] = [
    {
      id: "pmmvy_dyn",
      name: {
        en: "Pradhan Mantri Matru Vandana Yojana (PMMVY)",
        kn: "ಪ್ರಧಾನ ಮಂತ್ರಿ ಮಾತೃ ವಂದನಾ ಯೋಜನೆ (PMMVY)",
        hi: "प्रधानमंत्री मातृ वंदना योजना (PMMVY)",
        ta: "பிரதம மந்திரி மாத்ரு வந்தனா யோஜனா (PMMVY)",
        te: "ప్రధాన మంత్రి మాతృ వందన యోజన (PMMVY)"
      },
      purpose: {
        en: "Provides financial compensation for wage loss during pregnancy to promote adequate rest, clinical care and institutional deliveries.",
        kn: "ಗರ್ಭಾವಸ್ಥೆಯಲ್ಲಿ ವಿಶ್ರಾಂತಿ ಪಡೆಯಲು, ಕ್ಲಿನಿಕಲ್ ಆರೈಕೆ ಮತ್ತು ಸೂಕ್ತ ಹೆರಿಗೆ ಸೌಲಭ್ಯ ಪ್ರೋತ್ಸಾಹಿಸಲು ಆರ್ಥಿಕ ನೆರವು ಒದಗಿಸುತ್ತದೆ.",
        hi: "गर्भावस्था के दौरान मजदूरी के नुकसान की भरपाई और प्रसव पूर्व आराम व पोषण को बढ़ावा देने के लिए वित्तीय सहायता।",
        ta: "கர்ப்ப காலத்தில் ஓய்வெடுக்கவும் ஆரோக்கியமான பிரசவத்திற்காகவும் நிதியுதவி வழங்குகிறது.",
        te: "గర్భధారణ సమయంలో తగిన విశ్రాంతి మరియు సురక్షిత ప్రసవం కోసం ఆర్థిక సహాయం అందిస్తుంది."
      },
      eligibility: {
        en: "All Pregnant Women and Lactating Mothers registering their pregnancy at government health sub-centres or Anganwadis.",
        kn: "ಅಂಗನವಾಡಿ ಅಥವಾ ಸರ್ಕಾರಿ ಉಪ-ಕೇಂದ್ರಗಳಲ್ಲಿ ಹೆಸರು ನೋಂದಾಯಿಸುವ ಎಲ್ಲಾ ಗರ್ಭಿಣಿಯರು ಮತ್ತು ಬಾಣಂತಿಯರು.",
        hi: "सभी गर्भवती महिलाएं और स्तनपान कराने वाली माताएं जो सरकारी स्वास्थ्य केंद्रों में पंजीकरण कराती हैं।",
        ta: "அனைத்து கர்ப்பிணி பெண்கள் மற்றும் பாலூட்டும் தாய்மார்கள் (அரசு ஊழியர்கள் தவிர).",
        te: "గర్భిణీలు మరియు పాలిచ్చే తల్లులందరూ (ప్రభుత్వ ఉద్యోగులు మినహా)."
      },
      benefits: {
        en: "Direct cash transfer of ₹5,000 in two installments directly to Aadhaar-seeded bank accounts for nutritional support.",
        kn: "ನೇರ ನಗದು ವರ್ಗಾವಣೆ ಮೂಲಕ ಆಧಾರ್ ಲಿಂಕ್ ಆದ ಬ್ಯಾಂಕ್ ಖಾತೆಗೆ ಎರಡು ಕಂತುಗಳಲ್ಲಿ ₹೫,೦೦೦ ಜಮೆಯಾಗುತ್ತದೆ.",
        hi: "दो किस्तों में ₹5,000 की नकद राशि सीधे आधार-लिंक बैंक खाते में जमा की जाती है।",
        ta: "நேரடி பணமாக ₹5,000 இரண்டு தவணைகளில் ஆதார் இணைக்கப்பட்ட வங்கி கணக்கில் செலுத்தப்படும்.",
        te: "₹5,000 లబ్ధిదారుల ఆధార్ అనుసంధాన బ్యాంక్ ఖాతాకు నేరుగా రెండు విడతల్లో బదిలీ చేయబడుతుంది."
      },
      documents: {
        en: "Mother and Child Protection (MCP) card, Aadhaar Card of self and husband, bank passbook, pregnancy certificate.",
        kn: "ತಾಯಿ ಕಾರ್ಡ್ (MCP Card), ಸ್ವಂತ ಹಾಗೂ ಪತಿಯ ಆಧಾರ್ ಕಾರ್ಡ್, ಬ್ಯಾಂಕ್ ಪಾಸ್‌ಬುಕ್, ಗರ್ಭಧಾರಣೆಯ ಧೃಢೀಕರಣ ಪತ್ರ.",
        hi: "माता-शिशु संरक्षण (MCP) कार्ड, आधार कार्ड (स्वयं और पति), बैंक पासबुक, गर्भावस्था प्रमाण पत्र।",
        ta: "தாய்-சேய் பாதுகாப்பு (MCP) அட்டை, கணவன்-மனைவி ஆதಾರ್ அட்டை, வங்கி கணக்கு புத்தகம்.",
        te: "తల్లి మరియు శిశు సంరక్షణ (MCP) కార్డు, దంపతుల ఆధార్ కార్డు, బ్యాంక్ పాస్ బుక్."
      },
      website: "https://wcd.nic.in/schemes/pradhan-mantri-matru-vandana-yojana",
      nearestOffice: {
        en: `Anganwadi Integrated Nutrition Centre, Ward No. 5, ${finalCity}, ${finalDistrict} District`,
        kn: `ಅಂಗನವಾಡಿ ಸಮಗ್ರ ಪೌಷ್ಟಿಕ ಕೇಂದ್ರ, ವಾರ್ಡ್ ನಂ. ೫, ${finalCity}, ${finalDistrict} ಜಿಲ್ಲೆ`,
        hi: `आंगनवाड़ी एकीकृत पोषण केंद्र, वार्ड नंबर 5, ${finalCity}, ${finalDistrict} जिला`,
        ta: `அங்கன்வாடி ஒருங்கிணைந்த மையம், வார்டு எண் 5, ${finalCity}, ${finalDistrict} மாவட்டம்`,
        te: `అంగన్‌వాడీ పోషకాహార కేంద్రం, వార్డు నంబరు 5, ${finalCity}, ${finalDistrict} జిల్లా`
      }
    },
    {
      id: "jsy_dyn",
      name: {
        en: "Janani Suraksha Yojana (JSY)",
        kn: "ಜನನಿ ಸುರಕ್ಷಾ ಯೋಜನೆ (JSY)",
        hi: "जननी सुरक्षा योजना (JSY)",
        ta: "ஜனனி சுரக்ஷா யோயனா (JSY)",
        te: "జనని సురక్ష యోజన (JSY)"
      },
      purpose: {
        en: "Safe motherhood intervention under National Health Mission to reduce maternal and neonatal mortality by promoting institutional deliveries.",
        kn: "ಆಸ್ಪತ್ರೆಗಳಲ್ಲಿ ಸುರಕ್ಷಿತ ಹೆರಿಗೆ ಪ್ರೋತ್ಸಾಹಿಸುವ ಮೂಲಕ ತಾಯಿ ಮತ್ತು ಮಗುವಿನ ಮರಣ ಪ್ರಮಾಣವನ್ನು ಕಡಿಮೆ ಮಾಡುವುದು.",
        hi: "अस्पतालों में सुरक्षित प्रसव को बढ़ावा देकर मातृ और शिशु मृत्यु दर को कम करने के लिए राष्ट्रीय स्वास्थ्य मिशन के तहत योजना।",
        ta: "அரசு மருத்துவமனைகளில் பிரசவம் செய்து கொள்வதை ஊக்குவித்து தாய்-சேய் இறப்பு விகிதத்தை குறைப்பது.",
        te: "ఆసుపత్రులలో సురక్షిత ప్రసవాలను ప్రోత్సహించడం ద్వారా తల్లి మరియు శిశు మరణాల రేటును తగ్గించడం."
      },
      eligibility: {
        en: "Focus on BPL (Below Poverty Line) families, SC/ST pregnant women delivering in government health facilities or accredited clinics.",
        kn: "ಬಡತನ ರೇಖೆಗಿಂತ ಕೆಳಗಿರುವ (BPL) ಕುಟುಂಬಗಳು ಮತ್ತು ಪರಿಶಿಷ್ಟ ಜಾತಿ / ಪಂಗಡದ ಗರ್ಭಿಣಿಯರು.",
        hi: "गरीबी रेखा से नीचे (BPL) वाले परिवार और अनुसूचित जाति/जनजाति की गर्भवती महिलाएं जो सरकारी अस्पताल में प्रसव करवाती हैं।",
        ta: "வறுமை கோட்டிற்கு கீழ் உள்ள குடும்பங்கள் மற்றும் பழங்குடியின கர்ப்பிணி பெண்கள்.",
        te: "దారిద్య్రరేఖకు దిగువన ఉన్న కుటుంబాలు, ఎస్సీ/ఎస్టీ గర్భిణీ స్త్రీలు."
      },
      benefits: {
        en: "Cash assistance of ₹1,400 (Rural areas) and ₹1,000 (Urban areas) to the mother post-delivery plus ambulance assistance.",
        kn: "ಹೆರಿಗೆಯ ನಂತರ ಗ್ರಾಮೀಣ ಪ್ರದೇಶದಲ್ಲಿ ₹೧,೪೦೦ ಮತ್ತು ನಗರ ಪ್ರದೇಶದಲ್ಲಿ ₹೧,೦೦೦ ಹಣದ ಸಹಾಯ ಮತ್ತು ಉಚಿತ ಆಂಬ್ಯುಲೆನ್ಸ್ ಸೌಲಭ್ಯ.",
        hi: "प्रसव के बाद माँ को ₹1,400 (ग्रामीण क्षेत्रों में) और ₹1,000 (शहरी क्षेत्रों में) की वित्तीय सहायता और मुफ्त एम्बुलेंस।",
        ta: "பிரசவத்திற்கு பின் கிராமப்புறங்களுக்கு ₹1,400, நகர்ப்புறங்களுக்கு ₹1,000 நிதியுதவி மற்றும் ஆம்புலன்ஸ்.",
        te: "ప్రసవానంతరం గ్రామీణ ప్రాంతాల్లో ₹1,400, పట్టణ ప్రాంతాల్లో ₹1,000 ఆర్థిక సహాయం & అంబులెన్స్ సేవ."
      },
      documents: {
        en: "MCP Card, JSY Card, BPL Card, Government Hospital discharge slip, Aadhaar card.",
        kn: "ತಾಯಿ ಕಾರ್ಡ್ (MCP), JSY ಕಾರ್ಡ್, ಬಿಪಿಎಲ್ ಕಾರ್ಡ್, ಆಸ್ಪತ್ರೆಯ ಡಿಸ್ಚಾರ್ಜ್ ಕಾರ್ಡ್, ಆಧಾರ್ ಕಾರ್ಡ್.",
        hi: "MCP कार्ड, JSY कार्ड, बीपीएल कार्ड, सरकारी अस्पताल का डिस्चार्ज प्रमाणपत्र, आधार।",
        ta: "MCP அட்டை, JSY அட்டை, BPL அட்டை, அரசு மருத்துவமனை விடுப்பு சான்றிதழ், ஆதார் அட்டை.",
        te: "MCP కార్డు, JSY కార్డు, బీపీఎల్ కార్డు, ఆసుపత్రి డిశ్చార్జ్ పత్రం, ఆధార్ కార్డు."
      },
      website: "https://nhm.gov.in/index1.php?lang=1&level=3&sublinkid=841&lid=309",
      nearestOffice: {
        en: `Primary Health Centre (PHC), ${finalCity}, ${finalDistrict} District`,
        kn: `ಪ್ರಾಥಮಿಕ ಆರೋಗ್ಯ ಕೇಂದ್ರ (PHC), ${finalCity}, ${finalDistrict} ಜಿಲ್ಲೆ`,
        hi: `प्राथमिक स्वास्थ्य केंद्र (PHC), ${finalCity}, ${finalDistrict} जिला`,
        ta: `ஆரம்ப சுகாதார நிலையம் (PHC), ${finalCity}, ${finalDistrict} மாவட்டம்`,
        te: `ప్రాథమిక ఆరోగ్య కేంద్రం (PHC), ${finalCity}, ${finalDistrict} జిల్లా`
      }
    }
  ];

  // State-specific welfare schemes
  const stateSchemesMap: Record<string, any[]> = {
    'Karnataka': [
      {
        id: "mathru_poorna",
        name: {
          en: "Mathru Poorna Scheme",
          kn: "ಮಾತೃ ಪೂರ್ಣ ಯೋಜನೆ",
          hi: "मातृ पूर्ण योजना (कर्नाटक)",
          ta: "மாத்ரு பூர்ணா திட்டம் (கர்நாடகா)",
          te: "మాతృ పూర్ణ పథకం (కర్ణాటక)"
        },
        purpose: {
          en: "Improves the nutritional status of pregnant women and lactating mothers by providing hot cooked meals containing iron, calcium, and protein.",
          kn: "ಗರ್ಭಿಣಿಯರು ಮತ್ತು ಬಾಣಂತಿಯರಿಗೆ ಕಬ್ಬಿಣಾಂಶ, ಕ್ಯಾಲ್ಸಿಯಂ ಮತ್ತು ಪ್ರೋಟೀನ್ ಒಳಗೊಂಡ ಬಿಸಿ ಬೇಯಿಸಿದ ಊಟ ನೀಡುವ ಮೂಲಕ ಅಪೌಷ್ಟಿಕತೆ ಹೋಗಲಾಡಿಸುವುದು.",
          hi: "गर्भवती महिलाओं और स्तनपान कराने वाली माताओं को प्रोटीन, कैल्शियम और आयरन से भरपूर गर्म पका हुआ भोजन प्रदान करना।",
          ta: "கர்ப்பிணிகள் மற்றும் பாலூட்டும் தாய்மார்களுக்கு சத்துக்கள் நிறைந்த சமைத்த சூடான உணவை வழங்குதல்.",
          te: "గర్భిణీలు మరియు పాలిచ్చే తల్లులకు పోషకాలు నిండిన వేడి వండిన భోజనాన్ని అందించడం."
        },
        eligibility: {
          en: "All pregnant women and lactating mothers residing in Karnataka who are mapped to Anganwadi areas.",
          kn: "ಕರ್ನಾಟಕದಲ್ಲಿ ವಾಸಿಸುತ್ತಿರುವ ಮತ್ತು ಅಂಗನವಾಡಿ ಕೇಂದ್ರಗಳ ವ್ಯಾಪ್ತಿಯಲ್ಲಿ ಬರುವ ಎಲ್ಲಾ ಗರ್ಭಿಣಿಯರು ಹಾಗೂ ಬಾಣಂತಿಯರು.",
          hi: "कर्नाटक में रहने वाली सभी गर्भवती महिलाएं और स्तनपान कराने वाली माताएं जो आंगनवाड़ियों से जुड़ी हैं।",
          ta: "கர்நாடகாவில் உள்ள அனைத்து அங்கன்வாடி பகுதிகளைச் சேர்ந்த கர்ப்பிணி மற்றும் பாலூட்டும் தாய்மார்கள்.",
          te: "కర్ణాటకలోని అంగన్‌వాడీ పరిధిలోని గర్భిణీలు మరియు పాలిచ్చే తల్లులందరూ."
        },
        benefits: {
          en: "A comprehensive hot cooked lunch daily at the Anganwadi, including milk, egg/sprouted green gram, and clinical iron tablets.",
          kn: "ಪ್ರತಿದಿನ ಅಂಗನವಾಡಿ ಕೇಂದ್ರಗಳಲ್ಲಿ ಹಾಲು, ಮೊಟ್ಟೆ / ಮೊಳಕೆ ಭರಿತ ಹೆಸರುಕಾಳು ಮತ್ತು ಐರನ್ ಮಾತ್ರೆಗಳನ್ನು ಒಳಗೊಂಡ ಪೌಷ್ಟಿಕ ಬಿಸಿ ಬೇಯಿಸಿದ ಊಟ.",
          hi: "आंगनवाड़ी में दैनिक रूप से दूध, अंडा/अंकुरित मूंग, और आयरन की गोलियों के साथ पौष्टिक गर्म दोपहर का भोजन।",
          ta: "தினமும் அங்கன்வாடியில் பால், முட்டை, முளைகட்டிய பயிறு மற்றும் இரும்புச்சத்து மாத்திரைகளுடன் கூடிய சூடான சத்துணவு.",
          te: "రోజూ అంగన్‌వాడీలో పాలు, గుడ్డు/మొలకెత్తిన పప్పులు మరియు ఐరన్ మాత్రలతో కూడిన వేడి భోజనం."
        },
        documents: {
          en: "Aadhaar Card, MCP (Thayi) Card, local residency proof.",
          kn: "ಆಧಾರ್ ಕಾರ್ಡ್, ತಾಯಿ ಕಾರ್ಡ್ (MCP Card), ಸ್ಥಳೀಯ ನಿವಾಸಿ ಪ್ರಮಾಣ ಪತ್ರ.",
          hi: "आधार कार्ड, एमसीपी (थाई) कार्ड, स्थानीय निवास प्रमाण पत्र।",
          ta: "ஆதார் அட்டை, தாய் அட்டை (MCP), உள்ளூர் குடியிருப்பு சான்றிதழ்.",
          te: "ఆధార్ కార్డు, తల్లి కార్డు (MCP), స్థానిక నివాస ధృవీకరణ పత్రం."
        },
        website: "https://dwcd.karnataka.gov.in",
        nearestOffice: {
          en: `Local Anganwadi Sector Office, ${finalCity}, ${finalDistrict}`,
          kn: `ಸ್ಥಳೀಯ ಅಂಗನವಾಡಿ ವಲಯ ಕಚೇರಿ, ${finalCity}, ${finalDistrict} ಜಿಲ್ಲೆ`,
          hi: `स्थानीय आंगनवाड़ी क्षेत्रीय कार्यालय, ${finalCity}, ${finalDistrict}`,
          ta: `உள்ளூர் அங்கன்வாடி அலுவலகம், ${finalCity}, ${finalDistrict}`,
          te: `స్థానిక అంగన్‌వాడీ కార్యాలయం, ${finalCity}, ${finalDistrict}`
        }
      }
    ],
    'Tamil Nadu': [
      {
        id: "muthulakshmi_reddy",
        name: {
          en: "Dr. Muthulakshmi Reddy Maternity Benefit Scheme",
          kn: "ಡಾ. ಮುತ್ತುಲಕ್ಷ್ಮಿ ರೆಡ್ಡಿ ಹೆರಿಗೆ ಸೌಲಭ್ಯ ಯೋಜನೆ",
          hi: "डॉ. मुथुलक्ष्मी रेड्डी मातृत्व लाभ योजना (तमिलनाडु)",
          ta: "டாக்டர் முத்துலட்சுமி ரெட்டி மகப்பேறு நிதியுதவி திட்டம்",
          te: "డాక్టర్ ముత్తులక్ష్మి రెడ్డి మాతృత్వ సహాయ పథకం"
        },
        purpose: {
          en: "Provides substantial cash and nutritional assistance to poor pregnant women to compensate for wages and ensure safe institutional care.",
          kn: "ಬಡ ಗರ್ಭಿಣಿಯರಿಗೆ ಹೆರಿಗೆ ಸಮಯದಲ್ಲಿ ಉಂಟಾಗುವ ವೇತನ ನಷ್ಟ ಸರಿದೂಗಿಸಲು ಮತ್ತು ಸುರಕ್ಷಿತ ಹೆರಿಗೆಗೆ ಗಣನೀಯ ಆರ್ಥಿಕ ನೆರವು.",
          hi: "गरीब गर्भवती महिलाओं को मजदूरी के नुकसान की भरपाई और प्रसव देखभाल सुनिश्चित करने के लिए भारी नकद और पोषण सहायता।",
          ta: "ஏழை கர்ப்பிணிப் பெண்களுக்கு ஊதிய இழப்பை ஈடுசெய்யவும், பாதுகாப்பான பிரசவத்தை உறுதி செய்யவும் கணிசமான நிதியுதவி வழங்குதல்.",
          te: "పేద గర్భిణీలకు వేతన నష్టాన్ని భర్తీ చేయడానికి మరియు సురక్షిత ప్రసవం కోసం ఆర్థిక సహాయం."
        },
        eligibility: {
          en: "Poor pregnant women in Tamil Nadu above 19 years of age who opt for institutional delivery in government hospitals.",
          kn: "ಕರ್ನಾಟಕಕ್ಕೆ ಬದಲಾಗಿ ತಮಿಳುನಾಡಿನ ಸರ್ಕಾರಿ ಆಸ್ಪತ್ರೆಯಲ್ಲಿ ಹೆರಿಗೆ ಮಾಡಿಸುವ ೧೯ ವರ್ಷ ಮೇಲ್ಪಟ್ಟ ಬಡ ಗರ್ಭಿಣಿಯರು.",
          hi: "तमिलनाडु की 19 वर्ष से अधिक आयु की गरीब गर्भवती महिलाएं जो सरकारी अस्पतालों में प्रसव कराती हैं।",
          ta: "அரசு மருத்துவமனைகளில் பிரசவம் செய்து கொள்ளும் 19 வயதிற்கு மேற்பட்ட ஏழை கர்ப்பிணிப் பெண்கள்.",
          te: "ప్రభుత్వ ఆసుపత్రులలో ప్రసవం చేయించుకునే తమిళనాడులోని 19 ఏళ్లు పైబడిన పేద గర్భిణీలు."
        },
        benefits: {
          en: "Financial assistance of ₹18,000 in cash instalments and Nutrition Kits containing health mix, iron tonic, and dry fruits.",
          kn: "₹೧೮,೦೦೦ ನಗದು ನೆರವು ಮತ್ತು ಆರೋಗ್ಯ ಮಿಕ್ಸ್, ಐರನ್ ಟಾನಿಕ್, ಒಣ ಹಣ್ಣುಗಳನ್ನು ಒಳಗೊಂಡ ಪೌಷ್ಟಿಕ ಕಿಟ್.",
          hi: "₹18,000 की वित्तीय सहायता किस्तों में, साथ ही न्यूट्रिशन किट जिसमें हेल्थ मिक्स, आयरन टॉनिक और सूखे मेवे शामिल हैं।",
          ta: "₹18,000 நிதியுதவி தவணைகளாக, மற்றும் சத்து மாவு, இரும்புச்சத்து டானிக், உலர்ந்த பழங்கள் அடங்கிய ஊட்டச்சத்து பெட்டகம் (Nutrition Kit).",
          te: "₹18,000 లబ్ధిదారుల ఖాతాకు విడతలుగా బదిలీ మరియు పోషకాహార కిట్."
        },
        documents: {
          en: "Aadhaar Card, Bank Passbook copy, PICME registration number, income certificate.",
          kn: "ಆಧಾರ್ ಕಾರ್ಡ್, ಬ್ಯಾಂಕ್ ಪಾಸ್‌ಬುಕ್ ಪ್ರಗತಿ, PICME ನೋಂದಣಿ ಸಂಖ್ಯೆ, ಆದಾಯ ಪ್ರಮಾಣ ಪತ್ರ.",
          hi: "आधार कार्ड, बैंक पासबुक प्रति, PICME पंजीकरण संख्या, आय प्रमाण पत्र।",
          ta: "ஆதார் அட்டை, வங்கி கணக்கு புத்தகம், PICME பதிவு எண், வருமான சான்றிதழ்.",
          te: "ఆధార్ కార్డు, బ్యాంక్ పాస్ బుక్, PICME రిజిస్ట్రేషన్ సంఖ్య, ఆదాయ ధృవీకరణ పత్రం."
        },
        website: "https://picme.tn.gov.in",
        nearestOffice: {
          en: `Primary Health Centre (PHC), PICME Registration Desk, ${finalCity}, ${finalDistrict}`,
          kn: `ಪ್ರಾಥಮಿಕ ಆರೋಗ್ಯ ಕೇಂದ್ರ (PHC) ಮತ್ತು PICME ನೋಂದಣಿ ಕೌಂಟರ್, ${finalCity}, ${finalDistrict}`,
          hi: `प्राथमिक स्वास्थ्य केंद्र (PHC), PICME पंजीकरण डेस्क, ${finalCity}, ${finalDistrict}`,
          ta: `ஆரம்ப சுகாதார நிலையம், PICME பதிவு மையம், ${finalCity}, ${finalDistrict}`,
          te: `ప్రాథమిక ఆరోగ్య కేంద్రం, PICME రిజిస్ట్రేషన్ డెస్క్, ${finalCity}, ${finalDistrict}`
        }
      }
    ],
    'Kerala': [
      {
        id: "maternal_kerala",
        name: {
          en: "Kerala State Maternal and Child Support Scheme",
          kn: "ಕೇರಳ ರಾಜ್ಯ ತಾಯಿ ಮತ್ತು ಮಗು ಬೆಂಬಲ ಯೋಜನೆ",
          hi: "केरल राज्य मातृ एवं शिशु सहायता योजना",
          ta: "கேரளா மாநில தாய்-சேய் நல ஆதரவு திட்டம்",
          te: "కేరళ రాష్ట్ర మాతృ & శిశు సంరక్షణ పథకం"
        },
        purpose: {
          en: "Ensures comprehensive medical care, high-quality nutrition supplements, and diagnostic screening for pregnant women completely free.",
          kn: "ಗರ್ಭಿಣಿಯರಿಗೆ ಸಂಪೂರ್ಣ ಉಚಿತ ವೈದ್ಯಕೀಯ ಚಿಕಿತ್ಸೆ, ಗುಣಮಟ್ಟದ ಪೌಷ್ಟಿಕ ಆಹಾರ ಪೂರಕಗಳು ಮತ್ತು ಸ್ಕ್ಯಾನಿಂಗ್ ಸೌಲಭ್ಯಗಳನ್ನು ಒದಗಿಸುವುದು.",
          hi: "गर्भवती महिलाओं के लिए व्यापक मुफ्त चिकित्सा देखभाल, उच्च गुणवत्ता वाले पोषण पूरक और स्कैनिंग की सुविधा।",
          ta: "கர்ப்பிணிப் பெண்களுக்கு விரிவான மருத்துவப் பராமரிப்பு, உயர்தர ஊட்டச்சத்து சத்துக்கள் மற்றும் பரிசோதனைகளை முற்றிலும் இலவசமாக வழங்குதல்.",
          te: "గర్భిణీలకు సమగ్ర వైద్య సంరక్షణ, నాణ్యమైన పోషకాహార సప్లిమెంట్లు మరియు ఉచిత స్కానింగ్ సౌకర్యం."
        },
        eligibility: {
          en: "All pregnant residents of Kerala registering within the local e-health network.",
          kn: "ಕೇರಳದ ಸ್ಥಳೀಯ ಇ-ಹೆಲ್ತ್ ಜಾಲದಲ್ಲಿ ನೋಂದಾಯಿಸಿಕೊಳ್ಳುವ ಎಲ್ಲಾ ಗರ್ಭಿಣಿಯರು.",
          hi: "केरल की सभी गर्भवती महिलाएं जो स्थानीय ई-स्वास्थ्य नेटवर्क के तहत पंजीकृत हैं।",
          ta: "கேரளாவின் உள்ளூர் இ-ஹெல்த் நெட்வொர்க்கில் பதிவு செய்யும் அனைத்து கர்ப்பிணிப் பெண்கள்.",
          te: "కేరళ ఇ-హెల్త్ నెట్‌వర్క్‌లో నమోదైన గర్భిణీలు అందరూ."
        },
        benefits: {
          en: "Free ultrasound scans, institutional lab reports, weekly take-home health supplements, and transport subsidies.",
          kn: "ಉಚಿತ ಅಲ್ಟ್ರಾಸೌಂಡ್ ಸ್ಕ್ಯಾನಿಂಗ್, ಲ್ಯಾಬ್ ವರದಿಗಳು, ವಾರದ ಪೌಷ್ಟಿಕಾಂಶದ ಪುಡಿ ಮತ್ತು ಹೆರಿಗೆ ವಾಹನ ಸಾರಿಗೆ ಸಬ್ಸಿಡಿ.",
          hi: "मुफ्त अल्ट्रासाउंड स्कैन, लैब रिपोर्ट, साप्ताहिक पूरक आहार और परिवहन सब्सिडी।",
          ta: "இலவச அல்ட்ராசவுண்ட் ஸ்கேன், ஆய்வக பரிசோதனைகள், வாராந்திர சத்து மாவு மற்றும் போக்குவரத்து மானியம்.",
          te: "ఉచిత అల్ట్రాసౌండ్ స్కాన్, ల్యాబ్ రిపోర్టులు, వారపు పోషకాహారం మరియు రవాణా సబ్సిడీ."
        },
        documents: {
          en: "e-Health ID Card, Aadhaar Card, Local residence certificate.",
          kn: "ಇ-ಹೆಲ್ತ್ ಗುರುತಿನ ಚೀಟಿ, ಆಧಾರ್ ಕಾರ್ಡ್, ಸ್ಥಳೀಯ ವಾಸಸ್ಥಳ ಪ್ರಮಾಣ ಪತ್ರ.",
          hi: "ई-स्वास्थ्य आईडी कार्ड, आधार कार्ड, स्थानीय निवास प्रमाण पत्र।",
          ta: "இ-ஹெல்த் அடையாள அட்டை, ஆதார் அட்டை, உள்ளூர் குடியிருப்பு சான்றிதழ்.",
          te: "ఇ-హెల్త్ ఐడీ కార్డు, ఆధార్ కార్డు, నివాస ధృవీకరణ పత్రం."
        },
        website: "https://health.kerala.gov.in",
        nearestOffice: {
          en: `Government CHC / Family Health Centre (FHC), ${finalCity}, ${finalDistrict}`,
          kn: `ಸರ್ಕಾರಿ ಸಮುದಾಯ ಆರೋಗ್ಯ ಕೇಂದ್ರ (CHC) / ಕುಟುಂಬ ಆರೋಗ್ಯ ಕೇಂದ್ರ, ${finalCity}, ${finalDistrict}`,
          hi: `सरकारी सीएचसी / पारिवारिक स्वास्थ्य केंद्र (FHC), ${finalCity}, ${finalDistrict}`,
          ta: `அரசு சமூக சுகாதார நிலையம் (CHC) / குடும்ப நல மையம் (FHC), ${finalCity}, ${finalDistrict}`,
          te: `ప్రభుత్వ సామాజిక ఆరోగ్య కేంద్రం / కుటుంబ ఆరోగ్య కేంద్రం (FHC), ${finalCity}, ${finalDistrict}`
        }
      }
    ],
    'Andhra Pradesh': [
      {
        id: "ysr_amma_vodi",
        name: {
          en: "YSR Amma Vodi & Aarogyasri Maternal Scheme",
          kn: "YSR ಅಮ್ಮ ಒಡಿ ಮತ್ತು ಆರೋಗ್ಯಶ್ರೀ ಹೆರಿಗೆ ಯೋಜನೆ",
          hi: "वाईएसआर अम्मा वोडी एवं आरोग्यश्री मातृ योजना (आंध्र प्रदेश)",
          ta: "ஒய்.எஸ்.ஆர் அம்மா வோடி மகப்பேறு திட்டம்",
          te: "వైఎస్సార్ అమ్మ ఒడి & ఆరోగ్యశ్రీ మాతృత్వ పథకం"
        },
        purpose: {
          en: "Supports mother and child education, safety, and health from pregnancy onwards by providing direct financial incentive and free tertiary healthcare.",
          kn: "ಗರ್ಭಾವಸ್ಥೆಯಿಂದಲೇ ತಾಯಿ ಮತ್ತು ಮಗುವಿನ ಶಿಕ್ಷಣ ಹಾಗೂ ಆರೋಗ್ಯ ಸುಧಾರಿಸಲು ನೇರ ಆರ್ಥಿಕ ಪ್ರೋತ್ಸಾಹ ಮತ್ತು ಉಚಿತ ಉನ್ನತ ವೈದ್ಯಕೀಯ ಚಿಕಿತ್ಸೆ.",
          hi: "गर्भावस्था से ही मां और बच्चे की शिक्षा, सुरक्षा और स्वास्थ्य के लिए प्रत्यक्ष वित्तीय प्रोत्साहन और मुफ्त तृतीयक स्वास्थ्य देखभाल।",
          ta: "கர்ப்ப காலம் முதலே தாய் மற்றும் குழந்தையின் கல்வி, பாதுகாப்பு மற்றும் ஆரோக்கியத்தை மேம்படுத்த நிதியுதவியுடன் கூடிய இலவச மருத்துவ சிகிச்சை.",
          te: "గర్భధారణ నుండి తల్లి మరియు శిశు సంరక్షణ, విద్య మరియు ఉచిత కార్పొరేట్ వైద్యం కోసం ఆర్థిక సహాయం."
        },
        eligibility: {
          en: "Mothers from BPL and lower-income families who ensure children regular school and mandatory clinical immunizations.",
          kn: "ಬಿಪಿಎಲ್ ಮತ್ತು ಕಡಿಮೆ ಆದಾಯದ ಕುಟುಂಬಗಳ ತಾಯಂದಿರು ಮಗುವಿಗೆ ನಿಯಮಿತ ಶಿಕ್ಷಣ ಮತ್ತು ಲಸಿಕೆಗಳನ್ನು ಖಚಿತಪಡಿಸಿದಾಗ.",
          hi: "गरीबी रेखा से नीचे और कम आय वाले परिवारों की माताएं जो बच्चों की नियमित शिक्षा और आवश्यक टीकाकरण सुनिश्चित करती हैं।",
          ta: "வறுமை கோட்டிற்கு கீழ் உள்ள மற்றும் குறைந்த வருமானம் கொண்ட குடும்பங்களின் தாய்மார்கள்.",
          te: "దారిద్య్రరేఖకు దిగువన ఉన్న కుటుంబాల గర్భిణీలు మరియు తల్లులు."
        },
        benefits: {
          en: "Annual direct benefit transfer of ₹15,000 for child welfare, plus cashless maternal surgery under Dr. YSR Aarogyasri network.",
          kn: "ಮಗುವಿನ ಕಲ್ಯಾಣಕ್ಕಾಗಿ ವಾರ್ಷಿಕ ₹೧೫,೦೦೦ ನೇರ ಜಮೆ ಮತ್ತು ಆರೋಗ್ಯಶ್ರೀ ನೆಟ್‌ವರ್ಕ್‌ನಲ್ಲಿ ಉಚಿತ ಹೆರಿಗೆ ಚಿಕಿತ್ಸೆಗಳು.",
          hi: "बाल कल्याण के लिए ₹15,000 का वार्षिक प्रत्यक्ष लाभ हस्तांतरण, साथ ही वाईएसआर आरोग्यश्री के तहत कैशलेस मातृत्व सर्जरी।",
          ta: "குழந்தை நலனுக்காக ஆண்டுக்கு ₹15,000 நேரடி நிதியுதவி, மற்றும் ஒய்.எஸ்.ஆர் ஆரோக்கியஸ்ரீ மூலம் இலவச அறுவை சிகிச்சை பிரசவங்கள்.",
          te: "పిల్లల సంరక్షణకు ఏటా ₹15,000 నేరుగా బదిలీ, మరియు వైఎస్సార్ ఆరోగ్యశ్రీ ద్వారా ఉచిత ప్రసవ శస్త్రచికిత్సలు."
        },
        documents: {
          en: "Aadhaar Card, Rice Card (BPL ration), Aarogyasri Health Card, Bank details.",
          kn: "ಆಧಾರ್ ಕಾರ್ಡ್, ರೈಸ್ ಕಾರ್ಡ್ (ಬಿಪಿಎಲ್), ಆರೋಗ್ಯಶ್ರೀ ಹೆಲ್ತ್ ಕಾರ್ಡ್, ಬ್ಯಾಂಕ್ ಖಾತೆ ವಿವರ.",
          hi: "आधार कार्ड, राइस कार्ड (बीपीएल राशन), आरोग्यश्री स्वास्थ्य कार्ड, बैंक विवरण।",
          ta: "ஆதார் அட்டை, அரிசி அட்டை (BPL), ஆரோக்கியஸ்ரீ அடையாள அட்டை, வங்கி கணக்கு விவரம்.",
          te: "ఆధార్ కార్డు, రైస్ కార్డు, ఆరోగ్యశ్రీ కార్డు, బ్యాంక్ ఖాతా వివరాలు."
        },
        website: "https://ysrammavodi.ap.gov.in",
        nearestOffice: {
          en: `Ward / Grama Sachivalayam (Village Secretariat), ${finalCity}, ${finalDistrict}`,
          kn: `ಗ್ರಾಮ ಸಚಿವಾಲಯ / ವಾರ್ಡ್ ಆಫೀಸ್, ${finalCity}, ${finalDistrict} ಜಿಲ್ಲೆ`,
          hi: `ग्राम सचिवालय (Village Secretariat), ${finalCity}, ${finalDistrict}`,
          ta: `கிராம செயலகம் (Village Secretariat), ${finalCity}, ${finalDistrict}`,
          te: `గ్రామ/వార్డు సచివాలయం, ${finalCity}, ${finalDistrict}`
        }
      }
    ],
    'Telangana': [
      {
        id: "kcr_kit",
        name: {
          en: "KCR Kit & Arogya Lakshmi Scheme",
          kn: "KCR ಕಿಟ್ ಮತ್ತು ಆರೋಗ್ಯ ಲಕ್ಷ್ಮಿ ಯೋಜನೆ",
          hi: "केसीआर किट एवं आरोग्य लक्ष्मी योजना (तेलंगाना)",
          ta: "கே.சி.ஆர் கிட் மற்றும் ஆரோக்கிய லட்சுமி திட்டம்",
          te: "కేసీఆర్ కిట్ & ఆరోగ్య లక్ష్మి పథకం"
        },
        purpose: {
          en: "Improves neonatal health, prevents maternal infections, and provides nutritious meals at Anganwadis with financial aid for infant care.",
          kn: "ಶಿಶು ಮರಣ ಪ್ರಮಾಣ ಕಡಿಮೆ ಮಾಡಲು, ಉಚಿತ ಬಿಸಿ ಊಟ ಮತ್ತು ಪೌಷ್ಟಿಕಾಂಶ ಜೊತೆಗೆ ಮಗುವಿನ ಆರೈಕೆಗೆ ಉಚಿತ ಆರ್ಥಿಕ ನೆರವು ಮತ್ತು ಬೇಬಿ ಕಿಟ್.",
          hi: "शिशु मृत्यु दर को कम करने के लिए वित्तीय सहायता, आंगनवाड़ी में पौष्टिक भोजन और शिशु देखभाल के लिए 'केसीआर किट' प्रदान करना।",
          ta: "குழந்தை இறப்பைத் தடுக்க, அங்கன்வாடிகளில் ஊட்டச்சத்து உணவுகள் மற்றும் குழந்தைப் பராமரிப்பிற்கான கே.சி.ஆர் கிட் (KCR Kit) வழங்குதல்.",
          te: "శిశు ఆరోగ్య సంరక్షణ, అంగన్‌వాడీల ద్వారా రోజువారీ పోషకాహార భోజనం మరియు శిశువు సంరక్షణకు ఆర్థిక సహాయం."
        },
        eligibility: {
          en: "Pregnant and lactating women delivering in government health facilities in Telangana, up to two deliveries.",
          kn: "ತೆಲಂಗಾಣದ ಸರ್ಕಾರಿ ಆಸ್ಪತ್ರೆಯಲ್ಲಿ ಹೆರಿಗೆ ಮಾಡಿಸುವ ಗರ್ಭಿಣಿಯರು (ಗರಿಷ್ಠ ೨ ಹೆರಿಗೆಗಳಿಗೆ ಮಾತ್ರ).",
          hi: "तेलंगाना के सरकारी अस्पतालों में प्रसव कराने वाली गर्भवती और स्तनपान कराने वाली महिलाएं (अधिकतम दो बच्चों तक)।",
          ta: "தெலுங்கானாவில் அரசு மருத்துவமனைகளில் பிரசவம் செய்து கொள்ளும் கர்ப்பிணிகள் (அதிகபட்சம் இரண்டு பிரசவங்கள் வரை).",
          te: "ప్రభుత్వ ఆసుపత్రులలో ప్రసవించే గర్భిణీలు మరియు తల్లులు (గరిష్టంగా రెండు ప్రసవాల వరకు)."
        },
        benefits: {
          en: "Financial assistance of ₹12,000 (₹13,000 for a girl child) in instalments, plus a baby care 'KCR Kit' containing 16 essential newborn items.",
          kn: "₹೧೨,೦೦೦ ಆರ್ಥಿಕ ನೆರವು (ಹೆಣ್ಣು ಮಗುವಾದರೆ ₹೧೩,೦೦೦) ಕಂತುಗಳಲ್ಲಿ ಮತ್ತು ನವಜಾತ ಶಿಶುವಿಗೆ ಬೇಕಾಗುವ ೧೬ ಅತ್ಯಗತ್ಯ ವಸ್ತುಗಳ ಉಚಿತ ಬೇಬಿ ಕಿಟ್.",
          hi: "किस्तों में ₹12,000 (बालिका होने पर ₹13,000) की वित्तीय सहायता, और 16 आवश्यक वस्तुओं से युक्त 'केसीआर किट'।",
          ta: "₹12,000 நிதியுதவி (பெண் குழந்தைக்கு ₹13,000) மற்றும் 16 அத்தியாவசிய பொருட்கள் அடங்கிய 'கே.சி.ஆர் கிட்' (KCR Kit) வழங்குதல்.",
          te: "₹12,000 ఆర్థిక సహాయం (ఆడపిల్ల పుడితే ₹13,000) మరియు 16 వస్తువులతో కూడిన శిశు సంరక్షణ 'కేసీఆర్ కిట్'."
        },
        documents: {
          en: "Aadhaar Card, Bank Passbook, Mother Registration ID (Arogyasri), delivery certificate from Govt hospital.",
          kn: "ಆಧಾರ್ ಕಾರ್ಡ್, ಬ್ಯಾಂಕ್ ಪಾಸ್‌ಬುಕ್, ಆರೋಗ್ಯಶ್ರೀ ಗುರುತಿನ ಚೀಟಿ, ಆಸ್ಪತ್ರೆಯ ಧೃಢೀಕರಣ ಪತ್ರ.",
          hi: "आधार कार्ड, बैंक पासबुक, मातृ पंजीकरण आईडी, सरकारी अस्पताल का प्रसव प्रमाण पत्र।",
          ta: "ஆதார் அட்டை, வங்கி கணக்கு புத்தகம், தாய் பதிவு ஐடி, அரசு மருத்துவமனை பிரசவ சான்றிதழ்.",
          te: "ఆధార్ కార్డు, బ్యాంక్ పాస్ బుక్, తల్లి రిజిస్ట్రేషన్ సంఖ్య, ప్రభుత్వ ఆసుపత్రి ప్రసవ ధృవీకరణ పత్రం."
        },
        website: "https://kcrkit.telangana.gov.in",
        nearestOffice: {
          en: `Government PHC / Civil Hospital KCR Desk, ${finalCity}, ${finalDistrict}`,
          kn: `ಸರ್ಕಾರಿ ಪ್ರಾಥಮಿಕ ಆರೋಗ್ಯ ಕೇಂದ್ರ / ಸಿವಿಲ್ ಆಸ್ಪತ್ರೆಯ KCR ಕೌಂಟರ್, ${finalCity}, ${finalDistrict}`,
          hi: `सरकारी पीएचसी / सिविल अस्पताल केसीआर डेस्क, ${finalCity}, ${finalDistrict}`,
          ta: `அரசு ஆரம்ப சுகாதார நிலையம், கே.சி.ஆர் உதவி மையம், ${finalCity}, ${finalDistrict}`,
          te: `ప్రభుత్వ పీహెచ్‌సీ / సివిల్ ఆసుపత్రి కేసీఆర్ డెస్క్, ${finalCity}, ${finalDistrict}`
        }
      }
    ],
    'Puducherry': [
      {
        id: "puducherry_maternity",
        name: {
          en: "Puducherry State Maternity Benefit Scheme",
          kn: "ಪುದುಚೇರಿ ರಾಜ್ಯ ಹೆರಿಗೆ ನೆರವು ಯೋಜನೆ",
          hi: "पुदुचेरी राज्य मातृत्व लाभ योजना",
          ta: "புதுச்சேரி மாநில மகப்பேறு நிதியுதவி திட்டம்",
          te: "పుదుచ్చేరి రాష్ట్ర మాతృత్వ సహాయ పథకం"
        },
        purpose: {
          en: "Provides local financial compensation for nutrition and medical checkups to eligible low-income pregnant mothers.",
          kn: "ಕಡಿಮೆ ಆದಾಯ ಹೊಂದಿರುವ ಗರ್ಭಿಣಿಯರಿಗೆ ಪೌಷ್ಟಿಕ ಆಹಾರ ಮತ್ತು ಹೆರಿಗೆ ತಪಾಸಣೆಗಾಗಿ ರಾಜ್ಯ ಮಟ್ಟದ ಆರ್ಥಿಕ ನೆರವು ಒದಗಿಸುವುದು.",
          hi: "पात्र कम आय वाली गर्भवती माताओं को पोषण और चिकित्सा जांच के लिए वित्तीय मुआवजा प्रदान करना।",
          ta: "குறைந்த வருமானம் கொண்ட கர்ப்பிணித் தாய்மார்களுக்கு ஊட்டச்சத்து மற்றும் மருத்துவப் பரிசோதனைகளுக்காக மாநில அரசு நிதியுதவி வழங்குதல்.",
          te: "అల్పాదాయ వర్గాల గర్భిణీలకు పోషకాహారం మరియు వైద్య పరీక్షల కోసం ఆర్థిక సహాయం."
        },
        eligibility: {
          en: "Residents of Puducherry (including Karaikal, Mahe, and Yanam) with a valid family ration card showing annual income below threshold.",
          kn: "ಪುದುಚೇರಿ, ಕಾರೈಕಲ್, ಮಾಹೆ ಮತ್ತು ಯಾನಂ ನಿವಾಸಿಗಳಾಗಿದ್ದು, ಕುಟುಂಬದ ಪಡಿತರ ಚೀಟಿ ಹೊಂದಿರುವ ಬಡ ಗರ್ಭಿಣಿಯರು.",
          hi: "पुदुचेरी (कराइकल, माहे और यानम सहित) की निवासी गर्भवती महिलाएं जिनके पास पात्र बीपीएल राशन कार्ड हो।",
          ta: "புதுச்சேரி (காரைக்கால், மாஹே, ஏனாம் உட்பட) மாநிலத்தைச் சேர்ந்த தகுதியான குடும்ப அட்டை கொண்ட கர்ப்பிணிகள்.",
          te: "పుదుచ్చేరి (కారైకాల్, మాహే, యానాం సహా) రేషన్ కార్డు కలిగిన గర్భిణీలు."
        },
        benefits: {
          en: "Direct financial grant of ₹6,000 for local prenatal nutrition support and transport allowances.",
          kn: "ಪೂರ್ವ ಹೆರಿಗೆ ಪೌಷ್ಟಿಕ ಆಹಾರ ಮತ್ತು ವಾಹನ ಸಾರಿಗೆ ಭತ್ಯೆಗಾಗಿ ಒಟ್ಟು ₹೬,೦೦೦ ಗಳ ಆರ್ಥಿಕ ಧನಸಹಾಯ.",
          hi: "स्थानीय प्रसव पूर्व पोषण सहायता और परिवहन भत्ते के लिए ₹6,000 का प्रत्यक्ष वित्तीय अनुदान।",
          ta: "பிரசவ முன்பரிசோதனை ஊட்டச்சத்து உதவிக்காக ₹6,000 நேரடி நிதியுதவி மற்றும் போக்குவரத்து மானியம்.",
          te: "గర్భధారణ పోషకాహారం మరియు ప్రయాణ ఖర్చుల కోసం ₹6,000 ఆర్థిక సహాయం."
        },
        documents: {
          en: "Ration Card (Red card / Yellow card), Aadhaar Card, Local residence proof, MCP card.",
          kn: "ರೇಷನ್ ಕಾರ್ಡ್ (ಕೆಂಪು / ಹಳದಿ ಕಾರ್ಡ್), ಆಧಾರ್ ಕಾರ್ಡ್, ವಾಸಸ್ಥಳ ದೃಢೀಕರಣ ಪತ್ರ, ತಾಯಿ ಕಾರ್ಡ್.",
          hi: "राशन कार्ड, आधार कार्ड, स्थानीय निवास प्रमाण पत्र, एमसीपी कार्ड।",
          ta: "குடும்ப அட்டை, ஆதார் அட்டை, உள்ளூர் குடியிருப்பு சான்றிதழ், MCP அட்டை.",
          te: "రేషన్ కార్డు, ఆధార్ కార్డు, నివాస ధృవీకరణ పత్రం, MCP కార్డు."
        },
        website: "https://wcd.py.gov.in",
        nearestOffice: {
          en: `Directorate of Social Welfare & WCD Department, ${finalCity}`,
          kn: `ಸಮಾಜ ಕಲ್ಯಾಣ ಮತ್ತು ಮಹಿಳಾ ಮತ್ತು ಮಕ್ಕಳ ಅಭಿವೃದ್ಧಿ ಇಲಾಖೆ ಕಚೇರಿ, ${finalCity}`,
          hi: `महिला एवं बाल विकास विभाग कार्यालय, ${finalCity}`,
          ta: `சமூக நலன் மற்றும் மகளிர் மேம்பாட்டுத் துறை அலுவலகம், ${finalCity}`,
          te: `మహిళా & శిశు అభివృద్ధి శాఖ కార్యాలయం, ${finalCity}`
        }
      }
    ]
  };

  // Combine national schemes with state-specific schemes
  const stateSchemes = stateSchemesMap[cleanState] || [];
  void nationalSchemes; void stateSchemes;
