"use client";

import { cartReducer, initialState } from "@/reducers/CartReducer";
import { StorageKey } from "@/lib/constants";
import React, {
  createContext,
  useContext,
  ReactNode,
  useEffect,
  useReducer,
  useMemo,
  useState,
} from "react";

interface CartContextType {
  state: CartState;
  dispatch: React.Dispatch<CartAction>;
  isLoading: boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);
export const CartContextProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(cartReducer, initialState);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedCart = localStorage.getItem(StorageKey.Cart);
    if (storedCart) {
      dispatch({ type: "SET_CART", payload: JSON.parse(storedCart) });
    }
    setIsLoading(false);
  }, []);

  const contextValue = useMemo(() => {
    return { state, dispatch, isLoading };
  }, [state, dispatch, isLoading]);

  return (
    <CartContext.Provider value={contextValue}>{children}</CartContext.Provider>
  );
};

export const useCartContext = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCartContext must be used within a CartContextProvider");
  }
  return context;
};
