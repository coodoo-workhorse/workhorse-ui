export class WorkhorseCookie {
  createdAt: Date = new Date();
  updatedAt: Date;

  refreshInterval: number = 60000;

  dashboardPanelLogs: boolean = true;
  dashboardPanelThreads: boolean = false;
  dashboardPanelLastExecutions: boolean = true;
  dashboardPanelExecutionsStatusSummarys: boolean = true;
  dashboardPanelScheduleTimelines: boolean = false;

  jobPanelLastExecutions: boolean = true;
  jobPanelLogs: boolean = false;
  jobPanelExecutions: boolean = true;

  logTextLines: number = 20;

  // TODO @klemens
  // jobsListingPagesize: number = 20;
  // jobsListingSort: string;
  // executionsListingPagesize: number = 20;
  // executionsListingSort: string;
  // logsListingPagesize: number = 20;
  // logsListingSort: string;
}
