import type { Book } from "./book";

export interface Loan {
  id: number;
  bookId: number;
  userId: number;
  dueDate: string;
  returnedAt?: string | null;
  book: Book;
}

export interface Reservation {
  id: number;
  bookId: number;
  userId: number;
  queuePosition: number;
  status: "PENDING" | "READY" | "COMPLETED";
  createdAt: string;
  book: Book;
}

export interface LoansState {
  loans: Loan[];
  reservations: Reservation[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}
