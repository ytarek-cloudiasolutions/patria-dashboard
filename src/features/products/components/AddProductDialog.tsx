import React, { useState } from "react";
import { Upload } from "lucide-react";
import { Input } from "@/shared/components/ui/input";
import { Textarea } from "@/shared/components/ui/textarea";
import { Button } from "@/shared/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import {
  CustomDialog,
  CustomDialogContent,
  CustomDialogHeader,
  CustomDialogTitle,
} from "@/shared/components/ui/custom-dialog";

interface AddProductDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (productData: ProductFormData, productIndex?: number) => void;
  editingProduct?: {
    index: number;
    data: {
      image: string | null;
      name: string;
      category: string;
      description: string;
      price: string;
      discountType: string;
      status: "Available" | "Out of Stock";
    };
  };
}

export interface ProductFormData {
  image: File | null;
  productName: string;
  category: string;
  description: string;
  price: string;
  discountType: "Percentage" | "Fixed Amount" | "None";
  discountValue: string;
  status: "Available" | "Out of Stock";
}

const CATEGORIES = ["Breads", "Pastries", "Coffee", "Sandwiches"];
const STATUS_OPTIONS = ["Available", "Out of Stock"];
const DISCOUNT_TYPES = ["None", "Percentage", "Fixed Amount"];

const AddProductDialog: React.FC<AddProductDialogProps> = ({
  isOpen,
  onOpenChange,
  onSave,
  editingProduct,
}) => {
  const [formData, setFormData] = useState<ProductFormData>({
    image: null,
    productName: "",
    category: "",
    description: "",
    price: "",
    discountType: "None",
    discountValue: "",
    status: "Available",
  });

  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const isEditMode = !!editingProduct;

  React.useEffect(() => {
    if (editingProduct) {
      setFormData({
        image: null,
        productName: editingProduct.data.name,
        category: editingProduct.data.category,
        description: editingProduct.data.description,
        price: editingProduct.data.price,
        discountType: editingProduct.data.discountType as
          | "Percentage"
          | "Fixed Amount"
          | "None",
        discountValue: "",
        status: editingProduct.data.status,
      });
      setImagePreview(editingProduct.data.image);
    }
  }, [editingProduct]);

  if (!isOpen) return null;

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData((prev) => ({ ...prev, image: file }));
      const reader = new FileReader();
      reader.onload = (event) => {
        setImagePreview(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    if (
      !formData.productName ||
      !formData.category ||
      !formData.description ||
      !formData.price
    ) {
      alert("Please fill in all required fields");
      return;
    }
    onSave(formData, editingProduct?.index);
    handleClose();
  };

  const handleClose = () => {
    setFormData({
      image: null,
      productName: "",
      category: "",
      description: "",
      price: "",
      discountType: "None",
      discountValue: "",
      status: "Available",
    });
    setImagePreview(null);
    onOpenChange(false);
  };

  // Dynamic discount label
  const discountLabel =
    formData.discountType === "Percentage"
      ? "Discount %"
      : formData.discountType === "Fixed Amount"
      ? "Discount EGP"
      : "Discount";

  return (
    <CustomDialog open={isOpen} onOpenChange={onOpenChange}>
      <CustomDialogContent showCloseButton={false}>
        <CustomDialogHeader>
          <CustomDialogTitle className="font-semibold text-[24px]">
            {isEditMode ? "Edit Product" : "Add New Product"}
          </CustomDialogTitle>
        </CustomDialogHeader>

        <div className="flex flex-col gap-6 mx-[10px]">
          {/* Image Upload Section */}
          <div>
            <div className="flex flex-col justify-center items-center gap-6 self-stretch bg-[#f5f0ea] p-6 rounded-2xl outline-2 outline-dashed outline-[#624f1c]">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
                id="image-upload"
              />
              <label
                htmlFor="image-upload"
                className="flex flex-col items-center gap-2 cursor-pointer w-full"
              >
                {imagePreview ? (
                  <div className="relative">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-24 h-24 object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        setImagePreview(null);
                        setFormData((prev) => ({ ...prev, image: null }));
                      }}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                    >
                      ×
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="w-6 h-6">
                      <Upload size={24} className="text-[#20222f]" />
                    </div>
                    <div className="flex flex-col items-center gap-1">
                      <span className="font-semibold text-[14px] text-[#333333]">
                        Click to upload image
                      </span>
                      <span className="font-normal text-[12px] text-[#8b8b8b]">
                        PNG, JPG up to 5MB
                      </span>
                    </div>
                  </>
                )}
              </label>
            </div>
          </div>

          {/* Product Name and Category */}
          <div className="flex gap-6 self-stretch">
            <div className="flex flex-col gap-2.5 basis-1/2">
              <span className="font-medium text-[16px]">Product Name *</span>
              <Input
                type="text"
                name="productName"
                placeholder="e.g. Artisanal Sourdough"
                value={formData.productName}
                onChange={handleInputChange}
                className="h-12 p-3 rounded-xl border border-solid border-neutral-200 w-full"
              />
            </div>

            <div className="flex flex-col gap-2.5 basis-1/2">
              <span className="font-medium text-[16px]">Category *</span>
              <Select
                value={formData.category}
                onValueChange={(value) => handleSelectChange("category", value)}
              >
                <SelectTrigger className="h-12 px-3 p-5.75 rounded-xl border border-solid border-neutral-200 w-full">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent className="bg-white rounded-2xl border-0 shadow-lg overflow-hidden p-2 w-[var(--radix-select-trigger-width)]">
                  {CATEGORIES.map((category) => (
                    <SelectItem
                      key={category}
                      value={category}
                      className="data-[state=checked]:bg-[#8f6900] data-[state=checked]:text-white rounded-2xl cursor-pointer focus:bg-gray-100 py-2 pl-3 [&_svg]:hidden"
                    >
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Description */}
          <div className="flex flex-col gap-2.5 self-stretch">
            <span className="font-medium text-[16px]">Description *</span>
            <Textarea
              name="description"
              placeholder="Describe this product..."
              value={formData.description}
              onChange={handleInputChange}
              className="min-h-[100px] p-3 rounded-xl border border-solid border-neutral-200 resize-none"
            />
          </div>

          {/* Price and Status */}
          <div className="flex gap-6 self-stretch">
            <div className="flex flex-col gap-2.5 basis-1/2">
              <span className="font-medium text-[16px]">Price *</span>
              <Input
                type="number"
                name="price"
                placeholder="e.g. 85.20"
                value={formData.price}
                onChange={handleInputChange}
                step="0.01"
                className="h-12 p-3 py-5.75 rounded-xl border border-solid border-neutral-200 w-full"
              />
            </div>

            <div className="flex flex-col gap-2.5 basis-1/2">
              <span className="font-medium text-[16px]">Status *</span>
              <Select
                value={formData.status}
                onValueChange={(value) =>
                  handleSelectChange(
                    "status",
                    value as "Available" | "Out of Stock"
                  )
                }
              >
                <SelectTrigger className="h-12 px-3 py-5.75 rounded-xl border border-solid border-neutral-200 w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-white rounded-2xl border-0 shadow-lg overflow-hidden p-2">
                  {STATUS_OPTIONS.map((status) => (
                    <SelectItem
                      key={status}
                      value={status}
                      className="data-[state=checked]:bg-[#8f6900] data-[state=checked]:text-white rounded-2xl cursor-pointer focus:bg-gray-100 py-2 pl-3 [&_svg]:hidden"
                    >
                      {status}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Discount Type and Discount Value */}
          <div className="flex gap-6 self-stretch">
            <div className="flex flex-col gap-2.5 basis-1/2">
              <span className="font-medium text-[16px]">
                Discount Type <span className="text-gray-500">(Optional)</span>
              </span>
              <Select
                value={formData.discountType}
                onValueChange={(value) =>
                  handleSelectChange("discountType", value)
                }
              >
                <SelectTrigger className="h-12 px-3 py-5.75 rounded-xl border border-solid border-neutral-200 w-full">
                  <SelectValue placeholder="Select discount type" />
                </SelectTrigger>
                <SelectContent className="bg-white rounded-2xl border-0 shadow-lg overflow-hidden p-2">
                  {DISCOUNT_TYPES.map((type) => (
                    <SelectItem
                      key={type}
                      value={type}
                      className="data-[state=checked]:bg-[#8f6900] data-[state=checked]:text-white rounded-2xl cursor-pointer focus:bg-gray-100 py-2 pl-3 [&_svg]:hidden"
                    >
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col gap-2.5 basis-1/2">
              <span className="font-medium text-[16px]">{discountLabel}</span>
              <Input
                type="number"
                name="discountValue"
                placeholder="0"
                value={formData.discountValue}
                onChange={handleInputChange}
                disabled={formData.discountType === "None"}
                step={formData.discountType === "Percentage" ? "0.01" : "0.01"}
                className="h-12 p-3 rounded-xl border border-solid border-neutral-200 w-full disabled:bg-gray-100"
              />
            </div>
          </div>
        </div>

        {/* Separator */}
        <div className="h-px bg-gray-200 my-6" />

        {/* Action Buttons */}
        <div className="flex gap-3 justify-end">
          <Button
            onClick={handleClose}
            variant="outline"
            className="px-7.5 py-4 h-14 border-primary text-primary font-semibold rounded-[5px]"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            className="text-white font-semibold px-7.5 py-4 h-14 rounded-[5px]"
          >
            {isEditMode ? "Update Product" : "Save Product"}
          </Button>
        </div>
      </CustomDialogContent>
    </CustomDialog>
  );
};

export default AddProductDialog;
