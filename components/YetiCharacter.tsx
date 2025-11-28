import React from 'react';

interface YetiCharacterProps {
  usernameLength: number;
  isCovering: boolean;
  isPeeking: boolean;
  isLoginFailed?: boolean;
  isLoginSuccess?: boolean;
  isUsernameFocused?: boolean;
}

export const YetiCharacter: React.FC<YetiCharacterProps> = ({ 
  usernameLength, 
  isCovering,
  isPeeking,
  isLoginFailed = false,
  isLoginSuccess = false,
  isUsernameFocused = false
}) => {
  // If login failed, override covering/peeking behavior to show the sad face
  // If success, override everything to celebrate
  const showHands = !isLoginFailed || isLoginSuccess;
  const effectiveCovering = isCovering && showHands && !isLoginSuccess;
  const effectivePeeking = isPeeking && showHands && !isLoginSuccess;

  // Eye Tracking Math
  // The input max length for animation purposes is ~30 chars.
  // We want to map 0..30 to an X translation of roughly -12 to +12 pixels.
  const maxTranslationX = 14;
  const maxInputLength = 30;
  
  // Normalized position 0 to 1
  const normalizedPos = Math.min(usernameLength, maxInputLength) / maxInputLength;
  
  // Calculate X translation: Starts at -max, goes to +max
  // If we are fully covering the eyes, reset to center (0).
  // If success, reset to center (0) to look happy at user.
  // If we are peeking, we WANT to track (because we are reading), so we allow calculation.
  // If we are NOT focused on username (and not peeking/tracking pw), default to center (0).
  const shouldTrack = isUsernameFocused || effectivePeeking;
  const eyeX = (!shouldTrack || effectiveCovering || isLoginSuccess)
    ? 0
    : -maxTranslationX + (normalizedPos * (maxTranslationX * 2));
  
  // Calculate Y translation: 
  // When typing/peeking, look slightly down (at the input) -> 6.
  // When covering, neutral -> 0.
  // When failed, look down in sadness -> 10
  // When success, look up slightly in joy -> -4
  // When idle (no focus), look straight -> 0
  const eyeY = isLoginSuccess 
    ? -4 
    : (isLoginFailed ? 10 : ((isUsernameFocused || effectivePeeking) ? 6 : 0));

  // Hand Animation
  // Hands start at the bottom. 
  // Covering: Move both up and inward.
  // Peeking: Keep one hand up (Right), move one hand down (Left) to "peek".
  // Failed: Force hands down (0,0)
  // Success: Celebrate! Hands up and spread out.
  
  let leftHandTransform = "translate(0px, 0px)";
  let rightHandTransform = "translate(0px, 0px)";

  if (isLoginSuccess) {
     // Celebration: Hands up and spread out
     leftHandTransform = "translate(-25px, -60px)";
     rightHandTransform = "translate(25px, -60px)";
  } else if (effectiveCovering) {
    // Left Hand: Move right and up (fully cover eye).
    leftHandTransform = "translate(25px, -75px)";
    // Right Hand: Move left and up
    rightHandTransform = "translate(-25px, -75px)";
  } else if (effectivePeeking) {
    // Lower the hand just enough to reveal the eye, but keep it raised slightly (peeking)
    leftHandTransform = "translate(25px, -30px)";
    // Keep right hand covering
    rightHandTransform = "translate(-25px, -75px)";
  }
  
  // Mouth Animation
  // Failed: Sad frown (inverted arch)
  // Password interaction: Quirky funny smile
  // Success: Big open happy smile
  // Idle: Normal smile
  let mouthPath = "M 85 140 Q 100 155 115 140"; // Normal Smile

  if (isLoginSuccess) {
    mouthPath = "M 75 135 Q 100 175 125 135"; // Large Wide Smile
  } else if (isLoginFailed) {
    mouthPath = "M 85 150 Q 100 130 115 150"; // Sad Frown
  } else if (effectiveCovering || effectivePeeking) {
    mouthPath = "M 88 150 Q 100 160 112 145"; // Quirky asymmetric smile
  }

  // Animation class for shaking
  const svgClass = `w-full h-full drop-shadow-xl ${isLoginFailed ? 'shake-animation' : ''}`;

  return (
    <svg
      viewBox="0 0 200 200"
      className={svgClass}
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Definition of gradients and clips */}
      <defs>
        <linearGradient id="furGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#f1f5f9" /> {/* slate-100 */}
          <stop offset="100%" stopColor="#cbd5e1" /> {/* slate-300 */}
        </linearGradient>
        
        {/* Clip paths for eyes to contain pupils and eyelids */}
        <clipPath id="leftEyeClip">
           <circle cx="70" cy="90" r="18" />
        </clipPath>
        <clipPath id="rightEyeClip">
           <circle cx="130" cy="90" r="18" />
        </clipPath>
      </defs>

      {/* --- BODY/HEAD --- */}
      {/* Main shape: A rounded blob */}
      <path
        d="M 50 180 
           L 150 180 
           Q 180 180 180 130
           Q 180 50 100 50 
           Q 20 50 20 130 
           Q 20 180 50 180 Z"
        fill="url(#furGradient)"
        stroke="#94a3b8"
        strokeWidth="2"
      />
      
      {/* Ears */}
      <path
        d="M 25 90 Q 5 80 15 60 Q 35 50 40 75"
        fill="#cbd5e1"
        stroke="#94a3b8"
        strokeWidth="2"
      />
      <path
        d="M 175 90 Q 195 80 185 60 Q 165 50 160 75"
        fill="#cbd5e1"
        stroke="#94a3b8"
        strokeWidth="2"
      />

      {/* --- FACE AREA --- */}
      
      {/* Muzzle Area (lighter) */}
      <ellipse cx="100" cy="135" rx="40" ry="25" fill="#ffffff" opacity="0.6" />

      {/* Nose */}
      <ellipse cx="100" cy="125" rx="8" ry="5" fill="#334155" />

      {/* Mouth */}
      <path
        d={mouthPath}
        fill="none"
        stroke="#334155"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="yeti-transition"
      />

      {/* --- EYES --- */}
      <g className="yeti-transition">
        {/* Left Eye */}
        <g clipPath="url(#leftEyeClip)">
            {/* Sclera */}
            <rect x="52" y="72" width="36" height="36" fill="white" />
            
            {/* Pupil Group */}
            <g 
                style={{ transform: `translate(${eyeX}px, ${eyeY}px)` }}
                className="pupil-transition"
            >
                <circle cx="70" cy="90" r="7" fill="#1e293b" />
                <circle cx="73" cy="87" r="2" fill="white" />
            </g>

            {/* Eyelid */}
            <rect 
                x="52" y="72" width="36" height="36" 
                fill="#cbd5e1"
                className="yeti-transition"
                style={{ transform: 'translateY(-36px)' }}
            />
        </g>
        {/* Eye Border Ring (drawn on top to not be clipped) */}
        <circle cx="70" cy="90" r="18" fill="none" stroke="#e2e8f0" strokeWidth="2" />


        {/* Right Eye */}
        <g clipPath="url(#rightEyeClip)">
            {/* Sclera */}
            <rect x="112" y="72" width="36" height="36" fill="white" />
            
            {/* Pupil Group */}
            <g 
                style={{ transform: `translate(${eyeX}px, ${eyeY}px)` }}
                className="pupil-transition"
            >
                <circle cx="130" cy="90" r="7" fill="#1e293b" />
                <circle cx="133" cy="87" r="2" fill="white" />
            </g>

            {/* Eyelid */}
            <rect 
                x="112" y="72" width="36" height="36" 
                fill="#cbd5e1"
                className="yeti-transition"
                style={{ transform: 'translateY(-36px)' }}
            />
        </g>
        {/* Eye Border Ring */}
        <circle cx="130" cy="90" r="18" fill="none" stroke="#e2e8f0" strokeWidth="2" />
      </g>

      {/* --- HANDS --- */}
      {/* Left Hand */}
      <g 
        className="yeti-transition"
        style={{ transform: leftHandTransform }}
      >
        <path
          d="M 20 250 L 20 180 Q 20 140 45 140 Q 70 140 70 180 L 70 250 Z"
          fill="url(#furGradient)"
          stroke="#94a3b8"
          strokeWidth="2"
        />
        {/* Fingers/Details */}
        <path d="M 35 142 L 35 155" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" />
        <path d="M 45 140 L 45 155" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" />
        <path d="M 55 142 L 55 155" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" />
      </g>

      {/* Right Hand */}
      <g 
        className="yeti-transition"
        style={{ transform: rightHandTransform }}
      >
        <path
          d="M 130 250 L 130 180 Q 130 140 155 140 Q 180 140 180 180 L 180 250 Z"
          fill="url(#furGradient)"
          stroke="#94a3b8"
          strokeWidth="2"
        />
        {/* Fingers/Details */}
        <path d="M 145 142 L 145 155" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" />
        <path d="M 155 140 L 155 155" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" />
        <path d="M 165 142 L 165 155" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" />
      </g>
      
    </svg>
  );
};