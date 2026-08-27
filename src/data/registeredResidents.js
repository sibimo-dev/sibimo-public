
export const REGISTERED_RESIDENTS = [
  {
    nik: "3571401234567890",
    fullName: "Budi Santoso",
    placeOfBirth: "Sleman",
    dateOfBirth: "1980-08-15",
    fullAddress: "Jl. Mawar No. 17, RT.01/RW.04, Dusun Krajan, Bimomartani",
    whatsappNumber: "081234567890",
    occupation: "Buruh Harian Lepas",
  },
  {
    nik: "3571405678901234",
    fullName: "Siti Aminah",
    placeOfBirth: "Yogyakarta",
    dateOfBirth: "1992-03-02",
    fullAddress: "Dusun Krajan RT.02/RW.01, Bimomartani",
    whatsappNumber: "081298765432",
    occupation: "Wiraswasta",
  },
  {
    nik: "3571409876543210",
    fullName: "Agus Prasetyo",
    placeOfBirth: "Sleman",
    dateOfBirth: "1975-11-20",
    fullAddress: "Jl. Kenanga No. 5, RT.03/RW.02, Bimomartani",
    whatsappNumber: "081311223344",
    occupation: "Petani",
  },
];

export function findResidentByNik(nik) {
  return REGISTERED_RESIDENTS.find((resident) => resident.nik === nik) ?? null;
}
