import { describe, it, expect } from 'vitest';
import authReducer, { setCredentials, logout } from '../authSlice';

describe('authSlice reducer', () => {
  const initialState = {
    user: null,
    isAuthenticated: false,
    status: 'idle' as const,
    error: null,
  };

  it('should handle initial state', () => {
    expect(authReducer(undefined, { type: 'unknown' })).toEqual(initialState);
  });

  it('should handle setCredentials', () => {
    const mockUser = { 
      id: 1, 
      firstName: 'Test', 
      lastName: 'User', 
      email: 'test@test.com', 
      role: 'USER' as const 
    };
    const actual = authReducer(
      initialState,
      setCredentials({ user: mockUser })
    );
    expect(actual.isAuthenticated).toEqual(true);
    // expect(actual.token).toEqual('abc'); // Removed as token is NOT in state
    expect(actual.user?.firstName).toEqual('Test');
  });

  it('should handle logout', () => {
    const mockUser = { 
      id: 1, 
      firstName: 'Test', 
      lastName: 'User', 
      email: 'test@test.com', 
      role: 'USER' as const 
    };
    const loggedInState = {
      user: mockUser,
      isAuthenticated: true,
      status: 'idle' as const,
      error: null,
    };
    const actual = authReducer(loggedInState, logout());
    expect(actual).toEqual(initialState);
  });
});
