# Firebase Setup Guide for Bakey Bakey VI

## Step 1: Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project"
3. Name it "bakeybakey-vi" (or your preferred name)
4. Disable Google Analytics (optional for this project)
5. Click "Create project"

## Step 2: Register Web App

1. In your Firebase project, click the Web icon (</>)
2. Register app with nickname "Bakey Bakey Website"
3. Don't check "Firebase Hosting" yet
4. Click "Register app"
5. Copy the Firebase configuration object

## Step 3: Enable Firestore Database

1. In Firebase Console, go to "Build" > "Firestore Database"
2. Click "Create database"
3. Choose "Start in test mode" (we'll add security rules later)
4. Select your preferred location (closest to USVI - "us-east1" recommended)
5. Click "Enable"

## Step 4: Set Up Firestore Rules

1. Go to "Firestore Database" > "Rules"
2. Replace the rules with:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow anyone to create orders
    match /orders/{orderId} {
      allow create: if true;
      allow read: if false; // Only you can read orders from Firebase Console
      allow update, delete: if false;
    }
  }
}
```

3. Click "Publish"

## Step 5: Update Your Project

1. Open `/Users/akouvi/Desktop/bakeybakey/src/firebase.js`
2. Replace the placeholder values with your Firebase config:

```javascript
export const firebaseConfig = {
  apiKey: "YOUR_API_KEY_HERE",
  authDomain: "your-project-id.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project-id.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef123456"
};
```

## Step 6: Test the Connection

1. Start your dev server:
```bash
npm run dev
```

2. Go to http://localhost:5173
3. Navigate to the "Order" section
4. Submit a test order
5. Check Firebase Console > Firestore Database
6. You should see a new document in the "orders" collection

## Step 7: View Orders

To view submitted orders:

1. Go to Firebase Console
2. Navigate to "Firestore Database"
3. Click on the "orders" collection
4. View all submitted orders with timestamps

## Optional: Set Up Email Notifications

To get email notifications when orders are submitted:

### Option 1: Use Firebase Extensions (Easiest)

1. Go to "Extensions" in Firebase Console
2. Install "Trigger Email" extension
3. Configure with your email settings
4. Set up a Cloud Function trigger for new orders

### Option 2: Use Cloud Functions

Create a Cloud Function that sends emails:

```javascript
const functions = require('firebase-functions');
const nodemailer = require('nodemailer');

exports.sendOrderEmail = functions.firestore
  .document('orders/{orderId}')
  .onCreate(async (snap, context) => {
    const order = snap.data();
    
    // Configure your email service
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'your-email@gmail.com',
        pass: 'your-app-password'
      }
    });

    const mailOptions = {
      from: 'your-email@gmail.com',
      to: 'bakeybakeyvi@gmail.com',
      subject: `New Order from ${order.name}`,
      text: `
        New Order Received!
        
        Name: ${order.name}
        Email: ${order.email}
        Phone: ${order.phone}
        Order Type: ${order.orderType}
        Pickup Date: ${order.pickupDate}
        
        Details:
        ${order.message}
      `
    };

    await transporter.sendMail(mailOptions);
  });
```

## Step 8: Deploy to Firebase Hosting (Optional)

1. Install Firebase CLI:
```bash
npm install -g firebase-tools
```

2. Login:
```bash
firebase login
```

3. Initialize hosting:
```bash
firebase init hosting
```

4. Configure:
   - Select your project
   - Set public directory to: `dist`
   - Configure as single-page app: Yes
   - Set up automatic builds: No

5. Build your project:
```bash
npm run build
```

6. Deploy:
```bash
firebase deploy --only hosting
```

7. Your site will be live at: `https://your-project-id.web.app`

## Security Best Practices

1. **Never commit firebase.js with real credentials to public repos**
   - Use environment variables in production
   - Keep your Firebase config private

2. **Monitor Usage**
   - Check Firebase Console regularly
   - Set up budget alerts
   - Free tier should be enough for small bakery

3. **Backup Data**
   - Export Firestore data regularly
   - Go to Firestore > Import/Export

## Troubleshooting

### Issue: "Permission denied" error
- Check Firestore Rules
- Make sure `allow create: if true` is set for orders

### Issue: Orders not showing in Firestore
- Check browser console for errors
- Verify Firebase config is correct
- Ensure Firestore is enabled

### Issue: App won't start
- Run `npm install` again
- Clear node_modules and reinstall
- Check for syntax errors in firebase.js

## Need Help?

- [Firebase Documentation](https://firebase.google.com/docs)
- [Firestore Documentation](https://firebase.google.com/docs/firestore)
- [React + Firebase Guide](https://firebase.google.com/docs/web/setup)
