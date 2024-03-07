// En el archivo PublicationsList.js
import { useEffect, useState, useRef } from "react";
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
  Tooltip,
  Flex,
} from "@chakra-ui/react";
import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  AlertDialogCloseButton,
} from "@chakra-ui/react";
import { TbUserOff, TbTrash, TbUserCheck } from "react-icons/tb";

import { EditIcon, ArrowRightIcon, DeleteIcon } from "@chakra-ui/icons";
import { useGetUsers } from "hooks/utils/useGetUsers";
import { useSetStatusUser } from "hooks/utils/useSetStatusUser";
import { useDeleteUser } from "hooks/utils/useDeleteUser";



export function UsersList() {
 
  const [isModalRequestRentOpen, setIsModalRequestRentOpen] = useState(false);
  const [isModalEditOpen, setIsModalEditOpen] = useState(false);
  const [isStatusDialogOpen, setStatusDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setDeleteDialogOpen] = useState(false);


  const { loadingUsers, errorUsers, users } = useGetUsers();

  const [selectedUser, setSelectedUser] = useState(null);
  const [userStatus, setUserStatus] = useState(null);

  const { statusUser, loadingDisable, errorDisable } = useSetStatusUser(selectedUser, userStatus)
  const { deleteUser, loadingDelete, errorDelete } = useDeleteUser(selectedUser)

  const cancelRef = useRef();

  const toast = useToast();

  const [usersList, setUsersList] = useState([]);


  console.log("users", users);

  useEffect(() => {
    // Update the usersList state when the users data changes
    if (users) {
      setUsersList(users.sh_users);
    }
  }, [users]);

  if (loadingUsers) {
    return <p>Cargando usuarios...</p>;
  }

  if (errorUsers) {
    return <p>Error al cargar usuarios: {errorUsers.message}</p>;
  }

  
  const handleStatusUser = (user) => {
    setSelectedUser(user.id);
    console.log("Estado del user: ", user.user_status, " Estado nuevo: ", !user.user_status);
    setUserStatus(!user.user_status);
    setStatusDialogOpen(true);
  }

  const handleConfirmStatusUser = async () => {
    try {
      await statusUser(selectedUser, userStatus)
        .then(() => {
          const status = userStatus ? "habilitado" : "deshabilitado";
          toast({
            title: "Usuario " + status,
            status: "success",
            duration: 5000,
            isClosable: true,
          });
        });
        // Update the usersList with the news status
        const newUsersList = usersList.map((user) => {
          if (user.id === selectedUser) {
            return {
              ...user,
              user_status: userStatus,
            };
          }
          return user;
        });
        setUsersList(newUsersList);
    } catch (error) {
      const status = userStatus ? "habilitar" : "deshabilitar";
      toast({
        title: "Error al " + status + " el usuario. " + error,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
    setStatusDialogOpen(false);
  }

  const handleCancelStatusUser = () => {
    setStatusDialogOpen(false);
  }


  const handleConfirmDeleteUser = async () => {
    try {
      console.log("selectedUser", selectedUser)
      await deleteUser(selectedUser)
        .then(() => {
          toast({
            title: "Usuario eliminado",
            status: "success",
            duration: 5000,
            isClosable: true,
          });
          // Update the usersList state with the updated list of users
          const newUsersList = usersList.filter((user) => user.id !== selectedUser);
          setUsersList(newUsersList);
        });
    } catch (error) {
      toast({
        title: "Error al eliminar el usuario" + error,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
    setDeleteDialogOpen(false);
  }

  const handleDeleteUser = (user) => {
    setSelectedUser(user.id);
    console.log("A eliminar user: ", selectedUser);
    setDeleteDialogOpen(true);
  }

  const handleCancelDeleteUser = () => {
    setDeleteDialogOpen(false);
  }

  return (
    <>
      <Flex>
        <TableContainer width={"100%"}>
          <Table variant="striped" colorScheme="gray">
            <Thead>
              <Tr>
                <Th width="10%" >ID</Th>
                <Th>Usuario</Th>
                <Th>Correo</Th>
                <Th>Acciones</Th>
              </Tr>
            </Thead>
            <Tbody>
              {usersList.map((user) => (
                <Tr key={user.id}>
                  <Td>{user.id}</Td>
                  <Td>{user.username}</Td>
                  <Td>{user.email}</Td>
                  <Td>
                    {/* if user state is true, show Disable */}
                    {/* else if user state is false, show Enable*/}
                    <Tooltip
                      label={
                        user.user_status ? "Deshabilitar usuario" : "Habilitar usuario"
                      }
                      aria-label={
                        user.user_status ? "Deshabilitar usuario" : "Habilitar usuario"
                      }
                    >
                      <IconButton
                        colorScheme={user.user_status ? "yellow" : "green"}
                        onClick={() => handleStatusUser(user)}
                        mr={2}
                        icon={
                          user.user_status ? (
                            <TbUserOff />
                          ) : (
                            <TbUserCheck />
                          )
                        }
                      >
                      </IconButton>
                    </Tooltip>
                    {/* boton eliminar */}
                    <Tooltip
                      label="Eliminar usuario"
                      aria-label="Eliminar usuario"
                    >
                      <IconButton
                        colorScheme="red"
                        onClick={() => handleDeleteUser(user)}
                        mr={2}
                        icon={<TbTrash />}
                      >
                      </IconButton>
                    </Tooltip>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </TableContainer>
      </Flex>

      <AlertDialog
        isOpen={isStatusDialogOpen}
        leastDestructiveRef={cancelRef}
        onClose={handleCancelStatusUser}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Cambiar estado del usuario
            </AlertDialogHeader>

            <AlertDialogBody>
              ¿Está seguro que desea cambiar el estado del usuario {selectedUser}?
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={handleCancelStatusUser}>
                Cancelar
              </Button>
              <Button
                colorScheme="red"
                onClick={handleConfirmStatusUser}
                ml={3}
              >
                Cambiar estado
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>

      <AlertDialog
        isOpen={isDeleteDialogOpen}
        leastDestructiveRef={cancelRef}
        onClose={handleCancelDeleteUser}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Eliminar usuario
            </AlertDialogHeader>

            <AlertDialogBody>
              ¿Está seguro que desea eliminar el usuario {selectedUser}?
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={handleCancelDeleteUser}>
                Cancelar
              </Button>
              <Button
                colorScheme="red"
                onClick={handleConfirmDeleteUser}
                ml={3}
              >
                Eliminar
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  );
}




