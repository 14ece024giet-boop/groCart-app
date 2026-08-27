import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ProductListItemDto } from '../../types/ProductListItemDto';
import {
  getWishlistApi,
  toggleWishlistApi,
  removeFromWishlistApi,
} from '../../Utility/wishlistApi';

const FAVORITES_STORAGE_KEY = '@grocart_favorites_items';
const HAS_SEEDED_KEY = '@grocart_favorites_has_seeded';

interface FavoritesState {
  items: ProductListItemDto[];
  isLoaded: boolean;
  hasSeeded: boolean;
}

const initialState: FavoritesState = {
  items: [],
  isLoaded: false,
  hasSeeded: false,
};

// Save current favorites to local AsyncStorage
const persistToStorage = (items: ProductListItemDto[]) => {
  try {
    AsyncStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(items)).catch(() => {});
  } catch {}
};

/**
 * Async Thunk: Hydrate favorites from backend Azure SQL database when user is logged in
 */
export const fetchAndHydrateServerWishlist = createAsyncThunk(
  'favorites/fetchAndHydrateServerWishlist',
  async (_, { dispatch }) => {
    try {
      const response = await getWishlistApi();
      if (response.success && Array.isArray(response.data)) {
        dispatch(setFavoriteState({ items: response.data, hasSeeded: true }));
      }
    } catch (err: any) {
      console.warn('Failed to hydrate wishlist from server:', err.message);
    }
  }
);

/**
 * Async Thunk: Load local storage favorites on initial app boot
 */
export const loadLocalFavorites = createAsyncThunk(
  'favorites/loadLocalFavorites',
  async (_, { dispatch }) => {
    try {
      const json = await AsyncStorage.getItem(FAVORITES_STORAGE_KEY);
      const seeded = await AsyncStorage.getItem(HAS_SEEDED_KEY);
      const hasSeeded = seeded === 'true';

      if (json !== null) {
        const items = JSON.parse(json);
        if (Array.isArray(items)) {
          dispatch(setFavoriteState({ items, hasSeeded: true }));
          return;
        }
      }
      dispatch(setFavoriteState({ items: [], hasSeeded }));
    } catch (err: any) {
      console.warn('Failed to load local favorites:', err.message);
      dispatch(setFavoriteState({ items: [], hasSeeded: false }));
    }
  }
);

const favoritesSlice = createSlice({
  name: 'favorites',
  initialState,
  reducers: {
    setFavoriteState: (
      state,
      action: PayloadAction<{ items: ProductListItemDto[]; hasSeeded: boolean }>
    ) => {
      state.items = action.payload.items;
      state.hasSeeded = action.payload.hasSeeded;
      state.isLoaded = true;
      persistToStorage(state.items);
    },
    markSeeded: (state) => {
      state.hasSeeded = true;
      AsyncStorage.setItem(HAS_SEEDED_KEY, 'true').catch(() => {});
    },
    setFavoriteItems: (state, action: PayloadAction<ProductListItemDto[]>) => {
      state.items = action.payload;
      state.hasSeeded = true;
      state.isLoaded = true;
      AsyncStorage.setItem(HAS_SEEDED_KEY, 'true').catch(() => {});
      persistToStorage(state.items);
    },
    toggleFavorite: (state, action: PayloadAction<ProductListItemDto>) => {
      const index = state.items.findIndex((item) => item.id === action.payload.id);
      if (index >= 0) {
        state.items.splice(index, 1);
        removeFromWishlistApi(action.payload.id).catch(() => {});
      } else {
        state.items.push(action.payload);
        toggleWishlistApi(action.payload.id).catch(() => {});
      }
      state.hasSeeded = true;
      AsyncStorage.setItem(HAS_SEEDED_KEY, 'true').catch(() => {});
      persistToStorage(state.items);
    },
    removeFavorite: (state, action: PayloadAction<number>) => {
      const productId = action.payload;
      state.items = state.items.filter((item) => item.id !== productId);
      state.hasSeeded = true;
      AsyncStorage.setItem(HAS_SEEDED_KEY, 'true').catch(() => {});
      persistToStorage(state.items);

      // Async sync with SQL Server in background
      removeFromWishlistApi(productId).catch(() => {});
    },
    clearFavorites: (state) => {
      state.items = [];
      state.hasSeeded = true;
      AsyncStorage.setItem(HAS_SEEDED_KEY, 'true').catch(() => {});
      persistToStorage([]);
    },
    resetFavoritesOnLogout: (state) => {
      state.items = [];
      state.hasSeeded = false;
      state.isLoaded = true;
      AsyncStorage.removeItem(FAVORITES_STORAGE_KEY).catch(() => {});
      AsyncStorage.removeItem(HAS_SEEDED_KEY).catch(() => {});
    },
  },
});

export const {
  setFavoriteState,
  markSeeded,
  setFavoriteItems,
  toggleFavorite,
  removeFavorite,
  clearFavorites,
  resetFavoritesOnLogout,
} = favoritesSlice.actions;

export default favoritesSlice.reducer;
