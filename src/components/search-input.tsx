import { Search } from "lucide-react";
import { Input } from "./ui/input";

interface SearchInputProps {
  query: string;
  onChange: (value: string) => void;
}

export function SearchInput({ query, onChange }: SearchInputProps) {
  return (
    <div className="relative text-gray-600 focus-within:text-gray-400 ">
      <span className="absolute inset-y-0 flex items-center right-0 p-1">
        <Search size={20} />
      </span>
      <Input
        type="text"
        placeholder="Search"
        className="mb-2 p-1 border rounded w-full pr-8"
        value={query}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}
