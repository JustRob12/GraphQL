import { gql } from '@apollo/client';

// Authentication mutations

export const LOGIN_USER = gql`
  mutation Login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
      user {
        id
        email
        name
      }
    }
  }
`;

export const SIGNUP_USER = gql`
  mutation Signup($email: String!, $password: String!, $name: String!) {
    signup(email: $email, password: $password, name: $name) {
      token
      user {
        id
        email
        name
      }
    }
  }
`;

// This would normally fetch the current user based on the token
// We'll use it to check if the user is authenticated
export const GET_CURRENT_USER = gql`
  query GetCurrentUser {
    me {
      id
      email
      name
    }
  }
`; 