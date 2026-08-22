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
  ManageAddress: undefined;
  Orders: undefined;
  OrderTracking: { orderId: string };
  // ✅ fixed name below
  ProductDetails: { productId: string; sectionType?: 'bestSelling' | 'exclusive' };
  PhoneVerification: undefined;
  OtpVerification: {
    phoneNumber?: string; // For login flow
    userData?: {
      Name: string;
      Email: string;
      PhoneNumber: string;
      Password?: string;
    }; // For registration flow
  };
  CheckoutDetails: { couponCode?: string };
  OrderConfirmation: { qrCodeUrl: string };
  DeliveryOrderDetails: { orderId: number };
  QRScanner: undefined;
  TestQRScannerButton: undefined;
  TestQRScannerButtonScreen: undefined;
};
