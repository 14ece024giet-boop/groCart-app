// data/exclusiveProducts.ts
import { ImageSourcePropType } from 'react-native';
import { Product } from './Product';
import { ProductDetails } from '../../types/ProductDetails';



export const exclusiveProducts: ProductDetails[] = [
  {
    id: 1,
    title: 'Exclusive Basmati Rice',
    quantity: 2,
    price: 45,
    discountPrice: 39,
    image: require('../../../assets/grocery-banner.png'),
    category: '',
    description: '',
    weight: ''
  },
  {
    id: 2,
    title: 'Premium Olive Oil',
    quantity: 2,
    price: 20,
    discountPrice: 17,
    image: require('../../../assets/grocery-banner.png'),
    category: '',
    description: '',
    weight: ''
  },

    {
      id: 3,
      title: 'Exclusive Basmati Rice',
      quantity: 4,
      price: 45,
      discountPrice: 39,
      image: require('../../../assets/grocery-banner.png'),
      category: '',
      description: '',
      weight: ''
    },
  {
    id: 4,
    title: 'Premium Olive Oil',
    quantity: 4,
    price: 20,
    discountPrice: 17,
    image: require('../../../assets/grocery-banner.png'),
    category: '',
    description: '',
    weight: ''
  }, 
];
