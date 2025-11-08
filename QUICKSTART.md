# 🚀 Quick Start Guide

## First Time Setup (5 minutes)

### 1. Install Dependencies
```bash
cd /Users/akouvi/Desktop/bakeybakey
npm install
```

### 2. Configure Firebase
Read `FIREBASE_SETUP.md` for detailed instructions, or quick version:

1. Go to https://console.firebase.google.com/
2. Create new project
3. Enable Firestore Database
4. Copy config to `src/firebase.js`

### 3. Run the Site
```bash
npm run dev
```

Visit: http://localhost:5173

---

## Common Commands

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |

---

## Customization Quick Reference

### Change Colors
Edit `src/index.css`:
```css
:root {
  --cream: #FFF8F0;
  --sage: #A8B5A0;
  --terracotta: #D4896B;
  --warm-brown: #8B6F47;
  --deep-brown: #3E2723;
}
```

### Update Menu
Edit the `products` array in `src/App.jsx` (around line 75)

### Update Contact Info
Edit the Contact section in `src/App.jsx` (around line 450)

### Add Images
1. Place images in `public/` folder
2. Reference them: `<img src="/your-image.jpg" />`

---

## Project Structure

```
bakeybakey/
├── src/
│   ├── App.jsx          # Main app (all sections here)
│   ├── App.css          # All styles
│   ├── firebase.js      # Firebase config (UPDATE THIS!)
│   ├── main.jsx         # Entry point
│   └── index.css        # Global styles & fonts
├── public/              # Static files (images go here)
├── index.html           # HTML template
└── package.json         # Dependencies
```

---

## Sections on Website

1. **Home/Hero** - Main landing with call-to-action buttons
2. **About** - Story and values
3. **Menu** - Products with pricing
4. **Order** - Order form (saves to Firebase)
5. **Contact** - Contact info and location

---

## Viewing Orders

1. Go to Firebase Console
2. Click "Firestore Database"
3. Click "orders" collection
4. View all submitted orders

---

## Deployment Options

### Option 1: Firebase Hosting (Recommended)
```bash
npm run build
firebase deploy
```

### Option 2: Netlify
1. Drag `dist` folder to app.netlify.com/drop
2. Done!

### Option 3: Vercel
```bash
vercel
```

---

## Need Help?

- Firebase issues? Read `FIREBASE_SETUP.md`
- General setup? Read `README.md`
- Email: bakeybakeyvi@gmail.com

---

## Color Palette Reference

| Color | Hex | Usage |
|-------|-----|-------|
| Cream | #FFF8F0 | Background |
| Sage | #A8B5A0 | Primary actions, icons |
| Terracotta | #D4896B | Accents |
| Warm Brown | #8B6F47 | Text, secondary |
| Deep Brown | #3E2723 | Headers, dark text |

---

## Tips

✅ **DO:**
- Test on mobile devices
- Replace placeholder image in hero
- Update social media links
- Add real bakery photos
- Set up email notifications (see FIREBASE_SETUP.md)

❌ **DON'T:**
- Commit `firebase.js` with real credentials to public repos
- Forget to update Firestore security rules
- Leave test orders in database

---

## Support

Questions? Issues? Contact bakeybakeyvi@gmail.com
