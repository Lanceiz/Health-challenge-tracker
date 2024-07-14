import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Chart, ChartConfiguration } from 'chart.js/auto';
import { WorkoutService } from '../../services/workout.service';
import { User } from '../../models/workout.model';

@Component({
  selector: 'app-workout-chart',
  templateUrl: './workout-chart.component.html',
})
export class WorkoutChartComponent implements OnInit {
  @ViewChild('workoutChart') chartCanvas!: ElementRef<HTMLCanvasElement>;
  
  users: User[] = [];
  chart?: Chart;

  constructor(private workoutService: WorkoutService) {}

  ngOnInit() {
    this.workoutService.getUsers().subscribe(users => {
      this.users = users;
      if (users.length > 0) {
        setTimeout(() => this.createChart(users[0]), 0);
      }
    });
  }

  createChart(user: User) {
    if (this.chartCanvas) {
      const ctx = this.chartCanvas.nativeElement.getContext('2d');
      if (ctx) {
        const workoutData = this.prepareChartData(user);
        
        const config: ChartConfiguration = {
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
        };

        this.chart = new Chart(ctx, config);
      }
    }
  }

  updateChart(user: User) {
    const workoutData = this.prepareChartData(user);
    if (this.chart) {
      this.chart.data.labels = workoutData.types;
      this.chart.data.datasets[0].data = workoutData.minutes;
      this.chart.options.plugins!.title!.text = `${user.name}'s Workout Progress`;
      this.chart.update();
    } else {
      this.createChart(user);
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
