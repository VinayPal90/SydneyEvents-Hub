🚀 SydneyEvents Hub - MERN Stack Event Tracker

SydneyEvents Hub is a full-stack MERN application that automatically scrapes, stores, and manages live events happening across Sydney. It features a real-time scraper, a public event gallery, and a secure admin dashboard with Google OAuth.

Live Website: https://sydneyevents-hub.onrender.com

Backend API: https://sydneyevents-hub-backend.onrender.com

🌐 Live Links

    Live Website: https://sydneyevents-hub.onrender.com

    Backend API: https://sydneyevents-hub-backend.onrender.com

✨ Key Features

    Automated Web Scraper: Scrapes live event data (Title, Date, Venue, Description) using Cheerio and Node-cron.

    Database Sync: Automatically synced 72 live events into MongoDB Atlas.

    Admin Dashboard: Secure panel to search, filter, and "Import" events for featured display.

    Google OAuth 2.0: Secure login for administrators using Google accounts.

    Lead Capture: Integrated "Get Tickets" interest form for user data collection.

🛠️ Tech Stack

    Frontend: React.js, Tailwind CSS, Axios, React Router.

    Backend: Node.js, Express.js, Passport.js (Google Strategy).

    Database: MongoDB Atlas.

    Deployment: Render (Frontend & Backend).

📸 Screenshots
1. Public Event Gallery
<img width="1918" height="877" alt="image" src="https://github.com/user-attachments/assets/9569a624-79b9-46d8-8948-82b06e244b85" />

2. Admin Dashboard (Event Management)
<img width="1919" height="881" alt="image" src="https://github.com/user-attachments/assets/ef65dba0-fbaa-46f2-8bcc-d4659514fc70" />

🚀 Installation & Local Setup

    Clone the repo:
    Bash

    git clone https://github.com/VinayPal90/SydneyEvents-Hub.git

    Setup Backend:

        Go to backend folder, run npm install.

        Create a .env file with MONGO_URI, GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, and CALLBACK_URL.

        Run npm run dev.

    Setup Frontend:

        Go to frontend folder, run npm install.

        Run npm run dev.
