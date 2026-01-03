import { html } from 'https://esm.run/lit-html@1';

export const giftTemplate = (gift, toggleGift) => html`
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

export const giftsTemplate = (gifts, toggleGift) => html`
  <h2>Примерни подаръци</h2>
  ${gifts.map(gift => giftTemplate(gift, toggleGift))}
`;
