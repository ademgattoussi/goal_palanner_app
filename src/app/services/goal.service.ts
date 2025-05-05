import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Goal } from '../models/goal.model';

@Injectable({
  providedIn: 'root'
})
export class GoalService {

  user : any 

  constructor(private http : HttpClient) {

    if (typeof window !== 'undefined' && window.localStorage) {
      const loggedInUser = localStorage.getItem('user');
      if (loggedInUser) {
        this.user = JSON.parse(loggedInUser);

        console.log('Logged in user:', this.user);
      }
    }
   }

  saveGoal(goalData: any) {
    return this.http.post('http://localhost:8080/api/v1/goal', goalData);
  }
  getAllGoalsByUserId(id: number) {
    return this.http.get<Goal[]>(`http://localhost:8080/api/v1/goal?userId=${id}`);
  }
}
