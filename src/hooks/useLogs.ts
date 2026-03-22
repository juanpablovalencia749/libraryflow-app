import { useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "@/store";
import { fetchLogs, setPage } from "@/store/loggerSlice";

export const useLogs = (limit: number = 20) => {
  const dispatch = useDispatch<AppDispatch>();
  const { logs, status, page, totalPages, total } = useSelector(
    (state: RootState) => state.logger
  );

  const loadLogs = useCallback(() => {
    dispatch(fetchLogs({ page, limit }));
  }, [dispatch, page, limit]);

  useEffect(() => {
    loadLogs();
  }, [loadLogs]);

  const refresh = () => {
    loadLogs();
  };

  const changePage = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      dispatch(setPage(newPage));
    }
  };

  return {
    logs,
    status,
    page,
    totalPages,
    total,
    refresh,
    changePage,
    isLoading: status === "loading",
    isSucceeded: status === "succeeded",
    isFailed: status === "failed"
  };
};
