// Firebase init
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

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Lit-html
import { html, render } from 'https://esm.run/lit-html@1';

// Глобален масив с подаръците
let gifts = [];

// Шаблони
const giftTemplate = (gift) => html`
  <div class="gift-item">
    <span>${gift.name}</span>
    <button
      class=${gift.reserved ? 'reserved' : gift.selected ? 'selected' : ''}
      ?disabled=${gift.reserved}
      @click=${() => toggleGift(gift)}
    >
      ${gift.reserved ? 'Резервирано' : 'Резервирай'}
    </button>
  </div>
`;

const giftsTemplate = (gifts) => html`
  <h2>Примерни подаръци</h2>
  ${gifts.map(gift => giftTemplate(gift))}
`;

// Взимане на подаръците от Firestore
async function getGifts() {
    try {
        const giftsCol = collection(db, "gifts");
        const snapshot = await getDocs(giftsCol);
        gifts = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
            selected: false // за визуален toggle
        }));

        render(giftsTemplate(gifts), document.querySelector("#gifts-container"));
    } catch (err) {
        console.error("Error fetching gifts:", err);
    }
}

// Toggle на визуалното състояние на бутоните
function toggleGift(gift) {
    if (gift.reserved) return; // не може да toggle-ва вече резервирани
    gift.selected = !gift.selected;
    render(giftsTemplate(gifts), document.querySelector("#gifts-container"));
}

// Взимаме данните от формата
function getGuestData() {
    const form = document.querySelector("#attendence-form");
    const name = form.querySelector("input[name='guestName']").value.trim();
    const kidsCount = form.querySelector("input[name='kidsCount']").value.trim();
    const guestData = {
        name: name,
        kids: kidsCount
    }
    return guestData;
}



// Добавяне на гост във Firestore
async function addGuestToDB(guestData, attendance) {
    try {
        const guestsCol = collection(db, "guests");
        await addDoc(guestsCol, {
            name: guestData.name,
            attendance,
            createdAt: new Date().toISOString(),
            kids: guestData.kids
        });
    } catch (err) {
        console.error("Error adding guest:", err);
    }
}

// Submit на формата
function attendenceFormSubmit() {
    const form = document.querySelector("#attendence-form");

    form.addEventListener("submit", async (e) => {
        e.preventDefault();s
        const guestData = getGuestData();
        if (!guestData.name) {
            showMessage("Моля, въведете името си.", "error");
            return;
        }

        const attendanceSelect = form.querySelector("select");
        const attendance = attendanceSelect.value;

        // записваме госта
        await addGuestToDB(guestData, attendance);

        // записваме избраните подаръци
        const selectedGifts = gifts.filter(g => g.selected);
        for (const gift of selectedGifts) {
            const giftRef = doc(db, "gifts", gift.id);
            await updateDoc(giftRef, {
                reserved: true,
                reservedBy: guestData.name
            });
            gift.reserved = true;
            gift.selected = false; // вече не е toggle
        }

        // обновяваме UI
        render(giftsTemplate(gifts), document.querySelector("#gifts-container"));

        showMessage("Благодарим за потвърждението! 🎉");
    });
}

function showMessage(text, type = "success") {
    const container = document.querySelector("#message-container");
    container.textContent = text;
    container.className = type; // може да имаш различни стилове за success / error

    // Изчезва след 3 секунди
    setTimeout(() => {
        container.textContent = "";
        container.className = "";
    }, 6000);
}



// Инициализация
attendenceFormSubmit();
getGifts();



