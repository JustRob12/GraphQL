import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';

// Countries API
const countriesEndpoint = 'https://countries.trevorblades.com/graphql';

// Create HTTP link for the endpoint
const countriesHttpLink = createHttpLink({
  uri: countriesEndpoint,
});

// Create the Apollo Client
export const client = new ApolloClient({
  link: countriesHttpLink,
  cache: new InMemoryCache(),
}); 