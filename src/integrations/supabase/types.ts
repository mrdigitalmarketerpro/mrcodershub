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
      platform_profiles: {
        Row: {
          contest_rating: number | null
          contests_attended: number | null
          contribution_score: number | null
          created_at: string
          easy_solved: number | null
          handle: string
          hard_solved: number | null
          id: string
          last_synced_at: string | null
          medium_solved: number | null
          platform: string
          problems_solved: number | null
          raw_payload: Json | null
          sync_error: string | null
          sync_status: string
          updated_at: string
          user_id: string
          verified: boolean
        }
        Insert: {
          contest_rating?: number | null
          contests_attended?: number | null
          contribution_score?: number | null
          created_at?: string
          easy_solved?: number | null
          handle: string
          hard_solved?: number | null
          id?: string
          last_synced_at?: string | null
          medium_solved?: number | null
          platform: string
          problems_solved?: number | null
          raw_payload?: Json | null
          sync_error?: string | null
          sync_status?: string
          updated_at?: string
          user_id: string
          verified?: boolean
        }
        Update: {
          contest_rating?: number | null
          contests_attended?: number | null
          contribution_score?: number | null
          created_at?: string
          easy_solved?: number | null
          handle?: string
          hard_solved?: number | null
          id?: string
          last_synced_at?: string | null
          medium_solved?: number | null
          platform?: string
          problems_solved?: number | null
          raw_payload?: Json | null
          sync_error?: string | null
          sync_status?: string
          updated_at?: string
          user_id?: string
          verified?: boolean
        }
        Relationships: []
      }
      platform_snapshots: {
        Row: {
          captured_at: string
          contest_rating: number | null
          contests_attended: number | null
          easy_solved: number | null
          hard_solved: number | null
          id: string
          medium_solved: number | null
          platform: string
          problems_solved: number | null
          raw_payload: Json | null
          user_id: string
        }
        Insert: {
          captured_at?: string
          contest_rating?: number | null
          contests_attended?: number | null
          easy_solved?: number | null
          hard_solved?: number | null
          id?: string
          medium_solved?: number | null
          platform: string
          problems_solved?: number | null
          raw_payload?: Json | null
          user_id: string
        }
        Update: {
          captured_at?: string
          contest_rating?: number | null
          contests_attended?: number | null
          easy_solved?: number | null
          hard_solved?: number | null
          id?: string
          medium_solved?: number | null
          platform?: string
          problems_solved?: number | null
          raw_payload?: Json | null
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          codeforces_handle: string | null
          college: string | null
          created_at: string
          display_name: string | null
          gfg_handle: string | null
          github_username: string | null
          hackerrank_handle: string | null
          id: string
          leetcode_handle: string | null
          onboarded: boolean
          updated_at: string
          user_id: string
          username: string | null
        }
        Insert: {
          avatar_url?: string | null
          codeforces_handle?: string | null
          college?: string | null
          created_at?: string
          display_name?: string | null
          gfg_handle?: string | null
          github_username?: string | null
          hackerrank_handle?: string | null
          id?: string
          leetcode_handle?: string | null
          onboarded?: boolean
          updated_at?: string
          user_id: string
          username?: string | null
        }
        Update: {
          avatar_url?: string | null
          codeforces_handle?: string | null
          college?: string | null
          created_at?: string
          display_name?: string | null
          gfg_handle?: string | null
          github_username?: string | null
          hackerrank_handle?: string | null
          id?: string
          leetcode_handle?: string | null
          onboarded?: boolean
          updated_at?: string
          user_id?: string
          username?: string | null
        }
        Relationships: []
      }
      sync_jobs: {
        Row: {
          completed_at: string | null
          created_at: string
          error_message: string | null
          id: string
          platform: string | null
          started_at: string | null
          status: string
          user_id: string
        }
        Insert: {
          completed_at?: string | null
          created_at?: string
          error_message?: string | null
          id?: string
          platform?: string | null
          started_at?: string | null
          status?: string
          user_id: string
        }
        Update: {
          completed_at?: string | null
          created_at?: string
          error_message?: string | null
          id?: string
          platform?: string | null
          started_at?: string | null
          status?: string
          user_id?: string
        }
        Relationships: []
      }
      user_scores: {
        Row: {
          college_rank: number | null
          created_at: string
          global_rank: number | null
          id: string
          last_computed_at: string
          platforms_linked: number
          rank_change: number | null
          total_contest_rating: number
          total_contests_attended: number
          total_problems_solved: number
          updated_at: string
          user_id: string
          weighted_score: number
        }
        Insert: {
          college_rank?: number | null
          created_at?: string
          global_rank?: number | null
          id?: string
          last_computed_at?: string
          platforms_linked?: number
          rank_change?: number | null
          total_contest_rating?: number
          total_contests_attended?: number
          total_problems_solved?: number
          updated_at?: string
          user_id: string
          weighted_score?: number
        }
        Update: {
          college_rank?: number | null
          created_at?: string
          global_rank?: number | null
          id?: string
          last_computed_at?: string
          platforms_linked?: number
          rank_change?: number | null
          total_contest_rating?: number
          total_contests_attended?: number
          total_problems_solved?: number
          updated_at?: string
          user_id?: string
          weighted_score?: number
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
      [_ in never]: never
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
    Enums: {},
  },
} as const
