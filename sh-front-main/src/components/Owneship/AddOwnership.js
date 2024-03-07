import { SmallAddIcon } from "@chakra-ui/icons";
import { Flex, Box, Text } from "@chakra-ui/react";
import { CustomButton } from "components/commons/CustomButton";
import { paths } from "config/paths";
import useLocation from "wouter/use-location";

export const AddOwnership = () => {
  const [_, setLocation] = useLocation();

  const handleClick = () => {
    setLocation(paths.houseRegister);
  };

  return (
    <Flex
      justifyContent="space-around"
      alignItems="center"
      my="5"
      onClick={handleClick}
    >
      <CustomButton
        width={{ base: "100%", md: "20%" }}
        textButton="Agregar Propiedad"
      ></CustomButton>
    </Flex>
  );
};
