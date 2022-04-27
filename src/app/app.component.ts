import { Component, OnInit } from '@angular/core';
import { CooTableConfig, CooTableService } from '@coodoo/coo-table';
import { Config } from 'protractor';
import packageJson from '../../package.json';
import { ConfigService } from '../services/config.service';
import { StatusService } from '../services/status.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'workhorse-ui';
  version: string = packageJson.version;
  workhorseVersion: string;
  persistenceName: string;
  persistenceVersion: string;

  constructor(private configService: ConfigService, private cooTableService: CooTableService, public statusService: StatusService) {
    const defaultCooTableConfig = new CooTableConfig();
    defaultCooTableConfig.translations.filterText.placeholder = '';
    this.cooTableService.setDefaultConfig(defaultCooTableConfig);
  }

  ngOnInit() {
    this.configService.getConfig().subscribe((config: Config) => {
      this.workhorseVersion = config.workhorseVersion;
      this.persistenceName = config.workhorseConfig.persistenceName;
      this.persistenceVersion = config.workhorseConfig.persistenceVersion;
    });
  }
}
