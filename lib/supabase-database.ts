export type BookingRow = {
  id: string;
  confirmation_token_hash: string;
  therapist_slug: string;
  therapist_name: string;
  client_name: string;
  phone_number: string;
  therapist_note: string;
  treatment: string;
  duration_minutes: number;
  service_location: "home" | "hotel" | "walk-in";
  address: string;
  appointment_date: string;
  appointment_time: string;
  time_zone: string;
  total: number;
  status: "confirmed" | "cancelled" | "rescheduled";
  created_at: string;
};

export type BookingInsert = Omit<BookingRow, "status" | "created_at"> & {
  status?: BookingRow["status"];
  created_at?: string;
};

export type Database = {
  public: {
    Tables: {
      bookings: {
        Row: BookingRow;
        Insert: BookingInsert;
        Update: Partial<BookingInsert>;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};
