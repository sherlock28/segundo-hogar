// En el archivo PublicationsList.js
import { useState, useRef } from "react";
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Button,
  useToast,
  Text,
  IconButton,
} from "@chakra-ui/react";

import { TbHomeDollar } from "react-icons/tb";
import { MdOutlinePostAdd } from "react-icons/md";
import { useQuery } from "@apollo/client";
import { useLocation } from "wouter";
import { useDispatch } from "react-redux";
import { useMutation } from "@apollo/client";
import { EditIcon, ArrowRightIcon, DeleteIcon } from "@chakra-ui/icons";
import { useGetOwnershipsByOwnerId } from "hooks/utils/useGetOwnershipsByOwnerId";
import { setOwnershipId } from "store/slices/ownershipSlice";
import { UPDATE_OWNERSHIP } from "client/gql/queries/update/updateOwnershipById";
import { RequestRentModal } from "./RequestRentModal";
import { paths } from "config/paths";
import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  AlertDialogCloseButton,
} from "@chakra-ui/react";
import { EditPublicationModal } from "components/Owneship/EditOwnershipModal";
import { GET_PUBLICATIONS_COUNT_BY_OWNERSHIP_ID } from "client/gql/queries/users";

export function PublicationsList() {
  const [isModalRequestRentOpen, setIsModalRequestRentOpen] = useState(false);
  const [isModalEditOpen, setIsModalEditOpen] = useState(false);

  const [_, setLocation] = useLocation();
  const { ownerships, deleteOwnership, deletePublications, deleteImages } =
    useGetOwnershipsByOwnerId();
  const [selectedPublicationId, setSelectedPublicationId] = useState(null);
  const dispatch = useDispatch();

  const [isDeleteDialogOpen, setDeleteDialogOpen] = useState(false);
  console.log("ownership: ", ownerships);
  const [propertyToDelete, setPropertyToDelete] = useState(null);

  const [updateOwnership] = useMutation(UPDATE_OWNERSHIP);
  const storedAddress = localStorage.getItem("address");

  const toast = useToast();

  const updatePublication = async (data, id, address) => {
    setSelectedPublicationId(null);
    console.log(`Actualizando publicación con ID ${id}:`, data);
  };

  const handleEdit = (id) => {
    setIsModalRequestRentOpen(false);
    setIsModalEditOpen(true);
    console.log(id);
    localStorage.setItem("ownershipToEdit", id);
    setSelectedPublicationId(id);
  };

  const cancelRef = useRef();
  const handleDelete = (id) => {
    setDeleteDialogOpen(true);
    setPropertyToDelete(id);
  };

  const handleConfirmDelete = () => {
    deletePublications({ variables: { ownerships_id: propertyToDelete } });
    deleteImages({ variables: { ownerships_id: propertyToDelete } });
    deleteOwnership({ variables: { id: propertyToDelete } });
    setDeleteDialogOpen(false);
    setPropertyToDelete(null);
    toast({
      title: "Propiedad eliminada",
      description: "La propiedad se ha eliminado correctamente.",
      status: "success",
      duration: 5000,
      isClosable: true,
    });
  };

  const handleCancelDelete = () => {
    setDeleteDialogOpen(false);
    setPropertyToDelete(null);
  };

  const handlePublish = (id) => {
    localStorage.setItem("ownershipId", id);
    console.log("id: ", id);
    dispatch(setOwnershipId(id));
    setLocation(`/registrar/publicacion/${id}`);
  };

  const {
    loading: publicationsLoading,
    error: publicationsError,
    data: publicationsData,
  } = useQuery(GET_PUBLICATIONS_COUNT_BY_OWNERSHIP_ID, {
    variables: { id: ownerships?.id },
  });

  console.log("publicationsData: ", publicationsData);
  
  const handleRent = (id) => {
    localStorage.setItem("ownershipId", id);
    setIsModalEditOpen(false);
    setIsModalRequestRentOpen(true);
    setSelectedPublicationId(id);
    console.log("id: ", id);
  };

  return (
    <>
      <TableContainer mt={8}>
        <Table size="sm">
          <Thead>
            <Tr>
              <Th>ID</Th>
              <Th>Dirección</Th>
              <Th width={"10%"}>Rentar</Th>
              <Th width={"10%"}>Editar</Th>
              <Th width={"10%"}>Eliminar</Th>
              <Th width={"10%"}>Publicar</Th>
              <Th></Th>
            </Tr>
          </Thead>
          <Tbody>
            {ownerships?.map((ownership) => (
              <Tr key={ownership?.id}>
                <Td>{ownership?.id}</Td>
                <Td>{ownership?.address?.address}</Td>
                <Td>
                  <IconButton
                    size="sm"
                    icon={<TbHomeDollar />}
                    _hover={{ bg: "#00AA00", color: "white" }}
                    onClick={() => handleRent(ownership?.id)}
                  />
                </Td>
                <Td>
                  <IconButton
                    icon={<EditIcon />}
                    size="sm"
                    _hover={{ bg: "#1AABE4", color: "white" }}
                    onClick={() => handleEdit(ownership?.id)}
                  />
                </Td>
                <Td>
                  <IconButton
                    icon={<DeleteIcon />}
                    size="sm"
                    _hover={{ bg: "#E70020", color: "white" }}
                    onClick={() => handleDelete(ownership?.id)}
                  />
                </Td>
                <Td>
                  <IconButton
                    icon={<MdOutlinePostAdd />}
                    size="sm"
                    _hover={{ bg: "#1AABE4", color: "white" }}
                    onClick={() => handlePublish(ownership?.id)}
                  />
                </Td>
                {/* <Td>
                  {publicationsData && publicationsData[ownership?.id] && (
                    <Text>{publicationsData[ownership?.id].count}</Text>
                  )}
                </Td> */}
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>
      <AlertDialog
        isOpen={isDeleteDialogOpen}
        leastDestructiveRef={cancelRef}
        onClose={handleCancelDelete}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Eliminar propiedad
            </AlertDialogHeader>

            <AlertDialogBody>
              ¿Estás seguro de eliminar esta propiedad? Se eliminarán también
              las publicaciones asociadas.{" "}
              <Text as="b">Este cambio no es reversible</Text>.
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={handleCancelDelete}>
                Cancelar
              </Button>
              <Button colorScheme="red" onClick={handleConfirmDelete} ml={3}>
                Eliminar
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>

      <EditPublicationModal
        isOpen={!!selectedPublicationId && !!isModalEditOpen}
        onClose={() => setSelectedPublicationId(null)}
        onUpdate={updatePublication}
        id={selectedPublicationId}
      />
      <RequestRentModal
        isOpen={!!selectedPublicationId && !!isModalRequestRentOpen}
        onClose={() => setSelectedPublicationId(null)}
        onUpdate={updatePublication}
        id={selectedPublicationId}
      />
    </>
  );
}
