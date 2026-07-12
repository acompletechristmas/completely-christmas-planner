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
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      cards: {
        Row: {
          address: string | null
          created_at: string
          id: string
          notes: string | null
          received: boolean
          recipient: string
          sent: boolean
          sort_order: number
          updated_at: string
          user_id: string
        }
        Insert: {
          address?: string | null
          created_at?: string
          id?: string
          notes?: string | null
          received?: boolean
          recipient?: string
          sent?: boolean
          sort_order?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          address?: string | null
          created_at?: string
          id?: string
          notes?: string | null
          received?: boolean
          recipient?: string
          sent?: boolean
          sort_order?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      gifts: {
        Row: {
          category: string | null
          created_at: string
          delivered: boolean
          given_by: string | null
          id: string
          item: string
          notes: string | null
          opening_photo_url: string | null
          person_id: string | null
          photo_url: string | null
          post_notes: string | null
          price: number | null
          purchase_date: string | null
          rating: string | null
          recipient: string
          shop: string | null
          sort_order: number
          status: string
          updated_at: string
          url: string | null
          user_id: string
          wrapped: boolean
          year: number
        }
        Insert: {
          category?: string | null
          created_at?: string
          delivered?: boolean
          given_by?: string | null
          id?: string
          item?: string
          notes?: string | null
          opening_photo_url?: string | null
          person_id?: string | null
          photo_url?: string | null
          post_notes?: string | null
          price?: number | null
          purchase_date?: string | null
          rating?: string | null
          recipient?: string
          shop?: string | null
          sort_order?: number
          status?: string
          updated_at?: string
          url?: string | null
          user_id: string
          wrapped?: boolean
          year?: number
        }
        Update: {
          category?: string | null
          created_at?: string
          delivered?: boolean
          given_by?: string | null
          id?: string
          item?: string
          notes?: string | null
          opening_photo_url?: string | null
          person_id?: string | null
          photo_url?: string | null
          post_notes?: string | null
          price?: number | null
          purchase_date?: string | null
          rating?: string | null
          recipient?: string
          shop?: string | null
          sort_order?: number
          status?: string
          updated_at?: string
          url?: string | null
          user_id?: string
          wrapped?: boolean
          year?: number
        }
        Relationships: [
          {
            foreignKeyName: "gifts_person_id_fkey"
            columns: ["person_id"]
            isOneToOne: false
            referencedRelation: "people"
            referencedColumns: ["id"]
          },
        ]
      }
      partner_enquiries: {
        Row: {
          budget: string | null
          company: string
          contact_name: string
          created_at: string
          email: string
          id: string
          message: string | null
          website: string | null
        }
        Insert: {
          budget?: string | null
          company: string
          contact_name: string
          created_at?: string
          email: string
          id?: string
          message?: string | null
          website?: string | null
        }
        Update: {
          budget?: string | null
          company?: string
          contact_name?: string
          created_at?: string
          email?: string
          id?: string
          message?: string | null
          website?: string | null
        }
        Relationships: []
      }
      people: {
        Row: {
          avatar_url: string | null
          clothing_size: string | null
          created_at: string
          date_of_birth: string | null
          favourite_books: string | null
          favourite_characters: string | null
          favourite_colours: string | null
          favourite_films: string | null
          favourite_games: string | null
          favourite_shops: string | null
          gift_budget: number | null
          hobbies: string | null
          id: string
          name: string
          notes: string | null
          relationship: string | null
          shoe_size: string | null
          sort_order: number
          updated_at: string
          user_id: string
          wishlist: string | null
        }
        Insert: {
          avatar_url?: string | null
          clothing_size?: string | null
          created_at?: string
          date_of_birth?: string | null
          favourite_books?: string | null
          favourite_characters?: string | null
          favourite_colours?: string | null
          favourite_films?: string | null
          favourite_games?: string | null
          favourite_shops?: string | null
          gift_budget?: number | null
          hobbies?: string | null
          id?: string
          name?: string
          notes?: string | null
          relationship?: string | null
          shoe_size?: string | null
          sort_order?: number
          updated_at?: string
          user_id: string
          wishlist?: string | null
        }
        Update: {
          avatar_url?: string | null
          clothing_size?: string | null
          created_at?: string
          date_of_birth?: string | null
          favourite_books?: string | null
          favourite_characters?: string | null
          favourite_colours?: string | null
          favourite_films?: string | null
          favourite_games?: string | null
          favourite_shops?: string | null
          gift_budget?: number | null
          hobbies?: string | null
          id?: string
          name?: string
          notes?: string | null
          relationship?: string | null
          shoe_size?: string | null
          sort_order?: number
          updated_at?: string
          user_id?: string
          wishlist?: string | null
        }
        Relationships: []
      }
      planner_settings: {
        Row: {
          budget_total: number | null
          created_at: string
          decorates_indoor: boolean
          decorates_outdoor: boolean
          dietary_notes: string | null
          is_hosting: boolean
          is_travelling: boolean
          notes: string | null
          num_adults: number
          num_children: number
          planning_style: string
          sends_cards: boolean
          setup_completed: boolean
          stress_free: boolean
          updated_at: string
          user_id: string
        }
        Insert: {
          budget_total?: number | null
          created_at?: string
          decorates_indoor?: boolean
          decorates_outdoor?: boolean
          dietary_notes?: string | null
          is_hosting?: boolean
          is_travelling?: boolean
          notes?: string | null
          num_adults?: number
          num_children?: number
          planning_style?: string
          sends_cards?: boolean
          setup_completed?: boolean
          stress_free?: boolean
          updated_at?: string
          user_id: string
        }
        Update: {
          budget_total?: number | null
          created_at?: string
          decorates_indoor?: boolean
          decorates_outdoor?: boolean
          dietary_notes?: string | null
          is_hosting?: boolean
          is_travelling?: boolean
          notes?: string | null
          num_adults?: number
          num_children?: number
          planning_style?: string
          sends_cards?: boolean
          setup_completed?: boolean
          stress_free?: boolean
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      reminders: {
        Row: {
          category: string
          created_at: string
          done: boolean
          id: string
          notes: string | null
          remind_on: string
          sort_order: number
          source: string
          target_date: string | null
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          category?: string
          created_at?: string
          done?: boolean
          id?: string
          notes?: string | null
          remind_on: string
          sort_order?: number
          source?: string
          target_date?: string | null
          title?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          category?: string
          created_at?: string
          done?: boolean
          id?: string
          notes?: string | null
          remind_on?: string
          sort_order?: number
          source?: string
          target_date?: string | null
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      resources: {
        Row: {
          category: string
          content_html: string | null
          created_at: string
          created_by: string | null
          description: string | null
          difficulty: string | null
          digital: boolean
          file_url: string | null
          group_type: string | null
          id: string
          is_premium: boolean
          is_public: boolean
          length_minutes: number | null
          printable: boolean
          setting: string | null
          slug: string | null
          source: string
          subcategory: string | null
          subject: string | null
          tags: string[]
          thumbnail_url: string | null
          title: string
          updated_at: string
          view_count: number
          year_max: number | null
          year_min: number | null
        }
        Insert: {
          category: string
          content_html?: string | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          difficulty?: string | null
          digital?: boolean
          file_url?: string | null
          group_type?: string | null
          id?: string
          is_premium?: boolean
          is_public?: boolean
          length_minutes?: number | null
          printable?: boolean
          setting?: string | null
          slug?: string | null
          source?: string
          subcategory?: string | null
          subject?: string | null
          tags?: string[]
          thumbnail_url?: string | null
          title: string
          updated_at?: string
          view_count?: number
          year_max?: number | null
          year_min?: number | null
        }
        Update: {
          category?: string
          content_html?: string | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          difficulty?: string | null
          digital?: boolean
          file_url?: string | null
          group_type?: string | null
          id?: string
          is_premium?: boolean
          is_public?: boolean
          length_minutes?: number | null
          printable?: boolean
          setting?: string | null
          slug?: string | null
          source?: string
          subcategory?: string | null
          subject?: string | null
          tags?: string[]
          thumbnail_url?: string | null
          title?: string
          updated_at?: string
          view_count?: number
          year_max?: number | null
          year_min?: number | null
        }
        Relationships: []
      }
      todos: {
        Row: {
          category: string
          created_at: string
          done: boolean
          due_date: string | null
          id: string
          sort_order: number
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          category?: string
          created_at?: string
          done?: boolean
          due_date?: string | null
          id?: string
          sort_order?: number
          title?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          category?: string
          created_at?: string
          done?: boolean
          due_date?: string | null
          id?: string
          sort_order?: number
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      waitlist: {
        Row: {
          created_at: string
          email: string
          id: string
          interests: string[] | null
          name: string | null
          postcode: string | null
          source: string | null
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          interests?: string[] | null
          name?: string | null
          postcode?: string | null
          source?: string | null
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          interests?: string[] | null
          name?: string | null
          postcode?: string | null
          source?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "moderator" | "user"
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
      app_role: ["admin", "moderator", "user"],
    },
  },
} as const
