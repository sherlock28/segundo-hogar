import React from "react";
import { SimpleGrid } from "@chakra-ui/react";
import { Card } from "./Card";

export function Results({ recomms, redirectToProfile }) {
  return (
    <SimpleGrid columns={[1, 1, 2, 2, 3]} spacing="40px">
      {recomms?.map((recomm) => (
        <Card
          recomm={recomm}
          key={recomm.id_person}
          redirectToProfile={() => redirectToProfile(recomm.id_person)}
        />
      ))}
    </SimpleGrid>
  );
}
