import { gql } from "@apollo/client";

export const UPDATE_GENDER = gql`
  mutation updateGender($userId: Int!, $newGender: String!) {
    update_sh_persons(
      where: { _and: { users: { id: { _eq: $userId } } } }
      _set: { gender: $newGender }
    ) {
      affected_rows
    }
  }
`;

export const UPDATE_BIO = gql`
  mutation updateBio($userId: Int!, $newBio: String!) {
    update_sh_users(where: { id: { _eq: $userId } }, _set: { bio: $newBio }) {
      returning {
        bio
      }
    }
  }
`;

export const UPDATE_STUDENT_BY_USER_ID = gql`
  mutation updateStudentByUserId(
    $userId: Int!
    $newCareer: bigint
    $newCityId: bigint
    $newShared: Boolean
  ) {
    update_sh_students(
      where: { person: { users: { id: { _eq: $userId } } } }
      _set: {
        careers_id: $newCareer
        cities_id: $newCityId
        shared: $newShared
      }
    ) {
      returning {
        careers_id
        cities_id
        shared
      }
    }
  }
`;

export const UPDATE_STATES = gql`
  mutation updateState($userId: Int!, $newState: bigint) {
    update_sh_cities(
      where: { students: { person: { users: { id: { _eq: $userId } } } } }
      _set: { state_id: $newState }
    ) {
      returning {
        state_id
      }
    }
  }
`;
