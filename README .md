# MotoTrack 🏍️

---

## Deskripsi Website

Jadi, MotoTrack ini adalah website buat bantu orang-orang yang sering lupa kapan harus servis motor. Simplenya tinggal masukin data motor kamu (odometer sekarang, kapan terakhir ganti oli, dll), terus nanti website-nya yang ngitung sendiri kapan kira-kira harus servis lagi.

Fitur yang ada di MotoTrack:

- **Kalkulator jadwal perawatan** — ngitung kapan harus ganti oli, servis berkala, ganti ban, sama cek aki. Ngitungnya berdasarkan km dan/atau hari.
- **Dashboard status** — nampilin kartu-kartu buat tiap jenis perawatan, ada progress bar-nya juga yang warnanya berubah (ijo, kuning, merah) tergantung seberapa deket jadwalnya.
- **Riwayat perawatan** — bisa catat setiap kali udah servis, lengkap sama tanggal, km, dan catatan tambahan kalau perlu.
- **3D viewer motor** — Kalau masukin nama motor yang dikenali sama sistem (misal Honda Vario atau Yamaha NMAX), bakal muncul model 3D motor-nya yang bisa diputar-putar.
- **Tips perawatan** — ada section panduan singkat tentang interval-interval perawatan.
- **Responsif** — bisa dipake di hp juga.

---

## Target Pengguna

Segmen
**Anak kuliahan / pelajar** 
**Commuter harian**
**Punya motor sport atau trail** 
**Orang awam / non-teknis** 

---

## Desain UI/UX

### Tema & Warna

| `--navy` | `#0A1628` | background utama |
| `--navy-2` | `#112240` | background card/section |
| `--orange` | `#E8621A` | aksen, tombol utama, highlight |
| `--cream` | `#F8F6F1` | teks utama |
| `--green` | `#2ECC71` | status aman |
| `--yellow` | `#F1C40F` | status perlu perhatian (70–89%) |
| `--red` | `#E74C3C` | status mendesak / harus segera servis (≥90%) |


### Font

- **Syne** — dipake buat heading, judul section, dan logo.
- **Inter** — buat teks biasa, isian form, dan informasi kecil-kecil.


### Komponen-komponen UI

**Hero Section**
Bagian paling atas website. Layout-nya dua kolom — kiri ada teks headline sama tombol CTA, kanan ada animasi gauge (kayak speedometer) yang nunjukkin simulasi kondisi oli. Di bawahnya ada 3 angka stat kecil. Tujuannya biar orang yang baru masuk langsung paham

**Form pendaftaran motor**
Input form-nya disusun grid 2 kolom. Tiap field ada label yang jelas dan placeholder contoh yang realistis (Co: `Honda Vario 125 - N 1234 AB`).

**Kartu dashboard**
Setiap jenis perawatan (oli, servis, ban, aki) punya kartu sendiri:
- progress bar yang warnanya dinamis sesuai persentase
- badge status teks (`Aman`, `Segera`, `Mendesak!`)
- info kapan waktu ganti (dalam km dan/atau tanggal)

**Riwayat / timeline**
Tampilannya adalah timeline vertikal ada titik-titik penghubungnya. Diurutin dari yang paling baru, dan bisa dihapus per item.

**Modal catat perawatan**
Pop-up form buat nyimpen riwayat servis.

**Toast notification**
Notifikasi kecil yang muncul sebentar di pojok bawah (3 detik) buat konfirmasi Co:"✅ Jadwal berhasil dihitung!" atau warning.

**Navbar sticky + glassmorphism**
Navbar-nya nempel di atas pas di-scroll. Dengan efek blur transparan. Link di navbar juga otomatis "aktif" (berubah warna) sesuai section yang lagi keliatan di layar.

**3D Viewer**
Kalau nama motor yang diketik cocok sama database-nya (ada sekitar 7 model yang dikonfirmasi), bakal muncul iframe Sketchfab dengan model 3D motor yang bisa diputar, dizoom, digeser.

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

## Motor yang Ada Model 3D-nya

| Honda | Beat, Vario 125, Vario 150, Vario 160 |
| Yamaha | NMAX 155, Aerox 155, MX King 150 |
| Kawasaki | Ninja 250R |
