import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FrontNavbarComponent } from '../../components/front-navbar/front-navbar.component';
import { FrontFooterComponent } from '../../components/front-footer/front-footer.component';

@Component({
  selector: 'app-store-front-layout',
  imports: [RouterOutlet, FrontNavbarComponent, FrontFooterComponent],
  templateUrl: './store-front-layout.component.html',
})
export class StoreFrontLayoutComponent {
  scrollToUp() {
    window.scrollTo({
      behavior: 'smooth',
      left: 0,
      top: document.body.scrollTop,
    });
  }
}
