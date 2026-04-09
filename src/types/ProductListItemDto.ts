import { ReactNode } from "react";

export interface ProductListItemDto {
  title: ReactNode;
  id: number;
  name: string;
  imageUrl: string;
  price: number;
  discountPrice: number;
  isBestSelling: boolean;
  isExclusive: boolean;
  description?: string;
  unitSize?: string;
  brandName?: string;
  categoryName?: string;
}
