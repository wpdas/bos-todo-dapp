import { Box, Spinner } from "@chakra-ui/react";
import Container from "./Container";

const ProgressSpinner = () => (
  <Container>
    <Box w="100%" display="flex">
      <Spinner
        margin="auto"
        thickness="4px"
        speed="0.65s"
        emptyColor="gray.200"
        color="#00EC97"
        size="xl"
        mt="22%"
      />
    </Box>
  </Container>
);

export default ProgressSpinner;
