// Photo Gallery functionality

// Initialize gallery
document.addEventListener('DOMContentLoaded', () => {
  loadPhotos();
  setupPhotoUpload();
  setupDetailView();
});

// Compress image using canvas
async function compressImage(dataUrl, maxWidth = 1200, quality = 0.7) {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      // Calculate new dimensions maintaining aspect ratio
      let width = img.width;
      let height = img.height;
      
      if (width > maxWidth) {
        height = (height * maxWidth) / width;
        width = maxWidth;
      }
      
      // Create canvas and context
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      
      // Draw and compress image
      ctx.drawImage(img, 0, 0, width, height);
      resolve(canvas.toDataURL('image/jpeg', quality));
    };
    img.src = dataUrl;
  });
}

// Load photos from storage
function loadPhotos() {
  const gallery = document.getElementById('gallery-grid');
  const emptyState = document.getElementById('empty-gallery');
  const photos = window.photoStorage.getPhotos();
  
  if (photos.length === 0) {
    // Show empty state
    if (emptyState) emptyState.style.display = 'flex';
    return;
  }
  
  // Hide empty state
  if (emptyState) emptyState.style.display = 'none';
  
  // Clear gallery first
  if (gallery) {
    gallery.innerHTML = '';
    
    // Add photos to gallery
    photos.forEach(photo => {
      const photoCard = createPhotoCard(photo);
      gallery.appendChild(photoCard);
    });
  }
}

// Create a photo card element
function createPhotoCard(photo) {
  const photoCard = document.createElement('div');
  photoCard.className = 'photo-card';
  photoCard.dataset.id = photo.id;
  
  photoCard.innerHTML = `
    <img src="${photo.url}" alt="${photo.caption}" class="photo-img">
    <div class="photo-info">
      <p class="photo-caption">${photo.caption || 'Untitled'}</p>
      <p class="photo-date">${formatDate(photo.date)}</p>
    </div>
  `;
  
  // Add click event to show detail view
  photoCard.addEventListener('click', () => {
    showPhotoDetail(photo.id);
  });
  
  return photoCard;
}

// Format date for display
function formatDate(dateString) {
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(dateString).toLocaleDateString(undefined, options);
}

// Setup photo upload functionality
function setupPhotoUpload() {
  const addButton = document.getElementById('add-photo-btn');
  const photoModal = document.getElementById('photo-modal');
  const closeButton = photoModal?.querySelector('.close-button');
  const photoForm = document.getElementById('photo-form');
  const photoInput = document.getElementById('photo-file');
  const photoPreview = document.getElementById('photo-preview');
  
  // Open modal on add button click
  if (addButton && photoModal) {
    addButton.addEventListener('click', () => {
      photoModal.classList.add('active');
    });
  }
  
  // Close modal when clicking the X
  if (closeButton) {
    closeButton.addEventListener('click', () => {
      photoModal.classList.remove('active');
    });
  }
  
  // Close modal when clicking outside
  if (photoModal) {
    window.addEventListener('click', (e) => {
      if (e.target === photoModal) {
        photoModal.classList.remove('active');
      }
    });
  }
  
  // Show preview when file selected
  if (photoInput && photoPreview) {
    photoInput.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (!file) return;
      
      // Validate file type
      if (!file.type.match('image.*')) {
        document.getElementById('photo-error').textContent = 'Please select an image file';
        return;
      }
      
      // Create preview
      const reader = new FileReader();
      reader.onload = function(e) {
        photoPreview.innerHTML = `<img src="${e.target.result}" alt="Preview">`;
      };
      reader.readAsDataURL(file);
    });
  }
  
  // Handle form submission
  if (photoForm) {
    photoForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const fileInput = document.getElementById('photo-file');
      const caption = document.getElementById('photo-caption').value;
      const date = document.getElementById('photo-date').value;
      const errorElement = document.getElementById('photo-error');
      
      // Validate inputs
      if (!fileInput.files || !fileInput.files[0]) {
        errorElement.textContent = 'Please select an image';
        return;
      }
      
      if (!date) {
        errorElement.textContent = 'Please select a date';
        return;
      }
      
      const file = fileInput.files[0];
      
      try {
        // Read file as data URL
        const dataUrl = await new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result);
          reader.onerror = reject;
          reader.readAsDataURL(file);
        });
        
        // Compress the image
        const compressedDataUrl = await compressImage(dataUrl);
        
        const photoData = {
          url: compressedDataUrl,
          caption: caption,
          date: date
        };
        
        // Save photo
        const savedPhoto = window.photoStorage.savePhoto(photoData);
        
        if (savedPhoto) {
          // Reset form
          photoForm.reset();
          photoPreview.innerHTML = '';
          
          // Close modal
          photoModal.classList.remove('active');
          
          // Reload photos
          loadPhotos();
        } else {
          errorElement.textContent = 'Error saving photo';
        }
      } catch (error) {
        console.error('Error processing image:', error);
        errorElement.textContent = 'Error processing image';
      }
    });
  }
}

// Setup photo detail view
function setupDetailView() {
  const detailModal = document.getElementById('photo-detail-modal');
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

// Show photo detail
function showPhotoDetail(photoId) {
  const photo = window.photoStorage.getPhotoById(photoId);
  if (!photo) return;
  
  const detailModal = document.getElementById('photo-detail-modal');
  const detailedPhoto = document.getElementById('detailed-photo');
  const detailedCaption = document.getElementById('detailed-caption');
  const detailedDate = document.getElementById('detailed-date');
  
  if (detailModal && detailedPhoto && detailedCaption && detailedDate) {
    // Set photo details
    detailedPhoto.src = photo.url;
    detailedPhoto.alt = photo.caption || 'Travel memory';
    detailedCaption.textContent = photo.caption || 'Untitled';
    detailedDate.textContent = formatDate(photo.date);
    
    // Show modal
    detailModal.classList.add('active');
  }
}