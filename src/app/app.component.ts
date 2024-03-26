import { Component } from '@angular/core';
import { AngularSplitModule, IAreaSize, IOutputData } from 'angular-split';

interface IConfig {
  columns: IColumn[]
  disabled: boolean
}

interface IColumn {
  visible: boolean
  size: IAreaSize
  rows: IRow[]
}

interface IRow {
  visible: boolean
  size: IAreaSize
  type: string
}

const defaultConfig: IConfig = {
  columns: [
    {
      visible: true,
      size: 25,
      rows: [
        { visible: true, size: 25, type: 'A' },
        { visible: true, size: 75, type: 'B' },
      ],
    },
    {
      visible: true,
      size: 50,
      rows: [
        { visible: true, size: 60, type: 'controls' },
        { visible: true, size: 40, type: 'C' },
      ],
    },
    {
      visible: true,
      size: 25,
      rows: [
        { visible: true, size: 20, type: 'D' },
        { visible: true, size: 30, type: 'E' },
        { visible: true, size: 50, type: 'F' },
      ],
    },
  ],
  disabled: false,
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [AngularSplitModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  private readonly localStorageName = 'angular-split-ws';
  readonly title = 'Fullscreen workspace saved in localStorage';
  readonly description = 'All areas size and visibility are saved to localStorage. Toggle areas visibility using following buttons:';
  config!: IConfig;


  // Save config to localStorage in the client browser
  private saveLocalStorage(): void {
    localStorage.setItem(this.localStorageName, JSON.stringify(this.config))
  }


  // Load the config from localStorage else start with default config
  ngOnInit(): void {
    const config = localStorage.getItem(this.localStorageName);
    if (config) this.config = JSON.parse(config);
    else this.resetConfig();
  }


  // Load the default config and clear localStorage
  resetConfig(): void {
    this.config = structuredClone(defaultConfig)
    localStorage.removeItem(this.localStorageName)
  }


  // Event fired when user stops dragging a gutter
  onDragEnd(columnindex: number, e: IOutputData): void {
    // Column dragged
    if (columnindex === -1) {
      // Set size for all visible columns
      this.config.columns
        .filter((c) => c.visible === true)
        .forEach((column, index) => (column.size = e.sizes[index]))
    }
    // Row dragged
    else {
      // Set size for all visible rows from specified column
      this.config.columns[columnindex].rows
        .filter((r) => r.visible === true)
        .forEach((row, index) => (row.size = e.sizes[index]))
    }
    this.saveLocalStorage()
  }


  // Toggle between resizable and non-resizable option. Save config.
  toggleDisabled(): void {
    this.config.disabled = !this.config.disabled
    this.saveLocalStorage()
  }


  // Refresh columns visibility based on inside rows visibilities (If no rows: hide column)
  refreshColumnVisibility(): void {
    this.config.columns.forEach((column) => {
      column.visible = column.rows.some((row) => row.visible === true)
    })
    this.saveLocalStorage()
  }

}
