import { CartContext, CartContextType } from "@/contexts/CartContext"
import { useContext } from "react"

export const useCart = (): CartContextType => {
  const context = useContext(CartContext)
  if (!context) throw new Error("useCart must be used within CartProvider")
  return context
}