import { TestBed } from '@angular/core/testing';
import { WorkoutService } from './workout.service';
import { User, Workout } from '../models/workout.model';

describe('WorkoutService', () => {
  let service: WorkoutService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WorkoutService);
    localStorage.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should initialize with default users', (done) => {
    service.getUsers().subscribe(users => {
      expect(users.length).toBe(3);
      expect(users[0].name).toBe('John Doe');
      done();
    });
  });

  it('should add a new workout to an existing user', (done) => {
    const newWorkout: Workout = { type: 'Swimming', minutes: 45 };
    service.addWorkout('John Doe', newWorkout);
    
    service.getUsers().subscribe(users => {
      const johnDoe = users.find(u => u.name === 'John Doe');
      expect(johnDoe).toBeDefined();
      if (johnDoe) {
        expect(johnDoe.workouts.length).toBe(3);
        expect(johnDoe.workouts[2]).toEqual(newWorkout);
      }
      done();
    });
  });

  it('should create a new user when adding a workout for a non-existing user', (done) => {
    const newWorkout: Workout = { type: 'Yoga', minutes: 60 };
    service.addWorkout('New User', newWorkout);
    
    service.getUsers().subscribe(users => {
      expect(users.length).toBe(4);
      const newUser = users.find(u => u.name === 'New User');
      expect(newUser).toBeDefined();
      if (newUser) {
        expect(newUser.workouts.length).toBe(1);
        expect(newUser.workouts[0]).toEqual(newWorkout);
      }
      done();
    });
  });

  it('should save and load data from localStorage', (done) => {
    const newWorkout: Workout = { type: 'Running', minutes: 30 };
    service.addWorkout('Test User', newWorkout);
    
    // Simulate app restart by creating a new service instance
    const newService = TestBed.inject(WorkoutService);
    
    newService.getUsers().subscribe(users => {
      const testUser = users.find(u => u.name === 'Test User');
      expect(testUser).toBeDefined();
      if (testUser) {
        expect(testUser.workouts[0]).toEqual(newWorkout);
      }
      done();
    });
  });
});