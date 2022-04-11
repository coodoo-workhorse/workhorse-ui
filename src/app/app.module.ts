import { HttpClientModule } from '@angular/common/http';
import { APP_INITIALIZER, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CooTableModule } from '@coodoo/coo-table';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { Ng2GoogleChartsModule } from 'ng2-google-charts';
import { CookieModule } from 'ngx-cookie';
import { ToastrModule } from 'ngx-toastr';
import { TrendModule } from 'ngx-trend';
import { JobStore } from 'src/services/job.store';
import { WorkhorseService } from 'src/services/workhorse.service';
import { ConfigService } from '../services/config.service';
import { ExecutionService } from '../services/execution.service';
import { JobService } from '../services/job.service';
import { LogService } from '../services/logs.service';
import { ScheduleService } from '../services/schedule.service';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ConfigComponent } from './pages/config/config.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { CreateExecutionComponent } from './pages/executions/create-execution/create-execution.component';
import { ExecutionComponent } from './pages/executions/execution/execution.component';
import { ExecutionsComponent } from './pages/executions/executions.component';
import { GroupInfoComponent } from './pages/executions/group-info/group-info.component';
import { JobComponent } from './pages/jobs/job/job.component';
import { JobsComponent } from './pages/jobs/jobs.component';
import { LogComponent } from './pages/logs/log/log.component';
import { LogsComponent } from './pages/logs/logs.component';
import { ScheduleComponent } from './pages/schedule/schedule.component';
import { BreadcrumbComponent } from './shared/components/breadcrumb/breadcrumb.component';
import { ExecutionCountPieChartComponent } from './shared/components/execution-count-pie-chart/execution-count-pie-chart.component';
import { ExecutionTimelineComponent } from './shared/components/execution-timeline/execution-timeline.component';
import { InlineEditComponent } from './shared/components/inline-edit/inline-edit.component';
// tslint:disable-next-line: max-line-length
import { JobExecutionStatusSummaryComponent } from './shared/components/job-execution-status-summary/job-execution-status-summary.component';
import { JobExecutionStatusComponent } from './shared/components/job-execution-status/job-execution-status.component';
import { JobMemoryChartComponent } from './shared/components/job-memory-chart/job-memory-chart.component';
import { JobStatusComponent } from './shared/components/job-status/job-status.component';
import { JobSummaryComponent } from './shared/components/job-summary/job-summary.component';
import { JobTagsComponent } from './shared/components/job-tags/job-tags.component';
import { LoadingComponent } from './shared/components/loading/loading.component';
import { LogButtonComponent } from './shared/components/log-button/log-button.component';
import { LogTextComponent } from './shared/components/log-text/log-text.component';
import { ModalComponent } from './shared/components/modal/modal.component';
import { RefreshButtonComponent } from './shared/components/refresh-button/refresh-button.component';
import { SaveButtonComponent } from './shared/components/save-button/save-button.component';
import { ScheduleEditorComponent } from './shared/components/schedule-editor/schedule-editor.component';
import { ScheduleInfoComponent } from './shared/components/schedule-editor/schedule-info/schedule-info.component';
import { ScheduleTimelineComponent } from './shared/components/schedule-timeline/schedule-timeline.component';
import { SwitchComponent } from './shared/components/switch/switch.component';
import { ThreadsComponent } from './shared/components/threads/threads.component';
import { JavaClassNamePipe } from './shared/pipes/java-class-name.pipe';
import { JobDurationPipe } from './shared/pipes/job-duration.pipe';
import { TimeAgoStaticPipe } from './shared/pipes/time-ago-static.pipe';

export function appInit(jobStore: JobStore) {
  return () => jobStore.initJobs();
}

@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    JobStatusComponent,
    JobTagsComponent,
    ExecutionTimelineComponent,
    LoadingComponent,
    RefreshButtonComponent,
    JobMemoryChartComponent,
    JobExecutionStatusComponent,
    CreateExecutionComponent,
    JobSummaryComponent,
    JobsComponent,
    JobComponent,
    ExecutionsComponent,
    ExecutionComponent,
    LogsComponent,
    LogComponent,
    LogTextComponent,
    LogButtonComponent,
    ConfigComponent,
    JobDurationPipe,
    SwitchComponent,
    ThreadsComponent,
    SaveButtonComponent,
    GroupInfoComponent,
    InlineEditComponent,
    TimeAgoStaticPipe,
    JavaClassNamePipe,
    ExecutionCountPieChartComponent,
    ModalComponent,
    ScheduleComponent,
    ScheduleEditorComponent,
    ScheduleInfoComponent,
    ScheduleTimelineComponent,
    JobExecutionStatusSummaryComponent,
    BreadcrumbComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    NgbModule,
    Ng2GoogleChartsModule,
    ToastrModule.forRoot({
      timeOut: 8000,
      positionClass: 'toast-bottom-right',
      preventDuplicates: false,
      enableHtml: true
    }),
    CooTableModule,
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    TrendModule,
    CookieModule.forRoot()
  ],
  providers: [
    WorkhorseService,
    JobService,
    ExecutionService,
    ScheduleService,
    LogService,
    ConfigService,
    JobStore,
      {
        provide: APP_INITIALIZER,
        useFactory: appInit,
        multi: true,
        deps: [JobStore]
      }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
