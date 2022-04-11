import { Job } from './job.model';

export class Log {
  id: number;
  jobId: number;
  jobStatus: string;
  status: string;
  byUser: boolean;
  changeParameter: string;
  changeOld: string;
  changeNew: string;
  hostName: string;
  message: string;
  stacktrace: string;
  createdAt: Date;
  updatedAt: Date;
  job: Job;
}
