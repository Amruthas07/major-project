export interface RegionalFoodItem {
  id: string;
  state: string;
  diet: 'Vegetarian' | 'Non-Vegetarian';
  name: {
    en: string;
    kn: string;
    hi: string;
  };
  calories: number;
  protein: number;
  carbs: number;
  fibre: number;
  iron?: number;
  calcium?: number;
  imageUrl: string;
  recipe: {
    en: string;
    kn: string;
    hi: string;
  };
}

export const regionalFoodDatabase: RegionalFoodItem[] = [
  // -------------------------------------------------------------
  // KARNATAKA
  // -------------------------------------------------------------
  {
    id: 'karnataka_01',
    state: 'Karnataka',
    diet: 'Vegetarian',
    name: {
      en: 'Bisi Bele Bath',
      kn: 'ಬಿಸಿ ಬೇಳೆ ಬಾತ್',
      hi: 'बिसी बेले बाथ'
    },
    calories: 380,
    protein: 10,
    carbs: 58,
    fibre: 8,
    iron: 3.2,
    calcium: 65,
    imageUrl: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=600&q=80',
    recipe: {
      en: 'Spicy lentil and rice dish cooked with vegetables and aromatic spices.',
      kn: 'ತರಕಾರಿಗಳು ಮತ್ತು ಪರಿಮಳಯುಕ್ತ ಮಸಾಲೆಗಳೊಂದಿಗೆ ಬೇಯಿಸಿದ ಮಸೂರ ಮತ್ತು ಅಕ್ಕಿ ಭಕ್ಷ್ಯ.',
      hi: 'सब्जियों और मसालों के साथ पकाई गई दाल और चावल की स्वादिष्ट डिश।'
    }
  },
  {
    id: 'karnataka_02',
    state: 'Karnataka',
    diet: 'Vegetarian',
    name: {
      en: 'Ragi Mudde with Sopinna Saaru',
      kn: 'ರಾಗಿ ಮುದ್ದೆ ಮತ್ತು ಸೊಪ್ಪಿನ ಸಾರು',
      hi: 'रागी मुड्डे और सोपिन सारू'
    },
    calories: 320,
    protein: 8,
    carbs: 64,
    fibre: 11,
    iron: 4.8,
    calcium: 344,
    imageUrl: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=600&q=80',
    recipe: {
      en: 'Traditional finger millet ball served with calcium-rich fresh green leafy greens curry.',
      kn: 'ಕ್ಯಾಲ್ಸಿಯಂ ಸಮೃದ್ಧ ತಾಜಾ ಹಸಿರು ಸೊಪ್ಪಿನ ಸಾರಿನೊಂದಿಗೆ ಸಾಂಪ್ರದಾಯಿಕ ರಾಗಿ ಮುದ್ದೆ.',
      hi: 'कैल्शियम से भरपूर ताजी हरी पत्तेदार साग की करी के साथ पारंपरिक रागी मुड्डे।'
    }
  },
  {
    id: 'karnataka_03',
    state: 'Karnataka',
    diet: 'Non-Vegetarian',
    name: {
      en: 'Mangalore Chicken Ghee Roast',
      kn: 'ಮಂಗಳೂರು ಚಿಕನ್ ಘೀ ರೋಸ್ಟ್',
      hi: 'मैंगलोर चिकन घी रोस्ट'
    },
    calories: 420,
    protein: 32,
    carbs: 12,
    fibre: 4,
    iron: 3.5,
    calcium: 48,
    imageUrl: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?auto=format&fit=crop&w=600&q=80',
    recipe: {
      en: 'Succulent chicken roasted in pure ghee with freshly ground Byadgi chilli and coastal spices.',
      kn: 'ಬ್ಯಾಡಗಿ ಮೆಣಸಿನಕಾಯಿ ಮತ್ತು ಕರಾವಳಿ ಮಸಾಲೆಗಳೊಂದಿಗೆ ಶುದ್ಧ ತುಪ್ಪದಲ್ಲಿ ಹುರಿದ ಚಿಕನ್.',
      hi: 'ब्यादगी मिर्च और तटीय मसालों के साथ शुद्ध घी में भुना हुआ स्वादिष्ट चिकन।'
    }
  },

  // -------------------------------------------------------------
  // KERALA
  // -------------------------------------------------------------
  {
    id: 'kerala_01',
    state: 'Kerala',
    diet: 'Non-Vegetarian',
    name: {
      en: 'Kerala Fish Curry',
      kn: 'ಕೇರಳ ಮೀನು ಸಾರು',
      hi: 'केरल फिश करी'
    },
    calories: 310,
    protein: 24,
    carbs: 8,
    fibre: 3,
    iron: 2.8,
    calcium: 72,
    imageUrl: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80',
    recipe: {
      en: 'Tangy and spicy fish cooked in coconut milk and kudampuli (Garcinia cambogia).',
      kn: 'ತೆಂಗಿನ ಹಾಲಿನಲ್ಲಿ ಬೇಯಿಸಿದ ಮೀನು ಮತ್ತು ಕುಡಂಪುಳಿ.',
      hi: 'नारियल के दूध और कुदंपुली में पकी हुई मसालेदार मछली।'
    }
  },
  {
    id: 'kerala_02',
    state: 'Kerala',
    diet: 'Vegetarian',
    name: {
      en: 'Avial with Red Rice',
      kn: 'ಅವಿಯಲ್ ಮತ್ತು ಕೆಂಪು ಅಕ್ಕಿ',
      hi: 'अवियल और लाल चावल'
    },
    calories: 340,
    protein: 7,
    carbs: 62,
    fibre: 9,
    iron: 2.9,
    calcium: 110,
    imageUrl: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=600&q=80',
    recipe: {
      en: 'Wholesome medley of local vegetables steamed with coconut, cumin, and seasoned with cold-pressed coconut oil.',
      kn: 'ತೆಂಗಿನಕಾಯಿ, ಜೀರಿಗೆ ಮತ್ತು ಕೊಬ್ಬರಿ ಎಣ್ಣೆಯಿಂದ ತಯಾರಿಸಿದ ತರಕಾರಿಗಳ ಅವಿಯಲ್.',
      hi: 'नारियल, जीरे और ताजे नारियल तेल के साथ पकी हुई विभिन्न पौष्टिक सब्जियों का अवियल।'
    }
  },

  // -------------------------------------------------------------
  // TAMIL NADU
  // -------------------------------------------------------------
  {
    id: 'tamilnadu_01',
    state: 'Tamil Nadu',
    diet: 'Vegetarian',
    name: {
      en: 'Kancheepuram Idli & Drumstick Sambar',
      kn: 'ಕಾಂಚೀಪುರಂ ಇಡ್ಲಿ ಮತ್ತು ನುಗ್ಗೆಕಾಯಿ ಸಾಂಬಾರ್',
      hi: 'कांचीपुरम इडली और सहजन सांभर'
    },
    calories: 290,
    protein: 11,
    carbs: 52,
    fibre: 7,
    iron: 3.4,
    calcium: 88,
    imageUrl: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=600&q=80',
    recipe: {
      en: 'Steamed spiced rice-lentil cake enriched with cumin and pepper, served with iron-packed moringa sambar.',
      kn: 'ಜೀರಿಗೆ ಮತ್ತು ಮೆಣಸಿನಿಂದ ಮಸಾಲೆ ಮಾಡಿದ ಇಡ್ಲಿ ಮತ್ತು ಕಬ್ಬಿಣಾಂಶ ಭರಿತ ನುಗ್ಗೆಕಾಯಿ ಸಾಂಬಾರ್.',
      hi: 'जीरा और काली मिर्च से स्वादिष्ट बनाई गई इडली और आयरन से भरपूर सहजन सांभर।'
    }
  },
  {
    id: 'tamilnadu_02',
    state: 'Tamil Nadu',
    diet: 'Non-Vegetarian',
    name: {
      en: 'Chettinad Pepper Chicken',
      kn: 'ಚೆಟ್ಟಿನಾಡ್ ಮೆಣಸು ಚಿಕನ್',
      hi: 'चेट्टीनाड काली मिर्च चिकन'
    },
    calories: 370,
    protein: 30,
    carbs: 10,
    fibre: 3,
    iron: 3.1,
    calcium: 54,
    imageUrl: 'https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?auto=format&fit=crop&w=600&q=80',
    recipe: {
      en: 'Spicy chicken simmered with freshly roasted black pepper, fennel, and aromatic Chettinad spices.',
      kn: 'ಹುರಿದ ಕರಿಮೆಣಸು ಮತ್ತು ಸಾಂಪ್ರದಾಯಿಕ ಚೆಟ್ಟಿನಾಡ್ ಮಸಾಲೆಗಳೊಂದಿಗೆ ಬೇಯಿಸಿದ ಚಿಕನ್.',
      hi: 'ताजा भुनी काली मिर्च, सौंफ और चेट्टीनाड मसालों के साथ पकाया गया तीखा चिकन।'
    }
  },

  // -------------------------------------------------------------
  // ANDHRA PRADESH
  // -------------------------------------------------------------
  {
    id: 'andhra_01',
    state: 'Andhra Pradesh',
    diet: 'Vegetarian',
    name: {
      en: 'Gongura Pappu with Steamed Rice',
      kn: 'ಗೊಂಗುರ ಪಪ್ಪು ಮತ್ತು ಅನ್ನ',
      hi: 'गोंगूरा पप्पु और उबले चावल'
    },
    calories: 360,
    protein: 14,
    carbs: 60,
    fibre: 8,
    iron: 5.6,
    calcium: 120,
    imageUrl: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=600&q=80',
    recipe: {
      en: 'Tangy red sorrel leaves cooked with toor dal, garlic, and mild green chillies for natural folic acid and iron.',
      kn: 'ತೊಗರಿ ಬೇಳೆ, ಬೆಳ್ಳುಳ್ಳಿ ಮತ್ತು ಪುಂಡಿ ಪಲ್ಲೆಯೊಂದಿಗೆ ತಯಾರಿಸಿದ ಕಬ್ಬಿಣಾಂಶ ಭರಿತ ಪಪ್ಪು.',
      hi: 'तूर दाल, लहसुन और खट्टी गोंगूरा (अंबाडी) पत्तियों से बनी आयरन-युक्त पौष्टिक दाल।'
    }
  },
  {
    id: 'andhra_02',
    state: 'Andhra Pradesh',
    diet: 'Non-Vegetarian',
    name: {
      en: 'Andhra Royyala Iguru (Prawn Curry)',
      kn: 'ಆಂಧ್ರ ರೊಯ್ಯಲ ಇಗುರು (ಸೀಗಡಿ ಸಾರು)',
      hi: 'आंध्र रोय्यला इगुरु (झींगा करी)'
    },
    calories: 295,
    protein: 26,
    carbs: 7,
    fibre: 2,
    iron: 2.6,
    calcium: 95,
    imageUrl: 'https://images.unsplash.com/photo-1559847844-5315695dadae?auto=format&fit=crop&w=600&q=80',
    recipe: {
      en: 'Fresh coastal prawns cooked in a rich onion-tomato paste with mild coriander and curry leaves.',
      kn: 'ಈರುಳ್ಳಿ-ಟೊಮೆಟೊ ಮತ್ತು ಕರಿಬೇವಿನೊಂದಿಗೆ ಮೃದುವಾಗಿ ಬೇಯಿಸಿದ ತಾಜಾ ಸೀಗಡಿ ಸಾರು.',
      hi: 'प्याज, टमाटर और करी पत्तों की ग्रेवी में पकी हुई स्वादिष्ट तटीय झींगा करी।'
    }
  },

  // -------------------------------------------------------------
  // TELANGANA
  // -------------------------------------------------------------
  {
    id: 'telangana_01',
    state: 'Telangana',
    diet: 'Vegetarian',
    name: {
      en: 'Jowar Roti with Palakura Pappu',
      kn: 'ಜೋಳದ ರೊಟ್ಟಿ ಮತ್ತು ಪಾಲಕ್ ಪಪ್ಪು',
      hi: 'ज्वार की रोटी और पालक पप्पु'
    },
    calories: 330,
    protein: 11,
    carbs: 61,
    fibre: 10,
    iron: 4.4,
    calcium: 160,
    imageUrl: 'https://images.unsplash.com/photo-1626074353765-517a681e40be?auto=format&fit=crop&w=600&q=80',
    recipe: {
      en: 'Gluten-free sorghum flatbread paired with iron-dense spinach and yellow lentil stew.',
      kn: 'ಕಬ್ಬಿಣಾಂಶ ಭರಿತ ಪಾಲಕ್ ಸೊಪ್ಪಿನ ಬೇಳೆಯೊಂದಿಗೆ ಪೌಷ್ಟಿಕ ಜೋಳದ ರೊಟ್ಟಿ.',
      hi: 'आयरन से भरपूर पालक दाल के साथ परोसी जाने वाली पौष्टिक ज्वार की रोटी।'
    }
  },
  {
    id: 'telangana_02',
    state: 'Telangana',
    diet: 'Non-Vegetarian',
    name: {
      en: 'Telangana Mutton Curry',
      kn: 'ತೆಲಂಗಾಣ ಮಟನ್ ಸಾರು',
      hi: 'तेलंगाना मटन करी'
    },
    calories: 410,
    protein: 28,
    carbs: 6,
    fibre: 2,
    iron: 4.2,
    calcium: 40,
    imageUrl: 'https://images.unsplash.com/photo-1545247181-516773ca83f3?auto=format&fit=crop&w=600&q=80',
    recipe: {
      en: 'Slow-cooked tender lean mutton rich in bioavailable heme iron, infused with poppy seeds and dry coconut.',
      kn: 'ಗಸಗಸೆ ಮತ್ತು ಒಣ ಕೊಬ್ಬರಿಯೊಂದಿಗೆ ಹದವಾಗಿ ಬೇಯಿಸಿದ ಪೌಷ್ಟಿಕ ಮಟನ್ ಸಾರು.',
      hi: 'खसखस और सूखे नारियल के पेस्ट के साथ धीमी आंच पर पकाई गई आयरन से भरपूर मटन करी।'
    }
  },

  // -------------------------------------------------------------
  // PUDUCHERRY
  // -------------------------------------------------------------
  {
    id: 'puducherry_01',
    state: 'Puducherry',
    diet: 'Vegetarian',
    name: {
      en: 'Creole Vegetable Ragout',
      kn: 'ಕ್ರಿಯೋಲ್ ತರಕಾರಿ ರಾಗೌಟ್',
      hi: 'क्रेयोल वेजिटेबल रागु'
    },
    calories: 275,
    protein: 7,
    carbs: 45,
    fibre: 8,
    iron: 2.5,
    calcium: 90,
    imageUrl: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=600&q=80',
    recipe: {
      en: 'Delicate Indo-French spiced vegetable stew cooked with coconut milk, carrots, beans, and fresh herbs.',
      kn: 'ಕ್ಯಾರೆಟ್, ಬೀನ್ಸ್ ಮತ್ತು ಗಿಡಮೂಲಿಕೆಗಳೊಂದಿಗೆ ತೆಂಗಿನ ಹಾಲಿನಲ್ಲಿ ಬೇಯಿಸಿದ ಇಂಡೋ-ಫ್ರೆಂಚ್ ತರಕಾರಿ ಭಕ್ಷ್ಯ.',
      hi: 'नारियल के दूध, गाजर, बीन्स और ताजी जड़ी-बूटियों में पकाया गया स्वादिष्ट इंडो-फ्रेंच सब्जी स्टू।'
    }
  },
  {
    id: 'puducherry_02',
    state: 'Puducherry',
    diet: 'Non-Vegetarian',
    name: {
      en: 'Puducherry Coconut Fish Fillet',
      kn: 'ಪುದುಚೇರಿ ಕೊಬ್ಬರಿ ಮೀನು ಫಿಲೆಟ್',
      hi: 'पुडुचेरी कोकोनट फिश फिलेट'
    },
    calories: 320,
    protein: 25,
    carbs: 9,
    fibre: 2,
    iron: 2.7,
    calcium: 68,
    imageUrl: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=600&q=80',
    recipe: {
      en: 'Pan-seared coastal sea fish delicately cooked in fresh coconut cream with mild fennel and shallots.',
      kn: 'ತಾಜಾ ತೆಂಗಿನ ಕೆನೆ ಮತ್ತು ಸಣ್ಣ ಈರುಳ್ಳಿಯೊಂದಿಗೆ ಹದವಾಗಿ ಬೇಯಿಸಿದ ಕರಾವಳಿ ಮೀನು.',
      hi: 'ताजे नारियल के दूध, सौंफ और छोटे प्याज की ग्रेवी में हल्की आंच पर पकी हुई समुद्री मछली।'
    }
  }
];

export function getRegionalFoodsByFilter(state?: string, diet?: string): RegionalFoodItem[] {
  return regionalFoodDatabase.filter((item) => {
    if (state && item.state.toLowerCase() !== state.toLowerCase()) {
      return false;
    }
    if (diet) {
      const isVeg = diet.toLowerCase().includes('veg') && !diet.toLowerCase().includes('non');
      if (isVeg && item.diet !== 'Vegetarian') return false;
      if (!isVeg && item.diet !== 'Non-Vegetarian') return false;
    }
    return true;
  });
}
