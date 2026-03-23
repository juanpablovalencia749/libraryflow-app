import { useState } from "react";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "@/store";
import { loanBook, reserveBook, returnBook } from "@/store/loansSlice";
import { fetchBookById } from "@/store/booksSlice";

export const useBookActions = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [actionStatus, setActionStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [queuePosition, setQueuePosition] = useState<number | null>(null);

  const performAction = async (
    bookId: number,
    options: {
      isLoan: boolean;
      notes?: string;
      onSuccess?: (result: { queuePosition?: number } | unknown) => void;
      reFetchBook?: boolean;
    },
  ) => {
    setActionStatus("loading");
    try {
      const action = options.isLoan ? loanBook : reserveBook;
      const result = await dispatch(
        action({ bookId, notes: options.notes || "" }),
      ).unwrap();

      if (!options.isLoan && result.queuePosition) {
        setQueuePosition(result.queuePosition);
      } else {
        setQueuePosition(null);
      }

      setActionStatus("success");

      if (options.onSuccess) {
        options.onSuccess(result);
      }

      if (options.reFetchBook) {
        dispatch(fetchBookById(bookId));
      }

      return { success: true, result };
    } catch (err) {
      setActionStatus("error");
      return { success: false, error: err };
    }
  };

  const handleReturn = async (loanId: number, onSuccess?: () => void) => {
    setActionStatus("loading");
    try {
      await dispatch(returnBook(loanId)).unwrap();
      setActionStatus("success");
      if (onSuccess) onSuccess();
      return { success: true };
    } catch (err) {
      setActionStatus("error");
      return { success: false, error: err };
    }
  };

  const resetStatus = () => {
    setActionStatus("idle");
    setQueuePosition(null);
  };

  return {
    actionStatus,
    queuePosition,
    performAction,
    handleReturn,
    resetStatus,
    isLoading: actionStatus === "loading",
    isSuccess: actionStatus === "success",
    isError: actionStatus === "error",
  };
};
