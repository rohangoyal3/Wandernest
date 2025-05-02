// Authentication handling

// Check if user is logged in
function checkAuth() {
  const currentPage = window.location.pathname.split('/').pop();
  const isLoginPage = currentPage === 'index.html' || currentPage === '';
  const user = JSON.parse(localStorage.getItem('user') || 'null');
  
  if (!user && !isLoginPage) {
    // Redirect to login page if not logged in
    window.location.href = 'index.html';
    return false;
  } else if (user && isLoginPage) {
    // Redirect to home page if already logged in
    window.location.href = 'home.html';
    return true;
  }
  
  return !!user;
}

// Handle login
function handleLogin() {
  const loginForm = document.getElementById('signin-form');
  
  if (loginForm) {
    loginForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      const username = document.getElementById('username').value.trim();
      const password = document.getElementById('password').value.trim();
      const usernameError = document.getElementById('username-error');
      const passwordError = document.getElementById('password-error');
      
      // Reset error messages
      usernameError.textContent = '';
      passwordError.textContent = '';
      
      // Validate inputs
      let isValid = true;
      
      if (!username) {
        usernameError.textContent = 'Username is required';
        isValid = false;
      }
      
      if (!password) {
        passwordError.textContent = 'Password is required';
        isValid = false;
      }
      
      if (!isValid) return;
      
      // Check if user exists
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const user = users.find(u => u.username === username);
      
      if (user && user.password === password) {
        // Login successful
        localStorage.setItem('user', JSON.stringify({ username, isLoggedIn: true }));
        window.location.href = 'home.html';
      } else if (user) {
        // Wrong password
        passwordError.textContent = 'Incorrect password';
      } else {
        // User doesn't exist, suggest registration
        usernameError.textContent = 'User not found. Please register.';
      }
    });
  }
}

// Handle registration
function handleRegistration() {
  const registerToggle = document.getElementById('register-toggle');
  const registerModal = document.getElementById('register-modal');
  const closeButton = registerModal?.querySelector('.close-button');
  const registerForm = document.getElementById('register-form');
  
  if (registerToggle && registerModal) {
    // Open registration modal
    registerToggle.addEventListener('click', () => {
      registerModal.classList.add('active');
    });
    
    // Close modal when clicking the X
    closeButton.addEventListener('click', () => {
      registerModal.classList.remove('active');
    });
    
    // Close modal when clicking outside
    window.addEventListener('click', (e) => {
      if (e.target === registerModal) {
        registerModal.classList.remove('active');
      }
    });
    
    // Handle registration form submission
    registerForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      const username = document.getElementById('reg-username').value.trim();
      const password = document.getElementById('reg-password').value.trim();
      const confirmPassword = document.getElementById('reg-confirm-password').value.trim();
      const registerError = document.getElementById('register-error');
      
      // Reset error message
      registerError.textContent = '';
      
      // Validate inputs
      if (!username || !password || !confirmPassword) {
        registerError.textContent = 'All fields are required';
        return;
      }
      
      if (password !== confirmPassword) {
        registerError.textContent = 'Passwords do not match';
        return;
      }
      
      // Check if username already exists
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      if (users.some(u => u.username === username)) {
        registerError.textContent = 'Username already exists';
        return;
      }
      
      // Add new user
      users.push({ username, password });
      localStorage.setItem('users', JSON.stringify(users));
      
      // Auto login
      localStorage.setItem('user', JSON.stringify({ username, isLoggedIn: true }));
      
      // Redirect to home
      window.location.href = 'home.html';
    });
  }
}

// Handle logout
function handleLogout() {
  const logoutBtn = document.getElementById('logout-btn');
  
  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      localStorage.removeItem('user');
      window.location.href = 'index.html';
    });
  }
}

// Update UI with user info
function updateUserInfo() {
  const userNameElement = document.getElementById('user-name');
  
  if (userNameElement) {
    const user = JSON.parse(localStorage.getItem('user') || 'null');
    if (user) {
      userNameElement.textContent = user.username;
    }
  }
}

// Initialize auth
document.addEventListener('DOMContentLoaded', () => {
  checkAuth();
  handleLogin();
  handleRegistration();
  handleLogout();
  updateUserInfo();
});