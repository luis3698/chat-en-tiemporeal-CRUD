const firebase = require("firebase/app");
require("firebase/auth");
require("firebase/firestore");
require("firebase/storage");


const config = {
  apiKey: "AIzaSyDD44URUKLYqanfB30Q_lIAx8PzvRUPgZg",
  authDomain: "crud-e68c5.firebaseapp.com",
  projectId: "crud-e68c5",
  storageBucket: "crud-e68c5.appspot.com",
  messagingSenderId: "274186033422",
  appId: "1:274186033422:web:60bdd9b337470c16505f5f"
};
firebase.initializeApp(config);

const db = firebase.firestore();
const auth = firebase.auth();
const storage = firebase.storage();

export {firebase, db, auth, storage}