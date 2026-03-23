import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "@/store";
import { fetchBookById } from "@/store/booksSlice";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Loader2, AlertCircle } from "lucide-react";
import { BookDetailHero } from "@/components/books/BookDetailHero";
import { BookDetailInfo } from "@/components/books/BookDetailInfo";
import { BookDetailActions } from "@/components/books/BookDetailActions";
import { BookActionModal } from "@/components/books/BookActionModal";

export const BookDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { selectedBook, status, error } = useSelector(
    (state: RootState) => state.books,
  );

  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (id) {
      dispatch(fetchBookById(parseInt(id)));
    }
  }, [dispatch, id]);

  if (status === "loading" && !selectedBook) {
    return (
      <div className="flex flex-col items-center justify-center py-32 space-y-4">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-muted-foreground font-medium">
          Loading book details...
        </p>
      </div>
    );
  }

  if (status === "failed" || !selectedBook) {
    return (
      <div className="flex flex-col items-center justify-center py-32 space-y-4 max-w-md mx-auto text-center">
        <AlertCircle className="h-12 w-12 text-destructive" />
        <h2 className="text-2xl font-bold">Book Not Found</h2>
        <p className="text-muted-foreground">
          {error || "We couldn't find the book you're looking for."}
        </p>
        <Button
          onClick={() => navigate("/")}
          variant="outline"
          className="mt-4 rounded-xl"
        >
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Catalog
        </Button>
      </div>
    );
  }

  const {
    title,
    author,
    imageUrl,
    status: bookStatus,
    publicationYear,
    reservationCount = 0,
    hasMyReservation,
    myQueuePosition,
    borrowedByMe,
    id: bookId,
  } = selectedBook;

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <Button
        variant="ghost"
        onClick={() => navigate(-1)}
        className="mb-4 hover:bg-white dark:hover:bg-gray-800 rounded-xl"
      >
        <ArrowLeft className="w-4 h-4 mr-2" /> Back
      </Button>

      <div className="space-y-10">
        <BookDetailHero
          title={title}
          author={author}
          imageUrl={imageUrl}
          status={bookStatus}
        />

        <div className="bg-white dark:bg-gray-800/40 backdrop-blur-md p-8 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-lg space-y-8">
          <BookDetailInfo
            id={bookId}
            publicationYear={publicationYear}
            status={bookStatus}
            reservationCount={reservationCount}
            hasMyReservation={hasMyReservation}
            myQueuePosition={myQueuePosition}
            borrowedByMe={borrowedByMe}
          />

          <BookDetailActions
            status={bookStatus}
            reservationCount={reservationCount}
            hasMyReservation={hasMyReservation}
            myQueuePosition={myQueuePosition}
            borrowedByMe={borrowedByMe}
            onActionClick={() => setIsModalOpen(true)}
          />
        </div>

        {/* Description / Summary aesthetic info box */}
        <div className="bg-white dark:bg-gray-800/40 p-8 rounded-3xl border border-gray-100 dark:border-gray-700">
          <h3 className="text-xl font-bold mb-4">About this Edition</h3>
          <p className="text-muted-foreground leading-relaxed">
            This classic work by{" "}
            <span className="text-foreground font-semibold">{author}</span> was
            published in{" "}
            <span className="text-foreground font-semibold">
              {publicationYear}
            </span>
            . As part of our LibraryFlow collection, it remains one of our most
            requested titles. This edition is managed under our smart-loaning
            system, ensuring fair access for all members through our real-time
            waitlist management.
          </p>
        </div>
      </div>

      <BookActionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        bookId={bookId}
        bookTitle={title}
        isAvailable={bookStatus === "AVAILABLE"}
        onActionSuccess={() => dispatch(fetchBookById(bookId))}
      />
    </div>
  );
};
