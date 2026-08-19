import { useState, useEffect } from "react";
import { Search, Trash2, ChevronDown } from "lucide-react";
import { Input } from "@/shared/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";
import { useTranslation } from "@/shared/i18n/useTranslation";
import { api } from "@/config/api";
import { cn } from "@/lib/utils";
import type { OptionRecipeItem, Ingredient, Category } from "../types";

interface OptionRecipeEditorProps {
  recipe: OptionRecipeItem[];
  onChange: (recipe: OptionRecipeItem[]) => void;
  ingredients: Ingredient[];
  categories: Category[];
}

const UNITS = [
  { value: "g", label: "g" },
  { value: "kg", label: "kg" },
  { value: "ml", label: "ml" },
  { value: "L", label: "L" },
  { value: "pcs", label: "pcs" },
];

const OptionRecipeEditor = ({
  recipe = [],
  onChange,
  ingredients,
  categories,
}: OptionRecipeEditorProps) => {
  const { t, language } = useTranslation();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isUnitOpen, setIsUnitOpen] = useState(false);

  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      setIsDropdownOpen(false);
      return;
    }

    const timer = setTimeout(async () => {
      try {
        const rawIngredientCategory = categories.find(
          (c) => c.name.toLowerCase() === "raw ingredients"
        );
        const categoryId = rawIngredientCategory
          ? rawIngredientCategory.id
          : "6a3927888bbe5f4d11bde590";

        const response = await api.get("/products", {
          params: {
            search: searchQuery.trim(),
            category: categoryId,
            limit: 20,
          },
        });
        const fetchedData =
          response.data?.products || response.data?.data || response.data || [];
        const remoteResults = Array.isArray(fetchedData) ? fetchedData : [];

        // Filter local ingredients prop by name
        const q = searchQuery.trim().toLowerCase();
        const localMatches = ingredients.filter((i) =>
          i.name.toLowerCase().includes(q)
        );

        // Combine unique results
        const map = new Map<string, any>();
        localMatches.forEach((i: any) => map.set(String(i.id || i._id), i));
        remoteResults.forEach((i: any) => map.set(String(i._id || i.id), i));

        const combined = Array.from(map.values());
        setSearchResults(combined);
        setIsDropdownOpen(combined.length > 0);
      } catch (err) {
        console.error("Failed to search ingredients for option recipe:", err);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery, categories, ingredients]);

  const handleAddIngredient = (item: any) => {
    const ingId = String(item._id || item.id);
    if (recipe.some((r) => r.material === ingId)) {
      setSearchQuery("");
      setIsDropdownOpen(false);
      return;
    }

    const newItem: OptionRecipeItem = {
      material: ingId,
      name: item.name,
      price: Number(item.price) || 0,
      quantity: 1,
      unit: item.unit || "pcs",
      ingredientUnit: item.unit || "pcs",
    };

    onChange([...recipe, newItem]);
    setSearchQuery("");
    setIsDropdownOpen(false);
  };

  const handleUpdateItem = (index: number, patch: Partial<OptionRecipeItem>) => {
    const updated = recipe.map((item, idx) =>
      idx === index ? { ...item, ...patch } : item
    );
    onChange(updated);
  };

  const handleRemoveItem = (index: number) => {
    onChange(recipe.filter((_, idx) => idx !== index));
  };

  const totalOptionCost = recipe.reduce(
    (sum, item) => sum + (Number(item.price) || 0) * (Number(item.quantity) || 0),
    0
  );

  return (
    <div className="w-full rounded-[16px] border border-[#E5E5E5] bg-[#F5F0EA] p-3 text-start flex flex-col gap-3 my-2 shadow-xs">
      {/* Scrim dark overlay effect while unit dropdown or search dropdown is open */}
      {(isUnitOpen || isDropdownOpen) && (
        <div className="pointer-events-none fixed inset-0 z-60 bg-black/40" />
      )}

      {/* Recipe Items List */}
      {recipe.length > 0 && (
        <div className="flex flex-col gap-2">
          {recipe.map((item, idx) => {
            const lineTotal = (Number(item.price) || 0) * (Number(item.quantity) || 0);
            return (
              <div
                key={item.material || idx}
                className="flex items-center gap-2 bg-white p-2.5 rounded-[12px] border border-[#E5E5E5] text-[13px]"
              >
                <div className="flex-1 min-w-0 font-semibold text-[#333333] truncate">
                  {item.name}
                </div>

                {/* Quantity Input */}
                <input
                  type="number"
                  min="0.001"
                  step="any"
                  value={item.quantity}
                  onChange={(e) =>
                    handleUpdateItem(idx, {
                      quantity: Math.max(0, parseFloat(e.target.value) || 0),
                    })
                  }
                  className="w-16 h-9 rounded-[8px] border border-[#E5E5E5] bg-[#FEFEFE] text-center font-semibold text-[#28293D] text-[13px] outline-none focus:border-[#8F6900]"
                />

                {/* Unit Selector Dropdown (Standard Patria Dropdown Style) */}
                <DropdownMenu onOpenChange={setIsUnitOpen}>
                  <DropdownMenuTrigger asChild>
                    <button
                      type="button"
                      className="h-9 px-2.5 rounded-[8px] border border-[#E5E5E5] bg-white text-[12px] font-medium text-[#28293D] flex items-center justify-between gap-1 hover:bg-[#FAFAF7] data-[state=open]:bg-[#8F6900] data-[state=open]:text-white data-[state=open]:border-[#8F6900] [&_svg]:data-[state=open]:text-white cursor-pointer transition-colors"
                    >
                      <span>{item.unit || "pcs"}</span>
                      <ChevronDown className="size-3.5 text-[#333333] transition-transform duration-200" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="end"
                    className="z-70 min-w-[90px] p-1.5 rounded-[16px] bg-white shadow-2xl border border-[#E5E5E5] space-y-1"
                  >
                    {UNITS.map((u) => (
                      <DropdownMenuItem
                        key={u.value}
                        onClick={() => handleUpdateItem(idx, { unit: u.value })}
                        className={cn(
                          "px-3 py-2 text-[13px] font-normal rounded-[12px] cursor-pointer transition-colors outline-none",
                          item.unit === u.value
                            ? "bg-[#8F6900] text-white font-medium cursor-default data-highlighted:bg-[#8F6900] data-highlighted:text-white"
                            : "text-[#28293D] hover:bg-[#FAFAF7] data-highlighted:bg-[#FAFAF7] data-highlighted:text-[#28293D]"
                        )}
                      >
                        {u.label}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>

                {/* Cost Display */}
                <div className="w-20 text-end font-bold text-[#059B5A] text-[12px] shrink-0">
                  {lineTotal.toFixed(2)} EGP
                </div>

                {/* Remove Button */}
                <button
                  type="button"
                  onClick={() => handleRemoveItem(idx)}
                  className="p-1 text-[#C90000] hover:text-[#A80000] cursor-pointer shrink-0 transition-colors"
                  aria-label={t("Remove")}
                >
                  <Trash2 className="size-4" />
                </button>
              </div>
            );
          })}
        </div>
      )}

      {/* Add Ingredient Search Section */}
      <div className="relative w-full flex flex-col gap-1">
        <div className="relative flex items-center">
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={
              language === "ar"
                ? "أضف مكون"
                : "Add reciepe"
            }
            className="h-12 w-full rounded-[12px] border border-[#E5E5E5] bg-white px-4 text-[14px] text-black placeholder:text-[#8B8B8B] focus-visible:border-[#8F6900] focus-visible:ring-0"
          />
        </div>

        {/* Subtext below search bar */}
        <p className="text-[12px] font-medium text-[#8F6900] text-start px-1 mt-0.5">
          {language === "ar"
            ? "مكونات إضافية لهذا الخيار"
            : "Additional components for this option"}
        </p>

        {/* Dropdown Search Results */}
        {isDropdownOpen && searchResults.length > 0 && (
          <>
            <div
              className="fixed inset-0 z-40 bg-black/20 backdrop-blur-[1px] transition-opacity"
              onClick={() => setIsDropdownOpen(false)}
            />
            <div className="absolute start-0 end-0 top-13 z-70 max-h-56 overflow-y-auto rounded-[16px] border border-[#E5E5E5] bg-white p-1.5 shadow-2xl space-y-1">
              {searchResults.map((item) => {
                const ingId = String(item._id || item.id);
                const alreadyAdded = recipe.some((r) => r.material === ingId);
                return (
                  <button
                    key={ingId}
                    type="button"
                    disabled={alreadyAdded}
                    onClick={() => handleAddIngredient(item)}
                    className={cn(
                      "w-full flex items-center justify-between px-3 py-2.5 text-start rounded-[12px] text-[13px] font-normal transition-colors outline-none cursor-pointer",
                      alreadyAdded
                        ? "opacity-50 cursor-not-allowed text-[#8B8B8B]"
                        : "text-[#28293D] hover:bg-[#FAFAF7] hover:text-[#8F6900]"
                    )}
                  >
                    <div className="flex flex-col">
                      <span className="font-semibold text-[#28293D]">{item.name}</span>
                    </div>
                    <span className="text-[12px] font-bold text-[#8F6900]">
                      {Number(item.price || 0).toFixed(2)} EGP
                    </span>
                  </button>
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default OptionRecipeEditor;
