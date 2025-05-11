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
    return this.http.post('http://localhost:3030/api/v1/goal', goalData);
  }
  getAllGoalsByUserId(id: number) {
    return this.http.get<Goal[]>(`http://localhost:3030/api/v1/goal?userId=${id}`);
  }
  updateMilestone(goalId: number, data: any) {
    return this.http.put(`http://localhost:3030/api/v1/goal/milestone/${goalId}`, data);
  }
  deleteGoal(goalId: number) {
    return this.http.delete(`http://localhost:3030/api/v1/goal/${goalId}`);
  }
}
