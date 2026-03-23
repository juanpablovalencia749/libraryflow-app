import { useState } from "react";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { Clock, Loader2, Library } from "lucide-react";

// Hooks & Components
import { useMyLoans } from "@/hooks/useMyLoans";
import { useBookActions } from "@/hooks/useBookActions";
import { LoanCard } from "@/components/loans/LoanCard";
import { ReservationCard } from "@/components/loans/ReservationCard";

export const MyLoans = () => {
  const { loans, reservations, isLoading, refresh } = useMyLoans();
  const { handleReturn, performAction } = useBookActions();

  const [isReturnDialogOpen, setIsReturnDialogOpen] = useState(false);
  const [isLoanDialogOpen, setIsLoanDialogOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  const onConfirmReturn = async () => {
    if (!selectedId) return;
    setActionLoading(true);
    const result = await handleReturn(selectedId);
    if (result.success) {
      refresh();
      setIsReturnDialogOpen(false);
    }
    setActionLoading(false);
  };

  const onConfirmLoan = async () => {
    if (!selectedId) return;
    setActionLoading(true);
    const result = await performAction(selectedId, {
      isLoan: true,
      notes: "Loaned from waitlist",
    });
    if (result.success) {
      refresh();
      setIsLoanDialogOpen(false);
    }
    setActionLoading(false);
  };

  const handleReturnClick = (id: number) => {
    setSelectedId(id);
    setIsReturnDialogOpen(true);
  };

  const handleLoanClick = (id: number) => {
    setSelectedId(id);
    setIsLoanDialogOpen(true);
  };

  if (isLoading && loans.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-muted-foreground">
          Fetching your library activity...
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-12 animate-in fade-in duration-500">
      <div className="space-y-1">
        <h1 className="text-4xl font-extrabold tracking-tight">
          My Library Flow
        </h1>
        <p className="text-muted-foreground text-lg">
          Manage your active loans and waitlist positions.
        </p>
      </div>

      {/* Active Loans Section */}
      <section className="space-y-6">
        <div className="flex items-center gap-2 border-l-4 border-primary pl-4">
          <Library className="h-6 w-6 text-primary" />
          <h2 className="text-2xl font-bold">Active Loans</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loans.map((loan) => (
            <LoanCard key={loan.id} loan={loan} onReturn={handleReturnClick} />
          ))}

          {loans.length === 0 && (
            <div className="col-span-full py-16 text-center bg-gray-50 dark:bg-gray-900/40 rounded-2xl border-2 border-dashed border-gray-200 dark:border-gray-800">
              <p className="text-muted-foreground italic">
                You don't have any active loans at the moment.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Reservations / Waitlist Section */}
      <section className="space-y-6">
        <div className="flex items-center gap-2 border-l-4 border-amber-500 pl-4">
          <Clock className="h-6 w-6 text-amber-500" />
          <h2 className="text-2xl font-bold">Waitlist Reservations</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reservations.map((res) => (
            <ReservationCard
              key={res.id}
              reservation={res}
              onLoan={handleLoanClick}
            />
          ))}

          {reservations.length === 0 && (
            <div className="col-span-full py-16 text-center bg-gray-50 dark:bg-gray-900/40 rounded-2xl border-2 border-dashed border-gray-200 dark:border-gray-800">
              <p className="text-muted-foreground italic">
                No active reservations in your waitlist.
              </p>
            </div>
          )}
        </div>
      </section>

      <ConfirmDialog
        isOpen={isReturnDialogOpen}
        onClose={() => setIsReturnDialogOpen(false)}
        onConfirm={onConfirmReturn}
        title="Return Book"
        description="Are you sure you want to return this book to the library?"
        confirmText="Return Now"
        variant="warning"
        isLoading={actionLoading}
      />

      <ConfirmDialog
        isOpen={isLoanDialogOpen}
        onClose={() => setIsLoanDialogOpen(false)}
        onConfirm={onConfirmLoan}
        title="Confirm Loan"
        description="You are next in line! Do you want to loan this book now?"
        confirmText="Loan Now"
        isLoading={actionLoading}
      />
    </div>
  );
};
