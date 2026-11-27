// Cozy Corner - Main Application Logic

document.addEventListener('DOMContentLoaded', () => {
  initThemeToggle();
  initDatePickers();
  initSearchDropdowns();
  initGuestCounter();
  initPropertyFilters();
  initWishlist();
  initTestimonialCarousel();
  initNewsletter();
  initMobileNav();
});

// Property Data Catalog
const properties = {
  '1': {
    title: 'The Serene Suite',
    city: 'Amsterdam, NL',
    price: 180,
    rating: '4.9 (124 reviews)',
    guests: '2 Guests',
    rooms: '1 Bedroom',
    image: 'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=1200&q=85',
    description: 'An architectural haven bathed in soft morning light. Features hand-crafted ceramic accents, a curated library, bespoke oak furnishings, and an open layout tailored for deep focus and tranquil rest.'
  },
  '2': {
    title: 'Urban Loft',
    city: 'London, UK',
    price: 210,
    rating: '4.8 (98 reviews)',
    guests: '4 Guests',
    rooms: '2 Bedrooms',
    image: 'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?auto=format&fit=crop&w=1200&q=85',
    description: 'A striking blend of natural acoustic wood slats and tactile terracotta tones in the heart of London. Includes two secluded master suites, rain showers, and high-performance kitchen appliances.'
  },
  '3': {
    title: 'Garden Hideaway',
    city: 'Paris, FR',
    price: 155,
    rating: '5.0 (82 reviews)',
    guests: '2 Guests',
    rooms: 'Studio',
    image: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=1200&q=85',
    description: 'A discreet Parisian sanctuary opening to a tranquil private courtyard. Enjoy artisan coffee at your travertine breakfast table after waking under crisp Belgian flax linen.'
  },
  '4': {
    title: 'Canal View Penthouse',
    city: 'Amsterdam, NL',
    price: 240,
    rating: '4.95 (64 reviews)',
    guests: '3 Guests',
    rooms: '2 Bedrooms',
    image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=85',
    description: 'Sweeping panoramic vistas over historic waterways, floor-to-ceiling double glazing, an expansive chef counter, and minimalist Scandinavian aesthetics.'
  },
  '5': {
    title: 'The Belgravia Atelier',
    city: 'London, UK',
    price: 275,
    rating: '4.92 (53 reviews)',
    guests: '2 Guests',
    rooms: '1 Bedroom',
    image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=85',
    description: 'Historic townhouse elegance updated with contemporary minimalist lines. Walk to Sloane Square within minutes while enjoying peace and quiet.'
  },
  '6': {
    title: 'Marais Sunlit Studio',
    city: 'Paris, FR',
    price: 165,
    rating: '4.88 (47 reviews)',
    guests: '2 Guests',
    rooms: 'Studio',
    image: 'https://images.unsplash.com/photo-1507089947368-19c1da9775ae?auto=format&fit=crop&w=1200&q=85',
    description: 'Exposed limestone walls, bespoke brass fittings, and sun-drenched parquet flooring in the cultural epicenter of Le Marais.'
  }
};

let currentSelectedProperty = '1';

// Setup Dates with sensible defaults
function initDatePickers() {
  const checkIn = document.getElementById('searchCheckIn');
  const checkOut = document.getElementById('searchCheckOut');
  const modalIn = document.getElementById('modalCheckIn');
  const modalOut = document.getElementById('modalCheckOut');

  const today = new Date();
  const nextWeek = new Date();
  nextWeek.setDate(today.getDate() + 4);

  const formatDate = (d) => d.toISOString().split('T')[0];

  const inVal = formatDate(today);
  const outVal = formatDate(nextWeek);

  if (checkIn) checkIn.value = inVal;
  if (checkOut) checkOut.value = outVal;
  if (modalIn) modalIn.value = inVal;
  if (modalOut) modalOut.value = outVal;

  if (modalIn && modalOut) {
    modalIn.addEventListener('change', updateModalPrice);
    modalOut.addEventListener('change', updateModalPrice);
  }
}

// Search Dropdown & Destination selection
function initSearchDropdowns() {
  const destInput = document.getElementById('searchDestination');
  const destDropdown = document.getElementById('destinationDropdown');
  const guestDisplay = document.getElementById('guestDisplay');
  const guestDropdown = document.getElementById('guestDropdown');

  if (destInput && destDropdown) {
    destInput.parentElement.addEventListener('click', (e) => {
      e.stopPropagation();
      destDropdown.classList.toggle('hidden');
      if (guestDropdown) guestDropdown.classList.add('hidden');
    });

    document.querySelectorAll('.dest-option').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const val = btn.getAttribute('data-val');
        destInput.value = val;
        destDropdown.classList.add('hidden');
        filterByDestination(val);
      });
    });
  }

  // Close dropdowns on outside click
  document.addEventListener('click', () => {
    if (destDropdown) destDropdown.classList.add('hidden');
    if (guestDropdown) guestDropdown.classList.add('hidden');
  });

  const searchForm = document.getElementById('searchForm');
  if (searchForm) {
    searchForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const dest = destInput ? destInput.value : 'All Destinations';
      filterByDestination(dest);
      scrollToHomes();
      showToast(`Showing homes matching: ${dest}`);
    });
  }
}

// Guests Counter
function initGuestCounter() {
  let adults = 2;
  let children = 0;

  const guestDisplay = document.getElementById('guestDisplay');
  const guestDropdown = document.getElementById('guestDropdown');
  const adultSpan = document.getElementById('adultCount');
  const childSpan = document.getElementById('childCount');

  if (!guestDisplay || !guestDropdown) return;

  guestDisplay.parentElement.parentElement.addEventListener('click', (e) => {
    e.stopPropagation();
    guestDropdown.classList.toggle('hidden');
    const destDropdown = document.getElementById('destinationDropdown');
    if (destDropdown) destDropdown.classList.add('hidden');
  });

  guestDropdown.addEventListener('click', (e) => e.stopPropagation());

  const updateDisplay = () => {
    const total = adults + children;
    guestDisplay.textContent = `${total} ${total === 1 ? 'guest' : 'guests'}`;
    adultSpan.textContent = adults;
    childSpan.textContent = children;
  };

  document.getElementById('btnMinusAdult')?.addEventListener('click', () => {
    if (adults > 1) { adults--; updateDisplay(); }
  });
  document.getElementById('btnPlusAdult')?.addEventListener('click', () => {
    if (adults < 10) { adults++; updateDisplay(); }
  });
  document.getElementById('btnMinusChild')?.addEventListener('click', () => {
    if (children > 0) { children--; updateDisplay(); }
  });
  document.getElementById('btnPlusChild')?.addEventListener('click', () => {
    if (children < 6) { children++; updateDisplay(); }
  });
}

// Filters & "View All" functionality
function initPropertyFilters() {
  const tabs = document.querySelectorAll('.filter-tab');
  const toggleBtn = document.getElementById('toggleAllHomesBtn');
  const toggleText = document.getElementById('toggleAllText');
  const extraCards = document.querySelectorAll('.extra-property-card');

  let isExpanded = false;

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => {
        t.classList.remove('bg-brand-forest', 'dark:bg-emerald-800', 'text-white');
        t.classList.add('text-brand-charcoal/70', 'dark:text-white/70');
      });
      tab.classList.remove('text-brand-charcoal/70', 'dark:text-white/70');
      tab.classList.add('bg-brand-forest', 'dark:bg-emerald-800', 'text-white');

      const filter = tab.getAttribute('data-filter');
      filterProperties(filter);
    });
  });

  if (toggleBtn) {
    toggleBtn.addEventListener('click', () => {
      isExpanded = !isExpanded;
      extraCards.forEach(card => {
        if (isExpanded) {
          card.classList.remove('hidden');
        } else {
          card.classList.add('hidden');
        }
      });
      if (toggleText) {
        toggleText.textContent = isExpanded ? 'SHOW LESS' : 'VIEW ALL';
      }
    });
  }
}

function filterByDestination(dest) {
  if (dest.includes('Amsterdam')) {
    filterProperties('Amsterdam');
  } else if (dest.includes('London')) {
    filterProperties('London');
  } else if (dest.includes('Paris')) {
    filterProperties('Paris');
  } else {
    filterProperties('all');
  }
}

function filterProperties(city) {
  const cards = document.querySelectorAll('.property-card');
  cards.forEach(card => {
    const cardCity = card.getAttribute('data-city');
    if (city === 'all' || cardCity === city) {
      // Don't show extra cards unless expanded or specifically filtered
      if (card.classList.contains('extra-property-card')) {
        card.classList.remove('hidden');
      } else {
        card.style.display = 'flex';
      }
    } else {
      if (card.classList.contains('extra-property-card')) {
        card.classList.add('hidden');
      } else {
        card.style.display = 'none';
      }
    }
  });
}

// Wishlist Heart Buttons
function initWishlist() {
  document.querySelectorAll('.wishlist-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      btn.classList.toggle('active');
      const isFavorited = btn.classList.contains('active');
      showToast(isFavorited ? 'Saved to your personal collection.' : 'Removed from collection.');
    });
  });
}

// Interactive Property Modal & Booking Calculation
function openPropertyModal(id) {
  const data = properties[id] || properties['1'];
  currentSelectedProperty = id;

  const modal = document.getElementById('propertyModal');
  const img = document.getElementById('modalImage');
  const title = document.getElementById('modalTitle');
  const loc = document.getElementById('modalLocation');
  const price = document.getElementById('modalPrice');
  const badge = document.getElementById('modalBadge');
  const desc = document.getElementById('modalDescription');

  if (img) img.src = data.image;
  if (title) title.textContent = data.title;
  if (loc) loc.innerHTML = `📍 ${data.city} &bull; Verified Host`;
  if (price) price.textContent = `$${data.price}`;
  if (badge) badge.innerHTML = `<span class="text-amber-400 font-bold">★</span> <span class="font-medium">${data.rating}</span>`;
  if (desc) desc.textContent = data.description;

  updateModalPrice();
  if (modal) {
    modal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
  }
}

function closePropertyModal() {
  const modal = document.getElementById('propertyModal');
  if (modal) {
    modal.classList.add('hidden');
    document.body.style.overflow = '';
  }
}

function updateModalPrice() {
  const data = properties[currentSelectedProperty] || properties['1'];
  const modalIn = document.getElementById('modalCheckIn');
  const modalOut = document.getElementById('modalCheckOut');
  const nightsSpan = document.getElementById('calcNights');
  const subtotalSpan = document.getElementById('calcSubtotal');
  const totalSpan = document.getElementById('calcTotal');

  let nights = 3;
  if (modalIn && modalOut && modalIn.value && modalOut.value) {
    const diffTime = Math.abs(new Date(modalOut.value) - new Date(modalIn.value));
    const calculatedNights = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    if (calculatedNights > 0) nights = calculatedNights;
  }

  const rate = data.price;
  const subtotal = rate * nights;
  const cleaning = 60;
  const total = subtotal + cleaning;

  if (nightsSpan) nightsSpan.textContent = nights;
  if (subtotalSpan) subtotalSpan.textContent = `$${subtotal}`;
  if (totalSpan) totalSpan.textContent = `$${total}`;
}

function confirmBooking() {
  const data = properties[currentSelectedProperty] || properties['1'];
  closePropertyModal();
  showToast(`Booking Confirmed! Welcome to ${data.title}. Confirmation email dispatched.`);
}

function openBookingModal() {
  openPropertyModal('1');
}

// Testimonials Carousel
const testimonials = [
  {
    quote: 'The attention to detail in Cozy Corner is unmatched. It felt like I was staying in a luxury boutique hotel with all the comforts of my own home. The interior design was inspiring!',
    author: 'Sarah Mitchell',
    role: 'Global Product Manager',
    initials: 'SM',
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=800&q=80'
  },
  {
    quote: 'From the flawless contactless check-in to the ultra-fast fiber internet and serene atmosphere, Cozy Corner allowed our team to lead high-stakes strategy sessions without a hitch.',
    author: 'David Chen',
    role: 'Design Director, Studio Forma',
    initials: 'DC',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80'
  },
  {
    quote: 'The linens, the organic shower amenities, the acoustics—everything reflects pure refinement. We extended our London stay by 5 days because we simply didn’t want to leave.',
    author: 'Elena Rostova',
    role: 'Architect & Traveler',
    initials: 'ER',
    image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80'
  }
];

let currentTestimonialIdx = 0;

function initTestimonialCarousel() {
  const prevBtn = document.getElementById('prevReviewBtn');
  const nextBtn = document.getElementById('nextReviewBtn');

  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      currentTestimonialIdx = (currentTestimonialIdx - 1 + testimonials.length) % testimonials.length;
      updateTestimonialDisplay();
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      currentTestimonialIdx = (currentTestimonialIdx + 1) % testimonials.length;
      updateTestimonialDisplay();
    });
  }
}

function updateTestimonialDisplay() {
  const t = testimonials[currentTestimonialIdx];
  const quote = document.getElementById('testimonialQuote');
  const author = document.getElementById('testimonialAuthor');
  const role = document.getElementById('testimonialRole');
  const avatar = document.getElementById('testimonialAvatar');
  const img = document.getElementById('testimonialImage');

  if (img) {
    img.style.opacity = '0.3';
    setTimeout(() => {
      img.src = t.image;
      img.style.opacity = '1';
    }, 200);
  }

  if (quote) quote.innerHTML = `&ldquo;${t.quote}&rdquo;`;
  if (author) author.textContent = t.author;
  if (role) role.textContent = t.role;
  if (avatar) avatar.textContent = t.initials;
}

// Newsletter
function initNewsletter() {
  const form = document.getElementById('newsletterForm');
  const input = document.getElementById('newsletterEmail');
  const success = document.getElementById('newsletterSuccess');

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      if (input && input.value) {
        input.value = '';
        if (success) success.classList.remove('hidden');
        showToast('Thank you for joining our private travel dispatch.');
      }
    });
  }
}

// Mobile Nav Toggle
function initMobileNav() {
  const menuBtn = document.getElementById('mobileMenuBtn');
  const mobileMenu = document.getElementById('mobileMenu');
  const links = document.querySelectorAll('.mobile-nav-link');

  if (menuBtn && mobileMenu) {
    menuBtn.addEventListener('click', () => {
      mobileMenu.classList.toggle('hidden');
    });

    links.forEach(l => {
      l.addEventListener('click', () => {
        mobileMenu.classList.add('hidden');
      });
    });
  }

  const headerBookBtn = document.getElementById('headerBookBtn');
  if (headerBookBtn) {
    headerBookBtn.addEventListener('click', openBookingModal);
  }
}

// Smooth scroll to homes section
function scrollToHomes() {
  const homes = document.getElementById('homes');
  if (homes) {
    homes.scrollIntoView({ behavior: 'smooth' });
  }
}

// Global Toast Message
function showToast(message) {
  const toast = document.getElementById('toast');
  const msgEl = document.getElementById('toastMessage');
  if (toast && msgEl) {
    msgEl.textContent = message;
    toast.classList.remove('hidden');
    setTimeout(() => {
      toast.classList.add('hidden');
    }, 3800);
  }
}

// Dark Mode Theme Controller
function initThemeToggle() {
  const themeToggleBtn = document.getElementById('themeToggleBtn');
  const mobileThemeToggleBtn = document.getElementById('mobileThemeToggleBtn');

  const isDark = () => document.documentElement.classList.contains('dark');

  const setTheme = (dark, announce = true) => {
    if (dark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
      if (announce) showToast('Dark mode enabled.');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
      if (announce) showToast('Light mode enabled.');
    }
  };

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      setTheme(!isDark());
    });
  }

  if (mobileThemeToggleBtn) {
    mobileThemeToggleBtn.addEventListener('click', () => {
      setTheme(!isDark());
    });
  }
}
