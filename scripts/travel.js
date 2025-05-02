// Travel Logs functionality

// Initialize travel logs
document.addEventListener('DOMContentLoaded', () => {
  loadTravelLogs();
  setupTravelLogForm();
  setupDetailView();
  setupItineraryControls();
});

// Load travel logs from storage
function loadTravelLogs() {
  const upcomingContainer = document.getElementById('upcoming-container');
  const pastContainer = document.getElementById('past-container');
  const emptyState = document.getElementById('empty-logs');
  const timelineContainer = document.getElementById('timeline');
  const logs = window.travelStorage.getLogs();
  
  if (logs.length === 0) {
    // Show empty state
    if (emptyState) emptyState.style.display = 'flex';
    if (timelineContainer) timelineContainer.style.display = 'none';
    return;
  }
  
  // Hide empty state
  if (emptyState) emptyState.style.display = 'none';
  if (timelineContainer) timelineContainer.style.display = 'block';
  
  // Clear containers first
  if (upcomingContainer) upcomingContainer.innerHTML = '';
  if (pastContainer) pastContainer.innerHTML = '';
  if (timelineContainer) timelineContainer.innerHTML = '';
  
  // Sort logs by start date
  const sortedLogs = [...logs].sort((a, b) => new Date(a.startDate) - new Date(b.startDate));
  
  // Current date for comparison
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  // Process each log
  sortedLogs.forEach(log => {
    const logCard = createLogCard(log);
    const logStartDate = new Date(log.startDate);
    logStartDate.setHours(0, 0, 0, 0);
    
    // Add to upcoming or past container
    if (logStartDate >= today) {
      if (upcomingContainer) upcomingContainer.appendChild(logCard.cloneNode(true));
    } else {
      if (pastContainer) pastContainer.appendChild(logCard.cloneNode(true));
    }
    
    // Add to timeline
    if (timelineContainer) {
      const timelineItem = createTimelineItem(log);
      timelineContainer.appendChild(timelineItem);
    }
  });

  if (upcomingContainer && upcomingContainer.childElementCount === 0) {
    upcomingContainer.innerHTML = '<p class="empty-message">No upcoming trips. Time to plan a new adventure!</p>';
  }

  if (pastContainer && pastContainer.childElementCount === 0) {
    pastContainer.innerHTML = '<p class="empty-message">No past trips recorded yet.</p>';
  }
  
  // Add click events to all log cards
  document.querySelectorAll('.log-card').forEach(card => {
    card.addEventListener('click', () => {
      showLogDetail(card.dataset.id);
    });
  });
}

// Create a log card element
function createLogCard(log) {
  const logCard = document.createElement('div');
  logCard.className = 'log-card';
  logCard.dataset.id = log.id;
  
  // Format activities as tags
  const activitiesTags = log.activities.map(activity => 
    `<span class="activity-tag">${activity}</span>`).join('');
  
  logCard.innerHTML = `
    <div class="log-destination">${log.destination}</div>
    <div class="log-dates">${formatDate(log.startDate)} - ${formatDate(log.endDate)}</div>
    <div class="activities-tags">${activitiesTags}</div>
  `;
  
  return logCard;
}

// Create a timeline item
function createTimelineItem(log) {
  const timelineItem = document.createElement('div');
  timelineItem.className = 'timeline-item';
  
  timelineItem.innerHTML = `
    <div class="timeline-content">
      <div class="timeline-date">${formatDate(log.startDate)}</div>
      <div class="timeline-destination">${log.destination}</div>
      <p>${log.notes.substring(0, 100)}${log.notes.length > 100 ? '...' : ''}</p>
    </div>
  `;
  
  return timelineItem;
}

// Format date for display
function formatDate(dateString) {
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(dateString).toLocaleDateString(undefined, options);
}

// Setup travel log form functionality
function setupTravelLogForm() {
  const addButton = document.getElementById('add-log-btn');
  const logModal = document.getElementById('log-modal');
  const closeButton = logModal?.querySelector('.close-button');
  const logForm = document.getElementById('log-form');
  
  // Open modal on add button click
  if (addButton && logModal) {
    addButton.addEventListener('click', () => {
      // Set today's date as default for start and end dates
      const startDateInput = document.getElementById('log-start-date');
      const endDateInput = document.getElementById('log-end-date');
      
      if (startDateInput && endDateInput) {
        const today = new Date();
        startDateInput.valueAsDate = today;
        
        // Set end date as today + 7 days by default
        const nextWeek = new Date();
        nextWeek.setDate(today.getDate() + 7);
        endDateInput.valueAsDate = nextWeek;
      }
      
      logModal.classList.add('active');
    });
  }
  
  // Close modal when clicking the X
  if (closeButton) {
    closeButton.addEventListener('click', () => {
      logModal.classList.remove('active');
    });
  }
  
  // Close modal when clicking outside
  if (logModal) {
    window.addEventListener('click', (e) => {
      if (e.target === logModal) {
        logModal.classList.remove('active');
      }
    });
  }
  
  // Handle form submission
  if (logForm) {
    logForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const destination = document.getElementById('log-destination').value;
      const startDate = document.getElementById('log-start-date').value;
      const endDate = document.getElementById('log-end-date').value;
      const activitiesInput = document.getElementById('log-activities').value;
      const notes = document.getElementById('log-notes').value;
      
      // Validate inputs
      if (!destination || !startDate || !endDate) {
        alert('Please fill in all required fields');
        return;
      }
      
      // Validate dates
      if (new Date(endDate) < new Date(startDate)) {
        alert('End date cannot be before start date');
        return;
      }
      
      // Process activities
      const activities = activitiesInput.split(',')
        .map(activity => activity.trim())
        .filter(activity => activity !== '');
      
      // Collect itinerary data
      const itineraryDays = [];
      const itineraryElements = document.querySelectorAll('.itinerary-day');
      
      itineraryElements.forEach((day, index) => {
        const textarea = day.querySelector('.itinerary-text');
        if (textarea && textarea.value.trim()) {
          itineraryDays.push({
            day: index + 1,
            content: textarea.value.trim()
          });
        }
      });
      
      const logData = {
        destination,
        startDate,
        endDate,
        activities,
        notes,
        itinerary: itineraryDays
      };
      
      // Save log
      const savedLog = window.travelStorage.saveLog(logData);
      
      if (savedLog) {
        // Reset form
        logForm.reset();
        
        // Reset itinerary (keep only the first day)
        const itineraryContainer = document.getElementById('itinerary-container');
        if (itineraryContainer) {
          const firstDay = itineraryContainer.querySelector('.itinerary-day');
          if (firstDay) {
            const textarea = firstDay.querySelector('.itinerary-text');
            if (textarea) textarea.value = '';
            itineraryContainer.innerHTML = '';
            itineraryContainer.appendChild(firstDay);
          }
        }
        
        // Close modal
        logModal.classList.remove('active');
        
        // Reload logs
        loadTravelLogs();
      } else {
        alert('Error saving travel log');
      }
    });
  }
}

// Setup itinerary days controls
function setupItineraryControls() {
  const addDayButton = document.getElementById('add-day-btn');
  const itineraryContainer = document.getElementById('itinerary-container');
  
  if (addDayButton && itineraryContainer) {
    // Add first day if not already present
    if (itineraryContainer.children.length === 0) {
      const firstDay = createItineraryDay(1);
      itineraryContainer.appendChild(firstDay);
    }
    
    // Add day button click handler
    addDayButton.addEventListener('click', () => {
      const dayCount = itineraryContainer.children.length + 1;
      const newDay = createItineraryDay(dayCount);
      itineraryContainer.appendChild(newDay);
    });
  }
}

// Create itinerary day element
function createItineraryDay(dayNumber) {
  const dayElement = document.createElement('div');
  dayElement.className = 'itinerary-day';
  
  dayElement.innerHTML = `
    <h4>Day ${dayNumber}</h4>
    <textarea class="itinerary-text" placeholder="What's planned for this day?"></textarea>
  `;
  
  return dayElement;
}

// Setup log detail view
function setupDetailView() {
  const detailModal = document.getElementById('log-detail-modal');
  const closeButton = detailModal?.querySelector('.close-button');
  
  // Close modal when clicking the X
  if (closeButton) {
    closeButton.addEventListener('click', () => {
      detailModal.classList.remove('active');
    });
  }
  
  // Close modal when clicking outside
  if (detailModal) {
    window.addEventListener('click', (e) => {
      if (e.target === detailModal) {
        detailModal.classList.remove('active');
      }
    });
  }
}

// Show log detail
function showLogDetail(logId) {
  const log = window.travelStorage.getLogById(logId);
  if (!log) return;
  
  const detailModal = document.getElementById('log-detail-modal');
  const destination = document.getElementById('detailed-destination');
  const startDate = document.getElementById('detailed-start-date');
  const endDate = document.getElementById('detailed-end-date');
  const activities = document.getElementById('detailed-activities');
  const notes = document.getElementById('detailed-notes');
  const itinerary = document.getElementById('detailed-itinerary');
  
  if (detailModal) {
    // Set log details
    if (destination) destination.textContent = log.destination;
    if (startDate) startDate.textContent = formatDate(log.startDate);
    if (endDate) endDate.textContent = formatDate(log.endDate);
    
    // Set activities
    if (activities) {
      activities.innerHTML = '';
      if (log.activities && log.activities.length > 0) {
        log.activities.forEach(activity => {
          const tag = document.createElement('span');
          tag.className = 'activity-tag';
          tag.textContent = activity;
          activities.appendChild(tag);
        });
      } else {
        activities.innerHTML = '<p>No activities listed</p>';
      }
    }
    
    // Set notes
    if (notes) {
      notes.textContent = log.notes || 'No notes available';
    }
    
    // Set itinerary
    if (itinerary) {
      itinerary.innerHTML = '';
      if (log.itinerary && log.itinerary.length > 0) {
        log.itinerary.forEach(day => {
          const dayElement = document.createElement('div');
          dayElement.className = 'log-itinerary-day';
          dayElement.innerHTML = `
            <h4>Day ${day.day}</h4>
            <div class="log-itinerary-content">${day.content}</div>
          `;
          itinerary.appendChild(dayElement);
        });
      } else {
        itinerary.innerHTML = '<p>No itinerary available</p>';
      }
    }
    
    // Show modal
    detailModal.classList.add('active');
  }
}