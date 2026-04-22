import { auth } from "./firebase.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

/**
 * Global Auth Guard
 * Logic:
 * 1. If on index.html (splash), allow it to handle redirection.
 * 2. If on auth pages (login, signup): if user exists, go to home.
 * 3. If on protected pages (home, planner): if user is null, go to login.
 */

export function initAuthGuard() {
    onAuthStateChanged(auth, (user) => {
        const path = window.location.pathname;
        const isAuthPage = path.includes('/auth/login.html') || path.includes('/auth/signup.html');
        const isProtectedPage = path.includes('/pages/home/home.html') || path.includes('/pages/planner/planner.html');

        if (user && isAuthPage) {
            window.location.href = '../pages/home/home.html';
        } else if (!user && isProtectedPage) {
            window.location.href = '../../auth/login.html';
        }
    });
}
