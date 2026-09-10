// Переиспользуемый саб-флоу «пополнение кошелька через СБП me2me».
// Подмешивается в screens конкретного флоу через buildTopUpScreens(),
// поэтому экраны 'sbp1'..'sbp4' существуют независимо в online- и instore-флоу.

import { state, goToScreen, formatMoney } from '../state/store.js';
import { primaryBtn, screenWrap, spinnerBlock, successIcon } from '../components.js';

const BANKS = [
  { id: 'sber', name: 'Сбербанк', initials: 'СБ' },
  { id: 'tbank', name: 'Т-Банк', initials: 'Т' },
  { id: 'alfa', name: 'Альфа-Банк', initials: 'А' },
  { id: 'vtb', name: 'ВТБ', initials: 'В' },
];

function warnIcon() {
  return `<svg width="17" height="17" viewBox="0 0 24 24" fill="none" class="shrink-0 mt-0.5"><path d="M12 3.5l9.5 16.5H2.5L12 3.5z" stroke="#B4432E" stroke-width="1.6" stroke-linejoin="round"/><path d="M12 10v4.5" stroke="#B4432E" stroke-width="1.6" stroke-linecap="round"/><circle cx="12" cy="17" r="0.9" fill="#B4432E"/></svg>`;
}

export function insufficientNotice(missing) {
  return `
    <div class="rounded-xl bg-[#FBEDE9] border border-[#F0D2C9] px-3 py-2.5 mb-4 flex items-start gap-2.5">
      ${warnIcon()}
      <span class="text-[13px] text-[#8A3624] leading-snug">Недостаточно средств — не хватает ${formatMoney(missing)}. Пополните кошелёк через СБП с карты другого банка.</span>
    </div>`;
}

// getMissing: () => число ₽, сколько не хватает (вызывается при входе на sbp1)
// nextScreen: id экрана этого же флоу, на который перейти после пополнения
export function buildTopUpScreens({ getMissing, nextScreen, title }) {
  let selectedBank = null;
  let topUpAmount = 0;

  return {
    sbp1: {
      title,
      showBack: true,
      html: () => {
        const missing = Math.max(0, getMissing());
        topUpAmount = Math.max(1000, Math.ceil(missing / 1000) * 1000);
        return screenWrap(`
          <h1 class="text-[22px] font-semibold text-graphite mb-2">Пополнение через СБП</h1>
          ${insufficientNotice(missing)}
          <p class="text-[13px] font-semibold tracking-wide uppercase text-graphite/40 mb-1">Выберите банк</p>
          <div class="flex flex-col divide-y divide-graphite/10 rounded-2xl bg-creamDark px-4 mb-3">
            ${BANKS.map((b) => `
              <button data-bank="${b.id}" class="flex items-center gap-3 py-3.5 w-full text-left">
                <div class="w-10 h-10 rounded-full bg-white flex items-center justify-center shrink-0 text-[13px] font-semibold text-graphite/70">${b.initials}</div>
                <span class="text-[15px] text-graphite flex-1">${b.name}</span>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M9 5l7 7-7 7" stroke="#3A3226" stroke-opacity="0.35" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>
              </button>
            `).join('')}
          </div>
          <p class="text-[12px] text-graphite/40">Переведём ${formatMoney(topUpAmount)} — с небольшим запасом на покупку</p>
        `);
      },
      mount: (el) => {
        el.querySelectorAll('[data-bank]').forEach((btn) => {
          btn.addEventListener('click', () => {
            selectedBank = BANKS.find((b) => b.id === btn.dataset.bank);
            goToScreen('sbp2');
          });
        });
      },
    },

    sbp2: {
      title,
      showBack: false,
      html: () => spinnerBlock(`Подтверждаем перевод в ${selectedBank ? selectedBank.name : 'банке'}…`),
      mount: () => {
        const t = setTimeout(() => goToScreen('sbp3', { replace: true }), 1300);
        return () => clearTimeout(t);
      },
    },

    sbp3: {
      title,
      showBack: false,
      html: () => spinnerBlock(`Переводим ${formatMoney(topUpAmount)} через СБП…`),
      mount: () => {
        const t = setTimeout(() => {
          state.user.walletBalance += topUpAmount;
          goToScreen('sbp4', { replace: true });
        }, 1100);
        return () => clearTimeout(t);
      },
    },

    sbp4: {
      title,
      showBack: false,
      html: () => screenWrap(`
        <div class="flex-1 flex flex-col items-center justify-center text-center">
          ${successIcon()}
          <h1 class="text-[22px] font-semibold text-graphite mb-1">Кошелёк пополнен</h1>
          <p class="text-[14.5px] text-graphite/60 mb-6">+${formatMoney(topUpAmount)} с карты ${selectedBank ? selectedBank.name : ''}</p>
          <div class="w-full rounded-2xl bg-creamDark p-4 flex justify-between items-center">
            <span class="text-[14px] text-graphite/60">Баланс кошелька</span>
            <span class="text-[16px] font-semibold text-graphite">${formatMoney(state.user.walletBalance)}</span>
          </div>
        </div>
        <div class="pt-6">${primaryBtn('btn-sbp4-continue', 'Оплатить')}</div>
      `),
      mount: (el) => {
        el.querySelector('#btn-sbp4-continue').addEventListener('click', () => goToScreen(nextScreen, { replace: true }));
      },
    },
  };
}
