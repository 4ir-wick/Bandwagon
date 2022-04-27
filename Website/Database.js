// Import the functions you need from the SDKs you need

import { initializeApp } from "firebase/app"
import { getDatabase, push, ref, get, child } from "firebase/database";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyD0pM42q4aXEW_g3jtzCv5_D6OjKAYLVrM",
  authDomain: "bandwagon-9bad8.firebaseapp.com",
  projectId: "bandwagon-9bad8",
  storageBucket: "bandwagon-9bad8.appspot.com",
  messagingSenderId: "254159424451",
  appId: "1:254159424451:web:f61d4df4007db4c09bcb76",
  measurementId: "G-NB2EC4RYBS"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
//const analytics = getAnalytics(app);
const dbRef = ref(database);
//reads data once
get(child(dbRef, `users`)).then((snapshot) => {
  if (snapshot.exists()) {
    console.log(snapshot.val());
  } else {
    console.log("No data available");
  }
}).catch((error) => {
  console.error(error);
});

//Test push, just shows that the lists, like instruments, don't all have to be the same size
push(dbRef/users/uid, {
  username: "testname",
  pfp_url: "some link",
  instruments: {
    inst_1: "first inst",
    inst_2: "second inst",
    inst_3: "third inst"
  },
  social_links: {
    link_1: "some link"
  }
});

