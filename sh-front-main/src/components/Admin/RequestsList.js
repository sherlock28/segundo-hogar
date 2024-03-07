import { useEffect, useState, useRef } from "react";
import { useQuery, useApolloClient } from "@apollo/client";
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
import { TbHomeCheck, TbHomeX } from "react-icons/tb";
import { useGetRequests } from "hooks/utils/useGetRequests";
import { useSetStateRequest } from "hooks/utils/useSetStateRequest";
import { useCreateRents } from "hooks/utils/useCreateRents";
import { GET_STUDENT_ID_BY_USER_EMAIL } from "client/gql/queries/users";

export function RequestsList() {
  const client = useApolloClient();

  const getStudentIdByEmail = async (email) => {
    const student = await client.query({
      query: GET_STUDENT_ID_BY_USER_EMAIL,
      variables: {
        email: email,
      },
      fetchPolicy: "no-cache",
    });
    console.log("student from function", student);
    return student.data.sh_users[0].person.students[0].id;
  };

  const [isModalRequestRentOpen, setIsModalRequestRentOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [requestState, setRequestState] = useState(null);
  const [aproveRequest, setAproveRequest] = useState(false);

  const { loadingRequests, errorRequests, requests } = useGetRequests();
  const { createRent, createPriceRent } = useCreateRents();
  const { stateRequest, loadingDisable, errorDisable } = useSetStateRequest(
    selectedRequest,
    requestState
  );

  const cancelRef = useRef();

  const toast = useToast();

  const [requestsList, setRequestsList] = useState([]);

  console.log("requests", requests);

  useEffect(() => {
    if (requests) {
      setRequestsList(requests.sh_requests);
    }
  }, [requests]);

  if (loadingRequests) {
    return <p>Cargando solicitudes de rentas...</p>;
  }

  if (errorRequests) {
    return <p>Error al cargar solicitudes de renta: {errorRequests.message}</p>;
  }

  const handleStateRequest = (request, aproveRequest) => {
    setAproveRequest(aproveRequest);
    setSelectedRequest(request.id);
    console.log(
      "Estado del request: ",
      request.request_state,
      " Estado nuevo: ",
      request.request_state
    );
    setRequestState(!request.request_state);
    setIsModalRequestRentOpen(true);
  };

  const handleConfirmStateRequest = async () => {
    try {
      // check if message has all the data
      // student_email, date_start, date_end, price
      // if not, throw error
      // if yes, create a rent and a price_rent

      if (aproveRequest) {
        if (
          requestsList
            .find((request) => request.id === selectedRequest)
            .message.match(/correo electrónico (\S+)/) === null
        ) {
          throw new Error(
            "Error al crear la renta, revise que esten todos los datos en el mensaje. Favor de incluir el correo del estudiante."
          );
        }
        if (
          requestsList
            .find((request) => request.id === selectedRequest)
            .message.match(/comenzará el día (\S+)/) === null
        ) {
          throw new Error(
            "Error al crear la renta, revise que esten todos los datos en el mensaje. Favor de incluir la fecha de inicio."
          );
        }
        if (
          requestsList
            .find((request) => request.id === selectedRequest)
            .message.match(/finalizará el día (\S+)/) === null
        ) {
          throw new Error(
            "Error al crear la renta, revise que esten todos los datos en el mensaje. Favor de incluir la fecha de fin."
          );
        }
        if (
          requestsList
            .find((request) => request.id === selectedRequest)
            .message.match(/un precio de (\S+)/) === null
        ) {
          throw new Error(
            "Error al crear la renta, revise que esten todos los datos en el mensaje. Favor de incluir el precio."
          );
        }
      }

      await stateRequest(selectedRequest, requestState).then(() => {
        const state = aproveRequest ? "aprobado" : "rechazado";
        //  if aproved, create a rent and a price_rent
        if (aproveRequest) {
          // if aproveRequest is true, create a rent and a price_rent
          // student_id and price are not present in the request object,
          // so we need extract for the message in request object via regex
          // student_id appears after "Id del estudiante: "
          // price appears after "Precio de renta: "
          // const student_id = requestsList[selectedRequest].message.match(/Id del estudiante: (\d+)/)[1
          // const price = selectedRequest.message.match(/Precio de renta: (\d+)/)[1];
          console.log(
            "request",
            requestsList.find((request) => request.id === selectedRequest)
          );
          const request = requestsList.find(
            (request) => request.id === selectedRequest
          );
          const student_id = getStudentIdByEmail(
            request.message.match(/correo electrónico (\S+)/)[1]
          ).then((student_id) => {
            console.log("student_id", student_id);
            console.log("ownership_id", request.publication.ownership.id);
            console.log(
              "date_start",
              request.message.match(/comenzará el día (\S+)/)[1]
            );
            console.log(
              "date_end",
              request.message.match(/finalizará el día (\S+)/)[1]
            );
            console.log("price", request.message.match(/un precio de (\S+)/)[1]);

            createRent({
              variables: {
                ownerships_id: request.publication.ownership.id,
                students_id: request.message.match(/con id (\S+)/)[1],
                start_date: request.message.match(/comenzará el día (\S+)/)[1],
                end_date: request.message.match(/finalizará el día (\S+)/)[1],
                rating: 0
              },
            }).then((result) => {
              console.log("result", result);
              createPriceRent({
                variables: {
                  // pass amount as float8
                  amount: parseFloat(request.message.match(/un precio de (\S+)/)[1]),
                  rents_id: result.data.insert_sh_rents.returning[0].id,
                },
              }).then((result) => {
                console.log("result", result);
              });
            });
          });
        }
        toast({
          title: "Request " + state,
          status: "success",
          duration: 5000,
          isClosable: true,
        });
      });
      // Update the requestsList with the news state
      const newRequestsList = requestsList.map((request) => {
        if (request.id === selectedRequest) {
          return {
            ...request,
            request_state: requestState,
          };
        }
        return request;
      });
      setRequestsList(newRequestsList);
    } catch (error) {
      const state = aproveRequest ? "aprobar" : "rechazar";
      toast({
        title: "Error al " + state + " el request. " + error,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
    setIsModalRequestRentOpen(false);
  };

  const handleCancelStateRequest = () => {
    setIsModalRequestRentOpen(false);
  };

  console.log("request.message");

  return (
    <>
      {/* tabla de request, que muestre id, mensaje, 
        publication.contact_mail, publication.ownership.owner.id
        y las acciones con dos botones, aceptar o rechazar la request  */}
      <TableContainer width={"100%"}>
        <Table variant="striped" colorScheme="gray" width={"100%"}>
          <Thead>
            <Tr>
              <Th width={"2%"}>Id</Th>
              <Th width={"5%"}>Mensaje</Th>
              <Th width={"10%"}>Correo de contacto</Th>
              <Th width={"5%"}>Id del dueño</Th>
              <Th>Fecha de inicio</Th>
              <Th>Precio</Th>
              <Th width={"2%"}>Acciones</Th>
            </Tr>
          </Thead>
          <Tbody>
            {requestsList.map(
              (request) =>
                request.request_state && (
                  <Tr key={request.id}>
                    <Td>{request.id}</Td>
                    <Td>
                      <Tooltip label={request.message} hasArrow>
                        <Text isTruncated>
                          {request.message.substring(0, 50) + "..."}
                        </Text>
                      </Tooltip>
                    </Td>
                    <Td>{request.publication.contact_email}</Td>
                    <Td justifySelf="center">
                      {request.publication.ownership.owner.id}
                    </Td>
                    <Td>{request.datetime}</Td>
                    <Td>$ {request.publication.price}</Td>
                    <Td>
                      <Flex>
                        <Tooltip label="Aprobar renta" hasArrow>
                          <IconButton
                            aria-label="Aprobar renta"
                            icon={<TbHomeCheck />}
                            colorScheme="green"
                            onClick={() => handleStateRequest(request, true)}
                            mr="2"
                          />
                        </Tooltip>
                        <Tooltip label="Rechazar renta" hasArrow>
                          <IconButton
                            aria-label="Rechazar renta"
                            icon={<TbHomeX />}
                            colorScheme="red"
                            onClick={() => handleStateRequest(request, false)}
                            mr="2"
                          />
                        </Tooltip>
                      </Flex>
                    </Td>
                  </Tr>
                )
            )}
          </Tbody>
        </Table>
      </TableContainer>
      <AlertDialog
        isOpen={isModalRequestRentOpen}
        leastDestructiveRef={cancelRef}
        onClose={handleCancelStateRequest}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              {aproveRequest ? "Aceptar" : "Rechazar"} solicitud
            </AlertDialogHeader>

            <AlertDialogBody>
              ¿Está seguro que desea {aproveRequest ? "aprobar" : "rechazar"} la
              solicitud?
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={handleCancelStateRequest}>
                Cancelar
              </Button>
              {aproveRequest ? (
                <Button
                  colorScheme="green"
                  onClick={handleConfirmStateRequest}
                  ml={3}
                >
                  Aceptar
                </Button>
              ) : (
                <Button
                  colorScheme="red"
                  onClick={handleConfirmStateRequest}
                  ml={3}
                >
                  Rechazar
                </Button>
              )}
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  );
}
