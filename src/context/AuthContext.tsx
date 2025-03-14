import { createContext } from "react";

const AuthContext = createContext<{ uuid: string | null; setUUID: React.Dispatch<React.SetStateAction<string | null>> } | null>(null);

export default AuthContext;
