import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, inject, OnInit, signal, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet , FormsModule , RouterLink ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {

  user : any

  ngOnInit(): void {
    if (typeof window !== 'undefined' && window.localStorage) {
      const loggedInUser = localStorage.getItem('user');
      if (loggedInUser) { 
        this.user = JSON.parse(loggedInUser);
        console.log('Logged in user:', this.user);
      }
    }
  }

  @ViewChild('loginModal') loginModal! : ElementRef;
  isLoginFormVisible = signal<boolean>(true);

  registerObj:any = {
    "email": "",
    "password": "",
    "fullName": "",
    "mobile": ""
  }

  loginObj:any = {
    "email": "",
    "password": ""
  }

  http = inject(HttpClient);

  toggleForm() {
    this.isLoginFormVisible.update((prev) => !prev);
  }

  openModal() {
    if (this.loginModal) {
      this.loginModal.nativeElement.style.display = 'block';
    } 
  }
  closeModal() {
    if (this.loginModal) {
      this.loginModal.nativeElement.style.display = 'none';
    } 
  }

  onRegister() {
    console.log(this.registerObj);
    this.http.post('http://localhost:8080/api/v1/user/register', this.registerObj).subscribe(
      (response:any) => {
        console.log('Registration successful:', response);
        alert('Registration successful!');
        localStorage.setItem('user', JSON.stringify(response.user));
        this.user = response.user; // Update the user variable to reflect the logged-in user
        this.closeModal();
      },
    (error) => {
        console.error('Registration failed:', error);
    }
    )
  }
  onLogin() {
    console.log(this.loginObj);
    this.http.post('http://localhost:8080/api/v1/user/login', this.loginObj).subscribe(
      (response: any) => {
        console.log('Login successful:', response);
        alert('Login successful!');
        
        // ✅ Save user info in localStorage
        localStorage.setItem('user', JSON.stringify(response.user));
  
        this.closeModal();
        this.user = response.user; // Update the user variable to reflect the logged-in user
        
        // You can navigate or update UI based on user data if needed
      },
      (error) => {
        console.error('Login failed:', error);
        alert('Login failed. Please check your credentials.');
      }
    );
  }
  onLogout() {
    // Clear user info from localStorage
    localStorage.removeItem('user');
    this.user = null; // Update the user variable to reflect the logout
    alert('Logout successful!');
  }
   
}


