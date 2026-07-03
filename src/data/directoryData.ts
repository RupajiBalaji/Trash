export interface DirectoryItem {
  name: string;
  category: "Wet/Biodegradable" | "Dry/Recyclable" | "Hazardous";
  description: string;
  parentTip: string;
}

export const directoryCategories = [
  {
    id: "dry",
    title: "Dry Waste (Paper, Cardboard, Plastic)",
    color: "blue",
    note: "Many neighborhoods have doorstep scrap pickup services or local dry-waste collectors who can recycle these materials."
  },
  {
    id: "wet",
    title: "Wet Waste (Biodegradable, Organic)",
    color: "green",
    note: "Wet waste turns into rich soil! Composting at home or using municipal organic bins keeps this out of landfills."
  },
  {
    id: "hazardous",
    title: "Hazardous (Batteries, e-Waste, Lights)",
    color: "red",
    note: "These need special collection boxes or toxic-waste drop points. NEVER throw them in the regular trash bins!"
  }
];

export const directoryItems: DirectoryItem[] = [
  // Dry
  {
    name: "newspaper",
    category: "Dry/Recyclable",
    description: "Old news and papers are perfectly dry and easy to recycle.",
    parentTip: "Bundle them up neatly. Scrap dealers often buy these in bulk!"
  },
  {
    name: "cardboard",
    category: "Dry/Recyclable",
    description: "Boxes from packages and cereal boxes.",
    parentTip: "Flatten them completely to save space in the dry bin!"
  },
  {
    name: "plastic container",
    category: "Dry/Recyclable",
    description: "Yogurt tubs, milk jugs, and clear plastic tubs.",
    parentTip: "Give them a quick rinse with water so they don't smell!"
  },
  {
    name: "polythene bag",
    category: "Dry/Recyclable",
    description: "Soft shopping bags, food wrappers, and plastic films.",
    parentTip: "Collect all small bags inside one larger bag so they don't blow away."
  },
  {
    name: "old clothes",
    category: "Dry/Recyclable",
    description: "Worn-out shirts, trousers, and clean dry textiles.",
    parentTip: "If still wearable, donation drop points are best! Otherwise, find a textile recycling center."
  },
  {
    name: "glass bottle",
    category: "Dry/Recyclable",
    description: "Empty jam jars, juice bottles, and medicine glass.",
    parentTip: "Wash and store safely to avoid breakages in the recycle bin."
  },
  {
    name: "metal can",
    category: "Dry/Recyclable",
    description: "Soda cans and tin containers for food.",
    parentTip: "Rinse and press the lids inside the cans."
  },

  // Wet
  {
    name: "banana peel",
    category: "Wet/Biodegradable",
    description: "Leftover fruit peels from bananas, apples, or oranges.",
    parentTip: "Composts wonderfully! Turns into rich plant food in weeks."
  },
  {
    name: "vegetable scraps",
    category: "Wet/Biodegradable",
    description: "Potato skins, onion peels, and carrot tops.",
    parentTip: "Keep food waste separate from plastic wrappers!"
  },
  {
    name: "eggshells",
    category: "Wet/Biodegradable",
    description: "Crunchy shell leftovers from breakfast eggs.",
    parentTip: "Crush them up and sprinkle in garden soil; plants love the calcium!"
  },
  {
    name: "tea bags",
    category: "Wet/Biodegradable",
    description: "Used tea bags or coffee grounds.",
    parentTip: "Make sure to remove any plastic tags or metal staples before composting."
  },
  {
    name: "dried leaves",
    category: "Wet/Biodegradable",
    description: "Fallen leaves and small twigs from house plants or the garden.",
    parentTip: "Great 'brown' material to mix with 'green' food waste in a home compost bin."
  },

  // Hazardous
  {
    name: "battery",
    category: "Hazardous",
    description: "AA, AAA, button batteries, and phone batteries.",
    parentTip: "Can leak chemicals if thrown in regular bins. Collect in a dry jar and take to e-waste boxes."
  },
  {
    name: "old lightbulb",
    category: "Hazardous",
    description: "LED bulbs, tube lights, and old incandescent bulbs.",
    parentTip: "Fluorescent tubes contain mercury. Wrap them in paper and take to specialized drop-offs."
  },
  {
    name: "electronic waste",
    category: "Hazardous",
    description: "Broken chargers, old phones, calculators, and computer mouse.",
    parentTip: "Most electronics retailers have free drop boxes for old cords and gadgets."
  },
  {
    name: "expired medicine",
    category: "Hazardous",
    description: "Old pills, syrups, or medicinal tubes.",
    parentTip: "Never flush them down the drain! Check for local pharmaceutical take-back programs."
  },
  {
    name: "spray can",
    category: "Hazardous",
    description: "Aerosol cans like room fresheners or paint sprayers.",
    parentTip: "These are pressurized and must not be crushed or thrown in regular bins unless completely empty."
  }
];
