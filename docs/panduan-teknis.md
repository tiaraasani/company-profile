# Panduan teknis

Dokumen ini melengkapi [README](../README.md) dengan detail arsitektur, sumber data setiap halaman, pengaturan Backendless, akun peninjau, keamanan, skor Lighthouse, dan langkah deploy.

## Skrip npm

| Skrip | Fungsi |
|---|---|
| `npm run dev` | Menjalankan server pengembangan Vite di `http://localhost:5173` |
| `npm run build` | Type-check, build klien, build SSR, lalu `scripts/prerender.mjs` menulis satu berkas HTML per rute (dan per artikel yang terbit) beserta `dist/app.html`; diakhiri verifikasi hash CSP (`scripts/check-csp.mjs`) |
| `npm run preview` | Menyajikan `dist` di `http://localhost:4173` seperti Vercel: `/about` → `about/index.html`, URL tak dikenal → `app.html`, beserta header keamanan dari `vercel.json`; gunakan ini untuk audit Lighthouse |
| `npm run typecheck` | `tsc -p tsconfig.app.json --noEmit` |
| `npm run lint` | ESLint (TypeScript, React Hooks, Fast Refresh) |
| `npm run lint:a11y` | oxlint dengan plugin jsx-a11y |
| `npm run images` | Membuat ulang ilustrasi hero, `public/og-image.png`, dan `public/apple-touch-icon.png` (sharp) |

## Struktur proyek

```
src/
  components/
    layout/        Header, Footer, PageHero, Section, SectionHeading, ThemeToggle, SkipLink
    shared/        Kartu layanan, carousel testimoni, CTA, skeleton, error state
    ui/            Komponen shadcn/ui
  context/         Tema (context + localStorage)
  data/            Konten statis: perusahaan, layanan, industri, studi kasus, testimoni, rute
  features/
    auth/          AuthProvider, LoginForm, ProtectedRoute, klien autentikasi
    blog/          API, skema, BlogForm, BlogCard, MarkdownRenderer, draf
    contact/       InquiryForm beserta skema dan API
    team/          teamApi (randomuser.me), TeamGrid, TeamCard
  hooks/           useSeo, useInterval, useDocumentVisible, usePrefersReducedMotion
  lib/             backendless.ts (klien REST), resource.ts (store data asinkron), utilitas
  routes/          Satu komponen per halaman
  styles/          Token warna (theme.css), deklarasi font, gaya Markdown
  entry-server.tsx Render SSR yang dipakai skrip prarender
  main.tsx         Hidrasi di browser
scripts/           prerender, check-csp, generate-images
vite/              Plugin build: site-metadata, defer-app-script, preview-fallback, vercel-headers
public/            Aset statis: font, gambar, ikon, og-image
vercel.json        Rewrite ke app.html, header keamanan dan cache
```

## Halaman dan sumber data

| Rute | Halaman | Sumber data | Prarender | Akses |
|---|---|---|---|---|
| `/` | Beranda | statis (`src/data`) | ya | publik |
| `/services` | Expertises | statis, 4 pilar × 4 layanan | ya | publik |
| `/industries` | Industries | statis, 18 sektor | ya | publik |
| `/work` | Work (studi kasus) | statis, 12 studi kasus | ya | publik |
| `/blog` | Insights (daftar artikel) | tabel Backendless `Blog`, dimuat bertahap ("Load More") | ya, divalidasi ulang saat dimuat | publik |
| `/blog/<slug>` | Artikel (Markdown) | tabel Backendless `Blog` | ya untuk artikel yang ada saat build; selebihnya dirender di klien | publik |
| `/about` | About | statis + 4 anggota tim pertama dari randomuser.me | ya (skeleton untuk pratinjau tim) | publik |
| `/teams` | Team | randomuser.me (seed tetap, cache di sessionStorage) | ya (skeleton) | publik |
| `/contact` | Contact | `POST /data/Inquiries` | ya | publik |
| `/blog/new` | Tulis artikel | `POST /data/Blog` | tidak | wajib login |
| `/login` | Masuk | `POST /users/login` | ya | pengunjung anonim; pengguna yang sudah masuk dialihkan |
| `*` | 404 | — | tidak | publik |

## Arsitektur dan performa

- **Prarender per rute.** `npm run build` menjalankan `vite build --ssr src/entry-server.tsx`, lalu `scripts/prerender.mjs` merender setiap rute dengan `renderToString` ke berkas HTML masing-masing. Browser menggambar konten sebelum JavaScript berjalan, sehingga elemen LCP adalah `h1` statis; React kemudian melakukan hidrasi (`hydrateRoot` di `src/main.tsx`). Server pengembangan tetap merender di sisi klien.
- **Data blog saat build.** Artikel yang sudah terbit diambil dari Backendless saat build, disematkan ke HTML sebagai `<script id="__RESOURCES__" type="application/json">`, dan dimuat ke store sebelum hidrasi, sehingga markup server dan klien identik. Setelah hidrasi, daftar artikel divalidasi ulang agar artikel yang terbit setelah deploy tetap muncul.
- **URL khusus klien.** `/blog/new`, artikel yang lebih baru dari build, dan 404 dilayani oleh `dist/app.html` melalui rewrite di `vercel.json`. `main.tsx` memuat chunk halaman sebelum render pertama (`src/lib/lazyWithPreload.ts`), sehingga tidak ada pergeseran layout dari skeleton ke halaman.
- **Pemuatan JavaScript yang ditunda.** Plugin `defer-app-script` (`vite/defer-app-script.ts`) menyisipkan tag `<script type="module">` dan `modulepreload` setelah frame pertama, sehingga JavaScript tidak berada di jalur kritis LCP.
- **State yang aman untuk hidrasi.** Nilai dari `localStorage` (tema, sesi, draf) dan data remote dibaca melalui `useSyncExternalStore` dengan snapshot server, sehingga markup hasil prarender tidak pernah berbeda dengan render pertama di klien.
- **Pemecahan bundel.** Setiap halaman selain beranda adalah chunk `React.lazy`; kode bersama dikelompokkan ke `vendor` (router, Radix, lucide), `forms` (react-hook-form + zod, hanya untuk login dan editor), `shared`, dan `MarkdownRenderer` (react-markdown + remark-gfm, hanya untuk artikel dan pratinjau).
- **Font dan gambar.** Plus Jakarta Sans di-host sendiri dengan `font-display: optional` dan fallback yang metriknya disesuaikan. Ilustrasi hero tersedia dalam tiga ukuran WebP dengan `fetchpriority="high"`; foto tim dimuat secara lazy dengan dimensi eksplisit.

## Manajemen state

| State | Lokasi | Mekanisme |
|---|---|---|
| Sesi autentikasi (`status`, `user`, `login`, `logout`) | `src/features/auth/AuthProvider.tsx` | Context; sesi di localStorage `cp:auth` dibaca lewat `useSyncExternalStore`; token divalidasi sekali per token melalui `GET /users/isvalidusertoken`; respons `3064` menghapus sesi |
| Proteksi rute | `src/features/auth/ProtectedRoute.tsx` | `restoring` → skeleton, `anonymous` → `<Navigate state={{ from }}>` ke `/login` |
| Tema | `src/context/ThemeProvider.tsx` | Context + localStorage `cp:theme`, skrip pra-render di `index.html` |
| Data remote (tim, daftar artikel, satu artikel) | `src/lib/resource.ts` | Store `useResource(key, fetcher)`: `useSyncExternalStore`, diisi dari JSON hasil build, cache sessionStorage opsional, validasi ulang, `reload()` |
| Draf artikel | `src/features/blog/useBlogDraft.ts` | `watch` react-hook-form → localStorage `cp:blog-draft` dengan debounce; banner pulihkan/buang draf |
| Formulir | `LoginForm.tsx`, `BlogForm.tsx`, `InquiryForm.tsx` | react-hook-form + zod 4 (`z.input`/`z.output` untuk transformasi tag), komponen `Field` shadcn |
| State di URL | `BlogListPage.tsx`, `LoginPage.tsx` | `useSearchParams` (`?tag=`), `location.state.from` |
| Halaman "Load More" | `BlogListPage.tsx` | `useState` per tag; halaman pertama dari store, halaman berikutnya ditambahkan dan dideduplikasi |
| UI lokal | Header, carousel, tab | `useState`; state disesuaikan saat render ketika rute berubah |

## Pengaturan Backendless

Aplikasi memakai REST API tanpa SDK. `src/lib/backendless.ts` adalah pembungkus `fetch` ringkas yang menambahkan header `user-token` dan memetakan kode kesalahan: `3003` kredensial salah, `3036` akun terkunci, `3064` token kedaluwarsa (keluar otomatis).

### Tabel

**Users** (bawaan). Akun dibuat melalui Console → Data → Users. Fitur login aktif di Users → Login dengan konfirmasi email dinonaktifkan; pendaftaran publik dinonaktifkan (lihat bagian izin).

**Blog** (dibuat otomatis lewat dynamic schema pada penulisan pertama):

| Kolom | Tipe | Keterangan |
|---|---|---|
| `title` | STRING(120) | 8–120 karakter |
| `slug` | STRING(80) | Pengenal di URL; **Unique** dan **Indexed**, validator `^[a-z0-9]+(-[a-z0-9]+)*$` |
| `excerpt` | STRING(200) | Ringkasan, maksimal 200 karakter |
| `content` | TEXT | Isi Markdown. Dynamic schema membuatnya sebagai STRING(500); ubah ke TEXT agar artikel panjang tidak gagal dengan HTTP 413 |
| `tags` | STRING | Disimpan sebagai `,tag-satu,tag-dua,` sehingga `LIKE '%,tag,%'` mencocokkan tag utuh; validator `^(,[a-z0-9-]{2,20}){0,5},?$` |
| `authorName` | STRING(80) | Disalin dari `name` pengguna saat menerbitkan |
| `published` | BOOLEAN | Kueri publik hanya mengambil `published=true` |
| `ownerId`, `created`, `updated`, `objectId` | sistem | Diisi oleh Backendless |

**Inquiries** (dibuat otomatis oleh pengiriman formulir kontak pertama): `subject`, `name`, `company`, `email`, `phone`, `country`, `message` (STRING, dibatasi 500 karakter oleh formulir), dan `source`. Pengunjung hanya boleh membuat baris; tidak ada yang boleh membacanya dari browser.

Nonaktifkan dynamic schema (Manage → App Settings) setelah semua kolom terbentuk.

### Izin akses

Pada tab Permissions setiap tabel, centang hijau berarti diizinkan, silang merah berarti ditolak, dan abu-abu berarti mengikuti bawaan global yang mengizinkan segalanya. Karena itu setiap operasi yang tidak dibutuhkan aplikasi diberi silang merah. Peran API key (RestUser, JSUser, dan seterusnya) dibiarkan abu-abu.

| Tabel | Peran | RETRIEVE | CREATE | UPDATE | REMOVE |
|---|---|---|---|---|---|
| Blog | NotAuthenticatedUser, GuestUser | ✅ | ❌ | ❌ | ❌ |
| Blog | AuthenticatedUser | ✅ | ✅ | ❌ | ❌ |
| Inquiries | NotAuthenticatedUser, GuestUser, AuthenticatedUser | ❌ | ✅ | ❌ | ❌ |
| Users | NotAuthenticatedUser, GuestUser, AuthenticatedUser | ❌ | ❌ | ❌ | ❌ |

Aplikasi tidak menyunting atau menghapus artikel, sehingga UPDATE dan REMOVE ditolak untuk semua peran; jika fitur tersebut ditambahkan, izinnya dibuka melalui tab **Owner Policy** (hanya pemilik baris). Menolak RETRIEVE pada `Users` mencegah pengunjung mendaftar akun yang ada; menolak UPDATE/REMOVE mencegah perubahan kata sandi atau email akun lain. Login dan logout tetap berfungsi karena keduanya endpoint terpisah.

Pengaturan lain di console: **Users → Registration** dinonaktifkan karena situs tidak memiliki halaman daftar; **Users → Login** mengaktifkan penguncian akun setelah beberapa kali gagal (aplikasi menampilkan pesan untuk kode 3036) dan batas waktu sesi.

### Verifikasi

```powershell
$base = 'https://<subdomain>.backendless.app/api'
curl.exe -s -o NUL -w '%{http_code}' -X POST "$base/users/login" -H 'Content-Type: application/json' -d '{\"login\":\"<email>\",\"password\":\"<password>\"}'   # 200
curl.exe -s -o NUL -w '%{http_code}' "$base/data/Users"                                                     # 403
curl.exe -s -o NUL -w '%{http_code}' -X POST "$base/data/Blog" -H 'Content-Type: application/json' -d '{\"title\":\"x\"}'   # 403 (tanpa token)
curl.exe -s -o NUL -w '%{http_code}' -X POST "$base/users/register" -H 'Content-Type: application/json' -d '{\"email\":\"a@b.co\",\"password\":\"x\"}'   # bukan 200
curl.exe -s "$base/data/Blog?where=published%3Dtrue&pageSize=1"                                              # satu artikel
```

## Akun peninjau

Pendaftaran publik dinonaktifkan, sehingga tersedia satu akun peninjau di tabel `Users`. Kredensialnya disampaikan secara terpisah bersama pengumpulan tugas dan tidak disimpan di repositori maupun ditampilkan di situs. Alur pengujian yang disarankan:

1. Dalam keadaan belum masuk, buka **Write a post** di header; pengunjung dialihkan ke `/login`.
2. Masukkan kata sandi yang salah; muncul peringatan inline dan fokus berpindah ke peringatan tersebut.
3. Masuk; pengunjung dikembalikan ke `/blog/new`. Muat ulang halaman: tetap masuk tanpa kedipan.
4. Terbitkan artikel (Markdown, tab Write/Preview, tag); pengunjung dialihkan ke `/blog/<slug>` dengan pemberitahuan "published", artikel muncul paling atas di `/blog`, dan baris di Backendless memiliki `ownerId`.
5. Ketik di editor lalu muat ulang: draf dipulihkan dari localStorage `cp:blog-draft`.
6. Saring berdasarkan tag di `/blog` (`?tag=…`); buka slug yang tidak ada untuk melihat 404 inline.
7. Keluar dari header; **Write a post** kembali mengalihkan ke halaman login.

## Pemeriksaan kualitas

`npm run typecheck`, `npm run lint`, dan `npm run lint:a11y` dijalankan sebelum setiap commit; `npm run build` gagal bila hash skrip inline tidak cocok dengan CSP di `vercel.json`.

Skor Lighthouse 13.5 (Chrome headless) terhadap URL produksi <https://suitmedia-profile.vercel.app>, 22 September 2026. Urutan skor: Performance / Accessibility / Best Practices / SEO.

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

## Keamanan

- **Header respons** didefinisikan di `vercel.json` dan juga diterapkan oleh `npm run preview`: Content-Security-Policy (`script-src 'self'` ditambah satu hash SHA-256 per skrip inline, `frame-ancestors 'none'`, `connect-src` dibatasi ke Backendless dan randomuser.me), `X-Frame-Options`, `Permissions-Policy`, `Strict-Transport-Security`, `X-Content-Type-Options`, dan `Referrer-Policy`. `Cross-Origin-Opener-Policy: same-origin` sempat dicoba lalu dilepas karena memaksa pergantian browsing-context group saat navigasi, menaikkan TBT 50–120 ms, dan membuat sebagian pengukuran Lighthouse gagal dengan `NO_NAVSTART`, padahal situs tidak membuka popup.
- **Skrip inline dan CSP.** Skrip tema di `index.html` dan pemuat aplikasi di `vite/defer-app-script.ts` adalah satu-satunya skrip inline. `scripts/check-csp.mjs` dijalankan di akhir `npm run build` dan gagal sambil menampilkan hash baru bila salah satunya berubah. Gambar Markdown boleh berasal dari host `https:` mana pun; permintaan data hanya boleh ke Backendless dan randomuser.me.
- **Klausa where** dibangun dengan `quote()` (kutip tunggal digandakan, gaya SQL-92) dan hanya setelah nilainya lolos daftar putih (`SLUG_PATTERN`, `TAG_PATTERN` di `src/features/blog/slugify.ts`), sehingga masukan dari URL tidak pernah sampai ke Backendless tanpa pemeriksaan.
- **Data saat build.** `scripts/prerender.mjs` hanya mem-prarender artikel yang slug-nya cocok dengan `SLUG_PATTERN`, meng-escape slug sebelum menulisnya ke HTML, dan menolak menulis di luar `dist/`, sehingga baris data yang berbahaya tidak dapat mengubah halaman lain selama build.
- **Akun peninjau.** Kredensialnya dibagikan secara privat dan tidak pernah di-commit atau dirender. Pendaftaran dinonaktifkan dan percobaan login yang gagal berulang kali mengunci akun, sehingga formulir login tidak dapat dipakai untuk menebak akun.
- **Sesi.** Token Backendless disimpan di localStorage (`cp:auth`) dan hanya dikirim ke URL API yang dikonfigurasi; `GET /users/logout` membatalkannya di sisi server dan draf artikel dihapus saat keluar.

## Deploy ke Vercel

1. Impor repositori dengan preset **Vite**; **Root Directory** dibiarkan kosong karena aplikasi berada di akar repositori.
2. Isi environment variable `VITE_BACKENDLESS_API_URL` dan `VITE_SITE_URL=https://<nama-proyek>.vercel.app`. `VITE_SITE_URL` mengaktifkan canonical, `og:url`, `og:image` absolut, `robots.txt` dengan baris Sitemap, dan `sitemap.xml`.
3. `vercel.json` mengalihkan URL yang tidak dikenal ke `/app.html` serta mengatur header cache jangka panjang untuk `/assets`, `/fonts`, dan `/images`.
4. Pengukuran Lighthouse dilakukan pada alias produksi, karena preview deployment menyisipkan toolbar Vercel dan `noindex`.

Artikel yang terbit setelah deploy terakhir dilayani dari sisi klien hingga build berikutnya; Deploy Hook Vercel yang dipicu dari console (atau deploy ulang manual) akan mem-prarender-nya.
