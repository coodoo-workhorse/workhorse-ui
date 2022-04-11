import { MemoryCountData } from './memory-count-data.model';

export class Job {
  id: number;
  name: string;
  description: string;
  tags: string[];
  workerClassName: string;
  parametersClassName: string;
  status: string;
  threads: number;
  maxPerMinute: number;
  failRetries: number;
  retryDelay: number;
  minutesUntilCleanUp: number;
  uniqueQueued: boolean;
  schedule: string;
  scheduleDescription: string;
  asynchronous: boolean;
  createdAt: Date;
  updatedAt: Date;
}
