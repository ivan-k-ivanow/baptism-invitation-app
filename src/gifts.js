import { db, giftsCollection } from './firebase.js';
import { getDocs } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
import { render } from 'https://esm.run/lit-html@1';
import { giftsTemplate } from './templates.js';

export let gifts = [];

export async function getGifts() {
    try {
        const snapshot = await getDocs(giftsCollection);
        gifts = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data(), selected: false }));
        render(giftsTemplate(gifts, toggleGift), document.getElementById("gifts-container"));
        console.log("Gifts loaded:", gifts); // за проверка
    } catch (err) {
        console.error("Error fetching gifts:", err);
    }
}

export function toggleGift(gift) {
    if (gift.reserved) return;
    gift.selected = !gift.selected;
    render(giftsTemplate(gifts, toggleGift), document.getElementById("gifts-container"));
}
