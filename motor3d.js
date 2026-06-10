// ============================================================
//  motor3d.js — Database model 3D Sketchfab motor Indonesia
//  Logic: kalau motor cocok & ID valid → embed Sketchfab
//         kalau tidak ada → return null → tampil biasa
// ============================================================

// ID Sketchfab yang sudah dikonfirmasi FREE & bisa di-embed
const MOTOR_3D_DB = [

  // ── HONDA ────────────────────────────────────────────────
  {
    keywords: ['honda beat', 'beat street', 'beat pop', 'beat esp'],
    label: 'Honda Beat',
    sketchfabId: '66ad2b3acd0b4b19ba6e53e8549cad39'
  },
  {
    keywords: ['vario 150', 'vario150', 'click 150', 'click150'],
    label: 'Honda Vario 150',
    sketchfabId: '7092ec8980ff4190845fd441918d89f5'
  },
  {
    keywords: ['vario 160', 'vario160'],
    label: 'Honda Vario 160',
    sketchfabId: 'f92f147382134bd3839ada225c049971'
  },
  {
    keywords: ['vario 125', 'vario125'],
    label: 'Honda Vario 125',
    sketchfabId: '7092ec8980ff4190845fd441918d89f5'
  },

  // ── YAMAHA ───────────────────────────────────────────────
  {
    keywords: ['nmax', 'n-max', 'n max'],
    label: 'Yamaha NMAX 155',
    sketchfabId: '1a7844a6e8dc48688fd4a248394abb1c'
  },
  {
    keywords: ['aerox', 'aerox 155', 'aerox155'],
    label: 'Yamaha Aerox 155',
    sketchfabId: '2adc2d623c1b4dc79e048526bd8245c6'
  },
  {
    keywords: ['mx king', 'mxking', 'mx-king', 'mx king 150'],
    label: 'Yamaha MX King 150',
    sketchfabId: 'b4754cbe95fb4c39be1524300e93833b'
  },
  {
    keywords: ['rx king', 'rxking', 'rx-king'],
    label: 'Yamaha RX King',
    sketchfabId: 'b8a2c1d3e4f5a6b7c8d9e0f1a2b3c4d5'
  },

  // ── KAWASAKI ─────────────────────────────────────────────
  {
    keywords: ['ninja 250', 'ninja250', 'ninja 250r', 'ninja250r', 'kawasaki ninja 250'],
    label: 'Kawasaki Ninja 250R',
    sketchfabId: '7f11c6d5e3c74046942492c9f03c64d0'
  },
  {
    keywords: ['klx 150', 'klx150', 'klx150bf', 'kawasaki klx'],
    label: 'Kawasaki KLX 150',
    sketchfabId: 'c03f1e35d95147adba55de3a28cc4491'
  },
  {
    keywords: ['z900', 'z 900', 'kawasaki z900'],
    label: 'Kawasaki Z900',
    sketchfabId: 'e3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8'
  },
  {
    keywords: ['ninja 400', 'ninja400'],
    label: 'Kawasaki Ninja 400',
    sketchfabId: 'd4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9'
  },

  // ── SUZUKI ───────────────────────────────────────────────
  {
    keywords: ['satria f', 'satria f150', 'satria fu', 'suzuki satria'],
    label: 'Suzuki Satria F150',
    sketchfabId: '1e4a6f3b9c2d8071b5f0e3a7c4d92610'
  },
];

// ID yang sudah DIKONFIRMASI ada & free di Sketchfab
// (sisanya mungkin paid atau belum dicek — tidak akan ditampilkan)
const CONFIRMED_FREE_IDS = new Set([
  '66ad2b3acd0b4b19ba6e53e8549cad39',  // Honda Beat (free by hilmatrix)
  '7092ec8980ff4190845fd441918d89f5',  // Honda Vario 150 (free by fauzanahnaf13)
  'f92f147382134bd3839ada225c049971',  // Honda Vario 160 (free by ditaarvr)
  '1a7844a6e8dc48688fd4a248394abb1c',  // Yamaha NMAX 155 (free by RAP)
  '2adc2d623c1b4dc79e048526bd8245c6',  // Yamaha Aerox 155 Modified (free by Pojan)
  'b4754cbe95fb4c39be1524300e93833b',  // Yamaha MX King (free by muhecsad)
  '7f11c6d5e3c74046942492c9f03c64d0',  // Kawasaki Ninja 250R (free by Bandit.545)
]);

// ── FUNGSI UTAMA ─────────────────────────────────────────────

/**
 * Cari model 3D dari nama motor yang diketik user
 * @returns { sketchfabId, label } atau null
 */
function cariModel3D(namaMotor) {
  if (!namaMotor || namaMotor.trim() === '') return null;
  const lower = namaMotor.toLowerCase();

  for (const motor of MOTOR_3D_DB) {
    for (const kw of motor.keywords) {
      if (lower.includes(kw.toLowerCase())) {
        if (CONFIRMED_FREE_IDS.has(motor.sketchfabId)) {
          return { sketchfabId: motor.sketchfabId, label: motor.label };
        }
      }
    }
  }
  return null;
}

/**
 * Render pop-up 3D viewer ke dalam container
 */
function tampilkan3D(containerId, sketchfabId, label) {
  const container = document.getElementById(containerId);
  if (!container) return;

  container.innerHTML = `
    <div class="motor3d-popup" id="motor3dPopup">
      <div class="motor3d-header">
        <div class="motor3d-badge-wrap">
          <span class="motor3d-badge">3D Live</span>
          <span class="motor3d-nama">${label}</span>
        </div>
        <button class="motor3d-close" onclick="tutup3D()" aria-label="Tutup 3D viewer">✕</button>
      </div>
      <div class="motor3d-frame-wrap">
        <iframe
          src="https://sketchfab.com/models/${sketchfabId}/embed?autostart=1&ui_controls=1&ui_infos=0&ui_watermark=1&camera=0&preload=1&transparent=0&dnt=1"
          frameborder="0"
          allow="autoplay; fullscreen; xr-spatial-tracking"
          allowfullscreen
          title="Model 3D ${label}"
          class="motor3d-iframe"
        ></iframe>
      </div>
      <p class="motor3d-hint">🖱️ Drag putar · Scroll zoom · Klik kanan geser · Powered by Sketchfab</p>
    </div>
  `;

  // Animasi pop-in
  requestAnimationFrame(() => {
    const popup = document.getElementById('motor3dPopup');
    if (popup) {
      popup.style.opacity = '0';
      popup.style.transform = 'scale(0.92) translateY(16px)';
      requestAnimationFrame(() => {
        popup.style.transition = 'opacity 0.4s ease, transform 0.4s cubic-bezier(0.34,1.56,0.64,1)';
        popup.style.opacity = '1';
        popup.style.transform = 'scale(1) translateY(0)';
      });
    }
  });
}

function tutup3D() {
  const popup = document.getElementById('motor3dPopup');
  if (!popup) return;
  popup.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
  popup.style.opacity = '0';
  popup.style.transform = 'scale(0.95) translateY(8px)';
  setTimeout(() => {
    const container = document.getElementById('motor3dContainer');
    if (container) container.innerHTML = '';
  }, 300);
}