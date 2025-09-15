export interface ProductListItemDto {
  id: number;
  title: string;
  imageUrl: string;
  price: number;
  discountPrice: number;
  isBestSelling: boolean;
  isExclusive: boolean;
  // Add more fields only if needed for the main screen
}