export type Therapist = {
  slug: string;
  firstName: string;
  age: number;
  specialty: string;
  location: string;
  distance: string;
  rating: string;
  reviewCount: number;
  experience: string;
  price: string;
  duration: string;
  image: string;
  gallery: string[];
  specialties: string[];
  visitTypes: string[];
  about: string;
  isNew?: boolean;
  isVerified?: boolean;
  reviews?: { author: string; rating: number; text: string; date?: string }[];
};

export const therapists: Therapist[] = [
  {
    slug: "maya",
    firstName: "Maya",
    age: 32,
    specialty: "Swedish Massage",
    location: "New York, NY",
    distance: "2.4 km away",
    rating: "4.9",
    reviewCount: 128,
    experience: "5 years experience",
    price: "GHS 320",
    duration: "60 mins",
    image:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=1000&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&w=500&q=80",
      "https://images.unsplash.com/photo-1515377905703-c4788e51af15?auto=format&fit=crop&w=500&q=80",
      "https://images.unsplash.com/photo-1519823551278-64ac92734fb1?auto=format&fit=crop&w=500&q=80",
    ],
    specialties: ["Swedish", "Relaxation", "Aromatherapy"],
    visitTypes: ["At Home", "Hotel", "Office"],
    about:
      "Maya is a licensed massage therapist focused on calm, restorative sessions for stress relief and full-body relaxation. She adapts pressure and technique to each client.",
  },
  {
    slug: "jordan",
    firstName: "Jordan",
    age: 29,
    specialty: "Deep Tissue Massage",
    location: "Los Angeles, CA",
    distance: "3.2 km away",
    rating: "4.8",
    reviewCount: 112,
    experience: "4 years experience",
    price: "GHS 300",
    duration: "60 mins",
    image:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=1000&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1519823551278-64ac92734fb1?auto=format&fit=crop&w=500&q=80",
      "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&w=500&q=80",
      "https://images.unsplash.com/photo-1515377905703-c4788e51af15?auto=format&fit=crop&w=500&q=80",
    ],
    specialties: ["Deep Tissue", "Sports", "Trigger Point"],
    visitTypes: ["At Home", "Hotel", "Office"],
    about:
      "Jordan specializes in focused bodywork for tight muscles, desk tension, and active recovery. His sessions are structured, steady, and pressure-aware.",
  },
  {
    slug: "nia",
    firstName: "Nia",
    age: 35,
    specialty: "Hot Stone Massage",
    location: "Chicago, IL",
    distance: "4.1 km away",
    rating: "4.9",
    reviewCount: 96,
    experience: "7 years experience",
    price: "GHS 360",
    duration: "75 mins",
    image:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1000&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&w=500&q=80",
      "https://images.unsplash.com/photo-1515377905703-c4788e51af15?auto=format&fit=crop&w=500&q=80",
      "https://images.unsplash.com/photo-1519823551278-64ac92734fb1?auto=format&fit=crop&w=500&q=80",
    ],
    specialties: ["Hot Stone", "Restorative", "Gentle Pressure"],
    visitTypes: ["At Home", "Hotel", "Office"],
    about:
      "Nia brings a slower, grounding approach to massage, using heat and gentle pressure to help clients unwind while easing tension across the back and shoulders.",
  },
  {
    slug: "elliot",
    firstName: "Elliot",
    age: 31,
    specialty: "Couples Massage",
    location: "Miami, FL",
    distance: "5.4 km away",
    rating: "4.7",
    reviewCount: 87,
    experience: "3 years experience",
    price: "GHS 340",
    duration: "60 mins",
    image:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=1000&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1519823551278-64ac92734fb1?auto=format&fit=crop&w=500&q=80",
      "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&w=500&q=80",
      "https://images.unsplash.com/photo-1515377905703-c4788e51af15?auto=format&fit=crop&w=500&q=80",
    ],
    specialties: ["Couples", "Relaxation", "Mobility"],
    visitTypes: ["At Home", "Hotel", "Office"],
    about:
      "Elliot is known for balanced pressure and smooth session flow, making him a good fit for first-time clients, couples bookings, and relaxation-focused visits.",
  },
  {
    slug: "sofia",
    firstName: "Sofia",
    age: 28,
    specialty: "Sports Massage",
    location: "New York, NY",
    distance: "1.1 km away",
    rating: "5.0",
    reviewCount: 210,
    experience: "6 years experience",
    price: "GHS 380",
    duration: "60 mins",
    image:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=1000&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=500&q=80",
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=500&q=80",
    ],
    specialties: ["Sports", "Deep Tissue", "Recovery"],
    visitTypes: ["At Home", "Hotel"],
    about:
      "Sofia works with athletes and active clients to speed recovery and improve mobility.",
    isNew: false,
    isVerified: true,
    reviews: [
      { author: "Lena", rating: 5, text: "Amazing pressure and technique.", date: "2026-08-10" },
      { author: "Jon", rating: 5, text: "Helped my sore hamstring recover fast.", date: "2026-07-22" },
    ],
  },
  {
    slug: "liam",
    firstName: "Liam",
    age: 34,
    specialty: "Sports Massage",
    location: "Los Angeles, CA",
    distance: "2.8 km away",
    rating: "4.8",
    reviewCount: 58,
    experience: "5 years experience",
    price: "GHS 300",
    duration: "60 mins",
    image:
      "https://images.unsplash.com/photo-1547425260-76bcadfb4f2c?auto=format&fit=crop&w=1000&q=80",
    gallery: [],
    specialties: ["Deep Tissue", "Sports"],
    visitTypes: ["At Home", "Office"],
    about: "Liam specializes in post-workout recovery and mobility work.",
    isNew: true,
    isVerified: true,
    reviews: [
      { author: "Marta", rating: 5, text: "Very professional and knowledgeable.", date: "2026-08-18" },
    ],
  },
  {
    slug: "aisha",
    firstName: "Aisha",
    age: 30,
    specialty: "Aromatherapy",
    location: "Chicago, IL",
    distance: "3.9 km away",
    rating: "4.9",
    reviewCount: 44,
    experience: "4 years experience",
    price: "GHS 310",
    duration: "60 mins",
    image:
      "https://images.unsplash.com/photo-1509099836639-18ba6a3b3f1b?auto=format&fit=crop&w=1000&q=80",
    gallery: [],
    specialties: ["Aromatherapy", "Relaxation"],
    visitTypes: ["Hotel", "Office"],
    about: "Gentle, calming sessions with aromatic oils.",
    isNew: false,
    isVerified: true,
    reviews: [
      { author: "Priya", rating: 5, text: "So relaxing — I slept so well after.", date: "2026-06-12" },
    ],
  },
  {
    slug: "carlos",
    firstName: "Carlos",
    age: 38,
    specialty: "Trigger Point",
    location: "Miami, FL",
    distance: "6.0 km away",
    rating: "4.6",
    reviewCount: 33,
    experience: "8 years experience",
    price: "GHS 350",
    duration: "75 mins",
    image:
      "https://images.unsplash.com/photo-1524504388940-1d64f3f6f8db?auto=format&fit=crop&w=1000&q=80",
    gallery: [],
    specialties: ["Trigger Point", "Pain Relief"],
    visitTypes: ["At Home"],
    about: "Focused work for chronic tension and trigger points.",
    isNew: true,
    isVerified: false,
    reviews: [
      { author: "Abe", rating: 4, text: "Tough but effective.", date: "2026-08-01" },
    ],
  },
  {
    slug: "priya",
    firstName: "Priya",
    age: 27,
    specialty: "Swedish Massage",
    location: "New York, NY",
    distance: "0.8 km away",
    rating: "4.9",
    reviewCount: 18,
    experience: "2 years experience",
    price: "GHS 280",
    duration: "45 mins",
    image:
      "https://images.unsplash.com/photo-1543852786-1cf6624b9987?auto=format&fit=crop&w=1000&q=80",
    gallery: [],
    specialties: ["Swedish", "Relaxation"],
    visitTypes: ["At Home", "Hotel"],
    about: "Warm, attentive Swedish massage sessions.",
    isNew: true,
    isVerified: true,
    reviews: [
      { author: "Dana", rating: 5, text: "Lovely technique and very kind.", date: "2026-08-25" },
    ],
  },
  {
    slug: "noah",
    firstName: "Noah",
    age: 36,
    specialty: "Couples Massage",
    location: "Los Angeles, CA",
    distance: "7.2 km away",
    rating: "4.7",
    reviewCount: 9,
    experience: "3 years experience",
    price: "GHS 340",
    duration: "60 mins",
    image:
      "https://images.unsplash.com/photo-1545996124-1f0d7b3b2b36?auto=format&fit=crop&w=1000&q=80",
    gallery: [],
    specialties: ["Couples", "Relaxation"],
    visitTypes: ["Hotel", "Office"],
    about: "Great for couples and shared relaxation sessions.",
    isNew: false,
    isVerified: false,
    reviews: [
      { author: "S & M", rating: 5, text: "Fantastic couples session.", date: "2026-05-18" },
    ],
  },
];

export function getTherapistBySlug(slug: string) {
  return therapists.find((therapist) => therapist.slug === slug);
}
