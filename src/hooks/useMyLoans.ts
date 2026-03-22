import { useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "@/store";
import { fetchMyLoans } from "@/store/loansSlice";

export const useMyLoans = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { loans, reservations, status, error } = useSelector(
    (state: RootState) => state.loans,
  );
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);

  const loadMyLoans = useCallback(() => {
    if (isAuthenticated) {
      dispatch(fetchMyLoans());
    }
  }, [dispatch, isAuthenticated]);

  useEffect(() => {
    loadMyLoans();
  }, [loadMyLoans]);

  return {
    loans,
    reservations,
    status,
    error,
    refresh: loadMyLoans,
    isLoading: status === "loading",
    isSucceeded: status === "succeeded",
    isFailed: status === "failed"
  };
};
