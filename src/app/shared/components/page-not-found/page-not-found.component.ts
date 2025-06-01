import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-page-not-found',
  template: `
    <div class="not-found-container">
      <h1>404 - Page Not Found</h1>
      <p>The page you are looking for does not exist.</p>
      <a routerLink="/">Return to Home</a>
    </div>
  `,
  styles: [`
    .not-found-container {
      text-align: center;
      padding: 2rem;
    }
    h1 {
      color: #333;
      margin-bottom: 1rem;
    }
    a {
      color: #2E7D32;
      text-decoration: none;
    }
    a:hover {
      text-decoration: underline;
    }
  `],
  standalone: true,
  imports: [RouterModule]
})
export class PageNotFoundComponent {}