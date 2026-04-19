# FitTrack: Health & Fitness Dashboard

A comprehensive, MERN stack web application (React, Node.js, Vite, TailwindCSS) designed for modern, interactive health and fitness tracking. FitTrack helps users log their physical activities (Gym, Jogging, Yoga, Sleep) and monitor their comprehensive nutritional intakes to drive healthier lifestyle choices.

## 🚀 Features

- **Activity Tracking**: Dedicated, smart modules for Jogging, Gym, Yoga, and Sleep analysis.
- **Smart Nutritional Logs**: Automatically computes caloric macros (protein, carbs, fat) and determines junk vs. healthy foods using intelligent name-parsing heuristics.
- **Intelligent Dashboard**: Features real-time macro-nutrient visualizations, physical vs. mental health scoring, and an active recommendation engine to alert you if limits are exceeded.
- **Modern Responsive UI**: Built precisely with Tailwind CSS to offer a professional black, white, and clean colored aesthetic that flows dynamically across screen sizes.
- **Secure Architecture**: Decoupled frontend (React/Vite) and backend (Node.js/Express) structure.

## 📁 Project Structure

```
FitTrack/
├── frontend/             # Single Page React Application (Vite Base)
│   ├── src/
│   │   ├── components/   # Reusable UI Elements (Cards, Navbars)
│   │   ├── hooks/        # Local state and score accumulation logic
│   │   ├── pages/        # Dashboard, Forms, and Full-page views
│   │   ├── utils/        # Local storage formatting constraints
│   │   └── App.jsx       # Root router entry
│   └── package.json      # Frontend dependencies
├── Backend/              # Node.js + Express API Backend Server
│   ├── routes/           # Network routing for DB manipulation
│   ├── models/           # Data models/schemas
│   └── server.js         # Dedicated server entry point
├── requirements.txt      # Text list of core dependencies
└── README.md             # Core application guide
```

## 🛠 Tech Stack
- Frontend: React 18, Vite, React Router, TailwindCSS, MDI Icons
- Backend: Node.js, Express.js (Preparing for MongoDB architecture)

## 💻 Running the App Locally

1. **Install Frontend Dependencies:**
   `cd frontend`
   `npm install`
2. **Boot the Frontend Client:**
   `npm run dev`
3. **Boot the Backend Server (Optional pending DB setup):**
   `cd Backend`
   `node server.js`
