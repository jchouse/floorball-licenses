
import { initializeApp } from 'firebase/app';

const firebaseConfig = {
  development: {
    apiKey: "AIzaSyAWRuCIuCQyWs0RrPIxWa3DZec8YH0kkno",
    authDomain: "floorball-b5840.firebaseapp.com",
    databaseURL: "https://floorball-b5840.firebaseio.com",
    projectId: "floorball-b5840",
    storageBucket: "floorball-b5840.appspot.com",
    messagingSenderId: "1090032152613",
    appId: "1:1090032152613:web:a042f4aa9ea60389c80fcc",
    measurementId: "G-CZ7C5NDQT7"
  },
  production: {
    apiKey: 'AIzaSyAy29_IMomdhdo6T78SRkuuUipaZDlQOMc',
    authDomain: 'floorball-prod.firebaseapp.com',
    databaseURL: 'https://floorball-prod.firebaseio.com',
    projectId: 'floorball-prod',
    storageBucket: 'floorball-prod.appspot.com',
    messagingSenderId: '143696099640',
  },
};

export const firebaseApp = initializeApp(firebaseConfig[process.env.REACT_APP_FIREBASE_CONFIG]);