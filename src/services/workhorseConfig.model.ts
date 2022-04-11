export class WorkhorseConfig {
  id: number;
  timeZone: string;
  bufferPollInterval: number;
  bufferPushFallbackPollInterval: number;
  bufferMax: number;
  bufferMin: number;
  minutesUntilCleanup: number;
  executionTimeout: number;
  executionTimeoutStatus: string;
  logChange: string;
  logTimeFormat: string;
  logInfoMarker: string;
  logWarnMarker: string;
  logErrorMarker: string;
  createdAt: Date;
  updatedAt: Date;
  persistenceName: string;
  persistenceVersion: string;
  maxExecutionSummaryLength: number;
}
