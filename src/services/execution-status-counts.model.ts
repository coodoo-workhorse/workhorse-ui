export class ExecutionStatusCounts {
  jobId: number;
  from: Date;
  to: Date;
  total: number;
  planned: number;
  queued: number;
  running: number;
  finished: number;
  failed: number;
  aborted: number;
  // averageDuration: number;
}
