import { useState, useEffect } from "react";
import { Search, Loader2, AlertCircle, ChevronLeft, ChevronRight } from "lucide-react";
import { useSearchParams } from "react-router-dom";
import { BookCard } from "@/components/books/BookCard";
import { BookActionModal } from "@/components/books/BookActionModal";
import { useBooks } from "@/hooks/useBooks";
import { Button } from "@/components/ui/button";
import type { Book } from "@/types";

export const BooksList = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const urlPage = parseInt(searchParams.get("page") || "1");

  const {
    books,
    status,
    error,
    searchTerm,
    handleSearch,
    handlePageChange,
    currentPage,
    totalPages,
    refresh,
    isLoading,
    isFailed,
    isSucceeded
  } = useBooks({ page: urlPage, limit: 4 });

  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Sync internal page with URL parameter
  const onPageClick = (page: number) => {
    setSearchParams({ page: page.toString(), search: searchTerm });
    handlePageChange(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const [localSearch, setLocalSearch] = useState(searchParams.get("search") || "");

  useEffect(() => {
    const timer = setTimeout(() => {
      if (localSearch !== searchTerm) {
        handleSearch(localSearch);
        setSearchParams({ page: "1", search: localSearch });
      }
    }, 1000);
    return () => clearTimeout(timer);
  }, [localSearch, handleSearch, setSearchParams]);

  const openActionModal = (book: Book) => {
    setSelectedBook(book);
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
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
          <div className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center">
            {status === "loading" && localSearch ? (
              <Loader2 className="h-4 w-4 animate-spin text-primary" />
            ) : (
              <Search className="h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
            )}
          </div>
          <input
            type="text"
            placeholder="Search by title, author, or genre..."
            className="w-full h-11 pl-10 pr-4 rounded-xl border border-input bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all shadow-sm"
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
          />
        </div>
      </div>

      {isLoading && books.length === 0 && (
        <div className="flex flex-col items-center justify-center py-32 space-y-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground font-medium">Loading collection...</p>
        </div>
      )}
      
      {isFailed && (
        <div className="flex flex-col items-center justify-center py-32 space-y-4">
          <AlertCircle className="h-12 w-12 text-destructive" />
          <p className="text-destructive font-semibold">Error: {error}</p>
          <button 
            onClick={refresh}
            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
          >
            Retry
          </button>
        </div>
      )}

      {isSucceeded && (
        <div className="space-y-12">
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

          {/* Pagination UI */}
          {totalPages > 1 && (
            <div className="flex flex-col items-center gap-4 pt-8 border-t border-border">
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => onPageClick(currentPage - 1)}
                  disabled={currentPage === 1 || isLoading}
                  className="rounded-full"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>

                <div className="flex items-center gap-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1)
                    .filter(p => p === 1 || p === totalPages || Math.abs(p - currentPage) <= 1)
                    .map((p, index, array) => (
                      <div key={p} className="flex items-center gap-1">
                        {index > 0 && array[index - 1] !== p - 1 && (
                          <span className="text-muted-foreground px-1">...</span>
                        )}
                        <Button
                          variant={currentPage === p ? "default" : "outline"}
                          size="sm"
                          onClick={() => onPageClick(p)}
                          disabled={isLoading}
                          className={`min-w-[40px] rounded-full ${currentPage === p ? 'shadow-md shadow-primary/20' : ''}`}
                        >
                          {p}
                        </Button>
                      </div>
                    ))}
                </div>

                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => onPageClick(currentPage + 1)}
                  disabled={currentPage === totalPages || isLoading}
                  className="rounded-full"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
              <p className="text-xs text-muted-foreground font-medium">
                Page {currentPage} of {totalPages}
              </p>
            </div>
          )}
        </div>
      )}

      {selectedBook && (
        <BookActionModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          bookId={selectedBook.id}
          bookTitle={selectedBook.title}
          isAvailable={selectedBook.status === "AVAILABLE"}
          onActionSuccess={refresh}
        />
      )}
    </div>
  );
};


