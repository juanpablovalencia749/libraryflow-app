import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "@/store";
import { fetchBookById } from "@/store/booksSlice";
import { reserveBook, loanBook } from "@/store/loansSlice";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Modal } from "@/components/ui/modal";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  ArrowLeft, 
  Book as BookIcon, 
  Calendar, 
  User, 
  CheckCircle2, 
  AlertCircle, 
  Loader2,
  Library,
  Info,
  Clock
} from "lucide-react";

export const BookDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { selectedBook, status, error } = useSelector((state: RootState) => state.books);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [notes, setNotes] = useState("");
  const [actionStatus, setActionStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [queuePosition, setQueuePosition] = useState<number | null>(null);

  useEffect(() => {
    if (id) {
      dispatch(fetchBookById(parseInt(id)));
    }
  }, [dispatch, id]);

  const handleAction = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBook) return;

    setActionStatus("loading");
    try {
      const hasWaitlist = (selectedBook.reservationCount ?? 0) > 0;
      const isMyTurn = selectedBook.hasMyReservation && selectedBook.myQueuePosition === 1;
      const canDirectLoan = selectedBook.status === "AVAILABLE" && !hasWaitlist;
      
      const isLoan = canDirectLoan || (isMyTurn && (selectedBook.status === "AVAILABLE" || selectedBook.status === "RESERVED"));
      const action = isLoan ? loanBook : reserveBook;
      
      const result = await dispatch(action({ bookId: selectedBook.id, notes })).unwrap();
      
      if (!isLoan && result.queuePosition) {
        setQueuePosition(result.queuePosition);
      }
      
      setActionStatus("success");
      setTimeout(() => {
        setIsModalOpen(false);
        setActionStatus("idle");
        dispatch(fetchBookById(selectedBook.id));
      }, isLoan ? 1500 : 3000);
    } catch (err) {
      setActionStatus("error");
    }
  };

  if (status === "loading" && !selectedBook) {
    return (
      <div className="flex flex-col items-center justify-center py-32 space-y-4">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-muted-foreground font-medium">Loading book details...</p>
      </div>
    );
  }

  if (status === "failed" || !selectedBook) {
    return (
      <div className="flex flex-col items-center justify-center py-32 space-y-4 max-w-md mx-auto text-center">
        <AlertCircle className="h-12 w-12 text-destructive" />
        <h2 className="text-2xl font-bold">Book Not Found</h2>
        <p className="text-muted-foreground">{error || "We couldn't find the book you're looking for."}</p>
        <Button onClick={() => navigate("/")} variant="outline" className="mt-4 rounded-xl">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Catalog
        </Button>
      </div>
    );
  }

  const isAvailable = selectedBook.status === "AVAILABLE";
  const { reservationCount, hasMyReservation, myQueuePosition, borrowedByMe } = selectedBook;
  const canLoanNow = (reservationCount === 0 && isAvailable) || 
                     (hasMyReservation && myQueuePosition === 1 && (isAvailable || selectedBook.status === "RESERVED"));

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <Button 
        variant="ghost" 
        onClick={() => navigate(-1)} 
        className="mb-4 hover:bg-white dark:hover:bg-gray-800 rounded-xl"
      >
        <ArrowLeft className="w-4 h-4 mr-2" /> Back
      </Button>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-10 bg-white dark:bg-gray-800/40 backdrop-blur-md p-8 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-xl overflow-hidden relative">
        {/* Aesthetic background elements */}
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-primary/5 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-primary/10 rounded-full blur-3xl pointer-events-none"></div>

        {/* Image Column */}
        <div className="md:col-span-5 lg:col-span-4">
          <div className="aspect-[3/4] rounded-2xl overflow-hidden shadow-2xl relative group">
            {selectedBook.imageUrl ? (
              <img 
                src={selectedBook.imageUrl} 
                alt={selectedBook.title} 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
            ) : (
              <div className="w-full h-full bg-gray-100 dark:bg-gray-900 flex flex-col items-center justify-center text-gray-300 gap-4">
                <BookIcon className="w-20 h-20" />
                <span className="text-sm font-medium">No cover available</span>
              </div>
            )}
            <div className="absolute top-4 right-4">
               <Badge
                 variant={isAvailable ? "secondary" : "default"}
                 className={`font-bold tracking-widest uppercase px-3 py-1 shadow-lg ${
                   isAvailable
                     ? "bg-green-500 text-white border-none"
                     : selectedBook.status === "RESERVED"
                     ? "bg-amber-500 text-white border-none"
                     : "bg-red-500 text-white border-none"
                 }`}
               >
                 {selectedBook.status}
               </Badge>
            </div>
          </div>
        </div>

        {/* Content Column */}
        <div className="md:col-span-7 lg:col-span-8 flex flex-col space-y-6">
          <div className="space-y-2">
            <h1 className="text-4xl md:text-5xl font-black tracking-tight leading-tight">
              {selectedBook.title}
            </h1>
            <div className="flex items-center gap-2 text-xl font-medium text-primary">
              <User className="w-5 h-5" />
              <span>{selectedBook.author}</span>
            </div>
          </div>

          <div className="flex flex-wrap gap-4 items-center text-sm text-muted-foreground">
            <div className="flex items-center gap-1.5 bg-gray-100 dark:bg-gray-800 px-3 py-1.5 rounded-full">
              <Calendar className="w-4 h-4" />
              <span>Published in {selectedBook.publicationYear}</span>
            </div>
            <div className="flex items-center gap-1.5 bg-gray-100 dark:bg-gray-800 px-3 py-1.5 rounded-full">
              <Info className="w-4 h-4" />
              <span>ID: #{selectedBook.id}</span>
            </div>
          </div>

          <div className="border-t border-gray-100 dark:border-gray-700 my-2"></div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-5 rounded-2xl bg-gray-50 dark:bg-gray-900/50 border border-gray-100 dark:border-gray-800 space-y-2">
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Availability</p>
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${isAvailable ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                   {isAvailable ? <CheckCircle2 className="w-5 h-5" /> : <Clock className="w-5 h-5" />}
                </div>
                <div>
                  <p className="font-bold">{isAvailable ? "Ready for Loan" : "Currently Out"}</p>
                  <p className="text-xs text-muted-foreground">{reservationCount || 0} users in waitlist</p>
                </div>
              </div>
            </div>

            {hasMyReservation && (
              <div className="p-5 rounded-2xl bg-primary/5 border border-primary/20 space-y-2">
                <p className="text-xs font-bold text-primary uppercase tracking-wider">Your Status</p>
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg bg-primary/20 text-primary ${myQueuePosition === 1 ? 'animate-pulse' : ''}`}>
                     <User className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-extrabold text-primary">
                      {myQueuePosition === 1 ? "IT'S YOUR TURN!" : `Queue Position #${myQueuePosition}`}
                    </p>
                    <p className="text-xs text-primary/70 italic">We'll notify you when it's ready</p>
                  </div>
                </div>
              </div>
            )}
            
            {borrowedByMe && (
              <div className="p-5 rounded-2xl bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800 space-y-2">
                <p className="text-xs font-bold text-indigo-600 uppercase tracking-wider">Your Status</p>
                <div className="flex items-center gap-3 text-indigo-600">
                  <div className="p-2 rounded-lg bg-indigo-100">
                     <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-extrabold">Borrowed by You</p>
                    <p className="text-xs italic opacity-80">Enjoy your reading!</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="pt-4 flex flex-col sm:flex-row gap-4">
            {borrowedByMe ? (
              <Button disabled className="w-full flex-1 h-14 rounded-2xl text-lg font-bold bg-indigo-100 text-indigo-700 border-indigo-200">
                You have this book
              </Button>
            ) : canLoanNow ? (
              <Button 
                onClick={() => setIsModalOpen(true)}
                className="w-full flex-1 h-14 rounded-2xl text-lg font-black bg-green-600 hover:bg-green-700 text-white shadow-xl shadow-green-600/20 active:scale-95 transition-all gap-3"
              >
                <Library className="w-6 h-6" />
                LOAN THIS BOOK NOW
              </Button>
            ) : (
              <Button 
                onClick={() => setIsModalOpen(true)}
                className="w-full flex-1 h-14 rounded-2xl text-lg font-bold shadow-xl active:scale-95 transition-all gap-3"
              >
                <Clock className="w-6 h-6" />
                {hasMyReservation ? "UPDATE RESERVATION" : "JOIN THE WAITLIST"}
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Description / Summary placeholder (since the schema doesn't have it, we add an aesthetic info box) */}
      <div className="bg-white dark:bg-gray-800/40 p-8 rounded-3xl border border-gray-100 dark:border-gray-700">
        <h3 className="text-xl font-bold mb-4">About this Edition</h3>
        <p className="text-muted-foreground leading-relaxed">
          This classic work by <span className="text-foreground font-semibold">{selectedBook.author}</span> was published in <span className="text-foreground font-semibold">{selectedBook.publicationYear}</span>. 
          As part of our LibraryFlow collection, it remains one of our most requested titles. This edition is managed 
          under our smart-loaning system, ensuring fair access for all members through our real-time waitlist management.
        </p>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={isAvailable ? "Confirm Loan" : "Join Waitlist"}
        description={`Confirming request for "${selectedBook.title}"`}
      >
        <form onSubmit={handleAction} className="space-y-6">
          {actionStatus === "success" && (
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
          
          <div className="space-y-3">
            <Label htmlFor="notes" className="text-base font-semibold">Additional Notes</Label>
            <Input
              id="notes"
              placeholder="Any comments for the librarian?"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="h-12 rounded-xl"
              disabled={actionStatus === "loading" || actionStatus === "success"}
            />
          </div>

          <div className="pt-2 flex justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsModalOpen(false)}
              className="rounded-xl h-11 px-6 font-semibold"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={actionStatus === "loading" || actionStatus === "success"}
              className="rounded-xl h-11 px-8 min-w-[140px] font-bold"
            >
              {actionStatus === "loading" ? (
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
    </div>
  );
};
