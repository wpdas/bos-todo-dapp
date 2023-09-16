import { createContext, useCallback, useState } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
} from "@chakra-ui/react";

type ModalContextProps = {
  showModal: (
    title: string,
    description: string,
    onConfirm: () => void
  ) => void;
  hideModal: () => void;
};

const defaultValue: ModalContextProps = {
  showModal: () => {
    throw new Error("showModal must be defined");
  },
  hideModal: () => {
    throw new Error("hideModal must be defined");
  },
};

export const ModalContext = createContext(defaultValue);

const ModalProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [show, setShow] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [onConfirmCb, setOnConfirmCb] = useState({ cb: () => {} });

  const showModal = useCallback(
    (title: string, description: string, onConfirm: () => void) => {
      setTitle(title);
      setDescription(description);
      setOnConfirmCb({ cb: onConfirm });
      setShow(true);
    },
    []
  );

  const hideModal = useCallback(() => {
    setShow(false);
    setTitle("");
    setDescription("");
    setOnConfirmCb({ cb: () => {} });
  }, []);

  return (
    <ModalContext.Provider value={{ showModal, hideModal }}>
      <Modal isOpen={show} onClose={hideModal}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{title}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>{description}</ModalBody>

          <ModalFooter>
            <Button colorScheme="purple" mr={3} onClick={hideModal}>
              No
            </Button>
            <Button
              variant="ghost"
              onClick={() => {
                onConfirmCb.cb();
                hideModal();
              }}
            >
              Yes
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      {children}
    </ModalContext.Provider>
  );
};

export default ModalProvider;
