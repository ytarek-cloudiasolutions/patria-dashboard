import { useEffect, useMemo, useState } from "react";
import { Plus, ScanBarcode, Upload, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import HeaderLayout from "@/layouts/HeaderLayout";
import DefaultButton from "@/shared/components/DefaultButton";
import DeleteDialog from "@/shared/components/DeleteDialog";
import DropdownSelect from "@/shared/components/DropdownSelect";
import SearchInputField from "@/shared/components/SearchInputField";
import { useTranslation } from "@/shared/i18n/useTranslation";
import { useCategories } from "@/features/categories";
import { useProducts } from "@/features/products";

import ProductsTabs from "./components/ProductsTabs";
import ProductsTable from "./components/ProductsTable";
import IngredientsTable from "./components/IngredientsTable";
import CategoriesTable from "./components/CategoriesTable";
import AddProductDialog from "./components/AddProductDialog";
import AddIngredientDialog from "./components/AddIngredientDialog";
import AddCategoryDialog from "./components/AddCategoryDialog";
import ImportDataDialog from "./components/ImportDataDialog";
import ScanProductDialog from "./components/ScanProductDialog";
import WhatsAppOfferDialog from "./components/WhatsAppOfferDialog";

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

let seqId = 1000;
const nextId = () => ++seqId;

const ProductsPage = () => {
  const { t } = useTranslation();
  const [tab, setTab] = useState<ProductsTab>("products");

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

  useEffect(() => {
    setPage(1);
    setProductSearch("");
    setIngredientSearch("");
    setCategoryFilter("all");
  }, [tab]);

  useEffect(() => {
    getCategories();
    getIngredients();
  }, [getCategories, getIngredients]);

  useEffect(() => {
    if (tab === "products") {
      getProducts({
        search: productSearch.trim() || undefined,
        category: categoryFilter !== "all" ? categoryFilter : undefined,
        page,
        limit: 10,
      });
    } else if (tab === "recipes") {
      getProducts({
        search: ingredientSearch.trim() || undefined,
        category: "Raw Ingredients",
        page,
        limit: 10,
      });
    }
  }, [tab, productSearch, categoryFilter, ingredientSearch, page, getProducts]);

  // Dialogs
  const [isAddProductOpen, setIsAddProductOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [editingIngredient, setEditingIngredient] = useState<Ingredient | null>(null);
  const [isAddIngredientOpen, setIsAddIngredientOpen] = useState(false);
  const [isAddCategoryOpen, setIsAddCategoryOpen] = useState(false);
  const [isImportOpen, setIsImportOpen] = useState(false);
  const [isScanOpen, setIsScanOpen] = useState(false);
  const [isWhatsAppOpen, setIsWhatsAppOpen] = useState(false);

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

  const filteredProducts = products;

  const filteredIngredients = useMemo(() => {
    if (tab !== "recipes") return [];
    return products.map((p) => ({
      id: p.id,
      name: p.name,
      description: p.description || "",
      imageUrl: p.imageUrl,
      price: p.price,
      quantity: p.quantity ?? 0,
      unit: p.unit || "Piece(s)",
      isExtra: false,
    }));
  }, [products, tab]);

  const ingredientOptions = useMemo(() => {
    return ingredients.map((p) => ({
      id: p.id,
      name: p.name,
      description: p.description || "",
      imageUrl: p.imageUrl,
      price: p.price,
      quantity: p.quantity ?? 0,
      unit: p.unit || "Piece(s)",
      isExtra: false,
    }));
  }, [ingredients]);

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
    formData.append("price", String(Number(data.price) || 0));
    formData.append("categoryId", data.category);

    const mappedVariantGroups = data.variantGroups.map((g) => ({
      name: g.name,
      required: g.required,
      options: g.options.map((o) => ({
        name: o.name,
        label: o.name,
        priceAdjustment: Number(o.price) || 0,
      })),
    }));
    formData.append("variantGroups", JSON.stringify(mappedVariantGroups));

    const mappedExtras = data.extras.map((e) => ({
      name: e.name,
      price: Number(e.price) || 0,
    }));
    formData.append("extras", JSON.stringify(mappedExtras));

    if (data.imageFile) {
      formData.append("images", data.imageFile);
    }

    if (editingProduct) {
      updateProduct({ productId: editingProduct.id, formData });
    } else {
      createProduct(formData);
    }
    // After creating or editing, offer to promote the product over WhatsApp.
    setIsWhatsAppOpen(true);
  };

  const handleAddIngredient = (data: IngredientFormData) => {
    const rawIngredientsCat = categories.find(
      (c) => c.name.toLowerCase() === "raw ingredients"
    );
    const categoryId = rawIngredientsCat ? rawIngredientsCat.id : "";

    const formData = new FormData();
    formData.append("name", data.name.trim());
    formData.append("description", data.description.trim());
    formData.append("price", String(Number(data.price) || 0));
    formData.append("categoryId", categoryId);
    formData.append("stockQty", String(Number(data.quantity) || 0));
    formData.append("variantGroups", JSON.stringify([]));
    formData.append("extras", JSON.stringify([]));

    if (data.imageFile) {
      formData.append("images", data.imageFile);
    }

    if (editingIngredient) {
      updateProduct({ productId: editingIngredient.id, formData });
    } else {
      createProduct(formData);
    }
  };

  const handleAddCategory = (data: CategoryFormData) => {
    createCategory({
      name: data.name.trim(),
      image: data.imageUrl || undefined,
    });
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
              variant: "outline",
              icon: <Upload className="size-4.5" />,
              onClick: () => setIsImportOpen(true),
              className:
                "border-[#7A3FF2] text-[#7A3FF2] hover:bg-[#7A3FF2]/5 hover:text-[#7A3FF2]",
            }}
          />
          <DefaultButton
            data={{
              buttonText: t("Scan Product"),
              icon: <ScanBarcode className="size-4.5" />,
              onClick: () => setIsScanOpen(true),
              className:
                "border-0 bg-[#EFEDE8] text-[#7A6A4F] hover:bg-[#E7E4DC]",
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
          </div>

          <ProductsTable
            products={filteredProducts}
            togglingProductId={togglingProductId}
            isLoading={isFetchingProducts}
            isMutating={isCreatingProduct || isUpdatingProduct || isDeletingProduct || isTogglingProduct}
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
          <div className="mb-5">
            <SearchInputField
              value={ingredientSearch}
              onChange={(val) => {
                setIngredientSearch(val);
                setPage(1);
              }}
              placeholder={t("Search recipes...")}
            />
          </div>

          {isFetchingProducts ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="size-8 animate-spin text-primary" />
            </div>
          ) : (
            <>
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

      <ImportDataDialog
        open={isImportOpen}
        onOpenChange={setIsImportOpen}
        onUpload={() => setIsImportOpen(false)}
      />

      <ScanProductDialog
        open={isScanOpen}
        onOpenChange={setIsScanOpen}
        onSearch={() => setIsScanOpen(false)}
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
