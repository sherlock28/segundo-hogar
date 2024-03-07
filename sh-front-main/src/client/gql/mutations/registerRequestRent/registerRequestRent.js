import { gql } from "@apollo/client";

export const REGISTER_REQUEST_RENT = gql`
  mutation RegisterRequestRent(
    $publications_id: bigint
    $message: String
    $datetime: date
  ) {
    insert_sh_requests(
      objects: {
        publications_id: $publications_id
        message: $message
        request_state: true
        datetime: $datetime
      }
    ) {
      affected_rows
      returning {
        id
        publications_id
        message
        request_state
        datetime
        created_at
        updated_at
      }
    }
  }
`;
