# Grail Hunter Lite — Submission TODOs

**Deadline: Feb 9, 2026 @ 5:00 PM PT**

## CRITICAL PATH (must do before deadline)

- [ ] **Record 3-minute demo video**
  - Follow script in `HACKATHON_SUBMISSION.md` (Hook → Scan → RN Dating → Intel → Map → Market → Close)
  - Upload to YouTube (unlisted is fine)
  - Must be in English or have English subtitles

- [ ] **Submit on DevPost** (gemini3.devpost.com)
  - Paste the ~200 word description from `HACKATHON_SUBMISSION.md`
  - Link to live demo: https://grail-hunter-lite-claremont2542-2062s-projects.vercel.app
  - Link to public repo: https://github.com/redact22/grail-hunter-lite
  - Link to YouTube demo video
  - Add all team members to the DevPost project

- [ ] **Verify Vercel Deployment Protection is OFF**
  - Go to Vercel Dashboard > grail-hunter-lite > Settings > Deployment Protection
  - Set to "None" or "Standard Protection" (NOT "Vercel Authentication")
  - Test by opening production URL in an incognito/private browser window

- [ ] **Test on mobile phone**
  - Open production URL on phone
  - Verify splash screen → tap "Enter the Vault"
  - Test camera scan (needs HTTPS + camera permission)
  - Check all 4 tabs work (Scan, Market, Intel, Map)

## NICE-TO-HAVE (if time allows)

- [ ] **Prepare 3 demo images** — authentic vintage piece, modern item, high-value grail
- [ ] **Test TTS on mobile** — audio playback may need user gesture to start AudioContext
- [ ] **Add topics/tags to GitHub repo** — `gemini`, `hackathon`, `vintage`, `authentication`, `react`
- [ ] **Screenshot for DevPost gallery** — take 3-4 screenshots showing scan flow

## ALREADY DONE (for reference)

- [x] All 5 Gemini APIs verified working (Vision, Search, Maps, TTS, Veo)
- [x] Public standalone repo created and pushed (github.com/redact22/grail-hunter-lite)
- [x] 68/68 tests passing in standalone build
- [x] Production deployed to Vercel
- [x] CLAUDE.md updated with grail-hunter-lite docs
- [x] MEMORY.md checkpointed
- [x] Handoff doc written (HACKATHON_SUBMISSION.md)
- [x] 200-word DevPost description drafted
- [x] Demo script written (3 min)
- [x] README.md for public repo

## CONTEXT FOR NEXT AGENT

- **Monorepo**: `C:\Users\User\Mini-apps` (private, branch: main, commit f91b6737)
- **Standalone**: `C:\Users\User\grail-hunter-lite` (public, branch: master, commit 90f6160)
- **Vercel project**: grail-hunter-lite (prebuilt deploy pattern)
- **API key**: In `apps/grail-hunter-lite/.env` (VITE_GEMINI_API_KEY, 39 chars, starts AIza)
- **Standalone has NO .env** — needs key set before dev/build if testing locally
- **Key lesson**: Maps grounding needs `gemini-2.5-flash` (not gemini-3-flash-preview)
- **Key lesson**: Vite reads .env at startup only — restart dev server after changes
