import { graphql } from 'react-relay';

const UserFragment = graphql`
    fragment UserFragment on user {
        email
        nickname
    }
`;

export default UserFragment;
