
import gql from 'graphql-tag'

export const CURRENT_USER = gql`query {
  currentUser {
    id
    username
  }
}`;

export const POSTS_BY_USER = gql`query ($userId: String!) {
  postsByUser(userId: $userId) {
    id
    content
  }
}`;

export const ADD_POST = gql`mutation ($content: String!) {
  addPost(content: $content) {
    id
    content
  }
}`;