import React from 'react';

export type MaternalArtType =
  | 'pregnant-mother'
  | 'mother-and-baby'
  | 'healthy-thali'
  | 'fresh-fruits'
  | 'breakfast-dish'
  | 'evening-snack'
  | 'dinner-dish'
  | 'bedtime-milk'
  | 'hydration-glass'
  | 'wellness-sparkle';

interface Maternal3DArtProps {
  type: MaternalArtType;
  className?: string;
  size?: number | string;
  alt?: string;
}

/**
 * Maternal3DArt - Premium modern 3D claymorphism & volumetric maternal healthcare illustrations.
 * Crafted with soft gradients, rounded depths, ambient occlusion, and warm maternal healthcare colors.
 */
export const Maternal3DArt: React.FC<Maternal3DArtProps> = ({
  type,
  className = 'w-full h-auto',
  size,
  alt = 'PregNutri AI 3D Maternal Healthcare Illustration'
}) => {
  const style = size ? { width: size, height: size } : undefined;

  switch (type) {
    // -------------------------------------------------------------
    // 1. PREGNANT MOTHER GENTLY HOLDING HER BELLY
    // -------------------------------------------------------------
    case 'pregnant-mother':
      return (
        <svg
          viewBox="0 0 400 400"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={className}
          style={style}
          aria-label={alt}
          role="img"
        >
          <defs>
            {/* Ambient background glow */}
            <radialGradient id="bgGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#F5ECE5" stopOpacity="0.9" />
              <stop offset="60%" stopColor="#E8D9CD" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#EFEFE9" stopOpacity="0" />
            </radialGradient>

            {/* Mother skin 3D lighting */}
            <linearGradient id="skinGrad" x1="30%" y1="20%" x2="70%" y2="80%">
              <stop offset="0%" stopColor="#F7D0BA" />
              <stop offset="50%" stopColor="#E5B299" />
              <stop offset="100%" stopColor="#C98F73" />
            </linearGradient>

            {/* Maternal gown: soft teal / sage */}
            <linearGradient id="gownGrad" x1="20%" y1="20%" x2="80%" y2="90%">
              <stop offset="0%" stopColor="#4A7C75" />
              <stop offset="50%" stopColor="#2D5A54" />
              <stop offset="100%" stopColor="#1B3E39" />
            </linearGradient>

            {/* Belly highlight: smooth rounded volume */}
            <radialGradient id="bellyHighlight" cx="45%" cy="35%" r="55%">
              <stop offset="0%" stopColor="#6CA59C" stopOpacity="0.9" />
              <stop offset="60%" stopColor="#3E7069" stopOpacity="0.95" />
              <stop offset="100%" stopColor="#234E48" />
            </radialGradient>

            {/* Hair: dark glossy chestnut with highlights */}
            <linearGradient id="hairGrad" x1="20%" y1="10%" x2="80%" y2="90%">
              <stop offset="0%" stopColor="#4A342B" />
              <stop offset="60%" stopColor="#2E1F1A" />
              <stop offset="100%" stopColor="#1A110D" />
            </linearGradient>

            {/* Soft shadow filter */}
            <filter id="soft3DShadow" x="-10%" y="-10%" width="120%" height="130%">
              <feDropShadow dx="0" dy="12" stdDeviation="16" floodColor="#223030" floodOpacity="0.18" />
            </filter>

            {/* Gentle inner glow for bump */}
            <filter id="glow3D">
              <feGaussianBlur stdDeviation="3" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Background Aura */}
          <circle cx="200" cy="200" r="180" fill="url(#bgGlow)" />

          {/* Floating Wellness Orbs (Iron, Folate, Love) */}
          <g filter="url(#soft3DShadow)">
            {/* Heart orb */}
            <circle cx="70" cy="110" r="22" fill="#E8D9CD" stroke="#BBA58F" strokeWidth="2" />
            <path
              d="M70 120 C64 113 58 108 58 103 C58 98 62 95 66 95 C68.5 95 70 96.5 70 97.5 C70 96.5 71.5 95 74 95 C78 95 82 98 82 103 C82 108 76 113 70 120 Z"
              fill="#D97768"
            />

            {/* Nutrition leaf orb */}
            <circle cx="330" cy="130" r="24" fill="#E8D9CD" stroke="#BBA58F" strokeWidth="2" />
            <path
              d="M320 136 C320 123 330 118 340 120 C340 133 330 138 320 136 Z"
              fill="#4A7C75"
            />
            <path d="M323 134 Q330 128 337 122" stroke="#E8D9CD" strokeWidth="1.5" strokeLinecap="round" />

            {/* Baby footprint / star orb */}
            <circle cx="95" cy="290" r="20" fill="#EFEFE9" stroke="#BBA58F" strokeWidth="2" />
            <circle cx="95" cy="290" r="8" fill="#F4A261" />
            <circle cx="89" cy="281" r="3" fill="#F4A261" />
            <circle cx="95" cy="278" r="3.2" fill="#F4A261" />
            <circle cx="101" cy="281" r="3" fill="#F4A261" />
          </g>

          {/* Main 3D Mother Figure */}
          <g filter="url(#soft3DShadow)">
            {/* Flowing Back Hair */}
            <path
              d="M175 90 C150 95 125 130 125 185 C125 240 145 285 160 300 C155 260 148 200 160 150 C165 130 170 110 175 90 Z"
              fill="url(#hairGrad)"
            />

            {/* Body / Gown Base */}
            <path
              d="M170 170 Q160 220 150 340 L280 340 Q255 240 240 170 Z"
              fill="url(#gownGrad)"
            />

            {/* The 3D Pregnant Bump - Beautiful Volumetric Curves */}
            <ellipse
              cx="225"
              cy="255"
              rx="64"
              ry="60"
              fill="url(#bellyHighlight)"
              transform="rotate(-5 225 255)"
            />

            {/* Soft Gown Fold Shadows across bump */}
            <path
              d="M178 225 Q210 245 255 240"
              stroke="#1B3E39"
              strokeWidth="4"
              strokeLinecap="round"
              opacity="0.4"
            />
            <path
              d="M182 265 Q225 288 270 270"
              stroke="#1B3E39"
              strokeWidth="4"
              strokeLinecap="round"
              opacity="0.4"
            />

            {/* Neck */}
            <path
              d="M190 135 L190 165 C190 170 205 170 205 165 L205 135 Z"
              fill="url(#skinGrad)"
            />

            {/* Head & Peaceful Face Profile */}
            <path
              d="M185 85 C185 65 205 55 225 65 C240 73 248 90 245 110 C242 125 232 140 215 142 C195 144 185 125 185 85 Z"
              fill="url(#skinGrad)"
            />

            {/* Gentle Smile & Closed Peaceful Eye */}
            <path
              d="M228 102 Q234 104 238 98"
              stroke="#523D35"
              strokeWidth="2.5"
              strokeLinecap="round"
              fill="none"
            />
            <path
              d="M232 118 Q238 124 242 118"
              stroke="#C98F73"
              strokeWidth="2.5"
              strokeLinecap="round"
              fill="none"
            />
            {/* Gentle Blush */}
            <ellipse cx="230" cy="112" rx="7" ry="5" fill="#E88B88" opacity="0.45" />

            {/* Front Styled Hair Bun & Tendrils */}
            <path
              d="M180 85 C180 60 210 45 230 52 C245 58 250 72 248 85 C235 78 215 80 200 95 C190 105 185 120 182 135 C180 120 180 95 180 85 Z"
              fill="url(#hairGrad)"
            />
            {/* Elegant Hair Bun */}
            <circle cx="178" cy="70" r="22" fill="url(#hairGrad)" />
            {/* Warm Gold Hair Accessory Pin */}
            <circle cx="188" cy="62" r="5" fill="#E8D9CD" stroke="#BBA58F" strokeWidth="2" />

            {/* Both Hands Gently Cradling the Baby Bump */}
            {/* Upper Arm & Hand supporting top of bump */}
            <path
              d="M198 175 Q180 205 190 235 Q198 240 220 232 Q235 225 240 215 Q230 205 212 210"
              fill="url(#skinGrad)"
            />
            {/* Lower Arm & Hand tenderly supporting base of bump */}
            <path
              d="M195 185 Q170 230 185 275 Q205 295 245 290 Q258 285 260 275 Q240 270 220 278 Q195 275 195 250"
              fill="url(#skinGrad)"
            />
            {/* Delicate Hand details */}
            <ellipse cx="232" cy="222" rx="9" ry="6" fill="url(#skinGrad)" transform="rotate(-15 232 222)" />
            <ellipse cx="242" cy="280" rx="10" ry="7" fill="url(#skinGrad)" transform="rotate(10 242 280)" />

            {/* Gentle Warm Heart Glow on the Bump */}
            <path
              d="M225 262 C220 256 215 251 215 246 C215 242 218 239 222 239 C224 239 225 240.5 225 241.5 C225 240.5 226 239 228 239 C232 239 235 242 235 246 C235 251 230 256 225 262 Z"
              fill="#FFFFFF"
              opacity="0.75"
              filter="url(#glow3D)"
            />
          </g>

          {/* Maternal Sparkles */}
          <path
            d="M295 180 L298 188 L306 191 L298 194 L295 202 L292 194 L284 191 L292 188 Z"
            fill="#BBA58F"
            opacity="0.85"
          />
          <path
            d="M135 150 L137 155 L142 157 L137 159 L135 164 L133 159 L128 157 L133 155 Z"
            fill="#BBA58F"
            opacity="0.7"
          />
        </svg>
      );

    // -------------------------------------------------------------
    // 2. MOTHER AND NEWBORN BABY BONDING
    // -------------------------------------------------------------
    case 'mother-and-baby':
      return (
        <svg
          viewBox="0 0 400 400"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={className}
          style={style}
          aria-label={alt}
          role="img"
        >
          <defs>
            <radialGradient id="mbGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#FFF2E8" stopOpacity="0.95" />
              <stop offset="70%" stopColor="#E8D9CD" stopOpacity="0.35" />
              <stop offset="100%" stopColor="#EFEFE9" stopOpacity="0" />
            </radialGradient>
            <linearGradient id="mbSkin" x1="20%" y1="20%" x2="80%" y2="80%">
              <stop offset="0%" stopColor="#F9D4BE" />
              <stop offset="70%" stopColor="#E2AD94" />
              <stop offset="100%" stopColor="#C4886D" />
            </linearGradient>
            <linearGradient id="swaddleGrad" x1="10%" y1="10%" x2="90%" y2="90%">
              <stop offset="0%" stopColor="#FFF9F5" />
              <stop offset="50%" stopColor="#F0DCD0" />
              <stop offset="100%" stopColor="#DEC2B3" />
            </linearGradient>
            <linearGradient id="mbDress" x1="20%" y1="20%" x2="80%" y2="90%">
              <stop offset="0%" stopColor="#537A74" />
              <stop offset="100%" stopColor="#254843" />
            </linearGradient>
            <filter id="mbDrop" x="-10%" y="-10%" width="120%" height="130%">
              <feDropShadow dx="0" dy="10" stdDeviation="14" floodColor="#223030" floodOpacity="0.16" />
            </filter>
          </defs>

          {/* Background aura */}
          <circle cx="200" cy="200" r="180" fill="url(#mbGlow)" />

          {/* Mother and Baby Group */}
          <g filter="url(#mbDrop)">
            {/* Mother Dress Body */}
            <path
              d="M140 330 C140 240 160 200 210 200 C260 200 280 240 280 330 Z"
              fill="url(#mbDress)"
            />

            {/* Mother Hair Back */}
            <circle cx="205" cy="115" r="50" fill="#2E1F1A" />
            <path
              d="M160 120 C155 170 145 220 170 245 C165 210 165 170 170 130 Z"
              fill="#2E1F1A"
            />

            {/* Mother Head & Peaceful Face looking down lovingly at baby */}
            <path
              d="M185 105 C185 85 200 70 220 75 C235 80 245 95 240 115 C235 130 220 140 200 138 C185 135 185 120 185 105 Z"
              fill="url(#mbSkin)"
            />
            {/* Closed tender eye & smile */}
            <path d="M208 112 Q214 116 218 112" stroke="#523D35" strokeWidth="2.5" strokeLinecap="round" fill="none" />
            <path d="M206 126 Q212 130 216 125" stroke="#C98F73" strokeWidth="2" strokeLinecap="round" fill="none" />
            <ellipse cx="218" cy="120" rx="5" ry="3.5" fill="#E88B88" opacity="0.45" />

            {/* Mother Hair Front Style */}
            <path
              d="M180 100 C185 75 210 65 235 75 C240 85 235 95 225 90 C210 85 195 90 190 105 Z"
              fill="#3A2821"
            />

            {/* Cradling Arms */}
            <path
              d="M170 210 Q160 255 190 270 Q240 290 265 250 Q280 220 260 205 Q245 220 235 240"
              fill="url(#mbSkin)"
            />

            {/* Swaddled Baby in Mother's Embrace */}
            <ellipse cx="225" cy="240" rx="36" ry="46" fill="url(#swaddleGrad)" transform="rotate(-30 225 240)" />
            {/* Swaddle Ribbon / Fold */}
            <path
              d="M200 230 Q225 245 250 235"
              stroke="#D4B09B"
              strokeWidth="3.5"
              strokeLinecap="round"
            />

            {/* Baby Head */}
            <circle cx="215" cy="205" r="22" fill="url(#mbSkin)" />
            {/* Baby Sleeping Face */}
            <path d="M210 205 Q214 208 218 205" stroke="#7A5645" strokeWidth="2" strokeLinecap="round" fill="none" />
            <circle cx="223" cy="210" r="3" fill="#E88B88" opacity="0.5" />
            {/* Baby Bonnet / Cap */}
            <path
              d="M200 195 C200 180 225 180 232 192 C220 188 208 190 200 195 Z"
              fill="#E8D9CD"
            />

            {/* Mother's Hand protecting baby's head & back */}
            <ellipse cx="242" cy="215" rx="10" ry="7" fill="url(#mbSkin)" transform="rotate(25 242 215)" />
            <ellipse cx="198" cy="265" rx="11" ry="8" fill="url(#mbSkin)" transform="rotate(-15 198 265)" />
          </g>

          {/* Floating warm golden wellness sparkles */}
          <path d="M120 160 L122 165 L127 167 L122 169 L120 174 L118 169 L113 167 L118 165 Z" fill="#F4A261" />
          <path d="M290 140 L292 145 L297 147 L292 149 L290 154 L288 149 L283 147 L288 145 Z" fill="#F4A261" />
        </svg>
      );

    // -------------------------------------------------------------
    // 3. HEALTHY BALANCED INDIAN THALI (Lunch & Whole Grains)
    // -------------------------------------------------------------
    case 'healthy-thali':
      return (
        <svg
          viewBox="0 0 400 400"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={className}
          style={style}
          aria-label={alt}
          role="img"
        >
          <defs>
            <filter id="thaliShadow" x="-10%" y="-10%" width="120%" height="130%">
              <feDropShadow dx="0" dy="12" stdDeviation="16" floodColor="#223030" floodOpacity="0.2" />
            </filter>
            <linearGradient id="plateGrad" x1="20%" y1="10%" x2="80%" y2="90%">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="50%" stopColor="#EFEFE9" />
              <stop offset="100%" stopColor="#D8CFBF" />
            </linearGradient>
            <linearGradient id="dalGrad" x1="20%" y1="20%" x2="80%" y2="80%">
              <stop offset="0%" stopColor="#F5BE47" />
              <stop offset="100%" stopColor="#D98A16" />
            </linearGradient>
            <linearGradient id="palakGrad" x1="20%" y1="20%" x2="80%" y2="80%">
              <stop offset="0%" stopColor="#52945D" />
              <stop offset="100%" stopColor="#2D6636" />
            </linearGradient>
            <linearGradient id="rotiGrad" x1="30%" y1="20%" x2="70%" y2="80%">
              <stop offset="0%" stopColor="#E5C79E" />
              <stop offset="60%" stopColor="#C99F6C" />
              <stop offset="100%" stopColor="#A67B48" />
            </linearGradient>
            <linearGradient id="riceGrad" x1="20%" y1="20%" x2="80%" y2="80%">
              <stop offset="0%" stopColor="#FFFFFC" />
              <stop offset="100%" stopColor="#E5DEC9" />
            </linearGradient>
          </defs>

          {/* Large Traditional Indian Thali Platter */}
          <g filter="url(#thaliShadow)">
            <circle cx="200" cy="200" r="160" fill="url(#plateGrad)" stroke="#BBA58F" strokeWidth="6" />
            <circle cx="200" cy="200" r="148" fill="none" stroke="#CFC5B3" strokeWidth="2" strokeDasharray="6 4" />

            {/* Steamed Brown / Red Rice with fresh coriander leaf (Center) */}
            <circle cx="200" cy="200" r="50" fill="url(#riceGrad)" stroke="#CFC5B3" strokeWidth="2" />
            <path
              d="M196 195 Q200 188 204 195 Q200 202 196 195 Z"
              fill="#2D6636"
            />

            {/* Katori 1: Golden Turmeric Tadka Dal (Top Left) */}
            <circle cx="130" cy="120" r="36" fill="#F8F3E9" stroke="#BBA58F" strokeWidth="3" />
            <circle cx="130" cy="120" r="31" fill="url(#dalGrad)" />
            <circle cx="126" cy="116" r="3" fill="#8B2612" />
            <circle cx="135" cy="122" r="2.5" fill="#8B2612" />

            {/* Katori 2: Vibrant Green Iron-Rich Palak Saag (Top Right) */}
            <circle cx="270" cy="120" r="36" fill="#F8F3E9" stroke="#BBA58F" strokeWidth="3" />
            <circle cx="270" cy="120" r="31" fill="url(#palakGrad)" />
            <circle cx="266" cy="116" r="5" fill="#FFFFFD" opacity="0.8" />

            {/* Whole Wheat Phulka Rotis / Chapatis (Bottom Left) */}
            <g transform="rotate(-10 130 270)">
              <circle cx="130" cy="270" r="42" fill="url(#rotiGrad)" stroke="#8C6134" strokeWidth="1.5" />
              <circle cx="120" cy="265" r="4" fill="#6E441D" opacity="0.6" />
              <circle cx="140" cy="275" r="5" fill="#6E441D" opacity="0.5" />
              <circle cx="132" cy="255" r="3" fill="#6E441D" opacity="0.5" />
            </g>

            {/* Katori 3: Fresh Calcium Raita / Curd with Cumin (Bottom Right) */}
            <circle cx="270" cy="270" r="36" fill="#F8F3E9" stroke="#BBA58F" strokeWidth="3" />
            <circle cx="270" cy="270" r="31" fill="#FFFFFF" />
            <path d="M262 268 L278 272" stroke="#B48247" strokeWidth="1.5" strokeLinecap="round" />
            <circle cx="267" cy="264" r="2" fill="#52945D" />

            {/* Fresh Vitamin Salad: Sliced Carrots & Cucumbers (Edge) */}
            <ellipse cx="190" cy="110" rx="14" ry="7" fill="#E86C36" transform="rotate(20 190 110)" />
            <ellipse cx="210" cy="110" rx="14" ry="7" fill="#71AC62" transform="rotate(-20 210 110)" />
          </g>
        </svg>
      );

    // -------------------------------------------------------------
    // 4. FRESH MATERNAL FRUITS & SNACKS (Mid-Morning Snack)
    // -------------------------------------------------------------
    case 'fresh-fruits':
      return (
        <svg
          viewBox="0 0 400 400"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={className}
          style={style}
          aria-label={alt}
          role="img"
        >
          <defs>
            <filter id="fruitShadow" x="-10%" y="-10%" width="120%" height="130%">
              <feDropShadow dx="0" dy="10" stdDeviation="14" floodColor="#223030" floodOpacity="0.18" />
            </filter>
            <linearGradient id="appleGrad" x1="20%" y1="10%" x2="80%" y2="90%">
              <stop offset="0%" stopColor="#E84855" />
              <stop offset="70%" stopColor="#C4202B" />
              <stop offset="100%" stopColor="#870B13" />
            </linearGradient>
            <linearGradient id="guavaGrad" x1="20%" y1="10%" x2="80%" y2="90%">
              <stop offset="0%" stopColor="#A8D672" />
              <stop offset="60%" stopColor="#82BD44" />
              <stop offset="100%" stopColor="#558C1E" />
            </linearGradient>
            <linearGradient id="bananaGrad" x1="20%" y1="10%" x2="80%" y2="90%">
              <stop offset="0%" stopColor="#FFE066" />
              <stop offset="70%" stopColor="#F5C71A" />
              <stop offset="100%" stopColor="#C99B08" />
            </linearGradient>
            <linearGradient id="chaasGrad" x1="20%" y1="10%" x2="80%" y2="90%">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="100%" stopColor="#E8E8E0" />
            </linearGradient>
          </defs>

          <g filter="url(#fruitShadow)">
            {/* Wooden Serving Board */}
            <rect x="50" y="80" width="300" height="240" rx="36" fill="#E8D9CD" stroke="#BBA58F" strokeWidth="4" />

            {/* Fresh Crisp Red Apple (Center Left) */}
            <circle cx="150" cy="180" r="48" fill="url(#appleGrad)" />
            <ellipse cx="140" cy="160" rx="14" ry="24" fill="#FFFFFF" opacity="0.3" transform="rotate(-25 140 160)" />
            {/* Apple Stem & Leaf */}
            <path d="M150 135 Q152 118 160 115" stroke="#5D3A1A" strokeWidth="4" strokeLinecap="round" />
            <path d="M155 125 Q170 120 172 130 Q160 135 155 125 Z" fill="#52945D" />

            {/* Fresh Sliced Pink Guava (Center Right) */}
            <circle cx="240" cy="220" r="44" fill="url(#guavaGrad)" />
            <circle cx="240" cy="220" r="34" fill="#F48C8C" />
            {/* Guava Seeds */}
            <circle cx="230" cy="215" r="2.5" fill="#FFE2C7" />
            <circle cx="245" cy="210" r="2.5" fill="#FFE2C7" />
            <circle cx="240" cy="228" r="2.5" fill="#FFE2C7" />
            <circle cx="250" cy="224" r="2.5" fill="#FFE2C7" />

            {/* Potassium-Rich Ripe Banana (Bottom Left) */}
            <path
              d="M90 240 Q150 290 220 260 Q150 265 100 230 Z"
              fill="url(#bananaGrad)"
              stroke="#A67D07"
              strokeWidth="2"
            />
            <path d="M90 240 L84 242" stroke="#5D3A1A" strokeWidth="4" strokeLinecap="round" />

            {/* Refreshing Glass of Spiced Buttermilk / Chaas with Mint (Top Right) */}
            <path
              d="M260 120 L270 200 Q285 208 300 200 L310 120 Z"
              fill="url(#chaasGrad)"
              stroke="#BBA58F"
              strokeWidth="3"
            />
            {/* Floating Mint Leaf in Buttermilk */}
            <ellipse cx="285" cy="130" rx="9" ry="5" fill="#52945D" transform="rotate(-15 285 130)" />
          </g>
        </svg>
      );

    // -------------------------------------------------------------
    // 5. BREAKFAST DISH (Steamed Idli, Dosa, Sambhar & Chutney)
    // -------------------------------------------------------------
    case 'breakfast-dish':
      return (
        <svg
          viewBox="0 0 400 400"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={className}
          style={style}
          aria-label={alt}
          role="img"
        >
          <defs>
            <filter id="bfastShadow" x="-10%" y="-10%" width="120%" height="130%">
              <feDropShadow dx="0" dy="10" stdDeviation="14" floodColor="#223030" floodOpacity="0.2" />
            </filter>
            <linearGradient id="bananaLeaf" x1="10%" y1="10%" x2="90%" y2="90%">
              <stop offset="0%" stopColor="#4E9344" />
              <stop offset="100%" stopColor="#2D6325" />
            </linearGradient>
            <linearGradient id="idliGrad" x1="30%" y1="20%" x2="70%" y2="80%">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="80%" stopColor="#F4EDE4" />
              <stop offset="100%" stopColor="#DFD2C0" />
            </linearGradient>
            <linearGradient id="sambarGrad" x1="20%" y1="20%" x2="80%" y2="80%">
              <stop offset="0%" stopColor="#DE7E23" />
              <stop offset="100%" stopColor="#B55106" />
            </linearGradient>
            <linearGradient id="chutneyGrad" x1="20%" y1="20%" x2="80%" y2="80%">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="100%" stopColor="#E2EADE" />
            </linearGradient>
          </defs>

          <g filter="url(#bfastShadow)">
            {/* Fresh Green Banana Leaf Platter */}
            <path
              d="M60 160 C60 100 120 70 200 70 C280 70 340 100 340 160 C340 260 270 330 200 330 C130 330 60 260 60 160 Z"
              fill="url(#bananaLeaf)"
              stroke="#214A1B"
              strokeWidth="4"
            />
            {/* Leaf Vein */}
            <path d="M200 70 L200 330" stroke="#68B55D" strokeWidth="3" opacity="0.7" />

            {/* Steamed Soft Fluffy Idli 1 */}
            <circle cx="140" cy="170" r="38" fill="url(#idliGrad)" stroke="#CFC2AF" strokeWidth="2" />
            <circle cx="140" cy="170" r="28" fill="#FFFFFF" opacity="0.6" />

            {/* Steamed Soft Fluffy Idli 2 */}
            <circle cx="185" cy="225" r="38" fill="url(#idliGrad)" stroke="#CFC2AF" strokeWidth="2" />
            <circle cx="185" cy="225" r="28" fill="#FFFFFF" opacity="0.6" />

            {/* Golden Crisp Dosa Fold / Medu Vada */}
            <g transform="rotate(-25 150 270)">
              <ellipse cx="140" cy="270" rx="30" ry="24" fill="#D68D38" stroke="#995813" strokeWidth="2" />
              <circle cx="140" cy="270" r="10" fill="#2D6325" />
            </g>

            {/* Piping Hot Sambar Bowl with Drumstick & Veggies */}
            <circle cx="265" cy="160" r="36" fill="#EFEFE9" stroke="#BBA58F" strokeWidth="3" />
            <circle cx="265" cy="160" r="31" fill="url(#sambarGrad)" />
            {/* Drumstick piece */}
            <rect x="255" y="150" width="18" height="8" rx="3" fill="#2E6B2A" transform="rotate(30 255 150)" />
            <circle cx="272" cy="166" r="3" fill="#FFE79A" />

            {/* Fresh Coconut Chutney with Mustard & Curry Leaf Tadka */}
            <circle cx="255" cy="245" r="30" fill="#EFEFE9" stroke="#BBA58F" strokeWidth="3" />
            <circle cx="255" cy="245" r="25" fill="url(#chutneyGrad)" />
            <circle cx="252" cy="242" r="2" fill="#223030" />
            <circle cx="258" cy="248" r="1.5" fill="#223030" />
            <path d="M253 247 Q257 243 261 247" stroke="#2D6636" strokeWidth="2" strokeLinecap="round" />
          </g>
        </svg>
      );

    // -------------------------------------------------------------
    // 6. EVENING SNACK (Protein Sundal, Roasted Chana & Warm Soup)
    // -------------------------------------------------------------
    case 'evening-snack':
      return (
        <svg
          viewBox="0 0 400 400"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={className}
          style={style}
          aria-label={alt}
          role="img"
        >
          <defs>
            <filter id="snackShadow" x="-10%" y="-10%" width="120%" height="130%">
              <feDropShadow dx="0" dy="10" stdDeviation="14" floodColor="#223030" floodOpacity="0.18" />
            </filter>
            <linearGradient id="bowlGrad" x1="20%" y1="10%" x2="80%" y2="90%">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="60%" stopColor="#EAE5DB" />
              <stop offset="100%" stopColor="#C9BEAC" />
            </linearGradient>
            <linearGradient id="chanaGrad" x1="20%" y1="20%" x2="80%" y2="80%">
              <stop offset="0%" stopColor="#7D4E2D" />
              <stop offset="100%" stopColor="#4A2A14" />
            </linearGradient>
          </defs>

          <g filter="url(#snackShadow)">
            {/* Ceramic Snack Platter */}
            <circle cx="200" cy="200" r="140" fill="url(#bowlGrad)" stroke="#BBA58F" strokeWidth="5" />

            {/* Protein-Rich Black Chickpea Sundal (Kala Chana) with fresh grated coconut */}
            <circle cx="185" cy="180" r="18" fill="url(#chanaGrad)" />
            <circle cx="215" cy="175" r="17" fill="url(#chanaGrad)" />
            <circle cx="160" cy="205" r="16" fill="url(#chanaGrad)" />
            <circle cx="195" cy="215" r="19" fill="url(#chanaGrad)" />
            <circle cx="230" cy="205" r="17" fill="url(#chanaGrad)" />
            <circle cx="180" cy="235" r="16" fill="url(#chanaGrad)" />
            <circle cx="215" cy="240" r="18" fill="url(#chanaGrad)" />

            {/* Fresh grated white coconut shavings */}
            <path d="M175 170 L185 173" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" />
            <path d="M210 185 L220 188" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" />
            <path d="M190 220 L200 222" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" />
            <path d="M165 210 L172 215" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" />

            {/* Fresh green curry leaves */}
            <ellipse cx="205" cy="198" rx="14" ry="7" fill="#3D7D37" transform="rotate(-30 205 198)" />
            <ellipse cx="180" cy="190" rx="12" ry="6" fill="#3D7D37" transform="rotate(40 180 190)" />

            {/* Steaming Mug of Nutritious Herbal Soup / Milk (Top Right) */}
            <circle cx="280" cy="130" r="32" fill="#E8D9CD" stroke="#523D35" strokeWidth="3" />
            <circle cx="280" cy="130" r="26" fill="#8C5835" />
            {/* Steam trails */}
            <path d="M275 90 Q270 80 275 70" stroke="#BBA58F" strokeWidth="2.5" strokeLinecap="round" opacity="0.6" />
            <path d="M285 92 Q290 82 285 72" stroke="#BBA58F" strokeWidth="2.5" strokeLinecap="round" opacity="0.6" />
          </g>
        </svg>
      );

    // -------------------------------------------------------------
    // 7. DINNER DISH (Light Chapatis, Dal, Vegetables & Millet)
    // -------------------------------------------------------------
    case 'dinner-dish':
      return (
        <svg
          viewBox="0 0 400 400"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={className}
          style={style}
          aria-label={alt}
          role="img"
        >
          <defs>
            <filter id="dinnerShadow" x="-10%" y="-10%" width="120%" height="130%">
              <feDropShadow dx="0" dy="10" stdDeviation="14" floodColor="#223030" floodOpacity="0.2" />
            </filter>
            <linearGradient id="dinPlate" x1="20%" y1="10%" x2="80%" y2="90%">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="60%" stopColor="#EFEFE9" />
              <stop offset="100%" stopColor="#D9CEBC" />
            </linearGradient>
            <linearGradient id="dinRoti" x1="20%" y1="20%" x2="80%" y2="80%">
              <stop offset="0%" stopColor="#F0D5AE" />
              <stop offset="60%" stopColor="#D4A774" />
              <stop offset="100%" stopColor="#AA7840" />
            </linearGradient>
            <linearGradient id="dinSabzi" x1="20%" y1="20%" x2="80%" y2="80%">
              <stop offset="0%" stopColor="#D4773B" />
              <stop offset="100%" stopColor="#8C3F10" />
            </linearGradient>
          </defs>

          <g filter="url(#dinnerShadow)">
            {/* Ceramic Dinner Plate */}
            <circle cx="200" cy="200" r="145" fill="url(#dinPlate)" stroke="#BBA58F" strokeWidth="5" />

            {/* Whole Wheat Phulka Rotis stacked (Left) */}
            <circle cx="150" cy="180" r="46" fill="url(#dinRoti)" stroke="#8C5C26" strokeWidth="1.5" />
            <circle cx="165" cy="225" r="46" fill="url(#dinRoti)" stroke="#8C5C26" strokeWidth="1.5" />
            {/* Brown roasted spots on roti */}
            <circle cx="155" cy="215" r="4" fill="#693F12" opacity="0.6" />
            <circle cx="180" cy="235" r="5" fill="#693F12" opacity="0.5" />
            <circle cx="140" cy="175" r="4" fill="#693F12" opacity="0.6" />

            {/* Katori: Light Mixed Vegetable Curry (Beans, Carrots, Peas) */}
            <circle cx="260" cy="165" r="38" fill="#FFFFFF" stroke="#BBA58F" strokeWidth="3" />
            <circle cx="260" cy="165" r="32" fill="url(#dinSabzi)" />
            {/* Green Peas & Carrot cubes */}
            <circle cx="252" cy="160" r="4.5" fill="#4A8C40" />
            <circle cx="268" cy="168" r="4.5" fill="#4A8C40" />
            <rect x="258" y="152" width="7" height="7" rx="2" fill="#E86C36" />
            <rect x="264" y="172" width="7" height="7" rx="2" fill="#E86C36" />

            {/* Katori: Light Digestive Dal / Saaru (Bottom Right) */}
            <circle cx="255" cy="255" r="34" fill="#FFFFFF" stroke="#BBA58F" strokeWidth="3" />
            <circle cx="255" cy="255" r="28" fill="#E5AA38" />
            <circle cx="252" cy="250" r="2.5" fill="#752008" />
          </g>
        </svg>
      );

    // -------------------------------------------------------------
    // 8. BEDTIME SNACK (Warm Golden Turmeric Milk with Saffron & Nuts)
    // -------------------------------------------------------------
    case 'bedtime-milk':
      return (
        <svg
          viewBox="0 0 400 400"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={className}
          style={style}
          aria-label={alt}
          role="img"
        >
          <defs>
            <filter id="milkShadow" x="-10%" y="-10%" width="120%" height="130%">
              <feDropShadow dx="0" dy="10" stdDeviation="14" floodColor="#223030" floodOpacity="0.18" />
            </filter>
            <linearGradient id="goldenMilk" x1="20%" y1="20%" x2="80%" y2="80%">
              <stop offset="0%" stopColor="#FFF1B0" />
              <stop offset="60%" stopColor="#F5D056" />
              <stop offset="100%" stopColor="#DBAA21" />
            </linearGradient>
            <linearGradient id="ceramicMug" x1="20%" y1="10%" x2="80%" y2="90%">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="60%" stopColor="#EFEFE9" />
              <stop offset="100%" stopColor="#D5CBBB" />
            </linearGradient>
          </defs>

          <g filter="url(#milkShadow)">
            {/* Wooden Coaster */}
            <ellipse cx="200" cy="285" rx="100" ry="24" fill="#D8C3AE" stroke="#BBA58F" strokeWidth="3" />

            {/* Ceramic Warm Mug */}
            <path
              d="M140 150 L145 270 Q200 290 255 270 L260 150 Z"
              fill="url(#ceramicMug)"
              stroke="#BBA58F"
              strokeWidth="4"
            />
            {/* Mug Handle */}
            <path
              d="M260 170 C295 170 295 240 260 240"
              stroke="url(#ceramicMug)"
              strokeWidth="14"
              strokeLinecap="round"
              fill="none"
            />

            {/* Golden Turmeric Milk Liquid Top */}
            <ellipse cx="200" cy="150" rx="58" ry="22" fill="url(#goldenMilk)" stroke="#CFA01E" strokeWidth="2" />

            {/* Saffron strands (Kesar) floating */}
            <path d="M185 145 Q190 148 196 144" stroke="#D9381E" strokeWidth="2" strokeLinecap="round" />
            <path d="M205 152 Q212 155 218 150" stroke="#D9381E" strokeWidth="2" strokeLinecap="round" />

            {/* Sliced Almonds (Badam) on top */}
            <ellipse cx="180" cy="154" rx="8" ry="4" fill="#F4E3D0" stroke="#B88A58" strokeWidth="1" transform="rotate(20 180 154)" />
            <ellipse cx="220" cy="146" rx="8" ry="4" fill="#F4E3D0" stroke="#B88A58" strokeWidth="1" transform="rotate(-15 220 146)" />

            {/* Soothing Night Moon & Star in background */}
            <path
              d="M100 120 C100 100 115 85 135 85 C125 95 125 115 135 125 C115 125 100 110 100 120 Z"
              fill="#F5D056"
              opacity="0.85"
            />
            {/* Warm steam rising gently */}
            <path d="M190 115 Q185 95 192 80" stroke="#BBA58F" strokeWidth="3" strokeLinecap="round" opacity="0.6" />
            <path d="M210 118 Q218 98 210 82" stroke="#BBA58F" strokeWidth="3" strokeLinecap="round" opacity="0.6" />
          </g>
        </svg>
      );

    // -------------------------------------------------------------
    // 9. HYDRATION (Crystal Water Glass, Lemon, Mint & Droplets)
    // -------------------------------------------------------------
    case 'hydration-glass':
      return (
        <svg
          viewBox="0 0 400 400"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={className}
          style={style}
          aria-label={alt}
          role="img"
        >
          <defs>
            <filter id="waterDropShadow" x="-10%" y="-10%" width="120%" height="130%">
              <feDropShadow dx="0" dy="12" stdDeviation="16" floodColor="#1B4965" floodOpacity="0.22" />
            </filter>
            <linearGradient id="waterGrad" x1="20%" y1="20%" x2="80%" y2="90%">
              <stop offset="0%" stopColor="#BEE9E8" />
              <stop offset="50%" stopColor="#62B6CB" />
              <stop offset="100%" stopColor="#1B4965" />
            </linearGradient>
            <linearGradient id="lemonGrad" x1="20%" y1="20%" x2="80%" y2="80%">
              <stop offset="0%" stopColor="#FFF3B0" />
              <stop offset="100%" stopColor="#F5CB5C" />
            </linearGradient>
          </defs>

          <g filter="url(#waterDropShadow)">
            {/* Glass Container */}
            <path
              d="M130 90 L150 310 Q200 330 250 310 L270 90 Z"
              fill="#EBF7F9"
              stroke="#BEE9E8"
              strokeWidth="4"
              opacity="0.75"
            />

            {/* Pure Water Volume */}
            <path
              d="M136 150 L150 310 Q200 328 250 310 L264 150 Q200 162 136 150 Z"
              fill="url(#waterGrad)"
              opacity="0.9"
            />

            {/* Top Water Ellipse */}
            <ellipse cx="200" cy="150" rx="64" ry="12" fill="#E2F6F7" />

            {/* Floating Lemon Slice on Rim */}
            <circle cx="140" cy="100" r="32" fill="url(#lemonGrad)" stroke="#E5B232" strokeWidth="3" />
            <circle cx="140" cy="100" r="24" fill="#FFFBE6" stroke="#E5B232" strokeWidth="1" strokeDasharray="3 3" />
            <path d="M140 76 L140 124 M116 100 L164 100" stroke="#E5B232" strokeWidth="2" />

            {/* Fresh Green Mint Leaf */}
            <path
              d="M140 68 C155 60 170 70 165 85 C150 85 135 75 140 68 Z"
              fill="#4E9344"
              stroke="#2C6B23"
              strokeWidth="1.5"
            />

            {/* Crystal Droplets */}
            <path
              d="M295 190 C295 180 305 168 305 168 C305 168 315 180 315 190 C315 200 307 205 305 205 C303 205 295 200 295 190 Z"
              fill="#62B6CB"
              opacity="0.9"
            />
            <path
              d="M95 240 C95 233 102 224 102 224 C102 224 109 233 109 240 C109 246 104 250 102 250 C100 250 95 246 95 240 Z"
              fill="#62B6CB"
              opacity="0.85"
            />
            {/* Water highlights */}
            <path d="M160 180 L168 280" stroke="#FFFFFF" strokeWidth="4" strokeLinecap="round" opacity="0.6" />
          </g>
        </svg>
      );

    // -------------------------------------------------------------
    // 10. WELLNESS SPARKLE / GENERAL MATERNAL CARE BADGE
    // -------------------------------------------------------------
    default:
      return (
        <svg
          viewBox="0 0 200 200"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={className}
          style={style}
          aria-label={alt}
          role="img"
        >
          <circle cx="100" cy="100" r="85" fill="#E8D9CD" stroke="#BBA58F" strokeWidth="3" />
          <path
            d="M100 135 C88 122 75 110 75 95 C75 83 84 75 94 75 C99 75 100 78 100 80 C100 78 101 75 106 75 C116 75 125 83 125 95 C125 110 112 122 100 135 Z"
            fill="#523D35"
          />
          <path d="M140 60 L142 66 L148 68 L142 70 L140 76 L138 70 L132 68 L138 66 Z" fill="#F4A261" />
        </svg>
      );
  }
};
