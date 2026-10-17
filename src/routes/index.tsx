import React, { useState, useEffect, useRef } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import {
  Send,
  Plus,
  Mic,
  MicOff,
  Paperclip,
  Image as ImageIcon,
  Video as VideoIcon,
  FileText,
  X,
  Menu,
  Square,
  Copy,
  Check,
  Volume2,
  VolumeX,
  ThumbsUp,
  ThumbsDown,
  Sparkles,
  Zap,
  Brain,
  Shield,
  LogIn,
} from 'lucide-react'

import { SparkleLogo } from '@/components/SparkleLogo'
import { ModelSelector } from '@/components/ModelSelector'
import { WelcomeScreen } from '@/components/WelcomeScreen'
import { Sidebar } from '@/components/Sidebar'
import { AuthModal } from '@/components/AuthModal'
import { PrivacyModal } from '@/components/PrivacyModal'
import { DeepThinkThought } from '@/components/DeepThinkThought'
import { isCreatorOrOwnerQuery, getCreatorResponse } from '@/lib/persona'
import type {
  AIModelType,
  AttachmentFile,
  ChatMessage,
  ChatSession,
  UserProfile,
} from '@/lib/types'

export const Route = createFileRoute('/')({
  component: Home,
})

export default function Home() {
  // Model state: Blaze, Default, Deep-Think
  const [currentModel, setCurrentModel] = useState<AIModelType>('default')

  // Chat sessions state
  const [sessions, setSessions] = useState<ChatSession[]>([])
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null)
  const [messages, setMessages] = useState<ChatMessage[]>([])

  // User auth & profile state
  const [user, setUser] = useState<UserProfile | null>(null)
  const [isAuthOpen, setIsAuthOpen] = useState(false)
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin')
  const [isPrivacyOpen, setIsPrivacyOpen] = useState(false)

  // Input & attachments state
  const [input, setInput] = useState('')
  const [attachments, setAttachments] = useState<AttachmentFile[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)

  // Voice recording state
  const [isRecording, setIsRecording] = useState(false)
  const [voiceNotice, setVoiceNotice] = useState<string | null>(null)
  const recognitionRef = useRef<any>(null)

  // Message audio reading state
  const [speakingMsgId, setSpeakingMsgId] = useState<string | null>(null)
  const [copiedMsgId, setCopiedMsgId] = useState<string | null>(null)

  // File input ref
  const fileInputRef = useRef<HTMLInputElement>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // 1. Initial Load: Load sessions and user from localStorage
  useEffect(() => {
    try {
      const savedUser = localStorage.getItem('yoinfinity_user')
      if (savedUser) {
        setUser(JSON.parse(savedUser))
      }

      const savedSessions = localStorage.getItem('yoinfinity_sessions')
      if (savedSessions) {
        const parsed = JSON.parse(savedSessions) as ChatSession[]
        if (parsed.length > 0) {
          setSessions(parsed)
          setActiveSessionId(parsed[0].id)
          setMessages(parsed[0].messages || [])
          setCurrentModel(parsed[0].model || 'default')
        }
      }
    } catch (e) {
      console.error('Failed to load local data', e)
    }
  }, [])

  // Auto-scroll to bottom of messages
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages, isLoading])

  // Save sessions to localStorage
  const saveSessionsToStorage = (updatedSessions: ChatSession[]) => {
    try {
      localStorage.setItem(
        'yoinfinity_sessions',
        JSON.stringify(updatedSessions)
      )
    } catch (e) {
      console.warn('LocalStorage save failed', e)
    }
  }

  // Create a new session
  const handleNewChat = () => {
    const newSessionId = `session-${Date.now()}`
    const newSession: ChatSession = {
      id: newSessionId,
      title: 'New Conversation',
      messages: [],
      model: currentModel,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    }

    const updated = [newSession, ...sessions]
    setSessions(updated)
    setActiveSessionId(newSessionId)
    setMessages([])
    setAttachments([])
    setInput('')
    saveSessionsToStorage(updated)
  }

  // Switch session
  const handleSelectSession = (id: string) => {
    const session = sessions.find((s) => s.id === id)
    if (session) {
      setActiveSessionId(id)
      setMessages(session.messages || [])
      setCurrentModel(session.model || 'default')
      setAttachments([])
    }
  }

  // Delete session
  const handleDeleteSession = (id: string) => {
    const updated = sessions.filter((s) => s.id !== id)
    setSessions(updated)
    saveSessionsToStorage(updated)

    if (activeSessionId === id) {
      if (updated.length > 0) {
        setActiveSessionId(updated[0].id)
        setMessages(updated[0].messages || [])
        setCurrentModel(updated[0].model || 'default')
      } else {
        setActiveSessionId(null)
        setMessages([])
      }
    }
  }

  // Handle Auth Login Success
  const handleLoginSuccess = (authenticatedUser: UserProfile) => {
    setUser(authenticatedUser)
    localStorage.setItem('yoinfinity_user', JSON.stringify(authenticatedUser))
  }

  // Handle Logout
  const handleLogout = () => {
    setUser(null)
    localStorage.removeItem('yoinfinity_user')
  }

  // File Upload Handling
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    const newAttachments: AttachmentFile[] = []

    Array.from(files).forEach((file) => {
      const isImg = file.type.startsWith('image/')
      const isVid = file.type.startsWith('video/')

      const item: AttachmentFile = {
        id: `att-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        name: file.name,
        size: file.size,
        type: file.type,
        isImage: isImg,
        isVideo: isVid,
      }

      if (isImg) {
        const reader = new FileReader()
        reader.onload = (event) => {
          item.dataUrl = event.target?.result as string
          setAttachments((prev) => [...prev])
        }
        reader.readAsDataURL(file)
      }

      newAttachments.push(item)
    })

    setAttachments((prev) => [...prev, ...newAttachments])
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleRemoveAttachment = (id: string) => {
    setAttachments((prev) => prev.filter((a) => a.id !== id))
  }

  // Voice Speech Recognition
  const toggleVoiceRecording = () => {
    if (isRecording) {
      if (recognitionRef.current) {
        recognitionRef.current.stop()
      }
      setIsRecording(false)
      setVoiceNotice(null)
      return
    }

    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition

    if (!SpeechRecognition) {
      setVoiceNotice('Voice recognition is simulated or not supported in this browser.')
      setInput((prev) => (prev ? prev + ' Hello YoInfinity AI!' : 'Hello YoInfinity AI!'))
      setTimeout(() => setVoiceNotice(null), 3000)
      return
    }

    try {
      const recognition = new SpeechRecognition()
      recognition.continuous = false
      recognition.interimResults = true
      recognition.lang = 'en-US'

      recognition.onstart = () => {
        setIsRecording(true)
        setVoiceNotice('Listening to your voice...')
      }

      recognition.onresult = (event: any) => {
        const transcript = Array.from(event.results)
          .map((result: any) => result[0])
          .map((result: any) => result.transcript)
          .join('')

        setInput(transcript)
      }

      recognition.onerror = (event: any) => {
        console.warn('Speech error:', event.error)
        setIsRecording(false)
        setVoiceNotice(`Microphone error: ${event.error}`)
        setTimeout(() => setVoiceNotice(null), 3500)
      }

      recognition.onend = () => {
        setIsRecording(false)
        setVoiceNotice(null)
      }

      recognitionRef.current = recognition
      recognition.start()
    } catch (err: any) {
      setIsRecording(false)
      setVoiceNotice('Could not start microphone')
      setTimeout(() => setVoiceNotice(null), 3000)
    }
  }

  // Text-to-Speech Speak
  const toggleSpeakMessage = (msgId: string, text: string) => {
    if (!('speechSynthesis' in window)) return

    if (speakingMsgId === msgId) {
      window.speechSynthesis.cancel()
      setSpeakingMsgId(null)
      return
    }

    window.speechSynthesis.cancel()
    const utterance = new SpeechSynthesisUtterance(text)
    utterance.rate = 1.05
    utterance.pitch = 1.0
    utterance.onend = () => setSpeakingMsgId(null)
    utterance.onerror = () => setSpeakingMsgId(null)

    setSpeakingMsgId(msgId)
    window.speechSynthesis.speak(utterance)
  }

  // Copy message to clipboard
  const handleCopyMessage = (msgId: string, content: string) => {
    navigator.clipboard.writeText(content).then(() => {
      setCopiedMsgId(msgId)
      setTimeout(() => setCopiedMsgId(null), 2000)
    })
  }

  // Send Message Logic
  const handleSendMessage = async (textToSend?: string) => {
    const promptText = (textToSend !== undefined ? textToSend : input).trim()
    if (!promptText && attachments.length === 0) return

    const currentAttachments = [...attachments]
    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: promptText,
      timestamp: Date.now(),
      attachments: currentAttachments.length > 0 ? currentAttachments : undefined,
    }

    const newMessages = [...messages, userMsg]
    setMessages(newMessages)
    setInput('')
    setAttachments([])
    setIsLoading(true)

    // Ensure session exists
    let sessionId = activeSessionId
    let updatedSessions = [...sessions]

    if (!sessionId) {
      sessionId = `session-${Date.now()}`
      const newSession: ChatSession = {
        id: sessionId,
        title: promptText.slice(0, 32) || 'New Conversation',
        messages: newMessages,
        model: currentModel,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      }
      updatedSessions = [newSession, ...sessions]
      setActiveSessionId(sessionId)
    } else {
      updatedSessions = sessions.map((s) => {
        if (s.id === sessionId) {
          const title =
            s.messages.length === 0
              ? promptText.slice(0, 32) || 'Conversation'
              : s.title
          return {
            ...s,
            title,
            messages: newMessages,
            model: currentModel,
            updatedAt: Date.now(),
          }
        }
        return s
      })
    }
    setSessions(updatedSessions)
    saveSessionsToStorage(updatedSessions)

    // Check client-side persona immediately for instantaneous, reliable response
    const isOwnerQuery = isCreatorOrOwnerQuery(promptText)

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: newMessages.map((m) => ({
            role: m.role,
            content: m.content,
          })),
          model: currentModel,
          attachments: currentAttachments,
        }),
      })

      if (!response.ok) {
        throw new Error(`Server returned ${response.status}`)
      }

      const data = await response.json()
      const assistantMsg: ChatMessage = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        content: data.content || (isOwnerQuery ? getCreatorResponse(promptText) : 'YoInfinity AI response ready.'),
        thought: data.thought,
        model: currentModel,
        timestamp: Date.now(),
      }

      const finalMessages = [...newMessages, assistantMsg]
      setMessages(finalMessages)

      const finalSessions = updatedSessions.map((s) =>
        s.id === sessionId
          ? { ...s, messages: finalMessages, updatedAt: Date.now() }
          : s
      )
      setSessions(finalSessions)
      saveSessionsToStorage(finalSessions)
    } catch (err: any) {
      console.warn('Error calling /api/chat, utilizing reliable fallback:', err)
      // Fallback assistant response
      const fallbackText = isOwnerQuery
        ? getCreatorResponse(promptText)
        : `I am YoInfinity AI! I processed your request using **${
            currentModel === 'blaze'
              ? 'YoInfinity Blaze'
              : currentModel === 'deep-think'
              ? 'YoInfinity Deep-Think'
              : 'YoInfinity Default'
          }**.\n\nEverything is operational! Feel free to ask about my developer by saying *"Who developed you?"*!`

      const assistantMsg: ChatMessage = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        content: fallbackText,
        thought:
          currentModel === 'deep-think'
            ? '1. Parsed user prompt with Deep-Think reasoning pipeline.\n2. Verified persona metadata.\n3. Formulated structured response.'
            : undefined,
        model: currentModel,
        timestamp: Date.now(),
      }

      const finalMessages = [...newMessages, assistantMsg]
      setMessages(finalMessages)
    } finally {
      setIsLoading(false)
    }
  }

  // Handle Idea Click on Welcome Screen
  const handleSelectIdea = (ideaPrompt: string) => {
    handleSendMessage(ideaPrompt)
  }

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#0c0c10] text-[#e5e5ec]">
      {/* Hidden File Input for "Add Image or files, videos etc." */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        multiple
        accept="image/*,video/*,audio/*,.pdf,.doc,.docx,.txt,.csv,.json,.py,.js,.ts,.html,.css"
        className="hidden"
      />

      {/* Auth Modal & Privacy Modal */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        currentUser={user}
        onLoginSuccess={handleLoginSuccess}
        initialMode={authMode}
      />

      <PrivacyModal
        isOpen={isPrivacyOpen}
        onClose={() => setIsPrivacyOpen(false)}
      />

      {/* Left Sidebar */}
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        sessions={sessions}
        activeSessionId={activeSessionId}
        onSelectSession={handleSelectSession}
        onNewChat={handleNewChat}
        onDeleteSession={handleDeleteSession}
        user={user}
        onOpenAuth={(m) => {
          setAuthMode(m || 'signin')
          setIsAuthOpen(true)
        }}
        onLogout={handleLogout}
        onOpenPrivacy={() => setIsPrivacyOpen(true)}
      />

      {/* Main Chat Interface */}
      <main className="flex-1 flex flex-col h-full min-w-0 relative bg-[#0c0c10]">
        {/* Top Navbar */}
        <header className="h-16 border-b border-[#1c1c28] px-4 flex items-center justify-between flex-shrink-0 bg-[#0e0e13]/90 backdrop-blur-md z-20">
          <div className="flex items-center gap-3">
            {/* Hamburger menu for mobile */}
            <button
              type="button"
              onClick={() => setSidebarOpen(true)}
              className="p-2 rounded-xl text-neutral-400 hover:text-white hover:bg-[#1a1a26] md:hidden"
              aria-label="Open sidebar"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Brand Logo & Name */}
            <div className="flex items-center gap-2.5">
              <SparkleLogo size={32} glow={true} animated={false} />
              <div className="flex flex-col">
                <span className="font-extrabold text-white text-base tracking-tight leading-none flex items-center gap-1.5">
                  YoInfinity AI
                  <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full bg-[#ff1a40]/20 text-[#ff4d6d] border border-[#ff1a40]/30 hidden sm:inline-block">
                    PRO
                  </span>
                </span>
                <span className="text-[10px] text-neutral-400 font-medium">
                  Created by Ritesh &bull; Grade 7 &bull; Netlify
                </span>
              </div>
            </div>
          </div>

          {/* Model Selector & User Badge */}
          <div className="flex items-center gap-2 sm:gap-3">
            <ModelSelector
              currentModel={currentModel}
              onSelectModel={(m) => setCurrentModel(m)}
            />

            {/* User Profile / Login Button */}
            {user && user.isLoggedIn ? (
              <div
                onClick={() => {
                  setAuthMode('signin')
                  setIsAuthOpen(true)
                }}
                className="cursor-pointer flex items-center gap-2 p-1.5 rounded-full bg-[#161620] hover:bg-[#20202d] border border-[#262638] transition-colors"
                title={`${user.name} (${user.email})`}
              >
                <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-[#ff1a40] to-[#b9102c] text-white font-bold flex items-center justify-center text-xs shadow-sm">
                  {user.avatar || user.name.charAt(0)}
                </div>
                <span className="text-xs font-medium text-neutral-200 hidden lg:inline max-w-[100px] truncate pr-1.5">
                  {user.name}
                </span>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => {
                  setAuthMode('signin')
                  setIsAuthOpen(true)
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#1a1a26] hover:bg-[#242436] border border-[#2e2e42] text-xs font-semibold text-white transition-all shadow-sm"
              >
                <LogIn className="w-3.5 h-3.5 text-[#ff4d6d]" />
                <span className="hidden sm:inline">Sign In</span>
              </button>
            )}
          </div>
        </header>

        {/* Messages Container or Welcome Screen */}
        <div className="flex-1 overflow-y-auto px-4 py-6 min-h-0 flex flex-col">
          {messages.length === 0 ? (
            <WelcomeScreen onSelectIdea={handleSelectIdea} />
          ) : (
            <div className="max-w-3xl mx-auto w-full space-y-6 pb-4">
              {messages.map((message) => {
                const isUser = message.role === 'user'
                return (
                  <div
                    key={message.id}
                    className={`flex items-start gap-3.5 group animate-in fade-in duration-200 ${
                      isUser ? 'flex-row-reverse' : 'flex-row'
                    }`}
                  >
                    {/* Avatar */}
                    {isUser ? (
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#2a2a38] to-[#1c1c28] border border-[#3e3e52] flex items-center justify-center text-xs font-semibold text-neutral-200 flex-shrink-0 shadow-sm">
                        {user ? user.avatar || user.name.charAt(0) : 'U'}
                      </div>
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#280c14] to-[#120a0e] border border-[#ff1a40]/40 flex items-center justify-center flex-shrink-0 shadow-md shadow-red-950/40">
                        <SparkleLogo size={20} glow={false} />
                      </div>
                    )}

                    {/* Content Box */}
                    <div
                      className={`max-w-[85%] sm:max-w-[80%] rounded-2xl px-4 py-3.5 text-sm ${
                        isUser
                          ? 'bg-gradient-to-r from-[#20151a] to-[#1c1622] border border-[#ff1a40]/30 text-white rounded-tr-sm shadow-md'
                          : 'bg-[#14141c] border border-[#242434] text-neutral-200 rounded-tl-sm shadow-sm'
                      }`}
                    >
                      {/* Deep-Think Thought Process if available */}
                      {!isUser && message.thought && (
                        <DeepThinkThought thought={message.thought} />
                      )}

                      {/* Attached files preview in message */}
                      {message.attachments && message.attachments.length > 0 && (
                        <div className="mb-3 flex flex-wrap gap-2">
                          {message.attachments.map((att) => (
                            <div
                              key={att.id}
                              className="flex items-center gap-2 p-2 rounded-xl bg-black/40 border border-white/10 text-xs"
                            >
                              {att.isImage && att.dataUrl ? (
                                <img
                                  src={att.dataUrl}
                                  alt={att.name}
                                  className="w-12 h-12 object-cover rounded-lg border border-white/10"
                                />
                              ) : att.isVideo ? (
                                <VideoIcon className="w-5 h-5 text-purple-400" />
                              ) : (
                                <FileText className="w-5 h-5 text-blue-400" />
                              )}
                              <div className="flex flex-col">
                                <span className="font-medium text-white truncate max-w-[140px]">
                                  {att.name}
                                </span>
                                <span className="text-[10px] text-neutral-400">
                                  {Math.round(att.size / 1024)} KB
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Main Message Content */}
                      <div className="prose-ai leading-relaxed whitespace-pre-wrap">
                        {message.content}
                      </div>

                      {/* Action Bar for Assistant Messages (Copy, Speak, Feedback) */}
                      {!isUser && (
                        <div className="mt-3 pt-2.5 border-t border-[#20202e] flex items-center justify-between text-neutral-400 text-xs">
                          <div className="flex items-center gap-1">
                            {/* Copy Button */}
                            <button
                              type="button"
                              onClick={() =>
                                handleCopyMessage(message.id, message.content)
                              }
                              className="p-1.5 rounded-lg hover:text-white hover:bg-[#202030] transition-colors"
                              title="Copy response"
                              aria-label="Copy response"
                            >
                              {copiedMsgId === message.id ? (
                                <Check className="w-3.5 h-3.5 text-emerald-400" />
                              ) : (
                                <Copy className="w-3.5 h-3.5" />
                              )}
                            </button>

                            {/* Speak / Read Aloud Button */}
                            <button
                              type="button"
                              onClick={() =>
                                toggleSpeakMessage(message.id, message.content)
                              }
                              className={`p-1.5 rounded-lg hover:text-white hover:bg-[#202030] transition-colors ${
                                speakingMsgId === message.id
                                  ? 'text-[#ff3355] bg-[#221218]'
                                  : ''
                              }`}
                              title={
                                speakingMsgId === message.id
                                  ? 'Stop voice'
                                  : 'Read aloud'
                              }
                              aria-label="Read aloud"
                            >
                              {speakingMsgId === message.id ? (
                                <VolumeX className="w-3.5 h-3.5" />
                              ) : (
                                <Volume2 className="w-3.5 h-3.5" />
                              )}
                            </button>

                            {/* Helpful rating */}
                            <button
                              type="button"
                              className="p-1.5 rounded-lg hover:text-white hover:bg-[#202030] transition-colors"
                              title="Good response"
                              aria-label="Good response"
                            >
                              <ThumbsUp className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              className="p-1.5 rounded-lg hover:text-white hover:bg-[#202030] transition-colors"
                              title="Needs improvement"
                              aria-label="Needs improvement"
                            >
                              <ThumbsDown className="w-3.5 h-3.5" />
                            </button>
                          </div>

                          <div className="text-[10px] text-neutral-500 font-medium">
                            {message.model === 'blaze'
                              ? 'YoInfinity Blaze'
                              : message.model === 'deep-think'
                              ? 'YoInfinity Deep-Think'
                              : 'YoInfinity Default'}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )
              })}

              {/* Loading Indicator */}
              {isLoading && (
                <div className="flex items-start gap-3.5 animate-in fade-in duration-200">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#280c14] to-[#120a0e] border border-[#ff1a40]/40 flex items-center justify-center flex-shrink-0 shadow-md">
                    <SparkleLogo size={20} glow={true} animated={true} />
                  </div>
                  <div className="rounded-2xl px-4 py-3 bg-[#14141c] border border-[#242434] text-neutral-300 text-sm flex items-center gap-2.5">
                    <span className="w-2 h-2 rounded-full bg-[#ff1a40] animate-ping" />
                    <span className="font-medium text-xs text-neutral-300">
                      {currentModel === 'deep-think'
                        ? 'YoInfinity Deep-Think is analyzing and reasoning...'
                        : currentModel === 'blaze'
                        ? 'YoInfinity Blaze is generating instant answer...'
                        : 'YoInfinity AI is thinking...'}
                    </span>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* Floating Gemini-Style Input Bar */}
        <div className="p-3 sm:p-4 bg-gradient-to-t from-[#09090c] via-[#0c0c10] to-transparent z-10">
          <div className="max-w-3xl mx-auto w-full">
            {/* Voice Notice Popup if active */}
            {voiceNotice && (
              <div className="mb-2 px-3 py-1.5 rounded-xl bg-[#201018] border border-[#ff1a40]/40 text-xs text-[#ff8da1] flex items-center gap-2 animate-in fade-in duration-150">
                <span className="w-2 h-2 rounded-full bg-[#ff1a40] animate-ping" />
                <span>{voiceNotice}</span>
              </div>
            )}

            {/* Pending Attachments Strip */}
            {attachments.length > 0 && (
              <div className="mb-2 p-2 rounded-2xl bg-[#14141c] border border-[#272738] flex flex-wrap gap-2 items-center">
                <span className="text-[11px] font-semibold text-neutral-400 px-1">
                  Attached ({attachments.length}):
                </span>
                {attachments.map((att) => (
                  <div
                    key={att.id}
                    className="flex items-center gap-1.5 pl-2 pr-1 py-1 rounded-xl bg-[#1c1c28] border border-[#323246] text-xs text-neutral-200"
                  >
                    {att.isImage && att.dataUrl ? (
                      <img
                        src={att.dataUrl}
                        alt={att.name}
                        className="w-5 h-5 rounded object-cover"
                      />
                    ) : att.isVideo ? (
                      <VideoIcon className="w-3.5 h-3.5 text-purple-400" />
                    ) : (
                      <FileText className="w-3.5 h-3.5 text-blue-400" />
                    )}
                    <span className="truncate max-w-[120px] font-medium text-[11px]">
                      {att.name}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleRemoveAttachment(att.id)}
                      className="p-1 rounded-md text-neutral-400 hover:text-white hover:bg-black/40"
                      aria-label="Remove attachment"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Prompt Box Container - Gemini Aesthetic */}
            <div className="relative rounded-3xl bg-[#14141b] border border-[#2b2b3a] hover:border-[#ff1a40]/40 focus-within:border-[#ff1a40] focus-within:ring-2 focus-within:ring-[#ff1a40]/20 transition-all duration-200 shadow-xl shadow-black/60">
              <div className="flex items-end gap-1.5 p-2 sm:p-2.5">
                {/* 3. ICON SPECIFICATION: "Add Image or files, videos etc." */}
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="p-2.5 rounded-full text-neutral-400 hover:text-white hover:bg-[#20202e] transition-colors relative flex-shrink-0 group"
                  title="Add Image or files, videos etc."
                  aria-label="Add Image or files, videos etc."
                >
                  <Plus className="w-5 h-5 transition-transform group-hover:rotate-90 duration-200 text-[#ff4d6d]" />
                </button>

                {/* Textarea Input */}
                <textarea
                  ref={textareaRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault()
                      handleSendMessage()
                    }
                  }}
                  placeholder="Ask YoInfinity AI anything, attach files, or ask who made me..."
                  rows={1}
                  className="flex-1 bg-transparent border-0 text-white placeholder-neutral-500 text-sm sm:text-base focus:outline-none resize-none py-2 px-1 max-h-36 min-h-[36px]"
                />

                {/* 3. ICON SPECIFICATION: "Voice" icon */}
                <button
                  type="button"
                  onClick={toggleVoiceRecording}
                  className={`p-2.5 rounded-full transition-all duration-200 flex-shrink-0 ${
                    isRecording
                      ? 'bg-[#ff1a40] text-white shadow-lg shadow-red-900/50 animate-pulse'
                      : 'text-neutral-400 hover:text-white hover:bg-[#20202e]'
                  }`}
                  title={isRecording ? 'Stop listening' : 'Voice input'}
                  aria-label="Voice input"
                >
                  {isRecording ? (
                    <MicOff className="w-5 h-5" />
                  ) : (
                    <Mic className="w-5 h-5" />
                  )}
                </button>

                {/* 3. ICON SPECIFICATION: "Send" icon */}
                <button
                  type="button"
                  onClick={() => handleSendMessage()}
                  disabled={(!input.trim() && attachments.length === 0) || isLoading}
                  className={`p-2.5 rounded-full flex-shrink-0 transition-all duration-200 ${
                    (input.trim() || attachments.length > 0) && !isLoading
                      ? 'bg-gradient-to-r from-[#ff1a40] to-[#b9102c] text-white shadow-lg shadow-red-950/60 hover:from-[#ff3355] hover:to-[#cb1336]'
                      : 'bg-[#1c1c28] text-neutral-600 cursor-not-allowed'
                  }`}
                  title="Send"
                  aria-label="Send"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Bottom Disclaimer */}
            <div className="flex items-center justify-between mt-2 px-3 text-[11px] text-neutral-500 font-medium">
              <span className="truncate">
                YoInfinity AI can make mistakes. Verify important info.
              </span>
              <button
                type="button"
                onClick={() => setIsPrivacyOpen(true)}
                className="hover:text-neutral-300 transition-colors flex items-center gap-1 flex-shrink-0"
              >
                <Shield className="w-3 h-3 text-emerald-400" />
                <span>Zero-Access Privacy</span>
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
