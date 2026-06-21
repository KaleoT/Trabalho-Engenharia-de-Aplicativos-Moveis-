import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {

  apiKey: "AIzaSyDPciGqsTP8wqRQ71Z9VnsQrXYf-Op_xwo",

  authDomain: "trabalho4-app.firebaseapp.com",

  projectId: "trabalho4-app",

  storageBucket: "trabalho4-app.firebasestorage.app",

  messagingSenderId: "501873644221",

  appId: "1:501873644221:web:76928ab1405b5229ca9dd4",

  measurementId: "G-T40ZCLJL1R"

};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);