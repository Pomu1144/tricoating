export type SdsIngredient = { name: string; concentration: string };

export type SdsRecord = {
  code: string;
  name: string;
  use: string;
  hazards: string[];
  statements: string[];
  transport: {
    unNa: string;
    shippingName: string;
    hazardClass: string;
    packagingGroup?: string;
  };
  ingredients: SdsIngredient[];
};

/**
 * Website-displayed summaries transcribed from the previous site.
 * NOT official SDS documents. The current official SDS and product
 * label control. Verify against controlled company documents.
 */
export const SDS_RECORDS: SdsRecord[] = [
  {
    code: "249GFC700",
    name: "Trilon Liquid Porcelain FC White",
    use: "Blended aliphatic polyisocyanate.",
    hazards: [
      "Flammable Liquid (Category 3)",
      "Specific target organ toxicity, single exposure (Category 3, respiratory system)",
      "Aquatic Acute (Category 3)",
    ],
    statements: [
      "Flammable liquid and vapor.",
      "May cause drowsiness or dizziness.",
      "Harmful to aquatic life.",
    ],
    transport: {
      unNa: "UN1263",
      shippingName: "PAINT (contains N-Butyl Acetate)",
      hazardClass: "3",
      packagingGroup: "III",
    },
    ingredients: [
      { name: "Acrylic copolymer", concentration: "25-50%" },
      { name: "Titanium Dioxide", concentration: "25-50%" },
      { name: "n-Butyl Acetate", concentration: "15-25%" },
      { name: "Tert-butyl acetate", concentration: "5-10%" },
      { name: "Barium Sulfate", concentration: "2.5-5%" },
      { name: "Reactive diluent", concentration: "2.5-5%" },
      { name: "Dipropylene glycol dimethyl ether", concentration: "2.5-5%" },
    ],
  },
  {
    code: "249GFC900",
    name: "Trilon S 249 Series Clear Acrylic Urethane",
    use: "Blended aliphatic polyisocyanate clear coating.",
    hazards: [
      "Flammable Liquid (Category 3)",
      "Serious eye damage / eye irritation (Category 2A)",
      "Skin corrosion / irritation (Category 2)",
      "Skin sensitization (Category 1)",
      "Specific target organ toxicity, single exposure (Category 3, respiratory system)",
      "Aquatic Acute (Category 3)",
      "Acute toxicity, inhalation (Category 4)",
    ],
    statements: [
      "Flammable liquid and vapor.",
      "Causes skin and serious eye irritation.",
      "May cause an allergic skin reaction.",
      "Harmful if inhaled.",
      "May cause respiratory irritation, drowsiness, or dizziness.",
      "Harmful to aquatic life.",
    ],
    transport: {
      unNa: "1263",
      shippingName: "PAINT",
      hazardClass: "3",
      packagingGroup: "III",
    },
    ingredients: [
      { name: "Acrylic copolymer", concentration: "25-50%" },
      { name: "n-Butyl Acetate", concentration: "25-50%" },
      { name: "Tert-butyl acetate", concentration: "5-10%" },
      { name: "Benzene-1-chloro-4(trifluoromethyl)-", concentration: "5-10%" },
      { name: "Dipropylene glycol dimethyl ether", concentration: "5-10%" },
      { name: "Reactive diluent", concentration: "2.5-5%" },
    ],
  },
  {
    code: "249B",
    name: "Trilon S Activator",
    use: "Blended aliphatic polyisocyanate.",
    hazards: [
      "Flammable Liquid (Category 3)",
      "Acute toxicity, inhalation (Category 2)",
      "Skin sensitization (Category 1)",
      "Specific target organ toxicity, single exposure (Category 3, respiratory system)",
    ],
    statements: [
      "Flammable liquid and vapor.",
      "May cause an allergic skin reaction.",
      "Harmful if inhaled.",
      "May cause respiratory irritation.",
    ],
    transport: {
      unNa: "UN1263",
      shippingName: "PAINT (contains N-Butyl Acetate, Petroleum Solvent, Xylene)",
      hazardClass: "3",
      packagingGroup: "III (air/sea), I (land)",
    },
    ingredients: [
      { name: "Homopolymer of Hexamethylene Diisocyanate", concentration: "60-100%" },
      { name: "n-Butyl Acetate", concentration: "3-7%" },
      { name: "Petroleum Solvent", concentration: "1-5%" },
      { name: "1,2,4-Trimethylbenzene", concentration: "1-5%" },
      { name: "Hexamethylene-1,6-Diisocyanate", concentration: "<=0.15%" },
      { name: "1,3,5-Trimethylbenzene", concentration: "0.1-1%" },
      { name: "N-Propyl benzene", concentration: "0.1-1%" },
      { name: "Xylene", concentration: "0.1-1%" },
    ],
  },
  {
    code: "961P700",
    name: "TriCryl FD Primer, White",
    use: "Fast dry primer.",
    hazards: [
      "Flammable Liquids (Category 2)",
      "Eye irritation (Category 2A)",
      "Skin irritation (Category 2)",
      "Specific target organ toxicity, single exposure, narcotic effect (Category 3)",
      "Acute aquatic toxicity (Category 2)",
      "Acute toxicity, dermal (Category 5)",
      "Acute toxicity, oral (Category 5)",
    ],
    statements: [
      "Highly flammable liquid and vapor.",
      "May be harmful if swallowed or in contact with skin.",
      "Causes skin and serious eye irritation.",
      "May cause drowsiness or dizziness.",
      "Toxic to aquatic life.",
    ],
    transport: {
      unNa: "1263",
      shippingName: "PAINT RELATED MATERIAL",
      hazardClass: "3",
      packagingGroup: "II",
    },
    ingredients: [
      { name: "Methyl Acetate", concentration: "25-50%" },
      { name: "Benzene-1-chloro-4(trifluoromethyl)-", concentration: "25-50%" },
      { name: "Titanium Dioxide", concentration: "15-25%" },
      { name: "Acrylic Copolymer", concentration: "15-25%" },
      { name: "Magnesium silicate hydrate", concentration: "10-15%" },
      { name: "Ground Calcium Carbonate", concentration: "5-10%" },
      { name: "2-butoxy ethyl acetate", concentration: "2.5-5%" },
      { name: "Epoxy Resin DER331", concentration: "1.0-2.5%" },
    ],
  },
  {
    code: "AT78",
    name: "0-VOC Low Odor Reducer",
    use: "0 VOC solvent.",
    hazards: [
      "Flammable liquids (Category 1)",
      "Eye irritation (Category 2A)",
      "Skin irritation (Category 2)",
      "Aspiration hazard (Category 2)",
      "Specific target organ toxicity, single exposure, narcotic effect (Category 3)",
      "Acute aquatic toxicity (Category 2)",
      "Acute toxicity, dermal (Category 5)",
      "Acute toxicity, oral (Category 5)",
    ],
    statements: [
      "Extremely flammable liquid and vapor.",
      "May be harmful if swallowed or in contact with skin.",
      "May be harmful if swallowed and enters airways.",
      "Causes skin and serious eye irritation.",
      "May cause drowsiness or dizziness.",
      "Toxic to aquatic life.",
    ],
    transport: {
      unNa: "1263",
      shippingName: "PAINT RELATED MATERIAL",
      hazardClass: "3",
    },
    ingredients: [
      { name: "Benzene-1-chloro-4(trifluoromethyl)-", concentration: "50-75%" },
      { name: "Methyl Acetate 99%", concentration: "15-25%" },
      { name: "Acetone", concentration: "15-25%" },
    ],
  },
];
