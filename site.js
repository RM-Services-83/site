// ══════════════════════════════════════════════════
// ✏️ ID Formspree — remplacez si vous en créez un nouveau
//    Créez/gérez vos formulaires sur https://formspree.io
const FORM_DEVIS   = 'mqeyvprg';
const FORM_CONTACT = 'mqeyvprg';
// ══════════════════════════════════════════════════

app.use((req, res, next) => {
  res.setHeader("Content-Security-Policy", "script-src 'self' 'unsafe-eval';");
  next();
});

// Nav scroll
window.addEventListener('scroll', () => {
  document.getElementById('navbar').classList.toggle('scrolled', window.scrollY > 40);
});

// Scroll doux vers #devis
function scrollToDevis(e) {
  e.preventDefault();
  document.getElementById('devis').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// Scroll reveal
const revealObs = new IntersectionObserver(entries => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => entry.target.classList.add('visible'), i * 80);
      revealObs.unobserve(entry.target);
    }
  });
}, { threshold: 0.08 });
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.reveal').forEach(el => revealObs.observe(el));
});

// Sélection des prestations (multi-choix)
const selectedPrest = new Set();
function togglePrest(btn) {
  const val = btn.dataset.value;
  if (selectedPrest.has(val)) {
    selectedPrest.delete(val);
    btn.classList.remove('active');
  } else {
    selectedPrest.add(val);
    btn.classList.add('active');
  }
  document.getElementById('d-prestations').value = [...selectedPrest].join(', ');
}

// Envoi formulaire devis via Formspree
async function submitDevis() {
  const nom   = document.getElementById('d-nom').value.trim();
  const tel   = document.getElementById('d-tel').value.trim();
  const email = document.getElementById('d-email').value.trim();
  if (!nom || !tel || !email) { alert('Merci de renseigner votre nom, téléphone et email.'); return; }
  if (selectedPrest.size === 0) { alert('Veuillez sélectionner au moins un type de prestation.'); return; }

  const btn = document.getElementById('devisBtn');
  btn.disabled = true;
  btn.textContent = 'Envoi en cours…';

  const payload = {
    nom, telephone: tel, email,
    zone:                  document.getElementById('d-zone').value,
    prestations:           [...selectedPrest].join(', '),
    budget:                document.getElementById('d-budget').value,
    delai:                 document.getElementById('d-delai').value,
    description:           document.getElementById('d-desc').value,
    infos_complementaires: document.getElementById('d-infos').value,
  };

  try {
    const res = await fetch(https://formspree.io/f/{FORM_DEVIS}, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error();
  } catch {
    alert("Erreur lors de l'envoi. Contactez-moi directement par téléphone.");
    btn.disabled = false;
    btn.textContent = 'Envoyer ma demande de devis ✉️';
    return;
  }

  document.getElementById('devisFormWrapper').style.display = 'none';
  document.getElementById('devisSuccess').style.display = 'block';
}

// Envoi formulaire contact
async function submitContact() {
  const nom   = document.getElementById('c-nom').value.trim();
  const email = document.getElementById('c-email').value.trim();
  const msg   = document.getElementById('c-msg').value.trim();
  if (!nom || !email || !msg) { alert('Merci de remplir tous les champs.'); return; }

  const btn = document.getElementById('contactBtn');
  btn.disabled = true;
  btn.textContent = 'Envoi…';

  try {
    const res = await fetch(https://formspree.io/f/{FORM_CONTACT}, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify({ nom, email, message: msg }),
    });
    if (!res.ok) throw new Error();
  } catch {
    alert('Erreur réseau. Réessayez ou écrivez-moi directement.');
    btn.disabled = false;
    btn.textContent = 'Envoyer le message 📬';
    return;
  }

  btn.textContent = '✅ Message envoyé !';
  btn.style.background = 'var(--green-dark)';
}

// Lightbox galerie
function openLightbox(item) {
  const img = item.querySelector('img');
  const cap = item.querySelector('.gallery-caption');
  document.getElementById('lightbox-img').src = img.src;
  document.getElementById('lightbox-img').alt = img.alt;
  document.getElementById('lightbox-caption').textContent = cap ? cap.textContent : '';
  document.getElementById('lightbox').classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  document.getElementById('lightbox').classList.remove('open');
  document.body.style.overflow = '';
}

document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeLightbox();
});
