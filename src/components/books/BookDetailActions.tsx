import { Button } from "@/components/ui/button";
import { Clock } from "lucide-react";

interface BookDetailActionsProps {
  status: string;
  reservationCount: number;
  hasMyReservation?: boolean;
  myQueuePosition?: number | null;
  borrowedByMe?: boolean;
  onActionClick: () => void;
}

export const BookDetailActions = ({
  hasMyReservation,
  borrowedByMe,
  onActionClick,
}: BookDetailActionsProps) => {
  if (borrowedByMe) {
    return (
      <div className="pt-4 flex flex-col sm:flex-row gap-4">
        <Button
          disabled
          className="w-full flex-1 h-14 rounded-2xl text-lg font-bold bg-indigo-100 text-indigo-700 border border-indigo-200 cursor-not-allowed"
        >
          You have this book
        </Button>
      </div>
    );
  }

  if (hasMyReservation) {
    return (
      <div className="pt-4 flex flex-col sm:flex-row gap-4">
        <Button
          disabled
          className="w-full flex-1 h-14 rounded-2xl text-lg font-bold bg-slate-100 text-slate-500 border border-slate-200 cursor-not-allowed gap-3"
        >
          <Clock className="w-6 h-6" />
          Already joined the waitlist
        </Button>
      </div>
    );
  }

  return (
    <div className="pt-4 flex flex-col sm:flex-row gap-4">
      <Button
        onClick={onActionClick}
        className="w-full flex-1 h-14 rounded-2xl text-lg font-black bg-amber-600 hover:bg-amber-700 text-white shadow-xl shadow-amber-600/20 active:scale-95 transition-all gap-3"
      >
        <Clock className="w-6 h-6" />
        JOIN WAITLIST
      </Button>
    </div>
  );
};
