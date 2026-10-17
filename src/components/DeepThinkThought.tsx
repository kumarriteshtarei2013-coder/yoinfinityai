import React, { useState } from 'react'
import { Brain, ChevronDown, ChevronRight, Sparkles } from 'lucide-react'

interface DeepThinkThoughtProps {
  thought: string
  durationSec?: number
}

export function DeepThinkThought({ thought, durationSec = 1.4 }: DeepThinkThoughtProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  if (!thought) return null

  return (
    <div className="mb-3 rounded-2xl bg-[#161622] border border-[#2b2b3d] overflow-hidden text-xs">
      <button
        type="button"
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-3.5 py-2.5 flex items-center justify-between text-neutral-300 hover:text-white hover:bg-[#1e1e2d] transition-colors"
      >
        <div className="flex items-center gap-2">
          <span className="p-1 rounded-md bg-[#22172a] text-purple-400 border border-purple-500/30">
            <Brain className="w-3.5 h-3.5" />
          </span>
          <span className="font-semibold text-neutral-200">
            Thought for {durationSec.toFixed(1)}s
          </span>
          <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#27273a] text-neutral-400">
            YoInfinity Deep-Think
          </span>
        </div>

        <div className="flex items-center gap-1 text-neutral-400">
          <span>{isExpanded ? 'Hide process' : 'Show reasoning'}</span>
          {isExpanded ? (
            <ChevronDown className="w-3.5 h-3.5" />
          ) : (
            <ChevronRight className="w-3.5 h-3.5" />
          )}
        </div>
      </button>

      {isExpanded && (
        <div className="px-3.5 py-3 border-t border-[#252538] bg-[#12121b] text-neutral-400 text-xs leading-relaxed space-y-1.5 whitespace-pre-wrap font-mono">
          <div className="flex items-center gap-1 text-purple-400 font-semibold mb-1">
            <Sparkles className="w-3 h-3" />
            <span>Reasoning Chain:</span>
          </div>
          {thought}
        </div>
      )}
    </div>
  )
}
