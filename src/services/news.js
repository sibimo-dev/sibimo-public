export const newsCategories = [
  "Pemerintahan",
  "Kegiatan Warga",
  "Pembangunan",
  "Pengumuman",
  "Kesehatan",
];

const categoryStyles = {
  Pemerintahan: "bg-primary-900 text-white",
  "Kegiatan Warga": "bg-amber-50 text-amber-700",
  Pembangunan: "bg-emerald-50 text-emerald-700",
  Pengumuman: "bg-rose-50 text-rose-700",
  Kesehatan: "bg-sky-50 text-sky-700",
};

export function getCategoryClasses(category) {
  return categoryStyles[category] || "bg-primary-50 text-primary-700";
}

const newsDummy = [
  {
    slug: "gapura-batas-kalurahan-bimomartani-diperbarui",
    category: "Pemerintahan",
    date: "15 Okt 2026",
    dateISO: "2026-10-15",
    author: "Admin Desa",
    title: "Gapura Batas Kalurahan Bimomartani Tampil Baru, Jadi Ikon Penanda Wilayah",
    excerpt:
      "Gapura selamat datang di Jalan Cangkringan direvitalisasi dengan ornamen khas Yogyakarta, mempertegas identitas Kalurahan Bimomartani bagi warga dan pengunjung.",
    content: [
      "Pemerintah Kalurahan Bimomartani merampungkan revitalisasi gapura batas wilayah yang berlokasi di Jalan Cangkringan KM 6,5, tepat di pintu masuk utama menuju kalurahan. Gapura ini kini tampil lebih megah dengan ornamen khas Daerah Istimewa Yogyakarta serta lambang-lambang kelembagaan desa yang terpasang rapi di badan gapura.",
      "Lurah Bimomartani, Tutik Wahyuningsih, S.Sos., M.A.P., menyampaikan bahwa gapura tidak sekadar penanda batas administratif, melainkan juga cerminan identitas budaya dan kebanggaan warga. Desain gapura sengaja mempertahankan unsur tradisional seperti motif kawung dan ornamen gunungan di kedua sisinya.",
      {
        type: "image",
        src: "/images/news/gapura-kalurahan-bimomartani.jpg",
        caption: "Gapura selamat datang Kalurahan Bimomartani di Jalan Cangkringan KM 6,5 yang telah direvitalisasi.",
      },
      "Selain mempercantik wajah desa, keberadaan gapura yang dilengkapi kode QR informasi kependudukan ini diharapkan memudahkan warga maupun tamu mengakses data dan layanan kalurahan secara digital hanya dengan memindai kode yang tersedia.",
      "Revitalisasi gapura ini merupakan bagian dari rangkaian penataan wajah kalurahan yang juga beriringan dengan pembahasan perubahan RPJMKal, sebagai wujud pembenahan menyeluruh baik dari sisi tata kelola pemerintahan maupun tampilan fisik wilayah.",
    ],
    image: "/images/news/gapura-kalurahan-bimomartani.jpeg",
    popular: true,
    isPinned: true,
  },
  {
    slug: "musrenbangdes-2027-berjalan-lancar",
    category: "Pemerintahan",
    date: "12 Okt 2026",
    dateISO: "2026-10-12",
    author: "Admin Desa",
    title: "Musyawarah Perencanaan Pembangunan Desa Tahun 2027 Berjalan Lancar",
    excerpt:
      "Warga antusias mengikuti Musrenbangdes untuk menentukan prioritas pembangunan desa tahun depan. Fokus utama pada perbaikan infrastruktur jalan.",
    content: [
      "Pemerintah Kalurahan Bimomartani menggelar Musyawarah Perencanaan Pembangunan Desa (Musrenbangdes) Tahun 2027 di Aula Kalurahan pada Kamis pagi. Kegiatan ini dihadiri oleh perangkat desa, Badan Permusyawaratan Kalurahan (BPKal), tokoh masyarakat, serta perwakilan warga dari seluruh padukuhan.",
      "Musrenbangdes menjadi forum utama untuk menjaring usulan pembangunan dari tingkat padukuhan sebelum ditetapkan menjadi Rencana Kerja Pemerintah Desa (RKPD) tahun anggaran 2027. Sejumlah usulan yang mengemuka antara lain perbaikan jalan penghubung antar-dusun, peningkatan fasilitas posyandu, dan pengembangan sarana irigasi pertanian.",
      "Lurah Bimomartani dalam sambutannya menekankan pentingnya skala prioritas mengingat keterbatasan anggaran desa. Usulan yang berdampak langsung ke banyak warga, terutama infrastruktur jalan, akan didahulukan.",
      "Hasil Musrenbangdes ini selanjutnya akan dibawa ke Musyawarah Antar Desa (MAD) tingkat kapanewon sebelum ditetapkan sebagai dokumen resmi perencanaan pembangunan desa.",
    ],
    image: "/images/news/musrenbangkal-penyusunan-rpjmkal-2.jpg",
    popular: false,
    isPinned: false,
  },
  {
    slug: "pengaspalan-jalan-dusun-mekarsari-selesai",
    category: "Pembangunan",
    date: "10 Okt 2026",
    dateISO: "2026-10-10",
    author: "Admin Desa",
    title: "Pengaspalan Jalan Dusun Mekarsari Selesai Sesuai Target",
    excerpt:
      "Proyek pengaspalan sepanjang 1,2 kilometer di Dusun Mekarsari rampung tepat waktu dan langsung dirasakan manfaatnya oleh warga.",
    content: [
      "Proyek pengaspalan jalan sepanjang 1,2 kilometer yang menghubungkan Dusun Mekarsari dengan jalan utama desa telah rampung dikerjakan. Pekerjaan yang dimulai sejak awal September ini selesai sesuai jadwal yang direncanakan dalam APBDes tahun 2026.",
      "Ketua RT setempat menyampaikan bahwa jalan tersebut sebelumnya rusak parah dan kerap membuat kendaraan warga, terutama roda dua, terjatuh saat musim hujan. Kini jalan sudah mulus dan anak-anak sekolah lebih aman melintas.",
      "Pemerintah kalurahan berterima kasih kepada seluruh warga yang telah berpartisipasi dalam pengawasan pelaksanaan proyek melalui Tim Pelaksana Kegiatan (TPK), sehingga kualitas pekerjaan dapat terjaga sesuai spesifikasi.",
    ],
    image: "/images/news/gapura-kalurahan-bimomartani.jpeg",
    popular: true,
    isPinned: false,
  },
  {
    slug: "pasar-tani-mingguan-ekonomi-lokal",
    category: "Kegiatan Warga",
    date: "08 Okt 2026",
    dateISO: "2026-10-08",
    author: "Admin Desa",
    title: "Pasar Tani Mingguan Berhasil Tingkatkan Ekonomi Lokal",
    excerpt:
      "Digelar setiap Minggu pagi, Pasar Tani menjadi wadah bagi petani dan pelaku UMKM lokal memasarkan hasil bumi dan produk olahannya.",
    content: [
      "Pasar Tani Mingguan yang digagas oleh Kalurahan Bimomartani bersama kelompok tani setempat terus menunjukkan perkembangan positif. Sejak digelar rutin setiap Minggu pagi di halaman balai desa, pasar ini ramai dikunjungi warga dari desa tetangga.",
      "Sedikitnya 25 lapak diisi oleh petani dan pelaku UMKM yang menjajakan sayur mayur segar, hasil palawija, hingga produk olahan seperti keripik dan jamu tradisional. Perputaran uang di pasar ini diperkirakan mencapai belasan juta rupiah setiap kali penyelenggaraan.",
      "Selain menambah penghasilan, pasar ini juga menjadi ajang silaturahmi warga antar-dusun. Pemerintah desa berencana memperluas area pasar agar dapat menampung lebih banyak pedagang pada tahun mendatang.",
    ],
    image: "/images/news/pemberian-pmt-bumil-kek-balita-gizi-buruk-4.jpg",
    popular: true,
    isPinned: false,
  },
  {
    slug: "jadwal-posyandu-lansia-oktober",
    category: "Kesehatan",
    date: "05 Okt 2026",
    dateISO: "2026-10-05",
    author: "Admin Desa",
    title: "Jadwal Posyandu Lansia Bulan Ini, Catat Tanggalnya!",
    excerpt:
      "Kegiatan Posyandu Lansia bulan Oktober akan dilaksanakan bergiliran di setiap padukuhan, warga lanjut usia dihimbau membawa Kartu Menuju Sehat.",
    content: [
      "Puskesmas Pembantu bersama kader kesehatan Kalurahan Bimomartani mengumumkan jadwal Posyandu Lansia untuk bulan Oktober 2026. Kegiatan akan dilaksanakan secara bergiliran di 12 padukuhan sesuai jadwal yang telah ditetapkan.",
      "Setiap peserta lanjut usia dihimbau membawa Kartu Menuju Sehat (KMS) Lansia dan datang sesuai jadwal padukuhan masing-masing untuk menghindari penumpukan antrean. Layanan yang tersedia meliputi pemeriksaan tekanan darah, gula darah, serta konsultasi gizi lansia.",
      "Kader kesehatan mengingatkan pentingnya pemeriksaan rutin bagi lansia guna mendeteksi dini penyakit tidak menular seperti hipertensi dan diabetes. Jadwal lengkap per padukuhan dapat dilihat di papan pengumuman balai dusun masing-masing.",
    ],
    image: "/images/news/musrenbangkal-penyusunan-rpjmkal-3.jpg",
    popular: true,
    isPinned: false,
  },
  {
    slug: "persiapan-lomba-desa-hut-ri-ke-81",
    category: "Kegiatan Warga",
    date: "28 Jul 2026",
    dateISO: "2026-07-28",
    author: "Admin Desa",
    title: "Persiapan Lomba Desa Memperingati HUT RI ke-81",
    excerpt:
      "Warga dari setiap dusun mulai bergotong royong menghias gapura dan mempersiapkan berbagai lomba menyambut HUT Kemerdekaan RI.",
    content: [
      "Menyambut Hari Ulang Tahun Kemerdekaan Republik Indonesia ke-81, warga Kalurahan Bimomartani mulai bergotong royong menghias gapura dan lingkungan dusun masing-masing sejak pekan ini. Nuansa merah putih terlihat menghiasi hampir setiap sudut jalan desa.",
      "Panitia HUT RI tingkat kalurahan juga telah menyusun rangkaian lomba yang akan digelar, mulai dari lomba gapura antar-dusun, lomba kebersihan lingkungan, hingga lomba tradisional untuk anak-anak dan ibu-ibu PKK.",
      "Ketua Panitia HUT RI Kalurahan Bimomartani berharap semangat gotong royong ini terus terjaga bukan hanya saat perayaan kemerdekaan saja. Puncak perayaan akan digelar di lapangan desa dengan upacara bendera dan pentas seni warga.",
    ],
    image: "/images/news/pembinaan-kader-gizi-3.jpg",
    popular: false,
    isPinned: false,
  },
  {
    slug: "perbaikan-saluran-irigasi-tahap-2",
    category: "Pembangunan",
    date: "28 Sep 2026",
    dateISO: "2026-09-28",
    author: "Admin Desa",
    title: "Perbaikan Saluran Irigasi Pertanian Tahap II Dimulai",
    excerpt:
      "Pemerintah desa kembali mengucurkan dana desa untuk perbaikan saluran irigasi guna menunjang produktivitas pertanian warga.",
    content: [
      "Pekerjaan perbaikan saluran irigasi pertanian Tahap II resmi dimulai pekan ini, melanjutkan pekerjaan tahap pertama yang telah selesai tahun lalu. Proyek ini didanai dari Dana Desa tahun anggaran 2026 dengan target penyelesaian dalam waktu 45 hari kerja.",
      "Saluran irigasi sepanjang kurang lebih 800 meter ini melayani area persawahan seluas puluhan hektare di wilayah selatan desa. Kondisi saluran yang lama kerap mengalami kebocoran sehingga distribusi air ke sawah warga tidak merata, terutama saat musim kemarau.",
      "Kelompok Tani setempat menyambut baik proyek ini dan berharap dapat meningkatkan hasil panen padi pada musim tanam berikutnya.",
    ],
    image: "/images/news/gapura-kalurahan-bimomartani.jpeg",
    popular: false,
    isPinned: false,
  },
  {
    slug: "pemadaman-listrik-bergilir-area-barat",
    category: "Pengumuman",
    date: "25 Sep 2026",
    dateISO: "2026-09-25",
    author: "Admin Desa",
    title: "Pemberitahuan Pemadaman Listrik Bergilir Area Barat",
    excerpt:
      "Sehubungan dengan perbaikan gardu induk PLN, akan dilakukan pemadaman listrik sementara pada beberapa dusun di area barat desa.",
    content: [
      "Sehubungan dengan adanya pemeliharaan jaringan dan perbaikan gardu induk oleh PLN, akan dilaksanakan pemadaman listrik sementara di wilayah dusun bagian barat Kalurahan Bimomartani. Pemadaman diperkirakan berlangsung selama beberapa jam pada hari kerja.",
      "Warga dihimbau untuk mempersiapkan kebutuhan yang bergantung pada listrik sebelum jadwal pemadaman, termasuk mengisi daya perangkat penting dan menyimpan bahan makanan yang mudah rusak dengan baik.",
      "Pemerintah desa akan menginformasikan lebih lanjut apabila terdapat perubahan jadwal dari pihak PLN. Informasi resmi juga dapat dipantau melalui pengumuman di balai dusun masing-masing.",
    ],
    image: "/images/news/pemberian-pmt-bumil-kek-balita-gizi-buruk-4.jpg",
    popular: false,
    isPinned: false,
  },
  {
    slug: "pembinaan-kader-gizi",
    category: "Kesehatan",
    date: "07 Agu 2026",
    dateISO: "2026-08-07",
    author: "Admin Desa",
    title: "Pembinaan Kader Gizi",
    excerpt:
      "Pemerintah Kalurahan Bimomartani menggelar Pembinaan Kader Gizi di Pendopo Kalurahan, diikuti 30 kader gizi dari 12 padukuhan.",
    content: [
      "Jumat, 7 Agustus 2026 pukul 08.30 WIB, Pemerintah Kalurahan Bimomartani menyelenggarakan kegiatan Pembinaan Kader Gizi di Pendopo Kalurahan Bimomartani. Kegiatan diikuti oleh 30 kader gizi yang berasal dari 12 padukuhan di wilayah Kalurahan Bimomartani.",
      "Acara diawali dengan sambutan dari Lurah Bimomartani, Tutik Wahyuningsih, S.Sos., M.A.P., yang menyampaikan pentingnya peran kader gizi dalam meningkatkan kualitas kesehatan ibu dan anak di tingkat padukuhan.",
      {
        type: "image",
        src: "/images/news/pembinaan-kader-gizi-2.jpg",
        caption: "Para kader gizi menyimak materi pembinaan yang disampaikan narasumber di Pendopo Kalurahan.",
      },
      "Materi pembinaan meliputi cara pengukuran status gizi balita, deteksi dini stunting, serta penyusunan menu makanan tambahan bergizi seimbang berbahan pangan lokal. Kader gizi diharapkan dapat menularkan ilmu ini kepada kader posyandu di wilayah masing-masing.",
    ],
    image: "/images/news/pembinaan-kader-gizi.jpg",
    popular: false,
    isPinned: false,
  },
  {
    slug: "pemberian-pmt-bumil-kek-balita-gizi-buruk",
    category: "Kesehatan",
    date: "03 Agu 2026",
    dateISO: "2026-08-03",
    author: "Admin Desa",
    title: "Pemberian PMT Bumil KEK dan Balita Gizi Buruk",
    excerpt:
      "Pemerintah desa melaksanakan Pemberian Makanan Tambahan bagi ibu hamil KEK dan balita gizi buruk untuk menekan risiko stunting.",
    content: [
      "Bimomartani, 3 Agustus 2026 — Pemerintah Kalurahan Bimomartani melaksanakan kegiatan Pemberian Makanan Tambahan (PMT) bagi ibu hamil dengan Kekurangan Energi Kronis (KEK) dan balita gizi buruk pada Senin pagi di Balai Kalurahan.",
      "Kegiatan ini merupakan bagian dari program percepatan penurunan stunting yang menjadi prioritas nasional. Makanan tambahan yang diberikan berbahan pangan lokal dengan kandungan protein dan gizi seimbang, disusun bersama ahli gizi Puskesmas.",
      {
        type: "image",
        src: "/images/news/pemberian-pmt-bumil-kek-balita-gizi-buruk-2.jpg",
        caption: "Penyerahan paket makanan tambahan kepada ibu hamil KEK di Balai Kalurahan Bimomartani.",
      },
      "Bidan desa menyampaikan bahwa pemberian PMT akan berlangsung selama 90 hari dengan pemantauan berkala terhadap perkembangan berat badan ibu hamil dan balita penerima manfaat, disertai penyerahan bantuan alat kesehatan bagi padukuhan guna menunjang layanan kesehatan dasar di tingkat masyarakat.",
    ],
    image: "/images/news/pemberian-pmt-bumil-kek-balita-gizi-buruk.jpg",
    popular: false,
    isPinned: false,
  },
  {
    slug: "musrenbangkal-penyusunan-perubahan-rpjmkal",
    category: "Pemerintahan",
    date: "28 Agu 2026",
    dateISO: "2026-08-28",
    author: "Admin Desa",
    title: "Musrenbangkal Penyusunan Perubahan RPJMKal Digelar di Kalurahan Bimomartani",
    excerpt:
      "Kalurahan Bimomartani menggelar Musyawarah Perencanaan Pembangunan Kalurahan untuk penyusunan perubahan RPJMKal, sehubungan dengan perpanjangan masa jabatan Lurah tahun 2028–2029.",
    content: [
      "Pemerintah Kalurahan Bimomartani menyelenggarakan Musyawarah Perencanaan Pembangunan Kalurahan (Musrenbangkal) dalam rangka penyusunan perubahan Rencana Pembangunan Jangka Menengah Kalurahan (RPJMKal), sehubungan dengan perpanjangan masa jabatan Lurah untuk periode 2028–2029.",
      "Kegiatan yang berlangsung pada Jumat, 28 Agustus 2026 ini bertempat di Balai Kalurahan Bimomartani dan dihadiri oleh unsur pemerintah kalurahan, tokoh masyarakat, serta perwakilan warga dari berbagai padukuhan.",
      {
        type: "image",
        src: "/images/news/musrenbangkal-penyusunan-rpjmkal-2.jpg",
        caption: "Suasana Musrenbangkal di Balai Kalurahan Bimomartani dihadiri perwakilan warga tiap padukuhan.",
      },
      "Dalam forum tersebut, dibahas penyesuaian arah kebijakan pembangunan kalurahan agar tetap selaras dengan kebutuhan masyarakat selama masa transisi kepemimpinan. Musyawarah ini menjadi bagian dari proses partisipatif warga dalam menentukan prioritas pembangunan di Kalurahan Bimomartani untuk periode mendatang.",
    ],
    image: "/images/news/musrenbangkal-penyusunan-rpjmkal.jpg",
    popular: false,
    isPinned: false,
  },
];

export function getAllNews() {
  return newsDummy;
}

export function getNewsBySlug(slug) {
  return newsDummy.find((item) => item.slug === slug) || null;
}

export function getPopularNews(limit = 3) {
  return newsDummy.filter((item) => item.popular).slice(0, limit);
}

export function getRelatedNews(current, limit = 3) {
  if (!current) return [];
  const sameCategory = newsDummy.filter(
    (item) => item.slug !== current.slug && item.category === current.category
  );
  if (sameCategory.length >= limit) return sameCategory.slice(0, limit);
  const others = newsDummy.filter(
    (item) => item.slug !== current.slug && item.category !== current.category
  );
  return [...sameCategory, ...others].slice(0, limit);
}

export default newsDummy;