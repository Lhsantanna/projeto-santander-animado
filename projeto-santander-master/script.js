// Navegação, animações de entrada e parallax da hero
(() => {
  const menuButton = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.main-nav');
  if (menuButton && nav) {
    menuButton.addEventListener('click', () => {
      const isOpen = menuButton.getAttribute('aria-expanded') === 'true';
      menuButton.setAttribute('aria-expanded', String(!isOpen));
      menuButton.setAttribute('aria-label', isOpen ? 'Abrir menu' : 'Fechar menu');
      nav.classList.toggle('open', !isOpen);
    });
    nav.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
      nav.classList.remove('open');
      menuButton.setAttribute('aria-expanded', 'false');
      menuButton.setAttribute('aria-label', 'Abrir menu');
    }));
  }

  // Ativa a entrada dos elementos quando chegam à tela.
  const revealItems = document.querySelectorAll('.reveal');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduceMotion || !('IntersectionObserver' in window)) {
    revealItems.forEach(item => item.classList.add('is-visible'));
  } else {
    const observer = new IntersectionObserver((entries, currentObserver) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          currentObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.14, rootMargin: '0px 0px -35px 0px' });
    revealItems.forEach(item => observer.observe(item));
  }

  // Parallax discreto no desktop; desativado em telas pequenas e para quem reduz movimento.
  // Movimento sutil da arte principal no desktop
  const heroArt = document.querySelector('.hero-art');
  if (heroArt && !reduceMotion && window.matchMedia('(min-width: 701px)').matches) {
    let ticking = false;
    window.addEventListener('scroll', () => {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(() => {
        const y = Math.min(window.scrollY, 500);
        heroArt.style.setProperty('--scroll-shift', `${y * 0.08}px`);
        heroArt.style.transform = `translateY(${y * 0.08}px)`;
        ticking = false;
      });
    }, { passive: true });
  }
})();

// Apple Pay: traz o aparelho apontado ou focado para a frente.
document.querySelectorAll('.device-stage').forEach(stage => {
  const phone = stage.querySelector('.hotspot-phone');
  const watch = stage.querySelector('.hotspot-watch');
  const setFront = (device) => {
    stage.classList.toggle('is-phone-front', device === 'phone');
    stage.classList.toggle('is-watch-front', device === 'watch');
  };
  [[phone, 'phone'], [watch, 'watch']].forEach(([target, device]) => {
    if (!target) return;
    target.addEventListener('pointerenter', () => setFront(device));
    target.addEventListener('focus', () => setFront(device));
    target.addEventListener('pointerleave', () => setFront(null));
    target.addEventListener('blur', () => setFront(null));
  });
});

