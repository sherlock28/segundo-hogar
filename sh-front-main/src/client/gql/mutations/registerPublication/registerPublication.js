import { gql } from "@apollo/client";

export const REGISTER_PUBLICATION = gql`
  mutation RegisterPublication(
    $title: String,
    $description: String,
    $price: float8
    $is_furnished: Boolean,
    $contact_name: String,
    $contact_phone: String,
    $contact_email: String,
    $publication_state: Boolean = true,
    $ownerships_id: bigint
  ) {
    insert_sh_publications(
      objects: {
        title: $title
        description: $description
        price: $price
        is_furnished: $is_furnished
        contact_name: $contact_name
        contact_phone: $contact_phone
        contact_email: $contact_email
        publication_state: $publication_state
        ownerships_id: $ownerships_id
      }
    ) {
      affected_rows
      returning {
        id
        title
        description
        price
        is_furnished
        contact_name
        contact_phone
        contact_email
        publication_state
        ownerships_id
        updated_at
        created_at
      }
    }
  }
`;
