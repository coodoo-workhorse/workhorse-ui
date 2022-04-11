export class ExecutionInfo {
  id: number;
  status: string;
  duration: number;
  startedAt: Date;
  endedAt: Date;
  failRetryExecutionId: number;
}
