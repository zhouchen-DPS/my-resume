/* ============================================================
   ZHOU CHEN · Personal Website
   Main JavaScript
   ============================================================ */

/* ===== AOS INIT ===== */
AOS.init({
  duration: 680,
  easing: 'ease-out-cubic',
  once: true,
  offset: 72,
});

/* ===== GSAP SCROLLTRIGGER ===== */
gsap.registerPlugin(ScrollTrigger);

/* ===== HERO ENTRANCE ANIMATION ===== */
const heroTl = gsap.timeline({ delay: 0.2 });

heroTl
  .to('.hero-tag', {
    opacity: 1, y: 0, duration: 0.6, ease: 'power2.out',
  })
  .to('.hero-name', {
    opacity: 1, y: 0, duration: 0.75, ease: 'power2.out',
  }, '-=0.3')
  .to('.hero-subtitle', {
    opacity: 1, y: 0, duration: 0.7, ease: 'power2.out',
  }, '-=0.45')
  .to('.hero-motto', {
    opacity: 1, y: 0, duration: 0.7, ease: 'power2.out',
  }, '-=0.45');

/* ===== HERO PARALLAX ===== */
gsap.to('#heroBg', {
  yPercent: 28,
  ease: 'none',
  scrollTrigger: {
    trigger: '#hero',
    start: 'top top',
    end: 'bottom top',
    scrub: true,
  },
});

gsap.to('#heroPerson', {
  yPercent: 16,
  ease: 'none',
  scrollTrigger: {
    trigger: '#hero',
    start: 'top top',
    end: 'bottom top',
    scrub: true,
  },
});

/* ===== NAVBAR SCROLL ===== */
const navbar = document.getElementById('navbar');

window.addEventListener('scroll', () => {
  if (window.scrollY > 72) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
}, { passive: true });

/* ===== NAV ACTIVE STATE (Intersection Observer) ===== */
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-link');

const sectionObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        navLinks.forEach((link) => {
          link.classList.toggle('active', link.dataset.section === entry.target.id);
        });
      }
    });
  },
  { rootMargin: '-40% 0px -58% 0px' },
);

sections.forEach((section) => sectionObserver.observe(section));

/* ===== HAMBURGER MENU ===== */
const hamburger    = document.getElementById('hamburger');
const mobileOverlay = document.getElementById('mobileOverlay');
const mobileClose  = document.getElementById('mobileClose');
const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');

function openMobileMenu() {
  mobileOverlay.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeMobileMenu() {
  mobileOverlay.classList.remove('open');
  document.body.style.overflow = '';
}

hamburger.addEventListener('click', openMobileMenu);
mobileClose.addEventListener('click', closeMobileMenu);

mobileNavLinks.forEach((link) => {
  link.addEventListener('click', closeMobileMenu);
});

/* ===== WECHAT MODAL ===== */
const wechatBtn   = document.getElementById('wechatBtn');
const wechatModal = document.getElementById('wechatModal');
const modalClose  = document.getElementById('modalClose');

function openModal() {
  wechatModal.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  wechatModal.classList.remove('open');
  document.body.style.overflow = '';
}

wechatBtn.addEventListener('click', openModal);
modalClose.addEventListener('click', closeModal);

wechatModal.addEventListener('click', (e) => {
  if (e.target === wechatModal) closeModal();
});

/* ===== EMAIL MODAL ===== */
const emailBtn        = document.getElementById('emailBtn');
const emailModal      = document.getElementById('emailModal');
const emailModalClose = document.getElementById('emailModalClose');

emailBtn.addEventListener('click', () => {
  emailModal.classList.add('open');
  document.body.style.overflow = 'hidden';
});

emailModalClose.addEventListener('click', () => {
  emailModal.classList.remove('open');
  document.body.style.overflow = '';
});

emailModal.addEventListener('click', (e) => {
  if (e.target === emailModal) {
    emailModal.classList.remove('open');
    document.body.style.overflow = '';
  }
});

/* ===== ESC KEY ===== */
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    closeModal();
    emailModal.classList.remove('open');
    document.body.style.overflow = '';
    closeMobileMenu();
  }
});

/* ===== TIMELINE PROGRESS LINE ===== */
const timelineFill   = document.getElementById('timelineFill');
const timelineEl     = document.querySelector('.timeline');

if (timelineFill && timelineEl) {
  ScrollTrigger.create({
    trigger: '.timeline',
    start: 'top 82%',
    end: 'bottom 18%',
    onUpdate(self) {
      timelineFill.style.height = (self.progress * 100) + '%';
    },
  });
}

/* ===== PROJECT CARD EXPAND ===== */
const expandBtns = document.querySelectorAll('.card-expand-btn');

expandBtns.forEach((btn) => {
  btn.addEventListener('click', (e) => {
    e.stopPropagation();
    const card         = btn.closest('.project-card');
    const achievements = card.querySelector('.card-achievements');
    const isOpen       = achievements.classList.contains('open');

    achievements.classList.toggle('open');
    btn.innerHTML = isOpen
      ? '查看项目达成 &#8595;'
      : '收起详情 &#8593;';
  });
});

/* ===== LUCIDE ICONS ===== */
lucide.createIcons();

/* ===== SMOOTH SCROLL FOR ANCHOR LINKS ===== */
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener('click', (e) => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});
