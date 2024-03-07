import { gql } from "@apollo/client";

export const SET_STATE_REQUEST_BY_ID = gql`
    mutation setStateRequestById(
      $id: Int!
      $request_state: Boolean!
      ) {
        update_sh_requests(where: {id: {_eq: $id}}, 
            _set: {request_state: $request_state}
          ) {
                affected_rows
          }
        }
`;