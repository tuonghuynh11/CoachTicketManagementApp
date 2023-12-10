import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";

export const firebaseConfig = {
  apiKey: "AIzaSyA_mW6Lmpk_ZPSOe1l3YHxMPtppPzJK7GM",
  authDomain: "coachticketmanagement.firebaseapp.com",
  projectId: "coachticketmanagement",
  storageBucket: "coachticketmanagement.appspot.com",
  messagingSenderId: "980708473627",
  appId: "1:980708473627:web:6d582080d0738818f6b1be",
  measurementId: "G-84C5NLXP5T",
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}
