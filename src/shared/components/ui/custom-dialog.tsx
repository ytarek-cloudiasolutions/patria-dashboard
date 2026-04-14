import React, { type ReactNode, createContext, useContext } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

interface CustomDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: ReactNode;
}

interface CustomDialogContentProps {
  children: ReactNode;
  className?: string;
  showCloseButton?: boolean;
}

interface CustomDialogHeaderProps {
  children: ReactNode;
  className?: string;
}

interface CustomDialogTitleProps {
  children: ReactNode;
  className?: string;
}

interface DialogContextType {
  onOpenChange: (open: boolean) => void;
}

const DialogContext = createContext<DialogContextType | undefined>(undefined);

// Main Dialog Component
const CustomDialog = ({ open, onOpenChange, children }: CustomDialogProps) => {
  if (!open) return null;

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onOpenChange(false);
    }
  };

  return (
    <DialogContext.Provider value={{ onOpenChange }}>
      <div
        className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center"
        onClick={handleBackdropClick}
      >
        {children}
      </div>
    </DialogContext.Provider>
  );
};

// Dialog Content Component
const CustomDialogContent = ({
  children,
  className,
  showCloseButton = true,
}: CustomDialogContentProps) => {
  const context = useContext(DialogContext);

  return (
    <div
      className={cn(
        "relative bg-white rounded-xl shadow-lg w-155 p-6",
        className
      )}
      onClick={(e) => e.stopPropagation()}
    >
      {showCloseButton && context && (
        <button
          onClick={() => context.onOpenChange(false)}
          className="absolute top-4 right-4 p-1 hover:bg-gray-100 rounded-lg transition-colors text-gray-600"
        ></button>
      )}
      {children}
    </div>
  );
};

// Dialog Header Component
const CustomDialogHeader = ({
  children,
  className,
}: CustomDialogHeaderProps) => {
  return <div className={cn("mb-6", className)}>{children}</div>;
};

// Dialog Title Component
const CustomDialogTitle = ({ children, className }: CustomDialogTitleProps) => {
  return (
    <h2 className={cn("text-2xl font-bold text-gray-900", className)}>
      {children}
    </h2>
  );
};

export {
  CustomDialog,
  CustomDialogContent,
  CustomDialogHeader,
  CustomDialogTitle,
};
