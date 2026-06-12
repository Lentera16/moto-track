# MotoTrack 🏍️

> jaga motormu, jaga perjalananmu.

---

## Deskripsi Website

Jadi, MotoTrack ini basically website buat bantu orang-orang yang sering lupa kapan harus servis motor. Idenya simpel sih — kamu tinggal masukin data motor kamu (odometer sekarang, kapan terakhir ganti oli, dll), terus nanti website-nya yang ngitung sendiri kapan kira-kira harus servis lagi.

Yang bikin enak, gak perlu daftar akun atau install apapun. Buka browser, langsung bisa pake. Datanya disimpen di localStorage jadi kalau kamu tutup tab terus buka lagi, datanya masih ada.

Fitur yang ada di MotoTrack:

- **Kalkulator jadwal perawatan** — ngitung kapan harus ganti oli, servis berkala, ganti ban, sama cek aki. Ngitungnya berdasarkan km dan/atau hari, mana yang duluan.
- **Dashboard status** — nampilin kartu-kartu buat tiap jenis perawatan, ada progress bar-nya juga yang warnanya berubah (ijo, kuning, merah) tergantung udah seberapa deket jadwalnya.
- **Riwayat perawatan** — bisa catat setiap kali udah servis, lengkap sama tanggal, km, dan catatan tambahan kalau perlu.
- **3D viewer motor** — ini fitur bonusnya, kalau nama motor yang kamu masukin dikenali sama sistem (misal Honda Vario atau Yamaha NMAX), bakal muncul model 3D motor-nya yang bisa diputar-putar. Lumayan keren sih.
- **Tips perawatan** — ada section panduan singkat tentang interval-interval perawatan yang sering orang gak tau.
- **Responsif** — bisa dipake di hp juga, ada hamburger menu-nya.

---

## Target Pengguna

Sebenernya website ini ditujukan buat siapa aja yang punya motor di Indonesia, tapi lebih spesifiknya:

| Segmen | Kenapa butuh MotoTrack |
|--------|------------------------|
| **Anak kuliahan / pelajar** | Banyak yang baru pertama punya motor sendiri, jadi belum tau interval servis yang bener. Sering skip ganti oli karena lupa atau gak ngerasa perlu. |
| **Commuter harian** | Yang tiap hari naik motor ke kantor/kampus, motornya dipakai intensif jadi jadwal servisnya penting banget tapi sering kelewat karena sibuk. |
| **Punya motor sport atau trail** | Kayak Ninja 250, KLX, MX King — biasanya orangnya lebih aware soal perawatan tapi butuh catatan yang rapi buat tracking km-nya. |
| **Orang awam / non-teknis** | Yang gak ngerti mesin sama sekali, pengen reminder simpel tanpa harus buka-buka manual book atau nanya mekanik terus. |

Semua tulisan di website ini pake Bahasa Indonesia dan format tanggalnya juga lokal (contoh: "10 Jun 2025"), jadi emang dirancang khusus buat pengguna Indonesia.

---

## Desain UI/UX

### Tema & Warna

Warna utamanya dark navy, kesannya kayak dashboard mobil/motor malem-malem. Dipilih warna ini biar keliatan lebih "teknikal" dan premium, gak kayak website perawatan motor biasanya yang sering putih-putih polos.

| Variabel CSS | Kode Warna | Dipake Buat |
|---|---|---|
| `--navy` | `#0A1628` | background utama |
| `--navy-2` | `#112240` | background card/section |
| `--orange` | `#E8621A` | aksen, tombol utama, highlight |
| `--cream` | `#F8F6F1` | teks utama |
| `--green` | `#2ECC71` | status aman |
| `--yellow` | `#F1C40F` | status perlu perhatian (70–89%) |
| `--red` | `#E74C3C` | status mendesak / harus segera servis (≥90%) |

Warna oranye (`#E8621A`) dipake sebagai warna aksen utama — keluar di tombol CTA, logo, dan highlight teks penting. Kontrasnya bagus banget sama background navy-nya.

### Font

- **Syne** — dipake buat heading, judul section, dan logo. Kesannya modern dan agak tegas, cocok buat tema otomotif.
- **Inter** — buat teks biasa, isian form, dan informasi kecil-kecil. Ini font yang gampang banget dibaca di layar, makanya banyak dipake.

Dua-duanya diambil dari Google Fonts.

### Komponen-komponen UI

**Hero Section**
Bagian paling atas website. Layout-nya dua kolom — kiri ada teks headline sama tombol CTA, kanan ada animasi gauge (kayak speedometer) yang nunjukkin simulasi kondisi oli 72%. Di bawahnya ada 3 angka stat kecil. Tujuannya biar orang yang baru masuk langsung nangkep "oh ini buat ngecek kondisi motor."

**Form pendaftaran motor**
Input form-nya disusun grid 2 kolom. Tiap field ada label yang jelas dan placeholder contoh yang realistis (misal: `Honda Vario 125 - N 1234 AB`). Ini penting biar user gak bingung harus nulis apa.

**Kartu dashboard**
Ini bagian inti website-nya. Setiap jenis perawatan (oli, servis, ban, aki) punya kartu sendiri. Di tiap kartu ada:
- progress bar yang warnanya dinamis sesuai persentase
- badge status teks (`Aman`, `Segera`, `Mendesak!`)
- info kapan due-nya (dalam km dan/atau tanggal)

**Riwayat / timeline**
Tampilannya kayak timeline vertikal ada titik-titik penghubungnya. Diurutin dari yang paling baru, dan bisa dihapus per item kalau salah catat.

**Modal catat perawatan**
Pop-up form buat nyimpen riwayat servis. Background-nya semi-transparan (overlay gelap), bisa ditutup dengan klik di luar area modal-nya. Simple tapi fungsional.

**Toast notification**
Notifikasi kecil yang muncul sebentar di pojok bawah (3 detik) buat konfirmasi kayak "✅ Jadwal berhasil dihitung!" atau warning kalau ada input yang belum diisi.

**Navbar sticky + glassmorphism**
Navbar-nya nempel di atas pas di-scroll (`position: sticky`). Ada efek blur transparan (`backdrop-filter: blur(12px)`) biar keliatan kayak kaca. Link di navbar juga otomatis "aktif" (berubah warna) sesuai section yang lagi keliatan di layar, pake IntersectionObserver.

**3D Viewer**
Kalau nama motor yang diketik cocok sama database-nya (ada sekitar 7 model yang dikonfirmasi), bakal muncul iframe Sketchfab dengan model 3D motor yang bisa diputar, dizoom, digeser. Animasi munculnya pake efek spring (scale + translateY) jadi keliatan smooth.

### Prinsip UX yang Diterapkan

1. **Gak perlu akun** — langsung buka, langsung pake. Ini ngurangin friction yang paling umum bikin orang males coba aplikasi baru.
2. **Data tetap ada** — pake localStorage, jadi data motor tersimpan meskipun browser ditutup.
3. **Status langsung keliatan** — warna merah/kuning/hijau langsung ngasih tau urgency tanpa harus baca-baca dulu.
4. **Mobile friendly** — layout collapse jadi 1 kolom di layar kecil, navbar punya hamburger menu, tombol-tombolnya cukup besar buat di-tap.
5. **Smooth** — semua transisi dan scroll-nya halus, animasi konsisten 0.2s, gak ada yang "jumping" tiba-tiba.

---

## Struktur File

```
mototrack/
├── index.html      # semua struktur HTML dan section-section-nya
├── style.css       # styling lengkap, variabel warna, responsive
├── app.js          # logika utama: hitung jadwal, dashboard, riwayat, localStorage
└── motor3d.js      # database motor + logika embed Sketchfab 3D
```

---

## Cara Jalanin

Gak perlu setup apapun. Tinggal:

```bash
# ekstrak zip / clone repo
cd mototrack

# buka langsung di browser
open index.html
```

Atau tinggal double-click file `index.html`-nya aja. Font dan library-nya load dari CDN jadi pastiin ada koneksi internet ya biar tampilannya bener.

---

## Motor yang Ada Model 3D-nya

| Merek | Model |
|-------|-------|
| Honda | Beat, Vario 125, Vario 150, Vario 160 |
| Yamaha | NMAX 155, Aerox 155, MX King 150 |
| Kawasaki | Ninja 250R |

Motor lain tetap bisa dipake normal, cuma gak ada 3D viewer-nya aja.

---

*© 2025 MotoTrack — dibuat buat pengendara Indonesia* 🇮🇩
