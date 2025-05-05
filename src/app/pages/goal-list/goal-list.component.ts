import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { GoalService } from '../../services/goal.service';
import { Goal, Milestone } from '../../models/goal.model';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-goal-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './goal-list.component.html',
  styleUrl: './goal-list.component.css'
})
export class GoalListComponent implements OnInit {

  router = inject(Router);
  goalService = inject(GoalService);

  goals: Goal[] = [];

  ngOnInit(): void {
    this.getAllGoalsCreatedByMe();
  }

  navigateToNewGoal() {
    this.router.navigate(['/new-goal']);
  }
  
  getAllGoalsCreatedByMe() {
    const user = this.goalService.user;  // Get the user from goalService

    if (!user || !user.userId) {
      console.warn('User not logged in');
      return;
    }

    console.log('Fetching goals for user:', user.userId); // Add a log to check the user ID

    this.goalService.getAllGoalsByUserId(user.userId).subscribe(
      (response: Goal[]) => {
        this.goals = response;
        console.log('Fetched goals:', this.goals);  // Log the fetched goals
      },
      (error) => {
        console.error('Error fetching goals:', error);
      }
    );
  }

  toggleMilestoneCompletion(milestone: Milestone) {
    milestone.isCompleted = !milestone.isCompleted;
    this.goalService.updateMilestone(milestone.milestoneId, milestone).subscribe(
      (response) => {
        console.log('Milestone updated:', response);
      },
      (error) => {
        console.error('Error updating milestone:', error);
      }
    );
  }

  // Helper methods for template calculations
  getCompletedCount(milestones: Milestone[]): number {
    return milestones.filter(m => m.isCompleted).length;
  }

  calculateProgress(milestones: Milestone[]): number {
    if (!milestones || milestones.length === 0) return 0;
    
    const completed = this.getCompletedCount(milestones);
    return Math.round((completed / milestones.length) * 100);
  }

  formatDate(dateString: string): string {
    if (!dateString) return '';
    
    const date = new Date(dateString);
    return date.toLocaleDateString();
  }

  deleteGoal(goalId: number) {
    if (confirm('Are you sure you want to delete this goal?')) {
      this.goalService.deleteGoal(goalId).subscribe(
        (response) => {
          console.log('Goal deleted:', response);
          this.getAllGoalsCreatedByMe(); // Refresh the list after deletion
        },
        (error) => {
          console.error('Error deleting goal:', error);
        }
      );
    }
  }
}