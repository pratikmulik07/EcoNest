import { EducationalArticle } from '../types';

export const INITIAL_ARTICLES: EducationalArticle[] = [
  // 1. Sustainability Basics
  {
    id: 'art_sustainable_consumption',
    title: 'What is Sustainable Consumption in 2026?',
    category: 'Sustainability Basics',
    readTime: '3 min read',
    image: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=700&q=80',
    summary: 'Understanding how circular choices, longevity, and mindful purchasing alter the global footprint of personal lifestyles.',
    author: 'EcoBrand Research Cell',
    publishedDate: 'Sept 2026',
    likesCount: 382,
    content: [
      'Sustainable consumption is not about never buying anything; it is about choosing durable, regenerative, and ethically manufactured goods that replace short-lived disposable items.',
      'The linear "take-make-waste" model has generated millions of tons of non-biodegradable debris. When you shift towards circular consumption, every product you select retains value for years or returns safely to biological cycles.',
      'By making mindful choices in your daily essentials—from bamboo personal care to refillable bottles—a single individual diverts upwards of 40 kg of plastic waste per year.',
    ],
    keyTakeaways: [
      'Focus on "Cost-Per-Use" rather than initial checkout price.',
      'Prioritize natural rapidly renewable feedstocks (bamboo, hemp, cork).',
      'Look for third-party certifications like GOTS, FSC, and Fairtrade.',
    ],
    tags: ['lifestyle', 'basics', 'circular economy', 'mindful shopping'],
  },
  {
    id: 'art_why_reusable_matters',
    title: 'Why Reusable Products Outperform Disposables',
    category: 'Sustainability Basics',
    readTime: '4 min read',
    image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=700&q=80',
    summary: 'The life-cycle breakdown of single-use coffee cups, plastic bottles, and grocery bags vs reusable counterparts.',
    author: 'Dr. Ananya Sharma',
    publishedDate: 'Aug 2026',
    likesCount: 429,
    content: [
      'A single stainless steel bottle offsets its manufacturing footprint after just 20 to 30 uses compared to PET bottled water.',
      'Paper coffee cups are rarely recyclable because they are coated with a hidden polyethylene plastic film that clogs industrial paper hydropulpers.',
      'Carrying a compact reusable tote bag in your everyday backpack prevents over 500 plastic grocery bags from entering storm drains and oceans annually.',
    ],
    keyTakeaways: [
      'Break-even carbon point for a reusable bottle is ~3 weeks of daily use.',
      'Most "paper cups" contain hidden plastic liner films.',
      'Habit stacking (keeping bags near your doorway) ensures 90%+ reusable retention.',
    ],
    tags: ['reusable', 'water bottle', 'single use plastic', 'break even'],
  },

  // 2. Recycling
  {
    id: 'art_recycling_vs_upcycling',
    title: 'Recycling vs Upcycling: The Crucial Difference',
    category: 'Recycling',
    readTime: '3 min read',
    image: 'https://images.unsplash.com/photo-1530587191325-3db32d826c18?auto=format&fit=crop&w=700&q=80',
    summary: 'Why upcycling materials directly at home is energy-superior to downcycling through industrial sorting plants.',
    author: 'Zero-Waste Design Studio',
    publishedDate: 'Sept 2026',
    likesCount: 512,
    content: [
      'Recycling often implies "downcycling": shredding, melting, and re-pelletizing polymers which degrades the fiber length and material purity.',
      'Upcycling, in contrast, takes existing structural materials—like denim pants, timber pallets, or glass jars—and elevates them into high-value functional objects with almost zero energy consumption.',
      'Using our "What Can I Make?" AI scanner, you can convert discarded textile remnants or glass into personalized everyday essentials without industrial processing.',
    ],
    keyTakeaways: [
      'Upcycling preserves existing material energy and tensile strength.',
      'Industrial recycling consumes fossil energy for transit, shredding, and remelting.',
      'Upcycling fosters creative design skills and circular local culture.',
    ],
    tags: ['upcycling', 'diy', 'what can i make', 'circularity'],
  },
  {
    id: 'art_what_materials_recycled',
    title: 'What Can Really Be Recycled in Urban Centers?',
    category: 'Recycling',
    readTime: '5 min read',
    image: 'https://images.unsplash.com/photo-1604187351574-c75ca79f5807?auto=format&fit=crop&w=700&q=80',
    summary: 'A field guide to resin identification codes (1 to 7) and what actually gets reprocessed versus landfilled.',
    author: 'Urban Waste Watch',
    publishedDate: 'July 2026',
    likesCount: 319,
    content: [
      'Only plastics with Resin Code #1 (PET) and Code #2 (HDPE) have stable recycling economic markets.',
      'Plastic bags and thin films (Code #4 LDPE) tangle sorting facility conveyor belts and are often rejected.',
      'Glass and aluminum can be recycled infinitely with zero loss in material quality, making them gold-standard closed-loop materials.',
    ],
    keyTakeaways: [
      'Rinse food residues before recycling to prevent entire batch rejection.',
      'Avoid black plastics because automated optical infrared sorters cannot detect them.',
      'Prefer infinitely recyclable aluminum and glass packaging over multilayer pouches.',
    ],
    tags: ['plastics', 'recycling codes', 'waste management', 'sorting'],
  },

  // 3. Sustainable Shopping
  {
    id: 'art_greenwashing_spotter',
    title: 'How to Spot Greenwashing in 2026',
    category: 'Sustainable Shopping',
    readTime: '4 min read',
    image: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=700&q=80',
    summary: 'Vague buzzwords like "eco-friendly" or "all-natural" decoded with verifiable audit benchmarks.',
    author: 'EcoBrand Standards Council',
    publishedDate: 'Aug 2026',
    likesCount: 476,
    content: [
      'Brands frequently use muted green imagery and ambiguous adjectives like "clean", "earth-loving", and "green" without offering verifiable supply chain data.',
      'Always look for verifiable standard certifications: FSC (Forest Stewardship Council) for wood/bamboo, GOTS for organic textiles, and Fairtrade for artisan wages.',
      'True sustainable brands openly declare product durability, repairability, and end-of-life disposal instructions.',
    ],
    keyTakeaways: [
      'Vague buzzwords without data are the #1 red flag.',
      'Demand material composition breakdowns (e.g., 100% bamboo vs bamboo-plastic composite).',
      'Examine the shipping packaging: plastic bubble wrap often betrays pseudo-green products.',
    ],
    tags: ['greenwashing', 'certifications', 'smart shopping', 'supply chain'],
  },
  {
    id: 'art_material_guide_bamboo',
    title: 'The Sustainable Material Guide: Bamboo vs Metal vs Glass',
    category: 'Sustainable Shopping',
    readTime: '4 min read',
    image: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&w=700&q=80',
    summary: 'Comparing carbon footprints, water consumption, and recyclability across top eco materials.',
    author: 'Materials Life-Cycle Lab',
    publishedDate: 'Sept 2026',
    likesCount: 395,
    content: [
      'Bamboo is technically a grass, not a tree. It grows up to 1 meter per day, self-regenerates from root systems, and absorbs 35% more carbon dioxide than equivalent tree stands.',
      'Stainless steel has a higher initial embodied energy due to smelting, but its 10+ year lifespan makes it one of the most environmentally sound drinkware investments.',
      'Selecting the right material depends on your use case: choose bamboo for lightweight travel, steel for insulation, and glass for pure pantry taste.',
    ],
    keyTakeaways: [
      'Bamboo is the fastest replenishing plant on Earth.',
      'Stainless steel offers the highest life-cycle durability and hygiene.',
      'Match the material strength to your daily commute habits.',
    ],
    tags: ['bamboo', 'materials', 'carbon footprint', 'durability'],
  },
];

export const DAILY_TIPS = [
  {
    tip: 'Keep a clean cloth tote in your everyday bag so you never need to accept a plastic shopping bag when making spontaneous purchases.',
    author: 'Daily Eco Habit',
    icon: '🌱',
  },
  {
    tip: 'Wash clothes in cold water whenever possible; 75% to 90% of a washing machine’s energy goes toward heating the water!',
    author: 'Energy Conservation',
    icon: '💧',
  },
  {
    tip: 'Save glass jars from pasta sauce or jams! Soak in warm soapy water with a spoon of baking soda for an instant zero-cost pantry container.',
    author: 'Upcycle Tip',
    icon: '🫙',
  },
  {
    tip: 'Choose loose produce rather than plastic-wrapped vegetables at your local mandi or grocery store.',
    author: 'Zero-Waste Living',
    icon: '🥑',
  },
];
