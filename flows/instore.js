import { state, goToScreen, goHome, startFlow, formatMoney } from '../state/store.js';
import { primaryBtn, secondaryBtn, screenWrap, successIcon, faceIdIcon } from '../components.js';

const PURCHASE_TOTAL = 3240;
function bonus(sum) {
  return Math.round(sum * 0.03);
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
        return screenWrap(`
          <h1 class="text-[22px] font-semibold text-graphite mb-4">Оплата</h1>
          <div id="m1-card-area" class="cursor-pointer">${payCard()}</div>
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
        el.querySelector('#m1-card-area').addEventListener('click', () => goToScreen('m2'));
        el.querySelector('#btn-m1-qr').addEventListener('click', () => goToScreen('m2alt'));
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
          <p class="text-[15px] text-graphite/60">Покажите этот код кассиру</p>
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
          <p class="text-[14.5px] text-graphite/55">${formatMoney(PURCHASE_TOTAL)}</p>
        </div>
        <div class="pt-4">${secondaryBtn('btn-m3-done', 'Готово')}</div>
      `),
      mount: (el) => {
        const advance = () => {
          state.user.walletBalance = Math.max(0, state.user.walletBalance - PURCHASE_TOTAL);
          state.user.cashbackPoints += bonus(PURCHASE_TOTAL);
          state.lastPurchaseTotal = PURCHASE_TOTAL;
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
            <div class="flex justify-between"><span class="text-[14px] text-graphite/60">Сумма покупки</span><span class="text-[15px] font-medium text-graphite">${formatMoney(PURCHASE_TOTAL)}</span></div>
            <div class="flex justify-between"><span class="text-[14px] text-graphite/60">Начислено бонусов</span><span class="text-[15px] font-medium text-gold-dark">+${bonus(PURCHASE_TOTAL)}</span></div>
          </div>
        </div>
        <div class="pt-6">${primaryBtn('btn-m4-done', 'Готово')}</div>
      `),
      mount: (el) => {
        el.querySelector('#btn-m4-done').addEventListener('click', () => goHome());
      },
    },
  },
};
