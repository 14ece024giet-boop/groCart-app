// data/bestSelling.ts

import { ProductDetails } from "../../types/ProductDetails";


export const Products: ProductDetails[] = [
  {
    id: 1,
    title: 'Apple Product title will be here',
    quantity: 1,
    price: 15,
    discountPrice: 12,
    image: require('../../../assets/grocery-banner.png'),
    description: "",
    weight: "",
    productFeautre: "Best Selling Product",
  },
  {
    id: 2,
    title: 'Banana Product title will be here',
    quantity: 2,
    price: 12,
    discountPrice: 10,
     image: require('../../../assets/grocery-banner.png'),
    category: "",
    description: "",
    weight: "",
    productFeautre: "Best Selling Product",

  },
   {
    id: 3,
     title: 'grapps Product title will be here',
     quantity: 2,
    price: 15,
    discountPrice: 12,
     image: require('../../../assets/grocery-banner.png'),
     category: "",
     description: "",
     weight: "",
    productFeautre: "Best Selling Product",

  },
  {
    id: 4,
    title: 'papaya Product title will be here',
    quantity: 2,
    price: 12,
    discountPrice: 10,
    image: require('../../../assets/grocery-banner.png'),
    category: "",
    description: "",
    weight: "",
    productFeautre: "Best Selling Product",

  },
  {
    id: 5,
    title: 'Exclusive Basmati Rice',
    quantity: 2,
    price: 45,
    discountPrice: 39,
    image: require('../../../assets/grocery-banner.png'),
    category: '',
    description: '',
    weight: '',
    productFeautre: "Exclusive Product",
  },
  {
    id: 6,
    title: 'Premium Olive Oil',
    quantity: 2,
    price: 20,
    discountPrice: 17,
    image: require('../../../assets/grocery-banner.png'),
    category: '',
    description: '',
    weight: '',
    productFeautre: "Exclusive Product",

  },

];
