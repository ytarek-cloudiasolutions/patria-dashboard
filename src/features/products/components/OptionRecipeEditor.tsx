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
import { formatUnit } from "../utils";

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
  { value: "ml", label: "ml" },
  { value: "g", label: "g" },
  { value: "kg", label: "kg" },
  { value: "L", label: "L" },
  { value: "pcs", label: "pcs" },
];

const unitToBase = (unit?: string): { group: "mass" | "volume" | "count"; factor: number } => {
  switch (formatUnit(unit)) {
    case "kg": return { group: "mass", factor: 1000 };
    case "g": return { group: "mass", factor: 1 };
    case "L": return { group: "volume", factor: 1000 };
    case "ml": return { group: "volume", factor: 1 };
    default: return { group: "count", factor: 1 };
  }
};

const isCompatibleUnit = (unit: string, ingredientUnit?: string) =>
  unitToBase(unit).group === unitToBase(ingredientUnit).group;

const isRecipeIngredient = (item: any) => {
  const productType = String(item.productType || "").toLowerCase();
  const category = typeof item.category === "string"
    ? item.category
    : item.category?.name || "";
  const normalizedCategory = category.toLowerCase().trim();
  return Boolean(
    item.isIngredient ||
    productType === "raw_material" ||
    productType === "service" ||
    normalizedCategory === "raw ingredients" ||
    normalizedCategory === "raw ingredient" ||
    normalizedCategory === "ingredients" ||
    normalizedCategory === "المكونات الخام",
  );
};

const extractProducts = (responseData: any): any[] => {
  const candidates = [
    responseData?.products,
    responseData?.data?.products,
    responseData?.data?.data,
    responseData?.data,
    responseData,
  ];
  return candidates.find(Array.isArray) || [];
};

// A product price is stored per its selected unit (e.g. EGP 0.45 per g).
// Convert the recipe amount back to that stock unit before calculating its
// live cost, so 1 kg of a per-gram ingredient correctly costs 1,000 times
// its per-gram price.
const calculateIngredientCost = (
  price: number,
  quantity: number,
  selectedUnit?: string,
  ingredientUnit?: string,
) => {
  const selected = unitToBase(selectedUnit);
  const stock = unitToBase(ingredientUnit);
  const quantityInStockUnit = selected.group === stock.group
    ? quantity * selected.factor / stock.factor
    : quantity;
  return Math.round(price * quantityInStockUnit * 100) / 100;
};

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
  const [isSearchingRecipes, setIsSearchingRecipes] = useState(false);

  const defaultPlaceholder =
    placeholder || (language === "ar" ? "اختر وصفة / مكون" : "Select a reciepe");

  // Fetch initial raw ingredients from backend so dropdown has full results if not already available
  useEffect(() => {
    if ((ingredients && ingredients.length > 0) || remoteIngredients.length > 0) return;
    let isMounted = true;
    const fetchInitial = async () => {
      try {
        const rawCat = categories.find((c) => {
          const name = c.name.toLowerCase().trim();
          return name === "raw ingredients" || name === "raw ingredient" || name === "ingredients" || name === "المكونات الخام";
        });
        const categoryId = rawCat ? rawCat.id : "6a3927888bbe5f4d11bde590";
        const response = await api.get("/products", {
          params: { category: categoryId, limit: 50 },
        });
        const fetchedData = extractProducts(response.data);
        if (isMounted && Array.isArray(fetchedData)) {
          // The category query is not a guarantee across all API versions;
          // keep regular sellable products out of every recipe picker.
          setRemoteIngredients(fetchedData.filter(isRecipeIngredient));
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

  // Search against the API instead of only filtering the recipes already
  // loaded in the dialog. Starting at page 1 gives every new search a clean
  // paginated result set, while the generous limit preserves the dropdown's
  // current single-list behavior.
  useEffect(() => {
    const search = searchQuery.trim();
    if (!search) return;

    let isMounted = true;
    const timer = setTimeout(async () => {
      setIsSearchingRecipes(true);
      try {
        const response = await api.get("/products", {
          params: {
            search,
            page: 1,
            limit: 100,
          },
        });
        const fetchedData = extractProducts(response.data);
        if (isMounted) {
          setRemoteIngredients(
            Array.isArray(fetchedData) ? fetchedData.filter(isRecipeIngredient) : [],
          );
        }
      } catch (err) {
        console.error("Failed to search recipes:", err);
        if (isMounted) setRemoteIngredients([]);
      } finally {
        if (isMounted) setIsSearchingRecipes(false);
      }
    }, 300);

    return () => {
      isMounted = false;
      clearTimeout(timer);
    };
  }, [searchQuery, categories]);

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
    // Search results deliberately come from the API. The unfiltered view
    // continues to use the recipes already available to the dialog.
    return q ? remoteIngredients : combinedIngredients;
  }, [searchQuery, combinedIngredients]);

  const handleAddIngredient = (item: any) => {
    const ingId = String(item._id || item.id);
    if (recipe.some((r) => r.material === ingId)) {
      setSearchQuery("");
      setIsDropdownOpen(false);
      return;
    }

    const defaultQty = 1;
    const ingredientUnit = formatUnit(item.unit);
    const newItem: OptionRecipeItem = {
      material: ingId,
      name: item.name,
      price: calculateIngredientCost(Number(item.price) || 0, defaultQty, ingredientUnit, ingredientUnit),
      quantity: defaultQty,
      unit: ingredientUnit,
      ingredientUnit,
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

  // Quantity/unit changes recompute the live cost using the ingredient's
  // price per stocked unit.
  const handleQuantityOrUnitChange = (index: number, patch: { quantity?: number; unit?: string }) => {
    const item = recipe[index];
    const ing = combinedIngredients.find((i: any) => String(i._id || i.id) === String(item.material));
    const nextQuantity = patch.quantity ?? item.quantity;
    const nextUnit = patch.unit ?? item.unit;
    const ingredientUnit = item.ingredientUnit || ing?.unit || item.unit;
    handleUpdateItem(index, {
      ...patch,
      ...(ing ? {
        price: calculateIngredientCost(
          Number(ing.price) || 0,
          nextQuantity,
          nextUnit,
          ingredientUnit,
        ),
      } : {}),
    });
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
            <div className="sticky top-0 z-10 bg-white px-1 pb-1">
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onClick={(e) => e.stopPropagation()}
                placeholder={t("Search recipes...")}
                className="h-10 rounded-[10px] border-[#E5E5E5] text-[14px] focus-visible:border-[#8F6900] focus-visible:ring-0"
              />
            </div>
            {isSearchingRecipes ? (
              <div className="px-3.5 py-3 text-center text-[13px] text-[#8B8B8B]">
                {t("Loading...")}
              </div>
            ) : filteredIngredients.length === 0 ? (
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
                  handleQuantityOrUnitChange(idx, {
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
                  <span>{formatUnit(item.unit)}</span>
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
                    disabled={!isCompatibleUnit(u.value, item.ingredientUnit || item.unit)}
                    onClick={() => handleQuantityOrUnitChange(idx, { unit: u.value })}
                    className={cn(
                      "px-3 py-2 text-[14px] font-normal rounded-[12px] cursor-pointer transition-colors outline-none",
                      !isCompatibleUnit(u.value, item.ingredientUnit || item.unit) && "cursor-not-allowed opacity-40",
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
            <div className="shrink-0 whitespace-nowrap text-start text-[13px]">
              <span className="font-medium text-black">EGP </span>
              <span className="font-semibold text-black">
                {Number(item.price || 0).toFixed(2)}
              </span>
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
