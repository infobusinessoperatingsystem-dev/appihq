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
  isDemo?: boolean;
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
    specialty: "Nuru, Erotic & Swedish Massage",
    location: "Kumasi",
    distance: "Central Kumasi",
    rating: "4.9",
    reviewCount: 7,
    experience: "2 years experience",
    price: "From GHS 800",
    duration: "60–90 mins",
    image:
      "https://images.unsplash.com/photo-1543852786-1cf6624b9987?auto=format&fit=crop&w=1000&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1543852786-1cf6624b9987?auto=format&fit=crop&w=1000&q=80",
      // "https://images.unsplash.com/photo-1544161515-733932c60011?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1519823551278-64ac92734fb1?auto=format&fit=crop&w=1000&q=80",
    ],
    specialties: ["Nuru", "Swedish", "Erotic"],
    visitTypes: ["At Home", "Hotel"],
    about:
      "Felicity offers calm, attentive massage sessions tailored to each client. She checks in about pressure preferences and adapts each session to the client's comfort.",
    isNew: true,
    isVerified: true,
    isDemo: false,
    verifiedAt: "2026-08-29",
    spokenLanguages: ["English", "Twi"],
    profession: "Massage therapist",
    joinedAt: "2026-08-28T17:00:00Z",
    reviews: [
      { author: "Paul", rating: 5, text: "Lovely technique and very kind.", date: "2026-08-25" },
      { author: "Nana Asare", rating: 5, text: "Very professional, highly recommend.", date: "2026-08-26" },
      { author: "Godfred Amoah", rating: 5, text: "Excellent service. I loved it.", date: "2026-08-26" },
      { author: "Ama K.", rating: 5, text: "The pressure was just right, and I left feeling relaxed.", date: "2026-09-02" },
      { author: "Kojo B.", rating: 4, text: "A welcoming experience and a thoughtful therapist.", date: "2026-09-12" },
      { author: "Esi A.", rating: 5, text: "She listened to what I needed and made the session comfortable.", date: "2026-09-19" },
      { author: "Michael D.", rating: 5, text: "Excellent deep-tissue session. I would book again.", date: "2026-10-04" },
    ],
    massageOfferings: [
      { massageType: "Swedish", durationMinutes: 60, price: 800 },
      { massageType: "Nuru", durationMinutes: 90, price: 1000 },
      { massageType: "Erotic", durationMinutes: 60, price: 800 },
      { massageType: "Sensual", durationMinutes: 90, price: 1200 },
    ],
    availability: [
      { date: "2026-11-15", startTime: "09:00", endTime: "23:30" },
      { date: "2026-11-16", startTime: "10:00", endTime: "20:00" },
      { date: "2026-11-17", startTime: "08:00", endTime: "21:00" },
      { date: "2026-11-18", startTime: "09:00", endTime: "21:00" },
      { date: "2026-11-19", startTime: "10:00", endTime: "20:00" },
      { date: "2026-11-20", startTime: "08:00", endTime: "22:00" },
      { date: "2026-11-21", startTime: "09:00", endTime: "21:00" },
    ],
    serviceLocations: ["home", "hotel"],
  },
  {
    slug: "abigail",
    firstName: "Abigail",
    age: 26,
    specialty: "Nuru & Deep Tissue Massage",
    location: "Accra",
    distance: "Osu, Accra",
    rating: "4.8",
    reviewCount: 6,
    experience: "5 years experience",
    price: "From GHS 1000",
    duration: "60–90 mins",
    image:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=1000&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1519823551278-64ac92734fb1?auto=format&fit=crop&w=1000&q=80",
    ],
    specialties: ["Nuru", "Deep Tissue", "Erotic", "Sensual"],
    visitTypes: ["At Home", "Hotel", "Walk-in"],
    about:
      "Abigail creates soothing, restorative sessions with a focus on relaxation. She checks in about pressure preferences and adapts each session to the client's comfort.",
    isNew: false,
    isVerified: false,
    isDemo: false,
    spokenLanguages: ["English"],
    profession: "Massage therapist",
    joinedAt: "2026-04-14T09:00:00Z",
    reviews: [
      { author: "Nana A.", rating: 5, text: "A peaceful session from start to finish.", date: "2026-08-18" },
      { author: "Sarah K.", rating: 5, text: "Abigail was attentive and checked that the pressure felt right.", date: "2026-08-22" },
      { author: "Mabel T.", rating: 4, text: "Very relaxing and a lovely, calm setup.", date: "2026-09-03" },
      { author: "Joana D.", rating: 5, text: "The aromatherapy was wonderful. I felt refreshed afterward.", date: "2026-09-17" },
      { author: "Akua P.", rating: 5, text: "Professional, kind, and punctual. I would recommend her.", date: "2026-10-01" },
      { author: "Rita E.", rating: 5, text: "A thoughtful massage tailored to what I needed that day.", date: "2026-10-16" },
    ],
    massageOfferings: [
      { massageType: "Nuru", durationMinutes: 90, price: 1100 },
      { massageType: "Erotic", durationMinutes: 90, price: 1000 },
      { massageType: "Sensual", durationMinutes: 90, price: 1200 },
      { massageType: "Swedish", durationMinutes: 60, price: 1000 },
      { massageType: "Deep Tissue", durationMinutes: 60, price: 1000 },
    ],
    availability: [
      { date: "2026-11-15", startTime: "09:00", endTime: "17:00" },
      { date: "2026-11-17", startTime: "10:00", endTime: "19:00" },
      { date: "2026-11-21", startTime: "08:00", endTime: "15:00" },
    ],
    serviceLocations: ["home", "hotel", "walk-in"],
    walkInLocations: [
      {
        id: "abigail-osu-studio",
        name: "Osu wellness studio",
        address: "Osu, Accra",
      },
    ],
  },
  // {
  //   slug: "kwame",
  //   firstName: "Kwame",
  //   age: 34,
  //   specialty: "Deep Tissue & Sports Massage",
  //   location: "Kumasi",
  //   distance: "Adum, Kumasi",
  //   rating: "4.7",
  //   reviewCount: 6,
  //   experience: "7 years experience",
  //   price: "From GHS 420",
  //   duration: "60–90 mins",
  //   image:
  //     "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=1000&q=80",
  //   gallery: [
  //     "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=1000&q=80",
  //     "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=1000&q=80",
  //     "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1000&q=80",
  //   ],
  //   specialties: ["Deep Tissue", "Sports Massage", "Trigger Point"],
  //   visitTypes: ["At Home", "Walk-in"],
  //   about:
  //     "Kwame focuses on deep-tissue and sports massage for clients looking to ease everyday muscle tightness or unwind after activity. Sessions are adjusted to the client's comfort and pressure preferences.",
  //   isNew: true,
  //   isVerified: false,
  //   isDemo: true,
  //   spokenLanguages: ["English", "Twi"],
  //   profession: "Massage therapist",
  //   joinedAt: "2026-07-09T10:30:00Z",
  //   reviews: [
  //     { author: "Kofi B.", rating: 5, text: "Really attentive and explained the session clearly.", date: "2026-08-12" },
  //     { author: "Yaw M.", rating: 5, text: "Great pressure and I felt much looser afterward.", date: "2026-08-29" },
  //     { author: "Daniel A.", rating: 4, text: "Professional service and a very good sports massage.", date: "2026-09-10" },
  //     { author: "Kwabena S.", rating: 5, text: "Listened carefully and focused on the areas I mentioned.", date: "2026-09-24" },
  //     { author: "Frank O.", rating: 5, text: "Excellent technique. I would happily book another session.", date: "2026-10-08" },
  //     { author: "Nii L.", rating: 4, text: "A solid, relaxing experience with clear communication.", date: "2026-10-21" },
  //   ],
  //   massageOfferings: [
  //     { massageType: "Deep Tissue", durationMinutes: 60, price: 420 },
  //     { massageType: "Sports Massage", durationMinutes: 75, price: 500 },
  //     { massageType: "Trigger Point", durationMinutes: 60, price: 460 },
  //   ],
  //   availability: [
  //     { date: "2026-11-16", startTime: "08:00", endTime: "16:00" },
  //     { date: "2026-11-19", startTime: "11:00", endTime: "20:00" },
  //     { date: "2026-11-22", startTime: "09:00", endTime: "18:00" },
  //   ],
  //   serviceLocations: ["home", "walk-in"],
  //   walkInLocations: [
  //     {
  //       id: "kwame-adum-studio",
  //       name: "Adum therapy room",
  //       address: "Adum, Kumasi",
  //     },
  //   ],
  // },
];

export function getTherapistBySlug(slug: string) {
  return therapists.find((therapist) => therapist.slug === slug);
}
