import { Component, OnInit, ViewChild } from '@angular/core';
import { Observable } from 'rxjs';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { WorkoutService } from '../../services/workout.service';
import { User } from '../../models/workout.model';

@Component({
  selector: 'app-workout-list',
  templateUrl: './workout-list.component.html',
})
export class WorkoutListComponent implements OnInit {
  displayedColumns: string[] = ['name', 'workouts', 'numberOfWorkouts', 'totalMinutes'];
  dataSource!: MatTableDataSource<User>; // Use definite assignment assertion
  users$: Observable<User[]>;

  @ViewChild(MatPaginator, {static: true}) paginator!: MatPaginator; // Use definite assignment assertion

  constructor(private workoutService: WorkoutService) {
    this.users$ = this.workoutService.getUsers();
  }

  ngOnInit() {
    this.users$.subscribe(users => {
      this.dataSource = new MatTableDataSource(users);
      this.dataSource.paginator = this.paginator;
    });
  }

  onFilterKeyup(event: KeyboardEvent) {
    const inputElement = event.target as HTMLInputElement;
    this.applyFilter(inputElement.value);
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  applyTypeFilter(filterValue: string) {
    this.dataSource.filterPredicate = (data: User, filter: string) => {
      return filter === 'all' || data.workouts.some(w => w.type === filter);
    };
    this.dataSource.filter = filterValue;
  }

  getWorkoutTypes(user: User): string {
    return user.workouts.map(w => w.type).join(', ');
  }

  getTotalMinutes(user: User): number {
    return user.workouts.reduce((total, w) => total + w.minutes, 0);
  }
}