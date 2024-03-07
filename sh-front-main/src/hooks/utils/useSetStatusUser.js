import { useMutation } from '@apollo/client';
import { SET_STATUS_USER_BY_ID } from 'client/gql/mutations/setStatusUserById';

export function useSetStatusUser(userId, userStatus) {

  console.log("ID que llega al hook ", userId)

  const [statusUser, { loading, error }] = useMutation(SET_STATUS_USER_BY_ID, {
    variables: { 
      id: userId,
      user_status: userStatus
    },
  });

  return {
    statusUser,
    loadingDisable: loading,
    errorDisable: error,
  };
}