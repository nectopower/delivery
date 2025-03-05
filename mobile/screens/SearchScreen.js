import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  FlatList,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  SafeAreaView,
  SectionList
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import api from '../services/api';

const SearchScreen = () => {
  const navigation = useNavigation();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState({ restaurants: [], dishes: [] });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [recentSearches, setRecentSearches] = useState([
    'Pizza', 'Burger', 'Sushi', 'Salad', 'Pasta'
  ]);
  const [activeTab, setActiveTab] = useState('all'); // 'all', 'restaurants', 'dishes'

  useEffect(() => {
    if (searchQuery.length > 2) {
      searchRestaurantsAndDishes();
    } else {
      setSearchResults({ restaurants: [], dishes: [] });
    }
  }, [searchQuery]);

  const searchRestaurantsAndDishes = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // In a real app, you would have a search endpoint
      // For now, we'll fetch restaurants and dishes separately
      const restaurantsResponse = await api.get('/restaurant');
      const dishesResponse = await api.get('/dishes');
      
      const filteredRestaurants = restaurantsResponse.data.filter(restaurant => 
        restaurant.isApproved && 
        (restaurant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
         restaurant.description?.toLowerCase().includes(searchQuery.toLowerCase()))
      );
      
      const filteredDishes = dishesResponse.data.filter(dish => 
        dish.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        dish.description?.toLowerCase().includes(searchQuery.toLowerCase())
      );
      
      setSearchResults({
        restaurants: filteredRestaurants,
        dishes: filteredDishes
      });
    } catch (err) {
      console.error('Error searching:', err);
      setError('Failed to search restaurants and dishes');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    if (searchQuery.trim() !== '') {
      searchRestaurantsAndDishes();
      
      // Add to recent searches if not already there
      if (!recentSearches.includes(searchQuery.trim())) {
        setRecentSearches(prev => [searchQuery.trim(), ...prev.slice(0, 4)]);
      }
    }
  };

  const clearSearch = () => {
    setSearchQuery('');
    setSearchResults({ restaurants: [], dishes: [] });
  };

  const renderRestaurantItem = ({ item }) => (
    <TouchableOpacity
      style={styles.restaurantItem}
      onPress={() => navigation.navigate('Restaurant', { restaurantId: item.id })}
    >
      <Image
        source={{ uri: item.logo || 'https://via.placeholder.com/100' }}
        style={styles.restaurantImage}
      />
      <View style={styles.restaurantInfo}>
        <Text style={styles.restaurantName}>{item.name}</Text>
        <Text style={styles.restaurantDescription} numberOfLines={1}>
          {item.description || 'Restaurante parceiro'}
        </Text>
        <View style={styles.restaurantMeta}>
          <Ionicons name="star" size={16} color="#FFD700" />
          <Text style={styles.restaurantRating}>4.5</Text>
          <Text style={styles.restaurantDistance}>• 2.5 km</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderDishItem = ({ item }) => (
    <TouchableOpacity
      style={styles.dishItem}
      onPress={() => navigation.navigate('Restaurant', { 
        restaurantId: item.restaurantId,
        highlightDishId: item.id 
      })}
    >
      <Image
        source={{ uri: item.image || 'https://via.placeholder.com/100' }}
        style={styles.dishImage}
      />
      <View style={styles.dishInfo}>
        <Text style={styles.dishName}>{item.name}</Text>
        <Text style={styles.dishDescription} numberOfLines={1}>
          {item.description || 'Prato especial'}
        </Text>
        <View style={styles.dishMeta}>
          <Text style={styles.dishPrice}>
            {new Intl.NumberFormat('pt-BR', {
              style: 'currency',
              currency: 'BRL'
            }).format(item.price)}
          </Text>
          <Text style={styles.dishRestaurant}>
            {item.restaurantName || 'Restaurante'}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderSectionHeader = ({ section }) => (
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionTitle}>{section.title}</Text>
      <Text style={styles.sectionCount}>{section.data.length} {section.title.toLowerCase()}</Text>
    </View>
  );

  const getFilteredResults = () => {
    if (activeTab === 'all') {
      return [
        { title: 'Restaurantes', data: searchResults.restaurants },
        { title: 'Pratos', data: searchResults.dishes }
      ].filter(section => section.data.length > 0);
    } else if (activeTab === 'restaurants') {
      return [{ title: 'Restaurantes', data: searchResults.restaurants }];
    } else {
      return [{ title: 'Pratos', data: searchResults.dishes }];
    }
  };

  const renderSearchResults = () => {
    const filteredResults = getFilteredResults();
    
    if (filteredResults.length === 0) {
      return (
        <View style={styles.noResultsContainer}>
          <Ionicons name="search-outline" size={60} color="#ccc" />
          <Text style={styles.noResultsText}>
            Nenhum resultado encontrado para "{searchQuery}"
          </Text>
        </View>
      );
    }
    
    return (
      <SectionList
        sections={filteredResults}
        keyExtractor={(item) => item.id}
        renderItem={({ section, item }) => 
          section.title === 'Restaurantes' 
            ? renderRestaurantItem({ item }) 
            : renderDishItem({ item })
        }
        renderSectionHeader={renderSectionHeader}
        stickySectionHeadersEnabled={true}
        contentContainerStyle={styles.resultsList}
      />
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color="#666" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar restaurantes e pratos"
            value={searchQuery}
            onChangeText={setSearchQuery}
            onSubmitEditing={handleSearch}
            autoFocus
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={clearSearch} style={styles.clearButton}>
              <Ionicons name="close-circle" size={20} color="#666" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {searchQuery.length > 2 && (
        <View style={styles.tabsContainer}>
          <TouchableOpacity 
            style={[styles.tab, activeTab === 'all' && styles.activeTab]}
            onPress={() => setActiveTab('all')}
          >
            <Text style={[styles.tabText, activeTab === 'all' && styles.activeTabText]}>
              Todos
            </Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.tab, activeTab === 'restaurants' && styles.activeTab]}
            onPress={() => setActiveTab('restaurants')}
          >
            <Text style={[styles.tabText, activeTab === 'restaurants' && styles.activeTabText]}>
              Restaurantes ({searchResults.restaurants.length})
            </Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.tab, activeTab === 'dishes' && styles.activeTab]}
            onPress={() => setActiveTab('dishes')}
          >
            <Text style={[styles.tabText, activeTab === 'dishes' && styles.activeTabText]}>
              Pratos ({searchResults.dishes.length})
            </Text>
          </TouchableOpacity>
        </View>
      )}

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#FF4500" />
        </View>
      ) : error ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      ) : searchQuery.length > 2 ? (
        renderSearchResults()
      ) : (
        <View style={styles.recentSearchesContainer}>
          <Text style={styles.recentSearchesTitle}>Buscas recentes</Text>
          <FlatList
            data={recentSearches}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.recentSearchItem}
                onPress={() => setSearchQuery(item)}
              >
                <Ionicons name="time-outline" size={20} color="#666" />
                <Text style={styles.recentSearchText}>{item}</Text>
              </TouchableOpacity>
            )}
            keyExtractor={(item) => item}
          />
          
          <Text style={styles.suggestionsTitle}>Sugestões para você</Text>
          <View style={styles.categoriesContainer}>
            {['Pizza', 'Hambúrguer', 'Brasileira', 'Japonesa', 'Saudável', 'Doces'].map((category) => (
              <TouchableOpacity
                key={category}
                style={styles.categoryButton}
                onPress={() => setSearchQuery(category)}
              >
                <Text style={styles.categoryText}>{category}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingTop: 50,
    paddingBottom: 15,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  backButton: {
    marginRight: 10,
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    paddingHorizontal: 10,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    height: 40,
    fontSize: 16,
  },
  clearButton: {
    padding: 5,
  },
  tabsContainer: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    backgroundColor: '#fff',
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#FF4500',
  },
  tabText: {
    fontSize: 14,
    color: '#666',
  },
  activeTabText: {
    color: '#FF4500',
    fontWeight: 'bold',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    fontSize: 16,
  },
  resultsList: {
    padding: 15,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  sectionCount: {
    fontSize: 14,
    color: '#666',
  },
  restaurantItem: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 10,
    marginBottom: 15,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  restaurantImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
  },
  restaurantInfo: {
    flex: 1,
    marginLeft: 15,
    justifyContent: 'center',
  },
  restaurantName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  restaurantDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  restaurantMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  restaurantRating: {
    marginLeft: 5,
    fontSize: 14,
    fontWeight: 'bold',
  },
  restaurantDistance: {
    marginLeft: 5,
    fontSize: 14,
    color: '#666',
  },
  dishItem: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 10,
    marginBottom: 15,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  dishImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
  },
  dishInfo: {
    flex: 1,
    marginLeft: 15,
    justifyContent: 'center',
  },
  dishName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  dishDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  dishMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dishPrice: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FF4500',
  },
  dishRestaurant: {
    fontSize: 12,
    color: '#666',
  },
  noResultsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  noResultsText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  recentSearchesContainer: {
    flex: 1,
    padding: 20,
  },
  recentSearchesTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  recentSearchItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  recentSearchText: {
    marginLeft: 10,
    fontSize: 16,
    color: '#333',
  },
  suggestionsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 25,
    marginBottom: 15,
  },
  categoriesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  categoryButton: {
    backgroundColor: '#f0f0f0',
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 8,
    margin: 5,
  },
  categoryText: {
    fontSize: 14,
    color: '#333',
  },
});

export default SearchScreen;
