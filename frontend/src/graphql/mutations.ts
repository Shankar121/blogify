import gql from 'graphql-tag'

export const LOGIN_MUTATION = gql`
  mutation Login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      accessToken
      refreshToken
    }
  }
`

export const REGISTER_MUTATION = gql`
  mutation Register($data: RegisterUserInput!) {
    register(data: $data) {
      id
      firstName
      lastName
      email
      phone
    }
  }
`
export const CREATE_BLOG_MUTATION = gql`
  mutation CreateBlog($data: CreateBlogInput!) {
    createBlog(data: $data) {
      title
    }
  }
`
