import { describe, it, expect } from 'vitest';
import authReducer, { setCredentials, logout } from '../authSlice';

describe('authSlice reducer', () => {
  const initialState = {
    user: null,
    token: null,
    isAuthenticated: false,
  };

  it('should handle initial state', () => {
    expect(authReducer(undefined, { type: 'unknown' })).toEqual(initialState);
  });

  it('should handle setCredentials', () => {
    const actual = authReducer(
      initialState,
      setCredentials({ user: { name: 'Test', email: 'test@test.com' }, token: 'abc' })
    );
    expect(actual.isAuthenticated).toEqual(true);
    expect(actual.token).toEqual('abc');
    expect(actual.user?.name).toEqual('Test');
  });

  it('should handle logout', () => {
    const loggedInState = {
      user: { name: 'Test', email: 'test@test.com' },
      token: 'abc',
      isAuthenticated: true,
    };
    const actual = authReducer(loggedInState, logout());
    expect(actual).toEqual(initialState);
  });
});
