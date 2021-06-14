require("dotenv").config();
const firebase = require("firebase");

var firebaseConfig = {
  apiKey: process.env.FIREBASE_APIKEY,
  authDomain: "classroom-bot-8c45f.firebaseapp.com",
  projectId: "classroom-bot-8c45f",
  storageBucket: "classroom-bot-8c45f.appspot.com",
  messagingSenderId: "493234176439",
  appId: "1:493234176439:web:5cfe8f98de17405890a832",
};
// Initialize Firebase
const app = !firebase.apps.length
  ? firebase.initializeApp(firebaseConfig)
  : firebase.app();

const db = app.firestore();

exports.db = db;
