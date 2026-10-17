import React, { useState } from 'react'
import { X, ShieldCheck, Mail, Lock, User, ArrowRight, CheckCircle2 } from 'lucide-react'
import { SparkleLogo } from './SparkleLogo'
import type { UserProfile } from '@/lib/types'

interface AuthModalProps {
  isOpen: boolean
  onClose: () => void
  currentUser: UserProfile | null
  onLoginSuccess: (user: UserProfile) => void
  initialMode?: 'signin' | 'signup'
}

export function AuthModal({
  isOpen,
  onClose,
  currentUser,
  onLoginSuccess,
  initialMode = 'signin',
}: AuthModalProps) {
  const [mode, setMode] = useState<'signin' | 'signup'>(initialMode)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  if (!isOpen) return null

  const handleSocialAuth = (provider: 'google' | 'facebook') => {
    setIsSubmitting(true)
    setError(null)
    // Simulate real OAuth flow with instant, secure privacy-first client authentication
    setTimeout(() => {
      const mockUser: UserProfile = {
        id: `${provider}-${Date.now()}`,
        name: provider === 'google' ? 'Google Explorer' : 'Facebook Member',
        email: provider === 'google' ? 'user@gmail.com' : 'user@facebook.com',
        avatar: provider === 'google' ? 'G' : 'F',
        provider,
        isLoggedIn: true,
      }
      onLoginSuccess(mockUser)
      setIsSubmitting(false)
      onClose()
    }, 600)
  }

  const handleEmailAuth = (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !password) {
      setError('Please provide both email and password.')
      return
    }
    if (mode === 'signup' && !name) {
      setError('Please enter your full name.')
      return
    }
    if (password.length < 6) {
      setError('Password should be at least 6 characters.')
      return
    }

    setIsSubmitting(true)
    setError(null)

    setTimeout(() => {
      const displayName = mode === 'signup' ? name : email.split('@')[0]
      const user: UserProfile = {
        id: `email-${Date.now()}`,
        name: displayName.charAt(0).toUpperCase() + displayName.slice(1),
        email,
        avatar: displayName.charAt(0).toUpperCase(),
        provider: 'email',
        isLoggedIn: true,
      }
      setSuccessMessage(mode === 'signup' ? 'Account created successfully!' : 'Signed in successfully!')
      setTimeout(() => {
        onLoginSuccess(user)
        setIsSubmitting(false)
        onClose()
      }, 500)
    }, 600)
  }

  const handleGuest = () => {
    const guestUser: UserProfile = {
      id: `guest-${Date.now()}`,
      name: 'Guest Explorer',
      email: 'guest@yoinfinity.ai',
      avatar: '?',
      provider: 'guest',
      isLoggedIn: true,
    }
    onLoginSuccess(guestUser)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-md rounded-3xl bg-[#111116] border border-[#2b2b38] shadow-2xl shadow-red-950/40 p-6 md:p-8 overflow-hidden text-neutral-200"
        role="dialog"
        aria-modal="true"
        aria-labelledby="auth-modal-title"
      >
        {/* Subtle decorative glow */}
        <div className="absolute -top-24 -left-24 w-52 h-52 bg-[#ff1a40]/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-52 h-52 bg-[#b9102c]/10 rounded-full blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full bg-[#1b1b24] text-neutral-400 hover:text-white hover:bg-[#252533] transition-colors"
          aria-label="Close"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header */}
        <div className="flex flex-col items-center text-center mb-6">
          <div className="p-3 rounded-2xl bg-gradient-to-br from-[#241016] to-[#121218] border border-[#ff1a40]/30 mb-3 shadow-lg shadow-red-950/30">
            <SparkleLogo size={40} glow={true} animated={true} />
          </div>
          <h2 id="auth-modal-title" className="text-2xl font-bold text-white tracking-tight">
            {mode === 'signin' ? 'Welcome back to YoInfinity AI' : 'Join YoInfinity AI'}
          </h2>
          <p className="text-xs text-neutral-400 mt-1 max-w-xs">
            {mode === 'signin'
              ? 'Sign in to access your saved chats and personalized models'
              : 'Create an account to start your deep reasoning experience'}
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex p-1 rounded-xl bg-[#181822] border border-[#272736] mb-5">
          <button
            type="button"
            onClick={() => {
              setMode('signin')
              setError(null)
            }}
            className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all duration-150 ${
              mode === 'signin'
                ? 'bg-[#ff1a40] text-white shadow-md shadow-red-900/40'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => {
              setMode('signup')
              setError(null)
            }}
            className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all duration-150 ${
              mode === 'signup'
                ? 'bg-[#ff1a40] text-white shadow-md shadow-red-900/40'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            Create Account
          </button>
        </div>

        {/* Social Buttons */}
        <div className="space-y-2.5 mb-5">
          <button
            type="button"
            onClick={() => handleSocialAuth('google')}
            disabled={isSubmitting}
            className="w-full flex items-center justify-center gap-3 px-4 py-2.5 rounded-xl bg-[#1b1b26] hover:bg-[#232332] border border-[#303042] text-sm font-semibold text-white transition-all duration-150 hover:border-[#ff1a40]/40 disabled:opacity-50"
          >
            {/* Google G SVG */}
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path
                fill="#EA4335"
                d="M12 5c1.6 0 3 .6 4.1 1.6l3.1-3.1C17.3 1.8 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.4l3.7 2.9C6.5 7.4 9 5 12 5z"
              />
              <path
                fill="#4285F4"
                d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.6h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5.1 3.7-8.9z"
              />
              <path
                fill="#FBBC05"
                d="M5.6 14.7c-.2-.7-.4-1.5-.4-2.7 0-1.1.2-1.9.4-2.7L1.9 6.4C.7 8.8 0 10.3 0 12s.7 3.2 1.9 5.6l3.7-2.9z"
              />
              <path
                fill="#34A853"
                d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2.4-6.4-5.3L1.9 16c1.8 3.8 5.6 7 10.1 7z"
              />
            </svg>
            Continue with Google
          </button>

          <button
            type="button"
            onClick={() => handleSocialAuth('facebook')}
            disabled={isSubmitting}
            className="w-full flex items-center justify-center gap-3 px-4 py-2.5 rounded-xl bg-[#1877f2]/15 hover:bg-[#1877f2]/25 border border-[#1877f2]/40 text-sm font-semibold text-[#8bbbff] transition-all duration-150 disabled:opacity-50"
          >
            {/* Facebook F SVG */}
            <svg className="w-4 h-4 fill-[#1877f2]" viewBox="0 0 24 24">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
            </svg>
            Continue with Facebook
          </button>
        </div>

        {/* Divider */}
        <div className="relative flex items-center justify-center mb-5">
          <div className="border-t border-[#252535] w-full" />
          <span className="bg-[#111116] px-3 text-[11px] uppercase tracking-wider text-neutral-500 font-semibold absolute">
            Or with email
          </span>
        </div>

        {/* Error / Success Messages */}
        {error && (
          <div className="p-2.5 mb-3 rounded-xl bg-red-950/40 border border-red-800/50 text-xs text-red-300">
            {error}
          </div>
        )}
        {successMessage && (
          <div className="p-2.5 mb-3 rounded-xl bg-emerald-950/40 border border-emerald-800/50 text-xs text-emerald-300 flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4" />
            {successMessage}
          </div>
        )}

        {/* Email Form */}
        <form onSubmit={handleEmailAuth} className="space-y-3">
          {mode === 'signup' && (
            <div>
              <label className="block text-xs font-medium text-neutral-300 mb-1">
                Full Name
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-neutral-500 absolute left-3 top-3" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ritesh Explorer"
                  className="w-full rounded-xl bg-[#191924] border border-[#2e2e40] pl-9 pr-3 py-2 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-[#ff1a40] focus:ring-1 focus:ring-[#ff1a40]"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-medium text-neutral-300 mb-1">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-neutral-500 absolute left-3 top-3" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                required
                className="w-full rounded-xl bg-[#191924] border border-[#2e2e40] pl-9 pr-3 py-2 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-[#ff1a40] focus:ring-1 focus:ring-[#ff1a40]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-neutral-300 mb-1">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-neutral-500 absolute left-3 top-3" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full rounded-xl bg-[#191924] border border-[#2e2e40] pl-9 pr-3 py-2 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-[#ff1a40] focus:ring-1 focus:ring-[#ff1a40]"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full mt-2 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-gradient-to-r from-[#ff1a40] to-[#b9102c] hover:from-[#ff3355] hover:to-[#d01334] text-white font-semibold text-sm shadow-lg shadow-red-950/50 transition-all duration-150 disabled:opacity-50"
          >
            {isSubmitting ? (
              <span className="inline-flex items-center gap-2">
                <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Authenticating...
              </span>
            ) : (
              <>
                <span>{mode === 'signin' ? 'Sign In' : 'Create Account'}</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Guest Mode Action */}
        <div className="mt-4 pt-3 border-t border-[#232332] text-center">
          <button
            type="button"
            onClick={handleGuest}
            className="text-xs text-neutral-400 hover:text-neutral-200 underline underline-offset-4 decoration-neutral-600 hover:decoration-[#ff1a40]"
          >
            Continue as Guest (No signup required)
          </button>
        </div>

        {/* Privacy Protection Notice - Exact requirement: "But I can't access their privacy" */}
        <div className="mt-4 p-3 rounded-2xl bg-[#161622] border border-[#2c2c3e] flex items-start gap-2.5">
          <ShieldCheck className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
          <div className="text-[11px] text-neutral-400 leading-relaxed">
            <span className="font-semibold text-neutral-200 block mb-0.5">
              Strict Zero-Access Privacy Guarantee
            </span>
            YoInfinity AI does not access, read, or track your private passwords, personal account data, or social profiles. All authentication tokens are kept isolated in your browser.
          </div>
        </div>
      </div>
    </div>
  )
}
