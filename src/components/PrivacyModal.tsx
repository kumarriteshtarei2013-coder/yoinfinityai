import React from 'react'
import { X, ShieldCheck, Lock, EyeOff, ServerOff, Heart } from 'lucide-react'

interface PrivacyModalProps {
  isOpen: boolean
  onClose: () => void
}

export function PrivacyModal({ isOpen, onClose }: PrivacyModalProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg rounded-3xl bg-[#121218] border border-[#2c2c3d] shadow-2xl p-6 md:p-8 text-neutral-200">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full bg-[#1c1c27] text-neutral-400 hover:text-white transition-colors"
          aria-label="Close"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-3 mb-5">
          <div className="p-3 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">Privacy Guarantee</h3>
            <p className="text-xs text-neutral-400">
              Zero-Access &bull; Strict Confidentiality &bull; Client-Isolation
            </p>
          </div>
        </div>

        <div className="space-y-3.5 text-xs text-neutral-300 leading-relaxed">
          <div className="p-3.5 rounded-2xl bg-[#171722] border border-[#272738] flex items-start gap-3">
            <EyeOff className="w-4 h-4 text-[#ff4d6d] flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-white mb-0.5">
                We Cannot Access Your Privacy
              </p>
              <p className="text-neutral-400">
                When you log in or sign up with Google, Facebook, or Email, your private credentials, passwords, photos, friend lists, or browsing history are never visible, stored, or accessible by Ritesh or YoInfinity AI.
              </p>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-[#171722] border border-[#272738] flex items-start gap-3">
            <Lock className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-white mb-0.5">
                Local Client Sandboxing
              </p>
              <p className="text-neutral-400">
                Your chat sessions and conversations reside safely in your own browser's encrypted local storage. You have total control to clear chats or remove history at any moment.
              </p>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-[#171722] border border-[#272738] flex items-start gap-3">
            <ServerOff className="w-4 h-4 text-cyan-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-white mb-0.5">
                No Ad Tracking or Data Reselling
              </p>
              <p className="text-neutral-400">
                YoInfinity AI does not sell data, track cookies across websites, or construct advertising profiles.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-[#222232] flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs text-neutral-400">
            <Heart className="w-3.5 h-3.5 text-[#ff1a40]" />
            <span>Built by Ritesh (Grade 7) on Netlify</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-[#222230] hover:bg-[#2b2b3d] text-white text-xs font-semibold transition-colors"
          >
            Understood
          </button>
        </div>
      </div>
    </div>
  )
}
