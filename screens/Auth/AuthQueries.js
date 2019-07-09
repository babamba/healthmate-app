import { gql } from "apollo-boost";

export const LOG_IN = gql`
  mutation requestSecret($email: String!) {
    requestSecret(email: $email)
  }
`;

export const PASSWORD_LOG_IN = gql`
  mutation login($email: String!, $password: String!) {
    login(email: $email, password: $password)
  }
`;

export const CREATE_ACCOUNT = gql`
  mutation createAccount(
    $username: String!
    $email: String!
    $firstName: String
    $lastName: String
    $password: String!
  ) {
    createAccount(
      username: $username
      email: $email
      firstName: $firstName
      lastName: $lastName
      password: $password
    )
  }
`;

export const CONFIRM_SECRET = gql`
  mutation confirmSecret($secret: String!, $email: String!) {
    confirmSecret(secret: $secret, email: $email)
  }
`;
