import React, { useState, useMemo } from 'react';
import {
  Calendar,
  Sparkles,
  Baby,
  Dna,
  Heart,
  Droplets,
  ShieldCheck,
  ChevronRight,
  Info,
  CheckCircle2,
  AlertCircle,
  Volume2,
  VolumeX,
  Stethoscope,
  Apple,
  Clock,
  ArrowRight,
  Pill,
  Activity
} from 'lucide-react';
import { PregnancyTrimester, GlobalLocationState } from '../types';
import { voiceService, VOICE_LABELS } from '../services/voice_service';
import { useLanguage, DualText } from '../services/language_service';

export interface TrimesterProgressBarProps {
  currentWeek: number;
  selectedTrimester?: PregnancyTrimester;
  dueDate?: string;
  globalLocation?: GlobalLocationState;
  onNavigateToFoods?: (category?: string) => void;
  onNavigateToMealPlan?: () => void;
}

interface NutrientFocusItem {
  id: string;
  name: string;
  chemicalSymbol?: string;
  rdaTarget: string;
  clinicalPurpose: string;
  vitalMechanism: string;
  sources: string[];
  badgeColor: string;
  icmrNote?: string;
}

interface MilestoneItem {
  weekRange: string;
  title: string;
  description: string;
  fetalSize: string;
  fetalLengthWeight: string;
  iconName: 'dna' | 'heart' | 'baby' | 'activity';
  keyHighlights: string[];
}

interface ClinicalCheckItem {
  weekRange: string;
  testName: string;
  purpose: string;
  isCrucial: boolean;
}

interface TrimesterData {
  id: PregnancyTrimester;
  trimesterNumber: 1 | 2 | 3;
  name: string;
  weekRange: string;
  startWeek: number;
  endWeek: number;
  totalWeeks: number;
  babySizeSummary: string;
  primaryNutrientTheme: string;
  bannerColor: string;
  activeBorderColor: string;
  progressColor: string;
  clinicalThemeDescription: string;
  nutrients: NutrientFocusItem[];
  milestones: MilestoneItem[];
  clinicalChecks: ClinicalCheckItem[];
  maternalWellnessTips: string[];
}

const TRIMESTER_DATABASE: Record<PregnancyTrimester, TrimesterData> = {
  '1st Trimester': {
    id: '1st Trimester',
    trimesterNumber: 1,
    name: '1st Trimester (Weeks 1 – 13)',
    weekRange: 'Weeks 1 to 13',
    startWeek: 1,
    endWeek: 13,
    totalWeeks: 13,
    babySizeSummary: 'Poppy Seed to Lemon (approx. 7.4 cm, 23g)',
    primaryNutrientTheme: 'Folic Acid, Vitamin B6 & Early Cell Division Matrix',
    bannerColor: 'from-amber-500/15 via-orange-500/10 to-transparent',
    activeBorderColor: 'border-amber-600/60',
    progressColor: 'bg-amber-600',
    clinicalThemeDescription:
      'Organogenesis Phase: Crucial for neural tube closure, cardiovascular inception, and embryonic cell division. Nutrient deficiencies in this window carry the highest structural vulnerability.',
    nutrients: [
      {
        id: 'folic-acid',
        name: 'Folic Acid / Folate',
        chemicalSymbol: 'Vitamin B9',
        rdaTarget: '570 µg / day',
        clinicalPurpose: 'Prevents Neural Tube Defects (NTDs) & Drives DNA Synthesis',
        vitalMechanism:
          'Critical co-factor for nucleotide biosynthesis and homocysteine remethylation during neural tube closure (which completes by Day 28 post-conception).',
        sources: ['Palak (Spinach)', 'Sprouted Moong Dal', 'Drumstick Leaves (Murungai)', 'Methi (Fenugreek)', 'Bengal Gram'],
        badgeColor: 'bg-emerald-100 text-emerald-900 border-emerald-300',
        icmrNote: 'ICMR-NIN guidelines mandate 570 µg daily dietary folate plus folic acid supplementation.'
      },
      {
        id: 'vitamin-b6',
        name: 'Vitamin B6 (Pyridoxine)',
        chemicalSymbol: 'Vit B6',
        rdaTarget: '1.9 mg / day',
        clinicalPurpose: 'Relieves Morning Sickness & Supports Fetal Neurotransmitters',
        vitalMechanism:
          'Crucial enzyme in amino acid metabolism and serotonin/dopamine synthesis; clinically demonstrated to alleviate pregnancy nausea and hyperemesis gravidarum.',
        sources: ['Fresh Bananas', 'Roasted Peanuts', 'Whole Wheat Dalia', 'Kala Chana', 'Walnuts'],
        badgeColor: 'bg-amber-100 text-amber-900 border-amber-300'
      },
      {
        id: 'hydration-electrolytes',
        name: 'Electrolytes & Fluid Matrix',
        chemicalSymbol: 'Na, K, H₂O',
        rdaTarget: '2.5 – 3.0 Liters / day',
        clinicalPurpose: 'Expands Maternal Blood Plasma & Nourishes Amniotic Fluid',
        vitalMechanism:
          'Circulating maternal blood volume begins expanding by 45%. Sustained fluids prevent maternal orthostatic dizziness, urinary tract infections, and early dehydration.',
        sources: ['Tender Coconut Water (Elaneer)', 'Majjige (Spiced Ginger Buttermilk)', 'Lemon Rock-Salt Water', 'Clear Vegetable Broth'],
        badgeColor: 'bg-cyan-100 text-cyan-900 border-cyan-300'
      },
      {
        id: 'iodine-choline',
        name: 'Iodine & Choline',
        chemicalSymbol: 'I & Choline',
        rdaTarget: 'Iodine 250 µg • Choline 450 mg',
        clinicalPurpose: 'Thyroid Hormone Synthesis & Fetal Cerebral Cortex Formation',
        vitalMechanism:
          'Essential for maternal T4 hormone synthesis which exclusively drives fetal brain development before the fetal thyroid activates at week 12.',
        sources: ['Iodized Table Salt', 'Pasteurized Cow Milk', 'Fresh Curd', 'Paneer', 'Eggs (if non-veg)'],
        badgeColor: 'bg-indigo-100 text-indigo-900 border-indigo-300'
      }
    ],
    milestones: [
      {
        weekRange: 'Weeks 1 – 4',
        title: 'Fertilization & Implantation',
        description: 'Zygote undergoes rapid mitotic cleavage, travels down the fallopian tube, and implants securely into the vascular uterine endometrium.',
        fetalSize: 'Poppy Seed',
        fetalLengthWeight: '0.1 – 0.2 mm',
        iconName: 'dna',
        keyHighlights: ['Amniotic sac & primary yolk sac form', 'Trophoblast cells begin secreting hCG hormone']
      },
      {
        weekRange: 'Weeks 5 – 8',
        title: 'Neural Tube Closure & Primitive Heartbeat',
        description: 'The neural tube zips shut along the fetal back. The primitive cardiac tube initiates rhythmic contractions visible on transvaginal ultrasound.',
        fetalSize: 'Sweet Pea to Raspberry',
        fetalLengthWeight: '1.2 – 1.6 cm • ~1g',
        iconName: 'heart',
        keyHighlights: ['Heart beats at ~110–160 bpm', 'Upper and lower limb buds sprout', 'Cranial and spinal structure establishes']
      },
      {
        weekRange: 'Weeks 9 – 13',
        title: 'Organogenesis Completion & Reflexes',
        description: 'All vital organs, skeletal joints, fingers, and tooth buds are anatomically formed. Embryo officially graduates to fetus status.',
        fetalSize: 'Plum to Lemon',
        fetalLengthWeight: '7.4 cm • ~23g',
        iconName: 'baby',
        keyHighlights: ['Kidneys produce sterile amniotic urine', 'Vocal cords, eyelids, and nail beds form', 'Involuntary spontaneous kicking begins']
      }
    ],
    clinicalChecks: [
      { weekRange: 'Weeks 6 – 8', testName: 'Dating & Viability Ultrasound', purpose: 'Confirm intrauterine gestational sac, crown-rump length (CRL), and fetal cardiac activity.', isCrucial: true },
      { weekRange: 'Weeks 8 – 10', testName: 'Baseline Antenatal Blood Panel', purpose: 'Complete Blood Count (CBC), Blood Group & Rh typing, Rubella, TSH, VDRL, HBsAg, HIV, Urine Culture.', isCrucial: true },
      { weekRange: 'Weeks 11 – 13.6', testName: 'NT Scan & Double Marker Serum', purpose: 'Nuchal Translucency ultrasound and PAPP-A/Free Beta-hCG blood test for chromosomal aneuploidy screening.', isCrucial: true }
    ],
    maternalWellnessTips: [
      'Eat small, frequent meals every 2–3 hours to minimize nausea from low blood glucose.',
      'Take your prescribed Folic Acid (500µg) supplement consistently each morning.',
      'Sip ginger infused warm water or cold buttermilk to neutralize gastric acidity.',
      'Avoid unpasteurized milk, raw sprouts, and unwashed raw street salads.'
    ]
  },

  '2nd Trimester': {
    id: '2nd Trimester',
    trimesterNumber: 2,
    name: '2nd Trimester (Weeks 14 – 27)',
    weekRange: 'Weeks 14 to 27',
    startWeek: 14,
    endWeek: 27,
    totalWeeks: 14,
    babySizeSummary: 'Avocado to Cauliflower (approx. 36.6 cm, ~875g)',
    primaryNutrientTheme: 'Iron (Hemoglobin Surge), Calcium Skeletal Matrix & Protein',
    bannerColor: 'from-emerald-600/15 via-teal-600/10 to-transparent',
    activeBorderColor: 'border-emerald-600/60',
    progressColor: 'bg-emerald-600',
    clinicalThemeDescription:
      'Peak Somatic & Skeletal Growth: Maternal blood volume expands by ~50%. Fetal bones calcify rapidly. Quickening (baby kicks) begins, and hearing develops.',
    nutrients: [
      {
        id: 'elemental-iron',
        name: 'Elemental Iron & Vitamin C',
        chemicalSymbol: 'Fe + Vit C',
        rdaTarget: '27 mg / day',
        clinicalPurpose: 'Prevents Gestational Anemia & Fuels Blood Volume Surge',
        vitalMechanism:
          'Crucial for maternal red cell mass expansion and fetal placental blood flow. Iron-deficiency anemia in T2 elevates risks of preterm labor and low birth weight.',
        sources: ['Sprouted Ragi (Finger Millet)', 'Amaranth Greens (Thotakura/Cheera)', 'Bajra (Pearl Millet)', 'Black Chana', 'Beetroot', 'Amla (Vitamin C Booster)'],
        badgeColor: 'bg-red-100 text-red-900 border-red-300',
        icmrNote: 'Always pair plant-based iron with Vitamin C (amla, lemon) and avoid tea/coffee within 1 hour of meals.'
      },
      {
        id: 'calcium-vitd',
        name: 'Calcium & Vitamin D3',
        chemicalSymbol: 'Ca & Vit D',
        rdaTarget: '1,000 mg Calcium • 600 IU Vit D',
        clinicalPurpose: 'Fetal Skeletal Mineralization & Tooth Bud Hardening',
        vitalMechanism:
          'The fetus deposits approximately 25–30g of calcium into their skeleton during gestation. Inadequate dietary intake causes maternal bone resorption.',
        sources: ['Ragi Mudde / Ragi Ganji', 'Pasteurized Cow Milk & Curd', 'Fresh Homemade Paneer', 'Roasted Sesame Seeds (Til)', 'Soya Chunks'],
        badgeColor: 'bg-blue-100 text-blue-900 border-blue-300'
      },
      {
        id: 'dietary-protein',
        name: 'High-Quality Complete Protein',
        chemicalSymbol: 'Amino Acids',
        rdaTarget: '68 – 72 g / day (+23g over baseline)',
        clinicalPurpose: 'Drives Fetal Muscle, Organ & Placental Tissue Synthesis',
        vitalMechanism:
          'Supplies essential amino acids for accelerating fetal somatic tissue growth, maternal uterine muscular hypertrophy, and amniotic fluid protein homeostasis.',
        sources: ['Mixed Toor / Moong Dal', 'Paneer Bhurji', 'Sprouted Legumes (Usli / Sundal)', 'Boiled Eggs', 'Greek / Thick Curd'],
        badgeColor: 'bg-emerald-100 text-emerald-900 border-emerald-300'
      },
      {
        id: 'omega3-dha',
        name: 'Omega-3 Fatty Acids (DHA)',
        chemicalSymbol: 'DHA / EPA',
        rdaTarget: '200 – 300 mg DHA / day',
        clinicalPurpose: 'Fetal Brain Synaptogenesis & Retinal Photoreceptor Growth',
        vitalMechanism:
          'Docosahexaenoic acid (DHA) selectively concentrates in the fetal cerebral cortex and retinal membranes, directly impacting visual acuity and cognitive processing.',
        sources: ['Soaked Walnuts (Akrot)', 'Roasted Flaxseeds (Alsi powder)', 'Chia Seeds in Curd', 'Cooked Rohu / Pomfret (if non-veg)'],
        badgeColor: 'bg-purple-100 text-purple-900 border-purple-300'
      }
    ],
    milestones: [
      {
        weekRange: 'Weeks 14 – 17',
        title: 'Skeletal Calcification & Facial Expressions',
        description: 'Cartilage skeleton transitions to hard bone through osteogenesis. Baby makes smiling and frowning facial movements and practices thumb sucking.',
        fetalSize: 'Avocado to Turnip',
        fetalLengthWeight: '13 cm • ~140g',
        iconName: 'activity',
        keyHighlights: ['Fingerprint ridges permanently form', 'Scalp hair patterning establishes', 'Kidneys actively filter amniotic fluid']
      },
      {
        weekRange: 'Weeks 18 – 22',
        title: 'Quickening & Anomaly Scan Window',
        description: 'Maternal perception of fetal movements ("quickening") begins as gentle butterfly flutters. The comprehensive 20-week anomaly scan evaluates all anatomical structures.',
        fetalSize: 'Banana to Papaya',
        fetalLengthWeight: '26 cm • ~360g',
        iconName: 'heart',
        keyHighlights: ['Mother feels distinct fetal kicks', 'Vernix caseosa coats delicate skin', 'Cerebellar and cardiac chambers inspected on scan']
      },
      {
        weekRange: 'Weeks 23 – 27',
        title: 'Auditory Hardening & Sleep Cycles',
        description: 'Inner ear auditory ossicles harden; baby clearly hears the maternal voice, heartbeat, and external music. Fetal lungs produce primitive branches.',
        fetalSize: 'Eggplant to Cauliflower',
        fetalLengthWeight: '36.6 cm • ~875g',
        iconName: 'baby',
        keyHighlights: ['Baby responds to loud external sounds with startled kicks', 'Rapid eye movements (REM) occur during sleep', 'Taste buds mature']
      }
    ],
    clinicalChecks: [
      { weekRange: 'Weeks 18 – 20', testName: 'Targeted Anomaly Scan (TIFFA / Level II)', purpose: 'Exhaustive anatomical scan of brain ventricles, 4 cardiac chambers, spine, kidneys, limbs, and placental insertion.', isCrucial: true },
      { weekRange: 'Weeks 24 – 28', testName: '75g Oral Glucose Tolerance Test (OGTT)', purpose: 'Mandatory DIPSI / ICMR screening for Gestational Diabetes Mellitus (GDM) fasting, 1-hr, and 2-hr plasma glucose.', isCrucial: true },
      { weekRange: 'Weeks 24 – 26', testName: 'Repeat Complete Blood Count (CBC)', purpose: 'Assess hemoglobin status to check for physiological dilutional anemia and adjust iron-folic acid dosage.', isCrucial: true }
    ],
    maternalWellnessTips: [
      'Sleep primarily on your left side to optimize inferior vena cava blood flow to the placenta.',
      'Incorporate 1 glass of Ragi Malt / Ganji daily for natural bioavailable calcium.',
      'Take your Iron tablet with fresh lemon water or amla juice; never with calcium tablets or milk.',
      'Engage in 25–30 minutes of gentle antenatal walking or prenatal yoga.'
    ]
  },

  '3rd Trimester': {
    id: '3rd Trimester',
    trimesterNumber: 3,
    name: '3rd Trimester (Weeks 28 – 40+)',
    weekRange: 'Weeks 28 to 40',
    startWeek: 28,
    endWeek: 40,
    totalWeeks: 13,
    babySizeSummary: 'Eggplant to Watermelon (approx. 50 cm, 2.9 – 3.5 kg)',
    primaryNutrientTheme: 'Iron Hepatic Reserves, Bone Calcium Surge & Labor Stamina',
    bannerColor: 'from-indigo-600/15 via-purple-600/10 to-transparent',
    activeBorderColor: 'border-indigo-600/60',
    progressColor: 'bg-indigo-600',
    clinicalThemeDescription:
      'Maturation & Labor Preparation: Rapid fetal weight gain (~200g/week), pulmonary surfactant synthesis, maternal antibody transfer (IgG), and preparation for birth.',
    nutrients: [
      {
        id: 'iron-hepatic-storage',
        name: 'Iron & Maternal Hemoglobin',
        chemicalSymbol: 'Fe Storage',
        rdaTarget: '27 – 30 mg / day',
        clinicalPurpose: 'Builds Fetal 6-Month Hepatic Stores & Protects Mother at Birth',
        vitalMechanism:
          'In T3, baby extracts maximum iron from the mother to build their liver iron endowment, sustaining them until solid food introduction at 6 months. High maternal hemoglobin prevents delivery complications.',
        sources: ['Bajra Roti with Ghee', 'Moringa / Drumstick Leaf Soup', 'Steamed Beetroot & Carrot Salad', 'Black Raisins soaked overnight', 'Jaggery with Sesame (Til Chikki)'],
        badgeColor: 'bg-red-100 text-red-900 border-red-300',
        icmrNote: 'Vital to maintain hemoglobin above 11.0 g/dL prior to delivery.'
      },
      {
        id: 'calcium-magnesium',
        name: 'Calcium & Magnesium Peak Surge',
        chemicalSymbol: 'Ca + Mg',
        rdaTarget: '1,200 mg Calcium • 385 mg Magnesium',
        clinicalPurpose: 'Final Skeletal Hardening & Maternal Leg Cramp Prevention',
        vitalMechanism:
          'Baby absorbs ~300 mg of calcium daily from maternal circulation. Magnesium functions synergistically to prevent nocturnal maternal muscle cramps and manage neuromuscular excitability.',
        sources: ['Ragi Mudde with Amaranth Greens Saaru', 'Whole Cow Milk with Badam & Saffron', 'Roasted Fox Nuts (Phool Makhana)', 'Sesame Seeds (Til)', 'Curd with Chia'],
        badgeColor: 'bg-blue-100 text-blue-900 border-blue-300'
      },
      {
        id: 'dietary-fiber',
        name: 'Dietary Fiber & Gut Motility',
        chemicalSymbol: 'Complex Fiber',
        rdaTarget: '30 – 35 g / day',
        clinicalPurpose: 'Combats Gestational Constipation & Pelvic Congestion',
        vitalMechanism:
          'Enlarging uterus compresses maternal colon and pelvic veins. High soluble and insoluble fiber normalizes intestinal transit time and prevents hemorrhoids.',
        sources: ['Whole Wheat Dalia Khichdi', 'Fresh Ripe Guavas (with seeds chewed)', 'Oats Porridge with Apples', 'Cucumber, Carrots & Green Peas', 'Soaked Prunes / Figs'],
        badgeColor: 'bg-emerald-100 text-emerald-900 border-emerald-300'
      },
      {
        id: 'clean-energy-zinc',
        name: 'Sustained Complex Calories & Zinc',
        chemicalSymbol: '+450 kcal / day & Zn',
        rdaTarget: '+450 kcal / day • 14.5 mg Zinc',
        clinicalPurpose: 'Sustains Labor Muscle Endurance & Wound Healing Collagen',
        vitalMechanism:
          'Supports the peak 200g/week fetal fat accumulation, provides uterine glycogen reserves for labor contractions, and zinc enhances post-delivery perineal/cesarean tissue healing.',
        sources: ['Multigrain Roti with Dal', 'Pure Cow Ghee (1–2 tsp)', 'Mixed Nuts & Seeds Trail Mix', 'Paneer Sabzi', 'Lentil Vegetable Stew'],
        badgeColor: 'bg-amber-100 text-amber-900 border-amber-300'
      }
    ],
    milestones: [
      {
        weekRange: 'Weeks 28 – 32',
        title: 'Brown Fat Deposition & Eye Opening',
        description: 'Subcutaneous adipose layers accumulate rapidly, smoothing wrinkled skin. Baby can open and close eyes, detect light through the uterine wall, and practices rhythmic breathing.',
        fetalSize: 'Eggplant to Butternut Squash',
        fetalLengthWeight: '42 cm • ~1.7 kg',
        iconName: 'activity',
        keyHighlights: ['Pupils react to light changes', 'Bone marrow takes over complete red cell production', 'Brain cortex grooves (sulci and gyri) deepen']
      },
      {
        weekRange: 'Weeks 33 – 36',
        title: 'Pulmonary Surfactant & Antibody Shield',
        description: 'Alveoli produce surfactant (lecithin & sphingomyelin) preventing lung collapse at first breath. Maternal immunoglobulins (IgG) actively cross placenta to confer newborn immunity.',
        fetalSize: 'Pineapple to Honeydew Melon',
        fetalLengthWeight: '47 cm • ~2.4 kg',
        iconName: 'heart',
        keyHighlights: ['Lungs reach functional respiratory readiness', 'Baby typically rotates into head-down vertex presentation', 'Firm grasp reflex is present']
      },
      {
        weekRange: 'Weeks 37 – 40 (Full Term)',
        title: 'Full Term Maturity & Delivery Readiness',
        description: 'Baby is biologically full-term. Lanugo sheds, skull sutures remain pliable to maneuver through the birth canal, and baby drops into the maternal pelvis (lightening).',
        fetalSize: 'Papaya to Watermelon',
        fetalLengthWeight: '50 – 52 cm • ~3.0 – 3.4 kg',
        iconName: 'baby',
        keyHighlights: ['All organ systems fully self-sufficient for extrauterine life', 'Maternal pelvic bones soften under relaxin hormone', 'Meconium builds in baby intestines']
      }
    ],
    clinicalChecks: [
      { weekRange: 'Weeks 32 – 34', testName: 'Growth Doppler Ultrasound', purpose: 'Measure estimated fetal weight (EFW), amniotic fluid index (AFI), and umbilical artery Doppler resistance.', isCrucial: true },
      { weekRange: 'Weeks 36 – 37', testName: 'Fetal Presentation & GBS Screen', purpose: 'Verify cephalic presentation and swab for Group B Streptococcus to protect neonate during birth.', isCrucial: true },
      { weekRange: 'Weeks 37 – 40', testName: 'Weekly Antenatal Check & Cardiotocography (NST)', purpose: 'Monitor maternal blood pressure for preeclampsia, fundal height, and fetal heart rate reactivity.', isCrucial: true }
    ],
    maternalWellnessTips: [
      'Count fetal kicks daily using Cardiff "Count-to-Ten" chart (should feel at least 10 kicks in 2 hours when resting).',
      'Keep your hospital bag and Mother and Child Protection (MCP) card packed and ready.',
      'Stay well-hydrated to keep amniotic fluid index (AFI) in the healthy 8–18 cm range.',
      'Know the signs of labor: regular painful contractions, fluid leakage (water breaking), or bloody show.'
    ]
  }
};

export const TrimesterProgressBar: React.FC<TrimesterProgressBarProps> = ({
  currentWeek,
  selectedTrimester,
  dueDate,
  globalLocation,
  onNavigateToFoods,
  onNavigateToMealPlan
}) => {
  const { currentLanguage } = useLanguage();

  // Determine user's actual current trimester from weeks
  const actualTrimester: PregnancyTrimester = useMemo(() => {
    if (currentWeek <= 13) return '1st Trimester';
    if (currentWeek <= 27) return '2nd Trimester';
    return '3rd Trimester';
  }, [currentWeek]);

  // Tab state for viewed trimester (defaults to current trimester, but clickable to explore others)
  const [activeViewingTrimester, setActiveViewingTrimester] = useState<PregnancyTrimester>(
    selectedTrimester || actualTrimester
  );

  // Subtab for active view: 'milestones' | 'nutrients' | 'clinical'
  const [activeSubTab, setActiveSubTab] = useState<'nutrients' | 'milestones' | 'clinical'>('nutrients');

  // Selected nutrient modal/expanded state
  const [expandedNutrientId, setExpandedNutrientId] = useState<string | null>(null);

  // Voice narration state
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);

  // Sync voice service speaking status
  React.useEffect(() => {
    const unsubscribe = voiceService.subscribeSpeaking((speaking) => {
      setIsSpeaking(speaking);
    });
    return () => unsubscribe();
  }, []);

  const activeData = TRIMESTER_DATABASE[activeViewingTrimester];

  // Mathematical percentage calculations
  const boundedWeek = Math.max(1, Math.min(40, currentWeek));
  const overallPregnancyProgress = Math.min(100, Math.round((boundedWeek / 40) * 100));
  const weeksRemaining = Math.max(0, 40 - boundedWeek);

  // Calculate progress within each trimester segment for the 3-part bar
  // T1: weeks 1-13 (13 weeks total)
  const t1Progress = boundedWeek >= 13 ? 100 : Math.round((boundedWeek / 13) * 100);
  // T2: weeks 14-27 (14 weeks total)
  const t2Progress = boundedWeek < 14 ? 0 : boundedWeek >= 27 ? 100 : Math.round(((boundedWeek - 13) / 14) * 100);
  // T3: weeks 28-40 (13 weeks total)
  const t3Progress = boundedWeek < 28 ? 0 : Math.min(100, Math.round(((boundedWeek - 27) / 13) * 100));

  // Voice readout of the active trimester guidance
  const handleToggleVoice = () => {
    if (isSpeaking) {
      voiceService.stopSpeaking();
      setIsSpeaking(false);
      return;
    }

    const narrationText = `PregNutri Trimester Guide for ${activeData.name}. Fetal size is approximately ${activeData.babySizeSummary}. Primary clinical nutrient focus: ${activeData.primaryNutrientTheme}. Key nutrients include: ${activeData.nutrients.map(n => `${n.name}, daily target ${n.rdaTarget}, for ${n.clinicalPurpose}`).join('. ')}. Recommended local food sources: ${activeData.nutrients.flatMap(n => n.sources.slice(0, 2)).join(', ')}. Key developmental milestones: ${activeData.milestones.map(m => `${m.weekRange}, ${m.title}: ${m.description}`).join('. ')}.`;

    voiceService.speak(narrationText, currentLanguage, () => {
      setIsSpeaking(false);
    });
    setIsSpeaking(true);
  };

  const labels = VOICE_LABELS[currentLanguage] || VOICE_LABELS.en;

  return (
    <div className="bg-[#EFEFE9] border border-[#959D90] rounded-3xl p-5 sm:p-6 shadow-sm space-y-6 transition-all duration-300">
      {/* 1. Header: Trimester Timeline Title & Interactive Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[#959D90]/30">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-[#523D35] text-[#BBA58F] flex items-center justify-center font-bold shadow-xs">
              <Activity className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-lg sm:text-xl font-black tracking-tight text-[#223030]">
                  Gestation & Trimester Progress
                </h2>
                <span className="px-2.5 py-0.5 rounded-full bg-[#223030] text-[#EFEFE9] text-xs font-bold shadow-xs">
                  Week {boundedWeek} of 40
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-[#BBA58F]/30 text-[#523D35] text-xs font-bold border border-[#BBA58F]/50">
                  {overallPregnancyProgress}% Complete
                </span>
              </div>
              <p className="text-xs text-[#523D35] font-medium">
                Clinical developmental milestones, fetal growth, and trimester-targeted nutrient protocols
              </p>
            </div>
          </div>
        </div>

        {/* Action Controls: Audio Guide & Quick Jump */}
        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            type="button"
            onClick={handleToggleVoice}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition cursor-pointer shadow-xs border ${
              isSpeaking
                ? 'bg-red-600 hover:bg-red-700 text-white border-red-700 animate-pulse'
                : 'bg-[#523D35] hover:bg-[#523D35]/90 text-[#EFEFE9] border-[#BBA58F]/40'
            }`}
            title="Listen to clinical audio explanation"
          >
            {isSpeaking ? (
              <>
                <VolumeX className="w-3.5 h-3.5" />
                <span>{labels.stop} (Voice)</span>
              </>
            ) : (
              <>
                <Volume2 className="w-3.5 h-3.5 text-[#BBA58F]" />
                <span>{labels.listen} Trimester Guide</span>
              </>
            )}
          </button>

          {activeViewingTrimester !== actualTrimester && (
            <button
              type="button"
              onClick={() => setActiveViewingTrimester(actualTrimester)}
              className="px-3 py-2 rounded-xl bg-[#223030] hover:bg-[#223030]/80 text-[#EFEFE9] text-xs font-bold flex items-center gap-1 transition cursor-pointer shadow-xs"
            >
              <span>Back to Current (T{actualTrimester[0]})</span>
            </button>
          )}
        </div>
      </div>

      {/* 2. Interactive Tri-Part Trimester Progress Bar */}
      <div className="space-y-2.5 bg-white/70 p-4 sm:p-5 rounded-2xl border border-[#959D90]/30 shadow-xs">
        <div className="flex items-center justify-between text-xs font-bold text-[#523D35]">
          <div className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-[#523D35]" />
            <span>Due Date Target: <strong className="text-[#223030]">{dueDate || 'Term 40 Weeks'}</strong></span>
          </div>
          <div className="flex items-center gap-1.5">
            <Baby className="w-3.5 h-3.5 text-[#523D35]" />
            <span><strong className="text-[#223030]">{weeksRemaining}</strong> weeks remaining</span>
          </div>
        </div>

        {/* 3 Segments Visual Bar */}
        <div className="relative pt-6 pb-2">
          {/* Dynamic Pin Indicator for Exact Current Week */}
          <div
            className="absolute top-0 transform -translate-x-1/2 transition-all duration-500 z-10 flex flex-col items-center"
            style={{ left: `${Math.max(4, Math.min(96, (boundedWeek / 40) * 100))}%` }}
          >
            <div className="px-2 py-0.5 rounded-md bg-[#223030] text-[#EFEFE9] text-[10px] font-extrabold shadow-md flex items-center gap-1 whitespace-nowrap border border-[#BBA58F]">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
              <span>You are here: W{boundedWeek}</span>
            </div>
            <div className="w-0 h-0 border-l-[4px] border-l-transparent border-r-[4px] border-r-transparent border-t-[5px] border-t-[#223030]" />
          </div>

          {/* Progress Tracks */}
          <div className="grid grid-cols-12 gap-1.5 sm:gap-2 h-4 sm:h-5 rounded-full p-1 bg-[#E8D9CD] border border-[#959D90]/40">
            {/* T1: Weeks 1 - 13 (approx 4 of 12 columns) */}
            <div
              onClick={() => setActiveViewingTrimester('1st Trimester')}
              className={`col-span-4 rounded-full h-full overflow-hidden relative cursor-pointer group transition ${
                activeViewingTrimester === '1st Trimester' ? 'ring-2 ring-amber-600 ring-offset-1' : ''
              }`}
              title="Click to view 1st Trimester details"
            >
              <div
                className="h-full bg-linear-to-r from-amber-500 to-amber-600 transition-all duration-700"
                style={{ width: `${t1Progress}%` }}
              />
              <div className="absolute inset-0 flex items-center justify-center text-[9px] font-black text-[#223030] tracking-tight opacity-75 group-hover:opacity-100">
                T1 (W1–13)
              </div>
            </div>

            {/* T2: Weeks 14 - 27 (approx 4 of 12 columns) */}
            <div
              onClick={() => setActiveViewingTrimester('2nd Trimester')}
              className={`col-span-4 rounded-full h-full overflow-hidden relative cursor-pointer group transition ${
                activeViewingTrimester === '2nd Trimester' ? 'ring-2 ring-emerald-600 ring-offset-1' : ''
              }`}
              title="Click to view 2nd Trimester details"
            >
              <div
                className="h-full bg-linear-to-r from-emerald-500 to-teal-600 transition-all duration-700"
                style={{ width: `${t2Progress}%` }}
              />
              <div className="absolute inset-0 flex items-center justify-center text-[9px] font-black text-[#223030] tracking-tight opacity-75 group-hover:opacity-100">
                T2 (W14–27)
              </div>
            </div>

            {/* T3: Weeks 28 - 40 (approx 4 of 12 columns) */}
            <div
              onClick={() => setActiveViewingTrimester('3rd Trimester')}
              className={`col-span-4 rounded-full h-full overflow-hidden relative cursor-pointer group transition ${
                activeViewingTrimester === '3rd Trimester' ? 'ring-2 ring-indigo-600 ring-offset-1' : ''
              }`}
              title="Click to view 3rd Trimester details"
            >
              <div
                className="h-full bg-linear-to-r from-indigo-500 to-purple-600 transition-all duration-700"
                style={{ width: `${t3Progress}%` }}
              />
              <div className="absolute inset-0 flex items-center justify-center text-[9px] font-black text-[#223030] tracking-tight opacity-75 group-hover:opacity-100">
                T3 (W28–40)
              </div>
            </div>
          </div>
        </div>

        {/* Milestone Tick Marks & Trimester Selector Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1">
          {/* Card 1: 1st Trimester */}
          <button
            type="button"
            onClick={() => setActiveViewingTrimester('1st Trimester')}
            className={`p-3 rounded-2xl text-left border transition-all cursor-pointer ${
              activeViewingTrimester === '1st Trimester'
                ? 'bg-amber-50/80 border-amber-600 shadow-sm ring-1 ring-amber-500'
                : 'bg-[#EFEFE9]/60 hover:bg-[#E8D9CD] border-[#959D90]/30'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-amber-900 flex items-center gap-1">
                <span>1st Trimester</span>
                {actualTrimester === '1st Trimester' && (
                  <span className="px-1.5 py-0.2 rounded-full bg-amber-600 text-white text-[9px] font-bold">Current</span>
                )}
              </span>
              <span className="text-[10px] font-bold text-amber-800">Weeks 1–13</span>
            </div>
            <p className="text-[11px] text-amber-950/80 font-medium mt-1 line-clamp-1">
              🌱 Organogenesis & Folic Acid Focus
            </p>
            <div className="mt-2 flex items-center justify-between text-[10px] text-amber-900 font-semibold">
              <span>Progress</span>
              <span>{t1Progress}%</span>
            </div>
            <div className="w-full h-1.5 bg-amber-200/70 rounded-full mt-1 overflow-hidden">
              <div className="h-full bg-amber-600 rounded-full" style={{ width: `${t1Progress}%` }} />
            </div>
          </button>

          {/* Card 2: 2nd Trimester */}
          <button
            type="button"
            onClick={() => setActiveViewingTrimester('2nd Trimester')}
            className={`p-3 rounded-2xl text-left border transition-all cursor-pointer ${
              activeViewingTrimester === '2nd Trimester'
                ? 'bg-emerald-50/80 border-emerald-600 shadow-sm ring-1 ring-emerald-500'
                : 'bg-[#EFEFE9]/60 hover:bg-[#E8D9CD] border-[#959D90]/30'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-emerald-900 flex items-center gap-1">
                <span>2nd Trimester</span>
                {actualTrimester === '2nd Trimester' && (
                  <span className="px-1.5 py-0.2 rounded-full bg-emerald-600 text-white text-[9px] font-bold">Current</span>
                )}
              </span>
              <span className="text-[10px] font-bold text-emerald-800">Weeks 14–27</span>
            </div>
            <p className="text-[11px] text-emerald-950/80 font-medium mt-1 line-clamp-1">
              🦴 Quickening, Skeletal Calcium & Iron
            </p>
            <div className="mt-2 flex items-center justify-between text-[10px] text-emerald-900 font-semibold">
              <span>Progress</span>
              <span>{t2Progress}%</span>
            </div>
            <div className="w-full h-1.5 bg-emerald-200/70 rounded-full mt-1 overflow-hidden">
              <div className="h-full bg-emerald-600 rounded-full" style={{ width: `${t2Progress}%` }} />
            </div>
          </button>

          {/* Card 3: 3rd Trimester */}
          <button
            type="button"
            onClick={() => setActiveViewingTrimester('3rd Trimester')}
            className={`p-3 rounded-2xl text-left border transition-all cursor-pointer ${
              activeViewingTrimester === '3rd Trimester'
                ? 'bg-indigo-50/80 border-indigo-600 shadow-sm ring-1 ring-indigo-500'
                : 'bg-[#EFEFE9]/60 hover:bg-[#E8D9CD] border-[#959D90]/30'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-indigo-900 flex items-center gap-1">
                <span>3rd Trimester</span>
                {actualTrimester === '3rd Trimester' && (
                  <span className="px-1.5 py-0.2 rounded-full bg-indigo-600 text-white text-[9px] font-bold">Current</span>
                )}
              </span>
              <span className="text-[10px] font-bold text-indigo-800">Weeks 28–40</span>
            </div>
            <p className="text-[11px] text-indigo-950/80 font-medium mt-1 line-clamp-1">
              👶 Lung Maturation, Iron Storage & Labor
            </p>
            <div className="mt-2 flex items-center justify-between text-[10px] text-indigo-900 font-semibold">
              <span>Progress</span>
              <span>{t3Progress}%</span>
            </div>
            <div className="w-full h-1.5 bg-indigo-200/70 rounded-full mt-1 overflow-hidden">
              <div className="h-full bg-indigo-600 rounded-full" style={{ width: `${t3Progress}%` }} />
            </div>
          </button>
        </div>
      </div>

      {/* 3. Active Trimester Spotlight Banner */}
      <div className="bg-[#223030] text-[#EFEFE9] rounded-2xl p-4 sm:p-5 border border-[#523D35] relative overflow-hidden shadow-md">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5 max-w-3xl">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-2.5 py-0.5 rounded-full bg-[#523D35] text-[#E8D9CD] text-xs font-bold border border-[#BBA58F]/40">
                {activeData.name}
              </span>
              <span className="text-xs text-[#BBA58F] font-bold flex items-center gap-1">
                <Baby className="w-3.5 h-3.5" />
                <span>Size: {activeData.babySizeSummary}</span>
              </span>
            </div>
            <h3 className="text-base sm:text-lg font-bold text-[#EFEFE9]">
              Nutrient Mandate: {activeData.primaryNutrientTheme}
            </h3>
            <p className="text-xs text-[#E8D9CD] leading-relaxed">
              {activeData.clinicalThemeDescription}
            </p>
          </div>

          {/* Quick Sub-Navigation Pills */}
          <div className="flex items-center bg-[#523D35]/80 p-1 rounded-xl border border-[#BBA58F]/30 shrink-0">
            <button
              type="button"
              onClick={() => setActiveSubTab('nutrients')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                activeSubTab === 'nutrients'
                  ? 'bg-[#BBA58F] text-[#223030] shadow-xs'
                  : 'text-[#E8D9CD] hover:text-white'
              }`}
            >
              🥗 Nutrient Focus
            </button>
            <button
              type="button"
              onClick={() => setActiveSubTab('milestones')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                activeSubTab === 'milestones'
                  ? 'bg-[#BBA58F] text-[#223030] shadow-xs'
                  : 'text-[#E8D9CD] hover:text-white'
              }`}
            >
              🌱 Milestones
            </button>
            <button
              type="button"
              onClick={() => setActiveSubTab('clinical')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                activeSubTab === 'clinical'
                  ? 'bg-[#BBA58F] text-[#223030] shadow-xs'
                  : 'text-[#E8D9CD] hover:text-white'
              }`}
            >
              🩺 Medical Checks
            </button>
          </div>
        </div>
      </div>

      {/* 4. Sub-Tab Content Rendering */}

      {/* ======================================================== */}
      {/* SUB-TAB 1: NUTRIENT FOCUS AREAS                          */}
      {/* ======================================================== */}
      {activeSubTab === 'nutrients' && (
        <div className="space-y-4 animate-in fade-in duration-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Apple className="w-4 h-4 text-emerald-700" />
              <h4 className="text-sm font-black text-[#223030] tracking-tight uppercase">
                Specific Nutrient Priorities for {activeData.id}
              </h4>
            </div>
            {onNavigateToFoods && (
              <button
                type="button"
                onClick={() => onNavigateToFoods('All')}
                className="text-xs font-bold text-[#523D35] hover:text-[#223030] flex items-center gap-1 cursor-pointer transition"
              >
                <span>Explore Matching Dishes</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {activeData.nutrients.map((nutrient) => {
              const isExpanded = expandedNutrientId === nutrient.id;
              return (
                <div
                  key={nutrient.id}
                  className="bg-white rounded-2xl p-4 sm:p-5 border border-[#959D90]/30 shadow-xs hover:border-[#523D35]/50 transition space-y-3 flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    {/* Header line: Title & RDA Target */}
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <h5 className="text-sm font-black text-[#223030]">{nutrient.name}</h5>
                          {nutrient.chemicalSymbol && (
                            <span className="px-2 py-0.2 rounded-md bg-[#E8D9CD] text-[#523D35] text-[10px] font-bold">
                              {nutrient.chemicalSymbol}
                            </span>
                          )}
                        </div>
                        <p className="text-xs font-bold text-[#523D35] mt-0.5">
                          {nutrient.clinicalPurpose}
                        </p>
                      </div>

                      <div className="px-2.5 py-1 rounded-xl bg-[#223030] text-[#BBA58F] text-xs font-extrabold shadow-2xs whitespace-nowrap text-right">
                        <span className="block text-[9px] text-[#E8D9CD]/80 font-normal">Daily Target</span>
                        {nutrient.rdaTarget}
                      </div>
                    </div>

                    {/* Biological Mechanism */}
                    <p className="text-xs text-[#523D35] leading-relaxed bg-[#EFEFE9]/60 p-2.5 rounded-xl border border-[#959D90]/20">
                      <strong className="text-[#223030]">Why needed now:</strong> {nutrient.vitalMechanism}
                    </p>

                    {nutrient.icmrNote && (
                      <div className="flex items-start gap-1.5 text-[11px] text-amber-900 bg-amber-50 p-2 rounded-lg border border-amber-200">
                        <Info className="w-3.5 h-3.5 shrink-0 mt-0.5 text-amber-700" />
                        <span><strong>ICMR-NIN Advisory:</strong> {nutrient.icmrNote}</span>
                      </div>
                    )}
                  </div>

                  {/* Food Sources Tags */}
                  <div className="pt-2 border-t border-[#959D90]/20 space-y-1.5">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#523D35] block">
                      Authentic Indian Food Sources:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {nutrient.sources.map((src) => (
                        <span
                          key={src}
                          className="px-2 py-0.5 rounded-md bg-[#E8D9CD]/80 text-[#223030] text-xs font-semibold border border-[#959D90]/30"
                        >
                          {src}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* SUB-TAB 2: KEY DEVELOPMENTAL MILESTONES                   */}
      {/* ======================================================== */}
      {activeSubTab === 'milestones' && (
        <div className="space-y-4 animate-in fade-in duration-200">
          <div className="flex items-center gap-2">
            <Baby className="w-4 h-4 text-[#523D35]" />
            <h4 className="text-sm font-black text-[#223030] tracking-tight uppercase">
              Fetal Growth & Developmental Milestones ({activeData.weekRange})
            </h4>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {activeData.milestones.map((m, idx) => (
              <div
                key={m.weekRange}
                className="bg-white rounded-2xl p-4 sm:p-5 border border-[#959D90]/30 shadow-xs flex flex-col justify-between space-y-3"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between pb-2 border-b border-[#959D90]/20">
                    <span className="px-2.5 py-0.5 rounded-full bg-[#223030] text-[#EFEFE9] text-xs font-bold">
                      {m.weekRange}
                    </span>
                    <span className="text-xs font-bold text-[#523D35]">
                      {m.fetalLengthWeight}
                    </span>
                  </div>

                  <h5 className="text-sm font-black text-[#223030]">{m.title}</h5>
                  <p className="text-xs text-[#523D35] leading-relaxed">
                    {m.description}
                  </p>

                  <div className="p-2 bg-[#E8D9CD]/50 rounded-xl border border-[#959D90]/30 text-xs text-[#223030]">
                    <span className="font-bold text-[#523D35] block text-[10px] uppercase">Comparable Baby Size:</span>
                    <span className="font-extrabold">{m.fetalSize}</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-[#959D90]/20 space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#523D35] block">
                    Key Developments:
                  </span>
                  <ul className="space-y-1">
                    {m.keyHighlights.map((hl) => (
                      <li key={hl} className="text-xs text-[#223030] flex items-start gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{hl}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* SUB-TAB 3: CLINICAL SCANS & ROUTINE CARE                  */}
      {/* ======================================================== */}
      {activeSubTab === 'clinical' && (
        <div className="space-y-4 animate-in fade-in duration-200">
          <div className="flex items-center gap-2">
            <Stethoscope className="w-4 h-4 text-[#523D35]" />
            <h4 className="text-sm font-black text-[#223030] tracking-tight uppercase">
              Recommended Ultrasound Scans & Antenatal Checkups ({activeData.id})
            </h4>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {activeData.clinicalChecks.map((check) => (
              <div
                key={check.testName}
                className="bg-white rounded-2xl p-4 sm:p-5 border border-[#959D90]/30 shadow-xs flex flex-col justify-between space-y-3"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 rounded-full bg-[#523D35] text-[#EFEFE9] text-xs font-bold">
                      {check.weekRange}
                    </span>
                    {check.isCrucial && (
                      <span className="px-2 py-0.2 rounded-md bg-red-100 text-red-900 border border-red-300 text-[10px] font-bold">
                        Mandatory
                      </span>
                    )}
                  </div>

                  <h5 className="text-sm font-black text-[#223030]">{check.testName}</h5>
                  <p className="text-xs text-[#523D35] leading-relaxed">
                    {check.purpose}
                  </p>
                </div>

                <div className="p-2.5 bg-[#EFEFE9] rounded-xl border border-[#959D90]/20 flex items-center gap-2 text-xs font-semibold text-[#223030]">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Record in your MCP Card with your ASHA / Doctor</span>
                </div>
              </div>
            ))}
          </div>

          {/* Maternal Wellness & Guidelines */}
          <div className="bg-[#E8D9CD] rounded-2xl p-4 border border-[#959D90]/40 space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[#523D35] block">
              Clinical Care Advice for {activeData.id}:
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-[#223030]">
              {activeData.maternalWellnessTips.map((tip, idx) => (
                <div key={idx} className="flex items-start gap-2 bg-white/70 p-2.5 rounded-xl border border-[#959D90]/30">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700 shrink-0 mt-0.5" />
                  <span className="leading-snug">{tip}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
