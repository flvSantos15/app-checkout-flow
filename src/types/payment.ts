import { CartItem } from "./product";

export type PaymentMethod = 'pix' | 'credit_card' | 'boleto' | ''

export type PaymentData = {
  method: PaymentMethod;
  amount: number;
  items: CartItem[];
  user: {
    id: number;
    email: string;
    name: string;
  };
  paymentData?: {
    // Para cartão de crédito
    cardNumber?: string;
    cardName?: string;
    cardExpiry?: string;
    cardCvv?: string;
    installments?: number;
  };
};

export type PaymentResult = {
  orderId: string;
  status: 'processing' | 'approved' | 'failed' | 'awaiting_payment';
  message?: string;
  pixCode?: string;
  pixQrCode?: string;
  barcode?: string;
  barcodeDigits?: string;
  dueDate?: string;
};
