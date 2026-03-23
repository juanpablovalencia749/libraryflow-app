import { Modal } from "./modal";
import { Button } from "./button";

interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void | Promise<void>;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  variant?: "default" | "destructive" | "warning";
  isLoading?: boolean;
  errorMessage?: string | null;
}

export const ConfirmDialog = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmText = "Confirm",
  cancelText = "Cancel",
  variant = "default",
  isLoading = false,
  errorMessage = null,
}: ConfirmDialogProps) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title}>
      <div className="space-y-4">
        <p className="text-sm text-muted-foreground">{description}</p>
        {errorMessage && (
          <p className="text-sm text-destructive">{errorMessage}</p>
        )}
        <div className="flex justify-end gap-3 pt-4">
          <Button variant="outline" onClick={onClose} disabled={isLoading}>
            {cancelText}
          </Button>
          <Button
            variant={variant === "destructive" ? "destructive" : "default"}
            onClick={onConfirm}
            disabled={isLoading}
            className={
              variant === "warning"
                ? "bg-amber-600 hover:bg-amber-700 text-white"
                : ""
            }
          >
            {isLoading ? "Processing..." : confirmText}
          </Button>
        </div>
      </div>
    </Modal>
  );
};
