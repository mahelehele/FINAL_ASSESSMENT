# HotelBookingApp

This is a React Native (Expo-style) hotel booking demo app used for DSW02B1 Graded Lab 1.

Features implemented:
- Onboarding (first launch)
- Authentication with Firebase (Email/Password)
- Explore page with hotel listings (local + Fake Store API mapped)
- Hotel details, reviews, booking flow
- Firestore persistence for users, bookings, and reviews
- Avatar upload to Firebase Storage

Setup
1. Install dependencies
```powershell
npm install
npm install firebase
expo install expo-image-picker
```

2. Firebase
- A Firebase project has been partially configured in `src/firebase/firebase.js` using the provided config.
- Ensure Authentication (Email/Password) and Firestore are enabled in your Firebase console.
- If you need to use Analytics on web, the config includes measurementId (already set).

3. OpenWeatherMap (optional)
- To show weather in Hotel Detail, set `OPENWEATHER_API_KEY` in `src/screens/Explore/HotelDetail.js`.

4. Run the app
```powershell
npm run web
# or if using Expo CLI
expo start
```

Notes
- This project stores user profile information in Firestore under `users/{uid}` and bookings under `users/{uid}/bookings`.
- Avatar uploads use Firebase Storage and update the Firebase Auth `photoURL` and Firestore user document.
- For production, do NOT store secret keys in source files. Use environment variables or secure storage.

If you want, I can continue to polish styles, add unit tests, or implement a small edit-profile screen.
