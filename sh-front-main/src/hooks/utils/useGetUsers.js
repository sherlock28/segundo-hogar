import { useQuery } from "@apollo/client";
import { GET_USERS } from "client/gql/queries/users";


export function useGetUsers() {
  const { loading, error, data } = useQuery(GET_USERS, {
    fetchPolicy: "network-only"
  });

  return {
    loadingUsers: loading,
    errorUsers: error,
    users: data,
  };
}