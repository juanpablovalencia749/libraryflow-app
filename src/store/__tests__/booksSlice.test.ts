import { describe, it, expect } from 'vitest';
import booksReducer from '../booksSlice';

describe('booksSlice reducer', () => {
  const initialState = {
    books: [],
    selectedBook: null,
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 1,
    status: 'idle' as 'idle' | 'loading' | 'succeeded' | 'failed',
    error: null,
  };

  it('should handle initial state', () => {
    expect(booksReducer(undefined, { type: 'unknown' })).toEqual(initialState);
  });

  it('should handle fetchBooks pending', () => {
    const action = { type: 'books/fetchBooks/pending' };
    const state = booksReducer(initialState, action);
    expect(state.status).toEqual('loading');
  });

  it('should handle fetchBooks fulfilled', () => {
    const mockBooks = [{ id: 1, title: 'Book 1', author: 'Author 1', publicationYear: 2023, status: 'AVAILABLE' }];
    const action = { 
      type: 'books/fetchBooks/fulfilled', 
      payload: { data: mockBooks, meta: { total: 1, page: 1, limit: 10, totalPages: 1 } } 
    };
    
    const state = booksReducer(initialState, action);
    expect(state.status).toEqual('succeeded');
    expect(state.books).toEqual(mockBooks);
    expect(state.total).toEqual(1);
  });
});
