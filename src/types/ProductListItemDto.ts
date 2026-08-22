export interface ProductListItemDto {
  id: number;
  name: string;
  imageUrl: string;
  price: number;
  discountPrice: number;
  unitSize: string;
  isBestSelling?: boolean;
  isExclusive?: boolean;
  description?: string;
  brandName?: string;
  categoryName?:string;
}