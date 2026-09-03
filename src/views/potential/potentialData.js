export const potentialCategories = [
  { slug: 'all', label: 'Semua' },
  { slug: 'umkm', label: 'UMKM', icon: 'pi pi-shop' },
  { slug: 'pertanian', label: 'Pertanian', icon: 'pi pi-sun' },
  { slug: 'pariwisata', label: 'Pariwisata', icon: 'pi pi-map' },
  { slug: 'bumdes', label: 'BUMDes', icon: 'pi pi-building' },
]

export const potentials = [
  {
    slug: 'batik-permata-ukmk-bimomartani',
    category: 'umkm',
    name: 'Batik Permata UKMK Bimomartani',
    image: '/images/gallery/batik permata.jpg',
    shortDesc:
      'Salah satu produk unggulan UMKM dikalurahan Bimomartani adalah Batik Permata dibawah naungan kelompok UMKM Desa Prima.',
    longDesc:
      'Adapun beberapa produk unggulan merupakan ciri khas Batik Parijoto Sleman DIY. Bagi custumer yang berminat produk Batik Parijoto buatan Batik Permata dapat langsung datang ke Padukuhan Sorasan RT 04/ RW 25, Bimomartani, Ngemplak, Sleman.',
    location: 'Padukuhan Sorasan, Bimomartani',
    contact: '0812-xxxx-xxxx (Ibu Siti, Ketua Kelompok UMKM)',
    extra: {
      'Harga Mulai': 'Rp45.000 / 100gr',
      'Jam Operasional': '08.00 – 17.00 WIB',
      'Kapasitas Produksi': '±20 kg / bulan',
    },
  },
  {
    slug: 'penanaman-kelapa-genjah',
    category: 'pertanian',
    name: 'Penanaman Kelapa Genjah Sebagai Alternatif Tanaman Lahan Kering Di Bimomartani',
    image: '/images/gallery/penanaman kelapa genjah.jpeg',
    shortDesc:
      'Kegiatan penanaman dan serah terima bantuan Bibit Kelapa Genjah dari Kemetrian Pertanian dan Dinas Pertanian Kabupaten Sleman kepada Gapoktan “Bimo Makmur” Kalurahan Bimomartani.',
    longDesc:
      'Pada hari ini Selasa 07 Oktober 2025 dilakukan kegiatan penanaman dan serah terima bantuan Bibit Kelapa Genjah dari Kemetrian Pertanian dan Dinas Pertanian Kabupaten Sleman kepada Gapoktan “Bimo Makmur” Kalurahan Bimomartani di Komplek Embung Bimomartani. Rencananya penanaman bibit kelapa genjah ini akan tersebar seluas 10 hektar di wilayah Kalurahan Bimomartani. Turut hadir dalam kegiatan tersebut Wakil Bupati Sleman Bp Danang Maharsa, S.E beserta Dinas Pertanian Kabupaten sleman, Panewu Ngemplak, Polsek Ngemplak, Koramil Ngemplak, seluruh Perangkat Kalurahan Bimomartani, dan Anggota Gapoktan “Bimo Makmur”. Dengan kegiatan tersebut harapannya Bimomartani dapat menjadi lumbung/sentra hasil pertanian kelapa genjah untuk wilayah Kapanewon Ngemplak.',
    location: 'Komplek Embung Bimomartani, Bimomartani',
    contact: 'Kelompok Tani Makmur — Bapak Wagiyo (Ketua)',
    extra: {
      'Luas Lahan': '±12 Ha',
      Komoditas: 'Buah Segar, Kelapa Kopyor, Bibit Pohon',
      'Musim Panen': '3x per tahun',
    },
  },
  {
    slug: 'embung-bimomartani',
    category: 'pariwisata',
    name: 'Embung Bimomartani',
    image: '/images/gallery/embung bimomartani.jpg',
    shortDesc:
      'Destinasi wisata air buatan yang menawarkan pemandangan asri, spot memancing, dan area rekreasi.',
    longDesc:
      'Embung Bimomartani merupakan embung (kolam penampung air) yang disulap menjadi destinasi wisata air oleh Kelompok Sadar Wisata (Pokdarwis) setempat. Selain berfungsi sebagai penampung air untuk irigasi pertanian, area ini juga dilengkapi gazebo, spot memancing, dan jalur jogging mengelilingi embung yang ramai dikunjungi warga di akhir pekan.',
    location: 'Padukuhan Nengahan, Bimomartani',
    contact: 'Pokdarwis Bimomartani',
    extra: {
      'Jam Buka': '06.00 – 18.00 WIB',
      'Tiket Masuk': 'Rp5.000 / orang',
      Fasilitas: 'Gazebo, spot memancing, area parkir',
    },
  },
  {
    slug: 'toko-desa-mandiri',
    category: 'bumdes',
    name: 'Toko Desa Mandiri',
    shortDesc:
      'Pusat perbelanjaan kebutuhan pokok dan produk lokal yang dikelola oleh BUMDes Bimomartani.',
    longDesc:
      'Toko Desa Mandiri adalah unit usaha BUMDes Bimomartani Sejahtera yang menyediakan kebutuhan pokok sehari-hari dengan harga terjangkau, sekaligus menjadi etalase produk UMKM lokal seperti kopi, kerajinan tangan, dan hasil pertanian warga. Keuntungan dari unit usaha ini dikembalikan untuk mendukung program pembangunan dan pemberdayaan masyarakat desa.',
    location: 'Kompleks Balai Desa Bimomartani',
    contact: 'BUMDes Bimomartani Sejahtera',
    extra: {
      'Jam Operasional': '07.00 – 20.00 WIB',
      'Produk Unggulan': 'Sembako, kopi lokal, kerajinan tangan',
    },
  },
]

export function getPotentialBySlug(slug) {
  return potentials.find((p) => p.slug === slug) ?? null
}

export function getRelatedPotentials(category, excludeSlug, limit = 3) {
  return potentials.filter((p) => p.category === category && p.slug !== excludeSlug).slice(0, limit)
}

export function categoryLabel(slug) {
  return potentialCategories.find((c) => c.slug === slug)?.label ?? slug
}

export function categoryIcon(slug) {
  return potentialCategories.find((c) => c.slug === slug)?.icon ?? 'pi pi-tag'
}