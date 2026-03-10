export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      api_keys: {
        Row: {
          id: string
          user_id: string
          service_name: 'gemini' | 'adobe_sftp' | 'leonardo' | 'cloudinary'
          encrypted_key: string
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          service_name: 'gemini' | 'adobe_sftp' | 'leonardo' | 'cloudinary'
          encrypted_key: string
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          service_name?: 'gemini' | 'adobe_sftp' | 'leonardo' | 'cloudinary'
          encrypted_key?: string
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      tasks: {
        Row: {
          id: string
          user_id: string
          input_keyword: string
          model_used: string
          status: 'pending' | 'prompting' | 'generating' | 'upscaling' | 'uploading' | 'completed' | 'failed'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          input_keyword: string
          model_used: string
          status?: 'pending' | 'prompting' | 'generating' | 'upscaling' | 'uploading' | 'completed' | 'failed'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          input_keyword?: string
          model_used?: string
          status?: 'pending' | 'prompting' | 'generating' | 'upscaling' | 'uploading' | 'completed' | 'failed'
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      assets: {
        Row: {
          id: string
          task_id: string
          user_id: string
          prompt_used: string
          raw_url: string | null
          upscaled_url: string | null
          ai_score: number | null
          user_status: 'pending' | 'approved' | 'rejected'
          metadata_json: Json | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          task_id: string
          user_id: string
          prompt_used: string
          raw_url?: string | null
          upscaled_url?: string | null
          ai_score?: number | null
          user_status?: 'pending' | 'approved' | 'rejected'
          metadata_json?: Json | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          task_id?: string
          user_id?: string
          prompt_used?: string
          raw_url?: string | null
          upscaled_url?: string | null
          ai_score?: number | null
          user_status?: 'pending' | 'approved' | 'rejected'
          metadata_json?: Json | null
          created_at?: string
          updated_at?: string
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
