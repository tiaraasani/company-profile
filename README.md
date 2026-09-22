# Suitmedia Company Profile (Redesign)

Situs company profile yang dibangun sebagai tugas **Purwadhika Code Challenge 2**. Proyek ini
merancang ulang situs [suitmedia.com](https://suitmedia.com) dengan struktur dan penamaan
menu yang sama (Expertises, Industries, Work, Insights, About, Contact), lalu melengkapinya
dengan autentikasi, blog berbasis Markdown di Backendless, serta prerender setiap halaman
menjadi HTML statis agar skor PageSpeed maksimal.

**Demo:** <https://suitmedia-profile.vercel.app>

> Proyek pembelajaran, tidak berafiliasi dengan atau didukung oleh Suitmedia. Nama, logo,
> dan materi referensi adalah milik pemegang haknya masing-masing. Alamat email dan formulir
> pada situs ini hanya placeholder.

## Daftar Isi

- [Fitur Utama](#fitur-utama)
- [Halaman](#halaman)
- [Teknologi](#teknologi)
- [Menjalankan Secara Lokal](#menjalankan-secara-lokal)
- [Arsitektur](#arsitektur)
- [Konfigurasi Backendless](#konfigurasi-backendless)
- [Akun Peninjau](#akun-peninjau)
- [Keamanan](#keamanan)
- [Skor Lighthouse](#skor-lighthouse)
- [Deploy ke Vercel](#deploy-ke-vercel)

## Fitur Utama

- **Sebelas halaman** yang seluruhnya responsif, dengan mode terang dan gelap.
- **Blog Markdown**: editor dengan tab tulis/pratinjau, tag, slug otomatis, dan draf yang
  tersimpan di browser hingga artikel diterbitkan.
- **Autentikasi Backendless**: halaman tulis artikel hanya dapat diakses setelah masuk;
  pengunjung anonim dialihkan ke halaman login dan dikembalikan setelah berhasil masuk.
- **Halaman tim dinamis** dari [randomuser.me](https://randomuser.me), dengan pratinjau
  empat anggota di halaman About.
- **Formulir kontak** yang tersimpan ke tabel Backendless.
- **Prerender per rute** sehingga konten setiap halaman sudah ada di HTML, lengkap dengan
  canonical, Open Graph, `sitemap.xml`, dan `robots.txt`.
- **Aksesibilitas**: skip link, pengelolaan fokus saat berpindah halaman, label dan pesan
  kesalahan formulir yang diumumkan ke pembaca layar, kontras warna sesuai WCAG AA.

## Halaman

| Rute | Halaman | Sumber data | Prerender | Akses |
|---|---|---|---|---|
| `/` | Beranda | statis (`src/data`) | ya | publik |
| `/services` | Expertises | statis, 4 pilar × 4 layanan | ya | publik |
| `/industries` | Industries | statis, 18 sektor | ya | publik |
| `/work` | Work (studi kasus) | statis, 12 studi kasus | ya | publik |
| `/blog` | Insights (daftar artikel) | Backendless `Blog`, dimuat per halaman ("Load More") | ya, divalidasi ulang saat dimuat | publik |
| `/blog/<slug>` | Artikel (Markdown) | Backendless `Blog` | ya untuk artikel yang ada saat build; selebihnya dirender di klien | publik |
| `/about` | About | statis + 4 anggota tim pertama dari randomuser.me | ya (skeleton untuk pratinjau tim) | publik |
| `/teams` | Team | randomuser.me (seed tetap, cache di sessionStorage) | ya (skeleton) | publik |
| `/contact` | Contact | `POST /data/Inquiries` | ya | publik |
| `/blog/new` | Tulis artikel | `POST /data/Blog` | tidak | **wajib login** |
| `/login` | Masuk | `POST /users/login` | ya | pengunjung anonim (pengguna yang sudah masuk dialihkan) |
| `*` | 404 | – | tidak | publik |

## Teknologi

| Lapisan | Pilihan |
|---|---|
| UI | React 19, TypeScript, Vite 8 |
| Styling | Tailwind CSS v4, shadcn/ui (Radix UI), lucide-react |
| Routing | react-router 8 |
| Formulir | react-hook-form + zod 4 |
| Konten | react-markdown + remark-gfm |
| Backend | Backendless REST API (autentikasi, tabel `Blog` dan `Inquiries`) |
| Kualitas | ESLint (react-hooks v7), oxlint (jsx-a11y), TypeScript strict |
| Hosting | Vercel (build statis + rewrite ke `app.html`) |

## Menjalankan Secara Lokal

Prasyarat: Node.js 22 atau lebih baru dan sebuah aplikasi Backendless (lihat
[Konfigurasi Backendless](#konfigurasi-backendless)).

```powershell
npm install
Copy-Item .env.example .env.local     # isi VITE_BACKENDLESS_API_URL
npm run dev                            # http://localhost:5173
```

Build produksi beserta pratinjau yang meniru perilaku Vercel (halaman hasil prerender dan
fallback `app.html`):

```powershell
npm run build
npm run preview                        # http://localhost:4173
```

| Skrip | Keterangan |
|---|---|
| `npm run dev` | Server pengembangan Vite |
| `npm run build` | `tsc -b`, build klien, build SSR, lalu `scripts/prerender.mjs` menulis satu berkas HTML per rute (dan per artikel yang terbit) beserta `dist/app.html` |
| `npm run preview` | Menyajikan `dist` seperti Vercel (`/about` → `about/index.html`, URL tak dikenal → `app.html`) |
| `npm run typecheck` | `tsc -p tsconfig.app.json --noEmit` |
| `npm run lint` | ESLint |
| `npm run lint:a11y` | oxlint dengan plugin jsx-a11y |
| `npm run images` | Membuat ulang ilustrasi hero, gambar Open Graph, dan ikon |

Isi `.env.local` (tidak ikut ke Git):

```
VITE_BACKENDLESS_API_URL=https://<subdomain>.backendless.app/api
VITE_SITE_URL=                          # URL produksi; mengaktifkan canonical, og:url, dan sitemap
```

## Arsitektur

### Prerender dan performa

- **Prerender per rute** (`src/entry-server.tsx` + `scripts/prerender.mjs`): HTML setiap
  halaman sudah ada di respons server, sehingga elemen LCP adalah `h1` statis. Data blog yang
  diambil saat build disematkan sebagai `<script id="__RESOURCES__" type="application/json">`
  dan dimuat ke store sebelum hydration, sehingga markup server dan klien identik. Daftar
  artikel divalidasi ulang setelah hydration agar artikel yang terbit setelah deploy tetap
  muncul.
- **URL khusus klien** (`/blog/new`, artikel yang lebih baru dari build, 404) dilayani oleh
  `dist/app.html` melalui rewrite di `vercel.json`. `main.tsx` memuat chunk halaman sebelum
  render pertama (`src/lib/lazyWithPreload.ts`) sehingga tidak terjadi pergeseran layout dari
  skeleton ke halaman.
- **Skrip aplikasi ditunda**: modul utama dan preload-nya disisipkan setelah frame pertama
  (`vite/defer-app-script.ts`), sehingga JavaScript tidak berada di jalur LCP.
- **Pembagian chunk**: `vendor` (router, Radix, lucide), `forms` (react-hook-form + zod,
  hanya untuk halaman login dan editor), `MarkdownRenderer` (react-markdown + remark-gfm,
  hanya untuk artikel dan pratinjau).
- **Font**: Plus Jakarta Sans di-host sendiri dengan `font-display: optional` dan fallback
  yang metriknya disesuaikan.

### Manajemen state

| State | Lokasi | Mekanisme |
|---|---|---|
| Sesi autentikasi (`status`, `user`, `login`, `logout`) | `src/features/auth/AuthProvider.tsx` | Context; sesi di localStorage `cp:auth` dibaca lewat `useSyncExternalStore`; token divalidasi sekali per token; respons `3064` menghapus sesi |
| Proteksi rute | `src/features/auth/ProtectedRoute.tsx` | `restoring` → skeleton, `anonymous` → `<Navigate state={{ from }}>` |
| Tema | `src/context/ThemeProvider.tsx` | Context + localStorage `cp:theme`, skrip pra-render di `index.html` |
| Data remote (tim, daftar artikel, satu artikel) | `src/lib/resource.ts` | Store `useResource(key, fetcher)`: `useSyncExternalStore`, diisi dari JSON hasil build, cache sessionStorage opsional, validasi ulang, `reload()` |
| Draf artikel | `src/features/blog/useBlogDraft.ts` | `watch` react-hook-form → localStorage `cp:blog-draft` dengan debounce; banner pulihkan/buang draf |
| Formulir | `LoginForm.tsx`, `BlogForm.tsx`, `InquiryForm.tsx` | react-hook-form + zod 4 (`z.input`/`z.output` untuk transformasi tag), komponen `Field` shadcn |
| State di URL | `BlogListPage.tsx`, `LoginPage.tsx` | `useSearchParams` (`?tag=`), `location.state.from` |
| Halaman "Load More" | `BlogListPage.tsx` | `useState` per tag; halaman pertama dari store, halaman berikutnya ditambahkan dan dideduplikasi |
| UI lokal | Header, carousel, tab | `useState`, penyesuaian state saat render untuk perubahan rute |

### Struktur direktori

```
src/
├─ components/       # layout (Header, Footer, PageHero), komponen bersama, primitif shadcn/ui
├─ context/          # ThemeProvider
├─ data/             # konten statis: perusahaan, layanan, industri, studi kasus, testimoni, rute
├─ features/
│  ├─ auth/          # AuthProvider, LoginForm, ProtectedRoute, klien autentikasi
│  ├─ blog/          # API, skema, BlogForm, BlogCard, MarkdownRenderer, draf
│  ├─ contact/       # InquiryForm dan API-nya
│  └─ team/          # teamApi (randomuser.me), TeamGrid, TeamCard
├─ hooks/            # useSeo, useInterval, useDocumentVisible, usePrefersReducedMotion
├─ lib/              # backendless.ts (klien REST), resource.ts (store data async), utilitas
├─ routes/           # satu komponen per halaman
├─ styles/           # theme.css (token desain), fonts.css, markdown.css
├─ entry-server.tsx  # render SSR yang dipakai skrip prerender
└─ main.tsx          # hydration di browser
scripts/             # prerender.mjs, check-csp.mjs, generate-images.mjs
vite/                # plugin: site-metadata, defer-app-script, preview-fallback, vercel-headers
public/              # font, gambar, ikon, og-image
vercel.json          # rewrite ke app.html, header keamanan dan cache
```

## Konfigurasi Backendless

Aplikasi hanya memakai REST API tanpa SDK: `src/lib/backendless.ts` adalah pembungkus
`fetch` ringkas yang menambahkan header `user-token` dan memetakan kode kesalahan (`3003`
kredensial salah, `3036` akun terkunci, `3064` token kedaluwarsa → keluar otomatis).

### Tabel

**Users** (bawaan). Buat akun melalui Console → Data → Users, atau lewat
`POST /users/register` (`email`, `password`, `name`). Fitur login harus aktif di
Users → Login; konfirmasi email dinonaktifkan.

**Blog** (dibuat otomatis lewat dynamic schema pada penulisan pertama):

| Kolom | Tipe | Keterangan |
|---|---|---|
| `title` | STRING | 8–120 karakter |
| `slug` | STRING | Pengenal di URL; centang **Unique** dan **Indexed** di editor skema |
| `excerpt` | STRING | Maksimal 200 karakter |
| `content` | **TEXT** | Isi Markdown. Dynamic schema membuatnya sebagai STRING(500); ubah ke TEXT di Data → Blog → Schema agar artikel panjang tidak gagal dengan HTTP 413 |
| `tags` | STRING | Disimpan sebagai `,tag-satu,tag-dua,` sehingga `LIKE '%,tag,%'` mencocokkan tag utuh |
| `authorName` | STRING | Disalin dari `name` pengguna saat menerbitkan |
| `published` | BOOLEAN | Kueri publik hanya mengambil `published=true` |
| `ownerId`, `created`, `updated`, `objectId` | sistem | Diisi oleh Backendless |

**Inquiries** (dibuat otomatis oleh pengiriman formulir kontak pertama): `subject`, `name`,
`company`, `email`, `phone`, `country`, `message` (STRING, dibatasi 500 karakter oleh
formulir), dan `source`. Pengunjung hanya boleh membuat baris; tidak ada yang boleh
membacanya dari browser.

Nonaktifkan dynamic schema (Manage → App Settings) setelah semua kolom terbentuk.

### Izin akses (Data → tabel → tab Permissions)

Centang hijau berarti diizinkan, silang merah berarti ditolak, abu-abu berarti mengikuti
bawaan global yang mengizinkan segalanya. Karena itu setiap operasi yang tidak dibutuhkan
aplikasi harus diberi silang merah, bukan dibiarkan abu-abu. Atur ketiga peran pengguna;
biarkan peran API key (RestUser, JSUser, dan seterusnya) tetap abu-abu.

| Tabel | Peran | RETRIEVE (Find) | CREATE | UPDATE | REMOVE |
|---|---|---|---|---|---|
| Blog | NotAuthenticatedUser, GuestUser | ✅ | ❌ | ❌ | ❌ |
| Blog | AuthenticatedUser | ✅ | ✅ | ❌ | ❌ |
| Inquiries | NotAuthenticatedUser, GuestUser, AuthenticatedUser | ❌ | ✅ | ❌ | ❌ |
| Users | NotAuthenticatedUser, GuestUser, AuthenticatedUser | ❌ | ❌ | ❌ | ❌ |

Aplikasi tidak pernah menyunting atau menghapus artikel, sehingga UPDATE dan REMOVE ditolak
untuk semua peran. Jika fitur sunting/hapus ditambahkan, buka izinnya melalui tab
**Owner Policy** (hanya pemilik baris), bukan melalui baris AuthenticatedUser. Menolak
RETRIEVE pada `Users` mencegah pengunjung mendaftar akun yang ada; menolak UPDATE/REMOVE
mencegah siapa pun mengubah kata sandi atau email akun lain. Login dan logout tetap
berfungsi karena keduanya endpoint terpisah.

Pengaturan lain di console:

- **Users → Registration**: nonaktifkan pendaftaran publik. Situs tidak memiliki halaman
  daftar, sehingga `POST /users/register` yang terbuka hanya akan memberi akses tulis kepada
  orang asing. Buat akun melalui Data → Users.
- **Users → Login**: aktifkan penguncian akun (misalnya 5 kali gagal, 15 menit; aplikasi
  sudah menampilkan pesan untuk kode 3036) dan atur batas waktu sesi.
- **Data → Blog → Schema**: ukuran dan validator agar server menegakkan aturan yang sama
  dengan formulir: `title` STRING(120), `excerpt` STRING(200), `authorName` STRING(80),
  `content` TEXT, `slug` STRING(80) dengan validator `^[a-z0-9]+(-[a-z0-9]+)*$` dan
  **Unique**, `tags` dengan validator `^(,[a-z0-9-]{2,20}){0,5},?$`.

Verifikasi dari PowerShell (isi kredensial akun peninjau yang Anda terima):

```powershell
$base = 'https://<subdomain>.backendless.app/api'
curl.exe -s -o NUL -w '%{http_code}' -X POST "$base/users/login" -H 'Content-Type: application/json' -d '{\"login\":\"<email>\",\"password\":\"<password>\"}'   # 200
curl.exe -s -o NUL -w '%{http_code}' "$base/data/Users"                                                     # 403
curl.exe -s -o NUL -w '%{http_code}' -X POST "$base/data/Blog" -H 'Content-Type: application/json' -d '{\"title\":\"x\"}'   # 403 (tanpa token)
curl.exe -s -o NUL -w '%{http_code}' -X POST "$base/users/register" -H 'Content-Type: application/json' -d '{\"email\":\"a@b.co\",\"password\":\"x\"}'   # bukan 200
curl.exe -s "$base/data/Blog?where=published%3Dtrue&pageSize=1"                                              # satu artikel
```

## Akun Peninjau

Pendaftaran publik dinonaktifkan, sehingga tersedia satu akun peninjau di tabel `Users`.
Kredensialnya disampaikan secara terpisah bersama pengumpulan tugas dan tidak disimpan di
repositori maupun ditampilkan di situs. Alur pengujian yang disarankan:

1. Dalam keadaan belum masuk, buka **Write a post** di header → dialihkan ke `/login`.
2. Masukkan kata sandi yang salah → muncul peringatan inline ("Incorrect email or password")
   dan fokus berpindah ke peringatan tersebut.
3. Masuk → dikembalikan ke `/blog/new`. Muat ulang halaman: tetap masuk tanpa kedipan (token
   tersimpan divalidasi melalui `GET /users/isvalidusertoken`).
4. Terbitkan artikel (Markdown, tab Write/Preview, tag) → dialihkan ke `/blog/<slug>` dengan
   pemberitahuan "published"; artikel muncul paling atas di `/blog`; baris di Backendless
   memiliki `ownerId`.
5. Ketik di editor lalu muat ulang: draf dipulihkan (localStorage `cp:blog-draft`).
6. Saring berdasarkan tag di `/blog` (`?tag=…`), buka slug yang tidak ada → 404 inline.
7. Keluar dari header → **Write a post** kembali mengalihkan ke halaman login.

## Keamanan

- **Header respons** didefinisikan di `vercel.json` dan juga diterapkan oleh `npm run preview`:
  Content-Security-Policy (`script-src 'self'` ditambah satu hash SHA-256 per skrip inline,
  `frame-ancestors 'none'`, `connect-src` dibatasi ke Backendless dan randomuser.me),
  `X-Frame-Options`, `Permissions-Policy`, `Strict-Transport-Security`,
  `X-Content-Type-Options`, dan `Referrer-Policy`. `Cross-Origin-Opener-Policy: same-origin`
  sempat dicoba lalu dilepas: header ini memaksa pergantian browsing-context group saat
  navigasi, menaikkan TBT 50–120 ms di Lighthouse dan membuat sekitar satu dari lima
  pengukuran gagal dengan `NO_NAVSTART`, padahal situs tidak membuka popup sama sekali.
- **Skrip inline dan CSP**: skrip tema di `index.html` dan pemuat aplikasi di
  `vite/defer-app-script.ts` adalah satu-satunya skrip inline. `scripts/check-csp.mjs`
  dijalankan di akhir `npm run build` dan gagal sambil menampilkan hash baru bila salah
  satunya berubah; salin hash tersebut ke direktif `script-src`. Gambar Markdown boleh
  berasal dari host `https:` mana pun; permintaan data hanya boleh ke Backendless
  (subdomain `*.backendless.app` atau `api.backendless.com`) dan randomuser.me.
- **Klausa where** dibangun dengan `quote()` (kutip tunggal digandakan, gaya SQL-92) dan
  hanya setelah nilainya lolos daftar putih (`SLUG_PATTERN`, `TAG_PATTERN` di
  `src/features/blog/slugify.ts`), sehingga masukan dari URL tidak pernah sampai ke
  Backendless tanpa pemeriksaan.
- **Data saat build**: `scripts/prerender.mjs` hanya melakukan prerender untuk artikel yang
  slug-nya cocok dengan `SLUG_PATTERN`, meng-escape slug sebelum menulisnya ke HTML, dan
  menolak menulis di luar `dist/`, sehingga baris data yang berbahaya tidak dapat mengubah
  halaman lain selama build.
- **Akun peninjau**: kredensialnya dibagikan secara privat dan tidak pernah di-commit atau
  dirender. Pendaftaran dinonaktifkan di console Backendless dan percobaan login yang gagal
  berulang kali mengunci akun, sehingga formulir login tidak dapat dipakai untuk menebak
  akun.
- **Sesi**: token Backendless disimpan di localStorage (`cp:auth`) dan hanya dikirim ke URL
  API yang dikonfigurasi; `GET /users/logout` membatalkannya di sisi server dan draf artikel
  dihapus saat keluar.

## Skor Lighthouse

Diukur dengan Lighthouse 13.5 (Chrome headless) terhadap URL produksi
<https://suitmedia-profile.vercel.app> pada 22 September 2026. Kolom skor berurutan:
Performance / Accessibility / Best Practices / SEO.

| Rute | Mobile | LCP (mobile) | Desktop |
|---|---|---|---|
| `/` | 100 / 100 / 100 / 100 | 1,3 s | 100 / 100 / 100 / 100 |
| `/about` | 99 / 100 / 100 / 100 | 2,0 s | 100 / 100 / 100 / 100 |
| `/services` | 99 / 100 / 100 / 100 | 2,0 s | 100 / 100 / 100 / 100 |
| `/industries` | 99 / 100 / 100 / 100 | 1,8 s | 100 / 100 / 100 / 100 |
| `/work` | 99 / 100 / 100 / 100 | 2,0 s | 100 / 100 / 100 / 100 |
| `/blog` | 99 / 100 / 100 / 100 | 2,0 s | 100 / 100 / 100 / 100 |
| `/blog/welcome-to-the-suitmedia-blog` | 100 / 100 / 100 / 100 | 1,5 s | 100 / 100 / 100 / 100 |
| `/teams` | 99 / 100 / 100 / 100 | 2,0 s | 100 / 100 / 100 / 100 |
| `/contact` | 99 / 100 / 100 / 100 | 2,0 s | 100 / 100 / 100 / 100 |
| `/login` | 100 / 100 / 100 / 100 | 1,2 s | 100 / 100 / 100 / 100 |
| `/blog/new` (dialihkan ke login) | 99 / 100 / 100 / 100 | 2,0 s | 100 / 100 / 100 / 100 |

Cumulative Layout Shift bernilai 0 di semua halaman, pada mobile maupun desktop.

## Deploy ke Vercel

1. Impor repositori ini dengan preset **Vite** dan biarkan **Root Directory** kosong,
   karena aplikasi berada di akar repositori.
2. Isi environment variable `VITE_BACKENDLESS_API_URL` dan
   `VITE_SITE_URL=https://<nama-proyek>.vercel.app`.
3. `vercel.json` sudah mengalihkan URL yang tidak dikenal ke `/app.html` dan mengatur header
   cache jangka panjang untuk `/assets`, `/fonts`, dan `/images`.
4. Lakukan pengukuran pada alias produksi, karena preview deployment menyisipkan toolbar
   Vercel dan `noindex`.

Artikel yang terbit setelah deploy terakhir dilayani dari sisi klien hingga build berikutnya;
Deploy Hook Vercel yang dipicu dari console (atau deploy ulang manual) akan
mem-prerender-nya.
