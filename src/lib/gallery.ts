import necklace from "@/assets/gold-necklace.jpg";
import rings from "@/assets/gold-rings.jpg";
import bangles from "@/assets/gold-bangles.jpg";
import earrings from "@/assets/gold-earrings.jpg";
import bars from "@/assets/gold-bars.jpg";
import pendant from "@/assets/gold-pendant.jpg";
import bridal from "@/assets/gold-bridal-set.jpg";

export const CATEGORIES = ["All", "Necklaces", "Rings", "Bracelets", "Earrings", "Bridal", "Bullion"] as const;
export type Category = (typeof CATEGORIES)[number];

export type GalleryItem = {
  id: string;
  title: string;
  titleAr: string;
  category: Exclude<Category, "All">;
  karat: string;
  description: string;
  image: string;
};

export const GALLERY: GalleryItem[] = [
  {
    id: "bridal-set",
    title: "Nefertari Bridal Set",
    titleAr: "طقم نفرتاري",
    category: "Bridal",
    karat: "21K",
    description: "Necklace, earrings and bracelet in hand-worked floral filigree.",
    image: bridal,
  },
  {
    id: "filigree-necklace",
    title: "Lotus Filigree Necklace",
    titleAr: "عقد اللوتس",
    category: "Necklaces",
    karat: "21K",
    description: "Openwork filigree with a teardrop centrepiece and gold bead drops.",
    image: necklace,
  },
  {
    id: "pharaoh-bangles",
    title: "Pharaonic Bangles",
    titleAr: "غوايش فرعوني",
    category: "Bracelets",
    karat: "21K",
    description: "Engraved bangles with the Eye of Horus, ankh and winged scarab.",
    image: bangles,
  },
  {
    id: "crescent-earrings",
    title: "Crescent Moon Earrings",
    titleAr: "حلق الهلال",
    category: "Earrings",
    karat: "18K",
    description: "Crescent drops set with clear stones and a fluted gold bead.",
    image: earrings,
  },
  {
    id: "rings-trio",
    title: "Everyday Rings",
    titleAr: "خواتم يومية",
    category: "Rings",
    karat: "18K",
    description: "Crossover, eternity and hammered bands — stack or wear alone.",
    image: rings,
  },
  {
    id: "name-pendant",
    title: "Arabic Name Necklace",
    titleAr: "سلسلة بالاسم",
    category: "Necklaces",
    karat: "18K",
    description: "Custom name in Arabic calligraphy on a fine chain. Made to order.",
    image: pendant,
  },
  {
    id: "bullion",
    title: "Gold Bars & Coins",
    titleAr: "سبائك وجنيهات",
    category: "Bullion",
    karat: "24K",
    description: "Certified bars and coins for saving and investment, from 1g upward.",
    image: bars,
  },
];
