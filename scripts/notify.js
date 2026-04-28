import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, serverTimestamp } from "firebase/firestore";

// Firebase configuration from src/Firebase.jsx
const firebaseConfig = {
  apiKey: "AIzaSyBBNDnlZZqR9Nnv9EqKCTtKWAX6U079eME",
  authDomain: "castedwebsite.firebaseapp.com",
  projectId: "castedwebsite",
  storageBucket: "castedwebsite.firebasestorage.app",
  messagingSenderId: "409699688675",
  appId: "1:409699688675:web:fc4ecb269e1d1b6dc9e5d6",
  measurementId: "G-P7LPS5CSLP"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function sendNotification(title, message) {
  try {
    const docRef = await addDoc(collection(db, "realtime_notifications"), {
      title,
      message,
      createdAt: serverTimestamp()
    });
    console.log("\x1b[32m%s\x1b[0m", "✔ Notification sent successfully!");
    console.log("ID:", docRef.id);
    process.exit(0);
  } catch (e) {
    console.error("\x1b[31m%s\x1b[0m", "✖ Error sending notification:", e);
    process.exit(1);
  }
}

const args = process.argv.slice(2);
if (args.length < 1) {
  console.log("\x1b[33m%s\x1b[0m", "Usage: node scripts/notify.js \"Title\" \"Message\"");
  console.log("Example: node scripts/notify.js \"Breaking News\" \"A new event has been added to the calendar!\"");
  process.exit(1);
}

const title = args.length > 1 ? args[0] : "Announcement";
const message = args.length > 1 ? args[1] : args[0];

sendNotification(title, message);
