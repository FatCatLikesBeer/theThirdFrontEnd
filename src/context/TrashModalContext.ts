import { createContext } from "react";

const TrashModalContext = createContext<null | React.RefObject<HTMLDialogElement>>(null);

export default TrashModalContext;
