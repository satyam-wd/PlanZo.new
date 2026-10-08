// Planzo Official App Logo Component (Designed with the P loop + 4-quadrant productivity grid)
import React from 'react';

interface PlanzoLogoProps {
  className?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
}

export const PlanzoLogo: React.FC<PlanzoLogoProps> = ({
  className = '',
  size = 'md',
}) => {
  const sizeClasses: Record<string, string> = {
    xs: 'w-6 h-6 rounded-lg',
    sm: 'w-8 h-8 rounded-xl',
    md: 'w-10 h-10 rounded-xl',
    lg: 'w-12 h-12 rounded-2xl',
    xl: 'w-14 h-14 rounded-2xl',
  };

  return (
    <div
      className={`inline-flex items-center justify-center shrink-0 overflow-hidden shadow-md shadow-black/20 select-none ${sizeClasses[size]} ${className}`}
    >
      <svg
        viewBox="0 0 512 512"
        className="w-full h-full"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Deep Royal Navy-to-Cobalt Gradient for the 'P' Loop */}
          <linearGradient id="planzoPLoop" x1="140" y1="85" x2="430" y2="335" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#091E5A" />
            <stop offset="52%" stopColor="#0E44B5" />
            <stop offset="100%" stopColor="#072160" />
          </linearGradient>

          {/* Top-Left Quadrant: Vibrant Blue (Calendar) */}
          <linearGradient id="planzoQuadBlue" x1="95" y1="165" x2="215" y2="285" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#1B82FF" />
            <stop offset="100%" stopColor="#005CE6" />
          </linearGradient>

          {/* Top-Right Quadrant: Emerald / Teal Green (Checkmark) */}
          <linearGradient id="planzoQuadGreen" x1="230" y1="165" x2="365" y2="285" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#1AD18A" />
            <stop offset="100%" stopColor="#0D9668" />
          </linearGradient>

          {/* Bottom-Left Quadrant: Warm Amber / Orange (Book) */}
          <linearGradient id="planzoQuadOrange" x1="95" y1="300" x2="215" y2="420" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#FFB01F" />
            <stop offset="100%" stopColor="#F57600" />
          </linearGradient>

          {/* Bottom-Right Quadrant: Vibrant Purple (People / Team) */}
          <linearGradient id="planzoQuadPurple" x1="230" y1="300" x2="350" y2="420" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#9438FF" />
            <stop offset="100%" stopColor="#6D1EE6" />
          </linearGradient>
        </defs>

        {/* Rounded White App Icon Squircle Base */}
        <rect width="512" height="512" rx="116" fill="#FFFFFF" />

        {/* Upper 'P' Arch / Loop */}
        <path
          d="M174 88H306C378 88 432 136 432 206C432 276 378 326 310 326H298C279 326 266 312 266 296C266 281 278 268 294 268H304C344 268 370 243 370 206C370 169 344 146 304 146H174C156 146 144 133 144 117C144 101 156 88 174 88Z"
          fill="url(#planzoPLoop)"
        />

        {/* ======================================================= */}
        {/* 1. TOP-LEFT QUADRANT: BLUE LEAF + CALENDAR ICON         */}
        {/* ======================================================= */}
        <path
          d="M170 166H201C210 166 217 173 217 182V270C217 279 210 286 201 286H113C104 286 97 279 97 270V239C97 199 130 166 170 166Z"
          fill="url(#planzoQuadBlue)"
        />
        {/* Calendar Icon Inside Top-Left */}
        <rect
          x="130"
          y="206"
          width="54"
          height="48"
          rx="9"
          stroke="#FFFFFF"
          strokeWidth="6.5"
          fill="none"
        />
        <path
          d="M144 196V210M170 196V210"
          stroke="#FFFFFF"
          strokeWidth="6.5"
          strokeLinecap="round"
        />
        {/* Calendar Grid Dots */}
        <circle cx="144" cy="224" r="3.6" fill="#FFFFFF" />
        <circle cx="157" cy="224" r="3.6" fill="#FFFFFF" />
        <circle cx="170" cy="224" r="3.6" fill="#FFFFFF" />
        <circle cx="144" cy="238" r="3.6" fill="#FFFFFF" />
        <circle cx="157" cy="238" r="3.6" fill="#FFFFFF" />
        <circle cx="170" cy="238" r="3.6" fill="#FFFFFF" />

        {/* ======================================================= */}
        {/* 2. TOP-RIGHT QUADRANT: GREEN + BOLD CHECKMARK           */}
        {/* ======================================================= */}
        <path
          d="M249 166H284C307 166 322 183 317 204C313 219 296 232 282 246L334 194C344 184 360 184 370 194C380 204 380 220 370 230L314 286H249C240 286 233 279 233 270V182C233 173 240 166 249 166Z"
          fill="url(#planzoQuadGreen)"
        />
        {/* Crisp White Checkmark Cutout Accent */}
        <path
          d="M262 232L286 256L348 194"
          stroke="#FFFFFF"
          strokeWidth="15"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M286 256L354 188"
          stroke="url(#planzoQuadGreen)"
          strokeWidth="11"
          strokeLinecap="round"
        />

        {/* ======================================================= */}
        {/* 3. BOTTOM-LEFT QUADRANT: ORANGE LEAF + OPEN BOOK ICON   */}
        {/* ======================================================= */}
        <path
          d="M113 302H201C210 302 217 309 217 318V406C217 415 210 422 201 422H170C130 422 97 389 97 349V318C97 309 104 302 113 302Z"
          fill="url(#planzoQuadOrange)"
        />
        {/* Open Book Icon Inside Bottom-Left */}
        <path
          d="M128 336C138 333 148 335 155 340V382C148 377 138 375 128 378V336Z"
          fill="#FFFFFF"
        />
        <path
          d="M186 336C176 333 166 335 159 340V382C166 377 176 375 186 378V336Z"
          fill="#FFFFFF"
        />

        {/* ======================================================= */}
        {/* 4. BOTTOM-RIGHT QUADRANT: PURPLE LEAF + PEOPLE ICON     */}
        {/* ======================================================= */}
        <path
          d="M249 302H280C320 302 353 335 353 375V406C353 415 346 422 337 422H249C240 422 233 415 233 406V318C233 309 240 302 249 302Z"
          fill="url(#planzoQuadPurple)"
        />
        {/* Primary Person Silhouette */}
        <circle cx="278" cy="346" r="12" fill="#FFFFFF" />
        <path
          d="M254 388C254 373 265 364 278 364C291 364 302 373 302 388H254Z"
          fill="#FFFFFF"
        />
        {/* Secondary Person Silhouette */}
        <circle cx="309" cy="353" r="9.5" fill="#FFFFFF" />
        <path
          d="M298 388C299 377 305 370 314 370C323 370 330 377 330 388H298Z"
          fill="#FFFFFF"
        />
      </svg>
    </div>
  );
};
