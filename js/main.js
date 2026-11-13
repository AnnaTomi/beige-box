/* BEIGE BOX — общая логика сайта: шапка, подвал, меню, корзина, карточки товаров */

const CATS = [
  { id: 'gifts', name: 'Подарочные наборы' },
  { id: 'toys',  name: 'Ёлочные игрушки' },
  { id: 'wear',  name: 'Пижамы' },
  { id: 'home',  name: 'Для дома' },
  { id: 'care',  name: 'Мыло, соль, бомбочки' },
  { id: 'socks', name: 'Носки и гольфы' },
  { id: 'acc',   name: 'Аксессуары' }
];
const WHO = { her: 'Ей', him: 'Ему', two: 'Для двоих', work: 'Коллегам' };
const OCC = { ny: 'Новый год', '23feb': '23 февраля', '14feb': '14 февраля', '8march': '8 марта', bday: 'День рождения' };
const BUDGET = { b1: 'До 1 500 ₽', b2: '1 500–3 000 ₽', b3: 'От 3 000 ₽' };
const inBudget = (p, b) => b === 'b1' ? p.price < 1500 : b === 'b2' ? p.price >= 1500 && p.price <= 3000 : p.price > 3000;

const WA = 'https://wa.me/79527287542';
const TG = 'https://t.me/beige_box';
const MAX = 'https://max.ru/id662340692935_biz';
const FREE_FROM = 500;

/* короткие слова не висят в конце строки, последнее слово не остаётся одно */
const nb = t => String(t || '')
  .replace(/(^|[\s(«])(в|во|и|с|со|из|к|ко|на|по|за|от|до|для|о|об|у|не|а|но|или|без)\s+/gi, '$1$2 ')
  .replace(/\s+(—)/g, ' $1')
  .replace(/\s+(\S{1,10})$/, ' $1');
const cap = t => t.charAt(0).toUpperCase() + t.slice(1);
const RUB = n => n.toLocaleString('ru-RU').replace(/\s/g, ' ') + ' ₽';
const byId = id => PRODUCTS.find(p => p.id === id);
const qs = new URLSearchParams(location.search);
const plural = (n, a, b, c) => n % 10 === 1 && n % 100 !== 11 ? a : (n % 10 >= 2 && n % 10 <= 4 && (n % 100 < 10 || n % 100 >= 20) ? b : c);

/* ---------- иконки ---------- */
const I = (d, w = 1.5) => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round">${d}</svg>`;
const ICON = {
  arr: I('<path d="M4 12h16m-6-6 6 6-6 6"/>'),
  back: I('<path d="M20 12H4m6-6-6 6 6 6"/>'),
  search: I('<circle cx="11" cy="11" r="6.5"/><path d="m20 20-4.2-4.2"/>'),
  bag: I('<path d="M5 8h14l-1.2 12H6.2L5 8Z"/><path d="M9 8V6.5a3 3 0 0 1 6 0V8"/>'),
  bagPlus: I('<path d="M5 8h14l-1.2 12H6.2L5 8Z"/><path d="M9 8V6.5a3 3 0 0 1 6 0V8"/><path d="M12 11.5v5m-2.5-2.5h5"/>'),
  menu: I('<path d="M4 8h16M4 16h16"/>'),
  close: I('<path d="M6 6l12 12M18 6 6 18"/>'),
  ruler: I('<path d="M3 15.5 15.5 3 21 8.5 8.5 21z"/><path d="m7 12 2 2m1-5 2 2m1-5 2 2"/>'),
  truck: I('<path d="M2.5 7h11v9.5h-11zM13.5 10h4l3.5 3.5v3h-7.5"/><circle cx="6.5" cy="17.5" r="1.8"/><circle cx="17" cy="17.5" r="1.8"/>', 1.4),
  clock: I('<circle cx="12" cy="12" r="8.5"/><path d="M12 7.5V12l3 2"/>', 1.4),
  gift: I('<path d="M4 10h16v10H4zM3 6.5h18V10H3zM12 6.5V20"/><path d="M12 6.5C10.5 3.5 7 3 7 5s5 1.5 5 1.5c1.5-3 5-3.5 5-1.5s-5 1.5-5 1.5"/>', 1.4),
  box: I('<path d="M3 8.5 12 4l9 4.5v7L12 20l-9-4.5z"/><path d="M3 8.5 12 13l9-4.5M12 13v7"/>', 1.4),
  chat: I('<path d="M12 4.5a7.5 7.5 0 1 1-4.2 13.7L4.5 19.5l1.3-3.3A7.5 7.5 0 0 1 12 4.5Z"/>', 1.4),
  mail: I('<rect x="3" y="5.5" width="18" height="13" rx="2"/><path d="m3.5 7 8.5 6 8.5-6"/>', 1.4),
  pin: I('<path d="M12 21s-6.5-6-6.5-11a6.5 6.5 0 0 1 13 0c0 5-6.5 11-6.5 11Z"/><circle cx="12" cy="10" r="2.3"/>', 1.4),
  card: I('<rect x="3" y="5.5" width="18" height="13" rx="2"/><path d="M3 10h18M7 15h3"/>', 1.4),
  doc: I('<path d="M6 3h8l4 4v14H6z"/><path d="M14 3v4h4M9 12h6M9 16h6"/>', 1.4),
  list: I('<path d="M9 6h11M9 12h11M9 18h11"/><path d="m4 6 1 1 2-2M4 12l1 1 2-2M4 18l1 1 2-2"/>', 1.4),
  world: I('<circle cx="12" cy="12" r="8.5"/><path d="M3.5 12h17M12 3.5c2.5 2.6 3.5 5.5 3.5 8.5s-1 5.9-3.5 8.5c-2.5-2.6-3.5-5.5-3.5-8.5s1-5.9 3.5-8.5Z"/>', 1.4),
  check: I('<path d="m5 12.5 4.5 4.5L19 7.5"/>', 2),
  tick: I('<circle cx="12" cy="12" r="8.5"/><path d="m8.5 12.3 2.4 2.4 4.6-4.9"/>', 1.4),
  filter: I('<path d="M4 7h10m4 0h2M4 17h4m4 0h8"/><circle cx="16" cy="7" r="2"/><circle cx="10" cy="17" r="2"/>')
};

/* мессенджеры — фирменные значки */
const MI = {
  wa: '<svg viewBox="0 0 24 24" fill="#fff"><path d="M17.47 14.38c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.65.07-.3-.15-1.26-.46-2.4-1.48-.89-.79-1.49-1.77-1.66-2.07-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.67-1.61-.92-2.21-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.48s1.07 2.88 1.21 3.08c.15.2 2.1 3.2 5.08 4.49.71.31 1.26.49 1.69.63.71.23 1.36.2 1.87.12.57-.09 1.76-.72 2.01-1.41.25-.69.25-1.29.17-1.41-.07-.12-.27-.2-.57-.35M12.05 21.5h-.01a9.4 9.4 0 0 1-4.8-1.31l-.34-.2-3.57.94.95-3.48-.22-.36a9.4 9.4 0 0 1-1.44-5.02c0-5.2 4.24-9.44 9.45-9.44a9.4 9.4 0 0 1 9.44 9.45c0 5.2-4.24 9.43-9.46 9.43m8.04-17.47A11.3 11.3 0 0 0 12.05.7C5.78.7.68 5.8.68 12.06c0 2 .52 3.96 1.52 5.68L.58 23.7l6.1-1.6a11.3 11.3 0 0 0 5.36 1.37h.01c6.26 0 11.36-5.1 11.37-11.36 0-3.04-1.18-5.89-3.33-8.04"/></svg>',
  tg: '<svg viewBox="0 0 24 24" fill="#fff"><path d="M9.78 15.27 9.6 19.3c.34 0 .5-.15.68-.33l1.64-1.57 3.4 2.49c.62.34 1.07.16 1.24-.58l2.24-10.55c.2-.92-.33-1.28-.94-1.06L4.7 12.85c-.9.35-.89.86-.15 1.08l3.37 1.05 7.83-4.94c.37-.24.7-.1.43.13"/></svg>',
  max: '<img src="img/max.svg" alt="" width="38" height="38">'
};
const MSG = `<div class="msgs">
  <a class="msg" href="${WA}" target="_blank" rel="noopener"><span class="mi wa">${MI.wa}</span>WhatsApp</a>
  <a class="msg" href="${TG}" target="_blank" rel="noopener"><span class="mi tg">${MI.tg}</span>Telegram</a>
  <a class="msg" href="${MAX}" target="_blank" rel="noopener"><span class="mi max">${MI.max}</span>MAX</a>
</div>`;

/* ---------- корзина (хранится в браузере покупателя) ---------- */
const CART_KEY = 'bb_cart_v1';
try { localStorage.removeItem('bb_promo_v1'); } catch (e) {} /* промокод убран по решению клиента */
function cartRead() { try { return (JSON.parse(localStorage.getItem(CART_KEY)) || []).filter(i => byId(i.id)); } catch (e) { return []; } }
function cartWrite(c) { try { localStorage.setItem(CART_KEY, JSON.stringify(c)); } catch (e) {} paintCount(); }
function cartAdd(id, size = '', note = '', qty = 1) {
  const c = cartRead();
  const f = c.find(i => i.id === id && i.size === size && i.note === note);
  if (f) f.qty += qty; else c.push({ id, size, note, qty });
  cartWrite(c);
  toast(`Добавили в корзину <a href="cart.html">Открыть</a>`);
}
function cartCount() { return cartRead().reduce((s, i) => s + i.qty, 0); }
function cartSum() { return cartRead().reduce((s, i) => s + byId(i.id).price * i.qty, 0); }
function paintCount() { const n = cartCount(); document.querySelectorAll('.cart-n').forEach(el => { el.textContent = n || ''; }); }

let toastTimer;
function toast(html) {
  let el = document.querySelector('.toast');
  if (!el) { el = document.createElement('div'); el.className = 'toast'; el.setAttribute('role', 'status'); document.body.appendChild(el); }
  el.innerHTML = html;
  requestAnimationFrame(() => el.classList.add('on'));
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.remove('on'), 2600);
}

/* ---------- шапка и подвал: одинаковые на всех страницах ---------- */
const NAV = [
  ['catalog.html?occ=ny', 'Новый год', 'ny'],
  ['catalog.html?cat=gifts', 'Наборы', 'gifts'],
  ['catalog.html?cat=wear', 'Пижамы', 'wear'],
  ['catalog.html?cat=home', 'Для дома', 'home'],
  ['corporate.html', 'Компаниям', 'corp']
];
function paintChrome(active) {
  const links = NAV.map(([h, t, k]) => `<a href="${h}"${active === k ? ' class="on"' : ''}>${t}</a>`).join('');
  const top = (extra) => `<div class="top">
      <a class="logo" href="index.html">Beige&nbsp;Box</a>
      ${extra}
      <div class="icons">
        <a class="ic" href="catalog.html?find=1" aria-label="Поиск">${ICON.search}</a>
        <a class="ic" href="cart.html" aria-label="Корзина">${ICON.bag}<b class="cart-n"></b></a>
        <button class="ic burger" type="button" aria-label="Меню" data-menu="open">${ICON.menu}</button>
      </div>
    </div>`;
  const h = document.getElementById('site-header');
  if (h) h.outerHTML = `<header class="site-head">${top(`<nav class="nav" aria-label="Разделы">${links}</nav>`)}</header>
  <div class="drawer" id="drawer" aria-hidden="true">
    <div class="top"><a class="logo" href="index.html">Beige&nbsp;Box</a>
      <div class="icons"><button class="ic" type="button" aria-label="Закрыть меню" data-menu="close">${ICON.close}</button></div></div>
    <nav>${NAV.map(([h, t]) => `<a href="${h}">${t}${ICON.arr}</a>`).join('')}
      <a href="catalog.html">Весь каталог${ICON.arr}</a>
      <a href="delivery.html">Доставка и&nbsp;оплата${ICON.arr}</a>
      <a href="cart.html">Корзина${ICON.arr}</a></nav>
    <div class="d-msg"><p>Поможем выбрать подарок, напишите:</p>${MSG}</div>
  </div>`;

  const f = document.getElementById('site-footer');
  if (f) f.outerHTML = `<footer>
  <div class="wrap">
    <div class="foot">
      <div>
        <h3>Поможем выбрать подарок</h3>
        <p>Напишите, кому и&nbsp;на&nbsp;какой бюджет ищете, и&nbsp;мы&nbsp;подберём набор.</p>
        ${MSG}
      </div>
      <div>
        <h3>Магазин</h3>
        <ul>
          <li><a href="catalog.html">Весь каталог</a></li>
          <li><a href="catalog.html?cat=gifts">Подарочные наборы</a></li>
          <li><a href="catalog.html?cat=wear">Пижамы</a></li>
          <li><a href="catalog.html?cat=home">Для&nbsp;дома</a></li>
          <li><a href="corporate.html">Корпоративные подарки</a></li>
          <li><a href="delivery.html">Доставка и&nbsp;оплата</a></li>
          <li><a href="delivery.html#return">Возврат и&nbsp;обмен</a></li>
        </ul>
      </div>
      <div>
        <h3>Контакты</h3>
        <p><a href="tel:+79527287542">+7&nbsp;952&nbsp;728-75-42</a>, Анна</p>
        <p><a href="mailto:info@beigebox-shop.ru">info@beigebox-shop.ru</a></p>
        <p>Екатеринбург, доставка по&nbsp;России и&nbsp;СНГ</p>
        <h3 class="soc-h">Мы&nbsp;в&nbsp;соцсетях</h3>
        <div class="soc">
          <a href="https://vk.com/club211012111" target="_blank" rel="noopener">ВКонтакте</a>
          <a href="https://t.me/beige_box" target="_blank" rel="noopener">Telegram</a>
          <a href="https://www.pinterest.ru/Beige_box_/_created/" target="_blank" rel="noopener">Pinterest</a>
          <a href="https://www.instagram.com/beige_box_" target="_blank" rel="noopener">Instagram*</a>
          <a href="https://www.wildberries.ru/seller/344109" target="_blank" rel="noopener">Wildberries</a>
        </div>
        <p class="soc-note">* Instagram принадлежит компании Meta, признанной экстремистской и&nbsp;запрещённой в&nbsp;РФ.</p>
      </div>
    </div>
    <div class="brand" aria-hidden="true"><span id="brandW">BEIGE BOX</span></div>
  </div>
  <div class="wrap"><div class="legal"><span>ИП&nbsp;Граф&nbsp;А.&nbsp;С., ИНН&nbsp;662340692935</span><span>© Beige Box, 2026</span></div></div>
</footer>`;
  paintCount();

  const dr = document.getElementById('drawer');
  document.querySelectorAll('[data-menu]').forEach(b => b.addEventListener('click', () => {
    const open = b.dataset.menu === 'open';
    dr.classList.toggle('open', open);
    dr.setAttribute('aria-hidden', String(!open));
    document.body.classList.toggle('lock', open);
  }));
  fitBrand();
}

/* огромные слова — ровно по ширине блока */
function fitWord(el, box, share) {
  if (!el || !box) return;
  el.style.fontSize = '200px';
  el.style.fontSize = Math.floor(200 * (box.clientWidth * share) / el.offsetWidth) + 'px';
}
function fitBrand() { fitWord(document.getElementById('brandW'), document.querySelector('.brand'), 1); }
addEventListener('resize', fitBrand);
if (document.fonts) document.fonts.ready.then(fitBrand);

/* ---------- карточка товара в сетке ---------- */
function inside(p) {
  if (p.items && p.items.length) {
    const it = p.items.filter(x => !/открытк|декор|коробк|пакет/i.test(x)).slice(0, 4).map(x => x.replace(/\s*\d+\*\d+\s*см/g, ''));
    return cap(it.join(', '));
  }
  return p.comp ? cap(p.comp.replace(/\s*\d+\*\d+\s*см/g, '')) : '';
}
function cardHTML(p) {
  const badge = p.soldout ? '<span class="badge out">Нет в наличии</span>' : p.badge === 'hit' ? '<span class="badge">Хит</span>' : p.badge === 'new' ? '<span class="badge">Новинка</span>' : '';
  const img2 = p.photos[1] ? `<img src="${p.photos[1]}" alt="" loading="lazy">` : '';
  const sized = p.sizes && p.sizes.length;
  const btn = p.soldout ? `<button class="go" type="button" disabled aria-label="Нет в наличии">${ICON.bag}</button>`
    : sized ? `<a class="go" href="product.html?id=${p.id}" aria-label="Выбрать размер">${ICON.ruler}</a>`
    : `<button class="go" type="button" aria-label="В корзину" onclick="cartAdd('${p.id}')">${ICON.bagPlus}</button>`;
  return `<article class="card${p.soldout ? ' soldout' : ''}">
    <a class="im" href="product.html?id=${p.id}">${badge}<img src="${p.photos[0]}" alt="${p.name}" loading="lazy">${img2}</a>
    <div class="bd">
      <a class="nm" href="product.html?id=${p.id}">${nb(p.name)}</a>
      <div class="ins">${nb(inside(p))}</div>
      <div class="pr"><b>${RUB(p.price)}</b>${btn}</div>
    </div>
  </article>`;
}

document.addEventListener('DOMContentLoaded', () => paintChrome(document.body.dataset.page || ''));
