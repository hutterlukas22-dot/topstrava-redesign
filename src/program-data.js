/* ---------------------------------------------------------------------------
   Data for the program detail template.

   The page is ONE template. Everything that differs between the nine programs
   lives here, so a second program needs a data entry, not a second page.
   The page picks its program from ?program=<slug>, defaulting to 3-chody-zena.
   --------------------------------------------------------------------------- */

/* Subscription lengths and discounts as published on the live program page. */
const durations = [
  { days: 5,  label: '5 dní',  weeks: '1 týždeň',  discount: 0,    note: 'Vyskúšať' },
  { days: 10, label: '10 dní', weeks: '2 týždne',  discount: 0.05, note: 'Zľava 5 %' },
  { days: 20, label: '20 dní', weeks: '4 týždne',  discount: 0.10, note: 'Zľava 10 %', popular: true },
  { days: 60, label: '60 dní', weeks: '12 týždňov', discount: 0.15, note: 'Zľava 15 %' }
];

/* Food restrictions, with the surcharge the live site applies per day. */
const restrictions = [
  { id: 'bravcove',  label: 'Bravčové mäso',  price: 1.5 },
  { id: 'morske',    label: 'Morské plody',   price: 1.5 },
  { id: 'orechy',    label: 'Orechy',         price: 1.5 },
  { id: 'ryby',      label: 'Ryby',           price: 1.5 },
  { id: 'hriby',     label: 'Hríby',          price: 1.5 },
  { id: 'paradajky', label: 'Paradajky',      price: 1.5 },
  { id: 'arasidy',   label: 'Arašidy',        price: 1.5 },
  { id: 'cibula',    label: 'Cibuľa',         price: 1.5 },
  { id: 'olivy',     label: 'Olivy',          price: 1.5 },
  { id: 'kozisyr',   label: 'Kozí syr',       price: 1.5 },
  { id: 'mak',       label: 'Mak',            price: 1.5 },
  { id: 'laktoza',   label: 'Bez laktózy',    price: 1.75 },
  { id: 'rastlinne', label: 'Bez laktózy (rastlinné náhrady)', price: 1.75 },
  { id: 'bezmasa',   label: 'Bez mäsa',       price: 1.75 }
];

/* Allergen numbers used by the kitchen, for decoding the badges on meal cards. */
const allergenNames = {
  '1': 'Obilniny s lepkom', '2': 'Kôrovce', '3': 'Vajcia', '4': 'Ryby',
  '5': 'Arašidy', '6': 'Sója', '7': 'Mlieko', '8': 'Orechy', '9': 'Zeler',
  '10': 'Horčica', '11': 'Sezam', '12': 'Oxid siričitý', '13': 'Vlčí bôb', '14': 'Mäkkýše'
};

module.exports = { durations, restrictions, allergenNames };
