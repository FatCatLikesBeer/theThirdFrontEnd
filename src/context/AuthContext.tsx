import { createContext } from "react";

const AuthContext = createContext<{ uuid: string | null; setUUID: React.Dispatch<React.SetStateAction<string | null>> }>({
  uuid: null,
  setUUID: () => { }
});

export default AuthContext;
