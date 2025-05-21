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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "./ui/button";
import { CirclePlus } from "lucide-react";
import { useState } from "react";
import { Input } from "./ui/input";

export function SelectedList() {
  const { prices, lists, currentList, setCurrentList, createList } =
    useSymbolsList();
  const [newListName, setNewListName] = useState("");
  const [open, setOpen] = useState(false);

  const handleCreate = () => {
    if (newListName.trim()) {
      createList(newListName.trim());
      setCurrentList(newListName);
      setNewListName("");
      setOpen(false);
    }
  };

  const handleSelectValue = (value: string) => {
    setCurrentList(value);
  };

  return (
    <div className="w-full  border border-gray-200 rounded-lg dark:border-gray-600">
      <div className="w-full p-4  flex gap-2">
        <Select value={currentList} onValueChange={handleSelectValue}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="List name" />
          </SelectTrigger>
          <SelectContent>
            {Object.keys(lists).map((name) => (
              <SelectItem key={name} value={name}>
                {name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>
              <CirclePlus size={24} />
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add list</DialogTitle>
              <DialogDescription className="sr-only">
                Add list
              </DialogDescription>
            </DialogHeader>
            <Input
              type="text"
              value={newListName}
              onChange={(e) => setNewListName(e.target.value)}
              placeholder="List name"
              className="mb-2 p-1 border rounded w-full pr-8"
            />
            <Button onClick={handleCreate}>Criar</Button>
          </DialogContent>
        </Dialog>
      </div>
      <div className="grid grid-cols-5 max-sm:hidden items-center space-x-2 bg-muted p-4">
        <span className="font-bold max-lg:text-sm max-sm:col-span-2 break-all">
          Symbol
        </span>
        <span className="font-bold max-lg:text-sm break-all">Last Price</span>
        <span className="font-bold max-lg:text-sm break-all">Byd Price</span>
        <span className="font-bold max-lg:text-sm break-all">Ask Price</span>
        <span className="font-bold max-lg:text-sm break-all">
          Price Change(%)
        </span>
      </div>

      {lists[currentList].map((symbol) => {
        const data = prices[symbol];
        return data ? (
          <div
            key={symbol}
            className="grid grid-cols-5 gap-1 max-sm:grid-cols-2  items-center space-x-2 mt-4 p-4"
          >
            <span className="font-bold  max-sm:col-span-2 max-lg:text-sm break-all">
              {symbol.toUpperCase()}
            </span>
            <span className="font-bold max-lg:text-sm break-all">{data.c}</span>
            <span className="font-bold max-lg:text-sm break-all">{data.b}</span>
            <span className="font-bold max-lg:text-sm break-all">{data.a}</span>
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
