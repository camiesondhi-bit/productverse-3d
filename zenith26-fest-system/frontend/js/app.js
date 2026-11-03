// app.js — Zenith '26 Student Event Portal Client Logic

document.addEventListener('DOMContentLoaded', () => {
  // DOM Elements
  const eventsGrid = document.getElementById('events-grid');
  const loadingState = document.getElementById('loading-state');
  const errorState = document.getElementById('error-state');
  const errorMessage = document.getElementById('error-message');
  const emptyState = document.getElementById('empty-state');
  const resultsCount = document.getElementById('results-count');
  const searchInput = document.getElementById('search-input');
  const clearSearchBtn = document.getElementById('clear-search-btn');
  const retryBtn = document.getElementById('retry-btn');
  const resetFiltersBtn = document.getElementById('reset-filters-btn');
  const categoryFilterBtns = document.querySelectorAll('.filter-btn');

  // Modal Elements
  const eventModal = document.getElementById('event-modal');
  const closeModalBtn = document.getElementById('close-modal-btn');
  const modalEventIcon = document.getElementById('modal-event-icon');
  const modalEventTitle = document.getElementById('modal-event-title');
  const modalEventCategory = document.getElementById('modal-event-category');
  const modalEventDatetime = document.getElementById('modal-event-datetime');
  const modalEventVenue = document.getElementById('modal-event-venue');
  const modalEventFee = document.getElementById('modal-event-fee');
  const modalEventSeats = document.getElementById('modal-event-seats');
  const modalSeatsBar = document.getElementById('modal-seats-bar');
  const modalEventDescription = document.getElementById('modal-event-description');
  const registrationForm = document.getElementById('registration-form');
  const formEventId = document.getElementById('form-event-id');
  const studentNameInput = document.getElementById('student-name');
  const rollNumberInput = document.getElementById('roll-number');
  const studentEmailInput = document.getElementById('student-email');
  const phoneNumberInput = document.getElementById('phone-number');
  const formAlert = document.getElementById('form-alert');
  const submitRegisterBtn = document.getElementById('submit-register-btn');
  const btnText = document.getElementById('btn-text');
  const btnSpinner = document.getElementById('btn-spinner');
  const nameError = document.getElementById('name-error');
  const rollError = document.getElementById('roll-error');
  const emailError = document.getElementById('email-error');

  // Application State
  let currentCategory = 'All';
  let currentSearch = '';
  let searchDebounceTimeout = null;
  let currentModalEvent = null;

  // Category Badge Colors Map
  const categoryBadgeStyles = {
    'Technical': 'bg-sky-950 text-sky-400 border-sky-800',
    'Cultural': 'bg-pink-950 text-pink-400 border-pink-800',
    'Sports': 'bg-amber-950 text-amber-400 border-amber-800',
    'Gaming': 'bg-purple-950 text-purple-400 border-purple-800',
    'Workshop': 'bg-emerald-950 text-emerald-400 border-emerald-800',
  };

  /**
   * Fetches events from GET /api/events with query params
   */
  async function fetchEvents() {
    showLoading();

    const params = new URLSearchParams();
    if (currentCategory && currentCategory !== 'All') {
      params.append('category', currentCategory);
    }
    if (currentSearch && currentSearch.trim()) {
      params.append('search', currentSearch.trim());
    }

    const url = `/api/events${params.toString() ? '?' + params.toString() : ''}`;

    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Server returned HTTP ${response.status}: ${response.statusText}`);
      }
      const events = await response.json();
      renderEvents(events);
    } catch (err) {
      console.error('Fetch events error:', err);
      showError(err.message || 'Unable to connect to fest server. Please verify backend is running.');
    }
  }

  /**
   * Renders the list of events into #events-grid
   */
  function renderEvents(events) {
    loadingState.classList.add('hidden');
    errorState.classList.add('hidden');

    if (!events || events.length === 0) {
      eventsGrid.classList.add('hidden');
      emptyState.classList.remove('hidden');
      resultsCount.textContent = '0 events found';
      return;
    }

    emptyState.classList.add('hidden');
    eventsGrid.classList.remove('hidden');
    resultsCount.textContent = `${events.length} event${events.length === 1 ? '' : 's'} available`;

    eventsGrid.innerHTML = '';

    events.forEach((event, index) => {
      const isFull = event.available_seats === 0;
      const feeLabel = event.fee === 0 ? 'Free' : `₹${event.fee}`;
      const badgeClass = categoryBadgeStyles[event.category] || 'bg-slate-800 text-slate-300 border-slate-700';

      const card = document.createElement('div');
      card.className = `group bg-slate-800/80 hover:bg-slate-800 border ${isFull ? 'border-rose-900/60' : 'border-slate-700/80 hover:border-purple-500/50'} rounded-2xl p-5 shadow-lg hover:shadow-purple-500/10 transition duration-200 flex flex-col justify-between card-animate`;
      card.style.animationDelay = `${index * 40}ms`;

      card.innerHTML = `
        <div>
          <!-- Top Row: Icon & Category Badge -->
          <div class="flex items-start justify-between gap-3 mb-3">
            <div class="text-3xl p-2.5 rounded-xl bg-slate-900/80 border border-slate-700/80 group-hover:scale-110 transition duration-200">
              ${event.icon || '🎪'}
            </div>
            <div class="flex items-center gap-1.5 flex-wrap justify-end">
              <span class="text-xs font-semibold px-2.5 py-0.5 rounded-full border ${badgeClass}">
                ${event.category}
              </span>
              ${isFull ? `
                <span class="text-xs font-black tracking-wide px-2.5 py-0.5 rounded-full bg-rose-600/90 text-white border border-rose-500 animate-pulse">
                  FULL
                </span>
              ` : ''}
            </div>
          </div>

          <!-- Title & Venue -->
          <h3 class="text-lg font-bold text-white group-hover:text-purple-300 transition line-clamp-1 mb-1">
            ${event.title}
          </h3>
          <p class="text-xs text-slate-400 flex items-center gap-1 mb-4">
            <span>📍</span> <span>${event.venue}</span>
          </p>

          <!-- Details Pill Strip -->
          <div class="grid grid-cols-2 gap-2 text-xs mb-4">
            <div class="bg-slate-900/60 px-3 py-2 rounded-lg border border-slate-700/50">
              <span class="text-slate-400 block text-[10px] uppercase font-semibold">Schedule</span>
              <span class="text-slate-200 font-medium">${formatDateDisplay(event.event_date)}, ${event.event_time}</span>
            </div>
            <div class="bg-slate-900/60 px-3 py-2 rounded-lg border border-slate-700/50">
              <span class="text-slate-400 block text-[10px] uppercase font-semibold">Entry Fee</span>
              <span class="${event.fee === 0 ? 'text-emerald-400' : 'text-amber-300'} font-bold">${feeLabel}</span>
            </div>
          </div>
        </div>

        <!-- Footer Row: Seats & Action -->
        <div class="pt-3 border-t border-slate-700/60 flex items-center justify-between gap-2">
          <div class="text-xs">
            ${isFull ? `
              <span class="text-rose-400 font-bold">0 / ${event.capacity} seats left</span>
            ` : `
              <span class="text-slate-400">Seats:</span>
              <span class="font-bold ${event.available_seats <= 10 ? 'text-amber-400' : 'text-emerald-400'}">
                ${event.available_seats}
              </span>
              <span class="text-slate-500">/ ${event.capacity}</span>
            `}
          </div>
          <button 
            type="button" 
            data-event-id="${event.id}" 
            class="view-details-btn px-4 py-2 rounded-xl text-xs font-bold transition shadow-sm ${isFull ? 'bg-slate-700 hover:bg-slate-600 text-slate-300' : 'bg-purple-600 hover:bg-purple-500 active:bg-purple-700 text-white shadow-purple-600/30'}"
          >
            ${isFull ? 'View Info' : 'View Details'}
          </button>
        </div>
      `;

      eventsGrid.appendChild(card);
    });

    // Attach click listeners to "View Details" buttons
    document.querySelectorAll('.view-details-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = parseInt(e.currentTarget.getAttribute('data-event-id'), 10);
        openEventModal(id);
      });
    });
  }

  /**
   * Helper to format date nicely
   */
  function formatDateDisplay(dateStr) {
    if (!dateStr) return '';
    try {
      const parts = dateStr.split('-');
      if (parts.length === 3) {
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const day = parseInt(parts[2], 10);
        const month = months[parseInt(parts[1], 10) - 1];
        return `${day} ${month}`;
      }
    } catch (_) {}
    return dateStr;
  }

  /**
   * Opens the Event Detail & Registration Modal
   */
  async function openEventModal(eventId) {
    resetFormErrors();
    formAlert.classList.add('hidden');
    registrationForm.reset();

    try {
      const res = await fetch(`/api/events/${eventId}`);
      if (!res.ok) {
        alert('Event details could not be loaded.');
        return;
      }
      currentModalEvent = await res.json();
      populateModal(currentModalEvent);
      eventModal.classList.remove('hidden');
      document.body.classList.add('overflow-hidden');
    } catch (err) {
      console.error('Failed to load event details:', err);
      alert('Network error while loading event detail.');
    }
  }

  /**
   * Populates modal with event data
   */
  function populateModal(event) {
    formEventId.value = event.id;
    modalEventIcon.textContent = event.icon || '🎪';
    modalEventTitle.textContent = event.title;
    modalEventCategory.textContent = event.category;
    modalEventDatetime.textContent = `${formatDateDisplay(event.event_date)}, ${event.event_time}`;
    modalEventVenue.textContent = event.venue;
    modalEventFee.textContent = event.fee === 0 ? 'Free Entry' : `₹${event.fee}`;
    modalEventDescription.textContent = event.description || 'No description provided.';

    const isFull = event.available_seats === 0;
    if (isFull) {
      modalEventSeats.innerHTML = `<span class="text-rose-400 font-bold">FULL (0 / ${event.capacity})</span>`;
      modalSeatsBar.style.width = '100%';
      modalSeatsBar.className = 'bg-rose-500 h-full rounded-full';
      submitRegisterBtn.disabled = true;
      submitRegisterBtn.classList.add('opacity-50', 'cursor-not-allowed');
      btnText.textContent = 'Event is Full';
    } else {
      const taken = event.capacity - event.available_seats;
      const pct = Math.min(100, Math.round((taken / event.capacity) * 100));
      modalEventSeats.innerHTML = `<span class="text-emerald-400 font-bold">${event.available_seats} remaining</span> <span class="text-slate-400">(${taken}/${event.capacity} filled)</span>`;
      modalSeatsBar.style.width = `${pct}%`;
      modalSeatsBar.className = 'bg-gradient-to-r from-purple-500 to-emerald-400 h-full rounded-full';
      submitRegisterBtn.disabled = false;
      submitRegisterBtn.classList.remove('opacity-50', 'cursor-not-allowed');
      btnText.textContent = 'Confirm & Register';
    }
  }

  /**
   * Closes the Event Detail Modal
   */
  function closeModal() {
    eventModal.classList.add('hidden');
    document.body.classList.remove('overflow-hidden');
    currentModalEvent = null;
  }

  closeModalBtn.addEventListener('click', closeModal);
  eventModal.addEventListener('click', (e) => {
    if (e.target === eventModal) closeModal();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !eventModal.classList.contains('hidden')) {
      closeModal();
    }
  });

  /**
   * Handles Form Validation and Submission
   */
  registrationForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    resetFormErrors();

    const eventId = parseInt(formEventId.value, 10);
    const studentName = studentNameInput.value.trim();
    const rollNumber = rollNumberInput.value.trim();
    const email = studentEmailInput.value.trim();
    const phone = phoneNumberInput.value.trim();

    // 1. Client-side validation checks
    let hasError = false;

    if (!studentName) {
      showFieldError(nameError, 'Student name is required');
      hasError = true;
    }
    if (!rollNumber) {
      showFieldError(rollError, 'Roll number is required');
      hasError = true;
    }
    if (!email) {
      showFieldError(emailError, 'Email address is required');
      hasError = true;
    } else if (!email.includes('@') || email.startsWith('@') || email.endsWith('@')) {
      showFieldError(emailError, 'Please enter a valid email containing "@"');
      hasError = true;
    }

    if (hasError) return;

    // 2. Submit to server
    setSubmitting(true);
    formAlert.classList.add('hidden');

    try {
      const response = await fetch(`/api/events/${eventId}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          student_name: studentName,
          roll_number: rollNumber,
          email: email,
          phone: phone || null
        })
      });

      const data = await response.json();

      if (response.status === 201) {
        // Registration Successful
        showFormAlert('success', `🎉 Registration successful for "${currentModalEvent ? currentModalEvent.title : 'Event'}"! Registration ID: #${data.id}`);
        
        // Immediate live refresh of event data
        fetchEvents();
        try {
          const freshEventRes = await fetch(`/api/events/${eventId}`);
          if (freshEventRes.ok) {
            const freshEvent = await freshEventRes.json();
            populateModal(freshEvent);
          }
        } catch (_) {}

        registrationForm.reset();

        // Close modal automatically after brief confirmation
        setTimeout(() => {
          closeModal();
        }, 1800);

      } else {
        // Server validation / Business error (e.g. 400 or 409)
        const errorMsg = data.detail || (typeof data === 'string' ? data : 'Registration failed.');
        showFormAlert('error', `❌ ${errorMsg}`);
      }
    } catch (err) {
      console.error('Registration network error:', err);
      showFormAlert('error', '❌ Network error: Could not reach the server. Please try again.');
    } finally {
      setSubmitting(false);
    }
  });

  function showFieldError(elem, msg) {
    elem.textContent = msg;
    elem.classList.remove('hidden');
  }

  function resetFormErrors() {
    nameError.classList.add('hidden');
    rollError.classList.add('hidden');
    emailError.classList.add('hidden');
    formAlert.classList.add('hidden');
  }

  function showFormAlert(type, message) {
    formAlert.classList.remove('hidden');
    if (type === 'success') {
      formAlert.className = 'mb-4 p-3.5 rounded-xl text-xs font-semibold bg-emerald-950/80 text-emerald-300 border border-emerald-800 flex items-center gap-2';
    } else {
      formAlert.className = 'mb-4 p-3.5 rounded-xl text-xs font-semibold bg-rose-950/80 text-rose-300 border border-rose-800 flex items-center gap-2';
    }
    formAlert.textContent = message;
  }

  function setSubmitting(isSubmitting) {
    if (isSubmitting) {
      submitRegisterBtn.disabled = true;
      btnSpinner.classList.remove('hidden');
      btnText.textContent = 'Registering...';
    } else {
      submitRegisterBtn.disabled = false;
      btnSpinner.classList.add('hidden');
      btnText.textContent = 'Confirm & Register';
    }
  }

  // ---------------- UI Handlers & Filters ----------------

  // Category Filter Buttons
  categoryFilterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const cat = btn.getAttribute('data-category');
      currentCategory = cat;

      categoryFilterBtns.forEach(b => {
        b.className = 'filter-btn px-4 py-1.5 rounded-lg text-xs font-semibold transition bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white border border-slate-700/60';
      });
      btn.className = 'filter-btn active-filter px-4 py-1.5 rounded-lg text-xs font-semibold transition bg-purple-600 text-white shadow-md shadow-purple-600/30';

      fetchEvents();
    });
  });

  // Search Input with Debounce
  searchInput.addEventListener('input', (e) => {
    currentSearch = e.target.value;
    if (currentSearch.trim()) {
      clearSearchBtn.classList.remove('hidden');
    } else {
      clearSearchBtn.classList.add('hidden');
    }

    clearTimeout(searchDebounceTimeout);
    searchDebounceTimeout = setTimeout(() => {
      fetchEvents();
    }, 250);
  });

  clearSearchBtn.addEventListener('click', () => {
    searchInput.value = '';
    currentSearch = '';
    clearSearchBtn.classList.add('hidden');
    fetchEvents();
  });

  // Reset Filters Button
  resetFiltersBtn.addEventListener('click', () => {
    currentCategory = 'All';
    currentSearch = '';
    searchInput.value = '';
    clearSearchBtn.classList.add('hidden');

    categoryFilterBtns.forEach(b => {
      if (b.getAttribute('data-category') === 'All') {
        b.className = 'filter-btn active-filter px-4 py-1.5 rounded-lg text-xs font-semibold transition bg-purple-600 text-white shadow-md shadow-purple-600/30';
      } else {
        b.className = 'filter-btn px-4 py-1.5 rounded-lg text-xs font-semibold transition bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white border border-slate-700/60';
      }
    });

    fetchEvents();
  });

  // Retry Button on Error
  retryBtn.addEventListener('click', () => {
    fetchEvents();
  });

  function showLoading() {
    loadingState.classList.remove('hidden');
    eventsGrid.classList.add('hidden');
    errorState.classList.add('hidden');
    emptyState.classList.add('hidden');
    resultsCount.textContent = 'Loading events...';
  }

  function showError(msg) {
    loadingState.classList.add('hidden');
    eventsGrid.classList.add('hidden');
    emptyState.classList.add('hidden');
    errorState.classList.remove('hidden');
    errorMessage.textContent = msg;
    resultsCount.textContent = 'Error loading events';
  }

  // Initial load
  fetchEvents();
});
