import { useSymbolsList } from "@/contexts/symbols-contexts";
import { Badge } from "./ui/badge";
import { Skeleton } from "./ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

export function SelectedList() {
  const { symbols, prices } = useSymbolsList();

  return (
    <div className="w-full  border border-gray-200 rounded-lg dark:border-gray-600">
      <div className="w-full px-4 pt-4">
        <Select>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="List Symbol" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="light">A - 1</SelectItem>
            <SelectItem value="dark">A - 2</SelectItem>
            <SelectItem value="system">A - 3</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="grid grid-cols-5 max-md:hidden items-center space-x-2 mt-4 bg-muted p-4">
        <span className="font-bold max-lg:text-sm max-md:col-span-2">
          Symbol
        </span>
        <span className="font-bold max-lg:text-sm">Last Price</span>
        <span className="font-bold max-lg:text-sm">Byd Price</span>
        <span className="font-bold max-lg:text-sm">Ask Price</span>
        <span className="font-bold max-lg:text-sm">Price Change(%)</span>
      </div>

      {symbols.map((symbol) => {
        const data = prices[symbol];
        return data ? (
          <div
            key={symbol}
            className="grid grid-cols-5 gap-1 max-sm:grid-cols-2  items-center space-x-2 mt-4 p-4"
          >
            <span className="font-bold  max-sm:col-span-2 max-lg:text-sm">
              {symbol.toUpperCase()}
            </span>
            <span className="font-bold max-lg:text-sm">{data.c}</span>
            <span className="font-bold max-lg:text-sm">{data.b}</span>
            <span className="font-bold max-lg:text-sm">{data.a}</span>
            <Badge>{data.P}%</Badge>
          </div>
        ) : (
          <div
            key={symbol}
            className="grid grid-cols-5 gap-1 max-sm:grid-cols-2 items-center space-x-2 mt-4 p-4"
          >
            <span className="font-bold max-md:col-span-2">
              {symbol.toUpperCase()}
            </span>
            <Skeleton className="w-[70px] h-[20px] rounded-full" />
            <Skeleton className="w-[70px] h-[20px] rounded-full" />
            <Skeleton className="w-[70px] h-[20px] rounded-full" />
            <Skeleton className="w-[50px] h-[20px] rounded-full" />
          </div>
        );
      })}
    </div>
  );
}
