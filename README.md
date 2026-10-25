# 👑 Quiz Royale — Full-Stack Real-Time Multiplayer Trivia Game

[![Tests](https://img.shields.io/badge/tests-20%20passed-brightgreen.svg)]()
[![TypeScript](https://img.shields.io/badge/TypeScript-5.4-blue.svg)]()
[![React](https://img.shields.io/badge/React-18-cyan.svg)]()
[![Socket.IO](https://img.shields.io/badge/Socket.IO-4.7-black.svg)]()
[![License](https://img.shields.io/badge/License-MIT-purple.svg)]()

> A complete, real-time, competitive game-show experience for 2–10 players. No login, registration, or app installation required. Enter a 6-character room code on mobile, tablet, or desktop and battle for trivia supremacy!

---

## 🌐 Public Live Game URL
- **Public Game Access:** [https://pushing-newsletter-moreover-fighting.trycloudflare.com](https://pushing-newsletter-moreover-fighting.trycloudflare.com)
- **Local Dev URL:** `http://localhost:4000` (or `http://localhost:5173` via Vite proxy)
- **Health Check Endpoint:** `https://pushing-newsletter-moreover-fighting.trycloudflare.com/api/health`

---

## 🎮 Game Concept & Rules

Quiz Royale is a live, competitive multiplayer quiz game:
- **Player Limit:** 2 to 10 players per room.
- **Room Codes:** Unique 6-character alphanumeric room codes generated on room creation.
- **Instant Join:** Players choose an avatar and a display nickname; no accounts or personal data needed.
- **Rounds:** Default 10 questions per match (customizable by host to 5, 10, 15, or 20 questions).
- **Time Limit:** Exactly 15 seconds per question with a server-authoritative countdown.
- **Locked Submissions:** Once a player selects an option (A, B, C, or D), it is immediately locked and cannot be changed.
- **Anti-Cheat:** The correct answer is **strictly kept on the server** and is never delivered to any client until the question officially closes.

### 🧮 Authoritative Scoring Formula
Points are calculated dynamically on the server based on correctness and reaction speed:

$$\text{Score} = \begin{cases} 500 + \left\lfloor 500 \times \frac{\text{Remaining Time (sec)}}{15} \right\rfloor & \text{if correct} \\ 0 & \text{if incorrect or timeout} \end{cases}$$

- **Maximum Points:** 1,000 points per question (for instantaneous correct answers).
- **Minimum Correct Points:** 500 base points (at the final millisecond before expiration).
- **Incorrect or Timeout:** 0 points.

---

## 🏗️ Architecture & Tech Stack

```
quiz-royale-netlify-ready/
├── client/                     # Frontend (React 18, TypeScript, Vite, Tailwind CSS)
│   ├── src/
│   │   ├── components/         # Header, Lobby, Quiz, Reveal, Leaderboard, Podium, Modal
│   │   ├── utils/              # Socket.IO client, Web Audio synthesis, session helpers
│   │   ├── types/              # Client TypeScript interfaces
│   │   ├── App.tsx             # Room state machine router
│   │   └── main.tsx            # React DOM bootstrap
│   ├── index.html              # HTML shell with Google Fonts (Outfit & Inter)
│   └── vite.config.ts          # Vite build & reverse proxy configuration
│
├── server/                     # Backend (Node.js, Express, TypeScript, Socket.IO)
│   ├── src/
│   │   ├── config/             # MongoDB Atlas connection & robust offline fallback
│   │   ├── models/             # Mongoose schemas (Question, GameSession)
│   │   ├── questions/          # 105+ verified questions & QuestionRepository
│   │   ├── routes/             # REST API (/api/health, /api/history, /api/rooms)
│   │   ├── services/           # RoomManager, GameEngine, ScoringService
│   │   ├── sockets/            # Socket.IO event protocol handlers
│   │   ├── tests/              # 20 Vitest unit, integration, & multi-socket tests
│   │   └── index.ts            # Main HTTP & WebSocket server
│   └── package.json
│
├── .env.example                # Sample environment configuration
└── package.json                # Root orchestrator scripts
```

| Layer | Technologies | Role |
| :--- | :--- | :--- |
| **Frontend** | React 18, TypeScript, Vite, Tailwind CSS, Lucide Icons, Canvas-Confetti | Responsive mobile-first UI with Royal purple, electric cyan, coral pink, and gold palette. |
| **Audio** | Synthesized Web Audio API | Zero external assets: clean ticks, chimes, buzzers, and victory fanfare. |
| **Backend** | Node.js, Express, TypeScript, Socket.IO | Authoritative timers, answer validation, score computation, room management. |
| **Database** | MongoDB Atlas with Mongoose (with offline fallback) | Stores question bank and completed match history. |
| **Testing** | Vitest | 20 automated unit and integration tests including multi-socket simulation. |

---

## 📚 Question Bank (105+ Verified Questions)

The game includes 105+ curated, verified questions across 7 balanced categories:
1. **Science (15 questions):** Physics, Chemistry, Biology, Astronomy.
2. **Geography (15 questions):** Capitals, Oceans, Mountain ranges, Landmarks.
3. **History (15 questions):** Ancient civilizations, World events, Inventions, Leaders.
4. **Technology (15 questions):** Computing, Networking, Cryptography, Programming languages.
5. **Nature (15 questions):** Wildlife, Botany, Ecosystems, Weather phenomena.
6. **Sports (15 questions):** World Cup, Olympics, Tennis, Basketball, Formula One.
7. **General Knowledge (15 questions):** Arts, Literature, Currencies, Trivia.

*Every question contains 4 options, a verified answer index, a category, and an educational "Did You Know?" explanation displayed during the reveal phase.*

---

## 🚀 Getting Started Locally

### Prerequisites
- **Node.js** >= 18.0.0 (Tested on Node v22.12.0)
- **npm** >= 9.0.0

### 1. Clone & Install Dependencies
```bash
# Clone the repository
git clone <repository-url>
cd quiz-royale-netlify-ready

# Install all dependencies (root, server, and client)
npm run install:all
```

### 2. Environment Configuration
Copy `.env.example` to `.env` in the root and in `server/`:
```bash
cp .env.example .env
```
Default configuration:
```env
PORT=4000
NODE_ENV=development
CLIENT_URL=http://localhost:5173
MONGODB_URI=
```
> **Note:** If `MONGODB_URI` is left blank, the application automatically runs in **Development Fallback Mode** (using built-in questions and local JSON file persistence for match history).

### 3. Run the Application
You can run both client and server concurrently with one command:
```bash
npm run dev
```
Or run them separately:
```bash
# Terminal 1: Backend Server (Port 4000)
npm run dev:server

# Terminal 2: Frontend Client (Port 5173)
npm run dev:client
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 🧪 Automated Testing Suite

The project includes 20 comprehensive automated tests covering all critical game logic, security boundaries, and real-time synchronization.

Run the test suite:
```bash
npm test
```

### Test Results Breakdown (20 / 20 Passed)
- `roomManager.test.ts` (9 tests passed):
  - 6-character room code generation & uniqueness.
  - Malicious character sanitization in nicknames.
  - Normal player join flow.
  - Non-existent room rejection.
  - Duplicate nickname rejection within the same room.
  - 10-player room capacity limit enforcement.
  - Host failover when host leaves.
  - Room destruction when all players leave.
  - State reset on rematch.
- `scoring.test.ts` (5 tests passed):
  - 1,000 maximum points for instant correct answer.
  - Proportional speed bonus degradation with elapsed time.
  - 500 base points at the final millisecond.
  - 0 points for incorrect answers regardless of speed.
  - 0 points for submissions after timer expiration.
- `gameEngine.test.ts` (5 tests passed):
  - Option shuffling with server-side index tracking.
  - Start game rejection with < 2 players.
  - Start game allowed with $\ge 2$ players.
  - Duplicate answer rejection from the same player.
  - Completed game history persistence and retrieval.
- `multiplayerE2E.test.ts` (1 comprehensive test passed):
  - Two real Socket.IO client connections playing simultaneously.
  - Synchronized question delivery with zero answer keys exposed.
  - Independent answer submissions from both players.
  - Early reveal triggered when all active players submit.

---

## ☁️ Deployment Strategy

### Option A: Unified Container / Cloud Service (Render, Railway, Fly.io)
Because Quiz Royale uses persistent WebSockets for real-time synchronization, the backend must run on a service that supports persistent TCP connections.

1. Build both client and server:
   ```bash
   npm run build
   ```
2. The server will automatically serve the built client files from `client/dist` when accessed on port `4000`.
3. Set environment variables on your host:
   - `PORT=4000`
   - `NODE_ENV=production`
   - `MONGODB_URI=<your-mongodb-atlas-connection-string>`
4. Start command:
   ```bash
   npm start
   ```

### Option B: Frontend on Netlify + Backend on Render / Railway
If you deploy the frontend to Netlify:
1. Deploy `client/` to Netlify:
   - Base directory: `client`
   - Build command: `npm run build`
   - Publish directory: `client/dist`
2. Set `VITE_SERVER_URL` in Netlify environment variables pointing to your deployed backend URL (e.g., `https://quiz-royale-backend.onrender.com`).
3. Deploy `server/` to Render or Railway with WebSocket support enabled.

---

## 🏆 Acceptance Requirements Checklist

| Requirement | Status | Evidence |
| :--- | :---: | :--- |
| **At least 2 players can join from separate devices** | ✅ Verified | Tested via multi-tab browser subagent and automated multi-socket tests. |
| **Join using room code** | ✅ Verified | 6-character room codes with 1-click clipboard copy. |
| **No account, login, or installation required** | ✅ Verified | Pick an avatar and nickname; instant play. |
| **Clear rules for first-time players** | ✅ Verified | Interactive "How to Play" modal in header explaining scoring formula & rules. |
| **Publicly accessible URL** | ✅ Verified | Live on Cloudflare Quick Tunnel with HTTPS & WebSockets. |
| **Synchronized screens** | ✅ Verified | Server-authoritative timer, simultaneous question delivery, instant reveal. |
| **10-player room capacity limit** | ✅ Verified | Enforced in `RoomManager.ts` and validated via automated tests. |
| **Host privileges & controls** | ✅ Verified | Host starts game, kicks players, changes question count, triggers rematches. |
| **Server-authoritative scoring & anti-cheat** | ✅ Verified | Formula `500 + floor(500 * remaining / 15)`; answer keys strictly concealed. |
| **100+ verified questions** | ✅ Verified | 105 verified questions across 7 categories in `seedQuestions.ts`. |
| **MongoDB persistence with fallback** | ✅ Verified | Full Mongoose models + robust in-memory/file fallback for offline dev. |
| **Automated test suite** | ✅ Verified | 20 automated tests passing with 100% green status. |

---

## 📄 License
MIT © 2026 Quiz Royale. All rights reserved.
