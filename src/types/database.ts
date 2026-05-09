export type UserRole = "user" | "admin";

export type Profile = {
  id: string;
  full_name: string | null;
  role: UserRole;
  created_at: string;
};

export type Event = {
  id: string;
  title: string;
  description: string;
  event_date: string;
  location: string;
  category: string;
  created_by: string | null;
  created_at: string;
};

export type Registration = {
  id: string;
  user_id: string;
  event_id: string;
  created_at: string;
};

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: Profile;
        Insert: {
          id: string;
          full_name?: string | null;
          role?: UserRole;
          created_at?: string;
        };
        Update: {
          full_name?: string | null;
          role?: UserRole;
          created_at?: string;
        };
        Relationships: [];
      };
      events: {
        Row: Event;
        Insert: {
          id?: string;
          title: string;
          description: string;
          event_date: string;
          location: string;
          category: string;
          created_by?: string | null;
          created_at?: string;
        };
        Update: {
          title?: string;
          description?: string;
          event_date?: string;
          location?: string;
          category?: string;
          created_by?: string | null;
          created_at?: string;
        };
        Relationships: [];
      };
      registrations: {
        Row: Registration;
        Insert: {
          id?: string;
          user_id: string;
          event_id: string;
          created_at?: string;
        };
        Update: {
          user_id?: string;
          event_id?: string;
          created_at?: string;
        };
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};
