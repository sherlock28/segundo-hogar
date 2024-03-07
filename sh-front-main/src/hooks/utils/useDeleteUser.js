import { useMutation } from '@apollo/client';
import { DELETE_PERSON_BY_ID } from 'client/gql/queries/delete/deletePersonById';

export function useDeleteUser(userId) {

  console.log("ID que llega al hook ", userId)
  const [deleteUser, { loading, error }] = useMutation(DELETE_PERSON_BY_ID, {
    variables: { 
      idInt: userId,
      idBigint: userId
    },
  });

  return {
    deleteUser,
    loadingDelete: loading,
    errorDelete: error,
  };
}