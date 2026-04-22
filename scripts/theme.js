export function loadTheme() {
  const theme = localStorage.getItem("theme") || "light";
  document.body.classList.toggle("dark", theme === "dark");
}

export function toggleTheme() {
  let theme = localStorage.getItem("theme") || "light";
  theme = theme === "light" ? "dark" : "light";

  localStorage.setItem("theme", theme);
  loadTheme();
}