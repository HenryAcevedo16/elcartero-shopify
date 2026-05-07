// =============================================
// EL CARTERO — WISHLIST (Favoritos)
// Guarda productos en localStorage del navegador
// =============================================

const WL_KEY = 'elcartero_wishlist';

function wlGet() {
  try { return JSON.parse(localStorage.getItem(WL_KEY) || '[]'); }
  catch (e) { return []; }
}

function wlSave(list) {
  localStorage.setItem(WL_KEY, JSON.stringify(list));
  wlUpdateBadge();
}

// ── Toggle corazón de un producto ───────────
function toggleWish(btn) {
  const id    = btn.dataset.wishId;
  const title = btn.dataset.wishTitle;
  const img   = btn.dataset.wishImg || '';
  const price = btn.dataset.wishPrice;
  const url   = btn.dataset.wishUrl || '/collections/all';
  let list = wlGet();
  const idx = list.findIndex(p => String(p.id) === String(id));

  if (idx > -1) {
    list.splice(idx, 1);
    btn.classList.remove('wished');
    btn.innerHTML = '♡';
  } else {
    list.push({ id, title, img, price, url });
    btn.classList.add('wished');
    btn.innerHTML = '♥';
    // Micro-animación
    btn.style.transform = 'scale(1.5)';
    setTimeout(() => btn.style.transform = '', 250);
  }
  wlSave(list);
}

// ── Actualizar badge del nav ─────────────────
function wlUpdateBadge() {
  const count = wlGet().length;
  document.querySelectorAll('.wish-badge').forEach(b => {
    b.textContent = count;
    b.style.display = count > 0 ? 'flex' : 'none';
  });
}

// ── Marcar botones ya guardados al cargar ────
function wlInitButtons() {
  const ids = wlGet().map(p => String(p.id));
  document.querySelectorAll('[data-wish-id]').forEach(btn => {
    if (ids.includes(String(btn.dataset.wishId))) {
      btn.classList.add('wished');
      btn.innerHTML = '♥';
    }
  });
}

// ── Abrir / cerrar panel lateral ─────────────
function wlTogglePanel() {
  const panel = document.getElementById('wishPanel');
  if (!panel) return;
  const isOpen = panel.classList.toggle('open');
  document.body.style.overflow = isOpen ? 'hidden' : '';
  if (isOpen) wlRenderPanel();
}

// ── Renderizar items dentro del panel ────────
function wlRenderPanel() {
  const list  = wlGet();
  const inner = document.getElementById('wishPanelContent');
  if (!inner) return;

  if (list.length === 0) {
    inner.innerHTML = `
      <div style="text-align:center;padding:48px 16px;">
        <div style="font-size:3.5rem;margin-bottom:14px;opacity:.35;">♡</div>
        <p style="color:var(--muted);font-size:.9rem;line-height:1.6;">Aún no has guardado<br>ningún favorito.</p>
        <a href="/collections/all" onclick="wlTogglePanel()"
           style="display:inline-block;margin-top:18px;font-size:.85rem;color:var(--red);font-weight:700;text-decoration:none;">
          Explorar productos →
        </a>
      </div>`;
    return;
  }

  inner.innerHTML = list.map(item => `
    <div style="display:flex;align-items:center;gap:12px;padding:14px 0;border-bottom:1px solid rgba(0,0,0,.07);">
      <a href="${item.url || '/collections/all'}" style="flex-shrink:0;">
        <div style="width:62px;height:62px;border-radius:12px;background:#f5f0e8;overflow:hidden;display:flex;align-items:center;justify-content:center;">
          ${item.img
            ? `<img src="${item.img}" alt="${item.title}" style="width:100%;height:100%;object-fit:contain;">`
            : '<span style="font-size:1.5rem;">📦</span>'}
        </div>
      </a>
      <div style="flex:1;min-width:0;">
        <a href="${item.url || '/collections/all'}" style="text-decoration:none;color:inherit;">
          <div style="font-size:.82rem;font-weight:600;line-height:1.35;margin-bottom:5px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${item.title}</div>
        </a>
        <div style="font-size:.85rem;color:var(--red);font-weight:700;">${item.price}</div>
      </div>
      <button onclick="wlRemove('${item.id}')" aria-label="Quitar"
              style="background:none;border:none;cursor:pointer;font-size:1.4rem;color:var(--muted);padding:4px 8px;line-height:1;flex-shrink:0;">×</button>
    </div>
  `).join('');
}

// ── Init ─────────────────────────────────────────
function wlRemove(id) {
  let list = wlGet().filter(p => String(p.id) !== String(id));
  wlSave(list);
  wlRenderPanel();
  document.querySelectorAll(`[data-wish-id="${id}"]`).forEach(btn => {
    btn.classList.remove('wished');
    btn.innerHTML = '♡';
  });
}

document.addEventListener('DOMContentLoaded', function () {
  wlInitButtons();
  wlUpdateBadge();
  // El overlay ya tiene onclick en theme.liquid — no duplicar listener aquí
});
