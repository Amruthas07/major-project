import React, { useState } from 'react';
import { OrderProduct, GlobalLocationState } from '../types';
import {
  ShoppingBag,
  ExternalLink,
  Sparkles,
  Search,
  Truck,
  ShieldCheck,
  MapPin,
  HeartPulse,
  UtensilsCrossed,
  Store,
  ArrowRight,
  Info,
  CheckCircle2
} from 'lucide-react';
import {
  formatLocationLabel,
  formatLocationQuery,
  getDeliveryOptions,
  cleanSearchKeyword,
  DeliveryOption
} from '../services/foodOrderingService';

interface OrderDeliveryViewProps {
  products: OrderProduct[];
  globalLocation?: GlobalLocationState;
}

export const OrderDeliveryView: React.FC<OrderDeliveryViewProps> = ({ products, globalLocation }) => {
  const locationInfo = formatLocationLabel(globalLocation);
  const locationQuery = formatLocationQuery(globalLocation);
  const activeState = globalLocation?.state || 'Karnataka';

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [orderedToast, setOrderedToast] = useState<string | null>(null);

  const categories = [
    'All',
    'Locally Sourced',
    'Grocery & Staples',
    'Fruits & Dry Fruits',
    'Healthy Snacks',
    'Maternal Supplements',
    'Comfort Gear'
  ];

  // Location-aware regional staples and authentic maternal nutrition items
  const regionalProducts: OrderProduct[] = [
    {
      id: 'reg-staple-1',
      name: activeState.includes('Tamil')
        ? 'Organic Seeraga Samba Rice & Cold Pressed Sesame Oil'
        : activeState.includes('Kerala')
        ? 'Navara Medicinal Red Rice & Pure Virgin Coconut Oil'
        : activeState.includes('Maharashtra')
        ? 'Organic Shalu Jowar Flour & Sprouted Matki'
        : activeState.includes('Punjab') || activeState.includes('Delhi')
        ? 'Organic Missi Flour (Chana+Wheat) & Mustard Sarson Oil'
        : 'Sprouted Finger Millet (Ragi) Flour & Cold Pressed Groundnut Oil',
      category: 'Locally Sourced',
      image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=600&auto=format&fit=crop&q=80',
      description: `Locally harvested indigenous staple tailored for ${activeState} mothers. High in bioavailable minerals, dietary fiber, and healthy fatty acids.`,
      maternalTip: 'Provides slow-burning complex carbs to maintain steady maternal blood glucose and prevent gestational diabetes.',
      weightOrVolume: '1 kg Pack'
    },
    {
      id: 'apollo-supp-1',
      name: 'Apollo Pharmacy Prenatal Iron & Folate Multi-Micronutrient Pack',
      category: 'Maternal Supplements',
      image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=600&auto=format&fit=crop&q=80',
      description: 'ICMR RDA aligned maternal multivitamins with elemental iron, active methylfolate (L-5-MTHF) & calcium D3.',
      maternalTip: 'Take post-lunch with lemon water or orange juice to boost non-heme iron absorption.',
      weightOrVolume: '60 Count Bottle'
    },
    {
      id: 'apollo-supp-2',
      name: 'Apollo 24|7 Maternal Calcium & Vitamin D3 Chewables',
      category: 'Maternal Supplements',
      image: 'https://images.unsplash.com/photo-1576602976047-174e57a47881?w=600&auto=format&fit=crop&q=80',
      description: 'High-absorption calcium carbonate & D3 to support fetal bone mineralization and reduce pregnancy leg cramps.',
      maternalTip: 'Maintain a 2-hour gap between iron supplements and calcium intake for optimal absorption.',
      weightOrVolume: '30 Chewables'
    },
    ...products.map(p => {
      // Normalize product categories for clear categorization
      let cat = p.category;
      if (p.id === 'prod-1') cat = 'Comfort Gear';
      else if (p.id === 'prod-2' || p.id === 'prod-4' || p.id === 'prod-6') cat = 'Grocery & Staples';
      else if (p.id === 'prod-3') cat = 'Fruits & Dry Fruits';
      else if (p.id === 'prod-5') cat = 'Healthy Snacks';
      return {
        ...p,
        category: cat
      };
    })
  ];

  const filteredProducts = regionalProducts.filter((prod) => {
    const matchesCategory = selectedCategory === 'All' || prod.category === selectedCategory;
    const matchesSearch =
      prod.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prod.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prod.maternalTip.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleNavigationFeedback = (option: DeliveryOption, product: OrderProduct) => {
    const keyword = cleanSearchKeyword(product.name);
    setOrderedToast(`Opening verified ${option.providerName} search for "${keyword}" in a new tab...`);
    setTimeout(() => setOrderedToast(null), 4500);
  };

  // Verified quick delivery and service hubs
  const deliveryPlatforms = [
    {
      name: 'Swiggy Instamart',
      tag: 'Instant Grocery',
      url: 'https://www.swiggy.com/instamart',
      desc: 'Doorstep delivery for fresh vegetables, fruits, millets, flours & dairy essentials.',
      type: 'grocery'
    },
    {
      name: 'Blinkit',
      tag: 'Quick Grocery',
      url: 'https://blinkit.com',
      desc: 'Daily staples, roasted seeds, nuts, pulses, and kitchen produce.',
      type: 'grocery'
    },
    {
      name: 'Apollo Pharmacy',
      tag: 'Certified Pharmacy',
      url: 'https://www.apollopharmacy.in',
      desc: 'Doctor-prescribed prenatal iron, folic acid, calcium, and maternal multivitamins.',
      type: 'pharmacy'
    },
    {
      name: 'Tata 1mg',
      tag: 'Online Health & Meds',
      url: 'https://www.1mg.com',
      desc: 'Online pharmacy for pregnancy supplements and clinical diagnostic lab tests.',
      type: 'pharmacy'
    }
  ];

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-300">
      {/* Toast Notification */}
      {orderedToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#223030] text-[#EFEFE9] px-5 py-3 rounded-2xl shadow-2xl border border-[#959D90] flex items-center space-x-3 text-xs animate-in slide-in-from-bottom-3 max-w-md">
          <Truck className="w-4 h-4 text-[#BBA58F] shrink-0" />
          <span className="font-medium leading-tight">{orderedToast}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="bg-[#E8D9CD] rounded-3xl p-6 sm:p-8 border border-[#959D90] shadow-xs space-y-5">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-[#523D35] text-[#E8D9CD] border border-[#BBA58F]/30 text-xs font-bold uppercase tracking-wider">
                <ShoppingBag className="w-3.5 h-3.5 text-[#BBA58F]" />
                <span>Verified External Delivery Directory</span>
              </div>
              <div className="inline-flex items-center space-x-1 px-3 py-1 rounded-full bg-[#223030] text-[#EFEFE9] text-xs font-semibold">
                <MapPin className="w-3 h-3 text-[#BBA58F]" />
                <span>Location: {locationInfo.fullLocation}</span>
              </div>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#223030] tracking-tight">
              🛒 Maternal Nutrition &amp; Health Delivery Hub
            </h1>
            <p className="text-sm text-[#523D35] mt-1 max-w-2xl">
              Search for authentic maternal ingredients, farm produce, and doctor-prescribed prenatal supplements directly on verified delivery and pharmacy services.
            </p>
          </div>

          <div className="flex items-center space-x-2 text-xs text-[#523D35] bg-[#EFEFE9] p-3 rounded-2xl border border-[#959D90]/50 self-start">
            <ShieldCheck className="w-4 h-4 text-[#523D35] shrink-0" />
            <span className="leading-snug">Item-Specific External Search (No Fake Prices or Invented Stock)</span>
          </div>
        </div>

        {/* Informative Notice */}
        <div className="flex items-start gap-2.5 text-xs text-[#523D35] bg-[#EFEFE9] p-3.5 rounded-2xl border border-[#959D90]/40">
          <Info className="w-4 h-4 text-[#523D35] shrink-0 mt-0.5" />
          <p className="text-[11px] leading-relaxed">
            <strong>Transparency Notice:</strong> PregNutri AI does not sell, prepare, or deliver products directly. Every button below opens an authentic item-specific search on the verified external provider in a new tab. Live availability, inventory, delivery time, and pricing are managed directly by each service in your area.
          </p>
        </div>

        {/* Integrated Delivery Services Quick Connect Bar */}
        <div className="pt-2 border-t border-[#959D90]/30 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {deliveryPlatforms.map((platform) => (
            <a
              key={platform.name}
              href={platform.url}
              target="_blank"
              rel="noopener noreferrer"
              className="p-3.5 rounded-2xl bg-[#EFEFE9] border border-[#959D90]/50 hover:border-[#523D35] transition shadow-xs flex flex-col justify-between group cursor-pointer text-left no-underline"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-[#223030] group-hover:text-[#523D35]">
                    {platform.name}
                  </span>
                  <ExternalLink className="w-3.5 h-3.5 text-[#959D90] group-hover:text-[#223030]" />
                </div>
                <span className="inline-block mt-1 text-[10px] font-bold text-[#523D35] bg-[#E8D9CD] px-2 py-0.5 rounded-md">
                  {platform.tag}
                </span>
                <p className="text-[11px] text-[#523D35] mt-1.5 leading-snug">
                  {platform.desc}
                </p>
              </div>
              <div className="mt-2 text-[11px] font-extrabold text-[#223030] flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                <span>Open {platform.name.split(' ')[0]}</span>
                <span>→</span>
              </div>
            </a>
          ))}
        </div>

        {/* Local Stores & Kirana Finder on Google Maps */}
        <div className="pt-1">
          <a
            href={`https://www.google.com/maps/search/grocery+stores+fresh+fruits+vegetables+near+${encodeURIComponent(locationQuery)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full p-3.5 rounded-2xl bg-[#EFEFE9] hover:bg-[#BBA58F]/30 border border-[#959D90]/60 transition flex items-center justify-between cursor-pointer group no-underline"
          >
            <div className="flex items-center gap-2.5">
              <Store className="w-4 h-4 text-[#523D35] shrink-0" />
              <div className="text-left">
                <span className="text-xs font-bold text-[#223030] block">
                  Find Local Grocery Mandis &amp; Kirana Stores near {locationInfo.shortLocation}
                </span>
                <span className="text-[11px] text-[#523D35]">
                  Search nearby physical vegetable markets, farmers mandis, and local grocery stores on Google Maps
                </span>
              </div>
            </div>
            <ExternalLink className="w-4 h-4 text-[#523D35] group-hover:text-[#223030] shrink-0" />
          </a>
        </div>

        {/* Search Bar */}
        <div className="relative pt-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#959D90]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={`Search maternal ingredients, high-calcium flours, or prenatal supplements...`}
            className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-[#EFEFE9] hover:bg-white focus:bg-white text-[#223030] border border-[#959D90]/60 focus:border-[#523D35] outline-none text-sm transition font-medium"
          />
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center space-x-2 overflow-x-auto no-scrollbar pt-1">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-[#223030] text-[#EFEFE9] shadow-xs'
                  : 'bg-[#EFEFE9] hover:bg-[#BBA58F]/30 text-[#523D35] border border-[#959D90]/40'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Product Card Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProducts.map((product) => {
          const deliveryOptions = getDeliveryOptions(product, globalLocation);
          const cleanKeyword = cleanSearchKeyword(product.name);

          return (
            <div
              key={product.id}
              className="bg-[#E8D9CD] rounded-3xl border border-[#959D90] overflow-hidden shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between group"
            >
              <div>
                {/* Product Image */}
                <div className="relative h-48 w-full bg-[#EFEFE9] overflow-hidden">
                  <img
                    src={product.image}
                    alt={product.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />

                  {/* Badges */}
                  <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                    <span className="px-2.5 py-1 rounded-full bg-[#223030]/80 backdrop-blur-md text-[#EFEFE9] text-[11px] font-semibold border border-white/20">
                      {product.category}
                    </span>
                    {product.weightOrVolume && (
                      <span className="px-2.5 py-0.5 rounded-full bg-[#EFEFE9]/95 text-[#223030] text-[11px] font-bold">
                        {product.weightOrVolume}
                      </span>
                    )}
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-5 space-y-3">
                  <h3 className="text-base font-bold text-[#223030] group-hover:text-[#523D35] transition">
                    {product.name}
                  </h3>
                  <p className="text-xs text-[#523D35] leading-relaxed line-clamp-2">
                    {product.description}
                  </p>

                  {/* Maternal Tip */}
                  <div className="bg-[#EFEFE9] border border-[#959D90]/50 rounded-xl p-3 space-y-1">
                    <div className="text-[10px] font-bold uppercase text-[#523D35] flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-[#523D35]" />
                      Maternal Nutrition &amp; Care Guidance
                    </div>
                    <p className="text-xs text-[#223030] font-medium leading-relaxed">
                      {product.maternalTip}
                    </p>
                  </div>
                </div>
              </div>

              {/* Verified Order Action Buttons */}
              <div className="p-5 pt-0 space-y-2.5 border-t border-[#959D90]/30 mt-2">
                <div className="flex items-center justify-between text-[11px] font-semibold text-[#523D35]">
                  <span>Search verified partner inventory:</span>
                  <span className="text-[10px] text-[#959D90]">Opens in new tab</span>
                </div>

                {deliveryOptions.length > 0 ? (
                  <div className="space-y-2">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {deliveryOptions.slice(0, 2).map((opt) => (
                        <a
                          key={opt.providerId}
                          href={opt.destinationUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={() => handleNavigationFeedback(opt, product)}
                          className={`py-2.5 px-3 rounded-xl ${opt.theme.buttonBg} ${opt.theme.buttonText} text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-xs cursor-pointer text-center no-underline`}
                        >
                          <span>{opt.actionLabel}</span>
                        </a>
                      ))}
                    </div>

                    {/* Secondary option if more than 2 providers exist */}
                    {deliveryOptions.length > 2 && (
                      <div className="flex flex-wrap items-center justify-center gap-2 pt-0.5">
                        <span className="text-[10px] text-[#523D35] font-medium">Also search:</span>
                        {deliveryOptions.slice(2).map((opt) => (
                          <a
                            key={opt.providerId}
                            href={opt.destinationUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={() => handleNavigationFeedback(opt, product)}
                            className="text-[11px] font-bold text-[#523D35] hover:text-[#223030] underline flex items-center gap-0.5"
                          >
                            <span>{opt.providerName} ↗</span>
                          </a>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="py-2.5 px-3 rounded-xl bg-[#EFEFE9] border border-[#959D90]/50 text-center text-xs text-[#523D35] italic">
                    Online ordering link unavailable for this item
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

