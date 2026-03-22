import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Terminal } from "lucide-react";
import type { SystemLog } from "@/types";

interface LogDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedLog: SystemLog | null;
  getActionColor: (action: string) => string;
}

export const LogDetailModal = ({
  isOpen,
  onClose,
  selectedLog,
  getActionColor
}: LogDetailModalProps) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
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
          <Button onClick={onClose} className="rounded-xl px-8">
            Close
          </Button>
        </div>
      </div>
    </Modal>
  );
};
