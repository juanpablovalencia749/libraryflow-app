import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Library, CheckCircle, Hash } from "lucide-react";
import type { Reservation } from "@/types";

interface ReservationCardProps {
  reservation: Reservation;
  onLoan: (bookId: number) => void;
}

export const ReservationCard = ({
  reservation,
  onLoan,
}: ReservationCardProps) => {
  const isReady =
    reservation.queuePosition === 1 && reservation.book.status === "AVAILABLE";

  return (
    <Card className="overflow-hidden border-none bg-amber-50/50 dark:bg-amber-900/10 border-amber-100 dark:border-amber-900/30">
      <CardHeader className="p-5 flex flex-row items-center justify-between">
        <div className="space-y-1">
          <CardTitle className="text-lg font-bold line-clamp-1">
            {reservation.book.title}
          </CardTitle>
          <div className="flex items-center gap-2">
            <Badge
              variant="outline"
              className="bg-white dark:bg-gray-950 font-bold gap-1 mt-1"
            >
              <Hash className="h-3 w-3" />
              Turn #{reservation.queuePosition}
            </Badge>
          </div>
        </div>
        <div className="h-12 w-12 rounded-full bg-amber-500 text-white flex items-center justify-center font-black text-xl shadow-sm">
          {reservation.queuePosition}
        </div>
      </CardHeader>
      <CardContent className="px-5 pb-5">
        {isReady ? (
          <div className="space-y-4">
            <div className="p-3 bg-green-500/10 text-green-700 dark:text-green-400 border border-green-500/20 rounded-lg flex items-center gap-2 text-sm font-medium">
              <CheckCircle className="h-4 w-4" />
              Book is ready for you!
            </div>
            <Button
              className="w-full bg-green-600 hover:bg-green-700 text-white gap-2 shadow-sm rounded-xl"
              onClick={() => onLoan(reservation.book.id)}
            >
              <Library className="h-4 w-4" />
              Loan Now
            </Button>
          </div>
        ) : (
          <p className="text-sm text-muted-foreground italic">
            You joined on {new Date(reservation.createdAt).toLocaleDateString()}
            .
          </p>
        )}
      </CardContent>
    </Card>
  );
};
