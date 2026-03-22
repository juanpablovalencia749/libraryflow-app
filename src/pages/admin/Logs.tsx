import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "@/store";
import { fetchLogs, setPage } from "@/store/loggerSlice";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Modal } from "@/components/ui/modal";
import { 
  ChevronLeft, 
  ChevronRight, 
  RotateCw, 
  Info, 
  Terminal,
  Clock,
  User,
  Activity
} from "lucide-react";

export const Logs = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { logs, status, page, totalPages, total } = useSelector(
    (state: RootState) => state.logger
  );

  const [selectedLog, setSelectedLog] = useState<any | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchLogs({ page, limit: 20 }));
  }, [dispatch, page]);

  const handleRefresh = () => {
    dispatch(fetchLogs({ page, limit: 20 }));
  };

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      dispatch(setPage(newPage));
    }
  };

  const openLogDetails = (log: any) => {
    setSelectedLog(log);
    setIsModalOpen(true);
  };

  const getActionColor = (action: string) => {
    switch (action.toUpperCase()) {
      case "POST":
        return "bg-green-100 text-green-700 border-green-200";
      case "PATCH":
      case "PUT":
        return "bg-blue-100 text-blue-700 border-blue-200";
      case "DELETE":
        return "bg-red-100 text-red-700 border-red-200";
      case "GET":
        return "bg-gray-100 text-gray-700 border-gray-200";
      default:
        return "bg-purple-100 text-purple-700 border-purple-200";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-primary/10 rounded-xl">
            <Activity className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight">System Logs</h1>
            <p className="text-muted-foreground text-sm flex items-center gap-1">
              <Terminal className="w-3 h-3" /> Monitor application activity and audit trails.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="hidden md:block text-right mr-2">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Total entries</p>
            <p className="text-lg font-bold">{total}</p>
          </div>
          <Button variant="outline" size="sm" onClick={handleRefresh} disabled={status === "loading"} className="rounded-xl shadow-sm">
            <RotateCw className={`w-4 h-4 mr-2 ${status === "loading" ? "animate-spin" : ""}`} />
            Refresh
          </Button>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-gray-50/50 dark:bg-gray-900/50">
              <TableRow>
                <TableHead className="w-16">ID</TableHead>
                <TableHead>Action</TableHead>
                <TableHead>Entity / Path</TableHead>
                <TableHead className="hidden lg:table-cell">User</TableHead>
                <TableHead className="max-w-xs">Description</TableHead>
                <TableHead className="text-right">Time</TableHead>
                <TableHead className="w-12"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {status === "loading" && logs.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-20">
                    <div className="flex flex-col items-center gap-2">
                      <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                      <p className="text-muted-foreground font-medium">Fetching logs...</p>
                    </div>
                  </TableCell>
                </TableRow>
              )}
              {status === "succeeded" && logs.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-20 text-muted-foreground">
                    No logs found.
                  </TableCell>
                </TableRow>
              )}
              {logs.map((log) => (
                <TableRow key={log.id} className="group hover:bg-gray-50/50 dark:hover:bg-gray-900/20 transition-colors cursor-pointer" onClick={() => openLogDetails(log)}>
                  <TableCell className="font-mono text-xs text-muted-foreground">#{log.id}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className={`font-bold text-[10px] px-2 py-0 ${getActionColor(log.action)}`}>
                      {log.action}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-medium text-sm truncate max-w-[150px]" title={log.entityName}>
                    {log.entityName}
                  </TableCell>
                  <TableCell className="hidden lg:table-cell">
                    <div className="flex items-center gap-2 text-xs">
                      <User className="w-3 h-3 text-muted-foreground" />
                      {log.userId ? `User #${log.userId}` : <span className="text-gray-400 italic">System</span>}
                    </div>
                  </TableCell>
                  <TableCell className="text-sm text-gray-600 dark:text-gray-400 max-w-xs truncate">
                    {log.description}
                  </TableCell>
                  <TableCell className="text-right text-xs whitespace-nowrap">
                    <div className="flex flex-col items-end">
                      <span className="font-medium">
                        {new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).format(new Date(log.createdAt))}
                      </span>
                      <span className="text-muted-foreground flex items-center gap-1">
                        <Clock className="w-3 h-3" /> 
                        {new Intl.DateTimeFormat('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false }).format(new Date(log.createdAt))}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100 transition-opacity rounded-full">
                      <Info className="w-4 h-4 text-primary" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        <div className="p-4 border-t border-gray-100 dark:border-gray-700 flex items-center justify-between bg-gray-50/30 dark:bg-gray-900/10">
          <p className="text-xs text-muted-foreground">
            Showing page <span className="font-semibold text-foreground">{page}</span> of <span className="font-semibold text-foreground">{totalPages}</span>
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(page - 1)}
              disabled={page <= 1 || status === "loading"}
              className="h-8 rounded-lg"
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <div className="flex gap-1">
              {[...Array(Math.min(5, totalPages))].map((_, i) => {
                let pageNum = page;
                if (page <= 3) pageNum = i + 1;
                else if (page >= totalPages - 2) pageNum = totalPages - 4 + i;
                else pageNum = page - 2 + i;

                if (pageNum <= 0 || pageNum > totalPages) return null;

                return (
                  <Button
                    key={pageNum}
                    variant={page === pageNum ? "default" : "outline"}
                    size="sm"
                    onClick={() => handlePageChange(pageNum)}
                    className="h-8 w-8 rounded-lg text-xs"
                    disabled={status === "loading"}
                  >
                    {pageNum}
                  </Button>
                );
              })}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(page + 1)}
              disabled={page >= totalPages || status === "loading"}
              className="h-8 rounded-lg"
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Log Details"
      >
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4 text-sm bg-gray-50 dark:bg-gray-900/50 p-4 rounded-xl border border-gray-100 dark:border-gray-800">
            <div>
              <p className="text-xs text-muted-foreground uppercase font-semibold">Event ID</p>
              <p className="font-mono text-primary">#{selectedLog?.id}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground uppercase font-semibold">Method / Action</p>
              <Badge className={selectedLog ? getActionColor(selectedLog.action) : ""}>
                {selectedLog?.action}
              </Badge>
            </div>
            <div className="col-span-2">
              <p className="text-xs text-muted-foreground uppercase font-semibold">Endpoint</p>
              <p className="font-medium bg-white dark:bg-gray-800 p-2 mt-1 rounded border border-gray-100 dark:border-gray-700">{selectedLog?.entityName}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground uppercase font-semibold">Performed By</p>
              <p>{selectedLog?.userId ? `User #${selectedLog.userId}` : "System"}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground uppercase font-semibold">IP Address</p>
              <p>{selectedLog?.ipAddress || "Unknown"}</p>
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="text-sm font-bold flex items-center gap-2">
              <Terminal className="w-4 h-4 text-primary" /> Data Snapshot
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <p className="text-[10px] uppercase font-bold text-muted-foreground ml-1">Before</p>
                <pre className="text-[11px] p-3 bg-gray-950 text-green-400 rounded-xl overflow-auto max-h-48 border border-gray-800 font-mono shadow-inner">
                  {selectedLog?.beforeData ? JSON.stringify(selectedLog.beforeData, null, 2) : "null"}
                </pre>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] uppercase font-bold text-muted-foreground ml-1">After</p>
                <pre className="text-[11px] p-3 bg-gray-950 text-blue-400 rounded-xl overflow-auto max-h-48 border border-gray-800 font-mono shadow-inner">
                  {selectedLog?.afterData ? JSON.stringify(selectedLog.afterData, null, 2) : "null"}
                </pre>
              </div>
            </div>
          </div>
          
          <div className="pt-4 flex justify-end">
            <Button onClick={() => setIsModalOpen(false)} className="rounded-xl px-8">
              Close
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
