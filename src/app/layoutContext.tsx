// @/hooks/Layout/LayoutContext.tsx
'use client';

import { usePathname } from 'next/navigation';
import React, { createContext, useContext, useEffect, useState } from 'react';

interface LayoutContextType {
  cartOpen: boolean;
  setCartOpen: (open: boolean) => void;
}

const LayoutContext = createContext<LayoutContextType | undefined>(undefined);

export function LayoutProvider({ children }: { children: React.ReactNode }) {
  const [cartOpen, setCartOpen] = useState(false);
  const pathname = usePathname();
  useEffect(() => {
    setCartOpen(false);
  }, [pathname]);
  return (
    <LayoutContext.Provider value={{
      cartOpen, setCartOpen,
    }}>
      {children}
    </LayoutContext.Provider>
  );
}

export function useLayoutContext() {
  const context = useContext(LayoutContext);
  if (!context) {
    throw new Error('useLayoutContext debe ser usado dentro de un LayoutProvider');
  }
  return context;
}

