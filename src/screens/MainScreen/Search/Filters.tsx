import React, { useState } from "react";
import { View, Text, Switch, StyleSheet } from "react-native";
import Slider from "@react-native-community/slider";

type FiltersProps = {
  onFilterChange: (filters: { priceRange: number[]; categories: string[] }) => void;
};

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

function Filters({ onFilterChange }: FiltersProps) {
  const [priceRange, setPriceRange] = useState([10, 500]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  const handleCategoryToggle = (cat: string) => {
    const newCategories = selectedCategories.includes(cat)
      ? selectedCategories.filter((c) => c !== cat)
      : [...selectedCategories, cat];
    setSelectedCategories(newCategories);
    onFilterChange({ priceRange, categories: newCategories });
  };

  const handlePriceChange = (newMax: number) => {
    const newRange: [number, number] = [priceRange[0], newMax];
    setPriceRange(newRange);
    onFilterChange({ priceRange: newRange, categories: selectedCategories });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>
        Price: ${priceRange[0]} - ${priceRange[1]}
      </Text>
      <Slider
        style={{ width: "100%", height: 40 }}
        minimumValue={priceRange[0]}
        maximumValue={500}
        value={priceRange[1]}
        step={1}
        onValueChange={handlePriceChange}
        minimumTrackTintColor="#1fb28a"
        maximumTrackTintColor="#d3d3d3"
        thumbTintColor="#b9e4c9"
      />

      <Text style={[styles.label, { marginTop: 20 }]}>Categories</Text>
      {categories.map((cat) => (
        <View key={cat} style={styles.categoryRow}>
          <Switch
            value={selectedCategories.includes(cat)}
            onValueChange={() => handleCategoryToggle(cat)}
          />
          <Text style={styles.categoryLabel}>{cat}</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  label: {
    fontWeight: "bold",
    marginBottom: 8,
  },
  categoryRow: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 4,
  },
  categoryLabel: {
    marginLeft: 8,
    fontSize: 16,
  },
});

export default React.memo(Filters);
