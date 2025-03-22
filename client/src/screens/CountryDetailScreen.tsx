import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView, 
  StatusBar, 
  ImageBackground,
  ActivityIndicator,
  Image
} from 'react-native';
import { RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types';
import { getUnsplashSourceImage, getFallbackCityImage } from '../services/imageService';

type CountryDetailScreenProps = {
  route: RouteProp<RootStackParamList, 'CountryDetail'>;
  navigation: NativeStackNavigationProp<RootStackParamList, 'CountryDetail'>;
};

const CountryDetailScreen: React.FC<CountryDetailScreenProps> = ({ route, navigation }) => {
  const { country } = route.params;
  const [loading, setLoading] = useState<boolean>(true);
  const [imageLoadError, setImageLoadError] = useState<boolean>(false);
  
  // Generate image URL directly rather than fetch API
  const getImageSource = () => {
    if (!country.capital) {
      return null;
    }
    
    if (imageLoadError) {
      // Use fallback if primary image source failed
      return { uri: getFallbackCityImage(country.capital, country.name) };
    }
    
    // Use the direct Unsplash Source URL
    return { uri: getUnsplashSourceImage(country.capital, country.name) };
  };

  const handleImageLoad = () => {
    setLoading(false);
  };

  const handleImageError = () => {
    setImageLoadError(true);
    setLoading(false);
  };

  // Reset loading state when country changes
  useEffect(() => {
    setLoading(true);
    setImageLoadError(false);
  }, [country]);

  const backgroundComponent = () => {
    const imageSource = getImageSource();
    
    if (!imageSource) {
      // No capital city, use default color background
      return (
        <View style={styles.headerBackground} />
      );
    }
    
    return (
      <>
        <View style={styles.headerBackground} />
        <ImageBackground
          source={imageSource}
          style={styles.capitalImage}
          resizeMode="cover"
          onLoad={handleImageLoad}
          onError={handleImageError}
        >
          <View style={styles.headerBackgroundOverlay} />
          {loading && (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#ffffff" />
            </View>
          )}
        </ImageBackground>
      </>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      {backgroundComponent()}
      
      <View style={styles.headerContainer}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>
        
        {country.capital && (
          <View style={styles.capitalBadge}>
            <Text style={styles.capitalBadgeText}>
              {country.capital}
            </Text>
          </View>
        )}
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.emojiContainer}>
          <Text style={styles.emoji}>{country.emoji}</Text>
          <View style={styles.countryCodeBadge}>
            <Text style={styles.countryCodeText}>{country.code}</Text>
          </View>
        </View>
        
        <Text style={styles.countryName}>{country.name}</Text>

        <View style={styles.infoCard}>
          <Text style={styles.sectionTitle}>Country Information</Text>
          
          <InfoItem 
            label="Capital" 
            value={country.capital || 'Not available'} 
            icon="🏙️"
          />
          
          <InfoItem 
            label="Currency" 
            value={country.currency || 'Not available'}
            icon="💰" 
          />
          
          <InfoItem 
            label="Continent" 
            value={country.continent.name}
            icon="🌍" 
          />
        </View>
      </ScrollView>
    </View>
  );
};

// Helper component for info items
const InfoItem = ({ label, value, icon }: { label: string; value: string; icon: string }) => (
  <View style={styles.infoItem}>
    <View style={styles.iconContainer}>
      <Text style={styles.infoIcon}>{icon}</Text>
    </View>
    <View style={styles.infoContent}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue}>{value}</Text>
    </View>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f3f4f6',
  },
  headerBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 180,
    backgroundColor: '#4285F4',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  capitalImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 180,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    overflow: 'hidden',
  },
  headerBackgroundOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  loadingContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(66, 133, 244, 0.3)',
  },
  headerContainer: {
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    zIndex: 1,
  },
  backButton: {
    padding: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 10,
    alignSelf: 'flex-start',
  },
  backButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  capitalBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
  },
  capitalBadgeText: {
    color: '#ffffff',
    fontWeight: '600',
    fontSize: 14,
  },
  scrollView: {
    flex: 1,
    marginTop: -20,
  },
  emojiContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 20,
    position: 'relative',
  },
  emoji: {
    fontSize: 80,
    marginBottom: 5,
  },
  countryCodeBadge: {
    position: 'absolute',
    bottom: 0,
    right: '40%',
    backgroundColor: 'rgba(66, 133, 244, 0.9)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 15,
  },
  countryCodeText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
  },
  countryName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1f2937',
    textAlign: 'center',
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  infoCard: {
    backgroundColor: 'white',
    borderRadius: 20,
    margin: 16,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#4285F4',
    marginBottom: 16,
  },
  infoItem: {
    flexDirection: 'row',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    alignItems: 'center',
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f3f4f6',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  infoIcon: {
    fontSize: 20,
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6b7280',
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 18,
    color: '#1f2937',
    fontWeight: '500',
  },
});

export default CountryDetailScreen; 