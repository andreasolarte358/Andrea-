/**
 * DIGNITAS™ - INTERACTIVE ACCESSIBILITY & COMMUNITY SCRIPT
 * Provee conmutador de modo claro/oscuro, ajuste de tamaño de fuente (accesibilidad universal)
 * y ventana modal de apoyo ciudadano.
 */

document.addEventListener("DOMContentLoaded", () => {
  // 1. Conmutador de Modo Oscuro / Claro
  const themeToggleBtn = document.getElementById("themeToggleBtn");
  const currentTheme = localStorage.getItem("dignitas-theme") || "light";
  document.documentElement.setAttribute("data-theme", currentTheme);
  updateThemeButtonText(currentTheme);

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener("click", () => {
      const activeTheme = document.documentElement.getAttribute("data-theme");
      const newTheme = activeTheme === "dark" ? "light" : "dark";
      document.documentElement.setAttribute("data-theme", newTheme);
      localStorage.setItem("dignitas-theme", newTheme);
      updateThemeButtonText(newTheme);
    });
  }

  function updateThemeButtonText(theme) {
    if (!themeToggleBtn) return;
    themeToggleBtn.innerHTML = theme === "dark" 
      ? `<span>☀️ Modo Claro</span>` 
      : `<span>🌙 Modo Oscuro</span>`;
  }

  // 2. Control de Tamaño de Texto Accesible
  const fontToggleBtn = document.getElementById("fontToggleBtn");
  let isLargeFont = false;

  if (fontToggleBtn) {
    fontToggleBtn.addEventListener("click", () => {
      isLargeFont = !isLargeFont;
      document.documentElement.style.fontSize = isLargeFont ? "18px" : "16px";
      fontToggleBtn.setAttribute("aria-pressed", isLargeFont);
      fontToggleBtn.textContent = isLargeFont ? "A- Tamaño Normal" : "A+ Texto Grande";
    });
  }
});

// Función para abrir modal de contacto/asistencia
function openSupportModal() {
  const modal = document.getElementById("supportModal");
  if (modal) {
    modal.style.display = "flex";
    document.body.style.overflow = "hidden";
  }
}

function closeSupportModal() {
  const modal = document.getElementById("supportModal");
  if (modal) {
    modal.style.display = "none";
    document.body.style.overflow = "";
  }
}

// Copiar texto de artículo para difusión
function copyArticle(textId) {
  const textEl = document.getElementById(textId);
  if (!textEl) return;

  navigator.clipboard.writeText(textEl.innerText).then(() => {
    alert("Texto copiado al portapapeles para su libre difusión.");
  }).catch(() => {
    alert("No se pudo copiar automáticamente.");
  });
}
