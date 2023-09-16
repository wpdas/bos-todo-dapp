import { useCallback, useEffect, useState } from "react";
import {
  Box,
  Button,
  Checkbox,
  Divider,
  Heading,
  IconButton,
  Stack,
  Text,
  useMediaQuery,
} from "@chakra-ui/react";
import { Task, Tasks, Tickets } from "../types";
import Loading from "./Loading";
import NewTaskForm from "./NewTaskForm";
import { DeleteIcon } from "@chakra-ui/icons";
import useModal from "../hooks/useModal";
// import useServices from "../hooks/useServices";
import * as services from "../services";
import { useSyncContentHeight } from "near-social-bridge";
// import { useAuth } from "near-social-bridge";

type Props = {
  ticketId: number;
  name: string;
  onDeleteTicket: (updatedTickets: Tickets) => void;
};

const Ticket: React.FC<Props> = ({ ticketId, name, onDeleteTicket }) => {
  const [status, setStatus] = useState<"ready" | "pending">("pending");
  const [tasks, setTasks] = useState<Tasks>([]);
  // console.log("TAKSSSSSS", tasks);
  const [isLargerThan560] = useMediaQuery("(min-width: 560px)");
  const { showModal } = useModal();
  const { syncAgain } = useSyncContentHeight();
  // const auth = useAuth();
  // const { getTasks } = services(auth.user?.accountId);
  // const services = useServices(auth.user?.accountId);

  useEffect(() => {
    // console.log("BBBBB");
    // setTimeout(() => {
    services.getTasks({ ticketId }).then((tasks) => {
      // console.log("LOAD TASKS", tasks);
      setTasks(tasks || []);
      setStatus("ready");
    });
    // }, 100);
  }, [ticketId]);

  useEffect(() => {
    syncAgain();
  }, [tasks]);

  const switchTaskComplete = useCallback(
    async (task: Task) => {
      // Save changes (not using await as this can be done in the background)
      services.editTask({
        ticketId,
        taskId: task.id,
        finished: !task.finished,
      });

      // Update on client side
      const updatedTasks = tasks.map((taskItem) => {
        if (taskItem.id === task.id) {
          taskItem.finished = !task.finished;
        }
        return taskItem;
      });
      setTasks(updatedTasks);
    },
    [ticketId, tasks]
  );

  const onDeleteClick = useCallback(async () => {
    showModal("Are you sure?", "Do you really want to delete it?", async () => {
      setStatus("pending");
      const updatedTickets = await services.deleteTicket({ ticketId });
      onDeleteTicket(updatedTickets);
    });
  }, [onDeleteTicket, ticketId]);

  const onRemoveTaskClick = useCallback(
    async (task: Task) => {
      showModal("Are you sure?", "Do you really want to delete it?", () => {
        // Save changes (not using await as this can be done in the background)
        services.deleteTask({ ticketId, taskId: task.id });

        // Update on client side
        const updatedTasks = tasks.filter(
          (taskItem) => taskItem.id !== task.id
        );
        setTasks(updatedTasks);
      });
    },
    [ticketId, tasks]
  );

  return (
    <Stack
      border="1px solid"
      borderColor="#00ce82"
      borderRadius={8}
      minW={isLargerThan560 ? "300px" : "100%"}
      minH="300px"
      maxW="500px"
    >
      <Box
        display="flex"
        justifyContent="space-between"
        bg="#00ce82"
        p={2}
        borderTopRadius={8}
      >
        <Heading as="h4" size="md" color="green.800">
          {name}
        </Heading>
        <Button colorScheme="green" size="xs" onClick={onDeleteClick}>
          Delete
        </Button>
      </Box>
      <Box p={2}>
        <NewTaskForm
          ticketId={ticketId}
          onCreateTask={(tasks) => setTasks(tasks)}
        />
      </Box>
      <Divider />
      <Stack justifyContent="center" flexDirection="row">
        {tasks.length === 0 && status === "ready" && (
          <Text color="gray.300">No Tasks</Text>
        )}
      </Stack>
      <Stack p={4}>
        {status !== "ready" ? (
          <Loading />
        ) : (
          <Stack spacing={5} direction="column">
            {tasks.map((task) => (
              <Box key={task.id} display="flex" justifyContent="space-between">
                <Checkbox
                  opacity={task.finished ? 0.4 : 1}
                  textDecoration={task.finished ? "line-through" : "none"}
                  colorScheme="green"
                  checked={task.finished}
                  defaultChecked={task.finished}
                  onChange={() => switchTaskComplete(task)}
                >
                  {task.description}
                </Checkbox>
                <IconButton
                  ml={4}
                  size="xs"
                  colorScheme="green"
                  aria-label="Delete task"
                  icon={<DeleteIcon />}
                  onClick={() => onRemoveTaskClick(task)}
                />
              </Box>
            ))}
          </Stack>
        )}
      </Stack>
    </Stack>
  );
};

export default Ticket;
