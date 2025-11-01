export interface ProductListItemDto {
  id: number;
  name: string;
  imageUrl: string;
  price: number;
  discountPrice: number;
  isBestSelling: boolean;
  isExclusive: boolean;

  // Optional fields for cart compatibility
  description?: string;
  unitSize?: string;
  brandName?: string;
  categoryName?: string;
}
