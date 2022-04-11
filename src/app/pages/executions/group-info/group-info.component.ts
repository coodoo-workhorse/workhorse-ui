import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GoogleChartInterface } from 'ng2-google-charts';
import { ExecutionGroupInfo } from 'src/services/execution-group-info.model';
import { Job } from 'src/services/job.model';
import { ExecutionService } from '../../../../services/execution.service';
import { JobStore } from '../../../../services/job.store';

@Component({
  selector: 'app-group-info',
  templateUrl: './group-info.component.html',
  styleUrls: ['./group-info.component.css']
})
export class GroupInfoComponent implements OnInit {
  batchId: number;
  chainId: number;
  groupId: number;
  jobId: number;
  executionId: number;

  loading: boolean;
  reloading: boolean;
  job: Job;
  groupInfo: ExecutionGroupInfo;
  pieChart: GoogleChartInterface;
  timelineChart: GoogleChartInterface;
  timelineChart2: GoogleChartInterface;
  timelineChart3: GoogleChartInterface;

  constructor(private route: ActivatedRoute, private jobStore: JobStore, private executionService: ExecutionService) {}

  ngOnInit() {
    this.loading = true;
    this.jobId = this.route.snapshot.params.jobId;
    this.executionId = this.route.snapshot.params.executionId;
    const path = this.route.snapshot.routeConfig.path;

    if (path.endsWith('chain')) {
      this.chainId = this.executionId;
    } else if (path.endsWith('batch')) {
      this.batchId = this.executionId;
    }
    this.jobStore.jobs$.subscribe(jobs => {
      this.job = this.jobStore.getJob(this.jobId);
      this.init();
    });
  }

  init() {
    this.reloading = true;
    if (this.batchId) {
      this.groupId = this.batchId;
      this.executionService.getBatchInfo(this.jobId, this.batchId).subscribe((groupInfo: ExecutionGroupInfo) => {
        this.groupInfo = groupInfo;
        this.createPieChart(groupInfo);
        if (groupInfo.startedAt) {
          // this.createBatchTimeline(groupInfo);
          // this.createBatchTimeline2(groupInfo);
          this.createBatchTimeline3(groupInfo);
        }
        this.loading = false;
        this.reloading = false;
      });
    }
    if (this.chainId) {
      this.groupId = this.chainId;
      this.executionService.getChainInfo(this.jobId, this.chainId).subscribe((groupInfo: ExecutionGroupInfo) => {
        this.groupInfo = groupInfo;
        this.createPieChart(groupInfo);
        if (groupInfo.startedAt) {
          // this.createChainTimeline(groupInfo);
          // this.createChainTimeline2(groupInfo);
          this.createChainTimeline3(groupInfo);
        }
        this.loading = false;
        this.reloading = false;
      });
    }
  }

  createPieChart(groupInfo: ExecutionGroupInfo) {
    this.pieChart = {
      chartType: 'PieChart',
      dataTable: [
        ['Status', 'Count'],
        ['QUEUED', groupInfo.queued],
        ['RUNNING', groupInfo.running],
        ['FINISHED', groupInfo.finished],
        ['FAILED', groupInfo.failed],
        ['ABORTED', groupInfo.aborted]
      ],
      options: {
        legend: 'none',
        width: 200,
        height: 200,
        chartArea: { width: '90%', height: '90%' },
        backgroundColor: 'transparent',
        colors: [
          '#209dd7', // Queued
          '#faa31b', // Running
          '#5cb85c', // Finished
          '#d9534f', // Failed
          '#777777' // Aborted
        ]
      }
    };
  }

  createChainTimeline(groupInfo: ExecutionGroupInfo) {
    const duration = groupInfo.duration / (groupInfo.size - groupInfo.queued);
    let millis = groupInfo.startedAt ? new Date(groupInfo.startedAt).getTime() : new Date().getTime();
    const status = [];
    const colors = [];
    const tableData = [];

    tableData.push(['Status', 'Started', 'Ended']);
    for (const info of groupInfo.executionInfos) {
      switch (info.status) {
        case 'QUEUED':
          if (!status.includes('QUEUED')) {
            status.push('QUEUED');
            colors.push('#209dd7');
          }
          info.startedAt = new Date(millis);
          millis = info.startedAt.getTime() + duration;
          info.endedAt = new Date(millis);
          break;
        case 'ABORTED':
          if (!status.includes('ABORTED')) {
            status.push('ABORTED');
            colors.push('#777777');
          }
          info.startedAt = new Date(millis);
          millis = info.startedAt.getTime() + duration;
          info.endedAt = new Date(millis);
          break;
        case 'RUNNING':
          if (!status.includes('RUNNING')) {
            status.push('RUNNING');
            colors.push('#faa31b');
          }
          info.startedAt = new Date(millis);
          millis = info.startedAt.getTime() + duration;
          info.endedAt = new Date(millis);
          break;
        case 'FINISHED':
          if (!status.includes('FINISHED')) {
            status.push('FINISHED');
            colors.push('#5cb85c');
          }
          info.startedAt = new Date(info.startedAt);
          info.endedAt = new Date(info.endedAt);
          millis = info.endedAt.getTime();
          break;
        case 'FAILED':
          if (!status.includes('FAILED')) {
            status.push('FAILED');
            colors.push('#d9534f');
          }
          info.startedAt = new Date(info.startedAt);
          info.endedAt = new Date(info.endedAt);
          millis = info.endedAt.getTime();
          break;
      }
      tableData.push([info.status, info.startedAt, info.endedAt]);
    }
    this.timelineChart = {
      chartType: 'Timeline',
      dataTable: tableData,
      options: {
        timeline: { colorByRowLabel: true },
        legend: 'none',
        width: '100%',
        height: colors.length * 40 + 60,
        backgroundColor: 'transparent',
        colors: '${colors}',
        hAxis: { format: 'HH:mm:ss' }
      }
    };
  }
  createChainTimeline2(groupInfo: ExecutionGroupInfo) {
    const duration = groupInfo.duration / (groupInfo.size - groupInfo.queued);
    let millis = groupInfo.startedAt ? new Date(groupInfo.startedAt).getTime() : new Date().getTime();
    const status = [];
    const colors = [];
    const tableData = [];

    tableData.push(['Status', 'ID', 'Started', 'Ended']);
    for (const info of groupInfo.executionInfos) {
      switch (info.status) {
        case 'QUEUED':
          if (!status.includes('QUEUED')) {
            status.push('QUEUED');
            colors.push('#209dd7');
          }
          info.startedAt = new Date(millis);
          millis = info.startedAt.getTime() + duration;
          info.endedAt = new Date(millis);
          break;
        case 'ABORTED':
          if (!status.includes('ABORTED')) {
            status.push('ABORTED');
            colors.push('#777777');
          }
          info.startedAt = new Date(millis);
          millis = info.startedAt.getTime() + duration;
          info.endedAt = new Date(millis);
          break;
        case 'RUNNING':
          if (!status.includes('RUNNING')) {
            status.push('RUNNING');
            colors.push('#faa31b');
          }
          info.startedAt = new Date(millis);
          millis = info.startedAt.getTime() + duration;
          info.endedAt = new Date(millis);
          break;
        case 'FINISHED':
          if (!status.includes('FINISHED')) {
            status.push('FINISHED');
            colors.push('#5cb85c');
          }
          info.startedAt = new Date(info.startedAt);
          info.endedAt = new Date(info.endedAt);
          millis = info.endedAt.getTime();
          break;
        case 'FAILED':
          if (!status.includes('FAILED')) {
            status.push('FAILED');
            colors.push('#d9534f');
          }
          info.startedAt = new Date(info.startedAt);
          info.endedAt = new Date(info.endedAt);
          millis = info.endedAt.getTime();
          break;
      }
      tableData.push([info.status, 'ID ' + info.id, info.startedAt, info.endedAt]);
    }
    this.timelineChart2 = {
      chartType: 'Timeline',
      dataTable: tableData,
      options: {
        timeline: { colorByRowLabel: true },
        legend: 'none',
        width: '100%',
        height: colors.length * 40 + 60,
        backgroundColor: 'transparent',
        colors: '${colors}',
        hAxis: { format: 'HH:mm:ss' }
      }
    };
  }
  createChainTimeline3(groupInfo: ExecutionGroupInfo) {
    const duration = groupInfo.duration / (groupInfo.size - groupInfo.queued);
    let millis = groupInfo.startedAt ? new Date(groupInfo.startedAt).getTime() : new Date().getTime();
    const status = [];
    const colors = [];
    const tableData = [];

    tableData.push(['Chain', 'Status', 'Started', 'Ended']);
    for (const info of groupInfo.executionInfos) {
      switch (info.status) {
        case 'QUEUED':
          if (!status.includes('QUEUED')) {
            status.push('QUEUED');
            colors.push('#209dd7');
          }
          info.startedAt = new Date(millis);
          millis = info.startedAt.getTime() + duration;
          info.endedAt = new Date(millis);
          break;
        case 'ABORTED':
          if (!status.includes('ABORTED')) {
            status.push('ABORTED');
            colors.push('#777777');
          }
          info.startedAt = new Date(millis);
          millis = info.startedAt.getTime() + duration;
          info.endedAt = new Date(millis);
          break;
        case 'RUNNING':
          if (!status.includes('RUNNING')) {
            status.push('RUNNING');
            colors.push('#faa31b');
          }
          info.startedAt = new Date(millis);
          millis = info.startedAt.getTime() + duration;
          info.endedAt = new Date(millis);
          break;
        case 'FINISHED':
          if (!status.includes('FINISHED')) {
            status.push('FINISHED');
            colors.push('#5cb85c');
          }
          info.startedAt = new Date(info.startedAt);
          info.endedAt = new Date(info.endedAt);
          millis = info.endedAt.getTime();
          break;
        case 'FAILED':
          if (!status.includes('FAILED')) {
            status.push('FAILED');
            colors.push('#d9534f');
          }
          info.startedAt = new Date(info.startedAt);
          info.endedAt = new Date(info.endedAt);
          millis = info.endedAt.getTime();
          break;
      }
      tableData.push(['Chain', info.status, info.startedAt, info.endedAt]);
    }
    this.timelineChart3 = {
      chartType: 'Timeline',
      dataTable: tableData,
      options: {
        legend: 'none',
        width: '100%',
        height: 40 + 60,
        backgroundColor: 'transparent',
        colors: '${colors}',
        hAxis: { format: 'HH:mm:ss' }
      }
    };
  }

  createBatchTimeline(groupInfo: ExecutionGroupInfo) {
    const duration = groupInfo.duration / (groupInfo.size - groupInfo.queued);
    let millis = groupInfo.startedAt ? new Date(groupInfo.startedAt).getTime() : new Date().getTime();
    const status = [];
    const colors = [];
    const tableData = [];

    let threadCount = 1;
    let lastFailed = false;
    let start;

    tableData.push(['Status', 'Started', 'Ended']);
    for (const info of groupInfo.executionInfos) {
      switch (info.status) {
        case 'QUEUED':
          if (!status.includes('QUEUED')) {
            status.push('QUEUED');
            colors.push('#209dd7');
          }
          start = millis;
          if (lastFailed) {
            info.startedAt = new Date(start + this.job.retryDelay);
            info.endedAt = new Date(start + duration + this.job.retryDelay);
            if (threadCount === this.job.threads) {
              millis = start + duration + this.job.retryDelay;
            } else {
              millis = start + this.job.retryDelay;
            }
            lastFailed = false;
          } else {
            info.startedAt = new Date(start);
            info.endedAt = new Date(start + duration);
            if (threadCount === this.job.threads) {
              millis = start + duration;
            } else {
              millis = start;
            }
          }
          threadCount++;
          if (threadCount > this.job.threads) {
            threadCount = 1;
          }
          break;
        case 'ABORTED':
          if (!status.includes('ABORTED')) {
            status.push('ABORTED');
            colors.push('#777777');
          }
          start = millis;
          if (lastFailed) {
            info.startedAt = new Date(start + this.job.retryDelay);
            info.endedAt = new Date(start + duration + this.job.retryDelay);
            if (threadCount === this.job.threads) {
              millis = start + duration + this.job.retryDelay;
            } else {
              millis = start + this.job.retryDelay;
            }
            lastFailed = false;
          } else {
            info.startedAt = new Date(start);
            info.endedAt = new Date(start + duration);
            if (threadCount === this.job.threads) {
              millis = start + duration;
            } else {
              millis = start;
            }
          }
          threadCount++;
          if (threadCount > this.job.threads) {
            threadCount = 1;
          }
          break;
        case 'RUNNING':
          if (!status.includes('RUNNING')) {
            status.push('RUNNING');
            colors.push('#faa31b');
          }
          info.startedAt = new Date(millis);
          millis = info.startedAt.getTime() + duration;
          let theEnd = groupInfo.endedAt;
          if (!theEnd) {
            theEnd = groupInfo.expectedEnd;
          }
          if (!theEnd) {
            theEnd = new Date(millis);
          }
          info.endedAt = new Date(theEnd);
          break;
        case 'FINISHED':
          if (!status.includes('FINISHED')) {
            status.push('FINISHED');
            colors.push('#5cb85c');
          }
          info.startedAt = new Date(info.startedAt);
          info.endedAt = new Date(info.endedAt);
          millis = info.endedAt.getTime();
          break;
        case 'FAILED':
          if (!status.includes('FAILED')) {
            status.push('FAILED');
            colors.push('#d9534f');
          }
          info.startedAt = new Date(info.startedAt);
          info.endedAt = new Date(info.endedAt);
          millis = info.endedAt.getTime();
          lastFailed = true;
          break;
      }
      tableData.push([info.status, info.startedAt, info.endedAt]);
    }
    this.timelineChart = {
      chartType: 'Timeline',
      dataTable: tableData,
      options: {
        timeline: { colorByRowLabel: true },
        legend: 'none',
        width: '100%',
        height: colors.length * 25 * this.job.threads + 60,
        backgroundColor: 'transparent',
        colors: '${colors}',
        hAxis: { format: 'HH:mm:ss' }
      }
    };
  }

  createBatchTimeline2(groupInfo: ExecutionGroupInfo) {
    const duration = groupInfo.duration / (groupInfo.size - groupInfo.queued);
    let millis = groupInfo.startedAt ? new Date(groupInfo.startedAt).getTime() : new Date().getTime();
    const status = [];
    const colors = [];
    const tableData = [];

    let threadCount = 1;
    let lastFailed = false;
    let start;

    tableData.push(['Status', 'ID', 'Started', 'Ended']);
    for (const info of groupInfo.executionInfos) {
      switch (info.status) {
        case 'QUEUED':
          if (!status.includes('QUEUED')) {
            status.push('QUEUED');
            colors.push('#209dd7');
          }
          start = millis;
          if (lastFailed) {
            info.startedAt = new Date(start + this.job.retryDelay);
            info.endedAt = new Date(start + duration + this.job.retryDelay);
            if (threadCount === this.job.threads) {
              millis = start + duration + this.job.retryDelay;
            } else {
              millis = start + this.job.retryDelay;
            }
            lastFailed = false;
          } else {
            info.startedAt = new Date(start);
            info.endedAt = new Date(start + duration);
            if (threadCount === this.job.threads) {
              millis = start + duration;
            } else {
              millis = start;
            }
          }
          threadCount++;
          if (threadCount > this.job.threads) {
            threadCount = 1;
          }
          break;
        case 'ABORTED':
          if (!status.includes('ABORTED')) {
            status.push('ABORTED');
            colors.push('#777777');
          }
          start = millis;
          if (lastFailed) {
            info.startedAt = new Date(start + this.job.retryDelay);
            info.endedAt = new Date(start + duration + this.job.retryDelay);
            if (threadCount === this.job.threads) {
              millis = start + duration + this.job.retryDelay;
            } else {
              millis = start + this.job.retryDelay;
            }
            lastFailed = false;
          } else {
            info.startedAt = new Date(start);
            info.endedAt = new Date(start + duration);
            if (threadCount === this.job.threads) {
              millis = start + duration;
            } else {
              millis = start;
            }
          }
          threadCount++;
          if (threadCount > this.job.threads) {
            threadCount = 1;
          }
          break;
        case 'RUNNING':
          if (!status.includes('RUNNING')) {
            status.push('RUNNING');
            colors.push('#faa31b');
          }
          info.startedAt = new Date(millis);
          millis = info.startedAt.getTime() + duration;
          let theEnd = groupInfo.endedAt;
          if (!theEnd) {
            theEnd = groupInfo.expectedEnd;
          }
          if (!theEnd) {
            theEnd = new Date(millis);
          }
          info.endedAt = new Date(theEnd);
          break;
        case 'FINISHED':
          if (!status.includes('FINISHED')) {
            status.push('FINISHED');
            colors.push('#5cb85c');
          }
          info.startedAt = new Date(info.startedAt);
          info.endedAt = new Date(info.endedAt);
          millis = info.endedAt.getTime();
          break;
        case 'FAILED':
          if (!status.includes('FAILED')) {
            status.push('FAILED');
            colors.push('#d9534f');
          }
          info.startedAt = new Date(info.startedAt);
          info.endedAt = new Date(info.endedAt);
          millis = info.endedAt.getTime();
          break;
      }
      tableData.push([info.status, 'ID ' + info.id, info.startedAt, info.endedAt]);
    }
    this.timelineChart2 = {
      chartType: 'Timeline',
      dataTable: tableData,
      options: {
        timeline: { colorByRowLabel: true },
        legend: 'none',
        width: '100%',
        height: colors.length * 25 * this.job.threads + 60,
        backgroundColor: 'transparent',
        colors: '${colors}',
        hAxis: { format: 'HH:mm:ss' }
      }
    };
  }

  createBatchTimeline3(groupInfo: ExecutionGroupInfo) {
    const duration = groupInfo.duration / (groupInfo.size - groupInfo.queued);
    let millis = groupInfo.startedAt ? new Date(groupInfo.startedAt).getTime() : new Date().getTime();
    const status = [];
    const colors = [];
    const tableData = [];

    let threadCount = 1;
    let lastFailed = false;
    let start;

    tableData.push(['Status', 'Status', 'Started', 'Ended']);
    for (const info of groupInfo.executionInfos) {
      switch (info.status) {
        case 'QUEUED':
          if (!status.includes('QUEUED')) {
            status.push('QUEUED');
            colors.push('#209dd7');
          }
          start = millis;
          if (lastFailed) {
            info.startedAt = new Date(start + this.job.retryDelay);
            info.endedAt = new Date(start + duration + this.job.retryDelay);
            if (threadCount === this.job.threads) {
              millis = start + duration + this.job.retryDelay;
            } else {
              millis = start + this.job.retryDelay;
            }
            lastFailed = false;
          } else {
            info.startedAt = new Date(start);
            info.endedAt = new Date(start + duration);
            if (threadCount === this.job.threads) {
              millis = start + duration;
            } else {
              millis = start;
            }
          }
          threadCount++;
          if (threadCount > this.job.threads) {
            threadCount = 1;
          }
          break;
        case 'ABORTED':
          if (!status.includes('ABORTED')) {
            status.push('ABORTED');
            colors.push('#777777');
          }
          start = millis;
          if (lastFailed) {
            info.startedAt = new Date(start + this.job.retryDelay);
            info.endedAt = new Date(start + duration + this.job.retryDelay);
            if (threadCount === this.job.threads) {
              millis = start + duration + this.job.retryDelay;
            } else {
              millis = start + this.job.retryDelay;
            }
            lastFailed = false;
          } else {
            info.startedAt = new Date(start);
            info.endedAt = new Date(start + duration);
            if (threadCount === this.job.threads) {
              millis = start + duration;
            } else {
              millis = start;
            }
          }
          threadCount++;
          if (threadCount > this.job.threads) {
            threadCount = 1;
          }
          break;
        case 'RUNNING':
          if (!status.includes('RUNNING')) {
            status.push('RUNNING');
            colors.push('#faa31b');
          }
          info.startedAt = new Date(millis);
          millis = info.startedAt.getTime() + duration;
          let theEnd = groupInfo.endedAt;
          if (!theEnd) {
            theEnd = groupInfo.expectedEnd;
          }
          if (!theEnd) {
            theEnd = new Date(millis);
          }
          info.endedAt = new Date(theEnd);
          break;
        case 'FINISHED':
          if (!status.includes('FINISHED')) {
            status.push('FINISHED');
            colors.push('#5cb85c');
          }
          info.startedAt = new Date(info.startedAt);
          info.endedAt = new Date(info.endedAt);
          millis = info.endedAt.getTime();
          break;
        case 'FAILED':
          if (!status.includes('FAILED')) {
            status.push('FAILED');
            colors.push('#d9534f');
          }
          info.startedAt = new Date(info.startedAt);
          info.endedAt = new Date(info.endedAt);
          millis = info.endedAt.getTime();
          break;
      }
      tableData.push(['Batch', info.status, info.startedAt, info.endedAt]);
    }
    this.timelineChart3 = {
      chartType: 'Timeline',
      dataTable: tableData,
      options: {
        legend: 'none',
        width: '100%',
        chartArea: { width: '100%', height: '100%' },
        height: 42 * this.job.threads + 60,
        backgroundColor: 'transparent',
        colors: '${colors}',
        hAxis: { format: 'HH:mm:ss' }
      }
    };
  }
}
