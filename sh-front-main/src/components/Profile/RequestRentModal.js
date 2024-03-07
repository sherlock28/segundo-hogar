import React, { useEffect, useState } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  Box,
  FormErrorMessage,
  FormControl,
  FormLabel,
  Input,
  useToast,
  Textarea,
  FormHelperText,
} from "@chakra-ui/react";
import { useDisclosure } from "@chakra-ui/react";
import { REGISTER_REQUEST_RENT } from "client/gql/mutations/registerRequestRent/registerRequestRent";
import {
  GET_PUBLICATIONS_BY_OWNERSHIP_ID,
  GET_STUDENT_BY_EMAIL,
} from "client/gql/queries/utils";
import { useApolloClient, useMutation } from "@apollo/client";
import { useForm } from "react-hook-form";

const handleSubmit = (onSubmit) => (e) => {
  e.preventDefault();
  onSubmit();
};

export function RequestRentModal({ isOpen, onClose }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [registerRequestRent] = useMutation(REGISTER_REQUEST_RENT);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    setIsModalOpen(isOpen);
  }, [isOpen]);

  const client = useApolloClient();

  const { onOpen, onClose: closeModal } = useDisclosure();

  const toast = useToast();

  const onSubmit = async (data) => {
    try {
      console.log("data request", data);
      // get the last publication
      console.log("ownershipId", localStorage.getItem("ownershipId"));
      const publicaciones = await client.query({
        query: GET_PUBLICATIONS_BY_OWNERSHIP_ID,
        variables: {
          ownerships_id: localStorage.getItem("ownershipId"),
        },
        fetchPolicy: "no-cache",
      });

      // get the student by email,
      const student = await client.query({
        query: GET_STUDENT_BY_EMAIL,
        variables: {
          email: data.student_mail,
        },
        fetchPolicy: "no-cache",
      });
      
      // if the student is not registered, throw an error
      if (student.data.sh_students.length === 0) {
        throw new Error("El estudiante no se encuentra registrado.");
      }

      console.log("last publication id", publicaciones);
      const studentId = student.data.sh_students[0].person.students[0].id;
      const message = `${data.message}.Se requiere la aprobación para el usuario con correo electrónico ${data.student_mail} con id ${studentId} el cual comenzará el día ${data.date_start} y finalizará el día ${data.date_end} con un precio de ${data.price}.`;
      await registerRequestRent({
        variables: {
          publications_id:
            publicaciones.data.sh_publications[
              publicaciones.data.sh_publications.length - 1
            ].id,
          message: message,
          // "student_email: " +
          // data.student_mail +
          // "\ndate_start: " +
          // data.date_start +
          // "\ndate_end: " +
          // data.date_end +
          // "\nprice: " +
          // data.price +
          // "\nmessage: " +

          datetime: data.date_start,
        },
      }).then((result) => {
        console.log("result", result);
        toast({
          title: "Solicitud enviada",
          description:
            "La solicitud fue enviada con exito, espere la respuesta del Administrador.",
          status: "success",
          duration: 5000,
          isClosable: true,
        });
      });
      onClose();
      closeModal();
    } catch (error) {
      console.log("error", error);
      if (error.message.includes("Cannot read properties of undefined")) {
        toast({
          title: "Error",
          description:
            "Para poder rentar una propiedad, primero debe registrar una publicación.",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      } else if (
        error.message.includes("El estudiante no se encuentra registrado.")
      ) {
        toast({
          title: "Error",
          description: "El estudiante no se encuentra registrado.",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      } else {
        toast({
          title: "Error",
          description: "Ocurrio un error al enviar la solicitud.",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      }
      onClose();
      closeModal();
    }
  };
  return (
    <>
      <Modal
        blockScrollOnMount={false}
        isOpen={isModalOpen}
        onClose={() => {
          onClose();
          closeModal();
        }}
        size={"xl"}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            Solicitar al administrar rentar esta propiedad
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Box my={8} textAlign="left">
              <form>
                {/* Mail del estudiante */}
                <FormControl isInvalid={false}>
                  <FormLabel>Mail del estudiante</FormLabel>
                  <Input
                    type="email"
                    name="student_mail"
                    placeholder="Email del estudiante"
                    {...register("student_mail", {
                      required: "Este campo es requerido",
                    })}
                  />
                  <FormHelperText>
                    {" "}
                    Debe ser un mail de un estudiante registrado para que la
                    renta se apruebe.
                  </FormHelperText>
                  <FormErrorMessage>{errors.student_mail}</FormErrorMessage>
                </FormControl>
                <FormControl isInvalid={false} mt="4">
                  <FormLabel>Fecha de inicio de renta</FormLabel>
                  <Input
                    type="date"
                    name="date_start"
                    placeholder="Fecha de inicio de renta"
                    {...register("date_start", {
                      required: "Este campo es requerido",
                    })}
                  />
                  <FormErrorMessage>{errors.datetime}</FormErrorMessage>
                </FormControl>
                {/* fecha de fin */}
                <FormControl isInvalid={false} mt="4">
                  <FormLabel>Fecha de fin de renta</FormLabel>
                  <Input
                    type="date"
                    name="date_end"
                    placeholder="Fecha de fin de renta"
                    {...register("date_end", {
                      required: "Este campo es requerido",
                    })}
                  />
                  <FormErrorMessage>{errors.datetime}</FormErrorMessage>
                </FormControl>

                {/* Price */}
                <FormControl isInvalid={false} mt="4">
                  <FormLabel>Precio de renta</FormLabel>
                  <Input
                    type="number"
                    name="price"
                    placeholder="Precio de renta"
                    {...register("price", {
                      required: "Este campo es requerido",
                    })}
                  />
                  <FormErrorMessage>{errors.price}</FormErrorMessage>
                </FormControl>

                <FormControl isInvalid={false} mt="4">
                  <FormLabel>Mensaje</FormLabel>
                  <Textarea
                    type="text"
                    name="message"
                    placeholder="Mensaje"
                    {...register("message", {
                      required: "Este campo es requerido",
                    })}
                  />
                  <FormErrorMessage>{errors.message}</FormErrorMessage>
                </FormControl>
              </form>
            </Box>
          </ModalBody>
          <ModalFooter>
            <Button
              colorScheme="black"
              variant="outline"
              mr={3}
              onClick={() => {
                onClose();
                closeModal();
              }}
            >
              Cerrar
            </Button>
            <Button
              variant="ghost"
              bg="black"
              color="white"
              onClick={handleSubmit(onSubmit)}
            >
              Enviar solicitud de renta
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
