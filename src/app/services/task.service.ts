import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Task {
  taskId: number;
  taskName: string;
  description: string;
  frequency: string;
  createdDate: Date;
  dueDate: string;
  isCompleted: boolean;
  userId: number;
}

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private apiUrl = `http://localhost:3030/api/v1/task`;
  http = inject(HttpClient);
  
  // Get user from local service or storage
  get user() {
    // This should match how you get the user in your GoalService
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  }

  // Create a new task
  createTask(task: Task): Observable<any> {
    return this.http.post(this.apiUrl, task);
  }

  // Get all tasks for the current user
  getAllTasksByUserId(userId: number): Observable<Task[]> {
    return this.http.get<Task[]>(`${this.apiUrl}?userId=${userId}`);
  }

  // Get tasks by frequency (daily, weekly, monthly)
  getTasksByFrequency(userId: number, frequency: string): Observable<Task[]> {
    return this.http.get<Task[]>(`${this.apiUrl}/by-frequency?userId=${userId}&frequency=${frequency}`);
  }

  // Update task completion status
  updateTaskStatus(taskId: number, isCompleted: boolean): Observable<any> {
    return this.http.put(`${this.apiUrl}/${taskId}/status`, { isCompleted });
  }

  // Delete a task
  deleteTask(taskId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${taskId}`);
  }
}