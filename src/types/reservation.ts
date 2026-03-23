export interface Reservation {
  id: number;
  bookId: number;
  userId: number;
  reservedAt: Date;
  expiresAt: Date;
  fulfilledAt: null;
  cancelledAt: null;
  status: string;
  notes: string;
  createdAt: Date;
  updatedAt: Date;
  book: Book;
  queuePosition: number;
}

export interface Book {
  id: number;
  title: string;
  author: string;
  publicationYear: number;
  status: string;
  imageUrl: string;
  createdById: null;
  createdAt: Date;
  updatedAt: Date;
}
