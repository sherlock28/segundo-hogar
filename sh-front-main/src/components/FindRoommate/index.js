import React, { useState, useEffect } from "react";
import { Box, Center, Text } from "@chakra-ui/react";
import { Loading } from "components/commons/Loading";
import { FindRoommateForm } from "./FindRoommateForm";
import { FormArea } from "./FormArea";
import { Results } from "./Results";
import { SectionHeader } from "components/commons/SectionHeader";
import { sections } from "config/sections";
import { useAxios } from "hooks/utils/useAxios";
import { useLocation } from "wouter";
import {
  GET_PERSON_ID_BY_USER_EMAIL,
  GET_SHARED_BY_PERSON_ID,
} from "client/gql/queries/users";
import { useQuery, useApolloClient } from "@apollo/client";
import axios from "axios";

export function FindRoommate() {
  const { findRoommate } = sections;
  const [idPerson, setIdPerson] = useState(null);
  const [loading, setLoading] = useState(true);
  const [response, setResponse] = useState(null);
  const [_, setLocation] = useLocation();
  const client = useApolloClient();

  const redirectToProfileById = (id_person) => {
    setLocation(`/roommate/${id_person}`);
    // localStorage.setItem("idUser", id);
    console.log("id user: ", id_person);
  };

  useEffect(() => {
    async function fetchData() {
      const email = localStorage.getItem("userData")
        ? JSON.parse(localStorage.getItem("userData")).email
        : null;
      try {
        const { data } = await client.query({
          query: GET_PERSON_ID_BY_USER_EMAIL,
          variables: { email },
          fetchPolicy: "no-cache",
        });
        setIdPerson(data.sh_users[0].persons_id);
      } catch (error) {
        console.error("Error fetching person ID:", error);
      }
    }
    fetchData();
  }, [client]);

  useEffect(() => {
    async function FetchRecomms() {
      try {
        const { data } = await axios.get(
          `${process.env.REACT_APP_API_URL_RECOMM}/recomendation/${idPerson}`
        );

        let listaRecomendaciones = data;
        console.log("IDs de todas las recomendaciones:");

        const promises = listaRecomendaciones.data.map(
          async (recomendacion) => {
            try {
              const { data } = await client.query({
                query: GET_SHARED_BY_PERSON_ID,
                variables: { id: recomendacion.id_person },
              });

              const sharedValue =
                data.sh_persons[0]?.students[0]?.shared || false;
              console.log(
                `id_person: ${recomendacion.id_person}, shared: ${sharedValue}`
              );

              return { ...recomendacion, shared: sharedValue };
            } catch (error) {
              console.error("Error obteniendo información compartida:", error);
              return { ...recomendacion, shared: false };
            }
          }
        );

        const results = await Promise.all(promises);

        const filteredRecomms = results.filter(
          (recomendacion) => recomendacion.shared
        );

        setResponse({ data: filteredRecomms }); 
        setLoading(false);
      } catch (error) {
        console.error("Error fetching recomms:", error);
      }
    }

    if (idPerson) {
      console.log("Buscando recomendaciones...");
      console.log("ID PERSONA", idPerson);
      FetchRecomms();
    }
  }, [idPerson]);

  return (
    <>
      <FormArea>
        <SectionHeader
          section={findRoommate.section}
          sectionTitle={findRoommate.title}
        />
        <FindRoommateForm />
      </FormArea>
      <Box width={"100%"} my={20}>
        {/* title */}
        <Center>
          <Text fontSize="3xl" fontWeight="bold" color="gray.700">
            Recomendaciones segun tus preferencias
          </Text>
        </Center>
        <Center>
          {" "}
          {loading ? (
            <Loading />
          ) : (
            <Results
              recomms={response?.data}
              redirectToProfile={redirectToProfileById}
            />
          )}
        </Center>
      </Box>
    </>
  );
}
