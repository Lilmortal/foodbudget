import { createFragmentContainer, graphql } from 'react-relay';
import { UserFragment_user } from './__generated__/UserFragment_user.graphql';

interface UserType {
  user: UserFragment_user;
}

const User = ({ user }: UserType) => <div>{user.email}</div>;

const UserFragment = createFragmentContainer(User, {
  user: graphql`
    fragment UserFragment_user on user {
      email
      nickname
    }
  `,
});

export default UserFragment;
