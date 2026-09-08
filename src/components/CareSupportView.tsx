import React, { useState, useMemo } from 'react';
import { 
  ShieldCheck, 
  PhoneCall, 
  Hospital, 
  FileText, 
  ExternalLink, 
  CheckCircle2, 
  AlertCircle, 
  MapPin, 
  Star, 
  MessageSquare, 
  Send, 
  Sparkles, 
  ChevronRight, 
  HeartHandshake, 
  Info,
  Ambulance,
  Phone,
  Search,
  Building2,
  HelpCircle,
  Clock,
  Award
} from 'lucide-react';
import { CENTRALIZED_GOVERNMENT_SCHEMES, GovernmentScheme } from '../data/governmentSchemes';
import { getHealthFacilities, STATE_DISTRICTS, HealthFacility } from '../location_service';

interface CareSupportViewProps {
  userProfile?: any;
}

export const CareSupportView: React.FC<CareSupportViewProps> = ({ userProfile }) => {
  const [activeSubTab, setActiveSubTab] = useState<'schemes' | 'sos' | 'hospitals' | 'chatbot'>('schemes');
  const [schemeLevelFilter, setSchemeLevelFilter] = useState<'All' | 'Central' | 'State'>('All');
  const [selectedSchemeState, setSelectedSchemeState] = useState<string>(userProfile?.state || 'All');
  const [schemeSearch, setSchemeSearch] = useState<string>('');
  const [selectedScheme, setSelectedScheme] = useState<GovernmentScheme | null>(null);

  // Hospital locator filters
  const [selectedState, setSelectedState] = useState<string>(userProfile?.state || 'Karnataka');
  const [selectedDistrict, setSelectedDistrict] = useState<string>(userProfile?.district || 'Bengaluru Urban');
  const [facilityTypeFilter, setFacilityTypeFilter] = useState<string>('All');

  // AI Chatbot State
  const [chatMessages, setChatMessages] = useState<Array<{ sender: 'user' | 'bot'; text: string; time: string }>>([
    {
      sender: 'bot',
      text: 'Namaste! I am your PregNutri AI Care Assistant. Ask me anything regarding maternal nutrition, trimester dietary guidelines, ICMR RDA standards, or safe Indian remedies for nausea and heartburn.',
      time: 'Just now'
    }
  ]);
  const [inputMessage, setInputMessage] = useState<string>('');

  // Quick questions for Chatbot
  const quickQuestions = [
    'Is coconut water safe during the 2nd trimester?',
    'What are the best iron-rich Indian vegetarian foods?',
    'How do I apply for the PMMVY ₹5,000 scheme?',
    'Safe remedies for morning sickness and acidity',
    'How much water should I drink daily during pregnancy?'
  ];

  // Available districts for the selected state
  const availableDistricts = STATE_DISTRICTS[selectedState] || ['Central District', 'North District', 'South District'];

  // Filtered schemes
  const filteredSchemes = useMemo(() => {
    return CENTRALIZED_GOVERNMENT_SCHEMES.filter(s => {
      if (schemeLevelFilter !== 'All' && s.level !== schemeLevelFilter) return false;
      if (selectedSchemeState !== 'All' && s.level === 'State' && s.state && s.state.toLowerCase() !== selectedSchemeState.toLowerCase()) {
        return false;
      }
      if (schemeSearch.trim()) {
        const q = schemeSearch.toLowerCase();
        const nameMatch = (s.name.en || '').toLowerCase().includes(q);
        const purposeMatch = (s.purpose.en || '').toLowerCase().includes(q);
        const benefitsMatch = (s.benefits.en || '').toLowerCase().includes(q);
        return nameMatch || purposeMatch || benefitsMatch;
      }
      return true;
    });
  }, [schemeLevelFilter, selectedSchemeState, schemeSearch]);

  // Health facilities
  const facilities: HealthFacility[] = useMemo(() => {
    const list = getHealthFacilities(selectedState, selectedDistrict, userProfile?.city || 'Local', userProfile?.pincode || '560001');
    if (facilityTypeFilter === 'All') return list;
    return list.filter(f => f.type.toLowerCase().includes(facilityTypeFilter.toLowerCase()));
  }, [selectedState, selectedDistrict, facilityTypeFilter, userProfile]);

  const handleSendChat = (questionText?: string) => {
    const textToSend = questionText || inputMessage;
    if (!textToSend.trim()) return;

    const userMsg = {
      sender: 'user' as const,
      text: textToSend,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    const newChat = [...chatMessages, userMsg];
    setChatMessages(newChat);
    if (!questionText) setInputMessage('');

    // Generate intelligent maternal care response
    setTimeout(() => {
      let botResponse = '';
      const q = textToSend.toLowerCase();

      if (q.includes('coconut water')) {
        botResponse = 'Yes! Tender coconut water is exceptionally safe and highly recommended during all trimesters. It provides natural electrolytes (potassium, magnesium), prevents maternal dehydration, and relieves acid reflux. Aim for 1 fresh coconut daily in the morning or mid-day.';
      } else if (q.includes('iron') || q.includes('anemia') || q.includes('hemoglobin')) {
        botResponse = 'For pregnant women, ICMR-NIN recommends 27-35 mg of iron daily. Excellent Indian sources include Cooked Palak (Spinach), Moringa / Drumstick leaves, Ragi (Finger Millet), Sprouted Moong Dal, Jaggery, Dates, and Pomegranate. Always consume iron-rich foods with Vitamin C (e.g. lemon juice, amla) for maximum absorption.';
      } else if (q.includes('pmmvy') || q.includes('scheme') || q.includes('5000') || q.includes('money')) {
        botResponse = 'Pradhan Mantri Matru Vandana Yojana (PMMVY) provides ₹5,000 in 2 instalments directly to your bank account for your first child, and ₹6,000 for your second child if a girl child. Register at your nearest Anganwadi Center or online at pmmvy.wcd.gov.in with your MCP Card and Aadhaar.';
      } else if (q.includes('nausea') || q.includes('morning sickness') || q.includes('vomit') || q.includes('acidity')) {
        botResponse = 'For nausea and morning sickness: 1) Keep dry roasted crackers or dry toast at your bedside to eat before getting up. 2) Drink mild ginger water or fennel (saunf) infusion. 3) Eat small, frequent meals every 2-3 hours rather than heavy meals. 4) Avoid lying down immediately after eating.';
      } else if (q.includes('water') || q.includes('hydration') || q.includes('drink')) {
        botResponse = 'Expecting mothers should aim for 2.5 to 3 Litres (10 to 12 standard 250ml glasses) of fluids daily. This is essential for amniotic fluid production, increased blood volume, kidney clearance, and preventing urinary tract infections (UTIs).';
      } else if (q.includes('papaya') || q.includes('pineapple')) {
        botResponse = 'Raw or semi-ripe green papaya contains high latex and papain enzymes which can stimulate uterine contractions, so it is classified as AVOID during pregnancy. Ripe papaya in small amounts is considered safer by some, but semi-ripe must strictly be avoided. Pineapple in large quantities contains bromelain which may soften the cervix.';
      } else {
        botResponse = `According to ICMR-NIN 2020 maternal guidelines, maintaining a diverse diet with whole grains (Ragi, Jowar), pulses, cooked greens, pasteurized dairy, and safe hydration supports optimal fetal development and maternal well-being. For specific medical conditions, always consult your gynecologist or ASHA worker.`;
      }

      setChatMessages(prev => [
        ...prev,
        {
          sender: 'bot',
          text: botResponse,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    }, 600);
  };

  return (
    <div className="space-y-8 pb-16">
      
      {/* 1. Header Hero Banner */}
      <section className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-md relative overflow-hidden">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-pink-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-2xl space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-pink-500/20 border border-pink-500/30 text-pink-300 text-xs font-bold">
            <HeartHandshake className="w-3.5 h-3.5" />
            <span>Maternal Welfare, Emergency & Support</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
            Care, Schemes & Emergency Support
          </h1>
          <p className="text-sm text-slate-300 leading-relaxed">
            Verified Indian government maternity schemes, 24/7 free obstetrics helplines, nearby healthcare facilities, and interactive maternal guidance.
          </p>
        </div>
      </section>

      {/* 2. Sub-Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 overflow-x-auto pb-2 scrollbar-none">
        <button
          onClick={() => setActiveSubTab('schemes')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
            activeSubTab === 'schemes'
              ? 'bg-pink-600 text-white shadow-sm shadow-pink-200'
              : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          <Award className="w-4 h-4" />
          <span>Government Schemes ({CENTRALIZED_GOVERNMENT_SCHEMES.length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab('sos')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
            activeSubTab === 'sos'
              ? 'bg-rose-600 text-white shadow-sm shadow-rose-200'
              : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          <PhoneCall className="w-4 h-4 text-rose-500" />
          <span>Emergency SOS & 24/7 Helplines</span>
        </button>

        <button
          onClick={() => setActiveSubTab('hospitals')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
            activeSubTab === 'hospitals'
              ? 'bg-pink-600 text-white shadow-sm shadow-pink-200'
              : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          <Hospital className="w-4 h-4" />
          <span>Hospitals & Clinic Finder</span>
        </button>

        <button
          onClick={() => setActiveSubTab('chatbot')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
            activeSubTab === 'chatbot'
              ? 'bg-pink-600 text-white shadow-sm shadow-pink-200'
              : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          <span>AI Maternal Assistant</span>
        </button>
      </div>

      {/* 3. Tab Content */}

      {/* SUBTAB 1: GOVERNMENT SCHEMES */}
      {activeSubTab === 'schemes' && (
        <div className="space-y-6">
          {/* Filters Bar */}
          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row gap-4 justify-between items-center">
            
            {/* Search */}
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={schemeSearch}
                onChange={(e) => setSchemeSearch(e.target.value)}
                placeholder="Search schemes (PMMVY, JSY, etc.)..."
                className="w-full pl-9.5 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500"
              />
            </div>

            {/* Filters */}
            <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto">
              <span className="text-xs font-bold text-slate-600 shrink-0">Level:</span>
              {(['All', 'Central', 'State'] as const).map(lvl => (
                <button
                  key={lvl}
                  onClick={() => setSchemeLevelFilter(lvl)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                    schemeLevelFilter === lvl
                      ? 'bg-pink-600 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {lvl}
                </button>
              ))}
            </div>

          </div>

          {/* Schemes Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredSchemes.map((scheme) => (
              <div
                key={scheme.id}
                className="bg-white rounded-3xl border border-slate-200/80 shadow-xs hover:shadow-md transition-all duration-200 overflow-hidden flex flex-col justify-between"
              >
                <div className="p-6 space-y-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                          scheme.level === 'Central' ? 'bg-indigo-50 text-indigo-700 border border-indigo-200' : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        }`}>
                          {scheme.level} Scheme {scheme.state ? `• ${scheme.state}` : ''}
                        </span>
                      </div>
                      <h3 className="text-base font-bold text-slate-900 mt-2">
                        {scheme.name.en}
                      </h3>
                      <p className="text-xs text-slate-500 font-medium mt-0.5">
                        {scheme.authority.en}
                      </p>
                    </div>
                    <div className="w-10 h-10 rounded-2xl bg-pink-50 border border-pink-100 flex items-center justify-center text-pink-600 shrink-0">
                      <Award className="w-5 h-5" />
                    </div>
                  </div>

                  <div className="space-y-2.5 pt-2">
                    <div className="bg-slate-50 rounded-xl p-3 border border-slate-100">
                      <div className="text-[11px] font-bold text-slate-700 flex items-center gap-1.5">
                        <Award className="w-3.5 h-3.5 text-pink-600" />
                        <span>Key Financial & Nutrition Benefit</span>
                      </div>
                      <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                        {scheme.benefits.en}
                      </p>
                    </div>

                    <div className="text-xs text-slate-600 space-y-1">
                      <div className="font-bold text-slate-700">Eligibility:</div>
                      <p className="text-[11px] text-slate-500 leading-relaxed line-clamp-3">
                        {scheme.eligibility.en}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
                  <div className="text-[11px] text-slate-500">
                    Verified Portal Available
                  </div>
                  <a
                    href={scheme.officialPortalUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-pink-600 text-white hover:bg-pink-700 text-xs font-bold transition-colors cursor-pointer shadow-xs"
                  >
                    <span>Apply / Official Site</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>

              </div>
            ))}
          </div>

          {filteredSchemes.length === 0 && (
            <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 space-y-3">
              <Award className="w-12 h-12 text-slate-300 mx-auto" />
              <h3 className="text-base font-bold text-slate-800">No schemes found</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Try clearing your search query or switching between Central and State level filters.
              </p>
            </div>
          )}
        </div>
      )}

      {/* SUBTAB 2: EMERGENCY SOS & 24/7 HELPLINES */}
      {activeSubTab === 'sos' && (
        <div className="space-y-6">
          
          {/* Emergency Alert Banner */}
          <div className="bg-rose-50 border-2 border-rose-200 rounded-3xl p-6 sm:p-8 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-rose-600 text-white flex items-center justify-center shadow-md shadow-rose-300 shrink-0">
                <Ambulance className="w-6 h-6 animate-pulse" />
              </div>
              <div>
                <h2 className="text-xl font-black text-rose-950">24/7 Emergency Maternity Assistance</h2>
                <p className="text-xs text-rose-700 font-medium mt-0.5">
                  Direct government toll-free emergency helplines for pregnant women across India. Free 24/7 service.
                </p>
              </div>
            </div>

            {/* Quick Action Dial Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
              
              {/* 102 */}
              <div className="bg-white rounded-2xl p-5 border border-rose-200/80 shadow-xs flex flex-col justify-between space-y-3">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-black text-rose-600 tracking-tight">102</span>
                    <span className="px-2 py-0.5 rounded-full bg-rose-100 text-rose-700 text-[10px] font-black">Patient Transport</span>
                  </div>
                  <div className="text-xs font-bold text-slate-900 mt-1">Patient Transport Service (JSSK Fleet)</div>
                  <p className="text-[11px] text-slate-500 mt-1">
                    Free ambulance transportation for pregnant women to the nearest government hospital (availability may vary by state).
                  </p>
                </div>
                <a
                  href="tel:102"
                  className="w-full py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs flex items-center justify-center gap-2 transition-colors shadow-xs"
                >
                  <Phone className="w-3.5 h-3.5 fill-current" /> Call 102
                </a>
              </div>

              {/* 108 */}
              <div className="bg-white rounded-2xl p-5 border border-rose-200/80 shadow-xs flex flex-col justify-between space-y-3">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-black text-rose-600 tracking-tight">108</span>
                    <span className="px-2 py-0.5 rounded-full bg-rose-100 text-rose-700 text-[10px] font-black">Ambulance Service</span>
                  </div>
                  <div className="text-xs font-bold text-slate-900 mt-1">Emergency Ambulance Service</div>
                  <p className="text-[11px] text-slate-500 mt-1">
                    24x7 emergency ambulance dispatch for acute medical and obstetric emergencies.
                  </p>
                </div>
                <a
                  href="tel:108"
                  className="w-full py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs flex items-center justify-center gap-2 transition-colors shadow-xs"
                >
                  <Phone className="w-3.5 h-3.5 fill-current" /> Call 108
                </a>
              </div>

              {/* 112 */}
              <div className="bg-white rounded-2xl p-5 border border-rose-200/80 shadow-xs flex flex-col justify-between space-y-3">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-black text-rose-600 tracking-tight">112</span>
                    <span className="px-2 py-0.5 rounded-full bg-rose-100 text-rose-700 text-[10px] font-black">All Emergency</span>
                  </div>
                  <div className="text-xs font-bold text-slate-900 mt-1">National Unified Emergency Response</div>
                  <p className="text-[11px] text-slate-500 mt-1">
                    Single unified emergency number connecting police, ambulance, and maternal emergency services.
                  </p>
                </div>
                <a
                  href="tel:112"
                  className="w-full py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs flex items-center justify-center gap-2 transition-colors shadow-xs"
                >
                  <Phone className="w-3.5 h-3.5 fill-current" /> Call 112
                </a>
              </div>

              {/* 181 */}
              <div className="bg-white rounded-2xl p-5 border border-rose-200/80 shadow-xs flex flex-col justify-between space-y-3">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-black text-rose-600 tracking-tight">181</span>
                    <span className="px-2 py-0.5 rounded-full bg-rose-100 text-rose-700 text-[10px] font-black">Women Helpline</span>
                  </div>
                  <div className="text-xs font-bold text-slate-900 mt-1">National Women in Distress Line</div>
                  <p className="text-[11px] text-slate-500 mt-1">
                    24/7 confidential counseling, maternal legal aid, and institutional shelter assistance.
                  </p>
                </div>
                <a
                  href="tel:181"
                  className="w-full py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs flex items-center justify-center gap-2 transition-colors shadow-xs"
                >
                  <Phone className="w-3.5 h-3.5 fill-current" /> Call 181
                </a>
              </div>

            </div>

          </div>

          {/* Emergency Danger Signs Checklist */}
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-xs space-y-4">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-rose-600" />
              <span>When to Seek Immediate Emergency Hospital Care</span>
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-2xl bg-rose-50/60 border border-rose-100 space-y-1.5">
                <div className="font-bold text-xs text-rose-900">Vaginal Bleeding or Spotting</div>
                <p className="text-[11px] text-rose-700 leading-relaxed">
                  Any amount of bright red bleeding or severe fluid leakage requires immediate evaluation.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-rose-50/60 border border-rose-100 space-y-1.5">
                <div className="font-bold text-xs text-rose-900">Severe Abdominal Pain or Cramps</div>
                <p className="text-[11px] text-rose-700 leading-relaxed">
                  Persistent, sharp cramping that does not subside with rest or hydration.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-rose-50/60 border border-rose-100 space-y-1.5">
                <div className="font-bold text-xs text-rose-900">Decreased Fetal Movement</div>
                <p className="text-[11px] text-rose-700 leading-relaxed">
                  Significant drop in baby's kicks after Week 28 (fewer than 10 kicks in 2 hours).
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-rose-50/60 border border-rose-100 space-y-1.5">
                <div className="font-bold text-xs text-rose-900">Sudden Face & Hand Swelling</div>
                <p className="text-[11px] text-rose-700 leading-relaxed">
                  Rapid swelling with severe headache or blurred vision (signs of preeclampsia).
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-rose-50/60 border border-rose-100 space-y-1.5">
                <div className="font-bold text-xs text-rose-900">High Fever & Chills</div>
                <p className="text-[11px] text-rose-700 leading-relaxed">
                  Temperature above 100.4°F (38°C) that does not respond to paracetamol.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-rose-50/60 border border-rose-100 space-y-1.5">
                <div className="font-bold text-xs text-rose-900">Persistent Severe Vomiting</div>
                <p className="text-[11px] text-rose-700 leading-relaxed">
                  Inability to keep any fluids down for 24 hours leading to severe dehydration.
                </p>
              </div>
            </div>
          </div>

        </div>
      )}

      {/* SUBTAB 3: HOSPITALS & CLINIC FINDER */}
      {activeSubTab === 'hospitals' && (
        <div className="space-y-6">
          
          {/* Location Selector Bar */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-wrap gap-4 items-center justify-between">
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-pink-600" />
                <span className="text-xs font-bold text-slate-700">Select Region:</span>
              </div>

              {/* State */}
              <select
                value={selectedState}
                onChange={(e) => {
                  setSelectedState(e.target.value);
                  const dists = STATE_DISTRICTS[e.target.value] || [];
                  setSelectedDistrict(dists[0] || 'Central District');
                }}
                className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-hidden"
              >
                {Object.keys(STATE_DISTRICTS).map(st => (
                  <option key={st} value={st}>{st}</option>
                ))}
              </select>

              {/* District */}
              <select
                value={selectedDistrict}
                onChange={(e) => setSelectedDistrict(e.target.value)}
                className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-hidden"
              >
                {availableDistricts.map(dst => (
                  <option key={dst} value={dst}>{dst}</option>
                ))}
              </select>
            </div>

            {/* Type filter */}
            <div className="flex items-center gap-1.5 overflow-x-auto">
              {(['All', 'Hospital', 'PHC', 'Ambulance'] as const).map(t => (
                <button
                  key={t}
                  onClick={() => setFacilityTypeFilter(t)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                    facilityTypeFilter === t
                      ? 'bg-pink-600 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* Hospitals List */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {facilities.map((fac) => (
              <div
                key={fac.id}
                className="bg-white rounded-3xl border border-slate-200/80 p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-4"
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-full bg-pink-50 text-pink-700 text-[10px] font-black uppercase tracking-wider border border-pink-200">
                        {fac.type}
                      </span>
                      <span className="text-[11px] font-bold text-emerald-600 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" /> 24/7 Active
                      </span>
                    </div>
                    <div className="flex items-center gap-1 text-amber-500 text-xs font-bold">
                      <Star className="w-3.5 h-3.5 fill-current" />
                      <span>{fac.rating}</span>
                    </div>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 mt-2">
                    {fac.name.en}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>{fac.address.en} ({fac.distance} km away)</span>
                  </p>

                  <div className="mt-3 pt-3 border-t border-slate-100 space-y-1.5">
                    <div className="text-[11px] font-bold text-slate-700">Services Offered:</div>
                    <div className="flex flex-wrap gap-1">
                      {fac.services.en?.slice(0, 3).map((srv, idx) => (
                        <span key={idx} className="px-2 py-0.5 bg-slate-100 text-slate-700 rounded-md text-[10px] font-medium">
                          {srv}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-600">{fac.phone}</span>
                  <a
                    href={`tel:${fac.phone}`}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-pink-600 hover:bg-pink-700 text-white text-xs font-bold transition-colors cursor-pointer"
                  >
                    <Phone className="w-3 h-3 fill-current" /> Call Facility
                  </a>
                </div>
              </div>
            ))}
          </div>

        </div>
      )}

      {/* SUBTAB 4: AI MATERNAL ASSISTANT CHATBOT */}
      {activeSubTab === 'chatbot' && (
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden flex flex-col h-[600px]">
          
          {/* Chat Header */}
          <div className="px-6 py-4 bg-gradient-to-r from-pink-600 to-rose-600 text-white flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center text-white backdrop-blur-xs">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-sm">PregNutri AI Maternal Assistant</h3>
                <p className="text-[11px] text-pink-100">Grounded in ICMR-NIN 2020 Indian Nutrition Guidelines</p>
              </div>
            </div>
            <span className="px-2.5 py-1 rounded-full bg-white/20 text-[10px] font-bold">24/7 Available</span>
          </div>

          {/* Quick Prompts Bar */}
          <div className="p-3 bg-slate-50 border-b border-slate-100 flex gap-2 overflow-x-auto scrollbar-none">
            {quickQuestions.map((qq, idx) => (
              <button
                key={idx}
                onClick={() => handleSendChat(qq)}
                className="px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-slate-700 hover:border-pink-300 hover:text-pink-600 text-[11px] font-medium whitespace-nowrap transition-colors cursor-pointer shadow-2xs"
              >
                {qq}
              </button>
            ))}
          </div>

          {/* Messages Area */}
          <div className="flex-1 p-6 overflow-y-auto space-y-4 bg-slate-50/50">
            {chatMessages.map((msg, index) => (
              <div
                key={index}
                className={`flex gap-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.sender === 'bot' && (
                  <div className="w-8 h-8 rounded-full bg-pink-600 text-white flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                    AI
                  </div>
                )}
                <div className={`max-w-lg rounded-2xl px-4 py-3 text-xs leading-relaxed ${
                  msg.sender === 'user'
                    ? 'bg-pink-600 text-white rounded-tr-xs'
                    : 'bg-white text-slate-800 border border-slate-200/80 shadow-2xs rounded-tl-xs'
                }`}>
                  <p>{msg.text}</p>
                  <div className={`text-[9px] mt-1.5 text-right ${msg.sender === 'user' ? 'text-pink-200' : 'text-slate-400'}`}>
                    {msg.time}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Input Box */}
          <div className="p-4 bg-white border-t border-slate-200 flex items-center gap-3">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSendChat();
              }}
              placeholder="Ask about foods, vitamins, symptoms, or remedies..."
              className="flex-1 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500"
            />
            <button
              onClick={() => handleSendChat()}
              className="px-4 py-2.5 bg-pink-600 hover:bg-pink-700 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Ask</span>
            </button>
          </div>

        </div>
      )}

    </div>
  );
};
