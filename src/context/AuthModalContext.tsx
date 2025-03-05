import { createContext } from "react";

const AuthModalContext = createContext<React.RefObject<HTMLDialogElement | null> | null>(null);

export default AuthModalContext;
