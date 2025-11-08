# 🍰 Bakey Bakey VI Website

A beautiful, minimal website for Bakey Bakey VI - a vegan bakery in the US Virgin Islands.

## Features

- ✨ Clean, modern design inspired by bakery aesthetics
- 📱 Fully responsive (mobile, tablet, desktop)
- 🔥 Firebase integration for order management
- 🎨 Beautiful color palette with island vibes
- 📝 Contact and order forms
- 🍪 Menu showcase with pricing
- 💚 Vegan-focused branding

## Tech Stack

- **React** - UI library
- **Vite** - Build tool
- **Firebase** - Database for order submissions
- **Lucide React** - Beautiful icons

## Setup Instructions

### 1. Install Dependencies

```bash
cd /Users/akouvi/Desktop/bakeybakey
npm install
```

### 2. Configure Firebase

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project (or use existing one)
3. Enable Firestore Database
4. Get your Firebase config from Project Settings
5. Update `src/firebase.js` with your config values:

```javascript
export const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};
```

### 3. Set Up Firestore Security Rules

In Firebase Console, go to Firestore Database > Rules and add:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /orders/{document=**} {
      allow read: if request.auth != null;
      allow create: if true;
    }
  }
}
```

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### 5. Build for Production

```bash
npm run build
```

The build files will be in the `dist` folder.

## Project Structure

```
bakeybakey/
├── src/
│   ├── App.jsx          # Main application component
│   ├── App.css          # Styles
│   ├── main.jsx         # Entry point
│   ├── index.css        # Global styles
│   └── firebase.js      # Firebase configuration
├── index.html           # HTML template
├── package.json         # Dependencies
└── vite.config.js       # Vite configuration
```

## Customization

### Colors

Edit CSS variables in `src/index.css`:

```css
:root {
  --cream: #FFF8F0;
  --sage: #A8B5A0;
  --terracotta: #D4896B;
  --warm-brown: #8B6F47;
  --deep-brown: #3E2723;
}
```

### Menu Items

Edit the `products` array in `src/App.jsx` to update menu items and pricing.

### Contact Information

Update contact details in the Contact section of `src/App.jsx`.

## Deployment

### Deploy to Firebase Hosting

1. Install Firebase CLI:
```bash
npm install -g firebase-tools
```

2. Login to Firebase:
```bash
firebase login
```

3. Initialize Firebase Hosting:
```bash
firebase init hosting
```

4. Build and deploy:
```bash
npm run build
firebase deploy
```

### Deploy to Netlify

1. Build the project:
```bash
npm run build
```

2. Drag and drop the `dist` folder to [Netlify Drop](https://app.netlify.com/drop)

### Deploy to Vercel

1. Install Vercel CLI:
```bash
npm install -g vercel
```

2. Deploy:
```bash
vercel
```

## Adding Images

To replace placeholder images:

1. Add your images to the `public` folder
2. Update image references in `src/App.jsx`

Example:
```jsx
<img src="/hero-image.jpg" alt="Bakey Bakey VI" />
```

## Support

For questions or issues, contact: bakeybakeyvi@gmail.com

## License

Private - © 2025 Bakey Bakey VI
