import { state, goToScreen, goHome, startFlow, formatMoney } from '../state/store.js';
import { primaryBtn, secondaryBtn, screenWrap, successIcon, faceIdIcon } from '../components.js';
import { buildTopUpScreens, insufficientNotice } from './sbpTopup.js';

const REGULAR_TOTAL = 3600;
const MEMBER_TOTAL = 3240; // цена по программе лояльности Golden Apple
const SAVINGS = REGULAR_TOTAL - MEMBER_TOTAL;

function bonus(sum) {
  return Math.round(sum * 0.03);
}

function loyaltyBadge() {
  return `
    <div class="rounded-xl bg-gold/10 px-3 py-2.5 flex items-center gap-2.5">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" class="shrink-0"><path d="M12 2l2.6 6.6L21 10l-5 4.4 1.4 6.6L12 17.8 6.6 21 8 14.4 3 10l6.4-1.4L12 2z" stroke="#B8860B" stroke-width="1.4" stroke-linejoin="round"/></svg>
      <span class="text-[13px] text-gold-dark font-medium leading-snug">Специальные цены Golden Apple по программе лояльности</span>
    </div>`;
}

function payCard() {
  if (state.user.walletStatus === 'account') {
    return `
      <div class="w-full aspect-[1.586/1] rounded-2xl card-visual p-5 flex flex-col justify-between">
        <div class="flex justify-between items-start">
          <span class="text-xs uppercase tracking-wide text-cream/60">Golden Apple</span>
          <span class="text-xs text-cream/60">•• 4471</span>
        </div>
        <div class="text-[14px] text-cream/75">Поднесите телефон к терминалу</div>
      </div>`;
  }
  return `
    <div class="w-full aspect-[1.586/1] rounded-2xl card-visual p-5 flex flex-col justify-between">
      <div class="flex justify-between items-start">
        <span class="text-xs uppercase tracking-wide text-cream/60">Кошелёк Golden Apple</span>
      </div>
      <div>
        <div class="text-[20px] font-semibold mb-1">${formatMoney(state.user.walletBalance)}</div>
        <div class="text-[13px] text-cream/70">Поднесите телефон к терминалу</div>
      </div>
    </div>`;
}

export const instoreFlow = {
  id: 'instore',
  title: 'Оплата в магазине',
  initialScreen: 'm1',

  screens: {
    m1: {
      title: 'Оплата',
      showBack: false,
      html: () => {
        if (state.user.walletStatus === 'none') {
          return screenWrap(`
            <div class="flex-1 flex flex-col items-center justify-center text-center gap-3">
              <div class="w-14 h-14 rounded-full bg-gold/15 flex items-center justify-center mb-1">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><rect x="3" y="6" width="18" height="13" rx="2" stroke="#B8860B" stroke-width="1.5"/><path d="M3 10h18" stroke="#B8860B" stroke-width="1.5"/></svg>
              </div>
              <h1 class="text-[20px] font-semibold text-graphite">Сначала откройте кошелёк</h1>
              <p class="text-[14.5px] text-graphite/60 leading-relaxed">Чтобы платить в магазинах Golden Apple телефоном, нужен кошелёк или счёт.</p>
            </div>
            <div class="pt-6">${primaryBtn('btn-m1-open-wallet', 'Открыть кошелёк')}</div>
          `);
        }
        const insufficient = state.user.walletBalance < MEMBER_TOTAL;
        return screenWrap(`
          <h1 class="text-[22px] font-semibold text-graphite mb-4">Оплата</h1>
          <div id="m1-card-area" class="cursor-pointer mb-4">${payCard()}</div>
          ${insufficient ? insufficientNotice(MEMBER_TOTAL - state.user.walletBalance) : ''}
          ${loyaltyBadge()}
          <div class="flex-1"></div>
          <div class="pt-4">${secondaryBtn('btn-m1-qr', 'Показать QR-код кассиру')}</div>
        `);
      },
      mount: (el) => {
        const openWalletBtn = el.querySelector('#btn-m1-open-wallet');
        if (openWalletBtn) {
          openWalletBtn.addEventListener('click', () => startFlow('wallet', 'a1'));
          return;
        }
        const insufficient = state.user.walletBalance < MEMBER_TOTAL;
        el.querySelector('#m1-card-area').addEventListener('click', () => goToScreen(insufficient ? 'sbp1' : 'm2'));
        el.querySelector('#btn-m1-qr').addEventListener('click', () => goToScreen(insufficient ? 'sbp1' : 'm2alt'));
      },
    },

    m2: {
      title: 'Оплата',
      showBack: false,
      html: () => screenWrap(`
        <div class="flex-1 flex flex-col items-center justify-center gap-6">
          <div class="relative w-32 h-32 flex items-center justify-center">
            <div class="nfc-wave" style="width:130px;height:130px;left:1px;top:1px;animation-delay:0s"></div>
            <div class="nfc-wave" style="width:130px;height:130px;left:1px;top:1px;animation-delay:0.6s"></div>
            <div class="nfc-wave" style="width:130px;height:130px;left:1px;top:1px;animation-delay:1.2s"></div>
            <div class="w-16 h-16 rounded-full bg-graphite flex items-center justify-center relative z-10">
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none"><path d="M6 12a6 6 0 0 1 12 0" stroke="#F2ECD8" stroke-width="1.6" stroke-linecap="round"/><path d="M3 12a9 9 0 0 1 18 0" stroke="#F2ECD8" stroke-width="1.6" stroke-linecap="round"/><circle cx="12" cy="12" r="2" fill="#F2ECD8"/></svg>
            </div>
          </div>
          <p class="text-[15px] text-graphite/60">Обмен данными с терминалом…</p>
        </div>
      `),
      mount: () => {
        const t = setTimeout(() => goToScreen('m3', { replace: true }), 1600);
        return () => clearTimeout(t);
      },
    },

    m2alt: {
      title: 'Оплата',
      showBack: true,
      html: () => screenWrap(`
        <div class="flex-1 flex flex-col items-center justify-center gap-5 text-center">
          <div class="w-52 h-52 rounded-2xl qr-placeholder bg-white border border-graphite/10 p-3">
            <div class="w-full h-full rounded-lg" style="background-image:inherit;background-size:14px 14px;"></div>
          </div>
          <div>
            <p class="text-[15px] font-medium text-graphite">Покажите этот код кассиру</p>
            <p class="text-[13px] text-graphite/50 mt-1">QR содержит ID вашей программы лояльности</p>
            <p class="text-[13px] font-mono tracking-wide text-graphite/70 mt-0.5">${state.user.loyaltyId}</p>
          </div>
          ${loyaltyBadge()}
        </div>
        <div class="pt-4">${primaryBtn('btn-m2alt-done', 'Готово')}</div>
      `),
      mount: (el) => {
        el.querySelector('#btn-m2alt-done').addEventListener('click', () => goToScreen('m3'));
      },
    },

    m3: {
      title: 'Оплата',
      showBack: false,
      html: () => screenWrap(`
        <div class="flex-1 flex flex-col items-center justify-center text-center gap-4">
          ${faceIdIcon()}
          <h1 class="text-[19px] font-semibold text-graphite">Подтвердите оплату</h1>
          <div class="flex flex-col items-center gap-0.5">
            <span class="text-[13px] text-graphite/40 line-through">${formatMoney(REGULAR_TOTAL)}</span>
            <span class="text-[17px] font-semibold text-graphite">${formatMoney(MEMBER_TOTAL)}</span>
            <span class="text-[12.5px] text-gold-dark font-medium">цена по программе лояльности</span>
          </div>
        </div>
        <div class="pt-4">${secondaryBtn('btn-m3-done', 'Готово')}</div>
      `),
      mount: (el) => {
        const advance = () => {
          state.user.walletBalance = Math.max(0, state.user.walletBalance - MEMBER_TOTAL);
          state.user.cashbackPoints += bonus(MEMBER_TOTAL);
          state.lastPurchaseTotal = MEMBER_TOTAL;
          goToScreen('m4', { replace: true });
        };
        const t = setTimeout(advance, 1100);
        el.querySelector('#btn-m3-done').addEventListener('click', () => {
          clearTimeout(t);
          advance();
        });
        return () => clearTimeout(t);
      },
    },

    m4: {
      title: 'Оплата',
      showBack: false,
      html: () => screenWrap(`
        <div class="flex-1 flex flex-col items-center justify-center text-center">
          ${successIcon()}
          <h1 class="text-[24px] font-semibold text-graphite mb-1">Оплачено</h1>
          <p class="text-[15px] text-graphite/60 mb-6">Golden Apple, магазин на Тверской</p>
          <div class="w-full rounded-2xl bg-creamDark p-4 flex flex-col gap-2 text-left">
            <div class="flex justify-between"><span class="text-[14px] text-graphite/60">Обычная цена</span><span class="text-[15px] text-graphite/40 line-through">${formatMoney(REGULAR_TOTAL)}</span></div>
            <div class="flex justify-between"><span class="text-[14px] text-graphite/60">Цена по программе лояльности</span><span class="text-[15px] font-medium text-graphite">${formatMoney(MEMBER_TOTAL)}</span></div>
            <div class="flex justify-between"><span class="text-[14px] text-graphite/60">Ваша экономия</span><span class="text-[15px] font-medium text-gold-dark">−${formatMoney(SAVINGS)}</span></div>
            <div class="flex justify-between pt-2 border-t border-graphite/10"><span class="text-[14px] text-graphite/60">Начислено бонусов</span><span class="text-[15px] font-medium text-gold-dark">+${bonus(MEMBER_TOTAL)}</span></div>
          </div>
        </div>
        <div class="pt-6">${primaryBtn('btn-m4-done', 'Готово')}</div>
      `),
      mount: (el) => {
        el.querySelector('#btn-m4-done').addEventListener('click', () => goHome());
      },
    },

    ...buildTopUpScreens({
      getMissing: () => MEMBER_TOTAL - state.user.walletBalance,
      nextScreen: 'm3',
      title: 'Оплата',
    }),
  },
};
