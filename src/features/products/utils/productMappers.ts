import type { Product, VariantGroup, ProductExtra } from "../types";

export const DEFAULT_PRODUCT_IMAGE =
  "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=600&q=80";

export const resolveImageUrl = (path?: string | string[]): string => {
  if (!path) return DEFAULT_PRODUCT_IMAGE;
  const p = Array.isArray(path) ? path[0] : path;
  if (!p) return DEFAULT_PRODUCT_IMAGE;
  if (p.startsWith("http://") || p.startsWith("https://") || p.startsWith("data:")) {
    return p;
  }
  return `https://api.patriacoffeebeans.com/${p}`;
};

export const mapProduct = (backendProduct: any): Product => {
  const categoryName =
    typeof backendProduct.category === "string"
      ? backendProduct.category
      : typeof backendProduct.category === "object" && backendProduct.category !== null
        ? backendProduct.category.name
        : backendProduct.category || "";

  const variantGroups: VariantGroup[] = (backendProduct.variantGroups || []).map((g: any) => ({
    id: g._id || g.id,
    name: g.name,
    required: g.required ?? false,
    options: (g.options || []).map((o: any) => ({
      id: o._id || o.id,
      name: o.label || o.name || "",
      price: o.priceAdjustment ?? o.price ?? 0,
    })),
  }));

  const extras: ProductExtra[] = (backendProduct.extras || []).map((e: any) => ({
    id: e._id || e.id,
    name: e.name,
    price: e.price,
    active: e.active ?? e.isActive ?? true,
  }));

  return {
    id: backendProduct._id || backendProduct.id,
    name: backendProduct.name,
    description: backendProduct.description || "",
    category: categoryName,
    imageUrl: resolveImageUrl(backendProduct.image || backendProduct.images),
    price: backendProduct.price,
    available: backendProduct.isActive ?? backendProduct.available ?? true,
    extras,
    variantGroups,
    quantity: backendProduct.inventory ?? backendProduct.stockQty ?? 0,
    unit: (backendProduct.unit === "pcs" || backendProduct.unit === "pc" || !backendProduct.unit) ? "Piece(s)" : backendProduct.unit,
  };
};

export const mapProducts = (backendProducts: any[]): Product[] => {
  return (backendProducts || []).map(mapProduct);
};
