// SecureNet — motion & interaction bootstrap (Lenis + GSAP + widgets)
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import 'leaflet/dist/leaflet.css';

gsap.registerPlugin(ScrollTrigger);
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
const mqNarrow = matchMedia('(max-width: 900px)');

/* ---------- Smooth scroll ---------- */
let lenis: Lenis | null = null;
if (!reduce) {
  lenis = new Lenis({ lerp: 0.09, smoothWheel: true });
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((t) => lenis!.raf(t * 1000));
  gsap.ticker.lagSmoothing(0);
}
gsap.defaults({ ease: 'expo.out', duration: 1.1 });

// Anchor links → lenis smooth scroll
document.querySelectorAll<HTMLAnchorElement>('a[href^="/#"], a[href^="#"]').forEach((a) => {
  a.addEventListener('click', (e) => {
    const id = a.getAttribute('href')!.split('#')[1];
    const el = id && document.getElementById(id);
    if (!el) return;
    e.preventDefault();
    if (lenis) lenis.scrollTo(el, { offset: -66 });
    else el.scrollIntoView({ behavior: 'smooth' });
    closeMenu();
  });
});

/* ---------- Header state + dark rails ---------- */
try {
  const root = document.documentElement;
  const heroSec = document.querySelector<HTMLElement>('.hero');
  // Direct, desync-proof header toggle: transparent only while over the hero.
  const updateHeader = () => {
    const threshold = heroSec ? heroSec.offsetHeight - 66 : 60;
    root.classList.toggle('at-hero', window.scrollY < threshold);
  };
  updateHeader();
  window.addEventListener('scroll', updateHeader, { passive: true });
  if (lenis) lenis.on('scroll', updateHeader);
  const dark = new Set<Element>();
  document.querySelectorAll('.hero,.figures,.download,.site-footer,.reveal__pin').forEach((sec) => {
    ScrollTrigger.create({
      trigger: sec, start: 'top 55%', end: 'bottom 55%',
      onToggle: (s) => {
        if (s.isActive) dark.add(sec); else dark.delete(sec);
        document.documentElement.classList.toggle('rails-dark', dark.size > 0);
      },
    });
  });
} catch (e) { console.warn('header/rails', e); }

/* ---------- Generic reveals ---------- */
try {
  gsap.utils.toArray<HTMLElement>('[data-reveal]').forEach((el) => {
    if (reduce) return;
    const kids = el.dataset.reveal === 'lines'
      ? el.querySelectorAll('.title__line,.title__accent,.title__dot')
      : [el];
    gsap.from(kids, {
      yPercent: 24, opacity: 0, filter: 'blur(8px)', stagger: 0.08, duration: 1,
      scrollTrigger: { trigger: el, start: 'top 85%', once: true },
    });
  });
} catch (e) { console.warn('reveal', e); }

/* ---------- Odometers (rolling digits) ---------- */
function odometer(el: HTMLElement) {
  const target = el.dataset.value!;
  const fmt = new Intl.NumberFormat('fr-FR').format(+target);
  el.textContent = '';
  el.setAttribute('aria-label', fmt);
  if (reduce) { el.textContent = fmt; return; }
  [...fmt].forEach((ch, i) => {
    if (!/\d/.test(ch)) {
      const s = document.createElement('span');
      s.textContent = /\s/.test(ch) ? ' ' : ch;
      el.append(s); return;
    }
    const col = document.createElement('span'); col.className = 'odo__col'; col.setAttribute('aria-hidden', 'true');
    const reel = document.createElement('span'); reel.className = 'odo__reel';
    reel.innerHTML = Array.from({ length: 20 }, (_, k) => `<span>${k % 10}</span>`).join('');
    col.append(reel); el.append(col);
    const d = +ch;
    gsap.fromTo(reel, { yPercent: 0 }, {
      yPercent: -(10 + d) * 5, duration: 1.8 + i * 0.15, ease: 'power4.out',
      scrollTrigger: { trigger: el, start: 'top 90%', once: true },
    });
  });
}
try { gsap.utils.toArray<HTMLElement>('.odo').forEach(odometer); } catch (e) { console.warn('odo', e); }

/* ---------- Hero parallax + scanline ---------- */
try {
  if (!reduce) {
    gsap.to('[data-hero-parallax]', { yPercent: 18, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });
    gsap.to('.hero__ghost', { yPercent: -14, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });
    gsap.fromTo('#hero-scan', { top: '4%' }, { top: '94%', duration: 3.4, ease: 'sine.inOut', repeat: -1, yoyo: true });
    // headline rise from clip
    gsap.from('.hero__title .title__line,.hero__title .title__accent', {
      yPercent: 110, duration: 1.2, stagger: 0.1, ease: 'expo.out', delay: 0.1,
    });
  }
} catch (e) { console.warn('hero', e); }

/* ---------- Service card deck ---------- */
try {
  const deck = document.querySelector<HTMLElement>('[data-deck]');
  const cards = gsap.utils.toArray<HTMLElement>('.deck__card');
  const counter = document.getElementById('deck-count');
  const bar = document.getElementById('deck-bar');
  const total = cards.length;
  const setCounter = (n: number) => {
    if (counter) counter.innerHTML = `${String(n).padStart(2, '0')}<small>/0${total}</small>`;
    if (bar) bar.style.transform = `scaleX(${n / total})`;
  };
  if (deck && cards.length) {
    if (reduce || mqNarrow.matches) {
      deck.classList.add('deck--list');
      setCounter(total);
    } else {
      const tilt = [-2, 1.5, -1, 2.5, -1.5, 1, 0];
      cards.forEach((c, i) => gsap.set(c, { zIndex: total - i, rotate: tilt[i % 7], y: i * 6, x: i * -4 }));
      setCounter(1);
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: deck, start: 'top 22%', end: () => `+=${total * 80}%`, pin: true, scrub: 0.5,
          onUpdate: (s) => setCounter(Math.min(total, Math.floor(s.progress * total) + 1)),
        },
      });
      cards.slice(0, -1).forEach((c) => tl.to(c, { yPercent: -120, rotate: -8, opacity: 0, ease: 'power2.in', duration: 1 }));
    }
  }
} catch (e) { console.warn('deck', e); }

/* ---------- Pinned story ---------- */
try {
  const story = document.querySelector<HTMLElement>('[data-story]');
  const items = gsap.utils.toArray<HTMLElement>('.story__item');
  if (story && items.length) {
    if (reduce || mqNarrow.matches) {
      story.closest('.story')?.classList.add('story--list');
    } else {
      gsap.set(items, { autoAlpha: 0 });
      gsap.set(items[0], { autoAlpha: 1 });
      const tl = gsap.timeline({
        scrollTrigger: { trigger: story, start: 'top top', end: () => `+=${items.length * 100}%`, pin: true, scrub: 0.6 },
      });
      items.forEach((it, i) => {
        if (i === 0) return;
        tl.to(items[i - 1], { autoAlpha: 0, filter: 'blur(10px)', scale: 0.96, duration: 0.5 })
          .fromTo(it, { autoAlpha: 0, filter: 'blur(10px)', scale: 1.02 }, { autoAlpha: 1, filter: 'blur(0px)', scale: 1, duration: 0.5 }, '<0.1')
          .fromTo(it.querySelectorAll('.story__meta > *, .story__meta-left > *'), { y: 30, opacity: 0 }, { y: 0, opacity: 1, stagger: 0.05, duration: 0.5 }, '<0.1')
          .to({}, { duration: 0.4 });
      });
    }
  }
} catch (e) { console.warn('story', e); }

/* ---------- Reveal mask ("Sur le terrain") ---------- */
try {
  const pin = document.querySelector<HTMLElement>('[data-reveal-mask]');
  const svg = document.querySelector<SVGElement>('.reveal__svg');
  const caption = document.getElementById('reveal-caption');
  if (pin && svg && !reduce && !mqNarrow.matches) {
    gsap.timeline({ scrollTrigger: { trigger: '.reveal', start: 'top top', end: '+=180%', pin, scrub: 0.7 } })
      .to(svg, { scale: 14, transformOrigin: '50% 58%', ease: 'power2.in' })
      .to(svg, { opacity: 0, duration: 0.15 }, '>-0.15')
      .fromTo(caption, { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 0.3 }, '>-0.1');
  }
} catch (e) { console.warn('reveal-mask', e); }

/* ---------- Map (lazy Leaflet) ---------- */
try {
  const mapWrap = document.querySelector<HTMLElement>('[data-map]');
  const mapEl = document.getElementById('zones-map');
  if (mapWrap && mapEl) {
    const io = new IntersectionObserver(async (entries, obs) => {
      if (!entries.some((en) => en.isIntersecting)) return;
      obs.disconnect();
      const L = (await import('leaflet')).default;
      const zones = JSON.parse(mapWrap.dataset.zones || '[]') as { name: string; lat: number; lng: number; projects: string }[];
      const map = L.map(mapEl, { zoomControl: false, scrollWheelZoom: false, attributionControl: true }).setView([33.75, -7.2], 9);
      // CARTO Positron (light_all) raster tiles — requires a (public) basemap key.
      const cartoKey = import.meta.env.PUBLIC_CARTO_KEY || 'cb1_3waa_1_4ef9f9597e5ad17de85f36b8';
      L.tileLayer(`https://basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png?key=${cartoKey}`, {
        attribution: '© OpenStreetMap · © CARTO', maxZoom: 20,
      }).addTo(map);
      const icon = L.divIcon({
        className: 'pin',
        html: `<svg viewBox="0 0 20 24"><path d="M2 24V6h4V2h3v22M11 24V4h3v3h4v17" fill="#222f96"/></svg>`,
        iconSize: [22, 26], iconAnchor: [11, 24],
      });
      const group: any[] = [];
      zones.forEach((z) => {
        const m = L.marker([z.lat, z.lng], { icon }).addTo(map)
          .bindTooltip(`<b>${z.name}</b><small>${z.projects}</small>`, { className: 'pin-tip', direction: 'top', offset: [0, -20] });
        group.push(m);
      });
      try { map.fitBounds(L.featureGroup(group).getBounds().pad(0.35)); } catch {}
      document.getElementById('zoom-in')?.addEventListener('click', () => map.zoomIn());
      document.getElementById('zoom-out')?.addEventListener('click', () => map.zoomOut());
    }, { rootMargin: '200px' });
    io.observe(mapWrap);
  }
} catch (e) { console.warn('map', e); }

/* ---------- Mobile menu ---------- */
const burger = document.getElementById('burger');
const menu = document.getElementById('mobile-menu');
function closeMenu() {
  menu?.classList.remove('open');
  burger?.setAttribute('aria-expanded', 'false');
  document.body.style.overflow = '';
}
try {
  burger?.addEventListener('click', () => {
    const open = menu?.classList.toggle('open');
    burger.setAttribute('aria-expanded', open ? 'true' : 'false');
    document.body.style.overflow = open ? 'hidden' : '';
  });
  menu?.querySelectorAll('[data-close]').forEach((a) => a.addEventListener('click', closeMenu));
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeMenu(); });
} catch (e) { console.warn('menu', e); }

/* ---------- Contact form ---------- */
try {
  const form = document.getElementById('contact-form') as HTMLFormElement | null;
  const status = document.getElementById('contact-status');
  const title = document.getElementById('form-title');
  const submit = document.getElementById('contact-submit') as HTMLButtonElement | null;
  const showErr = (name: string, msg: string) => {
    const el = form?.querySelector(`[data-err="${name}"]`);
    if (el) el.textContent = msg;
  };
  form?.addEventListener('submit', async (e) => {
    e.preventDefault();
    form.querySelectorAll('.field-err').forEach((el) => (el.textContent = ''));
    if (status) status.textContent = '';
    const data = Object.fromEntries(new FormData(form).entries()) as Record<string, string>;
    let bad = false;
    if (!data.name?.trim()) { showErr('name', 'Indiquez votre nom ou société.'); bad = true; }
    if (!data.email?.trim() || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(data.email)) { showErr('email', 'E-mail invalide.'); bad = true; }
    if (!(form.querySelector('#f-consent') as HTMLInputElement)?.checked) { if (status) status.textContent = 'Merci de cocher le consentement.'; bad = true; }
    if (bad) return;
    submit && (submit.disabled = true);
    if (status) status.textContent = 'Envoi en cours…';
    try {
      const res = await fetch('/api/contact', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, source: location.pathname }),
      });
      const json = await res.json().catch(() => ({}));
      if (res.ok && json.ok) {
        if (title) title.innerHTML = 'Merci, <span class="title__accent">à très vite</span>.';
        if (status) status.textContent = 'Votre demande est bien reçue. On vous rappelle sous 48 h.';
        form.reset();
      } else {
        if (status) status.textContent = json.error || 'Une erreur est survenue. Réessayez ou appelez-nous.';
      }
    } catch {
      if (status) status.textContent = 'Connexion impossible. Réessayez ou appelez-nous.';
    } finally {
      submit && (submit.disabled = false);
    }
  });
} catch (e) { console.warn('contact', e); }

/* ---------- Download gate ---------- */
try {
  const dform = document.getElementById('download-form') as HTMLFormElement | null;
  const dmsg = document.getElementById('download-msg');
  dform?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(dform).entries()) as Record<string, string>;
    if (!data.email?.trim() || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(data.email)) {
      if (dmsg) dmsg.textContent = 'Indiquez un e-mail valide pour recevoir le dossier.'; return;
    }
    if (dmsg) dmsg.textContent = 'Préparation du dossier…';
    try {
      const res = await fetch('/api/download', {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data),
      });
      const json = await res.json().catch(() => ({}));
      if (res.ok && json.url) {
        if (dmsg) dmsg.textContent = 'Dossier prêt — ouverture…';
        window.open(json.url, '_blank');
        dform.reset();
      } else {
        if (dmsg) dmsg.textContent = json.error || 'Erreur. Réessayez.';
      }
    } catch {
      if (dmsg) dmsg.textContent = 'Connexion impossible. Réessayez.';
    }
  });
} catch (e) { console.warn('download', e); }

// Hide any image that fails to load (keeps the navy backdrop instead of a broken icon)
document.querySelectorAll<HTMLImageElement>('img').forEach((im) => {
  im.addEventListener('error', () => im.setAttribute('data-failed', ''));
});

// Refresh after fonts/layout settle
window.addEventListener('load', () => ScrollTrigger.refresh());
