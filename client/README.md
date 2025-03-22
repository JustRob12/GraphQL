# Country Explorer App

A React Native mobile application that fetches country data from a GraphQL API, allows users to search for countries, and displays detailed information about each country.

## Features

- **Authentication**: Email/password login (mock authentication for demo purposes)
- **Country Listing**: Fetch and display a list of countries using GraphQL
- **Search Functionality**: Filter countries by name
- **Country Details**: View detailed information about a selected country
- **Navigation**: Smooth navigation between screens
- **Apollo Client**: GraphQL integration with Apollo Client

## Installation

1. Make sure you have [Node.js](https://nodejs.org/) and npm installed
2. Install Expo CLI globally:
   ```
   npm install -g expo-cli
   ```
3. Clone this repository
4. Navigate to the project directory and install dependencies:
   ```
   cd client
   npm install
   ```

## Running the App

1. Start the development server:
   ```
   npm start
   ```
2. Use Expo Go app on your mobile device to scan the QR code, or press:
   - `a` to run on an Android emulator
   - `i` to run on an iOS simulator

## Login Credentials

For testing purposes, use the following credentials:
- **Email**: user@example.com
- **Password**: password123

## API Used

This application uses the public Countries GraphQL API available at:
https://countries.trevorblades.com/graphql

## Project Structure

- `src/apollo`: Apollo Client configuration and GraphQL queries
- `src/screens`: Application screens (Login, Countries list, Country detail)
- `src/navigation`: Navigation configuration
- `src/services`: Authentication services
- `src/types`: TypeScript type definitions

## Requirements

- Node.js
- Expo CLI
- iOS/Android device or emulator 