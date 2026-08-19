import { useEffect, useRef, useState } from "react";
import { Camera, Loader2, ScanBarcode } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { useTranslation } from "@/shared/i18n/useTranslation";
import { cn } from "@/lib/utils";
import { productsApi } from "../api/productsApi";
import { mapProduct } from "../utils/productMappers";
import type { Product } from "../types";
import { showErrorToast, showSuccessToast } from "@/shared/utils/toast";

type ScanMode = "manual" | "camera";

interface ScanProductDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSearch?: (barcode: string, product?: Product) => void;
  onProductFound?: (product: Product) => void;
}

const ScanProductDialog = ({
  open,
  onOpenChange,
  onSearch,
  onProductFound,
}: ScanProductDialogProps) => {
  const { t } = useTranslation();
  const [mode, setMode] = useState<ScanMode>("manual");
  const [barcode, setBarcode] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const controlsRef = useRef<{ stop: () => void } | null>(null);
  const scanLockRef = useRef(false);

  useEffect(() => {
    if (open) {
      setMode("manual");
      setBarcode("");
      setError(null);
      setCameraError(null);
      setIsSearching(false);
    }
  }, [open]);

  const runSearch = async (code: string) => {
    const trimmedCode = code.trim();
    if (!trimmedCode || scanLockRef.current) return;

    scanLockRef.current = true;
    setIsSearching(true);
    setError(null);

    try {
      const res = await productsApi.scanProductByBarcode(trimmedCode);
      const rawProduct = res?.data?.product || res?.product || res?.data || res;
      if (rawProduct && (rawProduct.id || rawProduct._id || rawProduct.name)) {
        const product = mapProduct(rawProduct);
        showSuccessToast(`${t("Product found")}: ${product.name}`);
        if (onProductFound) {
          onProductFound(product);
        }
        if (onSearch) {
          onSearch(trimmedCode, product);
        }
        onOpenChange(false);
      } else {
        const msg = t("No product matches this barcode/SKU");
        setError(msg);
        showErrorToast(msg);
      }
    } catch (err: any) {
      const msg =
        err?.response?.data?.message ||
        (err?.response?.status === 404
          ? t("No product matches this barcode/SKU")
          : t("Failed to scan barcode"));
      setError(msg);
      showErrorToast(msg);
    } finally {
      setIsSearching(false);
      scanLockRef.current = false;
    }
  };

  const handleSearch = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    runSearch(barcode);
  };

  // Live camera barcode scanning — decodes continuously from the video
  // stream via zxing and fires the same lookup as manual entry the moment
  // a code is recognized.
  useEffect(() => {
    if (!open || mode !== "camera") {
      controlsRef.current?.stop();
      controlsRef.current = null;
      return;
    }

    let cancelled = false;
    setCameraError(null);

    import("@zxing/browser")
      .then(({ BrowserMultiFormatReader }) => {
        if (cancelled || !videoRef.current) return;
        const reader = new BrowserMultiFormatReader();
        return reader.decodeFromConstraints(
          { video: { facingMode: "environment" } },
          videoRef.current,
          (result) => {
            if (result && !scanLockRef.current) {
              runSearch(result.getText());
            }
          },
        );
      })
      .then((controls) => {
        if (cancelled || !controls) {
          controls?.stop();
          return;
        }
        controlsRef.current = controls;
      })
      .catch((err: any) => {
        if (cancelled) return;
        setCameraError(
          err?.name === "NotAllowedError"
            ? t("Camera access was denied")
            : t("No camera available on this device"),
        );
      });

    return () => {
      cancelled = true;
      controlsRef.current?.stop();
      controlsRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, mode]);

  const tabClass = (active: boolean) =>
    cn(
      "flex h-11 flex-1 cursor-pointer items-center justify-center gap-2 border-b-2 text-[13px] font-semibold transition-colors",
      active
        ? "border-primary text-[#333333]"
        : "border-[#E5E5E5] font-medium text-[#8B8B8B]",
    );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={true}
        className="w-[calc(100vw-2rem)] max-w-[calc(100vw-2rem)] overflow-hidden rounded-[16px] bg-white p-6 ring-0 sm:max-w-110"
      >
        <DialogTitle className="text-[20px] font-bold text-[#28293D]">
          {t("Scan Barcode")}
        </DialogTitle>

        <div className="mt-2 flex">
          <button
            type="button"
            className={tabClass(mode === "manual")}
            onClick={() => {
              setMode("manual");
              setError(null);
            }}
          >
            <ScanBarcode className="size-4.5" />
            {t("Scan Barcode/Enter manually")}
          </button>
          <button
            type="button"
            className={tabClass(mode === "camera")}
            onClick={() => {
              setMode("camera");
              setError(null);
            }}
          >
            <Camera className="size-4.5" />
            {t("Use camera")}
          </button>
        </div>

        {mode === "manual" ? (
          <form onSubmit={handleSearch} className="mt-5 flex flex-col gap-2">
            <div className="flex flex-col gap-3 sm:flex-row">
              <Input
                value={barcode}
                onChange={(e) => {
                  setBarcode(e.target.value);
                  if (error) setError(null);
                }}
                placeholder={t("Enter barcode")}
                disabled={isSearching}
                autoFocus
                className="h-12 flex-1 rounded-[8px] border-[#E5E5E5] px-4 text-[14px] focus-visible:border-primary focus-visible:ring-0"
              />
              <Button
                type="submit"
                disabled={!barcode.trim() || isSearching}
                className="h-12 rounded-[8px] px-8 text-sm font-semibold text-white disabled:opacity-50"
              >
                {isSearching ? (
                  <Loader2 className="size-5 animate-spin" />
                ) : (
                  t("Search")
                )}
              </Button>
            </div>
            {error && (
              <p className="px-1 text-xs font-medium text-red-500">{error}</p>
            )}
          </form>
        ) : (
          <div className="mt-5 flex flex-col gap-2">
            <div className="relative flex h-56 items-center justify-center overflow-hidden rounded-[12px] border border-[#E5E5E5] bg-black">
              {cameraError ? (
                <div
                  className="flex h-full w-full items-center justify-center px-6 text-center"
                  style={{
                    backgroundColor: "#F3F3F3",
                    backgroundImage:
                      "linear-gradient(45deg, #E5E5E5 25%, transparent 25%, transparent 75%, #E5E5E5 75%), linear-gradient(45deg, #E5E5E5 25%, transparent 25%, transparent 75%, #E5E5E5 75%)",
                    backgroundSize: "22px 22px",
                    backgroundPosition: "0 0, 11px 11px",
                  }}
                >
                  <p className="text-xs font-medium text-red-500">{cameraError}</p>
                </div>
              ) : (
                <>
                  {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
                  <video
                    ref={videoRef}
                    muted
                    playsInline
                    className="h-full w-full object-cover"
                  />
                  <div className="pointer-events-none absolute flex size-32 items-center justify-center rounded-[12px] border-2 border-white shadow-[0_0_0_2000px_rgba(0,0,0,0.25)]">
                    {isSearching && <Loader2 className="size-8 animate-spin text-white" />}
                  </div>
                </>
              )}
            </div>
            {error && (
              <p className="px-1 text-xs font-medium text-red-500">{error}</p>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ScanProductDialog;

