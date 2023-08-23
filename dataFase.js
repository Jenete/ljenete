import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-app.js";
import { getFirestore, collection, doc, addDoc, getDoc, runTransaction } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js";

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyB77d5fX4Mq6w0tRiIl9_03IpWegyxDZrE",
    authDomain: "app-v1-6f6fb.firebaseapp.com",
    projectId: "app-v1-6f6fb",
    storageBucket: "app-v1-6f6fb.appspot.com",
    messagingSenderId: "616453324690",
    appId: "1:616453324690:web:9611d4d03821afef934b4b"
  };
  
  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app);
  
  // Check if it's the first time visiting the page
  let userDetails = localStorage.getItem("userDetails");
  
  if (!userDetails) {
    // Get user details
    const name = new Date().getDate();
    const email = document.referrer;
  
    console.log("Previous page: " + email);
  
    // Store user details in local storage
    userDetails = JSON.stringify({ device: name, from: email });
    localStorage.setItem("userDetails", userDetails);
  
    // Store user details in Firebase Firestore
    await addDoc(collection(db, "personal"), JSON.parse(userDetails))
      .then((docRef) => {
        console.log("User details stored in Firestore with ID: ", docRef.id);
      })
      .catch((error) => {
        console.error("Error adding user details to Firestore: ", error);
      });
  }
  
  console.log("User details: ", JSON.parse(userDetails));
  
  async function incrementVisitCount() {
    // Get the visit count document reference
    const visitCountRef = doc(db, "personal", "counter");
  
    // Use a transaction to increment the count atomically
    await runTransaction(db, (transaction) => {
      return getDoc(visitCountRef).then((doc) => {
        if (!doc.exists()) {
          // If the document doesn't exist, create it with count 1
          transaction.set(visitCountRef, { count: 1 });
          return 1;
        }
  
        // Increment the count by 1
        const newCount = doc.data().count + 1;
        transaction.update(visitCountRef, { count: newCount });
        return newCount;
      });
    })
      .then((newCount) => {
        // Display the visit count
        console.log('Total visits: ' + newCount);
      })
      .catch((error) => {
        console.log('Error updating visit count:', error);
      });
  }
  
  await incrementVisitCount();
  window.location.href = "./ProfilePage.html";
  