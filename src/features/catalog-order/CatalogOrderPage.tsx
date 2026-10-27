import { useEffect, useMemo, useState } from "react";
import HeaderLayout from "@/layouts/HeaderLayout";
import { useTranslation } from "@/shared/i18n/useTranslation";
import { showSuccessToast } from "@/shared/utils/toast";
import { cn } from "@/lib/utils";
import { useCategories } from "@/features/categories/hooks/useCategories";
import { useProducts } from "@/features/products/hooks/useProducts";
import { ALL_CATEGORY_ID, CategoryOrderCard } from "./components/CategoryOrderCard";
import { ProductOrderCard } from "./components/ProductOrderCard";
import type { CategoryOrderItem, ProductOrderItem } from "./types";

const CATEGORY_ORDER_KEY = "patria_category_order";
const PRODUCT_ORDER_KEY = "patria_product_order";

const readSavedIds = (key: string): string[] => {
  try {
    const parsed = JSON.parse(localStorage.getItem(key) || "[]");
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

/** Sort items by a saved id list; items not in the list keep their relative order at the end. */
const applySavedOrder = <T extends { id: string }>(items: T[], savedIds: string[]): T[] => {
  if (savedIds.length === 0) return items;
  const rank = new Map(savedIds.map((id, i) => [id, i]));
  return [...items].sort(
    (a, b) => (rank.get(a.id) ?? Number.MAX_SAFE_INTEGER) - (rank.get(b.id) ?? Number.MAX_SAFE_INTEGER),
  );
};

const isRawIngredientName = (name: string) => {
  const n = (name || "").toLowerCase().trim();
  return (
    n === "raw ingredients" ||
    n === "raw ingredient" ||
    n === "ingredients" ||
    n === "المكونات الخام"
  );
};

const CatalogOrderPage = () => {
  const { t } = useTranslation();
  const {
    categories: storeCategories,
    getCategories,
    isFetchingCategories,
  } = useCategories();
  const { products: storeProducts, getProducts, isFetchingProducts } = useProducts();

  const [categories, setCategories] = useState<CategoryOrderItem[]>([]);
  const [products, setProducts] = useState<ProductOrderItem[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>(ALL_CATEGORY_ID);
  const [isDirty, setIsDirty] = useState(false);

  useEffect(() => {
    getCategories();
    getProducts({ limit: 1000 });
  }, [getCategories, getProducts]);

  // Sync fetched data into local ordering state (without clobbering unsaved edits).
  useEffect(() => {
    if (isDirty) return;
    const mapped: CategoryOrderItem[] = storeCategories
      .filter((c) => !isRawIngredientName(c.name))
      .map((c) => ({ id: c.id, name: c.name, image: c.imageUrl }));
    setCategories(applySavedOrder(mapped, readSavedIds(CATEGORY_ORDER_KEY)));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [storeCategories]);

  useEffect(() => {
    if (isDirty) return;
    const mapped: ProductOrderItem[] = storeProducts
      .filter((p) => !p.isIngredient && !p.isExtra && !isRawIngredientName(p.category))
      .map((p) => ({
        id: p.id,
        name: p.name,
        price: p.price,
        image: p.imageUrl,
        category: p.category,
      }));
    setProducts(applySavedOrder(mapped, readSavedIds(PRODUCT_ORDER_KEY)));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [storeProducts]);

  const selectedCategoryName = useMemo(
    () =>
      selectedCategoryId === ALL_CATEGORY_ID
        ? undefined
        : categories.find((c) => c.id === selectedCategoryId)?.name,
    [categories, selectedCategoryId],
  );

  const handleReorderCategories = (next: CategoryOrderItem[]) => {
    setCategories(next);
    setIsDirty(true);
  };

  const handleReorderProducts = (next: ProductOrderItem[]) => {
    setProducts(next);
    setIsDirty(true);
  };

  const handleSaveEdits = () => {
    if (!isDirty) return;
    try {
      localStorage.setItem(CATEGORY_ORDER_KEY, JSON.stringify(categories.map((c) => c.id)));
      localStorage.setItem(PRODUCT_ORDER_KEY, JSON.stringify(products.map((p) => p.id)));
    } catch {
      // storage unavailable
    }
    showSuccessToast(t("Catalog order saved successfully"));
    setIsDirty(false);
  };

  return (
    <section className="w-full pb-10">
      {/* Top Header */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <HeaderLayout
          title={t("System Overview")}
          description={t("Manage your account and platform preferences")}
        />

        {/* Save Edits Button */}
        <button
          type="button"
          onClick={handleSaveEdits}
          disabled={!isDirty}
          data-buttonactive={isDirty ? "True" : "False"}
          data-icononly="False"
          data-leading-icon="True"
          data-size="Large"
          data-trailing-icon="False"
          data-type={isDirty ? "Primary" : "Disable"}
          className={cn(
            "h-14 px-7 py-4 rounded-[5px] inline-flex justify-center items-center gap-3 select-none transition-all duration-200",
            isDirty
              ? "bg-[#8F6900] hover:bg-[#785700] text-white cursor-pointer shadow-md active:scale-[0.98]"
              : "bg-[#DCDCDC] text-[#8B8B8B] cursor-not-allowed"
          )}
        >
          {/* Save Icon */}
          <div className="size-4 relative overflow-hidden flex items-center justify-center shrink-0">
            <svg
              width="16"
              height="16"
              viewBox="0 0 18 18"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className={cn(
                "transition-colors",
                isDirty ? "stroke-white" : "stroke-[#8B8B8B]"
              )}
            >
              <path
                d="M11.4 2.25C11.7957 2.25564 12.1731 2.41738 12.45 2.7L15.3 5.55C15.5826 5.82695 15.7444 6.20435 15.75 6.6V14.25C15.75 14.6478 15.592 15.0294 15.3107 15.3107C15.0294 15.592 14.6478 15.75 14.25 15.75H3.75C3.35218 15.75 2.97064 15.592 2.68934 15.3107C2.40804 15.0294 2.25 14.6478 2.25 14.25V3.75C2.25 3.35218 2.40804 2.97064 2.68934 2.68934C2.97064 2.40804 3.35218 2.25 3.75 2.25H11.4Z"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M12.75 15.75V10.5C12.75 10.3011 12.671 10.1103 12.5303 9.96967C12.3897 9.82902 12.1989 9.75 12 9.75H6C5.80109 9.75 5.61032 9.82902 5.46967 9.96967C5.32902 10.1103 5.25 10.3011 5.25 10.5V15.75"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M5.25 2.25V5.25C5.25 5.44891 5.32902 5.63968 5.46967 5.78033C5.61032 5.92098 5.80109 6 6 6H11.25"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>

          {/* Button Text */}
          <span className="text-base font-semibold font-['Montserrat'] leading-6 whitespace-nowrap">
            {t("Save Edits")}
          </span>
        </button>
      </div>

      {/* Main Two Cards Layout */}
      <div className="flex flex-col xl:flex-row gap-6 items-start w-full">
        <CategoryOrderCard
          categories={categories}
          selectedCategoryId={selectedCategoryId}
          loading={isFetchingCategories}
          onSelectCategory={setSelectedCategoryId}
          onReorderCategories={handleReorderCategories}
        />

        <ProductOrderCard
          products={products}
          categoryName={selectedCategoryName}
          loading={isFetchingProducts}
          onReorderProducts={handleReorderProducts}
        />
      </div>
    </section>
  );
};

export default CatalogOrderPage;
