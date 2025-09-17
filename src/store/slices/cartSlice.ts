import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ProductDetails } from '../../types/ProductDetails';
import { ProductListItemDto } from '../../types/ProductListItemDto';

export  interface CartItem extends ProductDetails {
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
    addToCart: (state, action: PayloadAction<ProductListItemDto>) => {
      const existing = state.items.find(item => item.id === action.payload.id);
      if (existing) {
        existing.quantity += 1;
      } else {
        state.items.push({
          ...action.payload,
          quantity: 1,
          imageUrl: undefined,
          description: '',
          unitSize: '',
          brandName: '',
          categoryName: '',
        });
      }
    },

    incrementQuantity: (state, action: PayloadAction<number>) => {
      const item = state.items.find(item => item.id === action.payload);
      if (item) item.quantity += 1;
    },

    decrementQuantity: (state, action: PayloadAction<number>) => {
      const item = state.items.find(item => item.id === action.payload);
      if (item && item.quantity > 1) {
        item.quantity -= 1;
      } else {
        state.items = state.items.filter(item => item.id !== action.payload);
      }
    },


    updateCartItems: (state, action: PayloadAction<ProductListItemDto[]>) => {
      const updatedProducts = action.payload;

      state.items = state.items.map((item) => {
        const updated = updatedProducts.find(p => p.id === item.id);
        return updated ? { ...item, ...updated, quantity: item.quantity } : item;
      });
    },
  },
});

export const {
  addToCart,
  incrementQuantity,
  decrementQuantity,
  updateCartItems, 
} = cartSlice.actions;

export default cartSlice.reducer;
