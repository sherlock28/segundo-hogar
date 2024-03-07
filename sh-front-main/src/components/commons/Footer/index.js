import React from "react";
import {
  Box,
  Container,
  Stack,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import { Link } from "wouter";
import { FaInstagram, FaYoutube } from "react-icons/fa";
import { FaTwitter } from "react-icons/fa";
import { Logo } from "components/commons/Logo";
import { paths } from "config/paths";

export function Footer() {
  return (
    <Box
      bg={useColorModeValue("gray.50", "gray.900")}
      color={useColorModeValue("gray.700", "gray.200")}
    >
      <Container
        as={Stack}
        maxW={"6xl"}
        py={4}
        spacing={4}
        justify={"center"}
        align={"center"}
      >
        <Logo boxSize="80px" />
        <Stack
          direction={"row"}
          spacing={6}
          flexWrap={"wrap"}
          justifyContent={"center"}
        >
          <Link href={paths.landing}>Inicio</Link>
          <Link href={paths.search}>Buscar mi hogar</Link>
          <Link href={paths.houseRegister}>Publicar mi inmueble</Link>
          <Link href={paths.members}>Sobre nosotros</Link>
          <Link href={paths.contacts}>Contactos</Link>
          <Link href={paths.faq}>FAQ</Link>
        </Stack>
      </Container>

      <Box
        borderTopWidth={1}
        borderStyle={"solid"}
        borderColor={useColorModeValue("gray.200", "gray.700")}
      >
        <Container
          as={Stack}
          maxW={"6xl"}
          py={4}
          direction={{ base: "column", md: "row" }}
          spacing={4}
          justify={{ base: "center", md: "space-between" }}
          align={{ base: "center", md: "center" }}
        >
          <Text textAlign={"center"}>
            © {new Date().getFullYear()} Segundo Hogar. Todos los derechos
            reservados.
          </Text>
          <Stack direction={"row"} spacing={6}>
            <a
              label={"Twitter"}
              href={"https://twitter.com"}
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaTwitter fontSize={"22px"} />
            </a>
            <a
              label={"YouTube"}
              href={"https://youtube.com"}
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaYoutube fontSize={"22px"} />
            </a>
            <a
              label={"Instagram"}
              href={"https://instagram.com"}
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaInstagram fontSize={"22px"} />
            </a>
          </Stack>
        </Container>
      </Box>
    </Box>
  );
}
