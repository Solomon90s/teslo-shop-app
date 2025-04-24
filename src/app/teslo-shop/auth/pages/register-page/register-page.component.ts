import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '@auth/services/auth.service';
import { AlertComponent } from '@shared/components/alert/alert.component';

@Component({
  selector: 'app-register-page',
  imports: [AlertComponent, ReactiveFormsModule, RouterLink],
  templateUrl: './register-page.component.html',
  styleUrl: './register-page.component.css',
})
export class RegisterPageComponent {
  formBuilder = inject(FormBuilder);
  hasError = signal(false);
  isPosting = signal(false);

  #authService = inject(AuthService);
  router = inject(Router);

  registerForm = this.formBuilder.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    fullName: ['', [Validators.required, Validators.minLength(6)]],
  });

  onSubmit(): void {
    if (this.registerForm.invalid) {
      this.hasError.set(true);
      setTimeout((): void => {
        this.hasError.set(false);
      }, 2500);
      return;
    }
    const {
      email = '',
      password = '',
      fullName = '',
    } = this.registerForm.value;
    this.#authService
      .register(email!, password!, fullName!)
      .subscribe((isAuthenticated) => {
        if (isAuthenticated) {
          this.router.navigateByUrl('/');
          return;
        }
        this.hasError.set(true);
        setTimeout((): void => {
          this.hasError.set(false);
        }, 2500);
      });
  }
}
