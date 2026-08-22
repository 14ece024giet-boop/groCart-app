import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ProductDetails } from '../../types/ProductDetails';
import { ProductListItemDto } from '../../types/ProductListItemDto';
import {
  getBasketApi,
  addItemToBasketApi,
  removeItemFromBasketApi,
  clearBasketApi,
} from '../../Utility/basketApi';

const CART_STORAGE_KEY = '@grocart_cart_items';

// Each item in the cart extends ProductDetails and adds quantity
export interface CartItem extends ProductDetails {
  quantity: number;
}

interface CartState {
  items: CartItem[];
  isSyncing: boolean;
}

const initialState: CartState = {
  items: [],
  isSyncing: false,
};

// Helper: Save current cart to local AsyncStorage
const persistToStorage = (items: CartItem[]) => {
  try {
    AsyncStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items)).catch(() => {});
  } catch {}
};

/**
 * Async Thunk: Hydrate cart from backend Azure SQL database when user is logged in
 */
export const fetchAndHydrateServerCart = createAsyncThunk(
  'cart/fetchAndHydrateServerCart',
  async (_, { dispatch }) => {
    try {
      const response = await getBasketApi();
      if (response.success && Array.isArray(response.data) && response.data.length > 0) {
        dispatch(setCartItems(response.data));
      }
    } catch (err: any) {
      console.warn('Failed to hydrate cart from server:', err.message);
    }
  }
);

/**
 * Async Thunk: Load local storage cart on initial app boot
 */
export const loadLocalCart = createAsyncThunk(
  'cart/loadLocalCart',
  async (_, { dispatch }) => {
    try {
      const json = await AsyncStorage.getItem(CART_STORAGE_KEY);
      if (json) {
        const items = JSON.parse(json);
        if (Array.isArray(items)) {
          dispatch(setCartItems(items));
        }
      }
    } catch (err: any) {
      console.warn('Failed to load local cart:', err.message);
    }
  }
);

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    /** Sets exact cart items array (used when hydrating from backend or AsyncStorage) */
    setCartItems: (state, action: PayloadAction<CartItem[]>) => {
      state.items = action.payload;
      persistToStorage(state.items);
    },

    /**
     * Adds a product to the cart.
     * If the item already exists, increments its quantity.
     */
    addToCart: (state, action: PayloadAction<ProductListItemDto>) => {
      const existing = state.items.find((item) => item.id === action.payload.id);
      let newQuantity = 1;

      if (existing) {
        existing.quantity += 1;
        newQuantity = existing.quantity;
      } else {
        state.items.push({
          ...action.payload,
          quantity: 1,
          imageUrl: action.payload.imageUrl || '',
          description: action.payload.description || '',
          unitSize: action.payload.unitSize || '',
          brandName: action.payload.brandName || '',
          categoryName: action.payload.categoryName || '',
          isBestSelling: action.payload.isBestSelling ?? false,
          isExclusive: action.payload.isExclusive ?? false,
          discountPrice: action.payload.discountPrice ?? action.payload.price,
          name: action.payload.name,
          image: undefined,
        });
      }

      persistToStorage(state.items);

      // Async sync with Azure SQL database in background
      addItemToBasketApi(action.payload.id, newQuantity).catch(() => {});
    },

    /** Increments item quantity by ID */
    incrementQuantity: (state, action: PayloadAction<number>) => {
      const item = state.items.find((i) => i.id === action.payload);
      if (item) {
        item.quantity += 1;
        persistToStorage(state.items);
        addItemToBasketApi(item.id, item.quantity).catch(() => {});
      }
    },

    /** Decrements item quantity by ID, removes item if quantity becomes 0 */
    decrementQuantity: (state, action: PayloadAction<number>) => {
      const item = state.items.find((i) => i.id === action.payload);
      if (!item) return;

      if (item.quantity > 1) {
        item.quantity -= 1;
        persistToStorage(state.items);
        addItemToBasketApi(item.id, item.quantity).catch(() => {});
      } else {
        const productId = item.id;
        state.items = state.items.filter((i) => i.id !== productId);
        persistToStorage(state.items);
        removeItemFromBasketApi(productId).catch(() => {});
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
              quantity: item.quantity,
            }
          : item;
      });
      persistToStorage(state.items);
    },

    /** Clears local cart completely (used after placing order or logging out) */
    clearCart: (state) => {
      state.items = [];
      persistToStorage([]);
      clearBasketApi().catch(() => {});
    },

    /** Resets local Redux cart state without wiping backend database (used on logout) */
    resetCartOnLogout: (state) => {
      state.items = [];
      AsyncStorage.removeItem(CART_STORAGE_KEY).catch(() => {});
    },
  },
});

export const {
  setCartItems,
  addToCart,
  incrementQuantity,
  decrementQuantity,
  updateCartItems,
  clearCart,
  resetCartOnLogout,
} = cartSlice.actions;

export default cartSlice.reducer;
