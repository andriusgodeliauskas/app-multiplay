# app-multiplay - Cross-Platform Learning Game

## Overview
A cross-platform mobile application built with Expo (React Native). Features a tabbed interface with a math learning game ("Learn & Earn") and a "Monster Room" feature. Runs on Android, iOS, and Web.

## Tech Stack
- **Framework**: Expo 54, React Native 0.81
- **Navigation**: React Navigation 7 (Material Top Tabs)
- **State/Storage**: AsyncStorage
- **Animations**: React Native Reanimated
- **Icons**: Lucide React Native

## Project Structure
```
app-multiplay/
├── App.js              # Main entry point with navigation
├── app.json            # Expo configuration
├── index.js            # App registration
├── src/
│   ├── screens/        # Screen components (MathScreen, MonsterScreen)
│   ├── components/     # Reusable components
│   ├── context/        # React Context (GameContext)
│   └── constants/      # Theme and constants
├── assets/             # Images and fonts
├── dist/               # Web build output
└── package.json
```

## Commands
```bash
npm install              # Install dependencies
npx expo start           # Start Expo dev server
npx expo start --android # Start on Android
npx expo start --ios     # Start on iOS
npx expo start --web     # Start in browser
npm run build            # Build for web (exports to dist/)
```

## Key Features
- **Math Learning**: Educational math exercises with rewards
- **Monster Room**: Gamification feature
- **Multi-language**: Internationalization via GameContext
- **Cross-platform**: Single codebase for mobile and web

## Development Notes
- Entry point is `App.js` with tab navigation setup
- Game state managed through `GameContext`
- Theme colors defined in `src/constants/theme.js`
- Uses Material Top Tabs for screen navigation
- Web deployment via Vercel (`vercel.json` configured)
