import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Book as BookIcon, Clock, RotateCcw } from "lucide-react";
import type { Loan } from "@/types";

interface LoanCardProps {
  loan: Loan;
  onReturn: (id: number) => void;
}

export const LoanCard = ({ loan, onReturn }: LoanCardProps) => {
  return (
    <Card className="overflow-hidden border-none shadow-md hover:shadow-lg transition-shadow bg-white dark:bg-gray-800/40">
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
          onClick={() => onReturn(loan.id)}
        >
          <RotateCcw className="h-4 w-4" />
          Return Book
        </Button>
      </CardContent>
    </Card>
  );
};
