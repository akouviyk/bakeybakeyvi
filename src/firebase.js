// Firebase configuration for Bakey Bakey VI
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

export const firebaseConfig = {
  apiKey: "AIzaSyAScJgf5DZ_RYFOhmHaXnz1TviHHesTxt4",
  authDomain: "bakeybakey-37fdc.firebaseapp.com",
  projectId: "bakeybakey-37fdc",
  storageBucket: "bakeybakey-37fdc.firebasestorage.app",
  messagingSenderId: "1025853434886",
  appId: "1:1025853434886:web:badd6e4277511f6002e787",
  measurementId: "G-XYFN22D5LG"
};

export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
