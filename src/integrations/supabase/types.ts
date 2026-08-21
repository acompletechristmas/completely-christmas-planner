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
      christmas_looks: {
        Row: {
          categories: string[]
          created_at: string
          hero_image_url: string | null
          id: string
          is_active: boolean
          key_elements: string[]
          long_description: string | null
          name: string
          palette: Json
          short_description: string
          slug: string
          sort_order: number
          updated_at: string
        }
        Insert: {
          categories?: string[]
          created_at?: string
          hero_image_url?: string | null
          id?: string
          is_active?: boolean
          key_elements?: string[]
          long_description?: string | null
          name: string
          palette?: Json
          short_description?: string
          slug: string
          sort_order?: number
          updated_at?: string
        }
        Update: {
          categories?: string[]
          created_at?: string
          hero_image_url?: string | null
          id?: string
          is_active?: boolean
          key_elements?: string[]
          long_description?: string | null
          name?: string
          palette?: Json
          short_description?: string
          slug?: string
          sort_order?: number
          updated_at?: string
        }
        Relationships: []
      }
      curated_experiences: {
        Row: {
          affiliate_url: string | null
          audiences: string[]
          blurb: string | null
          booking_url: string | null
          checked_at: string
          created_at: string
          description: string | null
          end_date: string | null
          event_time: string | null
          id: string
          image_url: string | null
          is_active: boolean
          is_featured: boolean
          is_sponsored: boolean
          lat: number | null
          lng: number | null
          name: string
          postcode: string | null
          price_band: string
          price_from: number | null
          rating: number | null
          setting: string
          source_name: string
          source_url: string | null
          start_date: string | null
          time_of_day: string[]
          town: string | null
          type: string
          updated_at: string
          venue: string | null
        }
        Insert: {
          affiliate_url?: string | null
          audiences?: string[]
          blurb?: string | null
          booking_url?: string | null
          checked_at?: string
          created_at?: string
          description?: string | null
          end_date?: string | null
          event_time?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean
          is_featured?: boolean
          is_sponsored?: boolean
          lat?: number | null
          lng?: number | null
          name: string
          postcode?: string | null
          price_band?: string
          price_from?: number | null
          rating?: number | null
          setting?: string
          source_name?: string
          source_url?: string | null
          start_date?: string | null
          time_of_day?: string[]
          town?: string | null
          type: string
          updated_at?: string
          venue?: string | null
        }
        Update: {
          affiliate_url?: string | null
          audiences?: string[]
          blurb?: string | null
          booking_url?: string | null
          checked_at?: string
          created_at?: string
          description?: string | null
          end_date?: string | null
          event_time?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean
          is_featured?: boolean
          is_sponsored?: boolean
          lat?: number | null
          lng?: number | null
          name?: string
          postcode?: string | null
          price_band?: string
          price_from?: number | null
          rating?: number | null
          setting?: string
          source_name?: string
          source_url?: string | null
          start_date?: string | null
          time_of_day?: string[]
          town?: string | null
          type?: string
          updated_at?: string
          venue?: string | null
        }
        Relationships: []
      }
      decor_products: {
        Row: {
          affiliate_network: string | null
          affiliate_url: string | null
          created_at: string
          currency: string
          description: string | null
          id: string
          image_url: string | null
          is_available: boolean
          is_featured: boolean
          is_sponsored: boolean
          last_checked_at: string | null
          name: string
          previous_price: number | null
          price: number | null
          product_url: string | null
          retailer: string
          updated_at: string
        }
        Insert: {
          affiliate_network?: string | null
          affiliate_url?: string | null
          created_at?: string
          currency?: string
          description?: string | null
          id?: string
          image_url?: string | null
          is_available?: boolean
          is_featured?: boolean
          is_sponsored?: boolean
          last_checked_at?: string | null
          name: string
          previous_price?: number | null
          price?: number | null
          product_url?: string | null
          retailer?: string
          updated_at?: string
        }
        Update: {
          affiliate_network?: string | null
          affiliate_url?: string | null
          created_at?: string
          currency?: string
          description?: string | null
          id?: string
          image_url?: string | null
          is_available?: boolean
          is_featured?: boolean
          is_sponsored?: boolean
          last_checked_at?: string | null
          name?: string
          previous_price?: number | null
          price?: number | null
          product_url?: string | null
          retailer?: string
          updated_at?: string
        }
        Relationships: []
      }
      food_items: {
        Row: {
          created_at: string
          dietary_tags: string[]
          id: string
          meal: string
          name: string
          needs_shopping: boolean
          notes: string | null
          occasion_id: string
          prep_date: string | null
          responsible_name: string | null
          responsible_person_id: string | null
          servings: number | null
          sort_order: number
          source: string
          status: string
          suggestion_key: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          dietary_tags?: string[]
          id?: string
          meal?: string
          name: string
          needs_shopping?: boolean
          notes?: string | null
          occasion_id: string
          prep_date?: string | null
          responsible_name?: string | null
          responsible_person_id?: string | null
          servings?: number | null
          sort_order?: number
          source?: string
          status?: string
          suggestion_key?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          dietary_tags?: string[]
          id?: string
          meal?: string
          name?: string
          needs_shopping?: boolean
          notes?: string | null
          occasion_id?: string
          prep_date?: string | null
          responsible_name?: string | null
          responsible_person_id?: string | null
          servings?: number | null
          sort_order?: number
          source?: string
          status?: string
          suggestion_key?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "food_items_occasion_id_fkey"
            columns: ["occasion_id"]
            isOneToOne: false
            referencedRelation: "food_occasions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "food_items_responsible_person_id_fkey"
            columns: ["responsible_person_id"]
            isOneToOne: false
            referencedRelation: "people"
            referencedColumns: ["id"]
          },
        ]
      }
      food_occasion_guests: {
        Row: {
          created_at: string
          dietary_notes: string | null
          dietary_tags: string[]
          guest_name: string | null
          id: string
          occasion_id: string
          person_id: string | null
          sort_order: number
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          dietary_notes?: string | null
          dietary_tags?: string[]
          guest_name?: string | null
          id?: string
          occasion_id: string
          person_id?: string | null
          sort_order?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          dietary_notes?: string | null
          dietary_tags?: string[]
          guest_name?: string | null
          id?: string
          occasion_id?: string
          person_id?: string | null
          sort_order?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "food_occasion_guests_occasion_id_fkey"
            columns: ["occasion_id"]
            isOneToOne: false
            referencedRelation: "food_occasions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "food_occasion_guests_person_id_fkey"
            columns: ["person_id"]
            isOneToOne: false
            referencedRelation: "people"
            referencedColumns: ["id"]
          },
        ]
      }
      food_occasions: {
        Row: {
          created_at: string
          default_key: string | null
          id: string
          is_default: boolean
          name: string
          notes: string | null
          num_adults: number
          num_children: number
          occasion_date: string | null
          sort_order: number
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          default_key?: string | null
          id?: string
          is_default?: boolean
          name: string
          notes?: string | null
          num_adults?: number
          num_children?: number
          occasion_date?: string | null
          sort_order?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          default_key?: string | null
          id?: string
          is_default?: boolean
          name?: string
          notes?: string | null
          num_adults?: number
          num_children?: number
          occasion_date?: string | null
          sort_order?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      food_shopping_items: {
        Row: {
          bought: boolean
          category: string | null
          created_at: string
          food_item_id: string | null
          id: string
          item: string
          notes: string | null
          quantity: number | null
          sort_order: number
          unit: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          bought?: boolean
          category?: string | null
          created_at?: string
          food_item_id?: string | null
          id?: string
          item: string
          notes?: string | null
          quantity?: number | null
          sort_order?: number
          unit?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          bought?: boolean
          category?: string | null
          created_at?: string
          food_item_id?: string | null
          id?: string
          item?: string
          notes?: string | null
          quantity?: number | null
          sort_order?: number
          unit?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "food_shopping_items_food_item_id_fkey"
            columns: ["food_item_id"]
            isOneToOne: false
            referencedRelation: "food_items"
            referencedColumns: ["id"]
          },
        ]
      }
      gifts: {
        Row: {
          arrived: boolean
          category: string | null
          created_at: string
          delivered: boolean
          given: boolean
          given_at: string | null
          given_by: string | null
          hidden_location: string | null
          id: string
          is_chosen: boolean
          is_idea: boolean
          item: string
          notes: string | null
          opening_photo_url: string | null
          ordered: boolean
          ordered_at: string | null
          person_id: string | null
          photo_url: string | null
          post_notes: string | null
          price: number | null
          purchase_date: string | null
          rating: string | null
          received_at: string | null
          recipient: string
          sent: boolean
          sent_at: string | null
          shop: string | null
          sort_order: number
          status: string
          updated_at: string
          url: string | null
          user_id: string
          wrapped: boolean
          wrapped_at: string | null
          year: number
        }
        Insert: {
          arrived?: boolean
          category?: string | null
          created_at?: string
          delivered?: boolean
          given?: boolean
          given_at?: string | null
          given_by?: string | null
          hidden_location?: string | null
          id?: string
          is_chosen?: boolean
          is_idea?: boolean
          item?: string
          notes?: string | null
          opening_photo_url?: string | null
          ordered?: boolean
          ordered_at?: string | null
          person_id?: string | null
          photo_url?: string | null
          post_notes?: string | null
          price?: number | null
          purchase_date?: string | null
          rating?: string | null
          received_at?: string | null
          recipient?: string
          sent?: boolean
          sent_at?: string | null
          shop?: string | null
          sort_order?: number
          status?: string
          updated_at?: string
          url?: string | null
          user_id: string
          wrapped?: boolean
          wrapped_at?: string | null
          year?: number
        }
        Update: {
          arrived?: boolean
          category?: string | null
          created_at?: string
          delivered?: boolean
          given?: boolean
          given_at?: string | null
          given_by?: string | null
          hidden_location?: string | null
          id?: string
          is_chosen?: boolean
          is_idea?: boolean
          item?: string
          notes?: string | null
          opening_photo_url?: string | null
          ordered?: boolean
          ordered_at?: string | null
          person_id?: string | null
          photo_url?: string | null
          post_notes?: string | null
          price?: number | null
          purchase_date?: string | null
          rating?: string | null
          received_at?: string | null
          recipient?: string
          sent?: boolean
          sent_at?: string | null
          shop?: string | null
          sort_order?: number
          status?: string
          updated_at?: string
          url?: string | null
          user_id?: string
          wrapped?: boolean
          wrapped_at?: string | null
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
      inspiration_products: {
        Row: {
          category: string
          colour_finish: string | null
          created_at: string
          id: string
          inspiration_id: string
          is_essential: boolean
          product_id: string
          quantity: number | null
          quantity_max: number | null
          quantity_unit: string | null
          size_note: string | null
          sort_order: number
          styling_note: string | null
          updated_at: string
        }
        Insert: {
          category: string
          colour_finish?: string | null
          created_at?: string
          id?: string
          inspiration_id: string
          is_essential?: boolean
          product_id: string
          quantity?: number | null
          quantity_max?: number | null
          quantity_unit?: string | null
          size_note?: string | null
          sort_order?: number
          styling_note?: string | null
          updated_at?: string
        }
        Update: {
          category?: string
          colour_finish?: string | null
          created_at?: string
          id?: string
          inspiration_id?: string
          is_essential?: boolean
          product_id?: string
          quantity?: number | null
          quantity_max?: number | null
          quantity_unit?: string | null
          size_note?: string | null
          sort_order?: number
          styling_note?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "inspiration_products_inspiration_id_fkey"
            columns: ["inspiration_id"]
            isOneToOne: false
            referencedRelation: "look_inspirations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "inspiration_products_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "decor_products"
            referencedColumns: ["id"]
          },
        ]
      }
      look_inspirations: {
        Row: {
          category: string
          created_at: string
          description: string | null
          id: string
          image_url: string | null
          is_active: boolean
          look_id: string
          slug: string
          sort_order: number
          styling_tip: string | null
          title: string
          updated_at: string
        }
        Insert: {
          category?: string
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean
          look_id: string
          slug: string
          sort_order?: number
          styling_tip?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          category?: string
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean
          look_id?: string
          slug?: string
          sort_order?: number
          styling_tip?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "look_inspirations_look_id_fkey"
            columns: ["look_id"]
            isOneToOne: false
            referencedRelation: "christmas_looks"
            referencedColumns: ["id"]
          },
        ]
      }
      look_products: {
        Row: {
          category: string
          created_at: string
          id: string
          look_id: string
          product_id: string
          sort_order: number
        }
        Insert: {
          category: string
          created_at?: string
          id?: string
          look_id: string
          product_id: string
          sort_order?: number
        }
        Update: {
          category?: string
          created_at?: string
          id?: string
          look_id?: string
          product_id?: string
          sort_order?: number
        }
        Relationships: [
          {
            foreignKeyName: "look_products_look_id_fkey"
            columns: ["look_id"]
            isOneToOne: false
            referencedRelation: "christmas_looks"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "look_products_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "decor_products"
            referencedColumns: ["id"]
          },
        ]
      }
      music_items: {
        Row: {
          artist: string | null
          created_at: string
          id: string
          is_annual: boolean
          is_favourite: boolean
          item_type: string
          moment: string
          moods: string[]
          notes: string | null
          participant_note: string | null
          participants: string[]
          sort_order: number
          source: string
          suggestion_key: string | null
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          artist?: string | null
          created_at?: string
          id?: string
          is_annual?: boolean
          is_favourite?: boolean
          item_type?: string
          moment?: string
          moods?: string[]
          notes?: string | null
          participant_note?: string | null
          participants?: string[]
          sort_order?: number
          source?: string
          suggestion_key?: string | null
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          artist?: string | null
          created_at?: string
          id?: string
          is_annual?: boolean
          is_favourite?: boolean
          item_type?: string
          moment?: string
          moods?: string[]
          notes?: string | null
          participant_note?: string | null
          participants?: string[]
          sort_order?: number
          source?: string
          suggestion_key?: string | null
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      outings: {
        Row: {
          attendees: string | null
          booked: boolean
          booking_url: string | null
          completed: boolean
          cost: number | null
          created_at: string
          event_date: string | null
          event_time: string | null
          id: string
          location: string | null
          name: string
          notes: string | null
          paid: boolean
          planned: boolean
          sort_order: number
          updated_at: string
          user_id: string
        }
        Insert: {
          attendees?: string | null
          booked?: boolean
          booking_url?: string | null
          completed?: boolean
          cost?: number | null
          created_at?: string
          event_date?: string | null
          event_time?: string | null
          id?: string
          location?: string | null
          name?: string
          notes?: string | null
          paid?: boolean
          planned?: boolean
          sort_order?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          attendees?: string | null
          booked?: boolean
          booking_url?: string | null
          completed?: boolean
          cost?: number | null
          created_at?: string
          event_date?: string | null
          event_time?: string | null
          id?: string
          location?: string | null
          name?: string
          notes?: string | null
          paid?: boolean
          planned?: boolean
          sort_order?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
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
          age_range: string | null
          avatar_url: string | null
          clothing_size: string | null
          created_at: string
          date_of_birth: string | null
          dislikes: string | null
          favourite_books: string | null
          favourite_characters: string | null
          favourite_colours: string | null
          favourite_films: string | null
          favourite_games: string | null
          favourite_shops: string | null
          gift_budget: number | null
          hobbies: string | null
          id: string
          initial_ideas: string | null
          name: string
          needs_card: boolean
          needs_stocking: boolean
          notes: string | null
          relationship: string | null
          shoe_size: string | null
          sort_order: number
          updated_at: string
          user_id: string
          wishlist: string | null
        }
        Insert: {
          age_range?: string | null
          avatar_url?: string | null
          clothing_size?: string | null
          created_at?: string
          date_of_birth?: string | null
          dislikes?: string | null
          favourite_books?: string | null
          favourite_characters?: string | null
          favourite_colours?: string | null
          favourite_films?: string | null
          favourite_games?: string | null
          favourite_shops?: string | null
          gift_budget?: number | null
          hobbies?: string | null
          id?: string
          initial_ideas?: string | null
          name?: string
          needs_card?: boolean
          needs_stocking?: boolean
          notes?: string | null
          relationship?: string | null
          shoe_size?: string | null
          sort_order?: number
          updated_at?: string
          user_id: string
          wishlist?: string | null
        }
        Update: {
          age_range?: string | null
          avatar_url?: string | null
          clothing_size?: string | null
          created_at?: string
          date_of_birth?: string | null
          dislikes?: string | null
          favourite_books?: string | null
          favourite_characters?: string | null
          favourite_colours?: string | null
          favourite_films?: string | null
          favourite_games?: string | null
          favourite_shops?: string | null
          gift_budget?: number | null
          hobbies?: string | null
          id?: string
          initial_ideas?: string | null
          name?: string
          needs_card?: boolean
          needs_stocking?: boolean
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
          celebration_style: string[]
          created_at: string
          decorates_indoor: boolean
          decorates_outdoor: boolean
          dietary_notes: string | null
          household_types: string[]
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
          celebration_style?: string[]
          created_at?: string
          decorates_indoor?: boolean
          decorates_outdoor?: boolean
          dietary_notes?: string | null
          household_types?: string[]
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
          celebration_style?: string[]
          created_at?: string
          decorates_indoor?: boolean
          decorates_outdoor?: boolean
          dietary_notes?: string | null
          household_types?: string[]
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
          notes: string | null
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
          notes?: string | null
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
          notes?: string | null
          sort_order?: number
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      traditions: {
        Row: {
          category: string | null
          created_at: string
          description: string | null
          done: boolean
          event_date: string | null
          id: string
          is_annual: boolean
          name: string
          participant_note: string | null
          participants: string[]
          sort_order: number
          source: string
          started_year: number | null
          suggestion_key: string | null
          timing: string
          updated_at: string
          user_id: string
        }
        Insert: {
          category?: string | null
          created_at?: string
          description?: string | null
          done?: boolean
          event_date?: string | null
          id?: string
          is_annual?: boolean
          name: string
          participant_note?: string | null
          participants?: string[]
          sort_order?: number
          source?: string
          started_year?: number | null
          suggestion_key?: string | null
          timing?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          category?: string | null
          created_at?: string
          description?: string | null
          done?: boolean
          event_date?: string | null
          id?: string
          is_annual?: boolean
          name?: string
          participant_note?: string | null
          participants?: string[]
          sort_order?: number
          source?: string
          started_year?: number | null
          suggestion_key?: string | null
          timing?: string
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
      watchlist_items: {
        Row: {
          age_guidance: string | null
          content_type: string | null
          created_at: string
          id: string
          is_annual: boolean
          is_favourite: boolean
          moods: string[]
          note: string | null
          participant_note: string | null
          participants: string[]
          release_year: number | null
          sort_order: number
          source: string
          suggestion_key: string | null
          timing: string
          title: string
          updated_at: string
          user_id: string
          watched: boolean
        }
        Insert: {
          age_guidance?: string | null
          content_type?: string | null
          created_at?: string
          id?: string
          is_annual?: boolean
          is_favourite?: boolean
          moods?: string[]
          note?: string | null
          participant_note?: string | null
          participants?: string[]
          release_year?: number | null
          sort_order?: number
          source?: string
          suggestion_key?: string | null
          timing?: string
          title: string
          updated_at?: string
          user_id: string
          watched?: boolean
        }
        Update: {
          age_guidance?: string | null
          content_type?: string | null
          created_at?: string
          id?: string
          is_annual?: boolean
          is_favourite?: boolean
          moods?: string[]
          note?: string | null
          participant_note?: string | null
          participants?: string[]
          release_year?: number | null
          sort_order?: number
          source?: string
          suggestion_key?: string | null
          timing?: string
          title?: string
          updated_at?: string
          user_id?: string
          watched?: boolean
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
