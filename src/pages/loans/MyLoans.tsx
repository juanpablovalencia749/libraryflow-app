import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "@/store";
import { fetchMyLoans, returnBook, loanBook } from "@/store/loansSlice";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "../../components/ui/badge";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import {
  Book as BookIcon,
  Clock,
  RotateCcw,
  Loader2,
  Library,
  CheckCircle,
  Hash,
} from "lucide-react";

export const MyLoans = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { loans, reservations, status } = useSelector(
    (state: RootState) => state.loans,
  );
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);

  const [isReturnDialogOpen, setIsReturnDialogOpen] = useState(false);
  const [isLoanDialogOpen, setIsLoanDialogOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchMyLoans());
    }
  }, [dispatch, isAuthenticated]);

  const onConfirmReturn = async () => {
    if (!selectedId) return;
    setActionLoading(true);
    try {
      await dispatch(returnBook(selectedId)).unwrap();
      dispatch(fetchMyLoans());
      setIsReturnDialogOpen(false);
    } catch (err) {
      console.error("Return failed:", err);
    } finally {
      setActionLoading(false);
    }
  };

  const onConfirmLoan = async () => {
    if (!selectedId) return;
    setActionLoading(true);
    try {
      await dispatch(
        loanBook({ bookId: selectedId, notes: "Loaned from waitlist" }),
      ).unwrap();
      dispatch(fetchMyLoans());
      setIsLoanDialogOpen(false);
    } catch (err) {
      console.error("Loan failed:", err);
    } finally {
      setActionLoading(false);
    }
  };

  const handleReturnClick = (id: number) => {
    setSelectedId(id);
    setIsReturnDialogOpen(true);
  };

  const handleLoanClick = (id: number) => {
    setSelectedId(id);
    setIsLoanDialogOpen(true);
  };

  if (status === "loading" && loans.length === 0) {
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
            <Card
              key={loan.id}
              className="overflow-hidden border-none shadow-md hover:shadow-lg transition-shadow bg-white dark:bg-gray-800/40"
            >
              <CardHeader className="flex flex-row items-start gap-4 p-5">
                <div className="h-20 w-16 bg-muted rounded-md overflow-hidden shrink-0">
                  {loan.book.imageUrl ? (
                    <img
                      src={loan.book.imageUrl}
                      alt={loan.book.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <BookIcon className="h-8 w-8 text-gray-300" />
                    </div>
                  )}
                </div>
                <div className="space-y-1 min-w-0">
                  <CardTitle className="text-lg font-bold line-clamp-1">
                    {loan.book.title}
                  </CardTitle>
                  <p className="text-sm text-muted-foreground truncate">
                    by {loan.book.author}
                  </p>
                  <div className="flex items-center gap-1.5 text-xs text-amber-600 font-medium">
                    <Clock className="h-3 w-3" />
                    Due on {new Date(loan.dueDate).toLocaleDateString()}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="px-5 pb-5">
                <Button
                  variant="outline"
                  className="w-full gap-2 rounded-xl"
                  onClick={() => handleReturnClick(loan.id)}
                >
                  <RotateCcw className="h-4 w-4" />
                  Return Book
                </Button>
              </CardContent>
            </Card>
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
            <Card
              key={res.id}
              className="overflow-hidden border-none bg-amber-50/50 dark:bg-amber-900/10 border-amber-100 dark:border-amber-900/30"
            >
              <CardHeader className="p-5 flex flex-row items-center justify-between">
                <div className="space-y-1">
                  <CardTitle className="text-lg font-bold line-clamp-1">
                    {res.book.title}
                  </CardTitle>
                  <div className="flex items-center gap-2">
                    <Badge
                      variant="outline"
                      className="bg-white dark:bg-gray-950 font-bold gap-1 mt-1"
                    >
                      <Hash className="h-3 w-3" />
                      Turn #{res.queuePosition}
                    </Badge>
                  </div>
                </div>
                <div className="h-12 w-12 rounded-full bg-amber-500 text-white flex items-center justify-center font-black text-xl shadow-sm">
                  {res.queuePosition}
                </div>
              </CardHeader>
              <CardContent className="px-5 pb-5">
                {res.queuePosition === 1 && res.book.status === "AVAILABLE" ? (
                  <div className="space-y-4">
                    <div className="p-3 bg-green-500/10 text-green-700 dark:text-green-400 border border-green-500/20 rounded-lg flex items-center gap-2 text-sm font-medium">
                      <CheckCircle className="h-4 w-4" />
                      Book is ready for you!
                    </div>
                    <Button
                      className="w-full bg-green-600 hover:bg-green-700 text-white gap-2 shadow-sm rounded-xl"
                      onClick={() => handleLoanClick(res.book.id)}
                    >
                      <Library className="h-4 w-4" />
                      Loan Now
                    </Button>
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground italic">
                    You joined on {new Date(res.createdAt).toLocaleDateString()}
                    .
                  </p>
                )}
              </CardContent>
            </Card>
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
