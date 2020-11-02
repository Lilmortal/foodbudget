import { graphql } from 'react-relay';

const query = graphql`
  query userQuery($email: Email!) {
    user(email: $email) {
      ...UserFragment_user
    }
  }
`;

export default query;
