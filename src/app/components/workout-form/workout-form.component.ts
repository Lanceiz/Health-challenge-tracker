import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { WorkoutService } from '../../services/workout.service';

@Component({
  selector: 'app-workout-form',
  template: `
    <form [formGroup]="workoutForm" (ngSubmit)="onSubmit()">
      <mat-form-field>
        <input matInput placeholder="User Name" formControlName="name" required>
      </mat-form-field>
      <mat-form-field>
        <mat-select placeholder="Workout Type" formControlName="type" required>
          <mat-option value="Running">Running</mat-option>
          <mat-option value="Cycling">Cycling</mat-option>
          <mat-option value="Swimming">Swimming</mat-option>
          <mat-option value="Yoga">Yoga</mat-option>
        </mat-select>
      </mat-form-field>
      <mat-form-field>
        <input matInput type="number" placeholder="Workout Minutes" formControlName="minutes" required>
      </mat-form-field>
      <button mat-raised-button color="primary" type="submit" [disabled]="!workoutForm.valid">Add Workout</button>
    </form>
  `,
  styles: [`
    form {
      display: flex;
      flex-direction: column;
      max-width: 300px;
      margin: 0 auto;
    }
    button {
      margin-top: 20px;
    }
  `]
})
export class WorkoutFormComponent {
  workoutForm: FormGroup;

  constructor(private fb: FormBuilder, private workoutService: WorkoutService) {
    this.workoutForm = this.fb.group({
      name: ['', Validators.required],
      type: ['', Validators.required],
      minutes: ['', [Validators.required, Validators.min(1)]]
    });
  }

  onSubmit(): void {
    if (this.workoutForm.valid) {
      const { name, type, minutes } = this.workoutForm.value;
      this.workoutService.addWorkout(name, { type, minutes });
      this.workoutForm.reset();
    }
  }
}