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
];

export function getTherapistBySlug(slug: string) {
  return therapists.find((therapist) => therapist.slug === slug);
}
