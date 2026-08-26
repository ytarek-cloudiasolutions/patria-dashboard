import { Fragment } from "react";
import { Check } from "lucide-react";
import { useTranslation } from "@/shared/i18n/useTranslation";

interface OrderWizardStepperProps {
  steps: string[];
  /** Zero-based index of the active step. */
  current: number;
  /** Navigate when a reached (current or earlier) step is clicked. */
  onStepClick?: (index: number) => void;
}

const OrderWizardStepper = ({
  steps,
  current,
  onStepClick,
}: OrderWizardStepperProps) => {
  const { t } = useTranslation();

  return (
    <div className="flex items-start">
      {steps.map((label, index) => {
        const isDone = index < current;
        const isActive = index === current;
        const isLast = index === steps.length - 1;
        const canNavigate = Boolean(onStepClick) && index <= current;

        return (
          <Fragment key={label}>
            <button
              type="button"
              disabled={!canNavigate}
              onClick={() => canNavigate && onStepClick?.(index)}
              className={`relative flex flex-1 flex-col items-center ${
                canNavigate ? "cursor-pointer" : "cursor-default"
              }`}
            >
              {/* Connector line */}
              {!isLast && (
                <span
                  className={`absolute top-[13px] start-1/2 h-[2px] w-full ${
                    isDone ? "bg-primary" : "bg-[#CACBD4]"
                  }`}
                />
              )}

              {/* Circle */}
              <span
                className={`z-10 flex size-[26px] items-center justify-center rounded-full text-[12px] font-medium transition-colors ${
                  isDone
                    ? "bg-primary text-white"
                    : isActive
                      ? "border-[2.3px] border-primary bg-[#F5F0EA] text-black"
                      : "border-[2.3px] border-[#8B8B8B] bg-[#CACBD4] text-[#8B8B8B]"
                }`}
              >
                {isDone ? (
                  <Check size={14} strokeWidth={2.5} />
                ) : (
                  index + 1
                )}
              </span>

              {/* Label */}
              <span className="mt-3.5 flex flex-col items-center gap-0.5">
                <span
                  className={`px-1 text-center text-[10px] font-semibold uppercase tracking-[0.20px] ${
                    isActive ? "text-black" : "text-[#8B8B8B]"
                  }`}
                >
                  {label}
                </span>
                {isDone && (
                  <span className="text-[8px] font-normal leading-normal tracking-[0.16px] text-[#059B5A]">
                    {t("Completed")}
                  </span>
                )}
              </span>
            </button>
          </Fragment>
        );
      })}
    </div>
  );
};

export default OrderWizardStepper;
