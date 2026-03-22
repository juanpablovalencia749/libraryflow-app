import { type ReactNode } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

export interface Column<T> {
  header: string;
  accessor: keyof T | ((item: T) => ReactNode);
  className?: string;
  headerClassName?: string;
}

export interface PaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  isLoading?: boolean;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  isLoading?: boolean;
  isSucceeded?: boolean;
  loadingMessage?: string | ReactNode;
  emptyMessage?: string | ReactNode;
  onRowClick?: (item: T) => void;
  pagination?: PaginationProps;
  className?: string;
  tableClassName?: string;
}

export function DataTable<T extends { id: string | number }>({
  columns,
  data,
  isLoading,
  isSucceeded,
  loadingMessage = "Loading...",
  emptyMessage = "No data available.",
  onRowClick,
  pagination,
  className,
  tableClassName,
}: DataTableProps<T>) {
  return (
    <div className={cn("bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden", className)}>
      <div className="overflow-x-auto">
        <Table className={tableClassName}>
          <TableHeader className="bg-gray-50 dark:bg-gray-900/50">
            <TableRow>
              {columns.map((column, index) => (
                <TableHead key={index} className={column.headerClassName}>
                  {column.header}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading && data.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="text-center py-10"
                >
                  {typeof loadingMessage === "string" ? (
                    <span className="text-muted-foreground">{loadingMessage}</span>
                  ) : (
                    loadingMessage
                  )}
                </TableCell>
              </TableRow>
            )}
            {isSucceeded && data.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="text-center py-10 text-muted-foreground"
                >
                  {emptyMessage}
                </TableCell>
              </TableRow>
            )}
            {data.map((item) => (
              <TableRow
                key={item.id}
                onClick={() => onRowClick?.(item)}
                className={cn(onRowClick ? "cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-900/20 transition-colors" : "")}
              >
                {columns.map((column, index) => (
                  <TableCell key={index} className={column.className}>
                    {typeof column.accessor === "function"
                      ? column.accessor(item)
                      : (item[column.accessor] as ReactNode)}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {pagination && pagination.totalPages > 1 && (
        <div className="p-4 border-t border-gray-100 dark:border-gray-700 flex items-center justify-between bg-gray-50/30 dark:bg-gray-900/10">
          <p className="text-xs text-muted-foreground">
            Showing page <span className="font-semibold text-foreground">{pagination.page}</span> of <span className="font-semibold text-foreground">{pagination.totalPages}</span>
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => pagination.onPageChange(pagination.page - 1)}
              disabled={pagination.page <= 1 || pagination.isLoading}
              className="h-8 rounded-lg"
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <div className="flex gap-1">
              {[...Array(Math.min(5, pagination.totalPages))].map((_, i) => {
                let pageNum = pagination.page;
                if (pagination.page <= 3) pageNum = i + 1;
                else if (pagination.page >= pagination.totalPages - 2) pageNum = pagination.totalPages - 4 + i;
                else pageNum = pagination.page - 2 + i;

                if (pageNum <= 0 || pageNum > pagination.totalPages) return null;

                return (
                  <Button
                    key={pageNum}
                    variant={pagination.page === pageNum ? "default" : "outline"}
                    size="sm"
                    onClick={() => pagination.onPageChange(pageNum)}
                    className="h-8 w-8 rounded-lg text-xs"
                    disabled={pagination.isLoading}
                  >
                    {pageNum}
                  </Button>
                );
              })}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => pagination.onPageChange(pagination.page + 1)}
              disabled={pagination.page >= pagination.totalPages || pagination.isLoading}
              className="h-8 rounded-lg"
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
