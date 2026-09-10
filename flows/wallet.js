import { state, goToScreen, goBack, goHome, formatMoney } from '../state/store.js';
import { primaryBtn, secondaryBtn, screenWrap, spinnerBlock, successIcon, pill, checkRow } from '../components.js';

export const walletFlow = {
  id: 'wallet',
  title: 'Кошелёк и счёт',
  initialScreen: 'a1',

  screens: {
    // ---------------- ШАГ А: КОШЕЛЁК ----------------
    a1: {
      title: 'Кошелёк Golden Apple',
      showBack: false,
      html: () => screenWrap(`
        <div class="flex-1 flex flex-col justify-center gap-5">
          <div>${pill('Новый продукт')}</div>
          <h1 class="text-[28px] leading-tight font-semibold text-graphite">Кошелёк<br/>Golden Apple</h1>
          <p class="text-[16px] text-graphite/70 leading-relaxed">Электронный кошелёк для покупок в сети Golden Apple и оплаты по QR. Кэшбэк баллами, лимит операций — 600 000 ₽. Откроется за пару минут, без визита в отделение.</p>
          <div class="rounded-2xl bg-creamDark p-4 flex flex-col gap-3 mt-2">
            ${checkRow('До 3% кэшбэка баллами на покупки Golden Apple')}
            ${checkRow('Оплата по QR-коду в любом магазине сети')}
            ${checkRow('Никаких визитов в офис — всё в приложении')}
          </div>
        </div>
        <div class="pt-4">${primaryBtn('btn-a1-open', 'Открыть')}</div>
      `),
      mount: (el) => {
        el.querySelector('#btn-a1-open').addEventListener('click', () => goToScreen('a2'));
      },
    },

    a2: {
      title: 'Кошелёк Golden Apple',
      showBack: true,
      html: () => screenWrap(`
        <div class="flex-1 flex flex-col gap-5">
          <h1 class="text-[22px] font-semibold text-graphite">Согласия</h1>
          <p class="text-[15px] text-graphite/70">Прежде чем открыть кошелёк, подтвердите согласие на обработку данных.</p>
          <label class="flex items-start gap-3 mt-2 cursor-pointer">
            <input type="checkbox" id="chk-required" class="ga-checkbox mt-0.5" />
            <span class="text-[15px] leading-snug text-graphite/90">Согласен(-на) с <span class="text-gold-dark underline decoration-gold/40">условиями обслуживания</span> и обработкой персональных данных</span>
          </label>
          <label class="flex items-start gap-3 cursor-pointer">
            <input type="checkbox" id="chk-optional" class="ga-checkbox mt-0.5" />
            <span class="text-[15px] leading-snug text-graphite/90">Хочу получать предложения и рекламные рассылки Golden Apple</span>
          </label>
        </div>
        <div class="pt-4">${primaryBtn('btn-a2-continue', 'Продолжить', 'disabled')}</div>
      `),
      mount: (el) => {
        const required = el.querySelector('#chk-required');
        const continueBtn = el.querySelector('#btn-a2-continue');
        required.addEventListener('change', () => {
          continueBtn.disabled = !required.checked;
        });
        continueBtn.addEventListener('click', () => goToScreen('a3'));
      },
    },

    a3: {
      title: 'Кошелёк Golden Apple',
      showBack: false,
      html: () => spinnerBlock('Получаем данные из Госуслуг…'),
      mount: () => {
        const t = setTimeout(() => goToScreen('a4', { replace: true }), 1700);
        return () => clearTimeout(t);
      },
    },

    a4: {
      title: 'Кошелёк Golden Apple',
      showBack: false,
      html: () => spinnerBlock('Проверяем данные…'),
      mount: () => {
        const t = setTimeout(() => goToScreen('a5', { replace: true }), 900);
        return () => clearTimeout(t);
      },
    },

    a5: {
      title: 'Кошелёк Golden Apple',
      showBack: false,
      html: () => screenWrap(`
        <div class="flex-1 flex flex-col items-center justify-center text-center">
          ${successIcon()}
          <h1 class="text-[24px] font-semibold text-graphite mb-1">Кошелёк открыт</h1>
          <p class="text-[15px] text-graphite/60 mb-6">Готов к покупкам прямо сейчас</p>
          <div class="w-full rounded-2xl card-visual p-5 flex flex-col gap-4 text-left">
            <span class="text-xs uppercase tracking-wide text-cream/60">Баланс кошелька</span>
            <span class="text-[26px] font-semibold">0 ₽</span>
            <div class="flex justify-between items-end pt-2 border-t border-white/10">
              <span class="text-xs text-cream/60">Лимит операций</span>
              <span class="text-sm font-medium">600 000 ₽</span>
            </div>
          </div>
        </div>
        <div class="pt-6 flex flex-col gap-3">
          ${primaryBtn('btn-a5-upgrade', 'Повысить до полноценного счёта')}
          ${secondaryBtn('btn-a5-later', 'Позже')}
        </div>
      `),
      mount: (el) => {
        state.user.walletStatus = 'wallet';
        state.user.walletBalance = 0;
        el.querySelector('#btn-a5-upgrade').addEventListener('click', () => goToScreen('b1'));
        el.querySelector('#btn-a5-later').addEventListener('click', () => goHome());
      },
    },

    // ---------------- ШАГ Б: ПОЛНОЦЕННЫЙ СЧЁТ ----------------
    b1: {
      title: 'Открытие счёта',
      showBack: true,
      html: () => screenWrap(`
        <div class="flex-1 flex flex-col justify-center gap-5">
          <div>${pill('Апгрейд')}</div>
          <h1 class="text-[26px] leading-tight font-semibold text-graphite">Снимите лимит 600 000 ₽</h1>
          <p class="text-[16px] text-graphite/70 leading-relaxed">Откройте полноценный счёт и получите именную карту Golden Apple — без ограничений на сумму операций.</p>
          <div class="rounded-2xl bg-creamDark p-4 flex flex-col gap-3 mt-2">
            ${checkRow('Снятие лимита в 600 000 ₽')}
            ${checkRow('Именная виртуальная карта сразу, физическая — по запросу')}
            ${checkRow('Переводы, платежи ЖКХ и снятие наличных')}
          </div>
        </div>
        <div class="pt-4">${primaryBtn('btn-b1-open', 'Открыть счёт')}</div>
      `),
      mount: (el) => {
        el.querySelector('#btn-b1-open').addEventListener('click', () => goToScreen('b2'));
      },
    },

    b2: {
      title: 'Открытие счёта',
      showBack: true,
      html: () => screenWrap(`
        <div class="flex-1 flex flex-col gap-4">
          <h1 class="text-[22px] font-semibold text-graphite">Что за доверенность?</h1>
          <p class="text-[15px] text-graphite/70 -mt-1">Чтобы не приглашать вас в офис, часть шагов за вас выполнит сотрудник банка — по короткой доверенности.</p>
          <div class="flex flex-col divide-y divide-graphite/10 mt-2">
            <div class="py-3">
              <p class="text-[15px] font-medium text-graphite">Зачем она нужна</p>
              <p class="text-[14px] text-graphite/65 leading-snug mt-1">Сотрудник банка от вашего имени подаёт заявление на открытие счёта — вам не нужно приходить лично.</p>
            </div>
            <div class="py-3">
              <p class="text-[15px] font-medium text-graphite">Что нельзя</p>
              <p class="text-[14px] text-graphite/65 leading-snug mt-1">Представитель не может распоряжаться вашими деньгами и подписывать что-либо, кроме заявления на открытие счёта.</p>
            </div>
            <div class="py-3">
              <p class="text-[15px] font-medium text-graphite">Когда истекает</p>
              <p class="text-[14px] text-graphite/65 leading-snug mt-1">Автоматически — сразу после открытия счёта либо через 30 дней, смотря что наступит раньше.</p>
            </div>
          </div>
        </div>
        <div class="pt-4">${primaryBtn('btn-b2-ok', 'Понятно, продолжить')}</div>
      `),
      mount: (el) => {
        el.querySelector('#btn-b2-ok').addEventListener('click', () => goToScreen('b3'));
      },
    },

    b3: {
      title: 'Открытие счёта',
      showBack: true,
      html: () => screenWrap(`
        <div class="flex-1 flex flex-col">
          <h1 class="text-[20px] font-semibold text-graphite mb-1">Фото паспорта</h1>
          <p class="text-[14px] text-graphite/60 mb-4">Наведите камеру на разворот с фотографией</p>
          <div class="flex-1 rounded-2xl bg-graphite/95 relative overflow-hidden flex items-center justify-center min-h-[280px]">
            <div class="w-[85%] h-[62%] border-2 border-dashed border-cream/50 rounded-xl flex items-center justify-center">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none"><rect x="3" y="6" width="18" height="13" rx="2" stroke="#F7F4EC" stroke-opacity="0.6" stroke-width="1.5"/><circle cx="8" cy="12" r="2.2" stroke="#F7F4EC" stroke-opacity="0.6" stroke-width="1.5"/><path d="M13 15l2.5-3 3.5 4" stroke="#F7F4EC" stroke-opacity="0.6" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
            </div>
          </div>
        </div>
        <div class="pt-4">${primaryBtn('btn-b3-shot', 'Сфотографировать')}</div>
      `),
      mount: (el) => {
        el.querySelector('#btn-b3-shot').addEventListener('click', () => goToScreen('b3b'));
      },
    },

    b3b: {
      title: 'Открытие счёта',
      showBack: true,
      html: () => screenWrap(`
        <div class="flex-1 flex flex-col">
          <h1 class="text-[20px] font-semibold text-graphite mb-1">Селфи с паспортом</h1>
          <p class="text-[14px] text-graphite/60 mb-4">Сфотографируйте себя с паспортом в руках, лицо и разворот должны быть видны</p>
          <div class="flex-1 rounded-2xl bg-graphite/95 relative overflow-hidden flex items-center justify-center min-h-[280px]">
            <div class="w-[58%] aspect-[3/4] border-2 border-dashed border-cream/50 rounded-full flex items-center justify-center">
              <svg width="36" height="36" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="8" r="4" stroke="#F7F4EC" stroke-opacity="0.6" stroke-width="1.5"/><path d="M4 20c0-4 3.6-6.5 8-6.5s8 2.5 8 6.5" stroke="#F7F4EC" stroke-opacity="0.6" stroke-width="1.5" stroke-linecap="round"/></svg>
            </div>
          </div>
        </div>
        <div class="pt-4">${primaryBtn('btn-b3b-shot', 'Сфотографировать')}</div>
      `),
      mount: (el) => {
        el.querySelector('#btn-b3b-shot').addEventListener('click', () => goToScreen('b4'));
      },
    },

    b4: {
      title: 'Открытие счёта',
      showBack: true,
      html: () => screenWrap(`
        <div class="flex-1 flex flex-col gap-2">
          <h1 class="text-[22px] font-semibold text-graphite mb-1">Пакет документов</h1>
          <p class="text-[14px] text-graphite/60 mb-2">Проверьте и подпишите одним касанием</p>
          <div class="flex flex-col divide-y divide-graphite/10 rounded-2xl bg-creamDark px-4">
            <div class="flex items-center gap-3 py-3.5">
              <div class="w-9 h-9 rounded-full bg-gold/15 flex items-center justify-center shrink-0">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M5 13l4 4L19 7" stroke="#B8860B" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
              </div>
              <span class="text-[15px] text-graphite/90">Согласие на обработку персональных данных</span>
            </div>
            <div class="flex items-center gap-3 py-3.5">
              <div class="w-9 h-9 rounded-full bg-gold/15 flex items-center justify-center shrink-0">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M5 13l4 4L19 7" stroke="#B8860B" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
              </div>
              <span class="text-[15px] text-graphite/90">Доверенность на сотрудника банка</span>
            </div>
            <div class="flex items-center gap-3 py-3.5">
              <div class="w-9 h-9 rounded-full bg-gold/15 flex items-center justify-center shrink-0">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M5 13l4 4L19 7" stroke="#B8860B" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
              </div>
              <span class="text-[15px] text-graphite/90">Заявление об открытии счёта</span>
            </div>
          </div>
        </div>
        <div class="pt-4">${primaryBtn('btn-b4-sign', 'Подписать всё')}</div>
      `),
      mount: (el) => {
        const btn = el.querySelector('#btn-b4-sign');
        let t = null;
        btn.addEventListener('click', () => {
          btn.disabled = true;
          btn.innerHTML = `<span class="inline-flex items-center gap-2 justify-center"><span class="spinner" style="width:16px;height:16px;border-width:2px;border-top-color:#fff;border-color:rgba(255,255,255,0.35)"></span>Подписываем…</span>`;
          t = setTimeout(() => goToScreen('b5', { replace: true }), 800);
        });
        return () => t && clearTimeout(t);
      },
    },

    b5: {
      title: 'Открытие счёта',
      showBack: false,
      html: () => screenWrap(`
        <div class="flex-1 flex flex-col items-center justify-center text-center">
          ${successIcon()}
          <h1 class="text-[24px] font-semibold text-graphite mb-1">Счёт открыт</h1>
          <p class="text-[14px] text-graphite/55 mb-6">Договор ${state.user.contractNumber}</p>
          <div class="w-full aspect-[1.586/1] rounded-2xl card-visual p-5 flex flex-col justify-between">
            <div class="flex justify-between items-start">
              <span class="text-xs uppercase tracking-wide text-cream/60">Golden Apple</span>
              <span class="text-xs text-cream/60">виртуальная</span>
            </div>
            <div>
              <div class="text-[18px] tracking-[0.15em] mb-2">•••• •••• •••• ${state.user.cardMasked ? state.user.cardMasked.replace('••', '').trim() : '4471'}</div>
              <div class="text-[13px] text-cream/70 uppercase">${state.user.name}</div>
            </div>
          </div>
        </div>
        <div class="pt-6 flex flex-col gap-3">
          ${primaryBtn('btn-b5-done', 'Готово')}
          ${secondaryBtn('btn-b5-physical', 'Заказать физическую карту')}
        </div>
      `),
      mount: (el) => {
        state.user.walletStatus = 'account';
        state.user.cardMasked = '•• 4471';
        el.querySelector('#btn-b5-done').addEventListener('click', () => goHome());
        el.querySelector('#btn-b5-physical').addEventListener('click', () => goToScreen('b5-ordered'));
      },
    },

    'b5-ordered': {
      title: 'Открытие счёта',
      showBack: true,
      html: () => screenWrap(`
        <div class="flex-1 flex flex-col items-center justify-center text-center">
          ${successIcon()}
          <h1 class="text-[22px] font-semibold text-graphite mb-2">Забронировано</h1>
          <p class="text-[15px] text-graphite/65 leading-relaxed">Заберите физическую карту в любом магазине Golden Apple — просто назовите номер телефона на кассе.</p>
        </div>
        <div class="pt-6">${primaryBtn('btn-b5o-done', 'Готово')}</div>
      `),
      mount: (el) => {
        el.querySelector('#btn-b5o-done').addEventListener('click', () => goHome());
      },
    },
  },
};
