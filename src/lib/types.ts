export type AIModelType = 'blaze' | 'default' | 'deep-think'

export interface ModelInfo {
  id: AIModelType
  name: string
  subtitle: string
  description: string
  tag: string
  icon: 'zap' | 'sparkles' | 'brain'
}

export interface AttachmentFile {
  id: string
  name: string
  size: number
  type: string
  dataUrl?: string
  isVideo?: boolean
  isImage?: boolean
}

export interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  thought?: string
  model?: AIModelType
  timestamp: number
  attachments?: AttachmentFile[]
}

export interface ChatSession {
  id: string
  title: string
  messages: ChatMessage[]
  model: AIModelType
  createdAt: number
  updatedAt: number
}

export interface UserProfile {
  id: string
  name: string
  email: string
  avatar?: string
  provider: 'google' | 'facebook' | 'email' | 'guest'
  isLoggedIn: boolean
}
