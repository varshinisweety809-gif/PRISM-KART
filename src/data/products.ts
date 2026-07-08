/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Product, Review } from '../types';

export const CATEGORIES = ['All', 'Tech', 'Apparel', 'Living', 'Wellness', 'Books'];

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 1,
    name: "Aether Pro Wireless Headphones",
    description: "Premium active noise-cancelling headphones with pristine acoustic engineering.",
    fullDescription: "Designed for discerning audiophiles, the Aether Pro represents the pinnacle of wireless acoustics. Combining world-class adaptive noise cancellation with high-resolution custom drivers, it delivers an expansive, detailed soundstage. Built from lightweight aircraft-grade aluminum and plush memory foam, it guarantees long-wear luxury.",
    price: 299,
    rating: 4.8,
    reviewCount: 142,
    category: "Tech",
    images: [
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1484704849700-f032a568e944?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=600&q=80"
    ],
    colors: ["Charcoal Obsidian", "Alabaster White", "Sage Green"],
    stock: 24,
    isFeatured: true,
    tags: ["Best Seller", "Hi-Res Audio"],
    specs: {
      "Driver Size": "40mm Custom Dynamic",
      "Bluetooth Version": "5.2 (multipoint support)",
      "Battery Life": "40 hours (ANC on), 55 hours (ANC off)",
      "Charging Port": "USB-C (Fast Charge: 10 mins = 5 hrs playback)",
      "Weight": "250g",
      "Noise Isolation": "Hybrid Adaptive ANC"
    }
  },
  {
    id: 2,
    name: "Chronos Minimal Smartwatch",
    description: "Elegant wrist companion tracking health metrics with high-definition clarity.",
    fullDescription: "Chronos is an elegant smartwatch that bridges the gap between classic horology and modern intelligence. Encased in a polished 316L stainless steel frame, it sports a gorgeous always-on AMOLED display. It tracks comprehensive vital statistics (heart rate, SpO2, sleep architecture) while blending into any formal or athletic wardrobe.",
    price: 199,
    rating: 4.6,
    reviewCount: 89,
    category: "Tech",
    images: [
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?auto=format&fit=crop&w=600&q=80"
    ],
    colors: ["Midnight Black", "Lunar Silver", "Rose Sand"],
    stock: 15,
    isFeatured: true,
    tags: ["New Release", "Staff Pick"],
    specs: {
      "Display": "1.43-inch Always-On AMOLED",
      "Case Material": "316L Stainless Steel",
      "Water Resistance": "5 ATM (up to 50 meters)",
      "Battery Life": "Up to 7 days standard, 14 days power saving",
      "Sensors": "Optical Heart Rate, SpO2, Accelerometer, Gyroscope",
      "Compatibility": "iOS & Android companion app"
    }
  },
  {
    id: 3,
    name: "Merino Wool Everyday Crewneck",
    description: "Unparalleled soft merino wool designed for optimal breathability and layers.",
    fullDescription: "Woven from 100% fine Australian merino wool, this crewneck sweater is a masterclass in functional minimalism. Merino's natural fibers regulate your body temperature, wick moisture, and resist odors inherently. This mid-weight knit drape is perfect on its own or layered over collared shirts.",
    price: 85,
    rating: 4.7,
    reviewCount: 204,
    category: "Apparel",
    images: [
      "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1614975058789-41316d0e2e9c?auto=format&fit=crop&w=600&q=80"
    ],
    colors: ["Navy Blue", "Heather Gray", "Oatmeal Warmth"],
    sizes: ["S", "M", "L", "XL"],
    stock: 45,
    isFeatured: false,
    tags: ["100% Organic", "Premium Layer"],
    specs: {
      "Material": "100% Extrafine Australian Merino Wool",
      "Weight": "240 GSM (Mid-weight)",
      "Fit": "Tailored Relaxed Fit",
      "Care Instructions": "Dry clean or hand wash cold, lay flat to dry",
      "Origin": "Ethically spun in Italy"
    }
  },
  {
    id: 4,
    name: "Solis Amber Glass Candle Set",
    description: "Hand-poured soy wax candles creating deep notes of Sandalwood & Amber.",
    fullDescription: "Enrich your sanctuary with the warming scent profile of the Solis Amber glass set. Featuring two distinct fragrance notes, Bergamot Driftwood and Sandalwood Amber, these soy wax candles are hand-poured in custom apothecary glass. Cotton wicks provide a clean, soot-free burn that gently releases aromatherapy benefits.",
    price: 42,
    rating: 4.9,
    reviewCount: 312,
    category: "Living",
    images: [
      "https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=600&q=80"
    ],
    stock: 60,
    isFeatured: true,
    tags: ["Eco-Friendly", "Home Accents"],
    specs: {
      "Wax Type": "100% Natural Soy Wax",
      "Scent Formulation": "Pure Botanical Essential Oils",
      "Burn Time": "45 hours per candle (90 hours total)",
      "Container": "Recyclable Amber Glass Jar with metal lid",
      "Pack Contents": "1x Sandalwood Amber, 1x Bergamot Driftwood"
    }
  },
  {
    id: 5,
    name: "Aura Ergonomic Yoga Mat",
    description: "Non-slip eco-friendly rubber mat with precision alignment guidelines.",
    fullDescription: "Constructed from sustainably harvested natural tree rubber, the Aura Yoga Mat offers superior wet-and-dry grip. Its 6mm high-density cushioned base protects joints during demanding transitions. The laser-etched alignment markings guide your hand and foot placements with geometric precision.",
    price: 68,
    rating: 4.5,
    reviewCount: 76,
    category: "Wellness",
    images: [
      "https://images.unsplash.com/photo-1592432678016-e910b452f9a2?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?auto=format&fit=crop&w=600&q=80"
    ],
    colors: ["Dusty Rose", "Forest Green", "Deep Teal"],
    stock: 18,
    isFeatured: false,
    tags: ["Sustainable", "Premium Support"],
    specs: {
      "Material": "Biodegradable Natural Tree Rubber (No PVC/TPE)",
      "Thickness": "6mm (High Density)",
      "Dimensions": "183cm x 68cm",
      "Weight": "2.8kg",
      "Surface Texture": "Textured Non-Slip Matte Finish"
    }
  },
  {
    id: 6,
    name: "Designing with Intent (Hardcover)",
    description: "The definitive guide to product ergonomics, structural beauty, and graphics.",
    fullDescription: "An immersive masterclass in visual storytelling and product formulation. Written by industry veteran Elena Rostova, Designing with Intent breaks down historical design movements, ergonomic design parameters, and modern aesthetic guidelines. Illustrated with high-definition photographs and blueprint schemas on archival paper.",
    price: 34,
    rating: 4.9,
    reviewCount: 52,
    category: "Books",
    images: [
      "https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=600&q=80"
    ],
    stock: 30,
    isFeatured: false,
    tags: ["Collector's Edition", "Critically Acclaimed"],
    specs: {
      "Author": "Elena Rostova",
      "Publisher": "Aesthetic Press (2025 Edition)",
      "Format": "Hardcover, cloth-bound with gold-leaf debossing",
      "Pages": "312 pages (FSC Certified Premium paper)",
      "Dimensions": "22.5cm x 28.5cm"
    }
  },
  {
    id: 7,
    name: "Lumina Portable Projector",
    description: "Compact 1080p smart projector bringing theater quality to any vertical wall.",
    fullDescription: "Lumina packs spectacular entertainment into a handheld chassis. Featuring native Full HD 1080p decoding, 500 ANSI Lumens, and automatic keystone correction, it sets up in seconds. An integrated battery lets you host screen nights outdoors, while high-fidelity audio drivers supply crisp, powerful sound.",
    price: 450,
    rating: 4.4,
    reviewCount: 38,
    category: "Tech",
    images: [
      "https://images.unsplash.com/photo-1535016120720-40c646be5580?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&w=600&q=80"
    ],
    stock: 8,
    isFeatured: true,
    tags: ["High Fidelity", "Limited Stock"],
    specs: {
      "Resolution": "Native 1920x1080p (4K Supported)",
      "Brightness": "500 ANSI Lumens",
      "Contrast Ratio": "10,000:1",
      "Audio": "Dual 5W Speakers with Dolby Audio tuning",
      "OS": "Smart OS with pre-installed streaming clients",
      "Connectivity": "HDMI, USB, Wi-Fi 6, Bluetooth 5.0"
    }
  },
  {
    id: 8,
    name: "Nectar Ultrasonic Diffuser",
    description: "Quiet ceramic-cover cold mist humidifier with warm breathing light settings.",
    fullDescription: "Carved from premium volcanic stone-finish ceramic, the Nectar Diffuser purifies any space with cool botanical vapors. Its proprietary ultrasonic chip vibrates at 2.4MHz, releasing delicate scent mist without heating, preserving essential oil compounds. Features a peaceful amber pulse light mimicking serene breath loops.",
    price: 55,
    rating: 4.7,
    reviewCount: 118,
    category: "Wellness",
    images: [
      "https://images.unsplash.com/photo-1519183071298-a2962feb14f4?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=600&q=80"
    ],
    colors: ["Stone Terracotta", "Basalt Black", "Dune Sand"],
    stock: 22,
    isFeatured: false,
    tags: ["Relaxation", "Quiet Design"],
    specs: {
      "Water Tank": "150 ml",
      "Mist Output": "25 ml/hour (up to 6 hours continuous)",
      "Coverage Area": "30 square meters",
      "Frequency": "Ultrasonic 2.4MHz",
      "Decibel Rating": "Under 20dB (Whisper Silent)"
    }
  },
  {
    id: 9,
    name: "Komorebi Ceramic Pour-Over Set",
    description: "Japanese artisanal pour-over vessel with textured glaze and wooden server.",
    fullDescription: "Inspired by the shadows of leaves filtering sunlight, the Komorebi Coffee Brewer set honors traditional coffee preparation. Made of twice-fired stoneware with a reactive earth glaze, each dripper possesses unique textures. Complete with a 600ml borosilicate glass carafe wrapped in a teak insulator handle.",
    price: 48,
    rating: 4.8,
    reviewCount: 165,
    category: "Living",
    images: [
      "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=600&q=80"
    ],
    stock: 12,
    isFeatured: false,
    tags: ["Coffee Culture", "Artisanal Crafted"],
    specs: {
      "Filter Compatibility": "V60 Size 02 filter papers",
      "Carafe Capacity": "600 ml (2-4 cups)",
      "Material": "Stoneware Ceramic, Heat-Resistant Borosilicate, Teakwood",
      "Glaze Finish": "Satin Reactive Speckle Glaze",
      "Origin": "Individually hand-glazed in Kyoto, Japan"
    }
  }
];

export const INITIAL_REVIEWS: Review[] = [
  {
    id: "r1",
    productId: 1,
    author: "Liam Montgomery",
    avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&q=80",
    rating: 5,
    date: "2026-06-15",
    comment: "These headphones are absolutely stellar! The active noise cancellation blocks my neighbor's construction easily. Highly recommend the charcoal color.",
    isVerifiedPurchase: true,
    helpfulCount: 24
  },
  {
    id: "r2",
    productId: 1,
    author: "Sienna Brooks",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&q=80",
    rating: 4,
    date: "2026-06-28",
    comment: "Excellent sound stage and very comfortable for long flights. My only nitpick is that the carrying case is slightly larger than expected.",
    isVerifiedPurchase: true,
    helpfulCount: 12
  },
  {
    id: "r3",
    productId: 2,
    author: "Ethan Vance",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=100&q=80",
    rating: 4,
    date: "2026-05-20",
    comment: "Beautiful minimal design, battery lasts almost a full week easily. Heart rate tracking matches my chest strap accurately. Fits standard 20mm bands.",
    isVerifiedPurchase: true,
    helpfulCount: 18
  },
  {
    id: "r4",
    productId: 3,
    author: "Zoe Lin",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=100&q=80",
    rating: 5,
    date: "2026-07-02",
    comment: "The softest wool sweater I have ever owned. Doesn't itch at all and keeps me warm on cool evenings without overheating. Fits true to size.",
    isVerifiedPurchase: true,
    helpfulCount: 31
  },
  {
    id: "r5",
    productId: 4,
    author: "Marcus Aurelius",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=100&q=80",
    rating: 5,
    date: "2026-06-10",
    comment: "These soy candles are outstanding. The sandalwood amber scent fills the entire living room without being overpowering. Will buy again.",
    isVerifiedPurchase: true,
    helpfulCount: 45
  },
  {
    id: "r6",
    productId: 5,
    author: "Clara Dubois",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=100&q=80",
    rating: 5,
    date: "2026-07-01",
    comment: "Amazing traction even during sweaty hot yoga sessions. The laser lines really help me keep my alignment symmetric. Truly worth the premium price.",
    isVerifiedPurchase: true,
    helpfulCount: 9
  },
  {
    id: "r7",
    productId: 6,
    author: "Julian K.",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80",
    rating: 5,
    date: "2026-06-30",
    comment: "As a product designer, this is a gorgeous book. Beautifully curated, informative, and acts as the perfect centerpiece on my coffee table.",
    isVerifiedPurchase: false,
    helpfulCount: 14
  }
];
