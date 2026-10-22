import type { OrderStatus } from "@/constants/orderStatus";

export type { OrderStatus };

export interface ShippingAddress {
  fullName: string;
  phone: string;
  line1: string;
  line2?: string;
  city: string;
  country: string;
  postalCode?: string;
}

export type PaymentMethod = "bakong_khqr" | "cod" | "credit_card";

export type PaymentState = "pending" | "paid" | "failed" | "refunded";

export interface OrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  thumbnail?: string;
}

export interface OrderTrackingEvent {
  status: OrderStatus;
  timestamp: string;
  note?: string;
}

export interface Order {
  id: string;
  userId: string;
  status: OrderStatus;
  items: OrderItem[];
  subtotal: number;
  discount: number;
  tax: number;
  shipping: number;
  grandTotal: number;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentState;
  couponCode: string | null;
  shippingAddress: ShippingAddress;
  createdAt: string;
  updatedAt: string;
}

export interface OrderTracking {
  orderId: string;
  currentStatus: OrderStatus;
  events: OrderTrackingEvent[];
}
