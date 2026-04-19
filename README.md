# MoodSense AI — Version 15 (Android App Base with Expo)

This version introduces a mobile-first Android app base for **MoodSense AI** using **Expo (React Native)** with **NativeWind** and **Axios**.

## Tech Stack

- Expo (React Native)
- NativeWind (Tailwind CSS for React Native)
- Axios

## Implemented Features

- Authentication screens:
  - Login
  - Signup
- Basic dashboard:
  - Today Mood card
  - Simple emotion display
  - Static UI (no backend integration yet)
- UI style:
  - White + Blue theme
  - Rounded cards
  - Dark mode support

## Mobile App Folder Structure

The Expo app is located in `mobile/`:

```text
mobile/
├── App.js
├── app.json
├── babel.config.js
├── tailwind.config.js
├── metro.config.js
├── screens/
├── components/
├── services/
├── store/
└── utils/
```

## Prerequisites

### 1) Install Node.js

Install Node.js **18 or 20 LTS** (recommended for Expo SDK 51):
- https://nodejs.org

Verify:

```bash
node -v
npm -v
```

### 2) Expo CLI usage

Use Expo through `npx` (recommended). Do **not** use the old global `expo-cli` package.

If you installed legacy global CLI earlier, remove it:

```bash
npm uninstall -g expo-cli
```

## Run the Project

From repository root:

```bash
cd mobile
npm install
npx expo start
```

## Run on Phone using Expo Go

1. Install **Expo Go** on your Android phone from Google Play Store.
2. Ensure your laptop and phone are on the same Wi-Fi network.
3. Run:

```bash
cd mobile
npx expo start
```

4. Scan the QR code shown in terminal/browser using Expo Go.
5. The app will open on your phone.

## Run on Laptop Emulator

After starting Expo:

```bash
cd mobile
npm run android
```

(Requires Android Studio emulator configured.)

## Notes

- This base is static UI only and prepared for backend integration later.
- Axios client is scaffolded in `mobile/services/api.js` for future API wiring.
- The setup is designed to run easily on both laptop and mobile devices.


## Troubleshooting (Windows / Node mismatch)

If you see this error when starting Expo:

`Package subpath ./src/lib/TerminalReporter is not defined by "exports" in node_modules/metro/package.json`

Use these steps:

1. Make sure Node.js is 18 or 20 (`node -v`).
2. Delete old modules and lock file in `mobile/`.
3. Reinstall with clean dependency resolution.
4. Verify Metro version is pinned to `0.80.12`.

```bash
cd mobile
rm -rf node_modules package-lock.json
npm cache clean --force
npm install
npm ls metro
npx expo start
```


`npm ls metro` should show `metro@0.80.12` near the top. If it shows another major/minor version, run a fresh install again before starting Expo.

On PowerShell, remove folders/files with:

```powershell
Remove-Item -Recurse -Force node_modules
Remove-Item -Force package-lock.json
```

This project pins Metro-compatible versions via `package.json` `overrides` to avoid that crash.
