import { createContext } from "react";

const EditAvatarModalContext = createContext<React.RefObject<HTMLDialogElement | null> | null>(null);

export default EditAvatarModalContext;
