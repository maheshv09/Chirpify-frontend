// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getDatabase, ref, child, set } from "firebase/database";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCwcX8_a1YdSpbMJWsWDzmvfN7rVQu_oDo",
  authDomain: "twitter-clone-ad386.firebaseapp.com",
  projectId: "twitter-clone-ad386",
  storageBucket: "twitter-clone-ad386.appspot.com",
  messagingSenderId: "183057011676",
  appId: "1:183057011676:web:2396d99089658101b4b519",
  measurementId: "G-EWLMTV2MQ9",
  databaseURL:
    "https://twitter-clone-ad386-default-rtdb.asia-southeast1.firebasedatabase.app/",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

const auth = getAuth(app);

const db = getDatabase();

export const setLoginAttempts = (userId, attempts) => {
  set(ref(db, `loginAttempts/${userId}`), attempts);
};

export default auth;
