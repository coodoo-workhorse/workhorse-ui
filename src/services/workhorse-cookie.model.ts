export class WorkhorseCookie {
  createdAt: Date = new Date();
  updatedAt: Date;

  refreshInterval: number = 0;

  dashboardPanelLogs: boolean = true;
  dashboardPanelThreads: boolean = false;
  dashboardPanelLastExecutions: boolean = true;
  dashboardPanelExecutionsStatusSummarys: boolean = true;
  dashboardPanelScheduleTimelines: boolean = false;

  jobPanelLastExecutions: boolean = true;
  jobPanelLogs: boolean = false;
  jobPanelExecutions: boolean = true;

  logTextLines: number = 20;

  jobsListingLimit: number = 20;
  jobsListingSort: string = '';
  executionsListingLimit: number = 20;
  executionsListingSort: string = '';
  logsListingLimit: number = 20;
  logsListingSort: string = '';
}
