import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-flash-sale-manager',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div style="display:flex;flex-direction:column;gap:24px;">
      <div style="display:flex;justify-content:space-between;align-items:center;">
        <div>
          <h2 style="margin:0;font-size:24px;">? Flash Sale Command Center</h2>
          <p style="color:#64748b;margin:4px 0 0 0;">Manage live pricing, countdown timers, and live mobile showcase.</p>
        </div>
      </div>
      <div *ngIf="flashSale" style="background:#fff;border:1px solid #e2e8f0;border-radius:16px;padding:24px;display:flex;justify-content:space-between;align-items:center;box-shadow:0 4px 12px rgba(0,0,0,0.04);">
        <div>
          <div style="margin-bottom:8px;">
            <span style="font-size:12px;font-weight:700;padding:4px 10px;border-radius:20px;" [style.background]="flashSale.isActive ? '#ecfdf5' : '#fef2f2'" [style.color]="flashSale.isActive ? '#059669' : '#dc2626'">
              {{ flashSale.isActive ? '● LIVE FLASH SALE' : '○ DEACTIVATED' }}
            </span>
          </div>
          <h3 style="margin:0 0 4px 0;font-size:18px;">{{ flashSale.title }}</h3>
          <p style="margin:0;color:#64748b;font-size:14px;">⚡ Flash Deals showcase is currently active on mobile app.</p>
        </div>
        <button (click)="toggleActive()" style="padding:10px 20px;border-radius:10px;border:none;font-weight:700;cursor:pointer;" [style.background]="flashSale.isActive ? '#fee2e2' : '#059669'" [style.color]="flashSale.isActive ? '#dc2626' : '#fff'">
          {{ flashSale.isActive ? 'Deactivate Sale' : 'Activate Live Sale' }}
        </button>
      </div>

      <div style="background:#fff;border-radius:16px;border:1px solid #e2e8f0;padding:24px;">
        <h3 style="margin:0 0 16px 0;">⚡ Flash Deal Products ({{ dealItems.length }})</h3>
        <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(220px,1fr));gap:16px;">
          <div *ngFor="let item of dealItems" style="border:1px solid #e2e8f0;border-radius:12px;padding:12px;display:flex;flex-direction:column;gap:8px;">
            <img [src]="item.imageUrl" style="height:100px;object-fit:contain;">
            <span style="font-size:13px;font-weight:700;">{{ item.name }}</span>
            <div style="display:flex;justify-content:space-between;align-items:baseline;">
              <span style="color:#059669;font-weight:900;">?{{ item.flashPrice }}</span>
              <span style="color:#94a3b8;font-size:12px;text-decoration:line-through;">?{{ item.originalPrice }}</span>
            </div>
            <span style="font-size:11px;font-weight:700;color:#dc2626;">⚡ {{ item.discountPercent }}% OFF</span>
          </div>
        </div>
      </div>
    </div>
  `
})
export class FlashSaleManagerComponent implements OnInit {
  http = inject(HttpClient);
  flashSale: any = null;
  dealItems: any[] = [];
  ngOnInit() { this.load(); }
  load() {
    this.http.get<any>(`${environment.apiUrl}/FlashSale`).subscribe(res => {
      this.flashSale = res?.data?.flashSale;
      this.dealItems = res?.data?.items || [];
    });
  }
  toggleActive() {
    this.http.post(`${environment.apiUrl}/FlashSale/${this.flashSale.id}/toggle`, {}).subscribe(() => this.load());
  }
}
