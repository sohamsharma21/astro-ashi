export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.12 (cd3cf9e)"
  }
  public: {
    Tables: {
      articles: {
        Row: {
          category: string
          content_en: string
          content_hi: string
          created_at: string | null
          excerpt_en: string
          excerpt_hi: string
          id: string
          image_url: string
          published_date: string
          title_en: string
          title_hi: string
          updated_at: string | null
        }
        Insert: {
          category: string
          content_en: string
          content_hi: string
          created_at?: string | null
          excerpt_en: string
          excerpt_hi: string
          id?: string
          image_url: string
          published_date?: string
          title_en: string
          title_hi: string
          updated_at?: string | null
        }
        Update: {
          category?: string
          content_en?: string
          content_hi?: string
          created_at?: string | null
          excerpt_en?: string
          excerpt_hi?: string
          id?: string
          image_url?: string
          published_date?: string
          title_en?: string
          title_hi?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      astro_conversations: {
        Row: {
          conversation: Json
          created_at: string
          id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          conversation?: Json
          created_at?: string
          id?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          conversation?: Json
          created_at?: string
          id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      astrological_events: {
        Row: {
          created_at: string | null
          description_en: string
          description_hi: string
          event_date: string
          event_type: string
          id: string
          title_en: string
          title_hi: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description_en: string
          description_hi: string
          event_date: string
          event_type: string
          id?: string
          title_en: string
          title_hi: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description_en?: string
          description_hi?: string
          event_date?: string
          event_type?: string
          id?: string
          title_en?: string
          title_hi?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      booking_verifications: {
        Row: {
          booking_id: string
          created_at: string
          expires_at: string
          id: string
          verification_token: string
          verified_at: string | null
        }
        Insert: {
          booking_id: string
          created_at?: string
          expires_at?: string
          id?: string
          verification_token?: string
          verified_at?: string | null
        }
        Update: {
          booking_id?: string
          created_at?: string
          expires_at?: string
          id?: string
          verification_token?: string
          verified_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "booking_verifications_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "consultation_bookings"
            referencedColumns: ["id"]
          },
        ]
      }
      consultation_bookings: {
        Row: {
          booking_date: string
          booking_time: string
          created_at: string
          id: string
          package_id: string
          package_price: string
          package_title: string
          phone: string
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          booking_date: string
          booking_time: string
          created_at?: string
          id?: string
          package_id: string
          package_price: string
          package_title: string
          phone: string
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          booking_date?: string
          booking_time?: string
          created_at?: string
          id?: string
          package_id?: string
          package_price?: string
          package_title?: string
          phone?: string
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      daily_horoscopes: {
        Row: {
          content_en: string
          content_hi: string
          created_at: string | null
          date: string
          id: string
          updated_at: string | null
          zodiac_sign: Database["public"]["Enums"]["zodiac_sign"]
        }
        Insert: {
          content_en: string
          content_hi: string
          created_at?: string | null
          date?: string
          id?: string
          updated_at?: string | null
          zodiac_sign: Database["public"]["Enums"]["zodiac_sign"]
        }
        Update: {
          content_en?: string
          content_hi?: string
          created_at?: string | null
          date?: string
          id?: string
          updated_at?: string | null
          zodiac_sign?: Database["public"]["Enums"]["zodiac_sign"]
        }
        Relationships: []
      }
      kundli_data: {
        Row: {
          birth_date: string
          birth_place: string
          birth_time: string
          created_at: string | null
          id: string
          latitude: number | null
          longitude: number | null
          name: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          birth_date: string
          birth_place: string
          birth_time: string
          created_at?: string | null
          id?: string
          latitude?: number | null
          longitude?: number | null
          name: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          birth_date?: string
          birth_place?: string
          birth_time?: string
          created_at?: string | null
          id?: string
          latitude?: number | null
          longitude?: number | null
          name?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      panchang_cache: {
        Row: {
          abhijit_muhurat: Json | null
          ashubh_muhurat: Json | null
          created_at: string | null
          date: string
          id: string
          karana: Json
          latitude: number
          location_name: string | null
          longitude: number
          nakshatra: Json
          rahu_kaal: Json
          shubh_muhurat: Json | null
          sunrise: string
          sunset: string
          tithi: Json
          updated_at: string | null
          vaar: string
          yoga: Json
        }
        Insert: {
          abhijit_muhurat?: Json | null
          ashubh_muhurat?: Json | null
          created_at?: string | null
          date: string
          id?: string
          karana: Json
          latitude?: number
          location_name?: string | null
          longitude?: number
          nakshatra: Json
          rahu_kaal: Json
          shubh_muhurat?: Json | null
          sunrise: string
          sunset: string
          tithi: Json
          updated_at?: string | null
          vaar: string
          yoga: Json
        }
        Update: {
          abhijit_muhurat?: Json | null
          ashubh_muhurat?: Json | null
          created_at?: string | null
          date?: string
          id?: string
          karana?: Json
          latitude?: number
          location_name?: string | null
          longitude?: number
          nakshatra?: Json
          rahu_kaal?: Json
          shubh_muhurat?: Json | null
          sunrise?: string
          sunset?: string
          tithi?: Json
          updated_at?: string | null
          vaar?: string
          yoga?: Json
        }
        Relationships: []
      }
      profiles: {
        Row: {
          birth_date: string | null
          birth_place: string | null
          birth_time: string | null
          created_at: string | null
          full_name: string | null
          gender: string | null
          id: string
          kundli_data: Json | null
          kundli_generated: boolean | null
          lagna: string | null
          latitude: number | null
          longitude: number | null
          moon_sign: string | null
          nakshatra: string | null
          nav_display_mode: string | null
          nav_icon_style: string
          preferred_language: string | null
          updated_at: string | null
        }
        Insert: {
          birth_date?: string | null
          birth_place?: string | null
          birth_time?: string | null
          created_at?: string | null
          full_name?: string | null
          gender?: string | null
          id: string
          kundli_data?: Json | null
          kundli_generated?: boolean | null
          lagna?: string | null
          latitude?: number | null
          longitude?: number | null
          moon_sign?: string | null
          nakshatra?: string | null
          nav_display_mode?: string | null
          nav_icon_style?: string
          preferred_language?: string | null
          updated_at?: string | null
        }
        Update: {
          birth_date?: string | null
          birth_place?: string | null
          birth_time?: string | null
          created_at?: string | null
          full_name?: string | null
          gender?: string | null
          id?: string
          kundli_data?: Json | null
          kundli_generated?: boolean | null
          lagna?: string | null
          latitude?: number | null
          longitude?: number | null
          moon_sign?: string | null
          nakshatra?: string | null
          nav_display_mode?: string | null
          nav_icon_style?: string
          preferred_language?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      reading_history: {
        Row: {
          content_id: string
          content_summary: string | null
          content_title: string | null
          content_type: string
          id: string
          read_at: string | null
          user_id: string
        }
        Insert: {
          content_id: string
          content_summary?: string | null
          content_title?: string | null
          content_type: string
          id?: string
          read_at?: string | null
          user_id: string
        }
        Update: {
          content_id?: string
          content_summary?: string | null
          content_title?: string | null
          content_type?: string
          id?: string
          read_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      user_mahadasha: {
        Row: {
          all_periods: Json | null
          antardasha_end: string
          antardasha_start: string
          created_at: string | null
          current_antardasha: string
          current_mahadasha: string
          id: string
          mahadasha_end: string
          mahadasha_start: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          all_periods?: Json | null
          antardasha_end: string
          antardasha_start: string
          created_at?: string | null
          current_antardasha: string
          current_mahadasha: string
          id?: string
          mahadasha_end: string
          mahadasha_start: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          all_periods?: Json | null
          antardasha_end?: string
          antardasha_start?: string
          created_at?: string | null
          current_antardasha?: string
          current_mahadasha?: string
          id?: string
          mahadasha_end?: string
          mahadasha_start?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      user_predictions: {
        Row: {
          content_en: string
          content_hi: string
          created_at: string | null
          focus_areas: Json | null
          id: string
          kundli_factors: Json | null
          panchang_factors: Json | null
          prediction_date: string
          prediction_type: string
          transit_factors: Json | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          content_en: string
          content_hi: string
          created_at?: string | null
          focus_areas?: Json | null
          id?: string
          kundli_factors?: Json | null
          panchang_factors?: Json | null
          prediction_date: string
          prediction_type: string
          transit_factors?: Json | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          content_en?: string
          content_hi?: string
          created_at?: string | null
          focus_areas?: Json | null
          id?: string
          kundli_factors?: Json | null
          panchang_factors?: Json | null
          prediction_date?: string
          prediction_type?: string
          transit_factors?: Json | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      user_zodiac_preferences: {
        Row: {
          created_at: string | null
          id: string
          primary_sign: Database["public"]["Enums"]["zodiac_sign"]
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          primary_sign: Database["public"]["Enums"]["zodiac_sign"]
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          primary_sign?: Database["public"]["Enums"]["zodiac_sign"]
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      zodiac_sign:
        | "aries"
        | "taurus"
        | "gemini"
        | "cancer"
        | "leo"
        | "virgo"
        | "libra"
        | "scorpio"
        | "sagittarius"
        | "capricorn"
        | "aquarius"
        | "pisces"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      zodiac_sign: [
        "aries",
        "taurus",
        "gemini",
        "cancer",
        "leo",
        "virgo",
        "libra",
        "scorpio",
        "sagittarius",
        "capricorn",
        "aquarius",
        "pisces",
      ],
    },
  },
} as const
