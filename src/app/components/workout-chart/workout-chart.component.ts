import { Component, OnInit } from '@angular/core';
import { Chart } from 'chart.js';
import { WorkoutService } from '../../services/workout.service';
import { User } from '../../models/workout.model';

@Component({
  selector: 'app-workout-chart',
  template: `
    <mat-form-field>
      <mat-select placeholder="Select User" (selectionChange)="updateChart($event.value)">
        <mat-option *ngFor="let user of users" [value]="user">{{user.name}}</mat-option>
      </mat-select>
    </mat-form-field>
    <canvas id="workoutChart"></canvas>
  `,
  styles: [`
    canvas {
      max-width: 600px;
      margin: 0 auto;
    }
  `]
})
export class WorkoutChartComponent implements OnInit {
  users: User[] = [];
  chart!: Chart; // Using definite assignment assertion

  constructor(private workoutService: WorkoutService) {}

  ngOnInit() {
    this.workoutService.getUsers().subscribe(users => {
      this.users = users;
      if (users.length > 0) {
        this.createChart(users[0]);
      }
    });
  }

  createChart(user: User) {
    const ctx = document.getElementById('workoutChart') as HTMLCanvasElement;
    const workoutData = this.prepareChartData(user);

    this.chart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: workoutData.types,
        datasets: [{
          label: 'Workout Minutes',
          data: workoutData.minutes,
          backgroundColor: 'rgba(54, 162, 235, 0.6)'
        }]
      },
      options: {
        responsive: true,
        plugins: {
          title: {
            display: true,
            text: `${user.name}'s Workout Progress`
          }
        },
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });
  }

  updateChart(user: User) {
    const workoutData = this.prepareChartData(user);
    if (this.chart) {
      this.chart.data.labels = workoutData.types;
      this.chart.data.datasets[0].data = workoutData.minutes;

      if (this.chart.options?.plugins?.title) {
        this.chart.options.plugins.title.text = `${user.name}'s Workout Progress`;
      }
      this.chart.update();
    }
  }

  prepareChartData(user: User) {
    const types: string[] = [];
    const minutes: number[] = [];

    user.workouts.forEach(workout => {
      const index = types.indexOf(workout.type);
      if (index === -1) {
        types.push(workout.type);
        minutes.push(workout.minutes);
      } else {
        minutes[index] += workout.minutes;
      }
    });

    return { types, minutes };
  }
}

