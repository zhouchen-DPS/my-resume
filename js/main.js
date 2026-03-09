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
    journeyModal.classList.remove('open');
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

/* ===== TIMELINE CARD ENTRANCE ===== */
const timelineCards = document.querySelectorAll('.timeline-card');

const cardObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('card-visible');
        cardObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12 },
);

timelineCards.forEach((card, i) => {
  card.style.transitionDelay = `${i * 0.08}s`;
  cardObserver.observe(card);
});

/* ===== TIMELINE DOT IN-VIEW ===== */
const timelineDots = document.querySelectorAll('.timeline-dot');

const dotObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      entry.target.classList.toggle('in-view', entry.isIntersecting);
    });
  },
  { rootMargin: '-35% 0px -35% 0px' },
);

timelineDots.forEach((dot) => dotObserver.observe(dot));

/* ===== TIMELINE EXPAND (MODAL) ===== */
const journeyModal      = document.getElementById('journeyModal');
const journeyModalClose = document.getElementById('journeyModalClose');
const journeyModalDate  = document.getElementById('journeyModalDate');
const journeyModalCo    = document.getElementById('journeyModalCompany');
const journeyModalRole  = document.getElementById('journeyModalRole');
const journeyModalBody  = document.getElementById('journeyModalBody');

document.querySelectorAll('.timeline-expand-btn').forEach((btn) => {
  btn.addEventListener('click', () => {
    const card    = btn.closest('.timeline-card');
    const item    = btn.closest('.timeline-item');
    const company = card.querySelector('.timeline-company').textContent;
    const role    = card.querySelector('.timeline-role').textContent;
    const date    = item.querySelector('.timeline-date').textContent;
    const details = card.querySelector('.timeline-details');

    journeyModalDate.textContent = date;
    journeyModalCo.textContent   = company;
    journeyModalRole.textContent = role;
    journeyModalBody.innerHTML   = details.innerHTML;

    journeyModal.classList.add('open');
    document.body.style.overflow = 'hidden';
  });
});

journeyModalClose.addEventListener('click', () => {
  journeyModal.classList.remove('open');
  document.body.style.overflow = '';
});

journeyModal.addEventListener('click', (e) => {
  if (e.target === journeyModal) {
    journeyModal.classList.remove('open');
    document.body.style.overflow = '';
  }
});

/* ===== PROJECT CARD — click whole card to expand ===== */
const allProjectCards = document.querySelectorAll('.project-card');
allProjectCards.forEach((card) => {
  card.addEventListener('click', () => {
    const achievements = card.querySelector('.card-achievements');
    const isOpen = achievements.classList.contains('open');
    allProjectCards.forEach((c) => c.querySelector('.card-achievements').classList.remove('open'));
    if (!isOpen) achievements.classList.add('open');
  });
});

/* ===== PROJECT CARD STAGGER ANIMATION ===== */
const projectCards = document.querySelectorAll('.project-card');

const projectCardObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('pc-visible');
        projectCardObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.10 }
);

projectCards.forEach((card, i) => {
  card.style.transitionDelay = `${i * 0.07}s`;
  projectCardObserver.observe(card);
});

/* ===== STRENGTHS SLIDE-IN ===== */
const strengthsColLeft  = document.getElementById('strengthsColLeft');
const strengthsColRight = document.getElementById('strengthsColRight');

const strengthsObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        if (entry.target === strengthsColLeft)  entry.target.classList.add('animate-left');
        if (entry.target === strengthsColRight) entry.target.classList.add('animate-right');
        strengthsObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.15 },
);

if (strengthsColLeft)  strengthsObserver.observe(strengthsColLeft);
if (strengthsColRight) strengthsObserver.observe(strengthsColRight);

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
