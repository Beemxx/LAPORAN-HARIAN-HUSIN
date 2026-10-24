# Laporan Harian Lapangan: hosting + Google Drive sebagai database

Isi folder: `index.html`, `manifest.json`, `sw.js`, `icon-192.png`, `icon-512.png`. Semua harus satu folder. Tidak ada server atau build step.

## Cara kerja data
- **Google Drive = database utama.** Setiap laporan disimpan sebagai `data-TANGGAL.json` (berisi foto, aktivitas, cuaca) di folder **Laporan Harian S Walk**, ditambah file Excel harian.
- HP hanya menyimpan salinan (cache) di IndexedDB, jadi tetap bisa dipakai tanpa internet. Foto tidak lagi dibatasi 5 MB seperti sebelumnya.
- **Sinkron dua arah** per tanggal: yang lebih baru menang. Dibuka di HP lain, tekan **Sinkron** dan semua laporan muncul.
- Hapus laporan di satu HP ikut menghapus di Drive, dan HP lain akan ditanya saat sinkron berikutnya.
- Sinkron berjalan otomatis saat tekan **Simpan** dan saat aplikasi dibuka (jika sebelumnya sudah pernah login).

## 1. Hosting
**Netlify**: buka https://app.netlify.com/drop, seret folder ini, catat alamatnya (mis. `https://nama-kamu.netlify.app`).
**GitHub Pages**: buat repo, unggah kelima file ke root, Settings → Pages → Branch `main` / root. Alamat `https://username.github.io/nama-repo/`.
Alamat harus **https**.

## 2. Buat Client ID Google (sekali saja)
1. https://console.cloud.google.com → buat project baru.
2. APIs & Services → Library → **Google Drive API** → Enable.
3. OAuth consent screen → External → isi nama aplikasi dan email. Tambahkan emailmu di **Test users** (atau Publish app). Scope hanya `drive.file`.
4. Credentials → Create credentials → **OAuth client ID** → **Web application**.
   - **Authorized JavaScript origins**: alamat situs persis tanpa garis miring akhir. Untuk GitHub Pages hanya domain: `https://username.github.io`.
   - Salin **Client ID** (`...apps.googleusercontent.com`).

## 3. Pasang Client ID (pilih salah satu)
- **Paling praktis**: buka `index.html`, cari `const DEFAULT_CLIENT_ID='';`, tempel Client ID di antara tanda kutip, lalu hosting. Semua HP langsung tersambung.
- Atau buka sekali di tiap HP: `https://alamat-situsmu/?cid=CLIENT_ID_KAMU`
- Atau ketik di kolom **Google Client ID** pada kartu "Rekap tersimpan".

Lalu tekan **🔄 Sinkron** dan izinkan akses Drive.

## 4. Pasang di HP
Chrome (Android) / Safari (iPhone) → "Tambahkan ke layar utama".

## Catatan penting
- Aplikasi hanya melihat file yang dibuatnya sendiri (scope `drive.file`) dengan Client ID yang sama. **Jangan ganti Client ID** setelah ada data, karena folder lama tidak terlihat lagi dan folder baru akan dibuat. Folder lama dari claude.ai juga tidak terlihat; pindahkan manual kalau perlu.
- Login Google berlaku sekitar 1 jam; jendela izin bisa muncul lagi saat menyimpan atau sinkron.
- Laporan yang belum ditekan **Simpan** hanya berupa draf di HP dan belum masuk Drive.
- Di iPhone, login Google dari aplikasi yang dipasang di layar utama kadang diblokir (popup). Jika gagal, coba izinkan popup atau pakai Chrome/Safari biasa.
- Memperbarui aplikasi: ganti `index.html` di hosting. Halaman utama selalu mengambil versi terbaru saat ada internet.
