export interface SystemLog {
  id: number;
  action: string;
  entityName: string;
  description: string;
  userId: number | null;
  ipAddress: string | null;
  beforeData: unknown | null;
  afterData: unknown | null;
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
