import { ModalContext } from "../contexts/ModalProvider";
import { useContext } from "react";

const useModal = () => useContext(ModalContext);
export default useModal;
