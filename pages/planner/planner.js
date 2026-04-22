import { auth } from "../../scripts/firebase.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { initAuthGuard } from "../../scripts/authGuard.js";
import { saveExam, saveTimetable } from "../../scripts/db.js";
import { generateStudyPlan } from "../../scripts/plannerLogic.js";

// Initialize Auth Guard
initAuthGuard();

let currentUser = null;
let subjects = [];

onAuthStateChanged(auth, (user) => {
    if (!user) return;
    currentUser = user;
});

window.addSubject = () => {
    const name = document.getElementById("subName").value.trim();
    const priority = document.getElementById("subPriority").value;

    if (!name) return alert("Please enter subject name");

    const sub = { id: Date.now(), name, priority };
    subjects.push(sub);
    renderSubjects();
    
    document.getElementById("subName").value = "";
};

function renderSubjects() {
    const list = document.getElementById("subjectList");
    list.innerHTML = subjects.map(s => `
        <div class="glass-card subject-pill">
            <span><strong>${s.name}</strong> - ${getPriorityLabel(s.priority)}</span>
            <button class="glass-btn" style="padding: 5px 10px; background: rgba(255,0,0,0.1); border:none;" onclick="removeSubject(${s.id})">×</button>
        </div>
    `).join('');
}

function getPriorityLabel(p) {
    if (p === "1") return "Low";
    if (p === "2") return "Medium";
    return "High";
}

window.removeSubject = (id) => {
    subjects = subjects.filter(s => s.id !== id);
    renderSubjects();
};

window.generatePlan = async () => {
    const dailyHours = parseFloat(document.getElementById("dailyHours").value);
    const examName = document.getElementById("examName").value.trim();
    const examDate = document.getElementById("examDate").value;

    if (!dailyHours || !examName || !examDate) {
        return alert("Please fill in all planning details.");
    }

    if (subjects.length === 0) {
        return alert("Please add at least one subject.");
    }

    try {
        // Deterministic Logic Execution
        const plan = generateStudyPlan(subjects, examDate, dailyHours);

        // Save to Firebase for Home Dashboard sync
        await saveExam(currentUser.uid, { name: examName, date: examDate });
        await saveTimetable(currentUser.uid, plan);

        alert("Study Plan Generated Successfully!");
        window.location.href = "../home/home.html";

    } catch (err) {
        alert("Error: " + err.message);
    }
};