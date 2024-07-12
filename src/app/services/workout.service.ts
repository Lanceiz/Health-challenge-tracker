import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { User, Workout } from '../models/workout.model';

@Injectable({
  providedIn: 'root'
})
export class WorkoutService {
  private users: User[] = [
    {
      id: 1,
      name: 'John Doe',
      workouts: [
        { type: 'Running', minutes: 30 },
        { type: 'Cycling', minutes: 45 }
      ]
    },
    {
      id: 2,
      name: 'Jane Smith',
      workouts: [
        { type: 'Swimming', minutes: 60 },
        { type: 'Running', minutes: 20 }
      ]
    },
    {
      id: 3,
      name: 'Mike Johnson',
      workouts: [
        { type: 'Yoga', minutes: 50 },
        { type: 'Cycling', minutes: 40 }
      ]
    }
  ];

  private usersSubject = new BehaviorSubject<User[]>(this.users);

  constructor() {
    this.loadFromLocalStorage();
  }

  getUsers(): Observable<User[]> {
    return this.usersSubject.asObservable();
  }

  addWorkout(name: string, workout: Workout): void {
    const user = this.users.find(u => u.name === name);
    if (user) {
      user.workouts.push(workout);
    } else {
      const newUser: User = {
        id: this.users.length + 1,
        name,
        workouts: [workout]
      };
      this.users.push(newUser);
    }
    this.updateUsers();
  }

  private updateUsers(): void {
    this.usersSubject.next(this.users);
    this.saveToLocalStorage();
  }

  private saveToLocalStorage(): void {
    localStorage.setItem('userData', JSON.stringify(this.users));
  }

  private loadFromLocalStorage(): void {
    const storedData = localStorage.getItem('userData');
    if (storedData) {
      this.users = JSON.parse(storedData);
      this.updateUsers();
    }
  }
}