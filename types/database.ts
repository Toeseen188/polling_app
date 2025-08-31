// Database types that match the Supabase schema exactly
// These types represent the actual database structure

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          name: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          name: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          name?: string
          created_at?: string
          updated_at?: string
        }
      }
      polls: {
        Row: {
          id: string
          title: string
          description: string | null
          created_by: string
          is_active: boolean
          allow_multiple_votes: boolean
          expires_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          description?: string | null
          created_by: string
          is_active?: boolean
          allow_multiple_votes?: boolean
          expires_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string | null
          created_by?: string
          is_active?: boolean
          allow_multiple_votes?: boolean
          expires_at?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      poll_options: {
        Row: {
          id: string
          poll_id: string
          text: string
          created_at: string
        }
        Insert: {
          id?: string
          poll_id: string
          text: string
          created_at?: string
        }
        Update: {
          id?: string
          poll_id?: string
          text?: string
          created_at?: string
        }
      }
      votes: {
        Row: {
          id: string
          poll_id: string
          user_id: string
          option_id: string
          created_at: string
        }
        Insert: {
          id?: string
          poll_id: string
          user_id: string
          option_id: string
          created_at?: string
        }
        Update: {
          id?: string
          poll_id?: string
          user_id?: string
          option_id?: string
          created_at?: string
        }
      }
    }
    Views: {
      poll_results: {
        Row: {
          option_id: string
          poll_id: string
          option_text: string
          vote_count: number
        }
      }
      active_polls: {
        Row: {
          id: string
          title: string
          description: string | null
          created_by: string
          is_active: boolean
          allow_multiple_votes: boolean
          expires_at: string | null
          created_at: string
          updated_at: string
          creator_name: string
          option_count: number
          total_votes: number
        }
      }
    }
    Functions: {
      update_updated_at_column: {
        Args: Record<string, never>
        Returns: unknown
      }
      check_poll_expiration: {
        Args: Record<string, never>
        Returns: unknown
      }
    }
    Enums: {
      poll_status: 'active' | 'inactive' | 'expired'
    }
  }
}

// Helper types for common operations
export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row']
export type Inserts<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Insert']
export type Updates<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Update']

// Specific table types
export type User = Tables<'users'>
export type Poll = Tables<'polls'>
export type PollOption = Tables<'poll_options'>
export type Vote = Tables<'votes'>

// View types
export type PollResult = Database['public']['Views']['poll_results']['Row']
export type ActivePoll = Database['public']['Views']['active_polls']['Row']

// Insert types
export type InsertUser = Inserts<'users'>
export type InsertPoll = Inserts<'polls'>
export type InsertPollOption = Inserts<'poll_options'>
export type InsertVote = Inserts<'votes'>

// Update types
export type UpdateUser = Updates<'users'>
export type UpdatePoll = Updates<'polls'>
export type UpdatePollOption = Updates<'poll_options'>
export type UpdateVote = Updates<'votes'>

// Extended types for application use
export interface PollWithOptions extends Poll {
  options: PollOption[]
  creator: User
}

export interface PollWithResults extends Poll {
  options: (PollOption & { vote_count: number })[]
  creator: User
  total_votes: number
}

export interface UserWithPolls extends User {
  polls: Poll[]
}

export interface VoteWithDetails extends Vote {
  poll: Poll
  option: PollOption
  user: User
}
