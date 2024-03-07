import React, { useState } from "react";
import { Box, Center, Flex, Text } from "@chakra-ui/react";
import { FormArea } from "./FormArea";
import { Results } from "./Results";
import { useInitialPublications } from "hooks/pages/Search/useInitialPublications";
import { Loading } from "components/commons/Loading";
import { MapSearchForm } from "./MapSearchForm";

export function Search() {
  const { publications, isError, isFetching } = useInitialPublications();

  const maxDistance = localStorage.getItem("maxDistance") || 10;

  if (isFetching) return <Loading minH={"60vh"} size={"lg"} m={50} />;
  if (isError) return <div>Error!</div>;

  if (!Array.isArray(publications)) {
    console.error("Error: publications no es un array", publications);
    return <div>Error en la carga de datos</div>;
  }

  console.log("publications: ", publications);

  const markers = publications.map((publication) => {
    return {
      position: {
        lat: publication.ownership.coordinate.lat,
        lng: publication.ownership.coordinate.lon,
      },
      infoMarker: {
        title: publication.title,
        description: publication.description,
        address: publication.ownership.address,
        price: publication.price,
        imageUrls: publication.ownership.ownerships_images.map(
          (image) => image.imageurl
        ),
        rating: publication.ownership.rating,
        id: publication.id,
      },
    };
  });

  function haversineDistance(lat1, lon1, lat2, lon2) {
    const R = 6371;
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;

    return distance;
  }

  console.log("markers: ", markers);

  const referenceLat = -26.81715341828356;
  const referenceLon = -65.19856536761296;

  publications.forEach((publication) => {
    const distance = haversineDistance(
      publication.ownership.coordinate.lat,
      publication.ownership.coordinate.lon,
      referenceLat,
      referenceLon
    );

    console.log(
      `Distancia para la publicación "${publication.title}": ${distance} km`
    );
  });

  const filteredPublications = publications.filter((publication) => {
    const distance = haversineDistance(
      publication.ownership.coordinate.lat,
      publication.ownership.coordinate.lon,
      referenceLat,
      referenceLon
    );
    console.log(
      "Distance for publication: " + publication.title + " is: " + distance
    );
    return distance <= maxDistance;
  });
  console.log("Max Distance: ", maxDistance);
  console.log("filteredPublications: ", filteredPublications);
  const handleRemove = (id) => {
    localStorage.removeItem("maxDistance");
  }
  
  return (
    <>
      <Flex width={"full"} flexDir={{base: "column", md:"row"}}>
        <Box flex="1">
          <FormArea posts={publications} />
        </Box>

        <Box flex="1">
          <MapSearchForm width="100%" height="100%" markers={markers} />
        </Box>
      </Flex>

      <Box width={"100%"} my={20}>
        <Center>
          {filteredPublications?.length > 0 ? (
            <Results posts={filteredPublications} onChange = {handleRemove}/>
          ) : (
            <Text color={"gray"} fontSize={"22px"} fontStyle={"italic"}>
              No se encontraron resultados de búsqueda. Intente nuevamente con
              otras características.
            </Text>
          )}
        </Center>
      </Box>
    </>
  );
}
