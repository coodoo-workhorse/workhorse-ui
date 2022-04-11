import { Component, OnInit } from '@angular/core';
import { CooTableConfig, CooTableService } from '@coodoo/coo-table';
import { Config } from 'protractor';
import { ConfigService } from '../services/config.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'workhorse-ui';
  workhorseVersion: string;
  persistenceName: string;
  persistenceVersion: string;
  randomWorkhorse: number;

  constructor(
    private configService: ConfigService,
    private cooTableService: CooTableService
  ) {
    const defaultCooTableConfig = new CooTableConfig();
    defaultCooTableConfig.translations.filterText.placeholder = '';
    this.cooTableService.setDefaultConfig(defaultCooTableConfig);
    this.randomWorkhorse = Math.floor(Math.random() * 9) + 1;
  }

  ngOnInit() {
    this.configService.getConfig().subscribe((config: Config) => {
      this.workhorseVersion = config.workhorseVersion;
      this.persistenceName = config.workhorseConfig.persistenceName;
      this.persistenceVersion = config.workhorseConfig.persistenceVersion;
    });
  }
}
