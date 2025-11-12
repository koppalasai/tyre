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
      bookings: {
        Row: {
          id: string
          user_id: string
          service_type: string
          tier: string
          shop_id: string
          shop_name: string
          price: number
          eta_minutes: number
          date: string
          time: string
          vehicle_make: string
          vehicle_model: string
          registration: string
          notes: string | null
          created_at: string
        }
        Insert: {
          user_id: string
          service_type: string
          tier: string
          shop_id: string
          shop_name: string
          price: number
          eta_minutes: number
          date: string
          time: string
          vehicle_make: string
          vehicle_model: string
          registration: string
          notes?: string | null
        }
        Update: Partial<{
          user_id: string
          service_type: string
          tier: string
          shop_id: string
          shop_name: string
          price: number
          eta_minutes: number
          date: string
          time: string
          vehicle_make: string
          vehicle_model: string
          registration: string
          notes?: string | null
        }>
        Relationships: []
      }
    }
    Views: {}
    Functions: {}
    Enums: {}
    CompositeTypes: {}
  }
}