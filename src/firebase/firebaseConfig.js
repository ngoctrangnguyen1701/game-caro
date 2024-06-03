import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import { getFirestore } from "firebase/firestore";
//refenrence https://stackoverflow.com/questions/70445014/module-not-found-error-package-path-is-not-exported-from-package

export const firebaseConfig = {
  apiKey: process.env.REACT_APP_API_KEY,
  authDomain: process.env.REACT_APP_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_PROJECT_ID,
  storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_MESSAGIN_SENDER_ID,
  appId: process.env.REACT_APP_APP_ID,
};


// Use this to initialize the firebase App
const firebaseApp = firebase.initializeApp(firebaseConfig);
// export const db = firebase.firestore()
export const db = getFirestore()

export default firebase
