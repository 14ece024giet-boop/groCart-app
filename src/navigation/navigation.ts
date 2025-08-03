export type RootStackParamList = {
  Welcome: undefined;
  CreateAccount: undefined;
  SignIn: undefined;
  Cart: undefined;
   Main: undefined;
   PromoDetails: undefined;
   PromoCarousel: undefined;
    Favorites: undefined;
    Search: undefined;
    Profile: undefined;
    EditProfile: undefined;
    Orders: undefined;
    OrderTracking: { orderId: string };
    ProductScreen: { productId: number | string };
    PhoneVerification:undefined;
     OtpVerification: { phoneNumber: string };
    
};