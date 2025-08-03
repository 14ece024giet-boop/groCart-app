
export interface FavoriteItem {
  id: string;
  title: string;
  weight: string;
  price: number;
  salePrice: number;
  image: string;
  description?: string;
  tags?: string[];
  isExclusive?: boolean;
}

export const FavoritesItems : FavoriteItem[]= [
  {
    id: '1',
    title: 'Dummy Product title add will be here',
    weight: '1 Ltr',
    price: 15,
    salePrice: 12,
    image: '', // Add your image URI or local asset
  },
  // Add more items if needed
];