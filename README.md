# ⏳ TIMEWISE: Smart Study Planner & Productivity Dashboard

**TIMEWISE** is a premium, production-grade web application designed to help students manage their exam preparation with precision. Featuring a state-of-the-art **Glassmorphism UI**, it combines deterministic study planning, task management, and progress visualization into a single, seamless experience.

![TIMEWISE Preview](https://img.shields.io/badge/UI-Glassmorphism-blueviolet?style=for-the-badge)
![TIMEWISE Tech](https://img.shields.io/badge/Built%20With-VanillaJS%20%26%20Firebase-orange?style=for-the-badge)

---

## 🌟 Key Features

### 📅 Deterministic Study Planner
No more guessing what to study. Our "Architect" engine calculates the days remaining until your exam and intelligently distributes your subjects based on priority (Low, Medium, High). It even rotates subjects daily to keep your mind fresh and avoid burnout.

### ✅ Daily Tasks Module
Stay focused on the "now." Add, track, and complete your daily study objectives. All tasks are persisted locally, ensuring you never lose your to-do list.

### 📈 Progress Tracker
Visualize your journey. A dynamic progress circle and a 7-day history chart show your daily completion rates, helping you stay consistent and motivated.

### 🛡️ Robust Authentication
Secure access via Firebase. Includes:
*   Email/Password Signup & Login
*   Google OAuth "One-Tap" Integration
*   Persistence (Stay logged in across refreshes)
*   Protected Routes (Auto-redirects for unauthenticated users)

### 🌙 Premium Theme System
Seamlessly toggle between **Light** and **Dark** modes. The application dynamically switches background assets (`bg2.jpg` / `bg3.jpg`) and persists your choice across all sessions.

---

## 🚀 Getting Started

Follow these steps to get TIMEWISE running on your local machine.

### 1. Prerequisites
You will need a local development environment. We recommend:
*   [Node.js](https://nodejs.org/) (for running a local server)
*   A modern web browser (Chrome, Edge, or Firefox)

### 2. Installation
1.  Clone this repository to your local machine:
    ```bash
    git clone https://github.com/your-username/timewise.git
    ```
2.  Navigate to the project directory:
    ```bash
    cd timewise
    ```

### 3. Firebase Configuration
The project is pre-configured with Firebase. To use your own instance:
1.  Go to `scripts/firebase.js`.
2.  Update the `firebaseConfig` object with your own API Keys and Project IDs from the [Firebase Console](https://console.firebase.google.com/).
3.  Ensure **Email/Password** and **Google** sign-in methods are enabled in the Authentication tab.
4.  Set up a **Realtime Database** in your Firebase project.

### 4. Running Locally
To run the app correctly with ES6 modules, you need to use an HTTP server.

**Option A: Using Node.js (Recommended)**
Run the following command in the root directory:
```bash
npx http-server -p 8080
```
Then open your browser at `http://localhost:8080`.

**Option B: VS Code Extension**
If you use VS Code, install the **Live Server** extension, right-click `index.html`, and select "Open with Live Server."

---

## 📁 Project Structure

```text
TIMEWISE/
├── auth/           # Login, Signup, and Auth Logic
├── pages/
│   ├── home/       # Main Dashboard UI & Logic
│   ├── planner/    # Study Plan Generation
│   ├── tasks/      # Daily Task Management
│   └── progress/   # Stats & History Visualization
├── scripts/
│   ├── firebase.js # Firebase Initialization
│   ├── db.js       # Database Operations
│   ├── authGuard.js# Route Protection Logic
│   └── plannerLogic.js # Deterministic Algorithm
├── styles/
│   └── glass.css   # Central Glassmorphism Design System
└── assets/         # Images and Icons
```

---

## 🛠️ Tech Stack
*   **Frontend:** Vanilla HTML5, CSS3 (Glassmorphism), ES6+ JavaScript
*   **Backend:** Firebase Authentication, Firebase Realtime Database
*   **Design:** Modern Typography (Google Fonts), CSS Custom Properties

---

## 🤝 Connect with Me

Developed with ❤️ by **[Karthikeya Saran]**.

*   **LinkedIn:** [https://www.linkedin.com/in/karthikeya-saran-4a1b703a9/]
---
© 2024 TIMEWISE. Built for Students, by a Developer.
