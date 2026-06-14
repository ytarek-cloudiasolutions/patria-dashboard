import { Fragment } from "react";

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
}: OrderWizardStepperProps) => (
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
            {!isLast && (
              <span
                className={`absolute top-[13px] start-1/2 h-0.5 w-full ${
                  isDone ? "bg-primary" : "bg-[#E5E5E5]"
                }`}
              />
            )}
            <span
              className={`z-10 flex size-7 items-center justify-center rounded-full border-2 text-[12px] font-semibold ${
                isReached
                  ? "border-primary bg-primary text-white"
                  : "border-[#CACBD4] bg-white text-[#8B8B8B]"
              }`}
            >
              {index + 1}
            </span>
            <span
              className={`mt-2 px-1 text-center text-[10px] font-semibold uppercase tracking-wide ${
                isActive ? "text-[#333333]" : "text-[#8B8B8B]"
              }`}
            >
              {label}
            </span>
          </button>
        </Fragment>
      );
    })}
  </div>
);

export default OrderWizardStepper;
