import {
  Avatar,
  Box,
  Heading,
  Skeleton,
  Button,
  
  Card,
  Divider,
  
  Container,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
} from "@chakra-ui/react";

export function SkeletonLoader() {
  return (
    <Box px={20}>
      <Box
        flexDirection={"row"}
        display={"flex"}
        alignItems={"center"}
        justifyContent={"space-between"}
      >
        <Box
          flexDirection={"row"}
          display={"flex"}
          alignItems={"center"}
          gap={"1rem"}
        >
          <Skeleton width="128px" height="128px" borderRadius={"50%"}/>
          <Skeleton width={"300px"} height={"40px"}/>
        </Box>
        <Skeleton width={"155px"} height={"48px"}/>
      </Box>
      <Divider my={10} />
      <Container my={10}>
        <Card>
          <Skeleton width={"485.5px"} height={"300px"}/>
        </Card>
      </Container>
    </Box>
  );
}
