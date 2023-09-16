import Container from "./components/Container";
import NewTicketForm from "./components/NewTicketForm";
import Ticket from "./components/Ticket";
import { Tickets } from "./types";
import { Box, Heading, Stack, Text, useMediaQuery } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useAuth, useSyncContentHeight } from "near-social-bridge";
import * as services from "./services";
import ProgressSpinner from "./components/ProgressSpinner";
import { CalendarIcon } from "@chakra-ui/icons";

function Home() {
  const [tickets, setTickets] = useState<Tickets>([]);
  const [isLargerThan376] = useMediaQuery("(min-width: 376px)");
  const [ready, isReady] = useState(false);
  const auth = useAuth();
  const { syncAgain } = useSyncContentHeight();

  useEffect(() => {
    // Load tickets
    if (auth.user?.accountId) {
      services.setAccount(auth.user.accountId);
      services.getTicketList().then((tickets) => {
        setTickets(tickets);
        isReady(true);
        syncAgain();
      });
    }
  }, [auth.user]);

  useEffect(() => {
    syncAgain();
  }, [tickets]);

  if (!auth.user) {
    return (
      <Container>
        <Box w="100%" display="flex" flexDirection="column" alignItems="center">
          <CalendarIcon boxSize={12} mt={16} color="purple.500" />
          <Text size="xs" mt={4} color="gray.700" maxW="sm" textAlign="center">
            You need to sign in to manage your To-do list
          </Text>
        </Box>
      </Container>
    );
  }

  if (!ready) {
    return <ProgressSpinner />;
  }

  return (
    <Container>
      <Stack
        zIndex={999}
        position="fixed"
        top={0}
        bg="purple.800"
        w="100%"
        mb={4}
        flexDirection={isLargerThan376 ? "row" : "column"}
        justifyContent="space-between"
        alignItems="center"
        p={4}
      >
        <Heading as="h4" size="md" color="gray.50">
          Todo List
        </Heading>
        <Box width="100%" maxW="240px">
          <NewTicketForm
            onCreateTicket={(updatedTickets) => setTickets(updatedTickets)}
          />
        </Box>
      </Stack>

      <Stack
        flexDirection="row"
        flexWrap="wrap"
        justifyContent="center"
        mt={isLargerThan376 ? 100 : 130}
        pb={16}
      >
        {tickets.length === 0 && ready && (
          <Text color="gray.300">No Tickets</Text>
        )}
        {tickets.map((ticket) => (
          <Ticket
            onDeleteTicket={(updatedTickets) => setTickets(updatedTickets)}
            key={ticket.ticketId}
            {...ticket}
          />
        ))}
      </Stack>
    </Container>
  );
}

export default Home;
