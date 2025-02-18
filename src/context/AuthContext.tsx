"use client";

import React, { createContext, useContext, ReactNode } from "react";
import { useCustomer } from "@/hooks/queries/useCustomer";
import { useLogin } from "@/hooks/mutations/useLogin";
import { useLogout } from "@/hooks/mutations/useLogout";
import { useRegister } from "@/hooks/mutations/useRegister";

interface AuthContextProps {
  customer: Customer | null;
  isAuthenticated: boolean;
  isAuthLoading: boolean;
  login: (credentials: {
    email: string;
    password: string;
  }) => Promise<Customer | null>;
  logout: () => void;
  register: (details: {
    email: string;
    firstName: string;
    lastName: string;
    mobile: string;
    password: string;
  }) => Promise<Customer | null>;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthContextProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const { data: customer } = useCustomer();

  const { mutateAsync: login, isPending: isLoginLoading } = useLogin();
  const { mutate: logout, isPending: isLogoutLoading } = useLogout();
  const { mutateAsync: register, isPending: isRegisterLoading } = useRegister();

  const isAuthLoading = isLoginLoading || isLogoutLoading || isRegisterLoading;

  return (
    <AuthContext.Provider
      value={{
        customer: customer ?? null,
        isAuthenticated: !!customer,
        isAuthLoading,
        login,
        logout,
        register,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error(
      "useAuthContext must be used within an AuthContextProvider"
    );
  }
  return context;
};
