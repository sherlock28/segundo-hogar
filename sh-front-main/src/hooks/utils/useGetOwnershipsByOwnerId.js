import { useQuery } from "@apollo/client";
import { GET_OWNERSHIPS_BY_OWNER_ID } from "client/gql/queries/utils";
import { useGetOwnerId } from "hooks/utils/useGetOwnerId";
import { useMutation } from "@apollo/client";
import { useState } from "react";
import { DELETE_PUBLICATIONS } from "client/gql/queries/delete/deletePublicationByOwnershipId";
import {
  DELETE_OWNERSHIP,
  UPDATE_OWNERSHIP,
} from "client/gql/queries/delete/deleteOwnershipById";
import { DELETE_IMAGES } from "client/gql/queries/delete/deleteImagesByOwnershipId";

export function useGetOwnershipsByOwnerId() {
  const { owner_id } = useGetOwnerId();

  const [editingOwnership, setEditingOwnership] = useState(null);

  let variables = { owner_id: owner_id };

  const {
    loading,
    error,
    data: ownerships,
    refetch,
  } = useQuery(GET_OWNERSHIPS_BY_OWNER_ID, { variables });
  localStorage.setItem("ownerId", owner_id);
  console.log("owner id: ", owner_id)
  const [deleteOwnership] = useMutation(DELETE_OWNERSHIP, {
    onCompleted: () => {
      refetch();
    },
    onError: (error) => {
      console.error(error);
    },
  });

  const [deletePublications] = useMutation(DELETE_PUBLICATIONS, {
    onCompleted: () => {
      refetch();
    },
    onError: (error) => {
      console.error(error);
    },
  });

  const [deleteImages] = useMutation(DELETE_IMAGES, {
    onCompleted: () => {
      refetch();
    },
    onError: (error) => {
      console.error(error);
    },
  });

  return {
    loading,
    error,
    ownerships: ownerships?.sh_ownerships,
    deleteOwnership,
    deletePublications,
    deleteImages,
  };
}
