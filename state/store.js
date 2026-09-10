// Единый мок-стейт прототипа. Живёт только в памяти вкладки — без персистентности.

export const state = {
  user: {
    phone: '+7 999 123-45-67',
    name: 'Анна Смирнова',
    walletBalance: 0,
    walletLimit: 600000,
    walletStatus: 'none', // 'none' | 'wallet' | 'account'
    cashbackPoints: 320,
    cardMasked: null, // '•• 4471' после открытия счёта
    contractNumber: '№ ГА-2026-847213',
    loyaltyId: 'GA-77341-2201',
  },
  currentFlow: null, // 'wallet' | 'online' | 'instore' | null (главный экран)
  currentScreen: null,
  history: [],
  lastOrderTotal: 0,
  lastPurchaseTotal: 0,
};

const listeners = [];

export function subscribe(fn) {
  listeners.push(fn);
}

export function notify() {
  listeners.forEach((fn) => fn());
}

export function setDemoState(level) {
  if (level === 'guest') {
    state.user.walletStatus = 'none';
    state.user.walletBalance = 0;
    state.user.cardMasked = null;
  } else if (level === 'wallet') {
    state.user.walletStatus = 'wallet';
    state.user.walletBalance = 12450;
    state.user.cardMasked = null;
  } else if (level === 'account') {
    state.user.walletStatus = 'account';
    state.user.walletBalance = 12450;
    state.user.cardMasked = '•• 4471';
  }
  goHome();
}

export function getDemoState() {
  return state.user.walletStatus === 'account' ? 'account' : state.user.walletStatus === 'wallet' ? 'wallet' : 'guest';
}

export function goHome() {
  state.currentFlow = null;
  state.currentScreen = null;
  state.history = [];
  notify();
}

export function startFlow(flow, screen) {
  state.currentFlow = flow;
  state.currentScreen = screen;
  state.history = [screen];
  notify();
}

export function goToScreen(screen, opts = {}) {
  if (opts.replace && state.history.length) {
    state.history[state.history.length - 1] = screen;
  } else {
    state.history.push(screen);
  }
  state.currentScreen = screen;
  notify();
}

export function goBack() {
  if (state.history.length > 1) {
    state.history.pop();
    state.currentScreen = state.history[state.history.length - 1];
    notify();
  }
}

export function formatMoney(n) {
  return n.toLocaleString('ru-RU') + ' ₽';
}
