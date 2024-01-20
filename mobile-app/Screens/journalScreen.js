import React, { useState } from 'react';
import { View, Text, TextInput, Button, FlatList, StyleSheet } from 'react-native';

export default function FoodJournal() {
    const [foodItem, setFoodItem] = useState('');
    const [foodList, setFoodList] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
  
    const addFoodItem = () => {
      if (foodItem.trim() !== '') {
        setFoodList([...foodList, { id: Date.now().toString(), name: foodItem }]);
        setFoodItem('');
      }
    };
  
    const searchFood = () => {
      const filteredResults = foodList.filter(item => item.name.toLowerCase().includes(searchQuery.toLowerCase()));
      setSearchResults(filteredResults);
    };
  
    return (
      <View style={styles.container}>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Enter food item or dish"
            value={foodItem}
            onChangeText={(text) => setFoodItem(text)}
          />
          <Button title="Add" onPress={addFoodItem} />
        </View>
  
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Search in Food Journal"
            value={searchQuery}
            onChangeText={(text) => setSearchQuery(text)}
          />
          <Button title="Search" onPress={searchFood} />
        </View>
  
        <View style={styles.journalContainer}>
          <Text style={styles.journalTitle}>Food Journal</Text>
          {foodList.length === 0 ? (
            <Text style={styles.emptyText}>Your food journal is empty</Text>
          ) : (
            <FlatList
              data={searchQuery.trim() !== '' ? searchResults : foodList}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <View style={styles.itemContainer}>
                  <Text>{item.name}</Text>
                </View>
              )}
            />
          )}
        </View>
      </View>
    );
  }
  

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  inputContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  input: {
    flex: 1,
    height: 40,
    borderWidth: 1,
    marginRight: 10,
    paddingHorizontal: 10,
  },
  journalContainer: {
    flex: 1,
  },
  journalTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 10,
  },
  itemContainer: {
    borderBottomWidth: 1,
    paddingVertical: 10,
  },
  emptyText: {
    fontSize: 16,
    color: 'gray',
  },
});
