var firebaseConfig = {
    apiKey: "AIzaSyD0pM42q4aXEW_g3jtzCv5_D6OjKAYLVrM",
    authDomain: "bandwagon-9bad8.firebaseapp.com",
    projectId: "bandwagon-9bad8",
    storageBucket: "bandwagon-9bad8.appspot.com",
    messagingSenderId: "254159424451",
    appId: "1:254159424451:web:f61d4df4007db4c09bcb76",
    measurementId: "G-NB2EC4RYBS",
    storageBucket: "gs://bandwagon-9bad8.appspot.com"
};

async function setupFirebase() {
    await whenAvailable("firebase");
    firebase.initializeApp(firebaseConfig);
}

setupFirebase();