import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getFirestore, collection, getDocs, addDoc, doc, updateDoc } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyAS2GKhmnvAG5AukET0cwdWjcmdUUDUXws",
    authDomain: "viktor-baptism-invite.firebaseapp.com",
    projectId: "viktor-baptism-invite",
    storageBucket: "viktor-baptism-invite.firebasestorage.app",
    messagingSenderId: "688838016136",
    appId: "1:688838016136:web:eda10aadbab7030e45b33d"
};

export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

export const giftsCollection = collection(db, "gifts");
export const guestsCollection = collection(db, "guests");

export async function addGuestToDB(guestData, attendance) {
    await addDoc(guestsCollection, {
        name: guestData.name,
        attendance,
        kids: guestData.kids,
        createdAt: new Date().toISOString()
    });
}

export async function reserveGiftInDB(gift, guestName) {
    const giftRef = doc(db, "gifts", gift.id);
    await updateDoc(giftRef, {
        reserved: true,
        reservedBy: guestName
    });
}
