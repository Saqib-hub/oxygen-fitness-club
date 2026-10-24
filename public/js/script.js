const toggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('.navbar nav ul');

if (toggle) {
  toggle.addEventListener('click', () => {
    nav.classList.toggle('show');
  });
}

window.addEventListener('scroll', () => {
  const navbar = document.querySelector('.navbar');
  if (window.scrollY > 50) {
    navbar.style.boxShadow = '0 2px 15px rgba(229,9,20,0.4)';
  } else {
    navbar.style.boxShadow = 'none';
  }
});

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.feature-card, .price-card, .gallery-grid img').forEach(el => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(30px)';
  el.style.transition = '0.6s ease';
  observer.observe(el);
});