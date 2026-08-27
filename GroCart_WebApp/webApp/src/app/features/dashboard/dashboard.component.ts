import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div>
      <h2 style="font-size:24px;margin-bottom:20px;">Dashboard Overview</h2>
      <div style="display:flex;gap:20px;margin-bottom:24px;">
        <div style="background:#fff;padding:24px;border-radius:12px;border:1px solid #e2e8f0;flex:1;">
          <span style="color:#64748b;font-weight:600;">? Live Flash Deals</span>
          <h3 style="font-size:24px;margin:8px 0 0 0;">1 Active Event</h3>
        </div>
        <div style="background:#fff;padding:24px;border-radius:12px;border:1px solid #e2e8f0;flex:1;">
          <span style="color:#64748b;font-weight:600;">?? Total Products</span>
          <h3 style="font-size:24px;margin:8px 0 0 0;">1,602 Items</h3>
        </div>
      </div>
      <a routerLink="/flash-sales" style="background:#10b981;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:700;display:inline-block;">? Open Flash Sale Manager</a>
    </div>
  `
})
export class DashboardComponent {}
