import { describe, it, expect } from 'vitest';
import authReducer, { loginSuccess, logout, fetchSession } from '../authSlice';

describe('authSlice reducer', () => {
  const baseInitial = () => ({
    user: null,
    isAuthenticated: false,
    sessionStatus: 'loading' as const,
    status: 'idle' as const,
    error: null,
  });

  const mockUser = {
    id: 1,
    firstName: 'Test',
    lastName: 'User',
    email: 'test@test.com',
    role: 'USER' as const,
  };

  it('should handle initial state', () => {
    expect(authReducer(undefined, { type: 'unknown' })).toEqual(baseInitial());
  });

  it('should handle loginSuccess', () => {
    const actual = authReducer(baseInitial(), loginSuccess());
    expect(actual.isAuthenticated).toEqual(true);
    expect(actual.sessionStatus).toEqual('authenticated');
  });

  it('should handle fetchSession.fulfilled', () => {
    const state = { ...baseInitial(), sessionStatus: 'loading' as const };
    const actual = authReducer(
      state,
      fetchSession.fulfilled(mockUser, 'req', undefined),
    );
    expect(actual.user).toEqual(mockUser);
    expect(actual.isAuthenticated).toEqual(true);
    expect(actual.sessionStatus).toEqual('authenticated');
  });

  it('should handle logout', () => {
    const loggedInState = {
      user: mockUser,
      isAuthenticated: true,
      sessionStatus: 'authenticated' as const,
      status: 'idle' as const,
      error: null,
    };
    const actual = authReducer(loggedInState, logout());
    expect(actual).toEqual({
      user: null,
      isAuthenticated: false,
      sessionStatus: 'unauthenticated',
      status: 'idle',
      error: null,
    });
  });
});
