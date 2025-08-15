import{ProductDetails} from '../../types/ProductDetails';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface CartItem extends ProductDetails { }


interface CartState { items: CartItem[]; }

const initialState: CartState = { items: [] };

const cartSlice = createSlice({
     name: 'cart', 
     initialState, 
     reducers: { 
        addToCart: (state, action: PayloadAction<ProductDetails>) => {
                    console.log('Adding to cart:', action.payload);
                const existing = state.items.find(item => item.id === action.payload.id);
                if (existing) { existing.quantity += 1; } 
                else { state.items.push({ ...action.payload, quantity: 1 }); } 
                },
                 incrementQuantity: (state, action: PayloadAction<number>) => { 
                const item = state.items.find(item => item.id === action.payload);
                 if (item) item.quantity += 1; 
                }
                , decrementQuantity: (state, action: PayloadAction<number>) => { 
                    const item = state.items.find(item => item.id === action.payload);
                     if (item && item.quantity > 1)
                         { item.quantity -= 1; } 
                     else { state.items = state.items.filter(item => item.id !== action.payload);

                      }
                     },
                     },
                    });



export const { addToCart, incrementQuantity, decrementQuantity } = cartSlice.actions; 
export default cartSlice.reducer;                    