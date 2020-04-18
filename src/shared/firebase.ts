import firebase from "firebase/app";
import "firebase/database";

// if (!process.env.FIREBASE_API_KEY) {
//   throw new Error("missing FIREBASE_API_KEY");
// }

const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: "patent-translation-data.firebaseapp.com",
  databaseURL: "https://patent-translation-data.firebaseio.com",
  projectId: "patent-translation-data",
  storageBucket: "patent-translation-data.appspot.com",
  messagingSenderId: "399898410810",
  appId: "1:399898410810:web:9dade115663d79c6a69a03",
};

firebase.initializeApp(firebaseConfig);

export default firebase;

export const database = firebase.database();
export const Firebase = firebase;
