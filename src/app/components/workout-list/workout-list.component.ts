import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { WorkoutService } from '../../services/workout.service';
import { User } from '../../models/workout.model';

@Component({
  selector: 'app-workout-list',
  template: `
    <mat-form-field>
      <input matInput (keyup)="applyFilter($event.target.value)" placeholder="Search by name">
    </mat-form-field>
    <mat-form-field>
      <mat-select placeholder="Filter by Workout Type" (selectionChange)="applyTypeFilter($event.value)">
        <mat-option value="all">All</mat-option>
        <mat-option value="Running">Running</mat-option>
        <mat-option value="Cycling">Cycling</mat-option>
        <mat-option value="Swimming">Swimming</mat-option>
        <mat-option value="Yoga">Yoga</mat-option>
      </mat-select>
    </mat-form-field>

    <table mat-table [dataSource]="dataSource" class="mat-elevation-z8">
      <ng-container matColumnDef="name">
        <th mat-header-cell *matHeaderCellDef> Name </th>
        <td mat-cell *matCellDef="let user"> {{user.name}} </td>
      </ng-container>
      <ng-container matColumnDef="workouts">
        <th mat-header-cell *matHeaderCellDef> Workouts </th>
        <td mat-cell *matCellDef="let user"> {{getWorkoutTypes(user)}} </td>
      </ng-container>
      <ng-container matColumnDef="numberOfWorkouts">
        <th mat-header-cell *matHeaderCellDef> Number of Workouts </th>
        <td mat-cell *matCellDef="let user"> {{user.workouts.length}} </td>
      </ng-container>
      <ng-container matColumnDef="totalMinutes">
        <th mat-header-cell *matHeaderCellDef> Total Workout Minutes </th>
        <td mat-cell *matCellDef="let user"> {{getTotalMinutes(user)}} </td>
      </ng-container>

      <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
      <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
    </table>

    <mat-paginator [pageSize]="5" [pageSizeOptions]="[5, 10, 20]" showFirstLastButtons></mat-paginator>
  `,
  styles: [`
    table {
      width: 100%;
    }
    .mat-form-field {
      margin-right: 20px;
    }
  `]
})
export class WorkoutListComponent implements OnInit {
  displayedColumns: string[] = ['name', 'workouts', 'numberOfWorkouts', 'totalMinutes'];
  dataSource: MatTableDataSource<User>;
  users$: Observable<User[]>;

  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;

  constructor(private workoutService: WorkoutService) {
    this.users$ = this.workoutService.getUsers();
  }

  ngOnInit() {
    this.users$.subscribe(users => {
      this.dataSource = new MatTableDataSource(users);
      this.dataSource.paginator = this.paginator;
    });
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