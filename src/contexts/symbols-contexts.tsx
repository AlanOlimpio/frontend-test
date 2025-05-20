import { createContext, useContext, useEffect, useState } from "react";
export interface SymbolData {
  s: string;
  c: string;
  b: string;
  a: string;
  P: string;
}

export interface SymbolslistContextType {
  symbols: string[];
  prices: Record<string, SymbolData>;
  addSymbol: (symbol: string) => void;
  addSymbols: (symbols: string[]) => void;
}

export const SymbolslistContext = createContext<
  SymbolslistContextType | undefined
>(undefined);

export const useSymbolsList = () => {
  const context = useContext(SymbolslistContext);
  if (!context) {
    throw new Error("useSymbolsList must be used within SymbolslistContext");
  }
  return context;
};

export const SymbolslistProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [symbols, setSymbols] = useState<string[]>([]);
  const [prices, setPrices] = useState<Record<string, SymbolData>>({});

  useEffect(() => {
    if (symbols.length === 0) return;

    const streamPath = symbols.map((s) => `${s}@ticker`).join("/");
    const socket = new WebSocket(
      `wss://stream.binance.com:9443/stream?streams=${streamPath}`
    );

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      const symbolData = data.data;
      setPrices((prev) => ({
        ...prev,
        [symbolData.s.toLowerCase()]: symbolData,
      }));
    };

    return () => socket.close();
  }, [symbols]);

  const addSymbol = (symbol: string) => {
    const lower = symbol.toLowerCase();
    setSymbols((prev) => (prev.includes(lower) ? prev : [...prev, lower]));
  };

  const addSymbols = (symbolsToAdd: string[]) => {
    setSymbols((prev) => {
      const lowerSymbols = symbolsToAdd.map((s) => s.toLowerCase());
      const newSymbols = lowerSymbols.filter((s) => !prev.includes(s));
      return [...prev, ...newSymbols];
    });
  };

  return (
    <SymbolslistContext.Provider
      value={{ symbols, prices, addSymbol, addSymbols }}
    >
      {children}
    </SymbolslistContext.Provider>
  );
};
