// ===========================
//  MotoTrack — app.js
// ===========================

// ---- LOCAL STORAGE KEYS ----
const LS_RIWAYAT = 'mototrack_riwayat';
const LS_MOTOR   = 'mototrack_motor';

// ---- DOM REFS ----
const btnHitung       = document.getElementById('btnHitung');
const cardsGrid       = document.getElementById('cardsGrid');
const riwayatWrap     = document.getElementById('riwayatWrap');
const btnTambahRiwayat= document.getElementById('btnTambahRiwayat');
const modalOverlay    = document.getElementById('modalOverlay');
const btnModalClose   = document.getElementById('btnModalClose');
const btnModalSave    = document.getElementById('btnModalSave');
const hamburger       = document.getElementById('hamburger');
const navLinks        = document.getElementById('navLinks');

// ---- HAMBURGER MENU ----
hamburger.addEventListener('click', () => {
  navLinks.classList.toggle('open');
});

// Close nav on link click (mobile)
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => navLinks.classList.remove('open'));
});

// ---- PERAWATAN CONFIGS ----
const MAINTENANCE_TYPES = [
  {
    id: 'oli',
    label: 'Ganti Oli',
    icon: '🛢️',
    kmInterval: 3000,
    dayInterval: 90,
    kmKey: 'kmOli',
    tglKey: 'tglOli',
    unit: 'km / 3 bln',
  },
  {
    id: 'servis',
    label: 'Servis Berkala',
    icon: '🔧',
    kmInterval: 6000,
    dayInterval: 180,
    kmKey: 'kmServis',
    tglKey: 'tglServis',
    unit: 'km / 6 bln',
  },
  {
    id: 'ban',
    label: 'Ganti Ban',
    icon: '🔘',
    kmInterval: null,
    dayInterval: 730, // ~2 years
    kmKey: null,
    tglKey: 'tglBan',
    unit: '2 tahun',
  },
  {
    id: 'aki',
    label: 'Cek Aki',
    icon: '⚡',
    kmInterval: 10000,
    dayInterval: 180,
    kmKey: 'kmAki',
    tglKey: null,
    unit: 'km / 6 bln',
  },
];

// ---- UTILITY ----
function daysBetween(date1, date2) {
  const ms = date2 - date1;
  return Math.round(ms / (1000 * 60 * 60 * 24));
}

function formatDate(dateStr) {
  if (!dateStr) return '—';
  const d = new Date(dateStr);
  return d.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
}

function addDays(dateStr, days) {
  const d = new Date(dateStr);
  d.setDate(d.getDate() + days);
  return d.toISOString().split('T')[0];
}

function showToast(msg) {
  const existing = document.querySelector('.toast');
  if (existing) existing.remove();

  const t = document.createElement('div');
  t.className = 'toast';
  t.textContent = msg;
  document.body.appendChild(t);

  setTimeout(() => {
    t.classList.add('fade-out');
    setTimeout(() => t.remove(), 300);
  }, 3000);
}

// ---- STATUS LOGIC ----
// Returns { percent, status, dueKm, dueDate, lastKm, lastDate }
function calcStatus(type, data) {
  const today = new Date();
  today.setHours(0,0,0,0);

  let pctKm   = null;
  let pctDay  = null;
  let dueKm   = null;
  let dueDate = null;

  const kmNow = parseInt(data.kmSekarang) || 0;

  // Km-based
  if (type.kmKey && type.kmInterval) {
    const kmLast = parseInt(data[type.kmKey]) || 0;
    const kmUsed  = kmNow - kmLast;
    pctKm = Math.min(100, Math.round((kmUsed / type.kmInterval) * 100));
    dueKm = kmLast + type.kmInterval;
  }

  // Day-based
  if (type.tglKey && type.dayInterval) {
    const lastDate = data[type.tglKey] ? new Date(data[type.tglKey]) : null;
    if (lastDate) {
      const daysUsed = daysBetween(lastDate, today);
      pctDay = Math.min(100, Math.round((daysUsed / type.dayInterval) * 100));
      const dueDateStr = addDays(data[type.tglKey], type.dayInterval);
      dueDate = dueDateStr;
    }
  }

  // Take max percent
  let pct = 0;
  if (pctKm !== null && pctDay !== null) pct = Math.max(pctKm, pctDay);
  else if (pctKm !== null) pct = pctKm;
  else if (pctDay !== null) pct = pctDay;

  let status = 'ok';
  if (pct >= 90) status = 'danger';
  else if (pct >= 70) status = 'warn';

  let statusLabel = 'Aman';
  if (status === 'warn')   statusLabel = 'Segera';
  if (status === 'danger') statusLabel = 'Mendesak!';

  return { pct, status, statusLabel, dueKm, dueDate };
}

// ---- BUILD DASHBOARD CARDS ----
function buildCards(data) {
  cardsGrid.innerHTML = '';

  if (!data.kmSekarang) {
    cardsGrid.innerHTML = '<div class="card-placeholder"><p>⬆ Isi data motor di atas<br/>untuk melihat status perawatan.</p></div>';
    return;
  }

  const motorName = data.namaMotor || 'Motor Kamu';

  // Motor name header
  const header = document.createElement('div');
  header.style.cssText = 'grid-column:1/-1; margin-bottom:0.5rem;';
  header.innerHTML = `<p style="font-family:Syne,sans-serif;font-weight:700;font-size:1.15rem;color:var(--cream);">🏍️ ${motorName} — ${parseInt(data.kmSekarang).toLocaleString('id-ID')} km</p>`;
  cardsGrid.appendChild(header);

  MAINTENANCE_TYPES.forEach(type => {
    const { pct, status, statusLabel, dueKm, dueDate } = calcStatus(type, data);

    const dueInfo = [];
    if (dueKm) dueInfo.push(`<strong>${dueKm.toLocaleString('id-ID')} km</strong>`);
    if (dueDate) dueInfo.push(`<strong>${formatDate(dueDate)}</strong>`);

    const card = document.createElement('div');
    card.className = `maint-card status-${status}`;
    card.innerHTML = `
      <div class="card-header">
        <span class="card-icon">${type.icon}</span>
        <span class="status-badge">${statusLabel}</span>
      </div>
      <div>
        <div class="card-title">${type.label}</div>
        <div class="card-info">Interval: ${type.unit}</div>
      </div>
      <div class="progress-wrap">
        <div class="progress-bar">
          <div class="progress-fill" style="width:${pct}%; background:${status==='ok'?'var(--green)':status==='warn'?'var(--yellow)':'var(--red)'}"></div>
        </div>
        <div class="progress-labels">
          <span>0%</span>
          <span style="color:${status==='ok'?'var(--green)':status==='warn'?'var(--yellow)':'var(--red)'};font-weight:600">${pct}%</span>
          <span>100%</span>
        </div>
      </div>
      <div class="card-due">
        Perlu perawatan di: ${dueInfo.length ? dueInfo.join(' atau ') : '—'}
      </div>
    `;
    cardsGrid.appendChild(card);
  });
}

// ---- HITUNG BUTTON ----
btnHitung.addEventListener('click', () => {
  const data = {
    namaMotor:  document.getElementById('namaMotor').value.trim(),
    kmSekarang: document.getElementById('kmSekarang').value,
    kmOli:      document.getElementById('kmOli').value,
    tglOli:     document.getElementById('tglOli').value,
    kmServis:   document.getElementById('kmServis').value,
    tglServis:  document.getElementById('tglServis').value,
    tglBan:     document.getElementById('tglBan').value,
    kmAki:      document.getElementById('kmAki').value,
  };

  if (!data.kmSekarang) {
    showToast('⚠️ Masukkan odometer sekarang dulu!');
    document.getElementById('kmSekarang').focus();
    return;
  }

  localStorage.setItem(LS_MOTOR, JSON.stringify(data));
  buildCards(data);

  // ── Cek apakah ada model 3D untuk motor ini ──
  const model3D = cariModel3D(data.namaMotor);
  const container3D = document.getElementById('motor3dContainer');

  if (model3D && container3D) {
    tampilkan3D('motor3dContainer', model3D.sketchfabId, model3D.label);
    showToast(`✅ Jadwal dihitung! Model 3D ${model3D.label} ditemukan 🏍️`);
    // Scroll ke 3D viewer dulu
    setTimeout(() => {
      container3D.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 300);
  } else {
    if (container3D) container3D.innerHTML = '';
    showToast('✅ Jadwal perawatan berhasil dihitung!');
    // Scroll to dashboard
    document.getElementById('dashboard').scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
});

// ---- RIWAYAT ----
function getRiwayat() {
  try { return JSON.parse(localStorage.getItem(LS_RIWAYAT)) || []; }
  catch { return []; }
}

function saveRiwayat(list) {
  localStorage.setItem(LS_RIWAYAT, JSON.stringify(list));
}

function renderRiwayat() {
  const list = getRiwayat();
  riwayatWrap.innerHTML = '';

  if (!list.length) {
    riwayatWrap.innerHTML = '<div class="empty-state">Belum ada riwayat perawatan yang dicatat.</div>';
    return;
  }

  // Sort newest first
  const sorted = [...list].sort((a,b) => new Date(b.tanggal) - new Date(a.tanggal));

  sorted.forEach((item, i) => {
    const div = document.createElement('div');
    div.className = 'riwayat-item';
    div.innerHTML = `
      <div class="riwayat-dot"></div>
      <div class="riwayat-info">
        <div class="riwayat-jenis">${item.jenis}</div>
        <div class="riwayat-meta">${formatDate(item.tanggal)}${item.km ? ` · ${parseInt(item.km).toLocaleString('id-ID')} km` : ''}</div>
        ${item.catatan ? `<div class="riwayat-catatan">${item.catatan}</div>` : ''}
      </div>
      <button class="riwayat-del" data-idx="${i}" title="Hapus" aria-label="Hapus riwayat">✕</button>
    `;
    riwayatWrap.appendChild(div);
  });

  // Delete handlers
  riwayatWrap.querySelectorAll('.riwayat-del').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const sortedIdx = parseInt(e.currentTarget.dataset.idx);
      const itemToDelete = sorted[sortedIdx];
      const newList = getRiwayat().filter(r =>
        !(r.jenis === itemToDelete.jenis && r.tanggal === itemToDelete.tanggal && r.km === itemToDelete.km)
      );
      saveRiwayat(newList);
      renderRiwayat();
      showToast('🗑️ Riwayat dihapus');
    });
  });
}

// Modal open
btnTambahRiwayat.addEventListener('click', () => {
  document.getElementById('rTanggal').value = new Date().toISOString().split('T')[0];
  modalOverlay.classList.add('active');
});

// Modal close
btnModalClose.addEventListener('click', () => modalOverlay.classList.remove('active'));
modalOverlay.addEventListener('click', (e) => {
  if (e.target === modalOverlay) modalOverlay.classList.remove('active');
});

// Modal save
btnModalSave.addEventListener('click', () => {
  const jenis   = document.getElementById('rJenis').value;
  const tanggal = document.getElementById('rTanggal').value;
  const km      = document.getElementById('rKm').value;
  const catatan = document.getElementById('rCatatan').value.trim();

  if (!tanggal) { showToast('⚠️ Pilih tanggal dulu!'); return; }

  const list = getRiwayat();
  list.push({ jenis, tanggal, km, catatan });
  saveRiwayat(list);
  renderRiwayat();
  modalOverlay.classList.remove('active');

  // Reset form
  document.getElementById('rKm').value = '';
  document.getElementById('rCatatan').value = '';

  showToast(`✅ Riwayat "${jenis}" berhasil dicatat!`);
});

// ---- RESTORE FROM LOCALSTORAGE ON LOAD ----
window.addEventListener('DOMContentLoaded', () => {
  const saved = localStorage.getItem(LS_MOTOR);
  if (saved) {
    try {
      const data = JSON.parse(saved);
      document.getElementById('namaMotor').value  = data.namaMotor  || '';
      document.getElementById('kmSekarang').value = data.kmSekarang || '';
      document.getElementById('kmOli').value      = data.kmOli      || '';
      document.getElementById('tglOli').value     = data.tglOli     || '';
      document.getElementById('kmServis').value   = data.kmServis   || '';
      document.getElementById('tglServis').value  = data.tglServis  || '';
      document.getElementById('tglBan').value     = data.tglBan     || '';
      document.getElementById('kmAki').value      = data.kmAki      || '';
      buildCards(data);
    } catch(e) { /* silently ignore */ }
  }
  renderRiwayat();
});

// ---- ACTIVE NAV ON SCROLL ----
const sections = document.querySelectorAll('section[id]');
const navAnchors = document.querySelectorAll('.nav-links a');

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const id = entry.target.id;
      navAnchors.forEach(a => {
        a.style.color = a.getAttribute('href') === `#${id}` ? 'var(--cream)' : '';
      });
    }
  });
}, { rootMargin: '-40% 0px -55% 0px' });

sections.forEach(s => observer.observe(s));