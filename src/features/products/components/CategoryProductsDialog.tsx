import { useEffect, useState } from "react";
import { Loader2, SquarePen, FolderOpen } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/components/ui/table";
import { Badge } from "@/shared/components/ui/badge";
import { api } from "@/config/api";
import SearchInputField from "@/shared/components/SearchInputField";
import { useTranslation } from "@/shared/i18n/useTranslation";
import { formatEgp } from "../utils";
import type { Category, Product } from "../types";

interface CategoryProductsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  category: Category | null;
  onEditProduct: (product: Product) => void;
}

const CategoryProductsDialog = ({
  open,
  onOpenChange,
  category,
  onEditProduct,
}: CategoryProductsDialogProps) => {
  const { t } = useTranslation();
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (!open || !category) {
      setProducts([]);
      setSearchQuery("");
      return;
    }

    const fetchProducts = async () => {
      setIsLoading(true);
      try {
        const res = await api.get("/products", {
          params: {
            category: category.id,
            search: searchQuery.trim() || undefined,
            limit: 100, // retrieve all/most products for simple modal listing
          },
        });

        const rawProducts = res.data?.products || res.data?.data || [];
        const mapped: Product[] = rawProducts.map((p: any) => ({
          id: p._id || p.id,
          name: p.name,
          description: p.description || "",
          category: p.category?.name || p.category || "",
          imageUrl: p.images?.[0] || p.imageUrl || "https://images.unsplash.com/photo-1561047029-3000c68339ca?w=600",
          price: p.price || 0,
          discount: p.discount,
          available: p.isActive !== undefined ? p.isActive : true,
          quantity: p.stockQty !== undefined ? p.stockQty : 0,
        }));
        setProducts(mapped);
      } catch (err) {
        console.error("Failed to load products for category:", err);
      } finally {
        setIsLoading(false);
      }
    };

    const delayDebounce = setTimeout(() => {
      fetchProducts();
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [open, category, searchQuery]);

  if (!category) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[calc(100vh-4rem)] w-[calc(100vw-2rem)] sm:max-w-2xl overflow-hidden rounded-[12px] bg-white p-0 shadow-lg ring-0">
        <div className="flex max-h-[calc(100vh-4rem)] flex-col">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-[#E5E5E5] px-6 py-4.5">
            <div className="flex items-center gap-3">
              {category.imageUrl ? (
                <img
                  src={category.imageUrl}
                  alt=""
                  className="size-10 rounded-[8px] object-cover"
                />
              ) : (
                <div className="flex size-10 items-center justify-center rounded-[8px] bg-primary/10 text-primary">
                  <FolderOpen className="size-5" />
                </div>
              )}
              <div>
                <DialogTitle className="text-[17px] font-semibold text-[#28293D] sm:text-[19px]">
                  {category.name}
                </DialogTitle>
                <p className="mt-0.5 text-[12px] text-[#8B8B8B]">
                  {products.length} {t("products")}
                </p>
              </div>
            </div>
          </div>

          {/* Search bar */}
          <div className="px-6 pt-4.5">
            <SearchInputField
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder={t("Search products...")}
            />
          </div>

          {/* Products list */}
          <div className="flex-1 overflow-y-auto px-6 py-4.5">
            {isLoading ? (
              <div className="flex h-40 items-center justify-center">
                <Loader2 className="size-8 animate-spin text-primary" />
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="ps-6 py-4 text-start">
                      {t("Product")}
                    </TableHead>
                    <TableHead className="px-6 py-4 text-start">
                      {t("Price")}
                    </TableHead>
                    <TableHead className="px-6 py-4 text-center">
                      {t("Stock")}
                    </TableHead>
                    <TableHead className="px-6 py-4 text-center">
                      {t("Status")}
                    </TableHead>
                    <TableHead className="pe-6 py-4 text-end w-[80px]">
                      {t("Edit")}
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {products.map((product) => (
                    <TableRow key={product.id} className="hover:bg-[#FAFAF8]">
                      {/* Thumbnail & Name */}
                      <TableCell className="ps-6 py-4">
                        <div className="flex items-center gap-3 min-w-0">
                          <img
                            src={product.imageUrl}
                            alt=""
                            className="size-12 shrink-0 rounded-[10px] object-cover"
                          />
                          <span className="truncate text-[14px] font-semibold text-[#28293D]">
                            {product.name}
                          </span>
                        </div>
                      </TableCell>

                      {/* Price */}
                      <TableCell className="px-6 py-4 whitespace-nowrap">
                        <span className="text-[14px] font-semibold text-[#28293D]" dir="ltr">
                          {formatEgp(product.price)}
                        </span>
                      </TableCell>

                      {/* Stock */}
                      <TableCell className="px-6 py-4 whitespace-nowrap text-center">
                        <div className="flex items-center justify-center">
                          {product.quantity === 0 ? (
                            <span className="flex size-6 items-center justify-center rounded-full bg-[#FFF0F0] text-[12px] font-bold text-[#D90000]">
                              0
                            </span>
                          ) : (
                            <span className="flex h-6 min-w-6 items-center justify-center rounded-full bg-[#EFEDE8] px-1.5 text-[12px] font-semibold text-[#7A6A4F]">
                              {product.quantity}
                            </span>
                          )}
                        </div>
                      </TableCell>

                      {/* Status */}
                      <TableCell className="px-6 py-4 whitespace-nowrap text-center">
                        <div className="flex items-center justify-center">
                          <Badge
                            className={`h-6 rounded-full border px-3 py-0 text-[12px] font-semibold ${
                              product.available
                                ? "bg-[#E2F4ED] text-[#059B5A] border-[#059B5A]"
                                : "bg-[#DCDCDC] text-[#23252A] border-[#595959]"
                            }`}
                          >
                            {product.available ? t("Active") : t("Inactive")}
                          </Badge>
                        </div>
                      </TableCell>

                      {/* Actions */}
                      <TableCell className="pe-6 py-4 whitespace-nowrap text-end">
                        <button
                          type="button"
                          onClick={() => onEditProduct(product)}
                          className="cursor-pointer text-[#000000] hover:text-primary transition-colors"
                        >
                          <SquarePen className="size-4.5" />
                        </button>
                      </TableCell>
                    </TableRow>
                  ))}

                  {products.length === 0 && (
                    <TableRow>
                      <TableCell
                        colSpan={5}
                        className="py-12 text-center text-[13.5px] text-[#8B8B8B]"
                      >
                        {t("No products found.")}
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CategoryProductsDialog;
