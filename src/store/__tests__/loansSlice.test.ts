import { describe, it, expect } from 'vitest';
import loansReducer from '../loansSlice';
import { LoansState } from '@/types';

describe('loansSlice reducer', () => {
  const initialState: LoansState = {
    loans: [],
    reservations: [],
    status: 'idle',
    error: null,
  };

  it('should handle initial state', () => {
    expect(loansReducer(undefined, { type: 'unknown' })).toEqual(initialState);
  });

  it('should handle fetchMyLoans pending', () => {
    const action = { type: 'loans/fetchMyLoans/pending' };
    const state = loansReducer(initialState, action);
    expect(state.status).toEqual('loading');
  });

  it('should handle fetchMyLoans fulfilled', () => {
    const mockData = {
      loans: [{ id: 1, bookId: 10, userId: 1, status: 'ACTIVE', dueDate: '2023-12-31' }],
      reservations: [{ id: 5, bookId: 11, userId: 1, status: 'PENDING', turn: 1 }]
    };
    const action = { 
      type: 'loans/fetchMyLoans/fulfilled', 
      payload: mockData 
    };
    
    const state = loansReducer(initialState, action);
    expect(state.status).toEqual('succeeded');
    expect(state.loans).toEqual(mockData.loans);
    expect(state.reservations).toEqual(mockData.reservations);
  });

  it('should handle fetchMyLoans rejected', () => {
    const action = { type: 'loans/fetchMyLoans/rejected', error: { message: 'Fetch failed' } };
    const state = loansReducer(initialState, action);
    expect(state.status).toEqual('failed');
    expect(state.error).toEqual('Fetch failed');
  });

  it('should handle reserveBook pending', () => {
    const action = { type: 'loans/reserveBook/pending' };
    const state = loansReducer(initialState, action);
    expect(state.status).toEqual('loading');
  });
});
