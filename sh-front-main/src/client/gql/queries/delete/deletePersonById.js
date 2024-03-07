import { gql } from '@apollo/client';

// delete person by id in cascade
export const DELETE_PERSON_BY_ID = gql`
    mutation DeletePersonById($idInt: Int, $idBigint: bigint) {
        delete_sh_requests(where: {publication: {ownership: {owner: {persons_id: {_eq: $idBigint}}}}}) {
            affected_rows
        }
        delete_sh_publications(where: {ownership: {owner: {persons_id: {_eq: $idBigint}}}}) {
            affected_rows
        }
        delete_sh_ownerships_images(where: {ownership: {owner: {persons_id: {_eq: $idBigint}}}}) {
            affected_rows
        }
        delete_sh_ownerships(where: {owner: {persons_id: {_eq: $idBigint}}}) {
            affected_rows
        }
        delete_sh_owners(where: {persons_id: {_eq: $idBigint}}) {
            affected_rows
        }
        
        delete_sh_students(where: {persons_id: {_eq: $idBigint}}) {
            affected_rows
        }
        
        delete_sh_users(where: {persons_id: {_eq: $idBigint}}) {
            affected_rows
        }
        
        delete_sh_persons(where: {id: {_eq: $idInt}}) {
            affected_rows
        }
    }
`;