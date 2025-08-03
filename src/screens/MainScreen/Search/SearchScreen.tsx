import React, { useState, useCallback } from "react";
import { View, FlatList, Text, StyleSheet, TouchableOpacity } from "react-native";
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Filters from "./Filters";
import Search from "./Search";

function SearchScreen() {
  const [filters, setFilters] = useState({});
  const [results, setResults] = useState([]);
  const [showFilters, setShowFilters] = useState(false);

    // const fetchResults = useCallback(async (query, filters) => {
    //   try {
    //     const response = await fetch("https://your-api-url.com/api/search", {
    //       method: "POST",
    //       headers: { "Content-Type": "application/json" },
    //       body: JSON.stringify({ query, filters }),
    //     });
    //     const data = await response.json();
    //     setResults(data.results);
    //   } catch (error) {
    //     console.error(error);
    //   }
    // }, []);
const fetchResults = useCallback(async (query, filters) => {
  // Simulate delay
  await new Promise((resolve) => setTimeout(resolve, 500));

  // Filter mock data
  const mockData = [
    { id: 1, name: "Apple" },
    { id: 2, name: "Milk" },
    { id: 3, name: "Maggi" },
    { id: 4, name: "Baby Powder" },
  ];

  const filtered = mockData.filter(item =>
    item.name.toLowerCase().includes(query.toLowerCase())
  );

  setResults(filtered);
}, []);

  const handleSearch = (query) => {
    fetchResults(query, filters);
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    fetchResults("", newFilters);
  };

  // Toggle filters panel visibility
  const toggleFilters = () => {
    setShowFilters((prev) => !prev);
  };

  return (
    <View style={styles.container}>
      <Search
        onSearch={handleSearch}
        filters={
          <TouchableOpacity onPress={toggleFilters} style={styles.filterIconContainer}>
            {/* Replace this Text with your actual filter icon component */}
            <Text style={styles.filterIcon}><Icon name="filter-variant" size={24} color="#333" /></Text>
          </TouchableOpacity>
        }
      />

      {/* Render Filters only if showFilters is true */}
      {showFilters && <Filters onFilterChange={handleFilterChange} />}

      <FlatList
        data={results}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.resultItem}>
            <Text>{item.name}</Text>
          </View>
        )}
        ListEmptyComponent={<Text style={styles.emptyText}>No results found</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 16, paddingTop: 20 },
  filterIconContainer: {
    padding: 8,
  },
  filterIcon: {
    fontSize: 24,
  },
  resultItem: {
    paddingVertical: 10,
    borderBottomColor: "#ccc",
    borderBottomWidth: 1,
  },
  emptyText: {
    textAlign: "center",
    marginTop: 20,
    color: "#888",
  },
});

export default SearchScreen;
