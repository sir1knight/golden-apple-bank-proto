// Небольшие переиспользуемые HTML-сниппеты (строковые шаблоны, без сборки).

export function primaryBtn(id, label, extra = '') {
  return `<button id="${id}" class="btn-primary" ${extra}>${label}</button>`;
}

export function secondaryBtn(id, label, extra = '') {
  return `<button id="${id}" class="btn-secondary" ${extra}>${label}</button>`;
}

export function screenWrap(inner, opts = {}) {
  const pad = opts.noPad ? '' : 'px-6 pt-6 pb-8';
  return `<div class="flex-1 flex flex-col ${pad}">${inner}</div>`;
}

export function spinnerBlock(text) {
  return `
    <div class="flex-1 flex flex-col items-center justify-center gap-4 px-8 text-center">
      <div class="spinner"></div>
      <p class="text-[15px] text-graphite/70">${text}</p>
    </div>`;
}

export function successIcon() {
  return `
    <div class="w-16 h-16 rounded-full bg-gold flex items-center justify-center mb-5">
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none"><path d="M5 13l4 4L19 7" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
    </div>`;
}

export function pill(text) {
  return `<span class="inline-block text-xs font-semibold tracking-wide uppercase text-gold bg-gold/10 px-3 py-1 rounded-full">${text}</span>`;
}

export function checkRow(text) {
  return `
    <div class="flex items-start gap-3 py-2">
      <div class="w-5 h-5 rounded-full bg-gold/15 flex items-center justify-center mt-0.5 shrink-0">
        <svg width="11" height="11" viewBox="0 0 24 24" fill="none"><path d="M5 13l4 4L19 7" stroke="#B8860B" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/></svg>
      </div>
      <p class="text-[15px] leading-snug text-graphite/85">${text}</p>
    </div>`;
}

export function faceIdIcon() {
  return `
    <svg width="56" height="56" viewBox="0 0 56 56" fill="none">
      <rect x="2" y="2" width="16" height="16" rx="4" stroke="#B8860B" stroke-width="2.5" stroke-dasharray="0 0" fill="none"
        style="clip-path: inset(0 60% 60% 0)"/>
      <path d="M2 10V6a4 4 0 0 1 4-4h4" stroke="#B8860B" stroke-width="2.5" stroke-linecap="round"/>
      <path d="M54 10V6a4 4 0 0 0-4-4h-4" stroke="#B8860B" stroke-width="2.5" stroke-linecap="round"/>
      <path d="M2 46v4a4 4 0 0 0 4 4h4" stroke="#B8860B" stroke-width="2.5" stroke-linecap="round"/>
      <path d="M54 46v4a4 4 0 0 1-4 4h-4" stroke="#B8860B" stroke-width="2.5" stroke-linecap="round"/>
      <circle cx="19" cy="24" r="2" fill="#3A3226"/>
      <circle cx="37" cy="24" r="2" fill="#3A3226"/>
      <path d="M28 22v8h-3" stroke="#3A3226" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M18 37c2.5 2.4 6 3.6 10 3.6s7.5-1.2 10-3.6" stroke="#3A3226" stroke-width="2" stroke-linecap="round"/>
    </svg>`;
}
