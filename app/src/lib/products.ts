export type CategorySlug =
  | "industrial"
  | "concrete"
  | "tubtile"
  | "decorative"
  | "artist"
  | "architectural";

export type Category = {
  slug: CategorySlug;
  name: string;
  code: string;
  description: string;
};

export const CATEGORIES: Category[] = [
  {
    slug: "industrial",
    name: "Industrial Coatings",
    code: "IND-001",
    description:
      "High-performance finishes for metal, maintenance, OEM, marine, antenna, government specification, and heavy-equipment work.",
  },
  {
    slug: "concrete",
    name: "Concrete Sealers",
    code: "CON-002",
    description:
      "Countertop, floor, paver, penetrating, high-gloss, and water-based sealer options for concrete, masonry, and stone.",
  },
  {
    slug: "tubtile",
    name: "Tub & Tile Coatings",
    code: "TBT-003",
    description:
      "Professional refinishing systems for tubs, tile, sinks, toilets, countertops, and fixtures.",
  },
  {
    slug: "decorative",
    name: "Decorative Coatings",
    code: "DEC-004",
    description:
      "Metallic, patina, rust, and architectural effects for paintable surfaces.",
  },
  {
    slug: "artist",
    name: "Artist Oils",
    code: "ART-005",
    description:
      "Heavily pigmented professional oil colors with buttery texture and consistent quality.",
  },
  {
    slug: "architectural",
    name: "Architectural Coatings",
    code: "ARC-006",
    description:
      "Interior and exterior coatings, urethane systems, waterborne primers, and custom formulation support.",
  },
];

export type Product = {
  id: string;
  category: CategorySlug;
  name: string;
  code?: string;
  size?: string;
  description: string;
  /** Reference price in USD, pending company verification. */
  price: number;
};

export const PRODUCTS: Product[] = [
  {
    id: "ir6",
    category: "decorative",
    name: "Rust Antiquing Solution",
    code: "IR6",
    size: "8 oz",
    description: "Aged Metal Effects antiquing solution for authentic rust finishes.",
    price: 16.75,
  },
  {
    id: "pg6",
    category: "decorative",
    name: "Patina Green Antiquing Solution",
    code: "PG6",
    size: "8 oz",
    description: "Creates verdigris patina effects over compatible metallic surfacers.",
    price: 16.75,
  },
  {
    id: "sp1",
    category: "decorative",
    name: "Silver Metallic Surfacer",
    code: "SP1",
    size: "16 oz",
    description: "Ground aluminum metallic coating for wood, plaster, ceramic, and metal.",
    price: 46.1,
  },
  {
    id: "pp1",
    category: "decorative",
    name: "Primer & Clear Sealer",
    code: "PP1",
    size: "16 oz",
    description: "Primer and clear sealer for Modern Options and Sophisticated Finishes systems.",
    price: 34.05,
  },
  {
    id: "d236",
    category: "artist",
    name: "Cobalt Blue",
    code: "D236",
    description: "Classic Artist Oils professional blue oil color.",
    price: 48.15,
  },
  {
    id: "d277",
    category: "artist",
    name: "Radiant Yellow",
    code: "D277",
    description: "Classic Artist Oils warm yellow color.",
    price: 24.1,
  },
  {
    id: "d272",
    category: "artist",
    name: "Titanium White",
    code: "D272",
    description: "Classic Artist Oils essential white.",
    price: 16.6,
  },
  {
    id: "d200",
    category: "artist",
    name: "Carbon Black",
    code: "D200",
    description: "Classic Artist Oils neutral black.",
    price: 16.6,
  },
  {
    id: "wm-gloss",
    category: "concrete",
    name: "White Mountain High Gloss Sealer",
    description: "Protective high-gloss sealer for decorative concrete and masonry.",
    price: 39.95,
  },
  {
    id: "wb-sealer",
    category: "concrete",
    name: "Water Based Concrete Sealer",
    description: "Low-odor, water-based concrete sealer for masonry and stone.",
    price: 42.5,
  },
  {
    id: "lv-enamel",
    category: "industrial",
    name: "Low VOC Industrial Enamel",
    description: "Industrial maintenance finish for performance and compliance needs.",
    price: 78.0,
  },
  {
    id: "ep-primer",
    category: "industrial",
    name: "Epoxy Primer System",
    description: "Durable primer foundation for demanding industrial environments.",
    price: 86.0,
  },
  {
    id: "lp-kit",
    category: "tubtile",
    name: "Liquid Porcelain Tub & Tile Kit",
    description: "Professional refinishing coating system for tub and tile surfaces.",
    price: 129.0,
  },
  {
    id: "dk-acrylic",
    category: "architectural",
    name: "DuraKote Exterior Acrylic",
    description: "Premium architectural exterior acrylic coating.",
    price: 64.0,
  },
];

export function formatUsd(n: number): string {
  return n.toLocaleString("en-US", { style: "currency", currency: "USD" });
}
