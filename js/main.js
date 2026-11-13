/* BEIGE BOX — общая логика прототипа: шапка, подвал, связь, корзина, карточки */

const CATS = [
  { id: 'gifts', name: 'Подарочные наборы', img: 'img/p/757443679033-2.jpg' },
  { id: 'wear',  name: 'Пижамы',            img: 'img/p/442998510493-2.jpg' },
  { id: 'home',  name: 'Для дома',          img: 'img/p/335839851832-2.jpg' },
  { id: 'care',  name: 'Мыло, соль, бомбочки', img: 'img/p/443228904873-2.jpg' },
  { id: 'socks', name: 'Носки и гольфы',    img: 'img/p/675174404872-2.jpg' },
  { id: 'acc',   name: 'Аксессуары',        img: 'img/p/392843466532-2.jpg' }
];
const WHO = { her: 'Для неё', him: 'Для него', two: 'Для двоих', work: 'Коллегам' };
const OCC = { ny: 'Новый год', '23feb': '23 февраля', '14feb': '14 февраля', '8march': '8 марта', bday: 'День рождения' };
const BUDGET = { b1: 'До 1 500 ₽', b2: '1 500–3 000 ₽', b3: 'От 3 000 ₽' };
const isGift = p => p.cat === 'gifts' || (p.who.length > 0 && p.occ.length > 0);
const inBudget =(p, b) => b === 'b1' ? p.price < 1500 : b === 'b2' ? p.price >= 1500 && p.price <= 3000 : p.price > 3000;

const WA = 'https://wa.me/79527287542';
const TG = 'https://t.me/beige_box';
const MAX = 'https://max.ru/id662340692935_biz';
const FREE_FROM = 500;

/* типографика для текстов из данных: короткие слова не висят в конце строки, последнее слово не остаётся одно */
const nb = t => String(t || '')
  .replace(/(^|[\s(«])(в|во|и|с|со|из|к|ко|на|по|за|от|до|для|о|об|у|не|а|но|или|без)\s+/gi, '$1$2 ')
  .replace(/\s+(—)/g, ' $1')
  .replace(/\s+(\S{1,10})$/, ' $1');
const RUB = n => n.toLocaleString('ru-RU').replace(/\s/g, ' ') + ' ₽';
const byId = id => PRODUCTS.find(p => p.id === id);
const qs = new URLSearchParams(location.search);
const plural = (n, a, b, c) => n % 10 === 1 && n % 100 !== 11 ? a : (n % 10 >= 2 && n % 10 <= 4 && (n % 100 < 10 || n % 100 >= 20) ? b : c);

const MSG = `
  <a class="msg" href="${WA}" target="_blank" rel="noopener"><span class="mi wa"><i class="ti ti-brand-whatsapp"></i></span>WhatsApp</a>
  <a class="msg" href="${TG}" target="_blank" rel="noopener"><span class="mi tg"><i class="ti ti-brand-telegram"></i></span>Telegram</a>
  <a class="msg" href="${MAX}" target="_blank" rel="noopener"><span class="mi max"><i class="ti ti-message-circle-2"></i></span>MAX</a>`;

/* ---------- корзина ---------- */
const CART_KEY = 'bb_cart_v1', PROMO_KEY = 'bb_promo_v1';
const PROMO = { code: 'DEMO10', discount: 10 };
function cartRead() { try { return JSON.parse(localStorage.getItem(CART_KEY)) || []; } catch (e) { return []; } }
function cartWrite(c) { try { localStorage.setItem(CART_KEY, JSON.stringify(c)); } catch (e) {} paintCount(); }
function cartAdd(id, size = '', note = '', qty = 1) {
  const c = cartRead();
  const f = c.find(i => i.id === id && i.size === size && i.note === note);
  if (f) f.qty += qty; else c.push({ id, size, note, qty });
  cartWrite(c);
  toast('Добавлено в корзину');
}
function cartCount() { return cartRead().reduce((s, i) => s + i.qty, 0); }
function cartSum() { return cartRead().reduce((s, i) => s + (byId(i.id) ? byId(i.id).price * i.qty : 0), 0); }
function promoOn() { try { return localStorage.getItem(PROMO_KEY) === '1'; } catch (e) { return false; } }
function promoSet(on) { try { on ? localStorage.setItem(PROMO_KEY, '1') : localStorage.removeItem(PROMO_KEY); } catch (e) {} }
function cartDiscount() { return promoOn() ? Math.round(cartSum() * PROMO.discount / 100) : 0; }
function paintCount() { document.querySelectorAll('.cart-count').forEach(el => { el.textContent = cartCount(); }); }

let toastTimer;
function toast(text) {
  let el = document.querySelector('.toast');
  if (!el) { el = document.createElement('div'); el.className = 'toast'; document.body.appendChild(el); }
  el.textContent = text;
  requestAnimationFrame(() => el.classList.add('on'));
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.remove('on'), 2200);
}

/* ---------- шапка и подвал ---------- */
function paintChrome(active) {
  const nav = [
    ['catalog.html?cat=gifts', 'Подарки', 'gifts'],
    ['catalog.html?cat=wear', 'Пижамы', 'wear'],
    ['catalog.html?cat=home', 'Для дома', 'home'],
    ['catalog.html', 'Все товары', 'catalog'],
    ['corporate.html', 'Корпоративным клиентам', 'corp'],
    ['delivery.html', 'Доставка', 'delivery']
  ].map(([h, t, k]) => `<a href="${h}"${active === k ? ' class="active"' : ''}>${t}</a>`).join('');

  const header = `
  <div class="demo-bar">Прототип магазина для&nbsp;BEIGE BOX. Товары, цены, состав и&nbsp;фото&nbsp;— с&nbsp;сайта бренда, наличие&nbsp;— для&nbsp;примера.</div>
  <div class="topline"><div class="wrap">
    <span><i class="ti ti-truck"></i>Бесплатная доставка от&nbsp;${FREE_FROM}&nbsp;₽</span>
    <span><i class="ti ti-gift"></i>Упаковка уже в&nbsp;цене набора</span>
    <span><i class="ti ti-tag"></i>Цены ниже, чем&nbsp;на&nbsp;маркетплейсах</span>
  </div></div>
  <header class="site"><div class="head">
    <button class="icon-btn burger" type="button" aria-label="Меню"><i class="ti ti-menu-2"></i></button>
    <a href="index.html" class="logo"><span class="box"></span>BEIGE BOX</a>
    <nav class="main">${nav}</nav>
    <div class="head-act">
      <div class="contact"><button type="button" class="icon-btn contact-btn"><i class="ti ti-message-circle"></i><span class="lbl">Написать</span></button>
        <div class="contact-menu"><p>Где вам удобнее?</p>${MSG}</div></div>
      <a href="cart.html" class="icon-btn" aria-label="Корзина"><i class="ti ti-shopping-bag"></i><span class="cart-count">0</span></a>
    </div>
  </div></header>`;

  const footer = `
  <footer class="site"><div class="wrap">
    <div class="f-grid">
      <div>
        <a href="index.html" class="logo"><span class="box"></span>BEIGE BOX</a>
        <p style="margin-top:16px;max-width:32ch">Эстетичные подарки, пижамы и&nbsp;уютные мелочи для&nbsp;дома. Екатеринбург, доставка по&nbsp;всей России.</p>
      </div>
      <div><h4>Каталог</h4><ul>
        ${CATS.map(c => `<li><a href="catalog.html?cat=${c.id}">${c.name}</a></li>`).join('')}
      </ul></div>
      <div><h4>Покупателям</h4><ul>
        <li><a href="delivery.html">Доставка и&nbsp;оплата</a></li>
        <li><a href="delivery.html#return">Возврат и&nbsp;обмен</a></li>
        <li><a href="corporate.html">Корпоративные подарки</a></li>
        <li><a href="https://www.wildberries.ru/seller/344109" target="_blank" rel="noopener">Мы на&nbsp;Wildberries</a></li>
        <li><a href="https://www.ozon.ru/seller/beige-box-237131/" target="_blank" rel="noopener">Мы на&nbsp;Ozon</a></li>
      </ul></div>
      <div><h4>Связаться</h4>
        <p style="margin-bottom:6px"><a href="tel:+79527287542">+7 952 728-75-42</a></p>
        <p><a href="mailto:info@beigebox-shop.ru">info@beigebox-shop.ru</a></p>
        ${MSG}
      </div>
    </div>
    <div class="f-bottom">
      <span>© 2026 BEIGE BOX · ИП Граф Анна Сергеевна · Прототип сайта</span>
      <span>Прототип собрала: Анна</span>
    </div>
  </div></footer>`;

  const h = document.getElementById('site-header'), f = document.getElementById('site-footer');
  if (h) h.innerHTML = header;
  if (f) f.innerHTML = footer;
  paintCount();

  document.querySelectorAll('.contact-btn').forEach(b => b.addEventListener('click', e => {
    e.stopPropagation(); b.parentElement.classList.toggle('open');
  }));
  document.addEventListener('click', () => document.querySelectorAll('.contact.open').forEach(c => c.classList.remove('open')));
  const burger = document.querySelector('.burger');
  if (burger) burger.addEventListener('click', () => document.querySelector('nav.main').classList.toggle('open'));
}

/* ---------- карточка в сетке ---------- */
function inside(p) {
  if (p.items && p.items.length) {
    const it = p.items.filter(x => !/открытк|декор|коробк|пакет/i.test(x)).slice(0, 4);
    return 'Внутри: ' + it.join(', ').replace(/\d+\*\d+\s*см/g, '').trim();
  }
  return p.comp ? p.comp.replace(/\d+\*\d+\s*см/g, '') : '';
}
function cardHTML(p) {
  const badge = p.badge === 'hit' ? '<span class="badge">Хит</span>' : p.badge === 'new' ? '<span class="badge new">Новинка</span>' : '';
  const img2 = p.photos[1] ? `<img src="${p.photos[1]}" alt="" loading="lazy">` : '';
  const sized = p.sizes && p.sizes.length;
  return `<article class="card">
    ${badge}
    <a class="pi" href="product.html?id=${p.id}"><img src="${p.photos[0]}" alt="${p.name}" loading="lazy">${img2}</a>
    <div class="card-body">
      <h3><a href="product.html?id=${p.id}">${nb(p.name)}</a></h3>
      <div class="inside">${nb(inside(p))}</div>
      <div class="row">
        <span class="price">${RUB(p.price)}</span>
        ${sized ? `<a class="add" href="product.html?id=${p.id}" title="Выбрать размер"><i class="ti ti-ruler-2"></i></a>`
                : `<button class="add" type="button" title="В корзину" onclick="cartAdd('${p.id}')"><i class="ti ti-shopping-bag-plus"></i></button>`}
      </div>
    </div>
  </article>`;
}

document.addEventListener('DOMContentLoaded', () => paintChrome(document.body.dataset.page || ''));
