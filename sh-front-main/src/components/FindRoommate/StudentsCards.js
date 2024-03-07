import React from "react";
import { useLocation } from "wouter";
import {
  Heading,
  Avatar,
  Box,
  Center,
  Text,
  Stack,
  Button,
  useColorModeValue,
  Spinner,
} from "@chakra-ui/react";
import { IoMdMale } from "react-icons/io";
import { IoMdFemale } from "react-icons/io";
import { IoMaleFemaleSharp } from "react-icons/io5";
import { FaLocationDot } from "react-icons/fa6";
import { differenceInYears } from "date-fns";

export function StudentsCards({
  filters,
  students,
  parsedSelectedState,
  parsedSelectedCity,
}) {
  const [_, setLocation] = useLocation();

  const redirectToProfile = (id) => {
    setLocation(`/roommate/${id}`);
    localStorage.setItem("idUser", id);
    console.log("id user: ", id);
  };

  const buttonBgColor = useColorModeValue("#151f21", "gray.900");
  const textColor = useColorModeValue("gray.700", "gray.400");
  const cardBgColor = useColorModeValue("white", "gray.900");

  return (
    <Center py={6} flexWrap={"wrap"} gap={"2rem"}>
      {students &&
        students.map(
          (student) =>
            (!filters.gender || student.person.gender === filters.gender) &&
            (!filters.career || student.career.name === filters.career) &&
            (!filters.state || student.city.state.id === parsedSelectedState) &&
            (!filters.city || student.city.id === parsedSelectedCity) &&
            (!filters.ageRange ||
              (differenceInYears(
                new Date(),
                new Date(student.person.birth_date)
              ) >= filters.ageRange[0] &&
                differenceInYears(
                  new Date(),
                  new Date(student.person.birth_date)
                ) <= filters.ageRange[1])) && (
              <Box
                key={student.person.id}
                maxW={"330px"}
                minW={"310px"}
                minH={"455px"}
                w={"full"}
                bg={cardBgColor}
                boxShadow={"2xl"}
                rounded={"lg"}
                p={6}
                textAlign={"center"}
              >
                <Avatar
                  size={"xl"}
                  alt={"Avatar Alt"}
                  mb={4}
                  pos={"relative"}
                />
                <Heading fontSize={"2xl"} fontFamily={"body"}>
                  {`${student.person.firstname} ${student.person.lastname}`}
                </Heading>
                <Text fontWeight={600} color={"gray.500"} mb={4}>
                  {student.career.name}
                </Text>

                <Center>
                  {student.person.gender === "male" && (
                    <IoMdMale
                      color={"#4299E1"}
                      fontSize={"30px"}
                      fontWeight={"medium"}
                    />
                  )}
                  {student.person.gender === "female" && (
                    <IoMdFemale
                      color={"#F56565"}
                      fontSize={"30px"}
                      fontWeight={"medium"}
                    />
                  )}
                  {student.person.gender !== "male" &&
                    student.person.gender !== "female" && (
                      <IoMaleFemaleSharp
                        color={"#ED64A6"}
                        fontSize={"30px"}
                        fontWeight={"medium"}
                      />
                    )}
                </Center>
                <Center>
                  <FaLocationDot
                    color="#E53E3E"
                    fontSize={"18px"}
                    background="#F56565"
                  />
                  <Text>{student.city.state.name}</Text>
                </Center>
                <Center>
                  <Text>{student.city.name}</Text>
                </Center>
                <Text textAlign={"center"} my={4} color={textColor}>
                  {`Edad: ${differenceInYears(
                    new Date(),
                    new Date(student.person.birth_date)
                  )} años`}
                </Text>
                <Stack mt={8} direction={"row"} spacing={4} alignSelf={"end"}>
                  <Button
                    w={"full"}
                    mt={8}
                    bg={buttonBgColor}
                    color={"white"}
                    rounded={"md"}
                    onClick={() => redirectToProfile(student.person.id)}
                    _hover={{
                      transform: "translateY(-2px)",
                      boxShadow: "lg",
                    }}
                  >
                    Mostrar perfil completo
                  </Button>
                </Stack>
              </Box>
            )
        )}
    </Center>
  );
}
