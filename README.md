# ⚡ Lumina Weekly Bash Spinner

A futuristic, neon-styled spinning wheel app for **Lumina Bash** weekly tech sessions — pick speakers, assign tasks, and add a fun twist to your standups.

***Link 🔗: - https://lumina-bash-spinner.vercel.app/*** 

![Lumina Spinner](https://img.shields.io/badge/Next.js-14-black?logo=next.js) ![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript) ![Tailwind CSS](https://img.shields.io/badge/Tailwind-3-38bdf8?logo=tailwindcss) ![Framer Motion](https://img.shields.io/badge/Framer_Motion-11-ff0055)

---

## ✨ Features

- **Dynamic Name Management** — Add, edit, remove, and shuffle participants
- **Animated SVG Spinner Wheel** — Neon-colored segments with smooth ease-out rotation
- **Sound Effects** — Tick sounds while spinning, winner fanfare on result
- **Confetti Celebration** — Multi-color burst when a winner is selected
- **Winner Modal** — Dramatic full-screen reveal with gold glow effect
- **Persistent State** — Names saved to localStorage between sessions
- **Futuristic UI** — Dark neon theme, glassmorphism cards, particle background
- **Fully Responsive** — Works on mobile, tablet, and desktop

---

## 🗂 Project Structure

```
lumina-spinner/
├── app/
│   ├── layout.tsx          # Root layout with fonts & metadata
│   └── page.tsx            # Main page with all spinner logic
├── components/
│   ├── Header.tsx          # Animated logo + title
│   ├── SpinnerWheel.tsx    # SVG wheel with Framer Motion
│   ├── NameManager.tsx     # Add/edit/remove/shuffle names
│   ├── WinnerModal.tsx     # Winner reveal with confetti
│   └── ParticleBackground.tsx  # Canvas particle system
├── utils/
│   └── spinnerUtils.ts     # Spin math, colors, audio, localStorage
├── styles/
│   └── globals.css         # Tailwind + custom neon styles
├── public/
│   └── favicon.svg
├── package.json
├── tailwind.config.js
├── tsconfig.json
├── next.config.js
└── README.md
```

---

## 🚀 Run Locally

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Steps

```bash
# 1. Clone or download the project
cd lumina-spinner

# 2. Install dependencies
npm install

# 3. Start development server
npm run dev

# 4. Open in browser
open http://localhost:3000
```

---

## 🏗 Build for Production

```bash
# Build
npm run build

# Start production server
npm start

## 🎮 How to Use

1. **Add Names** — Type a team member's name and press Enter or click ADD
2. **Edit Names** — Click the ✎ pencil icon next to any name
3. **Remove Names** — Click the ✕ icon next to any name
4. **Shuffle Order** — Click ⇄ Shuffle to randomize the list
5. **Spin** — Click ⚡ SPIN THE WHEEL (need at least 2 names)
6. **Winner** — Enjoy the confetti and dramatic reveal!

---

## 🛠 Tech Stack

| Technology | Version | Purpose |
|-----------|---------|---------|
| Next.js | 14 | React framework (App Router) |
| TypeScript | 5 | Type safety |
| Tailwind CSS | 3 | Utility-first styling |
| Framer Motion | 11 | Animations |
| canvas-confetti | 1.9 | Celebration effect |
| react-hot-toast | 2.4 | Notifications |

---

## 🎨 Design System

- **Font Display:** Orbitron (headings, wheel labels)
- **Font Body:** Rajdhani (UI text)  
- **Font Mono:** Share Tech Mono (code/stats)
- **Primary:** `#00d4ff` (neon blue)
- **Secondary:** `#b44fff` (neon purple)
- **Accent:** `#ff2d78` (neon pink)
- **Theme:** Dark (#020408 background)

---

*Built with ⚡ for Lumina Bash weekly tech sessions*
