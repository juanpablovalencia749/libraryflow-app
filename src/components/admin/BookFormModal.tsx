import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { Book } from "@/types";
import { bookSchema } from "@/schemas";
import type { BookFormValues } from "@/schemas";

interface BookFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: BookFormValues) => Promise<void>;
  editingBook: Book | null;
}

export const BookFormModal = ({
  isOpen,
  onClose,
  onSubmit,
  editingBook
}: BookFormModalProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<BookFormValues>({
    resolver: zodResolver(bookSchema),
    values: editingBook ? {
      title: editingBook.title,
      author: editingBook.author,
      imageUrl: editingBook.imageUrl || "",
      publicationYear: editingBook.publicationYear,
      status: editingBook.status,
    } : {
      title: "",
      author: "",
      imageUrl: "",
      publicationYear: new Date().getFullYear(),
      status: "AVAILABLE",
    },
  });

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
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
        </div>
        <div className="pt-4 flex justify-end gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : "Save Book"}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
