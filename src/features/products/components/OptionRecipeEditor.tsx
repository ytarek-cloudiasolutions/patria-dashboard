import { useState, useEffect, useMemo } from "react";
import { Trash2, ChevronDown } from "lucide-react";
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
import type { OptionRecipeItem, Ingredient, Product, Category } from "../types";

interface OptionRecipeEditorProps {
  recipe: OptionRecipeItem[];
  onChange: (recipe: OptionRecipeItem[]) => void;
  ingredients: (Ingredient | Product)[];
  categories: Category[];
  placeholder?: string;
  showSubtext?: boolean;
  inputPosition?: "top" | "bottom";
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
  placeholder,
  showSubtext = false,
  inputPosition = "top",
}: OptionRecipeEditorProps) => {
  const { t, language } = useTranslation();
  const [searchQuery, setSearchQuery] = useState("");
  const [remoteIngredients, setRemoteIngredients] = useState<any[]>([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isUnitOpen, setIsUnitOpen] = useState(false);

  const defaultPlaceholder =
    placeholder || (language === "ar" ? "اختر وصفة / مكون" : "Select a reciepe");

  // Fetch initial raw ingredients from backend so dropdown has full results if not already available
  useEffect(() => {
    if ((ingredients && ingredients.length > 0) || remoteIngredients.length > 0) return;
    let isMounted = true;
    const fetchInitial = async () => {
      try {
        const rawCat = categories.find(
          (c) => c.name.toLowerCase() === "raw ingredients"
        );
        const categoryId = rawCat ? rawCat.id : "6a3927888bbe5f4d11bde590";
        const response = await api.get("/products", {
          params: { category: categoryId, limit: 50 },
        });
        const fetchedData =
          response.data?.products || response.data?.data || response.data || [];
        if (isMounted && Array.isArray(fetchedData)) {
          setRemoteIngredients(fetchedData);
        }
      } catch (err) {
        console.error("Failed to fetch initial raw ingredients:", err);
      }
    };
    fetchInitial();
    return () => {
      isMounted = false;
    };
  }, [categories, ingredients, remoteIngredients.length]);

  // Combine ingredients prop and remoteIngredients into a unified list
  const combinedIngredients = useMemo(() => {
    const map = new Map<string, any>();
    (ingredients || []).forEach((i: any) => map.set(String(i.id || i._id), i));
    (remoteIngredients || []).forEach((i: any) => map.set(String(i._id || i.id), i));
    return Array.from(map.values());
  }, [ingredients, remoteIngredients]);

  // Filter combined list by search query
  const filteredIngredients = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return combinedIngredients;
    return combinedIngredients.filter((i: any) =>
      (i.name || "").toLowerCase().includes(q)
    );
  }, [searchQuery, combinedIngredients]);

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

  const searchInputJSX = (
    <div className="relative w-full flex flex-col gap-1">
      <div className="relative flex items-center">
        <Input
          value={searchQuery}
          onFocus={() => setIsDropdownOpen(true)}
          onClick={() => setIsDropdownOpen(true)}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setIsDropdownOpen(true);
          }}
          placeholder={defaultPlaceholder}
          className="h-[50px] w-full rounded-[12px] border border-[#E5E5E5] bg-white px-3.5 pe-10 text-[16px] font-normal text-black placeholder:text-[#8B8B8B] placeholder:font-normal focus-visible:border-[#8F6900] focus-visible:ring-0 cursor-pointer"
        />
        <button
          type="button"
          onClick={() => setIsDropdownOpen((prev) => !prev)}
          className="absolute end-1 p-2 text-black cursor-pointer"
          aria-label="Toggle dropdown"
        >
          <ChevronDown
            className={cn(
              "size-5 transition-transform duration-200",
              isDropdownOpen && "rotate-180"
            )}
          />
        </button>
      </div>

      {showSubtext && (
        <p className="text-[12px] font-medium text-[#8F6900] text-start px-1 mt-0.5">
          {language === "ar"
            ? "مكونات إضافية لهذا الخيار"
            : t("Additional components for this option")}
        </p>
      )}

      {isDropdownOpen && (
        <>
          <div
            className="fixed inset-0 z-50 bg-transparent"
            onClick={() => setIsDropdownOpen(false)}
          />
          <div
            className={cn(
              "absolute start-0 end-0 z-99 max-h-60 overflow-y-auto rounded-[16px] border border-[#E5E5E5] bg-white p-1.5 shadow-2xl space-y-1",
              inputPosition === "bottom" ? "bottom-full mb-2" : "top-[54px]"
            )}
          >
            {filteredIngredients.length === 0 ? (
              <div className="px-3.5 py-3 text-center text-[13px] text-[#8B8B8B]">
                {language === "ar" ? "لا توجد نتائج" : "No ingredients found"}
              </div>
            ) : (
              filteredIngredients.map((item) => {
                const ingId = String(item._id || item.id);
                const alreadyAdded = recipe.some((r) => r.material === ingId);
                return (
                  <button
                    key={ingId}
                    type="button"
                    disabled={alreadyAdded}
                    onClick={() => handleAddIngredient(item)}
                    className={cn(
                      "w-full flex items-center justify-between px-3.5 py-2.5 text-start rounded-[12px] text-[14px] font-normal transition-colors outline-none cursor-pointer",
                      alreadyAdded
                        ? "opacity-50 cursor-not-allowed text-[#8B8B8B]"
                        : "text-[#28293D] hover:bg-[#FAFAF7] hover:text-[#8F6900]"
                    )}
                  >
                    <span className="font-normal text-black text-[15px]">
                      {item.name}
                    </span>
                    <div className="shrink-0 text-start text-[13px]">
                      <span className="font-medium text-black">EGP </span>
                      <span className="font-semibold text-black">
                        {Number(item.price || 0).toFixed(2)}
                      </span>
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </>
      )}
    </div>
  );

  const addedIngredientsJSX = recipe.length > 0 && (
    <div className="w-full rounded-[16px] border border-[#CACBD4] bg-[#FAFAF7] p-3 flex flex-col gap-2">
      {recipe.map((item, idx) => {
        const lineTotal = (Number(item.price) || 0) * (Number(item.quantity) || 0);
        return (
          <div
            key={item.material || idx}
            className="flex items-center gap-3 w-full text-[16px]"
          >
            {/* Ingredient Name */}
            <div className="flex-1 min-w-0 h-[50px] px-3.5 bg-white rounded-[12px] border border-[#E5E5E5] flex items-center">
              <span className="truncate font-normal text-black text-[16px]">
                {item.name}
              </span>
            </div>

            {/* Quantity Input */}
            <div className="w-[57px] min-w-[57px]">
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
                className="w-full h-[50px] rounded-[12px] border border-[#E5E5E5] bg-white text-center font-normal text-black text-[16px] outline-none focus:border-[#8F6900] [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              />
            </div>

            {/* Unit Dropdown */}
            <DropdownMenu onOpenChange={setIsUnitOpen}>
              <DropdownMenuTrigger asChild>
                <button
                  type="button"
                  className="min-w-[67px] h-[50px] px-2.5 rounded-[12px] border border-[#E5E5E5] bg-white text-[16px] font-normal text-black flex items-center justify-between gap-1 hover:bg-[#FAFAF7] data-[state=open]:bg-[#8F6900] data-[state=open]:text-white data-[state=open]:border-[#8F6900] [&_svg]:data-[state=open]:text-white cursor-pointer transition-colors"
                >
                  <span>{item.unit || "pcs"}</span>
                  <ChevronDown className="size-4 text-black shrink-0 transition-transform duration-200" />
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
                      "px-3 py-2 text-[14px] font-normal rounded-[12px] cursor-pointer transition-colors outline-none",
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

            {/* Price Display */}
            <div className="shrink-0 text-start text-[13px]">
              <span className="font-medium text-black">EGP </span>
              <span className="font-semibold text-black">{lineTotal.toFixed(2)}</span>
            </div>

            {/* Remove Button */}
            <button
              type="button"
              onClick={() => handleRemoveItem(idx)}
              className="p-2 text-[#C90000] hover:text-[#A80000] cursor-pointer shrink-0 transition-colors"
              aria-label={t("Remove")}
            >
              <Trash2 className="size-5 text-[#C90000]" />
            </button>
          </div>
        );
      })}
    </div>
  );

  return (
    <div className="w-full flex flex-col gap-3 my-2 text-start">
      {/* Scrim dark overlay effect while unit dropdown is open */}
      {isUnitOpen && (
        <div className="pointer-events-none fixed inset-0 z-60 bg-black/40" />
      )}

      {searchInputJSX}
      {addedIngredientsJSX}
    </div>
  );
};

export default OptionRecipeEditor;
