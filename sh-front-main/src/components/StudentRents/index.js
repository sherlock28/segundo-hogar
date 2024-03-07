import { useState } from "react";
import { useQuery, useMutation } from "@apollo/client";
import {
  Box,
  Heading,
  Table,
  TableContainer,
  Td,
  Text,
  Thead,
  Tr,
  Th,
  Tbody,
  Spinner,
  useToast,
} from "@chakra-ui/react";
import { StarIcon } from "@chakra-ui/icons";
import { useGetUser } from "hooks/pages/Profile/useGetUser";
import { GET_RENTS_BY_STUDENT_ID } from "client/gql/queries/users";
import { REGISTER_RENT_RATING } from "client/gql/mutations/registerRentRating/registerRentRating";
import { GET_AVG_RATING_BY_OWNERSHIPS_ID } from "client/gql/queries/utils";

export function StudentRents() {
  const toast = useToast();
  const { user } = useGetUser();
  const [hoverRating, setHoverRating] = useState(0);
  const [selectedRating, setSelectedRating] = useState(0);
  const studentId = user?.person?.students?.[0]?.id;

  const { loading, error, data } = useQuery(GET_RENTS_BY_STUDENT_ID, {
    variables: { id: studentId },
    fetchPolicy: "no-cache",
  });

  const ownerships_id = data?.sh_rents[0]?.ownerships_id;

  const { data: avgRatingData } = useQuery(GET_AVG_RATING_BY_OWNERSHIPS_ID, {
    variables: { ownerships_id: ownerships_id },
  });

  const avgRating = avgRatingData?.sh_rents_aggregate?.aggregate?.avg?.rating;

  console.log("avr rating:", avgRating);

  console.log("data from rents: ", data);
  console.log("ownership id: ", ownerships_id);
  const [registerRentRating] = useMutation(REGISTER_RENT_RATING);

  if (!studentId) {
    return <p>No se ha encontrado información del estudiante.</p>;
  }

  if (loading) return <Spinner />;

  const handleRating = (rating) => {
    registerRentRating({
      variables: {
        rating: rating,
        start_date: data.sh_rents[0].start_date,
        end_date: data.sh_rents[0].end_date,
        ownerships_id: data.sh_rents[0].ownerships_id,
        students_id: studentId,
        created_at: data.sh_rents[0].created_at,
        id: data.sh_rents[0].id,
        updated_at: new Date().toISOString(),
      },
    })
      .then(() => {
        toast({
          title: "Calificación de renta enviada",
          description: "¡Gracias por tu calificación!",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      })
      .catch((error) => {
        console.error("Error al enviar la calificación:", error);
        toast({
          title: "Error!",
          description:
            "Hubo un problema al enviar la calificación. Inténtalo de nuevo más tarde.",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
        console.log(error);
      });
  };

  return (
    <div>
      <Heading as="h1">Mis rentas</Heading>
      <TableContainer mt={8}>
        <Table size="sm">
          <Thead>
            <Tr>
              <Th>ID</Th>
              <Th>Dirección</Th>
              <Th>Calificar</Th>
            </Tr>
          </Thead>
          <Tbody>
            {data?.sh_rents.map((rent, index) => (
              <Tr key={rent.id}>
                <Td color="#718096">{rent.id}</Td>
                <Td color="#718096">{`${rent.ownership.address.address}`}</Td>
                <Td>
                  <Box d="flex" mt="2" alignItems="center">
                    {Array(5)
                      .fill("")
                      .map((_, i) => (
                        <StarIcon
                          key={i}
                          color={
                            i <
                            (hoverRating || selectedRating || avgRating || 0)
                              ? "teal.500"
                              : "gray.300"
                          }
                          onMouseEnter={() => setHoverRating(i + 1)}
                          onMouseLeave={() => setHoverRating(0)}
                          onClick={() => {
                            setSelectedRating(i + 1);
                            handleRating(i + 1);
                          }}
                        />
                      ))}
                    {avgRating === 0 && (
                      <Text
                        color="#718096"
                        py={2}
                        fontSize="15px"
                        fontWeight="500"
                      >
                        Esta propiedad no tiene calificaciones aún
                      </Text>
                    )}
                  </Box>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>
    </div>
  );
}
