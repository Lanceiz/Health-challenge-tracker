import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { WorkoutFormComponent } from './workout-form.component';
import { WorkoutService } from '../../services/workout.service';

describe('WorkoutFormComponent', () => {
  let component: WorkoutFormComponent;
  let fixture: ComponentFixture<WorkoutFormComponent>;
  let workoutServiceSpy: jasmine.SpyObj<WorkoutService>;

  beforeEach(async () => {
    const spy = jasmine.createSpyObj('WorkoutService', ['addWorkout']);

    await TestBed.configureTestingModule({
      declarations: [ WorkoutFormComponent ],
      imports: [
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
        MatButtonModule,
        NoopAnimationsModule
      ],
      providers: [
        { provide: WorkoutService, useValue: spy }
      ]
    }).compileComponents();

    workoutServiceSpy = TestBed.inject(WorkoutService) as jasmine.SpyObj<WorkoutService>;
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkoutFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have an invalid form initially', () => {
    expect(component.workoutForm.valid).toBeFalsy();
  });

  it('should have a valid form when all fields are filled', () => {
    component.workoutForm.setValue({
      name: 'John',
      type: 'Running',
      minutes: 30
    });
    expect(component.workoutForm.valid).toBeTruthy();
  });

  it('should call workoutService.addWorkout when form is submitted', () => {
    component.workoutForm.setValue({
      name: 'John',
      type: 'Running',
      minutes: 30
    });
    
    component.onSubmit();
    
    expect(workoutServiceSpy.addWorkout).toHaveBeenCalledWith('John', { type: 'Running', minutes: 30 });
  });

  it('should reset the form after submission', () => {
    component.workoutForm.setValue({
      name: 'John',
      type: 'Running',
      minutes: 30
    });
    
    component.onSubmit();
    
    expect(component.workoutForm.value).toEqual({
      name: null,
      type: null,
      minutes: null
    });
  });
});