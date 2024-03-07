import React from "react";
import { useQuery } from "@apollo/client";
import { useRoute } from "wouter";
import { paths } from "config/paths";
import {
  Avatar,
  Box,
  Heading,
  Skeleton,
  Button,
  Center,
  Card,
  Divider,
  Stack,
  Text,
  Flex,
  Container,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
} from "@chakra-ui/react";
import { FaWhatsapp } from "react-icons/fa";
import { IoMdMale } from "react-icons/io";
import { IoMdFemale } from "react-icons/io";
import { IoMaleFemaleSharp } from "react-icons/io5";
import { FaBirthdayCake } from "react-icons/fa";
import { FaUserClock } from "react-icons/fa6";
import { RiGraduationCapFill } from "react-icons/ri";
import { FaLocationDot } from "react-icons/fa6";
import { BsPinMapFill } from "react-icons/bs";
import { FaPhoneAlt } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import { FcAbout } from "react-icons/fc";
import {
  GET_PERSON_BY_ID,
  GET_STUDENT_INFO_BY_PERSON_ID,
} from "client/gql/queries/utils";
import { SkeletonLoader } from "components/commons/Loading/Skeleton";

const formatDate = (birthdate) => {
  const options = { day: "numeric", month: "long" };
  const date = new Date(birthdate);
  return date.toLocaleDateString("es-AR", options);
};

export function RoommateProfileView() {
  const [_, params] = useRoute(paths.roommateAccount);
  const idPerson = params.userid;
  const { loading, error, data } = useQuery(GET_PERSON_BY_ID, {
    variables: { id: idPerson },
  });
  const {
    loading: studentInfoLoading,
    error: studentInfoError,
    data: studentInfoData,
  } = useQuery(GET_STUDENT_INFO_BY_PERSON_ID, {
    variables: { id: idPerson },
  });

  if (loading || studentInfoLoading) return <SkeletonLoader />;
  if (error || studentInfoError)
    return <Heading>Error: {error.message}</Heading>;

  const person = data.sh_persons[0];
  const studentInfo = studentInfoData.sh_persons[0]?.students[0];
  const userInfo = studentInfoData.sh_persons[0]?.users[0];
  console.log("person: ", person);
  console.log("data: ", data);
  console.log("student info: ", studentInfo);
  console.log("student share?: ", studentInfo?.shared);
  console.log("user bio: ", userInfo?.bio);
  const phoneLink = `https://wa.me/${person.phone}`;

  const formattedBirthdate = formatDate(person.birth_date);

  const calculateAge = (birthdate) => {
    const today = new Date();
    const birthdateObj = new Date(birthdate);
    let age = today.getFullYear() - birthdateObj.getFullYear();
    const monthDiff = today.getMonth() - birthdateObj.getMonth();

    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthdateObj.getDate())
    ) {
      age--;
    }

    return age;
  };

  return (
    <Box px={{ base: "0", md: "20" }}>
      <Box
        flexDirection={{ base: "column", md: "row" }}
        display={"flex"}
        alignItems={"center"}
        justifyContent={"space-between"}
      >
        <Box
          flexDirection={{ base: "column", md: "row" }}
          display={"flex"}
          alignItems={"center"}
          justifyContent={"center"}
          textAlign={"center"}
          gap={{ base: "1rem", md: "2rem" }}
        >
          <Avatar size="2xl" />
          <Box>
            <Heading as="h1">{`${person.firstname} ${person.lastname}`}</Heading>
            <Box>
              <Text fontWeight={"semibold"} fontSize={"21px"} color={"gray"}>
                {userInfo?.username || ""}
              </Text>
            </Box>
          </Box>
        </Box>
        <a href={phoneLink}>
          <Button
            leftIcon={<FaWhatsapp />}
            colorScheme="gray"
            variant="solid"
            size="lg"
          >
            Contactar
          </Button>
        </a>
      </Box>
      <Divider my={{ base: "5", md: "10" }} />
      <Stack
        direction={{ base: "column", md: "row" }}
        alignItems={{ base: "flex-start", md: "center" }}
        justifyContent={{ base: "space-around", md: "space-between" }}
      >
        <Box flex={{ base: "1", md: "0 0 60%" }}>
          <Flex alignItems="center" gap=".5rem">
            <Heading>Acerca de {person.firstname}</Heading>
            <FcAbout background="gray" fontSize="25px" />
          </Flex>
          <Text fontWeight="medium" my="10px">
            {userInfo?.bio || (
              <Heading
                as="h4"
                size="md"
                fontStyle="italic"
                color="gray"
                fontWeight="medium"
              >
                {person.firstname} no ha compartido su biografía aún
              </Heading>
            )}
          </Text>
        </Box>
        <Box flex={{ base: "1", md: "0 0 40%" }}>
          <Text
            fontSize={{base: "16px", md: "20px"}}
            fontWeight="semibold"
            textAlign={{ base: "center", md: "right" }}
          >
            Compartir renta: {studentInfo?.shared ? "Si" : "No"}
          </Text>
        </Box>
      </Stack>

      <Divider my={{base: "2", md: "10"}} />
      <Container my={10} width={{ base: "100%", md: "100%" }}>
        <Card width={{ base: "100%", md: "100%" }}>
          <Tabs width={{ base: "100%", md: "100%" }}>
            <TabList>
              <Tab
                _selected={{ color: "black", bg: "#EDF2F7" }}
                fontWeight={"medium"}
                transition={".5s"}
                fontSize={{ base: "12px", md: "18px" }}
                width={"33.3%"}
              >
                Información General
              </Tab>
              <Tab
                _selected={{ color: "black", bg: "#EDF2F7" }}
                fontWeight={"medium"}
                transition={".5s"}
                fontSize={{ base: "12px", md: "18px" }}
                width={"33.3%"}
              >
                Información Académica
              </Tab>
              <Tab
                _selected={{ color: "black", bg: "#EDF2F7" }}
                fontWeight={"medium"}
                transition={".5s"}
                fontSize={{ base: "12px", md: "18px" }}
                width={"33.3%"}
              >
                Contacto
              </Tab>
            </TabList>
            <TabPanels>
              <TabPanel>
                <Heading
                  py={{ base: "1", md: "5" }}
                  textAlign={"center"}
                  size={{ base: "md", md: "lg" }}
                >
                  Información general
                </Heading>
                <Divider />
                <Stack py={4}>
                  <Center>
                    <Flex alignItems={"center"} gap={2}>
                      <Text
                        fontSize={{ base: "12px", md: "18px" }}
                        fontWeight={"semibold"}
                      >
                        Género:
                      </Text>
                      {person.gender === "male" && (
                        <Flex alignItems={"center"} gap={1}>
                          <IoMdMale color={"#4299E1"} fontWeight={"medium"} />
                          <Text
                            fontSize={{ base: "12px", md: "18px" }}
                            color={"gray.400"}
                            fontWeight={"semibold"}
                          >
                            Hombre
                          </Text>
                        </Flex>
                      )}

                      {person.gender === "female" && (
                        <Flex alignItems={"center"} gap={1}>
                          <IoMdFemale color={"#F56565"} fontWeight={"medium"} />
                          <Text
                            fontSize={{ base: "12px", md: "18px" }}
                            color={"gray.400"}
                            fontWeight={"semibold"}
                          >
                            Mujer
                          </Text>
                        </Flex>
                      )}

                      {person.gender !== "male" &&
                        person.gender !== "female" && (
                          <Flex alignItems={"center"} gap={1}>
                            <IoMaleFemaleSharp
                              color={"#ED64A6"}
                              fontWeight={"medium"}
                            />
                            <Text
                              fontSize={{ base: "12px", md: "18px" }}
                              color={"gray.400"}
                              fontWeight={"semibold"}
                            >
                              Otro
                            </Text>
                          </Flex>
                        )}
                    </Flex>
                  </Center>
                  <Center>
                    <Flex alignItems={"center"} gap={2}>
                      <Text
                        fontSize={{ base: "12px", md: "18px" }}
                        fontWeight={"semibold"}
                      >
                        Cumpleaños:
                      </Text>
                      <Flex alignItems={"center"} gap={1}>
                        <FaBirthdayCake color="pink" />
                        <Text
                          fontSize={{ base: "12px", md: "18px" }}
                          color={"gray.400"}
                          fontWeight={"semibold"}
                        >
                          {formattedBirthdate}
                        </Text>
                      </Flex>
                    </Flex>
                  </Center>
                  <Center>
                    <Flex alignItems={"center"} gap={2}>
                      <Text
                        fontSize={{ base: "12px", md: "18px" }}
                        fontWeight={"semibold"}
                      >
                        Edad:
                      </Text>
                      <Flex alignItems={"center"} gap={1}>
                        <FaUserClock color="#4A5568" />
                        <Text
                          fontSize={{ base: "12px", md: "18px" }}
                          color={"gray.400"}
                          fontWeight={"semibold"}
                        >
                          {calculateAge(person.birth_date)} años
                        </Text>
                      </Flex>
                    </Flex>
                  </Center>
                </Stack>
              </TabPanel>
              <TabPanel>
                <Heading
                  py={{ base: "1", md: "5" }}
                  textAlign={"center"}
                  size={{ base: "md", md: "lg" }}
                >
                  Información Académica
                </Heading>
                <Divider />
                <Stack py={4}>
                  <Center>
                    <Flex alignItems={"center"} gap={2}>
                      <Text fontSize={{base: "12px", md:"18px"}} fontWeight={"semibold"}>
                        Carrera:
                      </Text>
                      <Flex alignItems={"center"} gap={1}>
                        <RiGraduationCapFill color="#4A5568" />
                        <Text
                          fontSize={{base: "12px", md:"18px"}}
                          color={"gray.400"}
                          fontWeight={"semibold"}
                        >
                          {person.students[0]?.career?.name.replace(
                            "Ingeniería",
                            "Ing."
                          ) || "No especificada"}
                        </Text>
                      </Flex>
                    </Flex>
                  </Center>
                  <Center>
                    <Flex alignItems={"center"} gap={2}>
                      <Text fontSize={{base: "12px", md:"18px"}} fontWeight={"semibold"}>
                        Provincia:
                      </Text>
                      <Flex alignItems={"center"} gap={1}>
                        <FaLocationDot color="#F56565" />
                        <Text
                          fontSize={{base: "12px", md:"18px"}}
                          color={"gray.400"}
                          fontWeight={"semibold"}
                        >
                          {person.students[0]?.city?.state?.name ||
                            "No especificada"}
                        </Text>
                      </Flex>
                    </Flex>
                  </Center>
                  <Center>
                    <Flex alignItems={"center"} gap={2}>
                      <Text fontSize={{base: "12px", md:"18px"}} fontWeight={"semibold"}>
                        Ciudad:
                      </Text>
                      <Flex alignItems={"center"} gap={1}>
                        <BsPinMapFill color="#4A5568" />
                        <Text
                          fontSize={{base: "12px", md:"18px"}}
                          color={"gray.400"}
                          fontWeight={"semibold"}
                        >
                          {person.students[0]?.city?.name || "No especificada"}
                        </Text>
                      </Flex>
                    </Flex>
                  </Center>
                </Stack>
              </TabPanel>
              <TabPanel>
                <Heading
                  py={{ base: "1", md: "5" }}
                  textAlign={"center"}
                  size={{ base: "md", md: "lg" }}
                >
                  Información de Contacto
                </Heading>
                <Divider />
                <Stack py={4}>
                  <Center>
                    <Flex alignItems={"center"} gap={2}>
                      <Text fontSize={{base: "12px", md:"18px"}} fontWeight={"semibold"}>
                        Telefono de contacto:
                      </Text>
                      <Flex alignItems={"center"} gap={1}>
                        <FaPhoneAlt color="#4A5568" />
                        <Text
                          fontSize={{base: "12px", md:"18px"}}
                          color={"gray.400"}
                          fontWeight={"semibold"}
                        >
                          {person.phone || "No especificada"}
                        </Text>
                      </Flex>
                    </Flex>
                  </Center>
                  <Center>
                    <Flex alignItems={"center"} gap={2}>
                      <Text fontSize={{base: "12px", md:"18px"}} fontWeight={"semibold"}>
                        E-mail:
                      </Text>
                      <Flex alignItems={"center"} gap={1}>
                        <MdEmail color="#4A5568" />
                        <Text
                          fontSize={{base: "12px", md:"18px"}}
                          color={"gray.400"}
                          fontWeight={"semibold"}
                        >
                          {userInfo?.email || "-"}
                        </Text>
                      </Flex>
                    </Flex>
                  </Center>
                </Stack>
              </TabPanel>
            </TabPanels>
          </Tabs>
        </Card>
      </Container>
    </Box>
  );
}
