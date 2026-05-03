import { Search } from "lucide-react";
import { Input } from "@/shared/components/ui/input";
import { cn } from "@/lib/utils";
import type { SearchInputFieldProps } from "../types/SearchInputField.types";

const SearchInputField = ({
  value,
  onChange,
  placeholder = "Search products...",
  className,
}: SearchInputFieldProps) => {
  return (
    <div className={cn("relative flex-1", className)}>
      <Search className="pointer-events-none absolute top-1/2 left-3 size-5 -translate-y-1/2 text-[#8B8B8B]" />
      <Input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="h-12 rounded-[8px] border-[#D9D9D9] bg-white pl-10 text-[14px] text-[#000000] placeholder:text-[#8B8B8B] focus-visible:ring-0"
      />
    </div>
  );
};

export default SearchInputField;
