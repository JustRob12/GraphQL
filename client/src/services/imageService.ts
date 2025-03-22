/**
 * Service for handling image fetching for city backgrounds
 */

/**
 * Gets an image URL for a city without requiring API keys
 * @param cityName Name of the city to fetch an image for
 * @param countryName Name of the country (for better search results)
 * @returns URL of the image using Unsplash Source
 */
export const fetchCityImage = async (
  cityName: string,
  countryName: string
): Promise<string | null> => {
  if (!cityName) return null;

  try {
    // Using the direct Unsplash Source URL which doesn't require authentication
    // This is more reliable than the API which has rate limits
    return getUnsplashSourceImage(cityName, countryName);
  } catch (error) {
    console.error('Failed to create city image URL:', error);
    return null;
  }
};

/**
 * Gets a direct image URL from Unsplash Source (no API key required)
 * @param cityName Name of the city
 * @param countryName Name of the country
 * @returns Direct URL to an image
 */
export const getUnsplashSourceImage = (cityName: string, countryName: string): string => {
  // Using Unsplash Source which doesn't require API key
  // The URL format is https://source.unsplash.com/featured/?{search_term}
  return `https://source.unsplash.com/featured/?${encodeURIComponent(cityName)},${encodeURIComponent(countryName)},skyline`;
};

/**
 * Alternative image URL as backup
 * @param cityName Name of the city
 * @param countryName Name of the country
 * @returns Fallback image URL from Pexels
 */
export const getFallbackCityImage = (cityName: string, countryName: string): string => {
  // Fallback to a city-specific placeholder image
  return `https://source.unsplash.com/random/?${encodeURIComponent(cityName)},city,architecture`;
}; 