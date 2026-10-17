import { useId } from 'react'

export interface SparkleLogoProps {
  size?: number
  className?: string
  glow?: boolean
  animated?: boolean
}

/**
 * YoInfinity AI Logo - Red-Black Gradient Infinity Symbol
 * Features a 3D lemniscate ribbon with sleek red-to-black gradients,
 * crossover depth, specular highlights, and ambient glow.
 */
export function SparkleLogo({
  size = 32,
  className = '',
  glow = true,
  animated = false,
}: SparkleLogoProps) {
  const idPrefix = useId().replace(/:/g, '')

  return (
    <div
      className={`relative inline-flex items-center justify-center flex-shrink-0 ${className}`}
      style={{ width: size, height: size }}
    >
      <svg
        width={size}
        height={size}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={`${animated ? 'animate-pulse-subtle' : ''}`}
      >
        <defs>
          {/* Ambient Dual-Lobe Glow */}
          <radialGradient
            id={`${idPrefix}-glow-left`}
            cx="32%"
            cy="50%"
            r="45%"
          >
            <stop offset="0%" stopColor="#ff1a40" stopOpacity="0.7" />
            <stop offset="55%" stopColor="#a80924" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#000000" stopOpacity="0" />
          </radialGradient>

          <radialGradient
            id={`${idPrefix}-glow-right`}
            cx="68%"
            cy="50%"
            r="45%"
          >
            <stop offset="0%" stopColor="#ff3355" stopOpacity="0.65" />
            <stop offset="55%" stopColor="#80061b" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#000000" stopOpacity="0" />
          </radialGradient>

          {/* Main Lemniscate Red-to-Black Gradient */}
          <linearGradient
            id={`${idPrefix}-infinity-grad`}
            x1="5%"
            y1="15%"
            x2="95%"
            y2="85%"
          >
            <stop offset="0%" stopColor="#ff4567" />
            <stop offset="22%" stopColor="#ff1a40" />
            <stop offset="48%" stopColor="#d90d34" />
            <stop offset="72%" stopColor="#700618" />
            <stop offset="90%" stopColor="#280309" />
            <stop offset="100%" stopColor="#0d0204" />
          </linearGradient>

          {/* Front Overlap Strand Gradient */}
          <linearGradient
            id={`${idPrefix}-crossover-grad`}
            x1="25%"
            y1="75%"
            x2="75%"
            y2="25%"
          >
            <stop offset="0%" stopColor="#b80c2b" />
            <stop offset="35%" stopColor="#ff1a40" />
            <stop offset="65%" stopColor="#ff4d6d" />
            <stop offset="100%" stopColor="#ff264c" />
          </linearGradient>

          {/* Glossy Specular Sheen Gradient */}
          <linearGradient
            id={`${idPrefix}-specular`}
            x1="0%"
            y1="0%"
            x2="100%"
            y2="100%"
          >
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.95" />
            <stop offset="25%" stopColor="#ff94a8" stopOpacity="0.6" />
            <stop offset="55%" stopColor="#ff1a40" stopOpacity="0.15" />
            <stop offset="100%" stopColor="#ff1a40" stopOpacity="0" />
          </linearGradient>

          {/* Rim Stroke Gradient for Crisp Definition */}
          <linearGradient
            id={`${idPrefix}-rim-grad`}
            x1="0%"
            y1="0%"
            x2="100%"
            y2="100%"
          >
            <stop offset="0%" stopColor="#ff738e" stopOpacity="0.9" />
            <stop offset="40%" stopColor="#ff1a40" stopOpacity="0.6" />
            <stop offset="80%" stopColor="#990b20" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#ff2a50" stopOpacity="0.3" />
          </linearGradient>
        </defs>

        {/* Ambient Glow Behind Lobes */}
        {glow && (
          <>
            <circle cx="32" cy="50" r="30" fill={`url(#${idPrefix}-glow-left)`} />
            <circle cx="68" cy="50" r="30" fill={`url(#${idPrefix}-glow-right)`} />
          </>
        )}

        {/* Base Lemniscate Shadow / Depth Layer */}
        <path
          d="M 50 50 C 35 22 12 22 12 50 C 12 78 35 78 50 50 C 65 22 88 22 88 50 C 88 78 65 78 50 50 Z"
          stroke="#000000"
          strokeWidth="15"
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity="0.75"
        />

        {/* Main Lemniscate Loop Body (Red-Black Gradient) */}
        <path
          d="M 50 50 C 35 22 12 22 12 50 C 12 78 35 78 50 50 C 65 22 88 22 88 50 C 88 78 65 78 50 50 Z"
          stroke={`url(#${idPrefix}-infinity-grad)`}
          strokeWidth="12"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Crisp Rim Accent Line */}
        <path
          d="M 50 50 C 35 22 12 22 12 50 C 12 78 35 78 50 50 C 65 22 88 22 88 50 C 88 78 65 78 50 50 Z"
          stroke={`url(#${idPrefix}-rim-grad)`}
          strokeWidth="1"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />

        {/* 3D Crossover Drop Shadow (Under front strand) */}
        <path
          d="M 37 63 C 43 57 50 50 57 43 C 61 39 63 37 63 37"
          stroke="#000000"
          strokeWidth="16"
          strokeLinecap="round"
          opacity="0.9"
        />

        {/* 3D Crossover Front Strand (Weaving Over) */}
        <path
          d="M 33 67 C 42 58 50 50 58 42 C 62 38 67 33 67 33"
          stroke={`url(#${idPrefix}-crossover-grad)`}
          strokeWidth="12"
          strokeLinecap="round"
        />

        {/* Crossover Rim Accent */}
        <path
          d="M 33 67 C 42 58 50 50 58 42 C 62 38 67 33 67 33"
          stroke="#ff8099"
          strokeWidth="0.8"
          strokeLinecap="round"
          strokeOpacity="0.6"
        />

        {/* Specular Gloss Sheen on Left Lobe Top Arc */}
        <path
          d="M 44 42 C 36 27 18 27 14 46"
          stroke={`url(#${idPrefix}-specular)`}
          strokeWidth="2.4"
          strokeLinecap="round"
          fill="none"
        />

        {/* Specular Gloss Sheen on Right Lobe Top Arc */}
        <path
          d="M 56 42 C 64 27 82 27 86 46"
          stroke={`url(#${idPrefix}-specular)`}
          strokeWidth="2.4"
          strokeLinecap="round"
          fill="none"
        />

        {/* Central Luminous AI Energy Spark */}
        <circle cx="50" cy="50" r="4.5" fill="#ff1a40" opacity="0.6" />
        <circle cx="50" cy="50" r="2.2" fill="#ffffff" opacity="0.95" />

        {/* Cosmic Micro Sparkles */}
        <circle cx="80" cy="20" r="1.8" fill="#ff4d6d" opacity="0.85" />
        <circle cx="80" cy="20" r="0.8" fill="#ffffff" />
        <circle cx="20" cy="80" r="1.5" fill="#ff264c" opacity="0.75" />
      </svg>
    </div>
  )
}

// Named alias for convenience
export const InfinityLogo = SparkleLogo
export type InfinityLogoProps = SparkleLogoProps
