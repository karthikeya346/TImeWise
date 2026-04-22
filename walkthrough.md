# TIMEWISE AI ARCHITECT - Walkthrough

The TIMEWISE application has been fully overhauled into a premium, AI-driven productivity suite.

## Core Features Delivered

### 1. The Architect Planning Engine
The logic in [plannerLogic.js](file:///d:/TIMEWISE/scripts/plannerLogic.js) now handles:
- **Weighted Difficulty:** Subjects are prioritized based on Low/Medium/High settings.
- **Peak Focus Times:** High-difficulty subjects are strategically placed in morning blocks.
- **Topic Inference:** AI generates a syllabus automatically if the user leaves topics blank.
- **16-Hour Guardrail:** A health-first check that prevents planning more than 16 hours of study per day.

### 2. Unified AI & Credit System
Implemented a daily 20-trial limit managed via Firebase Realtime Database in [db.js](file:///d:/TIMEWISE/scripts/db.js).
- Credits are deducted for both **Plan Generation** and **AI Chat**.
- A clear visual counter is visible in the dashboard.

### 3. Dynamic Home Dashboard
The new [home.html](file:///d:/TIMEWISE/pages/home/home.html) includes:
- **Next-Exam Countdown:** Automatically tracks the soonest exam.
- **Timetable Integration:** Renders AI-generated JSON plans into a beautiful, scrollable list.
- **Auto-Reset:** Automatically archives past exams and resets the timer.

### 4. Glassmorphism Design System
A strict adherence to the requested aesthetic in [glass.css](file:///d:/TIMEWISE/styles/glass.css):
- Translucency with `backdrop-filter: blur(15px)`.
- Thin borders and glowing accents.
- **Light Theme:** Using `bg3.jpg` and high-contrast text.
- **Dark Theme:** Using `bg2.jpg` and glowing blue accents.

## Technical Migration
- **Database:** Fully migrated from Firestore to **Firebase Realtime Database** for snappier performance.
- **Auth:** Cleaned up redundant logic and fixed redirection paths in [auth.js](file:///d:/TIMEWISE/auth/auth.js).
- **Project Structure:** Removed redundant directories and scripts to ensure a clean codebase.

## How to Test
1. **Entry:** Open [index.html](file:///d:/TIMEWISE/index.html) to see the new splash screen and auto-redirection.
2. **Planner:** Go to the Planner page, add some subjects without topics, and set a daily limit of 18 hours to test the **16-hour guardrail**.
3. **Dashboard:** Generate a plan and watch it instantly populate your home dashboard with the exam countdown and AI-suggested topics.
4. **AI Chat:** Open the "Ask Study Buddy" chat on the home page and send a message to see your credits decrease.
