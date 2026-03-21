import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import type { AppDispatch, RootState } from "@/store";
import {
  fetchBooks,
  createBook,
  updateBook,
  deleteBook,
} from "@/store/booksSlice";
import type { Book } from "@/store/booksSlice";
import { loanBook, returnBook } from "@/store/loansSlice";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { Edit, Plus, Trash2 } from "lucide-react";

const bookSchema = z.object({
  title: z.string().min(1, "Title is required"),
  author: z.string().min(1, "Author is required"),
  imageUrl: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  publicationYear: z.number().int().min(1000).max(new Date().getFullYear()),
  status: z.enum(["AVAILABLE", "RESERVED", "LOANED"]),
});

type BookFormValues = z.infer<typeof bookSchema>;

export const AdminDashboard = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { books, status } = useSelector((state: RootState) => state.books);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBook, setEditingBook] = useState<Book | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<BookFormValues>({
    resolver: zodResolver(bookSchema),
    defaultValues: {
      status: "AVAILABLE",
    },
  });

  useEffect(() => {
    dispatch(fetchBooks({ page: 1, limit: 50 }));
  }, [dispatch]);

  const openAddModal = () => {
    setEditingBook(null);
    reset({
      title: "",
      author: "",
      publicationYear: new Date().getFullYear(),
      status: "AVAILABLE",
    });
    setIsModalOpen(true);
  };

  const openEditModal = (book: Book) => {
    setEditingBook(book);
    reset({
      title: book.title,
      author: book.author,
      publicationYear: book.publicationYear,
      status: book.status,
    });
    setIsModalOpen(true);
  };

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isReturnDialogOpen, setIsReturnDialogOpen] = useState(false);
  const [isLoanDialogOpen, setIsLoanDialogOpen] = useState(false);
  const [selectedBookId, setSelectedBookId] = useState<number | null>(null);

  const handleDelete = async () => {
    if (selectedBookId) {
      await dispatch(deleteBook(selectedBookId));
      setIsDeleteDialogOpen(false);
    }
  };

  const handleLoan = async () => {
    if (selectedBookId) {
      await dispatch(loanBook({ bookId: selectedBookId, notes: "Loaned by Admin" }));
      dispatch(fetchBooks({ page: 1, limit: 50 }));
      setIsLoanDialogOpen(false);
    }
  };

  const handleReturn = async () => {
    if (selectedBookId) {
      await dispatch(returnBook(selectedBookId));
      dispatch(fetchBooks({ page: 1, limit: 50 }));
      setIsReturnDialogOpen(false);
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

  const openReturnDialog = (id: number) => {
    setSelectedBookId(id);
    setIsReturnDialogOpen(true);
  };

  const onSubmit = async (data: BookFormValues) => {
    if (editingBook) {
      await dispatch(updateBook({ id: editingBook.id, data }));
    } else {
      await dispatch(createBook(data));
    }
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

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
        <Table>
          <TableHeader className="bg-gray-50 dark:bg-gray-900/50">
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Author</TableHead>
              <TableHead>Year</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {status === "loading" && (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="text-center py-10 text-muted-foreground"
                >
                  Loading books...
                </TableCell>
              </TableRow>
            )}
            {status === "succeeded" &&
              books.map((book) => (
                <TableRow key={book.id}>
                  <TableCell className="font-medium text-muted-foreground">
                    #{book.id}
                  </TableCell>
                  <TableCell className="font-semibold">{book.title}</TableCell>
                  <TableCell>{book.author}</TableCell>
                  <TableCell>{book.publicationYear}</TableCell>
                  <TableCell>
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
                  </TableCell>
                  <TableCell className="text-right space-x-2">
                    {book.status === "RESERVED" && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openLoanDialog(book.id)}
                      >
                        Approve Loan
                      </Button>
                    )}
                    {book.status === "LOANED" && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openReturnDialog(book.id)}
                      >
                        Process Return
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
                  </TableCell>
                </TableRow>
              ))}
            {status === "succeeded" && books.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="text-center py-10 text-muted-foreground"
                >
                  No books available in the inventory.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingBook ? "Edit Book" : "Add New Book"}
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              {...register("title")}
              placeholder="The Great Gatsby"
            />
            {errors.title && (
              <p className="text-xs text-destructive">{errors.title.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="author">Author</Label>
            <Input
              id="author"
              {...register("author")}
              placeholder="F. Scott Fitzgerald"
            />
            {errors.author && (
                <p className="text-xs text-destructive">
                  {errors.author.message}
                </p>
              )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="imageUrl">Image URL</Label>
            <Input
              id="imageUrl"
              {...register("imageUrl")}
              placeholder="https://example.com/cover.jpg"
            />
            {errors.imageUrl && (
              <p className="text-xs text-destructive">
                {errors.imageUrl.message}
              </p>
            )}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="publicationYear">Publication Year</Label>
              <Input
                id="publicationYear"
                type="number"
                {...register("publicationYear", { valueAsNumber: true })}
              />
              {errors.publicationYear && (
                <p className="text-xs text-destructive">
                  {errors.publicationYear.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <select
                id="status"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background disabled:opacity-50"
                {...register("status")}
              >
                <option value="AVAILABLE">Available</option>
                <option value="RESERVED">Reserved</option>
                <option value="LOANED">Loaned</option>
              </select>
              {errors.status && (
                <p className="text-xs text-destructive">
                  {errors.status.message}
                </p>
              )}
            </div>
          </div>
          <div className="pt-4 flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsModalOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : "Save Book"}
            </Button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={handleDelete}
        title="Delete Book"
        description="Are you sure you want to delete this book? This action cannot be undone."
        confirmText="Delete"
        variant="destructive"
      />

      <ConfirmDialog
        isOpen={isReturnDialogOpen}
        onClose={() => setIsReturnDialogOpen(false)}
        onConfirm={handleReturn}
        title="Process Return"
        description="Confirm that this book has been returned by the user?"
        confirmText="Process Return"
        variant="warning"
      />

      <ConfirmDialog
        isOpen={isLoanDialogOpen}
        onClose={() => setIsLoanDialogOpen(false)}
        onConfirm={handleLoan}
        title="Approve Loan"
        description="Are you sure you want to approve this loan for the next person in waitlist?"
        confirmText="Approve"
      />
    </div>
  );
};
