# Music Player APK

React + Vite music player packaged with Capacitor Android. The app is self-contained: it does not need a custom backend.

## Features

- Online music discovery streams free Jamendo tracks directly from the APK over HTTPS.
- Local library can play selected audio folders.
- Android APK uses a native Storage Access Framework folder picker for local MP3/M4A/WAV/OGG/OPUS/AAC/FLAC files.
- Web fallback uses the browser folder picker.
- Dark frontend based on the provided design folders: surgical surfaces, compact lists, mini player, and full now-playing screen.

## Commands

```bash
npm run dev
npm run build
npx cap sync android
cd android
JAVA_HOME=/home/kirat/.local/temurin-21 ./gradlew assembleDebug
```

Debug APK output:

```text
android/app/build/outputs/apk/debug/app-debug.apk
```
