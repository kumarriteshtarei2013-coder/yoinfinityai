export interface IdeaItem {
  id: string
  category: string
  title: string
  prompt: string
  iconName: 'message-circle' | 'code' | 'compass' | 'lightbulb' | 'sparkles' | 'book-open' | 'cpu' | 'flame'
  isPermanent?: boolean
}

export const PERMANENT_IDEA: IdeaItem = {
  id: 'permanent-chat-idea',
  category: 'Chat',
  title: 'Start Conversation',
  prompt: "Say 'Hi' & 'Hello' to this own-favourable AI to start your first conversation. Press here to start!",
  iconName: 'message-circle',
  isPermanent: true,
}

export const DYNAMIC_IDEAS_POOL: IdeaItem[] = [
  {
    id: 'idea-code-1',
    category: 'Coding',
    title: 'Python Game Loop',
    prompt: 'Write a clean Python script for a simple text-based RPG battle engine with HP, attack moves, and potion healing.',
    iconName: 'code',
  },
  {
    id: 'idea-creative-1',
    category: 'Creative',
    title: 'Cyberpunk Short Story',
    prompt: 'Write an atmospheric cyberpunk story about a street hacker who discovers an AI communicating through neon street signs.',
    iconName: 'sparkles',
  },
  {
    id: 'idea-learn-1',
    category: 'Science',
    title: 'Quantum Computing Explained',
    prompt: 'Explain how quantum entanglement and qubits work in simple terms like I am 14 years old.',
    iconName: 'cpu',
  },
  {
    id: 'idea-math-1',
    category: 'Logic & Math',
    title: 'Brain-Teaser Riddle',
    prompt: 'Give me 3 difficult logical riddles with hidden clues, and only reveal the answers after I guess!',
    iconName: 'lightbulb',
  },
  {
    id: 'idea-study-1',
    category: 'Study',
    title: '7-Day Study Masterplan',
    prompt: 'Create a focused 7-day revision schedule for science and mathematics with pomodoro breaks.',
    iconName: 'book-open',
  },
  {
    id: 'idea-creator-1',
    category: 'Persona',
    title: 'Who Made You?',
    prompt: 'Who developed you and what is your origin story?',
    iconName: 'flame',
  },
  {
    id: 'idea-dev-1',
    category: 'Web Dev',
    title: 'Modern CSS Animation',
    prompt: 'Show me how to make a glowing red-black gradient border button using modern CSS keyframes.',
    iconName: 'code',
  },
  {
    id: 'idea-explore-1',
    category: 'Explore',
    title: 'Deep Space Mysteries',
    prompt: 'What are the top 5 most mysterious celestial objects discovered in the deep universe?',
    iconName: 'compass',
  },
  {
    id: 'idea-productivity-1',
    category: 'Strategy',
    title: 'Project Roadmap',
    prompt: 'How would a student developer build and deploy an AI web app on Netlify step-by-step?',
    iconName: 'lightbulb',
  },
  {
    id: 'idea-music-1',
    category: 'Music & Arts',
    title: 'Lyrical Rhymes',
    prompt: 'Write catchy rap verses about coding late at night with glowing red terminal screens.',
    iconName: 'sparkles',
  },
]

/**
 * Returns 4 ideas:
 * 1st: The permanent idea ("Say 'Hi' & 'Hello'...")
 * 2nd, 3rd, 4th: 3 randomly shuffled unique ideas from the dynamic pool
 */
export function getWelcomeIdeas(): IdeaItem[] {
  // Shuffle a copy of dynamic ideas
  const shuffled = [...DYNAMIC_IDEAS_POOL].sort(() => 0.5 - Math.random())
  const selected3 = shuffled.slice(0, 3)
  return [PERMANENT_IDEA, ...selected3]
}
