import { useMemo, useState } from "react";
import { Plus, ScanBarcode, Upload } from "lucide-react";
import HeaderLayout from "@/layouts/HeaderLayout";
import DefaultButton from "@/shared/components/DefaultButton";
import DeleteDialog from "@/shared/components/DeleteDialog";
import DropdownSelect from "@/shared/components/DropdownSelect";
import SearchInputField from "@/shared/components/SearchInputField";
import { useTranslation } from "@/shared/i18n/useTranslation";

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
  id: number;
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

  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [ingredients, setIngredients] =
    useState<Ingredient[]>(INITIAL_INGREDIENTS);
  const [categories, setCategories] =
    useState<Category[]>(INITIAL_CATEGORIES);

  const [productSearch, setProductSearch] = useState("");
  const [ingredientSearch, setIngredientSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [isCategoryFilterOpen, setIsCategoryFilterOpen] = useState(false);

  // Dialogs
  const [isAddProductOpen, setIsAddProductOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
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
      ...PRODUCT_CATEGORIES.map((c) => ({ label: t(c), value: c })),
    ],
    [t],
  );

  const filteredProducts = useMemo(() => {
    const q = productSearch.toLowerCase().trim();
    return products.filter((product) => {
      const matchesCategory =
        categoryFilter === "all" || product.category === categoryFilter;
      if (!matchesCategory) return false;
      if (!q) return true;
      return (
        product.name.toLowerCase().includes(q) ||
        product.category.toLowerCase().includes(q)
      );
    });
  }, [products, productSearch, categoryFilter]);

  const filteredIngredients = useMemo(() => {
    const q = ingredientSearch.toLowerCase().trim();
    if (!q) return ingredients;
    return ingredients.filter((ingredient) =>
      ingredient.name.toLowerCase().includes(q),
    );
  }, [ingredients, ingredientSearch]);

  // --- Mutations ------------------------------------------------------------

  const toggleProductAvailability = (id: number, available: boolean) =>
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, available } : p)),
    );

  const toggleCategoryActive = (id: number, active: boolean) =>
    setCategories((prev) =>
      prev.map((c) => (c.id === id ? { ...c, active } : c)),
    );

  const handleSaveProduct = (data: ProductFormData) => {
    if (editingProduct) {
      const id = editingProduct.id;
      setProducts((prev) =>
        prev.map((p) =>
          p.id === id
            ? {
                ...p,
                name: data.name.trim(),
                description: data.description.trim(),
                category: data.category,
                price: Number(data.price) || p.price,
                imageUrl: data.imageUrl ?? p.imageUrl,
              }
            : p,
        ),
      );
    } else {
      const product: Product = {
        id: nextId(),
        name: data.name.trim(),
        description: data.description.trim(),
        category: data.category,
        imageUrl:
          data.imageUrl ??
          "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=600&q=80",
        price: Number(data.price) || 0,
        available: true,
      };
      setProducts((prev) => [product, ...prev]);
    }
    // After creating or editing, offer to promote the product over WhatsApp.
    setIsWhatsAppOpen(true);
  };

  const handleAddIngredient = (data: IngredientFormData) => {
    const ingredient: Ingredient = {
      id: nextId(),
      name: data.name.trim(),
      description: data.description.trim(),
      imageUrl:
        data.imageUrl ??
        "https://images.unsplash.com/photo-1546470427-e26264be0b0d?auto=format&fit=crop&w=600&q=80",
      price: Number(data.price) || 0,
      quantity: Number(data.quantity) || 0,
      unit: "Piece(s)",
      isExtra: data.isExtra,
      extraCategories: data.extraCategories,
    };
    setIngredients((prev) => [ingredient, ...prev]);
  };

  const handleAddCategory = (data: CategoryFormData) => {
    const category: Category = {
      id: nextId(),
      name: data.name.trim(),
      imageUrl:
        data.imageUrl ??
        "https://images.unsplash.com/photo-1517701604599-bb29b565090c?auto=format&fit=crop&w=600&q=80",
      itemCount: 0,
      active: true,
    };
    setCategories((prev) => [...prev, category]);
  };

  const handleConfirmDelete = () => {
    if (!deleteTarget) return;
    const { id, kind } = deleteTarget;
    if (kind === "product")
      setProducts((prev) => prev.filter((p) => p.id !== id));
    if (kind === "ingredient")
      setIngredients((prev) => prev.filter((i) => i.id !== id));
    if (kind === "category")
      setCategories((prev) => prev.filter((c) => c.id !== id));
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
                onChange={setProductSearch}
                placeholder={t("Search products...")}
              />
            </div>
            <div className="sm:w-72">
              <DropdownSelect
                options={categoryFilterOptions}
                selected={categoryFilter}
                onSelect={setCategoryFilter}
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
        </>
      )}

      {isRecipes && (
        <>
          <div className="mb-5">
            <SearchInputField
              value={ingredientSearch}
              onChange={setIngredientSearch}
              placeholder={t("Search recipes...")}
            />
          </div>

          <IngredientsTable
            ingredients={filteredIngredients}
            onEdit={() => setIsAddIngredientOpen(true)}
            onDelete={(ingredient) =>
              setDeleteTarget({
                id: ingredient.id,
                name: ingredient.name,
                kind: "ingredient",
              })
            }
          />
        </>
      )}

      {isCategories && (
        <CategoriesTable
          categories={categories}
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
        ingredients={ingredients}
        onSave={handleSaveProduct}
      />

      <AddIngredientDialog
        open={isAddIngredientOpen}
        onOpenChange={setIsAddIngredientOpen}
        onSave={handleAddIngredient}
      />

      <AddCategoryDialog
        open={isAddCategoryOpen}
        onOpenChange={setIsAddCategoryOpen}
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
