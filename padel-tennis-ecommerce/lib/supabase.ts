import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Product = {
  id: number
  name: string
  category: string
  subcategory: string
  price: number
  original_price: number | null
  image: string
  rating: number
  reviews: number
  description: string
  in_stock: boolean
  code: string
  created_at?: string
}
