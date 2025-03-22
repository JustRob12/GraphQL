import { gql } from '@apollo/client';

export const GET_COUNTRIES = gql`
  query GetCountries {
    countries {
      code
      name
      capital
      currency
      emoji
      continent {
        name
        code
      }
    }
  }
`;

export const GET_CONTINENTS = gql`
  query GetContinents {
    continents {
      code
      name
    }
  }
`;

export const SEARCH_COUNTRIES = gql`
  query SearchCountries($query: String!) {
    countries(filter: { name: { regex: $query } }) {
      code
      name
      capital
      currency
      emoji
      continent {
        name
        code
      }
    }
  }
`; 