import { renderHook } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useLogs } from '../useLogs';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import loggerReducer from '@/store/loggerSlice';
import React from 'react';

const mockDispatch = vi.fn();
vi.mock('react-redux', async () => {
  const actual = await vi.importActual('react-redux');
  return {
    ...actual,
    useDispatch: () => mockDispatch,
    useSelector: (selector: any) => selector({
      logger: {
        logs: [],
        status: 'idle',
        total: 0,
        page: 1,
        limit: 20,
        totalPages: 1,
        error: null,
      },
      auth: {
        isAuthenticated: false,
        user: null,
        status: 'idle',
        error: null
      }
    }),
  };
});

describe('useLogs Hook', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const wrapper = ({ children }: { children: React.ReactNode }) => {
    const store = configureStore({ reducer: { logger: loggerReducer } });
    return <Provider store={store}>{children}</Provider>;
  };

  it('dispatches fetchLogs on mount', () => {
    renderHook(() => useLogs(), { wrapper });
    expect(mockDispatch).toHaveBeenCalled();
  });

  it('returns the initial state correctly', () => {
    const { result } = renderHook(() => useLogs(), { wrapper });
    
    expect(result.current.logs).toEqual([]);
    expect(result.current.page).toBe(1);
    expect(result.current.isLoading).toBe(false);
  });
});
