export interface ProductDetails {
  id: number;
  name: string;
  description: string;
  price: number;
  discountPrice: number;
  imageUrl: string;
  unitSize: string;
  brandName: string;
  categoryName: string;
  isBestSelling: boolean;
  isExclusive: boolean;
  image?: any; // To handle legacy 'image' property if it exists
}