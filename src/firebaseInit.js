
import { initializeApp } from 'firebase/app';
import firebaseConfig from './firebaseVars';

export const firebaseApp = initializeApp(firebaseConfig[process.env.REACT_APP_FIREBASE_CONFIG]);