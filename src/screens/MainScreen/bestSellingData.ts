// data/bestSelling.ts

export interface Product {
  id: number;
  title: string;
  quantity: string;
  price: number;
  discountPrice: number;
  image:any; // You can add image path later
}

export const bestSellingProducts: Product[] = [
  {
    id: 1,
    title: 'Coriander Product title will be here',
    quantity: '1 kg',
    price: 15,
    discountPrice: 12,
    image: require('../../../assets/grocery-banner.png'),
  },
  {
    id: 2,
    title: 'Corn Product title will be here',
    quantity: '1 kg',
    price: 12,
    discountPrice: 10,
     image: require('../../../assets/grocery-banner.png'),

  },
   {
    id: 3,
    title: 'Coriander Product title will be here',
    quantity: '1 kg',
    price: 15,
    discountPrice: 12,
     image: require('../../../assets/grocery-banner.png'),

  },
  {
    id: 4,
    title: 'Corn Product title will be here',
    quantity: '1 kg',
    price: 12,
    discountPrice: 10,
    image: require('../../../assets/grocery-banner.png'),

  },
];
