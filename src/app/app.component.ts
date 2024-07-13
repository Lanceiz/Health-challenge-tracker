import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  template: `
    <mat-toolbar color="primary">
      <span>Health Challenge Tracker</span>
    </mat-toolbar>
    <div class="container">
      <app-workout-form></app-workout-form>
      <app-workout-list></app-workout-list>
      <app-workout-chart></app-workout-chart>
    </div>
  `,
  styles: [`
    .container {
      padding: 20px;
    }
  `], 
})
export class AppComponent { }
