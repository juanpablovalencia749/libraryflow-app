export type BookStatus = "AVAILABLE" | "RESERVED" | "LOANED";

export interface Book {
  id: number;
  title: string;
  author: string;
  imageUrl?: string;
  publicationYear: number;
  status: BookStatus;
  reservationCount?: number;
  hasMyReservation?: boolean;
  myQueuePosition?: number | null;
  nextQueuePositionIfReserveNow?: number;
  borrowedByMe?: boolean;
  createdAt?: string;
}

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: PaginationMeta;
}

export interface BooksState {
  books: Book[];
  selectedBook: Book | null;
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}
