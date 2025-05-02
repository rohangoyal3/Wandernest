// Home page functionality

// Initialize home page
document.addEventListener('DOMContentLoaded', () => {
  addCardAnimations();
});

// Add animations to home page cards
function addCardAnimations() {
  const cards = document.querySelectorAll('.card');
  
  cards.forEach((card, index) => {
    // Add hover animation
    card.addEventListener('mouseenter', () => {
      const icon = card.querySelector('.card-icon');
      if (icon) {
        icon.style.transform = 'scale(1.1) translateY(-5px)';
      }
    });
    
    card.addEventListener('mouseleave', () => {
      const icon = card.querySelector('.card-icon');
      if (icon) {
        icon.style.transform = 'scale(1) translateY(0)';
      }
    });
    
    // Add click animation
    card.addEventListener('click', () => {
      card.style.transform = 'scale(0.95)';
      setTimeout(() => {
        card.style.transform = 'translateY(-5px)';
      }, 100);
    });
  });
}