import { rtdb } from "./firebase.js";
import { 
    ref, 
    set, 
    push, 
    get, 
    remove, 
    update,
    runTransaction,
    onValue
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-database.js";

/* ================= USER REGISTRATION ================= */

export async function registerUser(uid, profileData) {
    const userRef = ref(rtdb, `users/${uid}/profile`);
    return await set(userRef, {
        ...profileData,
        registeredAt: new Date().toISOString()
    });
}

export async function checkRegistration(uid) {
    const userRef = ref(rtdb, `users/${uid}/profile`);
    const snapshot = await get(userRef);
    return snapshot.exists();
}

/* ================= CREDIT SYSTEM ================= */

export async function getDailyCredits(uid) {
    const today = new Date().toISOString().split('T')[0];
    const creditRef = ref(rtdb, `users/${uid}/usage_count/${today}`);
    const snapshot = await get(creditRef);
    return snapshot.exists() ? snapshot.val() : 0;
}

export async function useCredit(uid) {
    const today = new Date().toISOString().split('T')[0];
    const creditRef = ref(rtdb, `users/${uid}/usage_count/${today}`);
    
    const result = await runTransaction(creditRef, (currentValue) => {
        const val = currentValue || 0;
        if (val >= 20) {
            return; // Abort: no credits left
        }
        return val + 1;
    });

    return result.committed;
}

/* ================= SUBJECTS ================= */

export async function saveSubject(uid, data) {
    const subjectRef = ref(rtdb, `users/${uid}/subjects`);
    return await push(subjectRef, data);
}

export async function getSubjects(uid) {
    const subjectRef = ref(rtdb, `users/${uid}/subjects`);
    const snapshot = await get(subjectRef);
    if (!snapshot.exists()) return [];
    
    const data = snapshot.val();
    return Object.keys(data).map(key => ({
        id: key,
        ...data[key]
    }));
}

export async function deleteSubject(uid, id) {
    const subjectRef = ref(rtdb, `users/${uid}/subjects/${id}`);
    return await remove(subjectRef);
}

export function subscribeToSubjects(uid, callback) {
    const subjectRef = ref(rtdb, `users/${uid}/subjects`);
    return onValue(subjectRef, (snapshot) => {
        const data = snapshot.val();
        const subjects = data ? Object.keys(data).map(key => ({ id: key, ...data[key] })) : [];
        callback(subjects);
    });
}

/* ================= EXAMS ================= */

export async function saveExam(uid, examData) {
    const examRef = ref(rtdb, `users/${uid}/exams`);
    return await push(examRef, examData);
}

export async function getExams(uid) {
    const examRef = ref(rtdb, `users/${uid}/exams`);
    const snapshot = await get(examRef);
    if (!snapshot.exists()) return [];
    
    const data = snapshot.val();
    return Object.keys(data).map(key => ({
        id: key,
        ...data[key]
    }));
}

export async function deleteExam(uid, id) {
    return await remove(ref(rtdb, `users/${uid}/exams/${id}`));
}

export function subscribeToExams(uid, callback) {
    const examRef = ref(rtdb, `users/${uid}/exams`);
    return onValue(examRef, (snapshot) => {
        const data = snapshot.val();
        const exams = data ? Object.keys(data).map(key => ({ id: key, ...data[key] })) : [];
        callback(exams);
    });
}

export async function moveExamToHistory(uid, examId, examData) {
    const historyRef = ref(rtdb, `users/${uid}/history/${examId}`);
    await set(historyRef, {
        ...examData,
        archivedAt: new Date().toISOString()
    });
    return await deleteExam(uid, examId);
}

export function subscribeToHistory(uid, callback) {
    const historyRef = ref(rtdb, `users/${uid}/history`);
    return onValue(historyRef, (snapshot) => {
        const data = snapshot.val();
        const history = data ? Object.keys(data).map(key => ({ id: key, ...data[key] })) : [];
        callback(history);
    });
}

/* ================= TIMETABLE ================= */

export async function saveTimetable(uid, plan) {
    const timetableRef = ref(rtdb, `users/${uid}/timetable`);
    return await set(timetableRef, plan);
}

export async function updateTimetable(uid, newPlan) {
    const timetableRef = ref(rtdb, `users/${uid}/timetable`);
    return await set(timetableRef, newPlan);
}

export async function getTimetable(uid) {
    const timetableRef = ref(rtdb, `users/${uid}/timetable`);
    const snapshot = await get(timetableRef);
    return snapshot.exists() ? snapshot.val() : null;
}

export function subscribeToTimetable(uid, callback) {
    const timetableRef = ref(rtdb, `users/${uid}/timetable`);
    return onValue(timetableRef, (snapshot) => {
        callback(snapshot.val());
    });
}