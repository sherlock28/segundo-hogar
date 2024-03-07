import gql from 'graphql-tag';

export const DELETE_IMAGES = gql`
    mutation DeleteImagesByOwnershipId($ownerships_id: bigint) {
        delete_sh_ownerships_images(where: { ownerships_id: { _eq: $ownerships_id } }) {
            affected_rows
        }
    }
`;
