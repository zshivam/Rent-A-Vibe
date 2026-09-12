export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      venues: {
        Row: {
          id: string
          slug: string
          name: string
          tagline: string
          description: string
          category: 'cinema' | 'gaming' | 'party' | 'wellness' | 'music' | 'outdoor' | 'workshop'
          experience_type: string
          base_price_paise: number
          hourly_rate_paise: number
          security_deposit_paise: number
          capacity_max: number
          capacity_recommended: number
          city: string
          area: string
          full_address: string | null
          cover_image_url: string
          gallery_urls: Json
          amenities: Json
          included_equipment: Json
          house_rules: Json
          tags: string[]
          meta_description: string | null
          is_active: boolean
          total_bookings: number
          average_rating: number | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          slug: string
          name: string
          tagline: string
          description: string
          category: 'cinema' | 'gaming' | 'party' | 'wellness' | 'music' | 'outdoor' | 'workshop'
          experience_type: string
          base_price_paise: number
          hourly_rate_paise: number
          security_deposit_paise?: number
          capacity_max?: number
          capacity_recommended?: number
          city?: string
          area: string
          full_address?: string | null
          cover_image_url: string
          gallery_urls?: Json
          amenities?: Json
          included_equipment?: Json
          house_rules?: Json
          tags?: string[]
          meta_description?: string | null
          is_active?: boolean
          total_bookings?: number
          average_rating?: number | null
          created_at?: string
          updated_at?: string
        }
        Update: Partial<Database['public']['Tables']['venues']['Insert']>
      }
      venue_bookings: {
        Row: {
          id: string
          user_id: string
          venue_id: string
          booking_date: string
          slot_start_time: string
          slot_end_time: string
          slot_tier_id: string
          duration_hours: number
          guest_count: number
          rental_fee_paise: number
          security_deposit_paise: number
          total_amount_paise: number
          status: 'pending' | 'confirmed' | 'checked_in' | 'completed' | 'cancelled' | 'disputed'
          kyc_status: 'not_submitted' | 'submitted' | 'verified' | 'rejected'
          kyc_document_url: string | null
          razorpay_order_id: string | null
          razorpay_payment_id: string | null
          razorpay_signature: string | null
          payment_captured_at: string | null
          deposit_status: 'held' | 'released' | 'forfeited'
          deposit_released_at: string | null
          deposit_release_note: string | null
          check_in_at: string | null
          check_out_at: string | null
          space_inspection_note: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          venue_id: string
          booking_date: string
          slot_start_time: string
          slot_end_time: string
          slot_tier_id?: string
          duration_hours: number
          guest_count?: number
          rental_fee_paise: number
          security_deposit_paise?: number
          total_amount_paise: number
          status?: 'pending' | 'confirmed' | 'checked_in' | 'completed' | 'cancelled' | 'disputed'
          kyc_status?: 'not_submitted' | 'submitted' | 'verified' | 'rejected'
          kyc_document_url?: string | null
          razorpay_order_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: Partial<Database['public']['Tables']['venue_bookings']['Insert']>
      }
      profiles: {
        Row: {
          id: string
          full_name: string
          phone: string | null
          avatar_url: string | null
          kyc_status: 'not_submitted' | 'submitted' | 'verified' | 'rejected'
          kyc_document_url: string | null
          kyc_verified_at: string | null
          kyc_rejected_reason: string | null
          total_bookings: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          full_name: string
          phone?: string | null
          avatar_url?: string | null
          kyc_status?: 'not_submitted' | 'submitted' | 'verified' | 'rejected'
          kyc_document_url?: string | null
          total_bookings?: number
          created_at?: string
          updated_at?: string
        }
        Update: Partial<Database['public']['Tables']['profiles']['Insert']>
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      check_venue_availability: {
        Args: {
          p_venue_id: string
          p_start_time: string
          p_end_time: string
        }
        Returns: boolean
      }
    }
    Enums: {
      booking_status: 'pending' | 'confirmed' | 'checked_in' | 'completed' | 'cancelled' | 'disputed'
      kyc_status: 'not_submitted' | 'submitted' | 'verified' | 'rejected'
      deposit_status: 'held' | 'released' | 'forfeited'
    }
  }
}
