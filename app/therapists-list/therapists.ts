export type MassageOffering = {
  massageType: string;
  durationMinutes: number;
  price: number;
};

export type TherapistAvailability = {
  date: string; // ISO date yyyy-mm-dd
  startTime: string; // HH:MM (24h)
  endTime: string; // HH:MM (24h)
};

export type ServiceLocation = "home" | "hotel" | "walk-in";

export type WalkInLocation = {
  id: string;
  name: string;
  address: string;
};

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
  joinedAt?: string;
  reviews?: { author: string; rating: number; text: string; date?: string }[];

  // New booking-driven fields
  massageOfferings?: MassageOffering[];
  availability?: TherapistAvailability[];
  serviceLocations?: ServiceLocation[];
  walkInLocations?: WalkInLocation[];
};

export const therapists: Therapist[] = [
  // {
  //   slug: "maya",
  //   firstName: "Maya",
  //   age: 32,
  //   specialty: "Swedish Massage",
  //   location: "Accra",
  //   distance: "1.2 km away",
  //   rating: "4.9",
  //   reviewCount: 128,
  //   experience: "5 years experience",
  //   price: "GHS 320",
  //   duration: "60 mins",
  //   image:
  //     "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=1000&q=80",
  //   gallery: [
  //     "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&w=500&q=80",
  //     "https://images.unsplash.com/photo-1515377905703-c4788e51af15?auto=format&fit=crop&w=500&q=80",
  //     "https://images.unsplash.com/photo-1519823551278-64ac92734fb1?auto=format&fit=crop&w=500&q=80",
  //   ],
  //   specialties: ["Swedish", "Relaxation", "Aromatherapy"],
  //   visitTypes: ["At Home", "Hotel", "Office"],
  //   about:
  //     "Maya is a licensed massage therapist focused on calm, restorative sessions for stress relief and full-body relaxation. She adapts pressure and technique to each client.",
  //   joinedAt: "2026-08-20T09:00:00Z",
  //   massageOfferings: [
  //     { massageType: "Swedish", durationMinutes: 60, price: 320 },
  //     { massageType: "Aromatherapy", durationMinutes: 75, price: 380 },
  //   ],
  //   availability: [
  //     { date: "2026-09-05", startTime: "09:00", endTime: "15:00" },
  //     { date: "2026-09-06", startTime: "11:00", endTime: "18:00" },
  //   ],
  //   serviceLocations: ["home", "hotel", "walk-in"],
  //   walkInLocations: [
  //     { id: "maya-osu", name: "Sample studio", address: "Osu, Accra (sample venue)" },
  //   ],
  // },
  // {
  //   slug: "jordan",
  //   firstName: "Jordan",
  //   age: 29,
  //   specialty: "Deep Tissue Massage",
  //   location: "Kumasi",
  //   distance: "2.1 km away",
  //   rating: "4.8",
  //   reviewCount: 112,
  //   experience: "4 years experience",
  //   price: "GHS 300",
  //   duration: "60 mins",
  //   image:
  //     "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=1000&q=80",
  //   gallery: [
  //     "https://images.unsplash.com/photo-1519823551278-64ac92734fb1?auto=format&fit=crop&w=500&q=80",
  //     "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&w=500&q=80",
  //     "https://images.unsplash.com/photo-1515377905703-c4788e51af15?auto=format&fit=crop&w=500&q=80",
  //   ],
  //   specialties: ["Deep Tissue", "Sports", "Trigger Point"],
  //   visitTypes: ["At Home", "Hotel", "Office"],
  //   about:
  //     "Jordan specializes in focused bodywork for tight muscles, desk tension, and active recovery. His sessions are structured, steady, and pressure-aware.",
  //   joinedAt: "2026-08-11T10:00:00Z",
  //   massageOfferings: [
  //     { massageType: "Deep Tissue", durationMinutes: 60, price: 300 },
  //     { massageType: "Sports", durationMinutes: 90, price: 420 },
  //   ],
  //   availability: [
  //     { date: "2026-09-05", startTime: "10:00", endTime: "16:00" },
  //     { date: "2026-09-07", startTime: "08:00", endTime: "12:00" },
  //   ],
  //   serviceLocations: ["home", "hotel", "walk-in"],
  //   walkInLocations: [
  //     { id: "jordan-adum", name: "Sample studio", address: "Adum, Kumasi (sample venue)" },
  //   ],
  // },
  // {
  //   slug: "kwame",
  //   firstName: "Kwame",
  //   age: 38,
  //   specialty: "Deep Tissue & Sports",
  //   location: "Kumasi",
  //   distance: "1.2 km away",
  //   rating: "4.8",
  //   reviewCount: 54,
  //   experience: "6 years experience",
  //   price: "GHS 290",
  //   duration: "60 mins",
  //   image:
  //     "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=1000&q=80",
  //   gallery: [],
  //   specialties: ["Deep Tissue", "Sports"],
  //   visitTypes: ["At Home", "Walk-in"],
  //   about: "Kwame focuses on recovery work for athletes and active clients, blending firm pressure with mobility drills.",
  //   isNew: false,
  //   isVerified: true,
  //   joinedAt: "2026-04-22T08:00:00Z",
  //   reviews: [
  //     { author: "Ama", rating: 5, text: "Great pressure and relief after sessions.", date: "2026-07-11" },
  //   ],
  //   massageOfferings: [
  //     { massageType: "Deep Tissue", durationMinutes: 60, price: 290 },
  //     { massageType: "Sports", durationMinutes: 90, price: 450 },
  //   ],
  //   availability: [
  //     { date: "2026-09-06", startTime: "08:00", endTime: "14:00" },
  //     { date: "2026-09-07", startTime: "10:00", endTime: "18:00" },
  //   ],
  //   serviceLocations: ["home", "walk-in"],
  //   walkInLocations: [
  //     { id: "kwame-asokwa", name: "Sample studio", address: "Asokwa, Kumasi (sample venue)" },
  //   ],
  // },
  // {
  //   slug: "nia",
  //   firstName: "Nia",
  //   age: 35,
  //   specialty: "Hot Stone Massage",
  //   location: "Accra",
  //   distance: "2.8 km away",
  //   rating: "4.9",
  //   reviewCount: 96,
  //   experience: "7 years experience",
  //   price: "GHS 360",
  //   duration: "75 mins",
  //   image:
  //     "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1000&q=80",
  //   gallery: [
  //     "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&w=500&q=80",
  //     "https://images.unsplash.com/photo-1515377905703-c4788e51af15?auto=format&fit=crop&w=500&q=80",
  //     "https://images.unsplash.com/photo-1519823551278-64ac92734fb1?auto=format&fit=crop&w=500&q=80",
  //   ],
  //   specialties: ["Hot Stone", "Restorative", "Gentle Pressure"],
  //   visitTypes: ["At Home", "Hotel", "Office"],
  //   about:
  //     "Nia brings a slower, grounding approach to massage, using heat and gentle pressure to help clients unwind while easing tension across the back and shoulders.",
  //   joinedAt: "2026-08-24T12:00:00Z",
  //   massageOfferings: [
  //     { massageType: "Hot Stone", durationMinutes: 75, price: 360 },
  //     { massageType: "Restorative", durationMinutes: 60, price: 340 },
  //   ],
  //   availability: [
  //     { date: "2026-09-06", startTime: "12:00", endTime: "20:00" },
  //   ],
  //   serviceLocations: ["hotel", "walk-in"],
  //   walkInLocations: [
  //     { id: "nia-east-legon", name: "Sample studio", address: "East Legon, Accra (sample venue)" },
  //   ],
  // },
  // {
  //   slug: "elliot",
  //   firstName: "Elliot",
  //   age: 31,
  //   specialty: "Couples Massage",
  //   location: "Kumasi",
  //   distance: "3.4 km away",
  //   rating: "4.7",
  //   reviewCount: 87,
  //   experience: "3 years experience",
  //   price: "GHS 340",
  //   duration: "60 mins",
  //   image:
  //     "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=1000&q=80",
  //   gallery: [
  //     "https://images.unsplash.com/photo-1519823551278-64ac92734fb1?auto=format&fit=crop&w=500&q=80",
  //     "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&w=500&q=80",
  //     "https://images.unsplash.com/photo-1515377905703-c4788e51af15?auto=format&fit=crop&w=500&q=80",
  //   ],
  //   specialties: ["Couples", "Relaxation", "Mobility"],
  //   visitTypes: ["At Home", "Hotel", "Office"],
  //   about:
  //     "Elliot is known for balanced pressure and smooth session flow, making him a good fit for first-time clients, couples bookings, and relaxation-focused visits.",
  //   joinedAt: "2026-08-18T11:30:00Z",
  //   massageOfferings: [
  //     { massageType: "Couples", durationMinutes: 60, price: 340 },
  //     { massageType: "Relaxation", durationMinutes: 45, price: 280 },
  //   ],
  //   availability: [
  //     { date: "2026-09-05", startTime: "14:00", endTime: "20:00" },
  //     { date: "2026-09-07", startTime: "09:00", endTime: "13:00" },
  //   ],
  //   serviceLocations: ["home", "hotel"],
  // },
  // {
  //   slug: "sofia",
  //   firstName: "Sofia",
  //   age: 20,
  //   specialty: "Sports Massage",
  //   location: "Accra",
  //   distance: "0.9 km away",
  //   rating: "5.0",
  //   reviewCount: 210,
  //   experience: "6 years experience",
  //   price: "GHS 380",
  //   duration: "60 mins",
  //   image:
  //     "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=1000&q=80",
  //   gallery: [
  //     "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=500&q=80",
  //     "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=500&q=80",
  //   ],
  //   specialties: ["Sports", "Deep Tissue", "Recovery"],
  //   visitTypes: ["At Home", "Hotel"],
  //   about:
  //     "Sofia works with athletes and active clients to speed recovery and improve mobility.",
  //   isNew: false,
  //   isVerified: true,
  //   joinedAt: "2026-05-03T09:00:00Z",
  //   reviews: [
  //     { author: "Lena", rating: 5, text: "Amazing pressure and technique.", date: "2026-08-10" },
  //     { author: "Jon", rating: 5, text: "Helped my sore hamstring recover fast.", date: "2026-07-22" },
  //   ],
  //   massageOfferings: [
  //     { massageType: "Sports", durationMinutes: 60, price: 380 },
  //     { massageType: "Deep Tissue", durationMinutes: 90, price: 520 },
  //   ],
  //   availability: [
  //     { date: "2026-09-05", startTime: "08:00", endTime: "12:00" },
  //     { date: "2026-09-06", startTime: "10:00", endTime: "18:00" },
  //   ],
  //   serviceLocations: ["home", "hotel"],
  // },
  // {
  //   slug: "liam",
  //   firstName: "Liam",
  //   age: 34,
  //   specialty: "Sports Massage",
  //   location: "Kumasi",
  //   distance: "2.3 km away",
  //   rating: "4.8",
  //   reviewCount: 58,
  //   experience: "5 years experience",
  //   price: "GHS 300",
  //   duration: "60 mins",
  //   image:
  //     "https://images.unsplash.com/photo-1547425260-76bcadfb4f2c?auto=format&fit=crop&w=1000&q=80",
  //   gallery: [],
  //   specialties: ["Deep Tissue", "Sports"],
  //   visitTypes: ["At Home", "Office"],
  //   about: "Liam specializes in post-workout recovery and mobility work.",
  //   isNew: true,
  //   isVerified: true,
  //   joinedAt: "2026-08-29T07:45:00Z",
  //   reviews: [
  //     { author: "Marta", rating: 5, text: "Very professional and knowledgeable.", date: "2026-08-18" },
  //   ],
  //   massageOfferings: [
  //     { massageType: "Sports", durationMinutes: 60, price: 300 },
  //     { massageType: "Deep Tissue", durationMinutes: 60, price: 320 },
  //   ],
  //   availability: [
  //     { date: "2026-09-06", startTime: "09:00", endTime: "14:00" },
  //   ],
  //   serviceLocations: ["home", "walk-in"],
  //   walkInLocations: [
  //     { id: "liam-ahodwo", name: "Sample studio", address: "Ahodwo, Kumasi (sample venue)" },
  //   ],
  // },
  // {
  //   slug: "aisha",
  //   firstName: "Aisha",
  //   age: 30,
  //   specialty: "Aromatherapy",
  //   location: "Accra",
  //   distance: "3.0 km away",
  //   rating: "4.9",
  //   reviewCount: 44,
  //   experience: "4 years experience",
  //   price: "GHS 310",
  //   duration: "60 mins",
  //   image:
  //     "https://images.unsplash.com/photo-1509099836639-18ba6a3b3f1b?auto=format&fit=crop&w=1000&q=80",
  //   gallery: [],
  //   specialties: ["Aromatherapy", "Relaxation"],
  //   visitTypes: ["Hotel", "Office"],
  //   about: "Gentle, calming sessions with aromatic oils.",
  //   isNew: false,
  //   isVerified: true,
  //   joinedAt: "2026-06-15T13:00:00Z",
  //   reviews: [
  //     { author: "Priya", rating: 5, text: "So relaxing — I slept so well after.", date: "2026-06-12" },
  //   ],
  //   massageOfferings: [
  //     { massageType: "Aromatherapy", durationMinutes: 60, price: 310 },
  //     { massageType: "Relaxation", durationMinutes: 45, price: 260 },
  //   ],
  //   availability: [
  //     { date: "2026-09-07", startTime: "10:00", endTime: "16:00" },
  //   ],
  //   serviceLocations: ["hotel", "walk-in"],
  //   walkInLocations: [
  //     { id: "aisha-cantonments", name: "Sample studio", address: "Cantonments, Accra (sample venue)" },
  //   ],
  // },
  // {
  //   slug: "carlos",
  //   firstName: "Carlos",
  //   age: 38,
  //   specialty: "Trigger Point",
  //   location: "Kumasi",
  //   distance: "4.1 km away",
  //   rating: "4.6",
  //   reviewCount: 33,
  //   experience: "8 years experience",
  //   price: "GHS 350",
  //   duration: "75 mins",
  //   image:
  //     "https://images.unsplash.com/photo-1524504388940-1d64f3f6f8db?auto=format&fit=crop&w=1000&q=80",
  //   gallery: [],
  //   specialties: ["Trigger Point", "Pain Relief"],
  //   visitTypes: ["At Home"],
  //   about: "Focused work for chronic tension and trigger points.",
  //   isNew: true,
  //   isVerified: false,
  //   joinedAt: "2026-08-31T15:00:00Z",
  //   reviews: [
  //     { author: "Abe", rating: 4, text: "Tough but effective.", date: "2026-08-01" },
  //   ],
  //   massageOfferings: [
  //     { massageType: "Trigger Point", durationMinutes: 75, price: 350 },
  //     { massageType: "Pain Relief", durationMinutes: 90, price: 430 },
  //   ],
  //   availability: [
  //     { date: "2026-09-05", startTime: "12:00", endTime: "18:00" },
  //   ],
  //   serviceLocations: ["home"],
  // },
  {
    slug: "felicity",
    firstName: "Felicity",
    age: 21,
    specialty: "Nuru Massage",
    location: "Kumasi",
    distance: "",
    rating: "4.9",
    reviewCount: 7,
    experience: "2 years experience",
    price: "GHS 1000",
    duration: "90 mins",
    image:
      "https://images.unsplash.com/photo-1543852786-1cf6624b9987?auto=format&fit=crop&w=1000&q=80",
    gallery: ["https://images.unsplash.com/photo-1543852786-1cf6624b9987?auto=format&fit=crop&w=1000&q=80", "https://images.unsplash.com/photo-1543852786-1cf6624b9987?auto=format&fit=crop&w=1000&q=80"],
    specialties: ["Nuru", "Erotic", "Sensual", "Swedish", "Deep Tissue"],
    visitTypes: ["At Home", "Hotel"],
    about: "Warm, attentive Swedish massage sessions.",
    isNew: true,
    isVerified: true,
    joinedAt: "2026-08-28T17:00:00Z",
    reviews: [
      { author: "Paul", rating: 5, text: "Lovely technique very kind.", date: "2026-08-25" }, { author: "Nana Asare", rating: 5, text: "Very professional, highly recommend.", date: "2026-08-26" },
    ],
    massageOfferings: [
      { massageType: "Nuru", durationMinutes: 90, price: 1000 },
      { massageType: "Erotic", durationMinutes: 60, price: 800 },
      { massageType: "Sensual", durationMinutes: 90, price: 1200 },
      { massageType: "Swedish", durationMinutes: 60, price: 800 },
      { massageType: "Deep Tissue", durationMinutes: 60, price: 800 },
    ],
    availability: [
      { date: "2026-11-12", startTime: "08:00", endTime: "22:00" },
      { date: "2026-11-13", startTime: "08:00", endTime: "21:00" },
    ],
    serviceLocations: ["home", "hotel"],
  },
    {
    slug: "abena",
    firstName: "Abena",
    age: 30,
    specialty: "Relaxation & Aromatherapy",
    location: "Accra",
    distance: "3.4 km away",
    rating: "5.0",
    reviewCount: 88,
    experience: "4 years experience",
    price: "GHS 340",
    duration: "60 mins",
    image:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=1000&q=80",
    gallery: [],
    specialties: ["Swedish", "Aromatherapy"],
    visitTypes: ["At Home", "Hotel"],
    about: "Abena creates soothing, restorative sessions focused on breath-and-touch to ease stress and tension.",
    isNew: true,
    isVerified: true,
    joinedAt: "2026-08-30T08:00:00Z",
    reviews: [
      { author: "Kojo", rating: 5, text: "So relaxing — highly recommend!", date: "2026-08-20" },
    ],
    massageOfferings: [
      { massageType: "Swedish", durationMinutes: 60, price: 340 },
      { massageType: "Aromatherapy", durationMinutes: 75, price: 400 },
    ],
    availability: [
      { date: "2026-09-05", startTime: "09:00", endTime: "17:00" },
    ],
    serviceLocations: ["home", "hotel"],
  },
  // {
  //   slug: "noah",
  //   firstName: "Noah",
  //   age: 36,
  //   specialty: "Couples Massage",
  //   location: "Kumasi",
  //   distance: "5.0 km away",
  //   rating: "4.7",
  //   reviewCount: 9,
  //   experience: "3 years experience",
  //   price: "GHS 340",
  //   duration: "60 mins",
  //   image:
  //     "https://images.unsplash.com/photo-1545996124-1f0d7b3b2b36?auto=format&fit=crop&w=1000&q=80",
  //   gallery: [],
  //   specialties: ["Couples", "Relaxation"],
  //   visitTypes: ["Hotel", "Office"],
  //   about: "Great for couples and shared relaxation sessions.",
  //   isNew: false,
  //   isVerified: false,
  //   joinedAt: "2026-02-12T09:30:00Z",
  //   reviews: [
  //     { author: "S & M", rating: 5, text: "Fantastic couples session.", date: "2026-05-18" },
  //   ],
  // },
];

export function getTherapistBySlug(slug: string) {
  return therapists.find((therapist) => therapist.slug === slug);
}
