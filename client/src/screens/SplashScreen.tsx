import React, { useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  StatusBar,
  Animated,
  Easing
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types';

type SplashScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Splash'>;
};

const SplashScreen: React.FC<SplashScreenProps> = ({ navigation }) => {
  // Animation values
  const logoScale = new Animated.Value(0.3);
  const opacity = new Animated.Value(0);
  const titleOpacity = new Animated.Value(0);

  useEffect(() => {
    // Sequence of animations
    Animated.sequence([
      // Fade in logo
      Animated.timing(opacity, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
        easing: Easing.ease,
      }),
      
      // Scale logo
      Animated.timing(logoScale, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
        easing: Easing.elastic(1.2),
      }),
      
      // Fade in title
      Animated.timing(titleOpacity, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();

    // Navigate to Countries screen after 5 seconds
    const timer = setTimeout(() => {
      navigation.replace('Countries');
    }, 5000);

    // Clean up timer
    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <View style={styles.container}>
      <StatusBar translucent backgroundColor="transparent" barStyle="dark-content" />
      
      <View style={styles.content}>
        <Animated.Text 
          style={[
            styles.logo, 
            { 
              opacity, 
              transform: [{ scale: logoScale }] 
            }
          ]}
        >
          🌎
        </Animated.Text>
        
        <Animated.View style={{ opacity: titleOpacity }}>
          <Text style={styles.title}>Country Explorer</Text>
          <Text style={styles.subtitle}>Discover the World with GraphQL</Text>
        </Animated.View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f3f4f6',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  logo: {
    fontSize: 120,
    marginBottom: 30,
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#1f2937',
    textAlign: 'center',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 18,
    color: '#6b7280',
    textAlign: 'center',
  },
});

export default SplashScreen; 