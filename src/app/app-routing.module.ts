import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ConfigComponent } from './pages/config/config.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { ExecutionComponent } from './pages/executions/execution/execution.component';
import { ExecutionsComponent } from './pages/executions/executions.component';
import { GroupInfoComponent } from './pages/executions/group-info/group-info.component';
import { JobComponent } from './pages/jobs/job/job.component';
import { JobsComponent } from './pages/jobs/jobs.component';
import { LogComponent } from './pages/logs/log/log.component';
import { LogsComponent } from './pages/logs/logs.component';
import { ScheduleComponent } from './pages/schedule/schedule.component';

const routes: Routes = [
  {
    path: '',
    component: DashboardComponent,
    pathMatch: 'full'
  },
  {
    path: 'jobs',
    data: {
      breadcrumb: {
        label: 'Jobs',
      },
    },
    children: [
      {
        path: '',
        component: JobsComponent,
        data: {
          breadcrumbIgnore: true
        }
      },
      {
        path: ':jobId',
        children: [
          {
            path: '',
            component: JobComponent,
            data: {
              breadcrumbIgnore: true
            }
          },
          {
            path: 'executions',
            component: ExecutionsComponent,
            data: {
              breadcrumb: {
                label: 'Executions'
              }
            }
          },
          {
            path: 'logs',
            component: LogsComponent
          },
          {
            path: 'executions',
            data: {
              breadcrumb: {
                label: 'Executions'
              }
            },
            children: [
              {
                path: ':executionId',
                children: [
                  {
                    path: '',
                    component: ExecutionComponent,
                    data: {
                      breadcrumbIgnore: true
                    },
                  },
                  {
                    path: 'batch',
                    component: GroupInfoComponent,
                    data: {
                      breadcrumb: {
                        label: 'Batch'
                      }
                    },
                  },
                  {
                    path: 'chain',
                    component: GroupInfoComponent,
                    data: {
                      breadcrumb: {
                        label: 'Chain'
                      }
                    },
                  },
                ]
              }
            ]
          },
        ]
      },
    ]
  },
  {
    path: 'executions',
    data: {
      breadcrumb: {
        label: 'Executions'
      }
    },
    children: [
      {
        path: '',
        component: ExecutionsComponent,
        data: {
          breadcrumbIgnore: true
        },
        children: [
          {
            path: ':executionId',
            component: ExecutionComponent,
          }
        ]
      }
    ]
  },
  {
    path: 'logs',
    data: {
      breadcrumb: {
        label: 'Logs'
      }
    },
    children: [
      {
        path: '',
        component: LogsComponent,
        data: {
          breadcrumbIgnore: true
        },
      },
      {
        path: ':logId',
        component: LogComponent
      },
    ]
  },
  {
    path: 'schedules',
    component: ScheduleComponent,
    data: {
      breadcrumb: {
        label: 'Schedules'
      }
    },
  },
  {
    path: 'config',
    component: ConfigComponent,
    data: {
      breadcrumb: {
        label: 'Config'
      }
    },
  },
];

@NgModule({ imports: [RouterModule.forRoot(routes)], exports: [RouterModule] })
export class AppRoutingModule {
}
