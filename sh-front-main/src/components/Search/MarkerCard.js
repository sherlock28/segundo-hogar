import { Link } from "wouter";
import { Box, Heading, Text, Image } from '@chakra-ui/react';
import { StarIcon } from "@chakra-ui/icons";
export const MarkerCard = ({ marker }) => {
  return (
    <Link href={`/publicaciones/detalle/${marker.infoMarker.id}`}>
      <Box
        maxW="sm"
        borderWidth="1px"
        borderRadius="lg"
        overflow="hidden"
        _hover={{
          bg: "gray.100", 
          cursor: "pointer", 
        }}
      >
        <Image
          src={marker.infoMarker.imageUrls[0]}
          alt="Imagen del marcador"
          borderRadius="lg"
          objectFit="cover"
          width="100%"
          height="200px"
        />

        <Box p="6">
          <Heading as="h3" size="md" mb="1" mt="-2">
            {marker.infoMarker.title}
          </Heading>
          {/* rating */}
          { Array(5)
            .fill("")
            .map((_, i) => (
              <StarIcon
                  key={i}
                  color={i < marker.infoMarker.rating ? "blue.400" : "gray.300"}
              />
            ))}
          {/* description with max */}
          <Text fontSize="md" color="gray.500" mt="5">
          {marker.infoMarker.description.length > 50
            ? `${marker.infoMarker.description.substring(0, 50)}...`
            : marker.infoMarker.description}
          </Text>
          {/* price */}
          <Text fontSize="md" color="gray.500" fontWeight={"bold"} mt="2">
            Precio: {marker.infoMarker.price}
          </Text>
          
        </Box>
      </Box>
    </Link>
  );
};

