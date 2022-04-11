import {ExecutionInfo} from './execution-info.model';

export class ExecutionGroupInfo {
  id: number;
  status: string;
  size: number;
  queued: number;
  running: number;
  finished: number;
  failed: number;
  aborted: number;
  startedAt: Date;
  endedAt: Date;
  progress: number;
  duration: number;
  expectedEnd: Date;
  expectedDuration: number;
  executionInfos: ExecutionInfo[] = [];
}
