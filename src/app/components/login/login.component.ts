import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription, tap } from 'rxjs';

enum LoginData {
  UserName = 'admin',
  Password = '1234',
}

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  submitError = false;
  userPlaceholder = 'Username';
  passPlaceholder = 'Password';

  private subscription: Subscription = new Subscription();

  constructor(private fb: FormBuilder, private router: Router) {}

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      userName: '',
      password: '',
    });

    this.subscription.add(this.loginForm.valueChanges.subscribe());
  }

  onSubmit(): void {
    if (
      this.loginForm.controls['userName'].value == LoginData.UserName &&
      this.loginForm.controls['password'].value == LoginData.Password
    ) {
      localStorage.setItem('userName', 'admin');
      this.router.navigate(['/dashboard']);
    }

    this.submitError = true;
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
