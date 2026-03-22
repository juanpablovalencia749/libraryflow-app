import { Calendar, Info, CheckCircle2, Clock, User } from "lucide-react";

interface BookDetailInfoProps {
  publicationYear: number;
  id: number;
  status: string;
  reservationCount: number;
  hasMyReservation?: boolean;
  myQueuePosition?: number | null;
  borrowedByMe?: boolean;
}

export const BookDetailInfo = ({
  publicationYear,
  id,
  status,
  reservationCount,
  hasMyReservation,
  myQueuePosition,
  borrowedByMe
}: BookDetailInfoProps) => {
  const isAvailable = status === "AVAILABLE";

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-4 items-center text-sm text-muted-foreground">
        <div className="flex items-center gap-1.5 bg-gray-100 dark:bg-gray-800 px-3 py-1.5 rounded-full">
          <Calendar className="w-4 h-4" />
          <span>Published in {publicationYear}</span>
        </div>
        <div className="flex items-center gap-1.5 bg-gray-100 dark:bg-gray-800 px-3 py-1.5 rounded-full">
          <Info className="w-4 h-4" />
          <span>ID: #{id}</span>
        </div>
      </div>

      <div className="border-t border-gray-100 dark:border-gray-700 my-2"></div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
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
    </div>
  );
};
