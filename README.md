# GRAIL HUNTER — AI-Powered Vintage Authentication Scanner

**Gemini 3 API Hackathon Submission** | [Live Demo](https://grail-hunter-lite-claremont2542-2062s-projects.vercel.app)

Grail Hunter is a forensic authentication tool for vintage fashion. Point your camera at any thrift store find — the AI identifies the item, dates it using label forensics, estimates market value, and delivers a full authentication verdict with reasoning chain.

## 5 Gemini APIs

| API | Model | What It Does |
|-----|-------|-------------|
| **Vision + Structured Output** | `gemini-3-flash-preview` | Analyzes garment images with extended thinking, returns structured forensic report |
| **Search Grounding** | `gemini-3-flash-preview` | Real-time market intelligence backed by Google Search |
| **Maps Grounding** | `gemini-2.5-flash` | Discovers nearby vintage stores using location-aware search |
| **Text-to-Speech** | `gemini-2.5-flash-preview-tts` | Audio briefings of authentication results (Kore voice) |
| **Veo 3.1** | `veo-3.1-fast-generate-preview` | Generates cinematic product reels for social sharing |

## Features

- **Forensic Report Panel** — 4-phase reasoning chain: Visual Thought Signature → Taxonomy → Market Delta → Authentication Verdict
- **Confidence Ring** — Animated SVG gauge with color-coded authentication confidence
- **RN/WPL Dating** — Real textile forensics using FTC Registration Numbers (formula: `year = 1959 + ⌊(RN - 13670) / 2635⌋`)
- **Badge System** — 6 collectible achievements (First Scan, Eagle Eye, Grail Hunter, Forensic Expert, Authenticator, Void Walker)
- **Market Ticker** — Live trending items with price movements
- **Intel Chat** — Search-grounded Q&A about vintage fashion markets
- **Nearby Stores** — Maps-grounded vintage store discovery
- **Cinematic Splash** — Boot sequence with forensic terminal aesthetic
- **Simulation Fallback** — Every API gracefully degrades when no key is set

## Tech Stack

- **React 19** + TypeScript (strict mode)
- **Vite 5** — build tool
- **Tailwind CSS 3.4** — utility-first styling
- **@google/genai** — Gemini SDK
- **Lucide React** — icons
- **Zero runtime dependencies** beyond React + Gemini SDK

## Quick Start

```bash
# Install
npm install

# Set your Gemini API key
echo "VITE_GEMINI_API_KEY=your-key-here" > .env

# Run development server
npm run dev

# Run tests (68 tests across 13 files)
npm test

# Build for production
npm run build
```

## Project Structure

```
src/
├── components/          # 17 React components
│   ├── Scanner.tsx      # Camera capture + scan orchestration
│   ├── ForensicReportPanel.tsx  # Full authentication report
│   ├── ConfidenceRing.tsx       # Animated SVG confidence gauge
│   ├── ReasoningChain.tsx       # Step-by-step forensic reasoning
│   ├── RNLookupCard.tsx         # RN/WPL textile dating
│   ├── AssistantChat.tsx        # Search-grounded intel chat
│   ├── NearbyStores.tsx         # Maps-grounded store finder
│   ├── BadgeGallery.tsx         # Achievement badge grid
│   ├── BadgeUnlock.tsx          # Full-screen unlock celebration
│   ├── MarketTicker.tsx         # Live market price ticker
│   └── ...
├── services/
│   └── geminiService.ts # All 5 Gemini API integrations (425 lines)
├── data/
│   ├── rn-database.ts   # 18-brand RN lookup database
│   ├── rn-dating.ts     # FTC dating formula + analysis
│   └── badges.ts        # 6 badge definitions
├── hooks/               # useScanHistory, useFavorites, useBadges
├── lib/                 # Safe localStorage + ErrorBoundary
└── styles/              # CSS animations + Liquid Obsidian design system
```

## Design System: Liquid Obsidian

Optimized for low-light thrift store environments:

- **Deep Charcoal** `#0A0A0F` — Prevents OLED smear and halation
- **Patina Teal** `#2BF3C0` — Primary accent for CTAs and active states
- **Google Blue** `#4285F4` — API indicator badges
- **1px borders** at `white/[0.08]` — Crisp card edges without heavy shadows

## License

MIT
