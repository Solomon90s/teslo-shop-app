import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'button-home',
  imports: [],
  templateUrl: './button-home.component.html',
})
export class ButtonHomeComponent {
  router = inject(Router);

  goHome() {
    this.router.navigateByUrl('/');
  }
}
