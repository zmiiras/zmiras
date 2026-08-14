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
    PostgrestVersion: "14.15"
  }
  public: {
    Tables: {
      admin_accounts: {
        Row: {
          created_at: string
          email: string
          id: string
          is_enabled: boolean
          is_primary: boolean
          label: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          is_enabled?: boolean
          is_primary?: boolean
          label?: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          is_enabled?: boolean
          is_primary?: boolean
          label?: string
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      admin_activity_logs: {
        Row: {
          action: string
          actor_email: string
          created_at: string
          details: string
          entity_label: string
          entity_type: string
          id: string
        }
        Insert: {
          action: string
          actor_email?: string
          created_at?: string
          details?: string
          entity_label?: string
          entity_type?: string
          id?: string
        }
        Update: {
          action?: string
          actor_email?: string
          created_at?: string
          details?: string
          entity_label?: string
          entity_type?: string
          id?: string
        }
        Relationships: []
      }
      offers: {
        Row: {
          created_at: string
          id: string
          is_active: boolean
          new_price: string
          old_price: string
          sort_order: number
          title: string
          updated_at: string
          whatsapp_url: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_active?: boolean
          new_price?: string
          old_price?: string
          sort_order?: number
          title: string
          updated_at?: string
          whatsapp_url?: string
        }
        Update: {
          created_at?: string
          id?: string
          is_active?: boolean
          new_price?: string
          old_price?: string
          sort_order?: number
          title?: string
          updated_at?: string
          whatsapp_url?: string
        }
        Relationships: []
      }
      partners: {
        Row: {
          created_at: string
          id: string
          is_active: boolean
          link_url: string
          logo_url: string | null
          sort_order: number
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_active?: boolean
          link_url?: string
          logo_url?: string | null
          sort_order?: number
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          is_active?: boolean
          link_url?: string
          logo_url?: string | null
          sort_order?: number
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      portfolio: {
        Row: {
          category: string
          created_at: string
          description: string
          id: string
          image_url: string | null
          is_active: boolean
          link_url: string
          sort_order: number
          title: string
          updated_at: string
        }
        Insert: {
          category?: string
          created_at?: string
          description?: string
          id?: string
          image_url?: string | null
          is_active?: boolean
          link_url?: string
          sort_order?: number
          title: string
          updated_at?: string
        }
        Update: {
          category?: string
          created_at?: string
          description?: string
          id?: string
          image_url?: string | null
          is_active?: boolean
          link_url?: string
          sort_order?: number
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      services: {
        Row: {
          created_at: string
          description: string
          faq: Json
          features: string[]
          gallery: string[]
          icon: string
          id: string
          image_url: string | null
          is_active: boolean
          price_label: string
          short_description: string
          slug: string
          sort_order: number
          subtitle: string
          title: string
          updated_at: string
          whatsapp_message: string
        }
        Insert: {
          created_at?: string
          description?: string
          faq?: Json
          features?: string[]
          gallery?: string[]
          icon?: string
          id?: string
          image_url?: string | null
          is_active?: boolean
          price_label?: string
          short_description?: string
          slug: string
          sort_order?: number
          subtitle?: string
          title: string
          updated_at?: string
          whatsapp_message?: string
        }
        Update: {
          created_at?: string
          description?: string
          faq?: Json
          features?: string[]
          gallery?: string[]
          icon?: string
          id?: string
          image_url?: string | null
          is_active?: boolean
          price_label?: string
          short_description?: string
          slug?: string
          sort_order?: number
          subtitle?: string
          title?: string
          updated_at?: string
          whatsapp_message?: string
        }
        Relationships: []
      }
      site_settings: {
        Row: {
          banner_animated: boolean
          banner_bg_color: string
          banner_bg_color_2: string
          banner_btn_bg: string
          banner_btn_text_color: string
          banner_label: string
          banner_old_price_color: string
          banner_price_bg: string
          banner_price_color: string
          banner_speed: number
          banner_style: string
          banner_text_color: string
          chat_enabled: boolean
          contact_description: string
          contact_email: string
          contact_kicker: string
          contact_title: string
          created_at: string
          facebook_url: string
          footer_about: string
          footer_contact_title: string
          footer_copyright: string
          hero_badge: string
          hero_cta_primary: string
          hero_cta_secondary: string
          hero_guarantee: string
          hero_subtitle: string
          hero_title: string
          id: string
          instagram_url: string
          linkedin_url: string
          portfolio_kicker: string
          portfolio_title: string
          services_kicker: string
          services_title: string
          stat1_label: string
          stat1_value: string
          stat2_label: string
          stat2_value: string
          stat3_label: string
          stat3_value: string
          testimonials_kicker: string
          testimonials_title: string
          tiktok_url: string
          updated_at: string
          whatsapp_float_enabled: boolean
          whatsapp_float_message: string
          whatsapp_number: string
          x_url: string
          youtube_url: string
                    logo_url?: string | null
            logo_width?: number | null
            logo_height?: number | null
          }
        Insert: {
          banner_animated?: boolean
          banner_bg_color?: string
          banner_bg_color_2?: string
          banner_btn_bg?: string
          banner_btn_text_color?: string
          banner_label?: string
          banner_old_price_color?: string
          banner_price_bg?: string
          banner_price_color?: string
          banner_speed?: number
          banner_style?: string
          banner_text_color?: string
          chat_enabled?: boolean
          contact_description?: string
          contact_email?: string
          contact_kicker?: string
          contact_title?: string
          created_at?: string
          facebook_url?: string
          footer_about?: string
          footer_contact_title?: string
          footer_copyright?: string
          hero_badge?: string
          hero_cta_primary?: string
          hero_cta_secondary?: string
          hero_guarantee?: string
          hero_subtitle?: string
          hero_title?: string
          id?: string
          instagram_url?: string
          linkedin_url?: string
          portfolio_kicker?: string
          portfolio_title?: string
          services_kicker?: string
          services_title?: string
          stat1_label?: string
          stat1_value?: string
          stat2_label?: string
          stat2_value?: string
          stat3_label?: string
          stat3_value?: string
          testimonials_kicker?: string
          testimonials_title?: string
          tiktok_url?: string
          updated_at?: string
          whatsapp_float_enabled?: boolean
          whatsapp_float_message?: string
          whatsapp_number?: string
          x_url?: string
          youtube_url?: string
                    logo_url?: string | null
            logo_width?: number | null
            logo_height?: number | null
          }
        Update: {
          banner_animated?: boolean
          banner_bg_color?: string
          banner_bg_color_2?: string
          banner_btn_bg?: string
          banner_btn_text_color?: string
          banner_label?: string
          banner_old_price_color?: string
          banner_price_bg?: string
          banner_price_color?: string
          banner_speed?: number
          banner_style?: string
          banner_text_color?: string
          chat_enabled?: boolean
          contact_description?: string
          contact_email?: string
          contact_kicker?: string
          contact_title?: string
          created_at?: string
          facebook_url?: string
          footer_about?: string
          footer_contact_title?: string
          footer_copyright?: string
          hero_badge?: string
          hero_cta_primary?: string
          hero_cta_secondary?: string
          hero_guarantee?: string
          hero_subtitle?: string
          hero_title?: string
          id?: string
          instagram_url?: string
          linkedin_url?: string
          portfolio_kicker?: string
          portfolio_title?: string
          services_kicker?: string
          services_title?: string
          stat1_label?: string
          stat1_value?: string
          stat2_label?: string
          stat2_value?: string
          stat3_label?: string
          stat3_value?: string
          testimonials_kicker?: string
          testimonials_title?: string
          tiktok_url?: string
          updated_at?: string
          whatsapp_float_enabled?: boolean
          whatsapp_float_message?: string
          whatsapp_number?: string
          x_url?: string
          youtube_url?: string
                    logo_url?: string | null
            logo_width?: number | null
            logo_height?: number | null
          }
        Relationships: []
      }
      testimonials: {
        Row: {
          content: string
          created_at: string
          id: string
          is_approved: boolean
          name: string
          rating: number
          role: string
          sort_order: number
          updated_at: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          is_approved?: boolean
          name: string
          rating?: number
          role?: string
          sort_order?: number
          updated_at?: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          is_approved?: boolean
          name?: string
          rating?: number
          role?: string
          sort_order?: number
          updated_at?: string
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
