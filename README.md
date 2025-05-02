# Wandernest
🌍 Wandernest — A Personal Travel Journal Web App
Wandernest is a serene, frontend-based travel journaling web application designed to give users a calm and personalized space to document their journeys, dreams, and memories. Built using HTML, CSS, and JavaScript with localStorage as the primary data storage method, the app operates entirely on the frontend — requiring no backend setup.

✨ Key Features
🔐 Index Page (Login & Registration)
Users can securely log in or register. Form validation is handled using JavaScript, with credentials stored locally to retain login states across sessions.

📊 Home Dashboard
A clean, card-based layout redirects users to different sections — Gallery, Diary, and Travel Logs. Built for responsiveness with mobile-first design in mind.

🖼️ Gallery Page
Upload and preview travel photos in a dynamic grid. Images are displayed using the FileReader API and persist using localStorage.

📔 Diary Page
Write and save journal entries with automatic timestamping. Prior entries are loaded dynamically and displayed in a readable scrollable format.

🧳 Travel Logs Page
Users can input past and upcoming travel plans, which are categorized based on the current date. Each log includes the destination, date, and notes.

💡 Tech Stack
Frontend: HTML5, CSS3 (Flexbox, media queries), JavaScript (DOM manipulation, FileReader API)

Storage: localStorage for storing user sessions, images, diary entries, and travel logs

No Backend: Fully static prototype, ideal for demonstration and personal use

🔧 Project Structure
index.html – Login/Register interface

home.html – Dashboard with navigation cards

gallery.html – Photo upload and preview section

diary.html – Journal entry and reflection page

travel.html – Past and future travel planner

auth.js, storage.js – Logic for authentication and data management

🎯 Vision
We created Wandernest to replicate the sentimental feel of a real travel diary — a peaceful, beautiful space where users can look back, plan ahead, and preserve the emotional essence of their journeys.
