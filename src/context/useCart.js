import { useContext } from "react";
import { CartContext } from "./cartContextInstance";
export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart вне CartProvider");
  return context;
}
