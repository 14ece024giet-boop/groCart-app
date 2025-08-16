import React, { useState, useEffect } from "react";
import { View, TextInput, StyleSheet } from "react-native";

type SearchProps = {
  initialQuery?: string;
  onSearch: (query: string) => void;
  filters?: React.ReactNode;
  debounceTime?: number;
};

function Search({
  initialQuery = "",
  onSearch,
  filters = null,
  debounceTime = 300,
}: SearchProps) {
  const [query, setQuery] = useState(initialQuery);

  useEffect(() => {
    const handler = setTimeout(() => {
      onSearch(query);
    }, debounceTime);

    return () => clearTimeout(handler);
  }, [query, onSearch, debounceTime]);

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Search for products"
        value={query}
        onChangeText={setQuery}
        accessibilityLabel="Search products"
      />
      {filters && <View style={styles.filtersContainer}>{filters}</View>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  input: {
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
  },
  filtersContainer: {
    marginTop: 10,
  },
});

export default React.memo(Search);
