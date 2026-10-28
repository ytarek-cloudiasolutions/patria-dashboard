import type { Category, GetCategoryResponseItem } from "../store/categoryTypes";
import { ENV } from "@/config/env";
import patriaLogo from "@/assets/images/svgs/patria-logo.svg";

export const DEFAULT_CATEGORY_IMAGE = patriaLogo;

const SERVER_ROOT = (ENV.API_URL || "").replace(/\/api\/?$/, "");

export const resolveCategoryImageUrl = (path?: string): string => {
  if (!path || !path.trim()) return DEFAULT_CATEGORY_IMAGE;
  const p = path.trim();
  if (p.startsWith("http://") || p.startsWith("https://") || p.startsWith("data:")) {
    return p;
  }
  const filename = p.replace(/^(\/api\/uploads\/|uploads\/|\/)/, "");
  return `${SERVER_ROOT}/api/uploads/${filename}`;
};

export const mapCategory = (backendCat: any): Category => {
  const rawImage = backendCat.image || backendCat.imageUrl || "";
  const resolvedImage = rawImage ? resolveCategoryImageUrl(rawImage) : DEFAULT_CATEGORY_IMAGE;

  return {
    id: backendCat._id || backendCat.id,
    name: backendCat.name,
    nameAr: backendCat.nameAr || backendCat.name_ar || "",
    image: resolvedImage,
    imageUrl: resolvedImage,
    itemCount: backendCat.productsCount ?? backendCat.itemCount ?? 0,
    active: backendCat.isActive ?? backendCat.active ?? true,
    kitchenType: backendCat.kitchenType ?? null,
  };
};

export const mapCategories = (backendCats: any[]): Category[] => {
  return (backendCats || []).map(mapCategory);
};
