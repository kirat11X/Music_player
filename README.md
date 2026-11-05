# 5️⃣ Vector — Broad Filesystem Audio Player

> **Experiment #5 of 6**: *Can you build production-ready Android apps with React instead of writing traditional Java / Kotlin?*  
> An advanced local audio player that conquers modern Android scoped storage boundaries using the Storage Access Framework (SAF) and DocumentsContract to index and play device music libraries, paired with online streaming discovery and a sleek surgical dark UI.

[![React](https://img.shields.io/badge/React-18-blue.svg)](https://react.dev/)
[![Capacitor](https://img.shields.io/badge/Capacitor-Android-blueviolet.svg)](https://capacitorjs.com/)
[![Vite](https://img.shields.io/badge/Vite-Fast-purple.svg)](https://vitejs.dev/)
[![Android](https://img.shields.io/badge/Platform-Android%20%7C%20Web-green.svg)](https://developer.android.com/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

---

## 📱 Pre-Compiled Android APK

A pre-compiled, installable Android debug APK is bundled directly in the root of this repository:
👉 **[`music-player-debug.apk`](./music-player-debug.apk)**

Download and install it directly on your Android phone to test local filesystem audio indexing, low-latency playback buffering, and background audio transitions.

---

## 💡 The Experiment: Conquering Scoped Storage in Web-Wrapped Android Apps

Android 11+ introduced strict Scoped Storage constraints that break traditional file path access in web runtimes. **Vector** was engineered to solve this exact bottleneck without rewriting the entire application in native Java or Kotlin:

1. **Storage Access Framework (SAF) & DocumentsContract**: Integrates native Android tree-URI folder selection. The app recursively resolves document URIs, parses metadata headers, and streams local audio tracks without requiring insecure root filesystem access.
2. **Universal Audio Codec Support**: Plays `.mp3`, `.m4a`, `.wav`, `.ogg`, `.opus`, `.aac`, and `.flac` files directly from internal storage or external SD cards.
3. **Hybrid Online & Offline Architecture**: Features a built-in Jamendo discovery catalog that streams creative-commons music over HTTPS directly from within the APK—requiring zero custom proxy backend.
4. **Surgical "Vector Noir" Interface**: High-density dark aesthetic with precision seekbars, volume attenuation, persistent mini-player overlay, and expanded full-screen now-playing vinyl/artwork view.
5. **Universal Portability**: Features a browser folder picker fallback (`webkitdirectory`) so the identical React codebase runs seamlessly in Google Chrome or desktop browsers.

---

## ⚡ Key Features

- **Local Storage Indexer**: Pick any folder on your Android device (Downloads, Music, SD Card) and immediately index all supported audio files.
- **Persistent Mini-Player**: Unobtrusive playback drawer that remains docked while you browse playlists, albums, and artists.
- **Full Now-Playing Stage**: Rich playback controls with seek bar, elapsed/remaining timers, shuffle, loop-1/loop-all, and queue manager.
- **Online Music Discovery**: Stream curated tracks across electronic, ambient, rock, and synthwave without any backend dependencies.
- **Zero-Backend Deployment**: Entire app operates self-contained—can be hosted on Vercel as a PWA or compiled directly to Android.

---

## 🛠️ Tech Stack

- **Framework**: React, Vite
- **Mobile Container**: Capacitor Android Bridge
- **Storage & System APIs**: Storage Access Framework (`OPEN_DOCUMENT_TREE`), HTML5 Web Audio API, DocumentsContract
- **Design System**: Custom "Vector Noir" high-contrast precision dark mode
- **Audio Formats**: MP3, M4A, WAV, OGG, OPUS, AAC, FLAC

---

## 📂 Project Structure

```text
├── android/                   # Native Android Capacitor project
├── src/                       # React core components and audio playback engine
├── library/                   # Local folder crawling and file indexing logic
├── mini_player_overlay/       # Docked mini-player controls
├── now_playing/               # Fullscreen stage, seek controls, and track visualization
├── playlist_details/          # Playlist compilation and track ordering
├── public/                    # Static audio assets and branding
├── music-player-debug.apk     # Pre-compiled Android APK ready for testing
├── package.json               # Dependencies and scripts
└── vite.config.js             # Vite configuration
```

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or newer)
- npm
- [Android Studio](https://developer.android.com/studio) & Android SDK (for native builds)

### 1. Clone the Repository

```bash
git clone https://github.com/kirat11X/Music_player.git
cd Music_player
npm install
```

### 2. Run in Development Mode

```bash
npm run dev
```

Open `http://localhost:5173` to test folder selection in your browser.

### 3. Build Web Bundle & Sync Capacitor

```bash
npm run build
npx cap sync android
```

### 4. Build Android Debug APK

```bash
cd android
./gradlew assembleDebug
```

The APK will be generated at:
`android/app/build/outputs/apk/debug/app-debug.apk`

---

## 🔬 The 6 React + Capacitor Android Experiments

This application is part of a 6-part research series exploring cross-platform mobile engineering with React & Capacitor:

1. 🏃‍♂️ **[Kinetic — Physical & Mental Fitness Tracker](https://github.com/kirat11X/mental-and-fitness)**: Real-time hardware pedometer sensor fusion & offline wellness.
2. 💰 **[Vault — Offline-First Expense Manager](https://github.com/kirat11X/expense-tracker)**: Zero-cloud encrypted finance, SVG charts & in-memory CSV export.
3. 🤖 **[Lumina AI — Android & Web Chatbot](https://github.com/kirat11X/AI-Chatbot-Android)**: On-device Gemini client with zero-crash offline fallback engine.
4. 🛒 **[Pulse Store — Modern E-Commerce Storefront](https://github.com/kirat11X/E-commerce)**: React 19 shopping app with variant pickers & cart calculations.
5. 🎵 **[Vector — Broad Filesystem Audio Player](https://github.com/kirat11X/Music_player)**: Storage Access Framework & deep scoped storage music crawler.
6. 🎬 **[Personal Stream — Hybrid Movie Streaming & Cinema](https://github.com/kirat11X/Movie_streaming)**: Dual-engine local media player & cloud streaming hub.

---

## 📄 License

MIT © [Kritansh (kirat11X)](https://github.com/kirat11X)
