export interface ProductDetails {
  image: any;
  title: ReactNode;
  id: number;
  name: string;
  imageUrl: string;

  price: number;
  discountPrice: number;

  unitSize: string;
  description: string;

  categoryName: string;
  brandName: string;

  isBestSelling: boolean;
  isExclusive: boolean;
}
