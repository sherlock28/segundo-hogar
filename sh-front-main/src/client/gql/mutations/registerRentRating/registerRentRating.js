import { gql } from "@apollo/client";

export const REGISTER_RENT_RATING = gql`
mutation UpdateRentRating(
  $id: Int!
  $rating: Int!
  $updated_at: timestamp!
) {
  update_sh_rents(
    where: { id: { _eq: $id } }
    _set: { rating: $rating, updated_at: $updated_at }
  ) {
    affected_rows
    returning {
      rating
      created_at
      end_date
      id
      students_id
      updated_at
      start_date
      ownerships_id
    }
  }
}
`;
