import { X } from "lucide-react";
import ChevronDown from "@/assets/icons/chevronDown.svg";
import InputField from "@/shared/components/InputField";
import { Label } from "@/shared/components/ui/label";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { useDropzone } from "react-dropzone";
import FileIcon from "@/assets/icons/file.svg";
import { Separator } from "@/shared/components/ui/separator";
import { Checkbox } from "@/shared/components/ui/checkbox";
import { useState, useEffect } from "react";
import { Button } from "@/shared/components/ui/button";
import type { Offer } from "../types";

interface CreateOfferFormProps {
  onCancel?: () => void;
  onSubmit: (offer: Offer) => void;
  editingOffer?: Offer;
}

const products = [
  { id: "meat", label: "Meat", price: 85.2 },
  { id: "chicken", label: "Chicken", price: 85.2 },
  { id: "fish", label: "Fish", price: 85.2 },
  { id: "rice", label: "Rice", price: 85.2 },
  { id: "burger", label: "Burger", price: 85.2 },
];

const CreateOfferForm = ({
  onCancel,
  onSubmit,
  editingOffer,
}: CreateOfferFormProps) => {
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [offerTitle, setOfferTitle] = useState<string>("");
  const [offerDescription, setOfferDescription] = useState<string>("");
  const [offerPercentage, setOfferPercentage] = useState<string>("");
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [discountType, setDiscountType] = useState<"percentage" | "fixed">(
    "percentage"
  );
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (editingOffer) {
      setOfferTitle(editingOffer.offerTitle);
      setOfferDescription(editingOffer.offerDescription);
      setOfferPercentage(editingOffer.offerPercentage.toString());
      setDiscountType(editingOffer.discountType);

      const dateRange = editingOffer.offerValidPeriod.split(" - ");
      if (dateRange.length === 2) {
        const startPart = dateRange[0].trim();
        const endPart = dateRange[1].trim();
        const year = endPart.includes(",")
          ? parseInt(endPart.split(", ")[1])
          : new Date().getFullYear();

        const parseMonthDay = (monthDay: string, year: number) => {
          const [month, day] = monthDay.split(" ");
          const monthIndex = new Date(`${month} 1, 2000`).getMonth() + 1;
          return `${year}-${String(monthIndex).padStart(2, "0")}-${String(
            parseInt(day)
          ).padStart(2, "0")}`;
        };

        setStartDate(parseMonthDay(startPart, year));
        setEndDate(parseMonthDay(endPart.split(", ")[0], year));
      }
    } else {
      resetForm();
    }
  }, [editingOffer]);

  const resetForm = () => {
    setOfferTitle("");
    setOfferDescription("");
    setOfferPercentage("");
    setStartDate("");
    setEndDate("");
    setPreviewUrl("");
    setSelectedProducts([]);
    setDiscountType("percentage");
    setErrors({});
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!offerTitle.trim()) newErrors.offerTitle = "Offer title is required";
    if (!offerDescription.trim())
      newErrors.offerDescription = "Description is required";
    if (!offerPercentage.trim()) {
      newErrors.offerPercentage = "Discount value is required";
    } else if (isNaN(Number(offerPercentage)) || Number(offerPercentage) <= 0) {
      newErrors.offerPercentage = "Enter a valid positive number";
    } else if (discountType === "percentage" && Number(offerPercentage) > 100) {
      newErrors.offerPercentage = "Percentage cannot exceed 100";
    }
    if (!startDate) newErrors.startDate = "Start date is required";
    if (!endDate) {
      newErrors.endDate = "End date is required";
    } else if (startDate && endDate <= startDate) {
      newErrors.endDate = "End date must be after start date";
    }
    if (selectedProducts.length === 0)
      newErrors.selectedProducts = "Select at least one product";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const onDrop = (acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      const reader = new FileReader();
      reader.onloadend = () => setPreviewUrl(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: { "image/*": [".png", ".jpg", ".jpeg"] },
    maxSize: 5 * 1024 * 1024,
    maxFiles: 1,
  });

  const handleRemoveImage = () => setPreviewUrl("");

  const today = new Date().toISOString().split("T")[0];

  const handleSaveOffer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const formatDate = (dateString: string) => {
      const date = new Date(dateString);
      const month = date.toLocaleString("en-US", { month: "short" });
      const day = date.getDate() + 1;
      return `${month} ${day}`;
    };

    const endYear = new Date(endDate).getFullYear();

    const newOffer: Offer = {
      id: editingOffer?.id ?? Date.now(),
      offerStatus: editingOffer?.offerStatus ?? true,
      offerTitle,
      offerDescription,
      offerPercentage: parseFloat(offerPercentage),
      discountType,
      offerValidPeriod: `${formatDate(startDate)} - ${formatDate(
        endDate
      )}, ${endYear}`,
      numberOfProducts: selectedProducts.length,
    };

    onSubmit(newOffer);
    resetForm();
  };

  return (
    <form onSubmit={handleSaveOffer} noValidate>
      <div
        className="grid gap-8 mb-10.5 px-2.5 py-2.5"
        style={{ gridTemplateColumns: "1fr 1.2fr" }}
      >
        {/* Column 1 */}
        <div className="flex flex-col gap-4">
          <div>
            <InputField
              data={{
                id: "offer-title",
                placeholder: "e.g. Summer Sale",
                label: {
                  htmlFor: "offer-title",
                  labelText: "Offer Title",
                },
                required: true,
                inputProps: {
                  type: "text",
                  value: offerTitle,
                  onChange: (e) => {
                    setOfferTitle(e.target.value);
                    if (errors.offerTitle)
                      setErrors((prev) => ({ ...prev, offerTitle: "" }));
                  },
                },
              }}
            />
            {errors.offerTitle && (
              <p className="text-[#C90000] text-[13px] mt-1">
                {errors.offerTitle}
              </p>
            )}
          </div>

          <div>
            <InputField
              data={{
                id: "description",
                placeholder: "Describe this offer...",
                label: {
                  htmlFor: "description",
                  labelText: "Description",
                },
                required: true,
                inputProps: {
                  type: "text",
                  value: offerDescription,
                  onChange: (e) => {
                    setOfferDescription(e.target.value);
                    if (errors.offerDescription)
                      setErrors((prev) => ({ ...prev, offerDescription: "" }));
                  },
                },
              }}
            />
            {errors.offerDescription && (
              <p className="text-[#C90000] text-[13px] mt-1">
                {errors.offerDescription}
              </p>
            )}
          </div>

          {/* Discount row */}
          <div className="flex items-end gap-4">
            <div className="flex flex-col">
              <Label
                htmlFor="discount-type"
                className="text-[#000000] text-[16px] font-medium mb-2.5 block"
              >
                Discount Type<span className="text-[#C90000]">*</span>
              </Label>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    className="font-normal text-[16px] text-[#000000] h-12.5 w-[193.33px] flex justify-between px-3 rounded-[12px] border-[#E5E5E5]"
                  >
                    {discountType === "percentage"
                      ? "Percentage %"
                      : "Fixed amount (EGP)"}
                    <img
                      src={ChevronDown}
                      alt="Chevron Down"
                      className="w-5 h-2.75"
                    />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-[193.33px] px-2 py-2 rounded-[16px]">
                  <DropdownMenuGroup>
                    <DropdownMenuItem
                      onClick={() => setDiscountType("percentage")}
                      className={`cursor-pointer ${
                        discountType === "percentage"
                          ? "bg-primary text-white rounded-[16px]"
                          : ""
                      }`}
                    >
                      Percentage %
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => setDiscountType("fixed")}
                      className={`cursor-pointer ${
                        discountType === "fixed"
                          ? "bg-primary text-white rounded-[16px]"
                          : ""
                      }`}
                    >
                      Fixed amount (EGP)
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <div className="flex-1">
              <InputField
                data={{
                  id: "discount-amount",
                  placeholder:
                    discountType === "percentage" ? "e.g. 20" : "e.g. 50",
                  label: {
                    htmlFor: "discount-amount",
                    labelText: `Discount ${
                      discountType === "percentage" ? "%" : "EGP"
                    }`,
                  },
                  required: true,
                  inputProps: {
                    type: "number",
                    min: "0",
                    max: discountType === "percentage" ? "100" : undefined,
                    value: offerPercentage,
                    onChange: (e) => {
                      setOfferPercentage(e.target.value);
                      if (errors.offerPercentage)
                        setErrors((prev) => ({ ...prev, offerPercentage: "" }));
                    },
                  },
                }}
              />
              {errors.offerPercentage && (
                <p className="text-[#C90000] text-[13px] mt-1">
                  {errors.offerPercentage}
                </p>
              )}
            </div>
          </div>

          {/* Date row */}
          <div className="flex gap-4">
            <div className="flex-1">
              <InputField
                data={{
                  id: "start-date",
                  placeholder: "dd/MM/YYYY",
                  label: {
                    htmlFor: "start-date",
                    labelText: "Start Date",
                  },
                  required: true,
                  inputProps: {
                    type: "date",
                    min: today,
                    value: startDate,
                    onChange: (e) => {
                      setStartDate(e.target.value);
                      if (errors.startDate)
                        setErrors((prev) => ({ ...prev, startDate: "" }));
                    },
                  },
                }}
              />
              {errors.startDate && (
                <p className="text-[#C90000] text-[13px] mt-1">
                  {errors.startDate}
                </p>
              )}
            </div>

            <div className="flex-1">
              <InputField
                data={{
                  id: "end-date",
                  placeholder: "dd/MM/YYYY",
                  label: {
                    htmlFor: "end-date",
                    labelText: "End Date",
                  },
                  required: true,
                  inputProps: {
                    type: "date",
                    min: startDate || today,
                    value: endDate,
                    onChange: (e) => {
                      setEndDate(e.target.value);
                      if (errors.endDate)
                        setErrors((prev) => ({ ...prev, endDate: "" }));
                    },
                  },
                }}
              />
              {errors.endDate && (
                <p className="text-[#C90000] text-[13px] mt-1">
                  {errors.endDate}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Column 2 */}
        <div className="flex flex-col gap-4">
          {/* Banner image */}
          <div>
            <Label className="text-[#000000] text-[16px] font-medium mb-2.5 block">
              Banner image (Optional)
            </Label>
            {!previewUrl ? (
              <Card
                {...getRootProps()}
                className="w-full h-33 p-4 bg-[#F5F0EA4D] border-2 border-primary flex items-center justify-center cursor-pointer"
                style={{ borderStyle: "dashed" }}
              >
                <input {...getInputProps()} id="banner-image" />
                <div className="flex flex-col items-center justify-center gap-2">
                  <img src={FileIcon} alt="upload" className="w-6 h-6" />
                  <p className="font-semibold text-[16px] text-[#333333]">
                    Click to upload image
                  </p>
                  <p className="font-normal text-[14px] text-[#999999]">
                    PNG, JPG up to 5MB
                  </p>
                </div>
              </Card>
            ) : (
              <Card className="w-full h-33 p-4 relative flex items-center justify-center">
                <div className="relative w-full h-full flex items-center justify-center">
                  <img
                    src={previewUrl}
                    alt="preview"
                    className="max-w-full max-h-36 rounded-md object-contain"
                  />
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                  >
                    <X size={16} />
                  </button>
                </div>
              </Card>
            )}
          </div>

          {/* Included Products */}
          <div>
            <Label className="text-[#000000] text-[16px] font-medium mb-2.5 block">
              Included Products<span className="text-[#C90000]">*</span>
            </Label>
            <Card
              className={`w-full bg-[#FAFAF7] flex flex-col border ${
                errors.selectedProducts
                  ? "border-[#C90000]"
                  : "border-[#CACBD4]"
              }`}
            >
              <CardHeader className="space-y-2 shrink-0 pb-2">
                <CardTitle className="font-medium text-[12px] text-[#28293D]">
                  Select products for this offer
                </CardTitle>
                <Separator className="bg-[#CACBD4]" />
              </CardHeader>
              <CardContent className="overflow-y-auto max-h-48">
                <div className="flex flex-col gap-4">
                  {products.map(({ id, label, price }) => (
                    <div className="flex justify-between items-center" key={id}>
                      <div className="flex items-center gap-2">
                        <Checkbox
                          id={id}
                          className="border-primary w-[19.98px] h-[19.98px]"
                          checked={selectedProducts.includes(id)}
                          onCheckedChange={(checked) => {
                            setSelectedProducts((prev) =>
                              checked
                                ? [...prev, id]
                                : prev.filter((p) => p !== id)
                            );
                            if (errors.selectedProducts)
                              setErrors((prev) => ({
                                ...prev,
                                selectedProducts: "",
                              }));
                          }}
                        />
                        <Label
                          htmlFor={id}
                          className="font-normal text-[14px] cursor-pointer"
                        >
                          {label}
                        </Label>
                      </div>
                      <span className="font-medium text-[#28293D]">
                        EGP{" "}
                        <span className="font-semibold text-[#28293D]">
                          {price}
                        </span>
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            {errors.selectedProducts && (
              <p className="text-[#C90000] text-[13px] mt-1">
                {errors.selectedProducts}
              </p>
            )}
          </div>
        </div>
      </div>

      <Separator className="bg-[#CACBD4] mb-6" />
      <div className="flex justify-end gap-4 mb-6">
        <Button
          variant="outline"
          className="px-7.5 py-4 h-14 border-primary text-primary font-semibold rounded-[5px]"
          onClick={onCancel}
          type="button"
        >
          Cancel
        </Button>
        <Button
          className="text-white font-semibold px-7.5 py-4 h-14 rounded-[5px]"
          type="submit"
        >
          {editingOffer ? "Update offer" : "Save offer"}
        </Button>
      </div>
    </form>
  );
};

export default CreateOfferForm;
