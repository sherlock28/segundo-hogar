import { useQuery } from "@apollo/client";
import { GET_ALL_REQUESTS } from "client/gql/queries/searches/searches";

export function useGetRequests() {
  const { loading, error, data } = useQuery(GET_ALL_REQUESTS, {
    fetchPolicy: "network-only"
  });

  return {
    loadingUsers: loading,
    errorUsers: error,
    requests: data
  };
}