import { createContext } from "react";

const AuthModalContext = createContext<null | React.RefObject<HTMLDialogElement>>(null);

export default AuthModalContext;
