import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
//refenrence https://stackoverflow.com/questions/70445014/module-not-found-error-package-path-is-not-exported-from-package

const firebaseConfig = {
  apiKey: "AIzaSyDN5Zgs8Q86hc7H82ZJEF5H0C8pKrIIbOg",
  authDomain: "game-caro-73268.firebaseapp.com",
  projectId: "game-caro-73268",
  storageBucket: "game-caro-73268.appspot.com",
  messagingSenderId: "699372360865",
  appId: "1:699372360865:web:be137c04320fcc52ea4ce0"
};

// Use this to initialize the firebase App
const firebaseApp = firebase.initializeApp(firebaseConfig);

export default firebase