import type { Book } from "@/types";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Book as BookIcon, Calendar, User, Library, Info } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface BookCardProps {
  book: Book;
  onAction: (book: Book) => void;
}

export const BookCard = ({ book, onAction }: BookCardProps) => {
  const isAvailable = book.status === "AVAILABLE";
  const { 
    borrowedByMe, 
    hasMyReservation, 
    myQueuePosition, 
    nextQueuePositionIfReserveNow, 
    reservationCount 
  } = book;

  // STRICT LOAN LOGIC:
  // 1. If NO ONE is waiting, anyone can loan an AVAILABLE book.
  // 2. If there IS a waitlist, ONLY Turn #1 can loan it (after it's returned/available).
  const canLoanNow = (reservationCount === 0 && isAvailable) || 
                     (hasMyReservation && myQueuePosition === 1 && (isAvailable || book.status === "RESERVED"));

  return (
    <Card className={`flex flex-col overflow-hidden hover:shadow-lg transition-all duration-300 border-none bg-white dark:bg-gray-800/50 backdrop-blur-sm group ${borrowedByMe ? 'ring-2 ring-indigo-500/50' : hasMyReservation ? 'ring-2 ring-emerald-500/50' : ''}`}>
      <Link to={`/books/${book.id}`} className="relative h-64 bg-muted overflow-hidden">
        {book.imageUrl ? (
          <img
            src={book.imageUrl}
            alt={book.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-100 dark:bg-gray-800">
            <BookIcon className="h-12 w-12 text-gray-300" />
          </div>
        )}
        <div className="absolute top-3 right-3 flex flex-col gap-2 items-end">
          <Badge
            variant={isAvailable ? "secondary" : "default"}
            className={`font-bold tracking-wider uppercase shadow-sm ${
              isAvailable
                ? "bg-green-500 text-white border-none"
                : book.status === "RESERVED"
                ? "bg-amber-500 text-white border-none"
                : "bg-red-500 text-white border-none"
            }`}
          >
            {book.status}
          </Badge>
          
          {borrowedByMe && (
            <Badge className="bg-indigo-600 text-white border-none font-bold tracking-wider uppercase shadow-md animate-in slide-in-from-right-2">
              Borrowed by you
            </Badge>
          )}

          {hasMyReservation && (
            <Badge className={`border-none font-bold tracking-wider uppercase shadow-md animate-in slide-in-from-right-2 ${myQueuePosition === 1 && isAvailable ? 'bg-green-600 text-white' : 'bg-emerald-600 text-white'}`}>
              {myQueuePosition === 1 && isAvailable ? 'Your Turn!' : `Waitlist #${myQueuePosition}`}
            </Badge>
          )}

          {(reservationCount ?? 0) > 0 && (
            <Badge variant="outline" className="bg-white/90 dark:bg-gray-900/90 gap-1 font-bold">
              <User className="h-3 w-3" />
              {reservationCount} waiting
            </Badge>
          )}
        </div>
      </Link>
      
      <CardHeader className="p-5 flex-1 space-y-2">
        <Link to={`/books/${book.id}`}>
          <CardTitle className="line-clamp-2 text-xl font-bold hover:text-primary transition-colors cursor-pointer">
            {book.title}
          </CardTitle>
        </Link>
        <div className="flex items-center text-sm text-muted-foreground gap-2">
          <User className="h-4 w-4" />
          <span className="font-medium">{book.author}</span>
        </div>
        <div className="flex items-center text-xs text-muted-foreground gap-2">
          <Calendar className="h-3.5 w-3.5" />
          <span>{book.publicationYear}</span>
        </div>
      </CardHeader>
      
      <CardContent className="p-5 pt-0 mt-auto space-y-3">
        {borrowedByMe ? (
          <Button
            className="w-full font-bold gap-2 bg-indigo-100 text-indigo-700 hover:bg-indigo-100"
            variant="secondary"
            disabled
          >
            Borrowed by you
          </Button>
        ) : canLoanNow ? (
          <Button
            className="w-full font-bold gap-2 bg-green-600 hover:bg-green-700 text-white transition-all shadow-md active:scale-95"
            onClick={() => onAction(book)}
          >
            <Library className="h-4 w-4" />
            Loan Book Now
          </Button>
        ) : hasMyReservation ? (
          <Button
            className="w-full font-bold gap-2 bg-emerald-100 text-emerald-700 hover:bg-emerald-100"
            variant="secondary"
            disabled
          >
            Reserved (Turn #{myQueuePosition})
          </Button>
        ) : (
          <Button
            className={`w-full font-semibold transition-all group/btn ${
              isAvailable 
                ? "bg-primary hover:bg-primary/90" 
                : "bg-secondary hover:bg-secondary/80 text-foreground"
            }`}
            variant={isAvailable ? "default" : "secondary"}
            onClick={() => onAction(book)}
          >
            <span className="flex items-center gap-2">
              Join Waitlist 
              <span className="text-[10px] bg-black/5 dark:bg-white/10 px-1.5 py-0.5 rounded-md">
                Next: #{nextQueuePositionIfReserveNow ?? ((reservationCount ?? 0) + 1)}
              </span>
            </span>
          </Button>
        )}
        
        <Link to={`/books/${book.id}`} className="block">
          <Button variant="outline" className="w-full rounded-xl gap-2 h-10 border-gray-200 dark:border-gray-700 shadow-sm hover:bg-gray-50 dark:hover:bg-gray-800">
            <Info className="h-4 w-4 text-primary" />
            View Full Details
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
};
