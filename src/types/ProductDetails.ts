export interface ProductVariant {
  id: number;
  unitSize: string;
  price: number;
  discountPrice: number;
  savingsBadge?: string;
  stockQuantity?: number;
  imageUrl?: string;
  isDefault?: boolean;
}

export interface ProductDetails {
  id: number;
  name?: string;
  title?: string;
  description: string;
  price: number;
  discountPrice: number;
  imageUrl: string;
  unitSize: string;
  brandName: string;
  categoryName: string;
  stockQuantity?: number;
  showUrgencyBadge?: boolean;
  isBestSelling: boolean;
  isExclusive: boolean;
  variants?: ProductVariant[];
  image?: any;
}