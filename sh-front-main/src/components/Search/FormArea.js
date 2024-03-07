import React, { useState } from "react";
import { Box, Flex } from "@chakra-ui/react";
import { SearchForm } from "./SearchForm";
import { SectionHeader } from "components/commons/SectionHeader";
import { sections } from "config/sections";

export function FormArea({ posts }) {
  const [maxDistance, setMaxDistance] = useState(5);

  const { search } = sections;

  const handleSearch = (filters) => {
    setMaxDistance(filters.maxDistance || 5); 
    console.log("Filters from SearchForm:", filters);
  };

  return (
    <Flex
      flexDir={["column", "column", "row", "row"]}
      minHeight="600px"
      justifyContent="center"
      mx={2}
      borderWidth={1}
      px={2}
      borderRadius={4}
      textAlign="center"
      boxShadow="lg"
    >
      <Box width={["100%", "100%", "80%", "45%"]} pl={8} pt={4}>
        <SectionHeader section={search.section} sectionTitle={search.title} />
        <SearchForm 
         onSearch={handleSearch}
        />
      </Box>
    </Flex>
  );
}
