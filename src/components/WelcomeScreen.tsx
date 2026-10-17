import { useState, useEffect } from 'react'
import {
  MessageCircle,
  Code,
  Compass,
  Lightbulb,
  Sparkles,
  BookOpen,
  Cpu,
  Flame,
  ArrowUpRight,
} from 'lucide-react'
import { SparkleLogo } from './SparkleLogo'
import { getWelcomeIdeas, type IdeaItem } from '@/lib/ideas'

interface WelcomeScreenProps {
  onSelectIdea: (prompt: string) => void
}

export function WelcomeScreen({ onSelectIdea }: WelcomeScreenProps) {
  const [ideas, setIdeas] = useState<IdeaItem[]>([])

  // On mount / page reload: re-generate fresh ideas
  // The first idea is ALWAYS the permanent idea!
  useEffect(() => {
    setIdeas(getWelcomeIdeas())
  }, [])

  const renderIcon = (name: IdeaItem['iconName']) => {
    const className = 'w-4 h-4'
    switch (name) {
      case 'message-circle':
        return <MessageCircle className={`${className} text-[#ff3355]`} />
      case 'code':
        return <Code className={`${className} text-blue-400`} />
      case 'compass':
        return <Compass className={`${className} text-emerald-400`} />
      case 'lightbulb':
        return <Lightbulb className={`${className} text-amber-400`} />
      case 'book-open':
        return <BookOpen className={`${className} text-indigo-400`} />
      case 'cpu':
        return <Cpu className={`${className} text-cyan-400`} />
      case 'flame':
        return <Flame className={`${className} text-orange-400`} />
      case 'sparkles':
      default:
        return <Sparkles className={`${className} text-pink-400`} />
    }
  }

  return (
    <div className="w-full max-w-4xl mx-auto my-auto flex flex-col items-center px-4 py-6 sm:py-8">
      {/* Central Sparkle Star & Glowing Aura */}
      <div className="relative mb-6 flex items-center justify-center">
        <div className="absolute w-36 h-36 bg-[#ff1a40]/20 rounded-full blur-2xl pointer-events-none animate-pulse-subtle" />
        <SparkleLogo size={68} glow={true} animated={true} />
      </div>

      {/* Main Big Greeting - Exactly as specified: "Sup! YoInfinity AI here! How can I help you today?" */}
      <div className="text-center mb-8 max-w-2xl px-2">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight leading-snug sm:leading-normal">
          <span className="text-white mr-2.5 inline-block py-0.5">Sup!</span>
          <span className="gradient-text-brand inline-block py-0.5">YoInfinity AI here!</span>
          <span className="block text-xl sm:text-2xl md:text-3xl font-medium text-neutral-300 mt-2.5 leading-relaxed">
            How can I help you today?
          </span>
        </h1>
        <p className="text-xs sm:text-sm text-neutral-400 mt-3 font-medium">
          Choose a prompt below, attach files or images, or ask questions about my origin.
        </p>
      </div>

      {/* 4 Starting Ideas Grid (1 permanent + 3 dynamic) */}
      <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-3.5 max-w-3xl">
        {ideas.map((item, index) => {
          const isFirst = index === 0 // The permanent idea
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onSelectIdea(item.prompt)}
              className={`group text-left p-4 rounded-2xl transition-all duration-200 relative overflow-hidden flex flex-col justify-between ${
                isFirst
                  ? 'bg-gradient-to-br from-[#261016] via-[#1a141b] to-[#121218] border-2 border-[#ff1a40]/60 hover:border-[#ff3355] shadow-lg shadow-red-950/40 hover:shadow-red-900/50 hover:-translate-y-0.5'
                  : 'bg-[#15151d]/90 hover:bg-[#1c1c27] border border-[#272736] hover:border-[#ff1a40]/40 hover:-translate-y-0.5'
              }`}
            >
              {/* Permanent badge glow highlight */}
              {isFirst && (
                <div className="absolute top-0 right-0 w-24 h-24 bg-[#ff1a40]/15 rounded-full blur-xl pointer-events-none" />
              )}

              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="p-1.5 rounded-lg bg-[#20202c] border border-[#2e2e40] flex items-center justify-center">
                      {renderIcon(item.iconName)}
                    </span>
                    <span
                      className={`text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md ${
                        isFirst
                          ? 'bg-[#ff1a40] text-white shadow-sm shadow-red-900/50'
                          : 'bg-[#222230] text-neutral-300 border border-[#303042]'
                      }`}
                    >
                      {item.category}
                    </span>
                  </div>

                  <ArrowUpRight
                    className={`w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 ${
                      isFirst ? 'text-[#ff4d6d]' : 'text-neutral-500 group-hover:text-white'
                    }`}
                  />
                </div>

                <p
                  className={`text-sm font-medium line-clamp-3 leading-snug ${
                    isFirst ? 'text-white font-semibold' : 'text-neutral-300 group-hover:text-neutral-100'
                  }`}
                >
                  {item.prompt}
                </p>
              </div>

              {isFirst && (
                <div className="mt-3 pt-2 border-t border-[#ff1a40]/20 flex items-center gap-1.5 text-[11px] text-[#ff8da1] font-semibold">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Permanent Idea &bull; Click to start first conversation</span>
                </div>
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}
