import React, { useState, useEffect } from "react";
import {
  Alert,
  AlertIcon,
  Box,
  Flex,
  Heading,
  FormErrorMessage,
  FormControl,
  FormLabel,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Input,
  Textarea,
  Select,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Checkbox,
  Stack,
  Center,
  Link,
} from "@chakra-ui/react";
import {
  validateIsFurnished,
  validateTitle,
  validateDescription,
  validatePrice,
  validateFullname,
  validatePhone,
  validateEmailSignUp,
} from "utils/validations/PublicationRegister";
import { CustomButton } from "components/commons/CustomButton";
import { useRegisterPublicationForm } from "hooks/pages/PublicationRegister/usePublicationRegister";
import { REGISTER_PUBLICATION } from "client/gql/mutations/registerPublication/registerPublication";
import { useMutation, useQuery } from "@apollo/client";
import { useDispatch } from "react-redux";
import { GET_PUBLICATIONS_COUNT_BY_OWNERSHIP_ID } from "client/gql/queries/users";
import useLocation from "wouter/use-location";
import { paths } from "config/paths";

export function PublicationRegisterForm() {
  const ownerId = localStorage.getItem("ownerId");
  console.log("owner id: ", ownerId)
  const [_, setLocation] = useLocation();
  const {
    register,
    handleSubmit,
    errors,
    isSubmitting,
    onSubmit,
    // publicationsData,
  } = useRegisterPublicationForm();

  const dispatch = useDispatch;

  const ownershipId = localStorage.getItem("ownershipId");

  const {
    loading: publicationsLoading,
    error: publicationsError,
    data: publicationsData,
  } = useQuery(GET_PUBLICATIONS_COUNT_BY_OWNERSHIP_ID, {
    variables: { id: ownershipId },
  });

  console.log("publicationsData: ", publicationsData);

  const [showAlert, setShowAlert] = useState(false);

  useEffect(() => {
    if (publicationsData?.sh_publications_aggregate?.aggregate?.count > 0) {
      setShowAlert(true);
    } else {
      setShowAlert(false);
    }
  }, [publicationsData]);

  const handleGoBack = () => {
    setLocation(`/cuenta/${ownerId}`);
  };

  return (
    <Box my={8} textAlign="left">
      {showAlert ? (
        <>
          <Alert status="error" mb={4}>
            <AlertIcon />
            Advertencia: esta propiedad ya tiene una publicación activa. Elimine
            o edite la propiedad desde la sección "Mi Cuenta".{" "}
          </Alert>
          <Center>
            <Link color={"blue.400"} onClick={handleGoBack}>
              Volver a mi cuenta
            </Link>
          </Center>
        </>
      ) : (
        <form>
          <FormControl m={2} isInvalid={errors.title}>
            <FormLabel>Ingresá un título</FormLabel>
            <Input
              id="title"
              type="text"
              w="98%"
              placeholder="Escribe un título para la publicación..."
              {...register("title", validateTitle)}
            />
            <FormErrorMessage>
              {errors.title && errors.title.message}
            </FormErrorMessage>
          </FormControl>

          <FormControl m={2} isInvalid={errors.description}>
            <FormLabel>Descripción</FormLabel>
            <Textarea
              id="description"
              placeholder="Escribe una descripción..."
              w="98%"
              h={"150px"}
              resize="none"
              {...register("description", validateDescription)}
            />

            <FormErrorMessage>
              {errors.description && errors.description.message}
            </FormErrorMessage>
          </FormControl>

          <Flex direction={["column", "column", "row", "row", "row"]}>
            <FormControl
              m={2}
              w={["100%", "100%", "100%", "49%", "47%"]}
              isInvalid={errors.isFurnished}
            >
              <FormLabel>Amoblado</FormLabel>
              <Select
                name="isFurnished"
                {...register("isFurnished", validateIsFurnished)}
                placeholder="¿Esta el inmueble amoblado?"
                _focus={{ background: "none" }}
              >
                <option value="1">Si</option>
                <option value="0">No</option>
              </Select>
              <FormErrorMessage>
                {errors.isFurnished && errors.isFurnished.message}
              </FormErrorMessage>
            </FormControl>

            <FormControl
              m={2}
              w={["100%", "100%", "100%", "49%", "47%"]}
              isInvalid={errors.price}
            >
              <FormLabel>Precio ($)</FormLabel>
              <NumberInput size="md" m={2} defaultValue={0} min={0}>
                <NumberInputField {...register("price", validatePrice)} />
                <NumberInputStepper>
                  <NumberIncrementStepper />
                  <NumberDecrementStepper />
                </NumberInputStepper>
              </NumberInput>
              <FormErrorMessage>
                {errors.price && errors.price.message}
              </FormErrorMessage>
            </FormControl>
          </Flex>

          <Box textAlign="center" mt={4} mb={8}>
            <Heading as="h4" size="md">
              Información de contacto
            </Heading>
          </Box>

          <Flex direction={["column", "column", "row", "row", "row"]}>
            <FormControl m={2} isInvalid={errors.fullname}>
              <FormLabel>Ingresá tu nombre</FormLabel>
              <Input
                id="fullname"
                type="text"
                w="98%"
                placeholder="Nombre"
                {...register("fullname", validateFullname)}
              />
              <FormErrorMessage>
                {errors.fullname && errors.fullname.message}
              </FormErrorMessage>
            </FormControl>

            <FormControl m={2} isInvalid={errors.phone}>
              <FormLabel>Ingresá tu teléfono</FormLabel>
              <Input
                id="phone"
                type="text"
                w="98%"
                placeholder="Teléfono"
                {...register("phone", validatePhone)}
              />
              <FormErrorMessage>
                {errors.phone && errors.phone.message}
              </FormErrorMessage>
            </FormControl>
          </Flex>

          <FormControl m={2} isInvalid={errors.email}>
            <FormLabel>Ingresá tu email</FormLabel>
            <Input
              id="email"
              type="text"
              w={["100%", "100%", "47%", "47%", "47%"]}
              placeholder="Email"
              {...register("email", validateEmailSignUp)}
            />
            <FormErrorMessage>
              {errors.email && errors.email.message}
            </FormErrorMessage>
          </FormControl>

          <Accordion mt={8} allowToggle>
            <AccordionItem>
              <h2>
                <AccordionButton>
                  <Box flex="1" textAlign="left">
                    Restricciones
                  </Box>
                  <AccordionIcon />
                </AccordionButton>
              </h2>
              <AccordionPanel pb={4}>
                <Stack
                  spacing={10}
                  direction={["column", "column", "row", "row"]}
                  mt={4}
                >
                  <FormControl isInvalid={errors.pets}>
                    <Checkbox {...register("pets")}>Mascotas</Checkbox>
                    <FormErrorMessage>
                      {errors.pets && errors.pets.message}
                    </FormErrorMessage>
                  </FormControl>

                  <FormControl isInvalid={errors.smokers}>
                    <Checkbox {...register("smokers")}>Fumadores</Checkbox>
                    <FormErrorMessage>
                      {errors.smokers && errors.smokers.message}
                    </FormErrorMessage>
                  </FormControl>

                  <FormControl isInvalid={errors.children}>
                    <Checkbox {...register("children")}>Niños</Checkbox>
                    <FormErrorMessage>
                      {errors.children && errors.children.message}
                    </FormErrorMessage>
                  </FormControl>
                </Stack>

                <FormControl mt={4} isInvalid={errors.amount}>
                  <FormLabel>Cantidad de inquilinos: </FormLabel>
                  <NumberInput
                    w={20}
                    size="sm"
                    defaultValue={1}
                    min={1}
                    max={20}
                  >
                    <NumberInputField {...register("amount")} />
                    <NumberInputStepper>
                      <NumberIncrementStepper />
                      <NumberDecrementStepper />
                    </NumberInputStepper>
                  </NumberInput>
                  <FormErrorMessage>
                    {errors.amount && errors.amount.message}
                  </FormErrorMessage>
                </FormControl>
              </AccordionPanel>
            </AccordionItem>
          </Accordion>

          {/* <FormControl mt={16} isInvalid={errorsCaptcha.message}>
          <Center d="flex" flexDir="column">
            <FormErrorMessage>
              {errorsCaptcha && errorsCaptcha.message}
            </FormErrorMessage>
          </Center>
        </FormControl> */}

          <Center m={8}>
            <CustomButton
              handleClick={handleSubmit(onSubmit)}
              type="submit"
              isLoading={isSubmitting}
              loadingText="Enviando"
              width="50%"
              textButton="Publicar"
            />
          </Center>
        </form>
      )}
    </Box>
  );
}
