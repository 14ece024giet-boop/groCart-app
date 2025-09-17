import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface CouponState {
  code: string;
}

const initialState: CouponState = {
  code: '',
};

const couponSlice = createSlice({
  name: 'coupon',
  initialState,
  reducers: {
    setCouponCode: (state, action: PayloadAction<string>) => {
      state.code = action.payload;
    },
  },
});

export const { setCouponCode } = couponSlice.actions;
export default couponSlice.reducer;