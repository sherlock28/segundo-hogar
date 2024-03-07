import gql from 'graphql-tag';

export const DELETE_OWNERSHIP = gql`
    mutation DeleteOwnershipById($id: Int) {
        delete_sh_ownerships(where: { id: { _eq: $id } }) {
            affected_rows
        }
    }
`;
