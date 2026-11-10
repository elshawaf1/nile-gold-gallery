import type { Karat } from "@/lib/shop";

export type SeedCategory = { slug: string; labelEn: string; labelAr: string };

export type SeedProduct = {
  id: string;
  titleEn: string;
  titleAr: string;
  descriptionEn: string;
  descriptionAr: string;
  category: string;
  karat: Karat;
  weight: number;
  making: number;
  rating: number;
  reviews: number;
  imageFile: string;
};

export const SEED_CATEGORIES: SeedCategory[] = [
  { slug: "Necklaces", labelEn: "Necklaces", labelAr: "عقود" },
  { slug: "Rings", labelEn: "Rings", labelAr: "خواتم" },
  { slug: "Bracelets", labelEn: "Bracelets", labelAr: "غوايش" },
  { slug: "Earrings", labelEn: "Earrings", labelAr: "حلق" },
  { slug: "Anklets", labelEn: "Anklets", labelAr: "خلاخيل" },
  { slug: "Bridal Sets", labelEn: "Bridal Sets", labelAr: "أطقم شبكة" },
  { slug: "Gold Coins", labelEn: "Gold Coins", labelAr: "جنيهات ذهب" },
  { slug: "Gold Bars", labelEn: "Gold Bars", labelAr: "سبائك" },
];

export const SEED_PRICE_RANGES = [
  {
    key: "under-25k",
    labelEn: "Under EGP 25,000",
    labelAr: "أقل من ٢٥٬٠٠٠ ج.م",
    min: 0,
    max: 25_000,
  },
  {
    key: "25k-75k",
    labelEn: "EGP 25,000 – 75,000",
    labelAr: "٢٥٬٠٠٠ – ٧٥٬٠٠٠ ج.م",
    min: 25_000,
    max: 75_000,
  },
  {
    key: "75k-150k",
    labelEn: "EGP 75,000 – 150,000",
    labelAr: "٧٥٬٠٠٠ – ١٥٠٬٠٠٠ ج.م",
    min: 75_000,
    max: 150_000,
  },
  {
    key: "over-150k",
    labelEn: "Over EGP 150,000",
    labelAr: "أكثر من ١٥٠٬٠٠٠ ج.م",
    min: 150_000,
    max: -1,
  },
];

export const SEED_PRODUCTS: SeedProduct[] = [
  {
    id: "nefertari-bridal-set",
    titleEn: "Nefertari Bridal Set",
    titleAr: "طقم نفرتاري",
    descriptionEn:
      "Necklace, earrings and bracelet in hand-worked floral filigree. Comes in a gift box.",
    descriptionAr: "عقد وحلق وغويشة بتصميم زهري مصنوع يدويًا، ويأتي في علبة هدايا.",
    category: "Bridal Sets",
    karat: "21K",
    weight: 45,
    making: 350,
    rating: 4.9,
    reviews: 128,
    imageFile: "gold-bridal-set.jpg",
  },
  {
    id: "lotus-filigree-necklace",
    titleEn: "Lotus Filigree Necklace",
    titleAr: "عقد اللوتس",
    descriptionEn: "Openwork filigree with a teardrop centrepiece and gold bead drops.",
    descriptionAr: "عقد مخرم بتصميم اللوتس وقلادة على شكل قطرة مع حبات ذهب.",
    category: "Necklaces",
    karat: "21K",
    weight: 18.5,
    making: 300,
    rating: 4.8,
    reviews: 96,
    imageFile: "gold-necklace.jpg",
  },
  {
    id: "pharaonic-bangles",
    titleEn: "Pharaonic Bangles (set of 5)",
    titleAr: "غوايش فرعوني",
    descriptionEn: "Engraved bangles with the Eye of Horus, ankh and winged scarab.",
    descriptionAr: "غوايش محفورة بعين حورس والعنخ والجعران المجنح.",
    category: "Bracelets",
    karat: "21K",
    weight: 32,
    making: 250,
    rating: 4.7,
    reviews: 210,
    imageFile: "gold-bangles.jpg",
  },
  {
    id: "gold-pound",
    titleEn: "Gold Pound — Geneh Dahab",
    titleAr: "جنيه ذهب",
    descriptionEn:
      "The classic Egyptian gold pound, 8 grams of 21K. A favourite for saving and gifts.",
    descriptionAr: "جنيه الذهب المصري الكلاسيكي، ٨ جرام عيار ٢١. المفضل للادخار والهدايا.",
    category: "Gold Coins",
    karat: "21K",
    weight: 8,
    making: 100,
    rating: 4.9,
    reviews: 410,
    imageFile: "gold-pound.jpg",
  },
  {
    id: "fine-gold-bar-10g",
    titleEn: "Fine Gold Bar 10g",
    titleAr: "سبيكة ١٠ جرام",
    descriptionEn: "999.9 fine gold bar with certificate. Also available in 1g, 5g, 20g and 50g.",
    descriptionAr: "سبيكة ذهب نقاء ٩٩٩.٩ مع شهادة. متوفرة أيضًا بأوزان ١ و٥ و٢٠ و٥٠ جرام.",
    category: "Gold Bars",
    karat: "24K",
    weight: 10,
    making: 60,
    rating: 5,
    reviews: 88,
    imageFile: "gold-bars.jpg",
  },
  {
    id: "cuban-link-chain",
    titleEn: "Cuban Link Chain",
    titleAr: "سلسلة كوبي",
    descriptionEn: "Solid Cuban links with a secure box clasp. 55 cm.",
    descriptionAr: "سلسلة كوبي متينة بإبزيم صندوق آمن. طول ٥٥ سم.",
    category: "Necklaces",
    karat: "21K",
    weight: 25,
    making: 180,
    rating: 4.7,
    reviews: 73,
    imageFile: "gold-chain.jpg",
  },
  {
    id: "arabic-name-necklace",
    titleEn: "Arabic Name Necklace",
    titleAr: "سلسلة بالاسم",
    descriptionEn: "Any name in Arabic calligraphy on a fine chain. Made to order in 3–5 days.",
    descriptionAr: "أي اسم بخط عربي على سلسلة رفيعة. تُصنع حسب الطلب خلال ٣–٥ أيام.",
    category: "Necklaces",
    karat: "18K",
    weight: 3.5,
    making: 400,
    rating: 4.9,
    reviews: 342,
    imageFile: "gold-pendant.jpg",
  },
  {
    id: "crescent-moon-earrings",
    titleEn: "Crescent Moon Earrings",
    titleAr: "حلق الهلال",
    descriptionEn: "Crescent drops set with clear stones and a fluted gold bead.",
    descriptionAr: "حلق على شكل هلال مرصع بأحجار شفافة وحبة ذهب مخددة.",
    category: "Earrings",
    karat: "18K",
    weight: 7.2,
    making: 280,
    rating: 4.6,
    reviews: 64,
    imageFile: "gold-earrings.jpg",
  },
  {
    id: "everyday-ring-set",
    titleEn: "Everyday Ring Set (3 pcs)",
    titleAr: "طقم خواتم",
    descriptionEn: "Crossover, eternity and hammered bands — stack or wear alone.",
    descriptionAr: "خاتم كروس أوفر وخاتم أبدي وخاتم مطروق — تلبس معًا أو منفردة.",
    category: "Rings",
    karat: "18K",
    weight: 9,
    making: 220,
    rating: 4.5,
    reviews: 152,
    imageFile: "gold-rings.jpg",
  },
  {
    id: "mens-signet-ring",
    titleEn: "Men's Signet Ring",
    titleAr: "خاتم رجالي",
    descriptionEn: "Polished cushion-top signet. Free engraving of initials.",
    descriptionAr: "خاتم رجالي بوجه مستوي مصقول. نقش الأحرف الأولى مجانًا.",
    category: "Rings",
    karat: "21K",
    weight: 12,
    making: 200,
    rating: 4.6,
    reviews: 57,
    imageFile: "gold-signet.jpg",
  },
  {
    id: "coin-charm-anklet",
    titleEn: "Coin Charm Anklet",
    titleAr: "خلخال عملات",
    descriptionEn: "Fine chain with seven little coin charms and an adjustable extender.",
    descriptionAr: "سلسلة رفيعة بسبع عملات صغيرة ووصلة قابلة للتعديل.",
    category: "Anklets",
    karat: "18K",
    weight: 4,
    making: 250,
    rating: 4.4,
    reviews: 39,
    imageFile: "gold-anklet.jpg",
  },
];

export const DEFAULT_SETTINGS: Record<string, string> = {
  "shop.name": "Al-Safa Al-Marwa",
  "shop.nameAr": "الصفا المروة",
  "shop.tagline": "Fine gold jewelry in Dekernes, Dakahlia",
  "shop.taglineAr": "مجوهرات ذهب فاخرة في دكرنس، الدقهلية",
  "shop.phone": "+20 100 000 0000",
  "shop.whatsapp": "201000000000",
  "shop.address": "Dekernes, Dakahlia, Egypt",
  "shop.addressAr": "دكرنس، الدقهلية، مصر",
  "shop.hours": "Daily 11:00 – 22:00",
  "shop.hoursAr": "يوميًا ١١:٠٠ – ٢٢:٠٠",
  "rate.override": "0",
  "rate.24K": "6400",
  "rate.21K": "5600",
  "rate.18K": "4800",
};
