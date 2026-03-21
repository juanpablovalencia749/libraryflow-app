import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "@/store";
import { fetchBooks } from "@/store/booksSlice";
import type { Book } from "@/store/booksSlice";
import { reserveBook, loanBook } from "@/store/loansSlice";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Search, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { BookCard } from "@/components/books/BookCard";

export const BooksList = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { books, status, error } = useSelector(
    (state: RootState) => state.books,
  );
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);

  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [notes, setNotes] = useState("");
  const [actionStatus, setActionStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [queuePosition, setQueuePosition] = useState<number | null>(null);

  useEffect(() => {
    // Re-fetch whenever idle OR when authentication state changes to ensure fresh data
    dispatch(fetchBooks({ page: 1, limit: 20 }));
  }, [dispatch, isAuthenticated]);

  const handleAction = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBook) return;

    setActionStatus("loading");
    try {
      // Use the same logic as the button to decide action
      const hasWaitlist = (selectedBook.reservationCount ?? 0) > 0;
      const isMyTurn = selectedBook.hasMyReservation && selectedBook.myQueuePosition === 1;
      const canDirectLoan = selectedBook.status === "AVAILABLE" && !hasWaitlist;
      
      const isLoan = canDirectLoan || (isMyTurn && (selectedBook.status === "AVAILABLE" || selectedBook.status === "RESERVED"));
      
      const action = isLoan ? loanBook : reserveBook;
      
      const result = await dispatch(action({ bookId: selectedBook.id, notes })).unwrap();
      
      if (!isLoan && result.queuePosition) {
        setQueuePosition(result.queuePosition);
      } else {
        setQueuePosition(null);
      }
      
      setActionStatus("success");
      
      setTimeout(() => {
        setIsModalOpen(false);
        setActionStatus("idle");
        dispatch(fetchBooks({ page: 1, limit: 20 }));
      }, isLoan ? 1500 : 3000);
    } catch (err) {
      setActionStatus("error");
    }
  };

  const openActionModal = (book: Book) => {
    setSelectedBook(book);
    setNotes("");
    setActionStatus("idle");
    setQueuePosition(null);
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
        <div className="space-y-1">
          <h1 className="text-4xl font-extrabold tracking-tight bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            Library Explorer
          </h1>
          <p className="text-muted-foreground text-lg">
            Discover thousands of books and manage your loans with ease.
          </p>
        </div>

        <div className="relative w-full sm:w-80 group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
          <input
            type="text"
            placeholder="Search by title, author, or genre..."
            className="w-full h-11 pl-10 pr-4 rounded-xl border border-input bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all shadow-sm"
            onChange={(e) => {
              const val = e.target.value;
              const timer = setTimeout(() => {
                dispatch(fetchBooks({ title: val }));
              }, 500);
              return () => clearTimeout(timer);
            }}
          />
        </div>
      </div>

      {status === "loading" && (
        <div className="flex flex-col items-center justify-center py-32 space-y-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground font-medium">Loading collection...</p>
        </div>
      )}
      
      {status === "failed" && (
        <div className="flex flex-col items-center justify-center py-32 space-y-4">
          <AlertCircle className="h-12 w-12 text-destructive" />
          <p className="text-destructive font-semibold">Error: {error}</p>
          <Button onClick={() => dispatch(fetchBooks({ page: 1, limit: 20 }))}>Retry</Button>
        </div>
      )}

      {status === "succeeded" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {books.map((book) => (
            <BookCard 
              key={book.id} 
              book={book} 
              onAction={openActionModal} 
            />
          ))}
          
          {books.length === 0 && (
            <div className="col-span-full py-32 text-center bg-gray-50 dark:bg-gray-900/50 rounded-2xl border-2 border-dashed border-gray-200 dark:border-gray-800">
              <p className="text-muted-foreground text-lg italic">No books found matching your search.</p>
            </div>
          )}
        </div>
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={selectedBook?.status === "AVAILABLE" ? "Confirm Loan" : "Join Waitlist"}
        description={selectedBook?.title ? `For: "${selectedBook.title}"` : ""}
      >
        <form onSubmit={handleAction} className="space-y-6">
          {actionStatus === "success" && (
            <div className="p-4 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-800 rounded-xl flex items-center gap-3 animate-in zoom-in-95">
              <CheckCircle2 className="h-5 w-5 shrink-0" />
              <div className="text-sm">
                <p className="font-bold">Transaction Confirmed!</p>
                {queuePosition !== null ? (
                  <p>You have joined the waitlist. Your turn is: <span className="font-black text-lg">#{queuePosition}</span></p>
                ) : (
                  <p>The book has been successfully loaned to you.</p>
                )}
              </div>
            </div>
          )}
          
          {actionStatus === "error" && (
            <div className="p-4 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-800 rounded-xl flex items-center gap-3 animate-in shake-x">
              <AlertCircle className="h-5 w-5 shrink-0" />
              <p className="text-sm font-medium">Something went wrong. Please try again later.</p>
            </div>
          )}

          <div className="space-y-3">
            <Label htmlFor="notes" className="text-base font-semibold">Notes</Label>
            <Input
              id="notes"
              placeholder="Any special instructions for the librarian?"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="h-12 rounded-xl"
              disabled={actionStatus === "loading" || actionStatus === "success"}
            />
            <p className="text-xs text-muted-foreground">Optional information for your record.</p>
          </div>

          <div className="pt-2 flex justify-end gap-3">
            <Button
              type="button"
              variant="ghost"
              onClick={() => setIsModalOpen(false)}
              className="rounded-xl h-11 px-6"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={actionStatus === "loading" || actionStatus === "success"}
              className="rounded-xl h-11 px-8 min-w-[140px]"
            >
              {actionStatus === "loading" ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : selectedBook?.status === "AVAILABLE" ? (
                "Confirm Loan"
              ) : (
                "Join Waitlist"
              )}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

