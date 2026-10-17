import React, { useState, useRef, useEffect } from 'react'
import { Zap, Sparkles, Brain, ChevronDown, Check } from 'lucide-react'
import type { AIModelType, ModelInfo } from '@/lib/types'

export const AVAILABLE_MODELS: ModelInfo[] = [
  {
    id: 'blaze',
    name: 'YoInfinity Blaze',
    subtitle: 'Instant answers',
    description: 'Ultra-fast response latency, ideal for quick queries, definitions, and code lookups.',
    tag: 'Fastest',
    icon: 'zap',
  },
  {
    id: 'default',
    name: 'YoInfinity Default',
    subtitle: 'Basic reasoning',
    description: 'Balanced intelligence for natural conversations, explanations, and creative writing.',
    tag: 'Balanced',
    icon: 'sparkles',
  },
  {
    id: 'deep-think',
    name: 'YoInfinity Deep-Think',
    subtitle: 'Complex & deeper reasoning',
    description: 'Multi-step cognitive reasoning with visible thinking process for math, logic, and deep analysis.',
    tag: 'Deep Reasoning',
    icon: 'brain',
  },
]

interface ModelSelectorProps {
  currentModel: AIModelType
  onSelectModel: (model: AIModelType) => void
}

export function ModelSelector({
  currentModel,
  onSelectModel,
}: ModelSelectorProps) {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const activeModel =
    AVAILABLE_MODELS.find((m) => m.id === currentModel) || AVAILABLE_MODELS[1]

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  const renderIcon = (iconType: string, className = 'w-4 h-4') => {
    switch (iconType) {
      case 'zap':
        return <Zap className={`${className} text-amber-400`} />
      case 'brain':
        return <Brain className={`${className} text-purple-400`} />
      case 'sparkles':
      default:
        return <Sparkles className={`${className} text-[#ff3355]`} />
    }
  }

  return (
    <div className="relative inline-block" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#16161d] hover:bg-[#1e1e28] border border-[#2c2c38] hover:border-[#ff1a40]/50 text-sm font-medium transition-all duration-200 group focus:outline-none focus:ring-2 focus:ring-[#ff1a40]/40"
        aria-label="Select AI Model"
        aria-expanded={isOpen}
      >
        <span className="p-1 rounded-full bg-[#20202b] flex items-center justify-center">
          {renderIcon(activeModel.icon, 'w-3.5 h-3.5')}
        </span>
        <span className="text-white font-semibold">{activeModel.name}</span>
        <span className="text-xs text-neutral-400 hidden sm:inline">
          ({activeModel.subtitle})
        </span>
        <ChevronDown
          className={`w-3.5 h-3.5 text-neutral-400 group-hover:text-white transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>

      {isOpen && (
        <div className="absolute left-0 mt-2 w-80 md:w-96 rounded-2xl bg-[#14141b] border border-[#2b2b38] shadow-2xl shadow-black/80 p-2 z-50 backdrop-blur-xl animate-in fade-in zoom-in-95 duration-150">
          <div className="px-3 py-2 border-b border-[#252533] mb-1">
            <p className="text-xs font-semibold uppercase tracking-wider text-neutral-400">
              YoInfinity Intelligence Models
            </p>
          </div>
          <div className="space-y-1">
            {AVAILABLE_MODELS.map((model) => {
              const isSelected = model.id === currentModel
              return (
                <button
                  key={model.id}
                  type="button"
                  onClick={() => {
                    onSelectModel(model.id)
                    setIsOpen(false)
                  }}
                  className={`w-full text-left p-3 rounded-xl transition-all duration-150 flex items-start gap-3 group ${
                    isSelected
                      ? 'bg-gradient-to-r from-[#ff1a40]/15 to-[#241016] border border-[#ff1a40]/40'
                      : 'hover:bg-[#1c1c26] border border-transparent'
                  }`}
                >
                  <div
                    className={`p-2 rounded-xl flex items-center justify-center mt-0.5 ${
                      isSelected
                        ? 'bg-[#ff1a40]/20 text-[#ff4d6d]'
                        : 'bg-[#20202c] text-neutral-400 group-hover:text-white'
                    }`}
                  >
                    {renderIcon(model.icon, 'w-4 h-4')}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1 mb-0.5">
                      <span
                        className={`font-semibold text-sm ${
                          isSelected ? 'text-white' : 'text-neutral-200'
                        }`}
                      >
                        {model.name}
                      </span>
                      <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-[#252535] text-neutral-300 border border-[#36364a]">
                        {model.tag}
                      </span>
                    </div>
                    <p className="text-xs text-neutral-400 line-clamp-2">
                      {model.description}
                    </p>
                  </div>
                  {isSelected && (
                    <div className="mt-1 flex-shrink-0 text-[#ff3355]">
                      <Check className="w-4 h-4" />
                    </div>
                  )}
                </button>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
