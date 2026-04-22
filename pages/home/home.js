import { auth } from "../../scripts/firebase.js";
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { initAuthGuard } from "../../scripts/authGuard.js";
import { 
    subscribeToExams, 
    subscribeToTimetable 
} from "../../scripts/db.js";

// Initialize Auth Guard
initAuthGuard();

let currentUser = null;

onAuthStateChanged(auth, async (user) => {
    if (!user) return;
    currentUser = user;
    
    // 1. Initial Greeting
    updateGreeting(user.displayName);
    
    // 2. Real-time Listeners
    subscribeToExams(user.uid, (exams) => updateExamStats(exams));
    subscribeToTimetable(user.uid, (plan) => renderTimetable(plan));
    
    // 3. Local Stats
    updateLocalStats();
});

function updateGreeting(name) {
    const hour = new Date().getHours();
    let greet = "Good Evening";
    if (hour < 12) greet = "Good Morning";
    else if (hour < 18) greet = "Good Afternoon";
    
    document.getElementById("greetingMsg").innerText = `${greet}, ${name || 'Student'}`;
}

function updateExamStats(exams) {
    if (!exams || exams.length === 0) {
        document.getElementById("nextExamDays").innerText = "--";
        document.getElementById("nextExamName").innerText = "No upcoming exams";
        return;
    }

    const now = new Date();
    const sorted = exams.sort((a, b) => new Date(a.date) - new Date(b.date));
    const next = sorted[0];
    
    const diff = new Date(next.date) - now;
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
    
    document.getElementById("nextExamDays").innerText = days > 0 ? days : "0";
    document.getElementById("nextExamName").innerText = `Next Exam: ${next.name}`;
}

function updateLocalStats() {
    // Streak
    const streak = localStorage.getItem("streak") || 0;
    document.getElementById("streakVal").innerText = streak;

    // Tasks Today
    const tasks = JSON.parse(localStorage.getItem("tasks") || "[]");
    const today = new Date().toISOString().split('T')[0];
    const todayTasks = tasks.filter(t => t.date === today);
    const completed = todayTasks.filter(t => t.completed).length;
    
    document.getElementById("tasksVal").innerText = todayTasks.length;
    
    // Progress %
    const percent = todayTasks.length > 0 ? Math.round((completed / todayTasks.length) * 100) : 0;
    document.getElementById("progressPercent").innerText = `${percent}%`;
    document.getElementById("progressBar").style.width = `${percent}%`;
}

function renderTimetable(plan) {
    const container = document.getElementById("timetableContent");
    if (!plan || plan.length === 0) {
        container.innerHTML = '<p style="opacity: 0.5; text-align: center; padding: 40px;">No study plan found.</p>';
        return;
    }

    let html = '';
    let totalStudyTime = 0;
    const todayStr = new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });

    plan.forEach(day => {
        const isToday = day.date.includes(todayStr) || day.date === todayStr;
        
        html += `
            <div class="timetable-day">
                <h3 class="day-title">${day.date} ${isToday ? '(Today)' : ''}</h3>
                <div class="timetable-grid">
                    ${day.blocks.map(block => {
                        if (isToday) totalStudyTime += parseFloat(block.hours);
                        return `
                        <div class="glass-card study-block">
                            <div>
                                <strong style="color: var(--accent);">${block.subject}</strong><br>
                                <small style="opacity: 0.7;">Topic: ${block.topic}</small>
                            </div>
                            <div style="text-align: right;">
                                <span style="font-weight: bold;">${block.hours}h</span>
                                ${block.peakFocus ? '<br><span class="focus-tag" style="background: var(--accent); color: white; font-size: 0.6rem; padding: 2px 5px; border-radius: 4px;">PEAK FOCUS</span>' : ''}
                            </div>
                        </div>`;
                    }).join('')}
                </div>
            </div>`;
    });

    container.innerHTML = html;
    document.getElementById("studyHoursVal").innerText = `${totalStudyTime}h`;
}

// UI Actions
window.toggleTheme = () => {
    const current = document.documentElement.getAttribute("data-theme");
    const target = current === "dark" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", target);
    localStorage.setItem("theme", target);
    document.getElementById("themeBtn").innerText = target === "dark" ? "☀️" : "🌙";
};

document.getElementById("logoutBtn").addEventListener("click", () => signOut(auth));