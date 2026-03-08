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
      ai_questions: {
        Row: {
          ai_response: Json
          created_at: string
          id: string
          language: string
          question: string
          user_id: string
        }
        Insert: {
          ai_response?: Json
          created_at?: string
          id?: string
          language?: string
          question: string
          user_id: string
        }
        Update: {
          ai_response?: Json
          created_at?: string
          id?: string
          language?: string
          question?: string
          user_id?: string
        }
        Relationships: []
      }
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
      audit_events: {
        Row: {
          action: string
          created_at: string | null
          details: Json | null
          id: string
          user_id: string | null
        }
        Insert: {
          action: string
          created_at?: string | null
          details?: Json | null
          id?: string
          user_id?: string | null
        }
        Update: {
          action?: string
          created_at?: string | null
          details?: Json | null
          id?: string
          user_id?: string | null
        }
        Relationships: []
      }
      community_comments: {
        Row: {
          content: string
          created_at: string
          id: string
          is_anonymous: boolean
          post_id: string
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          is_anonymous?: boolean
          post_id: string
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          is_anonymous?: boolean
          post_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "community_comments_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "community_posts"
            referencedColumns: ["id"]
          },
        ]
      }
      community_likes: {
        Row: {
          created_at: string
          id: string
          post_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          post_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          post_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "community_likes_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "community_posts"
            referencedColumns: ["id"]
          },
        ]
      }
      community_posts: {
        Row: {
          category: string
          content: string
          created_at: string
          group_name: string
          id: string
          is_anonymous: boolean
          likes_count: number
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          category?: string
          content?: string
          created_at?: string
          group_name?: string
          id?: string
          is_anonymous?: boolean
          likes_count?: number
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          category?: string
          content?: string
          created_at?: string
          group_name?: string
          id?: string
          is_anonymous?: boolean
          likes_count?: number
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      community_reports: {
        Row: {
          comment_id: string | null
          created_at: string
          id: string
          post_id: string | null
          reason: string
          reporter_id: string
        }
        Insert: {
          comment_id?: string | null
          created_at?: string
          id?: string
          post_id?: string | null
          reason: string
          reporter_id: string
        }
        Update: {
          comment_id?: string | null
          created_at?: string
          id?: string
          post_id?: string | null
          reason?: string
          reporter_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "community_reports_comment_id_fkey"
            columns: ["comment_id"]
            isOneToOne: false
            referencedRelation: "community_comments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "community_reports_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "community_posts"
            referencedColumns: ["id"]
          },
        ]
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
      email_verifications: {
        Row: {
          created_at: string | null
          email: string
          expires_at: string
          id: string
          token: string
          used: boolean | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          email: string
          expires_at?: string
          id?: string
          token?: string
          used?: boolean | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          email?: string
          expires_at?: string
          id?: string
          token?: string
          used?: boolean | null
          user_id?: string
        }
        Relationships: []
      }
      gratitude_entries: {
        Row: {
          content: string
          created_at: string
          entry_date: string
          id: string
          mood: string
          prompt: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          content?: string
          created_at?: string
          entry_date?: string
          id?: string
          mood?: string
          prompt?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string
          entry_date?: string
          id?: string
          mood?: string
          prompt?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      karma_deeds: {
        Row: {
          completed_date: string
          created_at: string
          deed_key: string
          id: string
          points: number
          user_id: string
        }
        Insert: {
          completed_date?: string
          created_at?: string
          deed_key: string
          id?: string
          points?: number
          user_id: string
        }
        Update: {
          completed_date?: string
          created_at?: string
          deed_key?: string
          id?: string
          points?: number
          user_id?: string
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
      kundli_reports: {
        Row: {
          ai_insights: Json | null
          birth_details: Json
          chart_data: Json
          created_at: string | null
          dasha_data: Json | null
          generated_at: string | null
          id: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          ai_insights?: Json | null
          birth_details?: Json
          chart_data?: Json
          created_at?: string | null
          dasha_data?: Json | null
          generated_at?: string | null
          id?: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          ai_insights?: Json | null
          birth_details?: Json
          chart_data?: Json
          created_at?: string | null
          dasha_data?: Json | null
          generated_at?: string | null
          id?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      life_goals: {
        Row: {
          category: string
          completed: boolean
          created_at: string
          description: string
          id: string
          milestones: Json
          progress: number
          religion_guidance: string | null
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          category?: string
          completed?: boolean
          created_at?: string
          description?: string
          id?: string
          milestones?: Json
          progress?: number
          religion_guidance?: string | null
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          category?: string
          completed?: boolean
          created_at?: string
          description?: string
          id?: string
          milestones?: Json
          progress?: number
          religion_guidance?: string | null
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      notifications: {
        Row: {
          body: string
          created_at: string
          id: string
          read: boolean
          title: string
          type: string
          user_id: string
        }
        Insert: {
          body: string
          created_at?: string
          id?: string
          read?: boolean
          title: string
          type?: string
          user_id: string
        }
        Update: {
          body?: string
          created_at?: string
          id?: string
          read?: boolean
          title?: string
          type?: string
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
          avatar_url: string | null
          birth_date: string | null
          birth_place: string | null
          birth_time: string | null
          birth_time_known: boolean | null
          caste: string | null
          country: string | null
          created_at: string | null
          email_verified: boolean | null
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
          religion: string | null
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          birth_date?: string | null
          birth_place?: string | null
          birth_time?: string | null
          birth_time_known?: boolean | null
          caste?: string | null
          country?: string | null
          created_at?: string | null
          email_verified?: boolean | null
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
          religion?: string | null
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          birth_date?: string | null
          birth_place?: string | null
          birth_time?: string | null
          birth_time_known?: boolean | null
          caste?: string | null
          country?: string | null
          created_at?: string | null
          email_verified?: boolean | null
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
          religion?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      push_subscriptions: {
        Row: {
          created_at: string
          endpoint: string
          id: string
          preferences: Json | null
          subscribed_at: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          endpoint: string
          id?: string
          preferences?: Json | null
          subscribed_at?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          endpoint?: string
          id?: string
          preferences?: Json | null
          subscribed_at?: string
          updated_at?: string
          user_id?: string
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
      saved_inspirations: {
        Row: {
          id: string
          quote_text: string
          religion: string
          saved_at: string
          source: string
          user_id: string
        }
        Insert: {
          id?: string
          quote_text: string
          religion?: string
          saved_at?: string
          source: string
          user_id: string
        }
        Update: {
          id?: string
          quote_text?: string
          religion?: string
          saved_at?: string
          source?: string
          user_id?: string
        }
        Relationships: []
      }
      spiritual_badges: {
        Row: {
          badge_key: string
          earned_at: string
          id: string
          user_id: string
        }
        Insert: {
          badge_key: string
          earned_at?: string
          id?: string
          user_id: string
        }
        Update: {
          badge_key?: string
          earned_at?: string
          id?: string
          user_id?: string
        }
        Relationships: []
      }
      spiritual_challenges_progress: {
        Row: {
          challenge_key: string
          completed: boolean
          completed_at: string | null
          completed_days: Json
          created_at: string
          current_streak: number
          id: string
          longest_streak: number
          started_at: string
          updated_at: string
          user_id: string
        }
        Insert: {
          challenge_key: string
          completed?: boolean
          completed_at?: string | null
          completed_days?: Json
          created_at?: string
          current_streak?: number
          id?: string
          longest_streak?: number
          started_at?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          challenge_key?: string
          completed?: boolean
          completed_at?: string | null
          completed_days?: Json
          created_at?: string
          current_streak?: number
          id?: string
          longest_streak?: number
          started_at?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      spiritual_growth_logs: {
        Row: {
          activity_type: string
          completed_date: string
          created_at: string
          id: string
          user_id: string
        }
        Insert: {
          activity_type: string
          completed_date?: string
          created_at?: string
          id?: string
          user_id: string
        }
        Update: {
          activity_type?: string
          completed_date?: string
          created_at?: string
          id?: string
          user_id?: string
        }
        Relationships: []
      }
      spiritual_personality_results: {
        Row: {
          answers: Json
          created_at: string
          id: string
          personality_type: string
          scores: Json
          taken_at: string
          user_id: string
        }
        Insert: {
          answers?: Json
          created_at?: string
          id?: string
          personality_type: string
          scores?: Json
          taken_at?: string
          user_id: string
        }
        Update: {
          answers?: Json
          created_at?: string
          id?: string
          personality_type?: string
          scores?: Json
          taken_at?: string
          user_id?: string
        }
        Relationships: []
      }
      spiritual_routine_logs: {
        Row: {
          completed_date: string
          created_at: string
          id: string
          routine_key: string
          user_id: string
        }
        Insert: {
          completed_date?: string
          created_at?: string
          id?: string
          routine_key: string
          user_id: string
        }
        Update: {
          completed_date?: string
          created_at?: string
          id?: string
          routine_key?: string
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
