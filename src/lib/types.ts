export type Language = "en" | "ar" | "ku";
export type Direction = "ltr" | "rtl";

export interface User {
  id: string;
  email: string;
  name: string;
  avatar_url?: string;
  role: "user" | "admin";
  is_vip: boolean;
  location?: string;
  created_at: string;
}

export interface Address {
  id: string;
  user_id: string;
  label: string;
  street: string;
  city: string;
  country: string;
  phone: string;
  is_default: boolean;
}

export interface Product {
  id: string;
  name: string;
  name_ar?: string;
  name_ku?: string;
  description: string;
  description_ar?: string;
  description_ku?: string;
  price: number;
  image_url: string;
  emoji: string;
  category: "kit" | "plant" | "nutrient" | "accessory";
  is_new: boolean;
  is_featured: boolean;
  stock: number;
  care_instructions?: string;
  created_at: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Review {
  id: string;
  product_id: string;
  user_id: string;
  user_name: string;
  rating: number;
  comment: string;
  helpful_count: number;
  created_at: string;
}

export interface Order {
  id: string;
  user_id: string;
  items: OrderItem[];
  total: number;
  status: "pending" | "confirmed" | "processing" | "shipped" | "delivered" | "cancelled";
  payment_status: "pending" | "paid" | "failed" | "refunded";
  address: Address;
  created_at: string;
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  product_name: string;
  quantity: number;
  price: number;
}

export interface SensorData {
  id: string;
  ph: number;
  ec: number;
  water_temp: number;
  reservoir_level: number;
  timestamp: string;
}

export interface GardenConfig {
  id: string;
  user_id: string;
  slots: Record<string, Product | null>;
  name: string;
  created_at: string;
}

export interface Notification {
  id: string;
  user_id: string;
  type: "order" | "ai_alert" | "low_stock" | "recommendation" | "system";
  title: string;
  message: string;
  is_read: boolean;
  created_at: string;
}

export interface Subscription {
  id: string;
  user_id: string;
  plan: "free" | "plus";
  status: "active" | "cancelled" | "expired";
  starts_at: string;
  ends_at?: string;
}

export interface AIDiagnosis {
  plant_name: string;
  status: "healthy" | "warning" | "critical";
  confidence: number;
  issue: string;
  action: string;
  sensor_summary: string;
  recommended_product_id?: string;
}

export interface AdminNotificationSettings {
  order_alerts: boolean;
  low_stock_alerts: boolean;
  low_stock_threshold: number;
  sound_enabled: boolean;
  quiet_hours_start?: string;
  quiet_hours_end?: string;
}
