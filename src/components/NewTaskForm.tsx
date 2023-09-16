import { useCallback, useState } from "react";
import {
  Box,
  Button,
  Input,
  InputGroup,
  InputRightElement,
} from "@chakra-ui/react";
import { Tasks } from "../types";
import Loading from "./Loading";
// import useServices from "../hooks/useServices";
import * as services from "../services";

type Props = {
  ticketId: number;
  onCreateTask: (tasks: Tasks) => void;
};

const NewTaskForm: React.FC<Props> = ({ ticketId, onCreateTask }) => {
  const [taskDescription, setTaskDescription] = useState("");
  const [status, setStatus] = useState<"pending" | "ready">("ready");
  // const services = useServices();

  const onInputChange = (greetingValue: string) => {
    setTaskDescription(greetingValue);
  };

  const onBtnClick = useCallback(async () => {
    setStatus("pending");
    const updatedTasks = await services.createTask({
      ticketId,
      description: taskDescription,
    });
    setStatus("ready");
    onCreateTask(updatedTasks);
    setTaskDescription("");
  }, [ticketId, taskDescription, onCreateTask]);

  const disabled = taskDescription.length < 3;

  return (
    <Box>
      {status === "pending" ? (
        <Loading />
      ) : (
        <InputGroup size="md">
          <Input
            pr="4.5rem"
            type="text"
            placeholder="New Task"
            onChange={(e) => onInputChange(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                onBtnClick();
              }
            }}
          />
          <InputRightElement width="4.5rem">
            <Button
              opacity={disabled ? 0.4 : 1}
              cursor={disabled ? "not-allowed" : "pointer"}
              colorScheme="purple"
              h="1.75rem"
              size="sm"
              onClick={disabled ? undefined : onBtnClick}
            >
              Add
            </Button>
          </InputRightElement>
        </InputGroup>
      )}
    </Box>
  );
};

export default NewTaskForm;
