# gta6-meme-x-01 — "WANTED ★★★★★"

[![make.fun · gta6-meme-x-01](https://make.fun/badge/gta6-meme-x-01.svg)](https://make.fun/bounty/gta6-meme-x-01)
[![rank](https://make.fun/badge/gta6-meme-x-01/yonschpnks/gta6-meme-x-01/rank.svg)](https://make.fun/bounty/gta6-meme-x-01/leaderboard)
[![reward](https://make.fun/badge/gta6-meme-x-01/yonschpnks/gta6-meme-x-01/reward.svg)](https://make.fun/bounty/gta6-meme-x-01)

Entri untuk bounty make.fun **gta6-meme-x-01** ("Post a GTA 6 meme on X").
Pot $500, top 50 dibayar. Deadline: Senin 23 Nov 2026, 21:00 WIB.

## Meme

`meme.png` (1024×1024, PNG, 447.250 byte) — hantu make.fun sebagai buronan
bintang 5 di jalan neon Vice City: stik game di satu tangan, kipas uang tunai
di tangan lain, berdiri di kap lowrider dengan mobil polisi di belakang.

- Teks di gambar: **"STILL NO GTA VI."** /
  **"SO HE EARNS REAL MONEY ON make.fun"** (ditambah dengan PIL, jadi ejaannya
  dijamin benar).
- Mark resmi make.fun (`mark-1024.png`) dikomposit di kiri atas, dan hantu
  hasil generator sendiri adalah maskotnya — hantu putih bermata sparkle —
  jadi merek tetap terbaca jelas saat gambar diciutkan ke 480×480.
- `draw_meme.py` membangun ulang `meme.png` dari scene hasil generator +
  mark resmi + teks PIL, termasuk kuantisasi ke palet 256 warna (MEDIANCUT).
  Hasil rebuild terverifikasi identik byte-for-byte dengan file yang
  diposting (cek 21 Nov 2026).

## Program (`main.ts`)

Node 22, standard library saja. Menyalin `POST.json` dan `meme.png` ke
direktori output yang dibaca gate, setelah memvalidasi `POST.json` dulu:
harus berupa objek JSON (maks. 16384 byte) dengan `url` berbentuk alamat
post X (`https://x.com/<handle>/status/<id>`); placeholder atau URL yang
bentuknya salah ditolak dengan pesan yang jelas dan exit 1, jadi entri
rusak ketahuan di sini, bukan diam-diam lolos sebagai entri invalid.

Jalur tidak pernah relatif terhadap working directory: `BOT_DIR` diambil
dari `MAKEFUN_BOT_DIR`, lalu `/bot` (container penilai), lalu direktori
tempat file ini berada. Di luar container penilai:

```sh
mkdir -p out && MAKEFUN_BOT_DIR=. MAKEFUN_OUTPUT_DIR=out node main.ts
```

Uji gaya penilai (21 Nov 2026): dijalankan dari direktori di luar repo
dengan `MAKEFUN_BOT_DIR` + `MAKEFUN_OUTPUT_DIR` ke scratch dir, dua kali
berturut-turut, ditambah sekali tanpa `MAKEFUN_BOT_DIR` (fallback direktori
file) — ketiganya exit 0 dan output identik dengan sumber. Delapan kasus
`POST.json` rusak/placeholder semuanya ditolak dengan exit 1.

## Postingan X

Sudah diposting Yons:

> https://x.com/YonsChpnks33/status/2123966804179743229

`POST.json` sudah berisi URL ini. Draf caption yang disiapkan:

> 12 years waiting for GTA VI 💀 Meanwhile my AI agent is winning real
> bounty money on @makefunai — this meme is literally one of the
> bounties. makefun-violin-apricot-shrub
> https://make.fun/bounty/gta6-meme-x-01

Catatan: teks postingan yang live di X belum bisa dibaca ulang dari mesin
ini — X memblokir akses otomatis dengan HTTP 403 (dicek 21 Nov 2026).
Sebelum submit, pastikan teks postingan di X benar memuat @makefunai /
make.fun dan kode main `makefun-violin-apricot-shrub`.

## Status

- [x] Meme selesai (20 Nov 2026)
- [x] Diposting di X oleh Yons (21 Nov 2026, URL tercatat di `POST.json`)
- [x] `POST.json` terisi URL postingan
- [x] `main.ts` dan `draw_meme.py` direvisi dan diuji gaya penilai (21 Nov 2026)
- [ ] Disubmit ke make.fun (bukan bagian revisi ini)

Entri gratis saja — tanpa connect dompet, signing, atau pembayaran.
