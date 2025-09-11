
export const fetchRecentSearches = async (): Promise<string[]> => {
  // Replace with real API call
  return ['Apple', 'Milk', 'Maggi', 'Baby Powder'];
};

export const searchProducts = async (query: string): Promise<string[]> => {
  // Simulate network/API call
  return new Promise((resolve) =>
    setTimeout(() => resolve([`Result for "${query}" 1`, `Result for "${query}" 2`]), 500)
  );
};


interface CheckoutData {
  deliveryDate: string;
  address: string;
  coupon: string;
}
// with a real API call using axios or fetch
export const getMockCheckoutData = async ():Promise<CheckoutData> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        deliveryDate: '2025-09-10T10:00:00',
        address: 'Home,\n2982 Robinson Lane, HACKBERRY',
        coupon: 'gro50get',
      });
    }, 500); // simulate network delay
  });
};