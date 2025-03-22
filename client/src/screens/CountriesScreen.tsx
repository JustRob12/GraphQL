import React, { useState } from 'react';
import { 
  View, 
  Text, 
  FlatList, 
  StyleSheet, 
  TextInput, 
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Dimensions,
  Modal,
  ScrollView
} from 'react-native';
import { useQuery } from '@apollo/client';
import { GET_COUNTRIES, GET_CONTINENTS } from '../apollo/queries';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList, Country } from '../types';

type CountriesScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Countries'>;
};

const { width } = Dimensions.get('window');

const CountriesScreen: React.FC<CountriesScreenProps> = ({ navigation }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedContinent, setSelectedContinent] = useState('ALL');
  const [showContinentPicker, setShowContinentPicker] = useState(false);
  
  const { loading: countriesLoading, error: countriesError, data: countriesData } = useQuery(GET_COUNTRIES);
  const { loading: continentsLoading, error: continentsError, data: continentsData } = useQuery(GET_CONTINENTS);

  // Simplified restart flow - navigate back to splash screen
  const handleRestart = () => {
    navigation.replace('Splash');
  };

  // Filter countries based on search query and selected continent
  const filteredCountries = countriesData?.countries.filter((country: Country) => {
    const matchesSearch = country.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesContinent = selectedContinent === 'ALL' || country.continent.code === selectedContinent;
    return matchesSearch && matchesContinent;
  }) || [];

  const toggleContinentPicker = () => {
    setShowContinentPicker(!showContinentPicker);
  };

  const selectContinent = (continentCode: string) => {
    setSelectedContinent(continentCode);
    setShowContinentPicker(false);
  };

  const getSelectedContinentName = () => {
    if (selectedContinent === 'ALL') return 'All Continents';
    const continent = continentsData?.continents.find(
      (c: {code: string; name: string}) => c.code === selectedContinent
    );
    return continent ? continent.name : 'All Continents';
  };

  const renderCountryItem = ({ item, index }: { item: Country; index: number }) => {
    // Alternate colors for a more dynamic list
    const isEven = index % 2 === 0;
    
    return (
      <TouchableOpacity
        style={[
          styles.countryCard,
          { backgroundColor: isEven ? '#ffffff' : '#f9fafb' }
        ]}
        onPress={() => navigation.navigate('CountryDetail', { country: item })}
        activeOpacity={0.7}
      >
        <View style={styles.cardContent}>
          <View style={styles.leftContent}>
            <Text style={styles.countryEmoji}>{item.emoji}</Text>
          </View>
          
          <View style={styles.rightContent}>
            <Text style={styles.countryName}>{item.name}</Text>
            
            <View style={styles.countryDetails}>
              {item.capital && (
                <View style={styles.detailItem}>
                  <Text style={styles.detailLabel}>Capital:</Text>
                  <Text style={styles.detailValue}>{item.capital}</Text>
                </View>
              )}
              
              {item.currency && (
                <View style={styles.detailItem}>
                  <Text style={styles.detailLabel}>Currency:</Text>
                  <Text style={styles.detailValue}>{item.currency}</Text>
                </View>
              )}
              
              <View style={styles.continentBadge}>
                <Text style={styles.continentText}>{item.continent.name}</Text>
              </View>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.title}>Explore Countries</Text>
        </View>
        <TouchableOpacity onPress={handleRestart} style={styles.restartButton}>
          <Text style={styles.restartText}>Restart</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search countries..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          clearButtonMode="always"
          placeholderTextColor="#9ca3af"
        />
        
        <View style={styles.filterContainer}>
          <TouchableOpacity 
            style={styles.continentPicker}
            onPress={toggleContinentPicker}
          >
            <Text style={styles.selectedContinentText}>
              {getSelectedContinentName()}
            </Text>
            <Text style={styles.dropdownIcon}>▼</Text>
          </TouchableOpacity>
        </View>
        
        {/* Continent Picker Modal */}
        <Modal
          visible={showContinentPicker}
          transparent={true}
          animationType="slide"
          onRequestClose={() => setShowContinentPicker(false)}
        >
          <TouchableOpacity 
            style={styles.modalOverlay} 
            activeOpacity={1}
            onPress={() => setShowContinentPicker(false)}
          >
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Select Continent</Text>
                <TouchableOpacity onPress={() => setShowContinentPicker(false)}>
                  <Text style={styles.closeButton}>✕</Text>
                </TouchableOpacity>
              </View>
              
              <ScrollView style={styles.continentList}>
                <TouchableOpacity 
                  style={[
                    styles.continentOption,
                    selectedContinent === 'ALL' && styles.selectedOption
                  ]}
                  onPress={() => selectContinent('ALL')}
                >
                  <Text style={[
                    styles.continentOptionText,
                    selectedContinent === 'ALL' && styles.selectedOptionText
                  ]}>
                    All Continents
                  </Text>
                </TouchableOpacity>
                
                {continentsData?.continents.map((continent: {code: string; name: string}) => (
                  <TouchableOpacity 
                    key={continent.code}
                    style={[
                      styles.continentOption,
                      selectedContinent === continent.code && styles.selectedOption
                    ]}
                    onPress={() => selectContinent(continent.code)}
                  >
                    <Text style={[
                      styles.continentOptionText,
                      selectedContinent === continent.code && styles.selectedOptionText
                    ]}>
                      {continent.name}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          </TouchableOpacity>
        </Modal>
      </View>

      {(countriesLoading || continentsLoading) ? (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color="#4285F4" />
          <Text style={styles.loadingText}>Loading countries...</Text>
        </View>
      ) : (countriesError || continentsError) ? (
        <View style={styles.centered}>
          <Text style={styles.errorText}>Failed to load countries</Text>
          <Text style={styles.errorSubtext}>{countriesError?.message || continentsError?.message}</Text>
        </View>
      ) : (
        <FlatList
          data={filteredCountries}
          keyExtractor={(item) => item.code}
          renderItem={renderCountryItem}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.centered}>
              <Text style={styles.emptyText}>
                {searchQuery || selectedContinent !== 'ALL' ? 'No countries match your criteria' : 'No countries available'}
              </Text>
            </View>
          }
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f3f4f6',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 20,
    backgroundColor: '#4285F4',
  },
  headerLeft: {
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  restartButton: {
    padding: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 8,
    paddingHorizontal: 12,
  },
  restartText: {
    color: '#ffffff',
    fontWeight: '600',
  },
  searchContainer: {
    padding: 16,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 3,
  },
  searchInput: {
    backgroundColor: '#f9fafb',
    padding: 12,
    borderRadius: 10,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    marginBottom: 12,
  },
  filterContainer: {
    marginTop: 4,
  },
  continentPicker: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#f9fafb',
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  selectedContinentText: {
    fontSize: 16,
    color: '#4b5563',
  },
  dropdownIcon: {
    fontSize: 12,
    color: '#6b7280',
  },
  listContent: {
    padding: 16,
    paddingBottom: 30,
  },
  countryCard: {
    borderRadius: 16,
    marginBottom: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardContent: {
    flexDirection: 'row',
    padding: 16,
  },
  leftContent: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#f3f4f6',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  rightContent: {
    flex: 1,
  },
  countryEmoji: {
    fontSize: 32,
  },
  countryName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 6,
  },
  countryDetails: {
    flexDirection: 'column',
    gap: 4,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  detailLabel: {
    fontSize: 14,
    color: '#6b7280',
    marginRight: 4,
    fontWeight: '500',
  },
  detailValue: {
    fontSize: 14,
    color: '#1f2937',
  },
  continentBadge: {
    alignSelf: 'flex-start',
    marginTop: 6,
    paddingHorizontal: 10,
    paddingVertical: 4,
    backgroundColor: '#e0e7ff',
    borderRadius: 20,
  },
  continentText: {
    fontSize: 12,
    color: '#4338ca',
    fontWeight: '500',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#6b7280',
  },
  errorText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ef4444',
    marginBottom: 8,
  },
  errorSubtext: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '70%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  closeButton: {
    fontSize: 18,
    color: '#6b7280',
    padding: 5,
  },
  continentList: {
    paddingHorizontal: 16,
  },
  continentOption: {
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  selectedOption: {
    backgroundColor: '#f3f4f6',
    borderRadius: 8,
    paddingHorizontal: 10,
  },
  continentOptionText: {
    fontSize: 16,
    color: '#4b5563',
  },
  selectedOptionText: {
    fontWeight: 'bold',
    color: '#4285F4',
  },
});

export default CountriesScreen; 