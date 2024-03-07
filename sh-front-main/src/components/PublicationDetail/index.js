import { useRef, useEffect, useState } from "react";
import { format } from "date-fns";
import {
  Box,
  Flex,
  Center,
  Text,
  Heading,
  Card,
  Stack,
} from "@chakra-ui/react";
import { StarIcon } from "@chakra-ui/icons";
import { Divider } from "@chakra-ui/react";
import { Loading } from "components/commons/Loading";
import "swiper/swiper-bundle.min.css";
import { useGetPublicationById } from "hooks/pages/PublicationDetail/useGetPublicationById";
import { useRoute } from "wouter";
import { useQuery } from "@apollo/client";
import { Slider } from "./Slider";
import { paths } from "config/paths";
import { MapSearch } from "components/Search/Map";
import { FaWhatsapp } from "react-icons/fa";
import { BsBuilding } from "react-icons/bs";
import { MdMailOutline } from "react-icons/md";
import { CiLocationOn } from "react-icons/ci";
import { MdOutlineBedroomParent } from "react-icons/md";
import { FaRestroom } from "react-icons/fa";
import { LiaRulerCombinedSolid } from "react-icons/lia";
import { FaCouch } from "react-icons/fa";
import { GiCigarette } from "react-icons/gi";
import { LuBaby } from "react-icons/lu";
import { PiUsersThreeFill } from "react-icons/pi";
import { MdOutlinePets } from "react-icons/md";
import { GET_AVG_RATING_BY_OWNERSHIPS_ID } from "client/gql/queries/utils";

export function PublicationDetail() {
  const userData = localStorage.getItem("userData");
  console.log("userData: ", userData);

  const [_, params] = useRoute(paths.publicationDetail);

  const { loading, error, publication } = useGetPublicationById({
    id: params.id,
  });

  const { data: avgRatingData } = useQuery(GET_AVG_RATING_BY_OWNERSHIPS_ID, {
    variables: { ownerships_id: publication?.ownership?.id },
  });

  console.log(avgRatingData);
  const avgRating = avgRatingData?.sh_rents_aggregate?.aggregate?.avg?.rating;

  const ownershipId =
    publication && publication.ownership ? publication.ownership.id : null;

  const topRef = useRef(null);

  useEffect(() => {
    if (topRef.current) {
      topRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [loading]);

  if (loading) return <Loading minH={"60vh"} size={"lg"} m={50} />;
  if (error) return <div>Error!</div>;
  const idPublication = publication.id;
  const owner = publication.contact_name;
  const phone = publication.contact_phone;
  const email = publication.contact_email;
  const { lat, lon } = publication.ownership.coordinate;
  const address = publication.ownership.address.address;

  const phoneLink = `https://wa.me/${phone}`;
  const emailLink = `https://mailto${email}`;
  console.log(publication.ownership.id);

  const getColorForRating = (rating) => {
    if (rating === null || rating === undefined) {
      return "#718096";
    } else if (rating === 0) {
      return "#718096";
    } else if (rating >= 1 && rating <= 5) {
      switch (rating) {
        case 1:
          return "#E53E3E";
        case 2:
          return "#DD6B20";
        case 3:
          return "#D69E2E";
        case 4:
          return "#38A169";
        case 5:
          return "#2F855A";
        default:
          return "#718096";
      }
    } else {
      return "#718096";
    }
  };

  return (
    <Box>
      <Stack
        direction={{ base: "column", md: "row" }}
        alignItems={"flex-start"}
        mt={16}
        justifyContent={"space-between"}
      >
        <Slider
          images={publication.ownership.ownerships_images}
          width="100vw"
        />

        <Card width={{ base: "100%", md: "1/4" }} p={2} height={"100%"}>
          <Flex flexDirection={"column"} align={"center"} textAlign={"center"}>
            <Heading size="md" mb={5}>
              {publication.title}
            </Heading>
            <Heading color={"gray"}>${publication.price}</Heading>
            <Text
              fontWeight={"medium"}
              fontSize={"15px"}
              textDecor={"underline"}
              cursor={"pointer"}
              color={"gray"}
            >
              Publicado el{" "}
              {format(new Date(publication.created_at), "dd-MM-yyyy")}
            </Text>
            <Heading size="sm" textAlign={"center"} my={2}>
              Contacta con el propietario:
            </Heading>
            <Box>
              <Flex p={2} gap={1}>
                <Text as="b" color={"gray.600"} textAlign={"center"}>
                  Propietario:
                </Text>
                {owner}
              </Flex>
            </Box>
            <Text as={"b"}>Calificación</Text>
            <Box d="flex" mt="2" alignItems="center">
              {Array(5)
                .fill("")
                .map((_, i) => (
                  <StarIcon
                    key={i}
                    color={i < avgRating ? "teal.500" : "gray.300"}
                  />
                ))}
            </Box>
            <Text
              fontSize="22px"
              fontWeight="bold"
              color={getColorForRating(avgRating)}
            >
              {avgRating !== null &&
              avgRating !== undefined &&
              avgRating !== 0 ? (
                avgRating
              ) : (
                <Text fontSize="15px">
                  Esta propiedad no tiene calificaciones aún
                </Text>
              )}
            </Text>

            <Center my={3} gap={5}>
              <a href={phoneLink}>
                <Box
                  background={"#25D366"}
                  p={".5rem"}
                  borderRadius={"50%"}
                  _hover={{ transform: "scale(110%)" }}
                  transition={".3s"}
                  cursor={"pointer"}
                >
                  <FaWhatsapp style={{ color: "white", fontSize: "30px" }} />
                </Box>
              </a>
              <a href={`mailto:${email}`}>
                <Box
                  background={"lightgray"}
                  p={".5rem"}
                  borderRadius={"50%"}
                  _hover={{ transform: "scale(110%)" }}
                  transition={".3s"}
                  cursor={"pointer"}
                >
                  <MdMailOutline style={{ color: "white", fontSize: "30px" }} />
                </Box>
              </a>
            </Center>
          </Flex>
        </Card>
      </Stack>
      <Stack
        direction={{ base: "column", md: "row" }}
        spacing={3}
        px={{ base: "0", md: "10" }}
        justifyContent={{ base: "flex-start", md: "space-between" }}
      >
        <Card
          variant={"elevated"}
          p={2}
          mt={16}
          width={{ base: "100%", md: "1/2" }}
        >
          <Heading size="md" textAlign={"center"} my={2}>
            Características:
          </Heading>
          <Flex flexDirection={{ base: "column", md: "row" }}>
            <Flex
              alignItems={"center"}
              justifyContent={{ base: "center", md: "flex-start" }}
              p={2}
              gap={1}
              w={{ base: "100%", md: "50%" }}
            >
              <BsBuilding
                style={{ display: "inline", color: "gray", fontSize: "17px" }}
              />
              <Text as="b" color={"gray.600"}>
                Tipo de propiedad:{" "}
              </Text>
              {publication.ownership.ownerships_type?.description}
            </Flex>
            <Flex
              alignItems={"center"}
              justifyContent={{ base: "center", md: "flex-start" }}
              p={2}
              gap={1}
              w={{ base: "100%", md: "50%" }}
            >
              <CiLocationOn
                style={{ display: "inline", color: "gray", fontSize: "17px" }}
              />
              <Text as="b" color={"gray.600"}>
                Ubicación:{" "}
              </Text>
              {address}
            </Flex>
          </Flex>
          <Flex flexDirection={{ base: "column", md: "row" }}>
            <Flex
              alignItems={"center"}
              justifyContent={{ base: "center", md: "flex-start" }}
              p={2}
              gap={1}
              w={{ base: "100%", md: "50%" }}
            >
              <MdOutlineBedroomParent
                style={{ display: "inline", color: "gray", fontSize: "17px" }}
              />
              <Text as="b" color={"gray.600"}>
                Cantidad de habitaciones:
              </Text>
              {publication.ownership.rooms}
            </Flex>
            <Flex
              alignItems={"center"}
              justifyContent={{ base: "center", md: "flex-start" }}
              p={2}
              gap={1}
              w={{ base: "100%", md: "50%" }}
            >
              <FaRestroom
                style={{ display: "inline", color: "gray", fontSize: "17px" }}
              />
              <Text as="b" color={"gray.600"}>
                Cantidad de baños:
              </Text>
              {publication.ownership.bathrooms}
            </Flex>
          </Flex>
          <Flex flexDirection={{ base: "column", md: "row" }}>
            <Flex
              alignItems={"center"}
              justifyContent={{ base: "center", md: "flex-start" }}
              p={2}
              gap={1}
              w={{ base: "100%", md: "50%" }}
            >
              <LiaRulerCombinedSolid
                style={{ display: "inline", color: "gray", fontSize: "17px" }}
              />
              <Text as="b" color={"gray.600"}>
                Tamaño (m2):
              </Text>
              {publication.ownership.rooms}
            </Flex>
            <Flex
              alignItems={"center"}
              justifyContent={{ base: "center", md: "flex-start" }}
              p={2}
              gap={1}
              w={{ base: "100%", md: "50%" }}
            >
              <FaCouch
                style={{ display: "inline", color: "gray", fontSize: "17px" }}
              />
              <Text as="b" color={"gray.600"}>
                Amoblado:
              </Text>
              {publication.is_furnished ? <Text>Si</Text> : <Text>No</Text>}
            </Flex>
          </Flex>
          <Flex flexDirection={{ base: "column", md: "row" }}>
            <Flex
              alignItems={"center"}
              justifyContent={{ base: "center", md: "flex-start" }}
              p={2}
              gap={1}
              w={{ base: "100%", md: "50%" }}
            >
              <PiUsersThreeFill
                style={{ display: "inline", color: "gray", fontSize: "17px" }}
              />
              <Text as="b" color={"gray.600"}>
                Capacidad:
              </Text>
              {publication.ownership.restriction.renter_count} Persona(s)
            </Flex>
          </Flex>
          <Divider color={"gray.300"} my={3} />
          <Heading size="md" textAlign={"center"} my={2}>
            Restricciones:
          </Heading>
          <Flex flexDirection={{ base: "column", md: "row" }}>
            <Flex
              alignItems={"center"}
              justifyContent={{ base: "center", md: "flex-start" }}
              p={2}
              gap={1}
              w={{ base: "100%", md: "50%" }}
            >
              <GiCigarette
                style={{ display: "inline", color: "gray", fontSize: "17px" }}
              />
              <Text as="b" color={"gray.600"}>
                Fumadores:
              </Text>
              {publication.ownership.restriction.smokers ? (
                <Text>Si</Text>
              ) : (
                <Text>No</Text>
              )}
            </Flex>
            <Flex
              alignItems={"center"}
              justifyContent={{ base: "center", md: "flex-start" }}
              p={2}
              gap={1}
              w={{ base: "100%", md: "50%" }}
            >
              <MdOutlinePets
                style={{ display: "inline", color: "gray", fontSize: "17px" }}
              />
              <Text as="b" color={"gray.600"}>
                Mascotas:
              </Text>
              {publication.ownership.restriction.pets ? (
                <Text>Si</Text>
              ) : (
                <Text>No</Text>
              )}
            </Flex>
          </Flex>
          <Flex flexDirection={{ base: "column", md: "row" }}>
            <Flex
              alignItems={"center"}
              justifyContent={{ base: "center", md: "flex-start" }}
              p={2}
              gap={1}
              w={{ base: "100%", md: "50%" }}
            >
              <LuBaby
                style={{ display: "inline", color: "gray", fontSize: "17px" }}
              />
              <Text as="b" color={"gray.600"}>
                Niños:
              </Text>
              {publication.ownership.restriction.children ? (
                <Text>Si</Text>
              ) : (
                <Text>No</Text>
              )}
            </Flex>
          </Flex>
        </Card>
        <Flex color="#000" mt={16}>
          <Flex flex={1}>
            <MapSearch
              markers={[
                {
                  position: {
                    lat: lat,
                    lng: lon,
                  },
                },
              ]}
              width={"400px"}
            />
          </Flex>
        </Flex>
      </Stack>
      <Divider my={10} />
      <Box px={{ base: "0", md: "10" }} mb={10}>
        <Card p={5} mt={10}>
          <Heading size="md" textAlign={"center"} my={2}>
            Descripción
          </Heading>
          <Text textAlign={"center"}>{publication.description}</Text>
        </Card>
      </Box>
    </Box>
  );
}
