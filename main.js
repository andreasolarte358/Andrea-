/**
 * AETHER DIGITAL™ - CORE INTERACTIVE ENGINE (Vanilla JS)
 * Gestiona el carrito dinámico, drawer lateral, menú responsive,
 * acordeones de temario/FAQ, previsualización de mockups y sistema de notificaciones toast.
 */

// --- ESTADO GLOBAL DEL CARRITO ---
const CartState = {
  items: [
    {
      id: "prod-architect-ui",
      title: "ARCHITECT UI Pro Kit",
      category: "Design System & React Kit",
      price: 149,
      quantity: 1,
      format: "Figma + Next.js 15"
    }
  ],

  // Calcular totales
  get subtotal() {
    return this.items.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  },

  get count() {
    return this.items.reduce((acc, item) => acc + item.quantity, 0);
  },

  addItem(product) {
    const existing = this.items.find(item => item.id === product.id);
    if (existing) {
      existing.quantity += 1;
    } else {
      this.items.push({
        ...product,
        quantity: 1
      });
    }
    this.updateUI();
    showToast("Producto añadido", `"${product.title}" se agregó a tu orden digital.`);
  },

  removeItem(id) {
    this.items = this.items.filter(item => item.id !== id);
    this.updateUI();
    showToast("Producto removido", "El artículo se eliminó de tu carrito.");
  },

  updateUI() {
    // 1. Actualizar insignias de contador en navbar
    const badgeElements = document.querySelectorAll(".cart-badge-count");
    badgeElements.forEach(badge => {
      badge.textContent = this.count;
      badge.style.display = this.count > 0 ? "flex" : "none";
    });

    // 2. Actualizar lista en drawer
    const listContainer = document.getElementById("cartItemsList");
    const emptyNotice = document.getElementById("cartEmptyNotice");
    const subtotalEl = document.getElementById("cartSubtotal");
    const totalEl = document.getElementById("cartTotal");

    if (listContainer) {
      listContainer.innerHTML = "";

      if (this.items.length === 0) {
        if (emptyNotice) emptyNotice.style.display = "block";
      } else {
        if (emptyNotice) emptyNotice.style.display = "none";

        this.items.forEach(item => {
          const itemEl = document.createElement("div");
          itemEl.className = "cart-item";
          itemEl.innerHTML = `
            <div class="cart-item-thumb">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
                <line x1="8" y1="21" x2="16" y2="21"></line>
                <line x1="12" y1="17" x2="12" y2="21"></line>
              </svg>
            </div>
            <div class="cart-item-info">
              <h5 class="cart-item-title">${item.title}</h5>
              <div class="cart-item-badge">${item.category} • ${item.format || 'Digital Asset'}</div>
              <div class="cart-item-bottom">
                <span class="cart-item-price">$${item.price} USD</span>
                <button type="button" class="cart-item-remove" onclick="CartState.removeItem('${item.id}')">
                  Eliminar
                </button>
              </div>
            </div>
          `;
          listContainer.appendChild(itemEl);
        });
      }
    }

    // 3. Totales
    if (subtotalEl) subtotalEl.textContent = `$${this.subtotal} USD`;
    if (totalEl) totalEl.textContent = `$${this.subtotal} USD`;
  }
};

// --- CONTROL DEL DRAWER DEL CARRITO ---
function toggleCartDrawer(open) {
  const backdrop = document.getElementById("cartDrawerBackdrop");
  if (!backdrop) return;

  if (open) {
    backdrop.classList.add("is-open");
    document.body.style.overflow = "hidden";
  } else {
    backdrop.classList.remove("is-open");
    document.body.style.overflow = "";
  }
}

// --- MENÚ MÓVIL RESPONSIVE ---
function initMobileMenu() {
  const toggleBtn = document.getElementById("mobileToggleBtn");
  const navMenu = document.getElementById("navMenu");

  if (toggleBtn && navMenu) {
    toggleBtn.addEventListener("click", () => {
      navMenu.classList.toggle("is-open");
    });
  }
}

// --- SISTEMA DE ACORDEONES INTERACTIVOS (FAQ Y TEMARIOS) ---
function initAccordions() {
  const headers = document.querySelectorAll(".accordion-header");

  headers.forEach(header => {
    header.addEventListener("click", () => {
      const item = header.closest(".accordion-item");
      const content = item.querySelector(".accordion-content");
      const isOpen = item.classList.contains("active");

      // Opcional: Cerrar los demás del mismo grupo
      const parentGroup = item.closest(".accordion-group");
      if (parentGroup) {
        parentGroup.querySelectorAll(".accordion-item").forEach(sibling => {
          if (sibling !== item) {
            sibling.classList.remove("active");
            const siblingContent = sibling.querySelector(".accordion-content");
            if (siblingContent) siblingContent.style.maxHeight = null;
          }
        });
      }

      if (isOpen) {
        item.classList.remove("active");
        content.style.maxHeight = null;
      } else {
        item.classList.add("active");
        content.style.maxHeight = content.scrollHeight + "px";
      }
    });
  });
}

// --- PREVISUALIZADOR DE MOCKUPS INTERACTIVO (PÁGINA DETALLE) ---
function switchMockupView(viewType, thumbElement) {
  const canvas = document.getElementById("mockupPreviewCanvas");
  if (!canvas) return;

  // Actualizar clase activa en thumbnails
  const allThumbs = document.querySelectorAll(".thumb-item");
  allThumbs.forEach(t => t.classList.remove("active"));
  if (thumbElement) thumbElement.classList.add("active");

  // Renderizar vistas dinámicas simuladas en CSS/HTML
  if (viewType === 'dashboard') {
    canvas.innerHTML = `
      <div class="showcase-topbar">
        <span class="mockup-dot" style="background:#ef4444;"></span>
        <span class="mockup-dot" style="background:#f59e0b;"></span>
        <span class="mockup-dot" style="background:#10b981;"></span>
        <span style="margin-left:auto; font-family:var(--font-mono); font-size:0.65rem; color:var(--text-muted);">architect-ui.dev/dashboard</span>
      </div>
      <div class="showcase-workspace">
        <div class="workspace-sidebar">
          <div style="height:6px; background:rgba(255,255,255,0.15); border-radius:3px; margin-bottom:4px;"></div>
          <div style="height:4px; width:70%; background:var(--accent-electric); border-radius:2px;"></div>
          <div style="height:4px; width:50%; background:rgba(255,255,255,0.08); border-radius:2px; margin-top:8px;"></div>
          <div style="height:4px; width:65%; background:rgba(255,255,255,0.08); border-radius:2px;"></div>
        </div>
        <div class="workspace-dash">
          <div class="dash-chart-mock">
            <div style="padding:10px; display:flex; justify-content:space-between; align-items:center;">
              <span style="font-size:0.75rem; font-weight:700; color:var(--text-primary);">Analítica en Tiempo Real</span>
              <span style="font-size:0.7rem; color:var(--accent-electric); font-family:var(--font-mono);">+94.8% Retorno</span>
            </div>
            <div style="position:absolute; bottom:0; left:0; width:100%; height:35px; background:linear-gradient(90deg, transparent, rgba(0,255,135,0.25)); border-top:2px solid var(--accent-electric);"></div>
          </div>
          <div class="dash-grid-cards">
            <div class="dash-mini-card">
              <div style="font-size:0.65rem; color:var(--text-muted);">Suscripciones Activas</div>
              <div style="font-size:0.9rem; font-weight:800; color:var(--text-primary);">$48,290</div>
            </div>
            <div class="dash-mini-card">
              <div style="font-size:0.65rem; color:var(--text-muted);">Conversión Checkout</div>
              <div style="font-size:0.9rem; font-weight:800; color:var(--accent-electric);">14.2%</div>
            </div>
          </div>
        </div>
      </div>
    `;
  } else if (viewType === 'code') {
    canvas.innerHTML = `
      <div class="showcase-topbar">
        <span class="mockup-dot" style="background:#ef4444;"></span>
        <span class="mockup-dot" style="background:#f59e0b;"></span>
        <span class="mockup-dot" style="background:#10b981;"></span>
        <span style="margin-left:auto; font-family:var(--font-mono); font-size:0.65rem; color:var(--text-muted);">PaymentCheckout.tsx</span>
      </div>
      <div style="padding:20px; font-family:var(--font-mono); font-size:0.8rem; line-height:1.6; color:#a5b4fc;">
        <span style="color:#f43f5e;">import</span> { <span style="color:#38bdf8;">useAetherPay</span> } <span style="color:#f43f5e;">from</span> <span style="color:var(--accent-electric);">'@aether/core'</span>;<br><br>
        <span style="color:#f43f5e;">export const</span> <span style="color:#fbbf24;">HighConvertingCheckout</span> = () => {<br>
        &nbsp;&nbsp;<span style="color:#f43f5e;">const</span> { executeOneClickBuy } = <span style="color:#38bdf8;">useAetherPay</span>();<br>
        &nbsp;&nbsp;<span style="color:#64748b;">// Arquitectura lista para producción</span><br>
        &nbsp;&nbsp;<span style="color:#f43f5e;">return</span> &lt;<span style="color:#38bdf8;">SecureInstantVault</span> encrypted={true} /&gt;;<br>
        };
      </div>
    `;
  } else if (viewType === 'figma') {
    canvas.innerHTML = `
      <div class="showcase-topbar">
        <span class="mockup-dot" style="background:#ef4444;"></span>
        <span class="mockup-dot" style="background:#f59e0b;"></span>
        <span class="mockup-dot" style="background:#10b981;"></span>
        <span style="margin-left:auto; font-family:var(--font-mono); font-size:0.65rem; color:var(--text-muted);">Figma Tokens & Auto-Layout v4</span>
      </div>
      <div style="padding:25px; display:flex; flex-direction:column; gap:12px; align-items:center; justify-content:center; height:calc(100% - 28px);">
        <div style="display:flex; gap:12px;">
          <div style="width:50px; height:50px; border-radius:12px; background:#08090c; border:1px solid rgba(255,255,255,0.2); display:flex; align-items:center; justify-content:center; font-size:0.7rem; font-family:var(--font-mono);">60%</div>
          <div style="width:50px; height:50px; border-radius:12px; background:#192238; border:1px solid rgba(255,255,255,0.2); display:flex; align-items:center; justify-content:center; font-size:0.7rem; font-family:var(--font-mono);">30%</div>
          <div style="width:50px; height:50px; border-radius:12px; background:var(--accent-electric); color:#08090c; font-weight:800; display:flex; align-items:center; justify-content:center; font-size:0.7rem; font-family:var(--font-mono); box-shadow:0 0 15px rgba(0,255,135,0.5);">10%</div>
        </div>
        <div style="font-size:0.85rem; font-weight:600; color:var(--text-primary); text-align:center;">150+ Componentes Variantes, Variables Locales y Modos Luz/Oscuro</div>
      </div>
    `;
  }
}

// --- NOTIFICACIONES TOAST FLOTANTES ---
function showToast(title, message) {
  let container = document.querySelector(".toast-container");
  if (!container) {
    container = document.createElement("div");
    container.className = "toast-container";
    document.body.appendChild(container);
  }

  const toast = document.createElement("div");
  toast.className = "toast";
  toast.innerHTML = `
    <div style="color:var(--accent-electric); display:flex; align-items:center;">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
        <polyline points="20 6 9 17 4 12"></polyline>
      </svg>
    </div>
    <div>
      <div style="font-weight:700; font-size:0.9rem; color:var(--text-primary);">${title}</div>
      <div style="font-size:0.8rem; color:var(--text-secondary);">${message}</div>
    </div>
  `;

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.transition = "opacity 0.3s ease, transform 0.3s ease";
    toast.style.opacity = "0";
    toast.style.transform = "translateY(10px)";
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}

// --- INICIALIZACIÓN GLOBAL ---
document.addEventListener("DOMContentLoaded", () => {
  CartState.updateUI();
  initMobileMenu();
  initAccordions();

  // Cerrar drawer al hacer click en el backdrop
  const backdrop = document.getElementById("cartDrawerBackdrop");
  if (backdrop) {
    backdrop.addEventListener("click", (e) => {
      if (e.target === backdrop) {
        toggleCartDrawer(false);
      }
    });
  }
});
