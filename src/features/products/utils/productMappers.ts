import type { Product, VariantGroup, ProductExtra } from "../types";
import { ENV } from "@/config/env";
import { formatUnit } from "../utils";

export const DEFAULT_PRODUCT_IMAGE =
  "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=600&q=80";

// Strip the /api suffix to get the server root (e.g. https://api.patriacoffeebeans.com)
const SERVER_ROOT = (ENV.API_URL || "").replace(/\/api\/?$/, "");

export const resolveImageUrl = (path?: string | string[]): string => {
  if (!path) return DEFAULT_PRODUCT_IMAGE;
  const p = Array.isArray(path) ? path[0] : path;
  if (!p) return DEFAULT_PRODUCT_IMAGE;
  // Backend now returns full URLs — use directly
  if (p.startsWith("http://") || p.startsWith("https://") || p.startsWith("data:")) {
    return p;
  }
  // Fallback for legacy relative paths: serve via /api/uploads/ so Nginx proxies it
  const filename = p.replace(/^uploads\//, '');
  return `${SERVER_ROOT}/api/uploads/${filename}`;
};

export const mapProduct = (backendProduct: any): Product => {
  const categoryName =
    typeof backendProduct.category === "string"
      ? backendProduct.category
      : typeof backendProduct.category === "object" && backendProduct.category !== null
        ? backendProduct.category.name
        : backendProduct.category || "";

  const variantGroups: VariantGroup[] = (backendProduct.variantGroups || []).map((g: any) => ({
    id: String(g._id || g.id || ""),
    name: g.name || "",
    required: g.required ?? false,
    options: (g.options || []).map((o: any) => ({
      id: String(o._id || o.id || ""),
      name: o.label || o.name || "",
      price: o.priceAdjustment ?? o.price ?? 0,
      recipe: (o.recipe || []).map((r: any) => {
        const matId = typeof r.material === "object" && r.material !== null
          ? String(r.material._id || r.material.id || "")
          : String(r.material || r.ingredientId || "");
        const matName = r.name || (typeof r.material === "object" && r.material !== null ? r.material.name : "") || "";
        const matPrice = r.price ?? (typeof r.material === "object" && r.material !== null ? r.material.price : 0) ?? 0;
        return {
          id: String(r._id || r.id || ""),
          material: matId,
          name: matName,
          price: Number(matPrice) || 0,
          quantity: Number(r.quantity ?? r.amount ?? 0),
          unit: r.unit || "pcs",
          ingredientUnit: r.ingredientUnit || r.unit || "pcs",
        };
      }),
    })),
  }));

  const extras: ProductExtra[] = (backendProduct.extras || []).map((e: any) => {
    const isAct = e.isActive ?? e.active ?? true;
    return {
      id: String(e._id || e.id || ""),
      name: e.name || "",
      price: Number(e.price) || 0,
      active: isAct,
      isActive: isAct,
      quantity: e.quantity !== undefined && e.quantity !== null ? Number(e.quantity) : 0,
      unit: e.unit || "ml",
    recipe: (e.recipe || []).map((r: any) => {
      const matId = typeof r.material === "object" && r.material !== null
        ? String(r.material._id || r.material.id || "")
        : String(r.material || r.ingredientId || "");
      const matName = r.name || (typeof r.material === "object" && r.material !== null ? r.material.name : "") || "";
      const matPrice = r.price ?? (typeof r.material === "object" && r.material !== null ? r.material.price : 0) ?? 0;
      return {
        id: String(r._id || r.id || ""),
        material: matId,
        name: matName,
        price: Number(matPrice) || 0,
        quantity: Number(r.quantity ?? r.amount ?? 0),
        unit: r.unit || "pcs",
        ingredientUnit: r.ingredientUnit || r.unit || "pcs",
      };
      }),
    };
  });

  const recipe = (backendProduct.recipe || backendProduct.ingredients || []).map((r: any) => {
    const matId = typeof r.material === "object" && r.material !== null
      ? String(r.material._id || r.material.id || "")
      : String(r.material || r.ingredientId || "");
    const matName = r.name || (typeof r.material === "object" && r.material !== null ? r.material.name : "") || "";
    const matPrice = r.price ?? (typeof r.material === "object" && r.material !== null ? r.material.price : 0) ?? 0;
    return {
      id: String(r._id || r.id || ""),
      material: matId,
      name: matName,
      price: Number(matPrice) || 0,
      quantity: Number(r.quantity ?? r.amount ?? 0),
      unit: r.unit || "pcs",
      ingredientUnit: r.ingredientUnit || r.unit || "pcs",
    };
  });

  const isIngredient = Boolean(
    backendProduct.isIngredient ||
    backendProduct.category?.isIngredient ||
    categoryName.toLowerCase().trim() === "raw ingredients" ||
    categoryName.toLowerCase().trim() === "raw ingredient" ||
    categoryName.toLowerCase().trim() === "ingredients" ||
    categoryName.trim() === "المكونات الخام"
  );

  let extraTargetProductIds: string[] = [];
  if (typeof backendProduct.extraTargetProductIds === "string") {
    try {
      const parsed = JSON.parse(backendProduct.extraTargetProductIds);
      if (Array.isArray(parsed)) {
        extraTargetProductIds = parsed.map(String);
      }
    } catch {
      extraTargetProductIds = [];
    }
  } else if (Array.isArray(backendProduct.extraTargetProductIds)) {
    extraTargetProductIds = backendProduct.extraTargetProductIds.map(String);
  }

  return {
    id: String(backendProduct._id || backendProduct.id || ""),
    name: backendProduct.name,
    description: backendProduct.description || "",
    category: categoryName,
    imageUrl: resolveImageUrl(backendProduct.image || backendProduct.images),
    price: backendProduct.price,
    available: backendProduct.isActive ?? backendProduct.available ?? true,
    isActive: backendProduct.isActive ?? backendProduct.available ?? true,
    extras,
    variantGroups,
    recipe,
    quantity: backendProduct.inventory ?? backendProduct.stockQty ?? 0,
    unit: formatUnit(backendProduct.unit),
    isIngredient,
    isExtra: Boolean(backendProduct.isExtra),
    extraTargetProductIds,
    barcode: backendProduct.barcode || "",
  };
};

export const mapProducts = (backendProducts: any[]): Product[] => {
  return (backendProducts || []).map(mapProduct);
};
