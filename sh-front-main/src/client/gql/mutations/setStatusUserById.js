import { gql } from "@apollo/client";

export const SET_STATUS_USER_BY_ID = gql`
    mutation DisableUserById(
      $id: Int!
      $user_status: Boolean!
      ) {
        update_sh_users(where: {id: {_eq: $id}}, 
            _set: {user_status: $user_status}
          ) {
                affected_rows
          }
        }
`;