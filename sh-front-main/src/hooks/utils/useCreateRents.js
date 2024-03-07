// This hook create a rent and a price_rent with rent id.
// Need pass a ownership id, a student id
// start_date, end_date and a price.
import { useMutation } from "@apollo/client";
import {
  CREATE_RENT,
  CREATE_PRICE_RENT,
} from "client/gql/mutations/createRent";

export function useCreateRents() {
  const [createRent, { loading, error }] = useMutation(CREATE_RENT);
  const [createPriceRent, { loading: loading2, error: error2 }] =
    useMutation(CREATE_PRICE_RENT);

  return {
    createRent,
    createPriceRent,
    loadingCreate: loading || loading2,
    errorCreate: error || error2,
  };
}
