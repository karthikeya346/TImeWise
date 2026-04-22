import { auth } from "../../scripts/firebase.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { initAuthGuard } from "../../scripts/authGuard.js";

initAuthGuard();

let currentUser = null;
let tasks = JSON.parse(localStorage.getItem("tasks") || "[]");

onAuthStateChanged(auth, (user) => {
    if (!user) return;
    currentUser = user;
    renderTasks();
});

window.addTask = () => {
    const input = document.getElementById("taskInput");
    const text = input.value.trim();
    if (!text) return;

    const newTask = {
        id: Date.now(),
        text: text,
        completed: false,
        date: new Date().toISOString().split('T')[0],
        userId: currentUser.uid
    };

    tasks.push(newTask);
    saveAndRender();
    input.value = "";
};

window.toggleTask = (id) => {
    tasks = tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t);
    saveAndRender();
};

window.deleteTask = (id) => {
    tasks = tasks.filter(t => t.id !== id);
    saveAndRender();
};

function saveAndRender() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
    renderTasks();
}

function renderTasks() {
    const list = document.getElementById("taskList");
    // Filter tasks for current user and today
    const today = new Date().toISOString().split('T')[0];
    const userTasks = tasks.filter(t => t.userId === currentUser.uid && t.date === today);

    if (userTasks.length === 0) {
        list.innerHTML = '<p style="opacity: 0.5; text-align: center; padding: 40px;">No tasks for today. Add one above!</p>';
        return;
    }

    list.innerHTML = userTasks.map(t => `
        <div class="glass-card task-item ${t.completed ? 'completed' : ''}">
            <div class="checkbox ${t.completed ? 'checked' : ''}" onclick="toggleTask(${t.id})"></div>
            <div class="task-text">${t.text}</div>
            <button class="delete-btn" onclick="deleteTask(${t.id})">Delete</button>
        </div>
    `).join('');
}

// Handle Enter key on input
document.getElementById("taskInput")?.addEventListener("keypress", (e) => {
    if (e.key === "Enter") addTask();
});
