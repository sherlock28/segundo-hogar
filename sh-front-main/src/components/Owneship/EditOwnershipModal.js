import React, { useEffect, useState } from "react";
import {
  Checkbox,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
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
  Select,
  Center,
  Image,
  SimpleGrid,
  Spinner,
  useToast,
} from "@chakra-ui/react";
import { useDisclosure } from "@chakra-ui/react";
import { Search2Icon } from "@chakra-ui/icons";
import { MapContainer } from "components/commons/MapContainer";
import { useHouseRegisterForm } from "hooks/pages/HouseRegister/useHouseRegisterForm";
import {
  validateTypeHouse,
  validateBedrooms,
  validateBathrooms,
  validateSize,
} from "utils/validations/PublicationRegister";
import Places from "components/commons/MapContainer/NewMap";
import { useGetOwnershipsByOwnerId } from "hooks/utils/useGetOwnershipsByOwnerId";
import {
  GET_OWNERSHIPS_BY_ID,
  GET_COORDINATES_BY_OWNERSHIPS_ID,
} from "client/gql/queries/utils";
import { postImagesService } from "services/ownership/postImagesService";
import {
  UPDATE_COORDINATES_MUTATION,
  UPDATE_ADDRESS_MUTATION,
  UPDATE_OWNERSHIPS_MUTATION,
  UPDATE_OWNERSHIP_IMAGES,
} from "client/gql/queries/update/updateOwnershipById";
import { useApolloClient, useMutation, useQuery } from "@apollo/client";
import { ownership } from "services";

export function EditPublicationModal({
  isOpen,
  onClose,
  publicationId,
  onUpdatePublication,
  address,
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [updateCoordinates] = useMutation(UPDATE_COORDINATES_MUTATION);
  const [updateAddress] = useMutation(UPDATE_ADDRESS_MUTATION);
  const [updateOwnership] = useMutation(UPDATE_OWNERSHIPS_MUTATION);
  const [updateImages] = useMutation(UPDATE_OWNERSHIP_IMAGES);

  // const  { ownerships } = useGetOwnershipsByOwnerId();
  // const SOURCE = "register-ownership";
  const [showPlaces, setShowPlaces] = useState(false);

  const handleCheckboxChange = () => {
    setShowPlaces(!showPlaces);
  };

  useEffect(() => {
    setIsModalOpen(isOpen);
  }, [isOpen]);

  const client = useApolloClient();

  const { onOpen, onClose: closeModal } = useDisclosure();

  const {
    setAddress,
    initialCenter,
    coordinates,
    zoom,
    getCoordinates,
    register,
    handleSubmit,
    errors,
    images,
    errorsImage,
    onFileChange,
    loading,
    error,
    removeImage,
  } = useHouseRegisterForm();

  const toast = useToast();
  const ownershipId = localStorage.getItem("ownershipToEdit");
  const { data } = useQuery(GET_OWNERSHIPS_BY_ID, {
    variables: { id: parseInt(ownershipId) },
  });
  const { data: coordinatesData } = useQuery(GET_COORDINATES_BY_OWNERSHIPS_ID, {
    variables: { id: parseInt(ownershipId) },
  });

  const [loadedLat, setLoadedLat] = useState(null);
  const [loadedLon, setLoadedLon] = useState(null);
  const [loadedAddress, setLoadedAddress] = useState(null);
  const [loadedApt, setLoadedApt] = useState("");
  const [loadedFloor, setLoadedFloor] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (coordinatesData && coordinatesData.sh_coordinates.length > 0) {
      setLoadedLat(coordinatesData.sh_coordinates[0].lat);
      setLoadedLon(coordinatesData.sh_coordinates[0].lon);
      setLoadedAddress(
        coordinatesData.sh_coordinates[0].ownerships[0].address.address
      );
      setLoadedApt(
        coordinatesData.sh_coordinates[0].ownerships[0].address.apartment
      );
      setLoadedFloor(
        coordinatesData.sh_coordinates[0].ownerships[0].address.floor
      );
    }
  }, [coordinatesData]);
  // console.log("Datos de la propiedad:", data?.sh_ownerships);
  // console.log("Tipo de propiedad", data?.sh_ownerships[0].ownerships_type.id);
  // console.log("coordinatesData", coordinatesData);
  // console.log("latitud: ", loadedLat);
  // console.log("longitud: ", loadedLon);
  // console.log("dirección: ", loadedAddress);

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      const lat = localStorage.getItem("lat");
      const lng = localStorage.getItem("lng");
      const address = localStorage.getItem("address");
      data.coordinates = { lat, lng };
      data.address = address;
      console.log("Datos formulario", data);
      const ownershipId = localStorage.getItem("ownershipToEdit");
      // console.log("OWNER ship ip a editar:", ownershipId);
      const ownership = await client.query({
        query: GET_OWNERSHIPS_BY_ID,
        variables: { id: ownershipId },
        fetchPolicy: "no-cache",
      });
      // console.log("propiedad a editar", ownership);
      // console.log(
      //   "coordenadas a editar",
      //   ownership.data.sh_ownerships[0].coordinate.id
      // );

      await updateCoordinates({
        variables: {
          id: ownership.data.sh_ownerships[0].coordinate.id,
          lat: loadedLat || parseFloat(data?.coordinates.lat),
          lon: loadedLon || parseFloat(data?.coordinates.lng),
          updatedAt: new Date().toISOString(),
        },
      }).then((result) => {
        // console.log("coordenadas actualizadas", result);
      });

      await updateAddress({
        variables: {
          id: ownership.data.sh_ownerships[0].address.id,
          address: loadedAddress,
          // || data?.sh_ownerships[0]?.address?.address || data?.address
          floor: loadedFloor || data?.floor,
          apartment: loadedApt || data?.apartment,
          updatedAt: new Date().toISOString(),
        },
      }).then((result) => {
        // console.log("dirección actualizada", result);
      });

      await updateOwnership({
        variables: {
          id: ownershipId || data.sh_ownerships[0].ownerships_type.id,
          shared: true,
          rooms: data?.bedrooms || data?.sh_ownerships[0]?.rooms || "1",
          bathrooms:
            data?.bathrooms || data?.sh_ownerships[0]?.bathrooms || "1",
          size: data?.size || data?.sh_ownerships[0]?.size || "40",
          rating: 0,
          updatedAt: new Date().toISOString(),
        },
      }).then((result) => {
        // console.log("propiedad actualizada", result);
      });

      const imagesToUpdate = images.map((image) => ({
        ownershipsId: ownershipId,
        imageFile: image,
        updated_at: new Date().toISOString(),
      }));

      console.log("imagenes a actualizar: ", imagesToUpdate);

      for (const imageData of imagesToUpdate) {
        const formData = new FormData();
        formData.append("image", imageData.imageFile);

        formData.append("idHouse", imageData.ownershipsId);
        formData.append("updated_at", imageData.updated_at);

        console.log("Datos enviados al servicio de imágenes:", formData);

        try {
          const response = await postImagesService({ formData });
          console.log("response: ", response);

          const imageUrl = response.url || response;

          await updateImages({
            variables: {
              ownershipsId: imageData.ownershipsId,
              imageUrl: imageUrl,
              updated_at: imageData.updated_at,
            },
          }).then((result) => {
            console.log("Imágenes actualizadas", result);
          });
        } catch (error) {
          console.error("Error al subir imagen:", error);
        }
      }

      toast({
        title: "Propiedad actualizada",
        description:
          "La propiedad " + ownershipId + " se ha actualizado correctamente.",
        status: "success",
        duration: 5000,
        isClosable: true,
      });

      onClose();
      closeModal();
    } catch (error) {
      console.log("error", error);
      toast({
        title: "Error al actualizar",
        description:
          "La propiedad no se ha actualizado correctamente. Intenta más tarde o contacta con soporte",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
    setIsLoading(false);
  };

  console.log("ownership type: ", data?.sh_ownerships[0].ownerships_type.id);

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
          <ModalHeader>Edita tu propiedad</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Box my={8} textAlign="left">
              <form>
                <Flex
                  direction={["column", "column", "column", "column", "column"]}
                >
                  <FormControl
                    m={2}
                    w={["100%", "100%", "100%", "100%", "100%"]}
                    isInvalid={errors.typeHouse}
                  >
                    <FormLabel>Tipo de inmueble</FormLabel>
                    <Select
                      name="typeHouse"
                      size="sm"
                      {...register("typeHouse", validateTypeHouse)}
                      placeholder="Selecciona el tipo de inmueble"
                      _focus={{ background: "none" }}
                      defaultValue={
                        data?.sh_ownerships[0]?.ownerships_type.id === 1
                          ? "1"
                          : "2"
                      }
                    >
                      <option value="2">Casa</option>
                      <option value="1">Departamento</option>
                    </Select>
                    <FormErrorMessage>
                      {errors.typeHouse && errors.typeHouse.message}
                    </FormErrorMessage>
                  </FormControl>
                </Flex>

                <Flex
                  direction={["column", "column", "column", "column", "column"]}
                  margin="auto"
                  alignItems="center"
                >
                  <FormControl
                    mt={4}
                    w={["100%", "100%", "100%", "100%", "100%"]}
                    alignItems="center"
                    isInvalid={errors.bedrooms}
                  >
                    <FormLabel>Cantidad de habitaciones</FormLabel>
                    <NumberInput
                      id="bedrooms"
                      name="bedrooms"
                      type="number"
                      size="sm"
                      m={2}
                      min={1}
                      max={15}
                      defaultValue={data?.sh_ownerships[0]?.rooms || 1}
                    >
                      <NumberInputField
                        {...register("bedrooms", validateBedrooms)}
                      />
                      <NumberInputStepper>
                        <NumberIncrementStepper />
                        <NumberDecrementStepper />
                      </NumberInputStepper>
                    </NumberInput>
                    <FormErrorMessage>
                      {errors.bedrooms && errors.bedrooms.message}
                    </FormErrorMessage>
                  </FormControl>

                  <FormControl
                    mt={4}
                    w={["100%", "100%", "100%", "100%", "100%"]}
                    isInvalid={errors.bathrooms}
                  >
                    <FormLabel>Cantidad de baños</FormLabel>
                    <NumberInput
                      size="sm"
                      m={2}
                      defaultValue={data?.sh_ownerships[0]?.bathrooms || 1}
                      min={1}
                      max={10}
                    >
                      <NumberInputField
                        {...register("bathrooms", validateBathrooms)}
                      />
                      <NumberInputStepper>
                        <NumberIncrementStepper />
                        <NumberDecrementStepper />
                      </NumberInputStepper>
                    </NumberInput>
                  </FormControl>
                  <FormErrorMessage>
                    {errors.bedrooms && errors.bedrooms.message}
                  </FormErrorMessage>
                </Flex>

                <Flex direction={["column", "column", "row", "row", "row"]}>
                  <FormControl
                    mt={4}
                    w={["100%", "100%", "100%", "100%", "100%"]}
                    isInvalid={errors.size}
                  >
                    <FormLabel>Tamaño (m²)</FormLabel>
                    <NumberInput
                      size="sm"
                      m={2}
                      defaultValue={data?.sh_ownerships[0]?.size || 40}
                      min={0}
                      max={100}
                    >
                      <NumberInputField {...register("size", validateSize)} />
                      <NumberInputStepper>
                        <NumberIncrementStepper />
                        <NumberDecrementStepper />
                      </NumberInputStepper>
                    </NumberInput>
                    <FormErrorMessage>
                      {errors.size && errors.size.message}
                    </FormErrorMessage>
                  </FormControl>
                </Flex>

                <Box textAlign="center" mt={4} mb={8}>
                  <Heading as="h4" size="md">
                    Ubicación
                  </Heading>
                </Box>

                <Flex
                  direction={["column", "column", "column", "column", "column"]}
                >
                  <FormControl>
                    <FormLabel>
                      Dirección: {data?.sh_ownerships[0]?.address?.address}
                    </FormLabel>
                    <Checkbox
                      mb={4}
                      textDecoration="underline"
                      color={"teal.700"}
                      onChange={handleCheckboxChange}
                    >
                      Corregir dirección
                    </Checkbox>
                    {showPlaces && (
                      <Places
                        coordinates={{
                          lat: data?.sh_ownerships[0]?.coordinate?.lat,
                          lng: data?.sh_ownerships[0]?.coordinate?.lon,
                        }}
                      />
                    )}
                  </FormControl>
                  <FormControl
                    w={["100%", "100%", "100%", "100%", "100%"]}
                    mt={16}
                    ml={2}
                    isInvalid={errors.floor}
                  >
                    <FormLabel>Piso</FormLabel>
                    <Input
                      id="floor"
                      type="text"
                      placeholder="Piso"
                      size="sm"
                      defaultValue={
                        data?.sh_ownerships[0]?.address?.floor || ""
                      }
                      {...register("floor")}
                    />
                    <FormErrorMessage>
                      {errors.floor && errors.floor.message}
                    </FormErrorMessage>
                  </FormControl>

                  <FormControl
                    w={["100%", "100%", "100%", "100$", "100%"]}
                    m={2}
                    isInvalid={errors.apartment}
                  >
                    <FormLabel>Departamento</FormLabel>
                    <Input
                      id="apartment"
                      type="text"
                      placeholder="Dpto"
                      size="sm"
                      defaultValue={
                        data?.sh_ownerships[0]?.address?.apartment || ""
                      }
                      {...register("apartment")}
                    />
                    <FormErrorMessage>
                      {errors.apartment && errors.apartment.message}
                    </FormErrorMessage>
                  </FormControl>
                </Flex>

                <Flex
                  direction={["column", "column", "column", "column", "column"]}
                >
                  <Box textAlign="center" mt={10} mb={8}>
                    <Heading as="h4" size="md">
                      Fotos
                    </Heading>
                  </Box>

                  <SimpleGrid columns={[1, 1, 2, 3, 3]}>
                    {data?.sh_ownerships[0]?.ownerships_images?.map(
                      (image, index) => (
                        <Box key={index} position="relative">
                          <Button
                            background="rgba(0, 0, 0, 0.1)"
                            border="0"
                            borderRadius="999px"
                            color="white"
                            fontSize="16px"
                            width="32px"
                            height="32px"
                            position="absolute"
                            top="15px"
                            right={["120px", "490px", "220px", "95px"]}
                            _hover={{
                              color: "white",
                              background: "rgba(0, 0, 0, 0.5)",
                            }}
                            onClick={() => {
                              // Captura el valor del índice y lo muestra en la consola
                              const imageIndex = index;
                              console.log("Índice de la imagen:", imageIndex);
                              removeImage(imageIndex);
                            }}
                          >
                            X
                          </Button>
                          <Image
                            src={image.imageurl}
                            alt={`Imagen ${index}`}
                            width="200px"
                            height="180px"
                            objectFit="cover"
                            p={2}
                          />
                        </Box>
                      )
                    )}
                    {/* Mostrar imágenes subidas */}
                    {images.map((image, index) => (
                      <Box
                        key={
                          index +
                          data?.sh_ownerships[0]?.ownerships_images?.length
                        }
                        position="relative"
                      >
                        <Button
                          background="rgba(0, 0, 0, 0.1)"
                          border="0"
                          borderRadius="999px"
                          color="white"
                          fontSize="16px"
                          width="32px"
                          height="32px"
                          position="absolute"
                          top="15px"
                          right={["120px", "490px", "220px", "95px"]}
                          _hover={{
                            color: "white",
                            background: "rgba(0, 0, 0, 0.5)",
                          }}
                          onClick={() => removeImage(index)}
                        >
                          X
                        </Button>
                        <Image
                          src={URL.createObjectURL(image)}
                          alt={`Nueva Imagen ${index}`}
                          width="200px"
                          height="180px"
                          objectFit="cover"
                          p={2}
                        />
                      </Box>
                    ))}
                    {/* Botón para subir imágenes */}
                    <Box>
                      <FormControl id="img" isInvalid={errorsImage.message}>
                        <FormLabel
                          w="170px"
                          py="5px"
                          px="10px"
                          color="white"
                          bg="black"
                          _hover={{
                            background: "#36393f",
                          }}
                          border="0px solid #fff"
                          textAlign="center"
                          borderRadius="xl"
                          disabled={images.length >= 6 ? true : false}
                        >
                          <i className="fas fa-cloud-upload-alt" /> Subir imagen
                        </FormLabel>
                        <Input
                          type="file"
                          onChange={onFileChange}
                          accept="image/*"
                          size="5000"
                          disabled={images.length >= 6 ? true : false}
                          display="none"
                        />
                        <FormErrorMessage>
                          {errorsImage && errorsImage.message}
                        </FormErrorMessage>
                      </FormControl>
                    </Box>
                  </SimpleGrid>
                </Flex>
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
              isLoading={isLoading} // Utiliza el estado isLoading para mostrar el spinner
              loadingText="Enviando..." // Opcional: texto que se muestra durante la carga
              disabled={isLoading} // Deshabilita el botón mientras está cargando
            >
              {isLoading ? <Spinner color="white" /> : "Guardar Cambios"}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
