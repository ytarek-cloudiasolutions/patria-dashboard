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
        const isReached = isDone || isActive;
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
                  className={`absolute top-[13px] start-1/2 h-0.5 w-full ${
                    isDone ? "bg-primary" : "bg-[#E5E5E5]"
                  }`}
                />
              )}

              {/* Circle */}
              <span
                className={`z-10 flex size-7 items-center justify-center rounded-full text-[12px] font-semibold ${
                  isDone
                    ? "bg-primary text-white ring-4 ring-primary/10"
                    : isActive
                      ? "border-2 border-primary bg-[#F5F0EA] text-primary"
                      : "border-2 border-[#CACBD4] bg-white text-[#8B8B8B]"
                }`}
              >
                {isDone ? (
                  <Check size={14} strokeWidth={2.5} />
                ) : (
                  index + 1
                )}
              </span>

              {/* Label */}
              <span className="mt-2 flex flex-col items-center gap-0.5">
                <span
                  className={`px-1 text-center text-[10px] font-semibold uppercase tracking-wide ${
                    isActive ? "text-[#333333]" : "text-[#8B8B8B]"
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
