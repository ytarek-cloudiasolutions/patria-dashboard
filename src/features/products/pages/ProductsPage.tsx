import { useMemo, useState } from "react";
import { CookingPot, LayoutGrid, Plus, Store } from "lucide-react";
import HeaderLayout from "@/layouts/HeaderLayout";
import { Button } from "@/shared/components/ui/button";
import {
  MOCK_CATEGORIES,
  MOCK_INGREDIENTS,
  MOCK_PRODUCTS,
  PRODUCT_CATEGORY_OPTIONS,
} from "../data";
import AddCategoryDialog from "../components/AddCategoryDialog";
import AddIngredientDialog from "../components/AddIngredientDialog";
import AddProductDialog from "../components/AddProductDialog";
import CategoriesTable from "../components/CategoriesTable";
import IngredientsTable from "../components/IngredientsTable";
import ProductsFilters from "../components/ProductsFilters";
import ProductsTable from "../components/ProductsTable";
import type {
  CategoryFormData,
  Ingredient,
  IngredientFormData,
  Product,
  ProductCategory,
  ProductFormData,
  ProductTab,
  RecipeSelection,
} from "../types";
const ProductsPage = () => {
  const [activeTab, setActiveTab] = useState<ProductTab>("products");
  const [searchValue, setSearchValue] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [products, setProducts] = useState<Product[]>(MOCK_PRODUCTS);
  const [ingredients, setIngredients] =
    useState<Ingredient[]>(MOCK_INGREDIENTS);
  const [categories, setCategories] =
    useState<ProductCategory[]>(MOCK_CATEGORIES);

  const [isProductDialogOpen, setIsProductDialogOpen] = useState(false);
  const [isIngredientDialogOpen, setIsIngredientDialogOpen] = useState(false);
  const [isCategoryDialogOpen, setIsCategoryDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [editingIngredient, setEditingIngredient] = useState<Ingredient | null>(
    null,
  );

  const filteredProducts = useMemo(() => {
    const normalizedSearch = searchValue.trim().toLowerCase();

    return products.filter((product) => {
      const matchesSearch =
        normalizedSearch.length === 0 ||
        product.name.toLowerCase().includes(normalizedSearch) ||
        product.description.toLowerCase().includes(normalizedSearch);

      const matchesCategory =
        selectedCategory === "All Categories" ||
        product.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [products, searchValue, selectedCategory]);

  const filteredIngredients = useMemo(() => {
    const normalizedSearch = searchValue.trim().toLowerCase();

    return ingredients.filter((ingredient) => {
      if (normalizedSearch.length === 0) {
        return true;
      }

      return (
        ingredient.name.toLowerCase().includes(normalizedSearch) ||
        ingredient.description.toLowerCase().includes(normalizedSearch)
      );
    });
  }, [ingredients, searchValue]);

  const openAddProduct = () => {
    setEditingProduct(null);
    setIsProductDialogOpen(true);
  };

  const openAddIngredient = () => {
    setEditingIngredient(null);
    setIsIngredientDialogOpen(true);
  };

  const openAddCategory = () => {
    setIsCategoryDialogOpen(true);
  };

  const openActiveDialog = () => {
    if (activeTab === "products") {
      openAddProduct();
      return;
    }

    if (activeTab === "ingredients") {
      openAddIngredient();
      return;
    }

    openAddCategory();
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setIsProductDialogOpen(true);
  };

  const handleEditIngredient = (ingredient: Ingredient) => {
    setEditingIngredient(ingredient);
    setIsIngredientDialogOpen(true);
  };

  const handleProductSave = (
    payload: ProductFormData,
    _selectedRecipes: RecipeSelection[],
  ) => {
    const parsedPrice = Number(payload.price) || 0;

    if (editingProduct) {
      setProducts((previous) =>
        previous.map((product) =>
          product.id === editingProduct.id
            ? {
                ...product,
                name: payload.name || product.name,
                description: payload.description || product.description,
                category: payload.category || product.category,
                price: parsedPrice,
                status: payload.status,
                imageUrl: payload.imageUrl || product.imageUrl,
                isActive: payload.isActive,
              }
            : product,
        ),
      );
      return;
    }

    const nextProduct: Product = {
      id: (products.at(-1)?.id ?? 0) + 1,
      name: payload.name || "New Product",
      description: payload.description || "No description provided.",
      category: payload.category || "Pastries",
      price: parsedPrice,
      status: payload.status,
      imageUrl:
        payload.imageUrl ||
        "https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?w=80&h=80&fit=crop",
      isActive: payload.isActive,
      discountLabel: payload.discountValue
        ? `${payload.discountValue}${payload.discountType || ""}`
        : undefined,
    };

    setProducts((previous) => [nextProduct, ...previous]);
  };

  const handleIngredientSave = (payload: IngredientFormData) => {
    const parsedPrice = Number(payload.price) || 0;
    const parsedQuantity = Number(payload.initialQuantity) || 0;

    if (editingIngredient) {
      setIngredients((previous) =>
        previous.map((ingredient) =>
          ingredient.id === editingIngredient.id
            ? {
                ...ingredient,
                name: payload.name || ingredient.name,
                description: payload.description || ingredient.description,
                price: parsedPrice,
                initialQuantity: parsedQuantity,
                imageUrl: payload.imageUrl || ingredient.imageUrl,
              }
            : ingredient,
        ),
      );
      return;
    }

    const nextIngredient: Ingredient = {
      id: (ingredients.at(-1)?.id ?? 0) + 1,
      name: payload.name || "New Ingredient",
      description: payload.description || "No description provided.",
      category: "Raw Ingredient",
      price: parsedPrice,
      initialQuantity: parsedQuantity,
      imageUrl:
        payload.imageUrl ||
        "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=80&h=80&fit=crop",
    };

    setIngredients((previous) => [nextIngredient, ...previous]);
  };

  const handleCategorySave = (payload: CategoryFormData) => {
    const nextCategory: ProductCategory = {
      id: (categories.at(-1)?.id ?? 0) + 1,
      name: payload.name || "New Category",
      itemCount: 0,
      isActive: true,
      imageUrl:
        payload.imageUrl ||
        "https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?w=80&h=80&fit=crop",
    };

    setCategories((previous) => [nextCategory, ...previous]);
  };

  const handleTabChange = (tab: ProductTab) => {
    setActiveTab(tab);
    setSearchValue("");
    setSelectedCategory("All Categories");
  };

  const activeTitle =
    activeTab === "ingredients" ? "Ingredients and raw materials" : "Products";

  const activeDescription =
    activeTab === "ingredients"
      ? "These ingredients will be used in product recipes."
      : "Manage your bakery and coffee menu";

  const actionLabel =
    activeTab === "products"
      ? "Add New Product"
      : activeTab === "ingredients"
        ? "Add New Ingredient"
        : "Add New Category";

  return (
    <section className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <HeaderLayout title={activeTitle} description={activeDescription} />

        <Button
          className="h-14 rounded-[5px] px-7.5 py-4 text-[#FFFFFF] text-[16px] font-semibold"
          onClick={openActiveDialog}
        >
          <Plus className="mr-3 size-4.5" />
          {actionLabel}
        </Button>
      </div>

      {activeTab !== "categories" ? (
        <ProductsFilters
          searchValue={searchValue}
          selectedCategory={selectedCategory}
          categories={PRODUCT_CATEGORY_OPTIONS}
          searchPlaceholder={
            activeTab === "products" ? "Search products..." : "Search recipes..."
          }
          showCategoryFilter={activeTab === "products"}
          onSearchChange={setSearchValue}
          onCategoryChange={setSelectedCategory}
        />
      ) : null}

      <div className="mb-7 grid grid-cols-3 gap-x-1.5 gap-y-1">
        <Button
          type="button"
          variant="ghost"
          size="default"
          onClick={() => handleTabChange("products")}
          className={`relative h-auto w-full cursor-pointer rounded-none pb-3 text-center text-[16px] font-semibold transition-colors ${
            activeTab === "products"
              ? "text-[#333333] font-medium"
              : "text-[#8B8B8B] hover:text-[#8B8B8B]"
          }`}
        >
          <Store className="size-6" />
          Products
          <span
            className={`absolute right-0 bottom-0 left-0 h-0.5 transition-all ${
              activeTab === "products" ? "bg-primary" : "bg-[#8B8B8B]"
            }`}
          />
        </Button>

        <Button
          type="button"
          variant="ghost"
          size="default"
          onClick={() => handleTabChange("ingredients")}
          className={`relative h-auto w-full cursor-pointer rounded-none pb-3 text-center text-[16px] font-semibold transition-colors ${
            activeTab === "ingredients"
              ? "text-[#333333] font-medium"
              : "text-[#8B8B8B] hover:text-[#8B8B8B]"
          }`}
        >
          <CookingPot className="size-6" />
          Recipes
          <span
            className={`absolute right-0 bottom-0 left-0 h-0.5 transition-all ${
              activeTab === "ingredients" ? "bg-primary" : "bg-[#8B8B8B]"
            }`}
          />
        </Button>

        <Button
          type="button"
          variant="ghost"
          size="default"
          onClick={() => handleTabChange("categories")}
          className={`relative h-auto w-full cursor-pointer rounded-none pb-3 text-center text-[16px] font-semibold transition-colors ${
            activeTab === "categories"
              ? "text-[#333333] font-medium"
              : "text-[#8B8B8B] hover:text-[#8B8B8B]"
          }`}
        >
          <LayoutGrid className="size-6" />
          Categories
          <span
            className={`absolute right-0 bottom-0 left-0 h-0.5 transition-all ${
              activeTab === "categories" ? "bg-primary" : "bg-[#8B8B8B]"
            }`}
          />
        </Button>
      </div>

      {activeTab === "products" ? (
        <ProductsTable
          products={filteredProducts}
          onEdit={handleEditProduct}
          onDelete={(productId) => {
            setProducts((previous) =>
              previous.filter((product) => product.id !== productId),
            );
          }}
          onToggleActive={(productId, checked) => {
            setProducts((previous) =>
              previous.map((product) =>
                product.id === productId
                  ? {
                      ...product,
                      isActive: checked,
                      status: checked ? "Available" : "Out Of Stock",
                    }
                  : product,
              ),
            );
          }}
        />
      ) : activeTab === "ingredients" ? (
        <IngredientsTable
          ingredients={filteredIngredients}
          onEdit={handleEditIngredient}
          onDelete={(ingredientId) => {
            setIngredients((previous) =>
              previous.filter((ingredient) => ingredient.id !== ingredientId),
            );
          }}
        />
      ) : (
        <CategoriesTable
          categories={categories}
          onDelete={(categoryId) => {
            setCategories((previous) =>
              previous.filter((category) => category.id !== categoryId),
            );
          }}
          onToggleActive={(categoryId, checked) => {
            setCategories((previous) =>
              previous.map((category) =>
                category.id === categoryId
                  ? { ...category, isActive: checked }
                  : category,
              ),
            );
          }}
        />
      )}

      <AddProductDialog
        open={isProductDialogOpen}
        product={editingProduct}
        ingredientOptions={ingredients}
        onOpenChange={(open) => {
          setIsProductDialogOpen(open);
          if (!open) {
            setEditingProduct(null);
          }
        }}
        onSave={handleProductSave}
      />

      <AddIngredientDialog
        open={isIngredientDialogOpen}
        ingredient={editingIngredient}
        onOpenChange={(open) => {
          setIsIngredientDialogOpen(open);
          if (!open) {
            setEditingIngredient(null);
          }
        }}
        onSave={handleIngredientSave}
      />

      <AddCategoryDialog
        open={isCategoryDialogOpen}
        onOpenChange={setIsCategoryDialogOpen}
        onSave={handleCategorySave}
      />
    </section>
  );
};

export default ProductsPage;
