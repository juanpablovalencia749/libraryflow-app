import { describe, it, expect } from 'vitest';
import loggerReducer, { setPage } from '../loggerSlice';
import { LoggerState } from '@/types';

describe('loggerSlice reducer', () => {
  const initialState: LoggerState = {
    logs: [],
    total: 0,
    page: 1,
    limit: 20,
    totalPages: 1,
    status: 'idle',
    error: null,
  };

  it('should handle initial state', () => {
    expect(loggerReducer(undefined, { type: 'unknown' })).toEqual(initialState);
  });

  it('should handle setPage', () => {
    const state = loggerReducer(initialState, setPage(2));
    expect(state.page).toEqual(2);
  });

  it('should handle fetchLogs pending', () => {
    const action = { type: 'logger/fetchLogs/pending' };
    const state = loggerReducer(initialState, action);
    expect(state.status).toEqual('loading');
  });

  it('should handle fetchLogs fulfilled', () => {
    const mockLogs = [
      { id: 1, action: 'POST', entityName: 'Book', description: 'Created book', createdAt: '2023-10-01' }
    ];
    const action = { 
      type: 'logger/fetchLogs/fulfilled', 
      payload: { 
        data: mockLogs, 
        meta: { total: 1, page: 1, limit: 20, totalPages: 1 } 
      } 
    };
    
    const state = loggerReducer(initialState, action);
    expect(state.status).toEqual('succeeded');
    expect(state.logs).toEqual(mockLogs);
    expect(state.total).toEqual(1);
  });
});
