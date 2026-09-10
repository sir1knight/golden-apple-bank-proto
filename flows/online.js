import { state, goToScreen, goHome, startFlow, formatMoney } from '../state/store.js';
import { primaryBtn, secondaryBtn, screenWrap, successIcon, faceIdIcon } from '../components.js';

const items = [
  { name: 'Увлажняющий крем для лица', price: 2190 },
  { name: 'Тушь для ресниц «Объём»', price: 890 },
  { name: 'Парфюмерная вода, 50 мл', price: 4990 },
];
const total = items.reduce((s, i) => s + i.price, 0);

function cashback(sum) {
  return Math.round(sum * 0.03);
}

export const onlineFlow = {
  id: 'online',
  title: 'Оплата заказа онлайн',
  initialScreen: 'o1',

  screens: {
    o1: {
      title: 'Корзина',
      showBack: false,
      html: () => screenWrap(`
        <h1 class="text-[22px] font-semibold text-graphite mb-4">Ваша корзина</h1>
        <div class="flex flex-col divide-y divide-graphite/10 mb-4">
          ${items.map((i) => `
            <div class="flex items-center gap-3 py-3.5">
              <div class="w-12 h-12 rounded-xl bg-creamDark shrink-0 flex items-center justify-center">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M6 2l1.5 4h9L18 2" stroke="#B8860B" stroke-width="1.5" stroke-linecap="round"/><rect x="4" y="6" width="16" height="15" rx="2" stroke="#B8860B" stroke-width="1.5"/></svg>
              </div>
              <div class="flex-1">
                <p class="text-[14.5px] text-graphite leading-snug">${i.name}</p>
              </div>
              <span class="text-[14.5px] font-medium text-graphite">${formatMoney(i.price)}</span>
            </div>
          `).join('')}
        </div>
        <div class="flex-1"></div>
        <div class="flex items-center justify-between py-3 border-t border-graphite/10 mb-4">
          <span class="text-[15px] text-graphite/70">Итого</span>
          <span class="text-[19px] font-semibold text-graphite">${formatMoney(total)}</span>
        </div>
        <div>${primaryBtn('btn-o1-checkout', 'Оформить заказ')}</div>
      `),
      mount: (el) => {
        state.lastOrderTotal = total;
        el.querySelector('#btn-o1-checkout').addEventListener('click', () => goToScreen('o2'));
      },
    },

    o2: {
      title: 'Оплата заказа онлайн',
      showBack: true,
      html: () => {
        if (state.user.walletStatus === 'none') {
          return screenWrap(`
            <div class="flex-1 flex flex-col items-center justify-center text-center gap-3">
              <div class="w-14 h-14 rounded-full bg-gold/15 flex items-center justify-center mb-1">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M3 7l9-4 9 4-9 4-9-4z" stroke="#B8860B" stroke-width="1.5" stroke-linejoin="round"/><path d="M3 7v10l9 4 9-4V7" stroke="#B8860B" stroke-width="1.5" stroke-linejoin="round"/></svg>
              </div>
              <h1 class="text-[20px] font-semibold text-graphite">Откройте кошелёк, чтобы платить с кэшбэком</h1>
              <p class="text-[14.5px] text-graphite/60 leading-relaxed">Кошелёк Golden Apple открывается за пару минут — потом сможете платить им в этом заказе.</p>
            </div>
            <div class="pt-6">${primaryBtn('btn-o2-open-wallet', 'Открыть кошелёк')}</div>
          `);
        }
        const cb = cashback(total);
        return screenWrap(`
          <h1 class="text-[22px] font-semibold text-graphite mb-4">Оплата заказа</h1>
          <div class="rounded-2xl bg-creamDark p-4 flex items-center gap-3 mb-4">
            <div class="w-10 h-10 rounded-full bg-gold/15 flex items-center justify-center shrink-0">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M3 7l9-4 9 4-9 4-9-4z" stroke="#B8860B" stroke-width="1.5" stroke-linejoin="round"/><path d="M3 7v10l9 4 9-4V7" stroke="#B8860B" stroke-width="1.5" stroke-linejoin="round"/></svg>
            </div>
            <div class="flex-1">
              <p class="text-[15px] font-medium text-graphite">Кошелёк Golden Apple</p>
              <p class="text-[13px] text-graphite/55">Баланс: ${formatMoney(state.user.walletBalance)}</p>
            </div>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M5 13l4 4L19 7" stroke="#B8860B" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
          </div>
          <div class="flex-1"></div>
          <div class="flex items-center justify-between py-2">
            <span class="text-[14.5px] text-graphite/60">Сумма заказа</span>
            <span class="text-[15px] font-medium text-graphite">${formatMoney(total)}</span>
          </div>
          <div class="flex items-center justify-between py-2 mb-4">
            <span class="text-[14.5px] text-graphite/60">Кэшбэк за покупку</span>
            <span class="text-[15px] font-medium text-gold-dark">+${cb} баллов</span>
          </div>
          <div>${primaryBtn('btn-o2-pay', 'Оплатить')}</div>
        `);
      },
      mount: (el) => {
        const openWalletBtn = el.querySelector('#btn-o2-open-wallet');
        if (openWalletBtn) {
          openWalletBtn.addEventListener('click', () => startFlow('wallet', 'a1'));
          return;
        }
        el.querySelector('#btn-o2-pay').addEventListener('click', () => goToScreen('o3'));
      },
    },

    o3: {
      title: 'Оплата заказа онлайн',
      showBack: false,
      html: () => screenWrap(`
        <div class="flex-1 flex flex-col items-center justify-center text-center gap-4">
          ${faceIdIcon()}
          <h1 class="text-[19px] font-semibold text-graphite">Подтвердите оплату</h1>
          <p class="text-[14.5px] text-graphite/55">${formatMoney(total)} · Кошелёк Golden Apple</p>
        </div>
        <div class="pt-4">${secondaryBtn('btn-o3-done', 'Готово')}</div>
      `),
      mount: (el) => {
        const advance = () => {
          state.user.walletBalance = Math.max(0, state.user.walletBalance - total);
          state.user.cashbackPoints += cashback(total);
          goToScreen('o4', { replace: true });
        };
        const t = setTimeout(advance, 1100);
        el.querySelector('#btn-o3-done').addEventListener('click', () => {
          clearTimeout(t);
          advance();
        });
        return () => clearTimeout(t);
      },
    },

    o4: {
      title: 'Оплата заказа онлайн',
      showBack: false,
      html: () => screenWrap(`
        <div class="flex-1 flex flex-col items-center justify-center text-center">
          ${successIcon()}
          <h1 class="text-[24px] font-semibold text-graphite mb-1">Оплата прошла</h1>
          <p class="text-[15px] text-graphite/60 mb-6">Заказ передан в сборку</p>
          <div class="w-full rounded-2xl bg-creamDark p-4 flex flex-col gap-2 text-left">
            <div class="flex justify-between"><span class="text-[14px] text-graphite/60">Списано</span><span class="text-[15px] font-medium text-graphite">${formatMoney(total)}</span></div>
            <div class="flex justify-between"><span class="text-[14px] text-graphite/60">Начислено баллов</span><span class="text-[15px] font-medium text-gold-dark">+${cashback(total)}</span></div>
          </div>
        </div>
        <div class="pt-6 flex flex-col gap-3">
          ${primaryBtn('btn-o4-home', 'На главный экран')}
          ${secondaryBtn('btn-o4-order', 'К заказу')}
        </div>
      `),
      mount: (el) => {
        el.querySelector('#btn-o4-home').addEventListener('click', () => goHome());
        el.querySelector('#btn-o4-order').addEventListener('click', () => goToScreen('o1', { replace: true }));
      },
    },
  },
};
