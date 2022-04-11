import { Job } from './job.model';

export class JobExecutionStatusSummary {
  status: string;
  count: number;
  job: Job;
}
