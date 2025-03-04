import { createContext } from "react";

import type { ToastHandle } from "../components/Toast";

const ToastContext = createContext<React.RefObject<ToastHandle | null> | null>(null);

export default ToastContext;
