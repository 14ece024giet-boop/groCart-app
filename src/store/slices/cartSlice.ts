import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ProductDetails } from '../../types/ProductDetails';
import { ProductListItemDto } from '../../types/ProductListItemDto';

// Each item in the cart extends ProductDetails and adds quantity
export interface CartItem extends ProductDetails {
  quantity: number;
}

interface CartState {
  items: CartItem[];
}

const initialState: CartState = {
  items: [],
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    /**
     * Adds a product to the cart.
     * If the item already exists, increments its quantity.
     */
    addToCart: (state, action: PayloadAction<ProductListItemDto>) => {
      const existing = state.items.find((item) => item.id === action.payload.id);

      if (existing) {
        existing.quantity += 1;
      } else {
        state.items.push({
          ...action.payload,
          quantity: 1,
          // Fallbacks in case ProductListItemDto misses some fields from ProductDetails
          imageUrl: action.payload.imageUrl || '',
          description: action.payload.description || '',
          unitSize: action.payload.unitSize || '',
          brandName: action.payload.brandName || '',
          categoryName: action.payload.categoryName || '',
          isBestSelling: action.payload.isBestSelling ?? false,
          isExclusive: action.payload.isExclusive ?? false,
          discountPrice: action.payload.discountPrice ?? action.payload.price,
          name: action.payload.name,
          image: undefined
        });
      }
    },

    /** Increments item quantity by ID */
    incrementQuantity: (state, action: PayloadAction<number>) => {
      const item = state.items.find((i) => i.id === action.payload);
      if (item) item.quantity += 1;
    },

    /** Decrements item quantity by ID, removes item if quantity becomes 0 */
    decrementQuantity: (state, action: PayloadAction<number>) => {
      const item = state.items.find((i) => i.id === action.payload);
      if (!item) return;

      if (item.quantity > 1) {
        item.quantity -= 1;
      } else {
        state.items = state.items.filter((i) => i.id !== action.payload);
      }
    },

    /** Updates product details in the cart if backend sends refreshed data */
    updateCartItems: (state, action: PayloadAction<ProductListItemDto[]>) => {
      const updatedProducts = action.payload;

      state.items = state.items.map((item) => {
        const updated = updatedProducts.find((p) => p.id === item.id);
        return updated
          ? {
              ...item,
              ...updated,
              quantity: item.quantity, // keep quantity stable
            }
          : item;
      });
    },

    /** Clears the cart completely (used after placing order) */
    clearCart: (state) => {
      state.items = [];
    },
  },
});

export const {
  addToCart,
  incrementQuantity,
  decrementQuantity,
  updateCartItems,
  clearCart,
} = cartSlice.actions;

export default cartSlice.reducer;
