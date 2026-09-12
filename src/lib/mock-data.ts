import { Venue, VibeDeliveryKit, VENUE_SLOT_TIERS, VENUE_ADD_ONS } from '@/types';

/**
 * ════════════════════════════════════════════════════════════════
 * OFFICIAL FLAGSHIP PROPERTY
 * The Rent-A-Vibe 2BHK Experiential Party Flat & Penthouse
 * Location: Sector 19, Dwarka, New Delhi
 * ════════════════════════════════════════════════════════════════
 */
export const FLAGSHIP_VENUE: Venue = {
  id: 'ven-dwarka-001',
  slug: 'the-dwarka-party-flat',
  name: 'Rent-A-Vibe 2BHK Party Penthouse',
  tagline: 'Private 2BHK celebration venue in Dwarka with Wireless Karaoke, 100" Cinema Projector, DJ Sound Box, Neon Lounge & Overnight AC Beds for 15–22 guests.',
  description: `## The Official Celebration Flat & Event Venue of Delhi NCR\n\nDesigned specifically for birthday bashes, reunions, private screenings, and group celebrations. Say goodbye to strict hotel rules and Airbnb party cancellations.\n\n### 🌟 Everything Included in Your Booking:\n- 🎤 **Wireless Karaoke Setup:** Dual chrome UHF wireless microphones with voice reverberation & party speaker.\n- 🎬 **100" HD Cinema Projector:** 1080p Smart Projector with Netflix, Hotstar & YouTube for movies or match screenings.\n- 🎧 **160W High-Bass Party Tower & DJ Sound Box:** Bluetooth sound system with sound-reactive RGB dance strobes.\n- 💡 **Aesthetic Neon Wall & Fairy Lights:** "Good Vibes" neon backdrop and golden fairy light canopy for Instagram photos.\n- 🛏️ **2 AC Master Bedrooms with Queen Beds:** Clean hotel-grade linen and 2 attached washrooms with geysers for overnight stays.\n- 📶 **High-Speed Fiber Wi-Fi & Power Backup:** Uninterrupted party setup with board games and chill lounge seating.\n\n*(Note: Food buffet chafing warmers and cocktail bar station are available as affordable optional Add-Ons during booking).*`,
  category: 'party_flat',
  bhk_type: '2BHK Luxury Party Flat',
  experience_type: 'Private 2BHK Party Flat & Overnight Stay',
  weekday_price_paise: 449900, // ₹4,499 (Mon–Thu)
  weekend_price_paise: 699900, // ₹6,999 (Fri–Sun)
  base_price_paise: 449900,
  hourly_rate_paise: 50000,
  security_deposit_paise: 200000, // ₹2,000 refundable
  capacity_max: 22,
  capacity_recommended: 16,
  city: 'Delhi NCR',
  area: 'Dwarka Sector 19 (Near Metro)',
  full_address: 'Flat 402, Palm Residency, Sector 19, Dwarka, New Delhi 110075',
  cover_image_url: '/images/venue/living-room.jpg',
  gallery_urls: [
    '/images/venue/living-room.jpg',
    '/images/venue/karaoke-stage.jpg',
    '/images/venue/cinema-projector.jpg',
    '/images/venue/master-bedroom.jpg',
  ],
  amenities: [
    { name: 'Dual Wireless UHF Karaoke Microphones', category: 'sound' },
    { name: '1080p Smart HD Projector & 100" Screen', category: 'equipment' },
    { name: '160W High-Bass Bluetooth Party Speaker & DJ Strobes', category: 'sound' },
    { name: 'Custom Neon Sign & Fairy Light Canopy', category: 'equipment' },
    { name: '2 Air-Conditioned Master Bedrooms + Geysers', category: 'comfort' },
    { name: 'Bohemian Floor Rugs, Poufs & Low Seating', category: 'comfort' },
    { name: 'Double Door Refrigerator, Microwave & RO Water', category: 'refreshments' },
    { name: 'High-Speed 300 Mbps Fiber Wi-Fi', category: 'connectivity' },
  ],
  included_equipment: [
    'Dual wireless UHF microphones with built-in echo/reverb filters',
    'Smart Projector with Netflix, Hotstar & YouTube logged in + 100" screen',
    '160W High-Bass Party Tower Speaker with multi-color dance strobes',
    'Aesthetic "Good Vibes" LED Neon sign & golden ambient fairy lights',
    '2 AC Master Bedrooms with queen beds, fresh linen and attached washrooms',
    'Inverter power backup for uninterrupted music, cinema and lights',
  ],
  house_rules: [
    'Strict noise control after 10:00 PM (music shifted indoors at balanced volume for residential compliance)',
    'Strict cap of 22 guests at any time (verified at entry for building security)',
    'Valid Government Photo ID required for primary booking guest at check-in',
    '₹2,000 security deposit refunded via UPI within 12 hours post-checkout inspection',
    'Outside food & beverages delivery allowed (Zomato, Swiggy, Blinkit available)',
  ],
  is_active: true,
  tags: ['dwarka', 'delhi', '2bhk', 'party-flat', 'karaoke', 'cinema', 'birthday', 'stay'],
  meta_description: 'Official Rent-A-Vibe 2BHK party flat in Dwarka Sector 19, Delhi. Equipped with karaoke, cinema projector, neon decor & overnight stay.',
  total_bookings: 189,
  average_rating: 4.94,
  created_at: '2024-01-01T00:00:00Z',
  updated_at: '2024-01-01T00:00:00Z',
};

export const MOCK_VENUES: Venue[] = [FLAGSHIP_VENUE];

/**
 * ════════════════════════════════════════════════════════════════
 * SECONDARY MODEL: Affordable Doorstep Party Kits
 * If hosting at your own home instead of our Dwarka flat.
 * ════════════════════════════════════════════════════════════════
 */
export const MOCK_DELIVERY_KITS: VibeDeliveryKit[] = [
  {
    id: 'kit-001',
    slug: 'wireless-karaoke-party-kit',
    name: 'Wireless Karaoke & Dual Mic Party Kit',
    tagline: 'Transform your own living room into an instant karaoke stage.',
    description: 'Includes 2 chrome wireless microphones, a portable Bluetooth party speaker with glowing RGB lights, and universal phone/tablet stand.',
    category: 'karaoke',
    price_per_day_paise: 69900, // ₹699 / day (Super affordable)
    security_deposit_paise: 100000, // ₹1,000 refundable
    cover_image_url: '/images/boxes/karaoke-night.jpg',
    contents: [
      { name: 'Wireless UHF Dual Microphones', quantity: 2, description: 'Chrome finish with built-in voice filters' },
      { name: 'Portable RGB Bluetooth Speaker', quantity: 1, description: '60W high-clarity sound' },
      { name: 'Karaoke Lyric Phone & Tablet Stand', quantity: 1, description: 'Adjustable height' },
      { name: 'Aux & Charging Cables', quantity: 2, description: 'Fast USB-C charging' },
    ],
    tags: ['karaoke', 'mics', 'singing', 'music', 'affordable', 'doorstep'],
    is_active: true,
  },
  {
    id: 'kit-002',
    slug: 'aesthetic-room-glow-neon-kit',
    name: 'Aesthetic Room Glow & Neon Lighting Kit',
    tagline: 'Give your room a stunning Instagram-ready glow with fairy lights & neon signs.',
    description: 'Comes with 2 app-controlled RGB corner lamps, 50-meter warm fairy lights, and an aesthetic neon LED wall sign.',
    category: 'lighting',
    price_per_day_paise: 44900, // ₹449 / day
    security_deposit_paise: 100000,
    cover_image_url: '/images/boxes/rooftop-chill.jpg',
    contents: [
      { name: 'App-Controlled RGB Floor Corner Lamps', quantity: 2, description: '16M colors with music sync' },
      { name: '50m Warm Fairy Lights Reel', quantity: 1, description: 'Waterproof copper wire' },
      { name: 'Aesthetic "Good Vibes" Neon LED Sign', quantity: 1, description: 'Wall hanging with adapter' },
      { name: 'Sunset Projection Lamp', quantity: 1, description: 'Golden hour warm halo' },
    ],
    tags: ['lighting', 'neon', 'fairy-lights', 'glow', 'aesthetic', 'party'],
    is_active: true,
  },
  {
    id: 'kit-003',
    slug: 'birthday-celebration-decor-box',
    name: 'Birthday & Anniversary Celebration Decor Box',
    tagline: 'Complete DIY party backdrop with balloon pump, arch strip, and shimmer curtain.',
    description: 'Everything you need to set up a photo-ready party wall in 15 minutes without paying thousands to decorators.',
    category: 'birthday',
    price_per_day_paise: 79900, // ₹799 / day
    security_deposit_paise: 100000,
    cover_image_url: '/images/boxes/spa-wellness.jpg',
    contents: [
      { name: 'Electric Dual-Nozzle Balloon Pump', quantity: 1, description: 'Inflates 100 balloons in 5 mins' },
      { name: 'Gold Foil Shimmer Backdrop Curtain', quantity: 2, description: 'Reusable 6x3 ft curtains' },
      { name: 'Happy Birthday LED Neon Sign', quantity: 1, description: 'Warm white glow' },
      { name: 'Balloon Arch Strip & Glue Dots', quantity: 1, description: 'Reusable setup kit' },
    ],
    tags: ['birthday', 'decor', 'balloon-pump', 'celebration', 'affordable'],
    is_active: true,
  },
  {
    id: 'kit-004',
    slug: 'sound-blaster-dj-speaker-box',
    name: 'Sound Blaster & Party Disco Box',
    tagline: 'High-bass 160W party speaker with rotating RGB disco strobe for high-energy nights.',
    description: 'Crisp audio with deep bass and an accompanying disco ball strobe light to turn your living room into a private club.',
    category: 'music',
    price_per_day_paise: 99900, // ₹999 / day
    security_deposit_paise: 100000,
    cover_image_url: '/images/boxes/dj-party.jpg',
    contents: [
      { name: '160W High-Bass Bluetooth Party Speaker', quantity: 1, description: 'With Bass Boost mode' },
      { name: 'Rotating Multi-Color Disco Ball Strobe', quantity: 1, description: 'Sound activated' },
      { name: 'Wireless Handheld Microphone', quantity: 1, description: 'For announcements & songs' },
      { name: 'Heavy Duty 5m Power Extension Reel', quantity: 1, description: 'Surge protected' },
    ],
    tags: ['speaker', 'disco', 'dj', 'bass', 'party', 'sound'],
    is_active: true,
  },
  {
    id: 'kit-005',
    slug: 'portable-smart-movie-projector-kit',
    name: 'Portable Smart Movie Projector & Screen Kit',
    tagline: 'Compact HD smart projector with built-in OTT apps and 84-inch foldable screen.',
    description: 'Plug-and-play movie cinema setup. Connects directly to Wi-Fi to stream Netflix, Prime, Hotstar, and YouTube.',
    category: 'cinema',
    price_per_day_paise: 89900, // ₹899 / day
    security_deposit_paise: 100000,
    cover_image_url: '/images/boxes/movie-night-pro.jpg',
    contents: [
      { name: '1080p Smart Android Projector', quantity: 1, description: 'Auto-keystone & Wi-Fi' },
      { name: '84-inch Portable Foldable Screen', quantity: 1, description: 'With mounting hooks' },
      { name: 'Compact Bluetooth Soundbar', quantity: 1, description: '40W stereo sound' },
      { name: 'HDMI & Power Cables', quantity: 1, description: 'Complete cable set' },
    ],
    tags: ['projector', 'movie', 'cinema', 'ott', 'streaming', 'date-night'],
    is_active: true,
  },
];

// ── Query Helpers ────────────────────────────────────────────

export function getMockVenues(_category?: string): Venue[] {
  return [FLAGSHIP_VENUE];
}

export function getMockVenue(_slug?: string): Venue {
  return FLAGSHIP_VENUE;
}

export function getMockDeliveryKits(category?: string): VibeDeliveryKit[] {
  if (!category || category === 'all') return MOCK_DELIVERY_KITS;
  return MOCK_DELIVERY_KITS.filter(
    (k) => k.category === category || k.tags.includes(category)
  );
}

export function getMockDeliveryKit(slug: string): VibeDeliveryKit | undefined {
  return MOCK_DELIVERY_KITS.find((k) => k.slug === slug || k.id === slug);
}

export const MOCK_VIBE_BOXES = MOCK_DELIVERY_KITS;
export const getMockBoxes = getMockDeliveryKits;
export const getMockBox = getMockDeliveryKit;
