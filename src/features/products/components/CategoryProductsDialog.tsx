import { useEffect, useState } from "react";
import { Loader2, FolderOpen } from "lucide-react";
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
import { Button } from "@/shared/components/ui/button";
import { Separator } from "@/shared/components/ui/separator";
import DefaultButton from "@/shared/components/DefaultButton";
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
      <DialogContent className="flex max-h-[85vh] w-[calc(100vw-2rem)] sm:max-w-2xl flex-col overflow-hidden rounded-[16px] bg-white p-6 shadow-xl ring-0 border border-[#CACBD4]">
        <div className="flex flex-1 min-h-0 flex-col gap-6">
          {/* Header */}
          <div className="flex items-center gap-3 shrink-0">
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
            <div className="flex flex-col gap-0.5">
              <DialogTitle className="text-[24px] font-semibold text-black tracking-[0.48px] leading-tight">
                {category.name}
              </DialogTitle>
              <p className="text-[12px] font-normal text-[#8B8B8B] leading-4">
                {products.length} {t("Products")}
              </p>
            </div>
          </div>

          {/* Search bar */}
          <div className="shrink-0">
            <SearchInputField
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder={t("Search recipes...")}
            />
          </div>

          {/* Table Container */}
          <div className="flex-1 min-h-0 overflow-y-auto rounded-[16px] border border-[#E5E5E5]">
            {isLoading ? (
              <div className="flex h-40 items-center justify-center">
                <Loader2 className="size-8 animate-spin text-primary" />
              </div>
            ) : (
              <Table>
                <TableHeader className="sticky top-0 z-10 bg-[#F5F0EA]">
                  <TableRow className="bg-[#F5F0EA] hover:bg-[#F5F0EA] border-none">
                      <TableHead className="ps-6 py-3 text-start text-[13px] font-semibold text-[#28293D] uppercase tracking-[0.26px]">
                        {t("Product")}
                      </TableHead>
                      <TableHead className="px-6 py-3 text-center text-[13px] font-semibold text-[#28293D] uppercase tracking-[0.26px]">
                        {t("Stock")}
                      </TableHead>
                      <TableHead className="px-6 py-3 text-center text-[13px] font-semibold text-[#28293D] uppercase tracking-[0.26px]">
                        {t("Price")}
                      </TableHead>
                      <TableHead className="pe-6 py-3 text-center text-[13px] font-semibold text-[#28293D] uppercase tracking-[0.26px]">
                        {t("Status")}
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {products.map((product) => {
                      const stockQty = product.quantity ?? 0;
                      return (
                        <TableRow key={product.id} className="hover:bg-[#FAFAF8] border-none">
                          {/* Thumbnail & Name */}
                          <TableCell className="ps-6 py-3">
                            <div className="flex items-center gap-3 min-w-0">
                              <img
                                src={product.imageUrl}
                                alt=""
                                className="size-10 shrink-0 rounded-[8px] object-cover"
                              />
                              <span className="truncate text-[14px] font-semibold text-[#333333] tracking-[0.28px]">
                                {product.name}
                              </span>
                            </div>
                          </TableCell>

                          {/* Stock */}
                          <TableCell className="px-6 py-3 whitespace-nowrap text-center">
                            <div className="flex items-center justify-center">
                              {stockQty === 0 ? (
                                <Badge className="h-6 rounded-[30px] border border-[#C90000] bg-[#C90000] px-3 text-[12px] font-semibold text-white shadow-none">
                                  0
                                </Badge>
                              ) : stockQty <= 25 ? (
                                <Badge className="h-6 rounded-[30px] border border-[#C7861E] bg-[#FE9A00]/10 px-3 text-[12px] font-semibold text-[#C7861E] shadow-none">
                                  {stockQty}
                                </Badge>
                              ) : (
                                <Badge className="h-6 rounded-[30px] border border-[#059B5A] bg-[#E2F4ED] px-3 text-[12px] font-semibold text-[#059B5A] shadow-none">
                                  {stockQty}
                                </Badge>
                              )}
                            </div>
                          </TableCell>

                          {/* Price */}
                          <TableCell className="px-6 py-3 whitespace-nowrap text-center">
                            <div className="text-[13px] tracking-[0.26px]" dir="ltr">
                              <span className="font-normal text-black">EGP </span>
                              <span className="font-semibold text-black">{Number(product.price).toFixed(2)}</span>
                            </div>
                          </TableCell>

                          {/* Status */}
                          <TableCell className="pe-6 py-3 whitespace-nowrap text-center">
                            <div className="flex items-center justify-center">
                              <Badge
                                className={`h-6 rounded-[30px] border px-3 text-[12px] font-semibold shadow-none ${
                                  product.available
                                    ? "bg-[#E2F4ED] text-[#059B5A] border-[#059B5A]"
                                    : "bg-[#DCDCDC] text-[#23252A] border-[#595959]"
                                }`}
                              >
                                {product.available ? t("Active") : t("Out of stock")}
                              </Badge>
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })}

                    {products.length === 0 && (
                      <TableRow className="border-none">
                        <TableCell
                          colSpan={4}
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
