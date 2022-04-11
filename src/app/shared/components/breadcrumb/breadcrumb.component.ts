import { Component } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { JobStore } from 'src/services/job.store';
import { Breadcrumb } from './breadcrumb.interface';

@Component({
  selector: 'app-breadcrumb',
  templateUrl: './breadcrumb.component.html',
  styles: ['.breadcrumbs {margin-top: -10px;}']
})
export class BreadcrumbComponent {
  breadcrumbs: Breadcrumb[] = [];

  // Map die für dynamische RouteParams eine Map mit Klartextnamen speichert, zum Übersetzen der Params
  dynamicBreadcrumbValuesMap = new Map();

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private jobStore: JobStore
  ) {
    this.jobStore.jobs$.subscribe((jobs) => {
      if (jobs.length !== 0) {
        const jobMap = new Map();
        for (const job of jobs) {
          jobMap.set(job.id, job.name);
        }
        // Der RouteParam 'jobId' ist der key für die JobMap
        this.dynamicBreadcrumbValuesMap.set('jobId', jobMap);
        // Breadcrumb neu bauen mit übersetzbaren Job-Daten
        this.breadcrumbs = [];
        this.buildBreadcrumb(this.activatedRoute);
      }
    });

    this.router.events.subscribe((ev) => {
      if (ev instanceof NavigationEnd) {
        this.breadcrumbs = [];
        this.buildBreadcrumb(this.activatedRoute);
      }
    });
  }

  buildBreadcrumb(currentAR: ActivatedRoute): void {
    // Für jede Route, die einen definierten breadcrumb hat ...
    if (currentAR.snapshot.data.breadcrumb && !currentAR.snapshot.data.breadcrumbIgnore) {
      // ... nehme, falls vorhaden, vom letzten Breadcrumb den bisherigen Path ...
      const lastBCLink =
        this.breadcrumbs.length !== 0
          ? this.breadcrumbs[this.breadcrumbs.length - 1].link
          : '';

      // ... füge den aktuellen hinzu ...
      let currentBCLink = '';
      let currentBCLabel = '';
      if (currentAR.routeConfig.path.startsWith(':')) {
        // ... bei dynamischen Routen ...
        const routeParamName = currentAR.routeConfig.path.substring(1);
        const routeParamValue = currentAR.snapshot.params[routeParamName];
        currentBCLink = routeParamValue;
        // ... entweder den Klartextnamen der Domäne über die Map ...
        const routeParamTranslation = this.checkRouteParamForTranslation(routeParamName, +routeParamValue);
        if (routeParamTranslation) {
          currentBCLabel = routeParamTranslation;
        } else {
          // ... oder die ID als Link und Label ...
          currentBCLabel = currentAR.snapshot.params[routeParamName];
        }
      } else {
        // ... oder, bei statischen Routen, aus der RouteConfig ...
        currentBCLink = currentAR.routeConfig.path || '';
        currentBCLabel = currentAR.snapshot.data.breadcrumb.label;
      }

      // ... füge den aktuellen Breadcrumb ins Breadcrumbs-Array hinzu
      this.breadcrumbs.push({
        label: currentBCLabel,
        link: lastBCLink + '/' + currentBCLink,
      } as Breadcrumb);
    }

    // ... und wiederhole das ganze rekursiv für alle folgenden RouteChildren
    if (currentAR.firstChild !== null) {
      this.buildBreadcrumb(currentAR.firstChild);
    }
  }

  checkRouteParamForTranslation(paramName: string, paramValue: number) {
    const idTranslationMap = this.dynamicBreadcrumbValuesMap.get(paramName);
    if (idTranslationMap) {
      return idTranslationMap.get(paramValue);
    }
  }
}
