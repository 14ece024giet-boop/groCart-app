export interface ProductDetails {
  id: number;
  title: string;
  image: any; // for require()
  images?: any[]; // carousel support
  description: string;
  price: number;
  discountPrice: number;
  weight: string;
  quantity: number;
  category?: string; // optional for future use
}
