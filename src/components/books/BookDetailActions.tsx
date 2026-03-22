import { Button } from "@/components/ui/button";
import { Library, Clock } from "lucide-react";

interface BookDetailActionsProps {
  status: string;
  reservationCount: number;
  hasMyReservation?: boolean;
  myQueuePosition?: number | null;
  borrowedByMe?: boolean;
  onActionClick: () => void;
}

export const BookDetailActions = ({
  status,
  hasMyReservation,
  myQueuePosition,
  borrowedByMe,
  reservationCount,
  onActionClick
}: BookDetailActionsProps) => {
  const isAvailable = status === "AVAILABLE";
  const canLoanNow = (reservationCount === 0 && isAvailable) || 
                     (hasMyReservation && myQueuePosition === 1 && (isAvailable || status === "RESERVED"));

  if (borrowedByMe) {
    return (
      <div className="pt-4 flex flex-col sm:flex-row gap-4">
        <Button disabled className="w-full flex-1 h-14 rounded-2xl text-lg font-bold bg-indigo-100 text-indigo-700 border-indigo-200">
          You have this book
        </Button>
      </div>
    );
  }

  return (
    <div className="pt-4 flex flex-col sm:flex-row gap-4">
      {canLoanNow ? (
        <Button 
          onClick={onActionClick}
          className="w-full flex-1 h-14 rounded-2xl text-lg font-black bg-green-600 hover:bg-green-700 text-white shadow-xl shadow-green-600/20 active:scale-95 transition-all gap-3"
        >
          <Library className="w-6 h-6" />
          LOAN THIS BOOK NOW
        </Button>
      ) : (
        <Button 
          onClick={onActionClick}
          className="w-full flex-1 h-14 rounded-2xl text-lg font-bold shadow-xl active:scale-95 transition-all gap-3"
        >
          <Clock className="w-6 h-6" />
          {hasMyReservation ? "UPDATE RESERVATION" : "JOIN THE WAITLIST"}
        </Button>
      )}
    </div>
  );
};
