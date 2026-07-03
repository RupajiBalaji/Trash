export interface RewardProduct {
  id: string;
  title: string;
  description: string;
  cost: number;
  category: "toys" | "stationery" | "food";
  icon: string;
  image: string;
  discount: string;
}

export const REWARD_PRODUCTS: RewardProduct[] = [
  // Toys Category
  {
    id: "toy_wood_puzzle",
    title: "Wooden Puzzle Kit 🧩",
    description: "Get 15% off any durable wooden development puzzle at Eco-Toy Depot!",
    cost: 40,
    category: "toys",
    icon: "🧸",
    image: "https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=300&auto=format&fit=crop&q=65",
    discount: "15% OFF"
  },
  {
    id: "toy_solar_wind",
    title: "Eco Science Lab Box 🧪",
    description: "Unlock a complete solar-powered windmill science building kit!",
    cost: 80,
    category: "toys",
    icon: "🧪",
    image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=300&auto=format&fit=crop&q=65",
    discount: "Free Lab Kit"
  },
  {
    id: "toy_clay_play",
    title: "Organic DIY Clay Playkit 🎨",
    description: "Buy One Get One Free organic plant-based non-toxic sculpting clay kit.",
    cost: 120,
    category: "toys",
    icon: "🎨",
    image: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=300&auto=format&fit=crop&q=65",
    discount: "BOGO FREE"
  },

  // Stationery Category
  {
    id: "stat_adventure_book",
    title: "Happy Sprout Storybook 📚",
    description: "Save 25% on any kid-friendly recycling adventure book or magazine!",
    cost: 30,
    category: "stationery",
    icon: "📚",
    image: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=300&auto=format&fit=crop&q=65",
    discount: "25% OFF"
  },
  {
    id: "stat_seed_pencil",
    title: "Seed Pencil 10-Pack ✏️",
    description: "Claim a set of recycled color pencils that can be planted after use to grow flowers!",
    cost: 60,
    category: "stationery",
    icon: "✏️",
    image: "https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?w=300&auto=format&fit=crop&q=65",
    discount: "Free Pencils"
  },
  {
    id: "stat_milk_sketch",
    title: "Recycled Milk Sketchpad 📓",
    description: "Receive a thick artistic sketchbook made entirely from recycled juice & milk cartons.",
    cost: 90,
    category: "stationery",
    icon: "📓",
    image: "https://images.unsplash.com/photo-1531346878377-a5be20888e57?w=300&auto=format&fit=crop&q=65",
    discount: "Free Sketchpad"
  },

  // Food Category
  {
    id: "food_berry_smoothie",
    title: "Green Earth Fruits Smoothie 🍓",
    description: "Buy One Get One on any vitamin-packed kid's size fruit berry smoothie at Sweet Sprouts!",
    cost: 25,
    category: "food",
    icon: "🍓",
    image: "https://images.unsplash.com/photo-1553530666-ba11a7da3888?w=300&auto=format&fit=crop&q=65",
    discount: "BOGO Smoothies"
  },
  {
    id: "food_veggie_kids",
    title: "Eco Kids Meal Deal 🍔",
    description: "Enjoy 20% off any organic toddler veggie burger meal served with sweet apple wedges!",
    cost: 50,
    category: "food",
    icon: "🍔",
    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=300&auto=format&fit=crop&q=65",
    discount: "20% OFF Meal"
  },
  {
    id: "food_organic_juice",
    title: "Super Sprout Juice Carton 🧃",
    description: "Free cold-pressed organic juice carton with any wrap or meal purchase!",
    cost: 15,
    category: "food",
    icon: "🧃",
    image: "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=300&auto=format&fit=crop&q=65",
    discount: "Free Juice"
  }
];
