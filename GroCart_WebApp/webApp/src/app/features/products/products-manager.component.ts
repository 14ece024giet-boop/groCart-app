import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-products-manager',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div>
      <h2>?? Product Inventory (1,602 Items)</h2>
      <div style="background:#fff;border-radius:12px;border:1px solid #e2e8f0;margin-top:16px;overflow:hidden;">
        <table style="width:100%;border-collapse:collapse;">
          <tr style="background:#f8fafc;font-size:12px;color:#64748b;text-align:left;">
            <th style="padding:12px 20px;">Image</th>
            <th style="padding:12px 20px;">Name</th>
            <th style="padding:12px 20px;">Price</th>
            <th style="padding:12px 20px;">Discount Price</th>
          </tr>
          <tr *ngFor="let p of products" style="border-bottom:1px solid #f1f5f9;">
            <td style="padding:12px 20px;"><img [src]="p.imageUrl" style="width:36px;height:36px;object-fit:contain;"></td>
            <td style="padding:12px 20px;font-weight:600;">{{ p.name }}</td>
            <td style="padding:12px 20px;">?{{ p.price }}</td>
            <td style="padding:12px 20px;color:#10b981;font-weight:700;">{{ p.discountPrice ? '?' + p.discountPrice : '-' }}</td>
          </tr>
        </table>
      </div>
    </div>
  `
})
export class ProductsManagerComponent implements OnInit {
  http = inject(HttpClient);
  products: any[] = [];
  ngOnInit() {
    this.http.get<any>(`${environment.apiUrl}/Product`).subscribe(res => {
      this.products = (res?.data || res || []).slice(0, 50);
    });
  }
}
