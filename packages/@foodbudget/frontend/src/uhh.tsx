import { graphql } from 'react-relay';

const uhhFragment = graphql`
    fragment uhhFragment on user {
        email
        nickname
    }
`;

export default uhhFragment;
