import { useState } from "react";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { useBookActions } from "@/hooks/useBookActions";

interface BookActionModalProps {
  isOpen: boolean;
  onClose: () => void;
  bookId: number;
  bookTitle: string;
  isAvailable: boolean;
  onActionSuccess?: () => void;
}

export const BookActionModal = ({
  isOpen,
  onClose,
  bookId,
  bookTitle,
  isAvailable,
  onActionSuccess
}: BookActionModalProps) => {
  const [notes, setNotes] = useState("");
  const { performAction, actionStatus, queuePosition, resetStatus } = useBookActions();

  const handleAction = async (e: React.FormEvent) => {
    e.preventDefault();
    await performAction(bookId, {
      isLoan: isAvailable,
      notes,
      onSuccess: () => {
        if (onActionSuccess) onActionSuccess();
        setTimeout(() => {
          onClose();
          resetStatus();
          setNotes("");
        }, isAvailable ? 1500 : 3000);
      }
    });
  };

  const isLoading = actionStatus === "loading";
  const isSuccess = actionStatus === "success";

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => {
        if (!isLoading) {
          onClose();
          resetStatus();
        }
      }}
      title={isAvailable ? "Confirm Loan" : "Join Waitlist"}
      description={`Confirming request for "${bookTitle}"`}
    >
      <form onSubmit={handleAction} className="space-y-6">
        {isSuccess && (
          <div className="p-4 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-800 rounded-xl flex items-center gap-3 animate-in zoom-in-95">
            <CheckCircle2 className="h-5 w-5 shrink-0" />
            <div className="text-sm">
              <p className="font-bold">Request Success!</p>
              {queuePosition !== null ? (
                <p>Waitlist Position: <span className="font-black text-lg">#{queuePosition}</span></p>
              ) : (
                <p>Book loaned successfully.</p>
              )}
            </div>
          </div>
        )}

        {actionStatus === "error" && (
          <div className="p-4 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-800 rounded-xl flex items-center gap-3 animate-in shake-x">
            <AlertCircle className="h-5 w-5 shrink-0" />
            <p className="text-sm font-medium">Something went wrong. Please try again.</p>
          </div>
        )}
        
        <div className="space-y-3">
          <Label htmlFor="notes" className="text-base font-semibold">Additional Notes</Label>
          <Input
            id="notes"
            placeholder="Any comments for the librarian?"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="h-12 rounded-xl"
            disabled={isLoading || isSuccess}
          />
        </div>

        <div className="pt-2 flex justify-end gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={isLoading}
            className="rounded-xl h-11 px-6 font-semibold"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={isLoading || isSuccess}
            className="rounded-xl h-11 px-8 min-w-[140px] font-bold"
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : isAvailable ? (
              "Confirm Loan"
            ) : (
              "Join Waitlist"
            )}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
