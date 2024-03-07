import { useMutation } from '@apollo/client';
import { SET_STATE_REQUEST_BY_ID } from 'client/gql/mutations/setStateRequestById';

export function useSetStateRequest(requestId, requestStatus) {

  console.log("ID que llega al hook ", requestId)

  const [stateRequest, { loading, error }] = useMutation(SET_STATE_REQUEST_BY_ID, {
    variables: { 
      id: requestId,
      request_state: requestStatus
    },
  });

  return {
    stateRequest,
    loadingDisable: loading,
    errorDisable: error,
  };
}