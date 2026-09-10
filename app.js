import { state, subscribe, goHome, goBack, startFlow, setDemoState, getDemoState, formatMoney } from './state/store.js';
import { walletFlow } from './flows/wallet.js';
import { onlineFlow } from './flows/online.js';
import { instoreFlow } from './flows/instore.js';
import { primaryBtn, secondaryBtn, pill } from './components.js';

const flows = { wallet: walletFlow, online: onlineFlow, instore: instoreFlow };

const NAV_ITEMS = [
  { id: 'wallet', label: 'Кошелёк и счёт', icon: 'wallet' },
  { id: 'online', label: 'Оплата заказа онлайн', icon: 'cart' },
  { id: 'instore', label: 'Оплата в магазине', icon: 'store' },
];

function icon(name, active) {
  const c = active ? '#F7F4EC' : '#3A3226';
  const icons = {
    wallet: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none"><rect x="3" y="6" width="18" height="13" rx="2" stroke="${c}" stroke-width="1.6"/><path d="M3 10h18" stroke="${c}" stroke-width="1.6"/></svg>`,
    cart: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M6 2l1.5 4h9L18 2" stroke="${c}" stroke-width="1.6" stroke-linecap="round"/><rect x="4" y="6" width="16" height="15" rx="2" stroke="${c}" stroke-width="1.6"/></svg>`,
    store: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M4 9l1-5h14l1 5" stroke="${c}" stroke-width="1.6" stroke-linejoin="round"/><path d="M4 9a2.5 2.5 0 0 0 5 0 2.5 2.5 0 0 0 5 0 2.5 2.5 0 0 0 5 0" stroke="${c}" stroke-width="1.6"/><path d="M5 9v11h14V9" stroke="${c}" stroke-width="1.6"/></svg>`,
  };
  return icons[name] || '';
}

const root = document.getElementById('app-root');

// ---------------- Access gate ----------------
// Client-side only: keeps the prototype off casual/search traffic on a public
// repo. Not real security — the hash below is trivially recoverable from the
// page source, this just avoids shipping the password itself in plain text.
const GATE_SESSION_KEY = 'ga_proto_unlocked_v1';
const GATE_PASSWORD_HASH = 'dc8b00c57fa5672dadbcc219e369b592685103589fe0c417ab15f2f51dbf309c';

async function sha256Hex(text) {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(text));
  return Array.from(new Uint8Array(buf)).map((b) => b.toString(16).padStart(2, '0')).join('');
}

function renderGate() {
  root.innerHTML = `
    <div class="min-h-[100dvh] w-full flex items-center justify-center px-6" style="background:var(--cream-dark)">
      <form id="gate-form" class="w-full max-w-[360px] rounded-3xl bg-white/70 border border-graphite/10 p-7 flex flex-col gap-4 shadow-sm">
        <div>${pill('Прототип')}</div>
        <h1 class="text-[22px] font-semibold text-graphite leading-tight">Golden Apple Bank</h1>
        <p class="text-[14px] text-graphite/60 -mt-2">Демо-доступ закрыт паролем. Введите пароль, который вам передали.</p>
        <input id="gate-password" type="password" autocomplete="off" placeholder="Пароль" class="w-full rounded-2xl border border-graphite/15 bg-white px-4 py-3 text-[15px] text-graphite outline-none focus:border-gold" />
        <p id="gate-error" class="text-[13px] text-red-600 -mt-2 hidden">Неверный пароль, попробуйте ещё раз.</p>
        ${primaryBtn('gate-submit', 'Войти')}
      </form>
    </div>
  `;
  const form = document.getElementById('gate-form');
  const input = document.getElementById('gate-password');
  const errorEl = document.getElementById('gate-error');
  input.focus();
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const hash = await sha256Hex(input.value.trim());
    if (hash === GATE_PASSWORD_HASH) {
      sessionStorage.setItem(GATE_SESSION_KEY, '1');
      bootApp();
    } else {
      errorEl.classList.remove('hidden');
      input.value = '';
      input.focus();
    }
  });
}

if (sessionStorage.getItem(GATE_SESSION_KEY) === '1') {
  bootApp();
} else {
  renderGate();
}

function bootApp() {
root.innerHTML = `
  <div class="stage">
    <aside class="side-panel">
      <div class="mb-6">
        <div class="text-[13px] font-semibold tracking-wide uppercase text-graphite/50 mb-3">Клиентские пути</div>
        <nav id="nav-list" class="flex flex-col gap-1"></nav>
      </div>
    </aside>

    <div class="phone-frame-wrap">
      <div class="phone-frame">
        <div class="phone-notch"></div>
        <div class="phone-screen">
          <div class="safe-top flex items-center justify-between px-4 pb-2 shrink-0" id="app-topbar">
            <button id="nav-back" class="w-8 h-8 flex items-center justify-center rounded-full hover:bg-graphite/5" aria-label="Назад">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M15 5l-7 7 7 7" stroke="#3A3226" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
            </button>
            <span id="app-title" class="text-[13px] font-semibold text-graphite/70 tracking-wide"></span>
            <button id="nav-restart" class="text-[12px] font-medium text-gold-dark px-2 py-1 rounded-full hover:bg-gold/10">Сначала</button>
          </div>
          <div id="screen-content" class="screen-content"></div>
        </div>
      </div>
    </div>

    <aside class="side-panel">
      <div class="rounded-2xl bg-white/60 border border-graphite/10 p-4">
        <div class="text-[13px] font-semibold tracking-wide uppercase text-graphite/50 mb-3">Состояние пользователя для демо</div>
        <div id="demo-switcher" class="flex flex-col gap-0.5"></div>
        <div class="mt-4 pt-3 border-t border-graphite/10 text-[12px] text-graphite/50 leading-relaxed">
          Баланс: <span id="demo-balance" class="font-medium text-graphite/70"></span><br/>
          Карта: <span id="demo-card" class="font-medium text-graphite/70"></span><br/>
          Баллы: <span id="demo-points" class="font-medium text-graphite/70"></span>
        </div>
      </div>
    </aside>
  </div>

  <button id="mobile-settings-btn" class="fixed bottom-4 right-4 z-40 w-11 h-11 rounded-full bg-graphite text-cream shadow-lg items-center justify-center hidden">
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z" stroke="#F7F4EC" stroke-width="1.6"/><path d="M19 12a7 7 0 0 0-.1-1.2l2-1.5-2-3.4-2.3.9a7 7 0 0 0-2-1.2L14 3h-4l-.6 2.6a7 7 0 0 0-2 1.2l-2.3-.9-2 3.4 2 1.5A7 7 0 0 0 5 12a7 7 0 0 0 .1 1.2l-2 1.5 2 3.4 2.3-.9a7 7 0 0 0 2 1.2L10 21h4l.6-2.6a7 7 0 0 0 2-1.2l2.3.9 2-3.4-2-1.5c.06-.4.1-.8.1-1.2z" stroke="#F7F4EC" stroke-width="1.2" stroke-linejoin="round"/></svg>
  </button>

  <div id="mobile-sheet-backdrop" class="fixed inset-0 bg-graphite/40 z-40 hidden"></div>
  <div id="mobile-sheet" class="fixed left-0 right-0 bottom-0 bg-cream rounded-t-3xl z-50 p-5 translate-y-full transition-transform duration-200 safe-bottom">
    <div class="w-10 h-1.5 rounded-full bg-graphite/15 mx-auto mb-5"></div>
    <div class="text-[13px] font-semibold tracking-wide uppercase text-graphite/50 mb-2">Клиентские пути</div>
    <nav id="nav-list-mobile" class="flex flex-col gap-1 mb-5"></nav>
    <div class="text-[13px] font-semibold tracking-wide uppercase text-graphite/50 mb-2">Состояние пользователя для демо</div>
    <div id="demo-switcher-mobile" class="flex flex-col gap-0.5 mb-2"></div>
  </div>
`;

// ---------------- Nav panel (desktop) ----------------
function renderNav(container) {
  container.innerHTML = NAV_ITEMS.map((item) => `
    <button class="nav-item ${state.currentFlow === item.id ? 'active' : ''}" data-flow="${item.id}">
      ${icon(item.icon, state.currentFlow === item.id)}
      <span>${item.label}</span>
    </button>
  `).join('');
  container.querySelectorAll('[data-flow]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const flow = btn.dataset.flow;
      startFlow(flow, flows[flow].initialScreen);
      closeMobileSheet();
    });
  });
}

// ---------------- Demo switcher ----------------
const DEMO_OPTIONS = [
  { id: 'guest', label: 'Гость — кошелёк не открыт' },
  { id: 'wallet', label: 'Кошелёк открыт (лимит 600 000 ₽)' },
  { id: 'account', label: 'Счёт открыт (карта выпущена)' },
];

function renderDemoSwitcher(container) {
  const current = getDemoState();
  container.innerHTML = DEMO_OPTIONS.map((opt) => `
    <label class="radio-row">
      <input type="radio" name="${container.id}" value="${opt.id}" ${current === opt.id ? 'checked' : ''} class="accent-[#B8860B] w-4 h-4" />
      <span class="text-[13.5px] text-graphite/80">${opt.label}</span>
    </label>
  `).join('');
  container.querySelectorAll('input[type="radio"]').forEach((r) => {
    r.addEventListener('change', () => {
      if (r.checked) setDemoState(r.value);
    });
  });
}

// ---------------- Mobile sheet ----------------
function openMobileSheet() {
  document.getElementById('mobile-sheet').classList.remove('translate-y-full');
  document.getElementById('mobile-sheet-backdrop').classList.remove('hidden');
}
function closeMobileSheet() {
  document.getElementById('mobile-sheet').classList.add('translate-y-full');
  document.getElementById('mobile-sheet-backdrop').classList.add('hidden');
}
document.getElementById('mobile-settings-btn').addEventListener('click', openMobileSheet);
document.getElementById('mobile-sheet-backdrop').addEventListener('click', closeMobileSheet);

function checkMobile() {
  const isMobile = window.innerWidth <= 900;
  document.getElementById('mobile-settings-btn').classList.toggle('hidden', !isMobile);
  document.getElementById('mobile-settings-btn').classList.toggle('flex', isMobile);
  if (!isMobile) closeMobileSheet();
}
window.addEventListener('resize', checkMobile);
checkMobile();

// ---------------- Home screen (inside phone) ----------------
function renderHomeHtml() {
  return `
    <div class="flex-1 flex flex-col px-6 pt-2 pb-8">
      <div class="mb-6">
        ${pill('Прототип')}
      </div>
      <h1 class="text-[26px] font-semibold text-graphite leading-tight mb-2">Golden Apple<br/>Bank</h1>
      <p class="text-[15px] text-graphite/60 mb-6">Выберите клиентский путь для демонстрации</p>
      <div class="flex flex-col gap-3">
        ${NAV_ITEMS.map((item) => `
          <button data-flow="${item.id}" class="flex items-center gap-3 w-full text-left rounded-2xl bg-creamDark hover:bg-gold/10 transition-colors px-4 py-4">
            <div class="w-10 h-10 rounded-full bg-white flex items-center justify-center shrink-0">${icon(item.icon, false)}</div>
            <span class="text-[15px] font-medium text-graphite">${item.label}</span>
            <svg class="ml-auto shrink-0" width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M9 5l7 7-7 7" stroke="#3A3226" stroke-opacity="0.4" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>
          </button>
        `).join('')}
      </div>
      <div class="flex-1"></div>
      <div class="rounded-2xl border border-graphite/10 px-4 py-3 flex items-center justify-between mr-14">
        <span class="text-[13px] text-graphite/50">Статус кошелька</span>
        <span class="text-[13px] font-medium text-gold-dark ml-3">${statusLabel()}</span>
      </div>
    </div>
  `;
}

function statusLabel() {
  if (state.user.walletStatus === 'account') return 'Счёт открыт';
  if (state.user.walletStatus === 'wallet') return 'Кошелёк открыт';
  return 'Не открыт';
}

// ---------------- Screen render engine ----------------
const screenEl = document.getElementById('screen-content');
const topbar = document.getElementById('app-topbar');
const backBtn = document.getElementById('nav-back');
const restartBtn = document.getElementById('nav-restart');
const titleEl = document.getElementById('app-title');

let currentCleanup = null;

backBtn.addEventListener('click', () => goBack());
restartBtn.addEventListener('click', () => {
  if (state.currentFlow) startFlow(state.currentFlow, flows[state.currentFlow].initialScreen);
});

function renderScreen() {
  if (currentCleanup) {
    currentCleanup();
    currentCleanup = null;
  }

  if (!state.currentFlow) {
    topbar.style.visibility = 'hidden';
    screenEl.innerHTML = renderHomeHtml();
    screenEl.querySelectorAll('[data-flow]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const flow = btn.dataset.flow;
        startFlow(flow, flows[flow].initialScreen);
      });
    });
    return;
  }

  topbar.style.visibility = 'visible';
  const flow = flows[state.currentFlow];
  const screenDef = flow.screens[state.currentScreen];
  titleEl.textContent = screenDef.title || flow.title;
  backBtn.style.visibility = screenDef.showBack === false ? 'hidden' : 'visible';

  screenEl.innerHTML = screenDef.html();
  if (screenDef.mount) {
    const cleanup = screenDef.mount(screenEl);
    if (typeof cleanup === 'function') currentCleanup = cleanup;
  }
}

function syncSidebars() {
  renderNav(document.getElementById('nav-list'));
  renderNav(document.getElementById('nav-list-mobile'));
  renderDemoSwitcher(document.getElementById('demo-switcher'));
  renderDemoSwitcher(document.getElementById('demo-switcher-mobile'));
  document.getElementById('demo-balance').textContent = formatMoney(state.user.walletBalance);
  document.getElementById('demo-card').textContent = state.user.cardMasked || '—';
  document.getElementById('demo-points').textContent = state.user.cashbackPoints.toLocaleString('ru-RU');
}

function fullRender() {
  // Sync immediately so nav/demo-switcher reflect the flow/screen change itself...
  syncSidebars();

  screenEl.classList.add('screen-fade-out');
  window.setTimeout(() => {
    renderScreen(); // screen's mount() may further mutate state.user (e.g. success screens)
    syncSidebars(); // ...and again after mount, so those mutations are reflected too
    screenEl.classList.remove('screen-fade-out');
    screenEl.classList.add('screen-fade-in');
    window.setTimeout(() => screenEl.classList.remove('screen-fade-in'), 240);
  }, 140);
}

subscribe(fullRender);
fullRender();
}
