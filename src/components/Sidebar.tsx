import React from 'react'
import {
  Plus,
  MessageSquare,
  Trash2,
  Shield,
  Sparkles,
  LogIn,
  LogOut,
  X,
  ExternalLink,
} from 'lucide-react'
import { SparkleLogo } from './SparkleLogo'
import type { ChatSession, UserProfile } from '@/lib/types'

interface SidebarProps {
  isOpen: boolean
  onClose: () => void
  sessions: ChatSession[]
  activeSessionId: string | null
  onSelectSession: (id: string) => void
  onNewChat: () => void
  onDeleteSession: (id: string) => void
  user: UserProfile | null
  onOpenAuth: (mode?: 'signin' | 'signup') => void
  onLogout: () => void
  onOpenPrivacy: () => void
}

export function Sidebar({
  isOpen,
  onClose,
  sessions,
  activeSessionId,
  onSelectSession,
  onNewChat,
  onDeleteSession,
  user,
  onOpenAuth,
  onLogout,
  onOpenPrivacy,
}: SidebarProps) {
  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm md:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed md:static inset-y-0 left-0 z-40 w-72 bg-[#0e0e13] border-r border-[#20202c] flex flex-col justify-between transition-transform duration-300 ease-in-out md:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Top Header & New Chat */}
        <div className="p-4 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <SparkleLogo size={30} glow={true} animated={false} />
              <div className="flex flex-col">
                <span className="font-bold text-white text-base tracking-tight leading-none">
                  YoInfinity AI
                </span>
                <span className="text-[10px] text-neutral-400 font-medium">
                  By Ritesh (Grade 7)
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-[#1a1a24] md:hidden"
              aria-label="Close sidebar"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* New Chat Button */}
          <button
            type="button"
            onClick={() => {
              onNewChat()
              if (window.innerWidth < 768) onClose()
            }}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-2xl bg-gradient-to-r from-[#ff1a40] to-[#b9102c] hover:from-[#ff3355] hover:to-[#cb1336] text-white font-semibold text-sm shadow-lg shadow-red-950/40 hover:shadow-red-900/60 transition-all duration-150 group"
          >
            <Plus className="w-4 h-4 transition-transform group-hover:rotate-90 duration-200" />
            <span>New Chat</span>
          </button>
        </div>

        {/* Chat Sessions History List */}
        <div className="flex-1 overflow-y-auto px-3 py-2 space-y-1">
          <div className="px-2 py-1 flex items-center justify-between text-[11px] font-semibold uppercase tracking-wider text-neutral-500">
            <span>Recent Conversations</span>
            <span className="text-[10px] bg-[#1a1a25] px-1.5 py-0.5 rounded text-neutral-400">
              {sessions.length}
            </span>
          </div>

          {sessions.length === 0 ? (
            <div className="px-3 py-8 text-center text-xs text-neutral-500">
              <p>No conversations yet.</p>
              <p className="mt-1 text-neutral-600">
                Start typing to save your chat!
              </p>
            </div>
          ) : (
            sessions.map((session) => {
              const isActive = session.id === activeSessionId
              return (
                <div
                  key={session.id}
                  className={`group relative flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm transition-all duration-150 cursor-pointer ${
                    isActive
                      ? 'bg-[#1e1e2c] text-white font-medium border border-[#ff1a40]/30'
                      : 'text-neutral-400 hover:text-neutral-200 hover:bg-[#15151e]'
                  }`}
                  onClick={() => {
                    onSelectSession(session.id)
                    if (window.innerWidth < 768) onClose()
                  }}
                >
                  <MessageSquare
                    className={`w-4 h-4 flex-shrink-0 ${
                      isActive ? 'text-[#ff3355]' : 'text-neutral-500'
                    }`}
                  />
                  <span className="truncate flex-1 text-xs">
                    {session.title || 'Conversation'}
                  </span>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation()
                      onDeleteSession(session.id)
                    }}
                    className="opacity-0 group-hover:opacity-100 p-1 text-neutral-500 hover:text-red-400 transition-opacity"
                    aria-label="Delete chat"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              )
            })
          )}
        </div>

        {/* Footer & User Profile / Privacy Info */}
        <div className="p-3 border-t border-[#1e1e2b] bg-[#0b0b10] flex flex-col gap-2">
          {/* Privacy Guarantee Pill */}
          <button
            type="button"
            onClick={onOpenPrivacy}
            className="w-full flex items-center justify-between px-3 py-2 rounded-xl bg-[#14141d] hover:bg-[#1a1a26] border border-[#252535] text-xs text-neutral-300 transition-colors"
          >
            <div className="flex items-center gap-2">
              <Shield className="w-3.5 h-3.5 text-emerald-400" />
              <span>Zero-Access Privacy</span>
            </div>
            <span className="text-[10px] text-emerald-400 font-medium">Safe</span>
          </button>

          {/* User Account / Login Bar */}
          {user && user.isLoggedIn ? (
            <div className="flex items-center justify-between p-2 rounded-xl bg-[#14141c] border border-[#222230]">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#ff1a40] to-[#b9102c] text-white font-bold flex items-center justify-center text-xs flex-shrink-0 shadow-sm shadow-red-900/50">
                  {user.avatar || user.name.charAt(0)}
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="text-xs font-semibold text-white truncate">
                    {user.name}
                  </span>
                  <span className="text-[10px] text-neutral-400 truncate">
                    {user.email}
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={onLogout}
                className="p-1.5 rounded-lg text-neutral-400 hover:text-red-400 hover:bg-[#20202c] transition-colors"
                title="Log Out"
                aria-label="Log Out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => onOpenAuth('signin')}
                className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-[#1b1b26] hover:bg-[#242434] border border-[#2e2e42] text-xs font-semibold text-white transition-all"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Log In</span>
              </button>
              <button
                type="button"
                onClick={() => onOpenAuth('signup')}
                className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-gradient-to-r from-[#ff1a40] to-[#b9102c] hover:from-[#ff3355] hover:to-[#cb1336] text-xs font-semibold text-white shadow-sm shadow-red-950/40 transition-all"
              >
                <span>Sign Up</span>
              </button>
            </div>
          )}

          {/* Developer Credit Tagline */}
          <div className="text-[10px] text-center text-neutral-500 pt-1">
            Created by Ritesh &bull; Powered by Netlify
          </div>
        </div>
      </aside>
    </>
  )
}
