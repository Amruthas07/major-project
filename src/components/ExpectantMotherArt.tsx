import React, { useId } from 'react';

interface ExpectantMotherArtProps {
  className?: string;
  alt?: string;
}

/**
 * ExpectantMotherArt Component
 * 
 * Implements the "HAPPY & EXPECTANT waiting" photographic concept:
 * A joyful, serene pregnant South Asian woman smiling warmly and lovingly at her bump,
 * illuminated by warm golden ambient light, draped in traditional silk attire.
 */
export const ExpectantMotherArt: React.FC<ExpectantMotherArtProps> = ({
  className = 'w-full h-full',
  alt = 'Joyful, serene pregnant South Asian woman smiling warmly at her bump'
}) => {
  const rawId = useId();
  const id = rawId.replace(/:/g, '_');

  return (
    <svg
      role="img"
      aria-label={alt}
      viewBox="0 0 500 600"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <title>{alt}</title>
      <defs>
        {/* Soft Golden Ambient Glow */}
        <radialGradient id={`${id}_ambientGlow`} cx="45%" cy="40%" r="55%">
          <stop offset="0%" stopColor="#FFF2D6" stopOpacity="0.9" />
          <stop offset="45%" stopColor="#F5D0A9" stopOpacity="0.6" />
          <stop offset="75%" stopColor="#D98A6C" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#223030" stopOpacity="0" />
        </radialGradient>

        {/* Skin Tone Gradient (Warm South Asian Olive Gold) */}
        <linearGradient id={`${id}_skinBase`} x1="30%" y1="0%" x2="80%" y2="100%">
          <stop offset="0%" stopColor="#FFE0C4" />
          <stop offset="35%" stopColor="#F7C8A4" />
          <stop offset="70%" stopColor="#E09F7A" />
          <stop offset="100%" stopColor="#B36B46" />
        </linearGradient>

        {/* Face Lighting Gradient */}
        <radialGradient id={`${id}_faceGlow`} cx="40%" cy="35%" r="60%">
          <stop offset="0%" stopColor="#FFF0E0" />
          <stop offset="50%" stopColor="#F9CEA8" />
          <stop offset="85%" stopColor="#DF9C75" />
          <stop offset="100%" stopColor="#B56743" />
        </radialGradient>

        {/* Cheeks Rosy Blush */}
        <radialGradient id={`${id}_rosyBlush`} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#E57373" stopOpacity="0.55" />
          <stop offset="60%" stopColor="#F06292" stopOpacity="0.25" />
          <stop offset="100%" stopColor="#F06292" stopOpacity="0" />
        </radialGradient>

        {/* Hair Shading (Lustrous Black with Warm Amber Sheen) */}
        <linearGradient id={`${id}_hairGrad`} x1="20%" y1="0%" x2="90%" y2="100%">
          <stop offset="0%" stopColor="#3E2723" />
          <stop offset="30%" stopColor="#211815" />
          <stop offset="65%" stopColor="#120D0B" />
          <stop offset="100%" stopColor="#0A0807" />
        </linearGradient>

        {/* Silk Saree Fabric Gradient (Elegant Rose Gold & Terracotta) */}
        <linearGradient id={`${id}_sareeSilk`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#D96B50" />
          <stop offset="25%" stopColor="#B84934" />
          <stop offset="60%" stopColor="#8C2C1D" />
          <stop offset="90%" stopColor="#661C12" />
        </linearGradient>

        {/* Zari Gold Border Gradient */}
        <linearGradient id={`${id}_zariGold`} x1="0%" y1="50%" x2="100%" y2="50%">
          <stop offset="0%" stopColor="#FFE082" />
          <stop offset="30%" stopColor="#FFD54F" />
          <stop offset="55%" stopColor="#FFC107" />
          <stop offset="80%" stopColor="#FFA000" />
          <stop offset="100%" stopColor="#FF8F00" />
        </linearGradient>

        {/* Soft Drop Shadow for Depth */}
        <filter id={`${id}_shadow`} x="-15%" y="-15%" width="130%" height="130%">
          <feDropShadow dx="0" dy="12" stdDeviation="16" floodColor="#000000" floodOpacity="0.35" />
        </filter>
      </defs>

      {/* 1. Warm Ambient Radiant Sunlight Aura */}
      <circle cx="250" cy="280" r="240" fill={`url(#${id}_ambientGlow)`} />

      {/* Warm Golden Sunrays / Bokeh Particles */}
      <g opacity="0.35">
        <circle cx="120" cy="140" r="18" fill="#FFF4D0" />
        <circle cx="390" cy="180" r="14" fill="#FFE29A" />
        <circle cx="90" cy="320" r="22" fill="#FFCC80" />
        <circle cx="430" cy="380" r="16" fill="#FFF9C4" />
      </g>

      {/* 2. Figure Container with Gentle Shadow */}
      <g filter={`url(#${id}_shadow)`}>
        {/* Back Hair Bun & Jasmine Garland (Mogra) */}
        <ellipse cx="185" cy="175" rx="42" ry="48" fill={`url(#${id}_hairGrad)`} />
        {/* Jasmine Flower buds wrapped around hair bun */}
        <g fill="#FFFDE7" opacity="0.95">
          <circle cx="160" cy="150" r="5.5" />
          <circle cx="152" cy="162" r="5" />
          <circle cx="150" cy="175" r="5.5" />
          <circle cx="154" cy="188" r="5" />
          <circle cx="162" cy="200" r="5.5" />
          <circle cx="174" cy="210" r="5" />
          <circle cx="188" cy="215" r="5.5" />
        </g>

        {/* Upper Saree Body & Drape Backdrop */}
        <path
          d="M170,290 C185,250 215,230 260,225 C310,220 350,245 375,290 C395,335 410,400 420,490 L130,490 C140,410 155,340 170,290 Z"
          fill={`url(#${id}_sareeSilk)`}
        />

        {/* Graceful Shoulders & Neck */}
        <path
          d="M210,210 C215,245 200,265 185,285 L320,280 C305,255 292,235 285,210 Z"
          fill={`url(#${id}_skinBase)`}
        />

        {/* Elegant Gold Mangalsutra / Chain */}
        <path
          d="M215,250 Q250,285 285,250"
          fill="none"
          stroke={`url(#${id}_zariGold)`}
          strokeWidth="3.5"
          strokeLinecap="round"
        />
        <circle cx="250" cy="272" r="5" fill={`url(#${id}_zariGold)`} />

        {/* Face & Head tilted downward lovingly toward baby bump */}
        <g transform="rotate(14, 250, 160)">
          {/* Main Head Structure */}
          <ellipse cx="250" cy="160" rx="48" ry="58" fill={`url(#${id}_faceGlow)`} />

          {/* Luxurious Front Hair with gentle parting */}
          <path
            d="M202,150 C205,115 230,105 250,110 C270,105 295,115 298,150 C290,132 272,122 250,125 C228,122 210,132 202,150 Z"
            fill={`url(#${id}_hairGrad)`}
          />
          {/* Side Hair Waves framing temple */}
          <path
            d="M202,150 C200,185 210,210 215,215 C210,195 208,175 208,155 Z"
            fill={`url(#${id}_hairGrad)`}
          />

          {/* Traditional Crimson Red Round Bindi */}
          <circle cx="250" cy="138" r="4.5" fill="#C62828" />

          {/* Gentle Eyebrows (Arched & relaxed) */}
          <path
            d="M225,147 Q236,143 246,146"
            fill="none"
            stroke="#211815"
            strokeWidth="2.4"
            strokeLinecap="round"
          />
          <path
            d="M256,146 Q266,143 277,147"
            fill="none"
            stroke="#211815"
            strokeWidth="2.4"
            strokeLinecap="round"
          />

          {/* Tender, Joyful Eyes Looking Gently Downward */}
          {/* Left Eye Curve */}
          <path
            d="M228,158 Q238,166 246,159"
            fill="none"
            stroke="#2B1B17"
            strokeWidth="2.6"
            strokeLinecap="round"
          />
          {/* Lashes */}
          <path d="M234,163 L233,167 M238,164 L238,168 M242,163 L243,167" stroke="#2B1B17" strokeWidth="1.2" />

          {/* Right Eye Curve */}
          <path
            d="M256,159 Q264,166 274,158"
            fill="none"
            stroke="#2B1B17"
            strokeWidth="2.6"
            strokeLinecap="round"
          />
          {/* Lashes */}
          <path d="M260,163 L259,167 M264,164 L264,168 M268,163 L269,167" stroke="#2B1B17" strokeWidth="1.2" />

          {/* Soft Feminine Nose */}
          <path
            d="M250,154 Q253,172 250,178 Q247,180 245,178"
            fill="none"
            stroke="#B56743"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
          {/* Dainty Traditional Gold Nose Stud */}
          <circle cx="244" cy="176" r="2" fill={`url(#${id}_zariGold)`} />

          {/* Rosy Cheek Blush */}
          <ellipse cx="225" cy="172" rx="14" ry="9" fill={`url(#${id}_rosyBlush)`} />
          <ellipse cx="275" cy="172" rx="14" ry="9" fill={`url(#${id}_rosyBlush)`} />

          {/* Warm, Loving Smile */}
          <path
            d="M238,190 Q251,202 264,190"
            fill="none"
            stroke="#A33828"
            strokeWidth="2.8"
            strokeLinecap="round"
          />
          {/* Subtle lower lip curve */}
          <path
            d="M242,194 Q251,199 260,194"
            fill="none"
            stroke="#D86B5A"
            strokeWidth="2.2"
            strokeLinecap="round"
          />

          {/* Dainty Gold Ear Jhumka / Earrings */}
          <circle cx="204" cy="176" r="4.5" fill={`url(#${id}_zariGold)`} />
          <polygon points="204,180 200,192 208,192" fill={`url(#${id}_zariGold)`} />
        </g>

        {/* 3. The Expectant Baby Bump (The Hero Subject) */}
        {/* Soft, rounded, full third-trimester baby bump cradled in warm silk */}
        <g transform="translate(0, 10)">
          {/* Saree Pleats & Drape around Bump */}
          <path
            d="M170,360 C170,470 205,530 270,535 C335,540 375,470 380,360 C370,330 330,320 270,320 C210,320 175,330 170,360 Z"
            fill={`url(#${id}_sareeSilk)`}
          />

          {/* Highlight & Volumetric Shadow on the Curve of the Bump */}
          <ellipse cx="275" cy="425" rx="85" ry="90" fill="#9C3020" opacity="0.4" />
          <ellipse cx="265" cy="410" rx="70" ry="75" fill="#D96B50" opacity="0.85" />
          <ellipse cx="255" cy="390" rx="50" ry="50" fill="#E8826B" opacity="0.5" />

          {/* Gold Zari Embroidery along Pallu Border crossing diagonally over bump */}
          <path
            d="M165,310 Q220,410 325,490"
            fill="none"
            stroke={`url(#${id}_zariGold)`}
            strokeWidth="10"
            strokeLinecap="round"
          />
          <path
            d="M165,310 Q220,410 325,490"
            fill="none"
            stroke="#8C2C1D"
            strokeWidth="2"
            strokeDasharray="4,4"
          />

          {/* 4. Mother's Loving Arms & Hands Hugging the Bump */}
          {/* Left Arm & Wrist with Traditional Glass & Gold Bangles */}
          <path
            d="M170,300 C155,360 160,420 190,465 C200,475 210,470 205,455 C185,415 180,365 190,310 Z"
            fill={`url(#${id}_skinBase)`}
          />
          {/* Left Hand gently resting on bottom of bump */}
          <ellipse cx="215" cy="460" rx="22" ry="14" transform="rotate(-20, 215, 460)" fill={`url(#${id}_skinBase)`} />
          {/* Left Hand Fingers curved lovingly */}
          <path
            d="M210,460 Q235,475 255,465"
            fill="none"
            stroke="#B56743"
            strokeWidth="3.2"
            strokeLinecap="round"
          />

          {/* Traditional Green & Gold Bangles (Choodiyan) on Left Wrist */}
          <g transform="translate(185, 435) rotate(-35)">
            <rect x="0" y="0" width="4" height="24" rx="2" fill="#2E7D32" />
            <rect x="5" y="0" width="3" height="24" rx="1.5" fill={`url(#${id}_zariGold)`} />
            <rect x="9" y="0" width="4" height="24" rx="2" fill="#C62828" />
            <rect x="14" y="0" width="3" height="24" rx="1.5" fill={`url(#${id}_zariGold)`} />
            <rect x="18" y="0" width="4" height="24" rx="2" fill="#2E7D32" />
          </g>

          {/* Right Arm & Hand resting warmly on top of bump */}
          <path
            d="M340,300 C360,350 355,400 325,440 C315,448 305,440 310,430 C335,395 338,355 325,305 Z"
            fill={`url(#${id}_skinBase)`}
          />
          {/* Right Hand resting peacefully on upper bump */}
          <ellipse cx="295" cy="415" rx="24" ry="16" transform="rotate(25, 295, 415)" fill={`url(#${id}_skinBase)`} />
          <path
            d="M280,412 Q295,430 318,422"
            fill="none"
            stroke="#B56743"
            strokeWidth="3.2"
            strokeLinecap="round"
          />

          {/* Bangles on Right Wrist */}
          <g transform="translate(322, 390) rotate(45)">
            <rect x="0" y="0" width="4" height="22" rx="2" fill="#2E7D32" />
            <rect x="5" y="0" width="3" height="22" rx="1.5" fill={`url(#${id}_zariGold)`} />
            <rect x="9" y="0" width="4" height="22" rx="2" fill="#C62828" />
            <rect x="14" y="0" width="3" height="22" rx="1.5" fill={`url(#${id}_zariGold)`} />
          </g>
        </g>
      </g>
    </svg>
  );
};
