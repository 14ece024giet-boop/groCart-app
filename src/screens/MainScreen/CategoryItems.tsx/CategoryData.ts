
export interface Category {
  label: string;
  icon: any; // use ImageSourcePropType if you want stricter typing
}
export const categories : Category[] =   [
  { label: 'Fruits', icon: require('../../../assets/grocery-banner.png') },     
  { label: 'Vegetable', icon: require('../../../assets/grocery-banner.png') },
  { label: 'Flour', icon: require('../../../assets/grocery-banner.png') },
  { label: 'Meat', icon: require('../../../assets/grocery-banner.png') },
  { label: 'Eggs', icon: require('../../../assets/grocery-banner.png') },
  { label: 'Oil', icon: require('../../../assets/grocery-banner.png') },
  { label: 'soap', icon: require('../../../assets/grocery-banner.png') },
  { label: 'milk', icon: require('../../../assets/grocery-banner.png') },
];
