import { Component, computed, inject } from '@angular/core';
import {
  Router,
  RouterLink,
  RouterLinkActive,
  RouterOutlet,
} from '@angular/router';
import { AuthService } from '@auth/services/auth.service';

@Component({
  selector: 'app-admin-dashboard-layout',
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './admin-dashboard-layout.component.html',
})
export class AdminDashboardLayoutComponent {
  #authService = inject(AuthService);
  user = computed(() => this.#authService.user());
  router = inject(Router);

  get authService(): AuthService {
    this.router.navigate(['/']);
    return this.#authService;
  }
}
