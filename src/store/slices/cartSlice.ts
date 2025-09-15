import{ProductDetails} from '../../types/ProductDetails';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ProductListItemDto } from '../../types/ProductListItemDto';

interface CartItem extends ProductDetails { 
    quantity: number;
}


interface CartState { items: CartItem[]; }

const initialState: CartState = { items: [] };

const cartSlice = createSlice({
     name: 'cart', 
     initialState, 
     reducers: { 
        addToCart: (state, action: PayloadAction<ProductListItemDto>) => {
                    console.log('Adding to cart:', action.payload);
                const existing = state.items.find(item => item.id === action.payload.id);
                if (existing) { existing.quantity += 1; } 
                else { state.items.push({
                    ...action.payload, quantity: 1,
                    imageUrl: undefined,
                    description: '',
                    // weight: '',
                    unitSize: '',
                    brandName: '',
                    categoryName: '',
                    // createdAt: ''
                }); } 
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