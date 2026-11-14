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
  verifiedAt?: string;
  spokenLanguages?: string[];
  profession?: string;
  joinedAt?: string;
  reviews?: { author: string; rating: number; text: string; date?: string }[];

  // New booking-driven fields
  massageOfferings?: MassageOffering[];
  availability?: TherapistAvailability[];
  serviceLocations?: ServiceLocation[];
  walkInLocations?: WalkInLocation[];
};

export const therapists: Therapist[] = [
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
      { author: "Paul", rating: 5, text: "Lovely technique and very kind.", date: "2026-08-25" }, { author: "Nana Asare", rating: 5, text: "Very professional, highly recommend.", date: "2026-08-26" }, { author: "Godfred Amoah", rating: 5, text: "Excellent service. I loved it.", date: "2026-08-26" },
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
