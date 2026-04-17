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

Install Node.js (LTS recommended):
- https://nodejs.org

Verify:

```bash
node -v
npm -v
```

### 2) Install Expo CLI

You can use Expo through `npx` (recommended, no global install needed), or install globally:

```bash
npm install -g expo-cli
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
