import { getGifts, gifts, toggleGift } from './gifts.js';
import { addGuestToDB, reserveGiftInDB } from './firebase.js';
import { render } from 'https://esm.run/lit-html@1';
import { giftsTemplate } from './templates.js';
import { showMessage } from './utils.js';

export function getGuestData() {
    const form = document.querySelector("#attendence-form");
    const name = form.querySelector("input[name='guestName']").value.trim();
    const kidsCount = form.querySelector("input[name='kidsCount']").value.trim();
    return { name, kids: kidsCount };
}

export function attendenceFormSubmit() {
    const form = document.querySelector("#attendence-form");

    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        const guestData = getGuestData();
        if (!guestData.name) {
            showMessage("Моля, въведете името си.", "error");
            return;
        }

        const attendance = form.querySelector("select").value;
        await addGuestToDB(guestData, attendance);

        const selectedGifts = gifts.filter(g => g.selected);
        for (const gift of selectedGifts) {
            await reserveGiftInDB(gift, guestData.name);
            gift.reserved = true;
            gift.selected = false;
        }

        render(giftsTemplate(gifts, toggleGift), document.querySelector("#gifts-container"));
        showMessage("Благодарим за потвърждението! 🎉");
    });
}
