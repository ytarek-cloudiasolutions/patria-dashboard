import { useEffect, useMemo, useRef, useState } from "react";
import { Plus, ScanBarcode, Upload, Loader2, Coffee, LayoutGrid, List } from "lucide-react";
import { cn } from "@/lib/utils";
import HeaderLayout from "@/layouts/HeaderLayout";
import DefaultButton from "@/shared/components/DefaultButton";
import DeleteDialog from "@/shared/components/DeleteDialog";
import DropdownSelect from "@/shared/components/DropdownSelect";
import SearchInputField from "@/shared/components/SearchInputField";
import { useTranslation } from "@/shared/i18n/useTranslation";
import { useCategories } from "@/features/categories";
import { useProducts } from "@/features/products";
import { api } from "@/config/api";
import { showSuccessToast, showErrorToast } from "@/shared/utils/toast";

import ProductsTabs from "./components/ProductsTabs";
import ProductsTable from "./components/ProductsTable";
import ProductsCards from "./components/ProductsCards";
import IngredientsTable from "./components/IngredientsTable";
import IngredientsCards from "./components/IngredientsCards";
import CategoriesTable from "./components/CategoriesTable";
import CategoriesCards from "./components/CategoriesCards";
import AddProductDialog from "./components/AddProductDialog";
import AddIngredientDialog from "./components/AddIngredientDialog";
import AddCategoryDialog from "./components/AddCategoryDialog";
import CategoryProductsDialog from "./components/CategoryProductsDialog";
import ImportDataDialog from "./components/ImportDataDialog";
import ScanProductDialog from "./components/ScanProductDialog";
import WhatsAppOfferDialog from "./components/WhatsAppOfferDialog";

import { formatUnit } from "./utils";
import {
  INITIAL_CATEGORIES,
  INITIAL_INGREDIENTS,
  INITIAL_PRODUCTS,
  PRODUCT_CATEGORIES,
} from "./data";
import type {
  Category,
  CategoryFormData,
  Ingredient,
  IngredientFormData,
  Product,
  ProductFormData,
  ProductsTab,
} from "./types";
import type { DeleteDialogProps } from "@/shared/types/deleteDialog.types";

type DeleteTarget = {
  id: string | number;
  name: string;
  kind: "product" | "ingredient" | "category";
};

const DELETE_TYPE_LABEL: Record<DeleteTarget["kind"], DeleteDialogProps["type"]> =
{
  product: "product",
  ingredient: "ingredient",
  category: "category",
};


const ProductsPage = () => {
  const { t } = useTranslation();
  const [tab, setTab] = useState<ProductsTab>("products");
  const [viewMode, setViewMode] = useState<"table" | "grid">("grid");

  const {
    products,
    ingredients,
    pagination,
    togglingProductId,
    isFetchingProducts,
    isCreatingProduct,
    isUpdatingProduct,
    isDeletingProduct,
    isTogglingProduct,
    successMessage: productSuccessMessage,
    errors: productErrors,
    getProducts,
    getIngredients,
    createProduct,
    updateProduct,
    deleteProduct,
    toggleProductActive,
  } = useProducts();

  const {
    categories,
    togglingCategoryId,
    isFetchingCategories,
    isCreatingCategory,
    isTogglingCategory,
    isDeletingCategory,
    getCategories,
    createCategory,
    toggleCategoryStatus,
    deleteCategory,
  } = useCategories();

  const [productSearch, setProductSearch] = useState("");
  const [ingredientSearch, setIngredientSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [isCategoryFilterOpen, setIsCategoryFilterOpen] = useState(false);
  const [page, setPage] = useState(1);

  const [categoriesLoaded, setCategoriesLoaded] = useState(false);
  const [productsLoaded, setProductsLoaded] = useState(false);

  const categoriesStarted = useRef(isFetchingCategories);
  const productsStarted = useRef(isFetchingProducts);

  useEffect(() => {
    if (isFetchingCategories) {
      categoriesStarted.current = true;
    } else if (categoriesStarted.current) {
      setCategoriesLoaded(true);
    }
  }, [isFetchingCategories]);

  useEffect(() => {
    if (isFetchingProducts) {
      productsStarted.current = true;
    } else if (productsStarted.current) {
      setProductsLoaded(true);
    }
  }, [isFetchingProducts]);

  useEffect(() => {
    setPage(1);
    setProductSearch("");
    setIngredientSearch("");
    setCategoryFilter("all");
  }, [tab]);

  useEffect(() => {
    getCategories();
  }, [getCategories]);

  const creationSourceRef = useRef<"product" | "recipe" | null>(null);

  // Open WhatsApp dialog only after product creation succeeds (not recipe)
  useEffect(() => {
    if (prevCreatingRef.current && !isCreatingProduct && !productErrors.create && productSuccessMessage) {
      if (creationSourceRef.current === "product") {
        setIsWhatsAppOpen(true);
      }
      creationSourceRef.current = null;
    }
    prevCreatingRef.current = isCreatingProduct;
  }, [isCreatingProduct, productErrors.create, productSuccessMessage]);

  useEffect(() => {
    const delayDebounceId = setTimeout(() => {
      if (tab === "products") {
        getProducts({
          search: productSearch.trim() || undefined,
          category: categoryFilter !== "all" ? categoryFilter : undefined,
          page,
          limit: 100,
        });
      } else if (tab === "recipes") {
        getProducts({
          search: ingredientSearch.trim() || undefined,
          category: "6a3927888bbe5f4d11bde590",
          page,
          limit: 100,
        });
      }
    }, 300);

    return () => clearTimeout(delayDebounceId);
  }, [tab, productSearch, categoryFilter, ingredientSearch, page, getProducts]);

  // Dialogs
  const [isAddProductOpen, setIsAddProductOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [editingIngredient, setEditingIngredient] = useState<Ingredient | null>(null);
  const [isAddIngredientOpen, setIsAddIngredientOpen] = useState(false);
  const [isAddCategoryOpen, setIsAddCategoryOpen] = useState(false);
  const [isImportOpen, setIsImportOpen] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [isScanOpen, setIsScanOpen] = useState(false);
  const [isWhatsAppOpen, setIsWhatsAppOpen] = useState(false);
  const [selectedCategoryForProducts, setSelectedCategoryForProducts] = useState<Category | null>(null);
  const prevCreatingRef = useRef(false);

  useEffect(() => {
    if (isAddProductOpen && products.length === 0) {
      getIngredients();
    }
  }, [isAddProductOpen, products.length, getIngredients]);

  const [deleteTarget, setDeleteTarget] = useState<DeleteTarget | null>(null);

  const isProducts = tab === "products";
  const isRecipes = tab === "recipes";
  const isCategories = tab === "categories";

  const categoryFilterOptions = useMemo(
    () => [
      { label: t("All Categories"), value: "all" },
      ...categories.map((c) => ({ label: c.name, value: c.id })),
    ],
    [categories, t],
  );

  const filteredProducts = useMemo(() => {
    return products.filter(
      (p) =>
        (p.category || "").toLowerCase() !== "raw ingredients" &&
        p.isActive !== false &&
        p.available !== false
    );
  }, [products]);

  const filteredIngredients = useMemo(() => {
    if (tab !== "recipes") return [];
    return products
      .filter((p) => p.isActive !== false && p.available !== false)
      .map((p) => ({
        id: p.id,
        name: p.name,
        description: p.description || "",
        imageUrl: p.imageUrl,
        price: p.price,
        quantity: p.quantity ?? 0,
        unit: formatUnit(p.unit),
        recipe: p.recipe || [],
        isExtra: p.isExtra ?? false,
        extraTargetProductIds: p.extraTargetProductIds || [],
        barcode: p.barcode || "",
        isActive: p.isActive ?? p.available ?? true,
      }));
  }, [products, tab]);

  const ingredientOptions = useMemo(() => {
    return products.map((p) => ({
      id: p.id,
      name: p.name,
      description: p.description || "",
      imageUrl: p.imageUrl,
      price: p.price,
      quantity: p.quantity ?? 0,
      unit: formatUnit(p.unit),
      isExtra: p.isExtra ?? false,
      extraTargetProductIds: p.extraTargetProductIds || [],
      barcode: p.barcode || "",
    }));
  }, [products]);

  // --- Mutations ------------------------------------------------------------

  const toggleProductAvailability = (id: string, available: boolean) => {
    toggleProductActive({ productId: id, isActive: available });
  };

  const toggleCategoryActive = (id: string, active: boolean) => {
    toggleCategoryStatus({ categoryId: id, isActive: active });
  };

  const handleSaveProduct = (data: ProductFormData) => {
    const formData = new FormData();
    formData.append("name", data.name.trim());
    formData.append("description", data.description.trim());
    if (data.barcode !== undefined) {
      formData.append("barcode", data.barcode.trim());
    }
    formData.append("price", String(Number(data.price) || 0));
    formData.append("categoryId", data.category);
    formData.append("stockQty", String(Number(data.quantity) || 0));
    formData.append("productType", data.productType);

    const mappedVariantGroups = data.variantGroups
      .filter((g) => g.name && g.name.trim())
      .map((g) => ({
        name: g.name.trim(),
        required: Boolean(g.required),
        options: (g.options || [])
          .filter((o) => (o.name || (o as any).label || "").trim())
          .map((o) => {
            const optName = (o.name || (o as any).label || "").trim();
            return {
              name: optName,
              label: optName,
              priceAdjustment: Number(o.price) || 0,
              recipe: (o.recipe || []).map((r) => {
                const matId =
                  typeof r.material === "object" && r.material !== null
                    ? String((r.material as any)._id || (r.material as any).id || "")
                    : String(r.material || (r as any).ingredientId || "");
                return {
                  material: matId,
                  ingredientId: matId,
                  name: r.name || "",
                  price: Number(r.price) || 0,
                  quantity: Number(r.quantity) || 0,
                  unit: r.unit || "pcs",
                  ingredientUnit: r.ingredientUnit || r.unit || "pcs",
                };
              }),
            };
          }),
      }));
    formData.append("variantGroups", JSON.stringify(mappedVariantGroups));

    const seenExtraNames = new Set<string>();
    const mappedExtras: any[] = [];

    for (const e of data.extras || []) {
      const normName = (e.name || "").trim().toLowerCase();
      if (!normName || seenExtraNames.has(normName)) continue;
      seenExtraNames.add(normName);

      mappedExtras.push({
        id: e.id,
        name: e.name.trim(),
        price: Number(e.price) || 0,
        isActive: e.active !== false,
        quantity: Number(e.quantity) || 30,
        unit: e.unit || "ml",
        recipe: (e.recipe || []).map((r) => ({
          material: r.material,
          ingredientId: r.material,
          name: r.name,
          price: Number(r.price) || 0,
          quantity: Number(r.quantity) || 0,
          unit: r.unit || "pcs",
          ingredientUnit: r.ingredientUnit || r.unit || "pcs",
        })),
      });
    }
    formData.append("extras", JSON.stringify(mappedExtras));

    const mappedRecipe = (data.recipe || []).map((r) => {
      const matId =
        typeof r.material === "object" && r.material !== null
          ? String((r.material as any)._id || (r.material as any).id || "")
          : String(r.material || (r as any).ingredientId || "");
      return {
        material: matId,
        ingredientId: matId,
        name: r.name || "",
        price: Number(r.price) || 0,
        quantity: Number(r.quantity) || 0,
        unit: r.unit || "pcs",
        ingredientUnit: r.ingredientUnit || r.unit || "pcs",
      };
    });
    formData.append("recipe", JSON.stringify(mappedRecipe));

    if (data.imageFile) {
      formData.append("images", data.imageFile);
    }

    if (editingProduct) {
      updateProduct({ productId: editingProduct.id, formData });
    } else {
      creationSourceRef.current = "product";
      createProduct(formData);
    }
    // WhatsApp dialog opens automatically after confirmed success for products (see useEffect above)
  };

  const handleAddIngredient = (data: IngredientFormData) => {
    const rawIngredientsCat = categories.find(
      (c) => c.name.toLowerCase() === "raw ingredients"
    );
    const categoryId = rawIngredientsCat ? rawIngredientsCat.id : "";

    const formData = new FormData();
    formData.append("name", data.name.trim());
    formData.append("description", data.description.trim());
    if (data.barcode !== undefined) {
      formData.append("barcode", data.barcode.trim());
    }
    formData.append("price", String(Number(data.price) || 0));
    formData.append("categoryId", categoryId);
    formData.append("stockQty", String(Number(data.quantity) || 0));
    formData.append("unit", data.unit || "g");
    formData.append("isExtra", String(Boolean(data.isExtra)));
    formData.append("extraQuantity", String(Number(data.extraQuantity ?? data.quantity) || 0));
    formData.append(
      "extraTargetProductIds",
      JSON.stringify(data.extraTargetProductIds || [])
    );
    formData.append("variantGroups", JSON.stringify([]));
    formData.append("extras", JSON.stringify([]));

    const mappedRecipe = (data.recipe || []).map((r) => {
      const matId =
        typeof r.material === "object" && r.material !== null
          ? String((r.material as any)._id || (r.material as any).id || "")
          : String(r.material || (r as any).ingredientId || "");
      return {
        material: matId,
        ingredientId: matId,
        name: r.name || "",
        price: Number(r.price) || 0,
        quantity: Number(r.quantity) || 0,
        unit: r.unit || "pcs",
        ingredientUnit: r.ingredientUnit || r.unit || "pcs",
      };
    });
    formData.append("recipe", JSON.stringify(mappedRecipe));

    if (data.imageFile) {
      formData.append("images", data.imageFile);
    }

    if (editingIngredient) {
      updateProduct({ productId: editingIngredient.id, formData });
    } else {
      creationSourceRef.current = "recipe";
      createProduct(formData);
    }
  };

  const handleAddCategory = (data: CategoryFormData) => {
    if (data.imageFile) {
      const formData = new FormData();
      formData.append("name", data.name.trim());
      formData.append("image", data.imageFile);
      if (data.kitchenType) formData.append("kitchenType", data.kitchenType);
      createCategory(formData as any);
    } else {
      createCategory({
        name: data.name.trim(),
        ...(data.kitchenType ? { kitchenType: data.kitchenType } : {}),
      });
    }
  };

  const handleImportProducts = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    setIsImporting(true);
    try {
      const { data } = await api.post("/products/bulk-import", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      const created = data?.created ?? 0;
      const skipped = data?.skipped ?? 0;
      if (skipped > 0) {
        showErrorToast(t(`Imported ${created} product(s), ${skipped} row(s) skipped`));
      } else {
        showSuccessToast(t(`Imported ${created} product(s)`));
      }
      setIsImportOpen(false);
      getProducts({ page: 1, limit: 100 });
    } catch (err: any) {
      showErrorToast(err?.response?.data?.message || t("Failed to import products"));
    } finally {
      setIsImporting(false);
    }
  };

  const handleConfirmDelete = () => {
    if (!deleteTarget) return;
    const { id, kind } = deleteTarget;
    if (kind === "product" || kind === "ingredient")
      deleteProduct({ productId: String(id) });
    if (kind === "category")
      deleteCategory({ categoryId: String(id) });
    setDeleteTarget(null);
  };

  // --- Header config per tab ------------------------------------------------

  const headerTitle = isRecipes ? t("Ingredients") : t("Products");
  const headerDescription = isRecipes
    ? t("These ingredients will be used in product recipes.")
    : t("Manage your bakery and coffee menu");

  const primaryButton = isRecipes
    ? {
      text: t("Add New Ingredient"),
      onClick: () => setIsAddIngredientOpen(true),
    }
    : isCategories
      ? {
        text: t("Add New Category"),
        onClick: () => setIsAddCategoryOpen(true),
      }
      : {
        text: t("Add New Product"),
        onClick: () => {
          setEditingProduct(null);
          setIsAddProductOpen(true);
        },
      };

  const isLoading = !categoriesLoaded || !productsLoaded;

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] w-full items-center justify-center">
        <Coffee className="size-16 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <>
      {isCategoryFilterOpen && (
        <div className="pointer-events-none fixed inset-0 z-40 bg-black/40" />
      )}

      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <HeaderLayout title={headerTitle} description={headerDescription} />

        <div className="flex flex-wrap items-center gap-3">
          <DefaultButton
            data={{
              buttonText: t("import data"),
              icon: <Upload className="size-[18px] text-[#9524E4]" />,
              onClick: () => setIsImportOpen(true),
              className:
                "border border-[#7E00D7] bg-[#F3E9FA] text-[#9524E4] hover:bg-[#F3E9FA] hover:text-[#9524E4] hover:border-[#7E00D7] active:translate-y-0 shadow-none ring-0 focus:ring-0",
            }}
          />
          <DefaultButton
            data={{
              buttonText: t("Scan Product"),
              icon: <ScanBarcode className="size-[18px]" />,
              onClick: () => setIsScanOpen(true),
              className:
                "border-0 bg-[#F5F0EA] text-primary hover:bg-[#F5F0EA] hover:text-primary",
            }}
          />
          <DefaultButton
            data={{
              buttonText: primaryButton.text,
              icon: <Plus className="size-4.5" />,
              onClick: primaryButton.onClick,
            }}
          />
        </div>
      </div>

      <ProductsTabs active={tab} onChange={setTab} />

      {isProducts && (
        <>
          <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="flex-1">
              <SearchInputField
                value={productSearch}
                onChange={(val) => {
                  setProductSearch(val);
                  setPage(1);
                }}
                placeholder={t("Search products...")}
              />
            </div>
            <div className="sm:w-72">
              <DropdownSelect
                options={categoryFilterOptions}
                selected={categoryFilter}
                onSelect={(val) => {
                  setCategoryFilter(val);
                  setPage(1);
                }}
                onOpenChange={setIsCategoryFilterOpen}
                placeholder={t("All Categories")}
                align="end"
                className="md:w-full"
                contentClassName="md:w-[var(--radix-dropdown-menu-trigger-width)]"
              />
            </div>

            {/* View Mode Toggle Control (Figma specification) */}
            <div className="flex h-[56px] items-center justify-center gap-4 rounded-[12px] bg-[#F5F0EA] px-3 py-1 shrink-0 overflow-hidden">
              <button
                type="button"
                onClick={() => setViewMode("table")}
                aria-label={t("Table view")}
                className={cn(
                  "flex cursor-pointer items-center justify-center transition-all",
                  viewMode === "table"
                    ? "rounded-[6px] bg-white px-3 py-1.5 shadow-xs"
                    : "p-1.5 text-black hover:opacity-80"
                )}
              >
                <List className="size-6 text-black" />
              </button>
              <button
                type="button"
                onClick={() => setViewMode("grid")}
                aria-label={t("Grid view")}
                className={cn(
                  "flex cursor-pointer items-center justify-center transition-all",
                  viewMode === "grid"
                    ? "rounded-[6px] bg-white px-3 py-1.5 shadow-xs"
                    : "p-1.5 text-black hover:opacity-80"
                )}
              >
                <LayoutGrid className="size-6 text-black" />
              </button>
            </div>
          </div>

          {viewMode === "grid" ? (
            <ProductsCards
              products={filteredProducts}
              togglingProductId={togglingProductId}
              isLoading={isFetchingProducts}
              isMutating={
                isCreatingProduct ||
                isUpdatingProduct ||
                isDeletingProduct ||
                isTogglingProduct
              }
              onToggleAvailability={toggleProductAvailability}
              onEdit={(product) => {
                setEditingProduct(product);
                setIsAddProductOpen(true);
              }}
              onDelete={(product) =>
                setDeleteTarget({
                  id: product.id,
                  name: product.name,
                  kind: "product",
                })
              }
            />
          ) : (
            <ProductsTable
              products={filteredProducts}
              togglingProductId={togglingProductId}
              isLoading={isFetchingProducts}
              isMutating={
                isCreatingProduct ||
                isUpdatingProduct ||
                isDeletingProduct ||
                isTogglingProduct
              }
              onToggleAvailability={toggleProductAvailability}
              onEdit={(product) => {
                setEditingProduct(product);
                setIsAddProductOpen(true);
              }}
              onDelete={(product) =>
                setDeleteTarget({
                  id: product.id,
                  name: product.name,
                  kind: "product",
                })
              }
            />
          )}

          {/* Pagination Controls */}
          {pagination && pagination.pages > 1 && (
            <div className="mt-6 flex items-center justify-center gap-2">
              <button
                type="button"
                disabled={page === 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="flex size-9 items-center justify-center rounded-[8px] border border-[#E5E5E5] bg-white text-[#28293D] hover:bg-[#F5F0EA] disabled:opacity-50 disabled:hover:bg-white cursor-pointer"
              >
                &lt;
              </button>
              {Array.from({ length: pagination.pages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setPage(p)}
                  className={cn(
                    "flex size-9 items-center justify-center rounded-[8px] text-[14px] font-semibold transition-colors cursor-pointer",
                    p === page
                      ? "bg-primary text-white"
                      : "border border-[#E5E5E5] bg-white text-[#28293D] hover:bg-[#F5F0EA]"
                  )}
                >
                  {p}
                </button>
              ))}
              <button
                type="button"
                disabled={page === pagination.pages}
                onClick={() => setPage((p) => Math.min(pagination.pages, p + 1))}
                className="flex size-9 items-center justify-center rounded-[8px] border border-[#E5E5E5] bg-white text-[#28293D] hover:bg-[#F5F0EA] disabled:opacity-50 disabled:hover:bg-white cursor-pointer"
              >
                &gt;
              </button>
            </div>
          )}
        </>
      )}

      {isRecipes && (
        <>
          <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="flex-1">
              <SearchInputField
                value={ingredientSearch}
                onChange={(val) => {
                  setIngredientSearch(val);
                  setPage(1);
                }}
                placeholder={t("Search recipes...")}
              />
            </div>

            {/* View Mode Toggle Control (Figma specification) */}
            <div className="flex h-[56px] items-center justify-center gap-4 rounded-[12px] bg-[#F5F0EA] px-3 py-1 shrink-0 overflow-hidden">
              <button
                type="button"
                onClick={() => setViewMode("table")}
                aria-label={t("Table view")}
                className={cn(
                  "flex cursor-pointer items-center justify-center transition-all",
                  viewMode === "table"
                    ? "rounded-[6px] bg-white px-3 py-1.5 shadow-xs"
                    : "p-1.5 text-black hover:opacity-80"
                )}
              >
                <List className="size-6 text-black" />
              </button>
              <button
                type="button"
                onClick={() => setViewMode("grid")}
                aria-label={t("Grid view")}
                className={cn(
                  "flex cursor-pointer items-center justify-center transition-all",
                  viewMode === "grid"
                    ? "rounded-[6px] bg-white px-3 py-1.5 shadow-xs"
                    : "p-1.5 text-black hover:opacity-80"
                )}
              >
                <LayoutGrid className="size-6 text-black" />
              </button>
            </div>
          </div>

          {isFetchingProducts ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="size-8 animate-spin text-primary" />
            </div>
          ) : (
            <>
              {viewMode === "grid" ? (
                <IngredientsCards
                  ingredients={filteredIngredients}
                  isLoading={isFetchingProducts}
                  onEdit={(ingredient) => {
                    setEditingIngredient(ingredient);
                    setIsAddIngredientOpen(true);
                  }}
                  onDelete={(ingredient) =>
                    setDeleteTarget({
                      id: ingredient.id,
                      name: ingredient.name,
                      kind: "ingredient",
                    })
                  }
                />
              ) : (
                <IngredientsTable
                  ingredients={filteredIngredients}
                  onEdit={(ingredient) => {
                    setEditingIngredient(ingredient);
                    setIsAddIngredientOpen(true);
                  }}
                  onDelete={(ingredient) =>
                    setDeleteTarget({
                      id: ingredient.id,
                      name: ingredient.name,
                      kind: "ingredient",
                    })
                  }
                />
              )}

              {/* Pagination Controls */}
              {pagination && pagination.pages > 1 && (
                <div className="mt-6 flex items-center justify-center gap-2">
                  <button
                    type="button"
                    disabled={page === 1}
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    className="flex size-9 items-center justify-center rounded-[8px] border border-[#E5E5E5] bg-white text-[#28293D] hover:bg-[#F5F0EA] disabled:opacity-50 disabled:hover:bg-white cursor-pointer"
                  >
                    &lt;
                  </button>
                  {Array.from({ length: pagination.pages }, (_, i) => i + 1).map((p) => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setPage(p)}
                      className={cn(
                        "flex size-9 items-center justify-center rounded-[8px] text-[14px] font-semibold transition-colors cursor-pointer",
                        p === page
                          ? "bg-primary text-white"
                          : "border border-[#E5E5E5] bg-white text-[#28293D] hover:bg-[#F5F0EA]"
                      )}
                    >
                      {p}
                    </button>
                  ))}
                  <button
                    type="button"
                    disabled={page === pagination.pages}
                    onClick={() => setPage((p) => Math.min(pagination.pages, p + 1))}
                    className="flex size-9 items-center justify-center rounded-[8px] border border-[#E5E5E5] bg-white text-[#28293D] hover:bg-[#F5F0EA] disabled:opacity-50 disabled:hover:bg-white cursor-pointer"
                  >
                    &gt;
                  </button>
                </div>
              )}
            </>
          )}
        </>
      )}

      {isCategories && (
        <CategoriesTable
          categories={categories}
          togglingCategoryId={togglingCategoryId}
          isLoading={isFetchingCategories}
          isMutating={isTogglingCategory || isDeletingCategory}
          onToggleActive={toggleCategoryActive}
          onDelete={(category) =>
            setDeleteTarget({
              id: category.id,
              name: category.name,
              kind: "category",
            })
          }
          onRowClick={(category) => {
            setSelectedCategoryForProducts(category);
          }}
        />
      )}

      {/* Dialogs */}
      <AddProductDialog
        open={isAddProductOpen}
        editingProduct={editingProduct}
        onOpenChange={(open) => {
          setIsAddProductOpen(open);
          if (!open) setEditingProduct(null);
        }}
        ingredients={ingredientOptions}
        categories={categories}
        isSaving={isCreatingProduct || isUpdatingProduct}
        onSave={handleSaveProduct}
      />

      <AddIngredientDialog
        open={isAddIngredientOpen}
        editingIngredient={editingIngredient}
        onOpenChange={(open) => {
          setIsAddIngredientOpen(open);
          if (!open) setEditingIngredient(null);
        }}
        isSaving={isCreatingProduct || isUpdatingProduct}
        onSave={handleAddIngredient}
      />

      <AddCategoryDialog
        open={isAddCategoryOpen}
        onOpenChange={setIsAddCategoryOpen}
        isSaving={isCreatingCategory}
        onSave={handleAddCategory}
      />

      <CategoryProductsDialog
        open={!!selectedCategoryForProducts}
        onOpenChange={(open) => {
          if (!open) setSelectedCategoryForProducts(null);
        }}
        category={selectedCategoryForProducts}
        onEditProduct={(product) => {
          setSelectedCategoryForProducts(null);
          setEditingProduct(product);
          setIsAddProductOpen(true);
        }}
      />

      <ImportDataDialog
        open={isImportOpen}
        onOpenChange={setIsImportOpen}
        onUpload={handleImportProducts}
        isUploading={isImporting}
      />

      <ScanProductDialog
        open={isScanOpen}
        onOpenChange={setIsScanOpen}
        onProductFound={(product) => {
          setEditingProduct(product);
          setIsAddProductOpen(true);
        }}
      />


      <WhatsAppOfferDialog
        open={isWhatsAppOpen}
        onOpenChange={setIsWhatsAppOpen}
        onSend={() => setIsWhatsAppOpen(false)}
      />

      <DeleteDialog
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        data={{
          item: deleteTarget?.name ?? "",
          type: deleteTarget ? DELETE_TYPE_LABEL[deleteTarget.kind] : "product",
          typeBeforeName: true,
        }}
        onConfirm={handleConfirmDelete}
      />
    </>
  );
};

export default ProductsPage;
