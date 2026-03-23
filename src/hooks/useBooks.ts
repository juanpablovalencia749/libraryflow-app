import { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "@/store";
import { fetchBooks } from "@/store/booksSlice";

interface UseBooksOptions {
  page?: number;
  limit?: number;
  initialSearch?: string;
  debounceMs?: number;
  autoFetch?: boolean;
}

export const useBooks = (options: UseBooksOptions = {}) => {
  const {
    page = 1,
    limit = 20,
    initialSearch = "",
    debounceMs = 1000,
    autoFetch = true,
  } = options;

  const dispatch = useDispatch<AppDispatch>();
  const {
    books,
    status,
    error,
    total,
    page: currentPage,
    totalPages,
  } = useSelector((state: RootState) => state.books);
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);

  const [searchTerm, setSearchTerm] = useState(initialSearch);

  const loadBooks = useCallback(
    (search?: string, p?: number) => {
      dispatch(
        fetchBooks({
          page: p || page,
          limit,
          title: search !== undefined ? search : searchTerm,
        }),
      );
    },
    [dispatch, limit, page, searchTerm],
  );

  useEffect(() => {
    if (!autoFetch) return;
    if (searchTerm === initialSearch) {
      loadBooks();
      return;
    }

    const delayDebounceFn = setTimeout(() => {
      loadBooks(searchTerm, 1);
    }, debounceMs);

    return () => clearTimeout(delayDebounceFn);
  }, [
    searchTerm,
    debounceMs,
    loadBooks,
    autoFetch,
    initialSearch,
    isAuthenticated,
  ]);

  const handleSearch = (term: string) => {
    setSearchTerm(term);
  };

  const handlePageChange = (p: number) => {
    loadBooks(searchTerm, p);
  };

  const refresh = () => {
    loadBooks();
  };

  return {
    books,
    status,
    error,
    total,
    currentPage,
    totalPages,
    searchTerm,
    handleSearch,
    handlePageChange,
    refresh,
    isLoading: status === "loading",
    isSucceeded: status === "succeeded",
    isFailed: status === "failed",
  };
};
