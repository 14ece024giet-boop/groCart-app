// data/exclusiveProducts.ts
import { ImageSourcePropType } from 'react-native';

export interface Product {
  id: number;
  title: string;
  quantity: string;
  price: number;
  discountPrice: number;
  image: ImageSourcePropType;
}

export const exclusiveProducts: Product[] = [
  {
    id: 1,
    title: 'Exclusive Basmati Rice',
    quantity: '5 kg',
    price: 45,
    discountPrice: 39,
    image: require('../../../assets/grocery-banner.png'),
  },
  {
    id: 2,
    title: 'Premium Olive Oil',
    quantity: '1 L',
    price: 20,
    discountPrice: 17,
    image: require('../../../assets/grocery-banner.png'),
  },

    {
    id: 3,
    title: 'Exclusive Basmati Rice',
    quantity: '5 kg',
    price: 45,
    discountPrice: 39,
    image: require('../../../assets/grocery-banner.png'),
  },
  {
    id: 4,
    title: 'Premium Olive Oil',
    quantity: '1 L',
    price: 20,
    discountPrice: 17,
    image: require('../../../assets/grocery-banner.png'),
  },  {
    id: 5,
    title: 'Exclusive Basmati Rice',
    quantity: '5 kg',
    price: 45,
    discountPrice: 39,
    image: require('../../../assets/grocery-banner.png'),
  },
  {
    id: 6,
    title: 'Premium Olive Oil',
    quantity: '1 L',
    price: 20,
    discountPrice: 17,
    image: require('../../../assets/grocery-banner.png'),
  },
];
