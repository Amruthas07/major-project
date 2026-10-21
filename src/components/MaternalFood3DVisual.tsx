import React, { useId } from 'react';
import { Food3DVisualKey, resolveFood3DVisual } from '../utils/foodImageMap';

export interface MaternalFood3DVisualProps {
  /** Explicit visual key or auto-resolved from dishName/foodId */
  visualKey?: Food3DVisualKey;
  foodId?: string | null;
  dishName?: string | null;
  category?: string | null;
  className?: string;
  size?: number | string;
  alt?: string;
}

/**
 * MaternalFood3DVisual
 * High-quality volumetric 3D claymorphism food illustrations for the Maternal Meal Planner.
 * Supports breakfast dishes, mid-morning snacks, full Indian lunches, evening snacks, dinners, and bedtime beverages.
 */
export const MaternalFood3DVisual: React.FC<MaternalFood3DVisualProps> = ({
  visualKey,
  foodId,
  dishName,
  category,
  className = 'w-full h-full object-contain',
  size,
  alt
}) => {
  const uid = useId().replace(/:/g, '_');

  // Resolve visual key dynamically if not explicitly specified
  const resolved = React.useMemo(() => {
    if (visualKey) {
      return {
        visualKey,
        altText: alt || `3D Maternal Food Illustration — ${dishName || 'Food Item'}`
      };
    }
    const res = resolveFood3DVisual({ foodId, foodName: dishName, category });
    return {
      visualKey: res.visualKey,
      altText: alt || res.altText
    };
  }, [visualKey, foodId, dishName, category, alt]);

  const style = size ? { width: size, height: size } : undefined;
  const key = resolved.visualKey;
  const altText = resolved.altText;

  // Render specific 3D SVG illustration based on key
  switch (key) {
    // -------------------------------------------------------------
    // BREAKFAST: 1. IDLI SAMBAR & CHUTNEY
    // -------------------------------------------------------------
    case '3d-idli-sambar':
    case '3d-breakfast-dish':
      return (
        <svg viewBox="0 0 400 400" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} style={style} role="img" aria-label={altText}>
          <defs>
            <radialGradient id={`bg_${uid}`} cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#FAF7F2" />
              <stop offset="100%" stopColor="#E8D9CD" stopOpacity="0.6" />
            </radialGradient>
            <linearGradient id={`leaf_${uid}`} x1="10%" y1="10%" x2="90%" y2="90%">
              <stop offset="0%" stopColor="#4A8E3F" />
              <stop offset="100%" stopColor="#25591D" />
            </linearGradient>
            <radialGradient id={`idli1_${uid}`} cx="35%" cy="30%" r="65%">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="70%" stopColor="#F5ECE1" />
              <stop offset="100%" stopColor="#D8C8B5" />
            </radialGradient>
            <linearGradient id={`sambar_${uid}`} x1="20%" y1="20%" x2="80%" y2="80%">
              <stop offset="0%" stopColor="#E57A28" />
              <stop offset="100%" stopColor="#AF4A0A" />
            </linearGradient>
            <linearGradient id={`chutney_${uid}`} x1="20%" y1="20%" x2="80%" y2="80%">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="100%" stopColor="#E0E8DC" />
            </linearGradient>
            <filter id={`sh_${uid}`} x="-10%" y="-10%" width="120%" height="130%">
              <feDropShadow dx="0" dy="12" stdDeviation="14" floodColor="#223030" floodOpacity="0.22" />
            </filter>
          </defs>
          <circle cx="200" cy="200" r="185" fill={`url(#bg_${uid})`} />
          <g filter={`url(#sh_${uid})`}>
            {/* Fresh Banana Leaf */}
            <path d="M70 170 C70 90 130 65 200 65 C270 65 330 90 330 170 C330 270 270 335 200 335 C130 335 70 270 70 170 Z" fill={`url(#leaf_${uid})`} stroke="#1F4719" strokeWidth="4" />
            <path d="M200 65 L200 335" stroke="#71B863" strokeWidth="3" opacity="0.8" />
            {/* Steamed Fluffy Idli 1 */}
            <ellipse cx="145" cy="180" rx="46" ry="38" fill={`url(#idli1_${uid})`} stroke="#C6B59F" strokeWidth="1.5" />
            <ellipse cx="140" cy="172" rx="30" ry="22" fill="#FFFFFF" opacity="0.6" />
            {/* Steamed Fluffy Idli 2 */}
            <ellipse cx="185" cy="235" rx="46" ry="38" fill={`url(#idli1_${uid})`} stroke="#C6B59F" strokeWidth="1.5" />
            <ellipse cx="180" cy="227" rx="30" ry="22" fill="#FFFFFF" opacity="0.6" />
            {/* Sambar Bowl */}
            <circle cx="270" cy="170" r="38" fill="#F0EBE1" stroke="#BBA58F" strokeWidth="4" />
            <circle cx="270" cy="170" r="32" fill={`url(#sambar_${uid})`} />
            <rect x="260" y="158" width="16" height="8" rx="3" fill="#2E6B2A" transform="rotate(30 260 158)" />
            <circle cx="278" cy="176" r="3.5" fill="#FFE394" />
            {/* Coconut Chutney Bowl */}
            <circle cx="255" cy="260" r="32" fill="#F0EBE1" stroke="#BBA58F" strokeWidth="4" />
            <circle cx="255" cy="260" r="26" fill={`url(#chutney_${uid})`} />
            <circle cx="250" cy="256" r="2" fill="#223030" />
            <circle cx="258" cy="262" r="1.5" fill="#223030" />
            <path d="M252 262 Q256 258 260 262" stroke="#2D6636" strokeWidth="2.5" strokeLinecap="round" />
          </g>
        </svg>
      );

    // -------------------------------------------------------------
    // BREAKFAST: 2. GOLDEN CRISP DOSA PLATTER
    // -------------------------------------------------------------
    case '3d-dosa-platter':
      return (
        <svg viewBox="0 0 400 400" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} style={style} role="img" aria-label={altText}>
          <defs>
            <radialGradient id={`dosaBg_${uid}`} cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#FFFDF9" />
              <stop offset="100%" stopColor="#EFE8DD" />
            </radialGradient>
            <linearGradient id={`dosaGrad_${uid}`} x1="15%" y1="15%" x2="85%" y2="85%">
              <stop offset="0%" stopColor="#E59F45" />
              <stop offset="50%" stopColor="#C47A22" />
              <stop offset="100%" stopColor="#8A4A0B" />
            </linearGradient>
            <linearGradient id={`plateGrad_${uid}`} x1="20%" y1="20%" x2="80%" y2="80%">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="100%" stopColor="#D5CBB9" />
            </linearGradient>
            <filter id={`dosaSh_${uid}`} x="-10%" y="-10%" width="120%" height="130%">
              <feDropShadow dx="0" dy="12" stdDeviation="15" floodColor="#223030" floodOpacity="0.22" />
            </filter>
          </defs>
          <circle cx="200" cy="200" r="185" fill={`url(#dosaBg_${uid})`} />
          <g filter={`url(#dosaSh_${uid})`}>
            {/* Ceramic Platter */}
            <circle cx="200" cy="200" r="150" fill={`url(#plateGrad_${uid})`} stroke="#BBA58F" strokeWidth="6" />
            {/* Rolled Golden Dosa with Roasted Crispy Sheen */}
            <g transform="rotate(-30 200 200)">
              <rect x="70" y="160" width="260" height="75" rx="36" fill={`url(#dosaGrad_${uid})`} stroke="#633405" strokeWidth="2.5" />
              {/* Golden Roasted Striations */}
              <ellipse cx="200" cy="180" rx="90" ry="12" fill="#FFAA47" opacity="0.6" />
              <ellipse cx="140" cy="195" rx="35" ry="6" fill="#693708" opacity="0.5" />
              <ellipse cx="230" cy="205" rx="45" ry="8" fill="#693708" opacity="0.5" />
              <ellipse cx="190" cy="215" rx="30" ry="5" fill="#693708" opacity="0.4" />
            </g>
            {/* Katori 1: Spiced Potato Masala (Aloo Palya) */}
            <circle cx="120" cy="115" r="32" fill="#FFFFFF" stroke="#BBA58F" strokeWidth="3" />
            <circle cx="120" cy="115" r="26" fill="#F4C236" />
            <circle cx="115" cy="112" r="3.5" fill="#52945D" />
            <circle cx="126" cy="118" r="3" fill="#D96E28" />
            {/* Katori 2: Fresh White Coconut Chutney */}
            <circle cx="280" cy="120" r="32" fill="#FFFFFF" stroke="#BBA58F" strokeWidth="3" />
            <circle cx="280" cy="120" r="26" fill="#FBFDFC" />
            <circle cx="276" cy="116" r="2" fill="#223030" />
            <circle cx="284" cy="122" r="1.5" fill="#223030" />
            <ellipse cx="282" cy="118" rx="6" ry="3" fill="#3E7D37" />
          </g>
        </svg>
      );

    // -------------------------------------------------------------
    // BREAKFAST: 3. VEGETABLE UPMA & POHA
    // -------------------------------------------------------------
    case '3d-vegetable-upma':
    case '3d-poha':
      return (
        <svg viewBox="0 0 400 400" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} style={style} role="img" aria-label={altText}>
          <defs>
            <radialGradient id={`upmaBg_${uid}`} cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#FFFBF2" />
              <stop offset="100%" stopColor="#EFE5D3" />
            </radialGradient>
            <radialGradient id={`upmaGrad_${uid}`} cx="45%" cy="40%" r="55%">
              <stop offset="0%" stopColor="#FFF2A3" />
              <stop offset="60%" stopColor="#F5D056" />
              <stop offset="100%" stopColor="#D4A726" />
            </radialGradient>
            <filter id={`upmaSh_${uid}`} x="-10%" y="-10%" width="120%" height="130%">
              <feDropShadow dx="0" dy="12" stdDeviation="15" floodColor="#223030" floodOpacity="0.2" />
            </filter>
          </defs>
          <circle cx="200" cy="200" r="185" fill={`url(#upmaBg_${uid})`} />
          <g filter={`url(#upmaSh_${uid})`}>
            {/* Deep Earthen Bowl */}
            <ellipse cx="200" cy="210" rx="145" ry="110" fill="#E8D9CD" stroke="#523D35" strokeWidth="6" />
            <ellipse cx="200" cy="200" rx="135" ry="95" fill="#F4EDE4" stroke="#BBA58F" strokeWidth="3" />
            {/* Mound of Golden Vegetable Upma / Poha */}
            <ellipse cx="200" cy="195" rx="120" ry="80" fill={`url(#upmaGrad_${uid})`} stroke="#BFA03B" strokeWidth="2" />
            {/* Roasted Crunchy Peanuts */}
            <ellipse cx="160" cy="180" rx="12" ry="7" fill="#8C3F10" transform="rotate(-20 160 180)" />
            <ellipse cx="230" cy="175" rx="12" ry="7" fill="#8C3F10" transform="rotate(30 230 175)" />
            <ellipse cx="190" cy="220" rx="11" ry="6.5" fill="#8C3F10" transform="rotate(10 190 220)" />
            {/* Green Peas & Carrot Cubes */}
            <circle cx="140" cy="200" r="6" fill="#4B943A" />
            <circle cx="220" cy="215" r="6.5" fill="#4B943A" />
            <circle cx="180" cy="165" r="5.5" fill="#4B943A" />
            <rect x="150" y="215" width="9" height="9" rx="2.5" fill="#E86C36" />
            <rect x="240" y="195" width="9" height="9" rx="2.5" fill="#E86C36" />
            {/* Fresh Curry Leaves & Lemon Wedge */}
            <ellipse cx="200" cy="175" rx="16" ry="7" fill="#2E6B2A" transform="rotate(-15 200 175)" />
            {/* Lemon Wedge */}
            <path d="M265 140 A 26 26 0 0 1 295 170 L 265 170 Z" fill="#FFE84F" stroke="#C9B40C" strokeWidth="2.5" />
          </g>
        </svg>
      );

    // -------------------------------------------------------------
    // BREAKFAST: 4. PESARATTU & PONGAL
    // -------------------------------------------------------------
    case '3d-pesarattu-appam':
    case '3d-pongal':
      return (
        <svg viewBox="0 0 400 400" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} style={style} role="img" aria-label={altText}>
          <defs>
            <radialGradient id={`pesBg_${uid}`} cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#F8FAF5" />
              <stop offset="100%" stopColor="#DFEAD9" />
            </radialGradient>
            <linearGradient id={`pesGrad_${uid}`} x1="15%" y1="15%" x2="85%" y2="85%">
              <stop offset="0%" stopColor="#81B55B" />
              <stop offset="60%" stopColor="#558E2E" />
              <stop offset="100%" stopColor="#3A661D" />
            </linearGradient>
            <filter id={`pesSh_${uid}`} x="-10%" y="-10%" width="120%" height="130%">
              <feDropShadow dx="0" dy="12" stdDeviation="15" floodColor="#223030" floodOpacity="0.2" />
            </filter>
          </defs>
          <circle cx="200" cy="200" r="185" fill={`url(#pesBg_${uid})`} />
          <g filter={`url(#pesSh_${uid})`}>
            {/* Ceramic Platter */}
            <circle cx="200" cy="200" r="145" fill="#FFFFFF" stroke="#BBA58F" strokeWidth="5" />
            {/* Green Moong Pesarattu Crepe folded */}
            <path d="M100 190 Q150 110 240 130 Q280 180 260 260 Q170 280 100 190 Z" fill={`url(#pesGrad_${uid})`} stroke="#2B5414" strokeWidth="3" />
            <ellipse cx="180" cy="180" rx="30" ry="12" fill="#9CD173" opacity="0.7" transform="rotate(-15 180 180)" />
            {/* Golden Ghee Upma Filling & Ginger Chutney */}
            <circle cx="160" cy="210" r="22" fill="#F7DC74" stroke="#BBA58F" strokeWidth="2" />
            {/* Ginger Allam Pachadi Bowl */}
            <circle cx="270" cy="165" r="30" fill="#EFEFE9" stroke="#BBA58F" strokeWidth="3" />
            <circle cx="270" cy="165" r="24" fill="#A83918" />
            <circle cx="266" cy="160" r="2" fill="#FFE2C7" />
          </g>
        </svg>
      );

    // -------------------------------------------------------------
    // MID-MORNING: 5. FRESH PINK GUAVA
    // -------------------------------------------------------------
    case '3d-guava-fruit':
      return (
        <svg viewBox="0 0 400 400" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} style={style} role="img" aria-label={altText}>
          <defs>
            <radialGradient id={`guavaBg_${uid}`} cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#FFF9F5" />
              <stop offset="100%" stopColor="#F5E4DA" />
            </radialGradient>
            <radialGradient id={`guavaSkin_${uid}`} cx="35%" cy="30%" r="65%">
              <stop offset="0%" stopColor="#A4D867" />
              <stop offset="70%" stopColor="#7CB839" />
              <stop offset="100%" stopColor="#4A7A1B" />
            </radialGradient>
            <radialGradient id={`guavaPulp_${uid}`} cx="45%" cy="40%" r="55%">
              <stop offset="0%" stopColor="#FF9B9B" />
              <stop offset="70%" stopColor="#F06060" />
              <stop offset="100%" stopColor="#C93434" />
            </radialGradient>
            <filter id={`guavaSh_${uid}`} x="-10%" y="-10%" width="120%" height="130%">
              <feDropShadow dx="0" dy="12" stdDeviation="15" floodColor="#223030" floodOpacity="0.2" />
            </filter>
          </defs>
          <circle cx="200" cy="200" r="185" fill={`url(#guavaBg_${uid})`} />
          <g filter={`url(#guavaSh_${uid})`}>
            {/* Wooden Fruit Board */}
            <rect x="60" y="80" width="280" height="240" rx="36" fill="#E8D9CD" stroke="#BBA58F" strokeWidth="4" />
            {/* Whole Green Guava with Stem */}
            <circle cx="150" cy="180" r="62" fill={`url(#guavaSkin_${uid})`} stroke="#3A6313" strokeWidth="2.5" />
            <ellipse cx="130" cy="155" rx="18" ry="32" fill="#FFFFFF" opacity="0.3" transform="rotate(-30 130 155)" />
            {/* Stem & Leaf */}
            <path d="M150 120 Q145 100 155 92" stroke="#523D35" strokeWidth="5" strokeLinecap="round" />
            <path d="M152 105 Q175 100 178 115 Q160 120 152 105 Z" fill="#4B8C30" stroke="#2B5917" strokeWidth="1.5" />
            {/* Sliced Open Pink Guava Half */}
            <circle cx="245" cy="220" r="58" fill={`url(#guavaSkin_${uid})`} stroke="#3A6313" strokeWidth="2.5" />
            <circle cx="245" cy="220" r="46" fill={`url(#guavaPulp_${uid})`} />
            <circle cx="245" cy="220" r="32" fill="#FFBDBD" opacity="0.75" />
            {/* Realistic Guava Seeds */}
            <circle cx="235" cy="210" r="3.2" fill="#FFE7D1" stroke="#BA6A4F" strokeWidth="1" />
            <circle cx="255" cy="208" r="3.2" fill="#FFE7D1" stroke="#BA6A4F" strokeWidth="1" />
            <circle cx="245" cy="225" r="3.2" fill="#FFE7D1" stroke="#BA6A4F" strokeWidth="1" />
            <circle cx="230" cy="226" r="3.2" fill="#FFE7D1" stroke="#BA6A4F" strokeWidth="1" />
            <circle cx="258" cy="228" r="3.2" fill="#FFE7D1" stroke="#BA6A4F" strokeWidth="1" />
            <circle cx="245" cy="240" r="3.2" fill="#FFE7D1" stroke="#BA6A4F" strokeWidth="1" />
          </g>
        </svg>
      );

    // -------------------------------------------------------------
    // MID-MORNING: 6. BANANA & TENDER COCONUT
    // -------------------------------------------------------------
    case '3d-banana-fruit':
    case '3d-tender-coconut':
    case '3d-fresh-fruits':
      return (
        <svg viewBox="0 0 400 400" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} style={style} role="img" aria-label={altText}>
          <defs>
            <radialGradient id={`banBg_${uid}`} cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#FFFDF5" />
              <stop offset="100%" stopColor="#F5ECCF" />
            </radialGradient>
            <linearGradient id={`banGrad_${uid}`} x1="10%" y1="10%" x2="90%" y2="90%">
              <stop offset="0%" stopColor="#FFF176" />
              <stop offset="60%" stopColor="#FDD835" />
              <stop offset="100%" stopColor="#D9A800" />
            </linearGradient>
            <linearGradient id={`cocGrad_${uid}`} x1="15%" y1="15%" x2="85%" y2="85%">
              <stop offset="0%" stopColor="#7CB342" />
              <stop offset="60%" stopColor="#558B2F" />
              <stop offset="100%" stopColor="#33691E" />
            </linearGradient>
            <filter id={`banSh_${uid}`} x="-10%" y="-10%" width="120%" height="130%">
              <feDropShadow dx="0" dy="12" stdDeviation="15" floodColor="#223030" floodOpacity="0.2" />
            </filter>
          </defs>
          <circle cx="200" cy="200" r="185" fill={`url(#banBg_${uid})`} />
          <g filter={`url(#banSh_${uid})`}>
            {/* Green Tender Coconut */}
            <ellipse cx="150" cy="210" rx="60" ry="68" fill={`url(#cocGrad_${uid})`} stroke="#2E5417" strokeWidth="3" />
            {/* Cut Open Coconut Top with Water */}
            <ellipse cx="150" cy="155" rx="34" ry="18" fill="#F0F8FF" stroke="#FFFFFF" strokeWidth="2" />
            <path d="M150 115 L158 165" stroke="#E6C875" strokeWidth="6" strokeLinecap="round" />
            {/* Ripe Yellow Bananas Cluster */}
            <path d="M190 260 Q260 300 320 220 Q250 250 200 230 Z" fill={`url(#banGrad_${uid})`} stroke="#B58900" strokeWidth="2.5" />
            <path d="M180 230 Q250 270 310 190 Q240 220 190 200 Z" fill={`url(#banGrad_${uid})`} stroke="#B58900" strokeWidth="2.5" />
            {/* Stems */}
            <rect x="315" y="185" width="10" height="8" rx="2" fill="#523D35" />
            <rect x="325" y="215" width="10" height="8" rx="2" fill="#523D35" />
          </g>
        </svg>
      );

    // -------------------------------------------------------------
    // MID-MORNING: 7. CRISP RED APPLE
    // -------------------------------------------------------------
    case '3d-apple-fruit':
      return (
        <svg viewBox="0 0 400 400" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} style={style} role="img" aria-label={altText}>
          <defs>
            <radialGradient id={`appBg_${uid}`} cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#FFF9F9" />
              <stop offset="100%" stopColor="#F5DFDF" />
            </radialGradient>
            <radialGradient id={`appleGrad_${uid}`} cx="35%" cy="30%" r="65%">
              <stop offset="0%" stopColor="#FF6B6B" />
              <stop offset="60%" stopColor="#D91E2E" />
              <stop offset="100%" stopColor="#870B17" />
            </radialGradient>
            <filter id={`appSh_${uid}`} x="-10%" y="-10%" width="120%" height="130%">
              <feDropShadow dx="0" dy="12" stdDeviation="15" floodColor="#223030" floodOpacity="0.22" />
            </filter>
          </defs>
          <circle cx="200" cy="200" r="185" fill={`url(#appBg_${uid})`} />
          <g filter={`url(#appSh_${uid})`}>
            {/* Crisp Red Apple Body */}
            <path d="M195 125 C140 120 110 170 110 230 C110 300 160 330 195 325 C230 330 280 300 280 230 C280 170 250 120 195 125 Z" fill={`url(#appleGrad_${uid})`} stroke="#63040E" strokeWidth="3" />
            {/* Glossy Specular Reflection */}
            <ellipse cx="150" cy="180" rx="18" ry="34" fill="#FFFFFF" opacity="0.38" transform="rotate(-25 150 180)" />
            {/* Stem & Green Leaf */}
            <path d="M195 125 Q192 90 210 75" stroke="#523D35" strokeWidth="5.5" strokeLinecap="round" />
            <path d="M200 95 Q235 85 240 108 Q215 118 200 95 Z" fill="#4CAF50" stroke="#256028" strokeWidth="2" />
          </g>
        </svg>
      );

    // -------------------------------------------------------------
    // MID-MORNING: 8. SPICED BUTTERMILK (CHAAS / MOR)
    // -------------------------------------------------------------
    case '3d-buttermilk-chaas':
      return (
        <svg viewBox="0 0 400 400" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} style={style} role="img" aria-label={altText}>
          <defs>
            <radialGradient id={`chaasBg_${uid}`} cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#F5F9F7" />
              <stop offset="100%" stopColor="#DFEBE4" />
            </radialGradient>
            <linearGradient id={`potGrad_${uid}`} x1="15%" y1="15%" x2="85%" y2="85%">
              <stop offset="0%" stopColor="#E29F76" />
              <stop offset="70%" stopColor="#B36539" />
              <stop offset="100%" stopColor="#7F3E1B" />
            </linearGradient>
            <filter id={`chaasSh_${uid}`} x="-10%" y="-10%" width="120%" height="130%">
              <feDropShadow dx="0" dy="12" stdDeviation="15" floodColor="#223030" floodOpacity="0.2" />
            </filter>
          </defs>
          <circle cx="200" cy="200" r="185" fill={`url(#chaasBg_${uid})`} />
          <g filter={`url(#chaasSh_${uid})`}>
            {/* Earthen Terracotta Kulhad / Clay Cup */}
            <path d="M140 120 L160 300 Q200 320 240 300 L260 120 Z" fill={`url(#potGrad_${uid})`} stroke="#5C260D" strokeWidth="4" />
            {/* Creamy Frothy Buttermilk Surface */}
            <ellipse cx="200" cy="120" rx="60" ry="24" fill="#FFFFFF" stroke="#D3DCDB" strokeWidth="2" />
            {/* Roasted Cumin Powder & Fresh Mint Sprig */}
            <circle cx="180" cy="118" r="2" fill="#694829" />
            <circle cx="195" cy="122" r="1.8" fill="#694829" />
            <circle cx="215" cy="116" r="2.2" fill="#694829" />
            <ellipse cx="205" cy="115" rx="14" ry="7" fill="#2E7D32" transform="rotate(-20 205 115)" />
            <ellipse cx="192" cy="110" rx="10" ry="5" fill="#4CAF50" transform="rotate(35 192 110)" />
          </g>
        </svg>
      );

    // -------------------------------------------------------------
    // MID-MORNING: 9. NUTS & DATES (ALMONDS & MEDJOOL DATES)
    // -------------------------------------------------------------
    case '3d-nuts-dates':
      return (
        <svg viewBox="0 0 400 400" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} style={style} role="img" aria-label={altText}>
          <defs>
            <radialGradient id={`nutBg_${uid}`} cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#FFFBF7" />
              <stop offset="100%" stopColor="#EFE1D4" />
            </radialGradient>
            <linearGradient id={`dateGrad_${uid}`} x1="20%" y1="10%" x2="80%" y2="90%">
              <stop offset="0%" stopColor="#693717" />
              <stop offset="60%" stopColor="#4A210A" />
              <stop offset="100%" stopColor="#2E1103" />
            </linearGradient>
            <linearGradient id={`almGrad_${uid}`} x1="15%" y1="15%" x2="85%" y2="85%">
              <stop offset="0%" stopColor="#F5DFBD" />
              <stop offset="70%" stopColor="#DFB683" />
              <stop offset="100%" stopColor="#B37E44" />
            </linearGradient>
            <filter id={`nutSh_${uid}`} x="-10%" y="-10%" width="120%" height="130%">
              <feDropShadow dx="0" dy="12" stdDeviation="15" floodColor="#223030" floodOpacity="0.2" />
            </filter>
          </defs>
          <circle cx="200" cy="200" r="185" fill={`url(#nutBg_${uid})`} />
          <g filter={`url(#nutSh_${uid})`}>
            {/* Wooden Platter */}
            <ellipse cx="200" cy="210" rx="140" ry="90" fill="#E8D9CD" stroke="#BBA58F" strokeWidth="5" />
            {/* Rich Plump Medjool Dates */}
            <ellipse cx="140" cy="190" rx="32" ry="20" fill={`url(#dateGrad_${uid})`} stroke="#240C01" strokeWidth="2" transform="rotate(-25 140 190)" />
            <ellipse cx="170" cy="225" rx="30" ry="19" fill={`url(#dateGrad_${uid})`} stroke="#240C01" strokeWidth="2" transform="rotate(15 170 225)" />
            {/* Soaked Golden Almonds */}
            <ellipse cx="230" cy="180" rx="22" ry="14" fill={`url(#almGrad_${uid})`} stroke="#8A5A27" strokeWidth="1.5" transform="rotate(40 230 180)" />
            <ellipse cx="260" cy="210" rx="22" ry="14" fill={`url(#almGrad_${uid})`} stroke="#8A5A27" strokeWidth="1.5" transform="rotate(-30 260 210)" />
            <ellipse cx="220" cy="235" rx="20" ry="13" fill={`url(#almGrad_${uid})`} stroke="#8A5A27" strokeWidth="1.5" transform="rotate(10 220 235)" />
          </g>
        </svg>
      );

    // -------------------------------------------------------------
    // LUNCH: 10. FULL GRAND MATERNAL THALI
    // -------------------------------------------------------------
    case '3d-full-lunch-thali':
    case '3d-healthy-thali':
      return (
        <svg viewBox="0 0 400 400" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} style={style} role="img" aria-label={altText}>
          <defs>
            <radialGradient id={`thaliBg_${uid}`} cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#FFFDF9" />
              <stop offset="100%" stopColor="#EFE6D8" />
            </radialGradient>
            <linearGradient id={`metalThali_${uid}`} x1="15%" y1="15%" x2="85%" y2="85%">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="40%" stopColor="#EFECE6" />
              <stop offset="100%" stopColor="#C9BEAC" />
            </linearGradient>
            <filter id={`thaliSh_${uid}`} x="-10%" y="-10%" width="120%" height="130%">
              <feDropShadow dx="0" dy="14" stdDeviation="16" floodColor="#223030" floodOpacity="0.22" />
            </filter>
          </defs>
          <circle cx="200" cy="200" r="185" fill={`url(#thaliBg_${uid})`} />
          <g filter={`url(#thaliSh_${uid})`}>
            {/* Grand Rimmed Plate */}
            <circle cx="200" cy="200" r="155" fill={`url(#metalThali_${uid})`} stroke="#BBA58F" strokeWidth="6" />
            {/* Center: Steamed Rice with Ghee & Coriander */}
            <circle cx="200" cy="200" r="48" fill="#FFFBF2" stroke="#D3C7B5" strokeWidth="2" />
            <ellipse cx="200" cy="195" rx="6" ry="10" fill="#2E7D32" transform="rotate(20 200 195)" />
            {/* Katori 1: Golden Turmeric Tadka Dal */}
            <circle cx="130" cy="120" r="34" fill="#FFFFFF" stroke="#BBA58F" strokeWidth="3" />
            <circle cx="130" cy="120" r="28" fill="#F4B41A" />
            <circle cx="125" cy="116" r="2.5" fill="#A83918" />
            {/* Katori 2: Iron-Rich Palak Saag */}
            <circle cx="270" cy="120" r="34" fill="#FFFFFF" stroke="#BBA58F" strokeWidth="3" />
            <circle cx="270" cy="120" r="28" fill="#2E7D32" />
            <circle cx="266" cy="116" r="4" fill="#FFFFFF" opacity="0.8" />
            {/* Katori 3: Fresh Calcium Raita / Curd */}
            <circle cx="270" cy="270" r="34" fill="#FFFFFF" stroke="#BBA58F" strokeWidth="3" />
            <circle cx="270" cy="270" r="28" fill="#F8FAFA" />
            <circle cx="265" cy="265" r="2.5" fill="#B36539" />
            {/* Phulka Rotis Stacked (Bottom Left) */}
            <circle cx="130" cy="270" r="40" fill="#E8C99B" stroke="#8C5C26" strokeWidth="1.5" />
            <circle cx="125" cy="265" r="3.5" fill="#693708" opacity="0.6" />
            <circle cx="140" cy="275" r="4" fill="#693708" opacity="0.5" />
          </g>
        </svg>
      );

    // -------------------------------------------------------------
    // LUNCH: 11. RAGI MUDDE WITH GREENS SAARU
    // -------------------------------------------------------------
    case '3d-ragi-mudde':
      return (
        <svg viewBox="0 0 400 400" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} style={style} role="img" aria-label={altText}>
          <defs>
            <radialGradient id={`muddeBg_${uid}`} cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#FFFBF7" />
              <stop offset="100%" stopColor="#EADECF" />
            </radialGradient>
            <radialGradient id={`ragiBall_${uid}`} cx="35%" cy="30%" r="65%">
              <stop offset="0%" stopColor="#664638" />
              <stop offset="60%" stopColor="#4A2E22" />
              <stop offset="100%" stopColor="#2E170F" />
            </radialGradient>
            <filter id={`muddeSh_${uid}`} x="-10%" y="-10%" width="120%" height="130%">
              <feDropShadow dx="0" dy="12" stdDeviation="15" floodColor="#223030" floodOpacity="0.22" />
            </filter>
          </defs>
          <circle cx="200" cy="200" r="185" fill={`url(#muddeBg_${uid})`} />
          <g filter={`url(#muddeSh_${uid})`}>
            {/* Ceramic Plate */}
            <ellipse cx="200" cy="210" rx="145" ry="105" fill="#F2EBE1" stroke="#BBA58F" strokeWidth="5" />
            {/* The Smooth Volumetric Ragi Mudde Ball */}
            <ellipse cx="170" cy="200" rx="65" ry="58" fill={`url(#ragiBall_${uid})`} stroke="#210F09" strokeWidth="2" />
            <ellipse cx="150" cy="175" rx="20" ry="12" fill="#8C6656" opacity="0.5" transform="rotate(-20 150 175)" />
            {/* Bowl of Spiced Bassaru / Greens Sambar */}
            <circle cx="265" cy="180" r="42" fill="#FFFFFF" stroke="#BBA58F" strokeWidth="4" />
            <circle cx="265" cy="180" r="35" fill="#BF571B" />
            <circle cx="260" cy="175" r="5" fill="#2E7D32" />
            <circle cx="272" cy="184" r="4" fill="#2E7D32" />
          </g>
        </svg>
      );

    // -------------------------------------------------------------
    // LUNCH: 12. DAL RICE & CURD RICE
    // -------------------------------------------------------------
    case '3d-dal-rice':
    case '3d-curd-rice':
    case '3d-millet-pulao':
    case '3d-paneer-curry':
      return (
        <svg viewBox="0 0 400 400" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} style={style} role="img" aria-label={altText}>
          <defs>
            <radialGradient id={`dalBg_${uid}`} cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#FFFDF7" />
              <stop offset="100%" stopColor="#EFE7DA" />
            </radialGradient>
            <linearGradient id={`dalTadka_${uid}`} x1="15%" y1="15%" x2="85%" y2="85%">
              <stop offset="0%" stopColor="#FFA726" />
              <stop offset="100%" stopColor="#E65100" />
            </linearGradient>
            <filter id={`dalSh_${uid}`} x="-10%" y="-10%" width="120%" height="130%">
              <feDropShadow dx="0" dy="12" stdDeviation="15" floodColor="#223030" floodOpacity="0.2" />
            </filter>
          </defs>
          <circle cx="200" cy="200" r="185" fill={`url(#dalBg_${uid})`} />
          <g filter={`url(#dalSh_${uid})`}>
            {/* Earthen Bowl */}
            <ellipse cx="200" cy="210" rx="145" ry="105" fill="#E8D9CD" stroke="#523D35" strokeWidth="5" />
            {/* Steamed White Rice Base */}
            <ellipse cx="200" cy="200" rx="125" ry="85" fill="#FFFFFF" stroke="#D9D0C3" strokeWidth="2" />
            {/* Golden Rich Dal Tadka Lava on Top */}
            <ellipse cx="200" cy="190" rx="80" ry="50" fill={`url(#dalTadka_${uid})`} />
            {/* Cumin Seeds & Coriander Garnish */}
            <circle cx="185" cy="185" r="2.5" fill="#42250E" />
            <circle cx="210" cy="192" r="2" fill="#42250E" />
            <ellipse cx="200" cy="180" rx="14" ry="7" fill="#2E7D32" />
          </g>
        </svg>
      );

    // -------------------------------------------------------------
    // EVENING SNACK: 13. CHICKPEA SUNDAL
    // -------------------------------------------------------------
    case '3d-sundal':
    case '3d-roasted-chana':
    case '3d-evening-snack':
      return (
        <svg viewBox="0 0 400 400" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} style={style} role="img" aria-label={altText}>
          <defs>
            <radialGradient id={`sunBg_${uid}`} cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#FFFBF7" />
              <stop offset="100%" stopColor="#EFE3D5" />
            </radialGradient>
            <radialGradient id={`chanaBall_${uid}`} cx="35%" cy="30%" r="65%">
              <stop offset="0%" stopColor="#8D5531" />
              <stop offset="70%" stopColor="#5D3014" />
              <stop offset="100%" stopColor="#381907" />
            </radialGradient>
            <filter id={`sunSh_${uid}`} x="-10%" y="-10%" width="120%" height="130%">
              <feDropShadow dx="0" dy="12" stdDeviation="15" floodColor="#223030" floodOpacity="0.2" />
            </filter>
          </defs>
          <circle cx="200" cy="200" r="185" fill={`url(#sunBg_${uid})`} />
          <g filter={`url(#sunSh_${uid})`}>
            {/* Ceramic Snack Platter */}
            <circle cx="200" cy="200" r="145" fill="#FFFFFF" stroke="#BBA58F" strokeWidth="6" />
            {/* Tempered Kala Chana / Sundal Pieces */}
            <circle cx="180" cy="180" r="22" fill={`url(#chanaBall_${uid})`} />
            <circle cx="220" cy="175" r="20" fill={`url(#chanaBall_${uid})`} />
            <circle cx="155" cy="215" r="21" fill={`url(#chanaBall_${uid})`} />
            <circle cx="195" cy="225" r="23" fill={`url(#chanaBall_${uid})`} />
            <circle cx="235" cy="215" r="21" fill={`url(#chanaBall_${uid})`} />
            <circle cx="175" cy="255" r="19" fill={`url(#chanaBall_${uid})`} />
            <circle cx="215" cy="258" r="20" fill={`url(#chanaBall_${uid})`} />
            {/* Fresh Grated White Coconut Shavings */}
            <path d="M170 168 L184 172" stroke="#FFFFFF" strokeWidth="4" strokeLinecap="round" />
            <path d="M210 185 L225 188" stroke="#FFFFFF" strokeWidth="4" strokeLinecap="round" />
            <path d="M190 220 L204 223" stroke="#FFFFFF" strokeWidth="4" strokeLinecap="round" />
            <path d="M150 215 L162 220" stroke="#FFFFFF" strokeWidth="4" strokeLinecap="round" />
            {/* Curry Leaf Sprig */}
            <ellipse cx="200" cy="200" rx="16" ry="8" fill="#2E7D32" transform="rotate(-30 200 200)" />
          </g>
        </svg>
      );

    // -------------------------------------------------------------
    // EVENING SNACK: 14. ROASTED MAKHANA (FOX NUTS)
    // -------------------------------------------------------------
    case '3d-makhana-foxnuts':
    case '3d-sprouts-salad':
    case '3d-herbal-soup':
      return (
        <svg viewBox="0 0 400 400" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} style={style} role="img" aria-label={altText}>
          <defs>
            <radialGradient id={`makBg_${uid}`} cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#FFFDF7" />
              <stop offset="100%" stopColor="#EFE7DA" />
            </radialGradient>
            <radialGradient id={`makBall_${uid}`} cx="35%" cy="30%" r="65%">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="70%" stopColor="#F5E8C9" />
              <stop offset="100%" stopColor="#D9BA77" />
            </radialGradient>
            <filter id={`makSh_${uid}`} x="-10%" y="-10%" width="120%" height="130%">
              <feDropShadow dx="0" dy="12" stdDeviation="15" floodColor="#223030" floodOpacity="0.2" />
            </filter>
          </defs>
          <circle cx="200" cy="200" r="185" fill={`url(#makBg_${uid})`} />
          <g filter={`url(#makSh_${uid})`}>
            {/* Teal Accent Bowl */}
            <ellipse cx="200" cy="210" rx="145" ry="105" fill="#223030" stroke="#523D35" strokeWidth="5" />
            <ellipse cx="200" cy="200" rx="135" ry="92" fill="#EFEFE9" />
            {/* Puffed Fox Nuts (Makhana) */}
            <circle cx="160" cy="180" r="24" fill={`url(#makBall_${uid})`} />
            <circle cx="205" cy="170" r="26" fill={`url(#makBall_${uid})`} />
            <circle cx="245" cy="185" r="23" fill={`url(#makBall_${uid})`} />
            <circle cx="175" cy="225" r="25" fill={`url(#makBall_${uid})`} />
            <circle cx="220" cy="220" r="27" fill={`url(#makBall_${uid})`} />
            {/* Turmeric Gold Dusting Specks */}
            <circle cx="155" cy="175" r="2" fill="#C98F1E" />
            <circle cx="208" cy="168" r="2.5" fill="#C98F1E" />
            <circle cx="222" cy="218" r="2" fill="#C98F1E" />
          </g>
        </svg>
      );

    // -------------------------------------------------------------
    // DINNER: 15. WHOLE WHEAT CHAPATIS & CURRY
    // -------------------------------------------------------------
    case '3d-chapati-curry':
    case '3d-phulka-rotis':
    case '3d-dinner-dish':
    case '3d-paneer-sabzi':
    case '3d-millet-khichdi':
      return (
        <svg viewBox="0 0 400 400" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} style={style} role="img" aria-label={altText}>
          <defs>
            <radialGradient id={`dinBg_${uid}`} cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#FFFDF7" />
              <stop offset="100%" stopColor="#ECE3D5" />
            </radialGradient>
            <radialGradient id={`rotiGrad_${uid}`} cx="40%" cy="40%" r="60%">
              <stop offset="0%" stopColor="#F5DFBD" />
              <stop offset="70%" stopColor="#D9AC70" />
              <stop offset="100%" stopColor="#AB7839" />
            </radialGradient>
            <linearGradient id={`sabziGrad_${uid}`} x1="15%" y1="15%" x2="85%" y2="85%">
              <stop offset="0%" stopColor="#E6672E" />
              <stop offset="100%" stopColor="#9C3408" />
            </linearGradient>
            <filter id={`dinSh_${uid}`} x="-10%" y="-10%" width="120%" height="130%">
              <feDropShadow dx="0" dy="12" stdDeviation="15" floodColor="#223030" floodOpacity="0.22" />
            </filter>
          </defs>
          <circle cx="200" cy="200" r="185" fill={`url(#dinBg_${uid})`} />
          <g filter={`url(#dinSh_${uid})`}>
            {/* Ceramic Dinner Plate */}
            <circle cx="200" cy="200" r="148" fill="#FFFFFF" stroke="#BBA58F" strokeWidth="5" />
            {/* Stack of Puffed Whole Wheat Phulkas / Chapatis */}
            <circle cx="150" cy="180" r="48" fill={`url(#rotiGrad_${uid})`} stroke="#8A5A27" strokeWidth="1.5" />
            <circle cx="165" cy="225" r="48" fill={`url(#rotiGrad_${uid})`} stroke="#8A5A27" strokeWidth="1.5" />
            {/* Roasted Brown Spots */}
            <circle cx="155" cy="215" r="4.5" fill="#693708" opacity="0.65" />
            <circle cx="180" cy="235" r="5" fill="#693708" opacity="0.55" />
            <circle cx="140" cy="175" r="4.5" fill="#693708" opacity="0.65" />
            {/* Katori: Mixed Vegetable Subzi (Beans, Peas, Carrots) */}
            <circle cx="260" cy="170" r="40" fill="#FFFFFF" stroke="#BBA58F" strokeWidth="3.5" />
            <circle cx="260" cy="170" r="33" fill={`url(#sabziGrad_${uid})`} />
            <circle cx="254" cy="165" r="4.5" fill="#4CAF50" />
            <circle cx="268" cy="172" r="4.5" fill="#4CAF50" />
            <rect x="258" y="156" width="7" height="7" rx="2" fill="#FF7043" />
            {/* Katori 2: Light Digestive Dal */}
            <circle cx="255" cy="255" r="34" fill="#FFFFFF" stroke="#BBA58F" strokeWidth="3" />
            <circle cx="255" cy="255" r="28" fill="#F4B41A" />
            <circle cx="252" cy="250" r="2.5" fill="#693708" />
          </g>
        </svg>
      );

    // -------------------------------------------------------------
    // BEDTIME: 16. WARM GOLDEN TURMERIC MILK
    // -------------------------------------------------------------
    case '3d-turmeric-golden-milk':
    case '3d-almond-milk':
    case '3d-bedtime-milk':
      return (
        <svg viewBox="0 0 400 400" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} style={style} role="img" aria-label={altText}>
          <defs>
            <radialGradient id={`milkBg_${uid}`} cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#FFFDF5" />
              <stop offset="100%" stopColor="#F5EDCE" />
            </radialGradient>
            <linearGradient id={`goldMilk_${uid}`} x1="15%" y1="15%" x2="85%" y2="85%">
              <stop offset="0%" stopColor="#FFF59D" />
              <stop offset="60%" stopColor="#FBC02D" />
              <stop offset="100%" stopColor="#F57F17" />
            </linearGradient>
            <linearGradient id={`kulhad_${uid}`} x1="15%" y1="15%" x2="85%" y2="85%">
              <stop offset="0%" stopColor="#D7CCC8" />
              <stop offset="100%" stopColor="#8D6E63" />
            </linearGradient>
            <filter id={`milkSh_${uid}`} x="-10%" y="-10%" width="120%" height="130%">
              <feDropShadow dx="0" dy="12" stdDeviation="15" floodColor="#223030" floodOpacity="0.2" />
            </filter>
          </defs>
          <circle cx="200" cy="200" r="185" fill={`url(#milkBg_${uid})`} />
          <g filter={`url(#milkSh_${uid})`}>
            {/* Earthen Ceramic Cup */}
            <path d="M140 140 L160 300 Q200 320 240 300 L260 140 Z" fill={`url(#kulhad_${uid})`} stroke="#5D4037" strokeWidth="4" />
            {/* Glowing Golden Turmeric Milk Surface */}
            <ellipse cx="200" cy="140" rx="60" ry="24" fill={`url(#goldMilk_${uid})`} stroke="#FFF9C4" strokeWidth="2" />
            {/* Crushed Saffron Strands & Almond Slivers */}
            <path d="M185 136 Q195 133 190 142" stroke="#D32F2F" strokeWidth="2.5" strokeLinecap="round" />
            <path d="M205 138 Q215 135 212 144" stroke="#D32F2F" strokeWidth="2.5" strokeLinecap="round" />
            <ellipse cx="198" cy="136" rx="6" ry="3.5" fill="#FFE0B2" transform="rotate(-15 198 136)" />
            {/* Warm Steam Trails */}
            <path d="M185 105 Q178 90 185 75" stroke="#BBA58F" strokeWidth="3" strokeLinecap="round" opacity="0.6" />
            <path d="M215 100 Q222 85 215 70" stroke="#BBA58F" strokeWidth="3" strokeLinecap="round" opacity="0.6" />
          </g>
        </svg>
      );

    // -------------------------------------------------------------
    // NEUTRAL MATERNAL FOOD PLACEHOLDER (Guaranteed Reliable Fallback)
    // -------------------------------------------------------------
    case '3d-neutral-maternal-food':
    default:
      return (
        <svg viewBox="0 0 400 400" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} style={style} role="img" aria-label={altText}>
          <defs>
            <radialGradient id={`neutBg_${uid}`} cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#FAF7F2" />
              <stop offset="100%" stopColor="#E8D9CD" />
            </radialGradient>
            <linearGradient id={`domeGrad_${uid}`} x1="15%" y1="15%" x2="85%" y2="85%">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="50%" stopColor="#EFEFE9" />
              <stop offset="100%" stopColor="#CFC5B3" />
            </linearGradient>
            <filter id={`neutSh_${uid}`} x="-10%" y="-10%" width="120%" height="130%">
              <feDropShadow dx="0" dy="12" stdDeviation="15" floodColor="#223030" floodOpacity="0.2" />
            </filter>
          </defs>
          <circle cx="200" cy="200" r="185" fill={`url(#neutBg_${uid})`} />
          <g filter={`url(#neutSh_${uid})`}>
            {/* Base Platter */}
            <ellipse cx="200" cy="260" rx="145" ry="40" fill="#E8D9CD" stroke="#BBA58F" strokeWidth="5" />
            {/* Maternal Nutrition Cloche Dome */}
            <path d="M90 250 C90 150 140 120 200 120 C260 120 310 150 310 250 Z" fill={`url(#domeGrad_${uid})`} stroke="#BBA58F" strokeWidth="4" />
            {/* Warm Handle with Heart Icon */}
            <circle cx="200" cy="110" r="18" fill="#523D35" stroke="#BBA58F" strokeWidth="3" />
            <path d="M200 115 C196 110 192 107 192 103 C192 99 195 97 198 97 C200 97 200 98 200 98.5 C200 98 200 97 202 97 C205 97 208 99 208 103 C208 107 204 110 200 115 Z" fill="#D97768" />
            {/* Nutrition Sparkles */}
            <circle cx="150" cy="190" r="4" fill="#BBA58F" />
            <circle cx="250" cy="190" r="4" fill="#BBA58F" />
            <circle cx="200" cy="170" r="5" fill="#4CAF50" />
          </g>
        </svg>
      );
  }
};
