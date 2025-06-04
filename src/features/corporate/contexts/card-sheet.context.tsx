"use client";
import React, { createContext, useState, useContext } from "react";

type CardSheetContextType = {
  openCardId: string | null;
  open: (cardId: string) => void;
  close: () => void;
};

const CardSheetContext = createContext<CardSheetContextType | null>(null);

export function CardSheetProvider({ children }: { children: React.ReactNode }) {
  const [openCardId, setOpenCardId] = useState<string | null>(null);

  function open(cardId: string) {
    setOpenCardId(cardId);
  }
  function close() {
    setOpenCardId(null);
  }
  return (
    <CardSheetContext.Provider value={{ openCardId, open, close }}>
      {children}
    </CardSheetContext.Provider>
  );
}

export function useCardSheet() {
  const ctx = useContext(CardSheetContext);
  if (!ctx) throw new Error("useCardSheet must be used inside Provider");
  return ctx;
}
