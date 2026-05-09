"use client";

import React, { createContext, useContext, useState } from "react";

interface CurrencyContextType {
  currencyCode: string;
  currencySymbol: string;
  setCurrency: (code: string) => void;
  formatPrice: (amount: number) => string;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

export const CurrencyProvider = ({ children }: { children: React.ReactNode }) => {
  // You can initialize this from localStorage if you want to persist the choice
  const [currencyCode, setCurrencyCode] = useState("PHP");

  const symbols: Record<string, string> = {
    PHP: "₱",
    USD: "$",
    EUR: "€",
  };

  const setCurrency = (code: string) => {
    setCurrencyCode(code);
  };

  const formatPrice = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currencyCode,
    }).format(amount);
  };

  return (
    <CurrencyContext.Provider 
      value={{ 
        currencyCode, 
        currencySymbol: symbols[currencyCode] || currencyCode, 
        setCurrency, 
        formatPrice 
      }}
    >
      {children}
    </CurrencyContext.Provider>
  );
};

// Your custom hook
export const useCurrency = () => {
  const context = useContext(CurrencyContext);
  if (!context) {
    throw new Error("useCurrency must be used within a CurrencyProvider");
  }
  return context;
};