import { gql } from "@apollo/client";
export const UPDATE_OWNERSHIP = gql`
  mutation update_sh_ownerships_by_pk(
    $id: Int!
    $object: sh_ownerships_set_input!
  ) {
    update_sh_ownerships_by_pk(pk_columns: { id: $id }, _set: $object) {
      address {
        address
        apartment
        floor
        id
        __typename
      }
      coordinate {
        id
        lat
        lon
        __typename
      }
      bathrooms
      coordinates_id
      created_at
      id
      is_published
      owners_id
      ownerships_state
      ownerships_types_id
      rating
      restrictions_id
      rooms
      shared
      size
      updated_at
    }
  }
`;

export const UPDATE_COORDINATES_MUTATION = gql`
  mutation UpdateCoordinates(
    $id: Int!
    $lat: float8!
    $lon: float8!
    $updatedAt: timestamp!
  ) {
    update_sh_coordinates(
      where: { id: { _eq: $id } }
      _set: { lat: $lat, lon: $lon, updated_at: $updatedAt }
    ) {
      returning {
        id
        lat
        lon
        updated_at
      }
    }
  }
`;

export const UPDATE_ADDRESS_MUTATION = gql`
  mutation UpdateAddress(
    $id: Int!
    $address: String!
    $apartment: String!
    $floor: String!
    $updatedAt: timestamp!
  ) {
    update_sh_addresses(
      where: { id: { _eq: $id } }
      _set: {
        address: $address
        apartment: $apartment
        floor: $floor
        updated_at: $updatedAt
      }
    ) {
      returning {
        id
        address
        apartment
        floor
        updated_at
      }
    }
  }
`;

export const UPDATE_OWNERSHIPS_MUTATION = gql`
  mutation UpdateOwnerships(
    $id: Int!
    $shared: Boolean!
    $rooms: Int!
    $bathrooms: Int!
    $size: Int!
    $rating: Int!
    $updatedAt: timestamp!
  ) {
    update_sh_ownerships(
      where: { id: { _eq: $id } }
      _set: {
        shared: $shared
        rooms: $rooms
        bathrooms: $bathrooms
        size: $size
        rating: $rating
        updated_at: $updatedAt
      }
    ) {
      returning {
        id
        shared
        rooms
        bathrooms
        size
        rating
        updated_at
      }
    }
  }
`;

export const UPDATE_OWNERSHIP_IMAGES = gql`
mutation UpdateOwnershipImages($ownershipsId: bigint!, $imageUrl: String!) {
  update_sh_ownerships_images(
    where: { ownerships_id: { _eq: $ownershipsId } }
    _set: {
      imageurl: $imageUrl
    }
  ) {
    affected_rows
    returning {
      imageurl
      updated_at
    }
  }
}
`;
