import gql from 'graphql-tag';

export const DELETE_PUBLICATIONS = gql`
    mutation DeletePublicationsByOwnershipId($ownerships_id: bigint) {
        delete_sh_publications(where: { ownerships_id: { _eq: $ownerships_id } }) {
            affected_rows
        }
    }
`;
