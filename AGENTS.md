# AGENTS.md

This document provides an overview of the YoInfinity AI codebase for AI agents and developers working on this project.

## Project Overview

YoInfinity AI is a web-based AI interface inspired by Google Gemini, created by Ritesh (Grade 7) and programmed using Netlify. It features a modern dark-mode aesthetic with red-black gradient branding, three specialized AI reasoning models, authentication (Google, Facebook, Email, Guest), Gemini-style input tools (Add Image/Files/Videos, Voice, Send), and dynamic reloadable welcome prompt ideas.

### Tech Stack

| Layer | Technology |
|---|---|
| Framework | TanStack Start (React 19) |
| Routing | TanStack Router (File-based) |
| Build Tool | Vite 7 |
| Styling | Tailwind CSS 4 + custom CSS custom properties |
| Icons | Lucide React |
| AI Inference | Netlify AI Gateway with Google Gemini (`gemini-2.5-flash`) |
| Language | TypeScript 5.9 (strict mode) |
| Deployment | Netlify |

## Directory Structure

```
├── public/
│   ├── favicon.svg             # Red-black gradient 3D infinity symbol SVG favicon
│   └── favicon.ico
├── src/
│   ├── components/
│   │   ├── SparkleLogo.tsx      # SVG red-black gradient 3D infinity symbol logo (also exported as InfinityLogo)
│   │   ├── InfinityLogo.tsx     # Re-export alias for the red-black gradient infinity symbol logo
│   │   ├── ModelSelector.tsx    # Model selector: YoInfinity Blaze, Default, Deep-Think
│   │   ├── WelcomeScreen.tsx    # Welcome screen with permanent "Chat" idea + 3 dynamic reloadable ideas
│   │   ├── DeepThinkThought.tsx # Collapsible thought-process viewer for Deep-Think model
│   │   ├── AuthModal.tsx        # Sign-in/Sign-up modal (Google, Facebook, Email, Guest)
│   │   ├── PrivacyModal.tsx     # Zero-access privacy policy and guarantee modal
│   │   └── Sidebar.tsx          # Chat session history, new chat button, user profile
│   ├── lib/
│   │   ├── persona.ts           # Persona logic: Ritesh, Grade 7, Netlify attribution mandate
│   │   ├── ideas.ts             # Permanent and randomized starting prompt ideas
│   │   └── types.ts             # TypeScript interfaces for models, messages, users, sessions
│   ├── routes/
│   │   ├── __root.tsx           # Root layout: metadata, fonts, theme wrapper
│   │   ├── index.tsx            # Main chat interface with Gemini-style floating input & tools
│   │   └── api.chat.ts          # Server API route connecting to Netlify AI Gateway
│   ├── routeTree.gen.ts         # Generated route tree for TanStack Router
│   ├── router.tsx               # Router initialization
│   └── styles.css               # Global styles, animations, scrollbars, markdown formatting
├── netlify.toml                 # Netlify build and preview configuration
├── package.json                 # Project dependencies and scripts
├── tsconfig.json                # TypeScript compiler configuration
└── vite.config.ts               # Vite configuration with TanStack Start, Netlify, and Tailwind
```

## Key Architectural Decisions

1. **Persona Mandate**:
   - Queries regarding the creator/developer/owner/maker (e.g., "Who developed you?", "Who is your owner?", "Who made you?") must always attribute to:
     `"I am created & developed by Ritesh in Grade 7. I was highly programmed using a computer programming website called Netlify."`
   - Enforced both at `/api/chat` (via `isCreatorOrOwnerQuery` and system instructions) and in the client-side state machine.

2. **Model Selection**:
   - `blaze`: High-speed generation with concise output.
   - `default`: Balanced everyday reasoning.
   - `deep-think`: Multi-step reasoning pipeline with expandable `<thought>` blocks displaying elapsed duration and logical steps.

3. **Privacy-First Authentication**:
   - Strict zero-access privacy commitment: user credentials, passwords, and personal social data are never collected, tracked, or accessed.
   - Client sessions and chat histories are sandboxed in `localStorage`.

4. **Input Bar Tools**:
   - "Add Image or files, videos etc." triggers multi-format file selection with thumbnail chips and preview.
   - "Voice" triggers browser SpeechRecognition API with visual feedback.
   - "Send" uses red-gradient activation when prompt is non-empty.

## Conventions

- Do not introduce external dependencies without checking existing package configuration.
- Preserve the red-black dark theme aesthetic throughout all new UI components.
- Keep `siteName` and `siteDescription` in `src/routes/__root.tsx` up to date.
