import { gql } from "@apollo/client";

export const CREATE_RENT = gql`
mutation CreateRent(
    $ownerships_id: bigint!, 
    $students_id: bigint!, 
    $start_date: date!, 
    $end_date: date!,
    $rating: Int
  ) {
    insert_sh_rents(
      objects: {
        ownerships_id: $ownerships_id, 
        students_id: $students_id, 
        start_date: $start_date, 
        end_date: $end_date,
        rating: $rating,
      }
    ) {
      returning {
        id
      }
    }
  }
`;

export const CREATE_PRICE_RENT = gql`
mutation MyMutation2(
    $amount: float8!, 
    $rents_id: bigint!
  ) {
    insert_sh_prices_rents(
      objects: {
        amount: $amount, 
        rents_id: $rents_id
        datetime: "now()"
      }

    ) {
      returning {
        id
      }
    }
  }
`;




