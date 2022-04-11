export class Execution {
  id: number;
  jobId: number;
  status: string;
  summary: string;
  expiresAt: Date;
  startedAt: Date;
  endedAt: Date;
  priority: boolean;
  plannedFor: Date;
  batchId: number;
  chainId: number;
  duration: number;
  parameters: string;
  failRetry: number;
  failRetryExecutionId: number;
  createdAt: Date;
  updatedAt: Date;
}
