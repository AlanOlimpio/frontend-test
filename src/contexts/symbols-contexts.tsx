import { createContext, useContext, useEffect, useState } from "react";
export interface SymbolData {
  s: string;
  c: string;
  b: string;
  a: string;
  P: string;
}

export interface SymbolslistContextType {
  prices: Record<string, SymbolData>;
  lists: Record<string, string[]>;
  createList: (name: string) => void;
  setCurrentList: (name: string) => void;
  currentList: string;
  addSymbolsToCurrentList: (symbols: string[]) => void;
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
  const [prices, setPrices] = useState<Record<string, SymbolData>>({});
  const [lists, setLists] = useState<Record<string, string[]>>({ Default: [] });
  const [currentList, setCurrentList] = useState<string>("Default");

  useEffect(() => {
    if (lists[currentList].length === 0) return;

    const streamPath = lists[currentList].map((s) => `${s}@ticker`).join("/");
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
  }, [lists]);

  const addSymbolsToCurrentList = (symbolsToAdd: string[]) => {
    setLists((prev) => {
      const lowerSymbols = symbolsToAdd.map((s) => s.toLowerCase());
      const current = prev[currentList] || [];
      const newSymbols = lowerSymbols.filter((s) => !current.includes(s));
      return { ...prev, [currentList]: [...current, ...newSymbols] };
    });
  };

  const createList = (name: string) => {
    if (!name || lists[name]) return;
    setLists((prev) => ({ ...prev, [name]: [] }));
    setCurrentList(name);
  };

  return (
    <SymbolslistContext.Provider
      value={{
        prices,
        createList,
        currentList,
        setCurrentList,
        lists,
        addSymbolsToCurrentList,
      }}
    >
      {children}
    </SymbolslistContext.Provider>
  );
};
