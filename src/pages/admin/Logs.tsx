import { useState } from "react";
import { DataTable } from "@/components/ui/DataTable";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  RotateCw, 
  Info, 
  Terminal as TerminalIcon,
  Clock,
  User,
  Activity
} from "lucide-react";

// Hooks & Components
import { useLogs } from "@/hooks/useLogs";
import { LogDetailModal } from "@/components/admin/LogDetailModal";
import type { SystemLog } from "@/types";

export const Logs = () => {
  const { 
    logs, 
    page, 
    totalPages, 
    total, 
    refresh, 
    changePage,
    isLoading,
    isSucceeded
  } = useLogs();

  const [selectedLog, setSelectedLog] = useState<SystemLog | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openLogDetails = (log: SystemLog) => {
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
              <TerminalIcon className="w-3 h-3" /> Monitor application activity and audit trails.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="hidden md:block text-right mr-2">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Total entries</p>
            <p className="text-lg font-bold">{total}</p>
          </div>
          <Button variant="outline" size="sm" onClick={refresh} disabled={isLoading} className="rounded-xl shadow-sm">
            <RotateCw className={`w-4 h-4 mr-2 ${isLoading && logs.length > 0 ? "animate-spin" : ""}`} />
            Refresh
          </Button>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
      <DataTable
        data={logs}
        isLoading={isLoading}
        isSucceeded={isSucceeded}
        loadingMessage={
          <div className="flex flex-col items-center gap-2 py-10">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            <p className="text-muted-foreground font-medium">Fetching logs...</p>
          </div>
        }
        emptyMessage="No logs found."
        onRowClick={openLogDetails}
        pagination={{
          page,
          totalPages,
          onPageChange: changePage,
          isLoading
        }}
        columns={[
          {
            header: "ID",
            className: "font-mono text-xs text-muted-foreground w-16",
            accessor: (log: SystemLog) => <>#{log.id}</>,
          },
          {
            header: "Action",
            accessor: (log: SystemLog) => (
              <Badge variant="outline" className={`font-bold text-[10px] px-2 py-0 ${getActionColor(log.action)}`}>
                {log.action}
              </Badge>
            ),
          },
          {
            header: "Entity / Path",
            className: "font-medium text-sm truncate max-w-[150px]",
            accessor: (log: SystemLog) => (
              <span title={log.entityName}>{log.entityName}</span>
            ),
          },
          {
            header: "User",
            className: "hidden lg:table-cell",
            accessor: (log: SystemLog) => (
              <div className="flex items-center gap-2 text-xs">
                <User className="w-3 h-3 text-muted-foreground" />
                {log.userId ? `User #${log.userId}` : <span className="text-gray-400 italic">System</span>}
              </div>
            ),
          },
          {
            header: "Description",
            className: "text-sm text-gray-600 dark:text-gray-400 max-w-xs truncate",
            accessor: "description",
          },
          {
            header: "Time",
            headerClassName: "text-right",
            className: "text-right text-xs whitespace-nowrap",
            accessor: (log: SystemLog) => (
              <div className="flex flex-col items-end">
                <span className="font-medium">
                  {new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).format(new Date(log.createdAt))}
                </span>
                <span className="text-muted-foreground flex items-center gap-1">
                  <Clock className="w-3 h-3" /> 
                  {new Intl.DateTimeFormat('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false }).format(new Date(log.createdAt))}
                </span>
              </div>
            ),
          },
          {
            header: "",
            className: "w-12",
            accessor: () => (
              <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100 transition-opacity rounded-full">
                <Info className="w-4 h-4 text-primary" />
              </Button>
            ),
          },
        ]}
      />
      </div>

      <LogDetailModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        selectedLog={selectedLog}
        getActionColor={getActionColor}
      />
    </div>
  );
};

