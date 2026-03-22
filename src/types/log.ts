export interface SystemLog {
  id: number;
  action: string;
  entityName: string;
  description: string;
  userId: number | null;
  ipAddress: string | null;
  beforeData: any | null; // Data snapshots are often dynamic
  afterData: any | null;
  createdAt: string;
}

export interface LoggerState {
  logs: SystemLog[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}
