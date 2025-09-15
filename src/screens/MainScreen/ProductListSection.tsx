import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Animated,
  ViewStyle,
  TextStyle,
} from "react-native";
import { useNavigation, NavigationProp } from "@react-navigation/native";
import LongButton from "../../components/LongButton";
import QuantityButton from "../../components/QuantityButton";
import type { RootStackParamList } from "../../navigation/navigation";
import type { Product } from "./Product";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store";
import { ProductDetails } from "../../types/ProductDetails";
import {
  addToCart,
  decrementQuantity,
  incrementQuantity,
} from "../../store/slices/cartSlice";
import { ProductListItemDto } from "../../types/ProductListItemDto";

type NavProp = NavigationProp<RootStackParamList, "ProductDetials">;




interface Props {
  title: string;
  products: ProductListItemDto[];
  onSeeAllPress?: () => void;
  cardStyle?: ViewStyle;
  titleStyle?: TextStyle;
  badge?: boolean;
  animateImage?: boolean;
  sectionType?: 'bestSelling' | 'exclusive';
}

const ProductListSection = ({
  title,
  products,
  onSeeAllPress,
  cardStyle,
  badge,
  animateImage,
  sectionType = 'bestSelling',
}: Props) => {
  const navigation = useNavigation<NavProp>();
  const dispatch = useDispatch();
  const cartItems = useSelector((state: RootState) => state.cart.items);

  const getQuantity = (productId: number) =>
    cartItems.find((item) => item.id === productId)?.quantity || 0;

  const handleAdd = (product:ProductListItemDto) => {
    dispatch(addToCart(product));
  };

  const handleIncrease = (id: number) => {
    dispatch(incrementQuantity(id));
  };

  const handleDecrease = (id: number) => {
    dispatch(decrementQuantity(id));
  };
// const AnimatedImage = ({ source }: { source: any }) => {
//   const scale = useRef(new Animated.Value(0.8)).current;

//   useEffect(() => {
//     Animated.spring(scale, {
//       toValue: 1,
//       useNativeDriver: true,
//       friction: 5,
//     }).start();
//   }, []);

//   return (
//     <Animated.Image
//       source={source}
//       style={[
//         {
//           width: '100%',
//           height: '100%',
//           resizeMode: 'contain',
//           borderRadius: 8,
//           transform: [{ scale }],
//         },
//       ]}
//     />
//   );
// };

const AnimatedImage = ({
  source,
  index,
}: {
  source: any;
  index: number;
}) => {
  const scale = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.spring(scale, {
      toValue: 1,
      useNativeDriver: true,
      friction: 6,
        delay: index * 100,
    }).start();
  }, []);

  return (
    <Animated.Image
      source={source}
        style={[styles.imagePlaceholder, { transform: [{ scale }] }]}
    />
  );
};


  return (
    <View style={styles.wrapper}>
      <View style={styles.header}>
        <Text style={[styles.title]}>{title}</Text>
        {onSeeAllPress && (
          <TouchableOpacity onPress={onSeeAllPress}>
            <Text style={styles.seeAll}>See All</Text>
          </TouchableOpacity>
        )}
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
       {products.map((product, index) => {
          const quantity = getQuantity(product.id);

          return (
            <TouchableOpacity
              key={product.id}
              onPress={() =>
                navigation.navigate("ProductDetials", {
                  productId: product.id,
                  sectionType,
                })
              }
              style={[styles.card, cardStyle]}
            >
              <View style={styles.imageWrapper}>
        {animateImage ? (
          <AnimatedImage source={product.imageUrl} index={index} />
        ) : (
                  <Image source={{ uri: product.imageUrl }} style={styles.image} />
        )}

        {badge && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>Exclusive</Text>
          </View>
        )}
      </View>

              <Text style={styles.quantityLabel}>
                {/* {product.quantity}  */}
              </Text>

              <Text style={styles.productTitle}>{product.title}</Text>

              {quantity === 0 ? (
                <LongButton
                  title="Add"
                  onPress={() => handleAdd(product)}
                  style={styles.addButton}
                />
              ) : (
                <View style={styles.counterContainer}>
                  <QuantityButton
                    title="−"
                    onPress={() => handleDecrease(product.id)}
                    style={styles.counterButton}
                  />
                  <Text style={styles.counterText}>{quantity}</Text>
                  <QuantityButton
                    title="+"
                    onPress={() => handleIncrease(product.id)}
                    style={styles.counterButton}
                  />
                </View>
              )}

              <View style={styles.priceRow}>
                <Text style={styles.originalPrice}>
                  {`$${product.price}`}
                </Text>
                <Text style={styles.discountedPrice}>
                  {`$${product.discountPrice}`}
                </Text>
            </View>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: { marginBottom: 24 },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 4,
    marginBottom: 12,
  },
  title: { fontWeight: "bold", fontSize: 16, color: "#222" },
  seeAll: { color: "red", fontWeight: "600" },
card: {
  width: 160,
    backgroundColor: "#fff",
  marginRight: 12,
  padding: 10,
  borderRadius: 12,
    borderColor: "#FFD700",
  borderWidth: 1,
    shadowColor: "#FFD700",
  shadowOpacity: 0.3,
  shadowOffset: { width: 0, height: 2 },
  shadowRadius: 6,
  elevation: 4,
},
  imageWrapper: { position: "relative", marginBottom: 8 },
  imagePlaceholder: {
    width: "100%",
    height: 100,
    backgroundColor: "#ccc",
    borderRadius: 8,
    marginBottom: 8,
  },
  image: {
    width: "100%",
    height: 100,
    resizeMode: "contain",
    borderRadius: 8,
  },
  badge: {
    position: "absolute",
  top: 6,
  left: 6,
    backgroundColor: "#FFD700",
  paddingHorizontal: 6,
  paddingVertical: 2,
  borderRadius: 4,
  zIndex: 1,
},
  badgeText: { color: "#333", fontSize: 10, fontWeight: "bold" },
  quantityLabel: { fontSize: 12, color: "red", marginBottom: 4 },
  productTitle: { fontSize: 13, fontWeight: "500", marginBottom: 8 },
  addButton: {
    backgroundColor: "red",
    paddingVertical: 6,
    borderRadius: 6,
    alignItems: "center",
  },
  counterContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 6,
  },
  counterButton: {
    backgroundColor: "red",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 4,
  },
  counterText: { marginHorizontal: 10, fontSize: 16, fontWeight: "bold" },
  priceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 4,
  },
  originalPrice: { textDecorationLine: "line-through", color: "#999" },
  discountedPrice: { color: "red", fontWeight: "bold" },
});

export default ProductListSection;
