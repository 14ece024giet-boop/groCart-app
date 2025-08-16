import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Dimensions,
} from "react-native";
import Slider from "@react-native-community/slider";

const windowWidth = Dimensions.get("window").width;

const categories = [
  "Oil & Ghee",
  "Baby & Kids",
  "Fruits & Veges",
  "Breakfast & Dairy",
  "Frozen Products",
  "Beverages",
  "Household",
  "Meats",
  "Milk",
  "Vegetable",
];

const sortOptions = ["Lowest", "Highest", "Best", "Newest"];

type FilterProps = {
  onApply: (filters: {
    sortBy: string;
    priceRange: [number, number];
    categories: string[];
  }) => void;
  initialFilters?: {
    sortBy?: string;
    priceRange?: [number, number];
    categories?: string[];
  };
};

export default function FilterComponent({ onApply, initialFilters }: FilterProps) {
  const [sortBy, setSortBy] = useState(initialFilters?.sortBy || "Lowest");
  const [priceRange, setPriceRange] = useState<[number, number]>(
    initialFilters?.priceRange || [10, 500]
  );
  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    initialFilters?.categories || []
  );

  // Toggle category selection
  const toggleCategory = (cat: string) => {
    setSelectedCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );
  };

  // Handle price slider change (only max value slider for simplicity)
  const onPriceChange = (value: number) => {
    setPriceRange([priceRange[0], value]);
  };

  const applyFilters = () => {
    onApply({
      sortBy,
      priceRange,
      categories: selectedCategories,
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sort By</Text>
      <View style={styles.sortOptionsContainer}>
        {sortOptions.map((option) => (
          <TouchableOpacity
            key={option}
            onPress={() => setSortBy(option)}
            style={[
              styles.sortButton,
              sortBy === option && styles.sortButtonActive,
            ]}
          >
            <Text
              style={[
                styles.sortButtonText,
                sortBy === option && styles.sortButtonTextActive,
              ]}
            >
              {option}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={[styles.title, { marginTop: 20 }]}>
        Price
      </Text>
      <View style={styles.priceRangeContainer}>
        <Text style={styles.priceText}>${priceRange[0]}</Text>
        <Slider
          style={{ flex: 1 }}
          minimumValue={10}
          maximumValue={500}
          value={priceRange[1]}
          minimumTrackTintColor="#FF6347"
          maximumTrackTintColor="#eee"
          thumbTintColor="#FF6347"
          step={1}
          onValueChange={onPriceChange}
        />
        <Text style={styles.priceText}>${priceRange[1]}</Text>
      </View>

      <Text style={[styles.title, { marginTop: 20 }]}>Categories</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.categoriesContainer}
      >
        {categories.map((cat) => {
          const selected = selectedCategories.includes(cat);
          return (
            <TouchableOpacity
              key={cat}
              onPress={() => toggleCategory(cat)}
              style={[styles.categoryButton, selected && styles.categoryButtonSelected]}
            >
              <Text
                style={[styles.categoryText, selected && styles.categoryTextSelected]}
              >
                {cat}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      <TouchableOpacity style={styles.applyButton} onPress={applyFilters}>
        <Text style={styles.applyButtonText}>Apply</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fff",
  },
  title: {
    fontWeight: "bold",
    fontSize: 18,
  },
  sortOptionsContainer: {
    flexDirection: "row",
    marginTop: 12,
  },
  sortButton: {
    marginRight: 12,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 6,
  },
  sortButtonActive: {
    backgroundColor: "#FF6347",
    borderColor: "#FF6347",
  },
  sortButtonText: {
    color: "#333",
    fontWeight: "500",
  },
  sortButtonTextActive: {
    color: "white",
  },
  priceRangeContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
  },
  priceText: {
    width: 40,
    textAlign: "center",
    fontWeight: "500",
  },
  categoriesContainer: {
    marginTop: 12,
    paddingVertical: 6,
  },
  categoryButton: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginRight: 10,
  },
  categoryButtonSelected: {
    backgroundColor: "#FF6347",
    borderColor: "#FF6347",
  },
  categoryText: {
    color: "#555",
  },
  categoryTextSelected: {
    color: "white",
    fontWeight: "600",
  },
  applyButton: {
    position: "absolute",
    bottom: 20,
    left: 16,
    right: 16,
    backgroundColor: "#FF6347",
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: "center",
  },
  applyButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
});
