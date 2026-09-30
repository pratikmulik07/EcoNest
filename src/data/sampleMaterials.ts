export interface SampleMaterialPreset {
  id: string;
  name: string;
  category: string;
  description: string;
  imageUrl: string;
  materialsHint: string[];
  colors: string[];
}

export const SAMPLE_MATERIAL_PRESETS: SampleMaterialPreset[] = [
  {
    id: 'sample_denim',
    name: 'Worn Blue Denim Jeans',
    category: 'Textiles',
    description: 'Post-consumer worn denim pants with intact back pockets and durable twill cotton weave.',
    imageUrl: 'https://images.unsplash.com/photo-1542272604-780c96856592?auto=format&fit=crop&w=600&q=80',
    materialsHint: ['Denim jeans', 'Cotton twill'],
    colors: ['Indigo Blue', 'Faded Navy'],
  },
  {
    id: 'sample_wood',
    name: 'Reclaimed Wooden Slat / Pallet',
    category: 'Wood & Timber',
    description: 'Untreated reclaimed pine timber piece with beautiful natural grain and structural strength.',
    imageUrl: 'https://images.unsplash.com/photo-1533090161767-e6ffed986c88?auto=format&fit=crop&w=600&q=80',
    materialsHint: ['Reclaimed wood', 'Pine pallet'],
    colors: ['Warm Oak', 'Natural Wood'],
  },
  {
    id: 'sample_glass',
    name: 'Empty Glass Kombucha / Jam Jar',
    category: 'Glass Containers',
    description: 'Thick clear food-grade glass container with wide mouth, fully intact.',
    imageUrl: 'https://images.unsplash.com/photo-1463936575829-25148e1db1b8?auto=format&fit=crop&w=600&q=80',
    materialsHint: ['Glass bottle', 'Food jar'],
    colors: ['Clear Transparent', 'Amber'],
  },
  {
    id: 'sample_tshirt',
    name: 'Cotton T-Shirt Fabric Scraps',
    category: 'Textile Scraps',
    description: 'Clean jersey cotton remnants from outgrown tees, soft and stretchable.',
    imageUrl: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=600&q=80',
    materialsHint: ['Cotton jersey', 'T-shirt scraps'],
    colors: ['Heather Grey', 'Sage Green'],
  },
  {
    id: 'sample_multi_combo',
    name: 'Multi-Material: Denim Jeans + Glass Bottle',
    category: 'Multi-Material Bundle',
    description: 'Combining thick denim fabric with an empty glass bottle for hybrid creations like insulated plant sleeves or organizers.',
    imageUrl: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=600&q=80',
    materialsHint: ['Denim fabric', 'Glass bottle', 'Jute cord'],
    colors: ['Indigo', 'Clear Glass', 'Tan'],
  },
];
