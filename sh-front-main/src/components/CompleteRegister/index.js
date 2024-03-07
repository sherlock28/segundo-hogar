import { Box, Flex, FormControl } from "@chakra-ui/react";
import { useState } from "react";
import { CompleteRegisterForm } from "./CompleteRegisterForm";
import { StepperProfile } from "components/commons/Stepper/Stepper";

export const CompleteProfileForm = () => {
  return (
    <>
      <StepperProfile />
      <Flex width="full" align="center" my={8} justifyContent="center">
        <Box
          borderWidth={1}
          px={4}
          width="full"
          maxWidth="900px"
          borderRadius={4}
          textAlign="center"
          boxShadow="lg"
        >
          <FormControl
            display="flex"
            alignItems="center"
            justifyContent="center"
            mt={4}
          ></FormControl>
          <Box p={4}>
            <CompleteRegisterForm />
          </Box>
        </Box>
      </Flex>
    </>
  );
};
