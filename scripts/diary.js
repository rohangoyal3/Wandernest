// Diary functionality

// Initialize diary
document.addEventListener('DOMContentLoaded', () => {
  loadEntries();
  setupEntryForm();
  setupDetailView();
});

// Load entries from storage
function loadEntries() {
  const entriesContainer = document.getElementById('entries-container');
  const emptyState = document.getElementById('empty-diary');
  const entries = window.diaryStorage.getEntries();
  
  if (entries.length === 0) {
    // Show empty state
    if (emptyState) emptyState.style.display = 'flex';
    return;
  }
  
  // Hide empty state
  if (emptyState) emptyState.style.display = 'none';
  
  // Clear container first
  if (entriesContainer) {
    // Remove any existing entries but keep the empty state
    const existingEntries = entriesContainer.querySelectorAll('.entry-card');
    existingEntries.forEach(entry => entry.remove());
    
    // Add entries to container
    entries.forEach(entry => {
      const entryCard = createEntryCard(entry);
      entriesContainer.appendChild(entryCard);
    });
  }
}

// Create an entry card element
function createEntryCard(entry) {
  const entryCard = document.createElement('div');
  entryCard.className = 'entry-card';
  entryCard.dataset.id = entry.id;
  
  // Create preview from content (limit to 150 chars)
  const contentPreview = entry.content.length > 150 
    ? entry.content.substring(0, 150) + '...' 
    : entry.content;
  
  entryCard.innerHTML = `
    <div class="entry-header">
      <h3 class="entry-title">${entry.title}</h3>
      <div class="entry-meta">
        <span class="entry-date">${formatDate(entry.date)}</span>
        <span class="mood-tag mood-${entry.mood}">${entry.mood}</span>
      </div>
    </div>
    <div class="entry-preview">${contentPreview}</div>
  `;
  
  // Add click event to show detail view
  entryCard.addEventListener('click', () => {
    showEntryDetail(entry.id);
  });
  
  return entryCard;
}

// Format date for display
function formatDate(dateString) {
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(dateString).toLocaleDateString(undefined, options);
}

// Setup entry form functionality
function setupEntryForm() {
  const addButton = document.getElementById('add-entry-btn');
  const entryModal = document.getElementById('entry-modal');
  const closeButton = entryModal?.querySelector('.close-button');
  const entryForm = document.getElementById('entry-form');
  
  // Open modal on add button click
  if (addButton && entryModal) {
    addButton.addEventListener('click', () => {
      // Set today's date as default
      const dateInput = document.getElementById('entry-date');
      if (dateInput) {
        dateInput.valueAsDate = new Date();
      }
      
      entryModal.classList.add('active');
    });
  }
  
  // Close modal when clicking the X
  if (closeButton) {
    closeButton.addEventListener('click', () => {
      entryModal.classList.remove('active');
    });
  }
  
  // Close modal when clicking outside
  if (entryModal) {
    window.addEventListener('click', (e) => {
      if (e.target === entryModal) {
        entryModal.classList.remove('active');
      }
    });
  }
  
  // Handle form submission
  if (entryForm) {
    entryForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const title = document.getElementById('entry-title').value;
      const date = document.getElementById('entry-date').value;
      const mood = document.getElementById('entry-mood').value;
      const content = document.getElementById('entry-content').value;
      
      // Validate inputs
      if (!title || !date || !content) {
        alert('Please fill in all required fields');
        return;
      }
      
      const entryData = {
        title,
        date,
        mood,
        content
      };
      
      // Save entry
      const savedEntry = window.diaryStorage.saveEntry(entryData);
      
      if (savedEntry) {
        // Reset form
        entryForm.reset();
        
        // Close modal
        entryModal.classList.remove('active');
        
        // Reload entries
        loadEntries();
      } else {
        alert('Error saving entry');
      }
    });
  }
}

// Setup entry detail view
function setupDetailView() {
  const detailModal = document.getElementById('entry-detail-modal');
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

// Show entry detail
function showEntryDetail(entryId) {
  const entry = window.diaryStorage.getEntryById(entryId);
  if (!entry) return;
  
  const detailModal = document.getElementById('entry-detail-modal');
  const detailedTitle = document.getElementById('detailed-title');
  const detailedDate = document.getElementById('detailed-date');
  const detailedMood = document.getElementById('detailed-mood');
  const detailedContent = document.getElementById('detailed-content');
  
  if (detailModal && detailedTitle && detailedDate && detailedMood && detailedContent) {
    // Set entry details
    detailedTitle.textContent = entry.title;
    detailedDate.textContent = formatDate(entry.date);
    detailedMood.textContent = entry.mood;
    detailedMood.className = `mood-tag mood-${entry.mood}`;
    detailedContent.textContent = entry.content;
    
    // Show modal
    detailModal.classList.add('active');
  }
}