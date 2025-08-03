
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
