/**
 * Nutritionist Chef Radhey — Master Interactive Script
 * Handles Navigation, Quick Plan Finder, Filters, Booking Modals, and WhatsApp Form Handoff
 */

document.addEventListener('DOMContentLoaded', () => {
  initStickyHeader();
  initMobileMenu();
  initQuickFinder();
  initMealPlanTabs();
  initModals();
  initConsultationForms();
  initSearch();
});

/* ================= 1. Sticky Header ================= */
function initStickyHeader() {
  const header = document.querySelector('.main-header');
  if (!header) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });
}

/* ================= 2. Mobile Menu ================= */
function initMobileMenu() {
  const toggleBtn = document.querySelector('.mobile-toggle');
  const drawer = document.getElementById('mobileMenuDrawer');
  const overlay = document.getElementById('mobileDrawerOverlay');
  const closeBtn = document.getElementById('closeMobileMenu');

  if (!toggleBtn || !drawer) return;

  function openMenu() {
    drawer.classList.add('open');
    if (overlay) overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeMenu() {
    drawer.classList.remove('open');
    if (overlay) overlay.classList.remove('active');
    document.body.style.overflow = '';
  }

  toggleBtn.addEventListener('click', openMenu);
  if (closeBtn) closeBtn.addEventListener('click', closeMenu);
  if (overlay) overlay.addEventListener('click', closeMenu);

  drawer.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', closeMenu);
  });
}

/* ================= 3. Quick Plan Finder ================= */
function initQuickFinder() {
  const finderForm = document.getElementById('quickFinderForm');
  if (!finderForm) return;

  finderForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const goal = document.getElementById('finderGoal')?.value || 'Weight Management';
    const diet = document.getElementById('finderDiet')?.value || 'Balanced Macro';
    const timeline = document.getElementById('finderTimeline')?.value || '4 Weeks';

    // Open booking modal with prefilled data
    openBookingModal({
      service: `Custom Consultation (${diet} / ${goal})`,
      message: `Hi Chef Radhey, I used your Quick Plan Finder. My goal is ${goal}, preferred nutrition approach is ${diet}, and I am looking for a ${timeline} program. Please guide me.`
    });
  });
}

/* ================= 4. Meal Plans Filter Tabs ================= */
function initMealPlanTabs() {
  const tabBtns = document.querySelectorAll('.plan-tab-btn');
  const planCards = document.querySelectorAll('.plan-card');

  if (!tabBtns.length) return;

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      tabBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');

      planCards.forEach(card => {
        if (filter === 'all' || card.getAttribute('data-category') === filter) {
          card.style.display = 'flex';
          card.style.animation = 'fadeIn 0.4s ease';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

/* ================= 5. Modals Management ================= */
function initModals() {
  // Consultation trigger buttons
  document.querySelectorAll('[data-open-booking]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const serviceName = btn.getAttribute('data-service') || 'General Nutrition & Meal Planning';
      openBookingModal({ service: serviceName });
    });
  });

  // Close modals
  document.querySelectorAll('.modal-close-btn, .modal-overlay').forEach(el => {
    el.addEventListener('click', (e) => {
      if (e.target === el || el.classList.contains('modal-close-btn')) {
        closeAllModals();
      }
    });
  });

  // Stop propagation on modal containers
  document.querySelectorAll('.modal-container').forEach(c => {
    c.addEventListener('click', e => e.stopPropagation());
  });
}

function openBookingModal(data = {}) {
  const modal = document.getElementById('bookingModal');
  if (!modal) return;

  if (data.service) {
    const serviceInput = modal.querySelector('#modalServiceSelect');
    if (serviceInput) {
      // If service matches option, select it, otherwise set value
      let matched = false;
      Array.from(serviceInput.options).forEach(opt => {
        if (opt.value.toLowerCase().includes(data.service.toLowerCase()) || data.service.toLowerCase().includes(opt.value.toLowerCase())) {
          serviceInput.value = opt.value;
          matched = true;
        }
      });
      if (!matched && serviceInput.options.length) {
        serviceInput.options[0].text = `Inquiry: ${data.service}`;
        serviceInput.value = data.service;
      }
    }
  }

  if (data.message) {
    const msgInput = modal.querySelector('#modalMessage');
    if (msgInput) msgInput.value = data.message;
  }

  modal.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeAllModals() {
  document.querySelectorAll('.modal-overlay').forEach(m => m.classList.remove('active'));
  document.body.style.overflow = '';
}

/* ================= 6. Consultation Forms & WhatsApp Prefill ================= */
function initConsultationForms() {
  const forms = [
    document.getElementById('mainBookingForm'),
    document.getElementById('modalBookingForm')
  ];

  const clientPhone = '971569754492'; // Verified client WhatsApp number (+971 56 975 4492)

  forms.forEach(form => {
    if (!form) return;

    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = form.querySelector('[name="name"]')?.value || 'Client';
      const phone = form.querySelector('[name="phone"]')?.value || '';
      const email = form.querySelector('[name="email"]')?.value || '';
      const service = form.querySelector('[name="service"]')?.value || 'Nutrition Consultation';
      const goal = form.querySelector('[name="goal"]')?.value || 'Not specified';
      const message = form.querySelector('[name="message"]')?.value || '';

      if (!name.trim() || !phone.trim()) {
        alert('Please provide your name and phone number so Chef Radhey can get in touch with you.');
        return;
      }

      // Format WhatsApp Message
      const waText = encodeURIComponent(
        `Hello Nutritionist Chef Radhey,\n\n` +
        `I would like to enquire about your services.\n\n` +
        `👤 Name: ${name}\n` +
        `📱 Phone: ${phone}\n` +
        `✉️ Email: ${email}\n` +
        `🥗 Service / Plan: ${service}\n` +
        `🎯 Health / Fitness Goal: ${goal}\n` +
        (message ? `📝 Notes: ${message}\n\n` : `\n`) +
        `Looking forward to your guidance.`
      );

      const waUrl = `https://wa.me/${clientPhone}?text=${waText}`;

      // Show user feedback modal or message
      const submitBtn = form.querySelector('button[type="submit"]');
      const originalText = submitBtn.innerHTML;
      submitBtn.disabled = true;
      submitBtn.innerHTML = `<span>Redirecting to WhatsApp...</span>`;

      setTimeout(() => {
        window.open(waUrl, '_blank');
        form.reset();
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;
        closeAllModals();
      }, 700);
    });
  });
}

/* ================= 7. Search Modal Logic ================= */
function initSearch() {
  const searchBtn = document.querySelector('[data-cmc-search-toggle]');
  const searchModal = document.getElementById('searchModal');
  const searchInput = document.getElementById('siteSearchInput');
  const resultsContainer = document.getElementById('searchResults');

  if (!searchBtn || !searchModal || !searchInput) return;

  searchBtn.addEventListener('click', (e) => {
    e.preventDefault();
    searchModal.classList.add('active');
    document.body.style.overflow = 'hidden';
    setTimeout(() => searchInput.focus(), 100);
  });

  const searchableIndex = [
    { title: 'Personalized Nutrition & Macro Planning', category: 'Service', link: '#services' },
    { title: 'Keto & Low-Carb Meal Plans', category: 'Meal Plan', link: '#meal-plans' },
    { title: 'High-Protein Performance Nutrition', category: 'Service', link: '#services' },
    { title: 'Vegetarian Clean-Eating Programs', category: 'Meal Plan', link: '#meal-plans' },
    { title: 'Healthy Cooking & Private Culinary Consultation', category: 'Service', link: '#culinary' },
    { title: 'Executive Wellness & Detox Guidance', category: 'Service', link: '#services' },
    { title: 'Chef Radhey Dubey Biography & Credentials', category: 'About', link: '#about' },
    { title: 'Healthy Minds Dubai Collaboration', category: 'Ventures', link: '#ventures' },
    { title: 'NutriChef UAE Culinary Venture', category: 'Ventures', link: '#ventures' },
    { title: 'Ontario Tower Studio, Business Bay', category: 'Location', link: '#contact' },
    { title: 'Verified Google 5.0 Star Reviews', category: 'Testimonials', link: '#reviews' }
  ];

  searchInput.addEventListener('input', (e) => {
    const query = e.target.value.toLowerCase().trim();
    if (!resultsContainer) return;

    if (!query) {
      resultsContainer.innerHTML = '<p style="color:#8E9E99;font-size:0.85rem;padding:8px 0;">Type to search meal plans, services, or dietary guides...</p>';
      return;
    }

    const matches = searchableIndex.filter(item => 
      item.title.toLowerCase().includes(query) || item.category.toLowerCase().includes(query)
    );

    if (matches.length === 0) {
      resultsContainer.innerHTML = '<p style="color:#8E9E99;font-size:0.85rem;padding:8px 0;">No matching services or plans found. Please contact Chef Radhey directly via WhatsApp.</p>';
    } else {
      resultsContainer.innerHTML = matches.map(item => `
        <a href="${item.link}" class="search-result-item" onclick="closeAllModals()">
          <strong>${item.title}</strong>
          <span>${item.category}</span>
        </a>
      `).join('');
    }
  });
}
