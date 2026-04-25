import { collection, onSnapshot, query, orderBy } from "firebase/firestore";
import { db } from "../../../Firebase";

/**
 * Listens for real-time updates to the 'posts' collection in Firestore,
 * ordered by creation date.
 * @param {function} callback - The function to call with the array of posts.
 * @returns {function} An unsubscribe function to detach the listener.
 */
export const listenToPosts = (callback) => {
  const q = query(collection(db, "posts"), orderBy("createdAt", "desc"));
  const unsubscribe = onSnapshot(q, (querySnapshot) => {
    const posts = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    callback(posts);
  });
  return unsubscribe;
};
