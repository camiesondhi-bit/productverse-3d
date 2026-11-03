// admin.js — Zenith '26 Coordinator Dashboard Client Logic

document.addEventListener('DOMContentLoaded', () => {
  // DOM Elements - Stats
  const statTotalEvents = document.getElementById('stat-total-events');
  const statTotalRegistrations = document.getElementById('stat-total-registrations');
  const statUtilizationPct = document.getElementById('stat-utilization-pct');
  const statCapacitySummary = document.getElementById('stat-capacity-summary');
  const statUtilizationBar = document.getElementById('stat-utilization-bar');
  const statUpcomingEvents = document.getElementById('stat-upcoming-events');
  const categoriesContainer = document.getElementById('categories-container');
  const refreshDashboardBtn = document.getElementById('refresh-dashboard-btn');

  // DOM Elements - Tabs & Tables
  const tabEventsBtn = document.getElementById('tab-events-btn');
  const tabRegsBtn = document.getElementById('tab-regs-btn');
  const viewEventsTable = document.getElementById('view-events-table');
  const viewRegistrationsList = document.getElementById('view-registrations-list');
  const eventsTableBody = document.getElementById('events-table-body');
  const registrationsTableBody = document.getElementById('registrations-table-body');
  const regEventFilter = document.getElementById('reg-event-filter');
  const registrationsCountBadge = document.getElementById('registrations-count-badge');

  // DOM Elements - Add Event Modal (Stretch Goal)
  const openAddEventModalBtn = document.getElementById('open-add-event-modal-btn');
  const addEventModal = document.getElementById('add-event-modal');
  const closeAddEventBtn = document.getElementById('close-add-event-btn');
  const addEventForm = document.getElementById('add-event-form');
  const addEventAlert = document.getElementById('add-event-alert');

  let allEvents = [];
  let allRegistrations = [];

  const categoryBadgeStyles = {
    'Technical': 'bg-sky-950 text-sky-400 border-sky-800',
    'Cultural': 'bg-pink-950 text-pink-400 border-pink-800',
    'Sports': 'bg-amber-950 text-amber-400 border-amber-800',
    'Gaming': 'bg-purple-950 text-purple-400 border-purple-800',
    'Workshop': 'bg-emerald-950 text-emerald-400 border-emerald-800',
  };

  /**
   * Loads all dashboard data
   */
  async function loadDashboard() {
    await Promise.all([
      fetchStats(),
      fetchEventsTable(),
      fetchRegistrations()
    ]);
  }

  /**
   * Fetches stats from GET /api/stats
   */
  async function fetchStats() {
    try {
      const res = await fetch('/api/stats');
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const stats = await res.json();

      statTotalEvents.textContent = stats.total_events;
      statTotalRegistrations.textContent = stats.total_registrations;
      statUtilizationPct.textContent = `${stats.overall_utilization_pct}%`;
      statCapacitySummary.textContent = `(${stats.total_registrations} / ${stats.total_capacity} seats)`;
      statUtilizationBar.style.width = `${Math.min(100, stats.overall_utilization_pct)}%`;
      statUpcomingEvents.textContent = stats.upcoming_events_count;

      // Render category breakdown
      categoriesContainer.innerHTML = '';
      const catEntries = Object.entries(stats.events_by_category || {});
      if (catEntries.length === 0) {
        categoriesContainer.innerHTML = '<p class="text-xs text-slate-500">No categories found.</p>';
      } else {
        catEntries.forEach(([cat, count]) => {
          const badgeClass = categoryBadgeStyles[cat] || 'bg-slate-800 text-slate-300 border-slate-700';
          const card = document.createElement('div');
          card.className = `p-3.5 rounded-xl border ${badgeClass} flex flex-col justify-between`;
          card.innerHTML = `
            <span class="text-xs font-semibold uppercase tracking-wider">${cat}</span>
            <span class="text-2xl font-black mt-1">${count} <span class="text-xs font-normal opacity-80">event${count === 1 ? '' : 's'}</span></span>
          `;
          categoriesContainer.appendChild(card);
        });
      }
    } catch (err) {
      console.error('Error fetching stats:', err);
    }
  }

  /**
   * Fetches events for the utilization table
   */
  async function fetchEventsTable() {
    eventsTableBody.innerHTML = `<tr><td colspan="6" class="px-5 py-6 text-center text-slate-400 text-xs">Loading events data...</td></tr>`;

    try {
      const res = await fetch('/api/events');
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      allEvents = await res.json();

      // Compute registered count and utilization % for each event
      const enrichedEvents = allEvents.map(ev => {
        const registered = ev.capacity - ev.available_seats;
        const utilization = ev.capacity > 0 ? (registered / ev.capacity) * 100 : 0;
        return {
          ...ev,
          registered,
          utilization_pct: utilization
        };
      });

      // Sort by utilization percentage DESCENDING
      enrichedEvents.sort((a, b) => b.utilization_pct - a.utilization_pct);

      eventsTableBody.innerHTML = '';

      if (enrichedEvents.length === 0) {
        eventsTableBody.innerHTML = `<tr><td colspan="6" class="px-5 py-6 text-center text-slate-400 text-xs">No events found in database.</td></tr>`;
        return;
      }

      // Populate filter dropdown in registrations tab
      const currentSelected = regEventFilter.value;
      regEventFilter.innerHTML = '<option value="">All Events</option>';
      allEvents.forEach(ev => {
        const opt = document.createElement('option');
        opt.value = ev.id;
        opt.textContent = `${ev.title} (${ev.category})`;
        if (String(ev.id) === currentSelected) opt.selected = true;
        regEventFilter.appendChild(opt);
      });

      enrichedEvents.forEach(ev => {
        const isHighDemand = ev.utilization_pct >= 90;
        const badgeClass = categoryBadgeStyles[ev.category] || 'bg-slate-800 text-slate-300 border-slate-700';

        const row = document.createElement('tr');
        row.className = `${isHighDemand ? 'bg-rose-950/20 border-l-4 border-l-rose-500' : 'hover:bg-slate-800/40'} transition`;

        row.innerHTML = `
          <td class="px-5 py-3.5">
            <div class="flex items-center gap-2">
              <span class="text-base">${ev.icon || '🎪'}</span>
              <span class="font-bold text-white">${ev.title}</span>
            </div>
          </td>
          <td class="px-4 py-3.5">
            <span class="text-[11px] font-semibold px-2 py-0.5 rounded-full border ${badgeClass}">
              ${ev.category}
            </span>
          </td>
          <td class="px-4 py-3.5 text-slate-300 whitespace-nowrap">
            ${ev.event_date}, ${ev.event_time}
          </td>
          <td class="px-4 py-3.5 text-slate-400">
            ${ev.venue}
          </td>
          <td class="px-4 py-3.5 text-center font-medium">
            <span class="${isHighDemand ? 'text-rose-400 font-bold' : 'text-slate-200'}">
              ${ev.registered}
            </span> 
            <span class="text-slate-500">/ ${ev.capacity}</span>
          </td>
          <td class="px-5 py-3.5 text-right font-bold">
            <div class="flex items-center justify-end gap-2">
              <span class="${isHighDemand ? 'text-rose-400 font-black' : (ev.utilization_pct > 50 ? 'text-amber-300' : 'text-emerald-400')}">
                ${ev.utilization_pct.toFixed(1)}%
              </span>
              ${isHighDemand ? '<span class="text-xs" title="Over 90% capacity!">🔥</span>' : ''}
            </div>
          </td>
        `;

        eventsTableBody.appendChild(row);
      });

    } catch (err) {
      console.error('Error fetching events table:', err);
      eventsTableBody.innerHTML = `<tr><td colspan="6" class="px-5 py-6 text-center text-rose-400 text-xs">Failed to load events data.</td></tr>`;
    }
  }

  /**
   * Fetches raw registrations from GET /api/registrations
   */
  async function fetchRegistrations(eventId = null) {
    registrationsTableBody.innerHTML = `<tr><td colspan="7" class="px-5 py-6 text-center text-slate-400 text-xs">Loading registrations...</td></tr>`;

    const url = eventId ? `/api/registrations?event_id=${eventId}` : '/api/registrations';

    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      allRegistrations = await res.json();

      registrationsCountBadge.textContent = `${allRegistrations.length} student registration${allRegistrations.length === 1 ? '' : 's'} recorded`;
      registrationsTableBody.innerHTML = '';

      if (allRegistrations.length === 0) {
        registrationsTableBody.innerHTML = `<tr><td colspan="7" class="px-5 py-8 text-center text-slate-400 text-xs">No registrations found.</td></tr>`;
        return;
      }

      allRegistrations.forEach(reg => {
        const row = document.createElement('tr');
        row.className = 'hover:bg-slate-800/40 transition';

        row.innerHTML = `
          <td class="px-5 py-3.5 text-slate-400 font-mono text-xs">#${reg.id}</td>
          <td class="px-4 py-3.5 font-bold text-white">${reg.student_name}</td>
          <td class="px-4 py-3.5 font-mono text-slate-300">${reg.roll_number}</td>
          <td class="px-4 py-3.5 text-slate-300">${reg.email}</td>
          <td class="px-4 py-3.5">
            <span class="font-semibold text-purple-300">${reg.event_title}</span>
          </td>
          <td class="px-4 py-3.5 text-slate-400 text-xs whitespace-nowrap">${reg.registered_at}</td>
          <td class="px-4 py-3.5 text-right">
            <button 
              data-reg-id="${reg.id}" 
              data-reg-name="${reg.student_name}" 
              class="cancel-reg-btn text-xs text-rose-400 hover:text-rose-300 hover:bg-rose-950/60 px-2.5 py-1 rounded-lg border border-rose-900/60 transition cursor-pointer"
            >
              Cancel
            </button>
          </td>
        `;

        registrationsTableBody.appendChild(row);
      });

      // Attach cancel registration listeners (Stretch Goal)
      document.querySelectorAll('.cancel-reg-btn').forEach(btn => {
        btn.addEventListener('click', async (e) => {
          const regId = e.currentTarget.getAttribute('data-reg-id');
          const regName = e.currentTarget.getAttribute('data-reg-name');

          if (confirm(`Are you sure you want to cancel the registration for "${regName}" (ID #${regId})?`)) {
            try {
              const delRes = await fetch(`/api/registrations/${regId}`, { method: 'DELETE' });
              if (delRes.ok) {
                alert(`Registration #${regId} cancelled successfully.`);
                // Immediate refresh of dashboard metrics
                loadDashboard();
              } else {
                const errData = await delRes.json();
                alert(`Failed to cancel: ${errData.detail || 'Unknown error'}`);
              }
            } catch (err) {
              console.error('Delete error:', err);
              alert('Network error while cancelling registration.');
            }
          }
        });
      });

    } catch (err) {
      console.error('Error fetching registrations:', err);
      registrationsTableBody.innerHTML = `<tr><td colspan="7" class="px-5 py-6 text-center text-rose-400 text-xs">Failed to load registrations.</td></tr>`;
    }
  }

  // Filter registrations by event dropdown
  regEventFilter.addEventListener('change', (e) => {
    const selectedEventId = e.target.value ? parseInt(e.target.value, 10) : null;
    fetchRegistrations(selectedEventId);
  });

  // Tab Switching
  tabEventsBtn.addEventListener('click', () => {
    tabEventsBtn.className = 'py-3 px-2 border-b-2 border-purple-500 text-purple-400 font-bold text-sm flex items-center gap-2 cursor-pointer';
    tabRegsBtn.className = 'py-3 px-2 border-b-2 border-transparent text-slate-400 hover:text-slate-200 font-medium text-sm flex items-center gap-2 cursor-pointer transition';
    viewEventsTable.classList.remove('hidden');
    viewRegistrationsList.classList.add('hidden');
  });

  tabRegsBtn.addEventListener('click', () => {
    tabRegsBtn.className = 'py-3 px-2 border-b-2 border-purple-500 text-purple-400 font-bold text-sm flex items-center gap-2 cursor-pointer';
    tabEventsBtn.className = 'py-3 px-2 border-b-2 border-transparent text-slate-400 hover:text-slate-200 font-medium text-sm flex items-center gap-2 cursor-pointer transition';
    viewRegistrationsList.classList.remove('hidden');
    viewEventsTable.classList.add('hidden');
  });

  // Refresh Button
  refreshDashboardBtn.addEventListener('click', () => {
    loadDashboard();
  });

  // ---------------- Add Event Modal (Stretch Goal) ----------------

  openAddEventModalBtn.addEventListener('click', () => {
    addEventAlert.classList.add('hidden');
    addEventForm.reset();
    addEventModal.classList.remove('hidden');
  });

  closeAddEventBtn.addEventListener('click', () => {
    addEventModal.classList.add('hidden');
  });

  addEventModal.addEventListener('click', (e) => {
    if (e.target === addEventModal) addEventModal.classList.add('hidden');
  });

  addEventForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    addEventAlert.classList.add('hidden');

    const title = document.getElementById('new-event-title').value.trim();
    const category = document.getElementById('new-event-category').value;
    const icon = document.getElementById('new-event-icon').value.trim() || '🎪';
    const event_date = document.getElementById('new-event-date').value.trim();
    const event_time = document.getElementById('new-event-time').value.trim();
    const venue = document.getElementById('new-event-venue').value.trim();
    const capacity = parseInt(document.getElementById('new-event-capacity').value, 10);
    const fee = parseInt(document.getElementById('new-event-fee').value, 10) || 0;
    const description = document.getElementById('new-event-desc').value.trim();

    if (!title || !category || !event_date || !event_time || !venue || isNaN(capacity) || capacity <= 0) {
      showAddEventAlert('error', 'Please fill all required fields and ensure capacity > 0.');
      return;
    }

    try {
      const res = await fetch('/api/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title, category, icon, event_date, event_time, venue, capacity, fee, description
        })
      });

      const data = await res.json();
      if (res.status === 201) {
        showAddEventAlert('success', `Event "${data.title}" successfully created!`);
        setTimeout(() => {
          addEventModal.classList.add('hidden');
          loadDashboard();
        }, 1200);
      } else {
        showAddEventAlert('error', data.detail || 'Failed to create event.');
      }
    } catch (err) {
      console.error('Error creating event:', err);
      showAddEventAlert('error', 'Network error while creating event.');
    }
  });

  function showAddEventAlert(type, message) {
    addEventAlert.classList.remove('hidden');
    if (type === 'success') {
      addEventAlert.className = 'mb-4 p-3 rounded-xl text-xs font-semibold bg-emerald-950 text-emerald-300 border border-emerald-800';
    } else {
      addEventAlert.className = 'mb-4 p-3 rounded-xl text-xs font-semibold bg-rose-950 text-rose-300 border border-rose-800';
    }
    addEventAlert.textContent = message;
  }

  // Initial dashboard load
  loadDashboard();
});
