// Import the functions you need from the SDKs you need
importScripts("https://www.gstatic.com/firebasejs/9.17.2/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/9.17.2/firebase-messaging-compat.js");
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
firebase.initializeApp({
  apiKey: "AIzaSyB8KaXz6Ld9wxWglLPVnlRNmC-ilm2pc0U",
  authDomain: "no-more-gorditos-1568565380998.firebaseapp.com",
  projectId: "no-more-gorditos-1568565380998",
  storageBucket: "no-more-gorditos-1568565380998.appspot.com",
  messagingSenderId: "336705362672",
  appId: "1:336705362672:web:d2e99e50153140e4f4c035",
  measurementId: "G-C2BWW2J45T",
  vapidKey: "BMaMsg1qjrnluz-caqbo86kyYpYNYosIt3AD_PwMmCFSxhQnIE5M0T9T2iIJrR01Z3GhXpF_y1kc3xHa3j1DNEo"
});

const messaging = firebase.messaging()
