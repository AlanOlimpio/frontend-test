import { SearchInput } from "@/components/search-input";
import { SelectedList } from "@/components/selected-list";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { useSymbolsList } from "@/contexts/symbols-contexts";
import { useDebounce } from "@/hooks/use-debounce";
import { cn } from "@/lib/utils";
import { getSymbols } from "@/services/get-symbols";
import { useEffect, useState } from "react";

export function List() {
  const { addSymbolsToCurrentList } = useSymbolsList();
  const [symbols, setSymbols] = useState<string[]>([]);
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<string[]>([]);
  const debouncedValue = useDebounce(query);

  useEffect(() => {
    getSymbols().then((data) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const filtered = data.filter((s: any) => s.status === "TRADING");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      setSymbols(filtered.map((s: any) => s.symbol.toLowerCase()));
    });
  }, []);

  const filteredSymbols = symbols.filter((s) =>
    s.includes(debouncedValue.toLowerCase())
  );

  const toggleSelected = (symbol: string) => {
    setSelected((prev) =>
      prev.includes(symbol)
        ? prev.filter((s) => s !== symbol)
        : [...prev, symbol]
    );
  };
  const allFilteredSelected =
    filteredSymbols.length > 0 &&
    filteredSymbols.every((s) => selected.includes(s));

  function handleToggleSelectAll() {
    if (allFilteredSelected) {
      setSelected((prev) => prev.filter((s) => !filteredSymbols.includes(s)));
    } else {
      const newSelection = filteredSymbols.filter((s) => !selected.includes(s));
      setSelected((prev) => [...prev, ...newSelection]);
    }
  }

  const handleAddSelected = () => {
    addSymbolsToCurrentList(selected);
    setSelected([]);
  };

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-bold tracking-tight">List of symbols</h1>

      <div className="p-4 px-0 max-sm:px-0">
        <div className="grid grid-cols-3 gap-4 mb-4 max-sm:grid-cols-1">
          <div
            className={cn(
              "relative w-full bg-white border border-gray-200 rounded-lg p-4  dark:bg-gray-700 dark:border-gray-600 dark:text-white",
              selected.length > 0 && "pb-16"
            )}
          >
            <div className="w-full  border border-gray-200 rounded-lg dark:border-gray-600">
              <div className="w-full px-4 pt-4">
                <SearchInput query={query} onChange={setQuery} />
              </div>
              <div
                className="flex items-center space-x-2 mt-4 bg-muted p-4"
                onClick={handleToggleSelectAll}
              >
                <Checkbox checked={allFilteredSelected} />
                <label className="cursor-pointer font-medium">Symbol</label>
              </div>
              <div className="flex items-center justify-center rounded-sm">
                <ul
                  role="list"
                  className="divide-y divide-gray-200 w-full dark:divide-gray-800  max-h-[calc(100vh-24rem)] max-sm:h-32 overflow-y-auto"
                >
                  {filteredSymbols.map((symbol) => (
                    <li
                      key={symbol}
                      className={cn(
                        "flex p-4 uppercase",
                        selected.includes(symbol) && "bg-green-200"
                      )}
                      onClick={() => toggleSelected(symbol)}
                    >
                      <Checkbox
                        id={`checked-${symbol}`}
                        checked={selected.includes(symbol)}
                      />
                      <Label
                        className="ml-3 overflow-hidden mr-4"
                        htmlFor={`checked-${symbol}`}
                      >
                        {symbol}
                      </Label>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            {selected.length > 0 && (
              <div className="absolute bottom-3 w-full max-w-[calc(100%-2rem)]">
                <Button
                  className="w-full bg-green-500 text-white px-4 py-2 rounded hover:bg-green-700"
                  onClick={handleAddSelected}
                >
                  Add to List
                </Button>
              </div>
            )}
          </div>
          <div className="flex w-full bg-white border border-gray-200 rounded-lg p-4 dark:bg-gray-700 dark:border-gray-600 dark:text-white col-span-2 max-sm:col-span-1">
            <SelectedList />
          </div>
        </div>
      </div>
    </div>
  );
}
