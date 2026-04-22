import { auth } from "../../scripts/firebase.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { initAuthGuard } from "../../scripts/authGuard.js";

initAuthGuard();

onAuthStateChanged(auth, (user) => {
    if (!user) return;
    calculateStats(user.uid);
});

function calculateStats(uid) {
    const tasks = JSON.parse(localStorage.getItem("tasks") || "[]");
    const userTasks = tasks.filter(t => t.userId === uid);
    
    // 1. Total Lifetime Tasks
    const completedTasks = userTasks.filter(t => t.completed);
    document.getElementById("totalTasks").innerText = completedTasks.length;

    // 2. Today's Progress
    const today = new Date().toISOString().split('T')[0];
    const todayTasks = userTasks.filter(t => t.date === today);
    const todayCompleted = todayTasks.filter(t => t.completed);
    
    const percent = todayTasks.length > 0 ? Math.round((todayCompleted.length / todayTasks.length) * 100) : 0;
    
    // Update Progress Circle
    const circle = document.getElementById("progressCircle");
    circle.style.background = `conic-gradient(var(--accent) ${percent}%, rgba(255,255,255,0.1) ${percent}%)`;
    document.getElementById("progressVal").innerText = `${percent}%`;
    
    // Status message
    const status = document.getElementById("progressStatus");
    if (percent === 0 && todayTasks.length > 0) status.innerText = "Time to get started! 🚀";
    else if (percent === 100) status.innerText = "All caught up! You're a star! ⭐";
    else if (percent > 0) status.innerText = "Keep going, you're doing great! 💪";

    // 3. Render History (Last 7 days simplified)
    renderHistory(userTasks);
}

function renderHistory(userTasks) {
    const container = document.getElementById("historyContent");
    const history = {};

    userTasks.forEach(t => {
        if (!history[t.date]) history[t.date] = { total: 0, done: 0 };
        history[t.date].total++;
        if (t.completed) history[t.date].done++;
    });

    const sortedDates = Object.keys(history).sort((a, b) => new Date(b) - new Date(a)).slice(0, 7);

    if (sortedDates.length === 0) return;

    container.innerHTML = sortedDates.map(date => {
        const stats = history[date];
        const p = Math.round((stats.done / stats.total) * 100);
        return `
            <div class="glass-card" style="margin-bottom: 10px; padding: 15px; display: flex; justify-content: space-between; align-items: center;">
                <strong>${new Date(date).toLocaleDateString()}</strong>
                <span>${stats.done}/${stats.total} Tasks (${p}%)</span>
                <div style="width: 100px; height: 8px; background: rgba(255,255,255,0.1); border-radius: 4px; overflow: hidden;">
                    <div style="width: ${p}%; height: 100%; background: var(--accent);"></div>
                </div>
            </div>
        `;
    }).join('');
}
