import { PaymentMethod } from "./payment"

export type OrderStatus = 'awaiting_payment' | 'processing' | 'paid' | 'failed' | 'expired'

export type Order = {
  status: OrderStatus
  orderId: string
  method: PaymentMethod
  barcode?: string
  error?: string
}