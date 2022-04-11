import {Job} from './job.model';

export class JobCounts extends Job {
  total: number;
  queued: number;
  running: number;
}
