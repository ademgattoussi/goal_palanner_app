import { Component, ElementRef, inject, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { GoalService } from '../../services/goal.service';
import { TaskService, Task } from '../../services/task.service';

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './task-list.component.html',
  styleUrl: './task-list.component.css'
})
export class TaskListComponent implements OnInit {
  @ViewChild('modal') modal!: ElementRef;

  newTask: Task = {
    taskId: 0,
    taskName: "",
    description: "",
    frequency: "daily",
    createdDate: new Date(),
    dueDate: "",
    isCompleted: false,
    userId: 0
  };

  dailyTasks: Task[] = [];
  weeklyTasks: Task[] = [];
  monthlyTasks: Task[] = [];
  isLoading = false;

  goalService = inject(GoalService);
  taskService = inject(TaskService);

  ngOnInit() {
    // Initialize user ID when component loads
    if (this.goalService.user && this.goalService.user.userId) {
      this.newTask.userId = this.goalService.user.userId;
      this.loadAllTasks();
    }
  }

  loadAllTasks() {
    this.isLoading = true;
    const userId = this.goalService.user.userId;
    
    this.taskService.getAllTasksByUserId(userId).subscribe({
      next: (tasks) => {
        // Sort tasks by frequency
        this.dailyTasks = tasks.filter(task => task.frequency === 'daily');
        this.weeklyTasks = tasks.filter(task => task.frequency === 'weekly');
        this.monthlyTasks = tasks.filter(task => task.frequency === 'monthly');
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading tasks:', error);
        this.isLoading = false;
      }
    });
  }

  openModal() {
    if (this.modal) {
      this.modal.nativeElement.style.display = 'block';
      this.modal.nativeElement.classList.add('show');
      document.body.classList.add('modal-open');
      
      // Create a backdrop
      const backdrop = document.createElement('div');
      backdrop.className = 'modal-backdrop fade show';
      document.body.appendChild(backdrop);
    }
  }

  closeModal() {
    if (this.modal) {
      this.modal.nativeElement.style.display = 'none';
      this.modal.nativeElement.classList.remove('show');
      document.body.classList.remove('modal-open');
      
      // Remove backdrop
      const backdrop = document.querySelector('.modal-backdrop');
      if (backdrop) {
        backdrop.remove();
      }
    }
  }

  createTask() {
    // Ensure userId is set
    this.newTask.userId = this.goalService.user.userId;
    
    this.taskService.createTask(this.newTask).subscribe({
      next: (response) => {
        console.log('Task created:', response);
        
        // Reload all tasks to refresh the lists
        this.loadAllTasks();
        
        // Reset form and close modal
        this.resetForm();
        this.closeModal();
      },
      error: (error) => {
        console.error('Error creating task:', error);
      }
    });
  }

  resetForm() {
    this.newTask = {
      taskId: 0,
      taskName: "",
      description: "",
      frequency: "daily",
      createdDate: new Date(),
      dueDate: "",
      isCompleted: false,
      userId: this.goalService.user?.userId || 0
    };
  }

  toggleTaskCompletion(task: Task) {
    this.taskService.updateTaskStatus(task.taskId, task.isCompleted).subscribe({
      next: (response) => {
        console.log('Task status updated:', response);
      },
      error: (error) => {
        console.error('Error updating task status:', error);
        // Revert the UI change if the API call fails
        task.isCompleted = !task.isCompleted;
      }
    });
  }

  deleteTask(task: Task, category: string) {
    if (confirm('Are you sure you want to delete this task?')) {
      this.taskService.deleteTask(task.taskId).subscribe({
        next: () => {
          // Remove from the appropriate array
          switch(category) {
            case 'daily':
              this.dailyTasks = this.dailyTasks.filter(t => t.taskId !== task.taskId);
              break;
            case 'weekly':
              this.weeklyTasks = this.weeklyTasks.filter(t => t.taskId !== task.taskId);
              break;
            case 'monthly':
              this.monthlyTasks = this.monthlyTasks.filter(t => t.taskId !== task.taskId);
              break;
          }
        },
        error: (error) => {
          console.error('Error deleting task:', error);
        }
      });
    }
  }

  formatDate(dateString: string): string {
    if (!dateString) return '';
    
    const date = new Date(dateString);
    return date.toLocaleDateString();
  }
}