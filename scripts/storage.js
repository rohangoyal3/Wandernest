// Storage handling for data persistence

// Generate a unique ID
function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substring(2);
}

// Get username for storage
function getUsername() {
  const user = JSON.parse(localStorage.getItem('user') || 'null');
  return user ? user.username : null;
}

// Storage for diary entries
const diaryStorage = {
  getEntries: function() {
    const username = getUsername();
    if (!username) return [];
    
    return JSON.parse(localStorage.getItem(`${username}_diary`) || '[]');
  },
  
  saveEntry: function(entry) {
    const username = getUsername();
    if (!username) return false;
    
    const entries = this.getEntries();
    const newEntry = {
      id: generateId(),
      ...entry,
      date: entry.date || new Date().toISOString().split('T')[0]
    };
    
    entries.unshift(newEntry); // Add to beginning for chronological display
    localStorage.setItem(`${username}_diary`, JSON.stringify(entries));
    
    return newEntry;
  },
  
  getEntryById: function(id) {
    const entries = this.getEntries();
    return entries.find(entry => entry.id === id);
  }
};

// Storage for photos
const photoStorage = {
  getPhotos: function() {
    const username = getUsername();
    if (!username) return [];
    
    return JSON.parse(localStorage.getItem(`${username}_photos`) || '[]');
  },
  
  savePhoto: function(photo) {
    const username = getUsername();
    if (!username) return false;
    
    const photos = this.getPhotos();
    const newPhoto = {
      id: generateId(),
      ...photo,
      date: photo.date || new Date().toISOString().split('T')[0]
    };
    
    photos.unshift(newPhoto); // Add to beginning for newest first
    localStorage.setItem(`${username}_photos`, JSON.stringify(photos));
    
    return newPhoto;
  },
  
  getPhotoById: function(id) {
    const photos = this.getPhotos();
    return photos.find(photo => photo.id === id);
  }
};

// Storage for travel logs
const travelStorage = {
  getLogs: function() {
    const username = getUsername();
    if (!username) return [];
    
    return JSON.parse(localStorage.getItem(`${username}_travel`) || '[]');
  },
  
  saveLog: function(log) {
    const username = getUsername();
    if (!username) return false;
    
    const logs = this.getLogs();
    const newLog = {
      id: generateId(),
      ...log
    };
    
    logs.push(newLog);
    localStorage.setItem(`${username}_travel`, JSON.stringify(logs));
    
    return newLog;
  },
  
  getLogById: function(id) {
    const logs = this.getLogs();
    return logs.find(log => log.id === id);
  }
};

// Export the storage modules
window.diaryStorage = diaryStorage;
window.photoStorage = photoStorage;
window.travelStorage = travelStorage;