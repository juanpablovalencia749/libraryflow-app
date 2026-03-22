import { useState } from "react";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "@/store";
import {
  createBook,
  updateBook,
  deleteBook,
} from "@/store/booksSlice";
import type { Book } from "@/types";
import { DataTable } from "@/components/ui/DataTable";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { Edit, Plus, Trash2 } from "lucide-react";

// Hooks & Components
import { useBooks } from "@/hooks/useBooks";
import { useBookActions } from "@/hooks/useBookActions";
import { BookFormModal } from "@/components/admin/BookFormModal";
import type { BookFormValues } from "@/schemas";

export const AdminDashboard = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { books, isLoading, isSucceeded, refresh } = useBooks({ limit: 50 });
  const { performAction } = useBookActions();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBook, setEditingBook] = useState<Book | null>(null);

  const openAddModal = () => {
    setEditingBook(null);
    setIsModalOpen(true);
  };

  const openEditModal = (book: Book) => {
    setEditingBook(book);
    setIsModalOpen(true);
  };

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isLoanDialogOpen, setIsLoanDialogOpen] = useState(false);
  const [selectedBookId, setSelectedBookId] = useState<number | null>(null);

  const onDeleteConfirm = async () => {
    if (selectedBookId) {
      await dispatch(deleteBook(selectedBookId));
      refresh();
      setIsDeleteDialogOpen(false);
    }
  };

  const onLoanConfirm = async () => {
    if (selectedBookId) {
      await performAction(selectedBookId, { isLoan: true, notes: "Loaned by Admin" });
      refresh();
      setIsLoanDialogOpen(false);
    }
  };


  const openDeleteDialog = (id: number) => {
    setSelectedBookId(id);
    setIsDeleteDialogOpen(true);
  };

  const openLoanDialog = (id: number) => {
    setSelectedBookId(id);
    setIsLoanDialogOpen(true);
  };


  const onFormSubmit = async (data: BookFormValues) => {
    if (editingBook) {
      await dispatch(updateBook({ id: editingBook.id, data }));
    } else {
      await dispatch(createBook(data));
    }
    refresh();
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
        <div>
          <h1 className="text-2xl font-bold">Admin Dashboard</h1>
          <p className="text-muted-foreground text-sm">
            Manage library catalog and inventory.
          </p>
        </div>
        <Button onClick={openAddModal}>
          <Plus className="w-4 h-4 mr-2" /> Add Book
        </Button>
      </div>

      <DataTable
        data={books}
        isLoading={isLoading}
        isSucceeded={isSucceeded}
        loadingMessage="Loading books..."
        emptyMessage="No books available in the inventory."
        columns={[
          {
            header: "ID",
            accessor: (book: Book) => (
              <span className="font-medium text-muted-foreground">#{book.id}</span>
            ),
          },
          {
            header: "Title",
            accessor: (book: Book) => <span className="font-semibold">{book.title}</span>,
          },
          {
            header: "Author",
            accessor: "author",
          },
          {
            header: "Year",
            accessor: "publicationYear",
          },
          {
            header: "Status",
            accessor: (book: Book) => (
              <Badge
                variant={book.status === "AVAILABLE" ? "secondary" : "default"}
                className={`font-bold tracking-wider uppercase ${
                  book.status === "AVAILABLE" 
                    ? "bg-green-100 text-green-700 hover:bg-green-100 border-green-200" 
                    : "bg-amber-100 text-amber-700 hover:bg-amber-100 border-amber-200"
                }`}
              >
                {book.status}
              </Badge>
            ),
          },
          {
            header: "Actions",
            headerClassName: "text-right",
            className: "text-right space-x-2",
            accessor: (book: Book) => (
              <>
                {book.status === "RESERVED" && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => openLoanDialog(book.id)}
                  >
                    Approve Loan
                  </Button>
                )}
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => openEditModal(book)}
                >
                  <Edit className="w-4 h-4 text-blue-500" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => openDeleteDialog(book.id)}
                >
                  <Trash2 className="w-4 h-4 text-destructive" />
                </Button>
              </>
            ),
          },
        ]}
      />

      <BookFormModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        editingBook={editingBook}
        onSubmit={onFormSubmit}
      />

      <ConfirmDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={onDeleteConfirm}
        title="Delete Book"
        description="Are you sure you want to delete this book? This action cannot be undone."
        confirmText="Delete"
        variant="destructive"
      />


      <ConfirmDialog
        isOpen={isLoanDialogOpen}
        onClose={() => setIsLoanDialogOpen(false)}
        onConfirm={onLoanConfirm}
        title="Approve Loan"
        description="Are you sure you want to approve this loan for the next person in waitlist?"
        confirmText="Approve"
      />
    </div>
  );
};

