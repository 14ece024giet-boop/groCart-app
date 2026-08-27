import { Component } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <div style="display:flex;min-height:100vh;font-family:system-ui,-apple-system,sans-serif;background:#f8fafc;">
      <aside style="width:250px;background:#fff;border-right:1px solid #e2e8f0;display:flex;flex-direction:column;padding:24px 16px;">
        <div style="display:flex;align-items:center;gap:10px;margin-bottom:28px;">
          <span style="font-size:26px;">??</span>
          <h2 style="font-size:18px;margin:0;font-weight:800;color:#0f172a;">GroCart <span style="background:#dcfce7;color:#15803d;padding:2px 8px;font-size:11px;border-radius:12px;">Admin</span></h2>
        </div>
        <nav style="display:flex;flex-direction:column;gap:8px;flex:1;">
          <a routerLink="/dashboard" routerLinkActive="active" style="display:flex;align-items:center;gap:10px;padding:12px 14px;border-radius:8px;color:#64748b;text-decoration:none;font-weight:600;">?? Dashboard</a>
          <a routerLink="/flash-sales" routerLinkActive="active" style="display:flex;align-items:center;gap:10px;padding:12px 14px;border-radius:8px;color:#64748b;text-decoration:none;font-weight:600;">? Flash Sales</a>
          <a routerLink="/products" routerLinkActive="active" style="display:flex;align-items:center;gap:10px;padding:12px 14px;border-radius:8px;color:#64748b;text-decoration:none;font-weight:600;">?? Products (1,602)</a>
        </nav>
      </aside>
      <main style="flex:1;padding:32px;">
        <router-outlet></router-outlet>
      </main>
    </div>
  `
})
export class AppComponent {}
