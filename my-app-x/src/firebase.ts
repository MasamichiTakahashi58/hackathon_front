import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";

const firebaseConfig = {
    apiKey: process.env.REACT_APP_API_KEY,
    authDomain: process.env.REACT_APP_AUTH_DOMAIN,
    projectId: process.env.REACT_APP_PROJECT_ID,
    storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
    messagingSenderId: process.env.REACT_APP_MESSAGEING_SENDER_ID,
    appId: process.env.REACT_APP_APP_ID,
};

const app = initializeApp(firebaseConfig);

export const fireAuth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

export const registerWithEmailAndPassword = (email: string, password: string) => {
    return createUserWithEmailAndPassword(fireAuth, email, password);
};

export const loginWithEmailAndPassword = (email: string, password: string) => {
    return signInWithEmailAndPassword(fireAuth, email, password);
};
