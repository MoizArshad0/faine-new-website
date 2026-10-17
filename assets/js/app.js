const services = window.faineServices || [];
const navigation = window.faineNavigation || [];
document.documentElement.classList.add('js-motion');

const routeHref = (route) => route === '/' ? './' : route.replace(/^\//, '') + '/';
const homeHref = routeHref('/');
const bookingHref = routeHref('/booking');
const consultationHref = routeHref('/consultation');

const header = document.querySelector('#site-header');
if (header) {
  const links = navigation.map((item) => '<a href="' + routeHref(item.href) + '">' + item.label + '</a>').join('');
  header.innerHTML = '<header class="site-header"><div class="nav-wrap"><a class="brand" href="' + homeHref + '" aria-label="fAIne Labs home"><span class="brand-mark">f<span>AI</span>ne</span><span class="brand-divider"></span><span class="brand-labs">LABS</span></a><button class="menu-toggle" type="button" aria-expanded="false" aria-controls="main-nav" aria-label="Open menu"><span></span><span></span></button><nav id="main-nav" class="main-nav" aria-label="Main navigation">' + links + '<button class="theme-toggle" type="button" aria-label="Switch to light mode" aria-pressed="false"><span class="theme-icon" aria-hidden="true">☼</span><span class="theme-label">Light mode</span></button><a class="button button-primary nav-cta" href="' + bookingHref + '">Book a Consultation <span aria-hidden="true">↗</span></a></nav></div></header>';
}

const footer = document.querySelector('#site-footer');
if (footer) {
  const footerLinks = [{label:'Home',href:'./'}, ...navigation];
  footer.innerHTML = '<footer class="site-footer"><div class="wrap footer-main"><a class="brand" href="' + homeHref + '" aria-label="fAIne Labs home"><span class="brand-mark">f<span>AI</span>ne</span><span class="brand-divider"></span><span class="brand-labs">LABS</span></a><p>AI systems for businesses that refuse to lose revenue.</p><nav aria-label="Footer navigation">' + footerLinks.map((item) => '<a href="' + routeHref(item.href) + '">' + item.label + '</a>').join('') + '<a href="' + bookingHref + '">Booking</a></nav><span class="copyright">© ' + new Date().getFullYear() + ' fAIne Labs</span></div></footer>';
}

const themeToggle = document.querySelector('.theme-toggle');
function applyTheme(theme) {
  const light = theme === 'light';
  document.documentElement.dataset.theme = light ? 'light' : 'dark';
  if (!themeToggle) return;
  themeToggle.setAttribute('aria-pressed', String(light));
  themeToggle.setAttribute('aria-label', light ? 'Switch to dark mode' : 'Switch to light mode');
  themeToggle.querySelector('.theme-label').textContent = light ? 'Dark mode' : 'Light mode';
  themeToggle.querySelector('.theme-icon').textContent = light ? '☾' : '☼';
}
let savedTheme = null;
try { savedTheme = localStorage.getItem('faine-theme'); } catch {}
applyTheme(savedTheme === 'light' ? 'light' : 'dark');
themeToggle?.addEventListener('click', () => {
  const next = document.documentElement.dataset.theme === 'light' ? 'dark' : 'light';
  applyTheme(next);
  try { localStorage.setItem('faine-theme', next); } catch {}
});

const menu = document.querySelector('.menu-toggle');
menu?.addEventListener('click', () => {
  const open = menu.getAttribute('aria-expanded') === 'true';
  menu.setAttribute('aria-expanded', String(!open));
  menu.setAttribute('aria-label', open ? 'Open menu' : 'Close menu');
  document.querySelector('.main-nav')?.classList.toggle('is-open', !open);
});
document.querySelectorAll('.main-nav a').forEach((link) => link.addEventListener('click', () => {
  menu?.setAttribute('aria-expanded', 'false');
  document.querySelector('.main-nav')?.classList.remove('is-open');
}));

const detail = document.querySelector('.service-detail');
document.querySelectorAll('.service-tab').forEach((tab) => tab.addEventListener('click', () => {
  const item = services[Number(tab.dataset.service)];
  if (!item || !detail) return;
  document.querySelectorAll('.service-tab').forEach((button) => {
    const selected = button === tab;
    button.classList.toggle('selected', selected);
    button.setAttribute('aria-selected', String(selected));
  });
  const number = String(Number(tab.dataset.service) + 1).padStart(2, '0');
  detail.innerHTML = '<div class="detail-kicker"><span class="detail-number">' + number + '</span><span class="eyebrow">CONNECTED TO YOUR CUSTOMER JOURNEY</span></div><h3>' + item.title + '</h3><p class="detail-intro">' + item.intro + '</p><div class="detail-grid"><div><span class="detail-label">THE FRICTION</span><p>' + item.problem + '</p></div><div><span class="detail-label">THE SYSTEM</span><p>' + item.solution + '</p></div></div><div class="outcome"><span>↳</span><p><b>THE OUTCOME</b><br>' + item.outcome + '</p></div>';
}));

const timeline = document.querySelector('.demo-timeline');
const replay = document.querySelector('.replay-button');
let timer;
function playDemo() {
  if (!timeline) return;
  clearTimeout(timer);
  timeline.querySelectorAll('.demo-item').forEach((item, index) => {
    item.classList.remove('visible');
    timer = setTimeout(() => item.classList.add('visible'), 160 + index * 430);
  });
}
replay?.addEventListener('click', playDemo);
if (timeline) playDemo();

const reveals = document.querySelectorAll('.reveal');
if ('IntersectionObserver' in window && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const observer = new IntersectionObserver((entries) => entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    }
  }), { threshold: 0.12 });
  reveals.forEach((element) => observer.observe(element));
} else reveals.forEach((element) => element.classList.add('is-visible'));
