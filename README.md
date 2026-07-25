# SIBIMO Public

Website publik **SIBIMO (Sistem Informasi Kelurahan Bimomartani)** yang dibangun menggunakan **Vue.js**.

Repository ini menyediakan website resmi Kelurahan Bimomartani yang berfungsi sebagai media informasi publik sekaligus portal layanan administrasi surat bagi masyarakat.

Seluruh data dan layanan diperoleh melalui REST API yang disediakan oleh **SIBIMO Backend**.

---

## Tentang Proyek

SIBIMO Public merupakan aplikasi yang dapat diakses oleh masyarakat umum untuk memperoleh informasi mengenai Kelurahan Bimomartani.

Selain sebagai website profil kelurahan, aplikasi ini juga menyediakan layanan administrasi surat secara online sehingga masyarakat dapat mengajukan permohonan surat tanpa harus datang langsung ke kantor kelurahan.

Repository ini hanya berisi **Frontend Website Publik** dan seluruh data diperoleh melalui REST API dari repository **SIBIMO Backend**.

---

## Arsitektur Sistem

```text
                     +----------------------+
                     |    SIBIMO Backend    |
                     |   Laravel REST API   |
                     +----------+-----------+
                                ▲
                                │
                        REST API │
                                │
                     +----------+-----------+
                     |    SIBIMO Public     |
                     |        Vue.js        |
                     |                      |
                     | Website Kelurahan    |
                     | Informasi Publik     |
                     | Layanan Surat        |
                     +----------------------+
```

---

## Repository Ekosistem

| Repository        | Deskripsi                                        |
| ----------------- | ------------------------------------------------ |
| **sibimo**        | Backend REST API menggunakan Laravel             |
| **sibimo-admin**  | Dashboard administrasi berbasis Vue.js           |
| **sibimo-public** | Website publik dan layanan surat berbasis Vue.js |

---

## Tech Stack

### Frontend

* Vue 3
* JavaScript
* Vite
* PrimeVue
* Tailwind CSS
* Vue Router
* Pinia
* Axios

### Development

* Node.js
* npm
* ESLint
* Git

---

## Integrasi

SIBIMO Public terhubung dengan **SIBIMO Backend** melalui REST API.

Seluruh data website, autentikasi warga, serta proses layanan administrasi surat dikelola oleh backend sehingga aplikasi frontend hanya bertanggung jawab terhadap penyajian antarmuka dan pengalaman pengguna.

---

## License

Copyright © Dejico ID.
