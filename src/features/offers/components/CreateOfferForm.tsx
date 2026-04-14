import { X } from "lucide-react";
import ChevronDown from "@/assets/icons/chevronDown.svg";
import {
  CustomDialog,
  CustomDialogContent,
  CustomDialogHeader,
  CustomDialogTitle,
} from "@/shared/components/ui/custom-dialog";
import { Label } from "@/shared/components/ui/label";
import { Input } from "@/shared/components/ui/input";
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
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSaveOffer: (offer: Offer) => void;
  editingOffer?: Offer;
}

const CreateOfferForm = ({
  isOpen,
  onOpenChange,
  onSaveOffer,
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

  // Initialize form with editing offer data when modal opens
  useEffect(() => {
    const initializeForm = async () => {
      if (isOpen && editingOffer) {
        setOfferTitle(editingOffer.offerTitle);
        setOfferDescription(editingOffer.offerDescription);
        setOfferPercentage(editingOffer.offerPercentage.toString());
        setDiscountType(editingOffer.discountType);

        // Parse dates from format "Apr 7 - Apr 29, 2026"
        const dateRange = editingOffer.offerValidPeriod.split(" - ");
        if (dateRange.length === 2) {
          const startPart = dateRange[0].trim();
          const endPart = dateRange[1].trim();

          // Parse current year from end date
          const currentYear = new Date().getFullYear();
          const year = endPart.includes(",")
            ? parseInt(endPart.split(", ")[1])
            : currentYear;

          // Convert "Apr 7" to date string for input
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
      }
    };
    initializeForm();
  }, [isOpen, editingOffer]);

  const products = [
    { label: "Meat", price: 85.2 },
    { label: "Chicken", price: 85.2 },
    { label: "Fish", price: 85.2 },
    { label: "Rice", price: 85.2 },
    { label: "Burger", price: 85.2 },
  ];

  const onDrop = (acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".png", ".jpg", ".jpeg"],
    },
    maxSize: 5 * 1024 * 1024, // 5MB
    maxFiles: 1,
  });

  const handleRemoveImage = () => {
    setPreviewUrl("");
  };

  const handleSaveOffer = (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !offerTitle ||
      !offerDescription ||
      !offerPercentage ||
      !startDate ||
      !endDate
    ) {
      alert("Please fill in all required fields");
      return;
    }

    if (selectedProducts.length === 0) {
      alert("Please select at least one product");
      return;
    }

    // Format dates from YYYY-MM-DD to "Mar 7 - Mar 8, 2026"
    const formatDate = (dateString: string) => {
      const date = new Date(dateString);
      const month = date.toLocaleString("en-US", { month: "short" });
      const day = date.getDate();
      return `${month} ${day}`;
    };

    const startFormatted = formatDate(startDate);
    const endDate_obj = new Date(endDate);
    const endYear = endDate_obj.getFullYear();
    const endFormatted = formatDate(endDate);

    const newOffer: Offer = {
      id: editingOffer?.id ?? Math.max(0, ...selectedProducts.map(() => 0)) + 1,
      offerStatus: editingOffer?.offerStatus ?? true,
      offerTitle,
      offerDescription,
      offerPercentage: parseInt(offerPercentage),
      discountType,
      offerValidPeriod: `${startFormatted} - ${endFormatted}, ${endYear}`,
      numberOfProducts:
        editingOffer?.numberOfProducts ?? selectedProducts.length,
    };

    onSaveOffer(newOffer);

    // Reset form
    setOfferTitle("");
    setOfferDescription("");
    setOfferPercentage("");
    setStartDate("");
    setEndDate("");
    setPreviewUrl("");
    setSelectedProducts([]);
  };

  return (
    <CustomDialog open={isOpen} onOpenChange={onOpenChange}>
      <CustomDialogContent className=" w-246.5">
        <CustomDialogHeader>
          <CustomDialogTitle className="font-semibold text-[24px] text-[#333333]">
            {editingOffer ? "Edit Offer" : "Create New Offer"}
          </CustomDialogTitle>
        </CustomDialogHeader>
        <form onSubmit={handleSaveOffer}>
          <div
            className="grid mb-10.5"
            style={{ gridTemplateColumns: "2fr 1fr" }}
          >
            {/* Column 1 */}
            <div className="flex flex-col gap-4">
              <div>
                <Label
                  htmlFor="product-name"
                  className="label-base mb-2.5"
                  aria-required
                >
                  Product Name<span className="text-[#C90000]">*</span>
                </Label>
                <Input
                  id="product-name"
                  type="text"
                  placeholder="e.g. Artisanal Sourdough"
                  value={offerTitle}
                  onChange={(e) => setOfferTitle(e.target.value)}
                  className="input-field input-base w-[402.66px]"
                />
              </div>

              <div>
                <Label
                  htmlFor="description"
                  className="label-base mb-2.5"
                  aria-required
                >
                  Description<span className="text-[#C90000]">*</span>
                </Label>
                <Input
                  id="description"
                  type="text"
                  placeholder="Describe this offer..."
                  value={offerDescription}
                  onChange={(e) => setOfferDescription(e.target.value)}
                  className="input-field input-base w-[402.66px]"
                />
              </div>
              <div className="flex gap-4">
                <div>
                  <Label
                    htmlFor="discount-type"
                    className="label-base mb-2.5"
                    aria-required
                  >
                    Discount Type<span className="text-[#C90000]">*</span>
                  </Label>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="outline"
                        className="font-normal text-[16px] text-[#000000] h-12.5 w-[193.33px] flex justify-between px-3"
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
                <div>
                  <Label
                    htmlFor="discount-amount"
                    className="label-base mb-2.5"
                    aria-required
                  >
                    Discount {discountType === "percentage" ? "%" : "EGP"}
                  </Label>
                  <Input
                    id="discount-amount"
                    type="text"
                    placeholder={
                      discountType === "percentage" ? "e.g. 20" : "e.g. 50"
                    }
                    value={offerPercentage}
                    onChange={(e) => setOfferPercentage(e.target.value)}
                    className="input-field input-base w-[193.33px]"
                  />
                </div>
              </div>
              <div className="flex gap-4">
                <div>
                  <Label
                    htmlFor="start-date"
                    className="label-base mb-2.5"
                    aria-required
                  >
                    Start Date<span className="text-[#C90000]">*</span>
                  </Label>
                  <div className="relative">
                    <Input
                      id="start-date"
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      placeholder="dd/MM/YYYY"
                      className="input-field input-base w-[193.33px] pr-10"
                    />
                  </div>
                </div>
                <div>
                  <Label
                    htmlFor="end-date"
                    className="label-base mb-2.5"
                    aria-required
                  >
                    End Date<span className="text-[#C90000]">*</span>
                  </Label>
                  <div className="relative">
                    <Input
                      id="end-date"
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      placeholder="dd/MM/YYYY"
                      className="input-field input-base w-[193.33px] pr-10"
                    />
                  </div>
                </div>
              </div>
            </div>
            {/* Column 2 */}
            <div className="flex flex-col gap-4">
              <div>
                <Label htmlFor="banner-image" className="label-base mb-2.5">
                  Banner image (Optional)
                </Label>
                {!previewUrl ? (
                  <Card
                    {...getRootProps()}
                    className={
                      "w-[483.34px] h-33 p-4 bg-[#F5F0EA4D] border-2 border-primary flex items-center justify-center"
                    }
                    style={{
                      borderStyle: "dashed",
                      borderSpacing: "6px 4px",
                    }}
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
                  <Card className="w-[483.34px] h-33 p-4 relative flex items-center justify-center">
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
              <div>
                <Label htmlFor="banner-image" className="label-base mb-2.5">
                  Included Products<span className="text-[#C90000]">*</span>
                </Label>
                <Card className="w-[483.34px] h-50 bg-[#FAFAF7] border border-[#CACBD4] flex flex-col">
                  <CardHeader className="space-y-2 shrink-0">
                    <CardTitle className="font-medium text-[12px] text-[#28293D]">
                      Select products for this offer
                    </CardTitle>
                    <Separator className="bg-[#CACBD4]" />
                  </CardHeader>
                  <CardContent className="flex-1 overflow-y-auto">
                    <div className="flex flex-col gap-4">
                      {products.map(({ label, price }) => (
                        <div className="flex justify-between" key={label}>
                          <div className="flex items-center gap-2">
                            <Checkbox
                              id={label}
                              className="border-primary w-[19.98px] h-[19.98px]"
                              checked={selectedProducts.includes(label)}
                              onCheckedChange={(checked) => {
                                if (checked) {
                                  setSelectedProducts([
                                    ...selectedProducts,
                                    label,
                                  ]);
                                } else {
                                  setSelectedProducts(
                                    selectedProducts.filter((p) => p !== label)
                                  );
                                }
                              }}
                            />
                            <Label
                              htmlFor={label}
                              className="font-normal text-[14px]"
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
              </div>
            </div>
          </div>
          <Separator className="bg-[#CACBD4] mb-6" />
          <div className="flex justify-between">
            <div></div>
            <div className="flex gap-4 mb-6">
              <Button
                variant="outline"
                className="px-7.5 py-4 h-14 border-primary text-primary font-semibold rounded-[5px]"
                onClick={() => onOpenChange(false)}
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
          </div>
        </form>
      </CustomDialogContent>
    </CustomDialog>
  );
};

export default CreateOfferForm;
