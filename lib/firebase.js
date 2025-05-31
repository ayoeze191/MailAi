import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
const GoogleProvider = new GoogleAuthProvider();

// TODO: Replace the following with your app's Firebase project configuration
const firebaseConfig = {
  apiKey: "AIzaSyBj3KV_aWVbQAKn-fypaCpHP7gd9UiIYYY",
  authDomain: "mailai-f3272.firebaseapp.com",
  projectId: "mailai-f3272",
  storageBucket: "mailai-f3272.firebasestorage.app",
  messagingSenderId: "94836779549",
  appId: "1:94836779549:web:c637640e12c70a5e0574f4",
};

const app = initializeApp(firebaseConfig);
const firebaseAuth = getAuth(app);
export { firebaseAuth, GoogleProvider };
