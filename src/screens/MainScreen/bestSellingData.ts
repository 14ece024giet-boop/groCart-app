// data/bestSelling.ts

import { ProductDetails } from "../../types/ProductDetails";
import { Product } from "./Product";


export const bestSellingProducts: ProductDetails[] = [
  {
    id: 1,
    title: 'Apple Product title will be here',
    quantity: 1,
    price: 15,
    discountPrice: 12,
    image: require('../../../assets/grocery-banner.png'),
    description: "",
    weight: ""
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
    weight: ""
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
     weight: ""
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
    weight: ""
  },
];
