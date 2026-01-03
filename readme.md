
# Viktor's Baptism Invitation SPA

This is a **single-page web application** for Viktor's baptism invitation. It allows guests to:

- Confirm attendance
- Enter the number of children
- Select and reserve gifts
- See visual feedback for reserved gifts

---

## How it works

The application is hosted on **GitHub Pages**, which serves `index.html` as a static site. CSS, JS, and images are loaded via **relative paths** (e.g., `styles/styles.css`, `src/app.js`). When the page loads, the browser applies the CSS and executes the JavaScript to render the interactive page.

### Firebase Integration

- Firebase is initialized in `firebase.js` using the provided configuration.  
- Two **Firestore collections** are used:  
  - `guests` – stores guest data (name, attendance, number of children)  
  - `gifts` – stores gift items and reservation status  
- Functions `addGuestToDB` and `reserveGiftInDB` handle saving guest data and updating gift reservations in Firestore.

### Gifts

- `getGifts()` in `gifts.js` fetches all gifts from Firestore, stores them in a local array `gifts`, and renders them using **lit-html**.  
- `toggleGift(gift)` changes the visual state of a gift button (selected or grayed out) **without immediately saving** to Firestore.  

### Attendance Form

- The form listens for submission via `attendenceFormSubmit()`.  
- On submit:
  1. Guest data (name and number of children) is retrieved with `getGuestData()`.  
  2. If the name field is empty, an error message is shown using `showMessage()`.  
  3. Otherwise, guest information is saved in Firestore.  
  4. Any selected gifts are reserved in Firestore.  
  5. The UI updates and a thank-you message is displayed.  

### Templates and Rendering

- `templates.js` defines HTML templates:
  - `giftTemplate` – for individual gifts  
  - `giftsTemplate` – for the full gift list  
- **lit-html** dynamically renders templates into the DOM. Any state change triggers re-rendering.

### Messages

- `showMessage(text, type)` displays temporary messages in `#message-container` with styles based on the type (`success` or `error`) and disappears after a few seconds.

---

## Summary of the Flow

1. User opens the GitHub Pages link → `index.html` loads.  
2. CSS is applied → page design and background appear.  
3. JS files load → Firebase is initialized, gifts are fetched.  
4. Gifts are displayed with buttons → guests can select (toggle) visually.  
5. Guests fill out the form (name and number of children) and submit.  
6. Guest data and selected gift reservations are saved in Firestore.  
7. UI updates to reflect reserved gifts.  
8. A thank-you message is displayed.  

All logic runs **client-side**, with Firestore as the backend database.
